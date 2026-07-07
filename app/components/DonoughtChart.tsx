"use client";

import { FiInfo } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type DonutChartProps = {
  title: string;
  data: { name: string; value: number; color: string }[];
  innerRadius?: number;
  outerRadius?: number;
  subtitle?: string;
  height?: number;
};

export default function DonutChart({
  title,
  data,
  innerRadius = 85,
  outerRadius = 115,
  subtitle,
  height = 300,
}: DonutChartProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-black border-2 border-[#D6D6D6] w-full">
      <h2 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2"> {title}
        <div className="group relative flex items-center">
          <FiInfo className="cursor-pointer text-green-900" size={20} />
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
            {subtitle || "Donut chart breakdown of distribution percentages."}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </span>
        </div>
      </h2>

      <div className="w-full flex justify-center" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              cornerRadius="50%"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "0.85rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-1">
        {data.map((d, i) => (
          <p key={i} className="text-sm text-center">
            <span
              className="inline-block w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            {d.name}: {d.value} %
          </p>
        ))}
      </div>
    </div>
  );
}
