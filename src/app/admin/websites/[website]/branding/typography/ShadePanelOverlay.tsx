import { useMemo } from "react";
import { generateMonoShades, getContrastColor } from "./utlis";
import { Pencil, Trash2 } from "lucide-react";
import { BrandTokens, ButtonTokens, ButtonVariant } from "./ColorsPallet";

export function ShadePanelOverlay({
  color,
  tokenKey,
  onSelectShade,
}: {
  color: string;
  tokenKey: string;
  onSelectShade: (shade: string, tokenKey: string) => void;
}) {
  const shades = useMemo(() => generateMonoShades(color), [color]);

  return (
    <div className="h-full w-full flex flex-col">
      {shades.map((shade) => (
        <div
          key={shade}
          className="relative flex-1 flex items-center justify-center"
          style={{ backgroundColor: shade }}
        >
          <button
            onClick={() => onSelectShade(shade, tokenKey)}
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-150 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.28)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Select
          </button>

          <div
            className="pointer-events-none absolute bottom-2 text-[10px] font-mono"
            style={{
              color:
                getContrastColor(shade) === "#FFFFFF"
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(17,24,39,0.65)",
            }}
          >
            {shade.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Toast({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999]">
      <div
        className="rounded-xl px-4 py-2 shadow-lg border"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderColor: "rgba(0,0,0,0.08)",
          color: "#111827",
          fontSize: 12,
          fontWeight: 800,
          backdropFilter: "blur(10px)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

export function PaletteCard({
  palette,
  onEdit,
  onDelete,
}: {
  palette: any;
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
}) {
  const brand: BrandTokens = palette?.colors?.brand;
  const strip = brand
    ? [
        brand.primary,
        brand.secondary,
        brand.accent,
        brand.border,
        brand.dark,
        brand.text,
      ]
    : ["#111827", "#374151", "#9CA3AF", "#E5E7EB", "#0B1220", "#111827"];

  return (
    <div
      className="rounded-2xl overflow-hidden border bg-white shadow-sm"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
    >
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-extrabold text-slate-900 leading-tight">
            {palette.name}
          </div>
          <div className="mt-1 text-[11px] font-mono text-slate-500">
            {palette._id}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(palette)}
            className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
            style={{ borderColor: "rgba(0,0,0,0.10)" }}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(palette._id)}
            className="h-9 w-9 rounded-xl border bg-white hover:bg-rose-50 flex items-center justify-center"
            style={{ borderColor: "rgba(0,0,0,0.10)" }}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="h-12 flex">
        {strip.map((c: string, i: number) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

export const BUTTON_TOKENS = [
  { id: "primary.bg", label: "Primary BG" },
  { id: "primary.hoverBg", label: "Primary Hover" },
  { id: "secondary.bg", label: "Secondary BG" },
  { id: "secondary.hoverBg", label: "Secondary Hover" },
  { id: "outline.hoverBg", label: "Outline Hover BG" },
  { id: "outline.border", label: "Outline Border" },
  { id: "outline.hoverBorder", label: "Outline Hover Border" },
] as const;

export function getButtonToken(btns: ButtonTokens, tokenId: string) {
  const [variant, prop] = tokenId.split(".") as [ButtonVariant, any];
  return (btns?.[variant]?.[prop] ?? "") as string;
}

export function setButtonToken(btns: ButtonTokens, tokenId: string, value: string) {
  const [variant, prop] = tokenId.split(".") as [ButtonVariant, any];
  const next: ButtonTokens = structuredClone(btns);

  (next[variant] as any)[prop] = value;

  // smart sync for readability
  if (variant === "primary") {
    if (prop === "bg") {
      next.primary.text = getContrastColor(value);
      next.primary.border = value;
    }
    if (prop === "hoverBg") {
      next.primary.hoverText = getContrastColor(value);
      next.primary.hoverBorder = value;
    }
  }

  if (variant === "secondary") {
    if (prop === "bg") next.secondary.text = getContrastColor(value);
    if (prop === "hoverBg") next.secondary.hoverText = getContrastColor(value);
  }

  return next;
}


export function PreviewButton({
  label,
  normal,
  hover,
}: {
  label: string;
  normal: { bg: string; text: string; border: string };
  hover: { bg: string; text: string; border: string };
}) {
  return (
    <button
      className="h-11 px-5 rounded-xl border text-[13px] font-extrabold transition"
      style={{
        background: normal.bg,
        color: normal.text,
        borderColor: normal.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hover.bg;
        e.currentTarget.style.color = hover.text;
        e.currentTarget.style.borderColor = hover.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = normal.bg;
        e.currentTarget.style.color = normal.text;
        e.currentTarget.style.borderColor = normal.border;
      }}
    >
      {label}
    </button>
  );
}