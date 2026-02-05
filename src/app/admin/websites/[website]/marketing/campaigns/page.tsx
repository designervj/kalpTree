"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Filter,
  Megaphone,
  Calendar,
  Wallet,
  BarChart3,
  MoreVertical,
  Play,
  Pause,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type CampaignStatus = "draft" | "running" | "paused" | "completed";

type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  channel: "Email" | "SMS" | "Push" | "Ads";
  audience: "All Users" | "Leads" | "Customers" | "VIP";
  start: string;
  end: string;
  budget: number;
  spent: number;
  enabled: boolean;
  impressions: number;
  clicks: number;
};

const data: Campaign[] = [
  {
    id: "cmp-201",
    name: "New Year Retargeting",
    status: "running",
    channel: "Ads",
    audience: "Customers",
    start: "2026-02-01",
    end: "2026-02-20",
    budget: 120000,
    spent: 44250,
    enabled: true,
    impressions: 420000,
    clicks: 12890,
  },
  {
    id: "cmp-202",
    name: "VIP Early Access",
    status: "draft",
    channel: "Email",
    audience: "VIP",
    start: "2026-02-10",
    end: "2026-02-14",
    budget: 0,
    spent: 0,
    enabled: false,
    impressions: 0,
    clicks: 0,
  },
  {
    id: "cmp-203",
    name: "Lead Nurture Week 1",
    status: "paused",
    channel: "SMS",
    audience: "Leads",
    start: "2026-01-15",
    end: "2026-03-01",
    budget: 15000,
    spent: 9200,
    enabled: true,
    impressions: 78000,
    clicks: 2300,
  },
  {
    id: "cmp-204",
    name: "Product Launch Blast",
    status: "completed",
    channel: "Push",
    audience: "All Users",
    start: "2026-01-01",
    end: "2026-01-07",
    budget: 0,
    spent: 0,
    enabled: false,
    impressions: 310000,
    clicks: 8800,
  },
];

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

function statusChip(s: CampaignStatus) {
  if (s === "running") return <Badge className="bg-emerald-600">Running</Badge>;
  if (s === "draft") return <Badge variant="secondary">Draft</Badge>;
  if (s === "paused") return <Badge className="bg-amber-600">Paused</Badge>;
  return <Badge variant="outline">Completed</Badge>;
}

function progress(pct: number) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div className="h-2 rounded-full bg-foreground" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function CampaignsPage() {
  const [items, setItems] = React.useState<Campaign[]>(data);
  const [tab, setTab] = React.useState<"all" | CampaignStatus>("all");
  const [q, setQ] = React.useState("");
  const [channel, setChannel] = React.useState<string>("all");
  const [aud, setAud] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return items.filter((c) => {
      const matchesTab = tab === "all" ? true : c.status === tab;
      const matchesQ =
        !q.trim() ||
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.id.toLowerCase().includes(q.toLowerCase());
      const matchesChannel = channel === "all" ? true : c.channel === channel;
      const matchesAud = aud === "all" ? true : c.audience === aud;
      return matchesTab && matchesQ && matchesChannel && matchesAud;
    });
  }, [items, tab, q, channel, aud]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Marketing / Campaigns</p>
            <h1 className="text-3xl font-semibold tracking-tight">Campaigns</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Build cross-channel campaigns, set audience targeting and track performance.
            </p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Create campaign</SheetTitle>
                <SheetDescription>
                  Configure schedule, channel, audience and budget. (UI-only sample)
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 grid gap-4">
                <div className="grid gap-2">
                  <Label>Campaign name</Label>
                  <Input placeholder="e.g., Festival Sale Ads" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Channel</Label>
                    <Select defaultValue="Ads">
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Email", "SMS", "Push", "Ads"].map((x) => (
                          <SelectItem key={x} value={x}>
                            {x}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Audience</Label>
                    <Select defaultValue="Customers">
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {["All Users", "Leads", "Customers", "VIP"].map((x) => (
                          <SelectItem key={x} value={x}>
                            {x}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Start</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>End</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Budget (₹)</Label>
                  <Input type="number" placeholder="e.g., 50000" />
                </div>

                <div className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-medium">Enable after create</p>
                    <p className="text-xs text-muted-foreground">
                      You can start/stop anytime.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <SheetFooter className="mt-6 gap-2">
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    const next: Campaign = {
                      id: `cmp-${Math.floor(Math.random() * 900 + 100)}`,
                      name: "New Campaign (UI)",
                      status: "draft",
                      channel: "Email",
                      audience: "Customers",
                      start: "2026-02-15",
                      end: "2026-02-28",
                      budget: 25000,
                      spent: 0,
                      enabled: false,
                      impressions: 0,
                      clicks: 0,
                    };
                    setItems((p) => [next, ...p]);
                  }}
                >
                  Create
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Filters */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search campaigns..."
                    className="pl-8"
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All channels</SelectItem>
                      {["Email", "SMS", "Push", "Ads"].map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={aud} onValueChange={setAud}>
                    <SelectTrigger className="w-[170px]">
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All audiences</SelectItem>
                      {["All Users", "Leads", "Customers", "VIP"].map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="hidden md:inline-flex">
                    <Filter className="mr-2 h-4 w-4" />
                    Advanced
                  </Button>
                </div>
              </div>

              <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="running">Running</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="paused">Paused</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="mt-6 grid gap-4">
          {filtered.map((c) => {
            const ctr = c.impressions ? (c.clicks / c.impressions) * 100 : 0;
            const spendPct = c.budget ? (c.spent / c.budget) * 100 : 0;

            return (
              <Card key={c.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base truncate">{c.name}</CardTitle>
                        {statusChip(c.status)}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.id} • {c.channel} • {c.audience}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setItems((prev) =>
                            prev.map((x) =>
                              x.id === c.id
                                ? { ...x, status: x.status === "running" ? "paused" : "running" }
                                : x
                            )
                          )
                        }
                      >
                        {c.status === "running" ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" /> Start
                          </>
                        )}
                      </Button>

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
                              setItems((p) =>
                                p.map((x) =>
                                  x.id === c.id ? { ...x, enabled: !x.enabled } : x
                                )
                              )
                            }
                          >
                            {c.enabled ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setItems((p) => p.filter((x) => x.id !== c.id))}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <p className="text-xs">Schedule</p>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        {c.start} → {c.end}
                      </p>
                    </div>

                    <div className="rounded-xl border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Wallet className="h-4 w-4" />
                        <p className="text-xs">Spend</p>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        ₹{fmt(c.spent)} / ₹{fmt(c.budget)}
                      </p>
                      <div className="mt-2">{progress(spendPct)}</div>
                    </div>

                    <div className="rounded-xl border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BarChart3 className="h-4 w-4" />
                        <p className="text-xs">Performance</p>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        {fmt(c.impressions)} impr • {fmt(c.clicks)} clicks
                      </p>
                      <p className="text-xs text-muted-foreground">CTR {ctr.toFixed(2)}%</p>
                    </div>

                    <div className="rounded-xl border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Megaphone className="h-4 w-4" />
                          <p className="text-xs">Enabled</p>
                        </div>
                        <Switch
                          checked={c.enabled}
                          onCheckedChange={(v) =>
                            setItems((prev) =>
                              prev.map((x) => (x.id === c.id ? { ...x, enabled: v } : x))
                            )
                          }
                        />
                      </div>
                      <Separator className="my-2" />
                      <p className="text-xs text-muted-foreground">
                        If disabled, campaign won’t deliver messages/ads.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {!filtered.length ? (
            <Card className="shadow-sm">
              <CardContent className="p-10 text-center">
                <p className="text-sm font-medium">No campaigns found</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try changing filters or create a new campaign.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
