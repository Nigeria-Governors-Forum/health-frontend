"use client";

import { useMemo } from "react";
import nigeriaStates from "@/data/geojson/nigeria-states.geojson";
import BaseMap from "./BaseMap";
import type { BaseMapWithThemeProps, RegionFeatureCollection, RegionProperties } from "./types";
import { filterByRegionId } from "@/app/lib/maps/geojson";

type StateMapProps = Omit<BaseMapWithThemeProps, "data" | "onRegionClick" | "onRegionHover"> & {
  stateId: string;
  onStateClick?: (stateId: string, properties: RegionProperties) => void;
  onStateHover?: (stateId: string, properties: RegionProperties) => void;
  onRegionClick?: BaseMapWithThemeProps["onRegionClick"];
  onRegionHover?: BaseMapWithThemeProps["onRegionHover"];
};

export function StateMap({
  stateId,
  onStateClick,
  onStateHover,
  onRegionClick,
  onRegionHover,
  ...rest
}: StateMapProps) {
  const filteredData = useMemo(() => {
    const allStates = nigeriaStates as RegionFeatureCollection;
    return filterByRegionId(allStates, stateId);
  }, [stateId]);

  return (
    <BaseMap
      data={filteredData as RegionFeatureCollection}
      ariaLabel={`Map of ${stateId}`}
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

export default StateMap;
