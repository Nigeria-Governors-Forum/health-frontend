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
import HealthTrainingTable from "@/app/components/Healthtrainingtable";

interface HumanResourcePageProps {
  state?: string;
  title?: string;
  total?: string | number;
  perPerson?: string | number;
}

const HumanResource = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchValueTraining, setSearchValueTraining] = useState("");
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<any>();
  const router = useRouter();

  const data: SummaryRow[] = stateData?.training_breakdown || [];
  const dataTwo: LgaRow[] = stateData?.profession || [];

  const filteredData = dataTwo.filter((row) => {
    const searchTerm = searchValue.toLowerCase();
    const occupation = (row.occupation || "").toLowerCase();
    const institution = (row.institution || "").toLowerCase();
    return occupation.includes(searchTerm) || institution.includes(searchTerm);
  });

  const filteredTrainingData = data.filter((row) => {
    const searchTerm = searchValueTraining.toLowerCase();
    const institution = (row.institution || "").toLowerCase();
    return institution.includes(searchTerm);
  });

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
            title="Total Health Workers"
            value={formatNumber(Number(stateData?.hRH_Professions)) || "N/A"}
            icon={<FaUsers size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Doctors"
            value={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Community Health Extension Workers"
            value={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Total Health Training Institutions"
            value={formatNumber(Number(stateData?.hRH)) || "N/A"}
            icon={<FaHospitalUser size={24} color="#16a34a" />}
          />

          <DemographyCard
            title="Nurses/Midwives"
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
          data={filteredData}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          totalCount={filteredData.length}
        />
        <HealthCard
          title="Health Training Institutions Breakdown"
          data={filteredTrainingData}
          searchValue={searchValueTraining}
          onSearchChange={setSearchValueTraining}
          totalCount={filteredTrainingData.length}
        />
        <HealthTrainingTable
          data={
            stateData?.admission_quota && stateData.admission_quota.length > 0
              ? stateData.admission_quota
              : [
                  {
                    institution: "College(s) of Medicine",
                    programs: [
                      { program: "Medicine", quota: 45 },
                      { program: "Dentistry", quota: 34 },
                    ],
                  },
                  {
                    institution: "School(s) of Nursing & Midwifery",
                    programs: [
                      { program: "Nursing", quota: 56 },
                      { program: "Midwifery", quota: 28 },
                      { program: "Nursing University Graduates", quota: 98 },
                    ],
                  },
                  {
                    institution: "School(s) of Health Technology",
                    programs: [
                      { program: "Community Health Extention Workers", quota: 57 },
                      { program: "Junior Community Health Extention Workers", quota: 86 },
                      { program: "Pharm Tech", quota: 34 },
                      { program: "Dental Technician", quota: 50 },
                      { program: "Lab Tech", quota: 62 },
                      { program: "Medical Record Officers", quota: 18 },
                      { program: "Public Health", quota: 43 },
                    ],
                  },
                ]
          }
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
