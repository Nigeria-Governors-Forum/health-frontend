"use client";

import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BarDataPoint {
    /** X-axis label (e.g. state name) */
    label: string;
    /** For simple mode: just pass `value`. For stacked mode: pass keys matching series[].key */
    value?: number;
    [key: string]: number | string | undefined;
}

export interface BarSeries {
    key: string;
    label: string;
    color: string;
}

export interface ZonalBarChartProps {
    /** Zone/group title shown top-left */
    title?: string;
    data: BarDataPoint[];
    /**
     * Controls the chart mode:
     * - `simple` — single bar per label using `d.value`, colored with `simpleColor`
     * - `stacked` — stacked bars using `series` keys
     */
    variant?: "simple" | "stacked";
    /** Color used in simple mode. Default: #2563EB */
    simpleColor?: string;
    /** Series config for stacked mode */
    series?: BarSeries[];
    /** Show legend (stacked mode only). Default: true */
    showLegend?: boolean;
    /** Show value labels inside each bar segment. Default: true for stacked, false for simple */
    showLabels?: boolean;
    height?: number;
    className?: string;
}

// ─── Custom tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md text-xs">
            <p className="mb-1 font-semibold text-gray-700">{label}</p>
            {[...payload].reverse().map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-1.5">
                    <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: p.fill }}
                    />
                    <span className="text-gray-600">
                        {p.name}: <strong>{p.value}</strong>
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Custom bar shape with rounded top ───────────────────────────────────────

function RoundedTopBar(props: any) {
    const { x, y, width, height, fill, isTop, hovered } = props;
    if (!height || height <= 0) return null;
    const radius = isTop ? 6 : 0;
    const opacity = hovered ? 0.8 : 1;

    return (
        <path
            d={`
        M ${x},${y + radius}
        Q ${x},${y} ${x + radius},${y}
        L ${x + width - radius},${y}
        Q ${x + width},${y} ${x + width},${y + radius}
        L ${x + width},${y + height}
        L ${x},${y + height}
        Z
      `}
            fill={fill}
            opacity={opacity}
            style={{ transition: "opacity 0.15s" }}
        />
    );
}

// ─── Legend ──────────────────────────────────────────────────────────────────

function ChartLegend({ series }: { series: BarSeries[] }) {
    return (
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {series.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span
                        className="h-3 w-5 rounded-sm shrink-0"
                        style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                </div>
            ))}
        </div>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ZonalBarChart({
    title,
    data,
    variant = "simple",
    simpleColor = "#2563EB",
    series = [],
    showLegend = true,
    showLabels,
    height = 320,
    className = "",
}: ZonalBarChartProps) {
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

    const isStacked = variant === "stacked";
    const displayLabels = showLabels ?? isStacked;

    return (
        <div className={`w-full bg-white ${className}`}>
            {title && (
                <p className="mb-3 text-sm font-bold text-green-700">{title}</p>
            )}

            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={data}
                    margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                    barCategoryGap="30%"
                    onMouseLeave={() => setHoveredLabel(null)}
                >
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        dy={6}
                    />
                    <YAxis hide />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "transparent" }}
                    />

                    {/* ── Simple mode ── */}
                    {!isStacked && (
                        <Bar
                            dataKey="value"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                            onMouseEnter={(_: any, __: number, e: any) => {
                                const label = e?.activePayload?.[0]?.payload?.label;
                                if (label) setHoveredLabel(label);
                            }}
                        >
                            {data.map((d) => (
                                <Cell
                                    key={d.label}
                                    fill={simpleColor}
                                    opacity={
                                        hoveredLabel && hoveredLabel !== d.label ? 0.45 : 1
                                    }
                                    style={{ transition: "opacity 0.15s", cursor: "pointer" }}
                                    onMouseEnter={() => setHoveredLabel(d.label)}
                                    onMouseLeave={() => setHoveredLabel(null)}
                                />
                            ))}
                        </Bar>
                    )}

                    {/* ── Stacked mode ── */}
                    {isStacked &&
                        series.map((s, idx) => {
                            const isTopSeries = idx === series.length - 1;
                            return (
                                <Bar
                                    key={s.key}
                                    dataKey={s.key}
                                    stackId="a"
                                    fill={s.color}
                                    name={s.label}
                                    maxBarSize={52}
                                    shape={(props: any) => (
                                        <RoundedTopBar
                                            {...props}
                                            isTop={isTopSeries}
                                            hovered={
                                                hoveredLabel !== null &&
                                                hoveredLabel !== props?.label
                                            }
                                        />
                                    )}
                                    onMouseEnter={(_: any, __: number, e: any) => {
                                        const label = e?.activePayload?.[0]?.payload?.label;
                                        if (label) setHoveredLabel(label);
                                    }}
                                    onMouseLeave={() => setHoveredLabel(null)}
                                >
                                    {displayLabels && (
                                        <LabelList
                                            dataKey={s.key}
                                            position="center"
                                            style={{
                                                fill: "#fff",
                                                fontSize: 11,
                                                fontWeight: 600,
                                                pointerEvents: "none",
                                            }}
                                            formatter={(v: any) => (v > 0 ? v : "")}
                                        />
                                    )}
                                </Bar>
                            );
                        })}
                </BarChart>
            </ResponsiveContainer>

            {isStacked && showLegend && series.length > 0 && (
                <ChartLegend series={series} />
            )}
        </div>
    );
}