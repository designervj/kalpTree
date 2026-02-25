"use client";

import * as React from "react";
import {
  Plus,
  Search,
  FileSignature,
  CalendarClock,
  IndianRupee,
  User,
  MoreVertical,
  Send,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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

type QuoteStatus = "draft" | "sent" | "accepted" | "expired" | "rejected";

type Quote = {
  id: string;
  quoteNo: string;
  customer: string;
  email: string;
  createdAt: string;
  validTill: string;
  amount: number;
  status: QuoteStatus;
};

const seed: Quote[] = [
  {
    id: "q-401",
    quoteNo: "QT-000124",
    customer: "Aarav Industries",
    email: "finance@aarav.example",
    createdAt: "2026-02-01",
    validTill: "2026-02-10",
    amount: 145000,
    status: "sent",
  },
  {
    id: "q-402",
    quoteNo: "QT-000125",
    customer: "Saanvi Interiors",
    email: "owner@saanvi.example",
    createdAt: "2026-02-03",
    validTill: "2026-02-14",
    amount: 89500,
    status: "accepted",
  },
  {
    id: "q-403",
    quoteNo: "QT-000126",
    customer: "Dev Builders",
    email: "admin@devbuilders.example",
    createdAt: "2026-01-25",
    validTill: "2026-02-01",
    amount: 220000,
    status: "expired",
  },
];

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

function chip(s: QuoteStatus) {
  if (s === "accepted") return <Badge className="bg-emerald-600">Accepted</Badge>;
  if (s === "sent") return <Badge className="bg-blue-600">Sent</Badge>;
  if (s === "draft") return <Badge variant="secondary">Draft</Badge>;
  if (s === "expired") return <Badge variant="outline">Expired</Badge>;
  return <Badge variant="destructive">Rejected</Badge>;
}

export default function QuotationsPage() {
  const [items, setItems] = React.useState<Quote[]>(seed);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return items.filter((x) => {
      const matchesQ =
        !q.trim() ||
        x.quoteNo.toLowerCase().includes(q.toLowerCase()) ||
        x.customer.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "all" ? true : x.status === status;
      return matchesQ && matchesStatus;
    });
  }, [items, q, status]);

  return (
    <div className="min-h-screen p-6 pt-2">
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* <div>
            <p className="text-sm text-muted-foreground">Marketing / Quotations</p>
            <h1 className="text-3xl font-semibold tracking-tight">Quotations</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, send and track quotations with validity and status flow.
            </p>
          </div> */}

              <div>
            <BreadCrumbPage />
                  <p className="mt-1 text-sm text-muted-foreground">
              Create, send and track quotations with validity and status flow.
            </p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Quote
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Create quotation</SheetTitle>
                <SheetDescription>Draft a quote and send to customer. (UI sample)</SheetDescription>
              </SheetHeader>

              <div className="mt-6 grid gap-4">
                <div className="grid gap-2">
                  <Label>Customer</Label>
                  <Input placeholder="Customer name" />
                </div>

                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input placeholder="customer@email.com" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Created</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Valid till</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Total amount (₹)</Label>
                  <Input type="number" placeholder="e.g., 150000" />
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-sm font-medium">Line items (design only)</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Products, quantities, discounts, taxes, shipping, etc.
                  </p>
                  <div className="mt-3 grid gap-2">
                    <Input placeholder="Item description..." />
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="Qty" />
                      <Input placeholder="Rate" />
                      <Input placeholder="Tax %" />
                    </div>
                  </div>
                </div>
              </div>

              <SheetFooter className="mt-6 gap-2">
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    const next: Quote = {
                      id: `q-${Math.floor(Math.random() * 900 + 100)}`,
                      quoteNo: `QT-000${Math.floor(Math.random() * 900 + 100)}`,
                      customer: "New Customer (UI)",
                      email: "new@customer.example",
                      createdAt: "2026-02-05",
                      validTill: "2026-02-15",
                      amount: 50000,
                      status: "draft",
                    };
                    setItems((p) => [next, ...p]);
                  }}
                >
                  Create Draft
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
                    placeholder="Search quote no / customer..."
                    className="pl-8"
                  />
                </div>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {["draft", "sent", "accepted", "expired", "rejected"].map((x) => (
                      <SelectItem key={x} value={x}>
                        {x.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline">Export</Button>
                <Button variant="outline">Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="mt-6 grid gap-4">
          {filtered.map((x) => (
            <Card key={x.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{x.quoteNo}</CardTitle>
                      {chip(x.status)}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{x.id}</p>
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
                          setItems((p) =>
                            p.map((q) => (q.id === x.id ? { ...q, status: "sent" } : q))
                          )
                        }
                      >
                        Mark as Sent
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setItems((p) => p.filter((q) => q.id !== x.id))}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl border p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <p className="text-xs">Customer</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">{x.customer}</p>
                    <p className="text-xs text-muted-foreground truncate">{x.email}</p>
                  </div>

                  <div className="rounded-xl border p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarClock className="h-4 w-4" />
                      <p className="text-xs">Validity</p>
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {x.createdAt} → {x.validTill}
                    </p>
                  </div>

                  <div className="rounded-xl border p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                      <p className="text-xs">Amount</p>
                    </div>
                    <p className="mt-1 text-sm font-semibold">₹{fmt(x.amount)}</p>
                  </div>

                  <div className="rounded-xl border p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileSignature className="h-4 w-4" />
                      <p className="text-xs">Actions</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!filtered.length ? (
            <Card className="shadow-sm">
              <CardContent className="p-10 text-center">
                <p className="text-sm font-medium">No quotations</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create a draft quotation to start.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
