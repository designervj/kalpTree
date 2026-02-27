"use client";
import { createUsePuck, usePuck } from "@puckeditor/core";
import {
  Undo2,
  Redo2,
  Upload,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewportId = "desktop" | "tablet" | "mobile";

interface ViewportOption {
  id: ViewportId;
  icon: React.ElementType;
  label: string;
  width: number | "100%"; // matches Puck's viewport width type
  displayLabel: string;
}

const VIEWPORTS: ViewportOption[] = [
  {
    id: "desktop",
    icon: Monitor,
    label: "Desktop",
    width: "100%",
    displayLabel: "1024px",
  },
  {
    id: "tablet",
    icon: Tablet,
    label: "Tablet",
    width: 768,
    displayLabel: "768px",
  },
  {
    id: "mobile",
    icon: Smartphone,
    label: "Mobile",
    width: 360,
    displayLabel: "360px",
  },
];

// ─── Header ───────────────────────────────────────────────────────────────────
export function EditorHeader() {
  const usePuck = createUsePuck();
  const { appState, dispatch } = usePuck((s) => s);

  const [activeViewport, setActiveViewport] = useState<ViewportId>("desktop");

  const handleViewport = (vp: ViewportOption) => {
    setActiveViewport(vp.id);

    // Drive Puck's internal viewport state — this resizes the canvas correctly
    dispatch({
      type: "setUi",
      ui: {
        viewports: {
          current: {
            width: typeof vp.width == "string" ? "100%" : Number(vp.width),
            height: "auto",
          },
          controlsVisible: false,
          options: [],
        },
      },
    });
  };

  const active = VIEWPORTS.find((v) => v.id === activeViewport)!;

  return (
    <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4 flex-shrink-0 z-10">
      {/* ── Left: Brand ── */}
      <div className="flex items-center gap-2.5 w-52">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
          <Sparkles size={13} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold tracking-tight text-slate-800">
          Page Editor
        </span>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
          Beta
        </span>
      </div>

      {/* ── Center: Viewport switcher + Undo/Redo ── */}
      <div className="flex items-center gap-3">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          {[
            {
              Icon: Undo2,
              title: "Undo",
              action: () => dispatch({ type: "HISTORY_BACK" }),
            },
            {
              Icon: Redo2,
              title: "Redo",
              action: () => dispatch({ type: "HISTORY_FORWARD" }),
            },
          ].map(({ Icon, title, action }) => (
            <button
              key={title}
              title={title}
              onClick={action}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
            >
              <Icon size={15} strokeWidth={2} />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200" />

        {/* Viewport pills */}
        <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-1">
          {VIEWPORTS.map((vp) => {
            const isActive = activeViewport === vp.id;
            return (
              <button
                key={vp.id}
                title={`${vp.label} · ${vp.displayLabel}`}
                onClick={() => handleViewport(vp)}
                className={`
                  flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium
                  transition-all duration-200 select-none
                  ${
                    isActive
                      ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-400 hover:text-slate-600"
                  }
                `}
              >
                <vp.icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                {/* Label only shows for active */}
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                    isActive ? "max-w-[60px] opacity-100" : "max-w-0 opacity-0"
                  }`}
                >
                  {vp.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live width badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-400 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {active.label} · {active.displayLabel}
        </div>
      </div>

      {/* ── Right: Publish ── */}
      <div className="flex w-52 justify-end">
        <button
          onClick={() => console.log(appState.data)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
        >
          <Upload size={14} strokeWidth={2.5} />
          Publish
        </button>
      </div>
    </header>
  );
}
