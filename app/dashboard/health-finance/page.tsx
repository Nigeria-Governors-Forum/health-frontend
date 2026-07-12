"use client";

import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { formatNumber } from "../page";
import ComparisonBarChart from "@/app/components/ComparisonBarChart";
import LoadingScreen from "@/app/components/LoadingScreen";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import { Endpoints, httpClient } from "@/app/api-client/src";
import LgaPerCapitaBarChart from "@/app/components/LgaPerCapita";
import RechartMetricCard from "@/app/components/RechartMetricCard";
import { useRouter } from "next/navigation";

const HealthFinance = () => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<any>();
  const router = useRouter();

  const sample = stateData?.yearlyTotals;
  const data = stateData?.perCapita || [];

  const lastFetched = useRef<{ state: string; year: number } | null>(null);

  const fetchData = async () => {
    if (!selectedState || !selectedYear) return;

    // Avoid double API calls
    if (
      lastFetched.current &&
      lastFetched.current.state === selectedState &&
      lastFetched.current.year === selectedYear
    ) {
      return;
    }
    lastFetched.current = { state: selectedState, year: selectedYear };

    setLoading(true);

    const stateParam =
      selectedState === "Federal Capital Territory"
        ? "FCT"
        : selectedState === "Nassarawa"
          ? "Nasarawa"
          : selectedState;

    try {
      const stats = await httpClient.get(
        `${Endpoints.healthFinance.summary}/${stateParam}/${selectedYear}`,
      );
      // console.log(stats);
      // @ts-ignore
      setStateData(stats?.data);

      toast.success(`Welcome, ${selectedState} - ${selectedYear}!`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedState, selectedYear]);

  const stateTotal = Number(stateData?.state_budget?.total) || 0;
  const healthTotal = Number(stateData?.health_budget?.total) || 0;

  const percentage =
    healthTotal > 0 ? ((healthTotal / stateTotal) * 100).toFixed(2) : "0";

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="space-y-8 min-h-screen">
        {/* Row 1: 3 metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2 px-4">
          <RechartMetricCard
            variant="budget"
            title="Total State Budget"
            amount={stateData?.state_budget?.formattedTotal || 0}
            breakdown={stateData?.state_budget?.breakdown || []}
            currencySymbol="₦"
          />

          <RechartMetricCard
            variant="budget"
            title="Total Health Budget"
            amount={stateData?.health_budget?.formattedTotal || 0}
            breakdown={stateData?.health_budget?.breakdown || []}
            currencySymbol="₦"
          />

          <RechartMetricCard
            variant="gauge"
            title="Health Allocation"
            valuePct={Number(percentage)}
            maxPct={15}
          />
          <RechartMetricCard
            variant="simple"
            title="Health Expenditure per Capita"
            amount={
              formatNumber(
                parseFloat(
                  Number(stateData?.expenditure?.[0]?.per_capita).toFixed(2),
                ),
              ) as string
            }
            currencySymbol="₦"
            currencyDenotation="T"

          />
        </div>

        {/* Row 3: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-2 px-4">
          <ComparisonBarChart
            title="Health Expenditure Trend"
            data={sample}
            currencySymbol="₦"
            actualColor="#9011CA"
            budgetColor="#155DFC"
            className="bg-white rounded-2xl shadow p-4"
          />

          <div className="p-4 bg-white rounded-2xl shadow">
            <LgaPerCapitaBarChart
              title="Health Expenditure Per Capita Breakdown"
              data={data}
              currencySymbol="₦"
              showValueSuffix=""
              className="w-full"
              autoScale={true}
              totalCount={data?.length}
            />
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/dashboard/zonal-health-finance")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
          >
            View Zonal / National Comparison
          </button>
        </div>
      </div>
    </>
  );
};

export default HealthFinance;
