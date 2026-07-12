"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ScorecardTable, { ScorecardRow } from "@/app/components/ScoreCard";
import NationalScorecardTable from "@/app/components/NationalScoreCard";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import CategorySelect from "@/app/components/CategoryOption";
import { useRouter } from "next/navigation";

interface ScoreCardProps {
  state: string;
}
const ScoreCard = () => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<any>("DMA");
  const [selectedRound, setSelectedRound] = useState("");
  const router = useRouter();

  const categories = [
    { value: "DMA", label: "DMA Scorecard" },
    { value: "Health Information", label: "Health Information Scorecard" },
    { value: "Health Insurance", label: "Health Insurance Scorecard" },
    { value: "Health Security", label: "Health Security Scorecard" },
    { value: "Immunization", label: "Immunization Scorecard" },
    { value: "Nutrition", label: "Nutrition Scorecard" },
    { value: "PHCLC", label: "PHCLC Scorecard" },
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
  const columnTwo: ScorecardRow[] = stateData?.selected_state || [];
  const prevValues = useRef<{
    selectedRound: string;
    selectedState: string;
    selectedYear: number;
    selectedCategory: string;
  } | null>(null);

  const sampleData = stateData?.all_states || [];

  const getStateParam = (state: string) => {
    if (state === "Federal Capital Territory") return "FCT";
    if (state === "Nassarawa") return "Nasarawa";
    return state;
  };

  const fetchData = async () => {
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
      const url =
        selectedCategory === "Nutrition"
          ? `${Endpoints.scorecard.summary}/${stateParam}/${selectedYear}/${selectedCategory}/${selectedRound}`
          : `${Endpoints.scorecard.summary}/${stateParam}/${selectedYear}/${selectedCategory}`;

      const stats = await httpClient.get(url);
      // @ts-ignore
      setStateData(stats?.data);
    } catch (error) {
      toast.error("Failed to load scorecard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRound, selectedState, selectedYear, selectedCategory]);

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

        <div className="overflow-hidden rounded-xl shadow">
          <NationalScorecardTable title="National View" data={sampleData} />
        </div>
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
