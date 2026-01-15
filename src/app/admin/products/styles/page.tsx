"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Download,
  Upload,
  Palette,
  BadgeCheck,
  XCircle,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import { cn } from "@/lib/utils";

// shadcn/ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type Status = "active" | "draft" | "archived";

type StyleItem = {
  id: string;
  name: string;
  code: string; // unique
  brand?: string; // optional
  category?: string; // optional
  status: Status;
  featured: boolean;
  tags: string[];
  cover?: string; // url
  palette: string[]; // hex colors
  updatedAt: string;
};

const STYLES_SEED: StyleItem[] = [
  {
    id: "s_1",
    name: "Modern Minimal",
    code: "modern-minimal",
    brand: "Dzinly",
    category: "Exterior",
    status: "active",
    featured: true,
    tags: ["clean", "neutral", "sleek"],
    cover: "",
    palette: ["#111827", "#F3F4F6", "#9CA3AF", "#FFFFFF"],
    updatedAt: "2026-01-04T14:40:00.000Z",
  },
  {
    id: "s_2",
    name: "Warm Rustic",
    code: "warm-rustic",
    brand: "Dzinly",
    category: "Exterior",
    status: "active",
    featured: false,
    tags: ["wood", "earthy", "cozy"],
    cover: "",
    palette: ["#4B2E2B", "#C8A27A", "#F2E6D8", "#1F2937"],
    updatedAt: "2026-01-03T10:20:00.000Z",
  },
  {
    id: "s_3",
    name: "Coastal Fresh",
    code: "coastal-fresh",
    brand: "Partner Brand",
    category: "Exterior",
    status: "draft",
    featured: false,
    tags: ["blue", "bright", "airy"],
    cover: "",
    palette: ["#0EA5E9", "#E0F2FE", "#F8FAFC", "#334155"],
    updatedAt: "2026-01-02T08:10:00.000Z",
  },
  {
    id: "s_4",
    name: "Luxury Dark",
    code: "luxury-dark",
    brand: "Partner Brand",
    category: "Exterior",
    status: "archived",
    featured: false,
    tags: ["premium", "dark", "bold"],
    cover: "",
    palette: ["#0B0F19", "#111827", "#6B7280", "#D1D5DB"],
    updatedAt: "2026-01-01T12:05:00.000Z",
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function statusBadge(status: Status) {
  if (status === "active") return <Badge>Active</Badge>;
  if (status === "archived") return <Badge variant="secondary">Archived</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

function ColorDots({ colors }: { colors: string[] }) {
  const list = colors.slice(0, 6);
  return (
    <div className="flex items-center gap-1">
      {list.map((c) => (
        <span
          key={c}
          className="h-4 w-4 rounded-full border"
          style={{ backgroundColor: c }}
          title={c}
        />
      ))}
      {colors.length > 6 ? (
        <span className="text-xs text-muted-foreground ml-1">+{colors.length - 6}</span>
      ) : null}
    </div>
  );
}

type StyleForm = {
  id?: string;
  name: string;
  code: string;
  brand: string;
  category: string;
  status: Status;
  featured: boolean;
  tagsCsv: string; // comma separated
  cover: string;
  paletteCsv: string; // comma separated hex
  description: string;
};

const EMPTY_FORM: StyleForm = {
  name: "",
  code: "",
  brand: "",
  category: "Exterior",
  status: "draft",
  featured: false,
  tagsCsv: "",
  cover: "",
  paletteCsv: "#111827, #F3F4F6, #9CA3AF, #FFFFFF",
  description: "",
};

export default function StylesPage() {
  const [styles, setStyles] = React.useState<StyleItem[]>(STYLES_SEED);

  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Status | "all">("all");
  const [featuredOnly, setFeaturedOnly] = React.useState(false);

  const [openEditor, setOpenEditor] = React.useState(false);
  const [form, setForm] = React.useState<StyleForm>(EMPTY_FORM);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return styles.filter((s) => {
      const matchesQuery =
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        (s.brand ?? "").toLowerCase().includes(query) ||
        s.tags.some((t) => t.toLowerCase().includes(query));

      const matchesStatus = statusFilter === "all" ? true : s.status === statusFilter;
      const matchesFeatured = featuredOnly ? s.featured : true;

      return matchesQuery && matchesStatus && matchesFeatured;
    });
  }, [styles, q, statusFilter, featuredOnly]);

  const counts = React.useMemo(() => {
    const total = styles.length;
    const active = styles.filter((s) => s.status === "active").length;
    const draft = styles.filter((s) => s.status === "draft").length;
    const archived = styles.filter((s) => s.status === "archived").length;
    const featured = styles.filter((s) => s.featured).length;
    return { total, active, draft, archived, featured };
  }, [styles]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setOpenEditor(true);
  };

  const openEdit = (s: StyleItem) => {
    setForm({
      id: s.id,
      name: s.name,
      code: s.code,
      brand: s.brand ?? "",
      category: s.category ?? "Exterior",
      status: s.status,
      featured: s.featured,
      tagsCsv: s.tags.join(", "),
      cover: s.cover ?? "",
      paletteCsv: s.palette.join(", "),
      description: "",
    });
    setOpenEditor(true);
  };

  const saveStyle = () => {
    const nowIso = new Date().toISOString();

    const tags = form.tagsCsv
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const palette = form.paletteCsv
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const next: StyleItem = {
      id: form.id ?? `s_${Math.random().toString(16).slice(2)}`,
      name: form.name || "Untitled style",
      code: form.code || (form.name || "style").toLowerCase().replace(/\s+/g, "-"),
      brand: form.brand?.trim() || undefined,
      category: form.category?.trim() || undefined,
      status: form.status,
      featured: !!form.featured,
      tags,
      cover: form.cover?.trim() || "",
      palette,
      updatedAt: nowIso,
    };

    setStyles((prev) => {
      const exists = prev.some((x) => x.id === next.id);
      if (exists) return prev.map((x) => (x.id === next.id ? next : x));
      return [next, ...prev];
    });

    setOpenEditor(false);
  };

  const deleteStyle = (id: string) => {
    setStyles((prev) => prev.filter((s) => s.id !== id));
  };

  const exportJson = () => {
    const data = JSON.stringify(styles, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "styles.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-muted/20">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
        {/* Breadcrumb */}
      

        {/* Title */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
      <BreadCrumbPage />
              <Badge variant="secondary">{counts.total} total</Badge>
              <Badge>Active {counts.active}</Badge>
              <Badge variant="outline">Draft {counts.draft}</Badge>
              <Badge variant="secondary">Archived {counts.archived}</Badge>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Featured {counts.featured}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage style presets (brand & category), palette, tags, and featured placements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={exportJson}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>

            <Dialog open={openEditor} onOpenChange={setOpenEditor}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  New style
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[820px]">
                <DialogHeader>
                  <DialogTitle>{form.id ? "Edit style" : "Create style"}</DialogTitle>
                  <DialogDescription>
                    Define palette, tags and metadata. Featured styles can be highlighted in UI.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="e.g., Modern Minimal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Code (unique)</Label>
                      <Input
                        value={form.code}
                        onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                        placeholder="e.g., modern-minimal"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Brand</Label>
                      <Input
                        value={form.brand}
                        onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                        placeholder="e.g., Dzinly / Partner Brand"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        placeholder="e.g., Exterior"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setForm((p) => ({ ...p, status: v as Status }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Tags (comma separated)</Label>
                      <Input
                        value={form.tagsCsv}
                        onChange={(e) => setForm((p) => ({ ...p, tagsCsv: e.target.value }))}
                        placeholder="e.g., clean, neutral, sleek"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Featured</div>
                        <div className="text-xs text-muted-foreground">Highlight this style in UI.</div>
                      </div>
                      <Switch
                        checked={form.featured}
                        onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Cover image URL (optional)</Label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        value={form.cover}
                        onChange={(e) => setForm((p) => ({ ...p, cover: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Palette (comma separated HEX)</Label>
                      <Input
                        value={form.paletteCsv}
                        onChange={(e) => setForm((p) => ({ ...p, paletteCsv: e.target.value }))}
                        placeholder="#111827, #F3F4F6, #9CA3AF, #FFFFFF"
                      />
                      <div className="text-xs text-muted-foreground">
                        Example: #111827, #F3F4F6, #9CA3AF, #FFFFFF
                      </div>
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="text-sm font-medium mb-2">Preview</div>
                      <div className="flex flex-wrap gap-2">
                        {form.paletteCsv
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean)
                          .slice(0, 10)
                          .map((c) => (
                            <div key={c} className="flex items-center gap-2 rounded-lg border px-2 py-1">
                              <span
                                className="h-4 w-4 rounded-full border"
                                style={{ backgroundColor: c }}
                              />
                              <span className="text-xs font-mono text-muted-foreground">{c}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Short description for internal usage..."
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpenEditor(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveStyle}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full md:w-[320px]">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search styles… (name, code, tags)"
                        className="pl-9"
                      />
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                      <Filter className="h-4 w-4" />
                      Filters
                    </div>

                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                      <Switch checked={featuredOnly} onCheckedChange={setFeaturedOnly} />
                      <span className="text-sm inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        Featured only
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
                    <span className="font-medium text-foreground">{styles.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold">All Styles</div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Add style
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filtered.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/40">
                      <Palette className="h-5 w-5" />
                    </div>
                    <div className="text-lg font-semibold">No styles found</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Try clearing filters, or create a new style.
                    </div>
                    <div className="mt-4">
                      <Button className="gap-2" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Create style
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Style</TableHead>
                          <TableHead>Meta</TableHead>
                          <TableHead>Palette</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtered.map((s) => (
                          <TableRow key={s.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">{s.name}</div>
                                  {s.featured ? (
                                    <Badge variant="outline" className="gap-1">
                                      <Sparkles className="h-3.5 w-3.5" />
                                      Featured
                                    </Badge>
                                  ) : null}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-mono">{s.code}</span>
                                  {s.tags.slice(0, 3).map((t) => (
                                    <Badge key={t} variant="secondary" className="gap-1">
                                      <Tag className="h-3.5 w-3.5" />
                                      {t}
                                    </Badge>
                                  ))}
                                  {s.tags.length > 3 ? (
                                    <span className="text-xs text-muted-foreground">
                                      +{s.tags.length - 3} more
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1 text-sm">
                                <div className="text-muted-foreground">
                                  Brand: <span className="text-foreground">{s.brand ?? "—"}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Category: <span className="text-foreground">{s.category ?? "—"}</span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <ColorDots colors={s.palette} />
                            </TableCell>

                            <TableCell>{statusBadge(s.status)}</TableCell>

                            <TableCell className="text-muted-foreground">{formatDate(s.updatedAt)}</TableCell>

                            <TableCell className="text-right">
                              <div className="inline-flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEdit(s)} className="gap-2">
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </Button>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEdit(s)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setStyles((prev) =>
                                          prev.map((x) =>
                                            x.id === s.id
                                              ? {
                                                  ...x,
                                                  featured: !x.featured,
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              : x
                                          )
                                        )
                                      }
                                    >
                                      Toggle featured
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          onSelect={(e) => e.preventDefault()}
                                          className="text-destructive"
                                        >
                                          Delete
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>

                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete this style?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently remove the style preset and it will not appear in UI.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={() => deleteStyle(s.id)}
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader className="pb-2">
                <div className="font-semibold">Style Hub</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="text-sm font-medium">Featured styles</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Featured styles can be shown on the top of materials listing, home page sections, or AI
                    suggestions.
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    Tips
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>• Keep code unique across tenant/website.</li>
                    <li>• Use tags for filters and AI prompt building.</li>
                    <li>• Add palette for better preview and matching.</li>
                    <li>• Mark best sellers as featured.</li>
                  </ul>
                </div>

                <Button className="w-full gap-2" onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  Create new style
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={exportJson}>
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>

                <div className="text-xs text-muted-foreground">
                  You can connect this page with Brand → Style mapping later.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
