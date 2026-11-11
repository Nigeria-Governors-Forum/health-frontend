"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ScorecardTable, { ScorecardRow } from "@/app/components/ScoreCard";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import CategorySelect from "@/app/components/CategoryOption";
import { useRouter } from "next/navigation";
import NationalScorecardTable from "@/app/components/NationalScoreCard";

const ScoreCard = () => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [selectedRound, setSelectedRound] = useState("");
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
    { value: "", label: "Select" },
    { value: "Round 1", label: "Round 1" },
    { value: "Round 2", label: "Round 2" },
    { value: "Round 3", label: "Round 3" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.value,
  );
  const columnTwo: ScorecardRow[] =
    (stateData?.selected_state as ScorecardRow[]) || [];
  const prevValues = useRef<{
    selectedRound: string;
    selectedState: string;
    selectedYear: number;
    selectedCategory: string;
  } | null>(null);

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
    scorecardCategoryMap[category] ||
    category.toLowerCase().replace(/\s+/g, "-");

  const normalizeRound = (round: string) =>
    round
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const sampleData = stateData?.all_states || [];

  const getStateParam = (state: string) => {
    if (state === "Federal Capital Territory") return "FCT";
    if (state === "Nassarawa") return "Nasarawa";
    return state;
  };

  const fetchData = useCallback(async () => {
    if (!selectedState || !selectedYear) return;

    // Avoid double API calls
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
      const url =
        selectedCategory === "Nutrition"
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
  }, [selectedCategory, selectedRound, selectedState, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="flex justify-between text-black">
        <CategorySelect
          label="Select Category:"
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
        {selectedCategory === "Nutrition" && (
          <CategorySelect
            label="Select Round:"
            options={round}
            value={selectedRound}
            onChange={setSelectedRound}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="overflow-hidden rounded-xl shadow">
          <ScorecardTable
            title={`${selectedState} State Scorecard`}
            data={columnTwo}
          />
        </div>

        {/* <NationalScorecardTable title="National View" data={sampleData} /> */}
        
      </div>
      <div className="flex justify-center pt-4">
        <button
          onClick={() => router.push("/dashboard/zonal-score-card")}
          className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
        >
          View Zonal / National Comparison
        </button>
      </div>
    </>
  );
};

export default ScoreCard;
