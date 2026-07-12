"use client";

import React, { useEffect, useState, useRef } from "react";
import CustomBarChart from "../../components/CustomBarChart";
import { getZoneByState } from "nigerian-geopolitical-zones";
import toast from "react-hot-toast";
import ZonalPerBarChart from "../../components/ZonalPerCapita";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import ComparisonFilterPanel from "@/app/components/ComparisonFilter";
import { useRouter } from "next/navigation";
import State from "naija-state-local-government";
import { FiGrid } from "react-icons/fi";
import TrendAreaChart from "@/app/components/TrendAreaChart";
import { NigeriaStatesChoropleth } from "@/app/components/ng-maps";
import ZonalBarChart from "@/app/components/Zonalbarchart";

const ZonalServiceCoverage = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<any>();
  const { selectedState, selectedYear, setSelectedZone, selectedZone, setSelectedState, setSelectedYear } =
    useTopbarFilters();
  const router = useRouter();

  const [mode, setMode] = useState<any>("zonal");
  const [selectedGroup, setSelectedGroup] = useState("Maternal Care");
  const [selectedIndicator, setSelectedIndicator] = useState("ANC from Skilled Provider");

  const groupsOptions = [
    { value: "Maternal Care", label: "Maternal Care" },
    { value: "Child Health", label: "Child Health" },
    { value: "Immunization", label: "Immunization" },
    { value: "Nutrition", label: "Nutrition" },
    { value: "Emerging Health Challenges", label: "Emerging Health Challenges" },
  ];

  const indicatorsMap: Record<string, { value: string; label: string }[]> = {
    "Maternal Care": [
      { value: "ANC from Skilled Provider", label: "ANC from Skilled Provider" },
      { value: "ANC 4 Visits", label: "ANC 4 Visits" },
      { value: "Delivery by Skilled Provider", label: "Delivery by Skilled Provider" },
      { value: "Delivery in Health Facility", label: "Delivery in Health Facility" },
    ],
    "Child Health": [
      { value: "Penta 1", label: "Penta 1" },
      { value: "Penta 3", label: "Penta 3" },
    ],
    "Immunization": [
      { value: "Contraceptive Prevalence Rate (Modern)", label: "Contraceptive Prevalence Rate (Modern)" },
      { value: "Unmet Need for Family Planning", label: "Unmet Need for Family Planning" },
    ],
    "Nutrition": [
      { value: "Exclusive Breastfeeding Rate (MICS '21)", label: "Exclusive Breastfeeding Rate (MICS '21)" },
    ],
    "Emerging Health Challenges": [
      { value: "Malaria Prevalence", label: "Malaria Prevalence" },
      { value: "IPT3 Coverage", label: "IPT3 Coverage" },
      { value: "New Cases of Diabetes Mellitus", label: "New Cases of Diabetes Mellitus" },
      { value: "New Cases of Hypertension", label: "New Cases of Hypertension" },
    ],
  };

  const indicatorsOptions = indicatorsMap[selectedGroup] || [];

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group);
    const firstInd = indicatorsMap[group]?.[0]?.value || "";
    setSelectedIndicator(firstInd);
  };

  const lastFetched = useRef<{ state: string; year: number; zone: string; indicator: string } | null>(null);

  const fetchData = async (zoneParam?: string) => {
    const activeZone = zoneParam || selectedZone;
    if (!selectedState || !selectedYear || !activeZone) return;

    // Avoid double API calls
    if (
      lastFetched.current &&
      lastFetched.current.state === selectedState &&
      lastFetched.current.year === selectedYear &&
      lastFetched.current.zone === activeZone &&
      lastFetched.current.indicator === selectedIndicator
    ) {
      return;
    }
    lastFetched.current = {
      state: selectedState,
      year: selectedYear,
      zone: activeZone,
      indicator: selectedIndicator
    };

    setLoading(true);
    const stateParam =
      selectedState === "Federal Capital Territory"
        ? "FCT"
        : selectedState === "Nassarawa"
          ? "Nasarawa"
          : selectedState;
    try {
      const stats = await httpClient.get(
        `${Endpoints.serviceCoverage.zonal}/${activeZone}/${stateParam}/${selectedYear}?indicator=${encodeURIComponent(selectedIndicator)}`,
      );
      // @ts-ignore
      setStateData(stats?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch zonal coverage data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedState || !selectedYear) return;
    const zoneArea = getZoneByState(selectedState.toLocaleLowerCase());
    const zone = zoneArea?.zone as string;
    setSelectedZone(zone);
    fetchData(zone);
  }, [selectedState, selectedYear, selectedIndicator]);

  useEffect(() => {
    if (!selectedState || !selectedYear || !selectedZone) return;
    fetchData(selectedZone);
  }, [selectedZone]);

  const data = stateData?.states || [];

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}

      <div className="flex flex-col gap-4">
        <ComparisonFilterPanel
          mode={mode}
          onModeChange={setMode}
          selectedZone={selectedZone}
          selectedState={selectedState}
          selectedYear={String(selectedYear)}
          onZoneChange={setSelectedZone}
          onStateChange={setSelectedState}
          onYearChange={(year) => setSelectedYear(Number(year))}
          zones={[
            { value: "north west", label: "North West" },
            { value: "north central", label: "North Central" },
            { value: "north east", label: "North East" },
            { value: "south west", label: "South West" },
            { value: "south east", label: "South East" },
            { value: "south south", label: "South South" },
          ]}
          states={State.states().map((state: any) => ({
            value: state,
            label: state,
          }))}
          years={Array.from({ length: 10 }, (_, i) => {
            const year = 2016 + i;
            return { value: String(year), label: String(year) };
          })}
          grid2x2={true}
          groups={groupsOptions}
          selectedGroup={selectedGroup}
          onGroupChange={handleGroupChange}
          groupTitle="Group"
          groupText="Select a Group"
          groupIcon={<FiGrid size={15} />}

          indicators={indicatorsOptions}
          selectedIndicator={selectedIndicator}
          onIndicatorChange={setSelectedIndicator}
          indicatorTitle="Indicator"
          indicatorText="Select an Indicator"
          indicatorIcon={<FiGrid size={15} />}
        />
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

          {mode === "zonal" && (
            <div className="grid grid-cols-1">
              <div className="flex flex-col gap-6">
                <ZonalBarChart
                  title={selectedZone.toUpperCase()}
                  variant="simple"
                  simpleColor="#2563EB"
                  data={
                    data.length > 0
                      ? data
                      : [
                          { label: "Bauchi", value: 18 },
                          { label: "Adamawa", value: 20 },
                          { label: "Taraba", value: 32 },
                          { label: "Gombe", value: 14 },
                          { label: "Yobe", value: 22 },
                          { label: "Borno", value: 6 },
                          { label: "Jigawa", value: 16 },
                        ]
                  }
                />
              </div>
            </div>
          )}
          {mode === "national" && (
            <div className="bg-white rounded-2xl shadow p-4">
              <NigeriaStatesChoropleth
                valueForState={(slug: string) => {
                  const value = stateData?.national?.[slug];
                  return typeof value === "number" ? value : 50;
                }}
                valueLabel="Score"
              />
            </div>
          )}
          {mode === "trend" && (
            <div className="bg-white rounded-2xl shadow p-4">
              <TrendAreaChart
                data={
                  stateData?.trend && stateData.trend.length > 0
                    ? stateData.trend.map((point: any) => ({
                        label: String(point.year),
                        value: point.value,
                      }))
                    : [
                        { label: "2020", value: 45 },
                        { label: "2021", value: 50 },
                        { label: "2022", value: 58 },
                        { label: "2023", value: 62 },
                      ]
                }
              />
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/dashboard/service-coverage")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
          >
            Go Back to Dashboards
          </button>
        </div>
      </div>
    </>
  );
};

export default ZonalServiceCoverage;
