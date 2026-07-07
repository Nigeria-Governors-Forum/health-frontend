// "use client";

// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
//   LabelList,
// } from "recharts";

// export interface StateValue {
//   color?: string;
//   budget?: number;
//   id?: number | string;
//   indicator?: string;
//   lga?: string;
//   per_capita?: number;
//   population?: number;
//   state?: string;
//   year?: number;
//   zone?: string;
// }

// export interface LgaPerCapitaBarChartProps {
//   data: StateValue[];
//   title?: string;
//   currencySymbol?: string;
//   className?: string;
//   barColor?: string;
//   max?: number; // global max if given
//   autoScale?: boolean; // 👈 new toggle
//   showValueSuffix?: string;
// }

// const defaultColors = ["#2563EB"];

// const formatCurrency = (val: number, symbol = "₦") =>
//   symbol + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// const TooltipContent: React.FC<any> = ({
//   active,
//   payload,
//   label,
//   currencySymbol,
//   suffix,
// }) => {
//   if (!active || !payload || !payload.length) return null;
//   const entry = payload[0].payload as StateValue;
//   return (
//     <div className="bg-black shadow rounded p-2 text-sm border border-gray-200">
//       <div className="font-semibold mb-1">{entry.lga ?? entry.state}</div>
//       <div>
//         {formatCurrency(Number(entry.population ?? 0), currencySymbol)}
//         {suffix}
//       </div>
//     </div>
//   );
// };

// const LgaPerCapitaBarChart: React.FC<LgaPerCapitaBarChartProps> = ({
//   data,
//   title,
//   currencySymbol = "₦",
//   className = "",
//   barColor = "#2563EB",
//   max,
//   autoScale = true,
//   showValueSuffix = "",
// }) => {
//   const effectiveMax = autoScale
//     ? Math.max(...data.map((d) => Number(d.per_capita) || 0), 0)
//     : max && max > 0
//       ? max
//       : Math.max(...data.map((d) => Number(d.per_capita) || 0), 0);

//   return (
//     <div className={className}>
//       {title && (
//         <div className="text-lg font-semibold mb-2 text-green-700">
//           {title}
//         </div>
//       )}
//       <div className="w-full h-[500px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             key={data.map((item) => item?.id).join("-")}
//             data={data}
//             layout="vertical"
//             margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
//             barCategoryGap="20%"
//           >
//             <XAxis
//               type="number"
//               domain={[0, Math.ceil(effectiveMax * 1.05)]}
//               hide
//             />
//             <YAxis
//               dataKey="lga"
//               type="category"
//               width={120}
//               tick={{ fontSize: 14, fontWeight: 600 }}
//               axisLine={false}
//               tickLine={false}
//               interval={0}
//             />
//             <Tooltip
//               content={(props) => (
//                 <TooltipContent
//                   {...props}
//                   currencySymbol={currencySymbol}
//                   suffix={showValueSuffix}
//                 />
//               )}
//               wrapperStyle={{ outline: "none" }}
//             />
//             <Bar
//               dataKey="per_capita"
//               isAnimationActive={false}
//               maxBarSize={24}
//               background={{ fill: "#f3f4f6" }}
//             >
//               {data.map((entry, idx) => {
//                 const color =
//                   entry.color ||
//                   defaultColors[idx % defaultColors.length] ||
//                   barColor;
//                 return <Cell key={`cell-${entry.id}-${idx}`} fill={color} />;
//               })}
//               <LabelList
//                 dataKey="Per_Capita"
//                 position="right"
//                 formatter={(v: any) =>
//                   `${formatCurrency(Number(v || 0), currencySymbol)}${showValueSuffix}`
//                 }
//                 style={{ fill: "#1f2d3a", fontWeight: 600, fontSize: 12 }}
//               />
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default LgaPerCapitaBarChart;

"use client";
import React from "react";
import { FiInfo } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface StateValue {
  color?: string;
  budget?: number;
  id?: number | string;
  indicator?: string;
  lga?: string;
  per_capita?: number;
  population?: number;
  state?: string;
  year?: number;
  zone?: string;
}

export interface LgaPerCapitaBarChartProps {
  data: StateValue[];
  title?: string;
  currencySymbol?: string;
  className?: string;
  barColor?: string;
  max?: number;
  autoScale?: boolean;
  showValueSuffix?: string;
  totalCount?: number;
  subtitle?: string;
}

const formatCurrency = (val: number, symbol = "₦") =>
  symbol + Math.round(val).toLocaleString("en-US");

const TooltipContent: React.FC<any> = ({
  active,
  payload,
  currencySymbol,
  suffix,
}) => {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0].payload as StateValue;
  return (
    <div className="bg-black shadow rounded p-2 text-sm border border-gray-700">
      <div className="font-semibold mb-1 text-white">{entry.lga ?? entry.state}</div>
      <div className="text-gray-200">
        {formatCurrency(Number(entry.per_capita ?? 0), currencySymbol)}
        {suffix}
      </div>
    </div>
  );
};

const ROW_HEIGHT = 48;
const LABEL_WIDTH = 130;
const VALUE_WIDTH = 120;
const BAR_HEIGHT = 16;

const LgaPerCapitaBarChart: React.FC<LgaPerCapitaBarChartProps> = ({
  data,
  title,
  currencySymbol = "₦",
  className = "",
  barColor = "#2563EB",
  max,
  autoScale = true,
  showValueSuffix = "",
  totalCount,
  subtitle,
}) => {
  const effectiveMax = autoScale
    ? Math.max(...data.map((d) => Number(d.per_capita) || 0), 0)
    : max && max > 0
      ? max
      : Math.max(...data.map((d) => Number(d.per_capita) || 0), 0);

  const chartHeight = data.length * ROW_HEIGHT;

  return (
    <div
      className={`relative bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
          {/* Icon */}
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="18" rx="2" />
              <path d="M8 10h8M8 14h5" />
            </svg>
          </div>
          <span className="font-bold text-green-700 text-base">{title}</span>
          {/* Info icon */}
          <div className="group relative flex items-center">
            <FiInfo className="cursor-pointer text-green-900" size={20} />
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
              {subtitle || "LGA per capita data."}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </span>
          </div>

          {/* Total badge */}
          {totalCount !== undefined && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              {totalCount} Total
            </span>
          )}
        </div>
      )}

      {/* Column headers */}
      <div
        className="flex items-center justify-between bg-[#F8FAFC] border-b border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
        style={{ paddingLeft: 16, paddingRight: 16 }}
      >
        <div style={{ width: LABEL_WIDTH }}>LGA</div>
        <div>Amount</div>
      </div>

      {/* Rows */}
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            key={data.map((item) => item?.id).join("-")}
            data={data}
            layout="vertical"
            margin={{
              top: 0,
              right: VALUE_WIDTH,
              left: LABEL_WIDTH,
              bottom: 0,
            }}
            barCategoryGap="40%"
          >
            <XAxis
              type="number"
              domain={[0, Math.ceil(effectiveMax * 1.05)]}
              hide
            />
            <YAxis
              dataKey="lga"
              type="category"
              width={0}
              tick={false}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip
              content={(props) => (
                <TooltipContent
                  {...props}
                  currencySymbol={currencySymbol}
                  suffix={showValueSuffix}
                />
              )}
              wrapperStyle={{ outline: "none" }}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="per_capita"
              isAnimationActive={false}
              maxBarSize={BAR_HEIGHT}
              background={{ fill: "#f3f4f6", radius: 4 } as any}
              radius={[20, 20, 20, 20]}

            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${entry.id}-${idx}`}
                  fill={entry.color || barColor}
                />
              ))}

            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overlay: LGA labels (left) + value labels (right) — rendered on top of chart */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: title ? 96 : 44, // offset for header + column header
          left: 0,
          width: "100%",
        }}
      >
        {data.map((entry, idx) => (
          <div
            key={`label-${entry.id}-${idx}`}
            className="flex items-center justify-between pointer-events-auto hover:border-2 hover:border-green-300 hover:rounded-lg transition-all cursor-pointer group"
            style={{ height: ROW_HEIGHT, paddingLeft: 16, paddingRight: 16 }}
          >
            <span
              className="text-sm font-semibold text-gray-700"
              style={{ width: LABEL_WIDTH }}
            >
              {entry.lga ?? entry.state}
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {formatCurrency(Number(entry.per_capita ?? 0), currencySymbol)}
              {showValueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LgaPerCapitaBarChart;
