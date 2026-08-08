type ChinaGeoProperties = {
  id?: string | number;
  name: string;
  cp?: [number, number];
  childNum?: number;
};

type ChinaGeoGeometry =
  | {
      type: "Polygon";
      coordinates: number[][][];
    }
  | {
      type: "MultiPolygon";
      coordinates: number[][][][];
    };

type ChinaGeoFeature = {
  type: "Feature";
  id?: string | number;
  properties: ChinaGeoProperties;
  geometry: ChinaGeoGeometry;
};

type ChinaGeoCollection = {
  type: "FeatureCollection";
  features: ChinaGeoFeature[];
};

declare module "china-map-geojson/lib/china" {
  const data: ChinaGeoCollection;
  export = data;
}

declare module "china-map-geojson/lib/province" {
  const data: Record<string, ChinaGeoCollection>;
  export = data;
}

declare module "china-map-geojson/lib/province/guang_dong_geo" {
  const data: ChinaGeoCollection;
  export = data;
}

declare module "china-map-geojson/lib/province/bei_jing_geo" {
  const data: ChinaGeoCollection;
  export = data;
}

declare module "china-map-geojson/lib/province/xiang_gang_geo" {
  const data: ChinaGeoCollection;
  export = data;
}
