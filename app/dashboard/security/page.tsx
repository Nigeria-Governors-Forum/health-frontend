"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FiMaximize2,
  FiMinimize2,
  FiAlertTriangle,
  FiFilter,
  FiLayers,
} from "react-icons/fi";
import { FaShieldAlt, FaGlobeAfrica, FaMapMarkedAlt } from "react-icons/fa";
import { Endpoints, httpClient } from "@/app/api-client/src";
import toast from "react-hot-toast";
import LoadingScreen from "@/app/components/LoadingScreen";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";
import {
  normalizeStateName,
  StateLGAChoropleth,
  NigeriaStatesChoropleth,
  lgaKeyFromName,
} from "@/app/components/ng-maps";

// Security Indicators
export type SecurityIndicator =
  | "overall"
  | "banditry"
  | "insurgency"
  | "political_violence"
  | "communal"
  | "militancy";

interface IndicatorOption {
  id: SecurityIndicator;
  label: string;
  description: string;
  icon: string;
}

const INDICATOR_OPTIONS: IndicatorOption[] = [
  {
    id: "overall",
    label: "Overall Threat / Vulnerability Level",
    description:
      "Composite security risk rating across all 36 States & FCT Abuja",
    icon: "🛡️",
  },
  {
    id: "banditry",
    label: "Banditry & Mass Kidnapping",
    description:
      "Rural armed banditry, kidnappings for ransom, and highway ambushes",
    icon: "⚠️",
  },
  {
    id: "insurgency",
    label: "Insurgency & ISWAP / Boko Haram",
    description:
      "Terrorist incursions, attacks on military bases, and worship centres",
    icon: "💥",
  },
  {
    id: "political_violence",
    label: "Political Thuggery & Violence",
    description:
      "Election-related clashes, thuggery, convoys attacked, and intimidation",
    icon: "🗳️",
  },
  {
    id: "communal",
    label: "Communal Clashes & Displacements",
    description:
      "Ethnic/religious tensions, boundary disputes, and farmer-herder clashes",
    icon: "👥",
  },
  {
    id: "militancy",
    label: "Militancy & Creek Infiltration",
    description:
      "IPOB/ESN sit-at-home threats, riverine access challenges, and creek militancy",
    icon: "🌊",
  },
];

function parseLgas(str: string): string[] {
  if (!str) return [];
  return str
    .replace(/\.+$/, "")
    .split(/[,;.]|\band\s+some\s+|\band\b/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.toLowerCase().startsWith("and"))
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

// Colors for threat levels: Red (Critical/High), Orange (Elevated), Yellow (Moderate), Soft Green (Low-Moderate)
const THREAT_COLORS = {
  CRITICAL: "#dc2626", // Deep Red
  HIGH: "#ef4444", // Red
  ELEVATED: "#f59e0b", // Amber / Orange
  MODERATE: "#eab308", // Yellow / Gold
  "LOW-MODERATE": "#84cc16", // Lime / Yellow-Green
  DEFAULT: "#e2e8f0", // Slate gray
};

const THREAT_SCORE_MAP: Record<string, number> = {
  CRITICAL: 95,
  HIGH: 75,
  ELEVATED: 55,
  MODERATE: 35,
  "LOW-MODERATE": 15,
};

function getThreatColor(risk: string | undefined): string {
  if (!risk) return THREAT_COLORS.DEFAULT;
  const key = risk.trim().toUpperCase();
  return (
    Object.entries(THREAT_COLORS).find(([level]) => level === key)?.[1] ??
    THREAT_COLORS.DEFAULT
  );
}

interface ThreatAssessment {
  id?: number;
  zone?: string;
  state: string;
  year?: number;
  risk?: string;
  primary_threats?: string;
  hotspots_lga?: string;
}

interface ThreatAssessmentResponse {
  data: ThreatAssessment[];
}

const SecurityPage = () => {
  const { selectedState, setSelectedState, selectedYear } = useTopbarFilters();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ThreatAssessment[]>([]);
  const [selectedIndicator, setSelectedIndicator] =
    useState<SecurityIndicator>("overall");
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [hoveredState, setHoveredState] =
    useState<ThreatAssessment | null>(null);
  const [hoveredLGA, setHoveredLGA] = useState<{
    name: string;
    key: string;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapHeight, setMapHeight] = useState(480);
  const [searchQuery, setSearchQuery] = useState("");

  // Responsive map height
  useEffect(() => {
    if (isFullscreen) {
      setMapHeight(window.innerHeight - 200);
    } else {
      setMapHeight(480);
    }
  }, [isFullscreen]);

  // Fetch the selected year's threat assessment data from the backend.
  useEffect(() => {
    let isMounted = true;
    const fetchSecurityData = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get<ThreatAssessmentResponse>(
          `${Endpoints.threatAssessment.all}?year=${selectedYear}`,
        );
        if (!Array.isArray(response.data)) {
          throw new Error("Threat assessment API returned an invalid response");
        }
        if (isMounted) setData(response.data);
      } catch (error) {
        console.error("Failed to fetch threat assessment data:", error);
        if (isMounted) {
          setData([]);
          toast.error("Failed to load security assessment data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSecurityData();
    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Current state assessment record (if state selected)
  const currentStateRecord = useMemo(() => {
    if (!selectedState) return null;
    const norm = selectedState.trim().toLowerCase();
    return data.find(
      (item) =>
        item.state?.trim().toLowerCase() === norm ||
        normalizeStateName(item.state ?? "") ===
          normalizeStateName(selectedState),
    );
  }, [data, selectedState]);

  // Parsed hotspot LGAs for current state
  const currentStateHotspotLgas = useMemo(() => {
    if (!currentStateRecord) return [];
    return parseLgas(currentStateRecord.hotspots_lga || "");
  }, [currentStateRecord]);

  // State LGA color mapping
  const lgaColors = useMemo(() => {
    if (!currentStateRecord) return {};
    const color = getThreatColor(currentStateRecord.risk);
    const colors: Record<string, string> = {};
    for (const lga of currentStateHotspotLgas) {
      colors[lgaKeyFromName(lga)] = color;
    }
    return colors;
  }, [currentStateRecord, currentStateHotspotLgas]);

  // Value function for National Choropleth Map
  const nationalValueForState = (slug: string): number => {
    const item = data.find((d) => normalizeStateName(d.state || "") === slug);
    if (!item) return 0;
    const riskScore = THREAT_SCORE_MAP[item.risk?.toUpperCase() ?? ""];

    // Filter by specific indicator if selected
    if (selectedIndicator !== "overall") {
      const threats = (item.primary_threats || "").toLowerCase();
      if (
        selectedIndicator === "banditry" &&
        (threats.includes("bandit") ||
          threats.includes("kidnap") ||
          threats.includes("abduction"))
      ) {
        return riskScore || 75;
      }
      if (
        selectedIndicator === "insurgency" &&
        (threats.includes("boko haram") ||
          threats.includes("iswap") ||
          threats.includes("insurg"))
      ) {
        return riskScore || 95;
      }
      if (
        selectedIndicator === "political_violence" &&
        (threats.includes("politic") ||
          threats.includes("thuggery") ||
          threats.includes("violence"))
      ) {
        return riskScore || 55;
      }
      if (
        selectedIndicator === "communal" &&
        (threats.includes("communal") ||
          threats.includes("ethnic") ||
          threats.includes("clash"))
      ) {
        return riskScore || 65;
      }
      if (
        selectedIndicator === "militancy" &&
        (threats.includes("militan") ||
          threats.includes("ipob") ||
          threats.includes("esn") ||
          threats.includes("creek"))
      ) {
        return riskScore || 70;
      }
      return 10; // Low / Not flagged for this specific indicator
    }

    return riskScore || 15;
  };

  // Color mapping for National Choropleth
  const colorForValue = (value: number): string => {
    if (value >= 90) return THREAT_COLORS.CRITICAL;
    if (value >= 70) return THREAT_COLORS.HIGH;
    if (value >= 50) return THREAT_COLORS.ELEVATED;
    if (value >= 30) return THREAT_COLORS.MODERATE;
    if (value >= 15) return THREAT_COLORS["LOW-MODERATE"];
    return THREAT_COLORS.DEFAULT;
  };

  // Summary counts
  const summaryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 0,
      ELEVATED: 0,
      MODERATE: 0,
      "LOW-MODERATE": 0,
    };
    for (const item of data) {
      const r = (item.risk || "").toUpperCase().trim();
      if (counts[r] !== undefined) counts[r]++;
    }
    return counts;
  }, [data]);

  const statesByRisk = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const item of data) {
      const risk = item.risk?.toUpperCase().trim();
      if (!risk || !item.state) continue;
      groups[risk] ??= [];
      groups[risk].push(item.state);
    }
    return groups;
  }, [data]);

  const zoneThreatSummary = useMemo(() => {
    const zones = new Map<string, ThreatAssessment[]>();
    for (const item of data) {
      if (!item.zone) continue;
      const zoneItems = zones.get(item.zone) ?? [];
      zoneItems.push(item);
      zones.set(item.zone, zoneItems);
    }

    return Array.from(zones.entries())
      .map(([zone, items]) => {
        const highestRisk = items.reduce(
          (highest, item) =>
            (THREAT_SCORE_MAP[item.risk?.toUpperCase() ?? ""] ?? 0) >
            (THREAT_SCORE_MAP[highest] ?? 0)
              ? item.risk?.toUpperCase() ?? highest
              : highest,
          "LOW-MODERATE",
        );
        const highRiskStates = items
          .filter(
            (item) =>
              (THREAT_SCORE_MAP[item.risk?.toUpperCase() ?? ""] ?? 0) >=
              THREAT_SCORE_MAP.HIGH,
          )
          .map((item) => item.state)
          .filter((state): state is string => Boolean(state));

        return { zone, highestRisk, highRiskStates };
      })
      .sort((a, b) => a.zone.localeCompare(b.zone));
  }, [data]);

  // Filtered table rows
  const filteredTableData = useMemo(() => {
    return data.filter((item) => {
      const s = (item.state || "").toLowerCase();
      const z = (item.zone || "").toLowerCase();
      const r = (item.risk || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      return s.includes(q) || z.includes(q) || r.includes(q);
    });
  }, [data, searchQuery]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-[#f8fafc] min-h-screen">
      {loading && <LoadingScreen />}

      {/* SUMMARY STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Critical Risk
            </span>
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">
            {summaryCounts.CRITICAL}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {statesByRisk.CRITICAL?.join(", ") || "No states reported"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              High Risk
            </span>
            <span className="w-3 h-3 rounded-full bg-orange-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">
            {summaryCounts.HIGH}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {statesByRisk.HIGH?.join(", ") || "No states reported"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Elevated Risk
            </span>
            <span className="w-3 h-3 rounded-full bg-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">
            {summaryCounts.ELEVATED}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {statesByRisk.ELEVATED?.join(", ") || "No states reported"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-yellow-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">
              Moderate Risk
            </span>
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">
            {summaryCounts.MODERATE}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {statesByRisk.MODERATE?.join(", ") || "No states reported"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-lime-100 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-700">
              Low-Moderate
            </span>
            <span className="w-3 h-3 rounded-full bg-lime-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">
            {summaryCounts["LOW-MODERATE"]}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {statesByRisk["LOW-MODERATE"]?.join(", ") || "No states reported"}
          </p>
        </div>
      </div>

      {/* TOP BAR / HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-2xl">
              <FaShieldAlt size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Security & Threat Vulnerability Assessment
              </h1>
              <p className="text-xs md:text-sm text-slate-500">
                {selectedState
                  ? `State Threat & Hotspot LGA Assessment for ${selectedState}`
                  : "National State-by-State Security Threat & Hotspot Assessment"}
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS: INDICATOR SELECTOR & VIEW MODE */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Indicator Button */}
          <button
            onClick={() => setShowIndicatorModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs md:text-sm font-medium hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
          >
            <FiFilter size={16} />
            <span>Indicator:</span>
            <span className="font-semibold text-amber-400">
              {INDICATOR_OPTIONS.find((i) => i.id === selectedIndicator)?.label}
            </span>
          </button>

          {/* Toggle National vs State View */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={() => setSelectedState("")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !selectedState
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FaGlobeAfrica size={13} />
              National
            </button>
            <button
              disabled={!selectedState}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedState
                  ? "bg-emerald-600 text-white shadow-sm cursor-pointer"
                  : "text-slate-400 cursor-not-allowed"
              }`}
            >
              <FaMapMarkedAlt size={13} />
              {selectedState ? `${selectedState} State` : "Select State"}
            </button>
          </div>
        </div>
      </div>

      {/* MAP AND DETAILS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP SECTION (7 COLS) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {selectedState
                  ? `${selectedState} State LGA Threat Map`
                  : "National Threat Choropleth Map"}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedState
                  ? "Hotspot LGAs highlighted in Red/Yellow based on threat severity"
                  : "Click any state boundary to view LGA hotspots breakdown"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedState && (
                <button
                  onClick={() => setSelectedState("")}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                >
                  ✕ View All States
                </button>
              )}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
              >
                {isFullscreen ? (
                  <FiMinimize2 size={16} />
                ) : (
                  <FiMaximize2 size={16} />
                )}
              </button>
            </div>
          </div>

          {/* MAP CANVAS */}
          <div className="relative flex-1 flex items-center justify-center min-h-[460px] bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100">
            {selectedState ? (
              // STATE LGA VIEW
              <StateLGAChoropleth
                stateSlug={normalizeStateName(selectedState)}
                stateName={selectedState}
                height={mapHeight}
                lgaColors={lgaColors}
                onHoverLGA={setHoveredLGA}
              />
            ) : (
              // NATIONAL VIEW
              <NigeriaStatesChoropleth
                valueForState={nationalValueForState}
                colorForValue={colorForValue}
                valueLabel="Threat Level"
                height={mapHeight}
                onSelect={(slug) => {
                  const matched = data.find(
                    (d) => normalizeStateName(d.state || "") === slug,
                  );
                  if (matched?.state) {
                    setSelectedState(matched.state);
                    toast.success(
                      `Loaded ${matched.state} State Threat Details`,
                    );
                  }
                }}
                onHover={(slug) => {
                  if (!slug) {
                    setHoveredState(null);
                    return;
                  }
                  const matched = data.find(
                    (d) => normalizeStateName(d.state || "") === slug,
                  );
                  setHoveredState(matched || null);
                }}
              />
            )}

            {/* HOVER TOOLTIPS */}
            {hoveredLGA && selectedState && (
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl pointer-events-none z-20 text-xs border border-white/10 max-w-xs">
                <p className="text-amber-400 font-bold text-sm mb-1">
                  {hoveredLGA.name}
                </p>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-slate-300">
                    State: {selectedState}
                  </span>
                  {currentStateHotspotLgas.some(
                    (l) => l.toLowerCase() === hoveredLGA.name.toLowerCase(),
                  ) ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                      HOTSPOT ({currentStateRecord?.risk})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700 text-slate-300">
                      Standard
                    </span>
                  )}
                </div>
                {currentStateHotspotLgas.some(
                  (l) => l.toLowerCase() === hoveredLGA.name.toLowerCase(),
                ) && (
                  <p className="text-[11px] text-slate-300 border-t border-white/10 pt-1.5 mt-1">
                    {currentStateRecord?.primary_threats}
                  </p>
                )}
              </div>
            )}

            {hoveredState && !selectedState && (
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl pointer-events-none z-20 text-xs border border-white/10 max-w-xs">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="text-amber-400 font-bold text-sm">
                    {hoveredState.state}
                  </p>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                    style={{
                      backgroundColor: getThreatColor(hoveredState.risk),
                    }}
                  >
                    {hoveredState.risk}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mb-1">
                  Zone: {hoveredState.zone}
                </p>
                <p className="text-[11px] text-slate-300 line-clamp-3">
                  <strong className="text-white">Threats:</strong>{" "}
                  {hoveredState.primary_threats}
                </p>
                <p className="text-[10px] text-emerald-400 mt-2 font-semibold">
                  👉 Click state to view LGA hotspots
                </p>
              </div>
            )}
          </div>

          {/* COLOR SCALE LEGEND */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-700">
              Threat Severity Scale:
            </span>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-red-600" />
                <span>Critical (Red)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-orange-500" />
                <span>High (Orange-Red)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-amber-500" />
                <span>Elevated (Amber)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-yellow-500" />
                <span>Moderate (Yellow)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-lime-500" />
                <span>Low-Moderate (Lime)</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {selectedState && currentStateRecord ? (
            // STATE SPECIFIC CARD
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {currentStateRecord.zone} Geopolitical Zone
                  </span>
                  <h3 className="text-2xl font-black text-slate-800">
                    {currentStateRecord.state} State
                  </h3>
                </div>
                <span
                  className="px-3.5 py-1.5 rounded-full text-xs font-black text-white shadow-sm"
                  style={{
                    backgroundColor: getThreatColor(currentStateRecord.risk),
                  }}
                >
                  {currentStateRecord.risk}
                </span>
              </div>

              {/* Primary Threats narrative */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FiAlertTriangle className="text-red-500" />
                  Primary Security Threats
                </p>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {currentStateRecord.primary_threats}
                </p>
              </div>

              {/* Hotspot LGAs */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Identified Hotspot LGAs ({currentStateHotspotLgas.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentStateHotspotLgas.map((lga) => (
                    <span
                      key={lga}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-red-700 bg-red-50 border border-red-200"
                    >
                      {lga}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reset to National */}
              <button
                onClick={() => setSelectedState("")}
                className="mt-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer"
              >
                ← Back to National View
              </button>
            </div>
          ) : (
            // NATIONAL OVERVIEW CARD
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-800">
                <FiLayers className="text-emerald-600" size={20} />
                <h3 className="text-lg font-bold">
                  National Security Vulnerability Summary
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nigeria is categorized across 6 geopolitical zones assessing
                primary threats including rural banditry, kidnapping, Boko Haram
                / ISWAP resurgence, political thuggery, and creek militancy.
              </p>

              {/* Zone Threat Breakdown */}
              <div className="space-y-2 mt-2">
                {zoneThreatSummary.map((z) => (
                  <div
                    key={z.zone}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{z.zone}</p>
                      <p className="text-[11px] text-slate-400">
                        {z.highRiskStates.join(", ") || "No high-risk states"}
                      </p>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: getThreatColor(z.highestRisk) }}
                    >
                      {z.highestRisk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL STATE-BY-STATE ASSESSMENT TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              State-by-State Threat & Vulnerability Assessment Table
            </h3>
            <p className="text-xs text-slate-400">
              Complete index of threats and hotspot LGAs across Nigeria
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search state, zone, or risk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Threat Level</th>
                <th className="py-3 px-4">Primary Threats</th>
                <th className="py-3 px-4">Hotspots / LGA</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-4 text-center text-slate-500"
                  >
                    {loading
                      ? "Loading security assessments..."
                      : `No security assessments found for ${selectedYear}.`}
                  </td>
                </tr>
              ) : (
                filteredTableData.map((row) => (
                  <tr
                    key={row.id ?? row.state}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      selectedState?.toLowerCase() === row.state.toLowerCase()
                        ? "bg-emerald-50/50"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {row.state}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-500">
                      {row.zone}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-black text-white"
                        style={{ backgroundColor: getThreatColor(row.risk) }}
                      >
                        {row.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-700 line-clamp-2 leading-relaxed">
                      {row.primary_threats}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs">
                      {row.hotspots_lga}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedState(row.state);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-3 py-1 rounded-lg text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 bg-emerald-50 transition-all cursor-pointer"
                      >
                        View Map
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INDICATOR SELECTION MODAL */}
      {showIndicatorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Select Security Indicator
                </h3>
                <p className="text-xs text-slate-400">
                  Choose an indicator to shade the map in Red / Yellow based on
                  risk
                </p>
              </div>
              <button
                onClick={() => setShowIndicatorModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto">
              {INDICATOR_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedIndicator(opt.id);
                    setShowIndicatorModal(false);
                    toast.success(`Active indicator: ${opt.label}`);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    selectedIndicator === opt.id
                      ? "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {opt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowIndicatorModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage;
