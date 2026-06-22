"use client";

import React from "react";

export type StatusKey = "yes" | "no";

export interface StatusMappingEntry {
  label: string;
  colorClass: string;
}

export interface StatusMapping {
  yes: StatusMappingEntry;
  no: StatusMappingEntry;
  // blank: StatusMappingEntry;
}

export interface TableColumn {
  key: string; // property name in data
  label: string; // column label
  type?: "status" | "text";
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
  yes: { label: "Target Met", colorClass: "bg-[#10B981]" },
  no: { label: "Target not Met", colorClass: "bg-[#EF4444]" },
};

interface StatusCircleProps {
  status?: string;
  mapping: StatusMapping;
}

const StatusCircle: React.FC<StatusCircleProps> = ({
  status,
  mapping = defaultStatusMapping,
}) => {
  const key: StatusKey = status === "Yes" ? "yes" : "no";
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
    { key: "status", label: "Status", type: "status" },
  ];

  const finalColumns = columns || defaultSingleCols;

  // Extract indicator and status columns
  const indicatorCol = finalColumns.find((col) => col.type !== "status") || defaultSingleCols[0];
  const statusCol = finalColumns.find((col) => col.type === "status") || defaultSingleCols[1];

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col gap-6 text-black">
      {title && (
        <h2 className="text-lg font-bold text-green-700 capitalize flex items-center gap-1.5 pb-3 border-b border-gray-200 w-full">
          {title}
        </h2>
      )}

      {/* Main Table Grid */}
      <div className="flex flex-col gap-3">
        {/* Header Row */}
        <div className="grid grid-cols-[4fr_1fr] gap-4 sm:gap-6">
          <div className="bg-[#00A141] text-white text-sm font-semibold rounded-xl px-5 py-3 text-left">
            {indicatorCol.label}
          </div>
          <div className="bg-[#00A141] text-white text-sm font-semibold rounded-xl px-5 py-3 text-center">
            {statusCol.label}
          </div>
        </div>

        {/* Data Rows */}
        <div className="flex flex-col gap-2.5">
          {data.map((row, idx) => {
            const indicatorValue = String(row[indicatorCol.key] || "");
            const statusValue = String(row[statusCol.key] || "");
            
            // Check status: Yes vs No
            const isMet = statusValue === "Yes";
            
            // Background/text styling for row cells
            const cellBgClass = isMet ? "bg-[#EEF7F2]" : "bg-[#FDF2F2]";
            const textClass = isMet ? "text-green-700 font-semibold" : "text-red-600 font-semibold";

            return (
              <div key={idx} className="grid grid-cols-[4fr_1fr] gap-4 sm:gap-6">
                {/* Indicator Pill */}
                <div className={`rounded-xl px-5 py-3.5 text-sm ${cellBgClass} ${textClass} text-left flex items-center`}>
                  {indicatorValue}
                </div>
                
                {/* Status Pill */}
                <div className={`rounded-xl px-5 py-3.5 ${cellBgClass} flex items-center justify-center`}>
                  <StatusCircle
                    status={statusValue}
                    mapping={statusMapping}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-6 text-sm font-semibold">
        {Object.entries(statusMapping).map(([key, { label, colorClass }]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${colorClass}`} />
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScorecardTable;
