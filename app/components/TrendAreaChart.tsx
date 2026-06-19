"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiBarChart2 } from "react-icons/fi";

export interface TrendPoint {
  label: string; // e.g. a year: "2019"
  value: number;
}

export interface TrendAreaChartProps {
  data?: TrendPoint[];
  height?: number;
  lineColor?: string;
  fillColor?: string;
  emptyMessage?: string;
  className?: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs shadow-sm">
      <span className="font-semibold text-gray-700">{label}: </span>
      <span className="text-gray-600">{payload[0].value}</span>
    </div>
  );
}

export default function TrendAreaChart({
  data,
  height = 280,
  lineColor = "#1E3A5F",
  fillColor = "#DCE6F0",
  emptyMessage = "No data available",
  className = "",
}: TrendAreaChartProps) {
  const hasData = !!data && data.length > 0;

  if (!hasData) {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center gap-2 bg-white text-gray-400 ${className}`}
        style={{ height }}
      >
        <FiBarChart2 size={28} className="text-gray-300" />
        <span className="text-sm">{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity={1} />
              <stop offset="100%" stopColor={fillColor} stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="label"
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            tick={{ fontSize: 12, fontWeight: 600, fill: "#374151" }}
            dy={8}
          />

          <Tooltip content={<CustomTooltip />} cursor={false} />

          <Area
            type="natural"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2.5}
            fill="url(#trendFill)"
            isAnimationActive={false}
            dot={false}
            activeDot={{ r: 4, fill: lineColor, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}