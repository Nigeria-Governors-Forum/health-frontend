"use client";

import React, { useState, useMemo } from "react";
import { FiSearch, FiInfo } from "react-icons/fi";

export interface ProgramQuota {
    program: string;
    quota: number | string;
}

export interface InstitutionRow {
    id?: number;
    institution: string;
    programs: ProgramQuota[];
}

export interface HealthTrainingTableProps {
    title?: string;
    data: InstitutionRow[];
    totalCount?: number;
    subtitle?: string;
}

function formatNumber(value?: number | string) {
    if (value === undefined || value === null || value === "") return "N/A";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString("en-US");
}

const HealthTrainingTable: React.FC<HealthTrainingTableProps> = ({
    title = "Health Training Institutions (Public & Private)",
    data,
    totalCount,
    subtitle,
}) => {
    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return data;
        return data
            .map((row) => {
                // Keep the institution if its name matches
                if (row.institution.toLowerCase().includes(q)) return row;
                // Or keep only the matching programs
                const matchedPrograms = row.programs.filter((p) =>
                    p.program.toLowerCase().includes(q)
                );
                if (matchedPrograms.length > 0) {
                    return { ...row, programs: matchedPrograms };
                }
                return null;
            })
            .filter(Boolean) as InstitutionRow[];
    }, [data, search]);

    const total = totalCount ?? data.length;

    return (
        <div className="w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
            {/* Header */}
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-bold text-green-700 sm:text-lg">
                        {title}
                    </h2>
                    <div className="group relative flex items-center">
                        <FiInfo className="shrink-0 cursor-pointer text-green-700" size={15} />
                        <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-lg bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50">
                            {subtitle || "Health training institutions breakdown."}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                        </span>
                    </div>
                </div>

                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full rounded-full border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                    <FiSearch
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className="mb-2.5 flex gap-2.5">
                <div className="flex w-[340px] shrink-0 items-center gap-3 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white">
                    <span>Institution</span>
                </div>
                <div className="flex flex-1 items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white">
                    Admission Quota
                </div>
            </div>

            {/* Institution groups */}
            <div className="flex flex-col gap-2.5">
                {filteredData.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-400">
                        No results for &ldquo;{search}&rdquo;
                    </p>
                ) : (
                    filteredData.map((row, i) => {
                        return (
                            <div
                                key={row.id ?? `${row.institution}-${i}`}
                                className="flex gap-2.5"
                            >
                                {/* Institution cell — stretches to cover all its program rows */}
                                <div className="flex w-[340px] shrink-0 items-center gap-3 self-stretch rounded-lg bg-green-50 px-5 py-4">

                                    <span className="text-sm font-semibold text-gray-700">
                                        {row.institution}
                                    </span>
                                </div>

                                {/* Stacked program + quota pill rows */}
                                <div className="flex flex-1 flex-col gap-2">
                                    {row.programs.map((prog, j) => (
                                        <div
                                            key={`${prog.program}-${j}`}
                                            className="flex gap-2.5"
                                        >
                                            <div className="flex flex-1 items-center justify-center rounded-lg bg-green-50 px-5 py-3 text-sm font-medium text-gray-700">
                                                {prog.program}
                                            </div>
                                            <div className="flex w-[200px] shrink-0 items-center justify-center rounded-lg bg-green-50 px-5 py-3 text-sm font-bold text-gray-800">
                                                {formatNumber(prog.quota)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default HealthTrainingTable;