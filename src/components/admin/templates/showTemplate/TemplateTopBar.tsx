"use client";

import { RootState } from "@/store/store";
import { Search, X, BookOpen, Globe, Receipt, FileText } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { TemplateDocument } from "../TemplateType";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Props = {
  selectedTemplate: (value: TemplateDocument[]) => void;
};

type ViewTab = "all" | "my";

// ✅ Change this route if needed
const ADD_TEMPLATE_ROUTE = "/admin/templates/create";

// ✅ Special dummy card id (for Add Template box in grid)
const ADD_CARD_ID = "__add_template__";

/** ✅ Temporary static templates for "My Templates" */
const STATIC_MY_TEMPLATES: TemplateDocument[] = [
  {
    id: "static-1",
    _id: "static-1",
    title: "Starter Landing",
    name: "Starter Landing",
    slug: "starter-landing",
    category: "page",
    isMy: true,
  } as any,
  {
    id: "static-2",
    _id: "static-2",
    title: "Hero Section Pro",
    name: "Hero Section Pro",
    slug: "hero-section-pro",
    category: "hero",
    isMy: true,
  } as any,
];

function mergeUnique(a: TemplateDocument[], b: TemplateDocument[]) {
  const out: TemplateDocument[] = [];
  const seen = new Set<string>();

  const keyOf = (t: any) =>
    String(t?._id || t?.id || t?.slug || t?.title || t?.name || "");

  [...a, ...b].forEach((t: any) => {
    const k = keyOf(t);
    if (!k || seen.has(k)) return;
    seen.add(k);
    out.push(t);
  });

  return out;
}

/** ✅ SHOW ONLY THESE 3 BOXES */
const ONLY_CATEGORIES = ["website", "brochure", "invoice"] as const;

const CATEGORY_META: Record<
  string,
  { label: string; Icon: any; bg: string; ring: string }
> = {
  website: {
    label: "Website",
    Icon: Globe,
    bg: "bg-sky-50",
    ring: "ring-sky-200",
  },
  brochure: {
    label: "Brochure",
    Icon: BookOpen,
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
  invoice: {
    label: "Invoice",
    Icon: Receipt,
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
};

const TemplateTopBar = ({ selectedTemplate }: Props) => {
  const router = useRouter();
  const { allTemplate } = useSelector((state: RootState) => state.template);

  const [search, setSearch] = useState("");
  const [demo, setDemo] = useState<string>("website"); // ✅ default: Website
  const [view, setView] = useState<ViewTab>("all");

  /** ✅ Prevent infinite loop (selectedTemplate identity changes in parent) */
  const selectedTemplateRef = useRef(selectedTemplate);
  useEffect(() => {
    selectedTemplateRef.current = selectedTemplate;
  }, [selectedTemplate]);

  // ✅ Add Template dummy card (stable)
  const ADD_TEMPLATE_CARD = useMemo(() => {
    return {
      id: ADD_CARD_ID,
      _id: ADD_CARD_ID,
      title: "Add Template",
      name: "Add Template",
      slug: "add-template",
      category: "add",
      isAddCard: true, // ✅ use this flag in grid
    } as any as TemplateDocument;
  }, []);

  const getCategory = useCallback((t: any) => {
    return String(t?.category || "").toLowerCase();
  }, []);

  const getSearchText = useCallback(
    (t: any) => {
      return [
        t?.title,
        t?.name,
        t?.label,
        t?.slug,
        t?.description,
        getCategory(t),
        Array.isArray(t?.tags) ? t.tags.join(" ") : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    },
    [getCategory]
  );

  /** ✅ My templates list (static + (isMy==true from API)) */
  const myTemplates = useMemo(() => {
    const realMy = (allTemplate || []).filter((t: any) => t?.isMy === true);
    return mergeUnique(STATIC_MY_TEMPLATES, realMy);
  }, [allTemplate]);

  /** ✅ Base list per view */
  const baseListForView = useMemo(() => {
    return view === "my" ? myTemplates : (allTemplate || []);
  }, [view, myTemplates, allTemplate]);

  /** ✅ Category counts (based on current view list) */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    baseListForView.forEach((t: any) => {
      const c = getCategory(t);
      if (!c) return;
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [baseListForView, getCategory]);

  /**
   * ✅ FINAL filtered list
   * - Website tab: show ALL templates (no category filter)
   * - Brochure/Invoice: show ONLY 1 template (single single)
   */
  const filteredTemplates = useMemo(() => {
    let list: TemplateDocument[] = baseListForView;

    const q = search.trim().toLowerCase();

    if (demo.toLowerCase() === "website") {
      // ✅ Website = show ALL templates (search applies)
      if (q) list = list.filter((t: any) => getSearchText(t).includes(q));
      return [ADD_TEMPLATE_CARD, ...list];
    }

    // ✅ Brochure / Invoice = filter category + search + take ONLY 1
    const d = demo.toLowerCase();
    list = list.filter((t: any) => getCategory(t) === d);

    if (q) list = list.filter((t: any) => getSearchText(t).includes(q));

    // ✅ single single
    if (list.length > 1) list = list.slice(0, 1);

    return [ADD_TEMPLATE_CARD, ...list];
  }, [
    baseListForView,
    demo,
    search,
    getCategory,
    getSearchText,
    ADD_TEMPLATE_CARD,
  ]);

  /** ✅ Call parent only when filteredTemplates changes */
  useEffect(() => {
    selectedTemplateRef.current(filteredTemplates);
  }, [filteredTemplates]);

  const renderCategoryCard = (cat: string) => {
    const meta = CATEGORY_META[cat] || {
      label: cat,
      Icon: FileText,
      bg: "bg-slate-50",
      ring: "ring-slate-200",
    };

    const active = demo === cat;
    const count = categoryCounts[cat] ?? 0;

    return (
      <button
        key={cat}
        type="button"
        onClick={() => setDemo(cat)}
        className={[
          "group relative flex items-center gap-3 rounded-xl border px-4 py-3",
          "min-w-[220px] sm:min-w-[260px] transition",
          meta.bg,
          active
            ? "border-slate-900 shadow-sm"
            : "border-slate-200 hover:border-slate-300",
        ].join(" ")}
        aria-pressed={active}
      >
        <span
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1",
            meta.ring,
            "bg-white/70",
          ].join(" ")}
        >
          <meta.Icon className="h-5 w-5 text-slate-700" />
        </span>

        <span className="flex flex-col items-start">
          <span className="text-sm font-semibold text-slate-900">
            {meta.label}
          </span>
          <span className="text-xs text-slate-500">{count} templates</span>
        </span>

        {active && (
          <span className="absolute right-3 top-3 inline-flex h-2.5 w-2.5 rounded-full bg-slate-900" />
        )}
      </button>
    );
  };

  return (
    <div className="border-b bg-white">
      {/* Top controls */}
      <div className="flex flex-col gap-3 px-4 py-2 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-9"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="sm:ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant={view === "my" ? "default" : "outline"}
            className="h-9 px-4"
            onClick={() => setView("my")}
          >
            My Templates ({myTemplates.length})
          </Button>

          <Button
            type="button"
            variant={view === "all" ? "default" : "outline"}
            className="h-9 px-4"
            onClick={() => setView("all")}
          >
            All ({(allTemplate || []).length})
          </Button>
        </div>
      </div>

      {/* ✅ ONLY 3 BOXES: Website / Brochure / Invoice */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            Explore templates
          </span>
        </div>

        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ONLY_CATEGORIES.map((c) => renderCategoryCard(c))}
        </div>
      </div>
    </div>
  );
};

export default TemplateTopBar;
