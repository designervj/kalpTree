"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = {
  id: string;
  name: string;
  cssVars: Record<string, string>;
  isDark: boolean;
};

type ThemeContextType = {
  currentTheme: string;
  setTheme: (themeId: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ------------------------
// Helpers
// ------------------------
function hslToCss(hsl: string) {
  return `hsl(${hsl})`;
}

function hexToHslRaw(hex: string): string {
  let clean = hex.replace("#", "").trim();

  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = 60 * (((g - b) / delta) % 6);
        break;
      case g:
        h = 60 * ((b - r) / delta + 2);
        break;
      case b:
        h = 60 * ((r - g) / delta + 4);
        break;
    }
  }

  if (h < 0) h += 360;

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hexOrTransparentToVar(value: string): string {
  if (value === "transparent") return "transparent";
  return hexToHslRaw(value);
}

function slugifyThemeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

type BrandButtonPalette = {
  name: string;
  colors: {
    brand: {
      primary: string;
      secondary: string;
      accent: string;
      dark: string;
      text: string;
      mutedText: string;
      border: string;
      ring: string;
    };
    buttons: {
      primary: {
        bg: string;
        text: string;
        border: string;
        hoverBg: string;
        hoverText: string;
        hoverBorder: string;
      };
      secondary: {
        bg: string;
        text: string;
        border: string;
        hoverBg: string;
        hoverText: string;
        hoverBorder: string;
      };
      outline: {
        bg: string;
        text: string;
        border: string;
        hoverBg: string;
        hoverText: string;
        hoverBorder: string;
      };
    };
  };
};

function createThemeFromBrandPalette(
  palette: BrandButtonPalette,
  isDark = false
): Theme {
  const { brand, buttons } = palette.colors;

  const background = isDark ? brand.dark : "#FFFFFF";
  const foreground = isDark ? "#FFFFFF" : brand.text;
  const card = isDark ? brand.dark : "#FFFFFF";
  const popover = isDark ? brand.dark : "#FFFFFF";

  return {
    id: slugifyThemeName(palette.name),
    name: palette.name,
    isDark,
    cssVars: {
      "--background": hexToHslRaw(background),
      "--foreground": hexToHslRaw(foreground),

      "--card": hexToHslRaw(card),
      "--card-foreground": hexToHslRaw(foreground),

      "--popover": hexToHslRaw(popover),
      "--popover-foreground": hexToHslRaw(foreground),

      "--primary": hexToHslRaw(brand.primary),
      "--primary-foreground": hexToHslRaw(buttons.primary.text),

      "--secondary": hexToHslRaw(buttons.secondary.bg),
      "--secondary-foreground": hexToHslRaw(buttons.secondary.text),

      "--muted": hexToHslRaw(buttons.secondary.bg),
      "--muted-foreground": hexToHslRaw(brand.mutedText),

      "--accent": hexToHslRaw(brand.accent),
      "--accent-foreground": hexToHslRaw(brand.text),

      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",

      "--border": hexToHslRaw(brand.border),
      "--input": hexToHslRaw(brand.border),
      "--ring": hexToHslRaw(brand.ring),

      "--sidebar": isDark ? "222 47% 11%" : "0 0% 100%",
      "--sidebar-foreground": isDark ? "210 40% 98%" : hexToHslRaw(brand.text),
      "--sidebar-primary": hexToHslRaw(brand.primary),
      "--sidebar-primary-foreground": hexToHslRaw(buttons.primary.text),
      "--sidebar-accent": isDark ? "217 33% 17%" : hexToHslRaw(brand.accent),
      "--sidebar-accent-foreground": isDark ? "210 40% 98%" : hexToHslRaw(brand.text),
      "--sidebar-border": isDark ? "217 33% 20%" : hexToHslRaw(brand.border),
      "--sidebar-ring": hexToHslRaw(brand.ring),

      "--chart-1": hexToHslRaw(brand.primary),
      "--chart-2": hexToHslRaw(brand.secondary),
      "--chart-3": hexToHslRaw(brand.accent),
      "--chart-4": hexToHslRaw(brand.dark),
      "--chart-5": hexToHslRaw(brand.ring),

      // Button vars (extra)
      "--btn-primary-bg": hexOrTransparentToVar(buttons.primary.bg),
      "--btn-primary-text": hexOrTransparentToVar(buttons.primary.text),
      "--btn-primary-border": hexOrTransparentToVar(buttons.primary.border),
      "--btn-primary-hover-bg": hexOrTransparentToVar(buttons.primary.hoverBg),
      "--btn-primary-hover-text": hexOrTransparentToVar(buttons.primary.hoverText),
      "--btn-primary-hover-border": hexOrTransparentToVar(buttons.primary.hoverBorder),

      "--btn-secondary-bg": hexOrTransparentToVar(buttons.secondary.bg),
      "--btn-secondary-text": hexOrTransparentToVar(buttons.secondary.text),
      "--btn-secondary-border": hexOrTransparentToVar(buttons.secondary.border),
      "--btn-secondary-hover-bg": hexOrTransparentToVar(buttons.secondary.hoverBg),
      "--btn-secondary-hover-text": hexOrTransparentToVar(buttons.secondary.hoverText),
      "--btn-secondary-hover-border": hexOrTransparentToVar(buttons.secondary.hoverBorder),

      "--btn-outline-bg": hexOrTransparentToVar(buttons.outline.bg),
      "--btn-outline-text": hexOrTransparentToVar(buttons.outline.text),
      "--btn-outline-border": hexOrTransparentToVar(buttons.outline.border),
      "--btn-outline-hover-bg": hexOrTransparentToVar(buttons.outline.hoverBg),
      "--btn-outline-hover-text": hexOrTransparentToVar(buttons.outline.hoverText),
      "--btn-outline-hover-border": hexOrTransparentToVar(buttons.outline.hoverBorder),
    },
  };
}

// ------------------------
// Your custom palettes (added)
// ------------------------
const customBrandPalettes: BrandButtonPalette[] = [
  {
    name: "Sunset Orange",
    colors: {
      brand: {
        primary: "#F97316",
        secondary: "#FB923C",
        accent: "#FED7AA",
        dark: "#7C2D12",
        text: "#7C2D12",
        mutedText: "#9A3412",
        border: "#FED7AA",
        ring: "#FB923C",
      },
      buttons: {
        primary: {
          bg: "#F97316",
          text: "#FFFFFF",
          border: "#F97316",
          hoverBg: "#EA580C",
          hoverText: "#FFFFFF",
          hoverBorder: "#EA580C",
        },
        secondary: {
          bg: "#FFF7ED",
          text: "#7C2D12",
          border: "#FED7AA",
          hoverBg: "#FFEDD5",
          hoverText: "#7C2D12",
          hoverBorder: "#FDBA74",
        },
        outline: {
          bg: "transparent",
          text: "#7C2D12",
          border: "#FDBA74",
          hoverBg: "#FFF7ED",
          hoverText: "#7C2D12",
          hoverBorder: "#FB923C",
        },
      },
    },
  },
  {
    name: "Royal Purple",
    colors: {
      brand: {
        primary: "#7C3AED",
        secondary: "#8B5CF6",
        accent: "#DDD6FE",
        dark: "#2E1065",
        text: "#2E1065",
        mutedText: "#5B21B6",
        border: "#EDE9FE",
        ring: "#8B5CF6",
      },
      buttons: {
        primary: {
          bg: "#7C3AED",
          text: "#FFFFFF",
          border: "#7C3AED",
          hoverBg: "#6D28D9",
          hoverText: "#FFFFFF",
          hoverBorder: "#6D28D9",
        },
        secondary: {
          bg: "#F5F3FF",
          text: "#2E1065",
          border: "#DDD6FE",
          hoverBg: "#EDE9FE",
          hoverText: "#2E1065",
          hoverBorder: "#C4B5FD",
        },
        outline: {
          bg: "transparent",
          text: "#2E1065",
          border: "#C4B5FD",
          hoverBg: "#F5F3FF",
          hoverText: "#2E1065",
          hoverBorder: "#8B5CF6",
        },
      },
    },
  },
  {
    name: "Forest Green",
    colors: {
      brand: {
        primary: "#15803D",
        secondary: "#22C55E",
        accent: "#BBF7D0",
        dark: "#052E16",
        text: "#052E16",
        mutedText: "#166534",
        border: "#DCFCE7",
        ring: "#22C55E",
      },
      buttons: {
        primary: {
          bg: "#15803D",
          text: "#FFFFFF",
          border: "#15803D",
          hoverBg: "#166534",
          hoverText: "#FFFFFF",
          hoverBorder: "#166534",
        },
        secondary: {
          bg: "#F0FDF4",
          text: "#052E16",
          border: "#BBF7D0",
          hoverBg: "#DCFCE7",
          hoverText: "#052E16",
          hoverBorder: "#86EFAC",
        },
        outline: {
          bg: "transparent",
          text: "#052E16",
          border: "#86EFAC",
          hoverBg: "#F0FDF4",
          hoverText: "#052E16",
          hoverBorder: "#22C55E",
        },
      },
    },
  },
  {
    name: "Crimson Red",
    colors: {
      brand: {
        primary: "#DC2626",
        secondary: "#EF4444",
        accent: "#FECACA",
        dark: "#450A0A",
        text: "#450A0A",
        mutedText: "#7F1D1D",
        border: "#FEE2E2",
        ring: "#EF4444",
      },
      buttons: {
        primary: {
          bg: "#DC2626",
          text: "#FFFFFF",
          border: "#DC2626",
          hoverBg: "#B91C1C",
          hoverText: "#FFFFFF",
          hoverBorder: "#B91C1C",
        },
        secondary: {
          bg: "#FEF2F2",
          text: "#450A0A",
          border: "#FECACA",
          hoverBg: "#FEE2E2",
          hoverText: "#450A0A",
          hoverBorder: "#FCA5A5",
        },
        outline: {
          bg: "transparent",
          text: "#450A0A",
          border: "#FCA5A5",
          hoverBg: "#FEF2F2",
          hoverText: "#450A0A",
          hoverBorder: "#EF4444",
        },
      },
    },
  },
  {
    name: "Teal Breeze",
    colors: {
      brand: {
        primary: "#0D9488",
        secondary: "#14B8A6",
        accent: "#99F6E4",
        dark: "#042F2E",
        text: "#042F2E",
        mutedText: "#0F766E",
        border: "#CCFBF1",
        ring: "#14B8A6",
      },
      buttons: {
        primary: {
          bg: "#0D9488",
          text: "#FFFFFF",
          border: "#0D9488",
          hoverBg: "#0F766E",
          hoverText: "#FFFFFF",
          hoverBorder: "#0F766E",
        },
        secondary: {
          bg: "#F0FDFA",
          text: "#042F2E",
          border: "#99F6E4",
          hoverBg: "#CCFBF1",
          hoverText: "#042F2E",
          hoverBorder: "#5EEAD4",
        },
        outline: {
          bg: "transparent",
          text: "#042F2E",
          border: "#5EEAD4",
          hoverBg: "#F0FDFA",
          hoverText: "#042F2E",
          hoverBorder: "#14B8A6",
        },
      },
    },
  },
  {
    name: "Golden Sand",
    colors: {
      brand: {
        primary: "#D97706",
        secondary: "#F59E0B",
        accent: "#FDE68A",
        dark: "#451A03",
        text: "#451A03",
        mutedText: "#92400E",
        border: "#FEF3C7",
        ring: "#F59E0B",
      },
      buttons: {
        primary: {
          bg: "#D97706",
          text: "#FFFFFF",
          border: "#D97706",
          hoverBg: "#B45309",
          hoverText: "#FFFFFF",
          hoverBorder: "#B45309",
        },
        secondary: {
          bg: "#FFFBEB",
          text: "#451A03",
          border: "#FDE68A",
          hoverBg: "#FEF3C7",
          hoverText: "#451A03",
          hoverBorder: "#FCD34D",
        },
        outline: {
          bg: "transparent",
          text: "#451A03",
          border: "#FCD34D",
          hoverBg: "#FFFBEB",
          hoverText: "#451A03",
          hoverBorder: "#F59E0B",
        },
      },
    },
  },
  {
    name: "Dark Slate",
    colors: {
      brand: {
        primary: "#334155",
        secondary: "#475569",
        accent: "#CBD5F5",
        dark: "#020617",
        text: "#020617",
        mutedText: "#475569",
        border: "#E2E8F0",
        ring: "#475569",
      },
      buttons: {
        primary: {
          bg: "#334155",
          text: "#FFFFFF",
          border: "#334155",
          hoverBg: "#1E293B",
          hoverText: "#FFFFFF",
          hoverBorder: "#1E293B",
        },
        secondary: {
          bg: "#F8FAFC",
          text: "#020617",
          border: "#CBD5F5",
          hoverBg: "#F1F5F9",
          hoverText: "#020617",
          hoverBorder: "#94A3B8",
        },
        outline: {
          bg: "transparent",
          text: "#020617",
          border: "#94A3B8",
          hoverBg: "#F8FAFC",
          hoverText: "#020617",
          hoverBorder: "#475569",
        },
      },
    },
  },
];

// ------------------------
// Existing + new presets
// ------------------------
const basePresets: Record<string, Theme> = {
  "brand-modern": {
    id: "brand-modern",
    name: "Brand Modern",
    isDark: false,
    cssVars: {
      "--background": "210 7% 96%",
      "--foreground": "211 28% 22%",
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

  "organic-calm": {
    id: "organic-calm",
    name: "Organic Calm",
    isDark: false,
    cssVars: {
      "--background": "30 29% 97%",
      "--foreground": "24 7% 19%",
      "--card": "60 17% 96%",
      "--card-foreground": "24 7% 19%",
      "--popover": "60 17% 96%",
      "--popover-foreground": "24 7% 19%",
      "--primary": "24 16% 50%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "30 24% 86%",
      "--secondary-foreground": "24 7% 19%",
      "--muted": "30 20% 90%",
      "--muted-foreground": "24 7% 50%",
      "--accent": "27 22% 82%",
      "--accent-foreground": "24 7% 19%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "27 22% 82%",
      "--input": "27 22% 82%",
      "--ring": "24 16% 50%",
      "--sidebar": "60 17% 94%",
      "--sidebar-foreground": "24 7% 19%",
      "--sidebar-primary": "24 16% 50%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "30 24% 86%",
      "--sidebar-accent-foreground": "24 7% 19%",
      "--sidebar-border": "27 22% 82%",
      "--sidebar-ring": "24 16% 50%",
      "--chart-1": "24 16% 50%",
      "--chart-2": "30 24% 60%",
      "--chart-3": "100 20% 50%",
      "--chart-4": "40 30% 60%",
      "--chart-5": "20 20% 60%",
    },
  },
  "royal-dusk": {
    id: "royal-dusk",
    name: "Royal Dusk",
    isDark: true,
    cssVars: {
      "--background": "212 28% 22%",
      "--foreground": "45 27% 91%",
      "--card": "212 28% 18%",
      "--card-foreground": "45 27% 91%",
      "--popover": "212 28% 18%",
      "--popover-foreground": "45 27% 91%",
      "--primary": "328 22% 35%",
      "--primary-foreground": "45 27% 91%",
      "--secondary": "37 100% 83%",
      "--secondary-foreground": "212 28% 22%",
      "--muted": "212 20% 30%",
      "--muted-foreground": "212 10% 70%",
      "--accent": "328 22% 35%",
      "--accent-foreground": "45 27% 91%",
      "--destructive": "0 62% 30%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "212 20% 35%",
      "--input": "212 20% 35%",
      "--ring": "37 100% 83%",
      "--sidebar": "212 35% 15%",
      "--sidebar-foreground": "45 27% 91%",
      "--sidebar-primary": "37 100% 83%",
      "--sidebar-primary-foreground": "212 28% 22%",
      "--sidebar-accent": "328 22% 35%",
      "--sidebar-accent-foreground": "45 27% 91%",
      "--sidebar-border": "212 20% 30%",
      "--sidebar-ring": "37 100% 83%",
      "--chart-1": "37 100% 83%",
      "--chart-2": "328 22% 50%",
      "--chart-3": "212 28% 60%",
      "--chart-4": "45 27% 91%",
      "--chart-5": "0 0% 100%",
    },
  },
  "soft-pastel": {
    id: "soft-pastel",
    name: "Soft Pastel",
    isDark: false,
    cssVars: {
      "--background": "248 100% 98%",
      "--foreground": "249 20% 20%",
      "--card": "0 0% 100%",
      "--card-foreground": "249 20% 20%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "249 20% 20%",
      "--primary": "249 100% 66%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "32 100% 93%",
      "--secondary-foreground": "249 20% 20%",
      "--muted": "240 50% 96%",
      "--muted-foreground": "249 20% 50%",
      "--accent": "240 100% 86%",
      "--accent-foreground": "249 20% 20%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "240 100% 90%",
      "--input": "240 100% 90%",
      "--ring": "249 100% 79%",
      "--sidebar": "0 0% 100%",
      "--sidebar-foreground": "249 20% 20%",
      "--sidebar-primary": "249 100% 79%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "32 100% 93%",
      "--sidebar-accent-foreground": "249 20% 20%",
      "--sidebar-border": "240 100% 92%",
      "--sidebar-ring": "249 100% 79%",
      "--chart-1": "249 100% 79%",
      "--chart-2": "24 100% 87%",
      "--chart-3": "240 100% 86%",
      "--chart-4": "32 100% 93%",
      "--chart-5": "280 60% 70%",
    },
  },
  "cyber-punk": {
    id: "cyber-punk",
    name: "Cyber Punk",
    isDark: true,
    cssVars: {
      "--background": "258 87% 20%",
      "--foreground": "0 0% 100%",
      "--card": "258 87% 15%",
      "--card-foreground": "0 0% 100%",
      "--popover": "258 87% 15%",
      "--popover-foreground": "0 0% 100%",
      "--primary": "332 91% 56%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "278 89% 38%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "258 60% 30%",
      "--muted-foreground": "258 30% 80%",
      "--accent": "229 84% 60%",
      "--accent-foreground": "0 0% 100%",
      "--destructive": "332 91% 40%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "278 89% 38%",
      "--input": "278 89% 38%",
      "--ring": "193 88% 62%",
      "--sidebar": "258 90% 12%",
      "--sidebar-foreground": "0 0% 100%",
      "--sidebar-primary": "193 88% 62%",
      "--sidebar-primary-foreground": "258 87% 20%",
      "--sidebar-accent": "278 89% 38%",
      "--sidebar-accent-foreground": "0 0% 100%",
      "--sidebar-border": "278 89% 38%",
      "--sidebar-ring": "193 88% 62%",
      "--chart-1": "332 91% 56%",
      "--chart-2": "193 88% 62%",
      "--chart-3": "278 89% 38%",
      "--chart-4": "229 84% 60%",
      "--chart-5": "260 80% 50%",
    },
  },
};

export const themePresets: Record<string, Theme> = {
  ...basePresets,
  ...Object.fromEntries(
    customBrandPalettes.map((palette) => {
      const isDark = palette.name === "Dark Slate"; // Dark Slate in dark mode
      const t = createThemeFromBrandPalette(palette, isDark);
      return [t.id, t];
    })
  ),
};

// ------------------------
// Provider
// ------------------------
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState("brand-modern");

  const applyTheme = (themeId: string) => {
    const theme = themePresets[themeId];
    if (!theme) return;

    const root = document.documentElement;

    // 1) Apply all CSS vars
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      // Button vars need actual CSS hsl(...)
      if (key.startsWith("--btn-")) {
        root.style.setProperty(key, value === "transparent" ? "transparent" : hslToCss(value));
      } else {
        root.style.setProperty(key, value);
      }
    });

    // 2) Dark mode class
    if (theme.isDark) root.classList.add("dark");
    else root.classList.remove("dark");

    // 3) Sidebar override (FULL dark or FULL light)
    const isDark = theme.isDark;

    // Keep primary from theme for highlights
    const primary = theme.cssVars["--primary"] || "222 47% 11%";
    const primaryFg = theme.cssVars["--primary-foreground"] || "0 0% 100%";

    if (isDark) {
      // ✅ FULL DARK SIDEBAR
      root.style.setProperty("--admin-sidebar-bg", "hsl(222 47% 11%)"); // deep dark
      root.style.setProperty("--admin-sidebar-fg", "hsl(210 40% 96%)");
      root.style.setProperty("--admin-sidebar-white", "hsl(215 20% 65%)");

      root.style.setProperty("--admin-sidebar-hover", "hsl(217 33% 17%)");
      root.style.setProperty("--admin-sidebar-active-bg", "hsl(217 33% 20%)");
      root.style.setProperty("--admin-sidebar-active-fg", "hsl(210 40% 98%)");

      root.style.setProperty("--admin-sidebar-border", "hsl(217 33% 22%)");

      root.style.setProperty("--admin-sidebar-badge-bg", hslToCss(primary));
      root.style.setProperty("--admin-sidebar-badge-fg", hslToCss(primaryFg));
    } else {
      // ✅ FULL LIGHT SIDEBAR
      root.style.setProperty("--admin-sidebar-bg", "hsl(0 0% 100%)");
      root.style.setProperty("--admin-sidebar-fg", "hsl(222 47% 11%)");
      root.style.setProperty("--admin-sidebar-white", "hsl(215 16% 47%)");

      root.style.setProperty("--admin-sidebar-hover", "hsl(210 40% 96%)");
      root.style.setProperty("--admin-sidebar-active-bg", "hsl(210 40% 98%)");
      root.style.setProperty("--admin-sidebar-active-fg", "hsl(222 47% 11%)");

      root.style.setProperty("--admin-sidebar-border", "hsl(214 32% 91%)");

      root.style.setProperty("--admin-sidebar-badge-bg", hslToCss(primary));
      root.style.setProperty("--admin-sidebar-badge-fg", hslToCss(primaryFg));
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme && themePresets[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("brand-modern");
    }
  }, []);

  const setTheme = (themeId: string) => {
    if (!themePresets[themeId]) return;
    setCurrentTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem("admin-theme", themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAdminTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
};