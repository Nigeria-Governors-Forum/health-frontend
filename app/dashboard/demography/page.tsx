"use client";

import React, { useEffect, useState } from "react";
import {
  FaChild,
  FaLandmark,
  FaRegCalendar,
  FaRegHospital,
  FaUserNurse,
  FaUsers,
  FaUsersCog,
} from "react-icons/fa";
import { Endpoints, httpClient } from "@/app/api-client/src";
import toast from "react-hot-toast";
import { formatNumber } from "../page";
import LoadingScreen from "@/app/components/LoadingScreen";
import DemographyCard from "@/app/components/DemographyCard";
import LgaSummaryTable, { LgaLookup } from "@/app/components/LgaSummaryTable";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import { LGAMap } from "@/app/components/maps";
import Image from "next/image";
const info = "/svg/info.svg";

import ToggleSwitch from "@/app/components/ToggleSwitch";

const DemographyPage = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<any>();
  const { selectedState, selectedYear, setSelectedState } = useTopbarFilters();

  const fetchData = async () => {
    if (!selectedState || !selectedYear) return;
    setLoading(true);
    if (selectedState === "Federal Capital Territory") setSelectedState("FCT");
    if (selectedState === "Nassarawa") setSelectedState("Nasarawa");

    try {
      const stats = await httpClient.get(
        `${Endpoints.demography.summary}/${selectedState}/${selectedYear}`,
      );
      // @ts-ignore
      setStateData(stats?.data);
      toast.success(`Record Found for, ${selectedState} - ${selectedYear}!`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedState, selectedYear]);

  const data: LgaLookup[] = Array.isArray(stateData?.demography_LGA)
    ? stateData.demography_LGA
    : [];
  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="flex flex-col gap-6">
        {/* Left: takes 2x space */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <DemographyCard
            title="Year Created"
            value={stateData?.year_created || "N/A"}
            icon={<FaRegCalendar size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Land Mass"
            value={formatNumber(Number(stateData?.land_mass)) || "N/A"}
            icon={<FaLandmark size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="LGAs"
            value={formatNumber(Number(stateData?.no_of_lgas)) || "N/A"}
            icon={<FaLandmark size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Political Wards"
            value={formatNumber(Number(stateData?.political_wards)) || "N/A"}
            icon={<FaLandmark size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Health Facilities"
            value={formatNumber(Number(stateData?.health_facilities)) || "N/A"}
            icon={<FaRegHospital size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Total Population"
            value={formatNumber(Number(stateData?.total_population)) || "N/A"}
            icon={<FaUsers size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Under 1 Population"
            value={formatNumber(Number(stateData?.under_1)) || "N/A"}
            icon={<FaUsersCog size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Under 5 Population"
            value={formatNumber(Number(stateData?.under_5)) || "N/A"}
            icon={<FaUsers size={24} color="#16a34a" />}
          />

          <DemographyCard
            title="Women of Child Bearing Age"
            icon={<FaUserNurse size={24} color="#16a34a" />}
            value={formatNumber(Number(stateData?.wcba)) || "N/A"}
          />

          <DemographyCard
            title="Pregnant Women"
            value={formatNumber(Number(stateData?.pregnant_women)) || "N/A"}
            icon={<FaChild size={24} color="#16a34a" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <MapView
            mapClassName={`h-96 w-full rounded-xl shadow`}
            showCard={true}
            total={stateData?.demography_LGA?.length}
            h2r={stateData?.total_Hard_To_Reach}
          /> */}
          <div className="bg-white rounded-xl shadow-md p-4 w-auto mb-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold text-[#07923F] mb-3 text-center flex items-center gap-2">
                Population By Accessibility
                <Image
                  src={info}
                  alt="Health Facilities"
                  width={24}
                  height={24}
                />
              </h2>
              <ToggleSwitch initial={true} onToggle={() => {}} />
            </div>
            <div className="flex justify-between text-sm gap-4 text-gray-700">
              <span className="text-blue-600 font-medium">
                Total: {stateData?.no_of_lgas || "N/A"}
              </span>
              <span className="text-green-600 font-medium">
                Safe:{" "}
                {stateData?.no_of_lgas - stateData?.total_Hard_To_Reach ||
                  "N/A"}
              </span>
              <span className="text-red-600 font-medium">
                Hard to reach: {stateData?.total_Hard_To_Reach || "N/A"}
              </span>
            </div>
            <LGAMap
              stateId={selectedState?.toLowerCase() || "fct"}
              choroplethData={{
                [stateData?.no_of_lgas - stateData?.total_Hard_To_Reach ||
                "N/A"]: 100,
                [stateData?.total_Hard_To_Reach || "N/A"]: 0,
              }}
              theme={{
                backgroundColor: "#F8FAFC",
                defaultFill: "#DCFCE7",
                strokeColor: "#166534",
                hoverFill: "#22C55E",
                selectedFill: "#15803D",
                labelColor: "#14532D",
              }}
            />
          </div>
          <LgaSummaryTable title="LGA Summary" data={data} />
        </div>
        {/* <div className="flex justify-center">
          <button
            onClick={() => console.log("hello")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer"
          >
            View Zonal/National Comparison
          </button>
        </div> */}
      </div>
    </>
  );
};

export default DemographyPage;
