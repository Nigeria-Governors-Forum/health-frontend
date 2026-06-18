"use client";

import DonutChart from "../components/DonoughtChart";
import MultiLineChart from "../components/LineChart";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Endpoints, httpClient } from "../api-client/src";
import DemographyCard from "../components/DemographyCard";
import LoadingScreen from "../components/LoadingScreen";
import { useTopbarFilters } from "../context/TopbarFiltersContext";
import { LGAMap, NigeriaMap, StateMap } from "@/app/components/maps";
import Image from "next/image";
import ToggleSwitch from "../components/ToggleSwitch";

export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  console.log("selected state", selectedState);

  const [stateData, setStateData] = useState<any>();

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
        `${Endpoints.dashboard.summary}/${stateParam}/${selectedYear}`,
      );
      console.log(stats);
      // @ts-ignore
      setStateData(stats.data);

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

  const chartData = [
    { name: "Covered", value: stateData?.insurance_coverage, color: "#114ACA" },
    {
      name: "Uncovered",
      value: 100 - (stateData?.insurance_coverage || 0),
      color: "#BE123C",
    },
  ];

  const data = [
    {
      year: stateData?.graph_data[0].year,
      anc: parseFloat(
        Number(stateData?.graph_data[0]?.data[0]?.value * 100).toFixed(1),
      ),
      stunting: parseFloat(
        Number(stateData?.graph_data[0]?.data[2]?.value * 100).toFixed(1),
      ),
      zeroDose: parseFloat(
        Number(stateData?.graph_data[0]?.data[3]?.value * 100).toFixed(1),
      ),
    },
    {
      year: stateData?.graph_data[1].year,
      anc: parseFloat(
        Number(stateData?.graph_data[1]?.data[0]?.value * 100).toFixed(1),
      ),
      stunting: parseFloat(
        Number(stateData?.graph_data[1]?.data[2]?.value * 100).toFixed(1),
      ),
      zeroDose: parseFloat(
        Number(stateData?.graph_data[1]?.data[3]?.value * 100).toFixed(1),
      ),
    },
    {
      year: stateData?.graph_data[2]?.year,
      anc: parseFloat(
        Number(stateData?.graph_data[2]?.data[0]?.value * 100).toFixed(1),
      ),
      stunting: parseFloat(
        Number(stateData?.graph_data[2]?.data[2]?.value * 100).toFixed(1),
      ),
      zeroDose: parseFloat(
        Number(stateData?.graph_data[2]?.data[3]?.value * 100).toFixed(1),
      ),
    },
  ];

  const lines = [
    { key: "anc", name: "4th ANC", color: "#155DFC" },
    { key: "stunting", name: "Stunting", color: "#F98600" },
    { key: "zeroDose", name: "Zero Dose", color: "#7600CD" },
  ];

  const earth = "/svg/earth.svg";
  const land = "/svg/land.svg";
  const politics = "/svg/politics.svg";
  const healthFacilities = "/svg/healthFacilities.svg";
  const healthWorkers = "/svg/healthWorkers.svg";
  const healthTraining = "/svg/healthTraining.svg";
  const lga = "/svg/lga.svg";
  const healthAllocation = "/svg/healthAllocation.svg";
  const info = "/svg/info.svg";

  const onToggle = () => {
    console.log("toggled");
  };

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="space-y-8 min-h-screen">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DemographyCard
            title="State Population"
            value={formatNumber(stateData?.total_population || "N/A") as any}
            icon={<Image src={earth} alt="Earth" width={24} height={24} />}
          />
          <DemographyCard
            title="Land mass"
            value={formatNumber(stateData?.land_mass || "N/A") as any}
            icon={<Image src={land} alt="Land" width={24} height={24} />}
          />
          <DemographyCard
            title="Political wards"
            value={formatNumber(stateData?.political_wards || "N/A") as any}
            icon={
              <Image src={politics} alt="Politics" width={24} height={24} />
            }
          />
          <DemographyCard
            title="LGAs"
            value={formatNumber(stateData?.no_of_lgas || "N/A")}
            icon={<Image src={lga} alt="LGA" width={24} height={24} />}
          />
          <DemographyCard
            title="Health Facility"
            value={formatNumber(stateData?.health_facilities || "N/A") as any}
            icon={
              <Image
                src={healthFacilities}
                alt="Health Facilities"
                width={24}
                height={24}
              />
            }
            percentage="100%"
            trend="down"
            comparisonText="vs last year"
          />
          <DemographyCard
            title="Health workers"
            value={formatNumber(stateData?.hRH_Professions || "N/A")}
            icon={
              <Image
                src={healthWorkers}
                alt="Health Workers"
                width={24}
                height={24}
              />
            }
            percentage="100%"
            trend="up"
            comparisonText="vs last year"
          />
          <DemographyCard
            title="Health Training Institutions"
            value={formatNumber(stateData?.hRH || "N/A")}
            icon={
              <Image
                src={healthTraining}
                alt="Health Training"
                width={24}
                height={24}
              />
            }
            percentage="100%"
            trend="up"
            comparisonText="vs last year"
          />

          <DemographyCard
            title="Health Allocation"
            value={formatNumber(stateData?.partners_mapping || "N/A")}
            icon={
              <Image
                src={healthAllocation}
                alt="Health Allocation"
                width={24}
                height={24}
              />
            }
            percentage="100%"
            trend="up"
            comparisonText="vs last year"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DonutChart title="Health Insurance Coverage" data={chartData} />
          <MultiLineChart
            title="Maternal & Child Health Trends"
            data={data}
            lines={lines}
          />

          <div className="space-y-2">
            <p className="text-lg font-semibold text-center text-[#07923F] mb-1 flex items-center justify-center gap-2">
              Population By Accessibility
              <Image
                src={info}
                alt="Health Facilities"
                width={24}
                height={24}
              />
            </p>
            <div className="bg-white rounded-xl shadow-md p-4 w-auto mb-4">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-[#07923F] mb-3 text-center flex items-center gap-2">
                  Population By Accessibility
                  <Image
                    src={info}
                    alt="Health Facilities"
                    width={24}
                    height={24}
                  />
                </h2>
                <ToggleSwitch initial={true} onToggle={() => onToggle} />
              </div>
              <div className="flex justify-between text-sm gap-4 text-gray-700">
                <span className="text-blue-600 font-medium">
                  Total: {stateData?.no_of_lgas || "N/A"}
                </span>
                <span className="text-green-600 font-medium">
                  Safe:{" "}
                  {stateData?.no_of_lgas - stateData?.total_Hard_To_Reach ||
                    "N/A"}
                </span>
                <span className="text-red-600 font-medium">
                  Hard to reach: {stateData?.total_Hard_To_Reach || "N/A"}
                </span>
              </div>
            </div>
            <LGAMap 
            stateId={selectedState?.toLowerCase() || "fct"}
            choroplethData={{
              [stateData?.no_of_lgas - stateData?.total_Hard_To_Reach || "N/A"]: 100,
              [stateData?.total_Hard_To_Reach || "N/A"]: 0,
            }}
            theme={{
              backgroundColor: "#F8FAFC",
              defaultFill: "#DCFCE7",
              strokeColor: "#166534",
              hoverFill: "#22C55E",
              selectedFill: "#15803D",
              labelColor: "#14532D",
            }}
            />
            {/* <NigeriaMap
              width={700}
              height={600}
              showWorldMap={false}
              onStateClick={(stateId) => console.log("Clicked:", stateId)}
              choroplethData={{
                [selectedState.toLowerCase()]: 100,
              }}
              theme={{
                backgroundColor: "#F8FAFC",
                defaultFill: "#DCFCE7",
                strokeColor: "#166534",
                hoverFill: "#22C55E",
                selectedFill: "#15803D",
                labelColor: "#14532D",
              }}
            /> */}
          </div>

          {/* <Test /> */}
        </div>
        {/* <div className="flex justify-center">
          <button
            onClick={() => console.log("hello")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer"
          >
            View Zonal/National Comparison
          </button>
        </div> */}
      </div>
    </>
  );
}
