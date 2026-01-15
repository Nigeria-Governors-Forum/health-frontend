"use client";

import React from "react";
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

export interface StateValue {
  color?: string;
  budget?: number;
  id?: number | string;
  indicator?: string;
  lga?: string;
  per_capita?: number;
  population?: number;
  state?: string;
  year?: number;
  zone?: string;
}

export interface LgaPerCapitaBarChartProps {
  data: StateValue[];
  title?: string;
  currencySymbol?: string;
  className?: string;
  barColor?: string;
  max?: number; // global max if given
  autoScale?: boolean; // 👈 new toggle
  showValueSuffix?: string;
}

const defaultColors = ["#2563EB"];

const formatCurrency = (val: number, symbol = "₦") =>
  symbol + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const TooltipContent: React.FC<any> = ({
  active,
  payload,
  label,
  currencySymbol,
  suffix,
}) => {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0].payload as StateValue;
  return (
    <div className="bg-black shadow rounded p-2 text-sm border border-gray-200">
      <div className="font-semibold mb-1">{entry.lga ?? entry.state}</div>
      <div>
        {formatCurrency(Number(entry.population ?? 0), currencySymbol)}
        {suffix}
      </div>
    </div>
  );
};

const LgaPerCapitaBarChart: React.FC<LgaPerCapitaBarChartProps> = ({
  data,
  title,
  currencySymbol = "₦",
  className = "",
  barColor = "#2563EB",
  max,
  autoScale = true,
  showValueSuffix = "",
}) => {
  const effectiveMax = autoScale
    ? Math.max(...data.map((d) => Number(d.per_capita) || 0), 0)
    : max && max > 0
      ? max
      : Math.max(...data.map((d) => Number(d.per_capita) || 0), 0);

  return (
    <div className={className}>
      {title && (
        <div className="text-lg font-semibold mb-2 text-green-700">
          {title}
        </div>
      )}
      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            key={data.map((item) => item?.id).join("-")}
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            barCategoryGap="20%"
          >
            <XAxis
              type="number"
              domain={[0, Math.ceil(effectiveMax * 1.05)]}
              hide
            />
            <YAxis
              dataKey="lga"
              type="category"
              width={120}
              tick={{ fontSize: 14, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip
              content={(props) => (
                <TooltipContent
                  {...props}
                  currencySymbol={currencySymbol}
                  suffix={showValueSuffix}
                />
              )}
              wrapperStyle={{ outline: "none" }}
            />
            <Bar
              dataKey="per_capita"
              isAnimationActive={false}
              maxBarSize={24}
              background={{ fill: "#f3f4f6" }}
            >
              {data.map((entry, idx) => {
                const color =
                  entry.color ||
                  defaultColors[idx % defaultColors.length] ||
                  barColor;
                return <Cell key={`cell-${entry.id}-${idx}`} fill={color} />;
              })}
              <LabelList
                dataKey="Per_Capita"
                position="right"
                formatter={(v: any) =>
                  `${formatCurrency(Number(v || 0), currencySymbol)}${showValueSuffix}`
                }
                style={{ fill: "#1f2d3a", fontWeight: 600, fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LgaPerCapitaBarChart;
