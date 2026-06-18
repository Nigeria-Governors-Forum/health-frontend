"use client";

import { useMemo } from "react";
import nigeriaLgas from "@/data/geojson/nigeria-lgas.geojson";
import BaseMap from "./BaseMap";
import type { BaseMapWithThemeProps, RegionFeatureCollection, RegionProperties } from "./types";
import { filterByParentId } from "@/app/lib/maps/geojson";

type LGAMapProps = Omit<BaseMapWithThemeProps, "data" | "onRegionClick" | "onRegionHover"> & {
  stateId?: string;
  onLGAClick?: (lgaId: string, properties: RegionProperties) => void;
  onLGAHover?: (lgaId: string, properties: RegionProperties) => void;
  onRegionClick?: BaseMapWithThemeProps["onRegionClick"];
  onRegionHover?: BaseMapWithThemeProps["onRegionHover"];
};

export function LGAMap({
  stateId,
  onLGAClick,
  onLGAHover,
  onRegionClick,
  onRegionHover,
  ...rest
}: LGAMapProps) {
  const filteredData = useMemo(() => {
    const allLgas = nigeriaLgas as RegionFeatureCollection;
    return filterByParentId(allLgas, stateId);
  }, [stateId]);

  return (
    <BaseMap
      data={filteredData as RegionFeatureCollection}
      ariaLabel="Map of Nigeria LGAs"
      onRegionClick={(id, properties) => {
        onRegionClick?.(id, properties);
        onLGAClick?.(id, properties);
      }}
      onRegionHover={(id, properties) => {
        onRegionHover?.(id, properties);
        onLGAHover?.(id, properties);
      }}
      {...rest}
    />
  );
}

export default LGAMap;
