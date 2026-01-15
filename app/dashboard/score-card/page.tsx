"use client";
import React, { useEffect, useRef, useState } from "react";
import ScorecardTable, { ScorecardRow } from "@repo/ui/scoreCard";
import NationalScorecardTable from "@repo/ui/nationalScoreCard";
import { useTopbarFilters } from "@repo/ui/hooks/TopbarFiltersContext";
import LoadingScreen from "@repo/ui/loadingScreen";
import toast from "react-hot-toast";
import { Endpoints, httpClient } from "../../../api-client/src";

interface ScoreCardProps {
  state: string;
}
const ScoreCard = () => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<any>("DMA");
  const [selectedRound, setSelectedRound] = useState("");

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
    categories[0]?.value
  );
  const columnTwo: ScorecardRow[] = stateData?.selected_state || [];
  const prevValues = useRef({
    selectedRound,
    selectedState,
    selectedYear,
    selectedCategory,
  });

  const sampleData = stateData?.all_states || [];

  const getStateParam = (state: string) => {
    if (state === "Federal Capital Territory") return "FCT";
    if (state === "Nassarawa") return "Nasarawa";
    return state;
  };

  const fetchData = async () => {
    if (!selectedState || !selectedYear) return;

    setLoading(true);
    const stateParam = getStateParam(selectedState);

    try {
      const url =
        selectedCategory === "Nutrition"
          ? `${Endpoints.scorecard.summary}/${stateParam}/${selectedYear}/${selectedCategory}/${selectedRound}`
          : `${Endpoints.scorecard.summary}/${stateParam}/${selectedYear}/${selectedCategory}`;

      const stats = await httpClient.get(url);
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
      <div className="flex justify-around text-black">
        <div>
          <h1 className="text-2xl font-bold mb-6">Scorecard Dashboard</h1>
        </div>

        <div className="mb-6 text-black">
          <label htmlFor="category" className="mr-2 font-medium">
            Select Category:
          </label>
          <select
            id="category"
            className="border rounded px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory === "Nutrition" && (
          <div className="mb-6 text-black">
            <label htmlFor="category" className="mr-2 font-medium">
              Select Round:
            </label>
            <select
              id="round"
              className="border rounded px-3 py-2"
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
            >
              {round.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
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
    </>
  );
};

export default ScoreCard;
