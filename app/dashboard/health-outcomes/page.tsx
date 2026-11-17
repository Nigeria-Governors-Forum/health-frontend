"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import ServiceCoverageCard from "@/app/components/ServiceCoverageCard";
import { Endpoints, httpClient } from "@/app/api-client/src";

interface HealthOutcome {
    id?: number;
    indicator: string;
    source?: string | null;
    value: number | null;
    target: number | null;
}

interface HealthOutcomesResponse {
    data?: {
        state: string;
        year: number;
        outcomes: HealthOutcome[];
    };
}

const HealthOutcomes = () => {
    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState<HealthOutcome[] | null>(null);
    const [error, setError] = useState(false);
    const { selectedState, selectedYear } = useTopbarFilters();
    const router = useRouter();

    const stateParam =
        selectedState === "Federal Capital Territory"
            ? "FCT"
            : selectedState === "Nassarawa"
                ? "Nasarawa"
                : selectedState;

    useEffect(() => {
        if (!stateParam || !selectedYear) {
            setOutcomes(null);
            setError(false);
            setLoading(false);
            return;
        }

        let isCurrentRequest = true;
        const fetchData = async () => {
            setLoading(true);
            setOutcomes(null);
            setError(false);
            try {
                const response = await httpClient.get<HealthOutcomesResponse>(
                    `${Endpoints.healthOutcomes.summary}/${stateParam}/${selectedYear}`,
                );
                if (!Array.isArray(response.data?.outcomes)) {
                    throw new Error("Health outcomes API returned an invalid response");
                }
                if (isCurrentRequest) setOutcomes(response.data.outcomes);
            } catch (error) {
                console.error("Failed to fetch health outcomes:", error);
                if (isCurrentRequest) {
                    setOutcomes([]);
                    setError(true);
                    toast.error("Failed to load health outcomes");
                }
            } finally {
                if (isCurrentRequest) setLoading(false);
            }
        };

        void fetchData();
        return () => {
            isCurrentRequest = false;
        };
    }, [stateParam, selectedYear]);

    return (
        <>
            {loading && <LoadingScreen text="Loading health outcomes..." />}
            <div className="flex flex-col gap-8 w-full text-black">
                {!selectedState ? (
                    <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 text-center text-gray-600 shadow-sm">
                        Select a state to view health outcomes.
                    </div>
                ) : outcomes && outcomes.length > 0 ? (
                    <div className="w-full rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-lg font-bold text-gray-800">
                                {selectedState} Health Outcomes
                            </h2>
                            <p className="text-sm text-gray-500">{selectedYear}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                            {outcomes.map((outcome, index) => {
                                const hasNonzeroTarget =
                                    outcome.target !== null &&
                                    outcome.target !== undefined &&
                                    Number(outcome.target) !== 0;
                                const value =
                                    outcome.value === null
                                        ? null
                                        : Number(outcome.value);

                                return (
                                    <ServiceCoverageCard
                                        key={
                                            outcome.id ??
                                            `${outcome.indicator}-${outcome.source ?? ""}-${index}`
                                        }
                                        title={
                                            outcome.source
                                                ? `${outcome.indicator} — ${outcome.source}`
                                                : outcome.indicator
                                        }
                                        value={
                                            value !== null && Number.isFinite(value)
                                                ? value
                                                : null
                                        }
                                        target={
                                            hasNonzeroTarget
                                                ? Number(outcome.target)
                                                : 0
                                        }
                                        color="green"
                                        showPercentage={hasNonzeroTarget}
                                        showTarget={hasNonzeroTarget}
                                        formatAsNumber={!hasNonzeroTarget}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : error ? (
                    <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center text-red-600 shadow-sm">
                        Unable to load health outcomes. Please try again.
                    </div>
                ) : (
                    !loading && (
                        <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 text-center text-gray-600 shadow-sm">
                            No health outcomes found for {selectedState} in {selectedYear}.
                        </div>
                    )
                )}

                {/* <div className="flex justify-center pt-4">
                    <button
                        onClick={() => router.push("/dashboard/zonal-health-outcomes")}
                        className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
                    >
                        View Zonal / National Comparison
                    </button>
                </div> */}
            </div>
        </>
    );
};

export default HealthOutcomes;
