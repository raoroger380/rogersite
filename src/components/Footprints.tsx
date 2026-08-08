"use client";

import { useEffect, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";

const VIEW_W = 1200;
const VIEW_H = 720;

const VISITED_PLACES = [
  { name: "广州", lon: 113.2644, lat: 23.1291 },
  { name: "佛山", lon: 113.1219, lat: 23.0218 },
  { name: "深圳", lon: 114.0579, lat: 22.5431 },
  { name: "香港", lon: 114.1694, lat: 22.3193 },
  { name: "重庆", lon: 106.5516, lat: 29.563 },
  { name: "武汉", lon: 114.3896, lat: 30.6628 },
  { name: "长沙", lon: 113.0823, lat: 28.2568 },
  { name: "宜昌", lon: 111.1707, lat: 30.7617 },
  { name: "成都", lon: 103.9526, lat: 30.7617 },
  { name: "咸阳", lon: 108.4131, lat: 34.8706 },
  { name: "珠海", lon: 113.7305, lat: 22.1155 },
  { name: "阿坝藏族羌族自治州", lon: 102.4805, lat: 32.4536 },
  { name: "汕头", lon: 117.1692, lat: 23.3405 },
  { name: "江门", lon: 112.6318, lat: 22.1484 },
  { name: "无锡", lon: 120.3442, lat: 31.5527 },
  { name: "北京", lon: 116.4074, lat: 39.9042 },
  { name: "梅州", lon: 116.1225, lat: 24.2886 },
];

const VISITED_CITY_LABEL = VISITED_PLACES.map((place) => place.name).join(
  " · ",
);

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
  const [loadProgress, setLoadProgress] = useState(6);
  const [cityTooltip, setCityTooltip] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const zoomed = scale > 1.001;
  const detailed = scale >= DETAIL_SCALE;
  const cityLabelsVisible = scale >= CITY_LABEL_SCALE;
  const progress = ((scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100;
  const markerShrink = Math.pow(Math.max(scale, 1), 1.25);

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

  const showCityTooltip = (
    element: SVGGElement,
    name: string,
  ) => {
    const wrapRect = wrapRef.current?.getBoundingClientRect();
    const markerRect = element.getBoundingClientRect();
    if (!wrapRect) return;

    setCityTooltip({
      name,
      x: markerRect.left + markerRect.width / 2 - wrapRect.left,
      y: markerRect.top + markerRect.height / 2 - wrapRect.top,
    });
  };

  useEffect(() => {
    let cancelled = false;
    let finishTimer: number | undefined;
    let progressStep = 6;

    const loadMap = async () => {
      const progressTimer = window.setInterval(() => {
        progressStep = Math.min(
          progressStep + 6 + (progressStep % 7),
          92,
        );
        setLoadProgress(progressStep);
      }, 160);

      try {
        const [chinaModule, provinceModule] = await Promise.all([
          import("china-map-geojson/lib/china"),
          import("china-map-geojson/lib/province"),
        ]);
        setLoadProgress(96);
        const chinaData = resolveCjsDefault<ChinaGeoCollection>(chinaModule);
        const provinceCollections = Object.values(
          resolveCjsDefault<Record<string, ChinaGeoCollection>>(provinceModule),
        );
        const nextGeometry = buildMapGeometry(
          chinaData,
          provinceCollections,
        );
        if (!cancelled) {
          setLoadProgress(100);
          finishTimer = window.setTimeout(() => {
            if (!cancelled) setMapGeometry(nextGeometry);
          }, 180);
        }
      } catch {
        if (!cancelled) setMapLoadFailed(true);
      } finally {
        window.clearInterval(progressTimer);
      }
    };

    loadMap();

    return () => {
      cancelled = true;
      if (finishTimer !== undefined) window.clearTimeout(finishTimer);
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
      event.stopPropagation();
    };
    const blockTouchMove = (event: TouchEvent) => {
      event.stopPropagation();
      if (zoomedRef.current) {
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
    el.addEventListener("touchcancel", blockPageNav, { passive: true });
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", blockPageNav);
      el.removeEventListener("touchmove", blockTouchMove);
      el.removeEventListener("touchend", blockPageNav);
      el.removeEventListener("touchcancel", blockPageNav);
      el.removeEventListener("wheel", handleWheel);
    };
  }, [mapGeometry !== null]);

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
    el.addEventListener("touchcancel", stopNav, { passive: true });

    return () => {
      el.removeEventListener("touchstart", stopNav);
      el.removeEventListener("touchmove", stopTouchMove);
      el.removeEventListener("touchend", stopNav);
      el.removeEventListener("touchcancel", stopNav);
    };
  }, [mapGeometry !== null]);

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
           
          </div>

          <div className="china-map-stage">
            <div
              className="china-map-loading-card"
              role="status"
              aria-live="polite"
            >
              {mapLoadFailed ? (
                <span className="china-map-loading-title">
                  地图加载失败，请刷新页面重试
                </span>
              ) : (
                <>
                  <span className="china-map-loading-title">
                    正在加载全国地图...
                  </span>
                  <div
                    className="china-map-progress"
                    role="progressbar"
                    aria-label="地图加载进度"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(loadProgress)}
                  >
                    <span
                      className="china-map-progress-fill"
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                  <span className="china-map-loading-percent">
                    {Math.round(loadProgress)}%
                  </span>
                </>
              )}
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
         
        </div>

        <div className="lit-cities-row" aria-label="已点亮城市">
          <span className="lit-cities-label">已点亮城市</span>
          <span className="lit-cities-values">{VISITED_CITY_LABEL}</span>
          <span className="map-city-legend" aria-label="城市图例">
            <span className="map-city-legend-item">
              <i className="map-city-legend-dot lit" />
              已点亮
            </span>
            <span className="map-city-legend-item">
              <i className="map-city-legend-dot dim" />
              未点亮
            </span>
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
              onClick={() => setCityTooltip(null)}
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
                        style={{
                          fontSize: `${(label.visited ? 10.5 : 8.5) / scale}px`,
                        }}
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
                      role="button"
                      tabIndex={0}
                      aria-label={`查看${place.name}`}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") {
                          showCityTooltip(event.currentTarget, place.name);
                        }
                      }}
                      onPointerLeave={(event) => {
                        if (event.pointerType === "mouse") {
                          setCityTooltip(null);
                        }
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        showCityTooltip(event.currentTarget, place.name);
                      }}
                      onFocus={(event) =>
                        showCityTooltip(event.currentTarget, place.name)
                      }
                      onBlur={() => setCityTooltip(null)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          showCityTooltip(event.currentTarget, place.name);
                        }
                      }}
                    >
                      <circle
                        className="china-city-hit"
                        r={24 / scale}
                      />
                      <circle
                        className="china-city-core"
                        r={5 / markerShrink}
                        strokeWidth={1 / scale}
                      />
                    </g>
                  ))}
                </g>
              </svg>
            </div>

            {cityTooltip && (
              <div
                className="china-city-tooltip"
                style={{ left: cityTooltip.x, top: cityTooltip.y }}
                role="tooltip"
              >
                {cityTooltip.name}
              </div>
            )}

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
