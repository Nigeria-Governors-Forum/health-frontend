"use client";

import React from "react";

interface ServiceCoverageCardProps {
  title: string;
  value: number;
  target: number;
  color: "green" | "red";
}

const ServiceCoverageCard: React.FC<ServiceCoverageCardProps> = ({
  title,
  value,
  target,
  color,
}) => {
  const barColor = color === "green" ? "bg-[#00A141]" : "bg-[#EF4444]";

  return (
    <div className="bg-[#EBF2EE] border border-gray-200/20 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3 w-full shadow-sm hover:shadow-md transition-shadow">
      {/* Title */}
      <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-2 min-h-[40px] flex items-center justify-center">
        {title}
      </span>

      {/* Progress Bar Row */}
      <div className="flex items-center gap-3 w-full">
        <div className="h-2.5 flex-1 rounded-full bg-gray-200/60 overflow-hidden relative">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs font-bold text-gray-700 shrink-0">
          {value}%
        </span>
      </div>

      {/* Target Label */}
      <span className="text-xs font-bold text-gray-500">
        Target : {target}%
      </span>
    </div>
  );
};

export default ServiceCoverageCard;
