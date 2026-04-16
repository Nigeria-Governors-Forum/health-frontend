"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

type LineChartProps = {
  title: string;
  data: ({ year: string } & { [key: string]: number | string })[];
  lines: { key: string; name: string; color: string }[];
};

export default function MultiLineChart({ title, data, lines }: LineChartProps) {
  const Info = "/svg/info.svg";
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-[#07923F] mb-4 flex items-center gap-2">{title}
        <Image
          src={Info}
          alt="Info"
          width={20}
          height={20}
        />
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(val) => `${val}%`} />
          <Tooltip formatter={(val) => `${val}%`} />
          <Legend />

          {lines.map((line, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            >
              {/* ✅ Show values on each point */}
              <LabelList dataKey={line.key} position="top" formatter={(val) => `${val}%`} />
            </Line>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
