"use client";

import { FormEvent, useRef, useState } from "react";
import { FiShield, FiUploadCloud, FiX } from "react-icons/fi";
import { Endpoints } from "@/app/api-client/src";

type UploadResult = {
  type: "success" | "error";
  message: string;
};

const SecurityUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const years = Array.from({ length: 11 }, (_, index) =>
    new Date().getFullYear() - index,
  );

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setResult({ type: "error", message: "Choose a security workbook first." });
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setResult({
        type: "error",
        message: "The backend API URL is not configured.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setResult(null);
    try {
      const response = await fetch(
        `${apiUrl}${Endpoints.threatAssessment.upload(year)}`,
        { method: "POST", body: formData },
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

      setResult({
        type: "success",
        message:
          (typeof payload.message === "string" && payload.message) ||
          `Security data uploaded for ${year}.`,
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setResult({
        type: "error",
        message:
          error instanceof Error ? error.message : "Security upload failed.",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <form
        onSubmit={handleUpload}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <FiShield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Upload Security Data
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              This security-only importer is separate from Health Data Upload.
              It imports only the threat assessment worksheet.
            </p>
          </div>
        </div>

        <label
          htmlFor="security-year"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Assessment year
        </label>
        <select
          id="security-year"
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
          className="mb-6 w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        >
          {years.map((optionYear) => (
            <option key={optionYear} value={optionYear}>
              {optionYear}
            </option>
          ))}
        </select>

        <input
          ref={fileInputRef}
          id="security-workbook"
          type="file"
          accept=".xlsx,.xls,.xlsb"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setResult(null);
          }}
          className="sr-only"
        />
        <label
          htmlFor="security-workbook"
          className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 px-5 py-8 text-center transition hover:bg-emerald-50"
        >
          <FiUploadCloud size={32} className="mb-3 text-emerald-700" />
          <span className="font-semibold text-slate-800">
            {file ? file.name : "Choose a security workbook"}
          </span>
          <span className="mt-1 text-sm text-slate-500">
            Excel workbook with a Threat_Vulnerability_Assessment worksheet
            (.xlsx, .xls, .xlsb)
          </span>
        </label>

        {file && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
            <span className="truncate text-slate-700">
              {file.name} · {(file.size / 1024).toFixed(0)} KB
            </span>
            <button
              type="button"
              onClick={removeFile}
              aria-label="Remove selected workbook"
              className="ml-3 shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
            >
              <FiX size={18} />
            </button>
          </div>
        )}

        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Expected columns</p>
          <p className="mt-1">
            state, zone, risk, primary_threats, and hotspots_lga. If a row
            doesn&apos;t include a year, the selected assessment year is used.
          </p>
        </div>

        {result && (
          <p
            role="status"
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              result.type === "success"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {result.message}
          </p>
        )}

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={uploading || !file}
            className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading security data..." : "Upload Security Data"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecurityUploadPage;
