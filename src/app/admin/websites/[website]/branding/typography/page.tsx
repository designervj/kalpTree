"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignLeft,
  MoveVertical,
  Type as TypeIcon,
  Paintbrush,
  Code2,
  Eye,
  Copy,
  Check,
  Palette,
  Sun,
  Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

/* -----------------------------
  Types
------------------------------ */
type Mode = "light" | "dark";
type LeftTab = "colors" | "headings" | "body" | "buttons";
type HeadingKey = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type BtnKey = "primary" | "secondary" | "outline";
type RightPanelTab = "preview" | "root";

type HeadingStyle = {
  scale: number;
  weight: number;
  lineHeight: number;
  letterSpacingEm: number;
};

type BodyStyle = {
  sizePx: number;
  weight: number;
  lineHeight: number;
  letterSpacingEm: number;
  maxWidthCh: number;
  paragraphGapPx: number;
};

type ButtonBaseStyle = {
  fontFamily: string;
  sizePx: number;
  weight: number;
  letterSpacingEm: number;
  transform: "none" | "uppercase" | "lowercase" | "capitalize";
  radiusPx: number;
  heightPx: number;
  paddingXPx: number;
  borderWidthPx: number;
  shadow: "none" | "sm" | "md" | "lg";
  transitionMs: number;
};

type ButtonColors = {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  hoverBorder: string;
};

/**
 * ✅ Background + Surface REMOVED from user editable controls.
 * They will be derived in mode blocks (light/dark).
 */
type BrandColors = {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  text: string;
  mutedText: string;
  border: string;
  ring: string;
};

const WEIGHTS = [300, 400, 500, 600, 700, 800, 900];

/* -----------------------------
  Utils
------------------------------ */
function isHexColor(v: string) {
  return /^#([0-9a-fA-F]{6})$/.test(v.trim());
}
function clampHexOrFallback(v: string, fallback: string) {
  return isHexColor(v) ? v.trim() : fallback;
}
function shadowToCss(s: ButtonBaseStyle["shadow"]) {
  if (s === "sm") return "0 1px 2px rgba(0,0,0,0.08)";
  if (s === "md") return "0 6px 18px rgba(0,0,0,0.12)";
  if (s === "lg") return "0 14px 34px rgba(0,0,0,0.16)";
  return "none";
}
function cssFont(f: string) {
  if (!f) return "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  if (f.includes(" "))
    return `"${f}", system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
  return `${f}, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
}

/* ---- color helpers ---- */
function hexToRgb(hex: string) {
  const v = hex.replace("#", "").trim();
  if (v.length !== 6) return { r: 0, g: 0, b: 0 };
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return { r, g, b };
}
function rgbToHex(r: number, g: number, b: number) {
  const to = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(
    A.r + (B.r - A.r) * t,
    A.g + (B.g - A.g) * t,
    A.b + (B.b - A.b) * t
  );
}
function rgba(hex: string, alpha: number) {
  const c = hexToRgb(hex);
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

/* -----------------------------
  ✅ Input Focus Fix (Hex)
------------------------------ */
function HexInput({
  label,
  value,
  fallback,
  onCommit,
}: {
  label: string;
  value: string;
  fallback: string;
  onCommit: (v: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const lastValidRef = useRef(isHexColor(value) ? value : fallback);

  useEffect(() => {
    setDraft(value);
    if (isHexColor(value)) lastValidRef.current = value;
  }, [value, fallback]);

  const displayForPicker = isHexColor(draft) ? draft : lastValidRef.current;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => {
            const v = e.target.value;
            setDraft(v);
            if (isHexColor(v)) {
              lastValidRef.current = v.trim();
              onCommit(v.trim());
            }
          }}
          onBlur={() => {
            if (!isHexColor(draft)) {
              setDraft(lastValidRef.current);
            } else {
              onCommit(draft.trim());
            }
          }}
          placeholder={fallback}
          spellCheck={false}
          autoComplete="off"
          inputMode="text"
        />
        <input
          type="color"
          className="h-9 w-10 rounded-md border bg-background px-1"
          value={displayForPicker}
          onChange={(e) => {
            const v = e.target.value;
            lastValidRef.current = v;
            setDraft(v);
            onCommit(v);
          }}
          title="Pick color"
        />
      </div>
      {!isHexColor(draft) ? (
        <p className="text-[11px] text-muted-foreground">
          Tip: Hex format <span className="font-mono">#RRGGBB</span> (example:{" "}
          <span className="font-mono">{fallback}</span>)
        </p>
      ) : null}
    </div>
  );
}

/* -----------------------------
  Component
------------------------------ */
export default function TypographyPage() {
  /* LEFT tabs */
  const [leftTab, setLeftTab] = useState<LeftTab>("colors");

  /* RIGHT tabs */
  const [rightPanel, setRightPanel] = useState<RightPanelTab>("preview");

  /* ✅ Light / Dark Mode */
  const [mode, setMode] = useState<Mode>("light");

  const [copied, setCopied] = useState(false);

  /* ✅ brand tokens editable (NO background/surface) */
  const [brand, setBrand] = useState<BrandColors>({
    primary: "#1F6F43",
    secondary: "#2EA76A",
    accent: "#B9F3D5",
    dark: "#0B3A2A",
    text: "#0B2A1F",
    mutedText: "#5E6E65",
    border: "#DDE6E1",
    ring: "#2EA76A",
  });

  /* Typography */
  const [globalFontFamily, setGlobalFontFamily] = useState("Inter");
  const [headingFontFamily, setHeadingFontFamily] = useState("Inter");
  const [headingBaseSize, setHeadingBaseSize] = useState(17);

  const [selectedHeading, setSelectedHeading] = useState<HeadingKey>("h1");
  const [headings, setHeadings] = useState<Record<HeadingKey, HeadingStyle>>({
    h1: { scale: 2.5, weight: 800, lineHeight: 1.05, letterSpacingEm: -0.03 },
    h2: { scale: 2.0, weight: 800, lineHeight: 1.1, letterSpacingEm: -0.02 },
    h3: { scale: 1.5, weight: 700, lineHeight: 1.15, letterSpacingEm: -0.01 },
    h4: { scale: 1.25, weight: 700, lineHeight: 1.2, letterSpacingEm: 0 },
    h5: { scale: 1.1, weight: 600, lineHeight: 1.25, letterSpacingEm: 0 },
    h6: { scale: 1.0, weight: 600, lineHeight: 1.3, letterSpacingEm: 0.01 },
  });

  const [body, setBody] = useState<BodyStyle>({
    sizePx: 17,
    weight: 400,
    lineHeight: 1.7,
    letterSpacingEm: 0,
    maxWidthCh: 62,
    paragraphGapPx: 14,
  });

  const [selectedBtn, setSelectedBtn] = useState<BtnKey>("primary");
  const [hoveredBtn, setHoveredBtn] = useState<BtnKey | null>(null);

  const [buttonBase, setButtonBase] = useState<ButtonBaseStyle>({
    fontFamily: "Inter",
    sizePx: 14,
    weight: 600,
    letterSpacingEm: 0,
    transform: "none",
    radiusPx: 12,
    heightPx: 40,
    paddingXPx: 16,
    borderWidthPx: 1,
    shadow: "none",
    transitionMs: 160,
  });

  const [buttonColors, setButtonColors] = useState<Record<BtnKey, ButtonColors>>({
    primary: {
      bg: "#1F6F43",
      text: "#FFFFFF",
      border: "#1F6F43",
      hoverBg: "#185A37",
      hoverText: "#FFFFFF",
      hoverBorder: "#185A37",
    },
    secondary: {
      bg: "#EAF7F0",
      text: "#0B2A1F",
      border: "#DDE6E1",
      hoverBg: "#DAF2E6",
      hoverText: "#0B2A1F",
      hoverBorder: "#CFE4DA",
    },
    outline: {
      bg: "transparent",
      text: "#0B2A1F",
      border: "#CFE4DA",
      hoverBg: "#F4FBF7",
      hoverText: "#0B2A1F",
      hoverBorder: "#9ED7C0",
    },
  });

  const activeHeading = headings[selectedHeading];
  const activeBtnColors = buttonColors[selectedBtn];

  const headingPx = (k: HeadingKey) => Math.round(headingBaseSize * headings[k].scale);

  /* -----------------------------------------
    ✅ Apply theme to HTML (robust global usage)
    - This makes your global CSS usable across pages:
      :root {} + :root[data-theme="dark"] {}
  ------------------------------------------ */
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-theme", mode);
  }, [mode]);

  /* ✅ computed palette for this preview (not user editable) */
  const uiPalette = useMemo(() => {
    const light = {
      bg: "#F4F6F5",
      surface: "#FFFFFF",
      text: brand.text,
      mutedText: brand.mutedText,
      border: brand.border,
    };
    const dark = {
      bg: "#071B14",
      surface: "#0B2A1F",
      text: "#EAF7F0",
      mutedText: mixHex("#EAF7F0", "#000000", 0.35),
      border: rgba("#B9F3D5", 0.22),
    };
    return mode === "light" ? light : dark;
  }, [mode, brand.text, brand.mutedText, brand.border]);

  const onLeftTab = (t: LeftTab) => {
    setLeftTab(t);
    setRightPanel("preview");
  };

  /* -----------------------------
    ✅ Global Brand Guideline CSS (ROBUST)
    - Produces:
      1) :root  (base tokens)
      2) :root[data-theme="light"] (light mode tokens)
      3) :root[data-theme="dark"]  (dark mode tokens)
    - This can be pasted into globals.css and will work on all pages
  ------------------------------ */
  const ROOT_CSS = useMemo(() => {
    const h = headings;

    const hPx: Record<HeadingKey, number> = {
      h1: Math.round(headingBaseSize * h.h1.scale),
      h2: Math.round(headingBaseSize * h.h2.scale),
      h3: Math.round(headingBaseSize * h.h3.scale),
      h4: Math.round(headingBaseSize * h.h4.scale),
      h5: Math.round(headingBaseSize * h.h5.scale),
      h6: Math.round(headingBaseSize * h.h6.scale),
    };

    const primary = clampHexOrFallback(brand.primary, "#1F6F43");
    const secondary = clampHexOrFallback(brand.secondary, "#2EA76A");
    const accent = clampHexOrFallback(brand.accent, "#B9F3D5");
    const dark = clampHexOrFallback(brand.dark, "#0B3A2A");

    const ring = clampHexOrFallback(brand.ring, secondary);

    // mode-specific derived values (stable defaults)
    const lightBg = "#F4F6F5";
    const lightSurface = "#FFFFFF";
    const lightText = clampHexOrFallback(brand.text, "#0B2A1F");
    const lightMuted = clampHexOrFallback(brand.mutedText, "#5E6E65");
    const lightBorder = clampHexOrFallback(brand.border, "#DDE6E1");

    const darkBg = "#071B14";
    const darkSurface = "#0B2A1F";
    const darkText = "#EAF7F0";
    const darkMuted = mixHex("#EAF7F0", "#000000", 0.35);
    const darkBorder = rgba(accent, 0.22);

    const lines: string[] = [];

    lines.push(`/* =========================================================`);
    lines.push(`   BRAND GUIDELINES • GLOBAL TOKENS (COPY TO globals.css)`);
    lines.push(`   Usage: documentElement.setAttribute("data-theme","light|dark")`);
    lines.push(`   ========================================================= */`);
    lines.push(``);

    // 1) BASE TOKENS (shared across modes)
    lines.push(`:root {`);
    lines.push(`  /* Brand Core */`);
    lines.push(`  --primary: ${primary};`);
    lines.push(`  --secondary: ${secondary};`);
    lines.push(`  --accent: ${accent};`);
    lines.push(`  --dark: ${dark};`);
    lines.push(`  --ring: ${ring};`);
    lines.push(``);
    lines.push(`  /* Fonts */`);
    lines.push(`  --font-body: ${cssFont(globalFontFamily)};`);
    lines.push(`  --font-heading: ${cssFont(headingFontFamily)};`);
    lines.push(`  --font-button: ${cssFont(buttonBase.fontFamily)};`);
    lines.push(``);
    lines.push(`  /* Headings (PX only) */`);
    (["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).forEach((k) => {
      const s = h[k];
      lines.push(`  --${k}-size: ${hPx[k]}px;`);
      lines.push(`  --${k}-weight: ${s.weight};`);
      lines.push(`  --${k}-lh: ${s.lineHeight};`);
      lines.push(`  --${k}-ls: ${s.letterSpacingEm}em;`);
    });
    lines.push(``);
    lines.push(`  /* Body */`);
    lines.push(`  --body-size: ${body.sizePx}px;`);
    lines.push(`  --body-weight: ${body.weight};`);
    lines.push(`  --body-lh: ${body.lineHeight};`);
    lines.push(`  --body-ls: ${body.letterSpacingEm}em;`);
    lines.push(`  --body-maxw: ${body.maxWidthCh}ch;`);
    lines.push(`  --body-paragraph-gap: ${body.paragraphGapPx}px;`);
    lines.push(``);
    lines.push(`  /* Buttons (base) */`);
    lines.push(`  --btn-size: ${buttonBase.sizePx}px;`);
    lines.push(`  --btn-weight: ${buttonBase.weight};`);
    lines.push(`  --btn-ls: ${buttonBase.letterSpacingEm}em;`);
    lines.push(`  --btn-transform: ${buttonBase.transform};`);
    lines.push(`  --btn-radius: ${buttonBase.radiusPx}px;`);
    lines.push(`  --btn-height: ${buttonBase.heightPx}px;`);
    lines.push(`  --btn-pad-x: ${buttonBase.paddingXPx}px;`);
    lines.push(`  --btn-border-w: ${buttonBase.borderWidthPx}px;`);
    lines.push(`  --btn-shadow: ${shadowToCss(buttonBase.shadow)};`);
    lines.push(`  --btn-transition: ${buttonBase.transitionMs}ms;`);
    lines.push(``);
    (["primary", "secondary", "outline"] as BtnKey[]).forEach((k) => {
      const c = buttonColors[k];
      lines.push(`  /* Button: ${k.toUpperCase()} */`);
      lines.push(`  --btn-${k}-bg: ${c.bg};`);
      lines.push(`  --btn-${k}-text: ${c.text};`);
      lines.push(`  --btn-${k}-border: ${c.border};`);
      lines.push(`  --btn-${k}-hover-bg: ${c.hoverBg};`);
      lines.push(`  --btn-${k}-hover-text: ${c.hoverText};`);
      lines.push(`  --btn-${k}-hover-border: ${c.hoverBorder};`);
    });
    lines.push(`}`);
    lines.push(``);

    // 2) LIGHT MODE TOKENS
    lines.push(`:root[data-theme="light"] {`);
    lines.push(`  --mode: light;`);
    lines.push(`  --bg: ${lightBg};`);
    lines.push(`  --surface: ${lightSurface};`);
    lines.push(`  --text: ${lightText};`);
    lines.push(`  --muted-text: ${lightMuted};`);
    lines.push(`  --border: ${lightBorder};`);
    lines.push(`}`);
    lines.push(``);

    // 3) DARK MODE TOKENS
    lines.push(`:root[data-theme="dark"] {`);
    lines.push(`  --mode: dark;`);
    lines.push(`  --bg: ${darkBg};`);
    lines.push(`  --surface: ${darkSurface};`);
    lines.push(`  --text: ${darkText};`);
    lines.push(`  --muted-text: ${darkMuted};`);
    lines.push(`  --border: ${darkBorder};`);
    lines.push(`}`);
    lines.push(``);

    // Optional helpers (usable across new pages)
    lines.push(`/* Optional: Base application styles (recommended) */`);
    lines.push(`html, body {`);
    lines.push(`  background: var(--bg);`);
    lines.push(`  color: var(--text);`);
    lines.push(`  font-family: var(--font-body);`);
    lines.push(`}`);
    lines.push(`h1{font-family:var(--font-heading);font-size:var(--h1-size);font-weight:var(--h1-weight);line-height:var(--h1-lh);letter-spacing:var(--h1-ls);}`);
    lines.push(`h2{font-family:var(--font-heading);font-size:var(--h2-size);font-weight:var(--h2-weight);line-height:var(--h2-lh);letter-spacing:var(--h2-ls);}`);
    lines.push(`h3{font-family:var(--font-heading);font-size:var(--h3-size);font-weight:var(--h3-weight);line-height:var(--h3-lh);letter-spacing:var(--h3-ls);}`);
    lines.push(`h4{font-family:var(--font-heading);font-size:var(--h4-size);font-weight:var(--h4-weight);line-height:var(--h4-lh);letter-spacing:var(--h4-ls);}`);
    lines.push(`h5{font-family:var(--font-heading);font-size:var(--h5-size);font-weight:var(--h5-weight);line-height:var(--h5-lh);letter-spacing:var(--h5-ls);}`);
    lines.push(`h6{font-family:var(--font-heading);font-size:var(--h6-size);font-weight:var(--h6-weight);line-height:var(--h6-lh);letter-spacing:var(--h6-ls);}`);
    lines.push(``);

    return lines.join("\n");
  }, [
    brand,
    globalFontFamily,
    headingFontFamily,
    headingBaseSize,
    headings,
    body,
    buttonBase,
    buttonColors,
  ]);

  const handleCopyRoot = async () => {
    try {
      await navigator.clipboard.writeText(ROOT_CSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  /* -----------------------------
    Preview styling (NO gradient)
    ✅ ensure typography is always readable in both modes
  ------------------------------ */
  const outerPreviewStyle = useMemo(
    () =>
      ({
        background: uiPalette.bg,
        color: uiPalette.text,
        fontFamily: globalFontFamily,
      }) as React.CSSProperties,
    [uiPalette, globalFontFamily]
  );

  const cardPreviewStyle = useMemo(
    () =>
      ({
        background: uiPalette.surface,
        borderColor: uiPalette.border,
        color: uiPalette.text,
      }) as React.CSSProperties,
    [uiPalette]
  );

  const softBg = useMemo(
    () =>
      mode === "light"
        ? mixHex("#F4F6F5", brand.accent, 0.35)
        : rgba(brand.accent, 0.08),
    [mode, brand.accent]
  );

  /* Buttons used in preview areas */
  const getBtnVisual = (k: BtnKey) => {
    const c = buttonColors[k];
    const hovering = hoveredBtn === k;

    const bg = hovering ? c.hoverBg : c.bg;
    const text = hovering ? c.hoverText : c.text;
    const border = hovering ? c.hoverBorder : c.border;

    return {
      style: {
        fontFamily: buttonBase.fontFamily,
        fontSize: `${buttonBase.sizePx}px`,
        fontWeight: buttonBase.weight as any,
        letterSpacing: `${buttonBase.letterSpacingEm}em`,
        textTransform: buttonBase.transform,
        height: buttonBase.heightPx,
        paddingLeft: buttonBase.paddingXPx,
        paddingRight: buttonBase.paddingXPx,
        borderRadius: buttonBase.radiusPx,
        background: bg,
        color: text,
        borderColor: border,
        borderWidth: buttonBase.borderWidthPx,
        borderStyle: "solid",
        transition: `all ${buttonBase.transitionMs}ms ease`,
        boxShadow: shadowToCss(buttonBase.shadow),
      } as React.CSSProperties,
      className:
        `inline-flex items-center justify-center select-none outline-none ` +
        `focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background`,
    };
  };

  /* -----------------------------
    LEFT Controls
  ------------------------------ */
  const colorsControls = useMemo(() => {
    const setC = (patch: Partial<BrandColors>) =>
      setBrand((p) => ({ ...p, ...patch }));

    return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Theme Colors</p>
                <p className="text-xs text-muted-foreground">
                  Left side change → right preview same time update. (Background/Surface are mode-driven)
                </p>
              </div>
            </div>
          </div>

          <HexInput label="Primary" value={brand.primary} fallback="#1F6F43" onCommit={(v) => setC({ primary: v })} />
          <HexInput label="Secondary" value={brand.secondary} fallback="#2EA76A" onCommit={(v) => setC({ secondary: v })} />
          <HexInput label="Accent" value={brand.accent} fallback="#B9F3D5" onCommit={(v) => setC({ accent: v })} />
          <HexInput label="Dark" value={brand.dark} fallback="#0B3A2A" onCommit={(v) => setC({ dark: v })} />

          <Separator />

          <HexInput label="Text (Light Mode)" value={brand.text} fallback="#0B2A1F" onCommit={(v) => setC({ text: v })} />
          <HexInput label="Muted Text (Light Mode)" value={brand.mutedText} fallback="#5E6E65" onCommit={(v) => setC({ mutedText: v })} />
          <HexInput label="Border (Light Mode)" value={brand.border} fallback="#DDE6E1" onCommit={(v) => setC({ border: v })} />
          <HexInput label="Ring" value={brand.ring} fallback="#2EA76A" onCommit={(v) => setC({ ring: v })} />

          <div className="rounded-lg border p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Mode Background</span>
              <span className="font-mono">{uiPalette.bg}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Mode Surface</span>
              <span className="font-mono">{uiPalette.surface}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [brand, uiPalette.bg, uiPalette.surface]);

  const headingControls = useMemo(() => {
    const setH = (patch: Partial<HeadingStyle>) => {
      setHeadings((prev) => ({
        ...prev,
        [selectedHeading]: { ...prev[selectedHeading], ...patch },
      }));
    };

    return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Heading Settings</p>
                <p className="text-xs text-muted-foreground">
                  Font family change will reflect in preview “Typography” card.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heading Font Family</Label>
              <Select value={headingFontFamily} onValueChange={setHeadingFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Merriweather">Merriweather (Serif)</SelectItem>
                  <SelectItem value="Space Mono">Space Mono (Monospace)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Heading Base Size</Label>
                <span className="text-xs text-muted-foreground">{headingBaseSize}px</span>
              </div>
              <Slider
                value={[headingBaseSize]}
                min={12}
                max={22}
                step={1}
                onValueChange={(v) => setHeadingBaseSize(v[0])}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4" /> Heading Level
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {(["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).map((k) => (
                <Button
                  key={k}
                  size="sm"
                  variant={selectedHeading === k ? "default" : "outline"}
                  onClick={() => setSelectedHeading(k)}
                >
                  {k.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Font Weight</Label>
            <div className="grid grid-cols-3 gap-2">
              {WEIGHTS.filter((w) => w !== 300).map((w) => (
                <Button
                  key={w}
                  variant={activeHeading.weight === w ? "default" : "outline"}
                  size="sm"
                  onClick={() => setH({ weight: w })}
                >
                  {w}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Size Scale</Label>
              <span className="text-xs text-muted-foreground">
                {activeHeading.scale.toFixed(2)} → {headingPx(selectedHeading)}px
              </span>
            </div>
            <Slider
              value={[activeHeading.scale]}
              min={0.8}
              max={4.0}
              step={0.05}
              onValueChange={(v) => setH({ scale: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2">
                <MoveVertical className="w-3 h-3" /> Line Height
              </Label>
              <span className="text-xs text-muted-foreground">{activeHeading.lineHeight.toFixed(2)}</span>
            </div>
            <Slider
              value={[activeHeading.lineHeight]}
              min={0.9}
              max={2.2}
              step={0.05}
              onValueChange={(v) => setH({ lineHeight: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Letter Spacing
              </Label>
              <span className="text-xs text-muted-foreground">{activeHeading.letterSpacingEm.toFixed(2)}em</span>
            </div>
            <Slider
              value={[activeHeading.letterSpacingEm * 100]}
              min={-10}
              max={20}
              step={1}
              onValueChange={(v) => setH({ letterSpacingEm: v[0] / 100 })}
            />
          </div>
        </CardContent>
      </Card>
    );
  }, [activeHeading, selectedHeading, headingBaseSize, headingFontFamily, headings]);

  const bodyControls = useMemo(() => {
    const setB = (patch: Partial<BodyStyle>) => setBody((p) => ({ ...p, ...patch }));

    return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label>Body Font Family</Label>
            <Select value={globalFontFamily} onValueChange={setGlobalFontFamily}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Merriweather">Merriweather (Serif)</SelectItem>
                <SelectItem value="Space Mono">Space Mono (Monospace)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Body Size</Label>
              <span className="text-xs text-muted-foreground">{body.sizePx}px</span>
            </div>
            <Slider value={[body.sizePx]} min={12} max={24} step={1} onValueChange={(v) => setB({ sizePx: v[0] })} />
          </div>

          <div className="space-y-3">
            <Label>Font Weight</Label>
            <div className="grid grid-cols-3 gap-2">
              {WEIGHTS.map((w) => (
                <Button
                  key={w}
                  variant={body.weight === w ? "default" : "outline"}
                  size="sm"
                  onClick={() => setB({ weight: w })}
                >
                  {w}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2">
                <MoveVertical className="w-3 h-3" /> Line Height
              </Label>
              <span className="text-xs text-muted-foreground">{body.lineHeight.toFixed(2)}</span>
            </div>
            <Slider value={[body.lineHeight]} min={1.1} max={2.2} step={0.05} onValueChange={(v) => setB({ lineHeight: v[0] })} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Letter Spacing
              </Label>
              <span className="text-xs text-muted-foreground">{body.letterSpacingEm.toFixed(2)}em</span>
            </div>
            <Slider
              value={[body.letterSpacingEm * 100]}
              min={-5}
              max={20}
              step={1}
              onValueChange={(v) => setB({ letterSpacingEm: v[0] / 100 })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Paragraph Max Width</Label>
              <span className="text-xs text-muted-foreground">{body.maxWidthCh}ch</span>
            </div>
            <Slider value={[body.maxWidthCh]} min={40} max={90} step={1} onValueChange={(v) => setB({ maxWidthCh: v[0] })} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Paragraph Gap</Label>
              <span className="text-xs text-muted-foreground">{body.paragraphGapPx}px</span>
            </div>
            <Slider value={[body.paragraphGapPx]} min={0} max={32} step={1} onValueChange={(v) => setB({ paragraphGapPx: v[0] })} />
          </div>
        </CardContent>
      </Card>
    );
  }, [body, globalFontFamily]);

  const buttonControls = useMemo(() => {
    const setBase = (patch: Partial<ButtonBaseStyle>) => setButtonBase((p) => ({ ...p, ...patch }));
    const setColors = (patch: Partial<ButtonColors>) => {
      setButtonColors((prev) => ({
        ...prev,
        [selectedBtn]: { ...prev[selectedBtn], ...patch },
      }));
    };

    return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Button Settings</p>
                <p className="text-xs text-muted-foreground">Primary / Secondary / Outline (+ Ghost preview)</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Button Type (colors)</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => (
                <Button key={k} size="sm" variant={selectedBtn === k ? "default" : "outline"} onClick={() => setSelectedBtn(k)}>
                  {k === "primary" ? "Primary" : k === "secondary" ? "Secondary" : "Outline"}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Button Font Family</Label>
            <Select value={buttonBase.fontFamily} onValueChange={(v) => setBase({ fontFamily: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Merriweather">Merriweather (Serif)</SelectItem>
                <SelectItem value="Space Mono">Space Mono (Monospace)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Font Size</Label>
              <span className="text-xs text-muted-foreground">{buttonBase.sizePx}px</span>
            </div>
            <Slider value={[buttonBase.sizePx]} min={12} max={20} step={1} onValueChange={(v) => setBase({ sizePx: v[0] })} />
          </div>

          <div className="space-y-3">
            <Label>Font Weight</Label>
            <div className="grid grid-cols-3 gap-2">
              {WEIGHTS.filter((w) => w >= 400).map((w) => (
                <Button key={w} variant={buttonBase.weight === w ? "default" : "outline"} size="sm" onClick={() => setBase({ weight: w })}>
                  {w}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {(["bg", "text", "border", "hoverBg", "hoverText", "hoverBorder"] as const).map((key) => {
            const labelMap: Record<typeof key, string> = {
              bg: "Background",
              text: "Text",
              border: "Border",
              hoverBg: "Hover Background",
              hoverText: "Hover Text",
              hoverBorder: "Hover Border",
            };
            const val = activeBtnColors[key];

            return (
              <div key={key} className="space-y-2">
                <Label>{labelMap[key]}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={val}
                    onChange={(e) =>
                      setButtonColors((p) => ({
                        ...p,
                        [selectedBtn]: { ...p[selectedBtn], [key]: e.target.value } as any,
                      }))
                    }
                  />
                  <input
                    type="color"
                    className="h-9 w-10 rounded-md border bg-background px-1"
                    value={isHexColor(val) ? val : "#000000"}
                    onChange={(e) => setColors({ [key]: e.target.value } as any)}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }, [activeBtnColors, buttonBase.fontFamily, buttonBase.sizePx, buttonBase.weight, selectedBtn]);

  /* -----------------------------
    Preview Blocks (NO gradient)
    ✅ 4 buttons in hero
    ✅ clicking those switches left tab
    ✅ Typography card shows live font name
  ------------------------------ */
  const Pill = ({ text }: { text: string }) => (
    <span
      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold border"
      style={{
        background: mode === "light" ? mixHex(brand.accent, "#FFFFFF", 0.65) : rgba(brand.accent, 0.12),
        color: mode === "light" ? brand.dark : uiPalette.text,
        borderColor: rgba(brand.secondary, mode === "light" ? 0.35 : 0.22),
      }}
    >
      {text}
    </span>
  );

  const PreviewHeader = () => {
    const tabs = [
      { key: "colors" as const, label: "Colors" },
      { key: "headings" as const, label: "Typography" },
      { key: "body" as const, label: "Design Tokens" },
      { key: "buttons" as const, label: "Preview Gallery" },
    ];

    return (
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          borderColor: uiPalette.border,
          boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
        }}
      >
        {/* ✅ solid background (gradient removed) */}
        <div
          className="p-6 md:p-7"
          style={{
            background: mode === "light" ? brand.dark : "#06140F",
            color: "#FFFFFF",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold"
                style={{ borderColor: rgba("#ffffff", 0.35) }}
              >
                ✓
              </span>
              <div className="leading-tight">
                <div className="text-xs font-semibold opacity-90">KalpTree</div>
                <div className="text-[11px] opacity-75">Brand Guidelines</div>
              </div>
            </div>

            <div className="text-[11px] opacity-75">
              font: <b>{headingFontFamily}</b> • token-driven
            </div>
          </div>

          <div className="mt-4" style={{ fontFamily: headingFontFamily }}>
            <div
              style={{
                fontSize: `${headingPx("h2")}px`,
                fontWeight: headings.h2.weight,
                lineHeight: headings.h2.lineHeight,
                letterSpacing: `${headings.h2.letterSpacingEm}em`,
              }}
            >
              Brand Guidelines for Web
            </div>
            <div className="mt-2 text-sm opacity-85" style={{ maxWidth: 740 }}>
              Is page ka goal: user ko clearly dikhaana chahiye ki kaunse colors, fonts, aur font sizes use ho rahe hain.
              Sab kuch root tokens se control hota hai.
            </div>
          </div>

          {/* ✅ 4 buttons (clickable) */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const isActive = leftTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => onLeftTab(t.key)}
                  className="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold"
                  style={{
                    background: isActive ? rgba("#ffffff", 0.16) : rgba("#ffffff", 0.1),
                    borderColor: rgba("#ffffff", isActive ? 0.38 : 0.22),
                    color: "#ffffff",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const BrandGalleryPreview = (
    <div className="space-y-6">
      <PreviewHeader />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: uiPalette.text }}>
              Brand Preview Gallery
            </div>
            <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
              Task/goal: user ko ek glance me brand pages ka look feel samajh aata hai.
            </div>
          </div>
          <Pill text="Templates" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* BIG LEFT CARD */}
          <div className="md:col-span-7">
            <div className="rounded-2xl border overflow-hidden" style={cardPreviewStyle}>
              <div
                className="p-4 border-b"
                style={{
                  borderColor: uiPalette.border,
                  background: mode === "light" ? rgba(brand.accent, 0.12) : rgba(brand.accent, 0.08),
                }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span style={{ color: uiPalette.mutedText }}>Cover / Brand Guidelines</span>
                  <Pill text="Hero" />
                </div>
              </div>

              {/* ✅ solid hero (gradient removed) */}
              <div
                className="p-6"
                style={{
                  background: mode === "light" ? mixHex(brand.dark, "#000000", 0.08) : "#06140F",
                  color: "#ffffff",
                  minHeight: 170,
                  position: "relative",
                }}
              >
                <div style={{ fontFamily: headingFontFamily }}>
                  <div className="text-2xl font-extrabold leading-tight">KalpTree</div>
                  <div className="text-2xl font-extrabold leading-tight opacity-90">Brand Guidelines.</div>
                </div>
                <div className="mt-2 text-xs opacity-85" style={{ maxWidth: 360 }}>
                  Premium layout, consistent spacing, and token-driven design.
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-semibold"
                    style={{
                      background: rgba("#ffffff", 0.14),
                      border: `1px solid ${rgba("#ffffff", 0.22)}`,
                    }}
                  >
                    KalpTree • Web System
                  </span>
                </div>

                <div className="absolute right-5 bottom-5 text-[11px] opacity-70">v1.0</div>
              </div>

              {/* inside cards */}
              <div className="p-4 grid grid-cols-1 gap-3" style={{ background: softBg }}>
                {/* Typography */}
                <div className="rounded-xl border p-4" style={cardPreviewStyle}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">Typography</div>
                    <Pill text="Type" />
                  </div>

                  <div className="mt-3">
                    <div className="text-lg font-bold" style={{ fontFamily: headingFontFamily }}>
                      {headingFontFamily}
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: uiPalette.mutedText }}>
                      Headings + Body scale
                    </div>

                    <div className="mt-3 flex items-end gap-2" style={{ fontFamily: headingFontFamily }}>
                      <span className="text-lg font-extrabold">Aa</span>
                      <span className="text-base font-bold opacity-90">Aa</span>
                      <span className="text-sm font-semibold opacity-80">Aa</span>
                      <span className="text-xs font-medium opacity-70">Aa</span>
                      <span className="ml-auto text-[10px]" style={{ color: uiPalette.mutedText }}>
                        Scale
                      </span>
                    </div>
                  </div>
                </div>

                {/* Palette */}
                <div className="rounded-xl border p-4" style={cardPreviewStyle}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">Color Palette</div>
                    <Pill text="Colors" />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { name: "Primary", v: brand.primary },
                      { name: "Secondary", v: brand.secondary },
                      { name: "Accent", v: brand.accent },
                    ].map((c) => (
                      <div key={c.name} className="rounded-xl border overflow-hidden" style={{ borderColor: uiPalette.border }}>
                        <div style={{ height: 44, background: c.v }} />
                        <div className="p-2">
                          <div className="text-[11px] font-semibold" style={{ color: uiPalette.text }}>
                            {c.name}
                          </div>
                          <div className="text-[10px]" style={{ color: uiPalette.mutedText }}>
                            {c.v}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ✅ Buttons (4 samples) */}
                <div className="rounded-xl border p-4" style={cardPreviewStyle}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">Buttons</div>
                    <Pill text="UI" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => {
                      const v = getBtnVisual(k);
                      const label = k === "primary" ? "Primary" : k === "secondary" ? "Secondary" : "Outline";
                      return (
                        <button
                          key={k}
                          type="button"
                          className={v.className}
                          style={v.style}
                          onMouseEnter={() => setHoveredBtn(k)}
                          onMouseLeave={() => setHoveredBtn(null)}
                        >
                          {label}
                        </button>
                      );
                    })}

                    {/* 4th button (Ghost) */}
                    <button
                      type="button"
                      className="inline-flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background"
                      style={{
                        fontFamily: buttonBase.fontFamily,
                        fontSize: `${buttonBase.sizePx}px`,
                        fontWeight: buttonBase.weight as any,
                        letterSpacing: `${buttonBase.letterSpacingEm}em`,
                        textTransform: buttonBase.transform,
                        height: buttonBase.heightPx,
                        paddingLeft: buttonBase.paddingXPx,
                        paddingRight: buttonBase.paddingXPx,
                        borderRadius: buttonBase.radiusPx,
                        background: "transparent",
                        color: uiPalette.text,
                        border: `${buttonBase.borderWidthPx}px solid transparent`,
                      }}
                    >
                      Ghost
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-5 space-y-4">
            <div className="rounded-2xl border p-4" style={cardPreviewStyle}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">Brand Overview</div>
                <Pill text="About" />
              </div>
              <div className="mt-3 space-y-2">
                {[80, 55, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-2 rounded-full"
                    style={{ background: rgba(uiPalette.border, 0.9), width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-10 rounded-xl border" style={{ borderColor: uiPalette.border, background: rgba(uiPalette.bg, 0.6) }} />
                <div className="h-10 rounded-xl border" style={{ borderColor: uiPalette.border, background: rgba(uiPalette.bg, 0.6) }} />
              </div>
            </div>

            <div className="rounded-2xl border p-4" style={cardPreviewStyle}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">Brand story + values</div>
                <Pill text="Layout A" />
              </div>
              <div className="mt-3 h-20 rounded-xl border" style={{ borderColor: uiPalette.border, background: softBg }} />
            </div>

            <div className="rounded-2xl border p-4" style={cardPreviewStyle}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">Instagram Post</div>
                <Pill text="Social" />
              </div>
              <div
                className="mt-3 rounded-xl border overflow-hidden"
                style={{
                  borderColor: uiPalette.border,
                  background: mixHex(brand.accent, "#FFFFFF", mode === "light" ? 0.55 : 0.1),
                }}
              >
                <div className="p-4">
                  <div className="text-sm font-bold" style={{ color: uiPalette.text }}>
                    Build clean pages
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: uiPalette.mutedText }}>
                    Consistent tokens • premium spacing • strong CTA
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: brand.primary }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: brand.secondary }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: brand.accent }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tokens block */}
        <div
          className="mt-6 rounded-2xl border p-5"
          style={{ ...cardPreviewStyle, background: rgba(uiPalette.bg, mode === "light" ? 0.6 : 0.15) }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Design Tokens (What is being used)</div>
              <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
                Colors + fonts + sizes + radius + shadow (same page me clear).
              </div>
            </div>
            <Pill text="Tokens" />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 rounded-xl border p-4" style={cardPreviewStyle}>
              <div className="text-xs font-semibold">Font Family</div>
              <div className="mt-2 text-[11px]" style={{ color: uiPalette.mutedText }}>
                --font-body: <span className="font-mono">{cssFont(globalFontFamily)}</span>
              </div>
              <div className="mt-2 text-[11px]" style={{ color: uiPalette.mutedText }}>
                --font-heading: <span className="font-mono">{cssFont(headingFontFamily)}</span>
              </div>
            </div>

            <div className="md:col-span-6 rounded-xl border p-4" style={cardPreviewStyle}>
              <div className="text-xs font-semibold">Core Sizes</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]" style={{ color: uiPalette.mutedText }}>
                <div className="font-mono">--h1: {headingPx("h1")}px</div>
                <div className="font-mono">--h2: {headingPx("h2")}px</div>
                <div className="font-mono">--h3: {headingPx("h3")}px</div>
                <div className="font-mono">--h4: {headingPx("h4")}px</div>
                <div className="font-mono">--body: {body.sizePx}px</div>
                <div className="font-mono">--btn: {buttonBase.sizePx}px</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const HeadingsPreview = (
    <div className="space-y-6">
      <PreviewHeader />

      <div className="mt-6">
        <div className="text-sm font-semibold" style={{ color: uiPalette.text }}>
          Typography Preview
        </div>
        <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
          Change font family / sliders → yahan live update.
        </div>

        <div
          className="mt-4 rounded-2xl border p-5"
          style={{
            ...cardPreviewStyle,
            background: mode === "light" ? "#FFFFFF" : uiPalette.surface,
          }}
        >
          <div className="space-y-5" style={{ fontFamily: headingFontFamily }}>
            {(["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).map((k) => {
              const s = headings[k];
              const Tag = k as any;
              return (
                <div key={k} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono" style={{ color: uiPalette.mutedText }}>
                      {k.toUpperCase()} / {headingPx(k)}px
                    </span>
                    <span className="text-[11px]" style={{ color: uiPalette.mutedText }}>
                      w:{s.weight} · lh:{s.lineHeight.toFixed(2)} · ls:{s.letterSpacingEm.toFixed(2)}em
                    </span>
                  </div>

                  <Tag
                    style={{
                      fontSize: `${headingBaseSize * s.scale}px`,
                      fontWeight: s.weight,
                      lineHeight: s.lineHeight,
                      letterSpacing: `${s.letterSpacingEm}em`,
                      color: uiPalette.text, // ✅ FIX: always readable (was looking washed in screenshot)
                    }}
                  >
                    {k === "h1" && "Brand typography that feels premium"}
                    {k === "h2" && "Clean hierarchy for web pages"}
                    {k === "h3" && "Consistent rhythm + spacing"}
                    {k === "h4" && "Section title sample"}
                    {k === "h5" && "Small heading sample"}
                    {k === "h6" && "Label / micro heading"}
                  </Tag>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const BodyPreview = (
    <div className="space-y-6">
      <PreviewHeader />

      <div
        className="mt-6 rounded-2xl border p-5"
        style={{ ...cardPreviewStyle, background: rgba(uiPalette.bg, mode === "light" ? 0.6 : 0.15) }}
      >
        <div className="text-sm font-semibold" style={{ color: uiPalette.text }}>
          Body Preview
        </div>
        <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
          Paragraph spacing + max-width live.
        </div>

        <div className="mt-4" style={{ maxWidth: `${body.maxWidthCh}ch` }}>
          <div className="text-xs font-mono" style={{ color: uiPalette.mutedText }}>
            Body / {body.sizePx}px · w:{body.weight} · lh:{body.lineHeight.toFixed(2)} · ls:{body.letterSpacingEm.toFixed(2)}em
          </div>

          <div
            className="mt-3"
            style={{
              fontSize: `${body.sizePx}px`,
              fontWeight: body.weight,
              lineHeight: body.lineHeight,
              letterSpacing: `${body.letterSpacingEm}em`,
              color: uiPalette.text,
              fontFamily: globalFontFamily,
            }}
          >
            <p style={{ marginBottom: body.paragraphGapPx, color: uiPalette.mutedText }}>
              Tokens-based system: aap jo left side change karte ho (colors / fonts / sizes), woh instantly is preview me reflect hota hai.
            </p>
            <p style={{ color: uiPalette.mutedText }}>
              Isse user ko samajhne me asaani hoti hai ki actual website pages ka look & feel kaisa hoga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const ButtonsPreview = (
    <div className="space-y-6">
      <PreviewHeader />

      <div
        className="mt-6 rounded-2xl border p-5"
        style={{ ...cardPreviewStyle, background: rgba(uiPalette.bg, mode === "light" ? 0.6 : 0.15) }}
      >
        <div className="text-sm font-semibold" style={{ color: uiPalette.text }}>
          Buttons Preview
        </div>
        <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
          Hover to see hover colors/border.
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => {
            const label = k === "primary" ? "Primary" : k === "secondary" ? "Secondary" : "Outline";
            const v = getBtnVisual(k);
            return (
              <button
                key={k}
                type="button"
                className={v.className}
                style={v.style}
                onMouseEnter={() => setHoveredBtn(k)}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                {label}
              </button>
            );
          })}

          {/* 4th button */}
          <button
            type="button"
            className="inline-flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background"
            style={{
              fontFamily: buttonBase.fontFamily,
              fontSize: `${buttonBase.sizePx}px`,
              fontWeight: buttonBase.weight as any,
              letterSpacing: `${buttonBase.letterSpacingEm}em`,
              textTransform: buttonBase.transform,
              height: buttonBase.heightPx,
              paddingLeft: buttonBase.paddingXPx,
              paddingRight: buttonBase.paddingXPx,
              borderRadius: buttonBase.radiusPx,
              background: "transparent",
              color: uiPalette.text,
              border: `${buttonBase.borderWidthPx}px solid transparent`,
            }}
          >
            Ghost
          </button>
        </div>
      </div>
    </div>
  );

  const ColorsPreview = BrandGalleryPreview;

  const RightPreviewContent =
    leftTab === "colors"
      ? ColorsPreview
      : leftTab === "headings"
        ? HeadingsPreview
        : leftTab === "body"
          ? BodyPreview
          : ButtonsPreview;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* TOP BAR */}
      <div className="flex justify-between items-center gap-3">
        <div className="grid grid-cols-4 gap-2">
          <Button variant={leftTab === "colors" ? "default" : "outline"} onClick={() => onLeftTab("colors")}>
            Colors
          </Button>
          <Button variant={leftTab === "headings" ? "default" : "outline"} onClick={() => onLeftTab("headings")}>
            Headings
          </Button>
          <Button variant={leftTab === "body" ? "default" : "outline"} onClick={() => onLeftTab("body")}>
            Body
          </Button>
          <Button variant={leftTab === "buttons" ? "default" : "outline"} onClick={() => onLeftTab("buttons")}>
            Buttons
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ Light/Dark mode toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
            className="gap-2"
            title="Toggle Light/Dark"
          >
            {mode === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {mode === "light" ? "Light" : "Dark"}
          </Button>

          <Button
            size="sm"
            variant={rightPanel === "preview" ? "secondary" : "ghost"}
            onClick={() => {
              setRightPanel("preview");
              // ✅ requested: preview click -> typography show
              setLeftTab("headings");
            }}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>

          <Button
            size="sm"
            variant={rightPanel === "root" ? "secondary" : "ghost"}
            onClick={() => setRightPanel("root")}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" />
            Root File
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-4 space-y-6">
          {leftTab === "colors" && colorsControls}
          {leftTab === "headings" && headingControls}
          {leftTab === "body" && bodyControls}
          {leftTab === "buttons" && buttonControls}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-8">
          <Card className="h-full min-h-[580px] border-2 border-muted/40">
            <div className="border-b p-2 flex items-center justify-end gap-2 rounded-t-lg">
              {rightPanel === "root" && (
                <Button size="sm" variant="outline" onClick={handleCopyRoot} className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>

            {rightPanel === "preview" ? (
              <CardContent className="p-6 md:p-8" style={outerPreviewStyle}>
                {RightPreviewContent}
              </CardContent>
            ) : (
              <CardContent className="p-6">
                <div className="mb-3">
                  <p className="text-sm font-semibold">Root File Code (LIVE)</p>
                  <p className="text-xs text-muted-foreground">
                    Light/Dark have separate variables via <span className="font-mono">:root[data-theme="..."]</span>. Gradient removed (solid hero).
                  </p>
                </div>
                <pre className="text-xs leading-relaxed p-4 rounded-lg border bg-muted/20 overflow-auto max-h-[520px]">
                  <code>{ROOT_CSS}</code>
                </pre>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
