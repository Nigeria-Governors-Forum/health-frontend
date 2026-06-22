"use client";

import React from "react";
import { FiActivity } from "react-icons/fi";
import { StateLGAChoropleth } from "@/app/components/ng-maps";

interface FlagshipCardProps {
  title: string;
  description: string;
  projectNum: number;
  stateName: string;
  stateSlug: string;
}

const FlagshipCard: React.FC<FlagshipCardProps> = ({
  title,
  description,
  projectNum,
  stateName,
  stateSlug,
}) => {
  return (
    <div className="relative w-full max-w-[360px] mx-auto group">
      {/* Back Offset Card Layer (Dark Green) */}
      <div className="absolute inset-0 bg-[#00A141] rounded-[32px] transform -rotate-3 -translate-x-3 translate-y-1.5 shadow-md transition-transform duration-300 group-hover:-rotate-4 group-hover:-translate-x-4" />

      {/* Middle Offset Card Layer (Muted Slate Green) */}
      <div className="absolute inset-0 bg-[#C2D7CB] rounded-[32px] transform rotate-3 translate-x-3 -translate-y-1.5 shadow-sm transition-transform duration-300 group-hover:rotate-4 group-hover:translate-x-4" />

      {/* Front Card Layer (Light Sage Container) */}
      <div className="relative z-10 bg-[#EBF2EE] border border-gray-200/30 rounded-[32px] p-6 shadow-lg flex flex-col items-center justify-between text-center min-h-[460px] transition-transform duration-300 group-hover:-translate-y-1">
        
        {/* Title pill */}
        <div className="w-full flex justify-center">
          <div className="bg-[#0B5B31] text-white text-xs sm:text-[13px] font-bold py-2.5 px-5 rounded-full text-center leading-tight tracking-wide shadow-sm min-h-[48px] flex items-center justify-center max-w-[90%]">
            {title}
          </div>
        </div>

        {/* Pulse ECG Circle Icon */}
        <div className="w-14 h-14 rounded-full bg-[#00A141] flex items-center justify-center mt-6 mb-4 shadow-sm">
          <FiActivity className="text-white" size={28} />
        </div>

        {/* Body Text */}
        <p className="text-gray-700 italic text-sm sm:text-[14px] leading-relaxed px-2 flex-1 flex items-center">
          "{description}"
        </p>

        {/* Horizontal Line separator */}
        <div className="w-full border-t border-gray-300/40 my-4" />

        {/* Bottom map and details */}
        <div className="flex items-center gap-4 w-full justify-center px-2">
          {/* State Map Shape */}
          <div className="w-16 h-16 relative overflow-hidden flex items-center justify-center shrink-0 rounded-lg">
            <StateLGAChoropleth
              stateSlug={stateSlug}
              stateName={stateName}
              height={60}
              defaultFill="#00A141"
              className="w-full h-full scale-[1.3] transform origin-center"
            />
          </div>

          {/* Project labels */}
          <div className="flex flex-col text-left justify-center">
            <span className="text-sm font-bold text-gray-800">
              Project {projectNum}
            </span>
            <span className="text-xs text-gray-500 font-semibold">
              {stateName} State
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlagshipCard;
