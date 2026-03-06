import { useState, useRef, useEffect } from "react";
import { SizeInput } from "./CustomSIzing";

// ─── Constants ────────────────────────────────────────────────────────────────

const UNIT_GROUPS = [
  ["px", "%", "em", "rem", "vw", "vh", "vmin", "vmax"],
  ["calc", "min", "max", "clamp"],
  ["auto", "inherit", "unset", "css var"],
];

const LAYOUT_STYLES = ["Block", "Flex", "Grid"];

export const DEFAULT_LAYOUT = {
  layoutStyle: "block",
  width: { value: "100", unit: "%" },
  height: { value: "auto", unit: "auto" },

  // Shared
  horizontalGap: { value: "60", unit: "px" },
  verticalGap: { value: "60", unit: "px" },
  showInnerShadow: false,

  // Flex
  layoutDirection: "row", // row | row-reverse | column | column-reverse
  justifyContent: "center", // flex-start | center | flex-end | space-between | space-around | space-evenly
  alignItems: "center", // flex-start | center | flex-end | stretch
  layoutWrapping: "nowrap", // nowrap | wrap | wrap-reverse
  alignContent: "flex-start", // flex-start | center | flex-end | space-between | space-around | stretch

  // Grid
  columnWidths: "Equal Width Columns",
  numberOfColumns: "1",
  collapseEmptyColumns: false,
  gridAutoColumns: "auto",
  rowHeights: "Auto Height Rows",
  numberOfRows: "auto",
  gridAutoRows: "auto",
  gridDirection: "row", // row | column
  gridDensity: "normal", // normal | dense
  gridJustifyContent: "start",
  gridAlignItems: "start",
  gridAlignContent: "start",
  gridJustifyItems: "start",
  gridOffsetRules: [] as string[],
};

export type LayoutState = typeof DEFAULT_LAYOUT;

function SimpleInput({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        {label}
      </label>
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-slate-700 px-2.5 placeholder-slate-400"
        />
        {suffix && (
          <>
            <div className="w-px h-4 bg-slate-200" />
            <span className="px-2.5 text-xs font-mono text-slate-400">
              {suffix}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SelectInput ─────────────────────────────────────────────────────────────

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        {label}
      </label>
      <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 transition-all">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 px-2.5 appearance-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div className="pr-2.5 pointer-events-none">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 3.5l3 3 3-3"
              stroke="#94a3b8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <label className="text-xs text-slate-500 font-medium tracking-wide">
        {label}
      </label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors ${value ? "bg-blue-500" : "bg-slate-200"}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? "left-4" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

// ─── IconButtonGroup ──────────────────────────────────────────────────────────

function IconButtonGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; icon: React.ReactNode; title: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        {label}
      </label>
      <div className="flex gap-1 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            title={opt.title}
            onClick={() => onChange(opt.value)}
            className={`w-9 h-8 rounded-md flex items-center justify-center border transition-all ${value === opt.value
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              }`}
          >
            {opt.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const I = {
  // Layout Direction
  dirRow: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="5"
        width="4"
        height="8"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="7"
        y="5"
        width="4"
        height="8"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="12"
        y="5"
        width="4"
        height="8"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M2 14.5h14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  dirRowRev: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="5"
        width="4"
        height="8"
        rx="1"
        fill="currentColor"
        opacity="0.5"
        transform="scale(-1,1) translate(-18,0)"
      />
      <rect
        x="7"
        y="5"
        width="4"
        height="8"
        rx="1"
        fill="currentColor"
        opacity="0.5"
        transform="scale(-1,1) translate(-18,0)"
      />
      <rect
        x="12"
        y="5"
        width="4"
        height="8"
        rx="1"
        fill="currentColor"
        opacity="0.5"
        transform="scale(-1,1) translate(-18,0)"
      />
      <path
        d="M16 14.5H2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  dirCol: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="5"
        y="2"
        width="8"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="5"
        y="7"
        width="8"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="5"
        y="12"
        width="8"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M3.5 2v14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  dirColRev: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="5"
        y="2"
        width="8"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.5"
        transform="scale(1,-1) translate(0,-18)"
      />
      <rect
        x="5"
        y="7"
        width="8"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.5"
        transform="scale(1,-1) translate(0,-18)"
      />
      <rect
        x="5"
        y="12"
        width="8"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.5"
        transform="scale(1,-1) translate(0,-18)"
      />
      <path
        d="M3.5 16V2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),

  // Justify Content
  jcStart: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="6"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="3"
        x2="2"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  jcCenter: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7.5"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="12"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="9"
        y1="3"
        x2="9"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  jcEnd: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="11"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="16"
        y1="3"
        x2="16"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  jcBetween: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7.5"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="13"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="3"
        x2="2"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="3"
        x2="16"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  jcAround: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3.5"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7.5"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="11.5"
        y="5"
        width="3"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="3"
        x2="2"
        y2="15"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 1"
      />
      <line
        x1="9"
        y1="3"
        x2="9"
        y2="15"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 1"
      />
      <line
        x1="16"
        y1="3"
        x2="16"
        y2="15"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 1"
      />
    </svg>
  ),
  jcEvenly: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3.5"
        y="5"
        width="2.5"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7.75"
        y="5"
        width="2.5"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="12"
        y="5"
        width="2.5"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="9"
        x2="16"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="1 2"
      />
    </svg>
  ),

  // Align Items
  aiStart: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="3"
        width="5"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="3"
        width="5"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="3"
        x2="16"
        y2="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  aiCenter: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="4"
        width="5"
        height="10"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="6"
        width="5"
        height="6"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="9"
        x2="16"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  aiEnd: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="7"
        width="5"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="10"
        width="5"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="15"
        x2="16"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  aiStretch: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="3"
        width="5"
        height="12"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="3"
        width="5"
        height="12"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="3"
        x2="2"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="3"
        x2="16"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  // Wrapping
  noWrap: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6" stroke="#94a3b8" strokeWidth="1.5" />
      <line
        x1="4.4"
        y1="4.4"
        x2="13.6"
        y2="13.6"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  wrap: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="4"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7"
        y="4"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="2"
        y="10"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M12 6h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M9 9l-2 2 2 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  wrapRev: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="10"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7"
        y="10"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="2"
        y="4"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M12 12h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M9 11l-2-2 2-2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Grid Direction
  gridRow: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="3"
        width="6"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="3"
        width="6"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="2"
        y="10"
        width="6"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="10"
        width="6"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M13 12l1.5 1.5L13 15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  gridCol: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="3"
        width="6"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="3"
        width="6"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="2"
        y="10"
        width="6"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="10"
        y="10"
        width="6"
        height="5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M5 12l1.5 1.5L5 15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Grid Density
  gridNormal: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="2"
        width="6"
        height="6"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="2"
        y="10"
        width="6"
        height="6"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="10"
        y="10"
        width="6"
        height="6"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  ),
  gridDense: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="2"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7"
        y="2"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="12"
        y="2"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="2"
        y="7"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7"
        y="7"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="12"
        y="7"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="2"
        y="12"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="7"
        y="12"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="12"
        y="12"
        width="4"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  ),

  // Align Content (7 options)
  acStart: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="3"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="3"
        y="7"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="2"
        x2="16"
        y2="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  acCenter: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="5"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="3"
        y="10"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="9"
        x2="16"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  acEnd: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="8"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="3"
        y="12"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="16"
        x2="16"
        y2="16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  acBetween: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="3"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="3"
        y="12"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="2"
        x2="16"
        y2="2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="16"
        x2="16"
        y2="16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  acAround: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="4"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="3"
        y="11"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <line
        x1="2"
        y1="2"
        x2="16"
        y2="2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 1.5"
      />
      <line
        x1="2"
        y1="9"
        x2="16"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 1.5"
      />
      <line
        x1="2"
        y1="16"
        x2="16"
        y2="16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 1.5"
      />
    </svg>
  ),
  acStretch: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="2"
        width="12"
        height="6"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="3"
        y="10"
        width="12"
        height="6"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  ),
  acEvenly: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="3"
        y="4"
        width="12"
        height="2.5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="3"
        y="8"
        width="12"
        height="2.5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="3"
        y="12"
        width="12"
        height="2.5"
        rx="0.5"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  ),
};

// ─── Flex Layout Section ──────────────────────────────────────────────────────

function FlexSection({
  s,
  u,
}: {
  s: LayoutState;
  u: (k: string, v: any) => void;
}) {
  return (
    <>
      <SizeInput
        label="Horizontal Gap"
        value={s.horizontalGap.value}
        unit={s.horizontalGap.unit}
        onChange={(v) => u("horizontalGap", v)}
      />
      <SizeInput
        label="Vertical Gap"
        value={s.verticalGap.value}
        unit={s.verticalGap.unit}
        onChange={(v) => u("verticalGap", v)}
      />

      <IconButtonGroup
        label="Layout Direction"
        value={s.layoutDirection as any}
        onChange={(v) => u("layoutDirection", v)}
        options={[
          { value: "row", icon: I.dirRow, title: "Row" },
          { value: "row-reverse", icon: I.dirRowRev, title: "Row Reverse" },
          { value: "column", icon: I.dirCol, title: "Column" },
          {
            value: "column-reverse",
            icon: I.dirColRev,
            title: "Column Reverse",
          },
        ]}
      />

      <IconButtonGroup
        label="Justify Content"
        value={s.justifyContent as any}
        onChange={(v) => u("justifyContent", v)}
        options={[
          { value: "flex-start", icon: I.jcStart, title: "Start" },
          { value: "center", icon: I.jcCenter, title: "Center" },
          { value: "flex-end", icon: I.jcEnd, title: "End" },
          { value: "space-between", icon: I.jcBetween, title: "Space Between" },
          { value: "space-around", icon: I.jcAround, title: "Space Around" },
          { value: "space-evenly", icon: I.jcEvenly, title: "Space Evenly" },
        ]}
      />

      <IconButtonGroup
        label="Align Items"
        value={s.alignItems as any}
        onChange={(v) => u("alignItems", v)}
        options={[
          { value: "flex-start", icon: I.aiStart, title: "Start" },
          { value: "center", icon: I.aiCenter, title: "Center" },
          { value: "flex-end", icon: I.aiEnd, title: "End" },
          { value: "stretch", icon: I.aiStretch, title: "Stretch" },
        ]}
      />

      <IconButtonGroup
        label="Layout Wrapping"
        value={s.layoutWrapping as any}
        onChange={(v) => u("layoutWrapping", v)}
        options={[
          { value: "nowrap", icon: I.noWrap, title: "No Wrap" },
          { value: "wrap", icon: I.wrap, title: "Wrap" },
          { value: "wrap-reverse", icon: I.wrapRev, title: "Wrap Reverse" },
        ]}
      />

      <IconButtonGroup
        label="Align Content"
        value={s.alignContent as any}
        onChange={(v) => u("alignContent", v)}
        options={[
          { value: "flex-start", icon: I.acStart, title: "Start" },
          { value: "center", icon: I.acCenter, title: "Center" },
          { value: "flex-end", icon: I.acEnd, title: "End" },
          { value: "space-between", icon: I.acBetween, title: "Space Between" },
          { value: "space-around", icon: I.acAround, title: "Space Around" },
          { value: "stretch", icon: I.acStretch, title: "Stretch" },
          { value: "space-evenly", icon: I.acEvenly, title: "Space Evenly" },
        ]}
      />
    </>
  );
}

// ─── Grid Layout Section ──────────────────────────────────────────────────────

function GridSection({
  s,
  u,
}: {
  s: LayoutState;
  u: (k: string, v: any) => void;
}) {
  return (
    <>
      <SizeInput
        label="Horizontal Gap"
        value={s.horizontalGap.value}
        unit={s.horizontalGap.unit}
        onChange={(v) => u("horizontalGap", v)}
      />
      <SizeInput
        label="Vertical Gap"
        value={s.verticalGap.value}
        unit={s.verticalGap.unit}
        onChange={(v) => u("verticalGap", v)}
      />

      <SelectInput
        label="Column Widths"
        value={s.columnWidths}
        options={["Equal Width Columns", "Custom"]}
        onChange={(v) => u("columnWidths", v)}
      />
      <SimpleInput
        label="Number Of Columns"
        value={s.numberOfColumns}
        onChange={(v) => u("numberOfColumns", v)}
      />
      <Toggle
        label="Collapse Empty Columns"
        value={s.collapseEmptyColumns}
        onChange={(v) => u("collapseEmptyColumns", v)}
      />
      <SimpleInput
        label="Grid Auto Columns"
        value={s.gridAutoColumns}
        onChange={(v) => u("gridAutoColumns", v)}
      />
      <SelectInput
        label="Row Heights"
        value={s.rowHeights}
        options={["Auto Height Rows", "Fixed", "Custom"]}
        onChange={(v) => u("rowHeights", v)}
      />
      <SimpleInput
        label="Number Of Rows"
        value={s.numberOfRows}
        onChange={(v) => u("numberOfRows", v)}
      />
      <SimpleInput
        label="Grid Auto Rows"
        value={s.gridAutoRows}
        onChange={(v) => u("gridAutoRows", v)}
      />

      <IconButtonGroup
        label="Grid Direction"
        value={s.gridDirection as any}
        onChange={(v) => u("gridDirection", v)}
        options={[
          { value: "row", icon: I.gridRow, title: "Row" },
          { value: "column", icon: I.gridCol, title: "Column" },
        ]}
      />

      <IconButtonGroup
        label="Grid Density"
        value={s.gridDensity as any}
        onChange={(v) => u("gridDensity", v)}
        options={[
          { value: "normal", icon: I.gridNormal, title: "Normal" },
          { value: "dense", icon: I.gridDense, title: "Dense" },
        ]}
      />

      <IconButtonGroup
        label="Justify Content"
        value={s.gridJustifyContent as any}
        onChange={(v) => u("gridJustifyContent", v)}
        options={[
          { value: "start", icon: I.jcStart, title: "Start" },
          { value: "center", icon: I.jcCenter, title: "Center" },
          { value: "end", icon: I.jcEnd, title: "End" },
          { value: "space-between", icon: I.jcBetween, title: "Space Between" },
          { value: "space-around", icon: I.jcAround, title: "Space Around" },
          { value: "space-evenly", icon: I.jcEvenly, title: "Space Evenly" },
        ]}
      />

      <IconButtonGroup
        label="Align Items"
        value={s.gridAlignItems as any}
        onChange={(v) => u("gridAlignItems", v)}
        options={[
          { value: "start", icon: I.aiStart, title: "Start" },
          { value: "center", icon: I.aiCenter, title: "Center" },
          { value: "end", icon: I.aiEnd, title: "End" },
          { value: "stretch", icon: I.aiStretch, title: "Stretch" },
        ]}
      />

      <IconButtonGroup
        label="Align Content"
        value={s.gridAlignContent as any}
        onChange={(v) => u("gridAlignContent", v)}
        options={[
          { value: "start", icon: I.acStart, title: "Start" },
          { value: "center", icon: I.acCenter, title: "Center" },
          { value: "end", icon: I.acEnd, title: "End" },
          { value: "space-between", icon: I.acBetween, title: "Space Between" },
          { value: "space-around", icon: I.acAround, title: "Space Around" },
          { value: "stretch", icon: I.acStretch, title: "Stretch" },
          { value: "space-evenly", icon: I.acEvenly, title: "Space Evenly" },
        ]}
      />

      <IconButtonGroup
        label="Justify Items"
        value={s.gridJustifyItems as any}
        onChange={(v) => u("gridJustifyItems", v)}
        options={[
          { value: "start", icon: I.jcStart, title: "Start" },
          { value: "center", icon: I.jcCenter, title: "Center" },
          { value: "end", icon: I.jcEnd, title: "End" },
          { value: "stretch", icon: I.aiStretch, title: "Stretch" },
        ]}
      />

      {/* Grid Offset Rules */}
      <div className="mb-3">
        <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
          Grid Offset Rules
        </label>
        <button
          onClick={() => u("gridOffsetRules", [...s.gridOffsetRules, ""])}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 2v8M2 6h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Add Grid Offset Rule
        </button>
        {s.gridOffsetRules.map((rule, i) => (
          <div key={i} className="flex items-center gap-2 mt-2">
            <input
              value={rule}
              onChange={(e) => {
                const updated = [...s.gridOffsetRules];
                updated[i] = e.target.value;
                u("gridOffsetRules", updated);
              }}
              placeholder="e.g. col-start: 2"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg h-8 text-xs font-mono px-2.5 outline-none focus:border-blue-400"
            />
            <button
              onClick={() =>
                u(
                  "gridOffsetRules",
                  s.gridOffsetRules.filter((_, j) => j !== i),
                )
              }
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 2l8 8M10 2l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── LayoutPanel ──────────────────────────────────────────────────────────────

export function LayoutPanel({
  updateField,
  layout,
}: {
  updateField: (key: string, val: any) => void;
  layout: LayoutState | undefined;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const s = layout ?? DEFAULT_LAYOUT;

  return (
    <div className="bg-white">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-2 transition-colors"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          className="text-blue-600 flex-shrink-0 transition-transform duration-200"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-semibold text-blue-600 tracking-wide">
          Layout
        </span>
      </button>

      {!collapsed && (
        <div className="pb-4 border-t border-slate-100">
          <div className="pt-3">
            <SelectInput
              label="Layout Style"
              value={s.layoutStyle}
              options={LAYOUT_STYLES}
              onChange={(v) => updateField("layoutStyle", v)}
            />

            <div className="grid grid-cols-2 gap-3">
              <SizeInput
                label="Width"
                value={s.width.value}
                unit={s.width.unit}
                onChange={(v) => updateField("width", v)}
              />
              <SizeInput
                label="Height"
                value={s.height.value}
                unit={s.height.unit}
                onChange={(v) => updateField("height", v)}
              />
            </div>

            {s.layoutStyle === "Flex" && <FlexSection s={s} u={updateField} />}
            {s.layoutStyle === "Grid" && <GridSection s={s} u={updateField} />}

            <Toggle
              label="Show Inner Shadow"
              value={s.showInnerShadow}
              onChange={(v) => updateField("showInnerShadow", v)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

type SizeVal = { value: string; unit: string };

export function generateLayoutCSS(layout?: LayoutState): React.CSSProperties {
  if (!layout) return {};

  const css: React.CSSProperties = {};

  const getSize = (field?: SizeVal) => {
    if (!field) return undefined;
    const { value, unit } = field;

    if (!value || value === "") return undefined;

    if (["auto", "inherit", "unset"].includes(unit)) {
      return unit;
    }

    return `${value}${unit}`;
  };

  const horizontalGap = getSize(layout.horizontalGap);
  const verticalGap = getSize(layout.verticalGap);
  const width = getSize(layout.width);
  const height = getSize(layout.height);

  // ─────────────────────────────
  // BLOCK
  // ─────────────────────────────
  if (layout.layoutStyle === "Block") {
    css.display = "block";
    if (width) css.width = width;
    if (height) css.height = height;
    return css;
  }

  // ─────────────────────────────
  // FLEX
  // ─────────────────────────────
  if (layout.layoutStyle === "Flex") {
    css.display = "flex";

    css.flexDirection = layout.layoutDirection as any;
    css.justifyContent = layout.justifyContent as any;
    css.alignItems = layout.alignItems as any;
    css.flexWrap = layout.layoutWrapping as any;
    css.alignContent = layout.alignContent as any;

    if (horizontalGap) css.columnGap = horizontalGap;
    if (verticalGap) css.rowGap = verticalGap;
    if (width) css.width = width;
    if (height) css.height = height;

    return css;
  }

  // ─────────────────────────────
  // GRID
  // ─────────────────────────────
  if (layout.layoutStyle === "Grid") {
    css.display = "grid";

    if (horizontalGap) css.columnGap = horizontalGap;
    if (verticalGap) css.rowGap = verticalGap;
    if (width) css.width = width;
    if (height) css.height = height;

    // Columns
    if (layout.columnWidths === "Equal Width Columns") {
      const cols = layout.numberOfColumns || "1";
      css.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    }

    // Rows
    if (layout.numberOfRows && layout.numberOfRows !== "auto") {
      css.gridTemplateRows = `repeat(${layout.numberOfRows}, 1fr)`;
    }

    css.gridAutoColumns = layout.gridAutoColumns as any;
    css.gridAutoRows = layout.gridAutoRows as any;

    css.gridAutoFlow =
      layout.gridDirection === "column"
        ? layout.gridDensity === "dense"
          ? "column dense"
          : "column"
        : layout.gridDensity === "dense"
          ? "row dense"
          : "row";

    css.justifyContent = layout.gridJustifyContent as any;
    css.alignItems = layout.gridAlignItems as any;
    css.alignContent = layout.gridAlignContent as any;
    css.justifyItems = layout.gridJustifyItems as any;

    return css;
  }

  return css;
}
