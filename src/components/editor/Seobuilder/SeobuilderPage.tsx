"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, ChevronDown, FileText, AlignLeft, AlertCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PageItem = {
  id: string;
  name: string;
  status?: "warning" | "ok";
};

const PAGES: PageItem[] = [
  { id: "home2", name: "Home 2", status: "warning" },
  { id: "home", name: "Home", status: "warning" },
  { id: "shop", name: "Shop", status: "warning" },
  { id: "products", name: "Products", status: "warning" },
  { id: "terms", name: "Terms & conditions", status: "warning" },
  { id: "new", name: "New empty page", status: "warning" },
  { id: "plist1", name: "Product list", status: "warning" },
  { id: "plist2", name: "Product list", status: "warning" },
];

function WarnIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
      <AlertCircle className="h-4 w-4" />
    </span>
  );
}

export default function SeobuilderPage() {
  const [expanded, setExpanded] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("home");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAGES;
    return PAGES.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="overflow-hidden rounded-none bg-white text-slate-900 dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 w-full">
      {/* Header (SEO - Home) */}

      {/* <div className="text-[32px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          SEO - Home
        </div> */}


      {/* <Separator className="bg-slate-200 dark:bg-slate-800" /> */}

      {/* Sidebar content */}
      <div className="px-0  w-[300px]">
        {/* Website overview row */}
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-0 text-left transition-colors",
            "text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/5"
          )}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#081021] dark:text-slate-200">
            <FileText className="h-4 w-4" />
          </span>
          <span className="text-lg font-medium">Website overview</span>
        </button>

        <Separator className="my-4 bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center ">
          <Select>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg  bg-white text-slate-700 dark:border-slate-800 dark:bg-[#081021] dark:text-slate-200">
              <AlignLeft className="h-4 w-4" />
            </span>

            <SelectTrigger className="w-full max-w-68 border-none shadow-none bg-transparent hover:bg-transparent focus:ring-0 w-full">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectGroup>
                <SelectLabel>Main Page</SelectLabel>
                <SelectItem value="Main-page">Main Page </SelectItem>
                <SelectItem value="Product-Pages">Product Pages</SelectItem>

              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Search + list */}
        {/* {expanded && ( */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages..."
              className={cn(
                "h-11 rounded-2xl bg-slate-100 pl-11 text-base",
                "border-transparent focus-visible:ring-2 focus-visible:ring-violet-500",
                "text-slate-900 placeholder:text-slate-500",
                "dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus-visible:ring-violet-500"
              )}
            />
          </div>

          <div className="mt-4 space-y-2">
            {filtered.map((p) => {
              const active = p.id === selectedId;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                    active
                      ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                      : "text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <WarnIcon />
                  <span
                    className={cn(
                      "text-lg",
                      active ? "font-medium" : "font-normal"
                    )}
                  >
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
