import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563eb", "#f97316", "#a855f7", "#E5D0FF"]; //Blue,Orange, Purple, Yellow,
interface DataCardProps {
  title: string;
  secondTitle?: string;
  initialData: any;
  alternateData?: any;
}

export default function DataCard({
  title,
  secondTitle,
  initialData,
  alternateData,
}: DataCardProps) {
  const [enabled, setEnabled] = useState(false);

  const data = enabled && alternateData ? alternateData : initialData;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-auto">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-green-800">
          {enabled ? secondTitle : title}
        </h2>
        {alternateData && (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-500 relative transition-all duration-300">
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${enabled ? "translate-x-5" : ""}`}
              />
            </div>
          </label>
        )}
      </div>

      {/* Pie Chart */}
      <div className="h-60 mt-6">
        <ResponsiveContainer>
          <PieChart >
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, value }) => {
                const total = data.reduce(
                  (acc: number, d: any) => acc + d.value,
                  0
                );
                const percent =
                  total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                return `${value} (${percent}%)`;
              }}
            >
              {data.map((_: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined, _name, props: any) => {
                const total = data.reduce(
                  (acc: number, d: any) => acc + d.value,
                  0
                );
                const percent =
                  total > 0 && value ? ((value / total) * 100).toFixed(0) : 0;
                return [`${value} (${percent}%)`, props.payload.name];
              }}
            />
            <Legend verticalAlign="top" height={36} />

          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Row */}
      {/* <div className="flex justify-around text-sm gap-4 text-gray-700">
        {data.map((item: any, idx: number) => (
          <span
            key={idx}
            className={`font-medium text-center`}
            style={{ color: COLORS[idx % COLORS.length] }}
          >
            {item.value} <br />
            <span className="text-xs">{item.name}</span>
          </span>
        ))}
      </div> */}
    </div>
  );
}
