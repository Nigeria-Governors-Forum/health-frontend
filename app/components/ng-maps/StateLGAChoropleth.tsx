"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { geoMercator, geoPath } from "d3-geo";
import { scoreColor } from "./score-color";
import {
  type NigeriaLGAFeature,
  type NigeriaLGAFeatureCollection,
  lgaKeyFromName,
  stateSlugFromLGAProps,
} from "./lga-geo";
import { cn } from "./cn";

export interface StateLGAChoroplethProps {
  /**
   * Normalized state slug matching `NAME_1` in the GeoJSON after `normalizeStateName`
   * (e.g. `lagos`, `fct`, `akwa-ibom`).
   */
  stateSlug: string;
  /** Human-readable state label (accessibility + messages). Defaults to `stateSlug`. */
  stateName?: string;
  /**
   * Fill per LGA. Keys are slugified LGA names (`lgaKeyFromName`), e.g.
   * `{ "ikeja": "#16a34a" }`.
   */
  lgaColors?: Record<string, string>;
  /**
   * Numeric choropleth: values 0–100 mapped with `scoreColor`.
   * `lgaColors` overrides per key.
   */
  lgaValues?: Record<string, number>;
  /**
   * Fallback score when `lgaValues` has no entry. Return `undefined` for `defaultFill`.
   */
  valueForLGA?: (lgaName: string, lgaKey: string) => number | undefined;
  defaultFill?: string;
  /** Public URL to the FeatureCollection JSON (Next.js: file under `public/`). */
  geoUrl?: string;
  height?: number;
  className?: string;
  onHoverLGA?: (lga: { name: string; key: string } | null) => void;
}

export function StateLGAChoropleth({
  stateSlug,
  stateName,
  lgaColors,
  lgaValues,
  valueForLGA,
  defaultFill = "#e5e7eb",
  geoUrl = "/geo/nigeria-lgas.geo.json",
  height = 520,
  className,
  onHoverLGA,
}: StateLGAChoroplethProps) {
  const reactId = useId();
  const filterId = `ng-lga-shadow-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [geo, setGeo] = useState<NigeriaLGAFeatureCollection | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height });

  const title = stateName ?? stateSlug;

  useEffect(() => {
    let canceled = false;
    setLoadError(null);
    fetch(geoUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load LGA boundaries (${r.status})`);
        return r.json();
      })
      .then((data: NigeriaLGAFeatureCollection) => {
        if (!canceled) setGeo(data);
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

  const features = useMemo(() => {
    if (!geo?.features?.length) return [];
    return (geo.features as NigeriaLGAFeature[]).filter(
      (f) => stateSlugFromLGAProps(f.properties) === stateSlug,
    );
  }, [geo, stateSlug]);

  const collection = useMemo(
    (): GeoJSON.FeatureCollection => ({ type: "FeatureCollection", features }),
    [features],
  );

  const projection = useMemo(() => {
    if (!features.length) return null;
    return geoMercator().fitSize([size.width, size.height], collection);
  }, [collection, features.length, size.height, size.width]);

  const pathFn = useMemo(() => {
    if (!projection) return null;
    return geoPath(projection);
  }, [projection]);

  const fillFor = (f: NigeriaLGAFeature) => {
    const key = lgaKeyFromName(f.properties.NAME_2);
    const name = f.properties.NAME_2;
    const fromColor = lgaColors?.[key];
    if (fromColor) return fromColor;
    const v = lgaValues?.[key];
    if (v !== undefined && Number.isFinite(v)) return scoreColor(v);
    const derived = valueForLGA?.(name, key);
    if (derived !== undefined && Number.isFinite(derived)) return scoreColor(derived);
    return defaultFill;
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
      ) : !geo || !pathFn ? (
        <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
          Loading LGAs…
        </div>
      ) : features.length === 0 ? (
        <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
          No LGA features matched <span className="font-semibold">{title}</span>. Check{" "}
          <span className="font-mono">stateSlug</span> and boundary file.
        </div>
      ) : (
        <svg width={size.width} height={size.height} role="img" aria-label={`LGAs in ${title}`}>
          <defs>
            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.12" />
            </filter>
          </defs>
          <g>
            {features.map((f) => {
              const key = lgaKeyFromName(f.properties.NAME_2);
              const d = pathFn(f as unknown as GeoJSON.Feature) || "";
              return (
                <motion.path
                  key={f.properties.ID_2 ?? `${key}-${d.slice(0, 24)}`}
                  d={d}
                  initial={false}
                  animate={{ fill: fillFor(f) }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  stroke="#ffffff"
                  strokeWidth={0.6}
                  style={{ cursor: "pointer" }}
                  filter={`url(#${filterId})`}
                  onMouseEnter={() => onHoverLGA?.({ name: f.properties.NAME_2, key })}
                  onMouseLeave={() => onHoverLGA?.(null)}
                  aria-label={f.properties.NAME_2}
                />
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
