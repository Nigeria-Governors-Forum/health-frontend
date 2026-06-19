"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import ToggleSwitch from "@/app/components/ToggleSwitch";
import { normalizeStateName, StateLGAChoropleth, slugify } from "@/app/components/ng-maps";
import Image from "next/image";

const info = "/svg/info.svg";
const land = "/svg/land.svg";
const lga = "/svg/lga.svg";
const politics = "/svg/politics.svg";
const healthFacilities = "/svg/healthFacilities.svg";
const population = "/svg/population.svg";
const under1 = "/svg/under1.svg";
const womenBearing = "/svg/womenBearing.svg";
const pregnant = "/svg/pregnant.svg";



const DemographyPage = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<any>();
  const { selectedState, selectedYear } = useTopbarFilters();

  const [hoveredLGA, setHoveredLGA] = useState<{ name: string; key: string } | null>(null);
  const [isPopulationMode, setIsPopulationMode] = useState(true);
  const [titlecaption, setTitlecaption] = useState("Population by accessibility");

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
        `${Endpoints.demography.summary}/${stateParam}/${selectedYear}`,
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

  const lgaList = useMemo(() => {
    return Array.isArray(stateData?.demography_LGA)
      ? stateData.demography_LGA
      : [];
  }, [stateData]);

  // Filter list based on search value
  const filteredLgaList = useMemo(() => {
    if (!searchValue.trim()) return lgaList;
    const lowerSearch = searchValue.toLowerCase();
    return lgaList.filter((item: any) =>
      item.lga?.toLowerCase().includes(lowerSearch)
    );
  }, [lgaList, searchValue]);

  // Paginated list for table
  const paginatedLgaList = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLgaList.slice(startIndex, startIndex + pageSize);
  }, [filteredLgaList, currentPage]);

  const totalPages = Math.ceil(filteredLgaList.length / pageSize) || 1;

  // Whenever selectedState or selectedYear change, reset page & search
  useEffect(() => {
    setCurrentPage(1);
    setSearchValue("");
  }, [selectedState, selectedYear]);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    setCurrentPage(1);
  };

  const lgaColors = useMemo(() => {
    const colors: Record<string, string> = {};
    if (lgaList.length === 0) return colors;

    if (isPopulationMode) {
      const populations = lgaList.map((item: any) => Number(item.lga_population) || 0);
      const minPop = Math.min(...populations);
      const maxPop = Math.max(...populations);
      const popRange = maxPop - minPop || 1;

      lgaList.forEach((item: any) => {
        const key = slugify(item.lga);
        const pop = Number(item.lga_population) || 0;
        const ratio = (pop - minPop) / popRange;
        // Denser -> darker green (lightness: 25%), less populated -> lighter green (lightness: 92%)
        const lightness = 92 - ratio * (92 - 25);
        const saturation = 35 + ratio * (85 - 35);
        colors[key] = `hsl(140, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
      });
    } else {
      lgaList.forEach((item: any) => {
        const key = slugify(item.lga);
        const isHard = (item.hard_to_reach_lgas || "").toString().trim().toLowerCase() === "yes";
        colors[key] = isHard ? "#EF4444" : "#22C55E";
      });
    }
    return colors;
  }, [lgaList, isPopulationMode]);

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <DemographyCard
            title="Year Created"
            value={stateData?.year_created || "N/A"}
            icon={<FaRegCalendar size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Land Mass"
            value={stateData?.land_mass ? formatNumber(Number(stateData.land_mass)) : "N/A"}
            icon={<Image src={land} alt="Land" width={24} height={24} />}

          />
          <DemographyCard
            title="LGAs"
            value={stateData?.no_of_lgas ? formatNumber(Number(stateData.no_of_lgas)) : "N/A"}
            icon={<Image src={lga} alt="LGA" width={24} height={24} />}
          />
          <DemographyCard
            title="Political Wards"
            value={stateData?.political_wards ? formatNumber(Number(stateData.political_wards)) : "N/A"}
            icon={<Image src={politics} alt="Politics" width={24} height={24} />}
          />
          <DemographyCard
            title="Health Facilities"
            value={stateData?.health_facilities ? formatNumber(Number(stateData.health_facilities)) : "N/A"}
            icon={<Image src={healthFacilities} alt="Health Facilities" width={24} height={24} />}
          />
          <DemographyCard
            title="Total Population"
            value={stateData?.total_population ? formatNumber(Number(stateData.total_population)) : "N/A"}
            icon={<FaUsers size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Under 1 Population"
            value={stateData?.under_1 ? formatNumber(Number(stateData.under_1)) : "N/A"}
            icon={<Image src={under1} alt="Under 1" width={24} height={24} />}
          />
          <DemographyCard
            title="Under 5 Population"
            value={stateData?.under_5 ? formatNumber(Number(stateData.under_5)) : "N/A"}
            icon={<FaUsers size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Women of Child Bearing Age"
            value={stateData?.wcba ? formatNumber(Number(stateData.wcba)) : "N/A"}
            icon={<Image src={womenBearing} alt="Women Bearing" width={24} height={24} />}
          />
          <DemographyCard
            title="Pregnant Women"
            value={stateData?.pregnant_women ? formatNumber(Number(stateData.pregnant_women)) : "N/A"}
            icon={<Image src={pregnant} alt="Pregnant" width={24} height={24} />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-green-700 flex items-center gap-2">
                  {titlecaption}
                  <Image
                    src={info}
                    alt="Info"
                    width={20}
                    height={20}
                  />
                </h2>
                <ToggleSwitch initial={true} onToggle={(val) => {
                  setIsPopulationMode(val);
                  setTitlecaption(val ? "Population by accessibility" : "Hard to reach LGAs");
                }} />
              </div>
              <div className="flex justify-between text-sm gap-4 text-gray-700">
                <span className="text-blue-600 font-semibold">
                  Total: {stateData?.no_of_lgas || "N/A"}
                </span>
                <span className="text-green-600 font-semibold">
                  Safe:{" "}
                  {stateData?.no_of_lgas && stateData?.total_Hard_To_Reach !== undefined
                    ? stateData.no_of_lgas - stateData.total_Hard_To_Reach
                    : "N/A"}
                </span>
                <span className="text-red-600 font-semibold">
                  Hard to reach: {stateData?.total_Hard_To_Reach ?? "N/A"}
                </span>
              </div>
            </div>

            <div className="relative border border-gray-100 bg-white rounded-3xl p-4 shadow-sm flex items-center justify-center min-h-[380px]">
              <StateLGAChoropleth
                stateSlug={normalizeStateName(selectedState || "fct")}
                stateName={selectedState || "Federal Capital Territory"}
                height={350}
                lgaColors={lgaColors}
                onHoverLGA={setHoveredLGA}
              />
              {hoveredLGA && (
                <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-lg pointer-events-none z-10 text-xs border border-white/10 min-w-44">
                  <p className="font-bold text-[#4ade80] text-sm mb-1">{hoveredLGA.name}</p>
                  {(() => {
                    const item = lgaList.find((x: any) => slugify(x.lga) === hoveredLGA.key);
                    if (!item) return <p className="text-gray-300 italic">No data available</p>;
                    return (
                      <div className="space-y-1">
                        <p className="flex justify-between gap-4">
                          <span className="text-gray-400">Population:</span>
                          <span className="font-semibold text-white">{formatNumber(item.lga_population)}</span>
                        </p>
                        <p className="flex justify-between gap-4">
                          <span className="text-gray-400">Status:</span>
                          <span className={`font-semibold ${item.hard_to_reach_lgas === "Yes" ? "text-red-400" : "text-green-400"}`}>
                            {item.hard_to_reach_lgas === "Yes" ? "Hard to Reach" : "Safe"}
                          </span>
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          <LgaSummaryTable
            title="LGA Summary"
            data={paginatedLgaList}
            totalCount={lgaList.length}
            pageSize={pageSize}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={filteredLgaList.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default DemographyPage;
