"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  X,
} from "lucide-react";

type PageItem = {
  id: string;
  name: string;
  status: "warning" | "ok";
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

function StatusDot({ status }: { status: PageItem["status"] }) {
  if (status === "ok") {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
        <CheckCircle2 className="h-3.5 w-3.5" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-100">
      <AlertCircle className="h-3.5 w-3.5" />
    </span>
  );
}

function FieldLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-xs font-medium text-slate-700", className)}>
      {children}
    </div>
  );
}

export default function SeobuilderPage() {
  const [activeLeft, setActiveLeft] = React.useState<"overview" | "pages">(
    "overview"
  );
  const [expandedMainPages, setExpandedMainPages] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(null);

  // Page detail state (mock)
  const [hideFromSearch, setHideFromSearch] = React.useState(false);
  const [focusKeywords, setFocusKeywords] = React.useState<string[]>([]);
  const [seoTitle, setSeoTitle] = React.useState("Home 2");
  const [metaDescription, setMetaDescription] = React.useState("");

  const selectedPage = React.useMemo(
    () => PAGES.find((p) => p.id === selectedPageId) ?? null,
    [selectedPageId]
  );

  const isDetail = Boolean(selectedPage);

  const filteredPages = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAGES;
    return PAGES.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  const title = isDetail ? `SEO - ${selectedPage?.name}` : "Let’s be found on Google (SEO)";

  // Validation (matches screenshot “checks”)
  const titleLen = seoTitle.trim().length;
  const titleOkNotEmpty = titleLen > 0;
  const titleOkLength = titleLen >= 10 && titleLen <= 60;
  const titleHasKeyword =
    focusKeywords.length === 0
      ? false
      : focusKeywords.some((kw) =>
          seoTitle.toLowerCase().includes(kw.toLowerCase())
        );

  const improvements = React.useMemo(
    () =>
      PAGES.filter((p) => p.status === "warning").map((p) => ({
        id: p.id,
        label: `Improvements found for `,
        page: p.name,
      })),
    []
  );

  const addKeyword = () => {
    if (focusKeywords.length >= 3) return;
    const next = `Keyword ${focusKeywords.length + 1}`;
    setFocusKeywords((prev) => [...prev, next]);
  };

  const closeAll = () => {
    // wire this to your actual close handler / route
    setSelectedPageId(null);
    setActiveLeft("overview");
  };

  return (
    <div className="h-[85vh] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
        <div className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-slate-100"
          onClick={closeAll}
          aria-label="Close"
        >
          <X className="h-5 w-5 text-slate-500" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex h-[calc(85vh-4rem)] min-h-0">
        {/* Left Sidebar */}
        <div className="w-[320px] shrink-0 border-r border-slate-200 bg-white">
          <ScrollArea className="h-full">
            <div className="p-4">
              {/* Website overview */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPageId(null);
                  setActiveLeft("overview");
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                  !isDetail && activeLeft === "overview"
                    ? "bg-violet-50 text-violet-700 ring-1 ring-violet-100"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                  <span className="h-4 w-4 rounded-sm border border-slate-400" />
                </span>
                <span className="text-sm font-medium">Website overview</span>
              </button>

              <Separator className="my-4" />

              {/* Main pages + dropdown */}
              <button
                type="button"
                onClick={() => setExpandedMainPages((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                    <span className="h-3 w-4 rounded-sm border border-slate-400" />
                  </span>
                  Main pages
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-slate-500 transition",
                    expandedMainPages ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>

              {/* Search */}
              {expandedMainPages && (
                <div className="mt-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search pages..."
                      className="h-10 rounded-xl bg-slate-50 pl-9 text-sm text-slate-900 placeholder:text-slate-400 ring-1 ring-slate-200 focus-visible:ring-2 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="mt-3 space-y-1">
                    {filteredPages.map((p) => {
                      const active = selectedPageId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPageId(p.id);
                            setActiveLeft("pages");
                            setExpandedMainPages(true);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                            active
                              ? "bg-violet-50 text-violet-700 ring-1 ring-violet-100"
                              : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <StatusDot status={p.status} />
                          <span className="text-sm font-medium">{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer note */}
              <div className="mt-6 flex items-center gap-2 px-2 pb-3 text-xs text-slate-500">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-sm">☺</span>
                </span>
                <span className="text-violet-600">Rate this feature.</span>
                <span>Help us improve.</span>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          <ScrollArea className="h-full">
            <div className="px-8 py-6">
              {!isDetail ? (
                <>
                  {/* Website information */}
                  <div className="text-sm font-semibold text-slate-900">
                    Website information
                  </div>

                  <Card className="mt-3 rounded-2xl border-slate-200 shadow-none">
                    <CardContent className="p-5">
                      <div className="space-y-3 text-sm text-slate-800">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">
                            Business or brand name:
                          </span>
                          <span>shop</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">
                            Website language:
                          </span>
                          <span>English</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="mt-4 h-10 rounded-xl border-slate-200 bg-white px-8 text-sm font-medium text-violet-700 hover:bg-slate-50"
                      >
                        Edit
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Attention list */}
                  <div className="mt-8 text-sm font-semibold text-slate-900">
                    Some pages require your attention
                  </div>

                  <Card className="mt-3 rounded-2xl border-slate-200 shadow-none">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 px-5 py-4">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <div className="text-sm text-slate-700">
                          Add your business or brand name and select website language.
                        </div>
                      </div>

                      <Separator />

                      <div className="divide-y divide-slate-200">
                        {improvements.map((it) => (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => setSelectedPageId(it.id)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-3">
                              <StatusDot status="warning" />
                              <div className="text-sm text-slate-800">
                                {it.label}
                                <span className="font-semibold">{it.page}</span>{" "}
                                page
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  {/* AI SEO Assistant */}
                  <Card className="rounded-2xl border-slate-200 shadow-none">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                          <Sparkles className="h-5 w-5" />
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">
                            AI SEO Assistant
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            Generate new SEO title, meta description and keywords for{" "}
                            <span className="font-semibold">{selectedPage?.name}</span>{" "}
                            page
                          </div>

                          <Button
                            className="mt-4 h-10 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700"
                          >
                            Generate new SEO info
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Search result preview */}
                  <div className="mt-6 text-sm font-semibold text-slate-900">
                    Search result preview
                  </div>

                  <Card className="mt-3 rounded-2xl border-slate-200 shadow-none">
                    <CardContent className="p-5">
                      <div className="text-xl font-semibold text-violet-700">
                        {selectedPage?.name}
                      </div>
                      <div className="mt-1 text-sm text-emerald-700">
                        https://mandalalabs.xyz
                      </div>
                      <div className="mt-2 text-sm text-slate-500">
                        Search engines automatically generate a description. To use a custom
                        description instead, enter it below.
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-3 text-xs text-slate-400">
                    It takes time for Google to update its search results with your website and
                    its changes.
                  </div>

                  {/* Hide page from results */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">
                      Hide page from search results
                    </div>
                    <Switch checked={hideFromSearch} onCheckedChange={setHideFromSearch} />
                  </div>

                  {/* Focus keyword */}
                  <div className="mt-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Focus keyword
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          To help search engines understand your content, select one focus keyword
                          or keyphrase that best represents the topic of this page
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">{focusKeywords.length}/3</div>
                    </div>

                    <Button
                      variant="outline"
                      className="mt-4 h-10 rounded-xl border-slate-200 bg-white px-5 text-sm font-semibold text-violet-700 hover:bg-slate-50"
                      onClick={addKeyword}
                      disabled={focusKeywords.length >= 3}
                    >
                      Add new keyword
                    </Button>

                    <Card className="mt-4 rounded-2xl border-slate-200 shadow-none">
                      <CardContent className="flex items-center gap-3 p-4">
                        <StatusDot status="warning" />
                        <div className="text-sm text-slate-700">
                          Focus keyword should be added and selected for this page
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* SEO title */}
                  <div className="mt-8">
                    <div className="text-sm font-semibold text-slate-900">SEO title</div>

                    <div className="mt-3">
                      <Input
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="h-12 rounded-xl bg-slate-50 text-sm text-slate-900 ring-1 ring-slate-200 focus-visible:ring-2 focus-visible:ring-violet-500"
                        placeholder="Enter SEO title"
                      />
                    </div>

                    <Card className="mt-3 rounded-2xl border-slate-200 shadow-none">
                      <CardContent className="space-y-2 p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded-full ring-1",
                              titleOkNotEmpty
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                : "bg-amber-50 text-amber-600 ring-amber-100"
                            )}
                          >
                            {titleOkNotEmpty ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </span>
                          <span className="text-slate-700">SEO title should not be empty</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded-full ring-1",
                              titleOkLength
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                : "bg-amber-50 text-amber-600 ring-amber-100"
                            )}
                          >
                            {titleOkLength ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </span>
                          <span className="text-slate-700">
                            SEO title length should be between 10 and 60 characters. The current
                            count is{" "}
                            <span className="font-semibold">{titleLen}</span> characters
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded-full ring-1",
                              titleHasKeyword
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                : "bg-amber-50 text-amber-600 ring-amber-100"
                            )}
                          >
                            {titleHasKeyword ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </span>
                          <span className="text-slate-700">
                            SEO title should include a focus keyword
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Meta description */}
                  <div className="mt-8">
                    <div className="text-sm font-semibold text-slate-900">
                      Meta description
                    </div>

                    <div className="mt-3">
                      <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="h-40 w-full resize-none rounded-2xl bg-slate-50 p-4 text-sm text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Write a concise meta description for search results..."
                      />
                    </div>
                  </div>

                  {/* Spacer bottom */}
                  <div className="h-10" />
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
