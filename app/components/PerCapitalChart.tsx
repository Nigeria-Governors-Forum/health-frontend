import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
  highlight?: boolean;
};

interface PerCapitaExpenditureChartProps {
  title: string;
  data: ChartData[];
  highlightColor?: string;
  defaultColor?: string;
  currencySymbol?: string;
  maxValue?: number;
}

const PerCapitaExpenditureChart: React.FC<PerCapitaExpenditureChartProps> = ({
  title,
  data,
  highlightColor = "#2196f3", // blue for highlights
  defaultColor = "#bbdefb", // light blue for others
  currencySymbol = "₦",
  maxValue,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis
            domain={[0, maxValue || "dataMax"]}
            tickFormatter={(val) =>
              `${currencySymbol}${val >= 1000 ? val / 1000 + "K" : val}`
            }
          />
          <Tooltip
            formatter={(label: React.ReactNode) => {
              if (typeof label === "number") {
                return `${currencySymbol}${label.toLocaleString()}`;
              }
              return label;
            }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            fill="#8884d8"
            // Dynamic color based on highlight
            fillOpacity={1}
          >
            <LabelList
              dataKey="value"
              position="top"
              formatter={(label: React.ReactNode) => {
                if (typeof label === "number") {
                  return `${currencySymbol}${label.toLocaleString()}`;
                }
                return label;
              }}
            />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.highlight ? highlightColor : defaultColor}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerCapitaExpenditureChart;
