import { useState, useRef } from "react";
import { SizeInput } from "./CustomSIzing";

// ─── Types ────────────────────────────────────────────────────────────────────

type SizeVal = { value: string; unit: string };

interface TagStyle {
  font: string;
  fontWeight: string;
  fontStyle: string; // "normal" | "italic" | "uppercase" | "capitalize" | "underline" | "linethrough"
  textAlign: string;
  color: string;
  fontSize: SizeVal;
  letterSpacing: SizeVal;
  lineHeight: SizeVal;
  textShadow: number; // preset index 0-5
}

interface TextState {
  activeTag: string;
  h1: TagStyle;
  h2: TagStyle;
  h3: TagStyle;
  h4: TagStyle;
  h5: TagStyle;
  h6: TagStyle;
  p: TagStyle;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TAGS = ["H1", "H2", "H3", "H4", "H5", "H6", "P"] as const;
type Tag = (typeof TAGS)[number];

const FONT_OPTIONS = [
  "Default",
  "Arial",
  "Georgia",
  "Helvetica",
  "Inter",
  "Lato",
  "Merriweather",
  "Montserrat",
  "Open Sans",
  "Playfair Display",
  "Roboto",
  "Times New Roman",
];
const FONT_WEIGHT_OPTIONS = [
  "Thin",
  "Extra Light",
  "Light",
  "Regular",
  "Medium",
  "Semi Bold",
  "Bold",
  "Extra Bold",
  "Black",
];
const TEXT_SHADOW_PRESETS = [
  null,
  { x: 1, y: 1, blur: 2, color: "rgba(0,0,0,0.3)" },
  { x: 2, y: 2, blur: 4, color: "rgba(0,0,0,0.25)" },
  { x: 0, y: 2, blur: 6, color: "rgba(0,0,0,0.2)" },
  { x: -1, y: 1, blur: 3, color: "rgba(0,0,0,0.3)" },
  { x: 0, y: 0, blur: 8, color: "rgba(0,0,0,0.4)" },
];

function makeTagDefault(fontSize: string, fontUnit = "px"): TagStyle {
  return {
    font: "Default",
    fontWeight: "Regular",
    fontStyle: "normal",
    textAlign: "left",
    color: "",
    fontSize: { value: fontSize, unit: fontUnit },
    letterSpacing: { value: "0", unit: "px" },
    lineHeight: { value: "1", unit: "em" },
    textShadow: 0,
  };
}

export const DEFAULT_TEXT: TextState = {
  activeTag: "H1",
  h1: makeTagDefault("30"),
  h2: makeTagDefault("24"),
  h3: makeTagDefault("20"),
  h4: makeTagDefault("18"),
  h5: makeTagDefault("16"),
  h6: makeTagDefault("14"),
  p: makeTagDefault("14"),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
            <option key={o}>{o}</option>
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
        <input
          ref={colorRef}
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute opacity-0 w-0 h-0"
        />
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

function IconToggleGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; icon: React.ReactNode; title: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        {label}
      </label>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            title={opt.title}
            onClick={() => onChange(opt.value)}
            className={`w-9 h-8 rounded-md flex items-center justify-center border transition-all ${
              value === opt.value
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-transparent bg-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {opt.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Text Shadow Preset Card ──────────────────────────────────────────────────

function TextShadowCard({
  index,
  active,
  onClick,
}: {
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  const preset = TEXT_SHADOW_PRESETS[index];
  const shadow = preset
    ? `${preset.x}px ${preset.y}px ${preset.blur}px ${preset.color}`
    : "none";

  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all bg-white ${
        active ? "border-blue-500" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {index === 0 ? (
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
        <span
          className="text-lg font-bold text-slate-600"
          style={{ textShadow: shadow, fontFamily: "Georgia, serif" }}
        >
          T
        </span>
      )}
    </button>
  );
}

// ─── Font Style Icons ─────────────────────────────────────────────────────────

const FontStyleIcons = {
  italic: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <text
        x="4"
        y="13"
        fontSize="13"
        fontStyle="italic"
        fill="currentColor"
        fontFamily="Georgia,serif"
      >
        I
      </text>
    </svg>
  ),
  normal: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <text
        x="3"
        y="13"
        fontSize="12"
        fill="currentColor"
        fontFamily="Georgia,serif"
        fontWeight="bold"
      >
        TT
      </text>
    </svg>
  ),
  capitalize: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <text
        x="2"
        y="12"
        fontSize="11"
        fill="currentColor"
        fontFamily="Arial,sans-serif"
      >
        Tt
      </text>
    </svg>
  ),
  underline: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <text
        x="3"
        y="11"
        fontSize="10"
        fill="currentColor"
        fontFamily="Arial,sans-serif"
        textDecoration="underline"
      >
        U
      </text>
      <line
        x1="3"
        y1="13"
        x2="13"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  linethrough: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <text
        x="3"
        y="12"
        fontSize="11"
        fill="currentColor"
        fontFamily="Arial,sans-serif"
      >
        T
      </text>
      <line
        x1="2"
        y1="8"
        x2="14"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const AlignIcons = {
  left: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line
        x1="2"
        y1="4"
        x2="14"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="8"
        x2="10"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="12"
        x2="12"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  center: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line
        x1="2"
        y1="4"
        x2="14"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="8"
        x2="12"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="12"
        x2="13"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  right: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line
        x1="2"
        y1="4"
        x2="14"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="8"
        x2="14"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="12"
        x2="14"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  justify: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line
        x1="2"
        y1="4"
        x2="14"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="8"
        x2="14"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="12"
        x2="14"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ─── Tag Style Editor ─────────────────────────────────────────────────────────

function TagStyleEditor({
  tag,
  style,
  update,
}: {
  tag: string;
  style: TagStyle;
  update: (key: keyof TagStyle, val: any) => void;
}) {
  const label = (field: string) => `${tag} ${field}`;

  return (
    <div className="pt-3 space-y-0">
      <SelectInput
        label={label("Font")}
        value={style.font}
        options={FONT_OPTIONS}
        onChange={(v) => update("font", v)}
      />
      <SelectInput
        label={label("Font Weight")}
        value={style.fontWeight}
        options={FONT_WEIGHT_OPTIONS}
        onChange={(v) => update("fontWeight", v)}
      />

      <IconToggleGroup
        label={label("Font Style")}
        value={style.fontStyle}
        onChange={(v) => update("fontStyle", v)}
        options={[
          { value: "italic", icon: FontStyleIcons.italic, title: "Italic" },
          { value: "normal", icon: FontStyleIcons.normal, title: "Normal" },
          {
            value: "capitalize",
            icon: FontStyleIcons.capitalize,
            title: "Capitalize",
          },
          {
            value: "underline",
            icon: FontStyleIcons.underline,
            title: "Underline",
          },
          {
            value: "linethrough",
            icon: FontStyleIcons.linethrough,
            title: "Line Through",
          },
        ]}
      />

      <IconToggleGroup
        label={label("Text Alignment")}
        value={style.textAlign}
        onChange={(v) => update("textAlign", v)}
        options={[
          { value: "left", icon: AlignIcons.left, title: "Left" },
          { value: "center", icon: AlignIcons.center, title: "Center" },
          { value: "right", icon: AlignIcons.right, title: "Right" },
          { value: "justify", icon: AlignIcons.justify, title: "Justify" },
        ]}
      />

      <ColorInput
        label={label("Text Color")}
        value={style.color}
        onChange={(v) => update("color", v)}
      />

      <SizeInput
        label={label("Text Size")}
        value={style.fontSize.value}
        unit={style.fontSize.unit}
        onChange={(v: SizeVal) => update("fontSize", v)}
      />
      <SizeInput
        label={label("Letter Spacing")}
        value={style.letterSpacing.value}
        unit={style.letterSpacing.unit}
        onChange={(v: SizeVal) => update("letterSpacing", v)}
      />
      <SizeInput
        label={label("Line Height")}
        value={style.lineHeight.value}
        unit={style.lineHeight.unit}
        onChange={(v: SizeVal) => update("lineHeight", v)}
      />

      {/* Text Shadow Presets */}
      <div className="mb-3">
        <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
          {label("Text Shadow")}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TEXT_SHADOW_PRESETS.map((_, i) => (
            <TextShadowCard
              key={i}
              index={i}
              active={style.textShadow === i}
              onClick={() => update("textShadow", i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TextPanel ────────────────────────────────────────────────────────────────

export function TextPanel({
  updateField,
  text,
}: {
  updateField: (key: string, val: any) => void;
  text: TextState | undefined;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const s = text ?? DEFAULT_TEXT;
  const activeTag = (s.activeTag ?? "H1") as Tag;
  const tagKey = activeTag.toLowerCase() as keyof TextState;
  const activeStyle = (s[tagKey] ?? makeTagDefault("14")) as TagStyle;

  function updateTagField(key: keyof TagStyle, val: any) {
    updateField(tagKey, { ...activeStyle, [key]: val });
  }

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
          Text
        </span>
      </button>

      {!collapsed && (
        <div className="pb-4 border-t border-slate-100">
          {/* Tag Tabs */}
          <div className="flex border-b border-slate-100 mt-1">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => updateField("activeTag", tag)}
                className={`flex-1 py-2 text-xs font-semibold transition-all relative ${
                  activeTag === tag
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {/* Subscript style for H tags */}
                {tag === "P" ? (
                  <span>P</span>
                ) : (
                  <span>
                    H<sub style={{ fontSize: "8px" }}>{tag[1]}</sub>
                  </span>
                )}
                {activeTag === tag && (
                  <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <TagStyleEditor
            tag={`Heading Text ${activeTag}`}
            style={activeStyle}
            update={updateTagField}
          />
        </div>
      )}
    </div>
  );
}

const FONT_WEIGHT_MAP: Record<string, number> = {
  Thin: 100,
  "Extra Light": 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  "Semi Bold": 600,
  Bold: 700,
  "Extra Bold": 800,
  Black: 900,
};

function getSize(val?: SizeVal) {
  if (!val || !val.value) return undefined;
  return `${val.value}${val.unit}`;
}

export function generateTextCSS(style?: TagStyle): React.CSSProperties {
  if (!style) return {};

  const css: React.CSSProperties = {};

  // ─────────────────────────────
  // Font Family
  // ─────────────────────────────
  if (style.font && style.font !== "Default") {
    css.fontFamily = style.font;
  }

  // ─────────────────────────────
  // Font Weight
  // ─────────────────────────────
  if (style.fontWeight) {
    css.fontWeight = FONT_WEIGHT_MAP[style.fontWeight] ?? 400;
  }

  // ─────────────────────────────
  // Font Style / Transform / Decoration
  // ─────────────────────────────
  if (style.fontStyle === "italic") {
    css.fontStyle = "italic";
  }

  if (style.fontStyle === "capitalize") {
    css.textTransform = "capitalize";
  }

  if (style.fontStyle === "underline") {
    css.textDecoration = "underline";
  }

  if (style.fontStyle === "linethrough") {
    css.textDecoration = "line-through";
  }

  // ─────────────────────────────
  // Alignment
  // ─────────────────────────────
  if (style.textAlign) {
    css.textAlign = style.textAlign as any;
  }

  // ─────────────────────────────
  // Color
  // ─────────────────────────────
  if (style.color) {
    css.color = style.color;
  }

  // ─────────────────────────────
  // Sizes
  // ─────────────────────────────
  const fontSize = getSize(style.fontSize);
  if (fontSize) css.fontSize = fontSize;

  const letterSpacing = getSize(style.letterSpacing);
  if (letterSpacing) css.letterSpacing = letterSpacing;

  const lineHeight = getSize(style.lineHeight);
  if (lineHeight) css.lineHeight = lineHeight;

  // ─────────────────────────────
  // Text Shadow Preset
  // ─────────────────────────────
  const preset = TEXT_SHADOW_PRESETS[style.textShadow];
  if (preset) {
    css.textShadow = `${preset.x}px ${preset.y}px ${preset.blur}px ${preset.color}`;
  }

  return css;
}
