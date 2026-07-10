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
    <div className="bg-white rounded-xl border border-[#D6D6D6] p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3">

      {/* Top Row */}
      <div className="flex items-center gap-3">
        {icon && (
          <div className="bg-green-100 text-green-600 rounded-full p-2 flex items-center justify-center">
            {icon}
          </div>
        )}

        <h3 className="text-sm font-bold text-[#333333]">
          {title}
        </h3>
        <div className="group relative flex items-center">
          <FiInfo className="cursor-pointer text-green-900" size={20} />
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
            {subtitle || `Information about ${title}`}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="flex flex-col sm:flex-row sm:justify-between pr-4 text-2xl font-bold text-green-600 items-baseline gap-2">
        <span className="flex items-baseline gap-1.5 shrink-0">
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