"use client";

import { connectSSE } from "@/app/api-client/src";
import { useEffect, useState } from "react";
import { FaUpload, FaSpinner } from "react-icons/fa";
// import { connectSSE } from "../../../api-client/src";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState<number>(2024);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<any>(null);

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

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0] ?? null);
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

      const data = await res.json();
      //   setMessage(JSON.stringify(data, null, 2));
      setMessage(data.message || "✅ Upload successful!");
    } catch (err: any) {
      setMessage(`❌ Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isError = message.startsWith("❌") || message.startsWith("⚠️");
  const isSuccess = message.startsWith("✅");

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-50 rounded-2xl p-8 w-full text-gray-900">
        <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
          <FaUpload className="w-6 h-6" /> Upload Excel Data
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-3 py-2 border border-green-400 rounded-lg bg-white text-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Choose Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="w-full text-gray-600"
          />
          {file && (
            <p className="text-sm text-gray-500 mt-1">
              📂 Selected: {file.name}
            </p>
          )}
        </div> */}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Choose Excel File
          </label>

          <div className="relative border-2 border-dashed border-green-400 rounded-lg p-4 bg-white hover:bg-green-50 transition">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex items-center justify-center gap-2 text-green-700">
              <FaUpload className="w-5 h-5" />
              <span className="font-medium">
                {file ? "Change file" : "Click to select Excel file"}
              </span>
            </div>
          </div>

          {file && (
            <p className="text-sm text-gray-600 mt-2">
              📂 Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition
             disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin w-5 h-5" />
              Uploading...
            </>
          ) : (
            <>
              <FaUpload className="w-5 h-5" />
              Upload
            </>
          )}
        </button>

        {/* {message && (
          <pre className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-800 whitespace-pre-wrap min-h-[64px]">
            {message} ola
          </pre>
        )} */}
        {/* <div className="mt-6 min-h-[64px]">
          {message && (
            <div
              className={`p-3 rounded-lg text-sm transition
        ${
          isError
            ? "bg-red-50 text-red-700 border border-red-200"
            : isSuccess
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
        }
      `}
            >
              {message}
            </div>
          )}
        </div> */}
        {progress ? (
          <pre>{JSON.stringify(progress, null, 2)}</pre>
        ) : (
          <p>Waiting for updates...</p>
        )}

        <div className="mt-4 min-h-[48px] text-sm text-gray-600">
          {progress ? (
            <p>
              Processing: <strong>{progress.step}</strong> ({progress.percent}%)
            </p>
          ) : (
            <p className="italic">Waiting for updates…</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
