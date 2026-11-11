"use client";

import React from "react";
import Image from "next/image";
import { Tooltip } from "recharts";
import { FiInfo } from "react-icons/fi";

interface DemographyCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  percentage?: string; // e.g. "100%"
  trend?: "up" | "down";
  comparisonText?: string; // e.g. "vs last month"
  subtitle?: string;
  showPerCapita?: boolean;
}

const DemographyCard: React.FC<DemographyCardProps> = ({
  title,
  value,
  icon,
  percentage,
  trend = "up",
  comparisonText = "vs last month",
  subtitle,
  showPerCapita = false,
}) => {
  const ArrowUp = "/svg/arrowUp.svg";
  const ArrowDown = "/svg/arrowDown.svg";
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#D6D6D6] bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md sm:p-4">

      {/* Top Row */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {icon && (
          <div className="flex shrink-0 items-center justify-center rounded-full bg-green-100 p-2 text-green-600">
            {icon}
          </div>
        )}

        <h3 className="min-w-0 flex-1 text-sm font-bold leading-snug text-[#333333] [overflow-wrap:anywhere]">
          {title}
        </h3>
        <div className="group relative flex shrink-0 items-center">
          <FiInfo className="cursor-pointer text-green-900" size={18} />
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
            {subtitle || `Information about ${title}`}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="flex min-w-0 flex-col items-baseline gap-2 pr-1 text-xl font-bold text-green-600 sm:flex-row sm:justify-between sm:pr-4 sm:text-2xl">
        <span className="flex min-w-0 flex-wrap items-baseline gap-1.5">
          {value}
          {showPerCapita && (
            <span className="text-sm text-gray-500 italic font-normal">
              Per 10,000
            </span>
          )}
        </span>
        {/* Trend */}
        {percentage && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-normal text-gray-500 flex-wrap">
            {/* Arrow */}
            <span
              className={`${trend === "up" ? "text-green-600" : "text-red-500"
                } shrink-0`}
            >
              {trend === "up" ?
                <Image
                  src={ArrowUp}
                  alt="Arrow Up"
                  width={16}
                  height={16}
                  className="inline-block"
                /> :
                <Image
                  src={ArrowDown}
                  alt="Arrow Down"
                  width={16}
                  height={16}
                  className="inline-block"
                />}
            </span>

            {/* Percentage */}
            <span
              className={`font-semibold ${trend === "up" ? "text-green-600" : "text-red-500"
                } shrink-0`}
            >
              {percentage}
            </span>

            {/* Text */}
            <span className="text-gray-500 shrink-0">
              {comparisonText}
            </span>
          </div>
        )}
      </div>


    </div>
  );
};

export default DemographyCard;