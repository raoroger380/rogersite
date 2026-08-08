"use client";

import { useEffect, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";

const VIEW_W = 1200;
const VIEW_H = 720;

const VISITED_PLACES = [
  { name: "佛山", lon: 113.1219, lat: 23.0218 },
  { name: "广州", lon: 113.2644, lat: 23.1291 },
  { name: "深圳", lon: 114.0579, lat: 22.5431 },
  { name: "香港", lon: 114.1694, lat: 22.3193 },
  { name: "北京", lon: 116.4074, lat: 39.9042 },
  { name: "梅州", lon: 116.1225, lat: 24.2886 },
];

const DETAIL_SCALE = 2.1;
const CITY_LABEL_SCALE = 3.2;
const MIN_SCALE = 1;
const MAX_SCALE = 16;
const ZOOM_STEP = 1;

type PanState = { x: number; y: number };
type MapShape = { key: string; name: string; d: string };
type MapLabel = { key: string; name: string; x: number; y: number };
type DetailShape = MapShape & {
  point: [number, number] | null;
  visited: boolean;
};
type DetailLabel = MapLabel & { visited: boolean };
type MapGeometry = {
  provinceShapes: MapShape[];
  provinceLabels: MapLabel[];
  detailShapes: DetailShape[];
  detailLabels: DetailLabel[];
  markers: Array<{
    name: string;
    lon: number;
    lat: number;
    x: number;
    y: number;
  }>;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveCjsDefault<T>(moduleValue: unknown) {
  return (
    (moduleValue as { default?: T }).default ??
    (moduleValue as T)
  );
}

function isVisitedCityName(name: string) {
  const cleanName = name.replace(/(市|县|区|省|特别行政区)$/g, "");
  return VISITED_PLACES.some(
    (place) => cleanName === place.name || name.includes(place.name),
  );
}

function buildMapGeometry(
  chinaData: ChinaGeoCollection,
  provinceCollections: ChinaGeoCollection[],
): MapGeometry {
  const projection = geoMercator().fitExtent(
    [[12, 12], [VIEW_W - 12, VIEW_H - 12]],
    chinaData as unknown as GeoPermissibleObjects,
  );
  const path = geoPath(projection);
  const projectPoint = (lon: number, lat: number) => projection([lon, lat]);

  const provinceShapes = chinaData.features.map((feature, index) => ({
    key: `province-${feature.id ?? index}`,
    name: feature.properties.name,
    d: path(feature as unknown as GeoPermissibleObjects) ?? "",
  }));

  const provinceLabels = chinaData.features.map((feature, index) => {
    const point = path.centroid(
      feature as unknown as GeoPermissibleObjects,
    );
    return {
      key: `province-label-${feature.id ?? index}`,
      name: feature.properties.name,
      x: point?.[0] ?? 0,
      y: point?.[1] ?? 0,
    };
  });

  const detailFeatures = provinceCollections.flatMap(
    (collection) => collection.features,
  );

  const detailShapes = detailFeatures.map((feature, index) => {
    const point = feature.properties.cp
      ? projectPoint(feature.properties.cp[0], feature.properties.cp[1])
      : null;
    return {
      key: `detail-${feature.id ?? index}`,
      name: feature.properties.name,
      d: path(feature as unknown as GeoPermissibleObjects) ?? "",
      point,
      visited: isVisitedCityName(feature.properties.name),
    };
  });

  const detailLabels = detailShapes
    .filter((shape) => shape.point)
    .map((shape) => ({
      key: `detail-label-${shape.key}`,
      name: shape.name,
      x: shape.point![0],
      y: shape.point![1],
      visited: shape.visited,
    }));

  const markers: MapGeometry["markers"] = VISITED_PLACES.map((place) => {
    const point = projectPoint(place.lon, place.lat);
    return {
      ...place,
      x: point?.[0] ?? 0,
      y: point?.[1] ?? 0,
    };
  });

  return {
    provinceShapes,
    provinceLabels,
    detailShapes,
    detailLabels,
    markers,
  };
}

export default function Footprints() {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<PanState>({ x: 0, y: 0 });
  const [mapGeometry, setMapGeometry] = useState<MapGeometry | null>(null);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);
  const zoomed = scale > 1.001;
  const detailed = scale >= DETAIL_SCALE;
  const cityLabelsVisible = scale >= CITY_LABEL_SCALE;
  const progress = ((scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const panRef = useRef<HTMLDivElement | null>(null);
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const isPanning = useRef(false);
  const isSliderDragging = useRef(false);
  const panStart = useRef<{
    x: number;
    y: number;
    pan: PanState;
    bounds: PanState;
  } | null>(null);
  const zoomedRef = useRef(zoomed);
  const scaleRef = useRef(scale);

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      try {
        const [chinaModule, provinceModule] = await Promise.all([
          import("china-map-geojson/lib/china"),
          import("china-map-geojson/lib/province"),
        ]);
        const chinaData = resolveCjsDefault<ChinaGeoCollection>(chinaModule);
        const provinceCollections = Object.values(
          resolveCjsDefault<Record<string, ChinaGeoCollection>>(provinceModule),
        );
        const nextGeometry = buildMapGeometry(
          chinaData,
          provinceCollections,
        );
        if (!cancelled) setMapGeometry(nextGeometry);
      } catch {
        if (!cancelled) setMapLoadFailed(true);
      }
    };

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    zoomedRef.current = zoomed;
  }, [zoomed]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    const el = panRef.current;
    if (!el) return;

    const blockPageNav = (event: Event) => {
      if (zoomedRef.current) event.stopPropagation();
    };
    const blockTouchMove = (event: TouchEvent) => {
      if (zoomedRef.current) {
        event.stopPropagation();
        event.preventDefault();
      }
    };
    const handleWheel = (event: WheelEvent) => {
      if (!zoomedRef.current) return;

      event.preventDefault();
      event.stopPropagation();

      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const bounds = {
        x: Math.max(0, (rect.width * (scaleRef.current - 1)) / 2),
        y: Math.max(0, (rect.height * (scaleRef.current - 1)) / 2),
      };

      setPan((current) => ({
        x: clamp(current.x - event.deltaX, -bounds.x, bounds.x),
        y: clamp(current.y - event.deltaY, -bounds.y, bounds.y),
      }));
    };

    el.addEventListener("touchstart", blockPageNav, { passive: true });
    el.addEventListener("touchmove", blockTouchMove, { passive: false });
    el.addEventListener("touchend", blockPageNav, { passive: true });
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", blockPageNav);
      el.removeEventListener("touchmove", blockTouchMove);
      el.removeEventListener("touchend", blockPageNav);
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const el = sliderTrackRef.current;
    if (!el) return;

    const stopNav = (event: Event) => {
      event.stopPropagation();
    };
    const stopTouchMove = (event: TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();
    };

    el.addEventListener("touchstart", stopNav, { passive: true });
    el.addEventListener("touchmove", stopTouchMove, { passive: false });
    el.addEventListener("touchend", stopNav, { passive: true });

    return () => {
      el.removeEventListener("touchstart", stopNav);
      el.removeEventListener("touchmove", stopTouchMove);
      el.removeEventListener("touchend", stopNav);
    };
  }, []);

  const getBounds = () => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.max(0, (rect.width * (scaleRef.current - 1)) / 2),
      y: Math.max(0, (rect.height * (scaleRef.current - 1)) / 2),
    };
  };

  const applyScale = (nextScale: number) => {
    const next = clamp(nextScale, MIN_SCALE, MAX_SCALE);

    scaleRef.current = next;
    setScale(next);
    setPan((current) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };

      const bounds = {
        x: Math.max(0, (rect.width * (next - 1)) / 2),
        y: Math.max(0, (rect.height * (next - 1)) / 2),
      };

      return {
        x: clamp(current.x, -bounds.x, bounds.x),
        y: clamp(current.y, -bounds.y, bounds.y),
      };
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomedRef.current) return;

    isPanning.current = true;
    panStart.current = {
      x: event.clientX,
      y: event.clientY,
      pan,
      bounds: getBounds(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning.current || !panStart.current) return;

    const { x, y, pan: startPan, bounds } = panStart.current;
    setPan({
      x: clamp(startPan.x + event.clientX - x, -bounds.x, bounds.x),
      y: clamp(startPan.y + event.clientY - y, -bounds.y, bounds.y),
    });
  };

  const handlePointerEnd = () => {
    isPanning.current = false;
    panStart.current = null;
  };

  const handleSliderPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    isSliderDragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);

    const rect = sliderTrackRef.current?.getBoundingClientRect();
    if (!rect || rect.height <= 0) return;

    const ratio = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
    applyScale(MIN_SCALE + ratio * (MAX_SCALE - MIN_SCALE));
  };

  const handleSliderPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isSliderDragging.current) return;

    const rect = sliderTrackRef.current?.getBoundingClientRect();
    if (!rect || rect.height <= 0) return;

    const ratio = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
    applyScale(MIN_SCALE + ratio * (MAX_SCALE - MIN_SCALE));
  };

  const handleSliderPointerEnd = () => {
    isSliderDragging.current = false;
  };

  if (!mapGeometry) {
    return (
      <section id="footprints" className="footprints-section relative z-10">
        <div className="section-container footprints-container">
          <div className="section-header footprints-header">
            <p className="overline">我的足迹</p>
            <h3>
              点亮走过的<span className="gradient-text">地方</span>
            </h3>
            <p>用光点亮我真正去过的城市。</p>
          </div>

          <div className="china-map-stage">
            <div
              className="china-map-loading-card"
              role="status"
              aria-live="polite"
            >
              {mapLoadFailed
                ? "地图加载失败，请刷新页面重试"
                : "正在加载全国地图..."}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="footprints" className="footprints-section relative z-10">
      <div className="section-container footprints-container">
        <div className="section-header footprints-header">
          <p className="overline">我的足迹</p>
          <h3>
            点亮走过的<span className="gradient-text">地方</span>
          </h3>
          <p>用光点亮我真正去过的城市。</p>
        </div>

        <div className="lit-cities-row" aria-label="已点亮城市">
          <span className="lit-cities-label">已点亮城市</span>
          <span className="lit-cities-values">
            佛山 · 广州 · 深圳 · 香港 · 北京 · 梅州
          </span>
        </div>

        <div className="china-map-stage">
          <div ref={wrapRef} className="china-map-zoom-wrap">
            <div
              ref={panRef}
              className={`china-map-pan ${zoomed ? "is-zoomed" : ""} ${
                detailed ? "is-detailed" : ""
              }`}
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                preserveAspectRatio="xMidYMid meet"
                className="china-map-svg"
                role="img"
                aria-label="我去过的地方"
              >
                <g className="china-province-shapes">
                  {mapGeometry.provinceShapes.map((shape) => (
                    <path
                      key={shape.key}
                      d={shape.d}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>

                <g
                  className={`china-detail-shapes ${
                    detailed ? "is-visible" : ""
                  }`}
                >
                  {mapGeometry.detailShapes.map((shape) => (
                    <path
                      key={shape.key}
                      d={shape.d}
                      className={
                        shape.visited
                          ? "china-detail-path visited"
                          : "china-detail-path"
                      }
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>

                <g className="china-province-labels">
                  {mapGeometry.provinceLabels.map((label) => (
                    <text
                      key={label.key}
                      x={label.x}
                      y={label.y}
                      className="china-province-label"
                      style={{ fontSize: `${9 / scale}px` }}
                    >
                      {label.name}
                    </text>
                  ))}
                </g>

                {detailed && cityLabelsVisible && (
                  <g className="china-detail-labels">
                    {mapGeometry.detailLabels.map((label) => (
                      <text
                        key={label.key}
                        x={label.x}
                        y={label.y}
                        className={`china-detail-label ${
                          label.visited ? "visited" : ""
                        }`}
                        style={{ fontSize: `${9 / scale}px` }}
                      >
                        {label.name}
                      </text>
                    ))}
                  </g>
                )}

                <g className="china-map-markers">
                  {mapGeometry.markers.map((place) => (
                    <g
                      key={place.name}
                      transform={`translate(${place.x} ${place.y})`}
                      className="china-map-marker"
                    >
                      <circle
                        className="china-city-halo"
                        r={9 / scale}
                        strokeWidth={1.2 / scale}
                      />
                      <circle
                        className="china-city-core"
                        r={4 / scale}
                        strokeWidth={1 / scale}
                      />
                      {!detailed && (
                        <text
                          className="china-city-label"
                          y={-14 / scale}
                          textAnchor="middle"
                          style={{ fontSize: `${11 / scale}px` }}
                        >
                          {place.name}
                        </text>
                      )}
                    </g>
                  ))}
                </g>
              </svg>
            </div>

            <div className="china-map-zoom-controls" aria-label="地图缩放">
              <button
                type="button"
                className="china-map-zoom-btn"
                onClick={() => applyScale(scale + ZOOM_STEP)}
                disabled={scale >= MAX_SCALE}
                aria-label="放大地图"
                title="放大地图"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>

              <div
                ref={sliderTrackRef}
                className="china-map-zoom-slider"
                role="slider"
                aria-label="缩放级别"
                aria-valuemin={MIN_SCALE}
                aria-valuemax={MAX_SCALE}
                aria-valuenow={Math.round(scale * 100) / 100}
                aria-valuetext={`${Math.round(scale * 100)}%`}
                onPointerDown={handleSliderPointerDown}
                onPointerMove={handleSliderPointerMove}
                onPointerUp={handleSliderPointerEnd}
                onPointerCancel={handleSliderPointerEnd}
              >
                <span className="china-map-zoom-track" />
                <span
                  className="china-map-zoom-fill"
                  style={{ height: `${progress}%` }}
                />
                <span
                  className="china-map-zoom-thumb"
                  style={{ bottom: `calc(${progress}% - var(--map-thumb-half))` }}
                />
              </div>

              <button
                type="button"
                className="china-map-zoom-btn"
                onClick={() => applyScale(scale - ZOOM_STEP)}
                disabled={scale <= MIN_SCALE}
                aria-label="缩小地图"
                title="缩小地图"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
