"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import DataCard from "../../components/PieChartUi";
import toast from "react-hot-toast";
import { formatNumber } from "../page";
import { Endpoints, httpClient } from "@/app/api-client/src";
import LoadingScreen from "@/app/components/LoadingScreen";
import SummaryTable, { SummaryRow } from "@/app/components/SummaryTable";
import HorizontalServiceProvisionBarChart from "@/app/components/HorizontalServiceProvisionBarChart";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import DemographyCard from "@/app/components/DemographyCard";
import Image from "next/image";
import { FaRegCalendar } from "react-icons/fa";
import HealthFacilitiesByLgaTable from "@/app/components/HealthFacilitiesByLga";
import { useRouter } from "next/navigation";
const land = "/svg/land.svg";

interface HealthFacilityPageProps {
  title?: string;
}

const HealthFacility: React.FC<HealthFacilityPageProps> = ({
  title = "Total Health Facilities",
}) => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<any>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const lastFetched = useRef<{ state: string; year: number } | null>(null);

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
      const stats = await httpClient.get(
        `${Endpoints.healthFacilities.summary}/${stateParam}/${selectedYear}`
      );
      console.log(stats);
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

  const lgaList = useMemo(() => {
    return Array.isArray(stateData?.health_facilities_by_lga)
      ? stateData.health_facilities_by_lga
      : [];
  }, [stateData]);

  // Filter list based on search value
  const filteredLgaList = useMemo(() => {
    if (!search.trim()) return lgaList;
    const lowerSearch = search.toLowerCase();
    return lgaList.filter((item: any) =>
      item.lga?.toLowerCase().includes(lowerSearch)
    );
  }, [lgaList, search]);

  // Paginated list for table
  const paginatedLgaList = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredLgaList.slice(startIndex, startIndex + 10);
  }, [filteredLgaList, currentPage]);

  const totalPages = Math.ceil(filteredLgaList.length / 10) || 1;

  // Whenever selectedState or selectedYear change, reset page & search
  useEffect(() => {
    setCurrentPage(1);
    setSearch("");
  }, [selectedState, selectedYear]);

  const data: SummaryRow[] = [
    {
      name: "Primary",
      private: stateData?.h_facilities?.Primary?.Private,
      public: stateData?.h_facilities?.Primary?.Public,
      total:
        stateData?.h_facilities?.Primary?.Private +
        stateData?.h_facilities?.Primary?.Public,
    },
    {
      name: "Secondary",
      private: stateData?.h_facilities?.Secondary?.Private,
      public: stateData?.h_facilities?.Secondary?.Public,
      total:
        stateData?.h_facilities?.Secondary?.Private +
        stateData?.h_facilities?.Secondary?.Public,
    },
    {
      name: "Tertiary",
      private: stateData?.h_facilities?.Tertiary?.Private,
      public: stateData?.h_facilities?.Tertiary?.Public,
      total:
        stateData?.h_facilities?.Tertiary?.Private +
        stateData?.h_facilities?.Tertiary?.Public,
    },
    {
      name: "Total",
      private:
        stateData?.h_facilities?.Primary?.Private +
        stateData?.h_facilities?.Secondary?.Private +
        stateData?.h_facilities?.Tertiary?.Private,
      public:
        stateData?.h_facilities?.Primary?.Public +
        stateData?.h_facilities?.Secondary?.Public +
        stateData?.h_facilities?.Tertiary?.Public,
      total:
        stateData?.h_facilities?.Primary?.Private +
        stateData?.h_facilities?.Primary?.Public +
        stateData?.h_facilities?.Secondary?.Private +
        stateData?.h_facilities?.Secondary?.Public +
        stateData?.h_facilities?.Tertiary?.Private +
        stateData?.h_facilities?.Tertiary?.Public,
    },
  ];

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="flex flex-col gap-8">
        {/* Top Row: Left cards & Right bar chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max lg:auto-rows-fr">
          {/* Left: Two stacked cards */}
          <div className="grid grid-cols-1 gap-6">
            <DemographyCard
              title="Total Health Facilities"
              value={formatNumber(stateData?.health_facilities || "N/A")}
              icon={<FaRegCalendar size={24} color="#16a34a" />}
              percentage="100%"
              trend="up"
              comparisonText="vs previous year"
            />
            <DemographyCard
              title="Facilities Per Capita"
              value={formatNumber(stateData?.per_person || "N/A")}
              icon={<Image src={land} alt="Land" width={24} height={24} />}
              showPerCapita={true}
              comparisonText=""
            />
            <SummaryTable title="Health Facilities Summary" data={data} />
          </div>

          {/* Right: Horizontal Bar Chart */}
          <div className="lg:col-span-2 flex items-stretch">
            <HorizontalServiceProvisionBarChart
              title="Health Facilities by Service Provision"
              data={stateData?.service_provision || []}
              showValueSuffix="%"
              className="w-full"
            />
          </div>
        </div>

        {/* Below: 2 cards per row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-max lg:auto-rows-fr gap-4">
          <div className="flex">
            <DataCard
              title="Health Facilities by Ownership"
              secondTitle="Health Facilities by Level of Care"
              initialData={[
                {
                  name: "Public",
                  value:
                    stateData?.h_facilities?.Primary?.Public +
                    stateData?.h_facilities?.Secondary?.Public +
                    stateData?.h_facilities?.Tertiary?.Public,
                },
                {
                  name: "Private",
                  value:
                    stateData?.h_facilities?.Primary?.Private +
                    stateData?.h_facilities?.Secondary?.Private +
                    stateData?.h_facilities?.Tertiary?.Private,
                },
              ]}
              alternateData={[
                {
                  name: "Primary",
                  value:
                    stateData?.h_facilities?.Primary?.Private +
                    stateData?.h_facilities?.Primary?.Public,
                },
                {
                  name: "Secondary",
                  value:
                    stateData?.h_facilities?.Secondary?.Private +
                    stateData?.h_facilities?.Secondary?.Public,
                },
                {
                  name: "Tertiary",
                  value:
                    stateData?.h_facilities?.Tertiary?.Private +
                    stateData?.h_facilities?.Tertiary?.Public,
                },
              ]}
            />
          </div>

          <div className="flex">
            <HealthFacilitiesByLgaTable
              data={paginatedLgaList}
              densityPer={10000}
              searchValue={search}
              onSearchChange={setSearch}
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={filteredLgaList.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/dashboard/zonal-health-facilities")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
          >
            View Zonal/National Comparison
          </button>
        </div>
      </div>
    </>
  );
};

export default HealthFacility;
