"use client";

import { useMemo } from "react";
import nigeriaStates from "@/data/geojson/nigeria-states.geojson";
import BaseMap from "./BaseMap";
import type {
  BaseMapTheme,
  BaseMapWithThemeProps,
  RegionFeatureCollection,
  RegionProperties,
} from "./types";

type NigeriaMapProps = Omit<BaseMapWithThemeProps, "data" | "onRegionClick" | "onRegionHover"> & {
  onStateClick?: (stateId: string, properties: RegionProperties) => void;
  onStateHover?: (stateId: string, properties: RegionProperties) => void;
  onRegionClick?: BaseMapWithThemeProps["onRegionClick"];
  onRegionHover?: BaseMapWithThemeProps["onRegionHover"];
  showWorldMap?: boolean;
  theme?: BaseMapTheme;
};

const NIGERIA_PROJECTION_BOUNDS = {
  minLon: 2.5,
  maxLon: 15,
  minLat: 4,
  maxLat: 14,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NigeriaMap({
  onStateClick,
  onStateHover,
  onRegionClick,
  onRegionHover,
  showWorldMap,
  theme,
  containerStyle,
  choroplethData,
  ...rest
}: NigeriaMapProps) {
  const data = nigeriaStates as RegionFeatureCollection;
  const normalizedChoroplethData = useMemo(() => {
    if (!choroplethData) return choroplethData;

    const stateIdByKey = new Map<string, string>();
    for (const feature of data.features) {
      const id = String(feature.id ?? feature.properties.id);
      const name = String(feature.properties.name ?? id);
      stateIdByKey.set(slugify(id), id);
      stateIdByKey.set(slugify(name), id);
    }

    // Backward-compatible aliases for FCT from older callers.
    stateIdByKey.set("fct", "abuja-federal-capital-territory");
    stateIdByKey.set("federal-capital-territory", "abuja-federal-capital-territory");
    stateIdByKey.set("abuja", "abuja-federal-capital-territory");

    const mapped: Record<string, number> = {};
    for (const [rawKey, value] of Object.entries(choroplethData)) {
      const canonicalId = stateIdByKey.get(slugify(rawKey)) ?? rawKey;
      mapped[canonicalId] = value;
    }

    return mapped;
  }, [choroplethData, data.features]);

  return (
    <BaseMap
      data={data}
      ariaLabel="Map of Nigeria"
      projectionBounds={NIGERIA_PROJECTION_BOUNDS}
      choroplethData={normalizedChoroplethData}
      theme={{
        ...theme,
        backgroundColor:
          showWorldMap && !theme?.backgroundColor ? "#e6f4ff" : theme?.backgroundColor,
      }}
      containerStyle={containerStyle}
      onRegionClick={(id, properties) => {
        onRegionClick?.(id, properties);
        onStateClick?.(id, properties);
      }}
      onRegionHover={(id, properties) => {
        onRegionHover?.(id, properties);
        onStateHover?.(id, properties);
      }}
      {...rest}
    />
  );
}

export default NigeriaMap;
