import { ButtonBaseStyle } from "../GlobalStyleModal";

export function isHexColor(v: string) {
  return /^#([0-9a-fA-F]{6})$/.test(v.trim());
}
export function clampHexOrFallback(v: string, fallback: string) {
  return isHexColor(v) ? v.trim() : fallback;
}
export function shadowToCss(s: ButtonBaseStyle["shadow"]) {
  if (s === "sm") return "0 1px 2px rgba(0,0,0,0.08)";
  if (s === "md") return "0 6px 18px rgba(0,0,0,0.12)";
  if (s === "lg") return "0 14px 34px rgba(0,0,0,0.16)";
  return "none";
}
export function cssFont(f: string) {
  if (!f) return "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  if (f.includes(" "))
    return `"${f}", system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
  return `${f}, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
}

/* ---- color helpers ---- */
export function hexToRgb(hex: string) {
  const v = hex.replace("#", "").trim();
  if (v.length !== 6) return { r: 0, g: 0, b: 0 };
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return { r, g, b };
}
export function rgbToHex(r: number, g: number, b: number) {
  const to = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
export function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(
    A.r + (B.r - A.r) * t,
    A.g + (B.g - A.g) * t,
    A.b + (B.b - A.b) * t
  );
}
export function rgba(hex: string, alpha: number) {
  const c = hexToRgb(hex);
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

