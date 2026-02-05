"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Bolt,
  Filter,
  MoreVertical,
  Play,
  Pause,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

type Rule = {
  id: string;
  name: string;
  enabled: boolean;
  trigger: string;
  conditions: string[];
  actions: string[];
  status: "running" | "paused";
  updatedAt: string;
};

const seed: Rule[] = [
  {
    id: "rule-801",
    name: "Abandoned cart → Email + Coupon",
    enabled: true,
    trigger: "Cart abandoned for 2 hours",
    conditions: ["Cart value > ₹2,000", "User has email verified"],
    actions: ["Send email template: Abandoned Cart", "Apply coupon: WELCOME10"],
    status: "running",
    updatedAt: "2026-02-03",
  },
  {
    id: "rule-802",
    name: "Quote accepted → Create invoice",
    enabled: true,
    trigger: "Quotation status becomes Accepted",
    conditions: ["Amount > ₹0"],
    actions: ["Generate invoice", "Notify finance channel (webhook)"],
    status: "running",
    updatedAt: "2026-02-01",
  },
  {
    id: "rule-803",
    name: "Low stock → Pause campaign",
    enabled: false,
    trigger: "Stock drops below threshold",
    conditions: ["SKU in campaign collection"],
    actions: ["Pause campaign: New Year Retargeting", "Send admin alert"],
    status: "paused",
    updatedAt: "2026-01-28",
  },
];

export default function AutomationRulesPage() {
  const [items, setItems] = React.useState<Rule[]>(seed);
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    return items.filter((r) => {
      const s = q.toLowerCase();
      return (
        !q.trim() ||
        r.name.toLowerCase().includes(s) ||
        r.trigger.toLowerCase().includes(s) ||
        r.id.toLowerCase().includes(s)
      );
    });
  }, [items, q]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Marketing / Automation Rules</p>
            <h1 className="text-3xl font-semibold tracking-tight">Automation Rules</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Build “if this then that” rules for marketing flows, quotes, coupons and integrations.
            </p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Rule
              </Button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Create automation rule</SheetTitle>
                <SheetDescription>
                  Define trigger → conditions → actions. (UI-only sample)
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 grid gap-4">
                <div className="grid gap-2">
                  <Label>Rule name</Label>
                  <Input placeholder="e.g., New lead → Send welcome email" />
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm font-medium">Trigger</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose when rule starts.
                  </p>
                  <Input className="mt-3" placeholder="e.g., User signs up / Cart abandoned / Quote accepted" />
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm font-medium">Conditions</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Optional checks before actions run.
                  </p>
                  <Textarea className="mt-3" rows={4} placeholder="- Cart value > 2000\n- User email verified\n- Country = IN" />
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm font-medium">Actions</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    What happens when rule passes.
                  </p>
                  <Textarea className="mt-3" rows={4} placeholder="- Send email template: Welcome\n- Apply coupon: WELCOME10\n- Call webhook: /events" />
                </div>

                <div className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-medium">Enable after create</p>
                    <p className="text-xs text-muted-foreground">
                      Enabled rules can run automatically.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <SheetFooter className="mt-6 gap-2">
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    const next: Rule = {
                      id: `rule-${Math.floor(Math.random() * 900 + 100)}`,
                      name: "New Rule (UI)",
                      enabled: true,
                      trigger: "Custom trigger",
                      conditions: ["Condition A", "Condition B"],
                      actions: ["Action 1", "Action 2"],
                      status: "running",
                      updatedAt: "2026-02-05",
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
              <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search rules..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" className="hidden md:inline-flex">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline">Run History</Button>
                <Button variant="outline">Logs</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <div className="mt-6 grid gap-4">
          {filtered.map((r) => (
            <Card key={r.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base truncate">{r.name}</CardTitle>
                      <Badge className={r.status === "running" ? "bg-emerald-600" : "bg-amber-600"}>
                        {r.status === "running" ? (
                          <>
                            <Play className="mr-1 h-3 w-3" /> Running
                          </>
                        ) : (
                          <>
                            <Pause className="mr-1 h-3 w-3" /> Paused
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {r.id} • Updated {r.updatedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setItems((p) =>
                          p.map((x) =>
                            x.id === r.id
                              ? { ...x, status: x.status === "running" ? "paused" : "running" }
                              : x
                          )
                        )
                      }
                    >
                      {r.status === "running" ? (
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
                              p.map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x))
                            )
                          }
                        >
                          {r.enabled ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setItems((p) => p.filter((x) => x.id !== r.id))}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Bolt className="h-4 w-4" />
                      <p className="text-xs">Trigger</p>
                    </div>
                    <p className="mt-2 text-sm font-medium">{r.trigger}</p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">Conditions</p>
                    <Separator className="my-2" />
                    <div className="grid gap-1">
                      {r.conditions.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">Actions</p>
                    <Separator className="my-2" />
                    <div className="grid gap-1">
                      {r.actions.map((a, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-medium">Enabled</p>
                    <p className="text-xs text-muted-foreground">
                      Toggle to allow rule execution.
                    </p>
                  </div>
                  <Switch
                    checked={r.enabled}
                    onCheckedChange={(v) =>
                      setItems((p) => p.map((x) => (x.id === r.id ? { ...x, enabled: v } : x)))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {!filtered.length ? (
            <Card className="shadow-sm">
              <CardContent className="p-10 text-center">
                <p className="text-sm font-medium">No rules found</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create a new automation rule to start workflows.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
