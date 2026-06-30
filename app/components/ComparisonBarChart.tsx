"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { FiInfo } from "react-icons/fi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatShort(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
}

function formatFull(n: number, sym = "₦"): string {
  return sym + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategoryComparison {
  name: string;
  actual: number | string | null;
  budgeted: number | string | null;
}

export interface ComparisonBarChartProps {
  data?: CategoryComparison[];
  currencySymbol?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  actualColor?: string;
  budgetColor?: string;
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

const CustomTooltip: React.FC<any> = ({
  active, payload, label, currencySymbol, budgetColor, actualColor,
}) => {
  if (!active || !payload?.length) return null;

  const budgeted = Number(payload.find((p: any) => p.dataKey === "budgeted")?.value ?? 0);
  const actual = Number(payload.find((p: any) => p.dataKey === "actual")?.value ?? 0);

  return (
    <div
      className="rounded-lg bg-white px-4 py-3 text-xs shadow-md"
      style={{ border: "1.5px dashed #16a34a", minWidth: 200 }}
    >
      <p className="mb-1.5 text-sm font-bold text-gray-800">{label}</p>
      <p style={{ color: budgetColor }} className="font-medium">
        Budgeted: {formatFull(budgeted, currencySymbol)}
      </p>
      <p style={{ color: actualColor }} className="font-medium">
        Actual: {formatFull(actual, currencySymbol)}
      </p>
    </div>
  );
};

// ─── Custom cursor (hover background behind the bar group) ────────────────────

const CustomCursor: React.FC<any> = ({ x, y, width, height }) => (
  <rect
    x={x - 8}
    y={y}
    width={width + 16}
    height={height}
    rx={8}
    fill="#EEF2FF"
    opacity={0.6}
  />
);

// ─── Main component ───────────────────────────────────────────────────────────

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  data = [],
  currencySymbol = "₦",
  title = "Health Expenditure Trend",
  subtitle = "Track expenditure trend",
  className = "",
  actualColor = "#7C3AED",   // purple — matches screenshot
  budgetColor = "#3B82F6",   // blue   — matches screenshot
}) => {
  const safeData = data.map((d) => ({
    ...d,
    actual: Number(d.actual ?? 0),
    budgeted: Number(d.budgeted ?? 0),
  }));

  return (
    <div className={`w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>

      {/* ── Header ── */}
      <div className="mb-4 flex items-start justify-between pb-3 border-b border-gray-300 w-full">
        <div className="flex items-start gap-3">
          {/* green icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none">
              <rect x="3" y="10" width="18" height="11" rx="2" stroke="#16a34a" strokeWidth="1.8" />
              <path d="M9 21V13h6v8" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M1 10l11-7 11 7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-gray-800">{title}</h2>
              <div className="group relative flex items-center">
                <FiInfo className="cursor-pointer text-green-900" size={20} />
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
                  {subtitle || "Comparison chart comparing actual vs budgeted amounts."}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </span>
              </div>
            </div>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>

        {/* top-right legend */}
        <div className="flex flex-col items-end gap-1 text-xs font-medium text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: budgetColor }} />
            Actual
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: actualColor }} />
            Budgeted
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="w-full" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={safeData}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            barGap={4}
            barCategoryGap="35%"
          >
            <CartesianGrid
              vertical={false}
              stroke="#E5E7EB"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280", fontWeight: 500 }}
              dy={8}
            />

            <YAxis
              tickFormatter={(v) => formatShort(Number(v))}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              width={48}
            />

            <Tooltip
              content={(props) => (
                <CustomTooltip
                  {...props}
                  currencySymbol={currencySymbol}
                  budgetColor={budgetColor}
                  actualColor={actualColor}
                />
              )}
              cursor={<CustomCursor />}
            />

            {/* Budgeted — blue */}
            <Bar dataKey="budgeted" name="Budgeted" fill={budgetColor} radius={[6, 6, 0, 0]} maxBarSize={28}>
              {safeData.map((_, i) => (
                <Cell key={i} fill={budgetColor} />
              ))}
            </Bar>

            {/* Actual — purple */}
            <Bar dataKey="actual" name="Actual" fill={actualColor} radius={[6, 6, 0, 0]} maxBarSize={28}>
              {safeData.map((_, i) => (
                <Cell key={i} fill={actualColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom legend ── */}
      <div className="mt-3 flex items-center justify-center gap-6 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: budgetColor }} />
          Budgeted
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: actualColor }} />
          Actual
        </div>
      </div>
    </div>
  );
};

export default ComparisonBarChart;
