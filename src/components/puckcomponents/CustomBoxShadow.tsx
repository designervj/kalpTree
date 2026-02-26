import { useState, useRef, useEffect } from "react";
import { SizeInput } from "./CustomSIzing";

// ─── Constants ────────────────────────────────────────────────────────────────

const UNIT_GROUPS = [
  ["px", "%", "em", "rem", "vw", "vh", "vmin", "vmax"],
  ["calc", "min", "max", "clamp"],
  ["auto", "inherit", "unset", "css var"],
];

const SHADOW_POSITION_OPTIONS = ["Outer Shadow", "Inner Shadow"];

type SizeVal = { value: string; unit: string };

// 8 preset shadow styles (index 0 = none)
const SHADOW_PRESETS = [
  null, // none
  { x: 0, y: 2, blur: 4, spread: 0, opacity: 20 },
  { x: 0, y: 4, blur: 8, spread: 0, opacity: 20 },
  { x: 0, y: 6, blur: 12, spread: 0, opacity: 20 },
  { x: -2, y: 2, blur: 6, spread: 0, opacity: 20 },
  { x: -2, y: 4, blur: 10, spread: 0, opacity: 20 },
  { x: 0, y: 0, blur: 18, spread: 0, opacity: 30 }, // "glow" — the active one
  { x: 2, y: 4, blur: 8, spread: 0, opacity: 20 },
];

export const DEFAULT_BOX_SHADOW = {
  presetIndex: 0,
  horizontal: { value: "0", unit: "px" },
  vertical: { value: "0", unit: "px" },
  blur: { value: "18", unit: "px" },
  spread: { value: "0", unit: "px" },
  color: "#000000",
  colorOpacity: "30",
  position: "Inner Shadow",
};

export type BoxShadowState = typeof DEFAULT_BOX_SHADOW;

function ShadowPresetCard({
  index,
  active,
  onClick,
  isInner,
}: {
  index: number;
  active: boolean;
  onClick: any;
  isInner: boolean;
}) {
  const preset = SHADOW_PRESETS[index];

  // Build shadow string for preview
  const shadowStr = preset
    ? `${isInner ? "inset " : ""}${preset.x}px ${preset.y}px ${preset.blur}px ${preset.spread}px rgba(0,0,0,${preset.opacity / 100})`
    : "none";

  return (
    <button
      onClick={() => onClick(index)}
      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all bg-white ${
        active ? "border-blue-500" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {index === 0 ? (
        // None — crossed circle
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="#94a3b8" strokeWidth="1.5" />
          <line
            x1="4.4"
            y1="4.4"
            x2="15.6"
            y2="15.6"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // Box with shadow preview
        <div
          className="w-7 h-7 rounded bg-white border border-slate-200"
          style={{ boxShadow: shadowStr }}
        />
      )}
    </button>
  );
}

// ─── Color + Opacity Input ────────────────────────────────────────────────────

function ColorOpacityInput({
  label,
  color,
  opacity,
  onColorChange,
  onOpacityChange,
}: {
  label: string;
  color: string;
  opacity: string;
  onColorChange: (v: string) => void;
  onOpacityChange: (v: string) => void;
}) {
  const colorRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* Color swatch + hex */}
        <div
          className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all cursor-pointer"
          onClick={() => colorRef.current?.click()}
        >
          <input
            ref={colorRef}
            type="color"
            value={color || "#000000"}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute opacity-0 w-0 h-0"
          />
          <div
            className="w-5 h-5 rounded ml-2 mr-2 border border-slate-200 flex-shrink-0"
            style={{ backgroundColor: color || "#000000" }}
          />
          <span className="text-xs font-mono text-slate-700 flex-1">
            {(color || "#000000").replace("#", "")}
          </span>
          <div className="w-px h-4 bg-slate-200 mr-2" />
          <span className="pr-2.5 text-xs text-slate-400">—</span>
        </div>

        {/* Opacity */}
        <div
          className="flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
          style={{ width: 72 }}
        >
          <input
            type="text"
            value={opacity}
            onChange={(e) => onOpacityChange(e.target.value)}
            className="flex-1 w-8 bg-transparent border-none outline-none text-xs font-mono text-slate-700 px-2.5 placeholder-slate-400"
            placeholder="100"
          />
          <div className="w-px h-4 bg-slate-200" />
          <span className="px-2 text-xs font-mono text-slate-400">%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Position Select ──────────────────────────────────────────────────────────

function PositionSelect({
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
          {SHADOW_POSITION_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
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

// ─── BoxShadowPanel ───────────────────────────────────────────────────────────

export function BoxShadowPanel({
  updateField,
  shadow,
  onChange,
}: {
  updateField: (key: string, val: any) => void;
  shadow: BoxShadowState | undefined;
  onChange: any;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const s = shadow;
  const isInner = s!.position === "Inner Shadow";

  const selectPreset = (index: number) => {
    const preset = SHADOW_PRESETS[index];
    if (preset) {
      const final = {
        horizontal: { value: String(preset.x), unit: "px" },
        vertical: { value: String(preset.y), unit: "px" },
        blur: { value: String(preset.blur), unit: "px" },
        spread: { value: String(preset.spread), unit: "px" },
        colorOpacity: String(preset.opacity),
        presetIndex: index,
      };
      onChange({ ...shadow, ...final });
    } else {
      const final = {
        horizontal: { value: "0", unit: "px" },
        vertical: { value: "0", unit: "px" },
        blur: { value: "0", unit: "px" },
        spread: { value: "0", unit: "px" },
        presetIndex: index,
      };
      onChange({ ...shadow, ...final });
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
          Box Shadow
        </span>
      </button>

      {!collapsed && (
        <div className="pb-4 border-t border-slate-100">
          <div className="pt-3 space-y-3">
            {/* ── Preset Grid ── */}
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">
                Box Shadow
              </p>
              <div className="grid grid-cols-4 gap-2">
                {SHADOW_PRESETS.map((_, i) => (
                  <ShadowPresetCard
                    key={i}
                    index={i}
                    active={s!.presetIndex === i}
                    onClick={selectPreset}
                    isInner={isInner}
                  />
                ))}
              </div>
            </div>

            {/* ── Controls (hidden when preset is 0/none) ── */}
            {s!.presetIndex !== 0 && (
              <div className="pt-1 space-y-0">
                <SizeInput
                  label="Box Shadow Horizontal Position"
                  value={s!.horizontal.value}
                  unit={s!.horizontal.unit}
                  onChange={(v) => updateField("horizontal", v)}
                />
                <SizeInput
                  label="Box Shadow Vertical Position"
                  value={s!.vertical.value}
                  unit={s!.vertical.unit}
                  onChange={(v) => updateField("vertical", v)}
                />
                <SizeInput
                  label="Box Shadow Blur Strength"
                  value={s!.blur.value}
                  unit={s!.blur.unit}
                  onChange={(v) => updateField("blur", v)}
                />
                <SizeInput
                  label="Box Shadow Spread Strength"
                  value={s!.spread.value}
                  unit={s!.spread.unit}
                  onChange={(v) => updateField("spread", v)}
                />
                <ColorOpacityInput
                  label="Shadow Color"
                  color={s!.color}
                  opacity={s!.colorOpacity}
                  onColorChange={(v) => updateField("color", v)}
                  onOpacityChange={(v) => updateField("colorOpacity", v)}
                />
                <PositionSelect
                  label="Box Shadow Position"
                  value={s!.position}
                  onChange={(v) => updateField("position", v)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export function generateBoxShadowCSS(
  shadow?: BoxShadowState
): React.CSSProperties {
  if (!shadow || shadow.presetIndex === 0) {
    return { boxShadow: "none" };
  }

  const getSize = (field?: SizeVal) => {
    if (!field) return "0px";
    const { value, unit } = field;
    if (value === "" || value === null || value === undefined) {
      return "0px";
    }
    return `${value}${unit}`;
  };

  const h = getSize(shadow.horizontal);
  const v = getSize(shadow.vertical);
  const blur = getSize(shadow.blur);
  const spread = getSize(shadow.spread);

  const hex = shadow.color || "#000000";

  // Convert hex → rgb
  const hexToRgb = (hex: string) => {
    const cleaned = hex.replace("#", "");
    const bigint = parseInt(cleaned, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const { r, g, b } = hexToRgb(hex);

  const opacity =
    shadow.colorOpacity && !isNaN(Number(shadow.colorOpacity))
      ? Number(shadow.colorOpacity) / 100
      : 1;

  const inset = shadow.position === "Inner Shadow" ? "inset " : "";

  const boxShadowValue = `${inset}${h} ${v} ${blur} ${spread} rgba(${r}, ${g}, ${b}, ${opacity})`;

  return {
    boxShadow: boxShadowValue,
  };
}