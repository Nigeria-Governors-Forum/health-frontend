"use client";

import React, { useEffect, useState } from "react";

import { FaHospitalUser, FaUsers } from "react-icons/fa";
import toast from "react-hot-toast";
import { formatNumber } from "../page";
import HealthCard, { SummaryRow } from "../../components/HealthCard";
import DemographyCard from "@/app/components/DemographyCard";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import PopulationSummaryTable, {
  LgaRow,
} from "@/app/components/PopulationSummaryTable";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
        `${Endpoints.humanResource.summary}/${stateParam}/${selectedYear}`,
      );
      // console.log(stats);
      // @ts-ignore
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
            title="Health Workers"
            value={formatNumber(Number(stateData?.hRH_Professions)) || "N/A"}
            icon={<FaUsers size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Total Health Training Institutions"
            value={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Doctors"
            value={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Nurses/Midwives"
            value={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Community Health Extension Workers"
            value={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Junior Community Health Extension Workers"
            value={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />
        </div>
        <PopulationSummaryTable
          title="Health Workforce Breakdown"
          data={dataTwo}
        />
        <HealthCard
          title="Health Training Institutions Breakdown"
          data={data}
        />

        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/dashboard/zonal-human-resource")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
          >
            View Zonal / National Comparison
          </button>
        </div>
      </div>
    </>
  );
};

export default HumanResource;
