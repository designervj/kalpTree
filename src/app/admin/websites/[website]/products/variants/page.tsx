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
  Package,
  Tag,
  Layers,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Barcode,
  DollarSign,
  RefreshCcw,
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
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type Status = "active" | "draft" | "archived";

type Variant = {
  id: string;
  productName: string;
  productId: string;
  sku: string;
  optionsLabel: string; // "Size: M • Color: Black"
  price: number;
  compareAt?: number;
  stock: number;
  status: Status;
  hasImage: boolean;
  updatedAt: string;
};

const VARIANTS_SEED: Variant[] = [
  {
    id: "v_1",
    productName: "Exterior Paint - Premium",
    productId: "p_1",
    sku: "PAINT-PRM-WHT-1L",
    optionsLabel: "Color: White • Size: 1L",
    price: 1299,
    compareAt: 1499,
    stock: 42,
    status: "active",
    hasImage: true,
    updatedAt: "2026-01-03T10:20:00.000Z",
  },
  {
    id: "v_2",
    productName: "Exterior Paint - Premium",
    productId: "p_1",
    sku: "PAINT-PRM-GRY-5L",
    optionsLabel: "Color: Gray • Size: 5L",
    price: 4599,
    compareAt: 4999,
    stock: 8,
    status: "active",
    hasImage: false,
    updatedAt: "2026-01-02T08:10:00.000Z",
  },
  {
    id: "v_3",
    productName: "Stone Cladding - Slate",
    productId: "p_2",
    sku: "STONE-SLATE-60X30",
    optionsLabel: "Finish: Matte • Size: 60x30",
    price: 899,
    stock: 0,
    status: "draft",
    hasImage: true,
    updatedAt: "2026-01-01T12:05:00.000Z",
  },
  {
    id: "v_4",
    productName: "Siding Panel - Cedar",
    productId: "p_3",
    sku: "SIDING-CEDAR-NAT",
    optionsLabel: "Color: Natural • Length: 12ft",
    price: 1599,
    stock: 120,
    status: "active",
    hasImage: true,
    updatedAt: "2026-01-04T14:40:00.000Z",
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

function inStockBadge(stock: number) {
  if (stock > 0) {
    return (
      <Badge variant="secondary" className="gap-1">
        <CheckCircle2 className="h-3.5 w-3.5" />
        In stock
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1">
      <XCircle className="h-3.5 w-3.5" />
      Out
    </Badge>
  );
}

function money(v: number) {
  // adjust currency if needed
  return `₹${v.toLocaleString()}`;
}

type VariantForm = {
  id?: string;
  productName: string;
  sku: string;
  optionsLabel: string;
  price: number;
  compareAt?: number;
  stock: number;
  status: Status;
  hasImage: boolean;
  enable: boolean;
};

const EMPTY_FORM: VariantForm = {
  productName: "",
  sku: "",
  optionsLabel: "",
  price: 0,
  compareAt: undefined,
  stock: 0,
  status: "draft",
  hasImage: false,
  enable: false,
};

export default function VariantsPage() {
  const [variants, setVariants] = React.useState<Variant[]>(VARIANTS_SEED);

  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Status | "all">("all");
  const [stockFilter, setStockFilter] = React.useState<"all" | "in" | "out">("all");
  const [imagesOnly, setImagesOnly] = React.useState(false);

  const [openEditor, setOpenEditor] = React.useState(false);
  const [form, setForm] = React.useState<VariantForm>(EMPTY_FORM);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return variants.filter((v) => {
      const matchesQuery =
        !query ||
        v.productName.toLowerCase().includes(query) ||
        v.sku.toLowerCase().includes(query) ||
        v.optionsLabel.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" ? true : v.status === statusFilter;

      const matchesStock =
        stockFilter === "all"
          ? true
          : stockFilter === "in"
          ? v.stock > 0
          : v.stock === 0;

      const matchesImages = imagesOnly ? v.hasImage : true;

      return matchesQuery && matchesStatus && matchesStock && matchesImages;
    });
  }, [variants, q, statusFilter, stockFilter, imagesOnly]);

  const counts = React.useMemo(() => {
    const total = variants.length;
    const active = variants.filter((v) => v.status === "active").length;
    const draft = variants.filter((v) => v.status === "draft").length;
    const archived = variants.filter((v) => v.status === "archived").length;
    const out = variants.filter((v) => v.stock === 0).length;
    return { total, active, draft, archived, out };
  }, [variants]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setOpenEditor(true);
  };

  const openEdit = (v: Variant) => {
    setForm({
      id: v.id,
      productName: v.productName,
      sku: v.sku,
      optionsLabel: v.optionsLabel,
      price: v.price,
      compareAt: v.compareAt,
      stock: v.stock,
      status: v.status,
      hasImage: v.hasImage,
      enable: v.status === "active",
    });
    setOpenEditor(true);
  };

  const saveVariant = () => {
    const nowIso = new Date().toISOString();

    const next: Variant = {
      id: form.id ?? `v_${Math.random().toString(16).slice(2)}`,
      productId: "p_custom",
      productName: form.productName || "Untitled product",
      sku: form.sku || "SKU-NEW",
      optionsLabel: form.optionsLabel || "—",
      price: Number.isFinite(form.price) ? Number(form.price) : 0,
      compareAt: form.compareAt ? Number(form.compareAt) : undefined,
      stock: Number.isFinite(form.stock) ? Number(form.stock) : 0,
      status: form.enable ? "active" : form.status,
      hasImage: !!form.hasImage,
      updatedAt: nowIso,
    };

    setVariants((prev) => {
      const exists = prev.some((x) => x.id === next.id);
      if (exists) return prev.map((x) => (x.id === next.id ? next : x));
      return [next, ...prev];
    });

    setOpenEditor(false);
  };

  const deleteVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const exportJson = () => {
    const data = JSON.stringify(variants, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "variants.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const restockAllOut = () => {
    setVariants((prev) =>
      prev.map((v) =>
        v.stock === 0
          ? { ...v, stock: 10, updatedAt: new Date().toISOString() }
          : v
      )
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-muted/20">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
        {/* Breadcrumb */}

        {/* Title row */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
               <BreadCrumbPage />
             
              <Badge variant="secondary">{counts.total} total</Badge>
              <Badge>Active {counts.active}</Badge>
              <Badge variant="outline">Draft {counts.draft}</Badge>
              <Badge variant="secondary">Archived {counts.archived}</Badge>
              <Badge variant="outline">Out {counts.out}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage SKUs, options, pricing, inventory, and availability for every product variation.
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
                  New variant
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                  <DialogTitle>{form.id ? "Edit variant" : "Create variant"}</DialogTitle>
                  <DialogDescription>
                    Keep SKUs unique and maintain stock/price accuracy.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Product name</Label>
                      <Input
                        value={form.productName}
                        onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))}
                        placeholder="e.g., Exterior Paint - Premium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <div className="relative">
                        <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          value={form.sku}
                          onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                          placeholder="e.g., PAINT-PRM-WHT-1L"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Options label</Label>
                    <Input
                      value={form.optionsLabel}
                      onChange={(e) => setForm((p) => ({ ...p, optionsLabel: e.target.value }))}
                      placeholder="e.g., Color: White • Size: 1L"
                    />
                    <div className="text-xs text-muted-foreground">
                      Example: “Size: M • Color: Black”. Used in lists and orders.
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          type="number"
                          value={String(form.price)}
                          onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Compare at (optional)</Label>
                      <Input
                        type="number"
                        value={form.compareAt ? String(form.compareAt) : ""}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            compareAt: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                        placeholder="e.g., 1499"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={String(form.stock)}
                        onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
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

                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Enable variant</div>
                        <div className="text-xs text-muted-foreground">
                          When enabled, status becomes Active.
                        </div>
                      </div>
                      <Switch
                        checked={form.enable}
                        onCheckedChange={(v) => setForm((p) => ({ ...p, enable: v }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpenEditor(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveVariant}>Save</Button>
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
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full md:w-[320px]">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search variants… (SKU, product, options)"
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

                    <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as any)}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Stock" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All stock</SelectItem>
                        <SelectItem value="in">In stock</SelectItem>
                        <SelectItem value="out">Out of stock</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                      <Switch checked={imagesOnly} onCheckedChange={setImagesOnly} />
                      <span className="text-sm inline-flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        Images only
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
                    <span className="font-medium text-foreground">{variants.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold">All Variants</div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Add variant
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filtered.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/40">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="text-lg font-semibold">No variants found</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Try clearing filters, or create a new variant.
                    </div>
                    <div className="mt-4">
                      <Button className="gap-2" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Create variant
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Variant</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Options</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtered.map((v) => (
                          <TableRow key={v.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{v.productName}</div>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  {v.hasImage ? (
                                    <Badge variant="secondary" className="gap-1">
                                      <ImageIcon className="h-3.5 w-3.5" />
                                      Image
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="gap-1">
                                      <ImageIcon className="h-3.5 w-3.5" />
                                      No image
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="font-mono text-xs">{v.sku}</TableCell>

                            <TableCell>
                              <div className="text-sm">{v.optionsLabel}</div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-0.5">
                                <div className="font-medium">{money(v.price)}</div>
                                {typeof v.compareAt === "number" ? (
                                  <div className="text-xs text-muted-foreground line-through">
                                    {money(v.compareAt)}
                                  </div>
                                ) : null}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">{v.stock}</Badge>
                                {inStockBadge(v.stock)}
                              </div>
                            </TableCell>

                            <TableCell>{statusBadge(v.status)}</TableCell>

                            <TableCell className="text-muted-foreground">{formatDate(v.updatedAt)}</TableCell>

                            <TableCell className="text-right">
                              <div className="inline-flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEdit(v)} className="gap-2">
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
                                    <DropdownMenuItem onClick={() => openEdit(v)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setVariants((prev) =>
                                          prev.map((x) =>
                                            x.id === v.id
                                              ? {
                                                  ...x,
                                                  hasImage: !x.hasImage,
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              : x
                                          )
                                        )
                                      }
                                    >
                                      Toggle image
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
                                          <AlertDialogTitle>Delete this variant?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will remove the variant SKU and its inventory record from the list.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={() => deleteVariant(v.id)}
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
                <div className="font-semibold">Variants Insights</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="text-sm font-medium">Inventory snapshot</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-muted-foreground text-xs">Active</div>
                      <div className="text-lg font-semibold">{counts.active}</div>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-muted-foreground text-xs">Out of stock</div>
                      <div className="text-lg font-semibold">{counts.out}</div>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-muted-foreground text-xs">Draft</div>
                      <div className="text-lg font-semibold">{counts.draft}</div>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-muted-foreground text-xs">Archived</div>
                      <div className="text-lg font-semibold">{counts.archived}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Helpful actions
                  </div>
                  <div className="mt-3 grid gap-2">
                    <Button variant="outline" className="justify-start gap-2" onClick={restockAllOut}>
                      <CheckCircle2 className="h-4 w-4" />
                      Restock all out-of-stock to 10
                    </Button>
                    <Button variant="outline" className="justify-start gap-2" onClick={exportJson}>
                      <Download className="h-4 w-4" />
                      Export variants JSON
                    </Button>
                    <Button className="justify-start gap-2" onClick={openCreate}>
                      <Plus className="h-4 w-4" />
                      Create new variant
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Tip: Keep SKUs unique per website/tenant and sync inventory updates with orders.
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
