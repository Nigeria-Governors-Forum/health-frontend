"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import { useRouter } from "next/navigation";
import { ScorecardRow } from "@/app/components/ScoreCard";
import NationalScorecardTable from "@/app/components/NationalScoreCard";
import CategorySelect from "@/app/components/CategoryOption";
import ToggleSwitch from "@/app/components/ToggleSwitch";
import {
  NigeriaStatesChoropleth,
  normalizeStateName,
} from "@/app/components/ng-maps";

const scorecardCategoryMap: Record<string, string> = {
  SDSS: "sdss",
  "Health Information": "health-information",
  "Health Insurance": "health-insurance",
  "Health Security": "health-security",
  Immunization: "immunization",
  Nutrition: "nutrition",
  "PHC Systems": "phc-systems",
};

const normalizeScorecardCategory = (category: string) =>
  scorecardCategoryMap[category] || category.toLowerCase().replace(/\s+/g, "-");

const normalizeRound = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const getStateParam = (state: string) => {
  if (state === "Federal Capital Territory") return "FCT";
  if (state === "Nassarawa") return "Nasarawa";
  return state;
};

const ZonalScoreCard = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [selectedRound, setSelectedRound] = useState("Round 1");
  const [showNationalView, setShowNationalView] = useState(true);
  const [mapIndicator, setMapIndicator] = useState("");
  const { selectedState, selectedYear } = useTopbarFilters();
  const router = useRouter();

  const categories = [
    { value: "SDSS", label: "SDSS Scorecard" },
    { value: "Health Information", label: "Health Information Scorecard" },
    { value: "Health Insurance", label: "Health Insurance Scorecard" },
    { value: "Health Security", label: "Health Security Scorecard" },
    { value: "Immunization", label: "Immunization Scorecard" },
    { value: "Nutrition", label: "Nutrition Scorecard" },
    { value: "PHC Systems", label: "PHC Systems Scorecard" },
  ];

  const round = [
    { value: "Round 1", label: "Round 1" },
    { value: "Round 2", label: "Round 2" },
    { value: "Round 3", label: "Round 3" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.value || "SDSS",
  );

  const prevValues = useRef<{
    selectedRound: string;
    selectedState: string;
    selectedYear: number;
    selectedCategory: string;
  } | null>(null);

  const requiresRoundFilter =
    selectedCategory === "Nutrition" || selectedCategory === "Immunization";

  const fetchData = useCallback(async () => {
    if (!selectedState || !selectedYear) return;

    if (
      prevValues.current &&
      prevValues.current.selectedState === selectedState &&
      prevValues.current.selectedYear === selectedYear &&
      prevValues.current.selectedRound === selectedRound &&
      prevValues.current.selectedCategory === selectedCategory
    ) {
      return;
    }

    prevValues.current = {
      selectedState,
      selectedYear,
      selectedRound,
      selectedCategory,
    };

    setLoading(true);
    const stateParam = getStateParam(selectedState);

    try {
      const categorySlug = normalizeScorecardCategory(selectedCategory);
      const url = requiresRoundFilter
        ? `${Endpoints.scorecard.summary}/${stateParam}/${selectedYear}/${categorySlug}/${normalizeRound(selectedRound)}`
        : `${Endpoints.scorecard.summary}/${stateParam}/${selectedYear}/${categorySlug}`;

      const response = (await httpClient.get(url)) as {
        data?: Record<string, unknown>;
      };
      setStateData(response?.data ?? null);
    } catch {
      toast.error("Failed to load scorecard data");
    } finally {
      setLoading(false);
    }
  }, [requiresRoundFilter, selectedCategory, selectedRound, selectedState, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stateViewData = useMemo(
    () =>
      ((stateData?.selected_state as ScorecardRow[]) || []) as ScorecardRow[],
    [stateData],
  );

  const nationalViewData = useMemo(
    () =>
      ((stateData?.all_states as Record<string, ScorecardRow[]>) ||
        {}) as Record<string, ScorecardRow[]>,
    [stateData],
  );

  const indicatorOptions = useMemo(() => {
    const unique = new Map<string, string>();

    stateViewData.forEach((row) => {
      const indicator =
        typeof row.indicator === "string" ? row.indicator.trim() : "";
      if (!indicator) return;
      unique.set(indicator.toLowerCase(), indicator);
    });

    return Array.from(unique.values()).map((label) => ({
      value: label,
      label,
    }));
  }, [stateViewData]);

  useEffect(() => {
    if (!indicatorOptions.length) return;
    if (
      !mapIndicator ||
      !indicatorOptions.some((option) => option.value === mapIndicator)
    ) {
      setMapIndicator(indicatorOptions[0].value);
    }
  }, [indicatorOptions, mapIndicator]);

  const nationalStatusByState = useMemo(() => {
    if (!mapIndicator) return {} as Record<string, number>;

    const result: Record<string, number> = {};

    Object.entries(nationalViewData).forEach(([stateNameKey, rows]) => {
      const match = rows.find((row) => {
        const indicator =
          typeof row.indicator === "string" ? row.indicator.trim() : "";
        return indicator.toLowerCase() === mapIndicator.toLowerCase();
      });

      if (!match) return;

      const value = Number(match.value ?? match.status ?? match.score ?? 0);
      if (Number.isFinite(value)) {
        result[normalizeStateName(stateNameKey)] = value;
      }
    });

    return result;
  }, [mapIndicator, nationalViewData]);

  const nationalValueForState = useCallback(
    (slug: string) => nationalStatusByState[slug] ?? 0,
    [nationalStatusByState],
  );

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}

      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[220px] flex-1">
            <CategorySelect
              label="Select Category:"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          {requiresRoundFilter && (
            <div className="min-w-[180px] max-w-xs">
              <CategorySelect
                label="Select Round:"
                options={round}
                value={selectedRound}
                onChange={setSelectedRound}
              />
            </div>
          )}

          {!showNationalView && (
            <div className="max-w-sm">
              <CategorySelect
                label="Select Indicator:"
                options={indicatorOptions}
                value={mapIndicator}
                onChange={setMapIndicator}
              />
            </div>
          )}

          <div className="flex h-[46px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-sm">
            <span className="whitespace-nowrap text-sm font-medium text-gray-700">
              {showNationalView ? "National View" : "Map View"}
            </span>
            <ToggleSwitch
              initial={showNationalView}
              onToggle={setShowNationalView}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl shadow">
          {showNationalView ? (
            <NationalScorecardTable
              title="National View"
              data={nationalViewData}
            />
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-3">
              {mapIndicator ? (
                <>
                  <NigeriaStatesChoropleth
                    key={`${selectedCategory}-${mapIndicator}`}
                    valueForState={nationalValueForState}
                    valueLabel="Target met"
                    height={520}
                    colorForValue={(value) =>
                      value === 1
                        ? "#16a34a"
                        : value === 0
                          ? "#dc2626"
                          : "#e5e7eb"
                    }
                  />
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#16a34a]" />1 /
                      Target met
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#dc2626]" />0 /
                      Target not met
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center text-sm text-gray-500">
                  Select an indicator to load the map.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => router.push("/dashboard/score-card")}
          className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
        >
          Go back to Dashboard
        </button>
      </div>
    </>
  );
};

export default ZonalScoreCard;
