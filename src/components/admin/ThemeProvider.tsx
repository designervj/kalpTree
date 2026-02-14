"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = {
  id: string;
  name: string;
  cssVars: Record<string, string>;
  isDark: boolean;
};

export const themePresets: Record<string, Theme> = {
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

      // Sidebar tokens (HSL)
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

type ThemeContextType = {
  currentTheme: string;
  setTheme: (themeId: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function hslToCss(hsl: string) {
  // input: "211 28% 22%" => output: "hsl(211 28% 22%)"
  return `hsl(${hsl})`;
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState("brand-modern");

  const applyTheme = (themeId: string) => {
    const theme = themePresets[themeId];
    if (!theme) return;

    const root = document.documentElement;

    // 1) apply all base css vars
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 2) Toggle dark
    if (theme.isDark) root.classList.add("dark");
    else root.classList.remove("dark");

    // ✅ 3) Map sidebar HSL vars -> admin sidebar vars (actual colors)
    const sidebarBg = theme.cssVars["--sidebar"] || "0 0% 100%";
    const sidebarFg = theme.cssVars["--sidebar-foreground"] || "222.2 84% 4.9%";
    const sidebarAccent = theme.cssVars["--sidebar-accent"] || "210 40% 96.1%";
    const sidebarBorder = theme.cssVars["--sidebar-border"] || "214.3 31.8% 91.4%";

    // active = a bit stronger than accent
    root.style.setProperty("--admin-sidebar-bg", hslToCss(sidebarBg));
    root.style.setProperty("--admin-sidebar-fg", hslToCss(sidebarFg));
    root.style.setProperty("--admin-sidebar-white", "hsl(var(--muted-foreground))");

    root.style.setProperty("--admin-sidebar-hover", hslToCss(sidebarAccent));
    root.style.setProperty("--admin-sidebar-active-bg", "hsl(var(--card))");
    root.style.setProperty("--admin-sidebar-active-fg", hslToCss(sidebarFg));

    root.style.setProperty("--admin-sidebar-border", hslToCss(sidebarBorder));

    // badge using primary
    root.style.setProperty("--admin-sidebar-badge-bg", "hsl(var(--primary))");
    root.style.setProperty("--admin-sidebar-badge-fg", "hsl(var(--primary-foreground))");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme && themePresets[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("brand-modern");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  if (!context) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return context;
};
