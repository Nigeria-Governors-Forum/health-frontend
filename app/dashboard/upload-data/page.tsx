"use client";

import { connectSSE } from "@/app/api-client/src";
import React, { useEffect, useState, useRef } from "react";
import { FiCalendar, FiChevronDown, FiFolder, FiX } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState<number>(2024);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const disconnect = connectSSE(
      `${process.env.NEXT_PUBLIC_API_URL}/user/progress/details`,
      (data) => {
        console.log("data", data);
        setProgress(data);
      }
    );

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setYearDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setMessage("");
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("⏳ Uploading...");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/data/${year}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setMessage(data.message || "✅ Upload successful!");
      
      // Trigger the congratulations modal on success!
      setShowSuccessModal(true);
    } catch (err: any) {
      setMessage(`❌ Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-8 w-full max-w-5xl text-gray-900 shadow-sm">
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-[#00A141] mb-6">
            Upload Excel Data
          </h1>

          {/* Year Dropdown Selection */}
          <div className="mb-6" ref={dropdownRef}>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Select Year
            </label>
            <div className="relative max-w-md">
              <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="flex flex-1 items-center gap-2 bg-white px-3 py-2.5 text-left text-sm text-gray-500"
                >
                  <span className="shrink-0 text-gray-400">
                    <FiCalendar size={15} />
                  </span>
                  <span className={year ? "text-gray-800 font-semibold" : "text-gray-400"}>
                    {year ? year : "Select a year"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="flex w-10 shrink-0 items-center justify-center bg-[#00A141] text-white transition-colors hover:bg-green-700"
                  aria-label="Toggle Year selection dropdown"
                >
                  <FiChevronDown
                    className={`transition-transform duration-200 ${yearDropdownOpen ? "rotate-180" : ""}`}
                    size={16}
                  />
                </button>
              </div>

              {yearDropdownOpen && (
                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setYear(y);
                        setYearDropdownOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-green-50 ${
                        y === year ? "bg-green-50 font-semibold text-[#00A141]" : "text-gray-700"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File Drop/Choose Section */}
          <div className="mb-6">
            <h2 className="text-[17px] font-bold text-gray-800">
              Choose file – {file ? file.name : "No file chosen"}
            </h2>
            <p className="text-xs text-gray-400 font-medium mb-3">
              {file ? "File selected successfully" : "Please select a file first"}
            </p>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 bg-white flex flex-col items-center justify-center text-center cursor-pointer transition ${
                isDragActive ? "border-[#00A141] bg-green-50/20" : "border-green-300 hover:bg-green-50/10"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Folder upload icon */}
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 5.5H12.38L10.38 3.5H5C3.9 3.5 3 4.4 3 5.5V18.5C3 19.6 3.9 20.5 5 20.5H19C20.1 20.5 21 19.6 21 18.5V7.5C21 6.4 20.1 5.5 19 5.5Z" fill="#00A141" />
                  <circle cx="12" cy="13.5" r="4" fill="white" />
                  <path d="M12 11V16M12 11L10 13M12 11L14 13" stroke="#00A141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <span className="text-[13px] font-semibold text-gray-700">
                Drag your file(s) to start uploading
              </span>
              <div className="flex items-center justify-center gap-2 w-full max-w-[200px] my-2">
                <div className="h-[1px] bg-gray-200 flex-1" />
                <span className="text-[10px] text-gray-400 font-bold tracking-wider">OR</span>
                <div className="h-[1px] bg-gray-200 flex-1" />
              </div>
              <button
                type="button"
                className="text-[#00A141] hover:bg-green-50 text-xs font-semibold px-4 py-2 border border-[#00A141] rounded-lg transition"
              >
                Browse files
              </button>
            </div>

            <span className="block text-[11px] text-gray-500 font-medium mt-2">
              Only support .xlsx and .xls files
            </span>

            {/* Selected File Card Details (Visible when a file is selected and not yet uploaded/progressing) */}
            {file && !loading && !progress && (
              <div className="mt-4 border border-gray-200/60 rounded-xl p-4 bg-white flex items-center justify-between shadow-sm max-w-2xl transition">
                <div className="flex items-center gap-3">
                  {/* File Icon */}
                  <div className="w-10 h-10 bg-[#EBF2EE] border border-green-200/40 rounded-lg flex flex-col items-center justify-center text-[#00A141] shrink-0 font-bold text-[10px] shadow-sm">
                    <FiFolder size={18} />
                    <span className="text-[8px] uppercase tracking-wider font-extrabold mt-0.5">XLS</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {(file.size / 1024).toFixed(0)}kb
                    </span>
                  </div>
                </div>
                
                {/* Cancel File Selection button */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Remove selected file"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Upload Progress Status (Visible when uploading or processing) */}
          {(loading || progress || message) && !showSuccessModal && (
            <div className="mb-6 border border-gray-100 rounded-xl p-4 bg-gray-50/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">
                    {loading ? "Uploading..." : progress?.step || "Processing..."}
                  </span>
                  <span className="text-xs text-gray-500 font-bold">
                    {progress ? `${progress.percent}% • ${progress.percent >= 100 ? "Finished" : "processing updates"}` : loading ? "30% • upload started" : message}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Pause uploading"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" />
                      <path d="M10 15V9M14 15V9" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Cancel uploading"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Progress bar line */}
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00A141] rounded-full transition-all duration-300"
                  style={{ width: `${progress ? progress.percent : loading ? 30 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Buttons at the bottom right */}
          <div className="flex items-center justify-end gap-3 mt-6 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="text-[#00A141] hover:bg-green-50 text-sm font-semibold px-6 py-2.5 border border-[#00A141] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading || !file}
              className="bg-[#00A141] hover:bg-green-700 disabled:opacity-40 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center gap-2 min-w-[100px]"
            >
              {loading && <FaSpinner className="animate-spin" size={14} />}
              Upload
            </button>
          </div>

        </div>
      </div>

      {/* Success Congratulations Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative flex flex-col items-center text-center gap-5 border border-gray-100 transform scale-100 transition-transform duration-300">
            {/* Close X icon top-right */}
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                handleCancel();
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close success modal"
            >
              <FiX size={22} />
            </button>

            {/* Light Green circle with checkmark badge */}
            <div className="w-16 h-16 rounded-full bg-[#EBF2EE] flex items-center justify-center shadow-inner">
              <svg className="w-8 h-8 text-[#00A141]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              Congratulations!
            </h2>

            {/* Modal Subtext */}
            <p className="text-sm text-gray-500 font-semibold leading-relaxed px-4">
              Data Uploaded Successfully
            </p>

            {/* Action Okay button */}
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                handleCancel();
              }}
              className="w-full bg-[#00A141] hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-sm mt-3 cursor-pointer outline-none"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadPage;
