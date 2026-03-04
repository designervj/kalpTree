import { BrandTokens, ButtonTokens } from "./ColorsPallet";

export function hexToHsl(hex: string) {
  if (!hex || hex === "transparent") return [0, 0, 50] as const;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return [h * 360, s * 100, l * 100] as const;
}

export function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export function getContrastColor(hex: string) {
  if (!hex || hex === "transparent") return "#111827";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55
    ? "#111827"
    : "#FFFFFF";
}

export function generateAnalogous(hex: string, count = 8, range = 70) {
  const [h, s, l] = hexToHsl(hex);

  const offsets = Array.from({ length: count }, () => {
    let v = 0;
    while (v === 0) v = Math.floor(Math.random() * (range * 2 + 1)) - range;
    return v;
  }).sort((a, b) => a - b);

  return offsets.map((d) =>
    hslToHex(
      (h + d + 360) % 360,
      Math.min(s, 80),
      Math.max(Math.min(l, 65), 35),
    ),
  );
}

export function generateMonoShades(hex: string) {
  const base = hex === "transparent" ? "#FFFFFF" : hex;
  const [h, s] = hexToHsl(base);
  return [
    95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5,
  ].map((l) => hslToHex(h, Math.min(s, 85), l));
}

export function deriveBrand(an: string[], sh: string[][]): BrandTokens {
  const m = 3;
  return {
    primary: an[m],
    secondary: an[m - 1],
    accent: sh[m]?.[1] ?? an[m + 2],
    background: sh[m]?.[12] ?? an[0],
    text: sh[m]?.[14] ?? "#111827",
    mutedText: sh[m]?.[10] ?? an[m - 1],
    border: sh[m]?.[6] ?? an[m + 2],
    ring: an[m - 1],
  };
}

export function deriveButtons(
  brand: BrandTokens,
  sh: string[][],
): ButtonTokens {
  const m = 3;
  const primaryBg = brand.primary;
  const primaryHover = sh[m]?.[12] ?? brand.background;

  const secondaryBg = sh[m]?.[1] ?? brand.accent;
  const secondaryHover = sh[m]?.[2] ?? brand.accent;

  const outlineHoverBg = sh[m]?.[0] ?? "#F2F7F4";

  return {
    primary: {
      bg: primaryBg,
      text: getContrastColor(primaryBg),
      border: primaryBg,
      hoverBg: primaryHover,
      hoverText: getContrastColor(primaryHover),
      hoverBorder: primaryHover,
    },
    secondary: {
      bg: secondaryBg,
      text: getContrastColor(secondaryBg),
      border: brand.border,
      hoverBg: secondaryHover,
      hoverText: getContrastColor(secondaryHover),
      hoverBorder: sh[m]?.[3] ?? brand.border,
    },
    outline: {
      bg: "transparent",
      text: brand.text,
      border: brand.border,
      hoverBg: outlineHoverBg,
      hoverText: brand.text,
      hoverBorder: sh[m]?.[2] ?? brand.border,
    },
  };
}

export function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export function safeHex(v: string) {
  const s = v.replace("#", "").trim();
  const cleaned = s.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
  return `#${cleaned.toUpperCase()}`;
}
