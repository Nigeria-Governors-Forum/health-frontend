"use client";

import { useMemo, useState } from "react";
import {
  LGAMap,
  MapLegend,
  NigeriaMap,
  StateMap,
  WardMap,
  AfricaMap,
  type GetColor,
} from "@/app/components/maps";

const stateToLga: Record<string, string[]> = {
  lagos: ["ikeja", "eti-osa", "surulere"],
  kano: ["nassarawa", "gwale"],
  "abuja-federal-capital-territory": ["abuja-municipal"],
};

const getColor: GetColor = (value) => {
  if (typeof value !== "number") return "#E2E8F0";
  if (value >= 80) return "#166534";
  if (value >= 60) return "#16A34A";
  if (value >= 40) return "#4ADE80";
  if (value >= 20) return "#86EFAC";
  return "#DCFCE7";
};

export default function MapsDemoPage() {
  const [stateId, setStateId] = useState("lagos");
  const [lgaId, setLgaId] = useState("ikeja");
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>();

  const availableLgas = useMemo(() => stateToLga[stateId] ?? [], [stateId]);

  const countryChoropleth = {
    lagos: 85,
    kano: 61,
    "abuja-federal-capital-territory": 72,
  };

  const lgaChoropleth = {
    ikeja: 92,
    "eti-osa": 68,
    surulere: 49,
    nassarawa: 55,
    gwale: 42,
    "abuja-municipal": 73,
  };

  const wardChoropleth = {
    "ikeja-ward-a": 77,
    "ikeja-ward-b": 52,
    "eti-osa-ward-a": 65,
    "nassarawa-ward-a": 44,
    "abuja-municipal-ward-a": 71,
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Reusable GeoJSON Map System Demo</h1>
        <p className="mt-1 text-sm text-slate-600">
          BaseMap composition with country/state/LGA/ward wrappers.
        </p>
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          State
          <select
            className="rounded-md border border-slate-300 p-2"
            value={stateId}
            onChange={(event) => {
              const nextState = event.target.value;
              setStateId(nextState);
              const nextLga = stateToLga[nextState]?.[0];
              if (nextLga) setLgaId(nextLga);
            }}
          >
            <option value="lagos">Lagos</option>
            <option value="ondo">Ondo</option>
            <option value="kano">Kano</option>
            <option value="abuja-federal-capital-territory">FCT</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-700">
          LGA
          <select
            className="rounded-md border border-slate-300 p-2"
            value={lgaId}
            onChange={(event) => setLgaId(event.target.value)}
          >
            {availableLgas.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>
        </label>

        <MapLegend
          title="Coverage (%)"
          items={[
            { label: "80-100", color: "#166534" },
            { label: "60-79", color: "#16A34A" },
            { label: "40-59", color: "#4ADE80" },
            { label: "20-39", color: "#86EFAC" },
            { label: "0-19", color: "#DCFCE7" },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-medium text-slate-800">AfricaMap</h2>
          <AfricaMap
            height={420}
            getColor={getColor}
            choroplethData={{
              nigeria: 85,
              ghana: 62,
              egypt: 74,
              kenya: 49,
              "south-africa": 91,
              ethiopia: 35,
              algeria: 68,
              "democratic-republic-of-the-congo": 22,
            }}
            selectedRegionId={selectedRegionId}
            onRegionClick={(id) => setSelectedRegionId(id)}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-medium text-slate-800">NigeriaMap</h2>
          <NigeriaMap
            height={420}
            getColor={getColor}
            choroplethData={countryChoropleth}
            selectedRegionId={selectedRegionId}
            onRegionClick={(id) => {
              setSelectedRegionId(id);
              setStateId(id);
              const nextLga = stateToLga[id]?.[0];
              if (nextLga) setLgaId(nextLga);
            }}
            onRegionHover={(id) => {
              // Useful for analytics or a side panel.
              console.log("Hover state:", id);
            }}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-medium text-slate-800">StateMap ({stateId})</h2>
          <StateMap
            stateId={stateId}
            height={420}
            getColor={getColor}
            choroplethData={countryChoropleth}
            selectedRegionId={selectedRegionId}
            onRegionClick={(id) => setSelectedRegionId(id)}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-medium text-slate-800">LGAMap ({stateId})</h2>
          <LGAMap
            stateId={stateId}
            height={420}
            getColor={getColor}
            choroplethData={lgaChoropleth}
            selectedRegionId={selectedRegionId}
            onRegionClick={(id) => {
              setSelectedRegionId(id);
              setLgaId(id);
            }}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-medium text-slate-800">WardMap ({lgaId})</h2>
          <WardMap
            lgaId={lgaId}
            height={420}
            getColor={getColor}
            choroplethData={wardChoropleth}
            selectedRegionId={selectedRegionId}
            onRegionClick={(id) => setSelectedRegionId(id)}
          />
        </div>
      </div>
    </div>
  );
}
