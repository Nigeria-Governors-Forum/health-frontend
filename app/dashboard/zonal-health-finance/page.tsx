"use client";

import React, { useEffect, useState } from "react";
import CustomBarChart from "../../components/CustomBarChart";
import { getZoneByState } from "nigerian-geopolitical-zones";
import toast from "react-hot-toast";
import ZonalPerBarChart from "../../components/ZonalPerCapita";
import MapView from "@/app/components/MapWrapper";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Endpoints, httpClient } from "@/app/api-client/src";

const ZonalHealthFinance = () => {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<any>();
  const {
    selectedState,
    selectedYear,
    setSelectedZone,
    selectedZone,
  } = useTopbarFilters();

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
        `${Endpoints.healthFinance.zone}/${selectedZone}/${stateParam}/${selectedYear}`
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

  const data = stateData?.states || [];
  const perCapita = stateData?.per_capita || [];

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}

      <div className="flex flex-col gap-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <CustomBarChart
              title="Health Allocation (Zonal Comparison)"
              data={data}
              benchmark={15} // ✅ Add a benchmark line (e.g., ₦2000)
            />
            {/* <CustomBarChart
              title="Per Capita Expenditure (Zonal Comparison)"
              data={data2}
              benchmark={15} // ✅ Add a benchmark line (e.g., ₦2000)
            /> */}
            <ZonalPerBarChart
              title="Per Capita Expenditure (Zonal Comparison)"
              data={perCapita}
              className="bg-white rounded-xl shadow"
            />
          </div>
          <MapView
            mapClassName="h-96 w-full rounded-xl shadow"
            showCard={true}
            title="National Comparison"
          />
        </div>
      </div>
    </>
  );
};

export default ZonalHealthFinance;
