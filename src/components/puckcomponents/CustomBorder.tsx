import { LinkIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SizeInput } from "./CustomSIzing";

// ─── Constants ────────────────────────────────────────────────────────────────

const UNIT_GROUPS = [
  ["px", "%", "em", "rem", "vw", "vh", "vmin", "vmax"],
  ["calc", "min", "max", "clamp"],
  ["auto", "inherit", "unset", "css var"],
];

const BORDER_STYLES = ["Solid", "Dashed", "Dotted", "Double", "None"];

const BORDER_SIDES = ["all", "top", "right", "bottom", "left"] as const;
type BorderSide = (typeof BORDER_SIDES)[number];

type SizeVal = { value: string; unit: string };

export const DEFAULT_BORDER = {
  // Border Radius (4 corners)
  radiusTopLeft: { value: "10", unit: "px" },
  radiusTopRight: { value: "10", unit: "px" },
  radiusBottomLeft: { value: "0", unit: "px" },
  radiusBottomRight: { value: "0", unit: "px" },

  // Per-side border settings
  activeSide: "all" as BorderSide,
  allWidth: { value: "0", unit: "px" },
  allColor: "",
  allStyle: "Solid",
  topWidth: { value: "0", unit: "px" },
  topColor: "",
  topStyle: "Solid",
  rightWidth: { value: "0", unit: "px" },
  rightColor: "",
  rightStyle: "Solid",
  bottomWidth: { value: "0", unit: "px" },
  bottomColor: "",
  bottomStyle: "Solid",
  leftWidth: { value: "0", unit: "px" },
  leftColor: "",
  leftStyle: "Solid",
};

export type BorderState = typeof DEFAULT_BORDER;

// ─── Border Side Icons ────────────────────────────────────────────────────────

function BorderSideIcon({
  side,
  active,
}: {
  side: BorderSide;
  active: boolean;
}) {
  const color = active ? "#3b82f6" : "#94a3b8";
  const stroke = 1.5;
  const activeStroke = 2.5;

  // Box outline + highlighted side
  const box = { x: 2, y: 2, w: 18, h: 14 };

  const sides = {
    top: { x1: box.x, y1: box.y, x2: box.x + box.w, y2: box.y },
    bottom: {
      x1: box.x,
      y1: box.y + box.h,
      x2: box.x + box.w,
      y2: box.y + box.h,
    },
    left: { x1: box.x, y1: box.y, x2: box.x, y2: box.y + box.h },
    right: {
      x1: box.x + box.w,
      y1: box.y,
      x2: box.x + box.w,
      y2: box.y + box.h,
    },
  };

  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      {/* Base box - all sides dim */}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx="1"
        stroke={side === "all" ? color : "#cbd5e1"}
        strokeWidth={side === "all" ? activeStroke : stroke}
        fill="none"
      />

      {/* Highlighted side overlay */}
      {side !== "all" && (
        <line
          x1={sides[side].x1}
          y1={sides[side].y1}
          x2={sides[side].x2}
          y2={sides[side].y2}
          stroke={color}
          strokeWidth={activeStroke}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

// ─── Color Input ──────────────────────────────────────────────────────────────

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const colorRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        {label}
      </label>
      <div
        className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all cursor-pointer"
        onClick={() => colorRef.current?.click()}
      >
        {/* Hidden native color picker */}
        <input
          ref={colorRef}
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute opacity-0 w-0 h-0"
        />

        {/* Pencil icon */}
        <div className="pl-2.5 pr-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M8.5 1.5a1.5 1.5 0 0 1 2.121 2.121L9.5 4.742 7.258 2.5 8.5 1.5ZM6.5 3.258 1 8.758V11h2.242l5.5-5.5L6.5 3.258Z"
              fill="#94a3b8"
            />
          </svg>
        </div>

        {value ? (
          <div className="flex items-center gap-1.5 flex-1">
            <div
              className="w-4 h-4 rounded border border-slate-200 flex-shrink-0"
              style={{ backgroundColor: value }}
            />
            <span className="text-xs font-mono text-slate-700">{value}</span>
          </div>
        ) : (
          <span className="flex-1 text-xs text-slate-400">Pick a Color</span>
        )}

        <div className="w-px h-4 bg-slate-200 mr-2" />
        <span className="pr-2.5 text-xs text-slate-400">—</span>
      </div>
    </div>
  );
}

// ─── Style Select ─────────────────────────────────────────────────────────────

function StyleSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
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
          {BORDER_STYLES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {/* Chevron */}
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

// ─── Border Preview ───────────────────────────────────────────────────────────

function BorderPreview({
  b,
  side,
  handleLinked,
}: {
  b: BorderState;
  side: BorderSide;
  handleLinked: () => void;
}) {
  function getSideStyle(s: "top" | "right" | "bottom" | "left") {
    const active = side === "all" || side === s;
    const w = b[`${s}Width` as keyof BorderState] as SizeVal;
    const c = b[`${s}Color` as keyof BorderState] as string;
    const st = b[`${s}Style` as keyof BorderState] as string;
    if (!active || !w.value || w.value === "0") return "1px dashed #e2e8f0";
    return `${w.value}${w.unit} ${st.toLowerCase()} ${c || "#3b82f6"}`;
  }

  const radius = `${b.radiusTopLeft.value}${b.radiusTopLeft.unit} ${b.radiusTopRight.value}${b.radiusTopRight.unit} ${b.radiusBottomRight.value}${b.radiusBottomRight.unit} ${b.radiusBottomLeft.value}${b.radiusBottomLeft.unit}`;

  return (
    <div className="my-3 flex items-center justify-center bg-slate-50 rounded-lg p-4 h-28">
      <div
        className="w-full h-full flex items-center justify-center relative"
        style={{
          borderTop: getSideStyle("top"),
          borderRight: getSideStyle("right"),
          borderBottom: getSideStyle("bottom"),
          borderLeft: getSideStyle("left"),
          borderRadius: radius,
          background: "white",
        }}
      >
        {/* Diagonal cross lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <line
            x1="100%"
            y1="0"
            x2="0"
            y2="100%"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        </svg>

        <button
          onClick={handleLinked}
          className=" rounded hover:bg-slate-100 z-100 transition-colors"
        >
          <LinkIcon />
        </button>
      </div>
    </div>
  );
}

// ─── BorderPanel ──────────────────────────────────────────────────────────────

export function BorderPanel({
  updateField,
  border,
  onChange,
}: {
  updateField: (key: string, val: any) => void;
  border: BorderState | undefined;
  onChange: any;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const b = border ?? DEFAULT_BORDER;

  const [isLinked, setIsLinked] = useState(false);

  const side = b.activeSide;
  const sideLabel = side.charAt(0).toUpperCase() + side.slice(1);

  // Helpers for per-side fields
  const widthKey = side === "all" ? "allWidth" : `${side}Width`;
  const colorKey = side === "all" ? "allColor" : `${side}Color`;
  const styleKey = side === "all" ? "allStyle" : `${side}Style`;

  const handleLinked = () => {
    setIsLinked((prev) => !prev);
  };

  const handleChangeifLinked = (key: string, value: any) => {
    if (!isLinked) {
      updateField(key, value);
    } else {
      const cloned = structuredClone(border);
      const final = {
        radiusTopLeft: value,
        radiusTopRight: value,
        radiusBottomLeft: value,
        radiusBottomRight: value,
      };
      onChange({ ...cloned, ...final });
    }
  };

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
          Border
        </span>
      </button>

      {!collapsed && (
        <div className="pb-4 border-t border-slate-100">
          <div className="pt-3 space-y-1">
            {/* ── Border Radius ── */}
            <p className="text-xs font-medium text-slate-600 mb-2">
              Border Radius
            </p>

            {/* Top-left + Top-right */}
            <div className="flex justify-between gap-2 mb-1">
              <SizeInput
                label=""
                value={b.radiusTopLeft.value}
                unit={b.radiusTopLeft.unit}
                onChange={(v) => {
                  handleChangeifLinked("radiusTopLeft", v);
                }}
              />
              <SizeInput
                label=""
                value={b.radiusTopRight.value}
                unit={b.radiusTopRight.unit}
                onChange={(v) => handleChangeifLinked("radiusTopRight", v)}
              />
            </div>

            {/* Preview */}
            <BorderPreview b={b} side={side} handleLinked={handleLinked} />

            {/* Bottom-left + Bottom-right */}
            <div className="flex justify-between gap-2 mt-1">
              <SizeInput
                label=""
                value={b.radiusBottomLeft.value}
                unit={b.radiusBottomLeft.unit}
                onChange={(v) => handleChangeifLinked("radiusBottomLeft", v)}
              />
              <SizeInput
                label=""
                value={b.radiusBottomRight.value}
                unit={b.radiusBottomRight.unit}
                onChange={(v) => handleChangeifLinked("radiusBottomRight", v)}
              />
            </div>

            {/* ── Border Styles ── */}
            <div className="pt-3">
              <p className="text-xs font-medium text-slate-600 mb-2">
                Border Styles
              </p>
              <div className="flex gap-1">
                {BORDER_SIDES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateField("activeSide", s)}
                    className={`flex-1 flex items-center justify-center h-8 rounded-md border transition-all ${
                      side === s
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                    title={s.charAt(0).toUpperCase() + s.slice(1)}
                  >
                    <BorderSideIcon side={s} active={side === s} />
                  </button>
                ))}
              </div>

              {/* Side preview strip */}
              <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-200"
                  style={{
                    width: `${(BORDER_SIDES.indexOf(side) + 1) * (100 / BORDER_SIDES.length)}%`,
                    marginLeft: `${BORDER_SIDES.indexOf(side) * (100 / BORDER_SIDES.length)}%`,
                    width: `${100 / BORDER_SIDES.length}%`,
                  }}
                />
              </div>
            </div>

            {/* ── Per-side controls ── */}
            <div className="pt-3 space-y-0">
              <SizeInput
                label={`${sideLabel} Border Width`}
                value={(b[widthKey as keyof BorderState] as SizeVal).value}
                unit={(b[widthKey as keyof BorderState] as SizeVal).unit}
                onChange={(v) => updateField(widthKey, v)}
              />
              <ColorInput
                label={`${sideLabel} Border Color`}
                value={b[colorKey as keyof BorderState] as string}
                onChange={(v) => updateField(colorKey, v)}
              />
              <StyleSelect
                label={`${sideLabel} Border Style`}
                value={b[styleKey as keyof BorderState] as string}
                onChange={(v) => updateField(styleKey, v)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type SizeField = {
  value: string | number;
  unit: string;
};

type BorderConfig = {
  radiusTopLeft?: SizeField;
  radiusTopRight?: SizeField;
  radiusBottomLeft?: SizeField;
  radiusBottomRight?: SizeField;

  activeSide?: "all" | "individual";

  allWidth?: SizeField;
  allColor?: string;
  allStyle?: string;

  topWidth?: SizeField;
  topColor?: string;
  topStyle?: string;

  rightWidth?: SizeField;
  rightColor?: string;
  rightStyle?: string;

  bottomWidth?: SizeField;
  bottomColor?: string;
  bottomStyle?: string;

  leftWidth?: SizeField;
  leftColor?: string;
  leftStyle?: string;
};

export function generateBorderCSS(config: BorderConfig): React.CSSProperties {
  const css: React.CSSProperties = {};

  const getSize = (field?: SizeField) => {
    if (!field) return undefined;
    const { value, unit } = field;
    if (!value || value === "0") return undefined;
    return `${value}${unit}`;
  };

  // -----------------------
  // Border Radius
  // -----------------------
  const tl = getSize(config.radiusTopLeft);
  const tr = getSize(config.radiusTopRight);
  const br = getSize(config.radiusBottomRight);
  const bl = getSize(config.radiusBottomLeft);

  if (tl || tr || br || bl) {
    css.borderRadius = `${tl || 0} ${tr || 0} ${br || 0} ${bl || 0}`;
  }

  const activeSide = config.activeSide;

  // -----------------------
  // Border - All
  // -----------------------
  if (activeSide == "all") {
    const width = getSize(config.allWidth);
    const color = config.allColor;
    const style = config.allStyle?.toLowerCase();

    if (width) {
      css.borderWidth = width;
      css.borderStyle = style || "solid";
      if (color) css.borderColor = color;
    }
  } else {
    const applySide = (activeSide: string) => {
      const width = getSize(
        config[
          `${activeSide.toLowerCase()}Width` as keyof BorderConfig
        ] as SizeField,
      );
      const color = config[
        `${activeSide.toLowerCase()}Color` as keyof BorderConfig
      ] as string;
      const style = (
        config[
          `${activeSide.toLowerCase()}Style` as keyof BorderConfig
        ] as string
      )?.toLowerCase();

      if (width) {
        css[`border${activeSide}Width` as keyof React.CSSProperties] = width;
        css[`border${activeSide}Style` as keyof React.CSSProperties] =
          style || "solid";
        if (color) {
          css[`border${activeSide}Color` as keyof React.CSSProperties] = color;
        }
      }
    };

    applySide("Top");
    applySide("Right");
    applySide("Bottom");
    applySide("Left");
  }

  return css;
}
