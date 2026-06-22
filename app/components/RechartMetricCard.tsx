"use client";

import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  XAxis,
  YAxis,
} from "recharts";

export type Variant = "budget" | "gauge" | "simple";

export interface BreakdownItem {
  label: string;
  percentage: number;
  color: string; // hex or CSS color
}

export interface MetricCardProps {
  variant: Variant;
  title: string;
  amount?: string;
  currencySymbol?: string;
  breakdown?: BreakdownItem[];
  valuePct?: number;
  maxPct?: number;
  className?: string;
  currencyDenotation?: string;
}

// simple classnames merger
const cn = (...args: (string | undefined)[]) => args.filter(Boolean).join(" ");

const formatCurrency = (val: number, symbol = "₦") => {
  return symbol + val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const BudgetVariant: React.FC<{
  title: string;
  amount: string;
  currencySymbol: string;
  breakdown: BreakdownItem[];
  currencyDenotation?: string;
  height?: number;
  showLabels?: boolean;
}> = ({
  title,
  amount,
  currencySymbol,
  breakdown,
  currencyDenotation,
  height = 28,
  showLabels = true,
}) => {
  const data = [
    breakdown.reduce<Record<string, number>>((acc, b) => {
      acc[b.label] = b.percentage;
      return acc;
    }, {}),
  ];

  return (
    <div className="max-w-sm bg-white rounded-2xl shadow p-6 flex flex-col gap-4 border border-green-400">
      <div className="text-center">
        <div className="text-lg font-semibold text-green-800">
          {title}
        </div>
      </div>

      <div className="flex justify-center items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">
          {currencySymbol}
        </span>
        <span className="text-4xl font-extrabold text-black">
          {amount}
        </span>
      </div>

      {/* <div style={{ width: "100%", height: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal" stackOffset="expand">
            {breakdown.map((b) => (
              <Bar
                key={b.label}
                dataKey={b.label}
                stackId="a"
                isAnimationActive={false}
                background={false}
              >
                <Cell fill={b.color} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      <div className="w-full flex flex-col gap-2">
        {/* Box */}
        <div
          className="flex w-full rounded-xl overflow-hidden shadow-sm border border-gray-200"
          style={{ height }}
        >
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              className="flex items-center justify-center text-xs font-semibold text-white"
            >
              {showLabels && item.percentage > 10 && `${item.percentage}%`}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-black">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ backgroundColor: item.color }}
              />
              {item.label} ({item.percentage}%)
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-2 justify-center flex-wrap">
        {breakdown.map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: b.color }}
            />
            <span className="text-gray-700">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// const GaugeVariant: React.FC<{
//   title: string;
//   valuePct: number;
//   maxPct: number;
// }> = ({ title, valuePct = 0, maxPct = 100 }) => {
//   const safePct = Math.min(Math.max(valuePct, 0), maxPct);
//   const percentOfMax = (safePct / maxPct) * 100;
//   const data = [
//     { name: "filled", value: percentOfMax },
//     // { name: "empty", value: 100 - percentOfMax },
//     // { name: "empty", value: 100 - percentOfMax },
//     // { name: "empty", value: 100 - percentOfMax },
//     // { name: "empty", value: 100 - percentOfMax },
//   ];

//   return (
//     <div className="max-w-sm bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-4 border border-green-400">
//       <div className="text-center">
//         <div className="text-lg font-semibold text-gray-900">
//           {title}
//         </div>
//       </div>

//       <div className="relative flex items-center justify-center ">
//         <div style={{ width: 160, height: 150, position: "relative" }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <RadialBarChart
//               cx="50%"
//               cy="100%"
//               innerRadius="70%"
//               outerRadius="100%"
//               startAngle={180}
//               endAngle={0}
//               data={data}
//               barSize={20}
//             >
//               <PolarAngleAxis
//                 type="number"
//                 domain={[0, 100]}
//                 angleAxisId={0}
//                 tick={false}
//               />
//               <RadialBar
//                 cornerRadius={10}
//                 background={{ fill: "#f0f0f0" }}
//                 dataKey="value"
//                 animationDuration={600}
//                 isAnimationActive={false}
//                 fill="#dc2626"
//               >
//                 {data.map((entry, idx) => {
//                   if (entry.name === "filled") {
//                     return <Cell key={idx} fill="#dc2626" />;
//                   }
//                   return <Cell key={idx} fill="#f0f0f0" />;
//                 })}
//               </RadialBar>
//             </RadialBarChart>
//           </ResponsiveContainer>
//           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//             <div className="text-3xl font-bold text-black mb-10">
//               {safePct.toFixed(1)}%
//             </div>
//           </div>
//           <div className="absolute left-0 bottom-0 text-xs font-medium text-gray-700">
//             0%
//           </div>
//           <div className="absolute right-0 bottom-0 text-xs font-medium text-gray-700">
//             {maxPct}%
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const GaugeVariant: React.FC<{
  title: string;
  valuePct: number;
  maxPct: number;
}> = ({ title, valuePct = 0, maxPct = 100 }) => {
  const safePct = Math.min(Math.max(valuePct, 0), maxPct);
  const percentOfMax = (safePct / maxPct) * 100;

  // Pick color based on comparison
  const gaugeColor = safePct < maxPct ? "#dc2626" : "#16a34a"; // red if less, green if equal/max

  const data = [{ name: "filled", value: percentOfMax }];

  return (
    <div className="max-w-sm bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-4 border border-green-400">
      <div className="text-center">
        <div className="text-lg font-semibold text-green-800">
          {title}
        </div>
      </div>

      <div className="relative flex items-center justify-center ">
        <div style={{ width: 160, height: 150, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="100%"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              data={data}
              barSize={20}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                cornerRadius={10}
                background={{ fill: "#f0f0f0" }}
                dataKey="value"
                animationDuration={600}
                isAnimationActive={false}
                fill={gaugeColor} // ✅ use dynamic color
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={gaugeColor} />
                ))}
              </RadialBar>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-3xl font-bold text-black mb-10">
              {safePct.toFixed(1)}%
            </div>
          </div>
          <div className="absolute left-0 bottom-0 text-xs font-medium text-gray-700">
            0%
          </div>
          <div className="absolute right-0 bottom-0 text-xs font-medium text-gray-700">
            {maxPct}%
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleVariant: React.FC<{
  title: string;
  amount: string;
  currencySymbol: string;
  currencyDenotation?: string;
}> = ({ title, amount, currencySymbol, currencyDenotation }) => {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow p-6 flex flex-col gap-4 border border-green-400">
      <div className="text-center">
        <div className="text-lg font-semibold text-green-900">
          {title}
        </div>
      </div>
      <div className="flex justify-center items-baseline gap-1 h-[120px]">
        <span className="text-2xl font-bold text-gray-900 mt-10">
          {currencySymbol}
        </span>
        <span className="text-4xl font-extrabold text-black">
          {amount}
        </span>
      </div>
    </div>
  );
};

const RechartMetricCard: React.FC<MetricCardProps> = ({
  variant,
  title,
  amount="",
  currencySymbol = "₦",
  breakdown = [],
  valuePct = 0,
  maxPct = 100,
  className = "",
  currencyDenotation = "M",
}) => {
  const baseClass = cn(); // placeholder if you want to extend

  if (variant === "budget") {
    return (
      <div className={cn(baseClass, className)}>
        <BudgetVariant
          title={title}
          amount={amount}
          currencySymbol={currencySymbol}
          breakdown={breakdown}
          currencyDenotation={currencyDenotation}
        />
      </div>
    );
  }

  if (variant === "gauge") {
    return (
      <div className={cn(baseClass, className)}>
        <GaugeVariant title={title} valuePct={valuePct} maxPct={maxPct} />
      </div>
    );
  }

  if (variant === "simple") {
    return (
      <div className={cn(baseClass, className)}>
        <SimpleVariant
          title={title}
          amount={amount}
          currencySymbol={currencySymbol}
          currencyDenotation={currencyDenotation}
        />
      </div>
    );
  }

  return null;
};

export default RechartMetricCard;
