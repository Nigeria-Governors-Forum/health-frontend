"use client";

import { FaMapMarked, FaMoneyCheck, FaPersonBooth } from "react-icons/fa";
import DonutChart from "../components/DonoughtChart";
import MultiLineChart from "../components/LineChart";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NominatimMap from "../components/NominaWrapper";
import { Endpoints, httpClient } from "../api-client/src";
import DemographyCard from "../components/DemographyCard";
import LoadingScreen from "../components/LoadingScreen";
import MapView from "../components/MapWrapper";
import { useTopbarFilters } from "../context/TopbarFiltersContext";

export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);
  const { selectedState, selectedYear } = useTopbarFilters();
  // console.log('selected state', selectedState);

  const [stateData, setStateData] = useState<any>();

  const [rawTopoOrGeo, setRawTopoOrGeo] = useState<any>(null);
  const [mapGeo, setMapGeo] = useState<any>(null);

  const stateAlias: Record<string, string> = {
    fct: "federalcapitalterritory",
    federalcapitalterritory: "federalcapitalterritory",
    adamawa: "adamawa",
    abia: "abia",
    lagos: "lagos",
    // Add more if your shapefile uses "xyz state"
  };

  const normalize = (s?: string) =>
    (s ?? "")
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  useEffect(() => {
    const loadShape = async () => {
      try {
        const res = await fetch("/Nigeria_shapefile.json"); // put file in /public
        const json = await res.json();

        if (json?.features?.length) {
          console.log(
            "🔎 Example feature properties:",
            json.features[0].properties
          );
        }
        // if Topology, convert to GeoJSON (take the first object)
        if (json?.type === "Topology") {
          // @ts-ignore
          const topojson = await import("topojson-client");
          const objName = Object.keys(json.objects)[0];
          const geo = (topojson as any).feature(json, json.objects[objName]);
          setRawTopoOrGeo(geo);
        } else {
          setRawTopoOrGeo(json);
        }
      } catch (err) {
        console.error("Could not load shapefile:", err);
      }
    };

    loadShape();
  }, []);

  useEffect(() => {
    if (!rawTopoOrGeo || !stateData || !selectedState) return;

    // 🔹 Normalize helper
    const normalize = (s?: string) =>
      (s ?? "")
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    // 🔹 Handle alias
    const stateAlias: Record<string, string> = {
      fct: "federalcapitalterritory",
      federalcapitalterritory: "federalcapitalterritory",
      // add more if you see mismatches
    };

    const rawNorm = normalize(
      selectedState === "Federal Capital Territory" ? "FCT" : selectedState
    );
    const stateNorm = stateAlias[rawNorm] || rawNorm;

    // console.log("🟢 Selected state (raw):", selectedState);
    // console.log("🟢 After normalize:", rawNorm);
    // console.log("🟢 After alias:", stateNorm);

    // 🔹 Debug shapefile states
    if (rawTopoOrGeo?.features?.length) {
      const uniqueStates = [
        ...new Set(rawTopoOrGeo.features.map((f: any) => f.properties?.NAME_1)),
      ];
      // console.log("📍 All shapefile states (NAME_1):", uniqueStates);
    }

    // 🔹 Build LGA lookup from API
    const dem = stateData.demography_LGA ?? [];
    const lgaLookup = dem.reduce((acc: Record<string, any>, item: any) => {
      const key = normalize(item.lga);
      acc[key] = {
        population: item.lga_population,
        hardToReach: item.hard_to_reach_lgas === "Yes",
        name: item.lga,
      };
      return acc;
    }, {});

    // 🔹 Filter shapefile features for this state
    const stateFeatures = (rawTopoOrGeo.features || []).filter((f: any) => {
      let nameProp = f.properties?.NAME_1 ?? f.properties?.state ?? "";
      const cleaned = nameProp.replace(/state$/i, "");
      const nameNorm = normalize(cleaned);

      const isMatch =
        nameNorm.includes(stateNorm) || stateNorm.includes(nameNorm);

      if (isMatch) {
        // console.log(`✅ MATCHED shapefile state:`, nameProp, "→", nameNorm);
      } else {
        // console.log(`❌ NOT matched:`, nameProp, "→", nameNorm);
      }

      return isMatch;
    });

    // console.log("✅ Total matched features:", stateFeatures.length);

    // 🔹 Enrich with population + status
    const enrichedFeatures = stateFeatures.map((f: any) => {
      const lgaProp =
        f.properties?.NAME_2 ?? f.properties?.LGA ?? f.properties?.NAME ?? "";
      const key = normalize(lgaProp);
      const info = lgaLookup[key];

      if (!info) {
        // console.log(`⚠️ No LGA data match for:`, lgaProp, "→", key);
      }

      return {
        ...f,
        properties: {
          ...f.properties,
          status: info ? (info.hardToReach ? "bad" : "good") : "unknown",
          population: info?.population ?? null,
          lga: info?.name ?? lgaProp,
        },
      };
    });

    // console.log("✨ Enriched features:", enrichedFeatures.length);

    setMapGeo({ type: "FeatureCollection", features: enrichedFeatures });
  }, [rawTopoOrGeo, stateData, selectedState]);

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
        `${Endpoints.dashboard.summary}/${stateParam}/${selectedYear}`
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
    { name: "Covered", value: stateData?.insurance_coverage, color: "#008000" }, // green
    {
      name: "Uncovered",
      value: 100 - (stateData?.insurance_coverage || 0),
      color: "#FF3B30",
    }, // red
  ];

  const data = [
    {
      year: stateData?.graph_data[0].year,
      anc: parseFloat(
        Number(stateData?.graph_data[0]?.data[0]?.value * 100).toFixed(1)
      ),
      stunting: parseFloat(
        Number(stateData?.graph_data[0]?.data[2]?.value * 100).toFixed(1)
      ),
      zeroDose: parseFloat(
        Number(stateData?.graph_data[0]?.data[3]?.value * 100).toFixed(1)
      ),
    },
    {
      year: stateData?.graph_data[1].year,
      anc: parseFloat(
        Number(stateData?.graph_data[1]?.data[0]?.value * 100).toFixed(1)
      ),
      stunting: parseFloat(
        Number(stateData?.graph_data[1]?.data[2]?.value * 100).toFixed(1)
      ),
      zeroDose: parseFloat(
        Number(stateData?.graph_data[1]?.data[3]?.value * 100).toFixed(1)
      ),
    },
    {
      year: stateData?.graph_data[2]?.year,
      anc: parseFloat(
        Number(stateData?.graph_data[2]?.data[0]?.value * 100).toFixed(1)
      ),
      stunting: parseFloat(
        Number(stateData?.graph_data[2]?.data[2]?.value * 100).toFixed(1)
      ),
      zeroDose: parseFloat(
        Number(stateData?.graph_data[2]?.data[3]?.value * 100).toFixed(1)
      ),
    },
  ];

  const lines = [
    { key: "anc", name: "4th ANC", color: "#1D9BF0" }, // blue
    { key: "stunting", name: "Stunting", color: "#1E3A8A" }, // dark blue
    { key: "zeroDose", name: "Zero Dose", color: "#F97316" }, // orange
  ];

  return (
    <>
      {loading && <LoadingScreen text="Please wait..." />}
      <div className="space-y-8 min-h-screen">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DemographyCard
            title="State Population"
            subtitle={formatNumber(stateData?.total_population || "N/A") as any}
            icon={<FaPersonBooth size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Land mass"
            subtitle={formatNumber(stateData?.land_mass || "N/A") as any}
            icon={<FaMapMarked size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Political wards"
            subtitle={formatNumber(stateData?.political_wards || "N/A") as any}
            icon={<FaMapMarked size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Health Facility"
            subtitle={
              formatNumber(stateData?.health_facilities || "N/A") as any
            }
            icon={<FaMapMarked size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Health workers"
            subtitle={formatNumber(stateData?.hRH_Professions || "N/A")}
            icon={<FaMapMarked size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Health Training Institutions"
            subtitle={formatNumber(stateData?.hRH || "N/A")}
            icon={<FaMapMarked size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="LGAs"
            subtitle={formatNumber(stateData?.no_of_lgas || "N/A")}
            icon={<FaMapMarked size={24} color="#16a34a" />}
          />
          <DemographyCard
            title="Health Allocation"
            subtitle={formatNumber(stateData?.partners_mapping || "N/A")}
            icon={<FaMoneyCheck size={24} color="#16a34a" />}
          />
          {/* <DemographyCard
            title="Partners mapping"
            subtitle={formatNumber(stateData?.partners_mapping || "N/A")}
            icon={<FaMoneyCheck size={24} color="#16a34a" />}
          /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DonutChart title="Health Insurance Coverage" data={chartData} />
          <MultiLineChart
            title="Maternal & Child Health Trends"
            data={data}
            lines={lines}
          />
          <MapView
            mapClassName={`h-96 w-full rounded-xl shadow`}
            showCard={true}
            total={stateData?.demography_LGA.length || "N/A"}
            h2r={stateData?.totalHardToReach || "N/A"}
          />

          {/* <MapView
            mapClassName={`h-96 w-full rounded-xl shadow`}
            showCard={true}
            geojson={mapGeo}
            total={stateData?.demography_LGA?.length}
            h2r={stateData?.total_Hard_To_Reach}
          /> */}
        </div>
        <NominatimMap highlightQuery={selectedState} />
      </div>
    </>
  );
}
