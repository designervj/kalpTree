"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------
  Types
----------------------------------------------------------------------------- */
type TabKey = "module" | "row" | "library";

type ModuleItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type FlexLayoutItem = {
  id: string;
  label: string;
  type: "flex";
  // Representing widths as parts of a whole (e.g. [1, 1] is 50/50)
  widths: number[];
};

type GridCell = {
  col: number; // 1-based
  row: number; // 1-based
  colSpan?: number;
  rowSpan?: number;
};

type GridLayoutItem = {
  id: string;
  label: string;
  type: "grid";
  cols: number;
  rows: number;
  cells: GridCell[];
};

type LayoutItem = FlexLayoutItem | GridLayoutItem;

type LayoutGroup = {
  badge: "Flex" | "Grid";
  title: string;
  items: LayoutItem[];
};

type LibraryTemplate = {
  id: string;
  title: string;
  fontLabel: string;
  fontSize: string;
  colorDots: string[];
  colorMoreCount?: number;
  brandPreview?: boolean;
};

/* -----------------------------------------------------------------------------
  Mock Data (replace with real)
----------------------------------------------------------------------------- */
const MODULES: ModuleItem[] = [
  { id: "group", label: "Group", icon: <LayoutGrid className="h-5 w-5" /> },
  {
    id: "carousel",
    label: "Group Carousel",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "accordion",
    label: "Accordion",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  { id: "audio", label: "Audio", icon: <LayoutGrid className="h-5 w-5" /> },
  {
    id: "bar",
    label: "Bar Counters",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  { id: "blog", label: "Blog", icon: <LayoutGrid className="h-5 w-5" /> },
  { id: "blurb", label: "Blurb", icon: <LayoutGrid className="h-5 w-5" /> },
  {
    id: "button",
    label: "Button",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "cta",
    label: "Call To Action",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "portal",
    label: "Canvas Portal",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "circle",
    label: "Circle Counter",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  { id: "code", label: "Code", icon: <LayoutGrid className="h-5 w-5" /> },
  {
    id: "comments",
    label: "Comments",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "contact",
    label: "Contact Form",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "countdown",
    label: "Countdown Timer",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "divider",
    label: "Divider",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "optin",
    label: "Email Optin",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "portfolio",
    label: "Filterable Portfolio",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
];

const LAYOUT_GROUPS: LayoutGroup[] = [
  // ---------------- FLEX (existing) ----------------
  {
    badge: "Flex",
    title: "Equal Columns",
    items: [
      { id: "eq-1", label: "1 Column", type: "flex", widths: [1] },
      { id: "eq-2", label: "2 Columns", type: "flex", widths: [1, 1] },
      { id: "eq-3", label: "3 Columns", type: "flex", widths: [1, 1, 1] },
      { id: "eq-4", label: "4 Columns", type: "flex", widths: [1, 1, 1, 1] },
      { id: "eq-5", label: "5 Columns", type: "flex", widths: [1, 1, 1, 1, 1] },
      {
        id: "eq-6",
        label: "6 Columns",
        type: "flex",
        widths: [1, 1, 1, 1, 1, 1],
      },
      {
        id: "eq-7",
        label: "7 Columns",
        type: "flex",
        widths: [1, 1, 1, 1, 1, 1, 1],
      },
      {
        id: "eq-8",
        label: "8 Columns",
        type: "flex",
        widths: [1, 1, 1, 1, 1, 1, 1, 1],
      },
    ],
  },
  {
    badge: "Flex",
    title: "Offset Columns",
    items: [
      { id: "of-1", label: "2/3 + 1/3", type: "flex", widths: [2, 1] },
      { id: "of-2", label: "1/3 + 2/3", type: "flex", widths: [1, 2] },
      { id: "of-3", label: "1/2 + 1/4 + 1/4", type: "flex", widths: [2, 1, 1] },
      { id: "of-4", label: "1/4 + 1/4 + 1/2", type: "flex", widths: [1, 1, 2] },
      { id: "of-5", label: "3/4 + 1/4", type: "flex", widths: [3, 1] },
      { id: "of-6", label: "1/4 + 3/4", type: "flex", widths: [1, 3] },
      { id: "of-7", label: "1/4 + 1/2 + 1/4", type: "flex", widths: [1, 2, 1] },
      { id: "of-8", label: "Multi Split", type: "flex", widths: [1, 4, 1] },
      { id: "of-9", label: "Narrow Middle", type: "flex", widths: [2, 1, 2] },
      { id: "of-10", label: "Inner Split", type: "flex", widths: [1, 1, 4] },
      { id: "of-11", label: "Outer Split", type: "flex", widths: [4, 1, 1] },
      { id: "of-12", label: "Full Complex", type: "flex", widths: [1, 2, 1] },
    ],
  },

  // ---------------- GRID (new, under Flex) ----------------
  {
    badge: "Grid",
    title: "Multi-Row",
    items: [
      {
        id: "gr-mr-1",
        label: "2-up Header",
        type: "grid",
        cols: 4,
        rows: 2,
        cells: [
          { col: 1, row: 1, colSpan: 4 },
          { col: 1, row: 2, colSpan: 2 },
          { col: 3, row: 2, colSpan: 2 },
        ],
      },
      {
        id: "gr-mr-2",
        label: "Header + Sidebar",
        type: "grid",
        cols: 4,
        rows: 2,
        cells: [
          { col: 1, row: 1, colSpan: 4 },
          { col: 1, row: 2, colSpan: 3 },
          { col: 4, row: 2, colSpan: 1 },
        ],
      },
      {
        id: "gr-mr-3",
        label: "3 Cards",
        type: "grid",
        cols: 6,
        rows: 2,
        cells: [
          { col: 1, row: 1, colSpan: 6 },
          { col: 1, row: 2, colSpan: 2 },
          { col: 3, row: 2, colSpan: 2 },
          { col: 5, row: 2, colSpan: 2 },
        ],
      },
      {
        id: "gr-mr-4",
        label: "2x2 Grid",
        type: "grid",
        cols: 4,
        rows: 4,
        cells: [
          { col: 1, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 3, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 1, row: 3, colSpan: 2, rowSpan: 2 },
          { col: 3, row: 3, colSpan: 2, rowSpan: 2 },
        ],
      },
      {
        id: "gr-mr-5",
        label: "Tall Left + 2 Right",
        type: "grid",
        cols: 4,
        rows: 4,
        cells: [
          { col: 1, row: 1, colSpan: 2, rowSpan: 4 },
          { col: 3, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 3, row: 3, colSpan: 2, rowSpan: 2 },
        ],
      },
      {
        id: "gr-mr-6",
        label: "4 Small + Wide",
        type: "grid",
        cols: 4,
        rows: 4,
        cells: [
          { col: 1, row: 1, colSpan: 1, rowSpan: 2 },
          { col: 2, row: 1, colSpan: 1, rowSpan: 2 },
          { col: 3, row: 1, colSpan: 1, rowSpan: 2 },
          { col: 4, row: 1, colSpan: 1, rowSpan: 2 },
          { col: 1, row: 3, colSpan: 4, rowSpan: 2 },
        ],
      },
      {
        id: "gr-mr-7",
        label: "Split + Footer",
        type: "grid",
        cols: 4,
        rows: 3,
        cells: [
          { col: 1, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 3, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 1, row: 3, colSpan: 4, rowSpan: 1 },
        ],
      },
      {
        id: "gr-mr-8",
        label: "Center Wide",
        type: "grid",
        cols: 6,
        rows: 3,
        cells: [
          { col: 1, row: 1, colSpan: 6, rowSpan: 1 },
          { col: 1, row: 2, colSpan: 2, rowSpan: 1 },
          { col: 3, row: 2, colSpan: 2, rowSpan: 1 },
          { col: 5, row: 2, colSpan: 2, rowSpan: 1 },
          { col: 2, row: 3, colSpan: 4, rowSpan: 1 },
        ],
      },
    ],
  },
  {
    badge: "Grid",
    title: "Masonry",
    items: [
      {
        id: "gr-ms-1",
        label: "Masonry 1",
        type: "grid",
        cols: 6,
        rows: 6,
        cells: [
          { col: 1, row: 1, colSpan: 3, rowSpan: 3 },
          { col: 4, row: 1, colSpan: 3, rowSpan: 2 },
          { col: 4, row: 3, colSpan: 3, rowSpan: 4 },
          { col: 1, row: 4, colSpan: 3, rowSpan: 3 },
        ],
      },
      {
        id: "gr-ms-2",
        label: "Masonry 2",
        type: "grid",
        cols: 6,
        rows: 6,
        cells: [
          { col: 1, row: 1, colSpan: 2, rowSpan: 4 },
          { col: 3, row: 1, colSpan: 4, rowSpan: 2 },
          { col: 3, row: 3, colSpan: 2, rowSpan: 4 },
          { col: 5, row: 3, colSpan: 2, rowSpan: 4 },
        ],
      },
      {
        id: "gr-ms-3",
        label: "Masonry 3",
        type: "grid",
        cols: 6,
        rows: 6,
        cells: [
          { col: 1, row: 1, colSpan: 4, rowSpan: 3 },
          { col: 5, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 5, row: 3, colSpan: 2, rowSpan: 4 },
          { col: 1, row: 4, colSpan: 2, rowSpan: 3 },
          { col: 3, row: 4, colSpan: 2, rowSpan: 3 },
        ],
      },
      {
        id: "gr-ms-4",
        label: "Masonry 4",
        type: "grid",
        cols: 6,
        rows: 6,
        cells: [
          { col: 1, row: 1, colSpan: 2, rowSpan: 3 },
          { col: 3, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 5, row: 1, colSpan: 2, rowSpan: 3 },
          { col: 3, row: 3, colSpan: 2, rowSpan: 4 },
          { col: 1, row: 4, colSpan: 2, rowSpan: 3 },
          { col: 5, row: 4, colSpan: 2, rowSpan: 3 },
        ],
      },
      {
        id: "gr-ms-5",
        label: "Masonry 5",
        type: "grid",
        cols: 6,
        rows: 6,
        cells: [
          { col: 1, row: 1, colSpan: 3, rowSpan: 2 },
          { col: 4, row: 1, colSpan: 3, rowSpan: 4 },
          { col: 1, row: 3, colSpan: 3, rowSpan: 4 },
        ],
      },
      {
        id: "gr-ms-6",
        label: "Masonry 6",
        type: "grid",
        cols: 6,
        rows: 6,
        cells: [
          { col: 1, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 3, row: 1, colSpan: 2, rowSpan: 3 },
          { col: 5, row: 1, colSpan: 2, rowSpan: 2 },
          { col: 1, row: 3, colSpan: 2, rowSpan: 4 },
          { col: 5, row: 3, colSpan: 2, rowSpan: 4 },
          { col: 3, row: 4, colSpan: 2, rowSpan: 3 },
        ],
      },
      {
        id: "gr-ms-7",
        label: "Masonry 7",
        type: "grid",
        cols: 6,
        rows: 6,
        cells: [
          { col: 1, row: 1, colSpan: 6, rowSpan: 2 },
          { col: 1, row: 3, colSpan: 2, rowSpan: 4 },
          { col: 3, row: 3, colSpan: 2, rowSpan: 2 },
          { col: 5, row: 3, colSpan: 2, rowSpan: 3 },
          { col: 3, row: 5, colSpan: 2, rowSpan: 2 },
        ],
      },
      {
        id: "gr-ms-8",
        label: "Masonry 8",
        type: "grid",
        cols: 6,
        rows: 6,
        cells: [
          { col: 1, row: 1, colSpan: 3, rowSpan: 4 },
          { col: 4, row: 1, colSpan: 3, rowSpan: 2 },
          { col: 4, row: 3, colSpan: 3, rowSpan: 4 },
          { col: 1, row: 5, colSpan: 3, rowSpan: 2 },
        ],
      },
    ],
  },
];

const LIBRARY_ALL: LibraryTemplate[] = [
  {
    id: "t-hero-slider",
    title: "Hero Slider",
    fontLabel: "Poppins",
    fontSize: "14px",
    colorDots: ["#FFFFFF", "#F7F7F7", "#E6E6E6", "#3B82F6", "#111827"],
    colorMoreCount: 11,
    brandPreview: true,
  },
  {
    id: "t-cat-test",
    title: "Cat Test",
    fontLabel: "Plus Jakarta Sans",
    fontSize: "52px",
    colorDots: ["#FFFFFF", "#E6E6E6", "#111827", "#0EA5E9", "#22C55E", "#A855F7"],
    colorMoreCount: 29,
    brandPreview: true,
  },
  {
    id: "t-landing-1",
    title: "Landing Clean",
    fontLabel: "Inter",
    fontSize: "18px",
    colorDots: ["#FFFFFF", "#111827", "#2563EB", "#F59E0B"],
    colorMoreCount: 6,
  },
  {
    id: "t-portfolio",
    title: "Portfolio Grid",
    fontLabel: "Manrope",
    fontSize: "16px",
    colorDots: ["#FFFFFF", "#0F172A", "#14B8A6", "#E11D48"],
    colorMoreCount: 14,
  },
];

const LIBRARY_MINE: LibraryTemplate[] = [];

/* -----------------------------------------------------------------------------
  Component
----------------------------------------------------------------------------- */
export function InsertModuleOrRowModal({
  open,
  onOpenChange,
  defaultTab = "module",
  onAddModule,
  onAddRow,
  onAddTemplate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultTab?: TabKey;
  onAddModule?: (id: string) => void;
  onAddRow?: (id: string) => void;
  onAddTemplate?: (id: string) => void;
}) {
  const [tab, setTab] = React.useState<TabKey>(defaultTab);
  const [q, setQ] = React.useState("");

  React.useEffect(() => setTab(defaultTab), [defaultTab]);

  const filteredModules = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MODULES;
    return MODULES.filter((m) => m.label.toLowerCase().includes(s));
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Trigger example (optional) */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          Insert Module Or Row
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 max-w-[760px] w-[92vw] sm:w-[760px] gap-0 rounded-[10px]">
        {/* Header */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="text-[18px] font-semibold leading-6">
                Insert Module Or Row
              </DialogTitle>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className={cn(
                "h-9 w-9 rounded-full grid place-items-center",
                "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
                "transition"
              )}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs row */}
          <div className="mt-4">
            <div className="flex items-end gap-6 text-[14px]">
              <TopTab active={tab === "row"} onClick={() => setTab("row")} label="Layout" />
              <TopTab active={tab === "module"} onClick={() => setTab("module")} label="Blocks" />
              <TopTab
                active={tab === "library"}
                onClick={() => setTab("library")}
                label="Add From Library"
              />
            </div>
          </div>

          {/* Search only for modules tab */}
          {tab === "module" && (
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search for a module"
                  className={cn(
                    "h-11 pl-9 rounded-[6px]",
                    "border-slate-200 bg-white",
                    "focus-visible:ring-0 focus-visible:border-blue-500"
                  )}
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Body */}
        <div className="px-0 py-5">
          {tab === "module" && (
            <ModulesGrid modules={filteredModules} onAdd={(id) => onAddModule?.(id)} />
          )}

          {/* UPDATED: Flex + Grid both inside Layout tab */}
          {tab === "row" && <LayoutsGrid onAdd={(id) => onAddRow?.(id)} />}

          {tab === "library" && (
            <LibraryGrid
              allTemplates={LIBRARY_ALL}
              myTemplates={LIBRARY_MINE}
              onAdd={(id) => onAddTemplate?.(id)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -----------------------------------------------------------------------------
  Top Tab
----------------------------------------------------------------------------- */
function TopTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative pb-2 font-medium",
        active ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
      )}
    >
      {label}
      <span
        className={cn(
          "absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full transition",
          active ? "bg-blue-600" : "bg-transparent"
        )}
      />
    </button>
  );
}

/* -----------------------------------------------------------------------------
  Modules Tab
----------------------------------------------------------------------------- */
function ModulesGrid({
  modules,
  onAdd,
}: {
  modules: ModuleItem[];
  onAdd: (id: string) => void;
}) {
  return (
    <ScrollArea className="h-[400px] pr-3">
      <div className="grid grid-cols-3 gap-x-10 gap-y-2 pt-1 px-4">
        {modules.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onAdd(m.id)}
            onDoubleClick={() => onAdd(m.id)}
            className={cn(
              "group flex flex-col items-center text-center border border-transparent hover:bg-white hover:border hover:border-slate-200 hover:bg-slate-50 py-4 rounded-md cursor-pointer",
              "select-none"
            )}
          >
            <div className={cn("grid place-items-center", "transition")}>
              <div className="text-black group-hover:text-slate-700 transition">{m.icon}</div>
            </div>
            <div className="mt-2 text-[13px] text-black">{m.label}</div>
          </button>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="py-16 text-center text-[13px] text-slate-500">No modules found.</div>
      )}
    </ScrollArea>
  );
}

/* -----------------------------------------------------------------------------
  Layouts Tab (Flex + Grid)
----------------------------------------------------------------------------- */
function LayoutsGrid({ onAdd }: { onAdd: (id: string) => void }) {
  return (
    <ScrollArea className="h-[460px] pr-3">
      <div className="space-y-5 ps-6 pe-2">
        {LAYOUT_GROUPS.map((g) => (
          <div key={`${g.badge}-${g.title}`}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={cn(
                  "inline-flex items-center h-5 px-2 rounded-[4px] text-[12px] font-medium",
                  g.badge === "Flex"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                )}
              >
                {g.badge}
              </span>
              <div className="text-[14px] font-medium text-slate-800">{g.title}</div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {g.items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => onAdd(it.id)}
                  onDoubleClick={() => onAdd(it.id)}
                  title={it.label}
                  className={cn(
                    "h-[58px] rounded-[6px]",
                    "border border-slate-200 bg-white",
                    "hover:bg-slate-50 hover:border-slate-300 transition",
                    "px-3"
                  )}
                >
                  {it.type === "flex" ? (
                    <FlexMiniPreview widths={it.widths} />
                  ) : (
                    <GridMiniPreview cols={it.cols} rows={it.rows} cells={it.cells} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function FlexMiniPreview({ widths }: { widths: number[] }) {
  const total = widths.reduce((a, b) => a + b, 0);
  return (
    <div className="w-full flex items-center gap-1.5">
      {widths.map((w, i) => (
        <div
          key={i}
          className={cn("h-[20px] rounded-[3px]", "bg-slate-200")}
          style={{ flex: w / total }}
        />
      ))}
    </div>
  );
}

function GridMiniPreview({
  cols,
  rows,
  cells,
}: {
  cols: number;
  rows: number;
  cells: GridCell[];
}) {
  return (
    <div
      className="w-full h-[28px] grid gap-1.5"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((c, i) => (
        <div
          key={i}
          className="bg-slate-200 rounded-[3px]"
          style={{
            gridColumn: `${c.col} / span ${c.colSpan ?? 1}`,
            gridRow: `${c.row} / span ${c.rowSpan ?? 1}`,
          }}
        />
      ))}
    </div>
  );
}

/* -----------------------------------------------------------------------------
  Library Tab
----------------------------------------------------------------------------- */
function LibraryGrid({
  allTemplates,
  myTemplates,
  onAdd,
}: {
  allTemplates: LibraryTemplate[];
  myTemplates: LibraryTemplate[];
  onAdd: (id: string) => void;
}) {
  const [view, setView] = React.useState<"all" | "mine">("all");
  const templates = view === "all" ? allTemplates : myTemplates;

  return (
    <ScrollArea className="h-[400px] ">
      <div className="px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("all")}
              className={cn(
                "h-9 px-3 rounded-[6px] text-[13px] font-medium border transition",
                view === "all"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setView("mine")}
              className={cn(
                "h-9 px-3 rounded-[6px] text-[13px] font-medium border transition",
                view === "mine"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              )}
            >
              My Templates
            </button>
          </div>

          <div className="text-[12px] text-slate-500 hidden sm:block">
            Double-click a layout to add
          </div>
        </div>

        <div className="mt-4">
          <ScrollArea className="h-[520px] pr-3">
            {templates.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {templates.map((t) => (
                  <TemplateCard key={t.id} t={t} onAdd={() => onAdd(t.id)} />
                ))}
              </div>
            ) : (
              <div className="py-14 text-center text-[13px] text-slate-500">
                No saved templates yet.
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </ScrollArea>
  );
}

function TemplateCard({ t, onAdd }: { t: LibraryTemplate; onAdd: () => void }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white overflow-hidden hover:border-slate-300 transition">
      <div
        onClick={onAdd}
        onDoubleClick={onAdd}
        className={cn("relative aspect-[16/10] w-full cursor-pointer", "bg-slate-50")}
        title="Double-click to add"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white" />
        <div className="relative mx-auto mt-4 h-[70%] w-[86%] rounded-[10px] border border-slate-200 bg-white/70" />
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-800 truncate">
              {t.title}
            </div>
          </div>
          <div className="text-[12px] text-slate-500 whitespace-nowrap">
            {t.fontLabel} <span className="ml-1">{t.fontSize}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <ColorDots dots={t.colorDots} moreCount={t.colorMoreCount} />
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-slate-500">Brand preview</span>
            <div
              className={cn(
                "h-5 w-9 rounded-full border border-slate-200 bg-slate-100 px-[2px] flex items-center",
                t.brandPreview ? "justify-end" : "justify-start"
              )}
            >
              <div className="h-4 w-4 rounded-full bg-white border border-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorDots({ dots, moreCount }: { dots: string[]; moreCount?: number }) {
  const show = dots.slice(0, 6);
  return (
    <div className="flex items-center gap-1.5">
      {show.map((c, i) => (
        <span
          key={`${c}-${i}`}
          className="h-4 w-4 rounded-full border border-slate-200"
          style={{ backgroundColor: c }}
          title={c}
        />
      ))}
      {typeof moreCount === "number" && moreCount > 0 && (
        <span className="ml-1 text-[12px] text-slate-500 rounded-full border border-slate-200 px-2 py-0.5 bg-white">
          +{moreCount}
        </span>
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------------
  Example usage
----------------------------------------------------------------------------- */
// export default function Page() {
//   const [open, setOpen] = React.useState(true);
//   return (
//     <div className="p-6">
//       <Button onClick={() => setOpen(true)}>Open Insert Modal</Button>
//       <InsertModuleOrRowModal
//         open={open}
//         onOpenChange={setOpen}
//         onAddModule={(id) => console.log("add module", id)}
//         onAddRow={(id) => console.log("add row/layout", id)}
//         onAddTemplate={(id) => console.log("add template", id)}
//       />
//     </div>
//   );
// }