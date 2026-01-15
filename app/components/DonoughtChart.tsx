"use client";

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
  innerRadius = 60,
  outerRadius = 80,
}: DonutChartProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center text-black">
      <h2 className="text-lg font-semibold text-green-700 mb-4">{title}</h2>

      <PieChart width={250} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={1}
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
