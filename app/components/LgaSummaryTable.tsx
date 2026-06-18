// "use client";

// import React from "react";
// export type LgaStatus = "safe" | "normal" | "hard" | "unknown";

// export interface LgaRow {
//   lga: string;
//   population?: string; // you can also use number and format outside
//   healthFacilities?: number | string;
//   politicalWards?: number | string;
//   status?: LgaStatus; // determines background accent
// }

// export interface LgaLookup {
//   hard_to_reach_lgas: string;
//   health_facilities: number;
//   id: number;
//   lga: string;
//   lga_population: number;
//   number_of_wards: number;
//   page: string;
//   state: string;
//   year: number;
//   zone: string;
// }
// export interface StatusStyle {
//   label: string;
//   bgClass: string;
//   textClass?: string;
//   borderClass?: string;
// }

// export interface LgaSummaryTableProps {
//   title?: string;
//   data: LgaLookup[];
//   statusStyles?: Partial<Record<LgaStatus, StatusStyle>>;
// }

// /**
//  * Default mapping:
//  * - safe: green
//  * - normal: light/white (no fill)
//  * - hard: red
//  * - unknown: gray
//  */
// const defaultStatusStyles: Record<LgaStatus, StatusStyle> = {
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

// const LgaSummaryTable: React.FC<LgaSummaryTableProps> = ({
//   title = "LGA Summary",
//   data,
//   statusStyles = {},
// }) => {
//   const styles = { ...defaultStatusStyles, ...statusStyles } as Record<
//     LgaStatus,
//     StatusStyle
//   >;

//   return (
//     <div className="max-w-full bg-white rounded-2xl shadow-md p-6 text-black">
//       <h2 className="text-2xl font-bold text-green-700 mb-4">
//         {title}
//       </h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-green-800 text-white">
//               <th className="px-4 py-3 text-left font-semibold">
//                 LGA
//               </th>
//               <th className="px-4 py-3 text-center font-semibold">
//                 Population
//               </th>
//               <th className="px-4 py-3 text-center font-semibold">
//                 Health Facilities
//               </th>
//               <th className="px-4 py-3 text-center font-semibold">
//                 Political Wards
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, i) => {
//               const status = row.hard_to_reach_lgas || "unknown";
//               const style = styles[status as LgaStatus] || styles.unknown;
//               return (
//                 <tr
//                   key={`${row.lga}-${i}`}
//                   className={`border-t border-green-700 ${
//                     status === "Yes"
//                       ? "bg-red-400" // you can also emphasize full row
//                       : ""
//                   }`}
//                 >
//                   <td
//                     className={`px-4 py-3 font-medium whitespace-nowrap ${style.textClass}`}
//                   >
//                     <div className="flex items-center gap-2">
//                       {/* colored pill for status */}
//                       <span
//                         className={`inline-block h-3 w-3 rounded-full ${
//                           status === "No"
//                             ? "bg-green-600"
//                             : status === "Yes"
//                               ? "bg-red-600"
//                               : status === "unknown"
//                                 ? "bg-gray-500"
//                                 : "bg-gray-200"
//                         }`}
//                       />
//                       <span>{row.lga}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     {parseFloat(Number(row.lga_population) as any).toFixed(0)}
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     {row.health_facilities}
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     {row.number_of_wards}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Legend */}
//       <div className="mt-6 flex gap-6 flex-wrap">
//         {Object.entries(styles).map(([key, { label }]) => {
//           const statusKey = key as LgaStatus;
//           const pillColor =
//             statusKey === "safe"
//               ? "bg-green-600"
//               : statusKey === "hard"
//                 ? "bg-red-600"
//                 : statusKey === "unknown"
//                   ? "bg-gray-500"
//                   : "bg-gray-200";
//           return (
//             <div
//               key={key}
//               className="flex items-center gap-2 text-sm font-medium"
//             >
//               <span
//                 className={`inline-block h-3 w-3 rounded-full ${pillColor}`}
//               />
//               <span>{label}</span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default LgaSummaryTable;

"use client";

import React from "react";
import {
  FiSearch,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export type LgaStatus = "safe" | "hard";

export interface LgaRow {
  lga: string;
  population?: string; // you can also use number and format outside
  healthFacilities?: number | string;
  politicalWards?: number | string;
  status?: LgaStatus;
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
  dotClass: string;
  pillBgClass: string;
  textClass: string;
}

/**
 * Default mapping:
 * - safe: light green pill, green text/name
 * - hard: light red pill, red text/name
 */
const defaultStatusStyles: Record<LgaStatus, StatusStyle> = {
  safe: {
    label: "Safe",
    dotClass: "bg-green-600",
    pillBgClass: "bg-green-50",
    textClass: "text-green-700",
  },
  hard: {
    label: "Hard to Reach",
    dotClass: "bg-red-500",
    pillBgClass: "bg-red-100",
    textClass: "text-red-500",
  },
};

export interface LgaSummaryTableProps {
  title?: string;
  subtitle?: string;
  data: LgaLookup[];
  /** Shown in the "X Total" badge. Defaults to data.length */
  totalCount?: number;
  /** Used only to calculate the SN column across pages */
  pageSize?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  currentPage?: number;
  totalPages?: number;
  /** Total rows across all pages, for the "Showing X of Y results" line */
  totalResults?: number;
  onPageChange?: (page: number) => void;
  statusStyles?: Partial<Record<LgaStatus, StatusStyle>>;
}

function isHardToReach(value?: string) {
  return (value || "").toString().trim().toLowerCase() === "yes";
}

function formatNumber(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("en-US");
}

/** Produces e.g. [1,2,3,4,5,'...',99] the way the target design shows it. */
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

const LgaSummaryTable: React.FC<LgaSummaryTableProps> = ({
  title = "LGA Summary",
  subtitle = "List of LGA Summary",
  data,
  totalCount,
  pageSize = 10,
  searchValue = "",
  onSearchChange = () => {},
  currentPage = 1,
  totalPages = 1,
  totalResults,
  onPageChange = () => {},
  statusStyles = {},
}) => {
  const styles = { ...defaultStatusStyles, ...statusStyles } as Record<
    LgaStatus,
    StatusStyle
  >;

  const total = totalCount ?? data.length;
  const resultsTotal = totalResults ?? data.length;
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
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
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
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
      <div className="hidden gap-x-4 sm:mb-2.5 sm:grid sm:grid-cols-[1.7fr_1fr_1.3fr]">
        <div className="flex items-center gap-3 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          <span className="w-8">SN</span>
          <span>Local Government Area</span>
        </div>
        <div className="flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Population
        </div>
        <div className="flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
          Political Wards
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2.5">
        {data.map((row, i) => {
          const hard = isHardToReach(row.hard_to_reach_lgas);
          const style = hard ? styles.hard : styles.safe;
          const sn = (currentPage - 1) * pageSize + i + 1;

          return (
            <div
              key={row.id ?? `${row.lga}-${i}`}
              className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1.7fr_1fr_1.3fr] sm:gap-x-4"
            >
              <div
                className={`flex items-center gap-3 rounded-full px-5 py-3 text-sm ${style.pillBgClass}`}
              >
                <span
                  className={`w-8 font-medium ${
                    hard ? style.textClass : "text-gray-500"
                  }`}
                >
                  {String(sn).padStart(2, "0")}
                </span>
                <span
                  className={`font-semibold ${
                    hard ? style.textClass : "text-green-700"
                  }`}
                >
                  {row.lga}
                </span>
              </div>

              <div
                className={`flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-gray-700 ${style.pillBgClass}`}
              >
                <span className="mr-1 text-xs text-gray-400 sm:hidden">
                  Population:
                </span>
                {formatNumber(row.lga_population)}
              </div>

              <div
                className={`flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-gray-700 ${style.pillBgClass}`}
              >
                <span className="mr-1 text-xs text-gray-400 sm:hidden">
                  Wards:
                </span>
                {row.number_of_wards}
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
                  className={`flex h-7 w-7 items-center justify-center rounded-full font-medium ${
                    p === currentPage
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
        {(Object.keys(styles) as LgaStatus[]).map((key) => (
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

export default LgaSummaryTable;
