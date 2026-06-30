"use client";

import React from "react";
import {
  FiSearch,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export type WorkforceStatus = "good" | "low";
export interface LgaRow {
  id: number;
  occupation: string;
  number?: string;
  density?: number | string;
  target?: number | string;
  institution?: string;
  page?: string;
  state?: string;
  year?: number;
  zone?: string;
}

export interface WorkforceRow {
  id?: number;
  occupation: string;
  number?: number | string;
  /** Per `densityPer` population. */
  density?: number | string;
  /** Explicit override — if omitted, status is computed from `density` using the legend thresholds. */
  status?: WorkforceStatus;
  // Kept for backward compatibility with the old interface; not rendered.
  institution?: string;
  target?: number | string;
  page?: string;
  state?: string;
  year?: number;
  zone?: string;
}

export interface StatusStyle {
  label: string;
  dotClass: string;
  pillBgClass: string;
  textClass: string;
}

const defaultStatusStyles: Record<WorkforceStatus, StatusStyle> = {
  low: {
    label: "Low (≤ 0)",
    dotClass: "bg-red-500",
    pillBgClass: "bg-red-50",
    textClass: "text-red-600",
  },
  good: {
    label: "Good (≥ 5)",
    dotClass: "bg-green-600",
    pillBgClass: "bg-green-50",
    textClass: "text-green-700",
  },
};

export interface PopulationSummaryTableProps {
  title?: string;
  subtitle?: string;
  data: WorkforceRow[];
  totalCount?: number;
  pageSize?: number;
  /** Used in the Density column header. Default 10,000. */
  densityPer?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  onPageChange?: (page: number) => void;
  statusStyles?: Partial<Record<WorkforceStatus, StatusStyle>>;
}

function computeStatus(density?: number | string): WorkforceStatus {
  const val = Number(density);
  if (density === undefined || density === null || Number.isNaN(val))
    return "low";
  if (val < 1) return "low";
  return "good";
}

function formatNumber(value?: number | string) {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("en-US");
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 1) return [1];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const keep = new Set<number>([1, 2, 3, 4, current, total]);
  const sorted = Array.from(keep)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  sorted.forEach((page, idx) => {
    if (idx > 0 && page - sorted[idx - 1] > 1) result.push("...");
    result.push(page);
  });
  return result;
}

const PopulationSummaryTable: React.FC<PopulationSummaryTableProps> = ({
  title = "Health Workforce Breakdown",
  subtitle = "List of all workforce breakdown",
  data,
  totalCount,
  pageSize = 10,
  densityPer = 10000,
  searchValue = "",
  onSearchChange = () => { },
  currentPage = 1,
  totalPages = 1,
  totalResults,
  onPageChange = () => { },
  statusStyles = {},
}) => {
  const styles = { ...defaultStatusStyles, ...statusStyles } as Record<
    WorkforceStatus,
    StatusStyle
  >;

  const total = totalCount ?? data.length;
  const resultsTotal = totalResults ?? data.length;
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-green-700">{title}</h2>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-0.5 text-xs font-semibold text-green-700">
              {total} Total
            </span>
            <div className="group relative flex items-center">
              <FiInfo className="cursor-pointer text-gray-300" size={15} />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
                {subtitle || "Health workforce breakdown summary."}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm">{subtitle} </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-full border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
          <FiSearch
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden gap-2.5 sm:mb-2.5 sm:grid sm:grid-cols-[1.6fr_1.2fr_1.2fr]">
        <div className="flex items-center gap-3 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          <span>Occupation</span>
        </div>
        <div className="flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Number
        </div>
        <div className="flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-white">
          <span className="text-sm font-semibold">Density</span>
          <span className="ml-1 text-xs text-green-100">
            per {formatNumber(densityPer)} Population
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2.5">
        {data.map((row, i) => {
          const status = row.status ?? computeStatus(row.density);
          const style = styles[status];
          const sn = (currentPage - 1) * pageSize + i + 1;

          return (
            <div
              key={row.id ?? `${row.occupation}-${i}`}
              className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1.6fr_1.2fr_1.2fr]"
            >
              {/* Occupation cell — carries the status color */}
              <div
                className={`flex items-center gap-3 rounded-full px-5 py-3 text-sm ${style.pillBgClass}`}
              >
                <span className={`font-semibold ${style.textClass}`}>
                  {row.institution || row.occupation}
                </span>
              </div>

              {/* Neutral data cells */}
              <div className="flex items-center justify-center rounded-full bg-green-50 px-5 py-3 text-sm font-medium text-gray-700">
                <span className="mr-1 text-xs text-gray-400 sm:hidden">
                  Number:
                </span>
                {formatNumber(row.number)}
              </div>

              <div className="flex items-center justify-center rounded-full bg-green-50 px-5 py-3 text-sm font-medium text-gray-700">
                <span className="mr-1 text-xs text-gray-400 sm:hidden">
                  Density:
                </span>
                {formatNumber(row.density)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft size={15} />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {pages.map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full font-medium ${p === currentPage
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 text-green-600 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <FiChevronRight size={15} />
          </button>
        </div>

        <span className="ml-auto text-xs text-gray-400 sm:text-sm">
          Showing {data.length} of {resultsTotal.toLocaleString()} results
        </span>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-600">
        {(Object.keys(styles) as WorkforceStatus[]).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${styles[key].dotClass}`}
            />
            <span>{styles[key].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopulationSummaryTable;