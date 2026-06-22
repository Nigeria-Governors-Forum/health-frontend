"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeartbeat,
  FaFileMedicalAlt,
  FaSearch,
  FaGlobeAfrica,
  FaRegHospital,
  FaUsers,
  FaMedkit,
} from "react-icons/fa";
import { AfricaMap } from "@/app/components/ng-maps";
import { type RegionProperties } from "@/app/components/maps/types";

interface CountryStats {
  name: string;
  uhc: number;        // Universal Health Coverage Index (0 - 100)
  lifeExp: number;    // Life Expectancy in Years
  budgetAlloc: number; // Health expenditure as % of GDP
  population: string;
  capital: string;
  majorIssues: string[];
}

const countryDatabase: Record<string, CountryStats> = {
  algeria: { name: "Algeria", uhc: 72, lifeExp: 76.9, budgetAlloc: 6.0, population: "45.6M", capital: "Algiers", majorIssues: ["Chronic diseases", "Specialist physician shortages"] },
  angola: { name: "Angola", uhc: 36, lifeExp: 61.6, budgetAlloc: 2.9, population: "35.6M", capital: "Luanda", majorIssues: ["Maternal care infrastructure", "Waterborne disease prevention"] },
  benin: { name: "Benin", uhc: 40, lifeExp: 61.2, budgetAlloc: 3.5, population: "13.4M", capital: "Porto-Novo", majorIssues: ["Primary clinic funding", "Malaria burden"] },
  botswana: { name: "Botswana", uhc: 62, lifeExp: 69.3, budgetAlloc: 6.1, population: "2.6M", capital: "Gaborone", majorIssues: ["Non-communicable diseases", "Rural doctor shortages"] },
  "burkina-faso": { name: "Burkina Faso", uhc: 38, lifeExp: 62.7, budgetAlloc: 5.4, population: "22.7M", capital: "Ouagadougou", majorIssues: ["Nutrition access", "Rural clinical staffing"] },
  burundi: { name: "Burundi", uhc: 42, lifeExp: 61.8, budgetAlloc: 7.2, population: "12.9M", capital: "Gitega", majorIssues: ["Basic child healthcare", "Medical equipment shortages"] },
  cameroon: { name: "Cameroon", uhc: 37, lifeExp: 60.3, budgetAlloc: 4.1, population: "28.6M", capital: "Yaoundé", majorIssues: ["Malaria prevention", "Infrastructure distribution"] },
  "central-african-republic": { name: "Central African Republic", uhc: 28, lifeExp: 54.3, budgetAlloc: 3.8, population: "5.5M", capital: "Bangui", majorIssues: ["Emergency medical access", "Infectious outbreak response"] },
  chad: { name: "Chad", uhc: 29, lifeExp: 55.1, budgetAlloc: 4.4, population: "17.7M", capital: "N'Djamena", majorIssues: ["Malnutrition", "Access in remote regions"] },
  congo: { name: "Congo", uhc: 35, lifeExp: 64.5, budgetAlloc: 3.7, population: "6.1M", capital: "Brazzaville", majorIssues: ["Preventative medicine funding", "Rural medicine access"] },
  "democratic-republic-of-the-congo": { name: "DR Congo", uhc: 33, lifeExp: 59.7, budgetAlloc: 3.5, population: "99.0M", capital: "Kinshasa", majorIssues: ["Ebola & infectious diseases", "Primary clinic access", "Infrastructure gaps"] },
  egypt: { name: "Egypt", uhc: 68, lifeExp: 71.8, budgetAlloc: 4.8, population: "111.0M", capital: "Cairo", majorIssues: ["Non-communicable diseases", "Universal Insurance Rollout"] },
  ethiopia: { name: "Ethiopia", uhc: 39, lifeExp: 65.5, budgetAlloc: 4.1, population: "123.0M", capital: "Addis Ababa", majorIssues: ["Malnutrition", "Rural clinic staffing", "Access disparities"] },
  gabon: { name: "Gabon", uhc: 54, lifeExp: 66.5, budgetAlloc: 3.1, population: "2.4M", capital: "Libreville", majorIssues: ["Specialist clinical services", "Public-private health coordination"] },
  ghana: { name: "Ghana", uhc: 47, lifeExp: 64.3, budgetAlloc: 6.2, population: "33.5M", capital: "Accra", majorIssues: ["NHIS financing reform", "Sanitation infrastructure", "Maternal clinic expansion"] },
  kenya: { name: "Kenya", uhc: 52, lifeExp: 66.7, budgetAlloc: 5.1, population: "54.0M", capital: "Nairobi", majorIssues: ["Universal health coverage funding", "Digital health adoption", "Rural disparities"] },
  libya: { name: "Libya", uhc: 57, lifeExp: 72.8, budgetAlloc: 5.0, population: "6.8M", capital: "Tripoli", majorIssues: ["Clinical maintenance", "Supply chain stabilization"] },
  madagascar: { name: "Madagascar", uhc: 37, lifeExp: 67.0, budgetAlloc: 4.0, population: "29.6M", capital: "Antananarivo", majorIssues: ["Nutrition programs", "Rural medical supplies"] },
  mali: { name: "Mali", uhc: 38, lifeExp: 59.7, budgetAlloc: 4.3, population: "22.6M", capital: "Bamako", majorIssues: ["Vaccine coverage", "Primary care facility access"] },
  morocco: { name: "Morocco", uhc: 64, lifeExp: 74.0, budgetAlloc: 5.5, population: "37.5M", capital: "Rabat", majorIssues: ["Urban-rural clinic disparities", "Preventative medicine"] },
  mozambique: { name: "Mozambique", uhc: 35, lifeExp: 61.2, budgetAlloc: 5.8, population: "33.0M", capital: "Maputo", majorIssues: ["Infectious disease programs", "Clinical staff training"] },
  namibia: { name: "Namibia", uhc: 59, lifeExp: 63.8, budgetAlloc: 8.3, population: "2.6M", capital: "Windhoek", majorIssues: ["Clinical staffing", "Universal insurance framework"] },
  niger: { name: "Niger", uhc: 35, lifeExp: 62.8, budgetAlloc: 4.9, population: "26.2M", capital: "Niamey", majorIssues: ["Maternal care access", "Child nutrition programs"] },
  nigeria: { name: "Nigeria", uhc: 44, lifeExp: 54.8, budgetAlloc: 5.7, population: "218.5M", capital: "Abuja", majorIssues: ["Primary healthcare underfunding", "Brain drain of doctors", "High maternal mortality"] },
  rwanda: { name: "Rwanda", uhc: 58, lifeExp: 69.1, budgetAlloc: 7.8, population: "13.7M", capital: "Kigali", majorIssues: ["Community insurance sustainability", "Mental health integration"] },
  senegal: { name: "Senegal", uhc: 48, lifeExp: 67.9, budgetAlloc: 5.2, population: "17.3M", capital: "Dakar", majorIssues: ["Primary care coverage", "Nutrition access in regions"] },
  "south-africa": { name: "South Africa", uhc: 69, lifeExp: 64.1, budgetAlloc: 8.5, population: "60.6M", capital: "Pretoria", majorIssues: ["National Health Insurance reform", "HIV/AIDS & TB programs", "Private-public disparity"] },
  sudan: { name: "Sudan", uhc: 43, lifeExp: 65.3, budgetAlloc: 3.2, population: "46.9M", capital: "Khartoum", majorIssues: ["Medical supply distribution", "Hospital infrastructure stabilization"] },
  tanzania: { name: "Tanzania", uhc: 43, lifeExp: 66.2, budgetAlloc: 5.3, population: "65.5M", capital: "Dodoma", majorIssues: ["Rural staff retention", "Maternal facility access"] },
  tunisia: { name: "Tunisia", uhc: 70, lifeExp: 75.3, budgetAlloc: 6.2, population: "12.3M", capital: "Tunis", majorIssues: ["Clinical equipment modernization", "Public sector retention"] },
  uganda: { name: "Uganda", uhc: 46, lifeExp: 63.3, budgetAlloc: 4.5, population: "47.2M", capital: "Kampala", majorIssues: ["Clinic resource mapping", "Maternal mortality reduction"] },
  zambia: { name: "Zambia", uhc: 50, lifeExp: 63.5, budgetAlloc: 5.0, population: "20.0M", capital: "Lusaka", majorIssues: ["Rural healthcare outreach", "Supply chain management"] },
  zimbabwe: { name: "Zimbabwe", uhc: 47, lifeExp: 61.5, budgetAlloc: 4.8, population: "16.3M", capital: "Harare", majorIssues: ["Hospital staffing", "Essential medicine availability"] }
};

type ActiveMetric = "uhc" | "lifeExp" | "budgetAlloc";

interface MetricConfig {
  key: ActiveMetric;
  label: string;
  description: string;
  minVal: number;
  maxVal: number;
  unit: string;
  colorScale: string[];
}

const metricConfigs: Record<ActiveMetric, MetricConfig> = {
  uhc: {
    key: "uhc",
    label: "UHC Index",
    description: "Universal Health Coverage Service Coverage Index",
    minVal: 20,
    maxVal: 80,
    unit: "%",
    colorScale: ["#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#991b1b"],
  },
  lifeExp: {
    key: "lifeExp",
    label: "Life Expectancy",
    description: "Average Life Expectancy at Birth",
    minVal: 50,
    maxVal: 80,
    unit: " Yrs",
    colorScale: ["#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#92400e"],
  },
  budgetAlloc: {
    key: "budgetAlloc",
    label: "Health Budget Allocation",
    description: "Total health expenditure as a percentage of GDP",
    minVal: 2,
    maxVal: 10,
    unit: "%",
    colorScale: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#047857"],
  },
};

export default function AfricaHealthObservatory() {
  const [selectedMetric, setSelectedMetric] = useState<ActiveMetric>("uhc");
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);

  const activeConfig = metricConfigs[selectedMetric];

  // Helper function to color maps based on indicator value
  const getColor = (val?: number) => {
    if (val === undefined || val === null) return "#e2e8f0";
    const { minVal, maxVal, colorScale } = activeConfig;
    const ratio = (val - minVal) / (maxVal - minVal);
    const index = Math.min(
      Math.max(Math.floor(ratio * colorScale.length), 0),
      colorScale.length - 1
    );
    return colorScale[index];
  };

  // Maps values for choropleth mapping
  const choroplethData = useMemo(() => {
    const data: Record<string, number> = {};
    for (const [key, stats] of Object.entries(countryDatabase)) {
      data[key] = stats[selectedMetric];
    }
    return data;
  }, [selectedMetric]);

  const selectedCountry = selectedCountryId ? countryDatabase[selectedCountryId] : null;

  // Filter country list by search
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return [];
    return Object.entries(countryDatabase).filter(([_, stats]) =>
      stats.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Overall continental stats for default observatory state
  const observatoryAverages = useMemo(() => {
    const values = Object.values(countryDatabase);
    const totalUhc = values.reduce((sum, c) => sum + c.uhc, 0);
    const totalLifeExp = values.reduce((sum, c) => sum + c.lifeExp, 0);
    const totalBudgetAlloc = values.reduce((sum, c) => sum + c.budgetAlloc, 0);
    return {
      avgUhc: (totalUhc / values.length).toFixed(1),
      avgLifeExp: (totalLifeExp / values.length).toFixed(1),
      avgBudgetAlloc: (totalBudgetAlloc / values.length).toFixed(1),
      topUhc: values.reduce((max, c) => (c.uhc > max.uhc ? c : max), values[0]),
      topLifeExp: values.reduce((max, c) => (c.lifeExp > max.lifeExp ? c : max), values[0]),
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Observatory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#e1ece1]">
        <div>
          <h1 className="text-2xl font-bold text-[#06923E] flex items-center gap-2">
            <FaGlobeAfrica className="text-3xl" />
            Africa Health Observatory
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Continental health service metrics, budgets, and life expectancy analytics.
          </p>
        </div>

        {/* Indicators tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(metricConfigs) as ActiveMetric[]).map((key) => {
            const config = metricConfigs[key];
            const isActive = selectedMetric === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${isActive
                    ? "bg-[#06923E] text-white shadow-md"
                    : "bg-[#ecf1ec] text-[#06923E] hover:bg-[#d8ebd8]"
                  }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map & Filter Area (takes 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#e1ece1] flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {activeConfig.label} Distribution Map
              </h2>
              <p className="text-xs text-gray-500">{activeConfig.description}</p>
            </div>

            {/* Country search input */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-xs" />
              </span>
              <input
                type="text"
                placeholder="Search African country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#06923E]"
              />
              {/* Search dropdown results */}
              {searchQuery && (
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map(([id, stats]) => (
                      <button
                        key={id}
                        onClick={() => {
                          setSelectedCountryId(id);
                          setSearchQuery("");
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-[#ecf1ec] text-gray-700 transition"
                      >
                        {stats.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-400">No country found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AfricaMap Render wrapper */}
          <div className="relative flex justify-center bg-gray-50/50 rounded-xl py-4 overflow-hidden min-h-[440px]">
            {hoveredCountryName && (
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg shadow pointer-events-none z-10">
                <span className="font-semibold">{hoveredCountryName}</span>:{" "}
                {choroplethData[hoveredCountryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")] !== undefined
                  ? `${choroplethData[hoveredCountryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")]}${activeConfig.unit}`
                  : "N/A"}
              </div>
            )}

            <AfricaMap
              height={440}
              width="100%"
              getColor={(val) => getColor(val)}
              choroplethData={choroplethData}
              selectedRegionId={selectedCountryId || undefined}
              onRegionClick={(id) => {
                // Check if country exists in database
                if (countryDatabase[id]) {
                  setSelectedCountryId((prev) => (prev === id ? null : id));
                }
              }}
              onRegionHover={(id, props) => {
                setHoveredCountryName(props.name);
              }}
              theme={{
                backgroundColor: "transparent",
                defaultFill: "#e2e8f0",
                strokeColor: "#ffffff",
                strokeWidth: 0.8,
                hoverFill: "#22c55e",
                selectedFill: "#06923E",
                fontSize: 8,
                labelColor: "#475569",
              }}
            />
          </div>

          {/* Custom continuous color scale legend */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-2">
            <span className="text-xs text-gray-500 font-medium">Indicator Range:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-700">
                {activeConfig.minVal}
                {activeConfig.unit}
              </span>
              <div className="flex h-3 w-40 rounded-sm overflow-hidden border border-gray-200 shadow-inner">
                {activeConfig.colorScale.map((color, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {activeConfig.maxVal}+
                {activeConfig.unit}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Click on any country to drill down details</p>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {selectedCountry ? (
              // Selected Country Card
              <motion.div
                key={selectedCountry.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1ece1] space-y-5"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#06923E]">
                      {selectedCountry.name}
                    </h3>
                    <p className="text-xs text-gray-500">Capital: {selectedCountry.capital}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCountryId(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    Clear Select
                  </button>
                </div>

                {/* Country Stats Indicators */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600">UHC Index Score</span>
                      <span className="text-[#06923E]">{selectedCountry.uhc}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${selectedCountry.uhc}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600">Life Expectancy</span>
                      <span className="text-amber-600">{selectedCountry.lifeExp} Years</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${(selectedCountry.lifeExp / 85) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600">Health budget share (% GDP)</span>
                      <span className="text-emerald-700">{selectedCountry.budgetAlloc}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(selectedCountry.budgetAlloc / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Demographic Quick Info */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-500 block">POPULATION</span>
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <FaUsers className="text-[#06923E]" /> {selectedCountry.population}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-500 block">ABUJA DECLARATION STATUS</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${selectedCountry.budgetAlloc >= 15
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                      }`}>
                      {selectedCountry.budgetAlloc >= 15 ? "Achieved (15%)" : "Under Target"}
                    </span>
                  </div>
                </div>

                {/* Major Challenges */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700">Major Health System Challenges:</h4>
                  <ul className="space-y-1.5">
                    {selectedCountry.majorIssues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              // Default Continental Averages Card
              <motion.div
                key="averages"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1ece1] space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#06923E] flex items-center gap-1.5">
                    <FaFileMedicalAlt /> Continental Statistics
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Averages across monitored African nations.
                  </p>
                </div>

                {/* Metrics highlights cards */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-[#fbfdfb] p-3 rounded-xl border border-[#e1ece1]">
                    <span className="p-2.5 rounded-lg bg-red-50 text-red-500">
                      <FaHeartbeat className="text-lg" />
                    </span>
                    <div>
                      <span className="text-[10px] text-gray-500 block">AVERAGE UHC SCORE</span>
                      <span className="text-sm font-bold text-gray-700">{observatoryAverages.avgUhc}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 bg-[#fbfdfb] p-3 rounded-xl border border-[#e1ece1]">
                    <span className="p-2.5 rounded-lg bg-amber-50 text-amber-500">
                      <FaMedkit className="text-lg" />
                    </span>
                    <div>
                      <span className="text-[10px] text-gray-500 block">AVERAGE LIFE EXPECTANCY</span>
                      <span className="text-sm font-bold text-gray-700">{observatoryAverages.avgLifeExp} Years</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 bg-[#fbfdfb] p-3 rounded-xl border border-[#e1ece1]">
                    <span className="p-2.5 rounded-lg bg-emerald-50 text-emerald-500">
                      <FaRegHospital className="text-lg" />
                    </span>
                    <div>
                      <span className="text-[10px] text-gray-500 block">AVG BUDGET ALLOCATION (% GDP)</span>
                      <span className="text-sm font-bold text-gray-700">{observatoryAverages.avgBudgetAlloc}%</span>
                    </div>
                  </div>
                </div>

                {/* Performers highlights */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700">Top Regional Performers:</h4>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Top UHC Index:</span>
                      <span className="font-semibold text-gray-700">
                        {observatoryAverages.topUhc.name} ({observatoryAverages.topUhc.uhc}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Top Life Expectancy:</span>
                      <span className="font-semibold text-gray-700">
                        {observatoryAverages.topLifeExp.name} ({observatoryAverages.topLifeExp.lifeExp} Yrs)
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AfricaMap />
    </div>
  );
}
