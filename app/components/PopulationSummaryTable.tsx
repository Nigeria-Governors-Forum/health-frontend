"use client";

import React from "react";

export interface LgaRow {
  id: number;
  occupation: string;
  number?: string;
  density?: number | string;
  target?: number | string;
  institution?: string;
  page?: string;
  state?: string;
  year?: number;
  zone?: string;
}

interface PopulationSummaryTableProps {
  title?: string;
  data: LgaRow[];
}

const PopulationSummaryTable: React.FC<PopulationSummaryTableProps> = ({
  title = "Population by LGA",
  data,
}) => {
  // helper to decide density color
  const getDensityColor = (density?: number) => {
    if (density === undefined || isNaN(density)) return "bg-gray-200"; // unknown
    if (density <= 0.5) return "bg-red-500"; // critical
    if (density < 5) return "bg-white"; // warning
    return "bg-green-500"; // safe
  };

  return (
    <div className="max-w-full bg-white rounded-2xl shadow-md p-6 text-black">
      <h2 className="text-xl font-bold text-green-700 mb-4">
        {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="px-4 py-3 text-left font-semibold">
                Occupation
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Number
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Density/10,000
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Target
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const densityVal = Number(row.density);
              const densityColor = getDensityColor(densityVal);

              return (
                <tr
                  key={`${row.occupation}-${i}`}
                  className="border-t border-green-700"
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* density pill */}
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${densityColor}`}
                      />
                      <span>{row.institution}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.number}
                  </td>
                  <td
                    // className={`px-4 py-3 text-center font-semibold ${densityColor}`}
                    className={`px-4 py-3 text-center font-semibold`}
                  >
                    {isNaN(densityVal)
                      ? "N/A"
                      : parseFloat(densityVal.toFixed(0))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row?.target || 15}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
          <span>Critical (≤ 0)</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="inline-block h-3 w-3 rounded-full bg-yellow-400" />
          <span>Low (&lt; 5)</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
          <span>Safe (≥ 5)</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
          <span>Unknown</span>
        </div>
      </div>
    </div>
  );
};

export default PopulationSummaryTable;
