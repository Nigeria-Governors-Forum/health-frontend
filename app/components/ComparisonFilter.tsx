"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiMapPin, FiCalendar, FiHome, FiGrid } from "react-icons/fi";

export type ComparisonMode = "zonal" | "national" | "trend";

export interface SelectOption {
  label: string;
  value: string;
}

export interface ComparisonFilterPanelProps {
  mode?: ComparisonMode;
  defaultMode?: ComparisonMode;
  onModeChange?: (mode: ComparisonMode) => void;

  zones: SelectOption[];
  states: SelectOption[];
  years: SelectOption[];
  indicators?: SelectOption[];
  groups?: SelectOption[];

  selectedZone?: string;
  selectedState?: string;
  selectedYear?: string;
  selectedIndicator?: string;
  selectedGroup?: string;

  onZoneChange?: (value: string) => void;
  onStateChange?: (value: string) => void;
  onYearChange?: (value: string) => void;
  onIndicatorChange?: (value: string) => void;
  onGroupChange?: (value: string) => void;

  zonesLoading?: boolean;
  statesLoading?: boolean;
  yearsLoading?: boolean;
  indicatorsLoading?: boolean;
  groupsLoading?: boolean;

  className?: string;
  indicatorTitle?: string;
  indicatorText?: string;
  indicatorIcon?: React.ReactNode;

  groupTitle?: string;
  groupText?: string;
  groupIcon?: React.ReactNode;
  grid2x2?: boolean;
}

const MODES: { key: ComparisonMode; label: string }[] = [
  { key: "zonal", label: "Zonal Comparison" },
  { key: "national", label: "National Comparison" },
  { key: "trend", label: "Trend" },
];

function SelectField({
  icon,
  label,
  helperText,
  value,
  options,
  placeholder = "Select One",
  loading,
  disabled,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  helperText: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;
  const displayText = loading ? "Loading..." : selectedLabel || placeholder;

  return (
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-green-700">{label}</h3>
      <p className="mb-2 text-xs text-gray-400">{helperText}</p>

      <div ref={wrapperRef} className="relative">
        <div
          className={`flex items-stretch overflow-hidden rounded-md border border-gray-200 ${disabled ? "opacity-50" : ""
            }`}
        >
          <button
            type="button"
            disabled={disabled || loading}
            onClick={() => setOpen((v) => !v)}
            className="flex flex-1 items-center gap-2 bg-white px-3 py-2.5 text-left text-sm text-gray-500 disabled:cursor-not-allowed"
          >
            <span className="shrink-0 text-gray-400">{icon}</span>
            <span className={selectedLabel ? "text-gray-800" : "text-gray-400"}>
              {displayText}
            </span>
          </button>
          <button
            type="button"
            disabled={disabled || loading}
            onClick={() => setOpen((v) => !v)}
            className="flex w-10 shrink-0 items-center justify-center bg-green-600 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed"
            aria-label={`Toggle ${label} options`}
          >
            <FiChevronDown
              className={`transition-transform ${open ? "rotate-180" : ""}`}
              size={16}
            />
          </button>
        </div>

        {open && !disabled && !loading && (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            {options.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-400">No options</p>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-green-50 ${opt.value === value
                    ? "bg-green-50 font-medium text-green-700"
                    : "text-gray-700"
                    }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparisonFilterPanel({
  mode,
  defaultMode = "zonal",
  onModeChange,
  zones,
  states,
  years,
  indicators,
  groups,
  selectedZone,
  selectedState,
  selectedYear,
  selectedIndicator,
  selectedGroup,
  onZoneChange,
  onStateChange,
  onYearChange,
  onIndicatorChange,
  onGroupChange,
  zonesLoading,
  statesLoading,
  yearsLoading,
  indicatorsLoading,
  groupsLoading,
  className = "",
  indicatorTitle = "Indicator Filter",
  indicatorText = "Select Indicator",
  indicatorIcon = <FiHome size={15} />,
  groupTitle = "Group Filter",
  groupText = "Select Group",
  groupIcon = <FiGrid size={15} />,
  grid2x2 = false,
}: ComparisonFilterPanelProps) {
  const [internalMode, setInternalMode] = useState<ComparisonMode>(defaultMode);
  const activeMode = mode ?? internalMode;

  const setMode = (m: ComparisonMode) => {
    setInternalMode(m);
    onModeChange?.(m);
  };

  const groupField =
    groups && groups.length > 0 ? (
      <SelectField
        icon={groupIcon}
        label={groupTitle}
        helperText={groupText}
        value={selectedGroup}
        options={groups}
        loading={groupsLoading}
        onChange={onGroupChange}
      />
    ) : null;

  const indicatorField =
    indicators && indicators.length > 0 ? (
      <SelectField
        icon={indicatorIcon}
        label={indicatorTitle}
        helperText={indicatorText}
        value={selectedIndicator}
        options={indicators}
        loading={indicatorsLoading}
        onChange={onIndicatorChange}
      />
    ) : null;

  return (
    <div className={`w-full ${className}`}>
      {/* Mode radio group */}
      <div className="mb-3 flex flex-wrap items-center gap-6">
        {MODES.map((m) => (
          <label
            key={m.key}
            className="inline-flex cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              name="comparison-mode"
              className="peer sr-only"
              checked={activeMode === m.key}
              onChange={() => setMode(m.key)}
            />
            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-green-600">
              {activeMode === m.key && (
                <span className="h-2 w-2 rounded-full bg-green-600" />
              )}
            </span>
            <span className="text-sm text-gray-700">{m.label}</span>
          </label>
        ))}
      </div>

      {/* Fields card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className={grid2x2 ? "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-8 md:gap-y-4" : "flex flex-col gap-5 sm:flex-row sm:gap-8"}>
          {grid2x2 ? (
            <>
              {/* Grid 2x2 Layout: Column 1 Row 1, Column 2 Row 1, Column 1 Row 2, Column 2 Row 2 */}
              {activeMode === "zonal" && (
                <SelectField
                  icon={<FiMapPin size={15} />}
                  label="Geopolitical Zone"
                  helperText="Select a Geopolitical Zone"
                  value={selectedZone}
                  options={zones}
                  loading={zonesLoading}
                  onChange={onZoneChange}
                />
              )}
              {activeMode === "trend" && (
                <SelectField
                  icon={<FiMapPin size={15} />}
                  label="State"
                  helperText="Select a State"
                  value={selectedState}
                  options={states}
                  loading={statesLoading}
                  onChange={onStateChange}
                />
              )}

              <SelectField
                icon={<FiCalendar size={15} />}
                label="Year"
                helperText="Select a Year"
                value={selectedYear}
                options={years}
                loading={yearsLoading}
                onChange={onYearChange}
              />

              {groupField}
              {indicatorField}
            </>
          ) : (
            <>
              {activeMode === "zonal" && (
                <>
                  <SelectField
                    icon={<FiMapPin size={15} />}
                    label="Geopolitical Zone"
                    helperText="Select a Geopolitical Zone"
                    value={selectedZone}
                    options={zones}
                    loading={zonesLoading}
                    onChange={onZoneChange}
                  />
                  {indicatorField}
                  <SelectField
                    icon={<FiCalendar size={15} />}
                    label="Year"
                    helperText="Select a Year"
                    value={selectedYear}
                    options={years}
                    loading={yearsLoading}
                    onChange={onYearChange}
                  />
                </>
              )}

              {activeMode === "national" && (
                <>
                  {indicatorField}
                  <SelectField
                    icon={<FiCalendar size={15} />}
                    label="Year"
                    helperText="Select a Year"
                    value={selectedYear}
                    options={years}
                    loading={yearsLoading}
                    onChange={onYearChange}
                  />
                </>
              )}

              {activeMode === "trend" && (
                <>
                  <SelectField
                    icon={<FiMapPin size={15} />}
                    label="State"
                    helperText="Select a State"
                    value={selectedState}
                    options={states}
                    loading={statesLoading}
                    onChange={onStateChange}
                  />
                  {indicatorField}
                  <SelectField
                    icon={<FiCalendar size={15} />}
                    label="Year"
                    helperText="Select a Year"
                    value={selectedYear}
                    options={years}
                    loading={yearsLoading}
                    onChange={onYearChange}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
