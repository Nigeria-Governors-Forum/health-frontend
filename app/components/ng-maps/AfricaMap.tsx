"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { geoMercator, geoPath } from "d3-geo";
import { cn } from "./cn";

export interface AfricaMapTheme {
  backgroundColor?: string;
  defaultFill?: string;
  strokeColor?: string;
  strokeWidth?: number;
  hoverFill?: string;
  selectedFill?: string;
  fontSize?: number;
  labelColor?: string;
}

export interface AfricaMapProps {
  height?: number;
  width?: string | number;
  getColor?: (value: number) => string;
  choroplethData?: Record<string, number>;
  selectedRegionId?: string;
  onRegionClick?: (id: string, properties: any) => void;
  onRegionHover?: (id: string | null, properties: any | null) => void;
  theme?: AfricaMapTheme;
  className?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AfricaMap({
  height = 440,
  width = "100%",
  getColor,
  choroplethData,
  selectedRegionId,
  onRegionClick,
  onRegionHover,
  theme,
  className,
}: AfricaMapProps) {
  const reactId = useId();
  const filterId = `ng-africa-shadow-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [geo, setGeo] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Set default width measurement
  const [size, setSize] = useState({ width: 600, height });

  const mergedTheme = useMemo(() => ({
    backgroundColor: "transparent",
    defaultFill: "#e2e8f0",
    strokeColor: "#ffffff",
    strokeWidth: 0.8,
    hoverFill: "#22c55e",
    selectedFill: "#06923E",
    fontSize: 8,
    labelColor: "#475569",
    ...theme,
  }), [theme]);

  // Load GeoJSON data asynchronously
  useEffect(() => {
    let canceled = false;
    setLoadError(null);
    fetch("/geo/africa.geo.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load Africa boundaries (${r.status})`);
        return r.json();
      })
      .then((data) => {
        if (!canceled) setGeo(data);
      })
      .catch((e: Error) => {
        if (!canceled) setLoadError(e.message ?? "Could not load map data");
      });
    return () => {
      canceled = true;
    };
  }, []);

  // Set up container resize listener
  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const cr = e.contentRect;
        setSize({ width: cr.width, height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  // Project features using geoMercator
  const projection = useMemo(() => {
    if (!geo) return null;
    return geoMercator().fitSize([size.width, size.height], geo);
  }, [geo, size]);

  const pathFn = useMemo(() => {
    if (!projection) return null;
    return geoPath(projection);
  }, [projection]);

  const fillFor = (id: string) => {
    const normalizedId = id.toLowerCase();
    
    if (selectedRegionId && selectedRegionId.toLowerCase() === normalizedId) {
      return mergedTheme.selectedFill;
    }
    if (hoveredRegionId && hoveredRegionId.toLowerCase() === normalizedId) {
      return mergedTheme.hoverFill;
    }

    const val = choroplethData?.[normalizedId];
    if (val !== undefined && Number.isFinite(val)) {
      return getColor ? getColor(val) : mergedTheme.defaultFill;
    }
    return mergedTheme.defaultFill;
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full select-none", className)}
      style={{ height, background: mergedTheme.backgroundColor }}
    >
      {loadError ? (
        <div className="grid h-full w-full place-items-center px-4 text-center text-sm text-red-500">
          {loadError}
        </div>
      ) : !geo || !pathFn ? (
        <div className="grid h-full w-full place-items-center text-sm text-gray-400">
          Loading Africa Map…
        </div>
      ) : (
        <svg
          width={size.width}
          height={size.height}
          role="img"
          aria-label="Choropleth Map of Africa"
        >
          <defs>
            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          <g>
            {geo.features.map((f: any) => {
              const name = String(f.properties.name || "");
              const id = slugify(name);
              const isSelected = selectedRegionId?.toLowerCase() === id;
              const d = pathFn(f) || "";

              return (
                <motion.path
                  key={id}
                  d={d}
                  initial={false}
                  animate={{ fill: fillFor(id) }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  stroke={isSelected ? "#0b3d2c" : mergedTheme.strokeColor}
                  strokeWidth={isSelected ? mergedTheme.strokeWidth * 2 : mergedTheme.strokeWidth}
                  style={{ cursor: "pointer" }}
                  filter={isSelected ? `url(#${filterId})` : undefined}
                  onMouseEnter={() => {
                    setHoveredRegionId(id);
                    onRegionHover?.(id, f.properties);
                  }}
                  onMouseLeave={() => {
                    setHoveredRegionId(null);
                    onRegionHover?.(null, null);
                  }}
                  onClick={() => {
                    onRegionClick?.(id, f.properties);
                  }}
                  aria-label={name}
                >
                  <title>{name}</title>
                </motion.path>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}

export default AfricaMap;
