"use client";

import { FiInfo } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

type DonutChartProps = {
  title: string;
  data: { name: string; value: number; color: string }[];
  innerRadius?: number;
  outerRadius?: number;
};

export default function DonutChart({
  title,
  data,
  innerRadius = 70,
  outerRadius = 100,
}: DonutChartProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-black border-2 border-[#D6D6D6]">
      <h2 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2"> {title}
        <FiInfo className="text-green-900" size={20} />

      </h2>

      <PieChart width={250} height={250} >
        <Pie
          data={data}
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

      <div className="mt-2 space-y-1">
        {data.map((d, i) => (
          <p key={i} className="text-sm">
            <span
              className="inline-block w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            {d.name}: {d.value}%
          </p>
        ))}
      </div>
    </div>
  );
}
