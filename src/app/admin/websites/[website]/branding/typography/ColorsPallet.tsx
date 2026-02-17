
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Copy,
  LayoutGrid,
  Lock,
  Unlock,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Color utils
───────────────────────────────────────────── */
function hexToHsl(hex: string) {
  if (!hex || hex === "transparent") return [0, 0, 50] as const;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return [h * 360, s * 100, l * 100] as const;
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function getContrastColor(hex: string) {
  if (!hex || hex === "transparent") return "#111827";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55
    ? "#111827"
    : "#FFFFFF";
}

function generateAnalogous(hex: string, count = 8, range = 70) {
  const [h, s, l] = hexToHsl(hex);

  const offsets = Array.from({ length: count }, () => {
    let v = 0;
    while (v === 0) v = Math.floor(Math.random() * (range * 2 + 1)) - range;
    return v;
  }).sort((a, b) => a - b);

  return offsets.map((d) =>
    hslToHex(
      (h + d + 360) % 360,
      Math.min(s, 80),
      Math.max(Math.min(l, 65), 35),
    ),
  );
}

function generateMonoShades(hex: string) {
  const base = hex === "transparent" ? "#FFFFFF" : hex;
  const [h, s] = hexToHsl(base);
  return [
    95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5,
  ].map((l) => hslToHex(h, Math.min(s, 85), l));
}

/* ─────────────────────────────────────────────
   Token derivation
───────────────────────────────────────────── */
type BrandTokens = {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  text: string;
  mutedText: string;
  border: string;
  ring: string;
};

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonTokens = Record<
  ButtonVariant,
  {
    bg: string;
    text: string;
    border: string;
    hoverBg: string;
    hoverText: string;
    hoverBorder: string;
  }
>;

function deriveBrand(an: string[], sh: string[][]): BrandTokens {
  const m = 3;
  return {
    primary: an[m],
    secondary: an[m - 1],
    accent: sh[m]?.[1] ?? an[m + 2],
    dark: sh[m]?.[12] ?? an[0],
    text: sh[m]?.[14] ?? "#111827",
    mutedText: sh[m]?.[10] ?? an[m - 1],
    border: sh[m]?.[6] ?? an[m + 2],
    ring: an[m - 1],
  };
}

function deriveButtons(brand: BrandTokens, sh: string[][]): ButtonTokens {
  const m = 3;
  const primaryBg = brand.primary;
  const primaryHover = sh[m]?.[12] ?? brand.dark;

  const secondaryBg = sh[m]?.[1] ?? brand.accent;
  const secondaryHover = sh[m]?.[2] ?? brand.accent;

  const outlineHoverBg = sh[m]?.[0] ?? "#F2F7F4";

  return {
    primary: {
      bg: primaryBg,
      text: getContrastColor(primaryBg),
      border: primaryBg,
      hoverBg: primaryHover,
      hoverText: getContrastColor(primaryHover),
      hoverBorder: primaryHover,
    },
    secondary: {
      bg: secondaryBg,
      text: getContrastColor(secondaryBg),
      border: brand.border,
      hoverBg: secondaryHover,
      hoverText: getContrastColor(secondaryHover),
      hoverBorder: sh[m]?.[3] ?? brand.border,
    },
    outline: {
      bg: "transparent",
      text: brand.text,
      border: brand.border,
      hoverBg: outlineHoverBg,
      hoverText: brand.text,
      hoverBorder: sh[m]?.[2] ?? brand.border,
    },
  };
}

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function safeHex(v: string) {
  const s = v.replace("#", "").trim();
  const cleaned = s.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
  return `#${cleaned.toUpperCase()}`;
}

/* ─────────────────────────────────────────────
   Shade Overlay
───────────────────────────────────────────── */
function ShadePanelOverlay({
  color,
  tokenKey,
  onSelectShade,
}: {
  color: string;
  tokenKey: string;
  onSelectShade: (shade: string, tokenKey: string) => void;
}) {
  const shades = useMemo(() => generateMonoShades(color), [color]);

  return (
    <div className="h-full w-full flex flex-col">
      {shades.map((shade) => (
        <div
          key={shade}
          className="relative flex-1 flex items-center justify-center"
          style={{ backgroundColor: shade }}
        >
          <button
            onClick={() => onSelectShade(shade, tokenKey)}
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-150 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.28)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Select
          </button>

          <div
            className="pointer-events-none absolute bottom-2 text-[10px] font-mono"
            style={{
              color:
                getContrastColor(shade) === "#FFFFFF"
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(17,24,39,0.65)",
            }}
          >
            {shade.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Small toast
───────────────────────────────────────────── */
function Toast({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999]">
      <div
        className="rounded-xl px-4 py-2 shadow-lg border"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderColor: "rgba(0,0,0,0.08)",
          color: "#111827",
          fontSize: 12,
          fontWeight: 800,
          backdropFilter: "blur(10px)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Palette Card
───────────────────────────────────────────── */
function PaletteCard({
  palette,
  onEdit,
  onDelete,
}: {
  palette: any;
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
}) {
  const brand: BrandTokens = palette?.colors?.brand;
  const strip = brand
    ? [
        brand.primary,
        brand.secondary,
        brand.accent,
        brand.border,
        brand.dark,
        brand.text,
      ]
    : ["#111827", "#374151", "#9CA3AF", "#E5E7EB", "#0B1220", "#111827"];

  return (
    <div
      className="rounded-2xl overflow-hidden border bg-white shadow-sm"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
    >
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-extrabold text-slate-900 leading-tight">
            {palette.name}
          </div>
          <div className="mt-1 text-[11px] font-mono text-slate-500">
            {palette._id}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(palette)}
            className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
            style={{ borderColor: "rgba(0,0,0,0.10)" }}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(palette._id)}
            className="h-9 w-9 rounded-xl border bg-white hover:bg-rose-50 flex items-center justify-center"
            style={{ borderColor: "rgba(0,0,0,0.10)" }}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="h-12 flex">
        {strip.map((c: string, i: number) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Editor
───────────────────────────────────────────── */
type EditorSection = "brand" | "buttons" | "preview";
type SelectedToken =
  | { type: "brand"; key: keyof BrandTokens }
  | { type: "button"; key: string }
  | null;

const BUTTON_TOKENS = [
  { id: "primary.bg", label: "Primary BG" },
  { id: "primary.hoverBg", label: "Primary Hover" },
  { id: "secondary.bg", label: "Secondary BG" },
  { id: "secondary.hoverBg", label: "Secondary Hover" },
  { id: "outline.hoverBg", label: "Outline Hover BG" },
  { id: "outline.border", label: "Outline Border" },
  { id: "outline.hoverBorder", label: "Outline Hover Border" },
] as const;

function getButtonToken(btns: ButtonTokens, tokenId: string) {
  const [variant, prop] = tokenId.split(".") as [ButtonVariant, any];
  return (btns?.[variant]?.[prop] ?? "") as string;
}

function setButtonToken(btns: ButtonTokens, tokenId: string, value: string) {
  const [variant, prop] = tokenId.split(".") as [ButtonVariant, any];
  const next: ButtonTokens = structuredClone(btns);

  (next[variant] as any)[prop] = value;

  // smart sync for readability
  if (variant === "primary") {
    if (prop === "bg") {
      next.primary.text = getContrastColor(value);
      next.primary.border = value;
    }
    if (prop === "hoverBg") {
      next.primary.hoverText = getContrastColor(value);
      next.primary.hoverBorder = value;
    }
  }

  if (variant === "secondary") {
    if (prop === "bg") next.secondary.text = getContrastColor(value);
    if (prop === "hoverBg") next.secondary.hoverText = getContrastColor(value);
  }

  return next;
}

function PreviewButton({
  label,
  normal,
  hover,
}: {
  label: string;
  normal: { bg: string; text: string; border: string };
  hover: { bg: string; text: string; border: string };
}) {
  return (
    <button
      className="h-11 px-5 rounded-xl border text-[13px] font-extrabold transition"
      style={{
        background: normal.bg,
        color: normal.text,
        borderColor: normal.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hover.bg;
        e.currentTarget.style.color = hover.text;
        e.currentTarget.style.borderColor = hover.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = normal.bg;
        e.currentTarget.style.color = normal.text;
        e.currentTarget.style.borderColor = normal.border;
      }}
    >
      {label}
    </button>
  );
}

function EditorTab({
  editingPalette,
  onSave,
  onCancel,
}: {
  editingPalette: any;
  onSave: (p: any) => void;
  onCancel: () => void;
}) {
  const defaultSeed = editingPalette?.seed || "#1F6F43";

  const [name, setName] = useState(editingPalette?.name || "");
  const [hexSeed, setHexSeed] = useState(defaultSeed);
  const [section, setSection] = useState<EditorSection>("brand");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState("");

  // stable base
  const [baseAnalogous, setBaseAnalogous] = useState<string[]>(() =>
    generateAnalogous(defaultSeed),
  );
  const baseShades = useMemo(
    () => baseAnalogous.map(generateMonoShades),
    [baseAnalogous],
  );

  const initialBrand = useMemo(
    () => deriveBrand(baseAnalogous, baseShades),
    [],
  );
  const [brand, setBrand] = useState<BrandTokens>(
    () => editingPalette?.colors?.brand || initialBrand,
  );

  const [btns, setBtns] = useState<ButtonTokens>(() => {
    if (editingPalette?.colors?.buttons) return editingPalette.colors.buttons;
    return deriveButtons(
      editingPalette?.colors?.brand || initialBrand,
      baseShades,
    );
  });

  const [lockedBrand, setLockedBrand] = useState<(keyof BrandTokens)[]>([]);
  const [lockedButtons, setLockedButtons] = useState<string[]>([]);
  const [autoSyncButtons, setAutoSyncButtons] = useState(true);

  const [selected, setSelected] = useState<SelectedToken>(null);
  const [enabledInput, setEnabledInput] = useState<string>("");

  // FIX: icons were invisible on some colors because we were using contrast against swatch,
  // but icons render on a white action-card. Keep icons dark always.
  const ACTION_ICON_COLOR = "#0F172A";

  const showToast = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(""), 850);
  };

  const applyLockedButtons = (derived: ButtonTokens) => {
    const next = structuredClone(derived);
    lockedButtons.forEach((tokenId) => {
      const v = getButtonToken(btns, tokenId);
      if (!v) return;
      const [variant, prop] = tokenId.split(".") as [ButtonVariant, any];
      (next[variant] as any)[prop] = v;
    });
    return next;
  };

  const syncButtonsNow = (b: BrandTokens) => {
    const derived = deriveButtons(b, baseShades);
    setBtns(applyLockedButtons(derived));
  };

  const autoDerive = (hex: string) => {
    const a = generateAnalogous(hex);
    const s = a.map(generateMonoShades);
    let b = deriveBrand(a, s);

    lockedBrand.forEach((k) => {
      b[k] = brand[k];
    });

    const derivedButtons = applyLockedButtons(deriveButtons(b, s));

    setHexSeed(hex);
    setBaseAnalogous(a);
    setBrand(b);
    setBtns(derivedButtons);
    setSelected(null);
    showToast("Derived from seed");
  };

  const toggleBrandLock = (key: keyof BrandTokens) => {
    setLockedBrand((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const toggleButtonLock = (tokenId: string) => {
    setLockedButtons((prev) =>
      prev.includes(tokenId)
        ? prev.filter((x) => x !== tokenId)
        : [...prev, tokenId],
    );
  };

  const handleSelectShade = (shade: string, tokenKey: string) => {
    if (tokenKey.startsWith("btn:")) {
      const tokenId = tokenKey.replace("btn:", "");
      setBtns(setButtonToken(btns, tokenId, shade));
      setSelected(null);
      showToast("Button token updated");
      return;
    }

    const key = tokenKey.replace("brand:", "") as keyof BrandTokens;
    const nextBrand: BrandTokens = structuredClone(brand);
    nextBrand[key] = shade;
    setBrand(nextBrand);
    setSelected(null);
    showToast("Brand token updated");

    if (autoSyncButtons) syncButtonsNow(nextBrand);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast("Copied");
    } catch {
      showToast("Copy failed");
    }
  };

  const handleHexInputChange = (key: string, raw: string) => {
    const nextHex = safeHex(raw);
    if (nextHex.length !== 7) return;

    if (key.startsWith("brand:")) {
      const k = key.replace("brand:", "") as keyof BrandTokens;
      const next = structuredClone(brand);
      next[k] = nextHex;
      setBrand(next);
      if (autoSyncButtons) syncButtonsNow(next);
    } else if (key.startsWith("btn:")) {
      const tokenId = key.replace("btn:", "");
      setBtns(setButtonToken(btns, tokenId, nextHex));
    }
  };

  // ✅ LOCAL STATE SAVE (no window.storage)
  const handleSave = () => {
    if (!name.trim()) {
      setMsg("Name required!");
      return;
    }

    setSaving(true);

    const palette = {
      _id: editingPalette?._id || generateId(),
      name: name.trim(),
      seed: hexSeed,
      colors: { brand, buttons: btns },
    };

    setMsg("Saved ✓");
    window.setTimeout(() => {
      setMsg("");
      onSave(palette); // parent updates local state list
    }, 350);

    window.setTimeout(() => setSaving(false), 350);
  };

  const brandEntries = Object.entries(brand) as [keyof BrandTokens, string][];
  const buttonTokenEntries = BUTTON_TOKENS.map((t) => ({
    ...t,
    value: getButtonToken(btns, t.id),
  }));

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Toast text={toast || msg} />

      {/* Editor Header */}
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <button
          onClick={onCancel}
          className="h-9 px-3 rounded-xl border bg-white hover:bg-slate-50 flex items-center gap-2"
          style={{ borderColor: "rgba(0,0,0,0.10)", color: "#111827" }}
        >
          <ChevronLeft size={16} />
          <span className="text-[12px] font-extrabold">Back</span>
        </button>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Palette name…"
          className="h-10 flex-1 rounded-xl border px-4 text-[14px] font-extrabold outline-none"
          style={{
            background: "#F8FAFC",
            borderColor: "rgba(0,0,0,0.10)",
            color: "#111827",
          }}
        />

        {/* Seed + Derive */}
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
          style={{ background: "#F8FAFC", borderColor: "rgba(0,0,0,0.10)" }}
        >
          <div className="relative">
            <div
              className="h-8 w-8 rounded-lg border"
              style={{
                background: hexSeed,
                borderColor: "rgba(0,0,0,0.12)",
              }}
            />
            <input
              type="color"
              value={hexSeed}
              onChange={(e) => setHexSeed(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div className="hidden md:block font-mono text-[11px] text-slate-600">
            {hexSeed.toUpperCase()}
          </div>
          <button
            onClick={() => autoDerive(hexSeed)}
            className="h-8 px-3 rounded-lg border bg-white hover:bg-slate-50 text-[11px] font-extrabold"
            style={{ borderColor: "rgba(0,0,0,0.10)", color: "#111827" }}
          >
            ↺ Derive
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-4 rounded-xl border text-[12px] font-extrabold"
          style={{
            background: msg.includes("✓") ? "#ECFDF5" : "#111827",
            borderColor: msg.includes("✓")
              ? "rgba(16,185,129,0.35)"
              : "#111827",
            color: msg.includes("✓") ? "#065F46" : "#FFFFFF",
            opacity: saving ? 0.75 : 1,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {msg || (saving ? "Saving…" : "Save")}
        </button>
      </div>

      {/* Sub Tabs */}
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "#F8FAFC", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div
          className="inline-flex rounded-xl border p-1"
          style={{ borderColor: "rgba(0,0,0,0.10)", background: "#FFFFFF" }}
        >
          {[
            ["brand", "Brand"],
            ["buttons", "Buttons"],
            ["preview", "Preview"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSection(id as EditorSection)}
              className="h-9 px-4 rounded-lg text-[12px] font-extrabold transition"
              style={{
                background: section === id ? "#111827" : "transparent",
                color: section === id ? "#FFFFFF" : "#111827",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-[12px] font-bold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={autoSyncButtons}
              onChange={(e) => setAutoSyncButtons(e.target.checked)}
            />
            Auto-sync buttons from brand
          </label>

          {section === "buttons" && (
            <button
              onClick={() => syncButtonsNow(brand)}
              className="h-9 px-3 rounded-xl border bg-white hover:bg-slate-50 text-[12px] font-extrabold"
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              Sync now
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 p-5" style={{ background: "#F3F5F9" }}>
        {/* BRAND */}
        {section === "brand" && (
          <div
            className="rounded-2xl border overflow-hidden bg-white"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
          >
            <div className="h-[56vh] min-h-[420px] flex">
              {brandEntries.map(([key, color]) => {
                const tokenKey = `brand:${String(key)}`;
                const isSelected =
                  selected?.type === "brand" && selected.key === key;

                if (isSelected) {
                  return (
                    <div key={String(key)} className="flex-1">
                      <ShadePanelOverlay
                        color={color}
                        tokenKey={tokenKey}
                        onSelectShade={handleSelectShade}
                      />
                    </div>
                  );
                }

                const bg =
                  color === "transparent"
                    ? "repeating-conic-gradient(#E5E7EB 0% 25%, #F8FAFC 0% 50%) 0 0 / 10px 10px"
                    : color;

                const labelColor =
                  color === "transparent" ? "#111827" : getContrastColor(color);

                return (
                  <div
                    key={String(key)}
                    className="group relative flex-1"
                    style={{ background: bg as any }}
                    title={`${String(key)}: ${color}`}
                  >
                    {/* Hover actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className="rounded-2xl border shadow-sm p-2 flex flex-col gap-2"
                        style={{
                          background: "rgba(255,255,255,0.90)",
                          borderColor: "rgba(0,0,0,0.10)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <button
                          onClick={() => setSelected({ type: "brand", key })}
                          className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                          style={{ borderColor: "rgba(0,0,0,0.10)" }}
                          title="Pick shade"
                        >
                          <LayoutGrid size={16} color={ACTION_ICON_COLOR} />
                        </button>

                        <button
                          onClick={() => handleCopy(color)}
                          className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                          style={{ borderColor: "rgba(0,0,0,0.10)" }}
                          title="Copy"
                        >
                          <Copy size={16} color={ACTION_ICON_COLOR} />
                        </button>

                        <button
                          onClick={() => toggleBrandLock(key)}
                          className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                          style={{ borderColor: "rgba(0,0,0,0.10)" }}
                          title={lockedBrand.includes(key) ? "Unlock" : "Lock"}
                        >
                          {lockedBrand.includes(key) ? (
                            <Lock size={16} color={ACTION_ICON_COLOR} />
                          ) : (
                            <Unlock size={16} color={ACTION_ICON_COLOR} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Bottom labels */}
                    <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center select-none">
                      <div className="mb-1">
                        {enabledInput === tokenKey ? (
                          <input
                            autoFocus
                            value={color.replace("#", "").toUpperCase()}
                            onChange={(e) =>
                              handleHexInputChange(tokenKey, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEnabledInput("");
                            }}
                            className="w-[78px] rounded-lg border px-2 py-1 text-center font-mono text-xs font-extrabold outline-none"
                            style={{
                              background: "rgba(255,255,255,0.92)",
                              borderColor: "rgba(0,0,0,0.18)",
                              color: "#111827",
                            }}
                          />
                        ) : (
                          <span
                            onDoubleClick={() => setEnabledInput(tokenKey)}
                            className="cursor-pointer font-mono text-xs font-extrabold tracking-wide"
                            style={{ color: labelColor }}
                          >
                            {color.replace("#", "").toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div
                        className="font-mono text-[10px] opacity-70"
                        style={{ color: labelColor }}
                      >
                        {String(key)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t text-[12px] text-slate-600 font-semibold">
              Tip: Double click any HEX to edit. Use the grid icon to open a
              shade selector.
            </div>
          </div>
        )}

        {/* BUTTONS */}
        {section === "buttons" && (
          <div className="grid gap-4">
            <div
              className="rounded-2xl border overflow-hidden bg-white"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="h-[44vh] min-h-[360px] flex">
                {buttonTokenEntries.map((t) => {
                  const tokenKey = `btn:${t.id}`;
                  const isSelected =
                    selected?.type === "button" && selected.key === t.id;

                  const color = t.value || "#FFFFFF";

                  if (isSelected) {
                    return (
                      <div key={t.id} className="flex-1">
                        <ShadePanelOverlay
                          color={color}
                          tokenKey={tokenKey}
                          onSelectShade={handleSelectShade}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={t.id}
                      className="group relative flex-1"
                      style={{
                        background: color === "transparent" ? "#FFFFFF" : color,
                      }}
                      title={`${t.label}: ${color}`}
                    >
                      {/* Hover actions */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                          className="rounded-2xl border shadow-sm p-2 flex flex-col gap-2"
                          style={{
                            background: "rgba(255,255,255,0.90)",
                            borderColor: "rgba(0,0,0,0.10)",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <button
                            onClick={() =>
                              setSelected({ type: "button", key: t.id })
                            }
                            className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                            style={{ borderColor: "rgba(0,0,0,0.10)" }}
                            title="Pick shade"
                          >
                            <LayoutGrid size={16} color={ACTION_ICON_COLOR} />
                          </button>

                          <button
                            onClick={() => handleCopy(color)}
                            className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                            style={{ borderColor: "rgba(0,0,0,0.10)" }}
                            title="Copy"
                          >
                            <Copy size={16} color={ACTION_ICON_COLOR} />
                          </button>

                          <button
                            onClick={() => toggleButtonLock(t.id)}
                            className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                            style={{ borderColor: "rgba(0,0,0,0.10)" }}
                            title={
                              lockedButtons.includes(t.id) ? "Unlock" : "Lock"
                            }
                          >
                            {lockedButtons.includes(t.id) ? (
                              <Lock size={16} color={ACTION_ICON_COLOR} />
                            ) : (
                              <Unlock size={16} color={ACTION_ICON_COLOR} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Bottom labels */}
                      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center select-none">
                        <div className="mb-1">
                          {enabledInput === tokenKey ? (
                            <input
                              autoFocus
                              value={color.replace("#", "").toUpperCase()}
                              onChange={(e) =>
                                handleHexInputChange(tokenKey, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setEnabledInput("");
                              }}
                              className="w-[78px] rounded-lg border px-2 py-1 text-center font-mono text-xs font-extrabold outline-none"
                              style={{
                                background: "rgba(255,255,255,0.92)",
                                borderColor: "rgba(0,0,0,0.18)",
                                color: "#111827",
                              }}
                            />
                          ) : (
                            <span
                              onDoubleClick={() => setEnabledInput(tokenKey)}
                              className="cursor-pointer font-mono text-xs font-extrabold tracking-wide"
                              style={{ color: getContrastColor(color) }}
                            >
                              {color.replace("#", "").toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div
                          className="font-mono text-[10px] opacity-70 text-center px-2"
                          style={{ color: getContrastColor(color) }}
                        >
                          {t.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-3 border-t text-[12px] text-slate-600 font-semibold">
                Tip: Same workflow as Brand — click grid for shades, double
                click HEX to type.
              </div>
            </div>

            <div
              className="rounded-2xl border bg-white p-4"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="text-[13px] font-extrabold text-slate-900 mb-3">
                Live Buttons Preview
              </div>

              <div className="flex flex-wrap gap-12">
                <div>
                  <div className="text-[11px] font-mono text-slate-500 mb-2">
                    Primary
                  </div>
                  <PreviewButton
                    label="Primary Button"
                    normal={{
                      bg: btns.primary.bg,
                      text: btns.primary.text,
                      border: btns.primary.border,
                    }}
                    hover={{
                      bg: btns.primary.hoverBg,
                      text: btns.primary.hoverText,
                      border: btns.primary.hoverBorder,
                    }}
                  />
                </div>

                <div>
                  <div className="text-[11px] font-mono text-slate-500 mb-2">
                    Secondary
                  </div>
                  <PreviewButton
                    label="Secondary Button"
                    normal={{
                      bg: btns.secondary.bg,
                      text: btns.secondary.text,
                      border: btns.secondary.border,
                    }}
                    hover={{
                      bg: btns.secondary.hoverBg,
                      text: btns.secondary.hoverText,
                      border: btns.secondary.hoverBorder,
                    }}
                  />
                </div>

                <div>
                  <div className="text-[11px] font-mono text-slate-500 mb-2">
                    Outline
                  </div>
                  <PreviewButton
                    label="Outline Button"
                    normal={{
                      bg: btns.outline.bg,
                      text: btns.outline.text,
                      border: btns.outline.border,
                    }}
                    hover={{
                      bg: btns.outline.hoverBg,
                      text: btns.outline.hoverText,
                      border: btns.outline.hoverBorder,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW */}
        {section === "preview" && (
          <div className="grid gap-4">
            <div
              className="rounded-2xl border bg-white overflow-hidden"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <div className="text-[13px] font-extrabold text-slate-900">
                  Brand Tokens
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                {brandEntries.map(([k, v]) => (
                  <div
                    key={String(k)}
                    className="rounded-2xl border overflow-hidden"
                    style={{ borderColor: "rgba(0,0,0,0.08)" }}
                  >
                    <div className="h-14" style={{ background: v }} />
                    <div className="p-3">
                      <div className="text-[11px] font-mono text-slate-500">
                        {String(k)}
                      </div>
                      <div className="mt-1 font-mono text-[12px] font-extrabold text-slate-900">
                        {v.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl border bg-white p-4"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="text-[13px] font-extrabold text-slate-900 mb-3">
                Buttons Preview
              </div>
              <div className="flex flex-wrap gap-12">
                <PreviewButton
                  label="Primary Button"
                  normal={{
                    bg: btns.primary.bg,
                    text: btns.primary.text,
                    border: btns.primary.border,
                  }}
                  hover={{
                    bg: btns.primary.hoverBg,
                    text: btns.primary.hoverText,
                    border: btns.primary.hoverBorder,
                  }}
                />
                <PreviewButton
                  label="Secondary Button"
                  normal={{
                    bg: btns.secondary.bg,
                    text: btns.secondary.text,
                    border: btns.secondary.border,
                  }}
                  hover={{
                    bg: btns.secondary.hoverBg,
                    text: btns.secondary.hoverText,
                    border: btns.secondary.hoverBorder,
                  }}
                />
                <PreviewButton
                  label="Outline Button"
                  normal={{
                    bg: btns.outline.bg,
                    text: btns.outline.text,
                    border: btns.outline.border,
                  }}
                  hover={{
                    bg: btns.outline.hoverBg,
                    text: btns.outline.hoverText,
                    border: btns.outline.hoverBorder,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main studio (LOCAL STATE ONLY)
───────────────────────────────────────────── */
export default function ColorPaletteStudio() {
  const [tab, setTab] = useState<"all" | "edit">("all");
  const [palettes, setPalettes] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const handleSave = (p: any) => {
    setPalettes((prev) =>
      prev.find((x) => x._id === p._id)
        ? prev.map((x) => (x._id === p._id ? p : x))
        : [p, ...prev],
    );
    setTab("all");
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setPalettes((prev) => prev.filter((p) => p._id !== id));
  };

  const handleEdit = (p: any) => {
    setEditing(p);
    setTab("edit");
  };

  const handleNew = () => {
    setEditing(null);
    setTab("edit");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { height: 100%; }
        body { margin: 0; overflow: hidden; font-family: 'DM Sans', sans-serif; background: #F3F5F9; color: #111827; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.18); border-radius: 999px; }
        input[type="color"] { -webkit-appearance: none; border: none; padding: 0; background: transparent; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 10px; }
      `}</style>

      <div className="h-screen flex flex-col">
        {/* TOP BAR */}
        <div
          className="px-5 py-3 border-b flex items-center gap-3"
          style={{ background: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div className="text-[15px] font-extrabold tracking-tight">
            palette<span style={{ color: "#16A34A" }}>.</span>studio
          </div>

          <div
            className="w-px h-5"
            style={{ background: "rgba(0,0,0,0.08)" }}
          />

          <div
            className="inline-flex rounded-xl border p-1"
            style={{ borderColor: "rgba(0,0,0,0.10)", background: "#F8FAFC" }}
          >
            <button
              onClick={() => {
                setTab("all");
                setEditing(null);
              }}
              className="h-9 px-4 rounded-lg text-[12px] font-extrabold transition"
              style={{
                background: tab === "all" ? "#111827" : "transparent",
                color: tab === "all" ? "#FFFFFF" : "#111827",
              }}
            >
              All Palettes
            </button>

            <button
              onClick={handleNew}
              className="h-9 px-4 rounded-lg text-[12px] font-extrabold transition"
              style={{
                background: tab === "edit" ? "#111827" : "transparent",
                color: tab === "edit" ? "#FFFFFF" : "#111827",
              }}
            >
              {tab === "edit" && editing
                ? `Editing: ${editing.name}`
                : "Create New"}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-[11px] font-mono text-slate-500">
              {palettes.length} saved (local state)
            </div>

            <button
              onClick={handleNew}
              className="h-10 px-4 rounded-xl border bg-white hover:bg-slate-50 flex items-center gap-2"
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              <Plus size={16} />
              <span className="text-[12px] font-extrabold">New</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-h-0 flex">
          {tab === "all" && (
            <div className="flex-1 min-h-0 overflow-y-auto p-5">
              {palettes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div
                    className="h-16 w-16 rounded-2xl border flex items-center justify-center text-2xl"
                    style={{
                      borderColor: "rgba(0,0,0,0.10)",
                      background: "rgba(255,255,255,0.8)",
                    }}
                  >
                    🎨
                  </div>
                  <div className="text-slate-700 font-extrabold text-[14px]">
                    No palettes yet
                  </div>
                  <button
                    onClick={handleNew}
                    className="h-11 px-6 rounded-xl border bg-white hover:bg-slate-50 text-[12px] font-extrabold"
                    style={{ borderColor: "rgba(0,0,0,0.10)" }}
                  >
                    + Create First Palette
                  </button>
                </div>
              ) : (
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                  }}
                >
                  {palettes.map((p) => (
                    <PaletteCard
                      key={p._id}
                      palette={p}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "edit" && (
            <EditorTab
              editingPalette={editing}
              onSave={handleSave}
              onCancel={() => {
                setTab("all");
                setEditing(null);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
