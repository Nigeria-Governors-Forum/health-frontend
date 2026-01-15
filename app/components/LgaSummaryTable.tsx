"use client";

import React from "react";
export type LgaStatus = "safe" | "normal" | "hard" | "unknown";

export interface LgaRow {
  lga: string;
  population?: string; // you can also use number and format outside
  healthFacilities?: number | string;
  politicalWards?: number | string;
  status?: LgaStatus; // determines background accent
}

export interface LgaLookup {
  hard_to_reach_lgas: string;
  health_facilities: number;
  id: number;
  lga: string;
  lga_population: number;
  number_of_wards: number;
  page: string;
  state: string;
  year: number;
  zone: string;
}
export interface StatusStyle {
  label: string;
  bgClass: string;
  textClass?: string;
  borderClass?: string;
}

export interface LgaSummaryTableProps {
  title?: string;
  data: LgaLookup[];
  statusStyles?: Partial<Record<LgaStatus, StatusStyle>>;
}

/**
 * Default mapping:
 * - safe: green
 * - normal: light/white (no fill)
 * - hard: red
 * - unknown: gray
 */
const defaultStatusStyles: Record<LgaStatus, StatusStyle> = {
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

const LgaSummaryTable: React.FC<LgaSummaryTableProps> = ({
  title = "LGA Summary",
  data,
  statusStyles = {},
}) => {
  const styles = { ...defaultStatusStyles, ...statusStyles } as Record<
    LgaStatus,
    StatusStyle
  >;

  return (
    <div className="max-w-full bg-white rounded-2xl shadow-md p-6 text-black">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="px-4 py-3 text-left font-semibold">
                LGA
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Population
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Health Facilities
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Political Wards
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const status = row.hard_to_reach_lgas || "unknown";
              const style = styles[status as LgaStatus] || styles.unknown;
              return (
                <tr
                  key={`${row.lga}-${i}`}
                  className={`border-t border-green-700 ${
                    status === "Yes"
                      ? "bg-red-400" // you can also emphasize full row
                      : ""
                  }`}
                >
                  <td
                    className={`px-4 py-3 font-medium whitespace-nowrap ${style.textClass}`}
                  >
                    <div className="flex items-center gap-2">
                      {/* colored pill for status */}
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${
                          status === "No"
                            ? "bg-green-600"
                            : status === "Yes"
                              ? "bg-red-600"
                              : status === "unknown"
                                ? "bg-gray-500"
                                : "bg-gray-200"
                        }`}
                      />
                      <span>{row.lga}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {parseFloat(Number(row.lga_population) as any).toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.health_facilities}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.number_of_wards}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6 flex-wrap">
        {Object.entries(styles).map(([key, { label }]) => {
          const statusKey = key as LgaStatus;
          const pillColor =
            statusKey === "safe"
              ? "bg-green-600"
              : statusKey === "hard"
                ? "bg-red-600"
                : statusKey === "unknown"
                  ? "bg-gray-500"
                  : "bg-gray-200";
          return (
            <div
              key={key}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <span
                className={`inline-block h-3 w-3 rounded-full ${pillColor}`}
              />
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LgaSummaryTable;
