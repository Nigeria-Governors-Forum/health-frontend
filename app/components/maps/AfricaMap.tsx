"use client";

import { useMemo } from "react";
import africaCountries from "@/data/geojson/africa.geojson";
import BaseMap from "./BaseMap";
import type {
  BaseMapTheme,
  BaseMapWithThemeProps,
  RegionFeatureCollection,
  RegionProperties,
} from "./types";

type AfricaMapProps = Omit<BaseMapWithThemeProps, "data" | "onRegionClick" | "onRegionHover"> & {
  onCountryClick?: (countryId: string, properties: RegionProperties) => void;
  onCountryHover?: (countryId: string, properties: RegionProperties) => void;
  onRegionClick?: BaseMapWithThemeProps["onRegionClick"];
  onRegionHover?: BaseMapWithThemeProps["onRegionHover"];
  theme?: BaseMapTheme;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AfricaMap({
  onCountryClick,
  onCountryHover,
  onRegionClick,
  onRegionHover,
  theme,
  containerStyle,
  choroplethData,
  ...rest
}: AfricaMapProps) {
  // Preprocess GeoJSON data to ensure all country features have standard slugified IDs
  const preprocessedData = useMemo(() => {
    const rawData = africaCountries as RegionFeatureCollection;
    return {
      ...rawData,
      features: rawData.features.map((feature) => {
        const name = String(feature.properties.name || "");
        const fallbackId = slugify(name);
        const resolvedId = String(feature.id ?? feature.properties.id ?? fallbackId);
        return {
          ...feature,
          id: resolvedId,
          properties: {
            ...feature.properties,
            id: resolvedId,
            name,
          },
        };
      }),
    };
  }, []);

  // Normalize mapping keys for choropleth mapping
  const normalizedChoroplethData = useMemo(() => {
    if (!choroplethData) return choroplethData;

    const countryIdByKey = new Map<string, string>();
    for (const feature of preprocessedData.features) {
      const id = String(feature.id);
      const name = String(feature.properties.name || "");
      countryIdByKey.set(slugify(id), id);
      countryIdByKey.set(slugify(name), id);
    }

    const mapped: Record<string, number> = {};
    for (const [rawKey, value] of Object.entries(choroplethData)) {
      const canonicalId = countryIdByKey.get(slugify(rawKey)) ?? rawKey;
      mapped[canonicalId] = value;
    }

    return mapped;
  }, [choroplethData, preprocessedData.features]);

  return (
    <BaseMap
      data={preprocessedData}
      ariaLabel="Map of Africa"
      choroplethData={normalizedChoroplethData}
      theme={theme}
      containerStyle={containerStyle}
      onRegionClick={(id, properties) => {
        onRegionClick?.(id, properties);
        onCountryClick?.(id, properties);
      }}
      onRegionHover={(id, properties) => {
        onRegionHover?.(id, properties);
        onCountryHover?.(id, properties);
      }}
      {...rest}
    />
  );
}

export default AfricaMap;
