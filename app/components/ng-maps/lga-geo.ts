import { normalizeStateName, slugify } from "./slugs";

/** Properties on `nigeria-lgas.geo.json` (GADM-style export). */
export interface NigeriaLGAFeatureProperties {
  NAME_1: string;
  NAME_2: string;
  ID_0?: string;
  COUNTRY?: string;
  ID_2?: string;
  [key: string]: unknown;
}

export interface NigeriaLGAFeature {
  type: "Feature";
  properties: NigeriaLGAFeatureProperties;
  geometry: GeoJSON.MultiPolygon | GeoJSON.Polygon;
}

export interface NigeriaLGAFeatureCollection {
  type: "FeatureCollection";
  features: NigeriaLGAFeature[];
}

/** Slug for the parent state (must match `stateSlug` on the component). */
export function stateSlugFromLGAProps(props: NigeriaLGAFeatureProperties): string {
  return normalizeStateName(props.NAME_1);
}

/**
 * Key for `lgaColors` / `lgaValues`: slugified LGA name (`NAME_2`),
 * e.g. `"Aba North"` → `"aba-north"`.
 */
export function lgaKeyFromName(lgaName: string): string {
  return slugify(lgaName);
}
