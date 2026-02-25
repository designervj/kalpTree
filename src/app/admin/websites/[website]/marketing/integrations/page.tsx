"use client";

import * as React from "react";
import {
  Plug,
  Search,
  CheckCircle2,
  AlertCircle,
  Settings,
  ArrowRightLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type Integration = {
  id: string;
  name: string;
  desc: string;
  status: "connected" | "not_connected" | "error";
  enabled: boolean;
  lastSync?: string;
  category: "CRM" | "Commerce" | "Messaging" | "Analytics" | "Webhooks";
};

const seed: Integration[] = [
  {
    id: "int-701",
    name: "Webhook (Inbound/Outbound)",
    desc: "Send events to external endpoints and receive callbacks securely.",
    status: "connected",
    enabled: true,
    lastSync: "2026-02-04 19:20",
    category: "Webhooks",
  },
  {
    id: "int-702",
    name: "Shopify",
    desc: "Sync products, orders and customers for commerce workflows.",
    status: "not_connected",
    enabled: false,
    category: "Commerce",
  },
  {
    id: "int-703",
    name: "Meta Ads",
    desc: "Track conversions and audience lists for ads retargeting.",
    status: "error",
    enabled: false,
    lastSync: "2026-02-01 10:02",
    category: "Analytics",
  },
  {
    id: "int-704",
    name: "Twilio",
    desc: "SMS delivery provider for campaign and system messages.",
    status: "connected",
    enabled: true,
    lastSync: "2026-02-05 08:11",
    category: "Messaging",
  },
];

function chip(s: Integration["status"]) {
  if (s === "connected")
    return (
      <Badge className="bg-emerald-600">
        <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
      </Badge>
    );
  if (s === "error")
    return (
      <Badge variant="destructive">
        <AlertCircle className="mr-1 h-3 w-3" /> Needs Attention
      </Badge>
    );
  return <Badge variant="secondary">Not Connected</Badge>;
}

export default function IntegrationsPage() {
  const [items, setItems] = React.useState(seed);
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return items.filter((i) => {
      const matchesQ =
        !q.trim() ||
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.desc.toLowerCase().includes(q.toLowerCase());
      const matchesCat = cat === "all" ? true : i.category === cat;
      return matchesQ && matchesCat;
    });
  }, [items, q, cat]);

  return (
    <div className="min-h-screen p-6 pt-2">
      <div className="mx-auto w-full ">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* <div>
            <p className="text-sm text-muted-foreground">Marketing / Integrations</p>
            <h1 className="text-3xl font-semibold tracking-tight">Integrations</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect external services. Control sync, tokens, webhooks and delivery providers.
            </p>
          </div> */}
          
            <div>
            <BreadCrumbPage />
                   <p className="mt-1 text-sm text-muted-foreground">
              Connect external services. Control sync, tokens, webhooks and delivery providers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Sync Center
            </Button>
            <Button>Marketplace</Button>
          </div>
        </div>

        <Card className="mt-6 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search integrations..."
                    className="pl-8"
                  />
                </div>

                <select
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                >
                  <option value="all">All categories</option>
                  {["CRM", "Commerce", "Messaging", "Analytics", "Webhooks"].map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline">Audit Logs</Button>
                <Button variant="outline">API Keys</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((i) => (
            <Card key={i.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base truncate">{i.name}</CardTitle>
                      {chip(i.status)}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{i.category} • {i.id}</p>
                  </div>

                  <div className="rounded-xl border bg-background p-2 text-muted-foreground">
                    <Plug className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{i.desc}</p>

                <div className="mt-4 rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Enabled</p>
                      <p className="text-xs text-muted-foreground">
                        Allow this integration to run sync/jobs.
                      </p>
                    </div>
                    <Switch
                      checked={i.enabled}
                      onCheckedChange={(v) =>
                        setItems((p) => p.map((x) => (x.id === i.id ? { ...x, enabled: v } : x)))
                      }
                    />
                  </div>
                  <Separator className="my-3" />
                  <p className="text-xs text-muted-foreground">
                    Last sync: {i.lastSync ?? "—"}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" className="flex-1">
                    Connect
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                      <DialogHeader>
                        <DialogTitle>Configure: {i.name}</DialogTitle>
                        <DialogDescription>
                          Add credentials, webhooks and sync settings. (UI sample)
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border bg-muted/30 p-4 md:col-span-2">
                          <p className="text-sm font-medium">Connection</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Store secrets securely and test the connection before enabling.
                          </p>
                        </div>

                        <div className="grid gap-2">
                          <label className="text-sm font-medium">API Key</label>
                          <Input placeholder="••••••••••••••••" />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Secret</label>
                          <Input placeholder="••••••••••••••••" />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                          <label className="text-sm font-medium">Webhook URL</label>
                          <Input placeholder="https://..." />
                        </div>

                        <div className="rounded-xl border p-4 md:col-span-2">
                          <p className="text-sm font-medium">Sync Strategy</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Choose incremental, full sync, and schedule frequency.
                          </p>
                          <div className="mt-3 grid gap-2 md:grid-cols-3">
                            <Input placeholder="Mode: Incremental" />
                            <Input placeholder="Frequency: Daily" />
                            <Input placeholder="Retry: 3" />
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                        <Button>Save Settings</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
