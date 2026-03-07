"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, LayoutGrid, List, Plus, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { transformRawToGlobalStyleModel } from "../style-editor/GlobalStyelModel";

/* ─────────────────────────────────────────────
   COLOUR CONVERSION HELPERS
───────────────────────────────────────────── */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").padEnd(6, "0");
  const n = parseInt(clean.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  );
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [
    Math.round(f(5) * 255),
    Math.round(f(3) * 255),
    Math.round(f(1) * 255),
  ];
}

function clamp(v: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, v));
}

/* ─────────────────────────────────────────────
   GLOBAL COLORS (local storage)
───────────────────────────────────────────── */
const STORAGE_KEY = "kalptree_global_colors";
const DEFAULT_GLOBAL = [
  "#2563eb",
  "#f97316",
  "#334155",
  "#64748b",
  "#0f172a",
  "#7c3aed",
  "#000000",
  "#ea580c",
];

function loadGlobal(): string[] {
  try {
    return (
      JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") ?? DEFAULT_GLOBAL
    );
  } catch {
    return DEFAULT_GLOBAL;
  }
}
function saveGlobal(colors: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch {}
}

/* ─────────────────────────────────────────────
   GRADIENT CANVAS
───────────────────────────────────────────── */
function GradientCanvas({
  hue,
  sx,
  sy,
  onChange,
}: {
  hue: number;
  sx: number;
  sy: number;
  onChange: (s: number, v: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { width: w, height: h } = canvas;
    // base hue fill
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, w, h);
    // white left→right gradient
    const wg = ctx.createLinearGradient(0, 0, w, 0);
    wg.addColorStop(0, "rgba(255,255,255,1)");
    wg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, w, h);
    // black top→bottom gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "rgba(0,0,0,0)");
    bg.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }, [hue]);

  useEffect(() => {
    draw();
  }, [draw]);

  const pick = (e: { clientX: number; clientY: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const s = clamp((e.clientX - rect.left) / rect.width);
    const v = clamp(1 - (e.clientY - rect.top) / rect.height);
    onChange(s, v);
  };

  return (
    <div className="relative select-none" style={{ height: 160 }}>
      <canvas
        ref={canvasRef}
        width={300}
        height={160}
        className="w-full h-full rounded-t cursor-crosshair"
        onMouseDown={(e) => {
          dragging.current = true;
          pick(e);
        }}
        onMouseMove={(e) => {
          if (dragging.current) pick(e);
        }}
        onMouseUp={() => {
          dragging.current = false;
        }}
        onMouseLeave={() => {
          dragging.current = false;
        }}
      />
      {/* cursor circle */}
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none"
        style={{
          left: `calc(${sx * 100}% - 8px)`,
          top: `calc(${(1 - sy) * 100}% - 8px)`,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   RANGE SLIDER — reusable
───────────────────────────────────────────── */
function RangeSlider({
  value,
  onChange,
  bg,
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  bg: string;
  className?: string;
}) {
  return (
    <div
      className={`relative h-3 rounded-full overflow-hidden ${className}`}
      style={{ background: bg }}
    >
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow"
        style={{
          left: `calc(${value * 100}% - 6px)`,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COLOR PICKER
───────────────────────────────────────────── */
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({
  color,
  onChange,
  className = "",
}: ColorPickerProps) {
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const data = transformRawToGlobalStyleModel(
    currentBusiness?.website?.globalStyle || "",
  );

  // ── parse incoming color ──
  const parseColor = (c: string): [number, number, number, number] => {
    if (c.startsWith("rgba")) {
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (m) return [+m[1], +m[2], +m[3], m[4] !== undefined ? +m[4] : 1];
    }
    try {
      const [r, g, b] = hexToRgb(c);
      return [r, g, b, 1];
    } catch {
      return [0, 0, 0, 1];
    }
  };

  const [r0, g0, b0, a0] = parseColor(color);
  const [h0, s0, v0] = rgbToHsv(r0, g0, b0);

  const [hue, setHue] = useState(h0);
  const [sat, setSat] = useState(s0);
  const [val, setVal] = useState(v0);
  const [alpha, setAlpha] = useState(a0);
  const [hex, setHex] = useState(
    color.startsWith("#")
      ? color.replace("#", "")
      : rgbToHex(r0, g0, b0).replace("#", ""),
  );
  const [globalColors, setGlobalColors] = useState<string[]>(DEFAULT_GLOBAL);
  const [showFilters, setShowFilters] = useState(false);
  const [globalView, setGlobalView] = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState(false);

  // Load global colors on mount
  useEffect(() => {
    if (currentBusiness) {
      setGlobalColors([...new Set([...Object.values(data.brand)])]);
    }
  }, [currentBusiness]);

  // Sync when external color prop changes
  useEffect(() => {
    const [r, g, b, a] = parseColor(color);
    const [h, s, v] = rgbToHsv(r, g, b);
    setHue(h);
    setSat(s);
    setVal(v);
    setAlpha(a);
    setHex(rgbToHex(r, g, b).replace("#", ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

   const emit = useCallback(
    (h: number, s: number, v: number, a: number) => {
      const [r, g, b] = hsvToRgb(h, s, v);
      const hexStr = rgbToHex(r, g, b);
      setHex(hexStr.replace("#", ""));
      if (a < 1) onChange(`rgba(${r},${g},${b},${a.toFixed(2)})`);
      else onChange(hexStr);
    },
    [onChange],
  );

  const handleGradient = (s: number, v: number) => {
    setSat(s);
    setVal(v);
    emit(hue, s, v, alpha);
  };
  const handleHue = (v: number) => {
    const h = v * 360;
    setHue(h);
    emit(h, sat, val, alpha);
  };
  const handleAlpha = (a: number) => {
    setAlpha(a);
    emit(hue, sat, val, a);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    setHex(raw);
    if (raw.length === 6) {
      const [r, g, b] = hexToRgb(raw);
      const [h, s, v] = rgbToHsv(r, g, b);
      setHue(h);
      setSat(s);
      setVal(v);
      emit(h, s, v, alpha);
    }
  };

  const handleOpacityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(parseInt(e.target.value) / 100, 0, 1);
    handleAlpha(isNaN(v) ? 1 : v);
  };

  const addToGlobal = () => {
    const c = `#${hex}`.toLowerCase();
    if (!globalColors.includes(c)) {
      const next = [...globalColors, c];
      setGlobalColors(next);
      saveGlobal(next);
    }
  };

  const removeGlobal = (idx: number) => {
    const next = globalColors.filter((_, i) => i !== idx);
    setGlobalColors(next);
    saveGlobal(next);
  };

  const [r, g, b] = hsvToRgb(hue, sat, val);
  const previewColor =
    alpha < 1 ? `rgba(${r},${g},${b},${alpha.toFixed(2)})` : rgbToHex(r, g, b);
  const hueColor = `hsl(${hue},100%,50%)`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={`w-7 h-7 rounded border border-slate-300 cursor-pointer shadow-sm flex-shrink-0 ${className}`}
          style={{ backgroundColor: previewColor }}
          title={previewColor}
        />
      </PopoverTrigger>

      <PopoverContent
        className="w-[258px] p-0 shadow-xl border border-slate-200 rounded-lg overflow-hidden"
        side="right"
        align="start"
        sideOffset={8}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
          <span className="text-[13px] font-semibold text-slate-700">
            Color Picker
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ── Gradient canvas ── */}
        <GradientCanvas hue={hue} sx={sat} sy={val} onChange={handleGradient} />

        {/* ── Sliders ── */}
        <div className="px-3 pt-3 pb-2 space-y-2">
          <div className="flex items-center gap-2">
            {/* preview swatch */}
            <div
              className="w-8 h-8 rounded border border-slate-200 flex-shrink-0"
              style={{ backgroundColor: previewColor }}
            />
            <div className="flex-1 space-y-1.5">
              {/* Hue */}
              <RangeSlider
                value={hue / 360}
                onChange={handleHue}
                bg="linear-gradient(to right, #f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)"
              />
              {/* Alpha — checkered bg */}
              <div className="relative">
                <div
                  className="h-3 rounded-full"
                  style={{
                    background: `linear-gradient(to right,rgba(${r},${g},${b},0),rgba(${r},${g},${b},1)),
                      repeating-conic-gradient(#bbb 0% 25%,#fff 0% 50%) 0/8px 8px`,
                  }}
                />
                <RangeSlider
                  value={alpha}
                  onChange={handleAlpha}
                  bg="transparent"
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>

          {/* ── Hex + Opacity inputs ── */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center flex-1 border border-slate-200 rounded overflow-hidden">
              <input
                value={hex}
                onChange={handleHexInput}
                className="flex-1 min-w-0 h-7 px-2 text-[12px] text-slate-700 bg-white outline-none"
                maxLength={6}
                spellCheck={false}
              />
              <span className="h-7 px-1.5 flex items-center text-slate-400 bg-white text-[11px] border-l border-slate-200">
                —
              </span>
            </div>
            <div className="flex items-center border border-slate-200 rounded overflow-hidden w-20">
              <input
                type="number"
                min={0}
                max={100}
                value={Math.round(alpha * 100)}
                onChange={handleOpacityInput}
                className="w-full h-7 px-2 text-[12px] text-slate-700 bg-white outline-none"
              />
              <span className="h-7 px-1.5 flex items-center text-slate-400 bg-white text-[11px] border-l border-slate-200">
                %
              </span>
            </div>
          </div>

          {/* ── Color Filters ── */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:text-blue-600"
          >
            Color Filters{" "}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
          {showFilters && (
            <div className="grid grid-cols-5 gap-1">
              {[
                "saturate",
                "brightness",
                "contrast",
                "grayscale",
                "invert",
              ].map((f) => (
                <button
                  key={f}
                  title={f}
                  className="h-6 rounded text-[9px] text-slate-600 border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 capitalize truncate px-1"
                >
                  {f.slice(0, 3)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-slate-100" />

        {/* ── Global Colors ── */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-slate-700">
              Global Colors
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setGlobalView("grid")}
                className={`p-0.5 rounded ${globalView === "grid" ? "text-blue-500" : "text-slate-400"}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setGlobalView("list")}
                className={`p-0.5 rounded ${globalView === "list" ? "text-blue-500" : "text-slate-400"}`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {globalView === "grid" ? (
            <div className="flex flex-wrap gap-1.5">
              {globalColors.map((c, i) => (
                <div key={i} className="relative group">
                  <button
                    className="w-7 h-7 rounded border border-slate-200 shadow-sm"
                    style={{ backgroundColor: c }}
                    title={c}
                    onClick={() => {
                      const [r, g, b] = hexToRgb(c);
                      const [h, s, v] = rgbToHsv(r, g, b);
                      setHue(h);
                      setSat(s);
                      setVal(v);
                      setHex(c.replace("#", ""));
                      emit(h, s, v, alpha);
                    }}
                  />
                  {/* <button
                    onClick={() => removeGlobal(i)}
                    className="absolute -top-1 -right-1 hidden group-hover:flex h-3.5 w-3.5 rounded-full bg-red-500 text-white items-center justify-center"
                  >
                    <X className="h-2 w-2" />
                  </button> */}
                </div>
              ))}
              {/* Add current color */}
              <button
                onClick={addToGlobal}
                className="w-7 h-7 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
                title="Add current color"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {globalColors.map((c, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <div
                    className="w-5 h-5 rounded border border-slate-200"
                    style={{ backgroundColor: c }}
                  />
                  <span className="text-[11px] text-slate-600 flex-1">{c}</span>
                  {/* <button
                    onClick={() => removeGlobal(i)}
                    className="hidden group-hover:block text-red-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
