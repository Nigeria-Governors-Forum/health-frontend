"use client";

import React, { useEffect, useState } from "react";
import { getZoneByState } from "nigerian-geopolitical-zones";
import toast from "react-hot-toast";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";
import { useRouter } from "next/navigation";
import ServiceCoverageCard from "../../components/ServiceCoverageCard";

const healthOutcomesData = [
    { title: "Zero Dose Children (12–23Months)", value: 40, target: 60, color: "green" as const },
    { title: "Children with Stunting", value: 40, target: 60, color: "red" as const },
    { title: "Children with Wasting", value: 40, target: 60, color: "green" as const },
    { title: "Children Underweight", value: 40, target: 60, color: "green" as const },
    { title: "Neonatal Mortality", value: 40, target: 60, color: "green" as const },
    { title: "Infant Mortality", value: 40, target: 60, color: "green" as const },
    { title: "Under-5 Mortality", value: 40, target: 60, color: "green" as const },
];

const HealthOutcomes = () => {
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {healthOutcomesData.map((card, index) => (
                            <ServiceCoverageCard
                                key={index}
                                title={card.title}
                                value={card.value}
                                target={card.target}
                                color={card.color}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => router.push("/dashboard/zonal-health-outcomes")}
                        className="text-[#00A141] px-8 py-2 border border-[#00A141] text-lg font-semibold rounded-full cursor-pointer hover:bg-green-50 transition-colors"
                    >
                        View Zonal / National Comparison
                    </button>
                </div>
            </div>
        </>
    );
};

export default HealthOutcomes;
