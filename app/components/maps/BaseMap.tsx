"use client";

import { memo, useCallback, useMemo, useState } from "react";
import type { Geometry, Position } from "geojson";
import type {
  BaseMapWithThemeProps,
  ProjectionBounds,
  RegionProperties,
} from "./types";

const DEFAULT_THEME = {
  backgroundColor: "#f8fafc",
  defaultFill: "#e2e8f0",
  strokeColor: "#cbd5e1",
  strokeWidth: 1,
  hoverFill: "#94a3b8",
  selectedFill: "#3b82f6",
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: 10,
  labelColor: "#1e293b",
};

const DEFAULT_COLOR_SCALE = [
  "#f0f9ff",
  "#bae6fd",
  "#7dd3fc",
  "#38bdf8",
  "#0ea5e9",
  "#0284c7",
];

function toFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getFeatureId(feature: GeoJSON.Feature): string {
  const properties = (feature.properties ?? {}) as RegionProperties;
  return String(feature.id ?? properties.id ?? "");
}

function getFeatureName(feature: GeoJSON.Feature): string {
  const properties = (feature.properties ?? {}) as RegionProperties;
  return String(properties.name ?? getFeatureId(feature));
}

function iterateCoordinates(geometry: Geometry, cb: (lng: number, lat: number) => void) {
  const walk = (coords: unknown) => {
    if (!Array.isArray(coords)) return;

    if (
      coords.length >= 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      cb(coords[0], coords[1]);
      return;
    }

    for (const item of coords) walk(item);
  };

  if (geometry.type === "GeometryCollection") {
    for (const geom of geometry.geometries) {
      iterateCoordinates(geom, cb);
    }
  } else {
    walk((geometry as any).coordinates);
  }
}

function getBoundsFromFeatures(features: GeoJSON.Feature[]): ProjectionBounds | null {
  let minLon = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;

  for (const feature of features) {
    if (!feature.geometry) continue;

    iterateCoordinates(feature.geometry, (lng, lat) => {
      minLon = Math.min(minLon, lng);
      maxLon = Math.max(maxLon, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    });
  }

  if (
    !Number.isFinite(minLon) ||
    !Number.isFinite(maxLon) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLat)
  ) {
    return null;
  }

  return { minLon, maxLon, minLat, maxLat };
}

function project(
  lon: number,
  lat: number,
  width: number,
  height: number,
  bounds: ProjectionBounds,
): [number, number] {
  const lonSpan = Math.max(bounds.maxLon - bounds.minLon, 0.000001);
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.000001);
  const x = ((lon - bounds.minLon) / lonSpan) * width;
  const y = height - ((lat - bounds.minLat) / latSpan) * height;
  return [x, y];
}

function ringToPath(
  ring: Position[],
  width: number,
  height: number,
  bounds: ProjectionBounds,
): string {
  return (
    ring
      .map((coord, index) => {
        const [x, y] = project(coord[0], coord[1], width, height, bounds);
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

function geometryToPath(
  geometry: Geometry,
  width: number,
  height: number,
  bounds: ProjectionBounds,
): string {
  if (geometry.type === "Polygon") {
    return geometry.coordinates
      .map((ring) => ringToPath(ring, width, height, bounds))
      .join(" ");
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .flatMap((polygon) =>
        polygon.map((ring) => ringToPath(ring, width, height, bounds)),
      )
      .join(" ");
  }

  if (geometry.type === "GeometryCollection") {
    return geometry.geometries
      .map((geom) => geometryToPath(geom, width, height, bounds))
      .join(" ");
  }

  return "";
}

function getCentroid(geometry: Geometry): [number, number] | null {
  let totalLng = 0;
  let totalLat = 0;
  let count = 0;

  iterateCoordinates(geometry, (lng, lat) => {
    totalLng += lng;
    totalLat += lat;
    count += 1;
  });

  if (count === 0) return null;
  return [totalLng / count, totalLat / count];
}

function defaultColor(
  value: number,
  min: number,
  max: number,
  colorScale: string[],
): string {
  if (!Number.isFinite(value)) return colorScale[0];
  if (min === max) return colorScale[Math.floor(colorScale.length / 2)];

  const ratio = (value - min) / (max - min);
  const index = Math.min(
    Math.max(Math.floor(ratio * colorScale.length), 0),
    colorScale.length - 1,
  );

  return colorScale[index];
}

function BaseMapComponent({
  data,
  width = 600,
  height = 500,
  choroplethData,
  getColor,
  colorScale = DEFAULT_COLOR_SCALE,
  enableHover = true,
  enableSelection = true,
  selectedRegionId,
  onRegionClick,
  onRegionHover,
  showTooltips = true,
  showLabels = false,
  projectionBounds,
  className,
  containerStyle,
  ariaLabel = "GeoJSON map",
  theme,
}: BaseMapWithThemeProps) {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [internalSelectedRegionId, setInternalSelectedRegionId] = useState<string | null>(null);

  const mergedTheme = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme]);

  const featureList = useMemo(
    () => data.features.filter((feature) => Boolean(feature.geometry)) as GeoJSON.Feature[],
    [data],
  );

  const normalizedChoropleth = useMemo(() => {
    if (!choroplethData) return {} as Record<string, number>;

    return Object.entries(choroplethData).reduce<Record<string, number>>((acc, [id, value]) => {
      acc[id.toLowerCase()] = value;
      return acc;
    }, {});
  }, [choroplethData]);

  const [minValue, maxValue] = useMemo(() => {
    const values = Object.values(normalizedChoropleth).filter((value) => Number.isFinite(value));
    if (!values.length) return [0, 0] as const;
    return [Math.min(...values), Math.max(...values)] as const;
  }, [normalizedChoropleth]);

  const resolvedWidth = toFiniteNumber(typeof width === "number" ? width : undefined, 600);
  const resolvedHeight = toFiniteNumber(typeof height === "number" ? height : undefined, 500);

  const resolvedBounds = useMemo(
    () => projectionBounds ?? getBoundsFromFeatures(featureList),
    [projectionBounds, featureList],
  );

  const effectiveSelectedId = (selectedRegionId ?? internalSelectedRegionId ?? "").toLowerCase();

  const getFill = useCallback(
    (regionId: string) => {
      const normalizedId = regionId.toLowerCase();

      if (effectiveSelectedId && effectiveSelectedId === normalizedId) {
        return mergedTheme.selectedFill;
      }

      if (hoveredRegionId?.toLowerCase() === normalizedId) {
        return mergedTheme.hoverFill;
      }

      const value = normalizedChoropleth[normalizedId];
      if (typeof value === "number") {
        return getColor
          ? getColor(value, minValue, maxValue)
          : defaultColor(value, minValue, maxValue, colorScale);
      }

      return mergedTheme.defaultFill;
    },
    [
      colorScale,
      effectiveSelectedId,
      getColor,
      hoveredRegionId,
      maxValue,
      mergedTheme.defaultFill,
      mergedTheme.hoverFill,
      mergedTheme.selectedFill,
      minValue,
      normalizedChoropleth,
    ],
  );

  if (!featureList.length || !resolvedBounds) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          display: "grid",
          placeItems: "center",
          background: mergedTheme.backgroundColor,
          color: "#64748b",
          ...containerStyle,
        }}
      >
        <p className="text-sm">No map data available</p>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ width, height, background: mergedTheme.backgroundColor, ...containerStyle }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`}
        role="img"
        aria-label={ariaLabel}
      >
        <g>
          {featureList.map((feature) => {
            const regionId = getFeatureId(feature);
            const regionName = getFeatureName(feature);
            const properties = (feature.properties ?? {}) as RegionProperties;
            const path = geometryToPath(feature.geometry as Geometry, resolvedWidth, resolvedHeight, resolvedBounds);
            const isSelected = effectiveSelectedId === regionId.toLowerCase();

            return (
              <path
                key={regionId}
                d={path}
                fill={getFill(regionId)}
                stroke={mergedTheme.strokeColor}
                strokeWidth={isSelected ? mergedTheme.strokeWidth * 2 : mergedTheme.strokeWidth}
                style={{
                  cursor: "pointer",
                  transition: "fill 0.15s, stroke-width 0.15s",
                }}
                onMouseEnter={() => {
                  if (enableHover) {
                    setHoveredRegionId(regionId);
                    onRegionHover?.(regionId, properties);
                  }
                }}
                onMouseLeave={() => {
                  if (enableHover) {
                    setHoveredRegionId(null);
                  }
                }}
                onClick={() => {
                  if (enableSelection && !selectedRegionId) {
                    setInternalSelectedRegionId((prev) =>
                      prev?.toLowerCase() === regionId.toLowerCase() ? null : regionId,
                    );
                  }
                  onRegionClick?.(regionId, properties);
                }}
              >
                {showTooltips ? <title>{regionName}</title> : null}
              </path>
            );
          })}
        </g>

        {showLabels ? (
          <g style={{ pointerEvents: "none" }}>
            {featureList.map((feature) => {
              const centroid = getCentroid(feature.geometry as Geometry);
              if (!centroid) return null;

              const [x, y] = project(
                centroid[0],
                centroid[1],
                resolvedWidth,
                resolvedHeight,
                resolvedBounds,
              );

              return (
                <text
                  key={`label-${getFeatureId(feature)}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={mergedTheme.fontSize}
                  fontFamily={mergedTheme.fontFamily}
                  fill={mergedTheme.labelColor}
                >
                  {getFeatureName(feature)}
                </text>
              );
            })}
          </g>
        ) : null}
      </svg>
    </div>
  );
}

export const BaseMap = memo(BaseMapComponent);
export default BaseMap;
