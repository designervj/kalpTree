"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Search,
  FileText,
  AlignLeft,
  AlertCircle,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
} from "lucide-react";

type PageItem = {
  id: string;
  name: string;
  status?: "warning" | "ok";
};

const PAGES: PageItem[] = [
  { id: "all_products", name: "All products", status: "warning" },
  { id: "new_collection", name: "New collection", status: "warning" },
  { id: "sustainability", name: "Sustainability", status: "warning" },
  { id: "about", name: "About", status: "warning" },
  { id: "contact", name: "Contact", status: "warning" },
  { id: "home", name: "Home", status: "warning" },
  { id: "returns", name: "Returns", status: "warning" },
  { id: "payments", name: "Payments & Delivery", status: "warning" },
];

function WarnIcon() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300">
      <AlertCircle className="h-4 w-4" />
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
      {children}
    </div>
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      {children}
    </p>
  );
}

function ValidationRow({
  type,
  children,
}: {
  type: "ok" | "warn";
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      {type === "ok" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
      )}
      <div className="text-slate-700 dark:text-slate-200">{children}</div>
    </div>
  );
}

function SoftInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={cn(
        "h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400",
        "focus-visible:ring-2 focus-visible:ring-violet-500/40",
        "dark:border-slate-800 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500",
        props.className
      )}
    />
  );
}

function SoftTextarea(props: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      {...props}
      className={cn(
        "min-h-[130px] rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400",
        "focus-visible:ring-2 focus-visible:ring-violet-500/40",
        "dark:border-slate-800 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500",
        props.className
      )}
    />
  );
}

/** Sidebar (left) */
function Sidebar({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAGES;
    return PAGES.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="h-full w-full bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      <div className="px-4 pt-4">
        {/* Website overview */}
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left",
            "hover:bg-slate-50 dark:hover:bg-white/5"
          )}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#081021] dark:text-slate-200">
            <FileText className="h-4 w-4" />
          </span>
          <span className="text-base font-medium">Website overview</span>
        </button>

        <Separator className="my-4 bg-slate-200 dark:bg-slate-800" />

        {/* Main pages dropdown */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#081021] dark:text-slate-200">
            <AlignLeft className="h-4 w-4" />
          </span>

          <Select defaultValue="main">
            <SelectTrigger
              className={cn(
                "h-11 w-full justify-between rounded-xl",
                "border border-slate-200 bg-white text-slate-900 shadow-sm",
                "focus:ring-0 focus:ring-offset-0",
                "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100"
              )}
            >
              <SelectValue placeholder="Main pages" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100">
              <SelectGroup>
                <SelectLabel className="text-xs text-slate-500 dark:text-slate-400">
                  Pages
                </SelectLabel>
                <SelectItem value="main" className="text-sm">
                  Main pages
                </SelectItem>
                <SelectItem value="product" className="text-sm">
                  Product pages
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages..."
              className={cn(
                "h-11 rounded-2xl bg-slate-100 pl-11 text-sm",
                "border-transparent focus-visible:ring-2 focus-visible:ring-violet-500/40",
                "text-slate-900 placeholder:text-slate-500",
                "dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-400"
              )}
            />
          </div>
        </div>

        {/* Pages */}
        <div className="mt-4 space-y-1">
          {filtered.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                  active
                    ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                    : "text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/5"
                )}
              >
                <WarnIcon />
                <span className={cn("text-sm", active ? "font-medium" : "font-normal")}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Right panel inside Sheet */
function SeoEditor({
  pageName,
}: {
  pageName: string;
}) {
  const [hideFromSearch, setHideFromSearch] = React.useState(false);
  const [focusKeywords, setFocusKeywords] = React.useState<string[]>([]);
  const [keywordInput, setKeywordInput] = React.useState("");
  const [seoTitle, setSeoTitle] = React.useState(pageName);
  const [metaDesc, setMetaDesc] = React.useState("");
  const [slug, setSlug] = React.useState(
    pageName.toLowerCase().trim().replace(/\s+/g, "-")
  );

  React.useEffect(() => {
    setHideFromSearch(false);
    setFocusKeywords([]);
    setKeywordInput("");
    setSeoTitle(pageName);
    setMetaDesc("");
    setSlug(pageName.toLowerCase().trim().replace(/\s+/g, "-"));
  }, [pageName]);

  const titleLen = seoTitle.trim().length;
  const descLen = metaDesc.trim().length;

  const hasKeyword = focusKeywords.length > 0;
  const includesKeywordInTitle = hasKeyword
    ? focusKeywords.some((k) => seoTitle.toLowerCase().includes(k.toLowerCase()))
    : false;

  const includesKeywordInDesc = hasKeyword
    ? focusKeywords.some((k) => metaDesc.toLowerCase().includes(k.toLowerCase()))
    : false;

  const includesKeywordInSlug = hasKeyword
    ? focusKeywords.some((k) => slug.toLowerCase().includes(k.toLowerCase()))
    : false;

  const addKeyword = () => {
    const v = keywordInput.trim();
    if (!v) return;
    if (focusKeywords.length >= 3) return;
    if (focusKeywords.some((k) => k.toLowerCase() === v.toLowerCase())) return;
    setFocusKeywords((k) => [...k, v]);
    setKeywordInput("");
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto px-4 py-4">
      <div className="space-y-6">
        {/* AI SEO Assistant */}
        <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  AI SEO Assistant
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Generate new SEO title, meta description and keywords for{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {pageName}
                  </span>{" "}
                  page
                </div>

                <Button
                  variant="outline"
                  className="mt-4 h-10 rounded-xl border-slate-200 bg-white text-violet-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-transparent dark:text-violet-200 dark:hover:bg-white/5"
                >
                  Generate new SEO info
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search result preview */}
        <div className="space-y-3">
          <FieldLabel>Search result preview</FieldLabel>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
            <CardContent className="p-4">
              <div className="text-xl font-semibold text-violet-700 dark:text-violet-200">
                {seoTitle || pageName}
              </div>
              <div className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                https://minalite-mwxaixoen9uuedst.builder-preview.com
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Search engines automatically generate a description. To use a custom
                description instead, enter it below.
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            It takes time for Google to update its search results with your website
            and its changes.
          </div>
        </div>

        {/* Hide page toggle */}
        <div className="flex items-center justify-between">
          <FieldLabel>Hide page from search results</FieldLabel>
          <Switch checked={hideFromSearch} onCheckedChange={setHideFromSearch} />
        </div>

        {/* Focus keyword */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>Focus keyword</FieldLabel>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {focusKeywords.length}/3
            </div>
          </div>

          <HelperText>
            To help search engines understand your content, select one focus keyword
            or keyphrase that best represents the topic of this page
          </HelperText>

          <div className="flex gap-2">
            <SoftInput
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add keyword..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
            />
            <Button
              variant="outline"
              className="h-12 rounded-xl border-slate-200 bg-white text-violet-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-transparent dark:text-violet-200 dark:hover:bg-white/5"
              onClick={addKeyword}
              disabled={focusKeywords.length >= 3}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {focusKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {focusKeywords.map((k, idx) => (
                <div
                  key={`${k}-${idx}`}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200"
                >
                  {k}
                  <button
                    type="button"
                    className="opacity-70 hover:opacity-100"
                    onClick={() =>
                      setFocusKeywords((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
            <CardContent className="p-4">
              <ValidationRow type={focusKeywords.length > 0 ? "ok" : "warn"}>
                Focus keyword should be added and selected for this page
              </ValidationRow>
            </CardContent>
          </Card>
        </div>

        {/* SEO title */}
        <div className="space-y-3">
          <FieldLabel>SEO title</FieldLabel>

          <SoftInput value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />

          <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
            <CardContent className="p-4 space-y-2">
              <ValidationRow type={titleLen > 0 ? "ok" : "warn"}>
                SEO title should not be empty
              </ValidationRow>
              <ValidationRow type={titleLen >= 10 && titleLen <= 60 ? "ok" : "warn"}>
                SEO title length should be between 10 and 60 characters. The current
                count is {titleLen} characters
              </ValidationRow>
              <ValidationRow type={includesKeywordInTitle ? "ok" : "warn"}>
                SEO title should include a focus keyword
              </ValidationRow>
            </CardContent>
          </Card>
        </div>

        {/* Meta description */}
        <div className="space-y-3">
          <FieldLabel>Meta description</FieldLabel>

          <SoftTextarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} />

          <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
            <CardContent className="p-4 space-y-2">
              <ValidationRow type={descLen > 0 ? "ok" : "warn"}>
                Meta description should not be empty
              </ValidationRow>
              <ValidationRow type={descLen === 156 ? "ok" : "warn"}>
                Meta description length should be 156 characters. The current count
                is {descLen} characters
              </ValidationRow>
              <ValidationRow type={includesKeywordInDesc ? "ok" : "warn"}>
                Meta description should include a focus keyword
              </ValidationRow>
            </CardContent>
          </Card>
        </div>

        {/* Page URL */}
        <div className="space-y-3">
          <FieldLabel>Page URL</FieldLabel>

          <SoftInput value={slug} onChange={(e) => setSlug(e.target.value)} />

          <div className="text-sm text-slate-500 dark:text-slate-400">
            Here&apos;s your full URL:{" "}
            <span className="text-slate-700 dark:text-slate-200">
              https://minalite-mwxaixoen9uuedst.builder-preview.com/{slug || ""}
            </span>
          </div>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
            <CardContent className="p-4 space-y-2">
              <ValidationRow type={includesKeywordInSlug ? "ok" : "warn"}>
                Page URL should include a focus keyword
              </ValidationRow>
              <ValidationRow type="ok">
                The slug <span className="font-semibold">"{slug || "-"}"</span>{" "}
                should be unique and available for use.
              </ValidationRow>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button className="rounded-xl">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline" className="rounded-xl">
              Cancel
            </Button>
          </SheetClose>
        </div>
      </div>
    </div>
  );
}

export default function SeobuilderPage() {
  const [selectedId, setSelectedId] = React.useState(PAGES[5]?.id ?? "home");
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const pageName = React.useMemo(
    () => PAGES.find((p) => p.id === selectedId)?.name ?? "Page",
    [selectedId]
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSheetOpen(true); // ✅ open offcanvas when a page is clicked
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR */}
        <div className="w-[320px] border-r border-slate-200 dark:border-slate-800">
          <Sidebar selectedId={selectedId} onSelect={handleSelect} />
        </div>

        {/* RIGHT EMPTY AREA (behind the offcanvas) */}
        <div className="flex-1" />
      </div>

      {/* OFFCANVAS: opens when page clicked */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="left" // ✅ matches screenshot (sidebar left, panel right). If you want left, change to "left"
          className={cn(
            "p-0 w-[420px] sm:w-[520px]",
            "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
          )}
        >
          <SheetHeader className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <SheetTitle className="text-left">SEO – {pageName}</SheetTitle>
          </SheetHeader>

          <SeoEditor pageName={pageName} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
