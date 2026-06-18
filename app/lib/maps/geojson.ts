import type { FeatureCollection, Geometry } from "geojson";
import type { LatLngBoundsExpression } from "leaflet";
import type { RegionProperties } from "@/app/components/maps/types";

export function filterByParentId(
  data: FeatureCollection<Geometry, RegionProperties>,
  parentId?: string,
): FeatureCollection<Geometry, RegionProperties> {
  if (!parentId) return data;

  return {
    ...data,
    features: data.features.filter(
      (feature) =>
        String(feature.properties?.parentId ?? "").toLowerCase() ===
        parentId.toLowerCase(),
    ),
  };
}

export function filterByRegionId(
  data: FeatureCollection<Geometry, RegionProperties>,
  regionId?: string,
): FeatureCollection<Geometry, RegionProperties> {
  if (!regionId) return data;

  return {
    ...data,
    features: data.features.filter((feature) => {
      const featureId =
        String(feature.id ?? "") || String(feature.properties?.id ?? "");
      return featureId.toLowerCase() === regionId.toLowerCase();
    }),
  };
}

export function getBoundsFromGeoJSON(
  data?: FeatureCollection<Geometry, RegionProperties> | null,
): LatLngBoundsExpression | null {
  if (!data || !data.features?.length) return null;

  let minLng = Number.POSITIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;

  const updateBounds = (lng: number, lat: number) => {
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  };

  const walkCoordinates = (coords: unknown) => {
    if (!Array.isArray(coords)) return;
    if (
      coords.length >= 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      updateBounds(coords[0], coords[1]);
      return;
    }

    for (const item of coords) {
      walkCoordinates(item);
    }
  };

  const walkGeometry = (geom: Geometry) => {
    if (!geom) return;
    if (geom.type === "GeometryCollection") {
      for (const subGeom of geom.geometries) {
        walkGeometry(subGeom);
      }
    } else {
      walkCoordinates((geom as any).coordinates);
    }
  };

  for (const feature of data.features) {
    if (feature.geometry) {
      walkGeometry(feature.geometry);
    }
  }

  if (
    !Number.isFinite(minLng) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLng) ||
    !Number.isFinite(maxLat)
  ) {
    return null;
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

export function getCenterFromGeoJSON(
  data?: FeatureCollection<Geometry, RegionProperties> | null,
): [number, number] | null {
  const bounds = getBoundsFromGeoJSON(data);
  if (!bounds) return null;
  const [[minLat, minLng], [maxLat, maxLng]] = bounds as [
    [number, number],
    [number, number],
  ];
  return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
}
