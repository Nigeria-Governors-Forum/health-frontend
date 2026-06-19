"use client";

import DonutChart from "../components/DonoughtChart";
import MultiLineChart from "../components/LineChart";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Endpoints, httpClient } from "../api-client/src";
import DemographyCard from "../components/DemographyCard";
import LoadingScreen from "../components/LoadingScreen";
import { useTopbarFilters } from "../context/TopbarFiltersContext";
import Image from "next/image";
import ToggleSwitch from "../components/ToggleSwitch";
import { StateLGAChoropleth, normalizeStateName, slugify } from "../components/ng-maps";
import { FiInfo } from "react-icons/fi";

export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  const [titlecaption, setTitlecaption] = useState("Population by accessibility");
  const [isPopulationMode, setIsPopulationMode] = useState(true);
  const [hoveredLGA, setHoveredLGA] = useState<{ name: string; key: string } | null>(null);

  const [stateData, setStateData] = useState<any>();
  const [demographyData, setDemographyData] = useState<any>();

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

      // Fetch demography data to get LGA populations and status mapping
      const demoStats = await httpClient.get(
        `${Endpoints.demography.summary}/${stateParam}/${selectedYear}`,
      );
      setDemographyData((demoStats as any).data);

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

  const lgaList = useMemo(() => {
    return Array.isArray(demographyData?.demography_LGA)
      ? demographyData.demography_LGA
      : [];
  }, [demographyData]);

  const lgaColors = useMemo(() => {
    const colors: Record<string, string> = {};
    if (lgaList.length === 0) return colors;

    if (isPopulationMode) {
      const populations = lgaList.map((item: any) => Number(item.lga_population) || 0);
      const minPop = Math.min(...populations);
      const maxPop = Math.max(...populations);
      const popRange = maxPop - minPop || 1;

      lgaList.forEach((item: any) => {
        const key = slugify(item.lga);
        const pop = Number(item.lga_population) || 0;
        const ratio = (pop - minPop) / popRange;
        // Denser -> darker green (lightness: 25%), less populated -> lighter green (lightness: 92%)
        const lightness = 92 - ratio * (92 - 25);
        const saturation = 35 + ratio * (85 - 35);
        colors[key] = `hsl(140, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
      });
    } else {
      lgaList.forEach((item: any) => {
        const key = slugify(item.lga);
        const isHard = (item.hard_to_reach_lgas || "").toString().trim().toLowerCase() === "yes";
        colors[key] = isHard ? "#EF4444" : "#22C55E";
      });
    }
    return colors;
  }, [lgaList, isPopulationMode]);

  const chartData = [
    { name: "Covered", value: stateData?.insurance_coverage, color: "#00C951" },
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

  const handleToggle = (value: boolean) => {
    setIsPopulationMode(value);
    setTitlecaption(value ? "Population by accessibility" : "Hard to reach LGAs");
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
            <div className="bg-white rounded-xl shadow-md p-4 w-auto mb-4">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-[#07923F] mb-3 text-center flex items-center gap-2">
                  {titlecaption}
                  <FiInfo className="text-green-900" size={20} />

                </h2>
                <ToggleSwitch initial={true} onToggle={handleToggle} />
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
            <div className="relative border border-gray-100 bg-white rounded-3xl p-4 shadow-sm flex items-center justify-center min-h-[380px]">

              <StateLGAChoropleth
                stateSlug={normalizeStateName(selectedState || "fct")}
                stateName={selectedState || "Federal Capital Territory"}
                height={350}
                lgaColors={lgaColors}
                onHoverLGA={setHoveredLGA}
              />
              {hoveredLGA && (
                <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-lg pointer-events-none z-10 text-xs border border-white/10 min-w-44">
                  <p className="font-bold text-[#4ade80] text-sm mb-1">{hoveredLGA.name}</p>
                  {(() => {
                    const item = lgaList.find((x: any) => slugify(x.lga) === hoveredLGA.key);
                    if (!item) return <p className="text-gray-300 italic">No data available</p>;
                    return (
                      <div className="space-y-1">
                        <p className="flex justify-between gap-4">
                          <span className="text-gray-400">Population:</span>
                          <span className="font-semibold text-white">{formatNumber(item.lga_population)}</span>
                        </p>
                        <p className="flex justify-between gap-4">
                          <span className="text-gray-400">Status:</span>
                          <span className={`font-semibold ${item.hard_to_reach_lgas === "Yes" ? "text-red-400" : "text-green-400"}`}>
                            {item.hard_to_reach_lgas === "Yes" ? "Hard to Reach" : "Safe"}
                          </span>
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
