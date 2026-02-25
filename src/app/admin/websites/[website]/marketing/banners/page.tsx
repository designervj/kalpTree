"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Eye,
  MousePointerClick,
  MoreVertical,
  Link2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type BannerStatus = "active" | "scheduled" | "paused" | "expired";

type Banner = {
  id: string;
  name: string;
  placement: "Homepage" | "Category" | "Checkout" | "Blog";
  status: BannerStatus;
  start: string;
  end: string;
  url: string;
  impressions: number;
  clicks: number;
  cta: string;
  enabled: boolean;
};

const seed: Banner[] = [
  {
    id: "ban-101",
    name: "Spring Offer Hero",
    placement: "Homepage",
    status: "active",
    start: "2026-02-01",
    end: "2026-02-28",
    url: "https://example.com/spring",
    impressions: 124560,
    clicks: 6421,
    cta: "Shop Now",
    enabled: true,
  },
  {
    id: "ban-102",
    name: "Category Tile — Roofing",
    placement: "Category",
    status: "scheduled",
    start: "2026-02-10",
    end: "2026-03-10",
    url: "https://example.com/roofing",
    impressions: 0,
    clicks: 0,
    cta: "Explore",
    enabled: true,
  },
  {
    id: "ban-103",
    name: "Checkout Trust Banner",
    placement: "Checkout",
    status: "paused",
    start: "2026-01-10",
    end: "2026-12-31",
    url: "https://example.com/trust",
    impressions: 34590,
    clicks: 310,
    cta: "Learn More",
    enabled: false,
  },
  {
    id: "ban-104",
    name: "Blog Sidebar — Integrations",
    placement: "Blog",
    status: "expired",
    start: "2025-12-01",
    end: "2026-01-01",
    url: "https://example.com/integrations",
    impressions: 9890,
    clicks: 214,
    cta: "See Details",
    enabled: false,
  },
];

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

function statusBadge(status: BannerStatus) {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-600">Active</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-600">Scheduled</Badge>;
    case "paused":
      return <Badge variant="secondary">Paused</Badge>;
    case "expired":
      return <Badge variant="outline">Expired</Badge>;
  }
}

function kpiCard(opts: {
  title: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{opts.title}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{opts.value}</p>
            {opts.sub ? (
              <p className="mt-1 text-xs text-muted-foreground">{opts.sub}</p>
            ) : null}
          </div>
          <div className="rounded-xl border bg-background p-2 text-muted-foreground">
            {opts.icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BannersPage() {
  const [items, setItems] = React.useState<Banner[]>(seed);
  const [tab, setTab] = React.useState<"all" | BannerStatus>("all");
  const [q, setQ] = React.useState("");
  const [placement, setPlacement] = React.useState<string>("all");
  const [onlyEnabled, setOnlyEnabled] = React.useState(false);

  const filtered = React.useMemo(() => {
    return items.filter((b) => {
      const matchesTab = tab === "all" ? true : b.status === tab;
      const matchesQ =
        !q.trim() ||
        b.name.toLowerCase().includes(q.toLowerCase()) ||
        b.id.toLowerCase().includes(q.toLowerCase());
      const matchesPlacement = placement === "all" ? true : b.placement === placement;
      const matchesEnabled = onlyEnabled ? b.enabled : true;
      return matchesTab && matchesQ && matchesPlacement && matchesEnabled;
    });
  }, [items, tab, q, placement, onlyEnabled]);

  const totals = React.useMemo(() => {
    const impressions = items.reduce((a, b) => a + b.impressions, 0);
    const clicks = items.reduce((a, b) => a + b.clicks, 0);
    const ctr = impressions ? (clicks / impressions) * 100 : 0;
    return { impressions, clicks, ctr };
  }, [items]);

  return (
    <div className="min-h-screen bg-transparent  p-6 pt-2">
      <div className="mx-auto w-full ">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* <div>
            <p className="text-sm text-muted-foreground">Marketing / Banners</p>
            <h1 className="text-3xl font-semibold tracking-tight">Banners</h1>
           
          </div> */}

          <div>
            <BreadCrumbPage />
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Manage placements, scheduling, tracking and click-through performance.
            </p>
          </div>




          <div className="flex items-center gap-2">
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              View Settings
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[760px]">
                <DialogHeader>
                  <DialogTitle>Create banner</DialogTitle>
                  <DialogDescription>
                    Add a new banner and schedule it for a placement.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input placeholder="e.g., Summer Sale Hero" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Placement</Label>
                    <Select defaultValue="Homepage">
                      <SelectTrigger>
                        <SelectValue placeholder="Select placement" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Homepage", "Category", "Checkout", "Blog"].map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Start date</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>End date</Label>
                    <Input type="date" />
                  </div>

                  <div className="md:col-span-2 grid gap-2">
                    <Label>Destination URL</Label>
                    <Input placeholder="https://..." />
                  </div>

                  <div className="grid gap-2">
                    <Label>CTA Label</Label>
                    <Input placeholder="Shop now" />
                  </div>

                  <div className="grid gap-2">
                    <Label>Enabled</Label>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <Switch defaultChecked />
                      <div>
                        <p className="text-sm font-medium">Turn on immediately</p>
                        <p className="text-xs text-muted-foreground">
                          You can pause later without deleting.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 rounded-xl border bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Banner media</p>
                        <p className="text-xs text-muted-foreground">
                          Upload image in your media manager (or integrate later). This is UI-only.
                        </p>
                      </div>
                      <Button variant="outline">Choose Media</Button>
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      // UI only example
                      const next: Banner = {
                        id: `ban-${Math.floor(Math.random() * 900 + 100)}`,
                        name: "New Banner (UI)",
                        placement: "Homepage",
                        status: "scheduled",
                        start: "2026-02-15",
                        end: "2026-03-01",
                        url: "https://example.com",
                        impressions: 0,
                        clicks: 0,
                        cta: "Explore",
                        enabled: true,
                      };
                      setItems((p) => [next, ...p]);
                    }}
                  >
                    Create Banner
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {kpiCard({
            title: "Total Impressions",
            value: fmt(totals.impressions),
            icon: <Eye className="h-4 w-4" />,
            sub: "Across all banners",
          })}
          {kpiCard({
            title: "Total Clicks",
            value: fmt(totals.clicks),
            icon: <MousePointerClick className="h-4 w-4" />,
            sub: "All time (sample)",
          })}
          {kpiCard({
            title: "Avg CTR",
            value: `${totals.ctr.toFixed(2)}%`,
            icon: <Link2 className="h-4 w-4" />,
            sub: "Clicks / impressions",
          })}
        </div>

        {/* Filters */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="pl-8"
                  />
                </div>

                <Select value={placement} onValueChange={setPlacement}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Placement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All placements</SelectItem>
                    {["Homepage", "Category", "Checkout", "Blog"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden md:flex items-center gap-2 rounded-lg border px-3 py-2">
                  <Switch checked={onlyEnabled} onCheckedChange={setOnlyEnabled} />
                  <span className="text-sm">Enabled only</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs + Grid */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mt-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
            <p className="text-sm text-muted-foreground">{filtered.length} items</p>
          </div>

          <TabsContent value={tab} className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((b) => {
                const ctr = b.impressions ? (b.clicks / b.impressions) * 100 : 0;
                return (
                  <Card key={b.id} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{b.name}</CardTitle>
                            {statusBadge(b.status)}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {b.id} • {b.placement}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((x) =>
                                    x.id === b.id ? { ...x, enabled: !x.enabled } : x
                                  )
                                )
                              }
                            >
                              {b.enabled ? "Disable" : "Enable"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setItems((p) => p.filter((x) => x.id !== b.id))}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid gap-3">
                        <div className="rounded-xl border bg-muted/30 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Schedule</p>
                            <p className="text-xs">
                              {b.start} → {b.end}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl border p-3">
                            <p className="text-xs text-muted-foreground">Impr.</p>
                            <p className="mt-1 font-semibold">{fmt(b.impressions)}</p>
                          </div>
                          <div className="rounded-xl border p-3">
                            <p className="text-xs text-muted-foreground">Clicks</p>
                            <p className="mt-1 font-semibold">{fmt(b.clicks)}</p>
                          </div>
                          <div className="rounded-xl border p-3">
                            <p className="text-xs text-muted-foreground">CTR</p>
                            <p className="mt-1 font-semibold">{ctr.toFixed(2)}%</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">Destination</p>
                            <p className="truncate text-sm">{b.url}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Preview
                            </Button>
                            <Button size="sm">{b.cta}</Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border p-3">
                          <div>
                            <p className="text-sm font-medium">Enabled</p>
                            <p className="text-xs text-muted-foreground">
                              Serve this banner on its placement
                            </p>
                          </div>
                          <Switch
                            checked={b.enabled}
                            onCheckedChange={(v) =>
                              setItems((prev) =>
                                prev.map((x) => (x.id === b.id ? { ...x, enabled: v } : x))
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
