import { normalizeStateName } from "./slugs";

/** Properties on `nigeria-states.geo.json` in this project. */
export interface NigeriaStateFeatureProperties {
  name: string;
  code: string;
}

export interface NigeriaStateFeature {
  type: "Feature";
  properties: NigeriaStateFeatureProperties;
  geometry: GeoJSON.MultiPolygon | GeoJSON.Polygon;
}

export interface NigeriaStateFeatureCollection {
  type: "FeatureCollection";
  features: NigeriaStateFeature[];
}

export function stateFeatureSlug(props: NigeriaStateFeatureProperties): string {
  return normalizeStateName(props.name);
}
