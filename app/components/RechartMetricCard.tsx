
"use client";

import React from "react";
import { FiInfo } from "react-icons/fi";

export type Variant = "budget" | "gauge" | "simple";

export interface BreakdownItem {
  label: string;
  percentage: number;
  color: string;
}

export interface MetricCardProps {
  variant: Variant;
  title: string;
  amount?: string;
  currencySymbol?: string;
  breakdown?: BreakdownItem[];
  valuePct?: number;
  maxPct?: number;
  /** Target marker shown as a green tick on the gauge arc */
  targetPct?: number;
  /** e.g. "Updated Nov 24, 2026" — shown at the bottom center of gauge */
  updatedAt?: string;
  /** Color of the filled arc. Defaults to #C0392B (red-orange) */
  arcColor?: string;
  className?: string;
  currencyDenotation?: string;
}

const cn = (...args: (string | undefined)[]) => args.filter(Boolean).join(" ");

// ─── Budget ────────────────────────────────────────────────────────────────────

const BudgetVariant: React.FC<{
  title: string;
  amount: string;
  currencySymbol: string;
  breakdown: BreakdownItem[];
  currencyDenotation?: string;
}> = ({ title, amount, currencySymbol, breakdown, currencyDenotation }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 h-full justify-between">
      {/* Title */}
      <div className="flex items-center gap-1.5 pb-3 border-b-2 border-gray-200">
        <span className="text-base font-bold text-gray-800">{title}</span>
        <FiInfo className="text-green-900" size={20} />
      </div>

      {/* Amount */}
      <div className="text-center py-2">
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {currencySymbol}{amount}{currencyDenotation}
        </span>
      </div>

      {/* Segmented bar */}
      <div className="flex w-full overflow-hidden rounded-lg" style={{ height: 28 }}>
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
          />
        ))}
      </div>

      {/* Labels — each centered under its own segment */}
      <div className="flex w-full">
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            style={{ width: `${item.percentage}%` }}
            className="flex flex-col items-center"
          >
            <span className="text-xs text-gray-500 truncate w-full text-center">{item.label}</span>
            <span className="text-xs font-bold text-gray-800">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Gauge ─────────────────────────────────────────────────────────────────────

/**
 * Convert polar angle (standard math: 0°=right, 90°=up, 180°=left)
 * into SVG x/y coordinates.
 * SVG has y-axis pointing DOWN, so we negate the sin term.
 */
function pt(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

/**
 * SVG arc path from startDeg → endDeg going OVER THE TOP (clockwise in SVG).
 * sweep-flag=1 means clockwise in screen coordinates (y-axis down),
 * which visually goes left → top → right — exactly the semicircle we want.
 */
function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = pt(cx, cy, r, startDeg);
  const e = pt(cx, cy, r, endDeg);
  // largeArc=1 when the span is > 180° (only needed for the full background arc)
  const large = startDeg - endDeg >= 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

const GaugeVariant: React.FC<{
  title: string;
  valuePct: number;
  maxPct: number;
  targetPct?: number;
  updatedAt?: string;
  arcColor?: string;
}> = ({
  title,
  valuePct = 0,
  maxPct = 100,
  targetPct,
  updatedAt,
  arcColor = "#C0392B",
}) => {
    // ── dimensions ──────────────────────────────────────────────────────────────
    const W = 260;
    const H = 170;
    const cx = W / 2;
    const cy = H - 24;        // baseline sits near the bottom of the SVG
    const R = 104;            // mid-radius of the arc stroke
    const SW = 26;            // stroke width (arc thickness)

    // ── angles ──────────────────────────────────────────────────────────────────
    // 180° = leftmost (0 on scale), 0° = rightmost (maxPct on scale)
    const safe = Math.min(Math.max(valuePct, 0), maxPct);
    const valAngle = 180 - (safe / maxPct) * 180;
    const targAngle = targetPct != null
      ? 180 - (Math.min(targetPct, maxPct) / maxPct) * 180
      : null;

    // ── derived points ──────────────────────────────────────────────────────────
    const tip = pt(cx, cy, R, valAngle);   // center of the dot at arc tip

    // tick: slightly outside the outer edge of the arc
    const tickOut = targAngle != null ? pt(cx, cy, R + SW / 2 + 10, targAngle) : null;
    const tickIn = targAngle != null ? pt(cx, cy, R - SW / 2 - 2, targAngle) : null;
    const lblPt = targAngle != null ? pt(cx, cy, R + SW / 2 + 22, targAngle) : null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col h-full justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-1.5 mb-1 pb-3 border-b-2 border-gray-200">
          <span className="text-base font-bold text-gray-800">{title}</span>
          <FiInfo className="text-green-900" size={20} />

        </div>

        {/* SVG Container */}
        <div className="flex-1 flex items-center justify-center min-h-0 w-full">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="max-w-[240px]" style={{ overflow: "visible" }}>

            {/* ── gray background full arc ── */}
            <path
              d={arc(cx, cy, R, 180, 0)}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={SW}
              strokeLinecap="round"
            />

            {/* ── colored filled arc ── */}
            {safe > 0 && (
              <path
                d={arc(cx, cy, R, 180, valAngle)}
                fill="none"
                stroke={arcColor}
                strokeWidth={SW}
                strokeLinecap="round"
              />
            )}

            {/* ── white dot with colored border at arc tip ── */}
            <circle cx={tip.x} cy={tip.y} r={10} fill="white" stroke={arcColor} strokeWidth={3} />

            {/* ── target tick ── */}
            {tickIn && tickOut && (
              <line
                x1={tickIn.x} y1={tickIn.y}
                x2={tickOut.x} y2={tickOut.y}
                stroke="#16a34a"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            )}

            {/* ── target label ── */}
            {lblPt && targetPct != null && (
              <text
                x={lblPt.x} y={lblPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={700}
                fill="#16a34a"
              >
                {targetPct}%
              </text>
            )}

            {/* ── large center value ── */}
            <text
              x={cx} y={cy - 20}
              textAnchor="middle"
              dominantBaseline="auto"
              fontSize={40}
              fontWeight={800}
              fill="#111827"
              fontFamily="inherit"
            >
              {safe}%
            </text>

            {/* ── updated label ── */}
            {updatedAt && (
              <text
                x={cx} y={cy + 4}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize={10}
                fill="#9CA3AF"
                fontFamily="inherit"
              >
                {updatedAt}
              </text>
            )}

            {/* ── 0% (left) ── */}
            <text
              x={cx - R - SW / 2 - 4} y={cy + 4}
              textAnchor="end"
              dominantBaseline="hanging"
              fontSize={12}
              fontWeight={600}
              fill="#6B7280"
            >
              0%
            </text>

            {/* ── maxPct% (right) ── */}
            <text
              x={cx + R + SW / 2 + 4} y={cy + 4}
              textAnchor="start"
              dominantBaseline="hanging"
              fontSize={12}
              fontWeight={600}
              fill="#6B7280"
            >
              {maxPct}%
            </text>
          </svg>
        </div>
      </div>
    );
  };

// ─── Simple ────────────────────────────────────────────────────────────────────

const SimpleVariant: React.FC<{
  title: string;
  amount: string;
  currencySymbol: string;
  currencyDenotation?: string;
}> = ({ title, amount, currencySymbol, currencyDenotation }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 h-full">
      {/* Outer title */}
      <div className="flex items-center gap-1.5 pb-3 border-b-2 border-gray-200">
        <span className="text-base font-bold text-gray-800">{title}</span>
        <FiInfo className="text-green-900" size={20} />
      </div>

      {/* Inner card */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col gap-3 flex-1 justify-center">
        {/* Green icon circle */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
          <svg viewBox="0 0 24 24" fill="none" width={20} height={20}>
            <text
              x="12" y="17"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="white"
            >
              ₦
            </text>
          </svg>
        </div>

        {/* Inner label */}
        <span className="text-sm font-semibold text-gray-700">{title}</span>

        {/* Amount */}
        <span className="text-2xl font-extrabold text-green-600 tracking-tight">
          {currencySymbol}{amount}{currencyDenotation}
        </span>
      </div>
    </div>
  );
};

// ─── Wrapper ───────────────────────────────────────────────────────────────────

const RechartMetricCard: React.FC<MetricCardProps> = ({
  variant,
  title,
  amount = "",
  currencySymbol = "₦",
  breakdown = [],
  valuePct = 0,
  maxPct = 100,
  targetPct,
  updatedAt,
  arcColor,
  className = "",
  currencyDenotation = "",
}) => {
  if (variant === "budget") {
    return (
      <div className={cn("h-full", className)}>
        <BudgetVariant
          title={title}
          amount={amount}
          currencySymbol={currencySymbol}
          breakdown={breakdown}
          currencyDenotation={currencyDenotation}
        />
      </div>
    );
  }

  if (variant === "gauge") {
    return (
      <div className={cn("h-full", className)}>
        <GaugeVariant
          title={title}
          valuePct={valuePct}
          maxPct={maxPct}
          targetPct={targetPct}
          updatedAt={updatedAt}
          arcColor={arcColor}
        />
      </div>
    );
  }

  if (variant === "simple") {
    return (
      <div className={cn("h-full", className)}>
        <SimpleVariant
          title={title}
          amount={amount}
          currencySymbol={currencySymbol}
          currencyDenotation={currencyDenotation}
        />
      </div>
    );
  }

  return null;
};

export default RechartMetricCard;