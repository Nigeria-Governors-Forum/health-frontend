// "use client";

// import React from "react";

// interface DemographyCardProps {
//   title: string;
//   subtitle: string;
//   icon?: any;
// }

// const DemographyCard: React.FC<DemographyCardProps> = ({
//   title,
//   subtitle,
//   icon,
// }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-md p-4 border-2 border-b-green-500 flex flex-col gap-1 transition duration-150 hover:shadow-lg hover:-translate-y-0.5">
//       <div className="flex justify-between items-start">
//         <div className="">
//           <h3 className="text-lg font-bold text-green-600">{title}</h3>
//           <p className="text-gray-600 text-2xl">{subtitle}</p>
//         </div>
//         {icon && (
//           <div className="flex items-center justify-center flex-none">
//             <div className="bg-green-50 rounded-full p-2">
//               {icon}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DemographyCard;

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
}

const DemographyCard: React.FC<DemographyCardProps> = ({
  title,
  value,
  icon,
  percentage,
  trend = "up",
  comparisonText = "vs last month",
  subtitle,
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

        <h3 className="text-lg font-bold text-[#333333]">
          {title}
        </h3>
        <FiInfo className="text-green-900" size={20} />
      </div>

      {/* Value */}
      <div className=" flex justify-between pr-4 text-2xl font-bold text-green-600">
        {value}
        {/* Trend */}
        {percentage && (
          <div className="flex items-center gap-2 text-sm">

            {/* Arrow */}
            <span
              className={`${trend === "up" ? "text-green-600" : "text-red-500"
                }`}
            >
              {trend === "up" ?
                <Image
                  src={ArrowUp}
                  alt="Arrow Up"
                  width={20}
                  height={20}
                /> :
                <Image
                  src={ArrowDown}
                  alt="Arrow Down"
                  width={20}
                  height={20}
                />}
            </span>

            {/* Percentage */}
            <span
              className={`font-semibold ${trend === "up" ? "text-green-600" : "text-red-500"
                }`}
            >
              {percentage}
            </span>

            {/* Text */}
            <span className="text-gray-500">
              {comparisonText}
            </span>
          </div>
        )}
      </div>


    </div>
  );
};

export default DemographyCard;