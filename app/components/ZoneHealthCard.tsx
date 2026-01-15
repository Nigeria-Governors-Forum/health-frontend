"use client";

import React from "react";

interface SelectCardProps {
  title: string;
  options: any[];
  onChange: (value: string) => void;
  defaultValue?: string;
}

const ZoneHealthCard: React.FC<SelectCardProps> = ({
  title,
  options,
  onChange,
  defaultValue = "",
}) => {
  return (
    <div className="bg-white rounded-xl p-4">
      <h2 className="text-lg font-semibold text-green-800 mb-3 text-center">
        {title}
      </h2>
      <label htmlFor={`select-${title}`} className="text-black pr-5">
        Select a {title}
      </label>
      <select
        id={`select-${title}`}
        value={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1 border rounded-md border-green-400 bg-white text-green-700"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ZoneHealthCard;
