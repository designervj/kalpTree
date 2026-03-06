"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ChevronUp,
  ChevronDown,
  ListFilter,
  Columns,
  Eye,
  Trash2,
  Edit2,
  Layout,
  MoreVertical,
  Home,
  Info,
  Briefcase,
  PhoneCall,
  FileText,
  Globe,
  Link2,
  Star,
  BadgeCheck,
  Copy,
} from "lucide-react";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { WebsitePageModel } from "./website/websitePage/WebsitePageType";

/* -----------------------------
  Types
------------------------------ */
export type ColumnConfig = {
  key: string;
  label?: string;
  hidden?: boolean;
  type?: "text" | "link";
  href?: string;
  render?: (value: any, row: any) => React.ReactNode;
};

export type DataTableExtProps = {
  title: string;
  data: any[];
  createHref?: string;
  onCreate?: () => void;
  initialColumns?: ColumnConfig[];
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  opentab?: (row: any) => void;
  onSelectionChange?: (rows: any[]) => void;
  onEditPermissions?: (row: any) => void;
  /** ✅ OPTIONAL: force horizontal scrolling after X columns */
  scrollMinWidth?: number; // default 1100
};

type SortDir = "asc" | "desc";

/* -----------------------------
  Utils
------------------------------ */
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function inferType(values: any[]): "string" | "number" | "date" | "boolean" {
  for (const v of values) {
    if (v == null) continue;
    if (typeof v === "number") return "number";
    if (typeof v === "boolean") return "boolean";
    if (typeof v === "string") {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime()) && /\d{4}-\d{2}-\d{2}/.test(v))
        return "date";
      return "string";
    }
  }
  return "string";
}

function formatValue(v: any) {
  if (v == null) return "-";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

function formatPrettyDate2Line(v: any) {
  if (!v) return { top: "-", bottom: "" };

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return { top: String(v), bottom: "" };

  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const top = isToday
    ? "Today"
    : isYesterday
      ? "Yesterday"
      : d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const bottom = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { top, bottom };
}

function getSlugIcon(slug?: string, title?: string) {
  const s = (slug || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (s === "home" || t.includes("home")) return Home;
  if (s.includes("about") || t.includes("about")) return Info;
  if (s.includes("service") || t.includes("service")) return Briefcase;
  if (s.includes("contact") || t.includes("contact")) return PhoneCall;
  if (s.includes("blog") || t.includes("blog")) return FileText;
  if (s.includes("pricing") || t.includes("pricing")) return Star;
  if (s.includes("terms") || s.includes("privacy")) return Link2;
  return Globe;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch { }
}

function getRowId(row: any, fallbackIndex: number) {
  const id = row?._id ?? row?.id ?? row?.ID ?? row?.email ?? null;
  return String(id ?? fallbackIndex);
}

/* -----------------------------
  ✅ Hide these columns by default
------------------------------ */
const HIDE_BY_DEFAULT = new Set([
  "seotitle",
  "metadescription",
  "focuskeyword",
  "seo_title",
  "meta_description",
  "focus_keyword",
]);

/* -----------------------------
  Component
------------------------------ */
export function DataTableExt({
  title,
  data,
  createHref,
  onCreate,
  initialColumns,
  onDelete,
  onView,
  opentab,
  onSelectionChange,
  onEditPermissions,
  scrollMinWidth = 1100,
}: DataTableExtProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const pathname = usePathname();
  const pageName = pathname.split("/")[5];


  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { alluser } = useSelector((state: RootState) => state.user);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    content: false,
    _id: false,
    seoTitle: false,
    metaDescription: false,
    focusKeyword: false,
  });

  const [enumFilters, setEnumFilters] = useState<Record<string, string | null>>(
    {}
  );
  const [textFilters, setTextFilters] = useState<Record<string, string>>({});
  const [numFilters, setNumFilters] = useState<
    Record<string, { min?: number; max?: number }>
  >({});
  const [dateFilters, setDateFilters] = useState<
    Record<string, { from?: string; to?: string }>
  >({});

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  /* -----------------------------
    Columns
  ------------------------------ */
  const columns = useMemo(() => {
    const first = data[0] || {};
    const keys = new Set<string>(Object.keys(first));
    for (const row of data.slice(1)) for (const k of Object.keys(row)) keys.add(k);

    const base: ColumnConfig[] = Array.from(keys)
      .filter((k) => !["tenantId", "websiteId"].includes(k) && typeof first[k] !== "object")
      .map((k) => ({
        key: k,
        label: k.replace(/([A-Z])/g, " $1").replace(/^./, (ch) => ch.toUpperCase()),
      }));

    if (initialColumns?.length) {
      const known = new Set(initialColumns.map((c) => c.key));
      return [...initialColumns, ...base.filter((b) => !known.has(b.key))];
    }

    return base;
  }, [data, initialColumns]);

  const normalizedColumns = useMemo(() => {
    return columns.map((c) => {
      const k = c.key;
      const kl = String(k).toLowerCase();
      const hidden = c.hidden || HIDE_BY_DEFAULT.has(kl);

      if (kl === "createdat") return { ...c, label: "Created At", hidden };
      if (kl === "updatedat") return { ...c, label: "Updated At", hidden };
      if (kl === "ishomepage") return { ...c, label: "Home", hidden };

      // ✅ make header label consistent for published
      if (kl === "published" || kl === "publishedat" || kl === "published_at")
        return { ...c, label: "Published", hidden };

      if (kl === "seotitle") return { ...c, label: "SEO Title", hidden };
      if (kl === "metadescription") return { ...c, label: "Meta Description", hidden };
      if (kl === "focuskeyword") return { ...c, label: "Focus Keyword", hidden };

      return { ...c, hidden };
    });
  }, [columns]);

  useEffect(() => {
    setColumnVisibility((prev) => {
      const next = { ...prev };

      for (const c of normalizedColumns) {
        if (next[c.key] == null) next[c.key] = !c.hidden;
      }

      for (const k of Object.keys(next)) {
        if (HIDE_BY_DEFAULT.has(k.toLowerCase())) next[k] = false;
      }

      next.seoTitle = false;
      next.metaDescription = false;
      next.focusKeyword = false;

      return next;
    });
  }, [normalizedColumns]);

  /* -----------------------------
    Filter metadata
  ------------------------------ */
  const meta = useMemo(() => {
    const byKey: Record<
      string,
      { type: "string" | "number" | "date" | "boolean"; values: any[]; uniques: any[] }
    > = {};

    for (const c of normalizedColumns) {
      const values = (data || [])
        .filter((r) => r !== undefined && r !== null)
        .map((r) => r[c.key])
        .filter((v) => v !== undefined);
      const type = inferType(values);

      const uniques: any[] = [];
      const set = new Set<string>();
      for (const v of values) {
        const s = JSON.stringify(v);
        if (!set.has(s)) {
          set.add(s);
          uniques.push(v);
        }
      }

      byKey[c.key] = { type, values, uniques };
    }
    return byKey;
  }, [normalizedColumns, data]);

  /* -----------------------------
    Filtering
  ------------------------------ */
  const filtered = useMemo(() => {
    let rows = [...data];

    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) =>
        normalizedColumns.some(
          (c) =>
            columnVisibility[c.key] !== false &&
            String(r[c.key] ?? "").toLowerCase().includes(q)
        )
      );
    }

    rows = rows.filter((r) => {
      for (const c of normalizedColumns) {
        const val = r[c.key];
        const m = meta[c.key];
        if (!m) continue;

        const type = m.type;

        const enumVal = enumFilters[c.key];
        if (enumVal && enumVal !== "__any__") {
          if (String(val) !== enumVal) return false;
        }

        const tf = textFilters[c.key];
        if (tf && type === "string") {
          if (!String(val ?? "").toLowerCase().includes(tf.toLowerCase())) return false;
        }

        const nf = numFilters[c.key];
        if (nf && type === "number") {
          const v = Number(val);
          if (!Number.isNaN(v)) {
            if (nf.min != null && v < nf.min) return false;
            if (nf.max != null && v > nf.max) return false;
          }
        }

        const df = dateFilters[c.key];
        if (df && type === "date") {
          const d = new Date(val);
          if (!Number.isNaN(d.getTime())) {
            if (df.from && d < new Date(df.from)) return false;
            if (df.to && d > new Date(df.to)) return false;
          }
        }
      }
      return true;
    });

    return rows;
  }, [
    data,
    query,
    normalizedColumns,
    columnVisibility,
    enumFilters,
    textFilters,
    numFilters,
    dateFilters,
    meta,
  ]);

  /* -----------------------------
    Sorting
  ------------------------------ */
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];

      if (va == null && vb == null) return 0;
      if (va == null) return -1 * dir;
      if (vb == null) return 1 * dir;

      const mt = meta[sortKey]?.type;
      if (mt === "date") return (new Date(va).getTime() - new Date(vb).getTime()) * dir;

      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [filtered, sortKey, sortDir, meta]);

  /* -----------------------------
    Pagination
  ------------------------------ */
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = sorted.slice(start, end);

  useEffect(() => {
    if (!onSelectionChange) return;
    const selected = data.filter((r, idx) => selectedIds.has(getRowId(r, idx)));
    onSelectionChange(selected);
  }, [selectedIds, data, onSelectionChange]);

  const visibleColumns = normalizedColumns.filter((c) => columnVisibility[c.key] !== false);

  const tableMinWidth = Math.max(scrollMinWidth, 260 + visibleColumns.length * 160);

  const stickyRightHead = "sticky right-0 z-20 bg-slate-50 border-l border-slate-200";
  const stickyRightCell = "sticky right-0 z-10 bg-white border-l border-slate-200";

  const stickyLeftHead = "sticky left-0 z-30 bg-slate-50 border-r border-slate-200";
  const stickyLeftCell = "sticky left-0 z-20 bg-white border-r border-slate-200";

  const pageIds = useMemo(
    () => pageRows.map((r, idx) => getRowId(r, start + idx)),
    [pageRows, start]
  );
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  function toggleSelectAllOnPage(checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of pageIds) checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  function toggleSelectRow(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  function resetFilters() {
    setEnumFilters({});
    setTextFilters({});
    setNumFilters({});
    setDateFilters({});
    setQuery("");
    setPage(1);
  }

  const handleBuilderEdit = async (row: WebsitePageModel) => {
    if (!currentWebsite?.primaryDomain) return;
    const isLocalHost = window.location.hostname.includes("localhost");

    const url = isLocalHost
      ? `http://${currentWebsite?.primaryDomain[1]}/builder/${currentWebsite?._id}?page=${row.slug}`
      : `http://${currentWebsite?.primaryDomain[0]}/builder/${currentWebsite?._id}?page=${row.slug}`;

    window.open(url, "_blank");
  };

  const handleEditPermissions = (row: any) => {
    if (!onEditPermissions) return;
    onEditPermissions(row);
  };

  return (
    <div className="w-full min-w-0">
      <div className="max-w-6xl min-w-0 px-0 sm:px-2 py-3 mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-slate-900 truncate">
              {title || "Table"}
            </div>
            <div className="text-xs text-slate-500">
              {total ? `${total} items` : "No items"} • Pages
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedIds.size > 0 ? (
              <div className="flex items-center gap-2 mr-2">
                <span className="text-xs text-slate-600">
                  Selected: <b className="text-slate-900">{selectedIds.size}</b>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear
                </Button>
              </div>
            ) : null}

            {onCreate ? (
              <Button size="sm" className="rounded-md px-4" onClick={onCreate}>
                Create New
              </Button>
            ) : createHref ? (
              <Link href={createHref} className="text-sm">
                <Button size="sm" className="rounded-md px-4">
                  Create New
                </Button>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Search + menus */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <div className="flex-1 min-w-[220px]">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="bg-white h-10 text-black"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-10 shrink-0">
                <Columns className="h-4 w-4" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {normalizedColumns.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={columnVisibility[c.key] !== false}
                  onCheckedChange={(v) =>
                    setColumnVisibility((s) => ({
                      ...s,
                      [c.key]: Boolean(v),
                    }))
                  }
                >
                  {c.label || c.key}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-10 shrink-0">
                <ListFilter className="h-4 w-4" /> Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] p-2">
              <div className="text-xs text-muted-foreground px-2 pb-1">Dynamic filters</div>

              {normalizedColumns.map((c) => {
                if (columnVisibility[c.key] === false) return null;
                const m = meta[c.key];
                if (!m) return null;

                const type = m.type;
                const uniques = m.uniques;
                const lowCardinality = uniques.length > 0 && uniques.length <= 10;

                return (
                  <div key={c.key} className="px-2 py-2 border-b last:border-0">
                    <div className="text-xs font-medium mb-1">{c.label || c.key}</div>

                    {type === "string" && lowCardinality ? (
                      <Select
                        value={enumFilters[c.key] ?? "__any__"}
                        onValueChange={(v) =>
                          setEnumFilters((s) => ({
                            ...s,
                            [c.key]: v === "__any__" ? null : v,
                          }))
                        }
                      >
                        <SelectTrigger className="h-9 w-full bg-white">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="__any__">Any</SelectItem>
                          {uniques.map((u) => (
                            <SelectItem key={String(u)} value={String(u)}>
                              {String(u)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : type === "string" ? (
                      <Input
                        className="h-9 bg-white"
                        placeholder="contains..."
                        value={textFilters[c.key] ?? ""}
                        onChange={(e) =>
                          setTextFilters((s) => ({
                            ...s,
                            [c.key]: e.target.value,
                          }))
                        }
                      />
                    ) : type === "number" ? (
                      <div className="flex gap-2">
                        <Input
                          className="h-9 bg-white"
                          placeholder="min"
                          type="number"
                          value={numFilters[c.key]?.min ?? ""}
                          onChange={(e) =>
                            setNumFilters((s) => ({
                              ...s,
                              [c.key]: {
                                ...(s[c.key] || {}),
                                min: e.target.value === "" ? undefined : Number(e.target.value),
                              },
                            }))
                          }
                        />
                        <Input
                          className="h-9 bg-white"
                          placeholder="max"
                          type="number"
                          value={numFilters[c.key]?.max ?? ""}
                          onChange={(e) =>
                            setNumFilters((s) => ({
                              ...s,
                              [c.key]: {
                                ...(s[c.key] || {}),
                                max: e.target.value === "" ? undefined : Number(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    ) : type === "date" ? (
                      <div className="flex gap-2">
                        <Input
                          className="h-9 bg-white"
                          type="date"
                          value={dateFilters[c.key]?.from ?? ""}
                          onChange={(e) =>
                            setDateFilters((s) => ({
                              ...s,
                              [c.key]: {
                                ...(s[c.key] || {}),
                                from: e.target.value || undefined,
                              },
                            }))
                          }
                        />
                        <Input
                          className="h-9 bg-white"
                          type="date"
                          value={dateFilters[c.key]?.to ?? ""}
                          onChange={(e) =>
                            setDateFilters((s) => ({
                              ...s,
                              [c.key]: {
                                ...(s[c.key] || {}),
                                to: e.target.value || undefined,
                              },
                            }))
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="px-2 pt-2 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ✅ Card */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm w-full min-w-0 overflow-hidden">
          <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain table-scroll">
            <Table className="w-full min-w-max" style={{ minWidth: tableMinWidth }}>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className={cn("w-[52px]", stickyLeftHead)}>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={allOnPageSelected}
                        onCheckedChange={(v) => toggleSelectAllOnPage(Boolean(v))}
                        aria-label="Select all"
                      />
                    </div>
                  </TableHead>

                  {visibleColumns.map((c) => (
                    <TableHead
                      key={c.key}
                      className="whitespace-nowrap text-[12.5px] font-semibold text-slate-700"
                    >
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 select-none hover:text-slate-900"
                        onClick={() => toggleSort(c.key)}
                      >
                        <span>{c.label || c.key}</span>
                        {sortKey === c.key ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        ) : null}
                      </button>
                    </TableHead>
                  ))}

                  <TableHead className={cn("text-right whitespace-nowrap", stickyRightHead)}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row: any, i: number) => {
                  const rowId = getRowId(row, start + i);
                  const isSelected = selectedIds.has(rowId);

                  const Icon = getSlugIcon(row.slug, row.title);
                  const createdRaw = row.createdAt || row.created || row.created_at;
                  const updatedRaw = row.updatedAt || row.updated || row.updated_at;

                  return (
                    <TableRow
                      key={rowId}
                      className={cn("hover:bg-slate-50/70", isSelected ? "bg-slate-50" : "")}
                    >
                      <TableCell className={cn("w-[52px]", stickyLeftCell)}>
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(v) => toggleSelectRow(rowId, Boolean(v))}
                            aria-label="Select row"
                          />
                        </div>
                      </TableCell>

                      {visibleColumns.map((c) => {
                        const key = c.key;
                        const value = row[key];
                        const kl = String(key).toLowerCase();

                        // SLUG
                        if (kl === "slug") {
                          return (
                            <TableCell key={key} className="py-3 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-2 min-w-[220px]">
                                <div className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center shrink-0">
                                  <Icon className="h-4 w-4 text-slate-700" />
                                </div>

                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900 truncate max-w-[320px]">
                                    {String(value || "-")}
                                  </div>
                                  <div className="text-xs text-slate-500 truncate max-w-[320px]">
                                    {row.title ? String(row.title) : "—"}
                                  </div>
                                </div>

                                {row.isHomePage === true ||
                                  String(row.isHomePage).toLowerCase() === "yes" ? (
                                  <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 shrink-0">
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Home
                                  </span>
                                ) : null}
                              </div>
                            </TableCell>
                          );
                        }

                        // ✅ Created At two-line
                        if (kl === "createdat") {
                          const d = formatPrettyDate2Line(value ?? createdRaw);
                          return (
                            <TableCell key={key} className="py-3 text-sm whitespace-nowrap">
                              <div className="font-semibold text-slate-900 leading-5">{d.top}</div>
                              <div className="text-xs text-slate-500 leading-5">{d.bottom}</div>
                            </TableCell>
                          );
                        }

                        // ✅ Updated At two-line
                        if (kl === "updatedat") {
                          const d = formatPrettyDate2Line(value ?? updatedRaw);
                          return (
                            <TableCell key={key} className="py-3 text-sm whitespace-nowrap">
                              <div className="font-semibold text-slate-900 leading-5">{d.top}</div>
                              <div className="text-xs text-slate-500 leading-5">{d.bottom}</div>
                            </TableCell>
                          );
                        }

                        // ✅ ✅ Published two-line (same as Created At)  <-- THIS IS THE CHANGE YOU WANTED
                        if (kl === "published" || kl === "publishedat" || kl === "published_at") {
                          const d = formatPrettyDate2Line(value);
                          return (
                            <TableCell key={key} className="py-3 text-sm whitespace-nowrap">
                              <div className="font-semibold text-slate-900 leading-5">{d.top}</div>
                              <div className="text-xs text-slate-500 leading-5">{d.bottom}</div>
                            </TableCell>
                          );
                        }

                        // STATUS
                        if (kl === "status") {
                          const val = String(value ?? "-").toLowerCase();
                          const ok =
                            val.includes("publish") ||
                            val === "active" ||
                            val === "true" ||
                            val === "yes";
                          return (
                            <TableCell key={key} className="py-3 text-sm whitespace-nowrap">
                              <span
                                className={cn(
                                  "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                                  ok
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-amber-200 bg-amber-50 text-amber-800"
                                )}
                              >
                                {formatValue(value)}
                              </span>
                            </TableCell>
                          );
                        }

                        // LINK
                        if (c.type === "link" && c.href) {
                          return (
                            <TableCell key={key} className="py-3 text-sm whitespace-nowrap">
                              <Link
                                href={`${c.href}/${row._id}`}
                                className="underline text-blue-600 hover:text-blue-800"
                              >
                                {formatValue(value)}
                              </Link>
                            </TableCell>
                          );
                        }

                        // CUSTOM RENDER
                        if (c.render) {
                          return (
                            <TableCell key={key} className="py-3 text-sm whitespace-nowrap">
                              {c.render(value, row)}
                            </TableCell>
                          );
                        }

                        // DEFAULT
                        return (
                          <TableCell
                            key={key}
                            className="py-3 text-sm text-slate-700 whitespace-nowrap"
                            title={value != null ? String(value) : undefined}
                          >
                            {formatValue(value)}
                          </TableCell>
                        );
                      })}

                      <TableCell className={cn("py-3 text-right", stickyRightCell)}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
                              title="Actions"
                            >
                              <MoreVertical className="h-4 w-4 text-slate-700" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => opentab?.(row)}>
                              <Eye className="h-4 w-4 mr-2 text-emerald-600" />
                              View
                            </DropdownMenuItem>

                            {pageName === "pages" ? (
                              <DropdownMenuItem onClick={() => handleBuilderEdit(row)}>
                                <Layout className="h-4 w-4 mr-2" />
                                Builder
                              </DropdownMenuItem>
                            ) : null}
                            {alluser.length > 0 ? <DropdownMenuItem onClick={() => handleEditPermissions(row)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit Permissions
                            </DropdownMenuItem> : null}
                            <DropdownMenuItem onClick={() => onView?.(row)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={async () => {
                                const slug = row?.slug ? String(row.slug) : "";
                                const domain = Array.isArray(currentWebsite?.primaryDomain)
                                  ? currentWebsite?.primaryDomain[0]
                                  : currentWebsite?.primaryDomain;

                                const url =
                                  domain && slug ? `https://${domain}/${slug}` : slug ? `/${slug}` : "";
                                if (url) await copyToClipboard(url);
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy URL
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDelete?.(row)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length + 2}
                      className="text-center text-sm text-muted-foreground py-10"
                    >
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-sm">
            <div className="text-slate-600">
              {total === 0 ? "0" : `${start + 1}-${Math.min(end, total)}`} of{" "}
              <span className="font-semibold text-slate-900">{total}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Per page</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 w-[110px] bg-white text-black rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>

                <div className="text-slate-700">
                  <span className="font-semibold">{currentPage}</span>/{totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="text-xs text-slate-500 pt-3">
          ✅ Columns add karoge to table ke andar hi horizontal scroll aayega (sidebar/page affect nahi hoga).
        </div> */}
      </div>
    </div>
  );
}