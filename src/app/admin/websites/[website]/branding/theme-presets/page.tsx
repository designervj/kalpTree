"use client";

import React from "react";
import { Check } from "lucide-react";
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
import { themePresets, useAdminTheme } from "@/components/admin/ThemeProvider";


type ProviderTheme = (typeof themePresets)[string];

function hslVarToCss(hsl?: string, fallback = "0 0% 100%") {
  return `hsl(${hsl || fallback})`;
}

function getPreviewMeta(theme: ProviderTheme) {
  const c = theme.cssVars;

  return {
    id: theme.id,
    name: theme.name,
    description: `A curated ${theme.isDark ? "dark" : "light"} admin theme preset for your workspace.`,
    font:
      theme.id === "soft-pastel"
        ? "Poppins"
        : theme.id === "royal-dusk"
          ? "Merriweather"
          : theme.id === "cyber-punk"
            ? "Space Grotesk"
            : "Inter",
    radius: "8px",

    // top preview backgrounds
    topPreviewBg: hslVarToCss(c["--background"], "210 20% 95%"),
    topStripBg: theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",

    // 3 color blocks (THIS is what you highlighted in red)
    topColors: [
      hslVarToCss(c["--primary"], "222 47% 11%"),
      hslVarToCss(c["--secondary"], "210 40% 96%"),
      hslVarToCss(c["--accent"], "210 40% 96%"),
    ] as [string, string, string],

    // full preview area colors
    pageBg: hslVarToCss(c["--background"], "0 0% 100%"),
    cardBg: hslVarToCss(c["--card"], "0 0% 100%"),
    text: hslVarToCss(c["--foreground"], "222 47% 11%"),
    mutedText: hslVarToCss(c["--muted-foreground"], "215 16% 47%"),
    border: hslVarToCss(c["--border"], "214 32% 91%"),
    primary: hslVarToCss(c["--primary"], "222 47% 11%"),
    primaryFg: hslVarToCss(c["--primary-foreground"], "0 0% 100%"),
  };
}

function ThemeCard({
  theme,
  isActive,
  onApply,
}: {
  theme: ProviderTheme;
  isActive: boolean;
  onApply: (id: string) => void;
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
      style={{
        background: "#ffffff",
      }}
    >
      {/* Top preview area */}
      <div
        className="relative h-36 overflow-hidden border-b"
        style={{
          background: preview.topPreviewBg,
          borderColor: "#ecfdf5",
        }}
      >
        {/* top strip */}
        <div
          className="h-7 w-full"
          style={{ background: preview.topStripBg }}
        />

        {/* 3 color blocks strip - from provider colors */}
        <div className="absolute bottom-0 left-0 right-0 h-20 flex">
          <div className="flex-1" style={{ background: preview.topColors[0] }} />
          <div className="flex-1" style={{ background: preview.topColors[1] }} />
          <div className="flex-1" style={{ background: preview.topColors[2] }} />
        </div>
      </div>

      <CardHeader className="pb-2 pt-5">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-[20px] leading-tight text-emerald-950">
            {preview.name}
          </CardTitle>

          {isActive && (
            <Badge className="rounded-full bg-emerald-700 px-3 py-1 text-white hover:bg-emerald-700">
              <Check className="mr-1 h-3.5 w-3.5" />
              Active
            </Badge>
          )}
        </div>

        <CardDescription className="min-h-[64px] pt-2 text-base leading-7 text-emerald-900">
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
        </div>
      </CardContent>

      <CardFooter className="pt-1">
        {isActive ? (
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl border-emerald-100 bg-white text-lg font-semibold text-emerald-900"
            disabled
          >
            Applied
          </Button>
        ) : (
          <Button
            onClick={() => onApply(theme.id)}
            className="h-11 w-full rounded-xl bg-emerald-700 text-lg font-semibold text-white hover:bg-emerald-800"
          >
            Apply Theme
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function ThemePresetsPage() {
  const { currentTheme, setTheme } = useAdminTheme();

  // Convert provider object to array
  const allThemes = Object.values(themePresets);

  // Optional: put some themes first (you can change order)
  const orderedThemes = [
    ...allThemes.filter((t) =>
      ["brand-modern", "organic-calm", "royal-dusk", "soft-pastel", "cyber-punk"].includes(t.id)
    ),
    ...allThemes.filter(
      (t) =>
        !["brand-modern", "organic-calm", "royal-dusk", "soft-pastel", "cyber-punk"].includes(t.id)
    ),
  ];

  const activeTheme = themePresets[currentTheme] || orderedThemes[0];
  const activePreview = getPreviewMeta(activeTheme);

  const handleApplyTheme = (id: string) => {
    setTheme(id); // ✅ calls provider applyTheme + localStorage save
  };

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        background: "#e5e7eb", // page background like your screenshot
      }}
    >
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 md:px-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
            Theme Presets
          </h1>
          <p className="text-[15px] text-emerald-800">
            Instantly apply a{" "}
            <span className="bg-blue-600 px-1 text-white">cohesive</span> look to your entire
            workspace.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orderedThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={currentTheme === theme.id}
              onApply={handleApplyTheme}
            />
          ))}
        </div>

        {/* Live preview section using provider colors */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-emerald-950">
            Selected Theme Preview
          </h2>

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
                Provider-based preview using --background, --primary, --secondary, --accent, and
                --card variables.
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
      </div>
    </div>
  );
}