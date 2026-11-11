"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { geoCentroid, geoMercator, geoPath } from "d3-geo";
import { scaleLinear } from "d3-scale";
import { scoreColor } from "./score-color";
import {
  type NigeriaStateFeature,
  type NigeriaStateFeatureCollection,
  stateFeatureSlug,
} from "./states-geo";
import { cn } from "./cn";

export interface NigeriaStatesChoroplethProps {
  /** Choropleth value per state slug (from GeoJSON `name` → `stateFeatureSlug`). */
  valueForState: (slug: string) => number;
  /** Tooltip / legend label, e.g. `"Score"`. */
  valueLabel?: string;
  geoUrl?: string;
  selectedSlug?: string;
  /** When set, only that state is drawn and the map fits its bounds. */
  focusStateSlug?: string;
  /** Optional custom color mapping function for the values. */
  colorForValue?: (value: number) => string;
  /** Optional custom numeric domain [min, max] for choropleth scale. */
  domain?: [number, number];
  onHover?: (
    slug: string | null,
    info: { slug: string; name: string; value: number } | null,
  ) => void;
  onSelect?: (slug: string, info: { name: string; value: number }) => void;
  showLabels?: boolean;
  className?: string;
  height?: number;
  defaultFill?: string;
}

export function NigeriaStatesChoropleth({
  valueForState,
  valueLabel = "Value",
  geoUrl = "/geo/nigeria-states.geo.json",
  selectedSlug,
  focusStateSlug,
  colorForValue,
  domain,
  onHover,
  onSelect,
  className,
  height = 540,
  showLabels = false,
  defaultFill = "#e5e7eb",
}: NigeriaStatesChoroplethProps) {
  const reactId = useId();
  const filterId = `ng-states-shadow-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [geo, setGeo] = useState<NigeriaStateFeatureCollection | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tip, setTip] = useState<{
    x: number;
    y: number;
    slug: string;
    name: string;
    value: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height });

  useEffect(() => {
    let canceled = false;
    fetch(geoUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load state boundaries (${r.status})`);
        return r.json();
      })
      .then((data: NigeriaStateFeatureCollection) => {
        if (!canceled) {
          setGeo(data);
          setLoadError(null);
        }
      })
      .catch((e: Error) => {
        if (!canceled) setLoadError(e.message ?? "Could not load map data");
      });
    return () => {
      canceled = true;
    };
  }, [geoUrl]);

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

  const focusFeatures = useMemo(() => {
    if (!geo || !focusStateSlug) return null;
    return (geo.features as NigeriaStateFeature[]).filter(
      (f) => stateFeatureSlug(f.properties) === focusStateSlug,
    );
  }, [geo, focusStateSlug]);

  const geoForProjection = useMemo((): GeoJSON.GeoJSON | null => {
    if (!geo) return null;
    if (!focusStateSlug) return geo as unknown as GeoJSON.GeoJSON;
    if (!focusFeatures?.length) return null;
    return { type: "FeatureCollection", features: focusFeatures };
  }, [geo, focusStateSlug, focusFeatures]);

  const invalidFocus = Boolean(geo && focusStateSlug && focusFeatures && focusFeatures.length === 0);

  const projection = useMemo(() => {
    if (!geoForProjection) return null;
    return geoMercator().fitSize([size.width, size.height], geoForProjection);
  }, [geoForProjection, size]);

  const pathFn = useMemo(() => {
    if (!projection) return null;
    return geoPath(projection);
  }, [projection]);

  const computedColorScale = (() => {
    if (colorForValue) return colorForValue;

    if (domain) {
      const [dMin, dMax] = domain;
      if (dMin === dMax) return () => "#4ade80";
      const step = (dMax - dMin) / 5;
      return scaleLinear<string>()
        .domain([dMin, dMin + step, dMin + step * 2, dMin + step * 3, dMin + step * 4, dMax])
        .range(["#fef3c7", "#fde68a", "#86efac", "#4ade80", "#16a34a", "#005031"])
        .clamp(true);
    }

    const featureValues = ((geo?.features as NigeriaStateFeature[]) || [])
      .map((f) => valueForState(stateFeatureSlug(f.properties)))
      .filter((v) => typeof v === "number" && Number.isFinite(v) && v > 0);

    if (featureValues.length === 0) {
      return (val: number) => (Number.isFinite(val) ? scoreColor(val) : defaultFill);
    }

    const min = Math.min(...featureValues);
    const max = Math.max(...featureValues);

    if (min === max) {
      return () => "#4ade80";
    }

    const step = (max - min) / 5;
    return scaleLinear<string>()
      .domain([min, min + step, min + step * 2, min + step * 3, min + step * 4, max])
      .range(["#fef3c7", "#fde68a", "#86efac", "#4ade80", "#16a34a", "#005031"])
      .clamp(true);
  })();

  const fillFor = (slug: string) => {
    const v = valueForState(slug);
    if (v === null || v === undefined || !Number.isFinite(v)) return defaultFill;
    if (colorForValue) return colorForValue(v);
    return computedColorScale(v);
  };

  const setTipFromEvent = (e: React.MouseEvent, slug: string, name: string) => {
    const wrapRect = wrapperRef.current?.getBoundingClientRect();
    if (!wrapRect) return;
    const value = valueForState(slug);
    setTip({
      x: e.clientX - wrapRect.left,
      y: e.clientY - wrapRect.top,
      slug,
      name,
      value,
    });
    onHover?.(slug, { slug, name, value });
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full select-none", className)}
      style={{ height }}
    >
      {loadError ? (
        <div className="grid h-full w-full place-items-center px-4 text-center text-sm text-muted-foreground">
          {loadError}
        </div>
      ) : !geo ? (
        <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
          Loading map…
        </div>
      ) : invalidFocus ? (
        <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
          Unknown state for map focus: <span className="font-mono">{focusStateSlug}</span>
        </div>
      ) : !pathFn ? (
        <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
          Loading map…
        </div>
      ) : (
        <svg width={size.width} height={size.height} role="img" aria-label="Map of Nigerian states">
          <defs>
            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
            </filter>
          </defs>

          <g>
            {(geo.features as NigeriaStateFeature[])
              .filter((f) => !focusStateSlug || stateFeatureSlug(f.properties) === focusStateSlug)
              .map((f) => {
                const slug = stateFeatureSlug(f.properties);
                const isSelected = selectedSlug === slug;
                const d = pathFn(f as unknown as GeoJSON.Feature) || "";
                return (
                  <motion.path
                    key={slug}
                    d={d}
                    initial={false}
                    animate={{ fill: fillFor(slug) }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    stroke={isSelected ? "#0b3d2c" : "#ffffff"}
                    strokeWidth={isSelected ? 1.6 : 0.8}
                    style={{ cursor: "pointer" }}
                    filter={isSelected ? `url(#${filterId})` : undefined}
                    onMouseEnter={(e) => setTipFromEvent(e, slug, f.properties.name)}
                    onMouseMove={(e) => setTipFromEvent(e, slug, f.properties.name)}
                    onMouseLeave={() => {
                      setTip(null);
                      onHover?.(null, null);
                    }}
                    onClick={() => {
                      const value = valueForState(slug);
                      onSelect?.(slug, { name: f.properties.name, value });
                    }}
                    aria-label={f.properties.name}
                  />
                );
              })}
          </g>

          {showLabels && projection
            ? (geo.features as NigeriaStateFeature[])
                .filter((f) => !focusStateSlug || stateFeatureSlug(f.properties) === focusStateSlug)
                .map((f) => {
                  const slug = stateFeatureSlug(f.properties);
                  const [lon, lat] = geoCentroid(f as unknown as GeoJSON.Feature);
                  const p = projection([lon, lat]);
                  if (!p) return null;
                  return (
                    <text
                      key={`lbl-${slug}`}
                      x={p[0]}
                      y={p[1]}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#0b3d2c"
                      style={{ pointerEvents: "none", textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}
                    >
                      {f.properties.name}
                    </text>
                  );
                })
            : null}
        </svg>
      )}

      {tip ? (
        <div
          className="pointer-events-none absolute z-20 min-w-[200px] -translate-x-1/2 -translate-y-full rounded-xl border border-border/60 bg-popover/95 p-3 shadow-xl backdrop-blur text-black"
          style={{ left: tip.x, top: tip.y - 8 }}
        >
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <div className="font-medium leading-tight">{tip.name}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{valueLabel}</div>
            <div className="font-display text-2xl font-semibold leading-none num">
              {Number.isInteger(tip.value)
                ? tip.value.toLocaleString()
                : Number(tip.value).toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
