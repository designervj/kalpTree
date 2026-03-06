import React, { useMemo, useState } from "react";
import { extractColors, extractFontsAndSizesFromHTML } from "./util/ExtractColorFont";
import { TemplateDocument } from "../TemplateType";
import { Switch } from "@/components/ui/switch";

type HtmlProps = {
  html?: Partial<TemplateDocument> | any;
};

type PaletteColor = { color: string; count: number };

const MAX_SWATCHES = 9; // circles shown in card
const MAX_MODAL_COLORS = 200; // show up to N colors in modal (full list)
const MODAL_GRID_LIMIT = 72; // default visible colors before "Show more" (optional)

function normalizeFontSize(v: unknown) {
  if (typeof v === "number") return `${v}px`;
  if (typeof v === "string" && v.trim()) return v.trim();
  return "14px";
}

function pickPrimaryFont(fontFamilies: unknown) {
  const list = Array.isArray(fontFamilies) ? fontFamilies : [];
  const raw = String(list?.[0] ?? "").trim();
  if (!raw) return "inherit";
  const first = raw.split(",")[0]?.replace(/["']/g, "").trim();
  return first || "inherit";
}

function uniqByColor(list: PaletteColor[]) {
  const seen = new Set<string>();
  const out: PaletteColor[] = [];
  for (const item of list) {
    const c = String(item?.color ?? "").toLowerCase();
    if (!c || seen.has(c)) continue;
    seen.add(c);
    out.push({ color: String(item.color), count: Number(item.count ?? 0) });
  }
  return out;
}

function safeTextColor(bgHex: string) {
  const hex = String(bgHex || "").replace("#", "");
  if (hex.length !== 6) return "#0f172a";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#0f172a" : "#ffffff";
}

const ShowPallete = ({ html }: HtmlProps) => {
  const [brandPreview, setBrandPreview] = useState(false);
  const [openColors, setOpenColors] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const content = String(html?.content ?? "");
  const label = String(html?.label ?? html?.name ?? html?.title ?? "Untitled");

  const rawColors = useMemo(() => extractColors(content), [content]);
  const { fontFamilies, fontSizes } = useMemo(
    () => extractFontsAndSizesFromHTML(content),
    [content]
  );

  const primaryFont = pickPrimaryFont(fontFamilies);
  const primaryFontSize = normalizeFontSize(Array.isArray(fontSizes) ? fontSizes?.[0] : fontSizes);

  const colors = useMemo(() => {
    const safe: PaletteColor[] =
      Array.isArray(rawColors) && rawColors.length
        ? (rawColors as PaletteColor[])
          .filter((c) => c && c.color)
          .map((c) => ({ color: String(c.color), count: Number(c.count ?? 0) }))
        : [{ color: "#e5e7eb", count: 0 }];

    // sort by usage (dominant first) + remove duplicates
    const sorted = [...safe].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
    return uniqByColor(sorted).slice(0, MAX_MODAL_COLORS);
  }, [rawColors]);

  const swatches = colors.slice(0, MAX_SWATCHES);
  const extra = Math.max(colors.length - MAX_SWATCHES, 0);

  const dominant = colors?.[0]?.color ?? "#e5e7eb";
  const accent = colors?.[1]?.color ?? dominant;
  const onDominant = safeTextColor(dominant);

  const showFont = primaryFont && primaryFont !== "inherit" ? primaryFont : "Default";

  const visibleModalColors = showMore ? colors : colors.slice(0, MODAL_GRID_LIMIT);

  return (
    <>
      {/* Bottom overlay bar (card footer) */}
      <div className="w-full rounded-xl border-0 absolute right-0 bottom-0 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-md">
        {/* Row 1: swatches left + font right */}
        <div className="flex items-center justify-between gap-3">
          {/* LEFT: circles + +N clickable */}
          <div className="flex ">
            <div className="flex min-w-0 items-center gap-1.5 bg-black/10 rounded-full px-2 py-1">
              {swatches.map((c, idx) => (
                <div
                  key={`${c.color}-${idx}`}
                  className="h-4 w-4 rounded-full ring-1 ring-white/25"
                  style={{ background: c.color }}
                  title={`${c.color}${c.count ? ` • used ${c.count}x` : ""}`}
                />
              ))}

            </div>

            {extra > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowMore(false);
                  setOpenColors(true);
                }}
                className="ml-1 cursor-pointer inline-flex items-center rounded-full border  px-2 py-0.5 text-[11px] font-semibold  active:scale-[0.98]"
                title="View all colors"
              >
                +{extra}
              </button>
            )}

          </div>


          {/* RIGHT: font family (always visible) */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right leading-tight">
              <div className="max-w-[140px] truncate text-[12px] font-semibold ">
                {showFont}
              </div>
              <div className="text-[10px] ">{primaryFontSize}</div>
            </div>
          </div>
        </div>

        {/* Row 2: template name + switch */}
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="min-w-0 truncate text-sm font-semibold " title={label}>
            {label}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Switch />
            <span className="text-[12px] font-medium ">Brand preview</span>
          </div>
        </div>

        {/* Brand preview mini panel */}
        {brandPreview && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div
              className="rounded-lg border border-white/10 p-3"
              style={{
                background: "#0b1220",
                fontFamily: primaryFont === "inherit" ? undefined : primaryFont,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md"
                  style={{ background: dominant, color: onDominant }}
                  title={`Primary: ${dominant}`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: onDominant }} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-semibold text-white">{label}</div>
                  <div className="truncate text-[10px] text-white/60">Primary + Accent preview</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-md px-3 py-1.5 text-[11px] font-semibold shadow-sm"
                  style={{ background: dominant, color: onDominant }}
                >
                  Primary CTA
                </button>

                <button
                  type="button"
                  className="rounded-md border px-3 py-1.5 text-[11px] font-semibold text-white"
                  style={{
                    borderColor: `${accent}66`,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  Secondary
                </button>

                <span
                  className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono text-white/85 ring-1 ring-white/10"
                  title={`Accent: ${accent}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
                  {accent}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL-WIDTH COLORS MODAL */}
      {openColors && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-white"
            onClick={() => setOpenColors(false)}
            aria-label="Close colors modal"
          />

          {/* Modal panel (full width like your requirement) */}
          <div className="relative w-full h-full  bg-white shadow-2xl sm:rounded-2xl rounded-t-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-slate-900">{label}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                    {colors.length} colors
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                    Font: {showFont}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-mono">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: dominant }} />
                    {dominant}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {colors.length > MODAL_GRID_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowMore((s) => !s)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    {showMore ? "Show less" : "Show more"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setOpenColors(false)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-auto p-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {visibleModalColors.map((c, idx) => (
                  <button
                    key={`${c.color}-modal-${idx}`}
                    type="button"
                    onClick={() => navigator.clipboard?.writeText?.(c.color)}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-slate-200 p-2 text-left hover:bg-slate-50 active:scale-[0.99]"
                    title="Click to copy hex"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-8 w-8 shrink-0 rounded-lg ring-1 ring-slate-200"
                        style={{ background: c.color }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-mono text-slate-900">{c.color}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.count ? `${c.count} uses` : "—"}
                        </div>
                      </div>
                    </div>

                    <span className="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-slate-600">
                      Copy
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Tip: click any color to copy its hex code.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowPallete;
