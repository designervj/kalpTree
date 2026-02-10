import React, { useMemo, useEffect } from "react";
import {
  BodyStyle,
  BrandColors,
  BtnKey,
  ButtonBaseStyle,
  ButtonColors,
  HeadingKey,
  HeadingStyle,
  LeftTab,
  Mode,
  RightPanelTab,
} from "../GlobalStyleModal";
import {
  clampHexOrFallback,
  cssFont,
  mixHex,
  rgba,
  shadowToCss,
} from "../util/ColorFunction";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, Eye, Code2, Check, Copy } from "lucide-react";
import BrandGalleryPreview from "./BrandGalleryPreview";
import HeadingsPreview from "./HeadingsPreview";
import BodyPreview from "./BodyPreview";
import ButtonsPreview from "./ButtonsPreview";

interface ShowStyleProps {
  leftTab: LeftTab;
  onLeftTab: (t: LeftTab) => void;
  rightPanel: RightPanelTab;
  setRightPanel: (t: RightPanelTab) => void;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  brand: BrandColors;
  globalFontFamily: string;
  headingFontFamily: string;
  headingBaseSize: number;
  headings: Record<HeadingKey, HeadingStyle>;
  body: BodyStyle;
  buttonBase: ButtonBaseStyle;
  buttonColors: Record<BtnKey, ButtonColors>;
  hoveredBtn: BtnKey | null;
  setHoveredBtn: (k: BtnKey | null) => void;
}

const ShowStyle = ({
  leftTab,
  onLeftTab,
  rightPanel,
  setRightPanel,
  mode,
  setMode,
  brand,
  globalFontFamily,
  headingFontFamily,
  headingBaseSize,
  headings,
  body,
  buttonBase,
  buttonColors,
  hoveredBtn,
  setHoveredBtn,
}: ShowStyleProps) => {
  const [copied, setCopied] = React.useState(false);

  // --- Defensive fallbacks (Top Level) ---
  const h = headings || {
    h1: { scale: 2.5, weight: 800, lineHeight: 1.05, letterSpacingEm: -0.03 },
    h2: { scale: 2.0, weight: 800, lineHeight: 1.1, letterSpacingEm: -0.02 },
    h3: { scale: 1.5, weight: 700, lineHeight: 1.15, letterSpacingEm: -0.01 },
    h4: { scale: 1.25, weight: 700, lineHeight: 1.2, letterSpacingEm: 0 },
    h5: { scale: 1.1, weight: 600, lineHeight: 1.25, letterSpacingEm: 0 },
    h6: { scale: 1.0, weight: 600, lineHeight: 1.3, letterSpacingEm: 0.01 },
  };
  const b = body || {
    sizePx: 17,
    weight: 400,
    lineHeight: 1.7,
    letterSpacingEm: 0,
    maxWidthCh: 62,
    paragraphGapPx: 14,
  };
  const bb = buttonBase || {
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
  };
  const bc = buttonColors || {
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
      text: "#1F6F43",
      border: "#EAF7F0",
      hoverBg: "#D4EFDF",
      hoverText: "#185A37",
      hoverBorder: "#D4EFDF",
    },
    outline: {
      bg: "transparent",
      text: "#1F6F43",
      border: "#1F6F43",
      hoverBg: "#EAF7F0",
      hoverText: "#185A37",
      hoverBorder: "#185A37",
    },
  };

  // 1) Computed Palette
  const uiPalette = useMemo(() => {
    const light = {
      bg: "#F4F6F5",
      surface: "#FFFFFF",
      text: brand?.text || "#0B2A1F",
      mutedText: brand?.mutedText || "#5E6E65",
      border: brand?.border || "#DDE6E1",
    };
    const dark = {
      bg: "#071B14",
      surface: "#0B2A1F",
      text: "#EAF7F0",
      mutedText: mixHex("#EAF7F0", "#000000", 0.35),
      border: rgba("#B9F3D5", 0.22),
    };
    return mode === "light" ? light : dark;
  }, [mode, brand?.text, brand?.mutedText, brand?.border]);

  // 2) ROOT_CSS Generation (MATCHING ORIGINAL FORMATTING)
  const ROOT_CSS = useMemo(() => {
    const hPx: Record<HeadingKey, number> = {
      h1: Math.round(headingBaseSize * (h.h1?.scale || 1)),
      h2: Math.round(headingBaseSize * (h.h2?.scale || 1)),
      h3: Math.round(headingBaseSize * (h.h3?.scale || 1)),
      h4: Math.round(headingBaseSize * (h.h4?.scale || 1)),
      h5: Math.round(headingBaseSize * (h.h5?.scale || 1)),
      h6: Math.round(headingBaseSize * (h.h6?.scale || 1)),
    };

    const primary = clampHexOrFallback(brand?.primary || "", "#1F6F43");
    const secondary = clampHexOrFallback(brand?.secondary || "", "#2EA76A");
    const accent = clampHexOrFallback(brand?.accent || "", "#B9F3D5");
    const darkCol = clampHexOrFallback(brand?.dark || "", "#0B3A2A");
    const ring = clampHexOrFallback(brand?.ring || secondary, secondary);

    const lightBg = "#F4F6F5";
    const lightSurface = "#FFFFFF";
    const lightText = clampHexOrFallback(brand?.text || "", "#0B2A1F");
    const lightMuted = clampHexOrFallback(brand?.mutedText || "", "#5E6E65");
    const lightBorder = clampHexOrFallback(brand?.border || "", "#DDE6E1");

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
    lines.push(`  --dark: ${darkCol};`);
    lines.push(`  --ring: ${ring};`);
    lines.push(``);
    lines.push(`  /* Fonts */`);
    lines.push(`  --font-body: ${cssFont(globalFontFamily)};`);
    lines.push(`  --font-heading: ${cssFont(headingFontFamily)};`);
    lines.push(`  --font-button: ${cssFont(bb.fontFamily)};`);
    lines.push(``);
    lines.push(`  /* Headings (PX only) */`);
    (["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).forEach((k) => {
      const s = h[k];
      lines.push(`  --${k}-size: ${hPx[k]}px;`);
      lines.push(`  --${k}-weight: ${s?.weight || 700};`);
      lines.push(`  --${k}-lh: ${s?.lineHeight || 1.2};`);
      lines.push(`  --${k}-ls: ${s?.letterSpacingEm || 0}em;`);
    });
    lines.push(``);
    lines.push(`  /* Body */`);
    lines.push(`  --body-size: ${b.sizePx}px;`);
    lines.push(`  --body-weight: ${b.weight};`);
    lines.push(`  --body-lh: ${b.lineHeight};`);
    lines.push(`  --body-ls: ${b.letterSpacingEm}em;`);
    lines.push(`  --body-maxw: ${b.maxWidthCh}ch;`);
    lines.push(`  --body-paragraph-gap: ${b.paragraphGapPx}px;`);
    lines.push(``);
    lines.push(`  /* Buttons (base) */`);
    lines.push(`  --btn-size: ${bb.sizePx}px;`);
    lines.push(`  --btn-weight: ${bb.weight};`);
    lines.push(`  --btn-ls: ${bb.letterSpacingEm}em;`);
    lines.push(`  --btn-transform: ${bb.transform};`);
    lines.push(`  --btn-radius: ${bb.radiusPx}px;`);
    lines.push(`  --btn-height: ${bb.heightPx}px;`);
    lines.push(`  --btn-pad-x: ${bb.paddingXPx}px;`);
    lines.push(`  --btn-border-w: ${bb.borderWidthPx}px;`);
    lines.push(`  --btn-shadow: ${shadowToCss(bb.shadow)};`);
    lines.push(`  --btn-transition: ${bb.transitionMs}ms;`);
    lines.push(``);
    (["primary", "secondary", "outline"] as BtnKey[]).forEach((k) => {
      const c = bc[k];
      lines.push(`  /* Button: ${k.toUpperCase()} */`);
      lines.push(`  --btn-${k}-bg: ${c?.bg || ""};`);
      lines.push(`  --btn-${k}-text: ${c?.text || ""};`);
      lines.push(`  --btn-${k}-border: ${c?.border || ""};`);
      lines.push(`  --btn-${k}-hover-bg: ${c?.hoverBg || ""};`);
      lines.push(`  --btn-${k}-hover-text: ${c?.hoverText || ""};`);
      lines.push(`  --btn-${k}-hover-border: ${c?.hoverBorder || ""};`);
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

  // 3) Inject styles for preview
  useEffect(() => {
    const styleId = "preview-global-styles";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = ROOT_CSS;
  }, [ROOT_CSS]);

  const handleCopyRoot = async () => {
    try {
      await navigator.clipboard.writeText(ROOT_CSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  // 4) Derived preview styles
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
        ? mixHex("#F4F6F5", brand?.accent || "", 0.35)
        : rgba(brand?.accent || "", 0.08),
    [mode, brand?.accent]
  );

  const headingPx = (k: HeadingKey) =>
    Math.round(headingBaseSize * (h[k]?.scale || 1));

  const RightPreviewContent = useMemo(() => {
    const commonProps = {
      uiPalette,
      mode,
      brand,
      headingFontFamily,
      headings: h,
      headingPx,
      leftTab,
      onLeftTab,
      cardPreviewStyle,
    };

    if (leftTab === "colors") {
      return (
        <BrandGalleryPreview
          {...commonProps}
          softBg={softBg}
          buttonColors={bc}
          hoveredBtn={hoveredBtn}
          setHoveredBtn={setHoveredBtn}
          buttonBase={bb}
          globalFontFamily={globalFontFamily}
          body={b}
        />
      );
    }
    if (leftTab === "headings") {
      return <HeadingsPreview {...commonProps} headingBaseSize={headingBaseSize} />;
    }
    if (leftTab === "body") {
      return <BodyPreview {...commonProps} body={b} globalFontFamily={globalFontFamily} />;
    }
    return (
      <ButtonsPreview
        {...commonProps}
        buttonBase={bb}
        buttonColors={bc}
        hoveredBtn={hoveredBtn}
        setHoveredBtn={setHoveredBtn}
      />
    );
  }, [
    leftTab,
    uiPalette,
    mode,
    brand,
    headingFontFamily,
    h,
    headingPx,
    onLeftTab,
    cardPreviewStyle,
    softBg,
    bc,
    hoveredBtn,
    setHoveredBtn,
    bb,
    globalFontFamily,
    b,
    headingBaseSize,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3">
        <div className="grid grid-cols-4 gap-2">
          {(["colors", "headings", "body", "buttons"] as const).map((id) => (
            <Button
              key={id}
              variant={leftTab === id ? "default" : "outline"}
              onClick={() => onLeftTab(id)}
              className="capitalize"
            >
              {id}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
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
              onLeftTab("headings");
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
                Light/Dark have separate variables via <code>:root[data-theme="..."]</code>.
              </p>
            </div>
            <pre className="text-xs leading-relaxed p-4 rounded-lg border bg-muted/20 overflow-auto max-h-[520px]">
              <code>{ROOT_CSS}</code>
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ShowStyle;

