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

interface StateData {
  state?: string;
  zone?: string;
  public?: string;
  private?: number;
  other?: number;
  total?: number;
  population?: number;
  rate_graph?: number;
}

interface StateBarChartProps {
  data: StateData[];
  barColor?: string;
  title?: string;
  currencySymbol?: string;
  className?: string;
  xaxis?: string;
  yaxis?: string;
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
    : value.toFixed(0) + "%"; // fallback for percentages etc.

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

const StateBarChart: React.FC<StateBarChartProps> = ({
  data,
  barColor = "#2563EB",
  title,
  currencySymbol = "",
  className,
}) => {
  const maxVal =
    Array.isArray(data) && data.length > 0
      ? Math.max(
          ...data
            .map((d) => d.rate_graph ?? 0) // fallback to 0 if undefined
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
        <div className="mb-2 text-base font-semibold text-green-800 text-center">
          {title}
        </div>
      )}
      <ResponsiveContainer>
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
            domain={[0, Math.ceil(maxVal * 1)]}
            tickFormatter={(val) => formatCurrency(val, currencySymbol)}
            hide
          />
          <Tooltip
            content={(props) => (
              <TooltipContent {...props} currencySymbol={currencySymbol} />
            )}
          />
          <Bar dataKey="rate_graph" fill={barColor} radius={[4, 4, 0, 0]}>
            {data?.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={getColorForValue(entry.rate_graph ?? 0)}
              />
            ))}
            <LabelList
              dataKey="rate_graph"
              position="top"
              formatter={(label) => {
                if (typeof label === "number") {
                  return formatCurrency(label, currencySymbol);
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

export default StateBarChart;
