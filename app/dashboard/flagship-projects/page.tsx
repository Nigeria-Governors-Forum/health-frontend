"use client";

import React from "react";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import { normalizeStateName } from "@/app/components/ng-maps";
import FlagshipCard from "@/app/components/FlagshipCard";

const projectsData = [
  {
    title: "Strengthening Primary Health Care Systems",
    description: "Upgrade PHC facilities, equip with essential medicines and diagnostics, and strengthen community health workforce to improve access",
  },
  {
    title: "Maternal and Child Health Acceleration",
    description: "Expand antenatal, delivery, postnatal and child health services, including nutrition support and immunization, with a focus on underserved communities.",
  },
  {
    title: "Health Systems Strengthening & Data for Decision Making",
    description: "Invest in health information systems, data analytics, and capacity building to improve planning, monitoring, and evidence-based decision making.",
  },
];

const FlagshipProjects = () => {
  const { selectedState } = useTopbarFilters();
  
  // Default to "Gombe" state matching the visual mockup example if none is selected
  const stateName = selectedState || "Gombe";
  const stateSlug = normalizeStateName(stateName);

  return (
    <div className="flex flex-col gap-6 w-full text-black p-4">
      {/* Title Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Flagship Projects
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Key health initiatives for {stateName} State
        </p>
      </div>

      {/* Card Wrapper with padding to prevent clipping of the stacked offsets */}
      <div className="w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12 xl:gap-16 max-w-6xl mx-auto py-4">
          {projectsData.map((project, idx) => (
            <FlagshipCard
              key={idx}
              title={project.title}
              description={project.description}
              projectNum={idx + 1}
              stateName={stateName}
              stateSlug={stateSlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlagshipProjects;
