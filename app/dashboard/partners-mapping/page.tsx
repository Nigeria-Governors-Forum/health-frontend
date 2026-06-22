"use client";

import React from "react";
import { useTopbarFilters } from "@/app/context/TopbarFiltersContext";

const partnersData = [
    {
        sn: "01",
        partner: "Acasus",
        interventions: [
            "Digital Health & HIS (Health Information Systems).",
            "Gender-Based Violence (GBV) & Gender Mainstreaming.",
            "Nursing University Graduates",
        ],
        coverage: 56,
    },
    {
        sn: "02",
        partner: "Achieving Health Nigeria Initiative (AHNi)",
        interventions: [
            "Health Security & Pandemic Preparedness",
            "Gender-Based Violence (GBV) & Gender Mainstreaming.",
            "Governance, Leadership & Policy (Distinct from HSS).",
        ],
        coverage: 34,
    },
    {
        sn: "03",
        partner: "Clinton Health Access Initiative (CHAI)",
        interventions: [
            "Oxygen & Vaccine Ecosystem Strengthening",
            "Maternal & Neonatal Health Infrastructure",
            "Supply Chain Optimization Support",
        ],
        coverage: 45,
    },
    {
        sn: "04",
        partner: "FHI 360",
        interventions: [
            "HIV/AIDS & Tuberculosis Service Integration",
            "Human Resources for Health Capacity Development",
            "Integrated Primary Health Care Delivery",
        ],
        coverage: 28,
    },
];

const PartnersMapping = () => {
    const { selectedState } = useTopbarFilters();
    const stateName = selectedState || "Gombe";

    return (
        <div className="flex flex-col gap-6 w-full text-black p-4">
            {/* Main Grid Content Container */}
            <div className="w-full bg-white rounded-3xl border border-gray-200/60 shadow-sm overflow-hidden">
                {/* Table Headers (Visible on md and up) */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="col-span-4 bg-[#00A141] text-white text-[13px] font-bold rounded-xl py-3 px-4 text-center tracking-wider">
                        SN &nbsp;&nbsp;&nbsp;&nbsp; Implementing Partner
                    </div>
                    <div className="col-span-5 bg-[#00A141] text-white text-[13px] font-bold rounded-xl py-3 px-4 text-center tracking-wider">
                        Intervention Area
                    </div>
                    <div className="col-span-3 bg-[#00A141] text-white text-[13px] font-bold rounded-xl py-3 px-4 text-center tracking-wider">
                        Coverage Area (No of LGAs)
                    </div>
                </div>

                {/* Table Body Rows */}
                <div className="flex flex-col">
                    {partnersData.map((row) => (
                        <div
                            key={row.sn}
                            className="grid grid-cols-1 md:grid-cols-12 border-b border-gray-200 last:border-0 items-stretch transition-colors hover:bg-gray-50/30"
                        >
                            {/* Partner Name column */}
                            <div className="col-span-12 md:col-span-4 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 flex items-center justify-center">
                                <div className="w-full bg-[#EBF2EE] border border-gray-200/20 rounded-2xl p-5 flex items-center gap-5 min-h-[100px] md:min-h-[140px] shadow-sm">
                                    <span className="text-sm font-bold text-gray-800 bg-white/60 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                                        {row.sn}
                                    </span>
                                    <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight">
                                        {row.partner}
                                    </span>
                                </div>
                            </div>

                            {/* Intervention Area column */}
                            <div className="col-span-12 md:col-span-5 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center gap-3">
                                {row.interventions.map((pill, pillIdx) => (
                                    <div
                                        key={pillIdx}
                                        className="bg-[#EBF2EE] border border-gray-200/20 text-gray-800 text-xs sm:text-[13px] font-semibold rounded-full px-4 py-2.5 text-center shadow-sm"
                                    >
                                        {pill}
                                    </div>
                                ))}
                            </div>

                            {/* Coverage Area column */}
                            <div className="col-span-12 md:col-span-3 p-4 md:p-6 flex items-center justify-center">
                                <div className="w-full bg-[#EBF2EE] border border-gray-200/20 rounded-2xl p-5 flex items-center justify-center min-h-[100px] md:min-h-[140px] shadow-sm">
                                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
                                        {row.coverage}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PartnersMapping;
