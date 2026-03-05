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
  Save,
  ChevronDown,
  Plus,
  Globe,
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
import ColorPallet from "./ColorPallet";
import { FontUploader } from "./Fontuploader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { transformRawToGlobalStyleModel } from "@/components/editor/style-editor/GlobalStyelModel";
import { toast } from "sonner";
import GetAlColorPallet from "@/components/admin/branding/color_pallet/GetAlColorPallet";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { ColorPicker } from "@/components/editor/color-picker/color-picker";
import AllColorPallets from "@/components/admin/users/AllColorPallets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setPalettes } from "@/hooks/slices/business/BusinessSlice";

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

type BrandColors = {
  primary: string;
  secondary: string;
  accent: string;

  /**
   * Main brand background token.
   * Maps to CSS variable `--background`.
   */
  background: string;

  text: string;
  mutedText: string;
  border: string;
  ring: string;

  /** @deprecated legacy alias for `background` */
  dark?: string;
};

/** Font entry returned from /api/admin/typography */
type FontEntry = {
  _id: string;
  name: string;
  url: string;
  fontType: string;
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
  if (!f) return "Inter, system-ui, -apple-system, Segoe UI, sans-serif";
  if (f.includes(" "))
    return `"${f}", system-ui, -apple-system, Segoe UI, sans-serif`;
  return `${f}, system-ui, -apple-system, Segoe UI, sans-serif`;
}

function normalizeBrandColors(input: any): BrandColors {
  const b = input ?? {};
  const background = b.background ?? b.dark ?? "#0B3A2A";

  return {
    primary: b.primary ?? "#1F6F43",
    secondary: b.secondary ?? "#2EA76A",
    accent: b.accent ?? "#B9F3D5",
    background,
    text: b.text ?? "#0B2A1F",
    mutedText: b.mutedText ?? "#5E6E65",
    border: b.border ?? "#DDE6E1",
    ring: b.ring ?? b.secondary ?? "#2EA76A",
    ...(b.dark ? { dark: b.dark } : {}),
  };
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
    A.b + (B.b - A.b) * t,
  );
}
function rgba(hex: string, alpha: number) {
  const c = hexToRgb(hex);
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

/* -----------------------------
  HexInput (stable, focus-safe)
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

        {/* <input
          type="color"
          className="h-9 w-10 rounded-md border bg-background px-1 "
          value={displayForPicker}
          onChange={(e) => {
            const v = e.target.value;
            lastValidRef.current = v;
            setDraft(v);
            onCommit(v);
          }}
          title="Pick color"
        /> */}

        <ColorPicker
          color={displayForPicker}
          onChange={(v) => {
            lastValidRef.current = v;
            setDraft(v);
            onCommit(v);
          }}
        />

        {/* <ColorPicker /> */}
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
export default function TypographyPage({
  type,
  handleInputChange,
}: {
  type?: string;
  handleInputChange?: any;
}) {
  /* LEFT tabs */
  const [leftTab, setLeftTab] = useState<LeftTab>("colors");

  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const data = transformRawToGlobalStyleModel(
    currentBusiness?.website?.globalStyle || "",
  );

  const dispatch = useDispatch<AppDispatch>();

  // Currently whats happening is dark is named in css as --background but i want the dark also named as background not the dark mode i am talking about variable dark. The function also called has dark named variable set so i just want that variable to be named as background instead dark so it is good.

  const [headingBaseSize, setHeadingBaseSize] = useState(17);
  // Add this useEffect:

  /** All custom fonts loaded from the API */
  const [allFonts, setAllFonts] = useState<FontEntry[]>([]);

  /* RIGHT tabs */
  const [rightPanel, setRightPanel] = useState<RightPanelTab>("preview");

  /* Light / background Mode */
  const [mode, setMode] = useState<Mode>("light");

  const [copied, setCopied] = useState(false);

  /* Brand tokens */
  const [brand, setBrand] = useState<BrandColors>({
    primary: "#1F6F43",
    secondary: "#2EA76A",
    accent: "#B9F3D5",
    background: "#0B3A2A",
    text: "#0B2A1F",
    mutedText: "#5E6E65",
    border: "#DDE6E1",
    ring: "#2EA76A",
  });

  /* ─────────────────────────────────────────
     Font state
     • bodyFontFamily  → used for body text
     • headingFontFamily → used for headings
     • buttonBase.fontFamily → used for buttons
     These are INDEPENDENT of each other.
  ───────────────────────────────────────── */
  const [bodyFontFamily, setBodyFontFamily] = useState("Inter");
  const [headingFontFamily, setHeadingFontFamily] = useState("Inter");

  /* Heading settings */

  const [selectedHeading, setSelectedHeading] = useState<HeadingKey>("h1");
  const [headings, setHeadings] = useState<Record<HeadingKey, HeadingStyle>>({
    h1: { scale: 2.5, weight: 800, lineHeight: 1.05, letterSpacingEm: -0.03 },
    h2: { scale: 2.0, weight: 800, lineHeight: 1.1, letterSpacingEm: -0.02 },
    h3: { scale: 1.5, weight: 700, lineHeight: 1.15, letterSpacingEm: -0.01 },
    h4: { scale: 1.25, weight: 700, lineHeight: 1.2, letterSpacingEm: 0 },
    h5: { scale: 1.1, weight: 600, lineHeight: 1.25, letterSpacingEm: 0 },
    h6: { scale: 1.0, weight: 600, lineHeight: 1.3, letterSpacingEm: 0.01 },
  });

  /* Body settings */
  const [body, setBody] = useState<BodyStyle>({
    sizePx: 17,
    weight: 400,
    lineHeight: 1.7,
    letterSpacingEm: 0,
    maxWidthCh: 62,
    paragraphGapPx: 14,
  });

  /* Button settings */
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

  const [buttonColors, setButtonColors] = useState<
    Record<BtnKey, ButtonColors>
  >({
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

  const headingPx = (k: HeadingKey) =>
    Math.round(headingBaseSize * headings[k].scale);

  /* ─────────────────────────────────────────
     Inject a custom font @font-face once
  ───────────────────────────────────────── */
  function ensureFontLoaded(font: FontEntry) {
    const id = `font-face-${font.name.replace(/\s+/g, "-")}`;
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      @font-face {
        font-family: '${font.name}';
        src: url('${font.url}') format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────
     Font change handlers — SEPARATE per target
  ───────────────────────────────────────── */

  /** Called when the HEADING font selector changes */
  const handleHeadingFontChange = (value: string) => {
    if (!value) return;
    setHeadingFontFamily(value);

    // If it's a custom uploaded font, inject the @font-face
    const found = allFonts.find((f) => f.name === value);
    if (found) ensureFontLoaded(found);
  };

  /** Called when the BODY font selector changes */
  const handleBodyFontChange = (value: string) => {
    if (!value) return;
    setBodyFontFamily(value);

    const found = allFonts.find((f) => f.name === value);
    if (found) ensureFontLoaded(found);
  };

  /** Called when the BUTTON font selector changes */
  const handleButtonFontChange = (value: string) => {
    if (!value) return;
    setButtonBase((p) => ({ ...p, fontFamily: value }));

    const found = allFonts.find((f) => f.name === value);
    if (found) ensureFontLoaded(found);
  };

  /* Fetch custom fonts from API on mount */
  useEffect(() => {
    (async () => {
      try {
        const req = await fetch("/api/admin/typography");
        const res = await req.json();
        setAllFonts(res.data ?? []);
      } catch (error) {
        console.error("Failed to load fonts:", error);
      }
    })();
  }, []);

  /* Sync data-theme attribute to <html> */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  /* ── Computed palette for preview (not user-editable) ── */
  const uiPalette = useMemo(() => {
    const light = {
      bgPage: "#F4F6F5",
      bgSurface: "#FFFFFF",
      textMain: brand.text,
      textMuted: brand.mutedText,
      borderSubtle: brand.border,
    };
    const dark = {
      bgPage: brand.background,
      bgSurface: mixHex(brand.background, "#FFFFFF", 0.08),
      textMain: "#FFFFFF",
      textMuted: mixHex("#FFFFFF", brand.background, 0.45),
      borderSubtle: rgba(brand.accent, 0.2),
    };
    return mode === "light" ? light : dark;
  }, [mode, brand]);

  const onLeftTab = (t: LeftTab) => {
    setLeftTab(t);
    setRightPanel("preview");
  };

  const [root_css, setRoot_Css] = useState<any>();

  const root_css_design = () => {
    const h = headings;

    const hPx: Record<HeadingKey, number> = {
      h1: Math.round(headingBaseSize * h.h1.scale),
      h2: Math.round(headingBaseSize * h.h2.scale),
      h3: Math.round(headingBaseSize * h.h3.scale),
      h4: Math.round(headingBaseSize * h.h4.scale),
      h5: Math.round(headingBaseSize * h.h5.scale),
      h6: Math.round(headingBaseSize * h.h6.scale),
    };

    const primary = clampHexOrFallback(brand.primary, "#1f286fff");
    const secondary = clampHexOrFallback(brand.secondary, "#2EA76A");
    const accent = clampHexOrFallback(brand.accent, "#B9F3D5");
    const background = clampHexOrFallback(brand.background, "#0B3A2A");
    const ring = clampHexOrFallback(brand.ring, secondary);

    const lightText = clampHexOrFallback(brand.text, "#0B2A1F");
    const lightMuted = clampHexOrFallback(brand.mutedText, "#5E6E65");
    const lightBorder = clampHexOrFallback(brand.border, "#DDE6E1");

    const darkMuted = mixHex("#EAF7F0", "#000000", 0.35);
    const darkBorder = rgba(accent, 0.22);

    const lines: string[] = [];

    lines.push(`/* =========================================================`);
    lines.push(`   BRAND GUIDELINES • GLOBAL TOKENS (COPY TO globals.css)`);
    lines.push(
      `   Usage: documentElement.setAttribute("data-theme","light|dark")`,
    );
    lines.push(
      `   ========================================================= */`,
    );
    lines.push(``);

    // ── @font-face declarations for every uploaded custom font ──
    const bodyFont = allFonts.find((d) => d.name == bodyFontFamily);
    const headingFont = allFonts.find((d) => d.name == headingFontFamily);

    if (bodyFont) {
      const ext =
        bodyFont.url.split("?")[0].split(".").pop()?.toLowerCase() ??
        "truetype";
      const formatMap: Record<string, string> = {
        ttf: "truetype",
        otf: "opentype",
        woff: "woff",
        woff2: "woff2",
        eot: "embedded-opentype",
      };
      const format = formatMap[ext] ?? "truetype";

      lines.push(`@font-face {`);
      lines.push(`  font-family: '${bodyFont.name}';`);
      lines.push(`  src: url('${bodyFont.url}') format('${format}');`);
      lines.push(`  font-display: swap;`);
      lines.push(`}`);
      lines.push(``);
    }

    if (headingFont) {
      const ext =
        headingFont.url.split("?")[0].split(".").pop()?.toLowerCase() ??
        "truetype";
      const formatMap: Record<string, string> = {
        ttf: "truetype",
        otf: "opentype",
        woff: "woff",
        woff2: "woff2",
        eot: "embedded-opentype",
      };
      const format = formatMap[ext] ?? "truetype";

      lines.push(`@font-face {`);
      lines.push(`  font-family: '${headingFont.name}';`);
      lines.push(`  src: url('${headingFont.url}') format('${format}');`);
      lines.push(`  font-display: swap;`);
      lines.push(`}`);
      lines.push(``);
    }

    lines.push(`:root {`);
    lines.push(`  /* Brand Core */`);
    lines.push(`  --primary: ${primary};`);
    lines.push(`  --secondary: ${secondary};`);
    lines.push(`  --accent: ${accent};`);
    lines.push(`  --background: ${background};`);
    lines.push(`  --ring: ${ring};`);
    lines.push(``);
    lines.push(`  /* Fonts */`);
    lines.push(`  --font-body: ${cssFont(bodyFontFamily)};`);
    lines.push(`  --font-heading: ${cssFont(headingFontFamily)};`);
    lines.push(`  --font-button: ${cssFont(buttonBase.fontFamily)};`);
    lines.push(``);
    lines.push(`  /* Headings */`);
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

    lines.push(`:root[data-theme="light"] {`);
    lines.push(`  --mode: light;`);
    lines.push(`  --bg-page: #F4F6F5; /* Main page background */`);
    lines.push(`  --bg-surface: #FFFFFF; /* Cards and containers */`);
    lines.push(`  --text-main: ${lightText}; /* Primary text */`);
    lines.push(`  --text-muted: ${lightMuted}; /* Secondary/muted text */`);
    lines.push(`  --border-subtle: ${lightBorder}; /* Borders and dividers */`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`:root[data-theme="dark"] {`);
    lines.push(`  --mode: dark;`);
    lines.push(`  --bg-page: ${background}; /* Main page background */`);
    lines.push(
      `  --bg-surface: ${mixHex(background, "#FFFFFF", 0.08)}; /* Cards and containers */`,
    );
    lines.push(`  --text-main: #FFFFFF; /* Primary text */`);
    lines.push(
      `  --text-muted: ${mixHex("#FFFFFF", background, 0.45)}; /* Secondary/muted text */`,
    );
    lines.push(
      `  --border-subtle: ${rgba(accent, 0.2)}; /* Borders and dividers */`,
    );
    lines.push(`}`);
    lines.push(``);

    lines.push(`/* Optional: Base application styles */`);
    lines.push(`html, body {`);
    lines.push(`  background: var(--bg-page);`);
    lines.push(`  color: var(--text-main);`);
    lines.push(`  font-family: var(--font-body);`);
    lines.push(`  font-size: var(--body-size);`);
    lines.push(`  font-weight: var(--body-weight);`);
    lines.push(`  line-height: var(--body-lh);`);
    lines.push(`  letter-spacing: var(--body-ls);`);
    lines.push(`}`);
    lines.push(``);

    (["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).forEach((k) => {
      lines.push(
        `${k}{font-family:var(--font-heading);font-size:var(--${k}-size);font-weight:var(--${k}-weight);line-height:var(--${k}-lh);letter-spacing:var(--${k}-ls);}`,
      );
    });
    lines.push(``);

    setRoot_Css(lines.join("\n"));

    if (handleInputChange) {
      const e = {
        target: {
          name: "businessdetails.globalStyle",
          value: lines.join("\n"),
        },
      };
      handleInputChange(e);
    }

    // return lines.join("\n");
  };

  useEffect(() => {
    root_css_design();
  }, [
    brand,
    allFonts,
    bodyFontFamily,
    headingFontFamily,
    headingBaseSize,
    headings,
    body,
    buttonBase,
    buttonColors,
  ]);

  function extractStyleContent(rawHtml: string): string {
    if (!rawHtml) return "";

    const match = rawHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    return match ? match[1].trim() : rawHtml.trim();
  }

  const palletReturn = (prev: any, editing: any, p: any) => {
    let updated: any[];

    if (!editing) {
      const exists = prev.find((x: any) => x._id === p._id);

      updated = exists
        ? prev.map((x: any) => (x._id === p._id ? p : x))
        : [p, ...prev];
    } else {
      updated = prev.map((x: any) => (x._id === editing._id ? p : x));
    }

    // 🔥 Ensure only one global palette
    if (p.isGlobal) {
      updated = updated.map((x) =>
        x._id === p._id ? { ...x, isGlobal: true } : { ...x, isGlobal: false },
      );
    }

    return updated;
  };

  /* ─────────────────────────────────────────
     ROOT CSS output
  ───────────────────────────────────────── */
  const ROOT_CSS = root_css;

  const handleSaveGlobalCss = async (type: string = "new") => {
    try {
      let res;
      if (type === "new") {
        const palette = {
          name: "Random Name",
          seed: brand.primary,
          colors: { brand, buttons: buttonColors },
          isGlobal: true,
        };
        const body = {
          colors: palette,
          global_css: ROOT_CSS,
        };

        let req = await fetch(
          `/api/admin/color-pallet?tenantId=${currentBusiness?._id}&type=typography`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );

        res = await req.json();
        const final = palletReturn(
          currentBusiness?.website?.branding.colors,
          null,
          palette,
        );
        dispatch(setPalettes(final));
      } else {
        const global = currentBusiness?.website?.branding.colors.find((d) => {
          return d.isGlobal;
        });
        const palette = {
          name: global?.name,
          seed: global?.seed,
          colors: { brand, buttons: buttonColors },
          isGlobal: true,
        };
        const body = {
          colors: palette,
          global_css: ROOT_CSS,
        };

        let req = await fetch(
          `/api/admin/color-pallet?tenantId=${currentBusiness?._id}&palletId=${global?._id}&type=typography`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );

        res = await req.json();
        const final = palletReturn(
          currentBusiness?.website?.branding.colors,
          global,
          palette,
        );
        dispatch(setPalettes(final));
      }

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.warning(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(String(error));
    }
  };

  useEffect(() => {
    if (!data) return;

    const cssOnly = extractStyleContent(
      currentBusiness?.website?.globalStyle || "",
    );

    const global = currentBusiness?.website?.branding.colors.find(
      (d) => d.isGlobal,
    );

    setRoot_Css(cssOnly);
    // Brand colors
    if (global) {
      setBrand(normalizeBrandColors(global.colors.brand));
    } else {
      setBrand(normalizeBrandColors(data.brand));
    }

    // Fonts
    if (data.fonts) {
      // Extract just the font name (before the first comma)
      const extractFontName = (fontStr: string) =>
        fontStr?.split(",")[0].trim().replace(/^"|"$/g, "") ?? "Inter";

      setBodyFontFamily(extractFontName(data.fonts.body));
      setHeadingFontFamily(extractFontName(data.fonts.heading));
      setButtonBase((prev) => ({
        ...prev,
        fontFamily: extractFontName(data.fonts.button),
      }));
    }

    // Headings
    if (data.headings) {
      setHeadings({
        h1: {
          scale: Math.round(data.headings.h1?.scale / headingBaseSize) ?? 2.5,
          weight: data.headings.h1?.weight ?? 800,
          lineHeight: data.headings.h1?.lineHeight ?? 1.05,
          letterSpacingEm: data.headings.h1?.letterSpacingEm ?? -0.03,
        },
        h2: {
          scale: Math.round(data.headings.h2?.scale / headingBaseSize) ?? 2.0,
          weight: data.headings.h2?.weight ?? 800,
          lineHeight: data.headings.h2?.lineHeight ?? 1.1,
          letterSpacingEm: data.headings.h2?.letterSpacingEm ?? -0.02,
        },
        h3: {
          scale: Math.round(data.headings.h3?.scale / headingBaseSize) ?? 1.5,
          weight: data.headings.h3?.weight ?? 700,
          lineHeight: data.headings.h3?.lineHeight ?? 1.15,
          letterSpacingEm: data.headings.h3?.letterSpacingEm ?? -0.01,
        },
        h4: {
          scale: Math.round(data.headings.h4?.scale / headingBaseSize) ?? 1.25,
          weight: data.headings.h4?.weight ?? 700,
          lineHeight: data.headings.h4?.lineHeight ?? 1.2,
          letterSpacingEm: data.headings.h4?.letterSpacingEm ?? 0,
        },
        h5: {
          scale: Math.round(data.headings.h5?.scale / headingBaseSize) ?? 1.1,
          weight: data.headings.h5?.weight ?? 600,
          lineHeight: data.headings.h5?.lineHeight ?? 1.25,
          letterSpacingEm: data.headings.h5?.letterSpacingEm ?? 0,
        },
        h6: {
          scale: Math.round(data.headings.h6?.scale / headingBaseSize) ?? 1.0,
          weight: data.headings.h6?.weight ?? 600,
          lineHeight: data.headings.h6?.lineHeight ?? 1.3,
          letterSpacingEm: data.headings.h6?.letterSpacingEm ?? 0.01,
        },
      });
    }

    // Body
    if (data.body) {
      setBody({
        sizePx: data.body.sizePx ?? 17,
        weight: data.body.weight ?? 400,
        lineHeight: data.body.lineHeight ?? 1.7,
        letterSpacingEm: data.body.letterSpacingEm ?? 0,
        maxWidthCh: data.body.maxWidthCh ?? 62,
        paragraphGapPx: data.body.paragraphGapPx ?? 14,
      });
    }

    // Button base
    if (data.buttonBase ?? data.buttons?.base) {
      const base = data.buttonBase ?? data.buttons.base;
      setButtonBase((prev) => ({
        ...prev,
        sizePx: base.sizePx ?? 14,
        weight: base.weight ?? 600,
        letterSpacingEm: base.letterSpacingEm ?? 0,
        transform: base.transform ?? "none",
        radiusPx: base.radiusPx ?? 12,
        heightPx: base.heightPx ?? 40,
        paddingXPx: base.paddingXPx ?? 16,
        borderWidthPx: base.borderWidthPx ?? 1,
        shadow: base.shadow ?? "none",
        transitionMs: base.transitionMs ?? 160,
      }));
    }

    // Button colors
    const btnColors =
      global?.colors.buttons ?? data.buttonColors ?? data.buttons;
    if (btnColors) {
      setButtonColors({
        primary: {
          bg: btnColors.primary?.bg ?? "#1F6F43",
          text: btnColors.primary?.text ?? "#FFFFFF",
          border: btnColors.primary?.border ?? "#1F6F43",
          hoverBg: btnColors.primary?.hoverBg ?? "#185A37",
          hoverText: btnColors.primary?.hoverText ?? "#FFFFFF",
          hoverBorder: btnColors.primary?.hoverBorder ?? "#185A37",
        },
        secondary: {
          bg: btnColors.secondary?.bg ?? "#EAF7F0",
          text: btnColors.secondary?.text ?? "#0B2A1F",
          border: btnColors.secondary?.border ?? "#DDE6E1",
          hoverBg: btnColors.secondary?.hoverBg ?? "#DAF2E6",
          hoverText: btnColors.secondary?.hoverText ?? "#0B2A1F",
          hoverBorder: btnColors.secondary?.hoverBorder ?? "#CFE4DA",
        },
        outline: {
          bg: btnColors.outline?.bg ?? "transparent",
          text: btnColors.outline?.text ?? "#0B2A1F",
          border: btnColors.outline?.border ?? "#CFE4DA",
          hoverBg: btnColors.outline?.hoverBg ?? "#F4FBF7",
          hoverText: btnColors.outline?.hoverText ?? "#0B2A1F",
          hoverBorder: btnColors.outline?.hoverBorder ?? "#9ED7C0",
        },
      });
    }
  }, [currentBusiness?.website?.globalStyle]);

  useEffect(() => {
    if (!allFonts.length || !data?.fonts) return;

    const extractFontName = (fontStr: string) =>
      fontStr?.split(",")[0].trim().replace(/^"|"$/g, "") ?? "Inter";

    const bodyName = extractFontName(data.fonts.body);
    const headingName = extractFontName(data.fonts.heading);
    const buttonName = extractFontName(data.fonts.button);

    [bodyName, headingName, buttonName].forEach((name) => {
      const found = allFonts.find((f) => f.name === name);
      if (found) ensureFontLoaded(found);
    });
  }, [allFonts, currentBusiness?.website?.globalStyle]);

  const handleCopyRoot = async () => {
    try {
      await navigator.clipboard.writeText(ROOT_CSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  /* ── Preview styles ── */
  const outerPreviewStyle = useMemo(
    () =>
      ({
        background: uiPalette.bgPage,
        color: uiPalette.textMain,
        fontFamily: bodyFontFamily, // body font drives outer preview text
        fontSize: `${body.sizePx}px`,
        fontWeight: body.weight,
        lineHeight: body.lineHeight,
        letterSpacing: `${body.letterSpacingEm}em`,
      }) as React.CSSProperties,
    [uiPalette, bodyFontFamily, body],
  );

  const cardPreviewStyle = useMemo(
    () =>
      ({
        background: uiPalette.bgSurface,
        borderColor: uiPalette.borderSubtle,
        color: uiPalette.textMain,
      }) as React.CSSProperties,
    [uiPalette],
  );

  const softBg = useMemo(
    () =>
      mode === "light"
        ? mixHex("#F4F6F5", brand.accent, 0.35)
        : rgba(brand.accent, 0.08),
    [mode, brand.accent],
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

  const FontOptions = ({ type }: { type?: string[] }) => {
    const finalOptions =
      type != undefined
        ? allFonts.filter((d) => type.includes(d.fontType))
        : allFonts;
    return (
      <>
        <SelectItem value="Inter">Inter</SelectItem>
        <SelectItem value="Merriweather">Merriweather (Serif)</SelectItem>
        <SelectItem value="Space Mono">Space Mono (Monospace)</SelectItem>
        {finalOptions.map((f) => (
          <SelectItem key={f._id} value={f.name}>
            {f.name}
          </SelectItem>
        ))}
      </>
    );
  };

  /* ─────────────────────────────────────────
     LEFT CONTROL PANELS
  ───────────────────────────────────────── */
  const colorsControls = useMemo(() => {
    const setC = (patch: Partial<BrandColors>) =>
      setBrand((p) => ({ ...p, ...patch }));

    const handleColorPallet = (allcolors: any) => {
      if (!allcolors) return;
      const { brand: b, buttons } = allcolors;
      if (b) setBrand(normalizeBrandColors(b));
      if (buttons) setButtonColors(buttons);
    };

    return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center gap-2 ">
              <Palette className="h-8 w-8 text-muted-foreground" />

              <div>
                <p className="text-sm font-semibold">Theme Colors</p>
                <p className="text-xs text-muted-foreground">
                  Left side change → right preview updates in real time.
                  (Background/Surface are mode-driven)
                </p>
              </div>
            </div>
          </div>

          <ColorPallet type={type} handleColorPallet={handleColorPallet} />

          <HexInput
            label="Background "
            value={brand.background}
            fallback="#0B3A2A"
            onCommit={(v) => setC({ background: v })}
          />

          <HexInput
            label="Primary"
            value={brand.primary}
            fallback="#1F6F43"
            onCommit={(v) => setC({ primary: v })}
          />
          <HexInput
            label="Secondary"
            value={brand.secondary}
            fallback="#2EA76A"
            onCommit={(v) => setC({ secondary: v })}
          />
          <HexInput
            label="Accent"
            value={brand.accent}
            fallback="#B9F3D5"
            onCommit={(v) => setC({ accent: v })}
          />

          <Separator />

          <HexInput
            label="Text (Light Mode)"
            value={brand.text}
            fallback="#0B2A1F"
            onCommit={(v) => setC({ text: v })}
          />
          <HexInput
            label="Muted Text (Light Mode)"
            value={brand.mutedText}
            fallback="#5E6E65"
            onCommit={(v) => setC({ mutedText: v })}
          />
          <HexInput
            label="Border (Light Mode)"
            value={brand.border}
            fallback="#DDE6E1"
            onCommit={(v) => setC({ border: v })}
          />
          <HexInput
            label="Ring"
            value={brand.ring}
            fallback="#2EA76A"
            onCommit={(v) => setC({ ring: v })}
          />

          <div className="rounded-lg border p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Mode Background</span>
              <span className="font-mono">{uiPalette.bgPage}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Mode Surface</span>
              <span className="font-mono">{uiPalette.bgSurface}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [brand, uiPalette.bgPage, uiPalette.bgSurface]);

  const headingControls = useMemo(() => {
    const setH = (patch: Partial<HeadingStyle>) => {
      setHeadings((prev) => ({
        ...prev,
        [selectedHeading]: { ...prev[selectedHeading], ...patch },
      }));
    };

    return (
      <Card>
        {/* FontUploader lets users upload new fonts to S3 */}
        <FontUploader
          s3Config={{
            bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
            region: process.env.NEXT_PUBLIC_AWS_REGION!,
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
          }}
        />

        <CardContent className="pt-6 space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Heading Settings</p>
                <p className="text-xs text-muted-foreground">
                  Font family only affects headings — body font is separate.
                </p>
              </div>
            </div>

            {/* ── Heading font selector ── */}
            <div className="space-y-2">
              <Label>Heading Font Family</Label>
              <Select
                value={headingFontFamily}
                onValueChange={handleHeadingFontChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <FontOptions type={["heading", "general"]} />
                </SelectContent>
              </Select>
            </div>

            {/* Preview badge showing active heading font */}
            <div
              className="rounded-md border px-3 py-2 text-sm"
              style={{ fontFamily: headingFontFamily }}
            >
              <span className="text-xs text-muted-foreground mr-2">
                Heading preview:
              </span>
              <span className="font-bold">{headingFontFamily}</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Heading Base Size</Label>
                <span className="text-xs text-muted-foreground">
                  {headingBaseSize}px
                </span>
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
              {(["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).map(
                (k) => (
                  <Button
                    key={k}
                    size="sm"
                    variant={selectedHeading === k ? "default" : "outline"}
                    onClick={() => setSelectedHeading(k)}
                  >
                    {k.toUpperCase()}
                  </Button>
                ),
              )}
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
                {activeHeading.scale.toFixed(2)} → {headingPx(selectedHeading)}
                px
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
              <span className="text-xs text-muted-foreground">
                {activeHeading.lineHeight.toFixed(2)}
              </span>
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
              <span className="text-xs text-muted-foreground">
                {activeHeading.letterSpacingEm.toFixed(2)}em
              </span>
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
  }, [
    activeHeading,
    selectedHeading,
    headingBaseSize,
    headingFontFamily,
    headings,
    allFonts,
  ]);

  const bodyControls = useMemo(() => {
    const setB = (patch: Partial<BodyStyle>) =>
      setBody((p) => ({ ...p, ...patch }));

    return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          {/* ── Body font selector ── */}
          <div className="space-y-2">
            <Label>Body Font Family</Label>
            <Select value={bodyFontFamily} onValueChange={handleBodyFontChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <FontOptions type={["body", "general"]} />
              </SelectContent>
            </Select>
          </div>

          {/* Preview badge showing active body font */}
          <div
            className="rounded-md border px-3 py-2 text-sm"
            style={{ fontFamily: bodyFontFamily }}
          >
            <span className="text-xs text-muted-foreground mr-2">
              Body preview:
            </span>
            {bodyFontFamily} — The quick brown fox
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Body Size</Label>
              <span className="text-xs text-muted-foreground">
                {body.sizePx}px
              </span>
            </div>
            <Slider
              value={[body.sizePx]}
              min={12}
              max={24}
              step={1}
              onValueChange={(v) => setB({ sizePx: v[0] })}
            />
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
              <span className="text-xs text-muted-foreground">
                {body.lineHeight.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[body.lineHeight]}
              min={1.1}
              max={2.2}
              step={0.05}
              onValueChange={(v) => setB({ lineHeight: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Letter Spacing
              </Label>
              <span className="text-xs text-muted-foreground">
                {body.letterSpacingEm.toFixed(2)}em
              </span>
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
              <span className="text-xs text-muted-foreground">
                {body.maxWidthCh}ch
              </span>
            </div>
            <Slider
              value={[body.maxWidthCh]}
              min={40}
              max={90}
              step={1}
              onValueChange={(v) => setB({ maxWidthCh: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Paragraph Gap</Label>
              <span className="text-xs text-muted-foreground">
                {body.paragraphGapPx}px
              </span>
            </div>
            <Slider
              value={[body.paragraphGapPx]}
              min={0}
              max={32}
              step={1}
              onValueChange={(v) => setB({ paragraphGapPx: v[0] })}
            />
          </div>
        </CardContent>
      </Card>
    );
  }, [body, bodyFontFamily, allFonts]);

  const buttonControls = useMemo(() => {
    const setBase = (patch: Partial<ButtonBaseStyle>) =>
      setButtonBase((p) => ({ ...p, ...patch }));
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
                <p className="text-xs text-muted-foreground">
                  Primary / Secondary / Outline (+ Ghost preview)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Button Type (colors)</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => (
                <Button
                  key={k}
                  size="sm"
                  variant={selectedBtn === k ? "default" : "outline"}
                  onClick={() => setSelectedBtn(k)}
                >
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* ── Button font selector ── */}
          <div className="space-y-2">
            <Label>Button Font Family</Label>
            <Select
              value={buttonBase.fontFamily}
              onValueChange={handleButtonFontChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <FontOptions />
              </SelectContent>
            </Select>
          </div>

          {/* Preview badge showing active button font */}
          <div
            className="rounded-md border px-3 py-2 text-sm"
            style={{ fontFamily: buttonBase.fontFamily }}
          >
            <span className="text-xs text-muted-foreground mr-2">
              Button font:
            </span>
            <span className="font-semibold">{buttonBase.fontFamily}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Font Size</Label>
              <span className="text-xs text-muted-foreground">
                {buttonBase.sizePx}px
              </span>
            </div>
            <Slider
              value={[buttonBase.sizePx]}
              min={12}
              max={20}
              step={1}
              onValueChange={(v) => setBase({ sizePx: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <Label>Font Weight</Label>
            <div className="grid grid-cols-3 gap-2">
              {WEIGHTS.filter((w) => w >= 400).map((w) => (
                <Button
                  key={w}
                  variant={buttonBase.weight === w ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBase({ weight: w })}
                >
                  {w}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {(
            [
              "bg",
              "text",
              "border",
              "hoverBg",
              "hoverText",
              "hoverBorder",
            ] as const
          ).map((key) => {
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
                        [selectedBtn]: {
                          ...p[selectedBtn],
                          [key]: e.target.value,
                        } as any,
                      }))
                    }
                  />
                  <input
                    type="color"
                    className="h-9 w-10 rounded-md border bg-background px-1"
                    value={isHexColor(val) ? val : "#000000"}
                    onChange={(e) =>
                      setColors({ [key]: e.target.value } as any)
                    }
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }, [
    activeBtnColors,
    buttonBase.fontFamily,
    buttonBase.sizePx,
    buttonBase.weight,
    selectedBtn,
    allFonts,
  ]);

  /* ─────────────────────────────────────────
     PREVIEW BLOCKS
  ───────────────────────────────────────── */
  const Pill = ({ text }: { text: string }) => (
    <span
      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold border"
      style={{
        background:
          mode === "light"
            ? mixHex(brand.accent, "#FFFFFF", 0.75)
            : rgba(brand.accent, 0.15),
        color:
          mode === "light"
            ? mixHex(brand.background, "#000000", 0.2)
            : "#FFFFFF",
        borderColor: rgba(brand.secondary, mode === "light" ? 0.3 : 0.4),
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
          borderColor: uiPalette.borderSubtle,
          boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="p-6 md:p-7"
          style={{
            background: brand.primary,
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
              heading: <b>{headingFontFamily}</b> • body:{" "}
              <b>{bodyFontFamily}</b>
            </div>
          </div>

          {/* Heading text — uses headingFontFamily */}
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
          </div>

          {/* Body paragraph — uses bodyFontFamily */}
          <p
            className="mt-2 text-sm opacity-85"
            style={{ maxWidth: 740, fontFamily: bodyFontFamily }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>

          {/* Tab pills */}
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
                    // button font family applied here
                    fontFamily: buttonBase.fontFamily,
                    background: isActive
                      ? rgba("#ffffff", 0.16)
                      : rgba("#ffffff", 0.1),
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

  /* ── Brand Gallery ── */
  const BrandGalleryPreview = (
    <div className="space-y-6">
      <PreviewHeader />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold"
              style={{ color: uiPalette.textMain, fontFamily: bodyFontFamily }}
            >
              Brand Preview Gallery
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: uiPalette.textMuted, fontFamily: bodyFontFamily }}
            >
              Live token-driven preview across all brand elements.
            </div>
          </div>
          <Pill text="Templates" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* BIG LEFT CARD */}
          <div className="md:col-span-7">
            <div
              className="rounded-2xl border overflow-hidden"
              style={cardPreviewStyle}
            >
              <div
                className="p-4 border-b"
                style={{
                  borderColor: uiPalette.borderSubtle,
                  background:
                    mode === "light"
                      ? rgba(brand.accent, 0.12)
                      : rgba(brand.accent, 0.08),
                }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span style={{ color: uiPalette.textMuted }}>
                    Cover / Brand Guidelines
                  </span>
                  <Pill text="Hero" />
                </div>
              </div>

              <div
                className="p-6"
                style={{
                  background: brand.primary,
                  color: "#FFFFFF",
                  minHeight: 170,
                  position: "relative",
                }}
              >
                {/* Heading font */}
                <div style={{ fontFamily: headingFontFamily }}>
                  <div className="text-2xl font-extrabold leading-tight">
                    KalpTree
                  </div>
                  <div className="text-2xl font-extrabold leading-tight opacity-90">
                    Brand Guidelines.
                  </div>
                </div>
                {/* Body font */}
                <div
                  className="mt-2 text-xs opacity-85"
                  style={{ maxWidth: 360, fontFamily: bodyFontFamily }}
                >
                  Premium layout, consistent spacing, and token-driven design.
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-semibold"
                    style={{
                      fontFamily: buttonBase.fontFamily,
                      background: rgba("#ffffff", 0.14),
                      border: `1px solid ${rgba("#ffffff", 0.22)}`,
                    }}
                  >
                    KalpTree • Web System
                  </span>
                </div>

                <div className="absolute right-5 bottom-5 text-[11px] opacity-70">
                  v1.0
                </div>
              </div>

              {/* Inside cards */}
              <div
                className="p-4 grid grid-cols-1 gap-3"
                style={{ background: softBg }}
              >
                {/* Typography card */}
                <div className="rounded-xl border p-4" style={cardPreviewStyle}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">Typography</div>
                    <Pill text="Type" />
                  </div>

                  <div className="mt-3">
                    <div
                      className="text-lg font-bold"
                      style={{ fontFamily: headingFontFamily }}
                    >
                      {headingFontFamily}
                    </div>
                    <div
                      className="text-[11px] mt-1"
                      style={{
                        color: uiPalette.textMuted,
                        fontFamily: bodyFontFamily,
                      }}
                    >
                      Headings:{" "}
                      <b style={{ fontFamily: headingFontFamily }}>
                        {headingFontFamily}
                      </b>
                      &nbsp;• Body:{" "}
                      <b style={{ fontFamily: bodyFontFamily }}>
                        {bodyFontFamily}
                      </b>
                    </div>

                    <div
                      className="mt-3 flex items-end gap-2"
                      style={{ fontFamily: headingFontFamily }}
                    >
                      <span className="text-lg font-extrabold">Aa</span>
                      <span className="text-base font-bold opacity-90">Aa</span>
                      <span className="text-sm font-semibold opacity-80">
                        Aa
                      </span>
                      <span className="text-xs font-medium opacity-70">Aa</span>
                      <span
                        className="ml-auto text-[10px]"
                        style={{ color: uiPalette.textMuted }}
                      >
                        Scale
                      </span>
                    </div>
                  </div>
                </div>

                {/* Palette card */}
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
                      <div
                        key={c.name}
                        className="rounded-xl border overflow-hidden"
                        style={{ borderColor: uiPalette.borderSubtle }}
                      >
                        <div style={{ height: 44, background: c.v }} />
                        <div className="p-2">
                          <div
                            className="text-[11px] font-semibold"
                            style={{
                              color: uiPalette.textMain,
                              fontFamily: bodyFontFamily,
                            }}
                          >
                            {c.name}
                          </div>
                          <div
                            className="text-[10px]"
                            style={{ color: uiPalette.textMuted }}
                          >
                            {c.v}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons card */}
                <div className="rounded-xl border p-4" style={cardPreviewStyle}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">Buttons</div>
                    <Pill text="UI" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["primary", "secondary", "outline"] as BtnKey[]).map(
                      (k) => {
                        const v = getBtnVisual(k);
                        const label =
                          k === "primary"
                            ? "Primary"
                            : k === "secondary"
                              ? "Secondary"
                              : "Outline";
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
                      },
                    )}

                    {/* Ghost button */}
                    <button
                      type="button"
                      className="inline-flex items-center justify-center select-none outline-none"
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
                        color: uiPalette.textMain,
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
                <div
                  className="text-xs font-semibold"
                  style={{ fontFamily: bodyFontFamily }}
                >
                  Brand Overview
                </div>
                <Pill text="About" />
              </div>
              <div className="mt-3 space-y-2">
                {[80, 55, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-2 rounded-full"
                    style={{
                      background: rgba(uiPalette.borderSubtle, 0.9),
                      width: `${w}%`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div
                  className="h-10 rounded-xl border"
                  style={{
                    borderColor: uiPalette.borderSubtle,
                    background: rgba(uiPalette.bgPage, 0.6),
                  }}
                />
                <div
                  className="h-10 rounded-xl border"
                  style={{
                    borderColor: uiPalette.borderSubtle,
                    background: rgba(uiPalette.bgPage, 0.6),
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border p-4" style={cardPreviewStyle}>
              <div className="flex items-center justify-between">
                <div
                  className="text-xs font-semibold"
                  style={{ fontFamily: bodyFontFamily }}
                >
                  Brand story + values
                </div>
                <Pill text="Layout A" />
              </div>
              <div
                className="mt-3 h-20 rounded-xl border"
                style={{
                  borderColor: uiPalette.borderSubtle,
                  background: softBg,
                }}
              />
            </div>

            <div className="rounded-2xl border p-4" style={cardPreviewStyle}>
              <div className="flex items-center justify-between">
                <div
                  className="text-xs font-semibold"
                  style={{ fontFamily: bodyFontFamily }}
                >
                  Instagram Post
                </div>
                <Pill text="Social" />
              </div>
              <div
                className="mt-3 rounded-xl border overflow-hidden"
                style={{
                  borderColor: uiPalette.borderSubtle,
                  background:
                    mode === "light"
                      ? mixHex(brand.accent, "#FFFFFF", 0.55)
                      : mixHex(brand.accent, brand.background, 0.12),
                }}
              >
                <div className="p-4">
                  <div
                    className="text-sm font-bold"
                    style={{
                      color: uiPalette.textMain,
                      fontFamily: headingFontFamily,
                    }}
                  >
                    Build clean pages
                  </div>
                  <div
                    className="text-[11px] mt-1"
                    style={{
                      color: uiPalette.textMuted,
                      fontFamily: bodyFontFamily,
                    }}
                  >
                    Consistent tokens • premium spacing • strong CTA
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: brand.primary }}
                    />
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: brand.secondary }}
                    />
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: brand.accent }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design Tokens block */}
        <div
          className="mt-6 rounded-2xl border p-5"
          style={{
            ...cardPreviewStyle,
            background: rgba(uiPalette.bgPage, mode === "light" ? 0.6 : 0.15),
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-sm font-semibold"
                style={{ fontFamily: bodyFontFamily }}
              >
                Design Tokens
              </div>
              <div
                className="text-xs mt-1"
                style={{
                  color: uiPalette.textMuted,
                  fontFamily: bodyFontFamily,
                }}
              >
                Colors + fonts + sizes + radius + shadow — all token-driven.
              </div>
            </div>
            <Pill text="Tokens" />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div
              className="md:col-span-6 rounded-xl border p-4"
              style={cardPreviewStyle}
            >
              <div
                className="text-xs font-semibold"
                style={{ fontFamily: bodyFontFamily }}
              >
                Font Families
              </div>
              <div
                className="mt-2 text-[11px]"
                style={{ color: uiPalette.textMuted }}
              >
                <div>
                  --font-body:{" "}
                  <span
                    className="font-mono"
                    style={{ fontFamily: bodyFontFamily }}
                  >
                    {bodyFontFamily}
                  </span>
                </div>
                <div className="mt-1">
                  --font-heading:{" "}
                  <span
                    className="font-mono"
                    style={{ fontFamily: headingFontFamily }}
                  >
                    {headingFontFamily}
                  </span>
                </div>
                <div className="mt-1">
                  --font-button:{" "}
                  <span
                    className="font-mono"
                    style={{ fontFamily: buttonBase.fontFamily }}
                  >
                    {buttonBase.fontFamily}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="md:col-span-6 rounded-xl border p-4"
              style={cardPreviewStyle}
            >
              <div
                className="text-xs font-semibold"
                style={{ fontFamily: bodyFontFamily }}
              >
                Core Sizes
              </div>
              <div
                className="mt-2 grid grid-cols-2 gap-2 text-[11px]"
                style={{ color: uiPalette.textMuted }}
              >
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

  /* ── Headings Preview ── */
  const HeadingsPreview = (
    <div className="space-y-6">
      <PreviewHeader />

      <div className="mt-6">
        <div
          className="text-sm font-semibold"
          style={{ color: uiPalette.textMain, fontFamily: bodyFontFamily }}
        >
          Typography Preview
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: uiPalette.textMuted, fontFamily: bodyFontFamily }}
        >
          Headings use{" "}
          <b style={{ fontFamily: headingFontFamily }}>{headingFontFamily}</b> •
          Body uses{" "}
          <b style={{ fontFamily: bodyFontFamily }}>{bodyFontFamily}</b>
        </div>

        <div
          className="mt-4 rounded-2xl border p-5"
          style={{
            ...cardPreviewStyle,
            background: mode === "light" ? "#FFFFFF" : uiPalette.bgSurface,
          }}
        >
          <div className="space-y-5">
            {(["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).map((k) => {
              const s = headings[k];
              const Tag = k as any;
              return (
                <div key={k} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: uiPalette.textMuted }}
                    >
                      {k.toUpperCase()} / {headingPx(k)}px
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: uiPalette.textMuted }}
                    >
                      w:{s.weight} · lh:{s.lineHeight.toFixed(2)} · ls:
                      {s.letterSpacingEm.toFixed(2)}em
                    </span>
                  </div>

                  <Tag
                    style={{
                      fontFamily: headingFontFamily,
                      fontSize: `${headingBaseSize * s.scale}px`,
                      fontWeight: s.weight,
                      lineHeight: s.lineHeight,
                      letterSpacing: `${s.letterSpacingEm}em`,
                      color: uiPalette.textMain,
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

  /* ── Body Preview ── */
  const BodyPreview = (
    <div className="space-y-6">
      <PreviewHeader />

      <div
        className="mt-6 rounded-2xl border p-5"
        style={{
          ...cardPreviewStyle,
          background: rgba(uiPalette.bgPage, mode === "light" ? 0.6 : 0.15),
        }}
      >
        <div
          className="text-sm font-semibold"
          style={{ color: uiPalette.textMain, fontFamily: bodyFontFamily }}
        >
          Body Preview
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: uiPalette.textMuted, fontFamily: bodyFontFamily }}
        >
          Paragraph spacing + max-width live.
        </div>

        <div className="mt-4" style={{ maxWidth: `${body.maxWidthCh}ch` }}>
          <div
            className="text-xs font-mono"
            style={{ color: uiPalette.textMuted }}
          >
            Body / {body.sizePx}px · w:{body.weight} · lh:
            {body.lineHeight.toFixed(2)} · ls:{body.letterSpacingEm.toFixed(2)}
            em · font: {bodyFontFamily}
          </div>

          <div
            className="mt-3"
            style={{
              fontSize: `${body.sizePx}px`,
              fontWeight: body.weight,
              lineHeight: body.lineHeight,
              letterSpacing: `${body.letterSpacingEm}em`,
              color: uiPalette.textMain,
              fontFamily: bodyFontFamily,
            }}
          >
            <p
              style={{
                marginBottom: body.paragraphGapPx,
                color: uiPalette.textMuted,
              }}
            >
              Tokens-based system: all changes on the left (colors, fonts,
              sizes) instantly reflect in this preview. This gives you a clear
              picture of what your website pages will look and feel like.
            </p>
            <p style={{ color: uiPalette.textMuted }}>
              Good typography isn't just about choosing a font — it's about
              establishing a rhythm. Line-height, letter-spacing, paragraph
              gaps, and max-width all work together to create readable,
              comfortable prose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Buttons Preview ── */
  const ButtonsPreview = (
    <div className="space-y-6">
      <PreviewHeader />

      <div
        className="mt-6 rounded-2xl border p-5"
        style={{
          ...cardPreviewStyle,
          background: rgba(uiPalette.bgPage, mode === "light" ? 0.6 : 0.15),
        }}
      >
        <div
          className="text-sm font-semibold"
          style={{ color: uiPalette.textMain, fontFamily: bodyFontFamily }}
        >
          Buttons Preview
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: uiPalette.textMuted, fontFamily: bodyFontFamily }}
        >
          Hover to see hover colors/border • Font:{" "}
          <b style={{ fontFamily: buttonBase.fontFamily }}>
            {buttonBase.fontFamily}
          </b>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => {
            const label =
              k === "primary"
                ? "Primary"
                : k === "secondary"
                  ? "Secondary"
                  : "Outline";
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

          {/* Ghost */}
          <button
            type="button"
            className="inline-flex items-center justify-center select-none outline-none"
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
              color: uiPalette.textMain,
              border: `${buttonBase.borderWidthPx}px solid transparent`,
            }}
          >
            Ghost
          </button>
        </div>
      </div>
    </div>
  );

  const RightPreviewContent =
    leftTab === "colors"
      ? BrandGalleryPreview
      : leftTab === "headings"
        ? HeadingsPreview
        : leftTab === "body"
          ? BodyPreview
          : ButtonsPreview;

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <>
      <GetAlColorPallet />
      <div className="min-h-screen px-3 pt-1">
        <div className="pb-6">
          <BreadCrumbPage />
        </div>
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
          {/* TOP BAR */}
          <div className="flex justify-between items-center gap-3">
            <div className="grid grid-cols-4 gap-2">
              {(["colors", "headings", "body", "buttons"] as LeftTab[]).map(
                (t) => (
                  <Button
                    key={t}
                    variant={leftTab === t ? "default" : "outline"}
                    onClick={() => onLeftTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ),
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setMode((m) => (m === "light" ? "dark" : "light"))
                }
                className="gap-2"
                title="Toggle Light/Dark"
              >
                {mode === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {mode === "light" ? "Light" : "Dark"}
              </Button>

              <Button
                size="sm"
                variant={rightPanel === "preview" ? "secondary" : "ghost"}
                onClick={() => {
                  setRightPanel("preview");
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

              {!type && type !== "onboard" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant={rightPanel === "root" ? "secondary" : "default"}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                      <ChevronDown className="h-4 w-4 opacity-80" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel>Save options</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => handleSaveGlobalCss("global")}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Save Global
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleSaveGlobalCss("new")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Save New
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyRoot}
                      className="gap-2"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  )}
                </div>

                {rightPanel === "preview" ? (
                  <CardContent className="p-6 md:p-8" style={outerPreviewStyle}>
                    {RightPreviewContent}
                  </CardContent>
                ) : (
                  <CardContent className="p-6 ">
                    <div className="mb-3">
                      <p className="text-sm font-semibold">
                        Root File Code (LIVE)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Light/background have separate variables via{" "}
                        <span className="font-mono">
                          :root[data-theme="..."]
                        </span>
                        . Body, Heading, and Button fonts are tracked
                        independently.
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
      </div>
    </>
  );
}
