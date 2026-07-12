"use client";

import React, { use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa";
import Image from "next/image";

import ConfirmPrompt from "./ConfirmPrompt";
import { useTopbarFilters } from "../context/TopbarFiltersContext";
import { getZoneByState } from "nigerian-geopolitical-zones";

export interface TopbarProps {
  collapsed?: boolean;
  userName?: string | null;
  onLogout?: () => void;
  title?: string;
  headerHeight?: string;
  logos?: Record<string, string | React.FC<React.SVGProps<SVGSVGElement>>>;
  state?: string[];
  onToggleSidebar?: () => void; // new
  showLogout?: boolean;
  onStateChange?: (state: string) => void;
  onYearChange?: (year: number) => void;
}

const Topbar: React.FC<TopbarProps> = ({
  collapsed,
  userName,
  onLogout,
  title = "Health Desk Dashboard",
  headerHeight = "h-16",
  logos = {},
  state = [],
  onToggleSidebar,
  showLogout = false,
  onStateChange,
  onYearChange,
}) => {
  // const [showConfirm, setShowConfirm] = useState(false);
  const [topBarTitle, setTopBarTitle] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const {
    selectedState,
    selectedYear,
    setSelectedYear,
    setSelectedState,
    selectedZone,
    showConfirm,
    setShowConfirm,
  } = useTopbarFilters();

  useEffect(() => {
    if (!selectedYear) return;

    const zoneArea = selectedState ? getZoneByState(selectedState.toLocaleLowerCase()) : null;
    const computedZone = zoneArea?.zone || "Zonal";

    const titleMap: Record<string, string> = {
      "/dashboard": `Dashboard${onYearChange ? ` - ${selectedYear}` : ""}`,
      "/dashboard/demography": `Demography${onYearChange ? ` - ${selectedYear}` : ""}`,
      "/dashboard/health-facilities": `Health Facilities${onYearChange ? ` - ${selectedYear}` : ""}`,
      "/dashboard/zonal-health-facilities": `Zonal and National View of Health Facilities per Capita`,
      "/dashboard/human-resource": `${selectedState} State Human Resource for Health Overview`,
      "/dashboard/zonal-human-resource": `${computedZone} Human Resource for Health (Zonal Comparison)`,
      "/dashboard/score-card": `NGF Scorecard`,
      "/dashboard/zonal-score-card": `${computedZone} Scorecard (Zonal Comparison)`,
      "/dashboard/health-finance": `${selectedState} State Health Finance Dashboard ${selectedYear}`,
      "/dashboard/zonal-health-finance": `${computedZone} Health Finance Dashboard (${selectedYear})`,
      "/dashboard/health-insurance": `${selectedState} State Health Insurance Coverage`,
      "/dashboard/zonal-health-insurance": `${computedZone} Health Insurance Coverage (Zonal Comparison)`,
      "/dashboard/service-coverage": `${selectedState} State Service Coverage Dashboard`,
      "/dashboard/zonal-service-coverage": `${computedZone} Service Coverage Dashboard (${selectedYear})`,
      "/dashboard/health-outcomes": `${selectedState} State Health Outcomes Dashboard`,
      "/dashboard/zonal-health-outcomes": `${computedZone} Health Outcomes Dashboard (${selectedYear})`,
      "/dashboard/flagship-projects": `${selectedState} State Flagship Projects (${selectedYear})`,
      "/dashboard/partners-mapping": `${selectedState} State Partners Mapping`,
      "/dashboard/africa-map": `Africa Map View`,
      "/dashboard/upload-data": `Data Upload Management`,
      "/dashboard/register": `Register User Accounts`,
    };

    setTopBarTitle(titleMap[pathname] || title);
  }, [selectedYear, pathname, title, onYearChange, selectedState]);

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

  const handleLogout = () => setShowConfirm(true);

  const confirmLogout = () => {
    setShowConfirm(false);
    if (onLogout) onLogout();
  };

  const cancelPrompt = () => setShowConfirm(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const StateLogo = selectedState ? logos[selectedState] : null;


  return (
    <div className="w-full bg-[#F5F7FA] border-b px-4 py-3 md:py-4">
      {/* Mobile Top Header (only on mobile) */}
      <div className="flex md:hidden items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-[#00A141] p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <FaBars size={20} />
            </button>
          )}
          {StateLogo && (
            <div className="w-8 h-8 relative bg-gray-200 rounded-lg overflow-hidden shrink-0">
              <Image
                src={(StateLogo as any).src ?? StateLogo}
                alt={selectedState}
                fill
                className="object-contain"
              />
            </div>
          )}
          <span className="font-bold text-sm text-gray-800">
            {selectedState || "NGF"}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#00A141] text-white text-xs px-2.5 py-1 rounded-full font-medium">
          <Image
            src={'/svg/globe.svg'}
            alt={selectedState}
            width={14}
            height={14}
            className="object-contain invert brightness-0"
          />
          {selectedState || "Gombe"}
        </div>
      </div>

      {/* Desktop Grid Layout & Mobile Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-center">
        {/* COLUMN 1 — Filters */}
        <div className="flex justify-center md:justify-start">
          <div className="flex gap-2 w-full max-w-xs md:max-w-none">
            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedState(value);
                onStateChange?.(value);
              }}
              className="flex-1 md:flex-initial bg-[#dadcde] text-black border border-[#dadcde] text-sm px-3 py-2 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
            >
              <option value="">Filter By State</option>
              {state.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              value={selectedYear}
              onChange={(e) => {
                const value = Number(e.target.value);
                setSelectedYear(value);
                onYearChange?.(value);
              }}
              className="bg-[#dadcde] text-black border border-[#dadcde] text-sm px-3 py-2 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* COLUMN 2 — CENTER INFO */}
        <div className="flex flex-col items-center justify-center text-center order-first md:order-none">
          <h1 className="text-black font-bold text-base md:text-xl leading-snug">
            {topBarTitle}
          </h1>
          <p className="text-xs md:text-lg text-gray-600 mt-0.5">{currentDate}</p>
        </div>

        {/* COLUMN 3 — User + Logo (Desktop only) */}
        <div className="hidden md:flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-600 text-white text-sm px-3 py-1 rounded-full">
              <Image
                src={'/svg/globe.svg'}
                alt={selectedState}
                width={20}
                height={20}
                className="object-contain invert brightness-0"
              />
              {selectedState || "Gombe"}
            </div>

            {StateLogo && (
              <div className="w-12 h-12 relative bg-gray-300 rounded-2xl">
                <Image
                  src={(StateLogo as any).src ?? StateLogo}
                  alt={selectedState}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
