"use client";

import React from "react";

export type IndicatorStatus = "met" | "not_met";

export interface IndicatorRow {
  id?: number;
  indicator: string;
  status: IndicatorStatus;
}

export interface IndicatorStatusTableProps {
  title?: string;
  data: IndicatorRow[];
  className?: string;
}

const IndicatorStatusTable: React.FC<IndicatorStatusTableProps> = ({
  data,
  className = "",
}) => {
  return (
    <div
      className={`w-full rounded-2xl border border-gray-100 bg-white p-3 md:p-4 shadow-sm ${className}`}
    >
      {/* Column headers */}
      <div className="mb-2.5 flex gap-2.5 overflow-x-auto pb-2">
        <div className="flex flex-1 min-w-max md:min-w-0 items-center gap-2 md:gap-4 rounded-full bg-green-700 px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-semibold text-white">
          <span className="w-6 md:w-8 shrink-0">SN</span>
          <span>Indicator</span>
        </div>
        <div className="flex w-24 md:w-48 shrink-0 items-center justify-center rounded-full bg-green-700 px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-semibold text-white">
          Status
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2 overflow-x-auto pb-2">
        {data.map((row, i) => {
          const notMet = row.status === "not_met";
          const sn = String(i + 1).padStart(2, "0");

          return (
            <div
              key={row.id ?? `${row.indicator}-${i}`}
              className="flex gap-2.5 min-w-max md:min-w-0"
            >
              {/* Indicator cell */}
              <div
                className={`flex flex-1 min-w-max md:min-w-0 items-center gap-2 md:gap-4 rounded-full px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-medium ${
                  notMet
                    ? "bg-red-50 text-red-500"
                    : "bg-green-50 text-gray-700"
                }`}
              >
                <span
                  className={`w-6 md:w-8 shrink-0 font-semibold ${
                    notMet ? "text-red-400" : "text-gray-500"
                  }`}
                >
                  {sn}
                </span>
                <span className={notMet ? "font-semibold text-red-500" : ""}>
                  {row.indicator}
                </span>
              </div>

              {/* Status dot cell */}
              <div
                className={`flex w-24 md:w-48 shrink-0 items-center justify-center rounded-full ${
                  notMet ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full ${
                    notMet ? "bg-red-500" : "bg-green-600"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
          Target Met
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Target not Met
        </div>
      </div>
    </div>
  );
};

export default IndicatorStatusTable;