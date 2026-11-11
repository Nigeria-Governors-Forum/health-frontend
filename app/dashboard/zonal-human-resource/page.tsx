"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
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
import { normalizeStateName } from "@/app/components/ng-maps/slugs";
import TrendAreaChart from "@/app/components/TrendAreaChart";
import ZonalBarChart from "@/app/components/Zonalbarchart";

type HumanResourceState = {
  state?: string;
  [metric: string]: number | string | undefined;
};

type TrainingInstitutionCategory = {
  states?: Array<{ state?: string; total?: number | string }>;
  total?: number | string;
};

type HumanResourceData = {
  zones?: Array<{ zone?: string; states?: HumanResourceState[] }>;
  health_training_institutions?: Record<
    string,
    Record<string, TrainingInstitutionCategory>
  >;
  trend?: Array<Record<string, number | string | undefined>>;
};

const ZonalHumanResource = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<HumanResourceData | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | undefined>();
  const [mode, setMode] = useState<ComparisonMode>("zonal");
  const [indicator, setIndicator] = useState<string>("total_hrh");
  const { selectedState, setSelectedState, selectedYear, setSelectedYear } =
    useTopbarFilters();
  const router = useRouter();

  const lastFetched = useRef<{
    state: string;
    year: number;
    zone: string;
  } | null>(null);

  const fetchData = useCallback(
    async (activeZone: string) => {
      if (!selectedState || !selectedYear || !activeZone) return;

      if (
        lastFetched.current?.state === selectedState &&
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
        const stats = await httpClient.get<HumanResourceData>(
          `${Endpoints.humanResource.zone}/${activeZone}/${stateParam}/${selectedYear}`,
        );
        setStateData(stats);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Invalid Credentials");
      } finally {
        setLoading(false);
      }
    },
    [selectedState, selectedYear],
  );

  useEffect(() => {
    if (!selectedState || !selectedYear) return;
    const zoneArea = getZoneByState(selectedState.toLocaleLowerCase());
    const zone = zoneArea?.zone.toLocaleLowerCase() as string;
    setSelectedZone(zone);
    fetchData(zone);
  }, [selectedState, selectedYear, fetchData]);

  useEffect(() => {
    if (!selectedState || !selectedYear || !selectedZone) return;
    fetchData(selectedZone);
  }, [fetchData, selectedState, selectedYear, selectedZone]);

  const sampleData = stateData?.zones;

  const normalize = (value: string) =>
    value?.trim().toLowerCase().replace(/\s+/g, " ");

  const chartData = (sampleData ?? [])
    .filter((zone) => normalize(zone.zone ?? "") === normalize(selectedZone ?? ""))
    .flatMap((zone) =>
      (zone.states ?? []).map((item) => ({
        label: item.state ?? "",
        value: Number(item[indicator] ?? 0),
      })),
    )
    .filter((item) => item.label !== "");

  const htiCategories = [
    { sources: ["College of Medicine"], key: "college" },
    {
      sources: [
        "Schools of Nursing and Midwifery",
        "School of Nursing and Midwifery",
      ],
      key: "nursing",
    },
    {
      sources: [
        "Schools of Health Technology",
        "School of Health Technology",
      ],
      key: "health",
    },
    {
      sources: ["Schools of Pharmacy", "Faculty/Dept of Pharmacy"],
      key: "pharmacy",
    },
  ] as const;
  const htiByState = new Map<
    string,
    {
      label: string;
      college: number;
      nursing: number;
      health: number;
      pharmacy: number;
    }
  >();
  const selectedZoneHti =
    stateData?.health_training_institutions?.[normalize(selectedZone ?? "")];

  htiCategories.forEach(({ sources, key }) => {
    const stateEntries = sources
      .map((source) => selectedZoneHti?.[source]?.states)
      .find(Array.isArray);
    if (!Array.isArray(stateEntries)) return;

    stateEntries.forEach(
      (entry: { state?: string; total?: number | string }) => {
        const stateName = String(entry.state ?? "");
        if (!stateName) return;

        const stateValues = htiByState.get(stateName) ?? {
          label: stateName,
          college: 0,
          nursing: 0,
          health: 0,
          pharmacy: 0,
        };
        stateValues[key] = Number(entry.total ?? 0);
        htiByState.set(stateName, stateValues);
      },
    );
  });
  const htiChartData = Array.from(htiByState.values());

  const nationalValuesByState = new Map<string, number>();
  if (indicator === "hti") {
    const trainingInstitutions = stateData?.health_training_institutions;
    if (trainingInstitutions && typeof trainingInstitutions === "object") {
      Object.values(trainingInstitutions).forEach((zone) => {
        htiCategories.forEach(({ sources }) => {
          const stateEntries = sources
            .map((source) => zone?.[source]?.states)
            .find(Array.isArray);
          stateEntries?.forEach(
            (entry: { state?: string; total?: number | string }) => {
              const stateSlug = normalizeStateName(entry.state ?? "");
              const total = Number(entry.total ?? 0);
              if (!stateSlug || !Number.isFinite(total)) return;
              nationalValuesByState.set(
                stateSlug,
                (nationalValuesByState.get(stateSlug) ?? 0) + total,
              );
            },
          );
        });
      });
    }
  } else {
    (sampleData ?? []).forEach((zone) => {
      (zone.states ?? []).forEach((entry) => {
        const stateSlug = normalizeStateName(entry.state ?? "");
        const value = Number(entry[indicator] ?? 0);
        if (stateSlug && Number.isFinite(value)) {
          nationalValuesByState.set(stateSlug, value);
        }
      });
    });
  }

  const valueLabel =
    indicator === "hti"
      ? "Health Training Institutions"
      : indicator === "total_hrh"
        ? "Total HRH"
        : indicator === "hrh_density"
          ? "HRH Density"
          : "Admissions Quota";

  const trendData = (Array.isArray(stateData?.trend) ? stateData.trend : [])
    .map((point) => {
      const metric =
        indicator === "hti"
          ? point.training_institutions
          : point[indicator] ?? point.value;
      const value = Number(metric);
      return {
        label: String(point.year ?? ""),
        value,
      };
    })
    .filter(
      (point: { label: string; value: number }) =>
        point.label && Number.isFinite(point.value),
    )
    .sort(
      (a: { label: string }, b: { label: string }) =>
        Number(a.label) - Number(b.label),
    );

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
          states={State.states().map((state: string) => ({
            value: state,
            label: state,
          }))}
          years={Array.from({ length: 10 }, (_, i) => {
            const year = 2016 + i;
            return { value: String(year), label: String(year) };
          })}
          indicators={[
            { label: "Total HRH", value: "total_hrh" },
            { label: "HRH Density", value: "hrh_density" },
            { label: "Health Training Institutions", value: "hti" },
            { label: "Admissions Quota", value: "admission_quota" },
          ]}
          selectedIndicator={indicator}
          onIndicatorChange={setIndicator}
          indicatorTitle="Indicator Filter"
          indicatorText="Select Indicator"
        />
        {mode === "zonal" && (
          <div className="grid grid-cols-1">
            <div className="flex flex-col gap-6">
              {indicator !== "hti" ? (
                <ZonalBarChart
                  title="North Central"
                  variant="simple"
                  simpleColor="#2563EB"
                  data={chartData}
                />
              ) : (
                <ZonalBarChart
                  title={selectedZone
                    ?.split(" ")
                    .map((word: string) => word[0].toUpperCase() + word.slice(1))
                    .join(" ")}
                  variant="stacked"
                  series={[
                    {
                      key: "college",
                      label: "College of Medicine",
                      color: "#2563EB",
                    },
                    {
                      key: "nursing",
                      label: "School of Nursing and Midwifery",
                      color: "#7C3AED",
                    },
                    {
                      key: "health",
                      label: "School of Health Technology",
                      color: "#F9A8C9",
                    },
                    {
                      key: "pharmacy",
                      label: "Faculty/Dept of Pharmacy",
                      color: "#FBBF24",
                    },
                  ]}
                  data={htiChartData}
                />
              )}
            </div>
          </div>
        )}
        {mode === "national" && (
          <div className="bg-white rounded-2xl shadow p-4">
            <NigeriaStatesChoropleth
              valueForState={(slug: string) => {
                return nationalValuesByState.get(slug) ?? 0;
              }}
              valueLabel={valueLabel}
            />
          </div>
        )}
        {mode === "trend" && (
          <div className="bg-white rounded-2xl shadow p-4">
            <TrendAreaChart
              data={trendData}
            />
          </div>
        )}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/dashboard/human-resource")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default ZonalHumanResource;