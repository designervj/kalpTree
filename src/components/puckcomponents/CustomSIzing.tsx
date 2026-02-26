import { useState, useRef, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const UNIT_GROUPS = [
  ["px", "%", "em", "rem", "vw", "vh", "vmin", "vmax"],
  ["calc", "min", "max", "clamp"],
  ["auto", "inherit", "unset", "css var"],
];

export const DEFAULT_SIZING = {
  width: { value: "", unit: "auto" },
  maxWidth: { value: "", unit: "none" },
  sectionAlignment: "center",
  minHeight: { value: "", unit: "auto" },
  height: { value: "", unit: "auto" },
  maxHeight: { value: "", unit: "none" },
};

// ─── Align Icons ──────────────────────────────────────────────────────────────

const AlignIcons: Record<string, JSX.Element> = {
  "flex-start": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="2" height="10" fill="currentColor" />
      <rect
        x="5"
        y="5"
        width="7"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  ),
  center: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="7" y="2" width="2" height="12" fill="currentColor" />
      <rect
        x="3"
        y="5"
        width="10"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  ),
  "flex-end": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="12" y="3" width="2" height="10" fill="currentColor" />
      <rect
        x="4"
        y="5"
        width="7"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  ),
};

// ─── UnitDropdown ─────────────────────────────────────────────────────────────

function UnitDropdown({
  value,
  onChange,
  anchorRef,
  onClose,
}: {
  value: string;
  onChange: (u: string) => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, anchorRef]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
      style={{ minWidth: 88 }}
    >
      {UNIT_GROUPS.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && <div className="h-px bg-slate-100 my-0.5" />}
          {group.map((unit) => (
            <div
              key={unit}
              onClick={() => {
                onChange(unit);
                onClose();
              }}
              className={`px-3 py-1 text-xs cursor-pointer font-mono transition-colors ${
                value === unit
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {unit}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── SizeInput ────────────────────────────────────────────────────────────────

export function SizeInput({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: string;
  unit: string;
  onChange: (v: { value: string; unit: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mb-3">
      {label && (
        <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange({ value: e.target.value, unit })}
          placeholder={unit === "auto" || unit === "none" ? unit : ""}
          className="flex-1 w-10 bg-transparent border-none outline-none text-xs font-mono text-slate-700 px-2.5 placeholder-slate-400"
        />
        <div className="w-px h-4 bg-slate-200" />
        <button
          ref={btnRef}
          onClick={() => setOpen((o) => !o)}
          className="px-2.5 text-xs font-mono text-slate-400 hover:text-blue-600 transition-colors outline-none min-w-[42px] text-right"
        >
          {unit}
        </button>
        {open && (
          <UnitDropdown
            value={unit}
            onChange={(u) => onChange({ value, unit: u })}
            anchorRef={btnRef}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

// ─── SizingPanel ──────────────────────────────────────────────────────────────

export function SizingPanel({
  updateField,
  sizing,
}: {
  updateField: (key: string, val: any) => void;
  sizing: typeof DEFAULT_SIZING | undefined;
}) {
  const [collapsed, setCollapsed] = useState(true);

  // ✅ Guard: use defaults if sizing is undefined (first render)
  const s = sizing ?? DEFAULT_SIZING;

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
          Sizing
        </span>
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="pt-3">
            <SizeInput
              label="Width"
              value={s.width.value}
              unit={s.width.unit}
              onChange={(v) => updateField("width", v)}
            />
            <SizeInput
              label="Max Width"
              value={s.maxWidth.value}
              unit={s.maxWidth.unit}
              onChange={(v) => updateField("maxWidth", v)}
            />

            {/* Section Alignment */}
            <div className="mb-3">
              <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
                Section Alignment
              </label>
              <div className="flex gap-1.5">
                {(["flex-start", "center", "flex-end"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField("sectionAlignment", opt)}
                    className={`w-9 h-8 rounded-md flex items-center justify-center transition-all border ${
                      s.sectionAlignment === opt
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                    }`}
                  >
                    {AlignIcons[opt]}
                  </button>
                ))}
              </div>
            </div>

            <SizeInput
              label="Min Height"
              value={s.minHeight.value}
              unit={s.minHeight.unit}
              onChange={(v) => updateField("minHeight", v)}
            />
            <SizeInput
              label="Height"
              value={s.height.value}
              unit={s.height.unit}
              onChange={(v) => updateField("height", v)}
            />
            <SizeInput
              label="Max Height"
              value={s.maxHeight.value}
              unit={s.maxHeight.unit}
              onChange={(v) => updateField("maxHeight", v)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

type SizeField = {
  value: string | number;
  unit: string;
};

type SectionStyle = {
  width?: SizeField;
  maxWidth?: SizeField;
  minHeight?: SizeField;
  height?: SizeField;
  maxHeight?: SizeField;
  sectionAlignment?: string;
};

export function generateCSS(styles: SectionStyle): React.CSSProperties {
  const css: React.CSSProperties = {};

  const applySize = (key: keyof React.CSSProperties, field?: SizeField) => {
    if (!field) return;

    const { value, unit } = field;

    // Skip if unit is none
    if (unit === "none") return;

    // Handle auto
    if (unit === "auto") {
      css[key] = "auto";
      return;
    }

    // Skip empty values
    if (value === "" || value === null || value === undefined) return;

    css[key] = `${value}${unit}`;
  };

  applySize("width", styles.width);
  applySize("maxWidth", styles.maxWidth);
  applySize("minHeight", styles.minHeight);
  applySize("height", styles.height);
  applySize("maxHeight", styles.maxHeight);

  // Section alignment (example mapping)
  if (styles.sectionAlignment === "center") {
    css.marginLeft = "auto";
    css.marginRight = "auto";
  }

  return css;
}
