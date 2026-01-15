"use client";

import { stat } from "fs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

interface DataProps {
  healthBudget?: number;
  state?: string;
  stateBudget?: number;
  total?: number;
  name?: string;
  value?: number;
  color?: string;
}

type BarChartProps = {
  title: string;
  data: DataProps[];
  benchmark?: number; // reference line value (optional)
};

export default function CustomBarChart({
  title,
  data,
  benchmark,
}: BarChartProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="state" />
          <YAxis
            tickFormatter={(val) => `${val}%`}
            domain={[
              0,
              (dataMax: number) => Math.ceil(dataMax / 10) * 10, // round up to nearest 10
            ]}
          />
          <Tooltip
            labelFormatter={(label: string) => `State: ${label}`}
            formatter={(val: number) => [`${val}%`, "Total"]}
          />

          {/* ✅ Reference Line */}
          {benchmark && (
            <ReferenceLine
              y={benchmark}
              stroke="green"
              strokeDasharray="4 4"
              label={{
                value: `${benchmark.toLocaleString()}%`,
                position: "right",
                fill: "green",
                fontSize: 12,
              }}
            />
          )}

          <Bar dataKey="total" radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={(entry?.total ?? 0) < 15 ? "#EF4444" : "#22C55E"}
              />
            ))}
            <LabelList
              dataKey="total"
              position="top"
              formatter={(val: any) => `${val}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
