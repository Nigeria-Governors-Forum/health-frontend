"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { getZoneByState } from "nigerian-geopolitical-zones";
import State from "naija-state-local-government";
import toast from "react-hot-toast";
import StateBarChart, { type StateData } from "../../components/StateBarChart";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import { useRouter } from "next/navigation";
import ComparisonFilterPanel, {
  type ComparisonMode,
} from "@/app/components/ComparisonFilter";
import { NigeriaStatesChoropleth } from "@/app/components/ng-maps";
import TrendAreaChart from "@/app/components/TrendAreaChart";

type TrendPoint = {
  year: number | string;
  value: number | string;
};

type NationalHealthStateData = {
  zoneWithin?: StateData[];
  trend?: TrendPoint[];
  total_facilities?: Record<string, number>;
  per_capita?: Record<string, number>;
  [key: string]: unknown;
};

const ZonalHealthFacility = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<NationalHealthStateData | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | undefined>();
  const [mode, setMode] = useState<ComparisonMode>("zonal");
  const [selectedChartType, setSelectedChartType] = useState<string>("total_facilities");
  const { selectedState, setSelectedState, selectedYear, setSelectedYear } =
    useTopbarFilters();
  const router = useRouter();

  const lastFetched = useRef<{
    state: string;
    year?: number;
    zone: string;
    mode: ComparisonMode;
    chartType: string;
  } | null>(null);

  const nationalChartOptions = [
    { value: "total_facilities", label: "Total Facilities" },
    { value: "per_capita", label: "Per Capita" },
  ];

  const fetchData = useCallback(
    async (zoneParam?: string, requestedMode = mode) => {
      const activeZone = zoneParam || selectedZone;
      const isTrendMode = requestedMode === "trend";

      if (!selectedState || !activeZone) return;
      if (!isTrendMode && !selectedYear) return;

      if (
        lastFetched.current &&
        lastFetched.current.state === selectedState &&
        lastFetched.current.zone === activeZone &&
        lastFetched.current.mode === requestedMode &&
        lastFetched.current.chartType === selectedChartType &&
        (isTrendMode || lastFetched.current.year === selectedYear)
      ) {
        return;
      }

      lastFetched.current = {
        state: selectedState,
        year: isTrendMode ? undefined : selectedYear,
        zone: activeZone,
        mode: requestedMode,
        chartType: selectedChartType,
      };

      setLoading(true);
      const stateParam =
        selectedState === "Federal Capital Territory"
          ? "FCT"
          : selectedState === "Nassarawa"
            ? "Nasarawa"
            : selectedState;

      const endpoint = isTrendMode
        ? `${Endpoints.healthFacilities.zone}/${activeZone}/${stateParam}`
        : `${Endpoints.healthFacilities.zone}/${activeZone}/${stateParam}/${selectedYear}`;

      try {
        const stats = (await httpClient.get(endpoint)) as { data?: NationalHealthStateData };
        setStateData(stats?.data ?? null);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Invalid Credentials");
      } finally {
        setLoading(false);
      }
    },
    [mode, selectedChartType, selectedState, selectedYear, selectedZone],
  );

  useEffect(() => {
    if (!selectedState) return;

    const zoneArea = getZoneByState(selectedState.toLocaleLowerCase());
    const zone = zoneArea?.zone.toLocaleLowerCase() as string;

    if (!zone) return;

    setSelectedZone(zone);
    fetchData(zone, mode);
  }, [selectedState, selectedYear, mode, selectedChartType, fetchData]);

  const sampleData = stateData?.zoneWithin || [];
  const trendData = Array.isArray(stateData?.trend)
    ? stateData.trend.filter(
        (point: TrendPoint) => point && point.year !== undefined && point.value !== undefined,
      )
    : [];
  const uniqueTrendYears = Array.from(
    new Set(trendData.map((point: TrendPoint) => Number(point.year))),
  )
    .filter((year) => Number.isFinite(year))
    .sort((a, b) => a - b);

  const nationalValueForState = useCallback(
    (slug: string) => {
      const valueSource =
        selectedChartType === "per_capita"
          ? stateData?.per_capita
          : stateData?.total_facilities;

      if (valueSource && typeof valueSource === "object" && slug in valueSource) {
        const value = valueSource[slug];
        return typeof value === "number" ? value : 0;
      }

      const value = stateData?.[slug];
      return typeof value === "number" ? value : 0;
    },
    [selectedChartType, stateData],
  );

  const trendMetricValue = (point: TrendPoint) => {
    if (selectedChartType === "per_capita") {
      return typeof point.value === "number" ? point.value : Number(point.value || 0);
    }

    return typeof point.value === "number" ? point.value : Number(point.value || 0);
  };

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="min-h-screen space-y-6">
        <ComparisonFilterPanel
          mode={mode}
          onModeChange={setMode}
          selectedZone={selectedZone}
          selectedState={selectedState}
          selectedYear={String(selectedYear)}
          onZoneChange={setSelectedZone}
          onStateChange={setSelectedState}
          selectedChart={selectedChartType}
          onSelectedChart={setSelectedChartType}
          onYearChange={(year) => setSelectedYear(Number(year))}
          chartOptions={nationalChartOptions}
          zones={[
            { value: "north west", label: "North West" },
            { value: "north central", label: "North Central" },
            { value: "north east", label: "North East" },
            { value: "south west", label: "South West" },
            { value: "south east", label: "South East" },
            { value: "south south", label: "South South" },
          ]}
          states={State.states().map((state: string) => ({
            value: state,
            label: state,
          }))}
          years={uniqueTrendYears.length > 0 ? uniqueTrendYears.map((year) => ({
            value: String(year),
            label: String(year),
          })) : Array.from({ length: 10 }, (_, i) => {
            const year = 2016 + i;
            return { value: String(year), label: String(year) };
          })}
        />
        {mode === "zonal" && (
          <div className="grid grid-cols-1">
            <div className="flex flex-col gap-6">
              <StateBarChart
                title="Zonal Comparison"
                data={sampleData}
                className="bg-white rounded-2xl shadow p-4 h-125"
              />
            </div>
          </div>
        )}
        {mode === "national" && (
          <div className="bg-white rounded-2xl shadow p-4">
            <NigeriaStatesChoropleth
              valueForState={nationalValueForState}
              valueLabel={selectedChartType === "per_capita" ? "Per Capita" : "Total Facilities"}
            />
          </div>
        )}
        {mode === "trend" && (
          <div className="bg-white rounded-2xl shadow p-4">
            <TrendAreaChart
              data={trendData.map((point: TrendPoint) => ({
                label: String(point.year),
                value: trendMetricValue(point),
              }))}
            />
          </div>
        )}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/dashboard/health-facilities")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default ZonalHealthFacility;
