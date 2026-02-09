"use client";

import React, { useMemo, useState } from "react";
import { AlignLeft, MoveVertical, Smartphone, Monitor, Type } from "lucide-react";

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
type TabKey = "headings" | "body" | "buttons";
type HeadingKey = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type BtnKey = "primary" | "secondary" | "outline";

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

type ButtonStyle = {
  sizePx: number;
  weight: number;
  letterSpacingEm: number;
  transform: "none" | "uppercase" | "lowercase" | "capitalize";
  radiusPx: number;
  heightPx: number;
  paddingXPx: number;

  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  hoverBorder: string;

  borderWidthPx: number;
  shadow: "none" | "sm" | "md" | "lg";
  transitionMs: number;
};

const WEIGHTS = [300, 400, 500, 600, 700, 800, 900];

function isHexColor(v: string) {
  return /^#([0-9a-fA-F]{6})$/.test(v.trim());
}

function shadowToClass(s: ButtonStyle["shadow"]) {
  if (s === "sm") return "shadow-sm";
  if (s === "md") return "shadow-md";
  if (s === "lg") return "shadow-lg";
  return "shadow-none";
}

export default function TypographyPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("headings");
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");

  const [fontFamily, setFontFamily] = useState("Inter");
  const [baseSize, setBaseSize] = useState(17);

  // Headings
  const [selectedHeading, setSelectedHeading] = useState<HeadingKey>("h1");
  const [headings, setHeadings] = useState<Record<HeadingKey, HeadingStyle>>({
    h1: { scale: 2.5, weight: 800, lineHeight: 1.05, letterSpacingEm: -0.03 },
    h2: { scale: 2.0, weight: 800, lineHeight: 1.1, letterSpacingEm: -0.02 },
    h3: { scale: 1.5, weight: 700, lineHeight: 1.15, letterSpacingEm: -0.01 },
    h4: { scale: 1.25, weight: 700, lineHeight: 1.2, letterSpacingEm: 0 },
    h5: { scale: 1.1, weight: 600, lineHeight: 1.25, letterSpacingEm: 0 },
    h6: { scale: 1.0, weight: 600, lineHeight: 1.3, letterSpacingEm: 0.01 },
  });

  // Body
  const [body, setBody] = useState<BodyStyle>({
    sizePx: 17,
    weight: 400,
    lineHeight: 1.7,
    letterSpacingEm: 0,
    maxWidthCh: 62,
    paragraphGapPx: 14,
  });

  // Buttons
  const [selectedBtn, setSelectedBtn] = useState<BtnKey>("primary");
  const [hoveredBtn, setHoveredBtn] = useState<BtnKey | null>(null);

  const [buttons, setButtons] = useState<Record<BtnKey, ButtonStyle>>({
    primary: {
      sizePx: 14,
      weight: 600,
      letterSpacingEm: 0,
      transform: "none",
      radiusPx: 10,
      heightPx: 40,
      paddingXPx: 16,

      bg: "#7C2D64",
      text: "#FFFFFF",
      border: "#7C2D64",
      hoverBg: "#6B2457",
      hoverText: "#FFFFFF",
      hoverBorder: "#6B2457",

      borderWidthPx: 1,
      shadow: "none",
      transitionMs: 160,
    },
    secondary: {
      sizePx: 14,
      weight: 600,
      letterSpacingEm: 0,
      transform: "none",
      radiusPx: 10,
      heightPx: 40,
      paddingXPx: 16,

      bg: "#F3F4F6",
      text: "#111827",
      border: "#E5E7EB",
      hoverBg: "#E5E7EB",
      hoverText: "#111827",
      hoverBorder: "#D1D5DB",

      borderWidthPx: 1,
      shadow: "none",
      transitionMs: 160,
    },
    outline: {
      sizePx: 14,
      weight: 600,
      letterSpacingEm: 0,
      transform: "none",
      radiusPx: 10,
      heightPx: 40,
      paddingXPx: 16,

      bg: "transparent",
      text: "#111827",
      border: "#D1D5DB",
      hoverBg: "#F9FAFB",
      hoverText: "#111827",
      hoverBorder: "#9CA3AF",

      borderWidthPx: 1,
      shadow: "none",
      transitionMs: 160,
    },
  });

  const headingPx = (k: HeadingKey) => Math.round(baseSize * headings[k].scale);
  const activeHeading = headings[selectedHeading];
  const activeButton = buttons[selectedBtn];

  const previewWidthClass = previewMode === "mobile" ? "max-w-[420px]" : "max-w-none";

  const resetAll = () => {
    setFontFamily("Inter");
    setBaseSize(17);

    setSelectedHeading("h1");
    setHeadings({
      h1: { scale: 2.5, weight: 800, lineHeight: 1.05, letterSpacingEm: -0.03 },
      h2: { scale: 2.0, weight: 800, lineHeight: 1.1, letterSpacingEm: -0.02 },
      h3: { scale: 1.5, weight: 700, lineHeight: 1.15, letterSpacingEm: -0.01 },
      h4: { scale: 1.25, weight: 700, lineHeight: 1.2, letterSpacingEm: 0 },
      h5: { scale: 1.1, weight: 600, lineHeight: 1.25, letterSpacingEm: 0 },
      h6: { scale: 1.0, weight: 600, lineHeight: 1.3, letterSpacingEm: 0.01 },
    });

    setBody({
      sizePx: 17,
      weight: 400,
      lineHeight: 1.7,
      letterSpacingEm: 0,
      maxWidthCh: 62,
      paragraphGapPx: 14,
    });

    setSelectedBtn("primary");
    setButtons((prev) => ({
      ...prev,
      primary: {
        ...prev.primary,
        sizePx: 14,
        weight: 600,
        letterSpacingEm: 0,
        transform: "none",
        radiusPx: 10,
        heightPx: 40,
        paddingXPx: 16,
        bg: "#7C2D64",
        text: "#FFFFFF",
        border: "#7C2D64",
        hoverBg: "#6B2457",
        hoverText: "#FFFFFF",
        hoverBorder: "#6B2457",
        borderWidthPx: 1,
        shadow: "none",
        transitionMs: 160,
      },
      secondary: {
        ...prev.secondary,
        sizePx: 14,
        weight: 600,
        letterSpacingEm: 0,
        transform: "none",
        radiusPx: 10,
        heightPx: 40,
        paddingXPx: 16,
        bg: "#F3F4F6",
        text: "#111827",
        border: "#E5E7EB",
        hoverBg: "#E5E7EB",
        hoverText: "#111827",
        hoverBorder: "#D1D5DB",
        borderWidthPx: 1,
        shadow: "none",
        transitionMs: 160,
      },
      outline: {
        ...prev.outline,
        sizePx: 14,
        weight: 600,
        letterSpacingEm: 0,
        transform: "none",
        radiusPx: 10,
        heightPx: 40,
        paddingXPx: 16,
        bg: "transparent",
        text: "#111827",
        border: "#D1D5DB",
        hoverBg: "#F9FAFB",
        hoverText: "#111827",
        hoverBorder: "#9CA3AF",
        borderWidthPx: 1,
        shadow: "none",
        transitionMs: 160,
      },
    }));
  };

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
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" /> Heading Level
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
  }, [activeHeading, selectedHeading, baseSize, headings]);

  const bodyControls = useMemo(() => {
    const setB = (patch: Partial<BodyStyle>) => setBody((p) => ({ ...p, ...patch }));

    return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Body Size</Label>
              <span className="text-xs text-muted-foreground">{body.sizePx}px</span>
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
              <span className="text-xs text-muted-foreground">{body.lineHeight.toFixed(2)}</span>
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
              <span className="text-xs text-muted-foreground">{body.maxWidthCh}ch</span>
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
              <span className="text-xs text-muted-foreground">{body.paragraphGapPx}px</span>
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
  }, [body]);

  const buttonControls = useMemo(() => {
    const setBtn = (patch: Partial<ButtonStyle>) => {
      setButtons((prev) => ({
        ...prev,
        [selectedBtn]: { ...prev[selectedBtn], ...patch },
      }));
    };

    const ColorRow = ({
      label,
      value,
      onChange,
      placeholder,
    }: {
      label: string;
      value: string;
      placeholder?: string;
      onChange: (v: string) => void;
    }) => {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="flex items-center gap-2">
            <Input
              value={value}
              placeholder={placeholder || "#RRGGBB or transparent"}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="color"
              className="h-9 w-10 rounded-md border bg-background px-1"
              value={isHexColor(value) ? value : "#000000"}
              onChange={(e) => onChange(e.target.value)}
              title="Pick color"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tip: type <span className="font-mono">transparent</span> if needed.
          </p>
        </div>
      );
    };

    return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label>Button Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => (
                <Button
                  key={k}
                  size="sm"
                  variant={selectedBtn === k ? "default" : "outline"}
                  onClick={() => setSelectedBtn(k)}
                >
                  {k === "primary" ? "Primary" : k === "secondary" ? "Secondary" : "Outline"}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Font Size</Label>
              <span className="text-xs text-muted-foreground">{activeButton.sizePx}px</span>
            </div>
            <Slider
              value={[activeButton.sizePx]}
              min={12}
              max={20}
              step={1}
              onValueChange={(v) => setBtn({ sizePx: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <Label>Font Weight</Label>
            <div className="grid grid-cols-3 gap-2">
              {WEIGHTS.filter((w) => w >= 400).map((w) => (
                <Button
                  key={w}
                  variant={activeButton.weight === w ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBtn({ weight: w })}
                >
                  {w}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Letter Spacing
              </Label>
              <span className="text-xs text-muted-foreground">
                {activeButton.letterSpacingEm.toFixed(2)}em
              </span>
            </div>
            <Slider
              value={[activeButton.letterSpacingEm * 100]}
              min={-5}
              max={30}
              step={1}
              onValueChange={(v) => setBtn({ letterSpacingEm: v[0] / 100 })}
            />
          </div>

          <div className="space-y-2">
            <Label>Text Transform</Label>
            <Select
              value={activeButton.transform}
              onValueChange={(v) => setBtn({ transform: v as ButtonStyle["transform"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="uppercase">Uppercase</SelectItem>
                <SelectItem value="capitalize">Capitalize</SelectItem>
                <SelectItem value="lowercase">Lowercase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Radius</Label>
              <span className="text-xs text-muted-foreground">{activeButton.radiusPx}px</span>
            </div>
            <Slider
              value={[activeButton.radiusPx]}
              min={0}
              max={30}
              step={1}
              onValueChange={(v) => setBtn({ radiusPx: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Height</Label>
              <span className="text-xs text-muted-foreground">{activeButton.heightPx}px</span>
            </div>
            <Slider
              value={[activeButton.heightPx]}
              min={32}
              max={56}
              step={1}
              onValueChange={(v) => setBtn({ heightPx: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Padding X</Label>
              <span className="text-xs text-muted-foreground">{activeButton.paddingXPx}px</span>
            </div>
            <Slider
              value={[activeButton.paddingXPx]}
              min={10}
              max={30}
              step={1}
              onValueChange={(v) => setBtn({ paddingXPx: v[0] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Border Width</Label>
              <span className="text-xs text-muted-foreground">{activeButton.borderWidthPx}px</span>
            </div>
            <Slider
              value={[activeButton.borderWidthPx]}
              min={0}
              max={4}
              step={1}
              onValueChange={(v) => setBtn({ borderWidthPx: v[0] })}
            />
          </div>

          <div className="space-y-2">
            <Label>Shadow</Label>
            <Select
              value={activeButton.shadow}
              onValueChange={(v) => setBtn({ shadow: v as ButtonStyle["shadow"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Hover Transition</Label>
              <span className="text-xs text-muted-foreground">{activeButton.transitionMs}ms</span>
            </div>
            <Slider
              value={[activeButton.transitionMs]}
              min={0}
              max={500}
              step={10}
              onValueChange={(v) => setBtn({ transitionMs: v[0] })}
            />
          </div>

          <Separator />
          <div className="space-y-1">
            <Label className="text-sm">Normal State Colors</Label>
            <p className="text-xs text-muted-foreground">Button background, text, border.</p>
          </div>

          <ColorRow label="Background" value={activeButton.bg} onChange={(v) => setBtn({ bg: v })} />
          <ColorRow label="Text Color" value={activeButton.text} onChange={(v) => setBtn({ text: v })} />
          <ColorRow label="Border Color" value={activeButton.border} onChange={(v) => setBtn({ border: v })} />

          <Separator />
          <div className="space-y-1">
            <Label className="text-sm">Hover State Colors</Label>
            <p className="text-xs text-muted-foreground">Hover background, text, border.</p>
          </div>

          <ColorRow label="Hover Background" value={activeButton.hoverBg} onChange={(v) => setBtn({ hoverBg: v })} />
          <ColorRow label="Hover Text Color" value={activeButton.hoverText} onChange={(v) => setBtn({ hoverText: v })} />
          <ColorRow label="Hover Border Color" value={activeButton.hoverBorder} onChange={(v) => setBtn({ hoverBorder: v })} />
        </CardContent>
      </Card>
    );
  }, [activeButton, selectedBtn]);

  const getBtnVisual = (k: BtnKey) => {
    const s = buttons[k];
    const hovering = hoveredBtn === k;

    const bg = hovering ? s.hoverBg : s.bg;
    const text = hovering ? s.hoverText : s.text;
    const border = hovering ? s.hoverBorder : s.border;

    return {
      style: {
        fontFamily,
        fontSize: `${s.sizePx}px`,
        fontWeight: s.weight as any,
        letterSpacing: `${s.letterSpacingEm}em`,
        textTransform: s.transform,
        height: s.heightPx,
        paddingLeft: s.paddingXPx,
        paddingRight: s.paddingXPx,
        borderRadius: s.radiusPx,

        background: bg,
        color: text,
        borderColor: border,
        borderWidth: s.borderWidthPx,
        borderStyle: "solid",

        transition: `all ${s.transitionMs}ms ease`,
      } as React.CSSProperties,
      className:
        `inline-flex items-center justify-center select-none outline-none ` +
        `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background ` +
        shadowToClass(s.shadow),
    };
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Typography</h1>
          <p className="text-muted-foreground">
            Define your global font stack and hierarchy scales (H1–H6, Body, Buttons).
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={resetAll}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT CONTROLS */}
        <div className="lg:col-span-4 space-y-6">
          {/* Global Settings */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Primary Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
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
                  <Label>Base Size</Label>
                  <span className="text-xs text-muted-foreground">{baseSize}px</span>
                </div>
                <Slider
                  value={[baseSize]}
                  min={12}
                  max={22}
                  step={1}
                  onValueChange={(v) => setBaseSize(v[0])}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs (simple buttons) */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={activeTab === "headings" ? "default" : "outline"}
              onClick={() => setActiveTab("headings")}
            >
              Headings
            </Button>
            <Button
              variant={activeTab === "body" ? "default" : "outline"}
              onClick={() => setActiveTab("body")}
            >
              Body
            </Button>
            <Button
              variant={activeTab === "buttons" ? "default" : "outline"}
              onClick={() => setActiveTab("buttons")}
            >
              Buttons
            </Button>
          </div>

          {activeTab === "headings" && headingControls}
          {activeTab === "body" && bodyControls}
          {activeTab === "buttons" && buttonControls}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="lg:col-span-8">
          <Card className="h-full min-h-[580px] border-2 border-muted/40 bg-white/50">
            <div className="border-b p-2 flex justify-end gap-2 bg-white rounded-t-lg">
              <Button
                variant={previewMode === "mobile" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === "desktop" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreviewMode("desktop")}
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>

            <CardContent className="p-10 space-y-8" style={{ fontFamily }}>
              <div className={previewWidthClass}>
                {/* Headings Preview */}
                <div className="space-y-6">
                  {(["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).map((k) => {
                    const s = headings[k];
                    const Tag = k as any;

                    return (
                      <div key={k} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-mono">
                            {k.toUpperCase()} / {headingPx(k)}px
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            w:{s.weight} · lh:{s.lineHeight.toFixed(2)} · ls:{s.letterSpacingEm.toFixed(2)}em
                          </span>
                        </div>

                        <Tag
                          style={{
                            fontSize: `${baseSize * s.scale}px`,
                            fontWeight: s.weight,
                            lineHeight: s.lineHeight,
                            letterSpacing: `${s.letterSpacingEm}em`,
                          }}
                          className="text-gray-900"
                        >
                          {k === "h1" && "Building the Future of Design"}
                          {k === "h2" && "AI-Driven Architecture"}
                          {k === "h3" && "Design Systems that Scale"}
                          {k === "h4" && "Typography & Visual Rhythm"}
                          {k === "h5" && "Small Heading Example"}
                          {k === "h6" && "Section Label / Micro Heading"}
                        </Tag>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-8" />

                {/* Body Preview */}
                <div className="space-y-2" style={{ maxWidth: `${body.maxWidthCh}ch` }}>
                  <span className="text-xs text-muted-foreground font-mono">
                    Body / {body.sizePx}px
                  </span>

                  <div
                    style={{
                      fontSize: `${body.sizePx}px`,
                      fontWeight: body.weight,
                      lineHeight: body.lineHeight,
                      letterSpacing: `${body.letterSpacingEm}em`,
                      color: "#374151",
                    }}
                  >
                    <p style={{ marginBottom: body.paragraphGapPx }}>
                      KalpTree transforms the way architects visualize exteriors. Our advanced
                      material rendering engine allows for real-time customization of textures,
                      colors, and lighting—ensuring every project matches the client’s exact vision.
                    </p>
                    <p>
                      This preview helps you tune hierarchy, rhythm, and readability. Switch tabs
                      to edit Headings (H1–H6), Body, and Button typography.
                    </p>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Buttons Preview */}
                <div className="flex flex-wrap gap-4">
                  {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => {
                    const label =
                      k === "primary" ? "Primary Action" : k === "secondary" ? "Secondary" : "Outline";
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
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Hover buttons to see hover colors/border.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
