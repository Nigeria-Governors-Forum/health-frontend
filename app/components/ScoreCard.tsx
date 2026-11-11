"use client";

import React from "react";

export type StatusKey = 1 | 0;

export interface StatusMappingEntry {
  label: string;
  colorClass: string;
}

export type StatusMapping = Record<StatusKey, StatusMappingEntry>;

export interface TableColumn {
  key: string; // property name in data
  label: string; // column label
  type?: "value" | "text";
}

export interface ScorecardRow {
  [key: string]: string | undefined;
}

export interface ScorecardTableProps {
  title: string;
  columns?: TableColumn[];
  data: ScorecardRow[];
  statusMapping?: StatusMapping;
}

const defaultStatusMapping: StatusMapping = {
  1: { label: "Target Met", colorClass: "bg-[#10B981]" },
  0: { label: "Target not Met", colorClass: "bg-[#EF4444]" },
};

interface StatusCircleProps {
  status?: number;
  mapping: StatusMapping;
}

const StatusCircle: React.FC<StatusCircleProps> = ({
  status,
  mapping = defaultStatusMapping,
}) => {
  const key: StatusKey = status === 1 ? 1 : 0;
  const { label, colorClass } = mapping[key];

  return (
    <div className="flex items-center justify-center">
      <span className={`inline-block h-3 w-3 rounded-full ${colorClass}`} />
      <span className="sr-only">{label}</span>
    </div>
  );
};

const ScorecardTable: React.FC<ScorecardTableProps> = ({
  title,
  columns,
  data,
  statusMapping = defaultStatusMapping,
}) => {
  // Default columns if not provided
  const defaultSingleCols: TableColumn[] = [
    { key: "indicator", label: "Indicator", type: "text" },
    { key: "value", label: "Value", type: "text" },
  ];

  const finalColumns = columns || defaultSingleCols;

  // Extract indicator and status columns
  const indicatorCol =
    finalColumns.find((col) => col.type !== "value") || defaultSingleCols[0];
  const statusCol =
    finalColumns.find((col) => col.type === "value") || defaultSingleCols[1];

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col gap-6 text-black">
      {title && (
        <h2 className="text-lg font-bold text-green-700 capitalize flex items-center gap-1.5 pb-3 border-b border-gray-200 w-full">
          {title}
        </h2>
      )}

      {/* Main Table Grid */}
      {/* <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[4fr_1fr] gap-4 sm:gap-6">
          <div className="bg-[#00A141] text-white text-sm font-semibold rounded-xl px-5 py-3 text-left">
            {indicatorCol.label}
          </div>
          <div className="bg-[#00A141] text-white text-sm font-semibold rounded-xl px-5 py-3 text-center">
            {statusCol.label}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {data.map((row, idx) => {
            const indicatorValue = String(row[indicatorCol.key] || "");
            const statusValue = Number(row[statusCol.key] || 0);

            const isMet = statusValue === 1;
            
            const cellBgClass = isMet ? "bg-[#EEF7F2]" : "bg-[#FDF2F2]";
            const textClass = isMet ? "text-green-700 font-semibold" : "text-red-600 font-semibold";

            return (
              <div key={idx} className="grid grid-cols-[4fr_1fr] gap-4 sm:gap-6">
                <div className={`rounded-xl px-5 py-3.5 text-sm ${cellBgClass} ${textClass} text-left flex items-center`}>
                  {indicatorValue}
                </div>
                
                <div className={`rounded-xl px-5 py-3.5 ${cellBgClass} flex items-center justify-center`}>
                  <StatusCircle
                    status={Number(statusValue)}
                    mapping={statusMapping}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-[4fr_1fr] gap-4 sm:gap-6">
          <div className="bg-[#00A141] text-white text-sm font-semibold rounded-xl px-5 py-3 text-left">
            {indicatorCol.label}
          </div>
          <div className="bg-[#00A141] text-white text-sm font-semibold rounded-xl px-5 py-3 text-center">
            {statusCol.label}
          </div>
        </div>
        {data && data.length > 0 ? (
          data.map((row, idx) => {
            const indicatorValue = String(row[indicatorCol.key] || "");
            const statusValue = Number(row[statusCol.key] || 0);

            const isMet = statusValue === 1;

            const cellBgClass = isMet ? "bg-[#EEF7F2]" : "bg-[#FDF2F2]";
            const textClass = isMet
              ? "text-green-700 font-semibold"
              : "text-red-600 font-semibold";

            return (
              <div
                key={idx}
                className="grid grid-cols-[4fr_1fr] gap-4 sm:gap-6"
              >
                <div
                  className={`rounded-xl px-5 py-3.5 text-sm ${cellBgClass} ${textClass} text-left flex items-center`}
                >
                  {indicatorValue}
                </div>

                <div
                  className={`rounded-xl px-5 py-3.5 ${cellBgClass} flex items-center justify-center`}
                >
                  <StatusCircle
                    status={Number(statusValue)}
                    mapping={statusMapping}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-semibold text-gray-500">
              No data available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              There are currently no records available for this category.
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-6 text-sm font-semibold">
        {Object.entries(statusMapping).map(([key, { label, colorClass }]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${colorClass}`} />
            <span className="text-gray-600">{label} </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScorecardTable;
