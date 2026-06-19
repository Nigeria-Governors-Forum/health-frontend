"use client";

import React from "react";
import { formatNumber } from "../context/TopbarFiltersContext";

export type Status = "safe" | "normal" | "hard" | "unknown";

export interface SummaryRow {
  name: string;
  private?: number | string;
  public?: number | string;
  total?: number | string;
  /** Renders this row in bold, larger "Total" style with no SN number */
  isTotal?: boolean;
  status?: Status; // reserved for future row accents (e.g. hard-to-reach)
}

export interface StatusStyle {
  label: string;
  bgClass: string;
  textClass?: string;
  borderClass?: string;
}

export interface SummaryTableProps {
  title?: string;
  data: SummaryRow[];
  statusStyles?: Partial<Record<Status, StatusStyle>>;
}

/**
 * Default mapping:
 * - safe: green
 * - normal: light/white (no fill)
 * - hard: red
 * - unknown: gray
 */
const defaultStatusStyles: Record<Status, StatusStyle> = {
  safe: {
    label: "Safe",
    bgClass: "bg-green-100",
    textClass: "text-black",
    borderClass: "border-green-700",
  },
  normal: {
    label: "Normal",
    bgClass: "bg-white",
    textClass: "text-black",
    borderClass: "border-green-700",
  },
  hard: {
    label: "Hard to Reach",
    bgClass: "bg-red-500 text-white",
    textClass: "text-white",
    borderClass: "border-red-700",
  },
  unknown: {
    label: "Unknown",
    bgClass: "bg-gray-200",
    textClass: "text-black",
    borderClass: "border-green-700",
  },
};

const SummaryTable: React.FC<SummaryTableProps> = ({
  title = "Health Facilities Breakdown",
  data,
  statusStyles = {},
}) => {
  // Reserved for future per-row status accents (kept for API compatibility).
  void { ...defaultStatusStyles, ...statusStyles };

  return (
    <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="mb-5 text-lg sm:text-xl font-bold text-green-700">{title}</h2>
      </div>

      {/* Scrollable container with sticky headers */}
      <div className="max-h-96 overflow-y-auto overflow-x-auto mb-5 -mt-8">
        {/* Column headers */}
        <div className="sticky top-0 grid grid-cols-[2fr_0.8fr_0.8fr_0.7fr] sm:grid-cols-[2fr_1fr_1fr_0.9fr] gap-2 sm:gap-2.5 bg-white z-10 px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-1 sm:gap-3 rounded-lg bg-green-600 px-2 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white">
            <span>SN</span>
            <span className="hidden sm:inline">Level</span>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-green-600 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white">
            <span className="hidden sm:inline">Private</span>
            <span className="sm:hidden">Priv</span>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-green-600 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white">
            <span className="hidden sm:inline">Public</span>
            <span className="sm:hidden">Pub</span>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-green-600 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white">
            Total
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
        {data.map((row, i) => {
          const sn = i + 1;
          const totalRow = !!row.isTotal;

          return (
            <div
              key={`${row.name}-${i}`}
              className="grid grid-cols-[2fr_0.8fr_0.8fr_0.7fr] sm:grid-cols-[2fr_1fr_1fr_0.9fr] gap-2 sm:gap-2.5 px-4 sm:px-6"
            >
              <div
                className={`flex items-center gap-1 sm:gap-3 rounded-lg bg-green-50 px-2 sm:px-5 py-2 sm:py-3 text-gray-700 min-w-0 ${totalRow
                  ? "text-sm sm:text-base font-bold text-black"
                  : "text-xs sm:text-sm font-medium"
                  }`}
              >
                {!totalRow && (
                  <span className="text-gray-500 shrink-0">
                    {String(sn).padStart(2, "0")}
                  </span>
                )}
                <span className="break-words font-bold">{totalRow ? "Total" : row.name}</span>
              </div>

              <div
                className={`flex items-center justify-center rounded-lg bg-green-50 px-2 sm:px-4 py-2 sm:py-3 text-gray-700 ${totalRow ? "text-sm sm:text-base font-bold text-black" : "text-xs sm:text-sm font-medium"
                  }`}
              >
                {row.private ?? "N/A"}
              </div>

              <div
                className={`flex items-center justify-center rounded-lg bg-green-50 px-2 sm:px-4 py-2 sm:py-3 text-gray-700 ${totalRow ? "text-sm sm:text-base font-bold text-black" : "text-xs sm:text-sm font-medium"
                  }`}
              >
                {row.public ?? "N/A"}
              </div>

              <div
                className={`flex items-center justify-center rounded-lg font-bold! bg-green-50 px-2 sm:px-4 py-2 sm:py-3 text-gray-700 ${totalRow ? "text-sm sm:text-base font-bold text-black" : "text-xs sm:text-sm font-medium"
                  }`}
              >
                {formatNumber(Number(row.total)) || "N/A"}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default SummaryTable;