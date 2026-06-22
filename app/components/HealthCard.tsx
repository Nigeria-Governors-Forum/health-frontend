// "use client";

// import React from "react";
// import { formatNumber } from "../dashboard/page";

// export type Status = "safe" | "normal" | "hard" | "unknown";

// export interface SummaryRow {
//   institution: string;
//   private?: number; // you can also use number and format outside
//   public?: number | string;
//   total?: number | string;
//   status?: Status; // determines background accent
// }

// export interface StatusStyle {
//   label: string;
//   bgClass: string;
//   textClass?: string;
//   borderClass?: string;
// }

// export interface SummaryTableProps {
//   title?: string;
//   data: SummaryRow[];
//   statusStyles?: Partial<Record<Status, StatusStyle>>;
// }

// /**
//  * Default mapping:
//  * - safe: green
//  * - normal: light/white (no fill)
//  * - hard: red
//  * - unknown: gray
//  */
// const defaultStatusStyles: Record<Status, StatusStyle> = {
//   safe: {
//     label: "Safe",
//     bgClass: "bg-green-100",
//     textClass: "text-black",
//     borderClass: "border-green-700",
//   },
//   normal: {
//     label: "Normal",
//     bgClass: "bg-white",
//     textClass: "text-black",
//     borderClass: "border-green-700",
//   },
//   hard: {
//     label: "Hard to Reach",
//     bgClass: "bg-red-500 text-white",
//     textClass: "text-white",
//     borderClass: "border-red-700",
//   },
//   unknown: {
//     label: "Unknown",
//     bgClass: "bg-gray-200",
//     textClass: "text-black",
//     borderClass: "border-green-700",
//   },
// };

// const HealthCard: React.FC<SummaryTableProps> = ({
//   title = "LGA Summary",
//   data,
//   statusStyles = {},
// }) => {
//   const styles = { ...defaultStatusStyles, ...statusStyles } as Record<
//     Status,
//     StatusStyle
//   >;

//   return (
//     <div className="max-w-full bg-white rounded-2xl shadow-md p-6 text-black">
//       <h2 className="text-lg font-bold text-green-700 mb-4">{title}</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-green-800 text-white">
//               <th className="px-4 py-3 text-left font-semibold">Institution</th>
//               <th className="px-4 py-3 text-center font-semibold">Private</th>
//               <th className="px-4 py-3 text-center font-semibold">Public</th>
//               <th className="px-4 py-3 text-center font-semibold">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, i) => {
//               const status = row.status || "unknown";
//               const style = styles[status];
//               const isLast = i === data.length - 1;

//               return (
//                 <tr
//                   key={i}
//                   className={`border-t border-green-700 ${
//                     status === "hard"
//                       ? "bg-red-400" // you can also emphasize full row
//                       : ""
//                   } ${isLast? "ui:text-xl" : ""}`}
//                 >
//                   <td
//                     className={`px-4 py-3 font-medium whitespace-nowrap ${style.textClass}`}
//                   >
//                     <div className="flex items-center gap-2">
//                       {/* colored pill for status */}
//                       {/* <span
//                         className={`inline-block h-3 w-3 rounded-full ${
//                           row.institution === "Total"
//                             ? "bg-green-600"
//                             : status === "hard"
//                               ? "bg-red-600"
//                               : status === "unknown"
//                                 ? "bg-gray-500"
//                                 : "bg-gray-200"
//                         }`}
//                       /> */}
//                       <span>{row.institution}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-center">{row?.private}</td>
//                   <td className="px-4 py-3 text-center">{row.public}</td>
//                   <td className="px-4 py-3 text-center">
//                     {formatNumber(Number(row.total)) || "N/A"}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default HealthCard;

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
  onSearchChange = () => {},
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
              {total} Total
            </span>
            <FiInfo className="text-gray-300" size={15} />
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
        <div className="flex items-center gap-3 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          <span className="w-8">SN</span>
          <span>Institution</span>
        </div>
        <div className="flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Private
        </div>
        <div className="flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Public
        </div>
        <div className="flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
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
              <div className="flex items-center gap-3 rounded-full bg-green-50 px-5 py-3">
                {!totalRow && (
                  <span className="w-8 text-sm font-medium text-gray-500">
                    {String(sn).padStart(2, "0")}
                  </span>
                )}
                <span
                  className={`font-semibold text-green-700 ${
                    totalRow ? "text-base text-black" : "text-sm"
                  }`}
                >
                  {totalRow ? "Total" : row.institution}
                </span>
              </div>

              <div
                className={`flex items-center justify-center rounded-full bg-green-50 px-5 py-3 text-gray-700 ${
                  totalRow ? "text-base font-bold text-black" : "text-sm font-medium"
                }`}
              >
                {formatNumber(row.private)}
              </div>

              <div
                className={`flex items-center justify-center rounded-full bg-green-50 px-5 py-3 text-gray-700 ${
                  totalRow ? "text-base font-bold text-black" : "text-sm font-medium"
                }`}
              >
                {formatNumber(row.public)}
              </div>

              <div
                className={`flex items-center justify-center rounded-full bg-green-50 px-5 py-3 ${
                  totalRow
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
