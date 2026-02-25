"use client";

import * as React from "react";
import {
  Plus,
  Search,
  TicketPercent,
  Calendar,
  BadgePercent,
  MoreVertical,
  Copy,
  Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type CouponType = "percent" | "flat";
type CouponStatus = "active" | "scheduled" | "disabled" | "expired";

type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minCart: number;
  start: string;
  end: string;
  status: CouponStatus;
  usage: number;
  usageLimit: number;
  enabled: boolean;
};

const seed: Coupon[] = [
  {
    id: "cp-501",
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minCart: 1999,
    start: "2026-02-01",
    end: "2026-03-01",
    status: "active",
    usage: 231,
    usageLimit: 1000,
    enabled: true,
  },
  {
    id: "cp-502",
    code: "FLAT500",
    type: "flat",
    value: 500,
    minCart: 4999,
    start: "2026-02-10",
    end: "2026-02-20",
    status: "scheduled",
    usage: 0,
    usageLimit: 200,
    enabled: true,
  },
  {
    id: "cp-503",
    code: "OLD25",
    type: "percent",
    value: 25,
    minCart: 9999,
    start: "2025-12-01",
    end: "2026-01-01",
    status: "expired",
    usage: 89,
    usageLimit: 100,
    enabled: false,
  },
];

function chip(s: CouponStatus) {
  if (s === "active") return <Badge className="bg-emerald-600">Active</Badge>;
  if (s === "scheduled") return <Badge className="bg-blue-600">Scheduled</Badge>;
  if (s === "disabled") return <Badge variant="secondary">Disabled</Badge>;
  return <Badge variant="outline">Expired</Badge>;
}

export default function CouponsPage() {
  const [items, setItems] = React.useState<Coupon[]>(seed);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return items.filter((c) => {
      const matchesQ =
        !q.trim() ||
        c.code.toLowerCase().includes(q.toLowerCase()) ||
        c.id.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "all" ? true : c.status === status;
      return matchesQ && matchesStatus;
    });
  }, [items, q, status]);

  return (
    <div className="min-h-screen p-6 pt-2">
      <div className="mx-auto w-full ">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* <div>
            <p className="text-sm text-muted-foreground">Marketing / Coupons</p>
            <h1 className="text-3xl font-semibold tracking-tight">Coupons</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create promo codes, enforce limits, schedule validity and control usage.
            </p>
          </div> */}

           <div>
            <BreadCrumbPage />
                 <p className="mt-1 text-sm text-muted-foreground">
              Create promo codes, enforce limits, schedule validity and control usage.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[760px]">
              <DialogHeader>
                <DialogTitle>Create coupon</DialogTitle>
                <DialogDescription>Define discount type, validity and usage limits.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Code</Label>
                  <Input placeholder="e.g., FESTIVE20" />
                </div>

                <div className="grid gap-2">
                  <Label>Discount Type</Label>
                  <Select defaultValue="percent">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage</SelectItem>
                      <SelectItem value="flat">Flat amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Value</Label>
                  <Input type="number" placeholder="e.g., 10 (or 500)" />
                </div>

                <div className="grid gap-2">
                  <Label>Minimum cart value (₹)</Label>
                  <Input type="number" placeholder="e.g., 1999" />
                </div>

                <div className="grid gap-2">
                  <Label>Start</Label>
                  <Input type="date" />
                </div>

                <div className="grid gap-2">
                  <Label>End</Label>
                  <Input type="date" />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label>Usage limit</Label>
                  <Input type="number" placeholder="e.g., 1000" />
                </div>

                <div className="md:col-span-2 flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-medium">Enable coupon</p>
                    <p className="text-xs text-muted-foreground">
                      Disabled coupons cannot be used at checkout.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    const next: Coupon = {
                      id: `cp-${Math.floor(Math.random() * 900 + 100)}`,
                      code: "NEWCODE",
                      type: "percent",
                      value: 10,
                      minCart: 1999,
                      start: "2026-02-10",
                      end: "2026-03-10",
                      status: "scheduled",
                      usage: 0,
                      usageLimit: 500,
                      enabled: true,
                    };
                    setItems((p) => [next, ...p]);
                  }}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                    placeholder="Search by code..."
                    className="pl-8"
                  />
                </div>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {["active", "scheduled", "disabled", "expired"].map((x) => (
                      <SelectItem key={x} value={x}>
                        {x.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline">Import</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="mt-6 grid gap-4">
          {filtered.map((c) => {
            const usagePct = c.usageLimit ? (c.usage / c.usageLimit) * 100 : 0;
            return (
              <Card key={c.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{c.code}</CardTitle>
                        {chip(c.status)}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{c.id}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard?.writeText(c.code)}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy code
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
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
                          <Ban className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TicketPercent className="h-4 w-4" />
                        <p className="text-xs">Discount</p>
                      </div>
                      <p className="mt-1 text-sm font-semibold">
                        {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Min cart ₹{c.minCart.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="rounded-xl border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <p className="text-xs">Validity</p>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        {c.start} → {c.end}
                      </p>
                    </div>

                    <div className="rounded-xl border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BadgePercent className="h-4 w-4" />
                        <p className="text-xs">Usage</p>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        {c.usage} / {c.usageLimit}
                      </p>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-foreground"
                          style={{ width: `${Math.max(0, Math.min(100, usagePct))}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Enabled</p>
                        <Switch
                          checked={c.enabled}
                          onCheckedChange={(v) =>
                            setItems((p) =>
                              p.map((x) => (x.id === c.id ? { ...x, enabled: v } : x))
                            )
                          }
                        />
                      </div>
                      <Separator className="my-2" />
                      <p className="text-xs text-muted-foreground">
                        Disabled coupons are not valid at checkout.
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
                <p className="text-sm font-medium">No coupons found</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create a coupon code for promotions.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
