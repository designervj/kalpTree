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
  Tag,
  Package,
  Layers,
  Percent,
  DollarSign,
  Calendar,
  Users,
  ArrowRight,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type RuleStatus = "active" | "draft" | "paused";
type RuleScope = "all" | "product" | "category" | "brand" | "tag" | "customer_group";
type AdjustmentType = "percent" | "fixed";

type PricingRule = {
  id: string;
  name: string;
  status: RuleStatus;
  priority: number; // higher wins
  scope: RuleScope;
  targetsLabel: string; // "All products" / "3 categories" etc.
  adjustmentType: AdjustmentType;
  adjustmentValue: number; // percent or amount
  minQty?: number;
  customerGroup?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  updatedAt: string; // ISO
};

const RULES_SEED: PricingRule[] = [
  {
    id: "r_1",
    name: "Holiday Sale 15% Off",
    status: "active",
    priority: 80,
    scope: "all",
    targetsLabel: "All products",
    adjustmentType: "percent",
    adjustmentValue: 15,
    startDate: "2026-12-01",
    endDate: "2026-12-31",
    updatedAt: "2026-01-01T10:20:00.000Z",
  },
  {
    id: "r_2",
    name: "Bulk Discount (10+ qty)",
    status: "active",
    priority: 60,
    scope: "product",
    targetsLabel: "5 products",
    adjustmentType: "percent",
    adjustmentValue: 10,
    minQty: 10,
    updatedAt: "2026-01-02T08:10:00.000Z",
  },
  {
    id: "r_3",
    name: "VIP Customers - ₹200 Off",
    status: "paused",
    priority: 70,
    scope: "customer_group",
    targetsLabel: "VIP group",
    adjustmentType: "fixed",
    adjustmentValue: 200,
    customerGroup: "VIP",
    updatedAt: "2026-01-03T12:05:00.000Z",
  },
  {
    id: "r_4",
    name: "Category Promo (Exterior Paint)",
    status: "draft",
    priority: 40,
    scope: "category",
    targetsLabel: "2 categories",
    adjustmentType: "percent",
    adjustmentValue: 8,
    updatedAt: "2026-01-04T14:40:00.000Z",
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function scopeMeta(scope: RuleScope) {
  switch (scope) {
    case "all":
      return { label: "All", icon: Layers };
    case "product":
      return { label: "Product", icon: Package };
    case "category":
      return { label: "Category", icon: Layers };
    case "brand":
      return { label: "Brand", icon: Tag };
    case "tag":
      return { label: "Tag", icon: Tag };
    case "customer_group":
      return { label: "Customer group", icon: Users };
    default:
      return { label: scope, icon: Layers };
  }
}

function statusBadge(status: RuleStatus) {
  if (status === "active") return <Badge>Active</Badge>;
  if (status === "paused") return <Badge variant="secondary">Paused</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

function currencyLabel(value: number) {
  // Adjust to your currency if needed
  return `₹${value}`;
}

function ruleSummary(r: Partial<PricingRule>) {
  const adj =
    r.adjustmentType === "percent"
      ? `${r.adjustmentValue ?? 0}% off`
      : `${currencyLabel(r.adjustmentValue ?? 0)} off`;

  const parts: string[] = [];
  if (r.scope) parts.push(`Scope: ${scopeMeta(r.scope).label}`);
  if (r.targetsLabel) parts.push(`Targets: ${r.targetsLabel}`);
  parts.push(`Adjustment: ${adj}`);
  if (r.minQty) parts.push(`Min qty: ${r.minQty}`);
  if (r.customerGroup) parts.push(`Group: ${r.customerGroup}`);
  if (r.startDate || r.endDate) parts.push(`Date: ${r.startDate ?? "—"} → ${r.endDate ?? "—"}`);
  if (typeof r.priority === "number") parts.push(`Priority: ${r.priority}`);
  return parts.join(" • ");
}

type RuleFormState = {
  id?: string;
  name: string;
  status: RuleStatus;
  priority: number;
  scope: RuleScope;
  targetsLabel: string;
  adjustmentType: AdjustmentType;
  adjustmentValue: number;
  minQty?: number;
  customerGroup?: string;
  startDate?: string;
  endDate?: string;
  enabled: boolean;
};

const EMPTY_FORM: RuleFormState = {
  name: "",
  status: "draft",
  priority: 50,
  scope: "all",
  targetsLabel: "All products",
  adjustmentType: "percent",
  adjustmentValue: 10,
  minQty: undefined,
  customerGroup: "",
  startDate: "",
  endDate: "",
  enabled: false,
};

export default function PricingRulesPage() {
  const [rules, setRules] = React.useState<PricingRule[]>(RULES_SEED);

  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<RuleStatus | "all">("all");
  const [scopeFilter, setScopeFilter] = React.useState<RuleScope | "all">("all");
  const [enabledOnly, setEnabledOnly] = React.useState(false);

  // dialog
  const [openEditor, setOpenEditor] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"basics" | "conditions" | "preview">("basics");
  const [form, setForm] = React.useState<RuleFormState>(EMPTY_FORM);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return rules.filter((r) => {
      const matchesQuery =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.targetsLabel.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" ? true : r.status === statusFilter;
      const matchesScope = scopeFilter === "all" ? true : r.scope === scopeFilter;

      const matchesEnabled = enabledOnly ? r.status === "active" : true;

      return matchesQuery && matchesStatus && matchesScope && matchesEnabled;
    });
  }, [rules, q, statusFilter, scopeFilter, enabledOnly]);

  const counts = React.useMemo(() => {
    const total = rules.length;
    const active = rules.filter((r) => r.status === "active").length;
    const paused = rules.filter((r) => r.status === "paused").length;
    const draft = rules.filter((r) => r.status === "draft").length;
    return { total, active, paused, draft };
  }, [rules]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setActiveTab("basics");
    setOpenEditor(true);
  };

  const openEdit = (r: PricingRule) => {
    setForm({
      id: r.id,
      name: r.name,
      status: r.status,
      priority: r.priority,
      scope: r.scope,
      targetsLabel: r.targetsLabel,
      adjustmentType: r.adjustmentType,
      adjustmentValue: r.adjustmentValue,
      minQty: r.minQty,
      customerGroup: r.customerGroup ?? "",
      startDate: r.startDate ?? "",
      endDate: r.endDate ?? "",
      enabled: r.status === "active",
    });
    setActiveTab("basics");
    setOpenEditor(true);
  };

  const saveRule = () => {
    const nowIso = new Date().toISOString();

    const next: PricingRule = {
      id: form.id ?? `r_${Math.random().toString(16).slice(2)}`,
      name: form.name || "Untitled rule",
      status: form.enabled ? "active" : form.status,
      priority: Number.isFinite(form.priority) ? Number(form.priority) : 50,
      scope: form.scope,
      targetsLabel: form.targetsLabel || "All products",
      adjustmentType: form.adjustmentType,
      adjustmentValue: Number.isFinite(form.adjustmentValue) ? Number(form.adjustmentValue) : 0,
      minQty: form.minQty ? Number(form.minQty) : undefined,
      customerGroup: form.customerGroup?.trim() ? form.customerGroup.trim() : undefined,
      startDate: form.startDate?.trim() ? form.startDate.trim() : undefined,
      endDate: form.endDate?.trim() ? form.endDate.trim() : undefined,
      updatedAt: nowIso,
    };

    setRules((prev) => {
      const exists = prev.some((x) => x.id === next.id);
      if (exists) return prev.map((x) => (x.id === next.id ? next : x));
      return [next, ...prev];
    });

    setOpenEditor(false);
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const exportJson = () => {
    const data = JSON.stringify(rules, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pricing-rules.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-muted/20">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
        {/* Breadcrumb + title row */}
        <div className="flex flex-col gap-4">
         
 
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
               <BreadCrumbPage />
                <Badge variant="secondary">{counts.total} total</Badge>
                <Badge>Active {counts.active}</Badge>
                <Badge variant="secondary">Paused {counts.paused}</Badge>
                <Badge variant="outline">Draft {counts.draft}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Create discounts, bulk pricing, customer group pricing, and time-based promotions.
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
                    New rule
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[780px]">
                  <DialogHeader>
                    <DialogTitle>{form.id ? "Edit pricing rule" : "Create pricing rule"}</DialogTitle>
                    <DialogDescription>
                      Define scope, conditions, and adjustment. Higher priority rules override lower ones.
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basics">Basics</TabsTrigger>
                      <TabsTrigger value="conditions">Conditions</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basics" className="mt-4">
                      <div className="grid gap-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Rule name</div>
                            <Input
                              value={form.name}
                              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                              placeholder="e.g., Holiday Sale 15% Off"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Priority</div>
                            <Input
                              type="number"
                              value={String(form.priority)}
                              onChange={(e) => setForm((p) => ({ ...p, priority: Number(e.target.value) }))}
                              placeholder="50"
                            />
                            <div className="text-xs text-muted-foreground">
                              Higher number wins if multiple rules match.
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Scope</div>
                            <Select
                              value={form.scope}
                              onValueChange={(v) => setForm((p) => ({ ...p, scope: v as RuleScope }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select scope" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All products</SelectItem>
                                <SelectItem value="product">Specific products</SelectItem>
                                <SelectItem value="category">Categories</SelectItem>
                                <SelectItem value="brand">Brands</SelectItem>
                                <SelectItem value="tag">Tags</SelectItem>
                                <SelectItem value="customer_group">Customer group</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Targets label</div>
                            <Input
                              value={form.targetsLabel}
                              onChange={(e) => setForm((p) => ({ ...p, targetsLabel: e.target.value }))}
                              placeholder="e.g., 5 products / 2 categories / VIP group"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Adjustment type</div>
                            <Select
                              value={form.adjustmentType}
                              onValueChange={(v) => setForm((p) => ({ ...p, adjustmentType: v as AdjustmentType }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percent">Percent off</SelectItem>
                                <SelectItem value="fixed">Fixed amount off</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              {form.adjustmentType === "percent" ? "Percent" : "Amount"}
                            </div>
                            <Input
                              type="number"
                              value={String(form.adjustmentValue)}
                              onChange={(e) =>
                                setForm((p) => ({ ...p, adjustmentValue: Number(e.target.value) }))
                              }
                              placeholder={form.adjustmentType === "percent" ? "10" : "200"}
                            />
                          </div>

                          <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <div className="text-sm font-medium">Enable rule</div>
                              <div className="text-xs text-muted-foreground">
                                Active rules affect pricing immediately.
                              </div>
                            </div>
                            <Switch
                              checked={form.enabled}
                              onCheckedChange={(v) => setForm((p) => ({ ...p, enabled: v }))}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="conditions" className="mt-4">
                      <div className="grid gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 font-semibold">
                              <Package className="h-4 w-4" />
                              Quantity condition
                            </div>
                          </CardHeader>
                          <CardContent className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Minimum quantity</div>
                              <Input
                                type="number"
                                value={form.minQty ? String(form.minQty) : ""}
                                onChange={(e) =>
                                  setForm((p) => ({
                                    ...p,
                                    minQty: e.target.value ? Number(e.target.value) : undefined,
                                  }))
                                }
                                placeholder="e.g., 10"
                              />
                              <div className="text-xs text-muted-foreground">
                                Leave empty to apply for any quantity.
                              </div>
                            </div>

                            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                              Tip: Use qty condition for bulk pricing and wholesale-like discounts.
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 font-semibold">
                              <Users className="h-4 w-4" />
                              Customer group
                            </div>
                          </CardHeader>
                          <CardContent className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Group (optional)</div>
                              <Input
                                value={form.customerGroup ?? ""}
                                onChange={(e) => setForm((p) => ({ ...p, customerGroup: e.target.value }))}
                                placeholder="e.g., VIP / Wholesale / Franchise"
                              />
                            </div>
                            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                              Only applies to customers belonging to this group.
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 font-semibold">
                              <Calendar className="h-4 w-4" />
                              Date range
                            </div>
                          </CardHeader>
                          <CardContent className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Start date</div>
                              <Input
                                type="date"
                                value={form.startDate ?? ""}
                                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">End date</div>
                              <Input
                                type="date"
                                value={form.endDate ?? ""}
                                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                              />
                            </div>

                            <div className="md:col-span-2 rounded-lg border p-3 text-sm text-muted-foreground">
                              Leave dates empty if the rule should apply indefinitely.
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-4">
                      <div className="grid gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="font-semibold">Rule preview</div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {statusBadge(form.enabled ? "active" : form.status)}
                              <Badge variant="outline" className="gap-1">
                                {(() => {
                                  const Icon = scopeMeta(form.scope).icon;
                                  return <Icon className="h-3.5 w-3.5" />;
                                })()}
                                {scopeMeta(form.scope).label}
                              </Badge>
                              <Badge variant="secondary">Priority {form.priority}</Badge>
                            </div>

                            <div className="text-sm">
                              <div className="font-medium">{form.name || "Untitled rule"}</div>
                              <div className="text-muted-foreground mt-1">{ruleSummary(form)}</div>
                            </div>

                            <Separator />

                            <div className="rounded-xl border bg-muted/30 p-4">
                              <div className="text-sm font-medium mb-2">How it affects price</div>
                              <div className="text-sm text-muted-foreground">
                                {form.adjustmentType === "percent" ? (
                                  <span className="inline-flex items-center gap-2">
                                    <Percent className="h-4 w-4" />
                                    Applies <b className="text-foreground">{form.adjustmentValue}%</b> discount
                                    to matching items.
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Subtracts <b className="text-foreground">{currencyLabel(form.adjustmentValue)}</b>{" "}
                                    from matching items.
                                  </span>
                                )}
                              </div>

                              {(form.minQty || form.customerGroup || form.startDate || form.endDate) && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  Conditions:{" "}
                                  {[
                                    form.minQty ? `min qty ${form.minQty}` : null,
                                    form.customerGroup?.trim() ? `group ${form.customerGroup.trim()}` : null,
                                    form.startDate || form.endDate
                                      ? `${form.startDate || "—"} → ${form.endDate || "—"}`
                                      : null,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" onClick={() => setActiveTab("conditions")}>
                            Back
                          </Button>
                          <Button onClick={saveRule} className="gap-2">
                            Save rule <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Footer actions always visible */}
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button variant="outline" onClick={() => setOpenEditor(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveRule}>Save</Button>
                    </div>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Filters + Table */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {/* Filter bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full md:w-[320px]">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search rules… (name, targets)"
                        className="pl-9"
                      />
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                      <Filter className="h-4 w-4" />
                      Filters
                    </div>

                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={scopeFilter} onValueChange={(v) => setScopeFilter(v as any)}>
                      <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All scopes</SelectItem>
                        <SelectItem value="all">All products</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="brand">Brand</SelectItem>
                        <SelectItem value="tag">Tag</SelectItem>
                        <SelectItem value="customer_group">Customer group</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                      <Switch checked={enabledOnly} onCheckedChange={setEnabledOnly} />
                      <span className="text-sm">Enabled only</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
                    <span className="font-medium text-foreground">{rules.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold">Rules</div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Add rule
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filtered.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/40">
                      <Percent className="h-5 w-5" />
                    </div>
                    <div className="text-lg font-semibold">No pricing rules found</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Try clearing filters, or create your first rule.
                    </div>
                    <div className="mt-4">
                      <Button className="gap-2" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Create rule
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rule</TableHead>
                          <TableHead>Scope</TableHead>
                          <TableHead>Adjustment</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filtered.map((r) => {
                          const meta = scopeMeta(r.scope);
                          const Icon = meta.icon;

                          return (
                            <TableRow key={r.id} className="hover:bg-muted/30">
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">{r.name}</div>
                                  <div className="text-xs text-muted-foreground">{r.targetsLabel}</div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="inline-flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/40">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="text-sm">{meta.label}</div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="inline-flex items-center gap-2">
                                  {r.adjustmentType === "percent" ? (
                                    <>
                                      <Percent className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{r.adjustmentValue}%</span>
                                    </>
                                  ) : (
                                    <>
                                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{currencyLabel(r.adjustmentValue)}</span>
                                    </>
                                  )}
                                  {r.minQty ? (
                                    <Badge variant="outline" className="ml-2">
                                      Min qty {r.minQty}
                                    </Badge>
                                  ) : null}
                                </div>
                              </TableCell>

                              <TableCell>
                                <Badge variant="secondary">{r.priority}</Badge>
                              </TableCell>

                              <TableCell>{statusBadge(r.status)}</TableCell>

                              <TableCell className="text-muted-foreground">
                                {formatDate(r.updatedAt)}
                              </TableCell>

                              <TableCell className="text-right">
                                <div className="inline-flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => openEdit(r)} className="gap-2">
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
                                      <DropdownMenuItem onClick={() => openEdit(r)}>
                                        Edit rule
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setRules((prev) =>
                                            prev.map((x) =>
                                              x.id === r.id
                                                ? {
                                                    ...x,
                                                    status: x.status === "active" ? "paused" : "active",
                                                    updatedAt: new Date().toISOString(),
                                                  }
                                                : x
                                            )
                                          )
                                        }
                                      >
                                        {r.status === "active" ? "Pause" : "Activate"}
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
                                            <AlertDialogTitle>Delete this rule?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This will permanently remove the pricing rule and it will no longer affect prices.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                              onClick={() => deleteRule(r.id)}
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
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right panel: Quick tips + summary */}
          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader className="pb-2">
                <div className="font-semibold">Quick Summary</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="text-sm font-medium">Rules breakdown</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-muted-foreground text-xs">Active</div>
                      <div className="text-lg font-semibold">{counts.active}</div>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-muted-foreground text-xs">Paused</div>
                      <div className="text-lg font-semibold">{counts.paused}</div>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-muted-foreground text-xs">Draft</div>
                      <div className="text-lg font-semibold">{counts.draft}</div>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-muted-foreground text-xs">Total</div>
                      <div className="text-lg font-semibold">{counts.total}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Best practices
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>• Keep “Global sale” rules high priority.</li>
                    <li>• Use “Min qty” rules for bulk discounts.</li>
                    <li>• Use customer groups for VIP/wholesale pricing.</li>
                    <li>• Use date range for seasonal promos.</li>
                  </ul>
                </div>

                <Button className="w-full gap-2" onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  Create new rule
                </Button>

                <Button variant="outline" className="w-full gap-2" onClick={exportJson}>
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>

                <div className="text-xs text-muted-foreground">
                  Tip: If multiple rules match, the highest priority wins.
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
