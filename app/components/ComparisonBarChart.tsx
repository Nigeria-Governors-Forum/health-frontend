"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

function formatNumber(n: number): string {
  if (n >= 1e18) return (n / 1e18).toFixed(2) + "Q"; // Quintillion
  if (n >= 1e15) return (n / 1e15).toFixed(2) + "P"; // Quadrillion
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T"; // Trillion
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B"; // Billion
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M"; // Million
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K"; // Thousand
  return n.toString();
}

export interface CategoryComparison {
  name: string;
  actual: number | string | null;
  budgeted: number | string | null;
}

export interface ComparisonBarChartProps {
  data?: CategoryComparison[];
  currencySymbol?: string;
  title?: string;
  className?: string;
  actualColor?: string;
  budgetColor?: string;
}

// ✅ Safe formatter: handles null, string, undefined
const formatCurrency = (
  value: number | string | null | undefined,
  symbol = "₦"
) => {
  const num = Number(value);
  if (!isFinite(num)) return symbol + "0.00";
  return symbol + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const TooltipContent: React.FC<any> = ({
  active,
  payload,
  label,
  currencySymbol,
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const actual = Number(
    payload.find((p: any) => p.dataKey === "actual")?.value ?? 0
  );
  const budgeted = Number(
    payload.find((p: any) => p.dataKey === "budgeted")?.value ?? 0
  );

  return (
    <div className="bg-black shadow rounded p-3 text-sm border border-gray-200">
      <div className="font-semibold mb-1">{label}</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <div
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: "#10B981" }}
          />
          <span>Budgeted: {formatCurrency(budgeted, currencySymbol)}</span>
        </div>
        <div className="flex items-center">
          <div
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: "#2563EB" }}
          />
          <span>Actual: {formatCurrency(actual, currencySymbol)}</span>
        </div>
      </div>
    </div>
  );
};

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  data = [], // ✅ fallback to empty array
  currencySymbol = "₦",
  title,
  className = "",
  actualColor = "#2563EB", // blue
  budgetColor = "#10B981", // green
}) => {
  // ✅ Ensure safe numeric values
  const maxVal = Math.max(
    ...data.map((d) =>
      Math.max(Number(d.actual ?? 0), Number(d.budgeted ?? 0))
    ),
    0
  );

  return (
    <div className={className}>
      {title && (
        <div className="mb-2 text-base font-semibold text-gray-800">
          {title}
        </div>
      )}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            barGap={8}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              // tickFormatter={(val) => formatCurrency(val, currencySymbol)}
              tickFormatter={(val) => formatNumber(Number(val))} // 👈 use this
              width={80}
              domain={[0, Math.ceil(maxVal * 1.1)]}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={(props) => (
                <TooltipContent {...props} currencySymbol={currencySymbol} />
              )}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => (
                <span className="font-medium">{value}</span>
              )}
            />
            {/* ✅ Budgeted bar */}
            <Bar
              dataKey="budgeted"
              name="Budgeted"
              fill={budgetColor}
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            >
              {data.map((_, idx) => (
                <Cell key={`budgeted-${idx}`} fill={budgetColor} />
              ))}
            </Bar>
            {/* ✅ Actual bar */}
            <Bar
              dataKey="actual"
              name="Actual"
              fill={actualColor}
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            >
              {data.map((_, idx) => (
                <Cell key={`actual-${idx}`} fill={actualColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonBarChart;
