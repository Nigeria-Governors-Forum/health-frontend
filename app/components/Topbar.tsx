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
    // <>
    //   <div
    //     className={`${headerHeight} bg-[#F8FAFC] border-b shadow flex-col sm:flex-row items-start md:items-center px-4 gap-4 transition-all duration-300`}
    //   >
    //     {onToggleSidebar && (
    //       <button
    //         aria-label="Toggle sidebar"
    //         onClick={onToggleSidebar}
    //         className="md:hidden mr-2 p-2 rounded bg-[#06923E] text-white z-30 mt-4"
    //       >
    //         <FaBars size={24} />
    //       </button>
    //     )}
    //     {/* Left: Greeting + Date */}
    //     <div className="-col sm:flex justify-around">
    //       <div className="flex flex-col items-center sm:items-start sm:p-4 flex-1 min-w-40 ">
    //         <h2 className="text-lg font-bold text-[#333333] capitalize">
    //           {userName ? `Hi, ${userName} 👋🏽` : `Welcome to ${selectedState} State ${topBarTitle}`}
    //         </h2>
    //         <p className="text-sm font-medium text-black py-4">
    //           {currentDate}
    //         </p>
    //         <div className="flex flex-wrap gap-2">
    //           {/* State Select */}
    //           <select
    //             value={selectedState}
    //             onChange={(e) => {
    //               const value = e.target.value;
    //               setSelectedState(value);
    //               onStateChange?.(value);
    //             }}
    //             className="px-3 py-1 border rounded-md border-green-400 bg-white text-green-700"
    //           >
    //             <option value="">Select State</option>
    //             {state.map((item) => (
    //               <option key={item} value={item}>
    //                 {item}
    //               </option>
    //             ))}
    //           </select>

    //           {/* Year Select */}
    //           <select
    //             value={selectedYear}
    //             onChange={(e) => {
    //               const value = Number(e.target.value);
    //               setSelectedYear(value);
    //               onYearChange?.(value);
    //             }}
    //             className="px-3 py-1 border rounded-md border-green-400 bg-white text-green-700"
    //           >
    //             {years.map((year) => (
    //               <option key={year} value={year}>
    //                 {year}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       </div>

    //       {/* Center: Title + selectors */}
    //       {/* <div className="flex flex-col items-center flex-1 gap-2">
    //         <h2 className="text-center text-lg font-bold text-green-600">
    //           {topBarTitle}
    //         </h2>
    //         <div className="flex flex-wrap gap-2">
    //           <select
    //             value={selectedState}
    //             onChange={(e) => {
    //               const value = e.target.value;
    //               setSelectedState(value);
    //               onStateChange?.(value);
    //             }}
    //             className="px-3 py-1 border rounded-md border-green-400 bg-white text-green-700"
    //           >
    //             <option value="">Select State</option>
    //             {state.map((item) => (
    //               <option key={item} value={item}>
    //                 {item}
    //               </option>
    //             ))}
    //           </select>

    //           <select
    //             value={selectedYear}
    //             onChange={(e) => {
    //               const value = Number(e.target.value);
    //               setSelectedYear(value);
    //               onYearChange?.(value);
    //             }}
    //             className="px-3 py-1 border rounded-md border-green-400 bg-white text-green-700"
    //           >
    //             {years.map((year) => (
    //               <option key={year} value={year}>
    //                 {year}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       </div> */}

    //       {/* Right: State logo + logout */}
    //       <div className="flex items-center justify-center sm:justify-end  gap-4 flex-1 min-w-40">
    //         <div className="flex flex-col items-end">
    //           <div className="text-sm font-medium text-amber-950">
    //             {selectedState}
    //           </div>
    //         </div>
    //         {StateLogo && (
    //           <div className="w-12 h-12 relative bg-[#07923e] rounded-2xl my-4">
    //             <Image
    //               src={(StateLogo as any).src ?? StateLogo}
    //               alt={selectedState}
    //               fill
    //               className="object-contain"
    //             />
    //           </div>
    //         )}
    //         {showLogout && (
    //           <button
    //             aria-label="Logout"
    //             className="text-red-500 border border-red-200 px-3 py-1 rounded text-sm"
    //             onClick={handleLogout}
    //           >
    //             Logout
    //           </button>
    //         )}
    //       </div>
    //     </div>
    //   </div>

    //   {showConfirm && (
    //     <ConfirmPrompt
    //       message="Are you sure you want to logout?"
    //       onConfirm={confirmLogout}
    //       onClose={cancelPrompt}
    //     />
    //   )}
    // </>


    <div className="w-full bg-[#F5F7FA] border-b px-4 py-3">

      {/* Top Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">

        {/* LEFT: Title + Date */}
        <div>
          <h1 className="text-xl font-bold text-[#333] px-4 py-2">
            {pathname === "/dashboard" ? "Dashboard" : topBarTitle}
          </h1>
          <p className="text-lg text-black px-4 py-2">{currentDate}</p>
        </div>

        {/* RIGHT: User */}
        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white text-lg px-3 py-1 rounded-full">
            {selectedState || "Gombe"}
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden" />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between mt-3 flex-wrap gap-3 pb-4">

        {/* LEFT FILTERS */}
        <div className="flex items-center gap-2">

          {/* State Pill */}
          <div className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-xl shadow-sm">
            <span className="text-gray-600">{selectedState || "Gombe"}</span>
          </div>

          {/* Filter Button */}
          <select
            value={selectedState}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedState(value);
              onStateChange?.(value);
            }}
            className="bg-[#333333] text-white text-lg px-3 py-2 rounded-full cursor-pointer"
          >
            <option value="">Filter By State</option>
            {state.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* RIGHT FILTERS */}
        <div className="flex items-center gap-2">

          {/* Year Pill */}
          <div className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-lg shadow-sm">
            <span className="text-gray-600">{selectedYear}</span>
          </div>

          {/* Filter Button */}
          <select
            value={selectedYear}
            onChange={(e) => {
              const value = Number(e.target.value);
              setSelectedYear(value);
              onYearChange?.(value);
            }}
            className="bg-[#333333] text-white text-lg px-3 py-2 rounded-full cursor-pointer"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
