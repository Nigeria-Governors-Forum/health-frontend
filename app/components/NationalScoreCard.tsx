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
}

export interface ScorecardItem {
  id: number;
  zone?: string;
  state?: string;
  name?: string;
  round?: string;
  year?: number;
  indicator?: string;
  status?: string;
  value?: number;
}

export interface ScorecardTableProps {
  title: string;
  data: Record<string, ScorecardItem[]>; // { Abia: [...], Adamawa: [...] }
  statusMapping?: StatusMapping;
}

const defaultStatusMapping: StatusMapping = {
  yes: { label: "Yes", colorClass: "bg-green-600" },
  no: { label: "No", colorClass: "bg-red-500" },
};

interface StatusCircleProps {
  status?: string;
  mapping: StatusMapping;
}

const StatusCircle: React.FC<StatusCircleProps> = ({
  status,
  mapping = defaultStatusMapping,
}) => {
  const key: StatusKey = status?.toLowerCase() === "yes" ? "yes" : "no";
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

const NationalScorecardTable: React.FC<ScorecardTableProps> = ({
  title,
  data,
  statusMapping = defaultStatusMapping,
}) => {
  // 1) collect all unique indicators from the data
  const uniqueIndicators = Array.from(
    new Set(
      Object.values(data).flatMap((records) =>
        records.map((r) => r.indicator?.trim())
      )
    )
  ).filter(Boolean) as string[];

  // 2) define columns: first column is "State", rest are indicators
  const columns = [
    { key: "state", label: "State", type: "text" as const },
    ...uniqueIndicators.map((indicator) => ({
      key: indicator.replace(/\s+/g, "_").toLowerCase(), // normalized key
      label: indicator,
      type: "status" as const,
    })),
  ];

  // 3) transform rows: map indicator → status
  const rows = Object.entries(data).map(([state, records]) => {
    const row: Record<string, any> = { state };
    records.forEach((r) => {
      const key = r.indicator?.trim().replace(/\s+/g, "_").toLowerCase();
      if (key) row[key] = r.status;
    });
    return row;
  });

  return (
    <div className="max-w-full bg-white rounded-2xl shadow-md p-4 text-black">
      <h2 className="text-lg font-bold mb-4 capitalize">{title}</h2>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-[600px] w-full border-collapse">
          <thead>
            <tr className="bg-green-800 text-white">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-semibold"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="even:bg-gray-100 odd:bg-white border-t border-green-700"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-center break-words"
                  >
                    {col.type === "status" ? (
                      <StatusCircle
                        status={row[col.key]}
                        mapping={statusMapping}
                      />
                    ) : (
                      <span className="font-medium">{row[col.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 justify-center">
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

export default NationalScorecardTable;
