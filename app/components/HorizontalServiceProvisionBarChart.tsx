"use client";

import React from "react";
import { FiInfo } from "react-icons/fi";

export interface StateValue {
  color?: string; // optional per-row bar color override (hex)
  budget?: number;
  id?: number;
  number?: string;
  page?: string;
  percentage?: number; // 0-100
  service_provision?: string;
  state?: string;
  year?: number;
  zone?: string;
  /** Highlights this row with a soft green background, like "Brotha Platforms" in the design */
  highlight?: boolean;
}

export interface HorizontalStateBarChartProps {
  data: StateValue[];
  title?: string;
  className?: string;
  barColor?: string; // default bar color if a row doesn't override it
  max?: number; // scale to use as 100% bar width; defaults to 100
  showValueSuffix?: string; // defaults to "%"
  serviceLabel?: string; // left column header
  coverageLabel?: string; // right column header
  /** Highlights the last row automatically, matching the screenshot, without needing per-row flags */
  highlightLast?: boolean;
  subtitle?: string;
}

const HorizontalServiceProvisionBarChart: React.FC<
  HorizontalStateBarChartProps
> = ({
  data,
  title,
  className = "",
  barColor = "#2563EB",
  max = 100,
  showValueSuffix = "%",
  serviceLabel = "Service",
  coverageLabel = "Coverage",
  highlightLast = false,
  subtitle,
}) => {
    return (
      <div
        className={`w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}
      >
        {title && (
          <div className="mb-4 flex items-center gap-1.5 text-lg font-bold text-green-700">
            {title}
            <div className="group relative flex items-center">
              <FiInfo className="cursor-pointer text-green-700" size={15} />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
                {subtitle || "Service provision coverage percentage overview."}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </span>
            </div>
          </div>
        )}

        {/* Column headers */}
        <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-gray-200 pb-2.5 sm:grid-cols-[160px_1fr] bg-[#F8FAFC] rounded-t-2xl py-1">
          <span className="text-sm font-semibold text-gray-800">
            {serviceLabel}
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {coverageLabel}
          </span>
        </div>

        {/* Rows */}
        <div>
          {data.map((row, i) => {
            const value = Number(row.percentage) || 0;
            const widthPct = Math.min(100, Math.max(0, (value / max) * 100));
            const color = row.color || barColor;
            const isHighlighted =
              row.highlight || (highlightLast && i === data.length - 1);
            const isLastRow = i === data.length - 1;

            return (
              <div
                key={row.id ?? row.service_provision ?? i}
                className={`grid grid-cols-[140px_1fr] items-center gap-4 px-2 py-3 sm:grid-cols-[160px_1fr] transition-all duration-200 rounded-lg cursor-pointer ${isHighlighted ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"
                  } ${!isLastRow && !isHighlighted ? "border-b border-gray-100" : ""} hover:shadow-md hover:bg-green-100`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {row.service_provision}
                </span>

                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${widthPct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs font-medium text-gray-500">
                    {Math.round(value)}
                    {showValueSuffix}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

export default HorizontalServiceProvisionBarChart;