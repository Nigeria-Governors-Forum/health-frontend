"use client";

import React, { useEffect, useState, useRef } from "react";
import { getZoneByState } from "nigerian-geopolitical-zones";
import State from "naija-state-local-government";
import toast from "react-hot-toast";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import { useRouter } from "next/navigation";
import ComparisonFilterPanel, {
  type ComparisonMode,
} from "@/app/components/ComparisonFilter";
import { NigeriaStatesChoropleth } from "@/app/components/ng-maps";
import TrendAreaChart from "@/app/components/TrendAreaChart";
import ZonalBarChart from "@/app/components/Zonalbarchart";

const ZonalHealthInsurance = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<any>();
  const [selectedZone, setSelectedZone] = useState<any>();
  const [mode, setMode] = useState<ComparisonMode>("zonal");
  const [selectedChart, setSelectedChart] = useState<string>("covered");
  const { selectedState, setSelectedState, selectedYear, setSelectedYear } =
    useTopbarFilters();
  const router = useRouter();

  const chartOptions = [
    { value: "covered", label: "Covered" },
    { value: "not_covered", label: "Not Covered" },
  ];

  const lastFetched = useRef<{ state: string; year: number; zone: string } | null>(null);

  const fetchData = async (zoneParam?: string) => {
    const activeZone = zoneParam || selectedZone;
    if (!selectedState || !selectedYear || !activeZone) return;

    // Avoid double API calls
    if (
      lastFetched.current &&
      lastFetched.current.state === selectedState &&
      lastFetched.current.year === selectedYear &&
      lastFetched.current.zone === activeZone
    ) {
      return;
    }
    lastFetched.current = {
      state: selectedState,
      year: selectedYear,
      zone: activeZone,
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
        `${Endpoints.healthInsurance.zone}/${activeZone}/${stateParam}/${selectedYear}`,
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
    if (!selectedState || !selectedYear) return;
    const zoneArea = getZoneByState(selectedState.toLocaleLowerCase());
    const zone = zoneArea?.zone.toLocaleLowerCase() as string;
    setSelectedZone(zone);
    fetchData(zone);
  }, [selectedState, selectedYear]);

  useEffect(() => {
    if (!selectedState || !selectedYear || !selectedZone) return;
    fetchData(selectedZone);
  }, [selectedZone]);

  const sampleData = stateData?.zoneWithin;

  const nationalValueForState = (slug: string) => {
    const valueSource =
      selectedChart === "not_covered"
        ? stateData?.not_covered
        : stateData?.covered || stateData?.national;

    if (valueSource && typeof valueSource === "object" && slug in valueSource) {
      const value = valueSource[slug];
      return typeof value === "number" ? value : 0;
    }

    if (stateData && typeof stateData === "object" && slug in stateData) {
      const value = stateData[slug];
      return typeof value === "number" ? value : 0;
    }

    return 0;
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
          selectedChart={selectedChart}
          onSelectedChart={setSelectedChart}
          chartOptions={chartOptions}
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
        />
        {mode === "zonal" && (
          <div className="grid grid-cols-1">
            <div className="flex flex-col gap-6">
              <ZonalBarChart
                title={
                  selectedZone
                    ? `${selectedZone.toUpperCase()} - ${
                        selectedChart === "not_covered"
                          ? "Not Covered (%)"
                          : "Covered (%)"
                      }`
                    : "Zonal Comparison"
                }
                variant="simple"
                simpleColor={
                  selectedChart === "not_covered" ? "#BE123C" : "#00A141"
                }
                data={
                  Array.isArray(sampleData) && sampleData.length > 0
                    ? sampleData.map((item: any) => ({
                        label: item.state || item.label,
                        value:
                          selectedChart === "not_covered"
                            ? Number(
                                item.not_covered ??
                                  Math.max(
                                    0,
                                    100 -
                                      (item.covered ??
                                        item.value ??
                                        item.rate_graph ??
                                        0),
                                  ).toFixed(2),
                              )
                            : Number(
                                item.covered ??
                                  item.value ??
                                  item.rate_graph ??
                                  0,
                              ),
                      }))
                    : []
                }
                radius={[10, 10, 10, 10]}
              />
            </div>
          </div>
        )}
        {mode === "national" && (
          <div className="bg-white rounded-2xl shadow p-4">
            <NigeriaStatesChoropleth
              valueForState={nationalValueForState}
              valueLabel={selectedChart === "not_covered" ? "Not Covered (%)" : "Covered (%)"}
            />
          </div>
        )}
        {mode === "trend" && (
          <div className="bg-white rounded-2xl shadow p-4">
            <TrendAreaChart
              data={Array.isArray(stateData?.trend) ? stateData.trend.map((point: any) => ({
                label: String(point.year),
                value: Number(point.value || 0),
              })) : []}
            />
          </div>
        )}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/dashboard/health-insurance")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default ZonalHealthInsurance;
