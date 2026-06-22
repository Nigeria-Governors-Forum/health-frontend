"use client";

import React, { useEffect, useState } from "react";
import { getZoneByState } from "nigerian-geopolitical-zones";
import toast from "react-hot-toast";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import { useRouter } from "next/navigation";
import ServiceCoverageCard from "../../components/ServiceCoverageCard";

const categoriesData = [
  {
    title: "Maternal Care",
    cards: [
      { title: "ANC from Skilled Provider", value: 40, target: 60, color: "green" as const },
      { title: "ANC 4 Visits", value: 40, target: 60, color: "green" as const },
      { title: "Delivery by Skilled Provider", value: 40, target: 60, color: "green" as const },
      { title: "Delivery in Health Facility", value: 40, target: 60, color: "green" as const },
    ],
  },
  {
    title: "Child Health",
    cards: [
      { title: "Penta 1", value: 40, target: 60, color: "red" as const },
      { title: "Penta 3", value: 40, target: 60, color: "green" as const },
    ],
  },
  {
    title: "Immunization",
    cards: [
      { title: "Contraceptive Prevalence Rate (Modern)", value: 40, target: 60, color: "green" as const },
      { title: "Unmet Need for Family Planning", value: 40, target: 60, color: "red" as const },
    ],
  },
  {
    title: "Nutrition",
    cards: [
      { title: "Exclusive Breastfeeding Rate (MICS '21)", value: 40, target: 60, color: "green" as const },
    ],
  },
  {
    title: "Emerging Health Challenge",
    cards: [
      { title: "Malaria Prevalence", value: 40, target: 60, color: "green" as const },
      { title: "IPT3 Coverage", value: 40, target: 60, color: "red" as const },
      { title: "New Cases of Diabetes Mellitus", value: 40, target: 60, color: "green" as const },
      { title: "New Cases of Hypertension", value: 40, target: 60, color: "red" as const },
    ],
  },
];

const ServiceCoverage = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<any>();
  const { selectedState, selectedYear, setSelectedZone, selectedZone } =
    useTopbarFilters();
  const router = useRouter();

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
        `${Endpoints.healthFinance.zone}/${selectedZone}/${stateParam}/${selectedYear}`,
      );
      // console.log(stats);
      // @ts-ignore
      setStateData(stats?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const zoneArea = getZoneByState(selectedState.toLocaleLowerCase());
    setSelectedZone(zoneArea?.zone as string);
    fetchData();
  }, [selectedZone, selectedState, selectedYear]);

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}

      <div className="flex flex-col gap-8 w-full text-black">
        {/* Main Grid Content */}
        <div className="w-full bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesData.map((category, index) => (
              <div key={index} className="flex flex-col gap-4">
                {/* Category Header */}
                <div className="bg-[#00A141] text-white text-sm font-bold rounded-xl py-3 px-4 text-center min-h-[48px] flex items-center justify-center">
                  {category.title}
                </div>

                {/* Cards List */}
                <div className="flex flex-col gap-3">
                  {category.cards.map((card, cardIdx) => (
                    <ServiceCoverageCard
                      key={cardIdx}
                      title={card.title}
                      value={card.value}
                      target={card.target}
                      color={card.color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/dashboard/zonal-service-coverage")}
            className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
          >
            View Zonal / National Comparison
          </button>
        </div>
      </div>
    </>
  );
};

export default ServiceCoverage;
