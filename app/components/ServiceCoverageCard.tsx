"use client";

import React from "react";
import { formatNumber } from "../lib/formatNumber";


interface ServiceCoverageCardProps {
  title: string;
  value: number | null;
  target: number | null;
  color: "green" | "red";
  showPercentage?: boolean;
  showTarget?: boolean;
  formatAsNumber?: boolean;
}

const ServiceCoverageCard: React.FC<ServiceCoverageCardProps> = ({
  title,
  value,
  target,
  color,
  showPercentage = false,
  showTarget = true,
  formatAsNumber = false,
}) => {
  const barColor = color === "green" ? "bg-[#00A141]" : "bg-[#EF4444]";
  const displayValue =
    value === null
      ? "—"
      : `${formatNumber(value)}${showPercentage && !formatAsNumber ? "%" : ""}`;

  return (
    <div className="bg-[#EBF2EE] border border-gray-200/20 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3 w-full shadow-sm hover:shadow-md transition-shadow">
      {/* Title */}
      <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-2 min-h-[40px] flex items-center justify-center">
        {title}
      </span>

      {formatAsNumber ? (
        <span className="text-lg font-bold text-gray-700">{displayValue}</span>
      ) : (
        <div className="flex items-center gap-3 w-full">
          <div className="h-2.5 flex-1 rounded-full bg-gray-200/60 overflow-hidden relative">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${value ?? 0}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-700 shrink-0">
            {displayValue}
          </span>
        </div>
      )}

      {showTarget && target !== null && !formatAsNumber && (
        <span className="text-xs font-bold text-gray-500">
          Target : {target}%
        </span>
      )}
    </div>
  );
};

export default ServiceCoverageCard;
