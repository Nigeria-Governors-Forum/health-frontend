"use client";

import React from "react";

interface DemographyCardProps {
  title: string;
  subtitle: string;
  icon?: any;
}

const DemographyCard: React.FC<DemographyCardProps> = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border-2 border-b-green-500 flex flex-col gap-1 transition duration-150 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex justify-between items-start">
        <div className="">
          <h3 className="text-lg font-bold text-green-600">{title}</h3>
          <p className="text-gray-600 text-2xl">{subtitle}</p>
        </div>
        {icon && (
          <div className="flex items-center justify-center flex-none">
            <div className="bg-green-50 rounded-full p-2">
              {/* {React.cloneElement(icon, {
                className: "text-green-600",
                size: 20,
                "aria-hidden": true,
              })} */}
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemographyCard;
