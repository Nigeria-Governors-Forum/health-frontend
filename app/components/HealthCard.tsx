"use client";

import React from "react";
import { FiSearch, FiInfo } from "react-icons/fi";

export interface SummaryRow {
  id?: number;
  institution: string;
  private?: number | string;
  public?: number | string;
  total?: number | string;
  /** Renders this row bold with no SN number, like the bottom "Total" row in the design */
  isTotal?: boolean;
}

export interface SummaryTableProps {
  title?: string;
  subtitle?: string;
  data: SummaryRow[];
  totalCount?: number;
  pageSize?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

function formatNumber(value?: number | string) {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("en-US");
}

const HealthCard: React.FC<SummaryTableProps> = ({
  title = "Health Workforce Breakdown",
  subtitle,
  data,
  totalCount,
  pageSize = 10,
  searchValue = "",
  onSearchChange = () => { },
}) => {
  const total = totalCount ?? data.length;

  return (
    <div className="w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-green-700">{title}</h2>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-0.5 text-xs font-semibold text-green-700">
              {total - 1} Total
            </span>
            <div className="group relative flex items-center">
              <FiInfo className="cursor-pointer text-gray-300" size={15} />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
                {subtitle || "Health summary details."}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </span>
            </div>
          </div>
          {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
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
      <div className="hidden gap-2.5 sm:mb-2.5 sm:grid sm:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="flex items-center gap-3 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          <span>Institution</span>
        </div>
        <div className="flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Private
        </div>
        <div className="flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Public
        </div>
        <div className="flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Total
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2.5">
        {data.map((row, i) => {
          const totalRow = !!row.isTotal;
          const sn = i + 1;

          return (
            <div
              key={row.id ?? `${row.institution}-${i}`}
              className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1.6fr_1fr_1fr_1fr]"
            >
              <div className="flex items-center gap-3 rounded-lg bg-green-50 px-5 py-3">
                <span
                  className={`font-semibold text-green-700 ${totalRow ? "text-base text-black" : "text-sm"
                    }`}
                >
                  {totalRow ? "Total" : row.institution}
                </span>
              </div>

              <div
                className={`flex items-center justify-center rounded-lg bg-green-50 px-5 py-3 text-gray-700 ${totalRow ? "text-base font-bold text-black" : "text-sm font-medium"
                  }`}
              >
                {formatNumber(row.private)}
              </div>

              <div
                className={`flex items-center justify-center rounded-lg bg-green-50 px-5 py-3 text-gray-700 ${totalRow ? "text-base font-bold text-black" : "text-sm font-medium"
                  }`}
              >
                {formatNumber(row.public)}
              </div>

              <div
                className={`flex items-center justify-center rounded-lg bg-green-50 px-5 py-3 ${totalRow
                  ? "text-base font-bold text-black"
                  : "text-sm font-bold text-gray-800"
                  }`}
              >
                {formatNumber(row.total)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthCard;
