"use client";

import React, { useEffect, useState } from "react";
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
  const [indicator, setIndicator] = useState<string>("total_hrh");
  const { selectedState, setSelectedState, selectedYear, setSelectedYear } =
    useTopbarFilters();
  const router = useRouter();

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
        `${Endpoints.healthFacilities.zone}/${selectedZone}/${stateParam}/${selectedYear}`,
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
    if (!selectedState) return;

    const zoneArea = getZoneByState(selectedState.toLocaleLowerCase());
    setSelectedZone(zoneArea?.zone.toLocaleLowerCase());
  }, [selectedState]);

  useEffect(() => {
    if (!selectedZone || !selectedState || !selectedYear) return;
    fetchData();
  }, [selectedZone, selectedState, selectedYear, indicator]);

  const sampleData = stateData?.zoneWithin;

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
                title="North Central"
                variant="simple"
                simpleColor="#2563EB"
                data={[
                  { label: "Bauchi", value: 18 },
                  { label: "Adamawa", value: 20 },
                  { label: "Taraba", value: 32 },
                  { label: "Gombe", value: 14 },
                  { label: "Yobe", value: 22 },
                  { label: "Borno", value: 6 },
                  { label: "Jigawa", value: 16 },
                ]}
                radius={[10, 10, 10, 10]} // rounds the top corners by 10px

              />
            </div>
          </div>
        )}
        {mode === "national" && (
          <div className="bg-white rounded-2xl shadow p-4">
            <NigeriaStatesChoropleth
              valueForState={(slug: string) => {
                const value = stateData?.[slug];
                return typeof value === "number" ? value : 50;
              }}
              valueLabel="Score"
            />
          </div>
        )}
        {mode === "trend" && (
          <div className="bg-white rounded-2xl shadow p-4">
            <TrendAreaChart
              data={stateData?.trend?.map((point: any) => ({
                label: point.year,
                value: point.value,
              }))}
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
