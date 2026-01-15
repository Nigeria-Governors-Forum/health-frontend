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
import MapView from "@/app/components/MapWrapper";
import { Endpoints, httpClient } from "@/app/api-client/src";
import toast from "react-hot-toast";
import { useTopbarFilters } from "../../context/TopbarFiltersContext";
import { formatNumber } from "../page";
import LoadingScreen from "@/app/components/LoadingScreen";
import DemographyCard from "@/app/components/DemographyCard";
import LgaSummaryTable, { LgaLookup } from "@/app/components/LgaSummaryTable";

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
        `${Endpoints.demography.summary}/${selectedState}/${selectedYear}`
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
            subtitle={stateData?.year_created || "N/A"}
            icon={<FaRegCalendar size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Land Mass"
            subtitle={formatNumber(Number(stateData?.land_mass)) || "N/A"}
            icon={<FaLandmark size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="LGAs"
            subtitle={formatNumber(Number(stateData?.no_of_lgas)) || "N/A"}
            icon={<FaLandmark size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Political Wards"
            subtitle={formatNumber(Number(stateData?.political_wards)) || "N/A"}
            icon={<FaLandmark size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Health Facilities"
            subtitle={
              formatNumber(Number(stateData?.health_facilities)) || "N/A"
            }
            icon={<FaRegHospital size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Total Population"
            subtitle={
              formatNumber(Number(stateData?.total_population)) || "N/A"
            }
            icon={<FaUsers size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Under 1 Population"
            subtitle={formatNumber(Number(stateData?.under_1)) || "N/A"}
            icon={<FaUsersCog size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Under 5 Population"
            subtitle={formatNumber(Number(stateData?.under_5)) || "N/A"}
            icon={<FaUsers size={24} color="#16a34a" />}
          />

          <DemographyCard
            title="Women of Child Bearing Age"
            icon={<FaUserNurse size={24} color="#16a34a" />}
            subtitle={formatNumber(Number(stateData?.wcba)) || "N/A"}
          />

          <DemographyCard
            title="Pregnant Women"
            subtitle={formatNumber(Number(stateData?.pregnant_women)) || "N/A"}
            icon={<FaChild size={24} color="#16a34a" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MapView
            mapClassName={`h-96 w-full rounded-xl shadow`}
            showCard={true}
            total={stateData?.demography_LGA?.length}
            h2r={stateData?.total_Hard_To_Reach}
          />
          <LgaSummaryTable title="LGA Summary" data={data} />
        </div>
      </div>
    </>
  );
};

export default DemographyPage;
