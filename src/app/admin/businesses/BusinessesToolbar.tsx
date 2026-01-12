"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Columns2, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showColumnsButton?: boolean;
  onOpenColumns?: () => void;
};

const PLAN_OPTIONS = ["all", "trial", "free", "pro", "agency"] as const;
const STATUS_OPTIONS = ["all", "active", "paused", "inactive"] as const;
const TYPE_OPTIONS = ["all", "business", "franchise", "agency"] as const;

function buildUrlWithParams(
  pathname: string,
  current: URLSearchParams,
  patch: Record<string, string | null | undefined>
) {
  const sp = new URLSearchParams(current.toString());

  Object.entries(patch).forEach(([k, v]) => {
    if (v === null || v === undefined || v === "" || v === "all") sp.delete(k);
    else sp.set(k, v);
  });

  // whenever filters/search change, reset page
  if (
    "q" in patch ||
    "plan" in patch ||
    "status" in patch ||
    "type" in patch
  ) {
    sp.delete("page");
  }

  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

const   BusinessesToolbar = ({
  className,
  showColumnsButton = true,
  onOpenColumns,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const qFromUrl = searchParams.get("q") ?? "";
  const planFromUrl = (searchParams.get("plan") ?? "all") as (typeof PLAN_OPTIONS)[number];
  const statusFromUrl = (searchParams.get("status") ?? "all") as (typeof STATUS_OPTIONS)[number];
  const typeFromUrl = (searchParams.get("type") ?? "all") as (typeof TYPE_OPTIONS)[number];

  // local UI state (debounced search)
  const [q, setQ] = React.useState(qFromUrl);
  const [plan, setPlan] = React.useState(planFromUrl);
  const [status, setStatus] = React.useState(statusFromUrl);
  const [type, setType] = React.useState(typeFromUrl);

  // keep in sync if URL changes
  React.useEffect(() => setQ(qFromUrl), [qFromUrl]);
  React.useEffect(() => setPlan(planFromUrl), [planFromUrl]);
  React.useEffect(() => setStatus(statusFromUrl), [statusFromUrl]);
  React.useEffect(() => setType(typeFromUrl), [typeFromUrl]);

  // debounce search -> URL
  React.useEffect(() => {
    const t = setTimeout(() => {
      const url = buildUrlWithParams(pathname, searchParams as any, { q });
      router.replace(url);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const applyFilters = () => {
    const url = buildUrlWithParams(pathname, searchParams as any, {
      plan,
      status,
      type,
    });
    router.replace(url);
  };

  const clearAll = () => {
    setQ("");
    setPlan("all");
    setStatus("all");
    setType("all");

    const url = buildUrlWithParams(pathname, searchParams as any, {
      q: null,
      plan: null,
      status: null,
      type: null,
      page: null,
    });
    router.replace(url);
  };

  return (
    <div
      className={cn(
        "w-full flex items-center gap-4",
        "rounded-xl border bg-white p-3",
        className
      )}
    >
      {/* Search full width */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="h-12 w-full rounded-xl pl-11 pr-10 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-muted-foreground/40"
        />
        {q?.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
    
        {/* Filters (Sheet) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl px-6 bg-white border-muted-foreground/20 hover:bg-muted/40"
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[360px] sm:w-[420px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-5">
              {/* Plan */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Plan</div>
                <Select value={plan} onValueChange={(v) => setPlan(v as any)}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p === "all" ? "All" : p.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === "all" ? "All" : s.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Type</div>
                <Select value={type} onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t === "all" ? "All" : t.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-3 flex items-center gap-2">
                <Button className="flex-1 h-11 rounded-xl" onClick={applyFilters}>
                  Apply
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl"
                  onClick={clearAll}
                >
                  Clear
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}


export default BusinessesToolbar;