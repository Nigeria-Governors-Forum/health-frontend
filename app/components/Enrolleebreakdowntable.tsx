"use client";

import React from "react";
import { FiInfo } from "react-icons/fi";

export interface BreakdownRow {
  id?: number;
  label: string;
  value: number | string;
  isTotal?: boolean;
}

export interface EnrolleeBreakdownTableProps {
  title?: string;
  data: BreakdownRow[];
  className?: string;
}

function formatNumber(value?: number | string) {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("en-US");
}

const EnrolleeBreakdownTable: React.FC<EnrolleeBreakdownTableProps> = ({
  title = "Enrollee Breakdown",
  data,
  className = "",
}) => {
  return (
    <div
      className={`w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      {/* Title */}
      <div className="mb-4 flex items-center gap-1.5">
        <h2 className="text-base font-bold text-green-700">{title}</h2>
        <FiInfo className="text-green-700" size={15} />
      </div>

      {/* Column headers */}
      <div className="mb-2.5 flex gap-2.5">
        <div className="flex flex-1 items-center gap-4 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          <span className="w-8 shrink-0">SN</span>
          <span>Breakdown</span>
        </div>
        <div className="flex w-44 shrink-0 items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Number
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2">
        {data.map((row, i) => {
          const isTotalRow = !!row.isTotal;
          const sn = String(i + 1).padStart(2, "0");

          return (
            <div
              key={row.id ?? `${row.label}-${i}`}
              className="flex gap-2.5"
            >
              {/* Label cell */}
              <div className="flex flex-1 items-center gap-4 rounded-full bg-green-50 px-5 py-3">
                {!isTotalRow ? (
                  <>
                    <span className="w-8 shrink-0 text-sm font-medium text-gray-500">
                      {sn}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {row.label}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-gray-800">
                    Total
                  </span>
                )}
              </div>

              {/* Value cell */}
              <div
                className={`flex w-44 shrink-0 items-center justify-center rounded-full bg-green-50 px-5 py-3 ${
                  isTotalRow
                    ? "text-base font-bold text-gray-800"
                    : "text-sm font-medium text-gray-700"
                }`}
              >
                {formatNumber(row.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnrolleeBreakdownTable;