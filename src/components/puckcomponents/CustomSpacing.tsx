import { useState } from "react";
import { SizeInput } from "./CustomSIzing";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_SPACING = {
  marginTop: { value: "0", unit: "px" },
  marginBottom: { value: "0", unit: "px" },
  marginLeft: { value: "", unit: "px" },
  marginRight: { value: "", unit: "px" },
  paddingTop: { value: "", unit: "px" },
  paddingBottom: { value: "", unit: "px" },
  paddingLeft: { value: "", unit: "px" },
  paddingRight: { value: "", unit: "px" },
};

export type SpacingValue = { value: string; unit: string };
type SpacingState = typeof DEFAULT_SPACING;

// ─── Link Icon ────────────────────────────────────────────────────────────────

function LinkIcon({ linked }: { linked: boolean }) {
  return linked ? (
    // Closed chain link (linked)
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.5 9.5a3 3 0 0 0 4.243 0l1.414-1.414a3 3 0 0 0-4.243-4.243L7.086 5.17"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.5 6.5a3 3 0 0 0-4.243 0L3.843 7.914a3 3 0 0 0 4.243 4.243L9.414 10.83"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    // Open/broken chain link (unlinked)
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.5 9.5a3 3 0 0 0 4.243 0l1.414-1.414a3 3 0 0 0-4.243-4.243L7.086 5.17"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.5 6.5a3 3 0 0 0-4.243 0L3.843 7.914a3 3 0 0 0 4.243 4.243L9.414 10.83"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="1"
        x2="8"
        y2="3"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="13"
        x2="8"
        y2="15"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SpacingPanel({
  onChange,
  spacing,
}: {
  onChange: any;
  spacing: SpacingState | undefined;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [marginLinkedTopBottom, setMarginLinkedTopBottom] = useState(false);
  const [marginLinkedLeftRight, setMarginLinkedLeftRight] = useState(false);
  const [paddingLinkedLeftRight, setPaddingLinkedLeftRight] = useState(false);
  const [paddingLinkedTopBottom, setPaddingLinkedTopBottom] = useState(false);

  const updateField = (key: string, val: any) => {
    onChange({ ...spacing, [key]: val });
  };

  const s = spacing;

  // When linked, syncs all 4 sides on any change
  function handleMarginChange(key: keyof SpacingState, val: SpacingValue) {
    if (marginLinkedTopBottom) {
      const cloned = { ...spacing, marginTop: val, marginBottom: val };
      onChange(cloned);
    } else if (marginLinkedLeftRight) {
      const cloned = { ...spacing, marginLeft: val, marginRight: val };
      onChange(cloned);
    } else {
      updateField(key, val);
    }
  }

  function handlePaddingChange(key: keyof SpacingState, val: SpacingValue) {
    if (paddingLinkedTopBottom) {
      const cloned = { ...spacing, paddingTop: val, paddingBottom: val };
      onChange(cloned);
    } else if (paddingLinkedLeftRight) {
      const cloned = { ...spacing, paddingLeft: val, paddingRight: val };
      onChange(cloned);
    } else {
      updateField(key, val);
    }
  }

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
          Spacing
        </span>
      </button>

      {!collapsed && (
        <div className="pb-4 border-t border-slate-100">
          <div className="pt-3 space-y-4">
            {/* ── Margin ── */}
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Margin</p>

              {/* Top + Bottom row */}
              <div className="flex items-end gap-2 mb-1">
                <div className="flex-1">
                  <SizeInput
                    label="Margin Top"
                    value={s!.marginTop.value}
                    unit={s!.marginTop.unit}
                    onChange={(v) => handleMarginChange("marginTop", v)}
                  />
                </div>

                {/* Link toggle */}
                <button
                  onClick={() => setMarginLinkedTopBottom((l) => !l)}
                  className="mb-4 p-1 rounded hover:bg-slate-100 transition-colors"
                  title={
                    marginLinkedTopBottom ? "Unlink sides" : "Link all sides"
                  }
                >
                  <LinkIcon linked={marginLinkedTopBottom} />
                </button>

                <div className="flex-1">
                  <SizeInput
                    label="Margin Bottom"
                    value={s!.marginBottom.value}
                    unit={s!.marginBottom.unit}
                    onChange={(v) => handleMarginChange("marginBottom", v)}
                  />
                </div>
              </div>

              {/* Left + Right row */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <SizeInput
                    label="Margin Left"
                    value={s!.marginLeft.value}
                    unit={s!.marginLeft.unit}
                    onChange={(v) => handleMarginChange("marginLeft", v)}
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Left
                  </p>
                </div>

                {/* Spacer to align with link button above */}
                <button
                  onClick={() => setMarginLinkedLeftRight((l) => !l)}
                  className="mb-4 p-1 rounded hover:bg-slate-100 transition-colors"
                >
                  <LinkIcon linked={marginLinkedLeftRight} />
                </button>

                <div className="flex-1">
                  <SizeInput
                    label="Margin Right"
                    value={s!.marginRight.value}
                    unit={s!.marginRight.unit}
                    onChange={(v) => handleMarginChange("marginRight", v)}
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Right
                  </p>
                </div>
              </div>
            </div>

            {/* ── Padding ── */}
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Padding</p>

              {/* Top + Bottom row */}
              <div className="flex items-end gap-2 mb-1">
                <div className="flex-1">
                  <SizeInput
                    label="Padding Top"
                    value={s!.paddingTop.value}
                    unit={s!.paddingTop.unit}
                    onChange={(v) => handlePaddingChange("paddingTop", v)}
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Top
                  </p>
                </div>

                <button
                  onClick={() => setPaddingLinkedTopBottom((l) => !l)}
                  className="mb-4 p-1 rounded hover:bg-slate-100 transition-colors"
                  title={
                    paddingLinkedTopBottom ? "Unlink sides" : "Link all sides"
                  }
                >
                  <LinkIcon linked={paddingLinkedTopBottom} />
                </button>

                <div className="flex-1">
                  <SizeInput
                    label="Padding Bottom"
                    value={s!.paddingBottom.value}
                    unit={s!.paddingBottom.unit}
                    onChange={(v) => handlePaddingChange("paddingBottom", v)}
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Bottom
                  </p>
                </div>
              </div>

              {/* Left + Right row */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <SizeInput
                    label="Padding Left"
                    value={s!.paddingLeft.value}
                    unit={s!.paddingLeft.unit}
                    onChange={(v) => handlePaddingChange("paddingLeft", v)}
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Left
                  </p>
                </div>

                <button
                  onClick={() => setPaddingLinkedLeftRight((l) => !l)}
                  className="mb-4 p-1 rounded hover:bg-slate-100 transition-colors"
                >
                  <LinkIcon linked={paddingLinkedLeftRight} />
                </button>

                <div className="flex-1">
                  <SizeInput
                    label="Padding Right"
                    value={s!.paddingRight.value}
                    unit={s!.paddingRight.unit}
                    onChange={(v) => handlePaddingChange("paddingRight", v)}
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Right
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
