"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  FiShield,
  FiUploadCloud,
  FiX,
  FiSave,
  FiPlus,
  FiTrash2,
  FiRefreshCw,
  FiDownload,
  FiCheck,
  FiAlertTriangle,
  FiArrowLeft,
  FiEdit3,
  FiSearch,
} from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { Endpoints, httpClient } from "@/app/api-client/src";
import LoadingScreen from "@/app/components/LoadingScreen";

export interface SecurityRecord {
  id?: number;
  state: string;
  zone?: string;
  year?: number;
  risk?: string;
  primary_threats?: string;
  hotspots_lga?: string;
  _dirty?: boolean;
  _isNew?: boolean;
}

const THREAT_LEVEL_OPTIONS = [
  { value: "CRITICAL", label: "Critical", color: "#dc2626" },
  { value: "HIGH", label: "High", color: "#e11d48" },
  { value: "ELEVATED", label: "Elevated", color: "#ef4444" },
  { value: "MODERATE", label: "Moderate", color: "#3b82f6" },
  { value: "LOW-MODERATE", label: "Low-Moderate", color: "#964B00" },
];

const ZONE_OPTIONS = [
  "North Central",
  "North East",
  "North West",
  "South East",
  "South South",
  "South West",
];

type UploadResult = {
  type: "success" | "error";
  message: string;
};

const SecurityUploadPage = () => {
  const [activeTab, setActiveTab] = useState<"editor" | "upload">("editor");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [records, setRecords] = useState<SecurityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const years = Array.from({ length: 11 }, (_, index) =>
    new Date().getFullYear() - index,
  );

  // Fetch security records from backend for current year
  const fetchRecords = async (targetYear: number) => {
    try {
      setLoading(true);
      const response = await httpClient.get<any>(
        `${Endpoints.threatAssessment.all}?year=${targetYear}`,
      );

      const rows: SecurityRecord[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setRecords(rows.map((r) => ({ ...r, _dirty: false })));
    } catch (err) {
      console.error("Failed to load security records:", err);
      toast.error("Failed to load security assessments from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(year);
  }, [year]);

  // Track field change on a record
  const handleFieldChange = (
    index: number,
    field: keyof SecurityRecord,
    value: any,
  ) => {
    setRecords((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
        _dirty: true,
      };
      return copy;
    });
  };

  // Add a new blank state assessment row
  const handleAddRow = () => {
    const newRecord: SecurityRecord = {
      state: "",
      zone: "North Central",
      risk: "MODERATE",
      primary_threats: "",
      hotspots_lga: "",
      year,
      _dirty: true,
      _isNew: true,
    };
    setRecords((prev) => [newRecord, ...prev]);
    toast.success("New state assessment row added to table");
  };

  // Save single row to backend
  const handleSaveRow = async (index: number) => {
    const record = records[index];
    if (!record.state.trim()) {
      toast.error("Please enter a state name");
      return;
    }

    try {
      setSaving(true);
      if (record.id && !record._isNew) {
        await httpClient.patch(
          Endpoints.threatAssessment.byId(record.id),
          {
            state: record.state.trim(),
            zone: record.zone?.trim(),
            risk: record.risk?.trim().toUpperCase(),
            primary_threats: record.primary_threats?.trim(),
            hotspots_lga: record.hotspots_lga?.trim(),
            year,
          },
        );
      } else {
        // Save via bulk or create
        await httpClient.post(Endpoints.threatAssessment.bulk, {
          items: [
            {
              state: record.state.trim(),
              zone: record.zone?.trim(),
              risk: record.risk?.trim().toUpperCase(),
              primary_threats: record.primary_threats?.trim(),
              hotspots_lga: record.hotspots_lga?.trim(),
              year,
            },
          ],
          year,
        });
      }

      toast.success(`Saved assessment for ${record.state}`);
      fetchRecords(year);
    } catch (err) {
      console.error("Failed to save record:", err);
      toast.error("Failed to save security record to backend");
    } finally {
      setSaving(false);
    }
  };

  // Save all modified rows to backend in bulk
  const handleSaveAll = async () => {
    const dirtyRecords = records.filter((r) => r._dirty || r._isNew);
    if (dirtyRecords.length === 0) {
      toast("No changes to save", { icon: "ℹ️" });
      return;
    }

    // Validate states
    for (const r of dirtyRecords) {
      if (!r.state.trim()) {
        toast.error("All rows must have a valid state name");
        return;
      }
    }

    try {
      setSaving(true);
      await httpClient.post(Endpoints.threatAssessment.bulk, {
        items: dirtyRecords.map((r) => ({
          id: r._isNew ? undefined : r.id,
          state: r.state.trim(),
          zone: r.zone?.trim(),
          risk: r.risk?.trim().toUpperCase(),
          primary_threats: r.primary_threats?.trim(),
          hotspots_lga: r.hotspots_lga?.trim(),
          year,
        })),
        year,
      });

      toast.success(`Saved ${dirtyRecords.length} updated security records`);
      fetchRecords(year);
    } catch (err) {
      console.error("Failed to bulk save records:", err);
      toast.error("Failed to save changes to backend");
    } finally {
      setSaving(false);
    }
  };

  // Delete a record
  const handleDeleteRow = async (index: number) => {
    const record = records[index];
    if (!record.id) {
      setRecords((prev) => prev.filter((_, i) => i !== index));
      toast.success("Removed row");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${record.state} security record?`)) {
      return;
    }

    try {
      setSaving(true);
      await httpClient.delete(Endpoints.threatAssessment.byId(record.id));
      toast.success(`Deleted ${record.state} record`);
      setRecords((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete record:", err);
      toast.error("Failed to delete record from backend");
    } finally {
      setSaving(false);
    }
  };

  // Reset or Seed Default Data
  const handleSeedDefaults = async () => {
    try {
      setLoading(true);
      await httpClient.post(Endpoints.threatAssessment.seed(year), {});
      toast.success(`Seeded default security assessments for ${year}`);
      setShowSeedConfirm(false);
      fetchRecords(year);
    } catch (err) {
      console.error("Failed to seed defaults:", err);
      toast.error("Failed to seed security data");
    } finally {
      setLoading(false);
    }
  };

  // Download Current Data as CSV
  const handleDownloadCSV = () => {
    if (records.length === 0) {
      toast.error("No records to download");
      return;
    }

    const headers = [
      "State",
      "Zone",
      "Threat Level",
      "Primary Threats",
      "Hotspots / LGA",
      "Year",
    ];

    const csvRows = records.map((r) => [
      `"${(r.state || "").replace(/"/g, '""')}"`,
      `"${(r.zone || "").replace(/"/g, '""')}"`,
      `"${(r.risk || "").replace(/"/g, '""')}"`,
      `"${(r.primary_threats || "").replace(/"/g, '""')}"`,
      `"${(r.hotspots_lga || "").replace(/"/g, '""')}"`,
      r.year || year,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Threat_Vulnerability_Assessment_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded security assessment CSV for ${year}`);
  };

  // Handle Excel/CSV file upload
  const handleFileUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setUploadResult({
        type: "error",
        message: "Choose a security workbook or CSV file first.",
      });
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setUploadResult({
        type: "error",
        message: "The backend API URL is not configured.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadResult(null);
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${apiUrl}${Endpoints.threatAssessment.upload(year)}`,
        {
          method: "POST",
          headers,
          body: formData,
        },
      );
      const responseText = await response.text();
      let payload: { message?: string | string[] } = {};
      if (responseText) {
        try {
          payload = JSON.parse(responseText) as { message?: string | string[] };
        } catch {
          if (response.ok) {
            throw new Error("The backend returned an invalid response.");
          }
        }
      }

      if (!response.ok) {
        const detail = Array.isArray(payload.message)
          ? payload.message.join(", ")
          : payload.message;
        throw new Error(detail || `Upload failed (HTTP ${response.status}).`);
      }

      setUploadResult({
        type: "success",
        message:
          (typeof payload.message === "string" && payload.message) ||
          `Security data successfully imported to backend for ${year}.`,
      });
      toast.success(`Security data imported successfully for ${year}!`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh records to show uploaded data immediately
      fetchRecords(year);
      setActiveTab("editor");
    } catch (error) {
      setUploadResult({
        type: "error",
        message:
          error instanceof Error ? error.message : "Security upload failed.",
      });
    } finally {
      setUploading(false);
    }
  };

  // Filter records by search query
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return records;
    return records.filter(
      (r) =>
        (r.state || "").toLowerCase().includes(q) ||
        (r.zone || "").toLowerCase().includes(q) ||
        (r.risk || "").toLowerCase().includes(q) ||
        (r.primary_threats || "").toLowerCase().includes(q) ||
        (r.hotspots_lga || "").toLowerCase().includes(q),
    );
  }, [records, searchQuery]);

  const dirtyCount = useMemo(
    () => records.filter((r) => r._dirty || r._isNew).length,
    [records],
  );

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 space-y-6">
      {loading && <LoadingScreen />}

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-700">
            <FaShieldAlt size={26} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Security Data Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Backend Live Data
              </span>
            </div>
            <p className="mt-1 text-xs md:text-sm text-slate-500">
              Edit threat levels, primary threats, and hotspot LGAs directly in
              the table or upload via Excel. Changes immediately reflect on the
              Security Dashboard.
            </p>
          </div>
        </div>

        {/* TOP ACTIONS */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/dashboard/security"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs md:text-sm font-semibold transition shadow-sm cursor-pointer"
          >
            <FiArrowLeft size={16} />
            View Security Dashboard
          </Link>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              activeTab === "editor"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiEdit3 size={16} />
            Live Data Editor ({records.length})
            {dirtyCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              activeTab === "upload"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiUploadCloud size={16} />
            Upload Excel / CSV
          </button>
        </div>

        {/* YEAR SELECTOR */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="global-year-select"
            className="text-xs font-bold text-slate-600 uppercase tracking-wider"
          >
            Assessment Year:
          </label>
          <select
            id="global-year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 cursor-pointer shadow-xs"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: LIVE DATA EDITOR */}
      {activeTab === "editor" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          {/* TOOLBAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 flex-1 max-w-md">
              <div className="relative w-full">
                <FiSearch
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search state, zone, risk, or threats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAddRow}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer border border-emerald-200"
              >
                <FiPlus size={15} />
                Add State
              </button>

              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
                title="Download CSV spreadsheet for editing in Excel"
              >
                <FiDownload size={15} />
                Download CSV
              </button>

              <button
                onClick={() => fetchRecords(year)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
                title="Reload data from database"
              >
                <FiRefreshCw size={14} />
                Reload
              </button>

              <button
                onClick={() => setShowSeedConfirm(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition cursor-pointer border border-amber-200"
                title="Seed database with official threat assessments"
              >
                <FiShield size={14} />
                Seed Defaults
              </button>

              <button
                onClick={handleSaveAll}
                disabled={saving || dirtyCount === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  dirtyCount > 0
                    ? "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <FiSave size={15} />
                {saving
                  ? "Saving..."
                  : dirtyCount > 0
                    ? `Save All (${dirtyCount})`
                    : "Saved"}
              </button>
            </div>
          </div>

          {/* EDITABLE TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-12">#</th>
                  <th className="py-3 px-3 w-36">State</th>
                  <th className="py-3 px-3 w-36">Zone</th>
                  <th className="py-3 px-3 w-40">Threat Level (Risk)</th>
                  <th className="py-3 px-3 min-w-[280px]">Primary Threats</th>
                  <th className="py-3 px-3 min-w-[220px]">Hotspots / LGA</th>
                  <th className="py-3 px-3 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 px-4 text-center text-slate-500"
                    >
                      {loading ? (
                        "Loading records from backend..."
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                          <p className="text-sm font-semibold">
                            No security records found for {year}.
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleAddRow}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              Add First State
                            </button>
                            <button
                              onClick={handleSeedDefaults}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                            >
                              Seed Initial Assessment
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((row, idx) => {
                    // Find actual index in state array
                    const originalIndex = records.findIndex(
                      (r) =>
                        (r.id && r.id === row.id) ||
                        (!r.id && r.state === row.state),
                    );
                    const targetIdx = originalIndex >= 0 ? originalIndex : idx;

                    return (
                      <tr
                        key={row.id ?? `new-${targetIdx}`}
                        className={`transition-colors ${
                          row._dirty ? "bg-amber-50/40" : "hover:bg-slate-50/70"
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                          {targetIdx + 1}
                        </td>

                        {/* State */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.state}
                            onChange={(e) =>
                              handleFieldChange(
                                targetIdx,
                                "state",
                                e.target.value,
                              )
                            }
                            placeholder="State name"
                            className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </td>

                        {/* Zone */}
                        <td className="py-2.5 px-3">
                          <select
                            value={row.zone || "North Central"}
                            onChange={(e) =>
                              handleFieldChange(
                                targetIdx,
                                "zone",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          >
                            {ZONE_OPTIONS.map((z) => (
                              <option key={z} value={z}>
                                {z}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Threat Level */}
                        <td className="py-2.5 px-3">
                          <select
                            value={
                              row.risk?.toUpperCase().replace(/\s+/g, "-") ||
                              "MODERATE"
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                targetIdx,
                                "risk",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            style={{
                              color:
                                THREAT_LEVEL_OPTIONS.find(
                                  (opt) =>
                                    opt.value ===
                                    row.risk
                                      ?.toUpperCase()
                                      .replace(/\s+/g, "-"),
                                )?.color || "#334155",
                            }}
                          >
                            {THREAT_LEVEL_OPTIONS.map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                style={{ color: opt.color, fontWeight: "bold" }}
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Primary Threats */}
                        <td className="py-2.5 px-3">
                          <textarea
                            rows={2}
                            value={row.primary_threats || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                targetIdx,
                                "primary_threats",
                                e.target.value,
                              )
                            }
                            placeholder="Primary security threats narrative..."
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed resize-y"
                          />
                        </td>

                        {/* Hotspots / LGA */}
                        <td className="py-2.5 px-3">
                          <textarea
                            rows={2}
                            value={row.hotspots_lga || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                targetIdx,
                                "hotspots_lga",
                                e.target.value,
                              )
                            }
                            placeholder="Comma-separated hotspot LGAs..."
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed resize-y"
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveRow(targetIdx)}
                              disabled={saving}
                              title="Save this row"
                              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                row._dirty
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <FiSave size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteRow(targetIdx)}
                              disabled={saving}
                              title="Delete record"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER SUMMARY */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Showing {filteredRecords.length} of {records.length} states
              for year {year}
            </span>
            {dirtyCount > 0 && (
              <span className="font-semibold text-amber-600">
                ⚠️ You have {dirtyCount} unsaved row(s). Click &quot;Save All&quot;
                to persist to backend.
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EXCEL / CSV UPLOAD */}
      {activeTab === "upload" && (
        <form
          onSubmit={handleFileUpload}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <FiUploadCloud size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Upload Security Workbook or CSV
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Upload an Excel workbook (.xlsx, .xls, .xlsb) or CSV (.csv) with
                state-by-state threat assessment data. The backend will parse
                columns and sync database records and LGA hotspots.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="security-year-upload"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Target Assessment Year
            </label>
            <select
              id="security-year-upload"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-xs cursor-pointer"
            >
              {years.map((optionYear) => (
                <option key={optionYear} value={optionYear}>
                  {optionYear}
                </option>
              ))}
            </select>
          </div>

          <input
            ref={fileInputRef}
            id="security-workbook-file"
            type="file"
            accept=".xlsx,.xls,.xlsb,.csv"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setUploadResult(null);
            }}
            className="sr-only"
          />
          <label
            htmlFor="security-workbook-file"
            className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 px-5 py-8 text-center transition hover:bg-emerald-50"
          >
            <FiUploadCloud size={36} className="mb-3 text-emerald-700" />
            <span className="font-semibold text-slate-800 text-base">
              {file ? file.name : "Choose an Excel workbook or CSV file"}
            </span>
            <span className="mt-1 text-sm text-slate-500">
              Worksheet named Threat_Vulnerability_Assessment, Security, or
              single-sheet CSV (.xlsx, .xls, .xlsb, .csv)
            </span>
          </label>

          {file && (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <span className="truncate text-slate-700 font-medium">
                {file.name} · {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setUploadResult(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                aria-label="Remove selected file"
                className="ml-3 shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
              >
                <FiX size={18} />
              </button>
            </div>
          )}

          <div className="rounded-xl bg-slate-50 p-4 text-xs md:text-sm text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">
              Supported Columns & Aliases:
            </p>
            <p>
              • <strong>State</strong> (or State Name)
            </p>
            <p>
              • <strong>Zone</strong> (or Geopolitical Zone)
            </p>
            <p>
              • <strong>Threat Level</strong> (or Risk, Risk Level: CRITICAL,
              HIGH, ELEVATED, MODERATE, LOW-MODERATE)
            </p>
            <p>
              • <strong>Primary Threats</strong> (or Threats, Issues)
            </p>
            <p>
              • <strong>Hotspots / LGA</strong> (or Hotspots LGA, LGAs)
            </p>
          </div>

          {uploadResult && (
            <p
              role="status"
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                uploadResult.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {uploadResult.message}
            </p>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
            >
              <FiDownload size={15} />
              Download Current Data as CSV Template
            </button>

            <button
              type="submit"
              disabled={uploading || !file}
              className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {uploading
                ? "Uploading security data..."
                : "Upload Security Data"}
            </button>
          </div>
        </form>
      )}

      {/* SEED CONFIRMATION MODAL */}
      {showSeedConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <FiAlertTriangle size={24} />
              <h3 className="text-lg font-bold text-slate-800">
                Seed Default Assessments?
              </h3>
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              This will populate or overwrite records for year{" "}
              <strong>{year}</strong> with the official threat assessments and
              hotspot LGAs across all 36 States + FCT.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSeedConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSeedDefaults}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-sm"
              >
                Yes, Seed Default Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityUploadPage;
