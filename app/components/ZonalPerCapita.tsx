"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { formatNumber } from "../dashboard/page";

interface StateData {
  state: string;
  health_exp: number;
  state_population: number;
  per_capita: number;
}

interface StateBarChartProps {
  data: StateData[];
  barColor?: string;
  title?: string;
  currencySymbol?: string;
  className?: string;
}

const blueShades = [
  "#bfdbfe", // blue-200
  "#93c5fd", // blue-300
  "#60a5fa", // blue-400
  "#3b82f6", // blue-500
  "#2563eb", // blue-600
  "#1d4ed8", // blue-700
];

const formatCurrency = (value: number, symbol = "") =>
  symbol
    ? symbol + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : value.toFixed(1); // fallback for percentages etc.

const TooltipContent: React.FC<any> = ({
  active,
  payload,
  label,
  currencySymbol,
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const val = payload[0]?.value ?? 0;

  return (
    <div className="bg-blue-600 shadow rounded p-2 text-sm border border-gray-200">
      <div className="font-semibold mb-1">{label}</div>
      <div>{formatCurrency(val, currencySymbol)}</div>
    </div>
  );
};

const ZonalPerBarChart: React.FC<StateBarChartProps> = ({
  data,
  barColor = "#2563EB",
  title,
  currencySymbol = "₦",
  className,
}) => {
  const maxVal =
    Array.isArray(data) && data.length > 0
      ? Math.max(
          ...data
            .map((d) => d.per_capita ?? 0) // fallback to 0 if undefined
            .filter((v): v is number => typeof v === "number"),
          0
        )
      : 0;

  const getColorForValue = (value: number) => {
    if (maxVal === 0) return blueShades[0];
    const index = Math.floor((value / maxVal) * (blueShades.length - 1));
    return blueShades[index];
  };

  return (
    <div className={className}>
      {title && (
        <div className="py-4 mb-2 text-base font-semibold text-green-800 text-center">
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
        >
          <XAxis
            dataKey="state"
            tick={{ fontSize: 14, fontWeight: 600 }}
            interval={0}
          />
          <YAxis
            domain={[0, Math.ceil(maxVal * 1.1)]}
            tickFormatter={(val) =>
              val >= 1e6 ? (val / 1e6).toFixed(1) + "M" : val.toFixed(0)
            }
          />
          <Tooltip
            content={(props) => (
              <TooltipContent {...props} currencySymbol="₦" />
            )}
          />
          <Bar dataKey="per_capita" radius={[4, 4, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={getColorForValue(Number(entry.per_capita) || 0)}
              />
            ))}
            <LabelList
              dataKey="per_capita"
              position="top"
              formatter={(label: React.ReactNode) => {
                if (typeof label === "number") {
                  return "₦" + formatNumber(Number(label.toFixed(0)));
                }
                if (typeof label === "string") {
                  const num = Number(label);
                  return !isNaN(num) ? num.toFixed(0) : label;
                }
                return label;
              }}
              style={{ fill: "#111827", fontWeight: 600, fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ZonalPerBarChart;
