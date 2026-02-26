// ─── Accordion-specific default content ──────────────────────────────────────

export const DEFAULT_ACCORDION_CONTENT = {
  // Accordion-specific settings
  items: [
    {
      id: "item-1",
      title: "Accordion Item #1",
      content:
        "Click edit button to change this text. Lorem ipsum dolor sit amet.",
      open: true,
    },
    {
      id: "item-2",
      title: "Accordion Item #2",
      content:
        "Click edit button to change this text. Lorem ipsum dolor sit amet.",
      open: false,
    },
    {
      id: "item-3",
      title: "Accordion Item #3",
      content:
        "Click edit button to change this text. Lorem ipsum dolor sit amet.",
      open: false,
    },
  ],
  toggleType: "accordion", // "accordion" | "toggle"
  iconPosition: "right", // "left" | "right"
  iconStyle: "plus", // "plus" | "arrow" | "chevron"
  closedIconColor: "#222C39",
  openIconColor: "#3b82f6",
};

// ─── Accordion custom fields (accordion-specific controls) ────────────────────

export const accordionContentFields = {
  type: "custom" as const,
  label: "Accordion Settings",
  defaultValue: DEFAULT_ACCORDION_CONTENT,
  render: (data: any) => {
    const { onChange, value } = data;
    const safe = value ?? DEFAULT_ACCORDION_CONTENT;

    const update = (key: string, val: any) => onChange({ ...safe, [key]: val });

    return <AccordionSettingsPanel value={safe} update={update} />;
  },
};

import { useEffect, useRef, useState } from "react";
import { generateCSS, SizeInput } from "../CustomSIzing";
import { generateTextCSS } from "../CustomText";
import { generateSpacingCSS } from "../CustomSpacing";
import { generateBorderCSS } from "../CustomBorder";
import { generateBoxShadowCSS } from "../CustomBoxShadow";
import { registerOverlayPortal } from "@puckeditor/core";
import { generateLayoutCSS } from "../CustomLayout";

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        {label}
      </label>
      <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 transition-all">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 px-2.5 appearance-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <div className="pr-2.5 pointer-events-none">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 3.5l3 3 3-3"
              stroke="#94a3b8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ColorDot({ color }: { color: string }) {
  return (
    <div
      className="w-4 h-4 rounded-full border border-slate-200 flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function AccordionSettingsPanel({
  value,
  update,
}: {
  value: typeof DEFAULT_ACCORDION_CONTENT;
  update: (k: string, v: any) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  function addItem() {
    const newItem = {
      id: `item-${Date.now()}`,
      title: `Accordion Item #${value.items.length + 1}`,
      content: "Click edit button to change this text.",
      open: false,
    };
    update("items", [...value.items, newItem]);
  }

  function removeItem(id: string) {
    update(
      "items",
      value.items.filter((i: any) => i.id !== id),
    );
  }

  function updateItem(id: string, key: string, val: any) {
    update(
      "items",
      value.items.map((i: any) => (i.id === id ? { ...i, [key]: val } : i)),
    );
  }

  function toggleOpen(id: string) {
    update(
      "items",
      value.items.map((i: any) =>
        value.toggleType === "accordion"
          ? { ...i, open: i.id === id ? !i.open : false } // only one open at a time
          : { ...i, open: i.id === id ? !i.open : i.open },
      ),
    );
  }

  return (
    <div className="bg-white">
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
          Accordion
        </span>
      </button>

      {!collapsed && (
        <div className="pb-4 border-t border-slate-100 pt-3">
          {/* Items list */}
          <div className="mb-4 space-y-2">
            {value.items.map((item: any, idx: number) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                {/* Item header */}
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 cursor-pointer select-none"
                  onClick={() => toggleOpen(item.id)}
                >
                  {/* drag handle */}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-slate-400 flex-shrink-0"
                  >
                    <circle cx="4" cy="3" r="1" fill="currentColor" />
                    <circle cx="8" cy="3" r="1" fill="currentColor" />
                    <circle cx="4" cy="6" r="1" fill="currentColor" />
                    <circle cx="8" cy="6" r="1" fill="currentColor" />
                    <circle cx="4" cy="9" r="1" fill="currentColor" />
                    <circle cx="8" cy="9" r="1" fill="currentColor" />
                  </svg>
                  <span className="flex-1 text-xs font-medium text-slate-700 truncate">
                    {item.title || `Item ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 2l6 6M8 2l-6 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      className={`text-slate-400 transition-transform ${item.open ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M2 3.5l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Item body — editable when open */}
                {item.open && (
                  <div className="px-3 py-2 space-y-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1 font-medium uppercase tracking-wider">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateItem(item.id, "title", e.target.value)
                        }
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 h-7 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1 font-medium uppercase tracking-wider">
                        Content
                      </label>
                      <textarea
                        value={item.content}
                        onChange={(e) =>
                          updateItem(item.id, "content", e.target.value)
                        }
                        rows={3}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add item button */}
          <button
            onClick={addItem}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium border border-dashed border-blue-300 hover:border-blue-400 rounded-lg py-2 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2v8M2 6h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Add Item
          </button>

          {/* Behaviour */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <SelectInput
              label="Toggle Type"
              value={value.toggleType}
              options={["accordion", "toggle"]}
              onChange={(v) => update("toggleType", v)}
            />
            <SelectInput
              label="Icon Position"
              value={value.iconPosition}
              options={["left", "right"]}
              onChange={(v) => update("iconPosition", v)}
            />
            <SelectInput
              label="Icon Style"
              value={value.iconStyle}
              options={["plus", "arrow", "chevron"]}
              onChange={(v) => update("iconStyle", v)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AccordionIcon({
  style,
  open,
  closedColor,
  openColor,
}: {
  style: string;
  open: boolean;
  closedColor: string;
  openColor: string;
}) {
  const color = open ? openColor : closedColor;

  if (style === "plus") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="flex-shrink-0 transition-transform duration-200"
      >
        <path
          d="M2 7h10"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {!open && (
          <path
            d="M7 2v10"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }
  // arrow and chevron both just rotate
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      {style === "arrow" ? (
        <path
          d="M2 4l5 6 5-6"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3 5l4 4 4-4"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function AccordionComponent({
  accordion,
  sizing,
  spacing,
  border,
  boxShadow,
  text,
  layout,
}: any) {
  // Local open state — initialised from props
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((accordion?.items ?? []).map((i) => [i.id, i.open])),
  );

  const acc = accordion ?? {
    items: [],
    toggleType: "accordion",
    iconPosition: "right",
    iconStyle: "plus",
    closedIconColor: "#222C39",
    openIconColor: "#3b82f6",
  };

  function toggle(id: string) {
    setOpenItems((prev) => {
      if (acc.toggleType === "accordion") {
        // Close all others, toggle this one
        const next: Record<string, boolean> = {};
        acc.items.forEach((i) => {
          next[i.id] = i.id === id ? !prev[id] : false;
        });
        return next;
      }
      return { ...prev, [id]: !prev[id] };
    });
  }

  // Title style from H3 (accordion titles are typically mid-level)
  const titleStyle = generateTextCSS(text?.h3);
  const bodyStyle = generateTextCSS(text?.p);

  const containerStyle: React.CSSProperties = {
    ...generateCSS(sizing),
    ...generateSpacingCSS(spacing),
    ...generateBorderCSS(border),
    ...generateBoxShadowCSS(boxShadow),
    ...generateLayoutCSS(layout),
  };

  console.log(containerStyle);

  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const cleanups = Object.values(itemRefs.current).map((el) =>
      registerOverlayPortal(el),
    );
    return () => cleanups.forEach((fn) => fn?.());
  }, [acc.items]);

  return (
    <div style={containerStyle} className="w-full">
      {acc.items.map((item, idx) => {
        const isOpen = openItems[item.id] ?? false;
        const isLast = idx === acc.items.length - 1;

        return (
          <div
            key={item.id}
            className="overflow-hidden transition-all"
            style={{
              borderBottom: isLast ? "none" : "1px solid #e2e8f0",
            }}
          >
            {/* ── Header row ── */}
            <button
              ref={(el) => {
                itemRefs.current[item.id] = el;
              }}
              onClick={() => toggle(item.id)}
              className="w-full flex items-center gap-3 py-4 px-1 text-left transition-colors hover:opacity-80"
              style={{
                flexDirection:
                  acc.iconPosition === "left" ? "row" : "row-reverse",
              }}
            >
              <AccordionIcon
                style={acc.iconStyle}
                open={isOpen}
                closedColor={acc.closedIconColor}
                openColor={acc.openIconColor}
              />
              <span className="flex-1" style={titleStyle}>
                {item.title}
              </span>
            </button>

            {/* ── Collapsible content ── */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.25s ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div className="pb-4 px-1" style={bodyStyle}>
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
