"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Eye,
  Download,
  X,
  RefreshCcw,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type DemoKey = "All" | "Shop" | "Home" | "Products" | "Categories";
type CategoryKey =
  | "ALL"
  | "ABOUT"
  | "BANNER"
  | "BANNER SLIDERS"
  | "CALL TO ACTION"
  | "CAMPAIGNS"
  | "ECOMMERCE"
  | "FULL PAGE"
  | "ICON BOXES"
  | "IMAGE BOXES"
  | "PRODUCTS";

type TemplateItem = {
  id: string;
  title: string;
  caption: string;
  demo: DemoKey;
  category: Exclude<CategoryKey, "ALL">;
  accent: "red" | "blue" | "green" | "gray" | "pink";
};

const BG: Record<TemplateItem["accent"], string> = {
  red: "from-rose-200 via-white to-rose-100",
  blue: "from-blue-200 via-white to-blue-100",
  green: "from-emerald-200 via-white to-emerald-100",
  gray: "from-zinc-200 via-white to-zinc-100",
  pink: "from-fuchsia-200 via-white to-fuchsia-100",
};

const DEMO_OPTIONS: DemoKey[] = ["All", "Shop", "Home", "Products", "Categories"];

const CATEGORY_ORDER: CategoryKey[] = [
  "ALL",
  "ABOUT",
  "BANNER",
  "BANNER SLIDERS",
  "CALL TO ACTION",
  "CAMPAIGNS",
  "ECOMMERCE",
  "FULL PAGE",
  "ICON BOXES",
  "IMAGE BOXES",
  "PRODUCTS",
];

const TEMPLATES: TemplateItem[] = [
  {
    id: "t1",
    title: "Shop 13 Category Banner",
    caption: "Shop 13 Category Banner",
    demo: "Shop",
    category: "BANNER",
    accent: "red",
  },
  {
    id: "t2",
    title: "Shop 4 - Sale campaign",
    caption: "Shop 4 - Sale campaign",
    demo: "Shop",
    category: "CAMPAIGNS",
    accent: "gray",
  },
  {
    id: "t3",
    title: "Home Intro Slider 01",
    caption: "Shop 34 - Home intro slider",
    demo: "Home",
    category: "BANNER SLIDERS",
    accent: "pink",
  },
  {
    id: "t4",
    title: "2 Columns Offer + Products",
    caption: "Shop 35 - 2 columns with special offer and products",
    demo: "Shop",
    category: "ECOMMERCE",
    accent: "green",
  },
  {
    id: "t5",
    title: "Banner + Products",
    caption: "Shop 32 - column with banner and products",
    demo: "Shop",
    category: "ECOMMERCE",
    accent: "gray",
  },
  {
    id: "t6",
    title: "Home Intro Slider 02",
    caption: "Shop 38 - Home intro slider",
    demo: "Home",
    category: "BANNER SLIDERS",
    accent: "blue",
  },
  {
    id: "t7",
    title: "Best Selling Products",
    caption: "Products with best sellers",
    demo: "Products",
    category: "PRODUCTS",
    accent: "gray",
  },
  {
    id: "t8",
    title: "Category Carousel",
    caption: "category carousel section with triangle bottom shape",
    demo: "Categories",
    category: "FULL PAGE",
    accent: "blue",
  },
];

function miniToast(msg: string) {
  const el = document.createElement("div");
  el.innerText = msg;
  el.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-xl bg-black text-white px-4 py-2 text-sm shadow-lg";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

export default function Page() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [demo, setDemo] = useState<DemoKey>("All");

  // category dropdown (header list)
  const [category, setCategory] = useState<CategoryKey>("ALL");
  const [catOpen, setCatOpen] = useState(false);

  // preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selected, setSelected] = useState<TemplateItem | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = CATEGORY_ORDER.reduce(
      (acc, k) => {
        acc[k] = 0;
        return acc;
      },
      {} as Record<CategoryKey, number>
    );

    const demoFiltered =
      demo === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.demo === demo);

    counts["ALL"] = demoFiltered.length;
    for (const t of demoFiltered) {
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    }

    return counts;
  }, [demo]);

  const filtered = useMemo(() => {
    let list = [...TEMPLATES];

    if (demo !== "All") list = list.filter((t) => t.demo === demo);
    if (category !== "ALL") list = list.filter((t) => t.category === category);

    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.caption.toLowerCase().includes(q)
    );
  }, [search, demo, category]);

  const onPreview = (t: TemplateItem) => {
    setSelected(t);
    setPreviewOpen(true);
  };

  const onImport = (t: TemplateItem) => miniToast(`Imported: ${t.title}`);
  const onSubmit = () => miniToast("Filters Applied");
  const onRefreshStudio = () => miniToast("Studio Refreshed");

  const onEdit = (t: TemplateItem) => {
    router.push(`/admin/website/templates/${t.id}/edit`);
  };

  const onDelete = (t: TemplateItem) => {
    // replace with API call later
    miniToast(`Deleted: ${t.title}`);
  };

  return (
    <div className="min-h-screen ">
      <div className="flex items-center justify-between mb-4">
        <BreadCrumbPage />
        <Link href="/admin/website/templates/create">
          <Button>Add Template</Button>
        </Link>
      </div>

      {/* TOP BAR */}
      <div className="border-b bg-white">
        <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Filter by Demos */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                Filter by Demos
              </span>

              <Select
                value={demo}
                onValueChange={(v) => {
                  setDemo(v as DemoKey);
                  setCategory("ALL");
                }}
              >
                <SelectTrigger className="h-10 w-full sm:w-[200px] rounded-md border border-gray-300 bg-white px-3 text-sm">
                  <SelectValue placeholder="Select demo" />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CATEGORY DROPDOWN */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setCatOpen((p) => !p)}
                className="h-10 w-full sm:w-[240px] rounded-md border border-gray-300 bg-white px-3 text-sm outline-none flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold tracking-wide">{category}</span>
                  <span className="text-gray-500">
                    {categoryCounts[category] ?? 0}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {catOpen && (
                <div className="absolute left-0 top-[44px] w-full sm:w-[260px] rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
                  {CATEGORY_ORDER.map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        setCategory(k);
                        setCatOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 flex items-center justify-between border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <span className="text-xs font-semibold tracking-widest text-gray-700">
                        {k}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">
                        {categoryCounts[k] ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={onSubmit} className="h-10 px-5">
                SUBMIT
              </Button>

              <Button
                onClick={onRefreshStudio}
                className="h-10 rounded bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-950 inline-flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                REFRESH STUDIO
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="bg-white p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((t) => (
            <div key={t.id} className="space-y-2">
              <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Make preview area responsive */}
                <div className="relative aspect-[16/10] w-full h-[180px]">
                  {/* mock preview */}
                  <div
                    className={[
                      "absolute inset-0 bg-gradient-to-br",
                      BG[t.accent],
                    ].join(" ")}
                  />

                  {/* skeleton blocks */}
                  <div className="absolute inset-0 p-4">
                    <div className="h-6 w-2/3 rounded bg-black/10" />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="h-12 rounded bg-black/10" />
                      <div className="h-12 rounded bg-black/10" />
                      <div className="h-12 rounded bg-black/10" />
                    </div>
                    <div className="mt-3 h-12 rounded bg-black/10" />
                  </div>

                  {/* hover action bar (better on small screens) */}
                  <div className="absolute inset-x-0 bottom-8 p-3">
                    <div
                      className="
                        flex flex-wrap items-center justify-center gap-2
                        rounded-lg border bg-white/90 p-2 shadow-sm
                        opacity-100 sm:opacity-0 sm:translate-y-2
                        sm:group-hover:opacity-100 sm:group-hover:translate-y-0
                        transition
                      "
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPreview(t)}
                        className="h-8 px-3 text-xs"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        PREVIEW
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => onImport(t)}
                        className="h-8 px-3 text-xs"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        IMPORT
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Caption row with 3 dots */}
              <div className="flex items-center justify-between gap-2 px-1">
                <h4 className="text-xs font-semibold text-zinc-900 truncate">
                  {t.caption}
                </h4>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="h-8 w-8 rounded-md border border-transparent hover:border-gray-200 hover:bg-gray-50 grid place-items-center"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Template actions"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(t);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(t);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW MODAL (Responsive) */}
      <Dialog
        open={previewOpen}
        onOpenChange={(v) => {
          setPreviewOpen(v);
          if (!v) setSelected(null);
        }}
      >
        <DialogContent className="max-w-[92vw] sm:max-w-4xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selected.title}</DialogTitle>
                <DialogDescription className="text-xs">
                  Demo: {selected.demo} • Category: {selected.category}
                </DialogDescription>
              </DialogHeader>

              <div className="overflow-hidden rounded-lg border">
                <div
                  className={[
                    "w-full bg-gradient-to-br",
                    BG[selected.accent],
                    "h-[55vh] sm:h-[520px]",
                  ].join(" ")}
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  onClick={() => {
                    miniToast(`Imported: ${selected.title}`);
                    setPreviewOpen(false);
                  }}
                  className="h-10"
                >
                  Import
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setPreviewOpen(false)}
                  className="h-10"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* click outside closes category dropdown */}
      {catOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setCatOpen(false)}
        />
      )}
    </div>
  );
}
