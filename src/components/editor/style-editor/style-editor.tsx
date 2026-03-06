"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Editor } from "grapesjs";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Plus,
  Strikethrough,
  Underline,
  X,
} from "lucide-react";

import { ColorPicker } from "@/components/editor/color-picker/color-picker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { StyleState } from "../../../../types/editor";
import { useEditorContext } from "../EditorContext";
import { AttributesEditor } from "../attributes-editor/attributes-editor";

/* =========================================================
   DIVI-STYLE / DARK TYPOGRAPHY PANEL
   ========================================================= */

/* ──────────────────────────────────────────────────────────
   WEBFLOW-STYLE LIGHT PANEL TOKENS
   ────────────────────────────────────────────────────────── */
const UI = {
  panel: "w-full bg-white text-slate-800",
  row2: "grid grid-cols-2 gap-x-3 gap-y-0",
  row3: "grid grid-cols-3 gap-1",
  sectionGap: "space-y-0 divide-y divide-slate-100",
  fieldGap: "flex flex-col gap-0.5",

  /* Labels: small, uppercase, black like the reference design */
  label: "text-[12px] font-semibold   text-slate-600 mb-1",
  micro: "text-[9px] font-semibold text-slate-400",
  val: "text-[11px] text-slate-400",

  /* Inputs: flat, full-width, thin border */
  card: "rounded border border-slate-200 bg-slate-50 p-2",
  input:
    "h-8 w-full bg-white border border-slate-200 rounded text-[13px] text-slate-800 px-2 " +
    "placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-1 " +
    "focus-visible:ring-blue-400 focus-visible:ring-offset-0 focus-visible:border-blue-400",
  selectTrigger:
    "h-8 w-full bg-white border border-slate-200 rounded text-[13px] text-slate-700 " +
    "focus:ring-1 focus:ring-blue-400 focus:ring-offset-0 focus:border-blue-400",
  selectContent: "bg-white border border-slate-200 shadow-lg text-slate-800",
  selectItem: "text-[13px] text-slate-700 focus:bg-blue-50 focus:text-blue-700",

  chip:
    "h-7 px-2 rounded border border-slate-200 bg-white text-[12px] text-slate-600 " +
    "hover:bg-slate-50 hover:border-slate-300",

  /* Icon toggle buttons: flat, grouped */
  iconBtn:
    "h-8 w-full flex items-center justify-center rounded-none border-r border-slate-200 " +
    "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors last:border-r-0",
  iconBtnActive:
    "bg-blue-600 text-white hover:bg-blue-700",

  /* Row inside a field */
  inputRow: "flex items-center gap-0",
  unitBadge:
    "h-8 min-w-[32px] flex items-center justify-center bg-slate-50 border border-l-0 border-slate-200 " +
    "rounded-r text-[11px] text-slate-400 px-1.5 select-none",

  /* Accordion */
  accordionItem: "border-b border-slate-300",
  accordionTrigger:
    "py-4 px-0 text-[13px] font-semibold tracking-normal  text-slate-900 hover:no-underline h-12",

  /* Row container for a whole property */
  propRow:
    " items-center justify-between gap-2 py-2 px-0 hover:bg-slate-50/70 transition-colors",

  slider: "py-1",
};

interface StyleEditorProps {
  styles: StyleState;
  onStyleChange: (property: string, value: string) => void;
  selectedElement?: any;
}

interface SectionProps extends StyleEditorProps {
  elementStyles?: Record<string, string>;
  rootStyles?: Record<string, string>;
}

interface TypographySectionProps {
  styles: StyleState;
  onStyleChange: (property: string, value: string) => void;
  elementStyles: Record<string, string>;
  rootStyles?: Record<string, string>;
}

/* =========================================================
   Helpers
   ========================================================= */

const isNum = (v: string) => v === "" || !isNaN(Number(v));

function stripUnit(v?: string, fallback = "") {
  if (!v) return fallback;
  return String(v).replace(/(px|rem|em|%)$/g, "");
}

function getUnit(v?: string, fallback: "px" | "rem" | "em" | "%" = "px") {
  if (!v) return fallback;
  if (v.endsWith("rem")) return "rem";
  if (v.endsWith("em")) return "em";
  if (v.endsWith("%")) return "%";
  return "px";
}

function resolveCssVarColor(raw?: string, rootStyles?: Record<string, string>) {
  if (!raw) return "";
  const key = raw.match(/var\((--[^)]+)\)/)?.[1];
  if (key && rootStyles?.[key]) return rootStyles[key];
  return raw;
}

function parseTextShadow(shadow?: string) {
  if (!shadow || shadow === "none") {
    return {
      enabled: false,
      x: "0",
      y: "0",
      blur: "0",
      color: "rgba(0,0,0,0.4)",
    };
  }

  // Simple parser (works well for "x y blur color")
  const colorMatch =
    shadow.match(/rgba?\([^)]+\)/)?.[0] ||
    shadow.match(/#[0-9a-fA-F]{3,8}/)?.[0] ||
    "rgba(0,0,0,0.4)";

  const nums = shadow
    .replace(colorMatch, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    enabled: true,
    x: stripUnit(nums[0] || "0"),
    y: stripUnit(nums[1] || "0"),
    blur: stripUnit(nums[2] || "0"),
    color: colorMatch,
  };
}

/* =========================================================
   Typography Section
   ========================================================= */

function TypographySection({
  styles,
  onStyleChange,
  elementStyles,
  rootStyles,
}: TypographySectionProps) {
  return (
    <div className="divide-y divide-slate-100">
      <FontFamilyControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
      <FontWeightControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
      <TextDecorationControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
      <TextColorControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
      <FontSizeControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
      <LetterSpacingControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
      <LineHeightControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
      <TextShadowControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
      <TextAlignmentControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}
        rootStyles={rootStyles}
      />
    </div>
  );
}

function FontFamilyControl({
  onStyleChange,
  elementStyles,
}: TypographySectionProps) {
  const [value, setValue] = useState<string>("Arial, sans-serif");

  useEffect(() => {
    setValue(elementStyles["font-family"] || "Arial, sans-serif");
  }, [elementStyles]);

  const fonts = [
    ["Arial, sans-serif", "Arial"],
    ["Helvetica, sans-serif", "Helvetica"],
    ["Times New Roman, serif", "Times New Roman"],
    ["Georgia, serif", "Georgia"],
    ["Verdana, sans-serif", "Verdana"],
    ["Tahoma, sans-serif", "Tahoma"],
    ["Trebuchet MS, sans-serif", "Trebuchet MS"],
    ["Courier New, monospace", "Courier New"],
    ["Inter, sans-serif", "Inter"],
    ["Roboto, sans-serif", "Roboto"],
    ["Open Sans, sans-serif", "Open Sans"],
    ["Poppins, sans-serif", "Poppins"],
    ["Outfit, sans-serif", "Outfit"],
  ];

  return (
    <div className={UI.propRow}>
      <Label className={UI.label}>Text Font</Label>
      <Select
        value={value}
        onValueChange={(v) => {
          setValue(v);
          onStyleChange("font-family", v);
        }}
      >
        <SelectTrigger style={{ height: "32px" }} className="w-full  bg-white border border-slate-200 rounded text-[12px] text-slate-700 focus:ring-1 focus:ring-blue-400">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={UI.selectContent}>
          {fonts.map(([v, l]) => (
            <SelectItem key={v} value={v} className={UI.selectItem}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FontSizeControl({
  styles,
  onStyleChange,
  elementStyles,
}: TypographySectionProps) {
  const raw =
    styles.typography.fontSize || elementStyles["font-size"] || "16px";
  const value = stripUnit(raw, "16");
  const unit = getUnit(raw, "px");

  const apply = (nextValue: string, nextUnit = unit) => {
    if (!isNum(nextValue)) return;
    onStyleChange("font-size", `${nextValue}${nextUnit}`);
  };

  return (
    <div className={UI.propRow}>
      <Label className={UI.label}>Text Size</Label>
      <div className="flex items-center">
        <Input
          value={value}
          type="number"
          min="0"
          className="h-8 w-full rounded-r-none border-r-0 border border-slate-200 bg-white text-[13px] text-slate-800 px-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          onChange={(e) => apply(e.target.value)}
        />
        <Select value={unit} onValueChange={(u) => apply(value, u as any)}>
          <SelectTrigger style={{ height: "32px" }} className=" w-14 rounded-l-none border border-slate-200 bg-slate-50 text-[11px] text-slate-500 focus:ring-0 px-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={UI.selectContent}>
            <SelectItem value="px" className={UI.selectItem}>px</SelectItem>
            <SelectItem value="rem" className={UI.selectItem}>rem</SelectItem>
            <SelectItem value="em" className={UI.selectItem}>em</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function FontWeightControl({
  styles,
  onStyleChange,
  elementStyles,
}: TypographySectionProps) {
  const current =
    styles.typography.fontWeight || elementStyles["font-weight"] || "400";
  const [value, setValue] = useState<string>(current);

  useEffect(() => {
    setValue(current);
  }, [current]);

  const items = [
    ["100", "Thin"],
    ["200", "Extra Light"],
    ["300", "Light"],
    ["400", "Regular"],
    ["500", "Medium"],
    ["600", "Semi Bold"],
    ["700", "Bold"],
    ["800", "Extra Bold"],
    ["900", "Black"],
  ];

  return (
    <div className={UI.propRow}>
      <Label className={UI.label}>Text Font Weight</Label>
      <Select
        value={value}
        onValueChange={(v) => {
          setValue(v);
          onStyleChange("font-weight", v);
        }}
      >
        <SelectTrigger style={{ height: "32px" }} className=" w-full bg-white border border-slate-200 rounded text-[12px] text-slate-700 focus:ring-1 focus:ring-blue-400">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={UI.selectContent}>
          {items.map(([v, l]) => (
            <SelectItem key={v} value={v} className={UI.selectItem}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function LetterSpacingControl({
  styles,
  onStyleChange,
  elementStyles,
}: TypographySectionProps) {
  const raw =
    styles.typography.letterSpacing || elementStyles["letter-spacing"] || "0px";
  const value = stripUnit(raw, "0");
  const unit = getUnit(raw, "px");

  const apply = (v: string, u = unit) => {
    if (!isNum(v)) return;
    onStyleChange("letter-spacing", `${v}${u}`);
  };

  return (
    <div className={UI.propRow}>
      <Label className={UI.label}>Text Letter Spacing</Label>
      <div className="flex items-center">
        <Input
          value={value}
          type="number"
          step="0.1"
          className="h-8 w-full rounded-r-none border-r-0 border border-slate-200 bg-white text-[13px] text-slate-800 px-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          onChange={(e) => apply(e.target.value)}
        />
        <span className={UI.unitBadge + " rounded-r rounded-l-none"}>{unit}</span>
      </div>
    </div>
  );
}

function TextColorControl({
  styles,
  onStyleChange,
  elementStyles,
  rootStyles,
}: TypographySectionProps) {
  const initial = useMemo(() => {
    return (
      resolveCssVarColor(
        elementStyles["color"] || styles.typography.color,
        rootStyles
      ) || "#c6c6c6"
    );
  }, [elementStyles, styles, rootStyles]);

  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  return (
    <div className={UI.propRow}>
      <Label className={UI.label}>Text Text Color</Label>
      <div className="flex items-center gap-1.5">

        <Input
          className="h-7 w-full border border-slate-200 bg-white text-[12px] text-slate-800 px-2 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onStyleChange("color", e.target.value);
          }}
        />
        <ColorPicker
          color={value}
          onChange={(c) => {
            setValue(c);
            onStyleChange("color", c);
          }}
        />
      </div>
    </div>
  );
}

function LineHeightControl({
  styles,
  onStyleChange,
  elementStyles,
}: TypographySectionProps) {
  const raw =
    styles.typography.lineHeight || elementStyles["line-height"] || "1.5";
  const unit = raw.includes("px") ? "px" : raw.includes("%") ? "%" : "unitless";
  const value = stripUnit(raw, unit === "unitless" ? "1.5" : "30");

  const apply = (v: string, u = unit) => {
    if (!isNum(v)) return;
    const finalValue = u === "unitless" ? v : `${v}${u}`;
    onStyleChange("line-height", finalValue);
  };

  return (
    <div className={UI.propRow}>
      <Label className={UI.label}>Text Line Height</Label>
      <div className="flex items-center">
        <Input
          className="h-8 w-full rounded-r-none border-r-0 border border-slate-200 bg-white text-[13px] text-slate-800 px-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          type="number"
          step={unit === "unitless" ? "0.1" : "1"}
          value={value}
          onChange={(e) => apply(e.target.value)}
        />
        <Select value={unit} onValueChange={(u) => apply(value, u as any)}>
          <SelectTrigger style={{ height: "32px" }} className="w-16 rounded-l-none border border-slate-200 bg-slate-50 text-[11px] text-slate-500 focus:ring-0 px-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={UI.selectContent} >
            <SelectItem value="unitless" className={UI.selectItem}>em</SelectItem>
            <SelectItem value="px" className={UI.selectItem}>px</SelectItem>
            <SelectItem value="%" className={UI.selectItem}>%</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TextAlignmentControl({
  styles,
  onStyleChange,
  elementStyles,
}: TypographySectionProps) {
  const active = styles.typography.textAlign || elementStyles["text-align"] || "left";
  const btn = (isActive: boolean) =>
    `${UI.iconBtn} ${isActive ? UI.iconBtnActive : ""}`;

  return (
    <div className={UI.propRow}>
      <Label className={UI.label}>Text Alignment</Label>
      <div className="flex overflow-hidden rounded border border-slate-200 w-32">
        {([
          ["left", <AlignLeft className="h-3.5 w-3.5" />],
          ["center", <AlignCenter className="h-3.5 w-3.5" />],
          ["right", <AlignRight className="h-3.5 w-3.5" />],
          ["justify", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>],
        ] as [string, React.ReactNode][]).map(([val, icon]) => (
          <button
            key={val}
            type="button"
            title={val}
            onClick={() => onStyleChange("text-align", val)}
            className={[
              "h-7 w-8 flex items-center justify-center border-r border-slate-200 last:border-r-0 transition-colors",
              active === val
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600",
            ].join(" ")}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextDecorationControl({
  styles,
  onStyleChange,
  elementStyles,
}: TypographySectionProps) {
  const weight = styles.typography.fontWeight || elementStyles["font-weight"] || "400";
  const fontStyle = styles.typography.fontStyle || elementStyles["font-style"] || "normal";
  const decoration =
    styles.typography.textDecoration || elementStyles["text-decoration"] || "none";

  const isBold = weight === "bold" || Number(weight) >= 700;
  const isItalic = fontStyle === "italic";
  const isUnderline = decoration.includes("underline");
  const isStrike = decoration.includes("line-through");

  const btn = (isActive: boolean) =>
    `${UI.iconBtn} ${isActive ? UI.iconBtnActive : ""}`;

  const toggleDeco = (type: "underline" | "line-through") => {
    const set = new Set(
      decoration === "none" ? [] : decoration.split(" ").filter(Boolean)
    );
    if (set.has(type)) set.delete(type);
    else set.add(type);
    const next = Array.from(set).join(" ") || "none";
    onStyleChange("text-decoration", next);
  };

  return (
    <div className={UI.propRow}>
      <Label className={UI.label}>Text Font Style</Label>
      <div className="flex overflow-hidden rounded border border-slate-200 w-32">
        {([
          ["bold", isBold, <Bold className="h-3.5 w-3.5" />, () => onStyleChange("font-weight", isBold ? "400" : "700")],
          ["italic", isItalic, <Italic className="h-3.5 w-3.5" />, () => onStyleChange("font-style", isItalic ? "normal" : "italic")],
          ["underline", isUnderline, <Underline className="h-3.5 w-3.5" />, () => toggleDeco("underline")],
          ["strike", isStrike, <Strikethrough className="h-3.5 w-3.5" />, () => toggleDeco("line-through")],
        ] as [string, boolean, React.ReactNode, () => void][]).map(([key, active, icon, handler]) => (
          <button
            key={key}
            type="button"
            title={key}
            onClick={handler}

            className={[
              "h-8 w-8 flex items-center justify-center border-r border-slate-200 last:border-r-0 transition-colors",
              active
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600",
            ].join(" ")}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextShadowControl({
  styles,
  onStyleChange,
  elementStyles,
}: TypographySectionProps) {
  const shadowRaw = styles.typography.textShadow || elementStyles["text-shadow"] || "none";
  const parsed = useMemo(() => parseTextShadow(shadowRaw), [shadowRaw]);

  const [enabled, setEnabled] = useState(parsed.enabled);
  const [x, setX] = useState(parsed.x);
  const [y, setY] = useState(parsed.y);
  const [blur, setBlur] = useState(parsed.blur);
  const [color, setColor] = useState(parsed.color);

  useEffect(() => {
    setEnabled(parsed.enabled);
    setX(parsed.x);
    setY(parsed.y);
    setBlur(parsed.blur);
    setColor(parsed.color);
  }, [parsed]);

  const apply = (
    next = { x, y, blur, color, enabled }
  ) => {
    if (!next.enabled) {
      onStyleChange("text-shadow", "none");
      return;
    }
    onStyleChange(
      "text-shadow",
      `${next.x || 0}px ${next.y || 0}px ${next.blur || 0}px ${next.color}`
    );
  };

  return (
    <div className="py-2 px-3">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <Label className={UI.label}>Text Text Shadow</Label>
        {!enabled ? (
          <button
            type="button"
            onClick={() => {
              const next = { x: "0", y: "0", blur: "0", color: "rgba(0,0,0,0.4)", enabled: true };
              setEnabled(true); setX("0"); setY("0"); setBlur("0"); setColor("rgba(0,0,0,0.4)");
              apply(next);
            }}
            className="h-6 w-6 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setEnabled(false); onStyleChange("text-shadow", "none"); }}

            className="h-6 w-6 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {enabled && (
        <div className="rounded border border-slate-200 bg-slate-50 p-2 space-y-2">
          {/* Color + delete */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Color</span>
            <div className="flex items-center gap-1.5">
              <ColorPicker
                color={color}
                onChange={(c) => { setColor(c); apply({ x, y, blur, color: c, enabled: true }); }}
              />
              <button
                type="button"
                onClick={() => { setEnabled(false); onStyleChange("text-shadow", "none"); }}
                className="h-5 w-5 flex items-center justify-center text-slate-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* X / Y / Blur */}
          <div className="grid grid-cols-3 gap-1.5">
            {([
              ["X", x, setX, (v: string) => apply({ x: v, y, blur, color, enabled: true })],
              ["Y", y, setY, (v: string) => apply({ x, y: v, blur, color, enabled: true })],
              ["Blur", blur, setBlur, (v: string) => apply({ x, y, blur: v, color, enabled: true })],
            ] as [string, string, (v: string) => void, (v: string) => void][]).map(([lbl, val, setter, applier]) => (
              <div key={lbl} className="flex flex-col gap-0.5">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{lbl}</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={val}
                    className="h-6 w-full rounded-l border border-r-0 border-slate-200 bg-white text-[12px] text-slate-800 px-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    onChange={(e) => {
                      if (!isNum(e.target.value)) return;
                      setter(e.target.value);
                      applier(e.target.value);
                    }}
                  />
                  <span className="h-6 px-1 flex items-center bg-slate-100 border border-slate-200 rounded-r text-[9px] text-slate-400">px</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Other Sections (kept clean + simple)
   ========================================================= */

function SpacingSection({ styles, onStyleChange, elementStyles }: SectionProps) {
  return (
    <div className="space-y-3">
      <BorderRadiusControl styles={styles} onStyleChange={onStyleChange} />
      <PaddingControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles || {}}
      />
      <MarginControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles || {}}
      />
    </div>
  );
}

function ColorsSection({
  styles,
  onStyleChange,
  elementStyles,
  rootStyles,
}: SectionProps) {
  return (
    <div className="space-y-3">
      <BackgroundColorControl
        styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles || {}}
        rootStyles={rootStyles}
      />
      <BorderColorControl styles={styles} onStyleChange={onStyleChange} />
      <BorderWidthControl styles={styles} onStyleChange={onStyleChange} />
      <BorderStyleControl styles={styles} onStyleChange={onStyleChange} />
    </div>
  );
}

function BorderRadiusControl({ styles, onStyleChange }: SectionProps) {
  const current = styles.spacing.borderRadius || 0;
  return (
    <div className="space-y-2">
      <Label className={UI.label}>Border radius</Label>
      <Slider
        className={UI.slider}
        value={[current]}
        max={100}
        step={1}
        onValueChange={([v]) => onStyleChange("border-radius", `${v}px`)}
      />
      <div className={UI.val}>{current}px</div>
    </div>
  );
}

function PaddingControl({
  onStyleChange,
  elementStyles = {},
}: SectionProps) {
  const [padding, setPadding] = useState({ top: "", right: "", bottom: "", left: "" });

  useEffect(() => {
    setPadding({
      top: stripUnit(elementStyles["padding-top"], ""),
      right: stripUnit(elementStyles["padding-right"], ""),
      bottom: stripUnit(elementStyles["padding-bottom"], ""),
      left: stripUnit(elementStyles["padding-left"], ""),
    });
  }, [elementStyles]);

  const setSide = (side: keyof typeof padding, val: string) => {
    if (!isNum(val)) return;
    setPadding((p) => ({ ...p, [side]: val }));
    onStyleChange(`padding-${side}`, `${val || 0}px`);
  };

  return (
    <div className={UI.fieldGap}>
      <Label className={UI.label}>Padding</Label>
      <div className={UI.row2}>
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <div key={side} className={UI.fieldGap}>
            <Label className={UI.micro}>{side[0].toUpperCase() + side.slice(1)}</Label>
            <Input
              className={UI.input}
              type="number"
              value={padding[side]}
              onChange={(e) => setSide(side, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MarginControl({
  onStyleChange,
  elementStyles = {},
}: SectionProps) {
  const [margin, setMargin] = useState({ top: "", right: "", bottom: "", left: "" });

  useEffect(() => {
    setMargin({
      top: stripUnit(elementStyles["margin-top"], ""),
      right: stripUnit(elementStyles["margin-right"], ""),
      bottom: stripUnit(elementStyles["margin-bottom"], ""),
      left: stripUnit(elementStyles["margin-left"], ""),
    });
  }, [elementStyles]);

  const setSide = (side: keyof typeof margin, val: string) => {
    if (!isNum(val)) return;
    setMargin((p) => ({ ...p, [side]: val }));
    onStyleChange(`margin-${side}`, `${val || 0}px`);
  };

  return (
    <div className={UI.fieldGap}>
      <Label className={UI.label}>Margin</Label>
      <div className={UI.row2}>
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <div key={side} className={UI.fieldGap}>
            <Label className={UI.micro}>{side[0].toUpperCase() + side.slice(1)}</Label>
            <Input
              className={UI.input}
              type="number"
              value={margin[side]}
              onChange={(e) => setSide(side, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function BackgroundColorControl({
  styles,
  onStyleChange,
  elementStyles = {},
  rootStyles,
}: SectionProps) {
  const initial =
    resolveCssVarColor(
      elementStyles["background-color"] || styles.colors.backgroundColor,
      rootStyles
    ) || "#ffffff";

  const [value, setValue] = useState(initial);
  useEffect(() => setValue(initial), [initial]);

  return (
    <div className={UI.fieldGap}>
      <Label className={UI.label}>Background color</Label>
      <div className="flex items-center gap-2">
        <Input
          className={UI.input}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onStyleChange("background-color", e.target.value);
          }}
        />
        <ColorPicker
          color={value}
          onChange={(c) => {
            setValue(c);
            onStyleChange("background-color", c);
          }}
        />
      </div>
    </div>
  );
}

function BorderColorControl({ styles, onStyleChange }: SectionProps) {
  const value = styles.colors.borderColor || "#e5e7eb";
  return (
    <div className={UI.fieldGap}>
      <Label className={UI.label}>Border color</Label>
      <div className="flex items-center gap-2">
        <Input
          className={UI.input}
          value={value}
          onChange={(e) => onStyleChange("border-color", e.target.value)}
        />
        <ColorPicker color={value} onChange={(c) => onStyleChange("border-color", c)} />
      </div>
    </div>
  );
}

function BorderWidthControl({ styles, onStyleChange }: SectionProps) {
  const raw = styles.colors.borderWidth || "0px";
  return (
    <div className={UI.fieldGap}>
      <Label className={UI.label}>Border width</Label>
      <Input
        className={UI.input}
        type="number"
        min="0"
        value={stripUnit(raw, "0")}
        onChange={(e) => {
          if (!isNum(e.target.value)) return;
          onStyleChange("border-width", `${e.target.value || 0}px`);
        }}
      />
    </div>
  );
}

function BorderStyleControl({ styles, onStyleChange }: SectionProps) {
  const value = styles.colors.borderStyle || "solid";
  return (
    <div className={UI.fieldGap}>
      <Label className={UI.label}>Border style</Label>
      <Select value={value} onValueChange={(v) => onStyleChange("border-style", v)}>
        <SelectTrigger className={UI.selectTrigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={UI.selectContent}>
          {["none", "solid", "dashed", "dotted", "double"].map((v) => (
            <SelectItem key={v} value={v} className={UI.selectItem}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DisplayStyleControl({ styles, onStyleChange }: SectionProps) {
  const value = styles?.layout?.display || "block";
  return (
    <div className={UI.fieldGap}>
      <Label className={UI.label}>Display</Label>
      <Select value={value} onValueChange={(v) => onStyleChange("display", v)}>
        <SelectTrigger className={UI.selectTrigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={UI.selectContent}>
          <SelectItem value="block" className={UI.selectItem}>
            block
          </SelectItem>
          <SelectItem value="inline-block" className={UI.selectItem}>
            inline-block
          </SelectItem>
          <SelectItem value="flex" className={UI.selectItem}>
            flex
          </SelectItem>
          <SelectItem value="grid" className={UI.selectItem}>
            grid
          </SelectItem>
          <SelectItem value="none" className={UI.selectItem}>
            none
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/* =========================================================
   Main StyleEditor
   ========================================================= */

export function StyleEditor({
  styles,
  onStyleChange,
  selectedElement,
}: StyleEditorProps) {
  const { state } = useEditorContext();
  const editor = state.editor as Editor | null;

  const rootStyles = (editor?.Css.getRule(":root")?.getStyle() || {}) as Record<string, string>;
  const tagType = selectedElement?.attributes?.type;
  const [elementStyles, setElementStyles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editor || !selectedElement) return;

    const merged: Record<string, string> = {};
    const classes = selectedElement.getClasses?.() || [];

    classes.forEach((className: string) => {
      const rule = editor.Css.getRule(`.${className}`);
      if (rule) Object.assign(merged, rule.getStyle());
    });

    // inline styles if any (GrapesJS component style)
    const inline = selectedElement.getStyle?.() || {};
    Object.assign(merged, inline);

    setElementStyles(merged);
  }, [editor, selectedElement]);

  const showTypography =
    ["color", "font-family", "font-size", "font-weight", "letter-spacing", "text-shadow"].some(
      (k) => Object.prototype.hasOwnProperty.call(elementStyles, k)
    ) ||
    ["text", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tagType);

  // AttributesEditor
  return (
    <div className={`${UI.panel} bg-[#4a3c47] p-1`}>
      <Accordion
        type="single"
        collapsible
        defaultValue={showTypography ? "typography" : "spacing"}
        className="w-full"
      >
        {showTypography && (
          <AccordionItem value="attributesEditor" className={UI.accordionItem}>
            <AccordionTrigger className={UI.accordionTrigger}>Attributes</AccordionTrigger>
            <AccordionContent>
              <AttributesEditor
                // styles={styles}
                // onStyleChange={onStyleChange}
                // elementStyles={elementStyles}
                // rootStyles={rootStyles}
                // selectedElement={selectedElement}
                selectedElement={selectedElement}
              // onAttributeChange={onAttributeChange}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="typography" className={UI.accordionItem}>
          <AccordionTrigger className={UI.accordionTrigger}>
            Typography
          </AccordionTrigger>
          <AccordionContent>
            <TypographySection
              styles={styles}
              onStyleChange={onStyleChange}
              elementStyles={elementStyles}
              rootStyles={rootStyles}
            />
          </AccordionContent>
        </AccordionItem>




        <AccordionItem value="spacing" className={UI.accordionItem}>
          <AccordionTrigger className={UI.accordionTrigger}>Spacing</AccordionTrigger>
          <AccordionContent>
            <SpacingSection
              styles={styles}
              onStyleChange={onStyleChange}
              elementStyles={elementStyles}
              rootStyles={rootStyles}
              selectedElement={selectedElement}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors" className={UI.accordionItem}>
          <AccordionTrigger className={UI.accordionTrigger}>Colors</AccordionTrigger>
          <AccordionContent>
            <ColorsSection
              styles={styles}
              onStyleChange={onStyleChange}
              elementStyles={elementStyles}
              rootStyles={rootStyles}
              selectedElement={selectedElement}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="display" className={UI.accordionItem}>
          <AccordionTrigger className={UI.accordionTrigger}>Display</AccordionTrigger>
          <AccordionContent>
            <DisplayStyleControl
              styles={styles}
              onStyleChange={onStyleChange}
              elementStyles={elementStyles}
              rootStyles={rootStyles}
              selectedElement={selectedElement}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}