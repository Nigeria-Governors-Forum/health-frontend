"use client";

import React, { use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa";
import Image from "next/image";

import ConfirmPrompt from "./ConfirmPrompt";
import { useTopbarFilters } from "../context/TopbarFiltersContext";

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
    setTopBarTitle(
      pathname === "/dashboard"
        ? `Dashboard ${onYearChange ? ` - ${selectedYear}` : ""}`
        : pathname === "/dashboard/demography"
          ? `Demography ${onYearChange ? ` - ${selectedYear}` : ""}`
          : pathname === "/dashboard/health-facilities"
            ? `Health Facilities ${onYearChange ? ` - ${selectedYear}` : ""}`
            : pathname === "/dashboard/zonal-health-facilities"
              ? `Zonal and National View of Health Facilities per Capita`
              : pathname === "/dashboard/human-resource"
                ? `${selectedState} State Human Resource for Health Overview`
                : pathname === "/dashboard/score-card"
                  ? `NFG Scorecard`
                  : pathname === "/dashboard/health-finance"
                    ? `${selectedState} state  Health Finance Dashboard ${selectedYear}`
                    : pathname === "/dashboard/zonal-health-finance"
                      ? `${selectedZone} Health Finance Dashboard (${selectedYear})`
                      : title
    );
  }, [selectedYear, pathname, title, onYearChange, selectedZone]);

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

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setSelectedState(parsed?.state || "");
      }
    } catch (err) {
      console.warn("Invalid session user data:", err);
      setSelectedState("");
    }
  }, [setSelectedState]);

  return (
    <div className="w-full bg-[#F5F7FA] border-b px-4 py-4">

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

        {/* COLUMN 1 — Title + Date */}
        <div>
          <div className="flex gap-2 flex-wrap justify-start">

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedState(value);
                onStateChange?.(value);
              }}
              className="bg-[#dadcde] text-black border border-[#dadcde] text-sm px-3 py-2 rounded-full cursor-pointer"
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
              className="bg-[#dadcde] text-black border border-[#dadcde] text-sm px-3 py-2 rounded-full cursor-pointer"
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
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-black font-bold text-xl">Welcome to  {selectedState} State {topBarTitle}</p>
          <p className="text-lg text-black">{currentDate}</p>

        </div>

        {/* COLUMN 3 — User + Filters */}
        <div className="flex flex-col items-end gap-3">

          {/* User */}
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
              <div className="w-12 h-12 relative bg-gray-300 rounded-2xl my-4">
                <Image
                  src={(StateLogo as any).src ?? StateLogo}
                  alt={selectedState}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Filters */}

        </div>
      </div>
    </div>
  );
};

export default Topbar;
