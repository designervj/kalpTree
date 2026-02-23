"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HiDotsVertical } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Plus,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Mail,
  Calendar,
  ExternalLink,
  Copy,
  Building2,
  Globe,
  LayoutGrid,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useSearchParams, useRouter } from "next/navigation";
import {
  setBusinessWebsite,
  setEditBusiness,
} from "@/hooks/slices/business/BusinessSlice";
import { IBusiness } from "@/models/business";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { deleteBusiness } from "@/hooks/slices/business/BusinessThunk";
import { toast } from "sonner";
import { setCurrentWebsite } from "@/hooks/slices/websites/WebsiteSlice";
import { setCurretAgency } from "@/hooks/slices/user/agencySlice";
import { IndustryOption } from "../../users/IndustryRadioList";
import { getIndustryIcon } from "./util/GetIcon";
import { toCreateHref } from "@/lib/utils/url-helpers";
import { cn } from "@/lib/utils";

const ShowBusiness = () => {
  const { allBusiness, pagination } = useSelector(
    (state: RootState) => state.business,
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { websites } = useSelector((state: RootState) => state.websites);
  const { allAgencies } = useSelector((state: RootState) => state.agency);

  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const itemsperpage = params.get("itemsperpage") || "30";

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [status, setStatus] = useState("__all__");
  const [sortBy, setSortBy] = useState("newest");
  const [q, setQ] = useState("");
  const [businessType, setBusinessType] = useState<any[]>([]);
  const [defaultIndustries, setDefaultIndustries] = useState<IndustryOption[]>(
    [],
  );

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch("/api/admin/attributessets");
        const res = await req.json();
        setBusinessType(res.items?.length > 0 ? res.items : []);
      } catch (error) {
        toast.error(String(error));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch("/api/admin/producttypecategory");
        const res = await req.json();
        setDefaultIndustries(res?.items || []);
      } catch (error) {
        toast.error(String(error));
      }
    })();
  }, []);

  const handlePageChange = (newPage: number) => {
    router.push(`/admin/businesses?page=${newPage}&itemsperpage=${itemsperpage}`);
  };

  const handleItemsPerPageChange = (value: string) => {
    router.push(`/admin/businesses?itemsperpage=${value}`);
  };
  const filteredBusinesses = useMemo(() => {
    if (!allBusiness) return [];
    const query = q.trim().toLowerCase();

    let data = [...allBusiness];

    if (status !== "__all__") {
      data = data.filter((b) => (b.status || "").toLowerCase() === status);
    }

    if (query) {
      data = data.filter((b) => {
        const website = websites.find((web) => web.tenantId == b._id);
        const domain =
          website?.primaryDomain?.find((d: string) => !d?.includes("localhost")) ||
          "";
        const email = (b.email || "").toLowerCase();
        const name = (b.name || "").toLowerCase();
        const industryVal = (b.businessdetails?.industry || "")
          .toString()
          .toLowerCase();

        return (
          name.includes(query) ||
          email.includes(query) ||
          domain.toLowerCase().includes(query) ||
          industryVal.includes(query)
        );
      });
    }

    if (sortBy === "name") {
      data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "oldest") {
      data.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
      );
    } else {
      // newest
      data.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
      );
    }

    return data;
  }, [allBusiness, websites, q, status, sortBy]);


  if (!pagination) {
    return (
      <div className="w-full rounded-xl border bg-white p-8 text-center text-sm text-muted-foreground shadow-sm">
        Loading businesses...
      </div>
    );
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (pagination.totalPages <= maxVisible) {
      for (let i = 1; i <= pagination.totalPages; i++) pages.push(i);
    } else {
      if (pagination.page <= 3) {
        pages.push(1, 2, 3, 4, "...", pagination.totalPages);
      } else if (pagination.page >= pagination.totalPages - 2) {
        pages.push(
          1,
          "...",
          pagination.totalPages - 3,
          pagination.totalPages - 2,
          pagination.totalPages - 1,
          pagination.totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          pagination.page - 1,
          pagination.page,
          pagination.page + 1,
          "...",
          pagination.totalPages,
        );
      }
    }
    return pages;
  };

  const startIndex = (pagination.page - 1) * pagination.itemsPerPage + 1;
  const endIndex = Math.min(
    pagination.page * pagination.itemsPerPage,
    pagination.totalCount,
  );

  const handleOpenDashboard = (business: IBusiness) => {
    dispatch(setBusinessWebsite(business));
    router.push(`/admin/businesses/${business._id}`);
  };

  const handleDeleteBusiness = async (business: IBusiness) => {
    const response = await dispatch(
      deleteBusiness(business?._id?.toString() || ""),
    ).unwrap();

    if (response) toast.success("Business deleted successfully");
  };

  const handleEditBusiness = (business: IBusiness) => {
    const website = websites.find((website) => website.tenantId === business._id);
    if (!website) {
      toast.error("Website not found");
      return;
    }

    const agency = allAgencies.find((agency) => agency._id === business.tenantId);
    if (!agency) {
      toast.error("Agency not found");
      return;
    }

    dispatch(setCurretAgency(agency));
    dispatch(setCurrentWebsite(website));
    dispatch(setEditBusiness(business));
    router.push(`/admin/businesses/edit`);
  };


  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const FeatureChip = ({
    show,
    label,
    color,
  }: {
    show?: boolean;
    label: string;
    color: "blue" | "purple" | "emerald" | "amber";
  }) => {
    if (!show) return null;

    const styles = {
      blue: "border-blue-200 bg-blue-50 text-blue-700",
      purple: "border-purple-200 bg-purple-50 text-purple-700",
      emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
      amber: "border-amber-200 bg-amber-50 text-amber-700",
    };

    return (
      <span
        className={cn(
          "rounded-md border px-2 py-0.5 text-[11px] font-medium",
          styles[color],
        )}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Businesses
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage businesses, websites, and quick access to admin dashboards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/admin/rolesandpermission">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Roles & Permissions
            </Link>
          </Button>

          <Button asChild className="rounded-lg">
            <Link href="/admin/businesses/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      {/* Info / tip bar */}
      <Card className="rounded-xl border bg-gradient-to-r from-white to-slate-50 shadow-sm">
        <CardContent className="p-3.5">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-100">
              <Sparkles className="h-4 w-4 text-violet-700" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">Quick tip</p>
              <p className="text-xs text-muted-foreground">
                Each business keeps its own website, users, and settings separate —
                perfect for multi-tenant management.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search + Filters */}
      <Card className="rounded-xl border bg-white shadow-sm">
        <CardContent className="p-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, domain..."
                className="h-10 rounded-lg border-slate-200 pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 w-[140px] rounded-lg">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-10 rounded-lg px-4">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
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
                        <SelectTrigger className="h-11 w-full">
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
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-11 w-full">
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
                        className="flex-1"
                        onClick={() => setFiltersOpen(false)}
                      >
                        Apply
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setStatus("__all__");
                          setSortBy("newest");
                          setQ("");
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {filteredBusinesses.length === 0 ? (
          <Card className="rounded-xl border bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 rounded-full bg-slate-100 p-3">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                No businesses found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try changing the search term or filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBusinesses?.map((b) => {
            const industry = defaultIndustries.find(
              (ind) =>
                ind._id == b.businessdetails?.industry ||
                ind.name == b.businessdetails?.industry,
            );
            const Icon = industry ? getIndustryIcon(industry.slug) : null;

            const joinedDate = b?.createdAt
              ? new Date(b.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              : null;

            const website = websites.find((web) => web.tenantId == b._id);

            // NOTE: your original logic preserved here, but made safe
            const major = website
              ? allBusiness.find((agency) => agency._id === website.tenantId)?.tenantId ||
              null
              : null;

            const domain = website?.primaryDomain?.find((d: string) =>
              d?.includes("kalptree.xyz"),
            );

            const agencyId =
              user?.role === "agency"
                ? (user?.tenantId?.toString() ?? null)
                : (major ?? null);

            const href =
              domain && website
                ? toCreateHref(
                  domain,
                  website?.tenantId?.toString() ?? null,
                  agencyId,
                  user?.role || "",
                )
                : "#";

            const isLocalhost =
              typeof window !== "undefined" &&
              window.location.hostname === "localhost";

            const localDomain = website?.primaryDomain?.find((d: string) =>
              d?.includes("localhost"),
            );
            const publicDomain = website?.primaryDomain?.find(
              (d: string) => !d?.includes("localhost"),
            );

            const visitDomain = isLocalhost ? localDomain : publicDomain;
            const displayDomain = publicDomain || domain || localDomain;
            const visitHref = visitDomain ? `http://${visitDomain}` : null;

            const isActive = (b.status || "").toLowerCase() === "active";

            return (
              <Card
                key={String(b._id)}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    {/* Left: identity */}
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img
                          src={
                            b?.branding?.logo ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7NnXia5DWq6qfBisS5mDI7r8xa5sT8cuvnA&s"
                          }
                          alt={b.name}
                          className="h-9 w-9 object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Title row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-[15px] font-semibold text-slate-900">
                            {b.name}
                          </h3>

                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
                              isActive
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-rose-200 bg-rose-50 text-rose-700",
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                isActive ? "bg-emerald-500" : "bg-rose-500",
                              )}
                            />
                            {isActive ? "Active" : "Inactive"}
                          </span>

                          {Icon && (
                            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5">
                              <Icon className="h-3.5 w-3.5 text-slate-600" />
                            </span>
                          )}
                        </div>

                        {/* Meta row */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          {b.email && (
                            <a
                              href={`mailto:${b.email}`}
                              className="inline-flex items-center gap-1 hover:text-slate-800"
                            >
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{b.email}</span>
                            </a>
                          )}

                          {joinedDate && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {joinedDate}
                            </span>
                          )}
                        </div>

                        {/* Feature chips */}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <FeatureChip
                            show={b?.features?.websiteEnabled}
                            label="Website"
                            color="blue"
                          />
                          <FeatureChip
                            show={b?.features?.ecommerceEnabled}
                            label="E-commerce"
                            color="purple"
                          />
                          <FeatureChip
                            show={b?.features?.blogEnabled}
                            label="Blog"
                            color="emerald"
                          />
                          <FeatureChip
                            show={b?.features?.invoicesEnabled}
                            label="Invoices"
                            color="amber"
                          />
                        </div>

                        {/* Domain row */}
                        {displayDomain && (
                          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <div className="mb-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                  <Globe className="h-3.5 w-3.5" />
                                  Website
                                </div>
                                <p className="truncate text-sm font-medium text-slate-800">
                                  {displayDomain}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {visitHref && (
                                  <Link
                                    href={visitHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 rounded-lg border-slate-200 bg-white px-2.5 text-xs"
                                    >
                                      <ExternalLink className="mr-1 h-3.5 w-3.5" />
                                      Visit
                                    </Button>
                                  </Link>
                                )}

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 rounded-lg border-slate-200 bg-white px-2.5 text-xs"
                                  onClick={() => copyToClipboard(displayDomain)}
                                >
                                  <Copy className="mr-1 h-3.5 w-3.5" />
                                  Copy
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                      {website?._id && (
                        <Link href={`/builder/${website._id}`} target="_blank">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-lg border-orange-200 bg-orange-50 px-3 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                          >
                            <LayoutGrid className="mr-1.5 h-4 w-4" />
                            View Website
                          </Button>
                        </Link>
                      )}

                      {href !== "#" && (
                        <Link href={href} target="_blank">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-lg border-rose-200 bg-rose-50 px-3 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                          >
                            <ExternalLink className="mr-1.5 h-4 w-4" />
                            View Admin
                          </Button>
                        </Link>
                      )}

                      <Button
                        size="sm"
                        className="h-9 rounded-lg px-3"
                        onClick={() => handleOpenDashboard(b)}
                      >
                        Open Dashboard
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 rounded-lg p-0"
                          >
                            <HiDotsVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="mr-4 w-36" align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              className="cursor-pointer text-sm"
                              onClick={() => handleEditBusiness(b)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-sm text-rose-600 focus:text-rose-600"
                              onClick={() => handleDeleteBusiness(b)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 rounded-xl border bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={String(itemsperpage)}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[74px] rounded-lg bg-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="75">75</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>

        {pagination.totalCount > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {startIndex}–{endIndex} of {pagination.totalCount}{" "}
            {pagination.totalCount === 1 ? "business" : "businesses"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col gap-2 rounded-xl border bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="h-8 rounded-lg"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-1.5 text-sm text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className="h-8 w-8 rounded-lg p-0 text-sm"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="h-8 rounded-lg"
            >
              Next
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBusiness;