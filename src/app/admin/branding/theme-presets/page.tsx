"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, Moon, Sun } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type SimpleTheme = {
  id: "cyber-dark" | "cyber-light" | "brand-modern";
  name: string;
  isDark: boolean;
  description: string;
  font: string;
  radius: string;
  cssVars: Record<string, string>;
};

const THEMES: SimpleTheme[] = [
  {
    id: "cyber-dark",
    name: "Cyber Dark",
    isDark: true,
    description: "Dark neon admin theme with strong contrast and cyber-style accents.",
    font: "Inter",
    radius: "8px",
    cssVars: {
      // Your requested cyber colors
      "--color-cyber-bg": "#05070A",
      "--color-cyber-card": "#0D1117",
      "--color-cyber-primary": "#00F2FF",
      "--color-cyber-success": "#39FF14",
      "--color-cyber-danger": "#FF0055",
      "--color-cyber-text": "#E6EDF3",

      // App / shadcn style vars (optional but useful)
      "--background": "222 35% 4%",
      "--foreground": "210 20% 92%",
      "--card": "217 33% 8%",
      "--card-foreground": "210 20% 92%",
      "--primary": "184 100% 50%",
      "--primary-foreground": "222 47% 11%",
      "--secondary": "217 23% 16%",
      "--secondary-foreground": "210 20% 92%",
      "--accent": "217 23% 16%",
      "--accent-foreground": "210 20% 92%",
      "--muted": "217 23% 14%",
      "--muted-foreground": "215 20% 70%",
      "--border": "217 20% 20%",
      "--input": "217 20% 20%",
      "--ring": "184 100% 50%",
      "--radius": "0.5rem",
    },
  },
  {
    id: "cyber-light",
    name: "Cyber Light",
    isDark: false,
    description: "Clean light theme with the same cyber accent palette for a bright workspace.",
    font: "Inter",
    radius: "8px",
    cssVars: {
      // Light mode equivalent (matching your cyber brand style)
      "--color-cyber-bg": "#F7FAFC",
      "--color-cyber-card": "#FFFFFF",
      "--color-cyber-primary": "#00B8D9",
      "--color-cyber-success": "#16A34A",
      "--color-cyber-danger": "#E11D48",
      "--color-cyber-text": "#0F172A",

      // App / shadcn style vars
      "--background": "210 40% 98%",
      "--foreground": "222 47% 11%",
      "--card": "0 0% 100%",
      "--card-foreground": "222 47% 11%",
      "--primary": "190 95% 42%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "210 40% 96%",
      "--secondary-foreground": "222 47% 11%",
      "--accent": "187 85% 92%",
      "--accent-foreground": "222 47% 11%",
      "--muted": "210 40% 96%",
      "--muted-foreground": "215 16% 47%",
      "--border": "214 32% 91%",
      "--input": "214 32% 91%",
      "--ring": "190 95% 42%",
      "--radius": "0.5rem",
    },
  },
  {
    id: "brand-modern",
    name: "Brand Modern",
    isDark: false,
    description: "A clean, modern light theme with a rich brand accent for professional workspaces.",
    font: "Inter",
    radius: "8px",
    cssVars: {
      "--background": "210 7% 96%",
      "--foreground": "100 28% 22%",
      "--card": "0 0% 100%",
      "--card-foreground": "211 28% 22%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "211 28% 22%",
      "--primary": "322 47% 34%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "220 4% 92%",
      "--secondary-foreground": "322 47% 34%",
      "--muted": "220 4% 92%",
      "--muted-foreground": "211 10% 45%",
      "--accent": "220 4% 92%",
      "--accent-foreground": "322 47% 34%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "220 4% 88%",
      "--input": "220 4% 88%",
      "--ring": "322 47% 34%",
      "--sidebar": "211 28% 22%",
      "--sidebar-foreground": "210 7% 96%",
      "--sidebar-primary": "322 47% 34%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "211 28% 30%",
      "--sidebar-accent-foreground": "210 7% 96%",
      "--sidebar-border": "211 28% 25%",
      "--sidebar-ring": "322 47% 34%",
      "--chart-1": "322 47% 34%",
      "--chart-2": "211 28% 22%",
      "--chart-3": "220 4% 60%",
      "--chart-4": "322 47% 50%",
      "--chart-5": "211 28% 40%",
    },
  },
];

function hslVarToCss(hsl?: string, fallback = "0 0% 100%") {
  return `hsl(${hsl || fallback})`;
}

function hexOrHsl(value: string | undefined, fallbackHex: string, fallbackHsl: string) {
  if (!value) return fallbackHex;
  if (value.startsWith("#")) return value;
  return hslVarToCss(value, fallbackHsl);
}

function getPreviewMeta(theme: SimpleTheme) {
  const c = theme.cssVars;

  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    font: theme.font,
    radius: theme.radius,

    topPreviewBg: hexOrHsl(
      c["--color-cyber-bg"] || c["--background"],
      theme.isDark ? "#05070A" : "#F7FAFC",
      theme.isDark ? "222 35% 4%" : "210 40% 98%"
    ),
    topStripBg: theme.isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)",

    topColors: [
      hexOrHsl(c["--color-cyber-primary"] || c["--primary"], "#00F2FF", "184 100% 50%"),
      hexOrHsl(c["--secondary"], theme.isDark ? "#1B2430" : "#EEF2F7", "210 40% 96%"),
      hexOrHsl(c["--accent"], theme.isDark ? "#0D1117" : "#DDF8FC", "210 40% 96%"),
    ] as [string, string, string],

    pageBg: hexOrHsl(c["--color-cyber-bg"] || c["--background"], "#FFFFFF", "0 0% 100%"),
    cardBg: hexOrHsl(c["--color-cyber-card"] || c["--card"], "#FFFFFF", "0 0% 100%"),
    text: hexOrHsl(c["--color-cyber-text"] || c["--foreground"], "#111827", "222 47% 11%"),
    mutedText: hslVarToCss(c["--muted-foreground"], "215 16% 47%"),
    border: hslVarToCss(c["--border"], "214 32% 91%"),
    primary: hexOrHsl(c["--color-cyber-primary"] || c["--primary"], "#00F2FF", "184 100% 50%"),
    primaryFg: hslVarToCss(c["--primary-foreground"], theme.isDark ? "222 47% 11%" : "0 0% 100%"),
  };
}

function applyThemeToDocument(theme: SimpleTheme) {
  const root = document.documentElement;

  Object.entries(theme.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Optional data-theme flag
  root.setAttribute("data-theme", theme.isDark ? "dark" : "light");

  // Your requested body behavior
  document.body.style.backgroundColor = theme.cssVars["--color-cyber-bg"];
  document.body.style.color = theme.cssVars["--color-cyber-text"];
}

function ThemeCard({
  theme,
  isActive,
  onApply,
}: {
  theme: SimpleTheme;
  isActive: boolean;
  onApply: (id: SimpleTheme["id"]) => void;
}) {
  const preview = getPreviewMeta(theme);

  return (
    <Card
      className={[
        "overflow-hidden rounded-2xl border shadow-sm transition-all duration-200",
        "hover:shadow-md",
        isActive
          ? "border-emerald-700 ring-2 ring-emerald-700"
          : "border-emerald-100 hover:border-emerald-300",
      ].join(" ")}
      style={{ background: "#ffffff" }}
    >
      {/* Top preview area */}
      <div
        className="relative h-36 overflow-hidden border-b"
        style={{
          background: preview.topPreviewBg,
          borderColor: "#ecfdf5",
        }}
      >
        <div className="h-7 w-full" style={{ background: preview.topStripBg }} />

        {/* 3 color blocks */}
        <div className="absolute bottom-0 left-0 right-0 flex h-20">
          <div className="flex-1" style={{ background: preview.topColors[0] }} />
          <div className="flex-1" style={{ background: preview.topColors[1] }} />
          <div className="flex-1" style={{ background: preview.topColors[2] }} />
        </div>
      </div>

      <CardHeader className="pb-2 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {theme.isDark ? (
              <Moon className="h-4 w-4 text-emerald-900" />
            ) : (
              <Sun className="h-4 w-4 text-emerald-900" />
            )}
            <CardTitle className="text-[20px] leading-tight text-black">
              {preview.name}
            </CardTitle>
          </div>

          {isActive && (
            <Badge className="rounded-full bg-emerald-700 px-3 py-1 text-white hover:bg-emerald-700">
              <Check className="mr-1 h-3.5 w-3.5" />
              Active
            </Badge>
          )}
        </div>

        <CardDescription className="min-h-[64px] pt-2 text-sm text-muted-foreground leading-7">
          {preview.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-black">Font:</span>
            <span className="text-emerald-800">{preview.font}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold text-black">Radius:</span>
            <span className="text-emerald-800">{preview.radius}</span>
          </div>

          <div className="flex items-center gap-2">
            {preview.topColors.map((color, i) => (
              <span
                key={i}
                className="h-4 w-4 rounded-full border"
                style={{ background: color, borderColor: "#d1d5db" }}
              />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-1">
        {isActive ? (
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl border-primary bg-white text-sm font-semibold text-black"
            disabled
          >
            Applied
          </Button>
        ) : (
          <Button
            onClick={() => onApply(theme.id)}
            className="h-11 w-full rounded-xl  text-sm font-semibold text-white cursor-pointer "
          >
            Apply Theme
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function ThemePresetsPage() {
  const [currentTheme, setCurrentTheme] = useState<SimpleTheme["id"]>("cyber-dark");

  // Load saved theme on first render
  useEffect(() => {
    const saved = localStorage.getItem("admin-theme-mode") as SimpleTheme["id"] | null;
    const initial = saved && THEMES.some((t) => t.id === saved) ? saved : "cyber-dark";
    setCurrentTheme(initial);

    const theme = THEMES.find((t) => t.id === initial) || THEMES[0];
    applyThemeToDocument(theme);
  }, []);

  const activeTheme = useMemo(
    () => THEMES.find((t) => t.id === currentTheme) || THEMES[0],
    [currentTheme]
  );

  const activePreview = getPreviewMeta(activeTheme);

  const handleApplyTheme = (id: SimpleTheme["id"]) => {
    const selected = THEMES.find((t) => t.id === id);
    if (!selected) return;

    setCurrentTheme(id);
    localStorage.setItem("admin-theme-mode", id);
    applyThemeToDocument(selected);
  };

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        background: "#e5e7eb",
      }}
    >
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-4 md:px-6">
        {/* Header */}
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight text-emerald-950">Theme Mode</h1> */}
          <BreadCrumbPage />

          <p className="text-[15px] text-muted-foreground mt-1">
            Choose only one theme mode for your admin workspace:{" "}
            <span className="font-semibold text-dark">Dark</span> or{" "}
            <span className="font-semibold text-dark">Light</span>.
          </p>
        </div>

        {/* Only 2 theme cards */}

            {/* Live preview */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-emerald-950">Selected Theme Preview</h2>

          <div
            className="rounded-xl border p-4"
            style={{
              background: activePreview.pageBg,
              borderColor: activePreview.border,
              color: activePreview.text,
              fontFamily: activePreview.font,
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              {activePreview.topColors.map((color, i) => (
                <span
                  key={i}
                  className="h-6 w-6 rounded-full border"
                  style={{
                    background: color,
                    borderColor: "#d1d5db",
                  }}
                />
              ))}
            </div>

            <div
              className="rounded-lg border p-4"
              style={{
                background: activePreview.cardBg,
                borderColor: activePreview.border,
              }}
            >
              <p className="text-base font-semibold" style={{ color: activePreview.text }}>
                {activeTheme.name}
              </p>
              <p className="mt-1 text-sm" style={{ color: activePreview.mutedText }}>
                Minimal theme system with only two modes (Cyber Dark / Cyber Light).
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  className="rounded-lg px-4 py-2 text-sm font-semibold"
                  style={{
                    background: activePreview.primary,
                    color: activePreview.primaryFg,
                  }}
                >
                  Primary Action
                </button>

                <button
                  className="rounded-lg border px-4 py-2 text-sm font-semibold"
                  style={{
                    borderColor: activePreview.border,
                    background: activePreview.topColors[1],
                    color: activePreview.text,
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {THEMES.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={currentTheme === theme.id}
              onApply={handleApplyTheme}
            />
          ))}
        </div>

    
      </div>
    </div>
  );
}