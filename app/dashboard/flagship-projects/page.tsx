"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import { normalizeStateName } from "@/app/components/ng-maps";
import FlagshipCard from "@/app/components/FlagshipCard";
import { Endpoints, httpClient } from "@/app/api-client/src";

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
  const { selectedState, selectedYear } = useTopbarFilters();
  const [projects, setProjects] = useState<any[]>(projectsData);
  const [loading, setLoading] = useState(false);
  const lastFetched = useRef<{ state: string; year: number } | null>(null);
  
  // Default to "Gombe" state matching the visual mockup example if none is selected
  const stateName = selectedState || "Gombe";
  const yearName = selectedYear || 2023;
  const stateSlug = normalizeStateName(stateName);

  const fetchData = async () => {
    if (!selectedState || !selectedYear) return;

    // Avoid double API calls
    if (
      lastFetched.current &&
      lastFetched.current.state === selectedState &&
      lastFetched.current.year === selectedYear
    ) {
      return;
    }
    lastFetched.current = { state: selectedState, year: selectedYear };

    setLoading(true);

    const stateParam =
      selectedState === "Federal Capital Territory"
        ? "FCT"
        : selectedState === "Nassarawa"
          ? "Nasarawa"
          : selectedState;

    try {
      const res = await httpClient.get(
        `${Endpoints.dashboard.flagship}/${stateParam}/${selectedYear}`
      );
      // @ts-ignore
      if (res?.data?.data && res.data.data.length > 0) {
        // @ts-ignore
        setProjects(res.data.data.map((p: any) => ({
          title: p.project,
          description: p.description
        })));
      } else {
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Error fetching flagship projects:", error);
      setProjects(projectsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedState, selectedYear]);

  return (
    <div className="flex flex-col gap-6 w-full text-black p-4">
      {/* Title Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Flagship Projects
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Key health initiatives for {stateName} State ({yearName})
        </p>
      </div>

      {/* Card Wrapper with padding to prevent clipping of the stacked offsets */}
      <div className="w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-gray-500 font-medium animate-pulse">Loading flagship projects...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12 xl:gap-16 max-w-6xl mx-auto py-4">
            {projects.map((project, idx) => (
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
        )}
      </div>
    </div>
  );
};

export default FlagshipProjects;
