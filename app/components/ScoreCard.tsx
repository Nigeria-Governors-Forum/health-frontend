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
  yes: { label: "Yes", colorClass: "bg-green-600" },
  no: { label: "No", colorClass: "bg-red-500" },
  // blank: { label: "No Data", colorClass: "bg-black" },
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
      <span
        className={`inline-block h-4 w-4 rounded-full ${colorClass}`}
      />
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

  return (
    <div className="max-w-full bg-white rounded-2xl shadow-md p-4 text-black overflow-hidden">
      <h2 className="text-lg font-bold mb-4 capitalize">{title}</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-green-800 text-white">
              {finalColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="even:bg-gray-100 odd:bg-white border-t border-green-700"
              >
                {finalColumns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 whitespace-nowrap"
                  >
                    {col.type === "status" ? (
                      <StatusCircle
                        status={row[col.key]}
                        mapping={statusMapping}
                      />
                    ) : (
                      <span>{row[col.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 justify-center overflow-hidden">
        {Object.entries(statusMapping).map(([key, { label, colorClass }]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className={`inline-block h-4 w-4 rounded-full ${colorClass}`}
            />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScorecardTable;
