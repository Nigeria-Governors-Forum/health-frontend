import React from "react";

export interface CategoryOption {
  value: string;
  label: string;
}

export interface CategorySelectProps {
  label?: string;
  options: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  label = "Select Category:",
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`mb-6 text-black ${className}`}>
      {label && (
        <label className="block font-semibold mb-2">{label}</label>
      )}

      <div className="relative flex items-center w-full border border-gray-300 rounded-lg bg-white overflow-hidden">
        {/* Left icon */}
        <div className="pl-3 pr-2 text-gray-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M17 14v6M14 17h6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Select */}
        <select
          className="flex-1 py-3 pr-12 pl-1 bg-transparent text-sm text-gray-700 appearance-none outline-none cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Right green chevron */}
        <div className="absolute right-0 top-0 h-full w-11 bg-green-700 flex items-center justify-center pointer-events-none rounded-r-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;