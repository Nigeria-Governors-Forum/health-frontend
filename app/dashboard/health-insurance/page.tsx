"use client";

import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/app/components/LoadingScreen";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import { Endpoints, httpClient } from "@/app/api-client/src";
import DonutChart from "@/app/components/DonoughtChart";

import { useRouter } from "next/navigation";
import IndicatorStatusTable from "@/app/components/Indicatorstatustable";
import EnrolleeBreakdownTable from "@/app/components/Enrolleebreakdowntable";

const HealthInsurance = () => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<any>();

  const sample = stateData?.yearlyTotals;
  const data = stateData?.perCapita || [];
  const router = useRouter();
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

  const chartData = [
    { name: "Covered", value: stateData?.insurance_coverage, color: "#00C951" },
    {
      name: "Uncovered",
      value: 100 - (stateData?.insurance_coverage || 0),
      color: "#BE123C",
    },
  ];

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}

      <div className="space-y-6 md:space-y-8 min-h-screen px-4 md:px-0">
        {/* <IndicatorStatusTable
          data={[
            {
              indicator: "Existence of a State Social Health Insurance Agency",
              status: "met",
            },
            { indicator: "Health Insurance Made Mandatory", status: "met" },
            {
              indicator: "At least 67% Equity Funds Release (2025)",
              status: "met",
            },
            {
              indicator:
                "Government Contribution For Formal Sector Released (2025)",
              status: "not_met",
            },
            {
              indicator: "Employee Contribution For Formal Sector (2025)",
              status: "met",
            },
          ]}
        /> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          <div className="col-span-1">
            <DonutChart title="Enrollee Breakdown" data={chartData} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <EnrolleeBreakdownTable
              title="Enrollee Breakdown"
              data={[
                { label: "Formal", value: 78 },
                { label: "Informal", value: 78 },
                { label: "TISHIP", value: 78 },
                { label: "BHCPF", value: 78 },
                { label: "Equity", value: 78 },
                { label: "Others (Specify)", value: 78 },
                { label: "Total", value: 78, isTotal: true },
              ]}
            />
          </div>
        </div>
        <div className="flex justify-center pt-4 px-4">
          <button
            onClick={() => router.push("/dashboard/zonal-health-insurance")}
            className="text-[#00A141] px-6 md:px-8 py-2 border border-[#00A141] text-sm md:text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors w-full md:w-auto"
          >
            View Zonal / National Comparison
          </button>
        </div>
      </div>
    </>
  );
};

export default HealthInsurance;
