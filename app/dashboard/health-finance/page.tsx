"use client";

import LgaPerCapitaBarChart from "@repo/ui/lgaPerCapita";
import ComparisonBarChart from "@repo/ui/barchart";
import RechartMetricCard from "@repo/ui/rechartMetricCard";
import { useTopbarFilters } from "@repo/ui/hooks/TopbarFiltersContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Endpoints, httpClient } from "../../../api-client/src";
import LoadingScreen from "@repo/ui/loadingScreen";
import { formatNumber } from "../page";

const HealthFinance = () => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [stateData, setStateData] = useState<any>();

  const sample = stateData?.yearlyTotals;
  const data = stateData?.perCapita || [];

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
        `${Endpoints.healthFinance.summary}/${stateParam}/${selectedYear}`
      );
      console.log(stats);
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
      {/* <div className="space-y-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
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
                  Number(stateData?.expenditure?.[0]?.per_capita).toFixed(2)
                )
              ) as string
            }
            currencySymbol="₦"
            currencyDenotation="T"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
          <ComparisonBarChart
            title="Health Expenditure Trend"
            data={sample}
            currencySymbol="₦"
            actualColor="#2563EB"
            budgetColor="#10B981"
            className="ui:bg-white ui:rounded-2xl ui:shadow ui:p-4"
          />
          

          <div className="p-4 bg-white rounded-2xl shadow">
            <LgaPerCapitaBarChart
              title="Per Capita by LGA"
              data={data}
              currencySymbol="₦"
              showValueSuffix=""
              className="ui-w-full"
              autoScale={true}
            />
          </div>
        </div>
      </div> */}

      <div className="space-y-8 min-h-screen">
  {/* Row 1: 3 metric cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
  </div>

  {/* Row 2: 1 wide card (Per Capita) */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
    <RechartMetricCard
      variant="simple"
      title="Health Expenditure per Capita"
      amount={
        formatNumber(
          parseFloat(
            Number(stateData?.expenditure?.[0]?.per_capita).toFixed(2)
          )
        ) as string
      }
      currencySymbol="₦"
      currencyDenotation="T"
    />

    {/* Placeholder for future card OR leave blank */}
    <div className="hidden lg:block"></div>
  </div>

  {/* Row 3: Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
    <ComparisonBarChart
      title="Health Expenditure Trend"
      data={sample}
      currencySymbol="₦"
      actualColor="#2563EB"
      budgetColor="#10B981"
      className="ui:bg-white ui:rounded-2xl ui:shadow ui:p-4"
    />

    <div className="p-4 bg-white rounded-2xl shadow">
      <LgaPerCapitaBarChart
        title="Per Capita by LGA"
        data={data}
        currencySymbol="₦"
        showValueSuffix=""
        className="ui-w-full"
        autoScale={true}
      />
    </div>
  </div>
</div>

    </>
  );
};

export default HealthFinance;
