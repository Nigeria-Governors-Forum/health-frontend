"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { IoInformationCircle } from "react-icons/io5";

export interface DonutDatum {
  name: string;
  value: number;
  color?: string; // optional per-segment override
}

interface DataCardProps {
  title: string;
  secondTitle?: string;
  initialData: DonutDatum[];
  alternateData?: DonutDatum[];
  className?: string;
}

// Blue, Purple, Coral pink — matches the design's 3-segment palette, extra
// colors included in case a dataset has more than 3 entries.
const DEFAULT_COLORS = [
  "#2563EB",
  "#9333EA",
  "#FB7185",
  "#F59E0B",
  "#10B981",
];

export default function DataCard({
  title,
  secondTitle,
  initialData,
  alternateData,
  className = "",
}: DataCardProps) {
  const [enabled, setEnabled] = useState(false);

  const data = enabled && alternateData ? alternateData : initialData;
  const heading = enabled && secondTitle ? secondTitle : title;

  return (
    <div
      className={`w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-bold text-green-700 sm:text-lg">
            {heading}
          </h2>
          <IoInformationCircle className="text-green-700" size={17} />
        </div>

        {alternateData && (
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled((v) => !v)}
              className="peer sr-only"
            />
            <div className="relative h-6 w-11 rounded-full bg-gray-200 transition-colors duration-300 peer-checked:bg-green-200">
              <div
                className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${enabled ? "translate-x-5" : ""
                  }`}
              />
            </div>
          </label>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Donut + legend */}
      <div className="flex flex-col items-center gap-8 pt-6 sm:flex-row sm:justify-center">
        <div className="relative h-64 w-64 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* faint mint track, visible through the gaps between segments */}
              <Pie
                data={[{ value: 1 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="88%"
                fill="#ECFDF3"
                stroke="none"
                isAnimationActive={false}
              />
              <Pie
                data={data as any}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={8}
                cornerRadius={50}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={entry.name ?? idx}
                    fill={
                      entry.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
                    }
                    style={{
                      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.12))",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-9 text-center">
            <span className="text-lg font-bold leading-snug text-gray-700">
              {heading}
            </span>
          </div> */}
        </div>

        {/* Legend */}
        <div className="flex flex-row gap-4 sm:flex-col sm:gap-3">
          {data.map((entry, idx) => {
            const color =
              entry.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
            return (
              <div key={entry.name ?? idx} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color }}
                >
                  {entry.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}