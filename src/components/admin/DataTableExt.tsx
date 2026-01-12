"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
} from "lucide-react";
import BreadCrumbPage from "../breadCrumb/BreadCrumbPage";

export type ColumnConfig = {
  key: string;
  label?: string;
  hidden?: boolean;
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
};

type SortDir = "asc" | "desc";

function inferType(values: any[]): "string" | "number" | "date" | "boolean" {
  for (const v of values) {
    if (v == null) continue;
    if (typeof v === "number") return "number";
    if (typeof v === "boolean") return "boolean";
    if (typeof v === "string") {
      // date heuristic
      const d = new Date(v);
      if (!Number.isNaN(d.getTime()) && /\d{4}-\d{2}-\d{2}/.test(v))
        return "date";
      return "string";
    }
  }
  return "string";
}

function formatValue(v: any, key?: string) {
  if (v == null) return "-";
  // Custom date formatting for createdAt/updatedAt
  if (
    key &&
    (key.toLowerCase().includes("created") ||
      key.toLowerCase().includes("updated"))
  ) {
    const date = new Date(v);
    if (!isNaN(date.getTime())) {
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();
      if (isToday) return "Today";
      if (isYesterday) return "Yesterday";
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

export function DataTableExt({
  title,
  data,
  createHref,
  onCreate,
  initialColumns,
  onDelete,
  onView,
  opentab,
}: DataTableExtProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({ content: false, _id: false });
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

  const router = useRouter();

  const path = usePathname();
  const lastSegment = path.split("/").filter(Boolean).pop();

  // derive columns
  const columns = useMemo(() => {
    const first = data[0] || {};
    const keys = new Set<string>(Object.keys(first));
    // include keys seen in others too
    for (const row of data.slice(1))
      for (const k of Object.keys(row)) keys.add(k);

    const base: ColumnConfig[] = Array.from(keys)
      .filter(
        (k) =>
          !["tenantId", "websiteId"].includes(k) && typeof first[k] !== "object"
      )
      .map((k) => ({
        key: k,
        label: k
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (ch) => ch.toUpperCase()),
      }));

    if (initialColumns && initialColumns.length) {
      // Merge: respect provided order first, then append the rest
      const known = new Set(initialColumns.map((c) => c.key));
      const merged = [
        ...initialColumns,
        ...base.filter((b) => !known.has(b.key)),
      ];
      return merged;
    }
    return base;
  }, [data, initialColumns]);

  // initialize visibility based on config
  useEffect(() => {
    setColumnVisibility((prev) => {
      const next = { ...prev };
      for (const c of columns) {
        if (next[c.key] == null) next[c.key] = !c.hidden;
      }
      return next;
    });
  }, [columns]);

  // Build metadata for filter UI
  const meta = useMemo(() => {
    const byKey: Record<
      string,
      {
        type: "string" | "number" | "date" | "boolean";
        values: any[];
        uniques: any[];
      }
    > = {};
    for (const c of columns) {
      const values = data.map((r) => r[c.key]).filter((v) => v !== undefined);
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
  }, [columns, data]);

  // Filtering
  const filtered = useMemo(() => {
    let rows = [...data];

    // global search on stringified visible columns
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) => {
        return columns.some(
          (c) =>
            columnVisibility[c.key] !== false &&
            String(r[c.key] ?? "")
              .toLowerCase()
              .includes(q)
        );
      });
    }

    // per-column filters
    rows = rows.filter((r) => {
      for (const c of columns) {
        const val = r[c.key];
        const m = meta[c.key];
        if (!m) continue;
        const type = m.type;

        // enum filter
        const enumVal = enumFilters[c.key];
        if (enumVal && enumVal !== "__any__") {
          if (String(val) !== enumVal) return false;
        }
        // text filter
        const tf = textFilters[c.key];
        if (tf && m.type === "string") {
          if (
            !String(val ?? "")
              .toLowerCase()
              .includes(tf.toLowerCase())
          )
            return false;
        }
        // number range
        const nf = numFilters[c.key];
        if (nf && m.type === "number") {
          const v = Number(val);
          if (!Number.isNaN(v)) {
            if (nf.min != null && v < nf.min) return false;
            if (nf.max != null && v > nf.max) return false;
          }
        }
        // date range
        const df = dateFilters[c.key];
        if (df && m.type === "date") {
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
    columns,
    columnVisibility,
    enumFilters,
    textFilters,
    numFilters,
    dateFilters,
    meta,
  ]);

  // Sorting
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;
    const rows = [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return -1 * dir;
      if (vb == null) return 1 * dir;
      if (typeof va === "number" && typeof vb === "number")
        return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
    return rows;
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = sorted.slice(start, end);

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

  function handleView(e: React.MouseEvent, row: any) {
    e.stopPropagation();
    if (onView) {
      onView(row);
    } else {
      console.log(row);
    }
  }

  function handleDelete(e: React.MouseEvent, row: any) {
    e.stopPropagation();
    if (onDelete) {
      onDelete(row);
    } else {
      console.log("Delete:", row);
    }
  }

  function handleViewPage(
    e: React.MouseEvent,
    row: {
      slug?: string;
      primaryDomain?: string[];
    }
  ) {
    // opentab(row)
    if (opentab) {
      opentab(row);
    }
    //   e.preventDefault();
    //   if (path.includes("domain")) {
    //     if (!row.primaryDomain?.length) return;
    //     const isLocalHost = window.location.hostname.includes("localhost");
    //       console.log("isLocalHost--",isLocalHost)
    //         console.log("row.primaryDomain--",row.primaryDomain)
    //     const domain = row.primaryDomain.find((d) =>
    //       isLocalHost ? d.includes("localhost") : !d.includes("localhost")
    //     );
    //     if (!domain) return;
    //     const url = isLocalHost ? `http://${domain}` : `https://${domain}`;
    // console.log("url00-0", url)
    //     window.location.href = url;
    //   } else {
    //     // if (!row.slug) return;
    //     // router.push(`/${row.slug}`);
    //   }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-end w-full">
        {onCreate ? (
          <Button
            size="sm"
            className="py-2 rounded-sm px-4 py-2"
            onClick={onCreate}
          >
            Create New
          </Button>
        ) : createHref ? (
          <Link href={createHref} className="text-sm">
            <Button size="sm" className="py-2 rounded-sm px-4 py-2">
              Create New
            </Button>
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="bg-white h-10 text-xl"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2">
              <Columns className="h-4 w-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((c) => (
              <DropdownMenuCheckboxItem
                key={c.key}
                checked={columnVisibility[c.key] !== false}
                onCheckedChange={(v) =>
                  setColumnVisibility((s) => ({ ...s, [c.key]: Boolean(v) }))
                }
              >
                {c.label || c.key}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2">
              <ListFilter className="h-4 w-4" /> Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] p-2">
            <div className="text-xs text-muted-foreground px-2 pb-1">
              Dynamic filters
            </div>
            {columns.map((c) => {
              if (columnVisibility[c.key] === false) return null;
              const m = meta[c.key];
              if (!m) return null;
              const type = m.type;
              const uniques = m.uniques;
              const lowCardinality = uniques.length > 0 && uniques.length <= 10;
              return (
                <div key={c.key} className="px-2 py-2 border-b last:border-0">
                  <div className="text-xs font-medium mb-1">
                    {c.label || c.key}
                  </div>
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
                      <SelectTrigger className="h-8 w-full">
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
                      className="h-8 bg-white"
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
                        className="h-8"
                        placeholder="min"
                        type="number"
                        value={numFilters[c.key]?.min ?? ""}
                        onChange={(e) =>
                          setNumFilters((s) => ({
                            ...s,
                            [c.key]: {
                              ...(s[c.key] || {}),
                              min:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            },
                          }))
                        }
                      />
                      <Input
                        className="h-8"
                        placeholder="max"
                        type="number"
                        value={numFilters[c.key]?.max ?? ""}
                        onChange={(e) =>
                          setNumFilters((s) => ({
                            ...s,
                            [c.key]: {
                              ...(s[c.key] || {}),
                              max:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  ) : type === "date" ? (
                    <div className="flex gap-2">
                      <Input
                        className="h-8"
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
                        className="h-8"
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
                  ) : (
                    <Select
                      value={enumFilters[c.key] ?? "__any__"}
                      onValueChange={(v) =>
                        setEnumFilters((s) => ({
                          ...s,
                          [c.key]: v === "__any__" ? null : v,
                        }))
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any__">Any</SelectItem>
                        {["true", "false"].map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
            <div className="px-2 pt-2">
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-md bg-white p-4 border-gray-300">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((c) => columnVisibility[c.key] !== false)
                .map((c) => (
                  <TableHead key={c.key} className="whitespace-nowrap">
                    <button
                      className="inline-flex items-center gap-1 select-none"
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
              <TableHead className="whitespace-nowrap text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row, i) => {
              return (
                <TableRow
                  key={row._id ?? i}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {columns
                    .filter((c: any) => columnVisibility[c.key] !== false)
                    .map((c: any) => {
                      return (
                        <TableCell key={c.key} className="py-2 text-sm">
                          {(() => {
                            // 1) If the column is a link type
                            if (c.type === "link") {
                              return (
                                <Link
                                  href={`${c.href}/${row._id}`}
                                  className="underline text-blue-600 hover:text-blue-800"
                                >
                                  {row[c.key]}
                                </Link>
                              );
                            }

                            // 2) Fallback to custom render if defined
                            if (c.render) return c.render(row[c.key], row);

                            // 3) Default formatter with key for date columns
                            return formatValue(row[c.key], c.key);
                          })()}
                        </TableCell>
                      );
                    })}
                  <TableCell className="py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-500 hover:text-destructive"
                        onClick={(e) => handleViewPage(e, row)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleView(e, row)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => handleDelete(e, row)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center text-sm text-muted-foreground"
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-6 text-sm">
        <div>
          {total === 0 ? "0" : `${start + 1}-${Math.min(end, total)}`} of{" "}
          {total}
        </div>
        <div className="flex items-center gap-2">
          <span>Per Page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[90px] bg-white">
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
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <div>
            {currentPage}/{totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
