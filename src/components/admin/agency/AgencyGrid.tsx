"use client";

import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { deleteAgency } from "@/hooks/slices/user/agencySlice";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge as ShadBadge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  SlidersHorizontal,
  Plus,
  UsersRound,
  Mail,
  Calendar,
  ArrowRight,
  MoreVertical,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type Agency = {
  _id: string;
  name?: string;
  email?: string;
  status?: "active" | "paused" | "inactive";
  role?: "agency" | "business" | "superadmin" | string;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  lastLoginAt?: string | null;
};

function Pill({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: "neutral" | "green" | "amber" | "red" | "blue";
  className?: string;
}) {
  const cls =
    variant === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : variant === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : variant === "red"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : variant === "blue"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        cls,
        className
      )}
    >
      {children}
    </span>
  );
}

function statusVariant(s?: string): "green" | "amber" | "red" | "neutral" {
  if (s === "active") return "green";
  if (s === "paused") return "amber";
  if (s === "inactive") return "red";
  return "neutral";
}

function roleVariant(r?: string): "blue" | "neutral" {
  if (!r) return "neutral";
  if (String(r).toLowerCase() === "agency") return "blue";
  return "neutral";
}

export default function AgencyList() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { user } = useSelector((state: RootState) => state.user);
  const { allAgencies, isAgencyLoading } = useSelector(
    (state: RootState) => state.agency
  );
  const { allBusiness } = useSelector((state: RootState) => state.business);
  console.log(allBusiness);

  // topbar state
  const [q, setQ] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // filters
  const [status, setStatus] = useState<string>("__all__");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  const filtered = useMemo(() => {
    let list = [...allAgencies];

    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((a) => {
        const name = (a.name || "").toLowerCase();
        const email = (a.email || "").toLowerCase();
        return name.includes(query) || email.includes(query);
      });
    }

    if (status !== "__all__") {
      list = list.filter((a) => (a.status || "").toLowerCase() === status);
    }

    list.sort((a, b) => {
      if (sortBy === "name") {
        return String(a.name || "").localeCompare(String(b.name || ""));
      }
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === "newest" ? bTime - aTime : aTime - bTime;
    });

    return list;
  }, [allAgencies, q, status, sortBy]);

  const handleCreate = () => {
    if (user?.role === "superadmin") router.push("/admin/agencies/create");
    else {
      toast({
        title: "Not allowed",
        description: "Only Super Admin can create agencies.",
      });
    }
  };

  const handleOpen = (id: string) => {
    router.push(`/admin/agencies/${id}`);
  };

  const handleDelete = async (row: Agency) => {
    const id = row?._id;
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }
    const ok = confirm(`Delete agency "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      await dispatch(deleteAgency(String(id)));
      toast({
        title: "Deleted",
        description: `Agency ${row?.name ?? String(id)} removed`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Delete failed",
        description: String(err?.message || err),
      });
    }
  };

  const resetFilters = () => {
    setStatus("__all__");
    setSortBy("newest");
  };

  // {agencies .map((b, idx) => {
  // const planBadge = getPlanBadge(b.plan);
  // const statusBadge = getStatusBadge(b.status);
  // const subtext = getSubtext(b.type);
  // const href = `/admin/agencies/${b._id}`;

  return (
    <div className="w-full space-y-4 ">
      {/* Page header row */}

      {/* Top bar (Search + Filters) — like your screenshot */}
      <Card className="rounded-xl border bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="h-14 rounded-xl pl-12 text-base"
              />
            </div>

            {/* Filters */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-14 rounded-xl px-6 text-base font-semibold"
                >
                  <SlidersHorizontal className="mr-2 h-5 w-5" />
                  Filters
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[380px] sm:w-[420px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sort</Label>
                    <Select
                      value={sortBy}
                      onValueChange={(v) =>
                        setSortBy(v as "newest" | "oldest" | "name")
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Newest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setFiltersOpen(false)}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold">{filtered.length}</span> of{" "}
                    <span className="font-semibold">{allAgencies.length}</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-4 border-2 ">
        {isAgencyLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-xl border bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="h-6 w-52 rounded bg-muted" />
                  <div className="mt-3 h-4 w-80 rounded bg-muted" />
                  <div className="mt-5 flex gap-2">
                    <div className="h-10 w-40 rounded bg-muted" />
                    <div className="h-10 w-40 rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : filtered.length === 0 ? (
          <Card className="rounded-xl border bg-white shadow-sm">
            <CardContent className="p-10 text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl bg-muted">
                <UsersRound className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="text-lg font-semibold">No agencies found</div>
              <div className="text-sm text-muted-foreground mt-1">
                Try searching with a different keyword or reset filters.
              </div>
              <div className="mt-5 flex justify-center gap-2">
                <Button variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filtered.map((a, idx) => {
            const tone = idx % 2 === 0 ? "bg-[#0b6d8e]" : "bg-slate-900";
            const created = a.createdAt
              ? new Date(a.createdAt).toLocaleString()
              : "-";

            const totalBusiness = allBusiness.filter((d) => {
              return d.tenantId == a._id;
            }).length;

            return (
              <Card
                key={a._id}
                className="rounded-xl border bg-white shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* LEFT */}
                    <div className="flex items-start gap-5">
                      <div
                        className={cn(
                          "h-16 w-16 rounded-xl grid place-items-center text-white",
                          tone
                        )}
                      >
                        <UsersRound className="h-7 w-7" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-[30px] font-semibold text-slate-900 truncate">
                            {a.name || "—"}
                          </div>

                          <Link
                            href="/admin/agencies/id"
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </Link>

                          <Pill variant={roleVariant(a.role)}>
                            {(a.role || "agency").toString()}
                          </Pill>

                          <Pill variant={roleVariant(String(totalBusiness))}>
                            Total Business: {(totalBusiness || 0).toString()}
                          </Pill>

                          <Pill variant={statusVariant(a.status)}>
                            {(a.status || "active").toString()}
                          </Pill>
                        </div>

                        <div className="mt-1 text-sm text-muted-foreground">
                          Agency panel
                        </div>

                        {/* chips row */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <ShadBadge
                            variant="outline"
                            className="h-10 rounded-xl px-4 text-sm font-semibold"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            {a.email || "-"}
                          </ShadBadge>

                          <ShadBadge
                            variant="outline"
                            className="h-10 rounded-xl px-4 text-sm font-semibold"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {created}
                          </ShadBadge>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                      <Button
                        variant="outline"
                        className="h-11 rounded-xl px-5 text-sm font-semibold"
                        onClick={() =>
                          router.push(`/admin/agencies/${a._id}/settings`)
                        }
                      >
                        Settings
                      </Button>

                      <Button
                        className="h-11 rounded-xl px-5 text-sm font-semibold"
                        onClick={() => handleOpen(String(a._id))}
                      >
                        Open Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl"
                        onClick={() => handleDelete(a)}
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5 text-rose-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
