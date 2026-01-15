"use client";

import React, { useEffect, useState } from "react";
import MapView from "../../components/MapWrapper";
import DataCard from "../../components/PieChartUi";
import toast from "react-hot-toast";
import { formatNumber } from "../page";
import { useTopbarFilters } from "@/app/hooks/TopbarFiltersContext";
import { Endpoints, httpClient } from "@/app/api-client/src";
import LoadingScreen from "@/app/components/LoadingScreen";
import SummaryTable, { SummaryRow } from "@/app/components/SummaryTable";
import HorizontalServiceProvisionBarChart from "@/app/components/HorizontalServiceProvisionBarChart";

interface HealthFacilityPageProps {
  title?: string;
}

const HealthFacility: React.FC<HealthFacilityPageProps> = ({
  title = "Total Health Facilities",
}) => {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
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
        `${Endpoints.healthFacilities.summary}/${stateParam}/${selectedYear}`
      );
      console.log(stats);
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
    fetchData();
  }, [selectedState, selectedYear]);

  const data: SummaryRow[] = [
    {
      name: "Primary",
      private: stateData?.h_facilities?.Primary?.Private,
      public: stateData?.h_facilities?.Primary?.Public,
      total:
        stateData?.h_facilities?.Primary?.Private +
        stateData?.h_facilities?.Primary?.Public,
    },
    {
      name: "Secondary",
      private: stateData?.h_facilities?.Secondary?.Private,
      public: stateData?.h_facilities?.Secondary?.Public,
      total:
        stateData?.h_facilities?.Secondary?.Private +
        stateData?.h_facilities?.Secondary?.Public,
    },
    {
      name: "Tertiary",
      private: stateData?.h_facilities?.Tertiary?.Private,
      public: stateData?.h_facilities?.Tertiary?.Public,
      total:
        stateData?.h_facilities?.Tertiary?.Private +
        stateData?.h_facilities?.Tertiary?.Public,
    },
    {
      name: "Total",
      private:
        stateData?.h_facilities?.Primary?.Private +
        stateData?.h_facilities?.Secondary?.Private +
        stateData?.h_facilities?.Tertiary?.Private,
      public:
        stateData?.h_facilities?.Primary?.Public +
        stateData?.h_facilities?.Secondary?.Public +
        stateData?.h_facilities?.Tertiary?.Public,
      total:
        stateData?.h_facilities?.Primary?.Private +
        stateData?.h_facilities?.Primary?.Public +
        stateData?.h_facilities?.Secondary?.Private +
        stateData?.h_facilities?.Secondary?.Public +
        stateData?.h_facilities?.Tertiary?.Private +
        stateData?.h_facilities?.Tertiary?.Public,
    },
  ];

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="flex flex-col gap-6">
        {/* Top Row: Left cards & Right bar chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Two stacked cards */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-3 text-center">
                {title}
              </h2>
              <div className="flex flex-col justify-around items-center text-gray-700">
                <div className="flex flex-col items-center">
                  <span className="text-blue-600 font-bold text-xl">
                    {formatNumber(Number(stateData?.health_facilities)) ||
                      "N/A"}
                  </span>
                </div>
                {/* <div className="flex flex-col items-center">
                  <span className="text-green-600">
                    <FaArrowRight size={20} color="#16a34a" />
                    <FaArrowLeft size={20} color="#16a34a" />
                  </span>
                </div> */}
                <div className="flex flex-col items-center">
                  <span className="text-red-600 font-bold">
                    {stateData?.per_person || "N/A"}
                  </span>
                  <span className="text-base italic text-red-600 ">per 10,000 population</span>
                </div>
              </div>
            </div>

            <SummaryTable title="Health Facilities Summary" data={data} />
          </div>

          {/* Right: Horizontal Bar Chart */}
          <div className="lg:col-span-2 p-4 bg-white rounded-2xl shadow">
            <HorizontalServiceProvisionBarChart
              title="Health Facilities by Service Provision"
              data={stateData?.service_provision || []}
              currencySymbol=""
              showValueSuffix="%"
              className="ui-w-full"
            />
          </div>
        </div>

        {/* Below: 2 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataCard
            title="Health Facilities by Ownership"
            secondTitle="Health Facilities by Level of Care"
            initialData={[
              {
                name: "Public",
                value:
                  stateData?.h_facilities?.Primary?.Public +
                  stateData?.h_facilities?.Secondary?.Public +
                  stateData?.h_facilities?.Tertiary?.Public,
              },
              {
                name: "Private",
                value:
                  stateData?.h_facilities?.Primary?.Private +
                  stateData?.h_facilities?.Secondary?.Private +
                  stateData?.h_facilities?.Tertiary?.Private,
              },
            ]}
            alternateData={[
              {
                name: "Primary",
                value:
                  stateData?.h_facilities?.Primary?.Private +
                  stateData?.h_facilities?.Primary?.Public,
              },
              {
                name: "Secondary",
                value:
                  stateData?.h_facilities?.Secondary?.Private +
                  stateData?.h_facilities?.Secondary?.Public,
              },
              {
                name: "Tertiary",
                value:
                  stateData?.h_facilities?.Tertiary?.Private +
                  stateData?.h_facilities?.Tertiary?.Public,
              },
            ]}
          />
          {/* <MapView
            mapClassName={`h-96 w-full rounded-xl shadow`}
            showCard={true}
            title="Health Facilities by LGA by dense"
            // total={stateData?.demography_LGA?.length}
            // h2r={stateData?.total_Hard_To_Reach}
          /> */}
        </div>
      </div>
    </>
  );
};

export default HealthFacility;
