"use client";

import React from "react";
import { formatNumber } from "../hooks/TopbarFiltersContext";

export type Status = "safe" | "normal" | "hard" | "unknown";

export interface SummaryRow {
  name: string;
  private?: number; // you can also use number and format outside
  public?: number | string;
  total?: number | string;
  status?: Status; // determines background accent
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
  title = "LGA Summary",
  data,
  statusStyles = {},
}) => {
  const styles = { ...defaultStatusStyles, ...statusStyles } as Record<
    Status,
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
                Level
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Private
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Public
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const status = row.status || "unknown";
              const style = styles[status];
              const isLast = i === data.length - 1;

              return (
                <tr
                  key={i}
                  className={`border-t border-green-700 ${
                    status === "hard"
                      ? "bg-red-400" // you can also emphasize full row
                      : ""
                  } ${isLast? "text-xl" : ""}`} 
                >
                  <td
                    className={`px-4 py-3 font-medium whitespace-nowrap ${style.textClass}`}
                  >
                    <div className="flex items-center gap-2">
                      {/* colored pill for status */}
                      {/* <span
                        className={`inline-block h-3 w-3 rounded-full ${
                          row.name === "Total"
                            ? "bg-green-600"
                            : status === "hard"
                              ? "bg-red-600"
                              : status === "unknown"
                                ? "bg-gray-500"
                                : "bg-gray-200"
                        }`}
                      /> */}
                      <span> {row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row?.private}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.public}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-2xl"></span>
                    {formatNumber(Number(row.total)) || "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
