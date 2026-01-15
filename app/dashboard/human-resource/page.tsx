"use client";

import React, { useEffect, useState } from "react";
import DemographyCard from "@repo/ui/demographyCard";
import PopulationSummaryTable, {
  LgaRow,
} from "@repo/ui/populationSummaryTable";
import { FaHospitalUser, FaUsers } from "react-icons/fa";
import MapView from "../../components/MapWrapper";
import { useTopbarFilters } from "@repo/ui/hooks/TopbarFiltersContext";
import toast from "react-hot-toast";
import { Endpoints, httpClient } from "../../../api-client/src";
import LoadingScreen from "@repo/ui/loadingScreen";
import { formatNumber } from "../page";
import HealthCard, { SummaryRow } from "../../components/HealthCard";

interface HumanResourcePageProps {
  state?: string;
  title?: string;
  total?: string | number;
  perPerson?: string | number;
}

const HumanResource = () => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<any>();

  const data: SummaryRow[] = stateData?.training_breakdown || [];
  const dataTwo: LgaRow[] = stateData?.profession || [];

  const fetchData = async () => {
    if (!selectedState || !selectedYear) return;
    setLoading(true);

    const stateParam =
      selectedState === "Federal Capital Territory"
        ? "FCT"
        : selectedState === "Nassarawa"
          ? "Nasarawa"
          : selectedState;

    try {
      const stats = await httpClient.get(
        `${Endpoints.humanResource.summary}/${stateParam}/${selectedYear}`
      );
      console.log(stats);
      setStateData(stats?.data);

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

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}

      <div className="flex flex-col gap-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DemographyCard
            title="Total Health Workforce"
            subtitle={formatNumber(Number(stateData?.hRH_Professions)) || "N/A"}
            icon={<FaUsers size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Total Health Training Institutions"
            subtitle={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />
          <HealthCard
            title="Health Training Institutions Breakdown"
            data={data}
          />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <PopulationSummaryTable title="Health Workforce Breakdown" data={dataTwo} />
          </div>
          {/* Map spans 2 columns */}
          <div className="md:col-span-1">
            <MapView
              mapClassName="h-96 w-full rounded-xl shadow"
              showCard={true}
              title="HRH Breakdown by LGA"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HumanResource;
