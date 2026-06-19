"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  Legend,
} from "recharts";

interface StateData {
  state?: string;
  zone?: string;
  public?: string;
  private?: number;
  other?: number;
  total?: number;
  population?: number;
  rate_graph?: number;
  per_capita?: number;
  per_person?: number;
}

interface StateBarChartProps {
  data: StateData[];
  barColor?: string;
  title?: string;
  currencySymbol?: string;
  className?: string;
  xaxis?: string;
  yaxis?: string;
}

const TooltipContent: React.FC<any> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md shadow-xl rounded-xl p-3 text-sm text-white border border-slate-700/50">
      <div className="font-bold text-slate-200 mb-2 border-b border-slate-700/50 pb-1">{label}</div>
      <div className="space-y-1.5 min-w-[200px]">
        {payload.map((item: any, idx: number) => {
          const isTotal = item.dataKey === "totalValue";
          const formattedVal = isTotal
            ? Number(item.value).toLocaleString()
            : Number(item.value).toFixed(2);
          const unit = isTotal ? " Facilities" : " per 10k Pop";

          return (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.fill || item.color }}
              />
              <span className="text-slate-300">{item.name}:</span>
              <span className="font-semibold text-white ml-auto">
                {formattedVal}{unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StateBarChart: React.FC<StateBarChartProps> = ({
  data,
  title,
  className,
}) => {
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => {
      const totalValue = Number(d.rate_graph ?? d.total ?? 0);
      let perCapitaValue = Number(d.per_capita ?? d.per_person ?? 0);
      if (!d.per_capita && !d.per_person && d.population && totalValue) {
        // Fallback calculation: per 10,000 population
        perCapitaValue = (totalValue / d.population) * 10000;
      }
      return {
        ...d,
        totalValue,
        perCapitaValue,
      };
    });
  }, [data]);

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {title && (
        <div className="mb-2 text-base font-bold text-green-800 text-center">
          {title}
        </div>
      )}
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
          >
            <XAxis
              dataKey="state"
              tick={{ fontSize: 13, fontWeight: 600 }}
              interval={0}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              hide
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              hide
            />
            <Tooltip
              content={(props) => <TooltipContent {...props} />}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", fontWeight: 600 }}
            />
            <Bar
              yAxisId="left"
              dataKey="totalValue"
              name="Total Facilities"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="totalValue"
                position="top"
                formatter={(val: any) => {
                  const num = Number(val);
                  return isNaN(num) ? String(val || "") : num.toLocaleString();
                }}
                style={{ fill: "#374151", fontWeight: 600, fontSize: 11 }}
              />
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="perCapitaValue"
              name="Per Capita (per 10k Pop)"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="perCapitaValue"
                position="top"
                formatter={(val: any) => {
                  const num = Number(val);
                  return isNaN(num) ? String(val || "") : num.toFixed(2);
                }}
                style={{ fill: "#374151", fontWeight: 600, fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StateBarChart;
