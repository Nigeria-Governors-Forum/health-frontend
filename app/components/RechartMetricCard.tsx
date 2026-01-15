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
    <div className="ui:max-w-sm ui:bg-white ui:rounded-2xl ui:shadow ui:p-6 ui:flex ui:flex-col ui:gap-4 ui:border ui:border-green-400">
      <div className="ui:text-center">
        <div className="ui:text-lg ui:font-semibold ui:text-green-800">
          {title}
        </div>
      </div>

      <div className="ui:flex ui:justify-center ui:items-baseline ui:gap-1">
        <span className="ui:text-2xl ui:font-bold ui:text-gray-900">
          {currencySymbol}
        </span>
        <span className="ui:text-4xl ui:font-extrabold ui:text-black">
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

      <div className="ui:w-full ui:flex ui:flex-col ui:gap-2">
        {/* Box */}
        <div
          className="ui:flex ui:w-full ui:rounded-xl ui:overflow-hidden ui:shadow-sm ui:border ui:border-gray-200"
          style={{ height }}
        >
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              className="ui:flex ui:items-center ui:justify-center ui:text-xs ui:font-semibold ui:text-white"
            >
              {showLabels && item.percentage > 10 && `${item.percentage}%`}
            </div>
          ))}
        </div>

        <div className="ui:grid ui:grid-cols-2 ui:sm:grid-cols-4 ui:gap-2 ui:text-xs ui:text-black">
          {breakdown.map((item, idx) => (
            <div key={idx} className="ui:flex ui:items-center ui:gap-2">
              <span
                className="ui:inline-block ui:w-3 h-3 ui:rounded"
                style={{ backgroundColor: item.color }}
              />
              {item.label} ({item.percentage}%)
            </div>
          ))}
        </div>
      </div>

      <div className="ui:flex ui:gap-4 ui:mt-2 ui:justify-center ui:flex-wrap">
        {breakdown.map((b, i) => (
          <div key={i} className="ui:flex ui:items-center ui:gap-2 ui:text-sm">
            <span
              className="ui:inline-block ui:w-3 ui:h-3 ui:rounded-full ui:flex-shrink-0"
              style={{ backgroundColor: b.color }}
            />
            <span className="ui:text-gray-700">{b.label}</span>
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
//     <div className="ui:max-w-sm ui:bg-white ui:rounded-2xl ui:shadow ui:p-6 ui:flex ui:flex-col ui:items-center ui:gap-4 ui:border ui:border-green-400">
//       <div className="ui:text-center">
//         <div className="ui:text-lg ui:font-semibold ui:text-gray-900">
//           {title}
//         </div>
//       </div>

//       <div className="ui:relative ui:flex ui:items-center ui:justify-center ">
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
//           <div className="ui:absolute ui:inset-0 ui:flex ui:flex-col ui:items-center ui:justify-center ui:pointer-events-none">
//             <div className="ui:text-3xl ui:font-bold ui:text-black ui:mb-10">
//               {safePct.toFixed(1)}%
//             </div>
//           </div>
//           <div className="ui:absolute ui:left-0 ui:bottom-0 ui:text-xs ui:font-medium ui:text-gray-700">
//             0%
//           </div>
//           <div className="ui:absolute ui:right-0 ui:bottom-0 ui:text-xs ui:font-medium ui:text-gray-700">
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
    <div className="ui:max-w-sm ui:bg-white ui:rounded-2xl ui:shadow ui:p-6 ui:flex ui:flex-col ui:items-center ui:gap-4 ui:border ui:border-green-400">
      <div className="ui:text-center">
        <div className="ui:text-lg ui:font-semibold ui:text-green-800">
          {title}
        </div>
      </div>

      <div className="ui:relative ui:flex ui:items-center ui:justify-center ">
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
          <div className="ui:absolute ui:inset-0 ui:flex ui:flex-col ui:items-center ui:justify-center ui:pointer-events-none">
            <div className="ui:text-3xl ui:font-bold ui:text-black ui:mb-10">
              {safePct.toFixed(1)}%
            </div>
          </div>
          <div className="ui:absolute ui:left-0 ui:bottom-0 ui:text-xs ui:font-medium ui:text-gray-700">
            0%
          </div>
          <div className="ui:absolute ui:right-0 ui:bottom-0 ui:text-xs ui:font-medium ui:text-gray-700">
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
    <div className="ui:max-w-sm ui:bg-white ui:rounded-2xl ui:shadow ui:p-6 ui:flex ui:flex-col ui:gap-4 ui:border ui:border-green-400">
      <div className="ui:text-center">
        <div className="ui:text-lg ui:font-semibold ui:text-green-900">
          {title}
        </div>
      </div>
      <div className="ui:flex ui:justify-center ui:items-baseline ui:gap-1 ui:h-[120px]">
        <span className="ui:text-2xl ui:font-bold ui:text-gray-900 ui:mt-10">
          {currencySymbol}
        </span>
        <span className="ui:text-4xl ui:font-extrabold ui:text-black">
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
