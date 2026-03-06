import { useState, useEffect, useRef } from "react";
import {
  Grid3X3,
  ChevronRight,
  X,
  Search,
  Layers,
  GalleryHorizontal,
  AlignJustify,
  Volume2,
  BarChart2,
  LayoutGrid,
  UserCircle2,
  Square,
  Phone,
  Copy,
  Circle,
  Code2,
  MessageSquare,
  Contact,
  Timer,
  Mail,
  Table2,
  Plus,
} from "lucide-react";

// ─── Module registry ────────────────────────────────────────────────────────
const MODULES = [
  { name: "Group", icon: Grid3X3 },
  { name: "Group Carousel", icon: GalleryHorizontal },
  { name: "Accordion", icon: AlignJustify },
  { name: "Audio", icon: Volume2 },
  { name: "Bar Counters", icon: BarChart2 },
  { name: "Blog", icon: LayoutGrid },
  { name: "Blurb", icon: UserCircle2 },
  { name: "Button", icon: Square },
  { name: "Call To Action", icon: Phone },
  { name: "Canvas Portal", icon: Copy },
  { name: "Circle Counter", icon: Circle },
  { name: "Code", icon: Code2 },
  { name: "Comments", icon: MessageSquare },
  { name: "Contact Form", icon: Contact },
  { name: "Countdown Timer", icon: Timer },
  { name: "Email Optin", icon: Mail },
  { name: "Fullwidth Image", icon: Table2 },
];

const TABS = ["New Module", "New Row", "Add From Library"] as const;
type Tab = (typeof TABS)[number];

// ─── Component ───────────────────────────────────────────────────────────────
export function ComponentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("New Module");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = MODULES.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal card */}
      <div
        className="relative flex w-[420px] flex-col rounded-lg bg-white shadow-2xl overflow-hidden"
        style={{ maxHeight: "min(90vh, 580px)" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 pt-4 pb-0">
          <h2 className="text-sm font-semibold text-slate-800">
            Insert Module Or Row
          </h2>
          <button
            onClick={onClose}
            className="mb-1 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-slate-200 px-5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`mr-5 py-2.5 text-xs font-medium transition-colors ${activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <Search size={13} className="shrink-0 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a module"
              className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        {/* ── Module grid ── */}
        <div
          className="overflow-y-auto px-4 pb-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {activeTab === "New Module" && (
            <div className="grid grid-cols-3 gap-1">
              {filtered.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  className="flex flex-col items-center gap-1.5 rounded-md px-2 py-3 text-center transition hover:bg-slate-100 active:bg-slate-200"
                >
                  <Icon
                    size={24}
                    className="text-slate-600"
                    strokeWidth={1.5}
                  />
                  <span className="text-[11px] leading-tight text-slate-700">
                    {name}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-3 py-8 text-center text-xs text-slate-400">
                  No modules match "{query}"
                </p>
              )}
            </div>
          )}

          {activeTab === "New Row" && (
            <div className="flex flex-col items-center gap-4 py-8 text-slate-400">
              <Layers size={32} strokeWidth={1.2} />
              <p className="text-xs">Choose a row layout to insert</p>
              <div className="grid w-full grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    className="flex h-10 items-center justify-center gap-1 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition"
                  >
                    {Array.from({ length: cols }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 flex-1 rounded-sm bg-slate-300"
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Add From Library" && (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
              <GalleryHorizontal size={32} strokeWidth={1.2} />
              <p className="text-xs">No saved layouts yet</p>
            </div>
          )}
        </div>

        {/* ── Footer add button (subtle) ── */}
        <div className="border-t border-slate-100 px-5 py-2.5 flex justify-end">
          <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700">
            <Plus size={13} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
