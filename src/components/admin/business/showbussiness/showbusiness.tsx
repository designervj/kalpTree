"use client";

import { useEffect, useState } from "react";
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
  Settings,
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
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
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

const ShowBusiness = () => {
  const { allBusiness, pagination } = useSelector(
    (state: RootState) => state.business,
  );

  const { user } = useSelector((state: RootState) => state.user);

  const params = useSearchParams();
  const itemsperpage = params.get("itemsperpage") || 30;
  const router = useRouter();
  const { websites } = useSelector((state: RootState) => state.websites);
  const { allAgencies } = useSelector((state: RootState) => state.agency);
  const dispatch = useDispatch<AppDispatch>();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [status, setStatus] = useState("__all__");
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
        setBusinessType(res.items.length > 0 ? res.items : []);
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
        setDefaultIndustries(res ? res.items : []);
      } catch (error) {
        toast.error(String(error));
      }
    })();
  }, []);

  const handlePageChange = (newPage: number) => {
    router.push(
      `/admin/businesses?page=${newPage}&itemsperpage=${itemsperpage}`,
    );
  };

  const handleItemsPerPageChange = (value: string) => {
    router.push(`/admin/businesses?itemsperpage=${value}`);
  };

  if (!pagination) return <>Loading</>;

  const getPageNumbers = () => {
    const pages = [];
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
    const website = websites.find(
      (website) => website.tenantId === business._id,
    );
    if (!website) {
      toast.error("Website not found");
      return;
    }
    const agency = allAgencies.find(
      (agency) => agency._id === business.tenantId,
    );
    if (!agency) {
      toast.error("Agency not found");
      return;
    }
    dispatch(setCurretAgency(agency));
    dispatch(setCurrentWebsite(website));
    dispatch(setEditBusiness(business));
    router.push(`/admin/businesses/edit`);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Businesses</h2>
          <p className="text-sm text-muted-foreground">
            Manage businesses, switch context, and open a dashboard for each.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-md">
            <Link href="/admin/rolesandpermission">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Roles & Permissions
            </Link>
          </Button>
          <Button asChild className="rounded-md">
            <Link href="/admin/businesses/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick tip */}
      <Card className="rounded-md border bg-white shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-slate-100 grid place-items-center shrink-0">
              <Sparkles className="h-4 w-4 text-slate-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Quick tip
              </div>
              <div className="text-xs text-muted-foreground">
                Create a new business to separate websites, users, and billing.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search + Filter bar */}
      <Card className="rounded-xl border bg-white shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search businesses..."
                className="h-9 rounded-md pl-9 text-sm"
              />
            </div>
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 rounded-md px-4 text-sm"
                >
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
                    <Select value={status}>
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
                    <Select>
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
                    <Button variant="outline" className="flex-1">
                      Reset
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* Business List — compact rows */}
      <div className="space-y-2">
        {allBusiness.map((b) => {
          const industry = defaultIndustries.find(
            (ind) =>
              ind._id == b.businessdetails?.industry ||
              ind.name == b.businessdetails?.industry,
          );
          const Icon = industry ? getIndustryIcon(industry.slug) : null;

          // Format date nicely
          const joinedDate = b?.createdAt
            ? new Date(b.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : null;

          const website = websites.find((web) => web.tenantId == b._id);

          const major =
            allBusiness.find((agency) => agency._id === website!.tenantId)
              ?.tenantId || null;

          // const dom = website?.primaryDomain?.[0] || "—";
          const domain = website?.primaryDomain?.find((d: string) =>
            d?.includes("kalptree.xyz"),
          );
          const agencyId =
            user?.role === "agency"
              ? (user?.tenantId?.toString() ?? null)
              : (major ?? null);
          const href = toCreateHref(
            domain!,
            website?.tenantId?.toString() ?? null,
            agencyId,
            user?.role!,
          );

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
          const displayDomain = publicDomain; // always show the non-localhost one

          const visitHref = visitDomain ? `http://${visitDomain}` : null;

          console.log(website);

          return (
            <Card
              key={String(b._id)}
              className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="px-4 py-3">
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-50 grid place-items-center shrink-0 overflow-hidden">
                    <img
                      src={
                        b?.branding?.logo ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7NnXia5DWq6qfBisS5mDI7r8xa5sT8cuvnA&s"
                      }
                      alt={b.name}
                      className="h-8 w-8 object-contain"
                    />
                  </div>

                  {/* Name + badges */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {b.name}
                      </span>

                      {/* Status pill */}
                      <span
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                          b.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full",
                            b.status === "active"
                              ? "bg-emerald-500"
                              : "bg-rose-500",
                          ].join(" ")}
                        />
                        {b.status === "active" ? "Active" : "Inactive"}
                      </span>

                      {/* Industry icon */}
                      {Icon && (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5">
                          <Icon className="h-3.5 w-3.5 text-slate-600" />
                        </span>
                      )}

                      <Link
                        href={`/builder/${website?._id}`}
                        target="_blank"
                        className="flex gap-1 text-[12px] items-center rounded-md bg-orange-100 px-2 py-0.5"
                      >
                        View Website{" "}
                        <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                      </Link>

                      <Link
                        href={href}
                        target="_blank"
                        className="flex gap-1 text-[12px] items-center rounded-md bg-red-100 px-2 py-0.5"
                      >
                        View Admin
                        <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                      </Link>
                    </div>

                    {/* Meta row */}
                    <div className="mt-1 flex items-center gap-3 flex-wrap text-xs text-slate-500">
                      {b.email && (
                        <a
                          href={`mailto:${b.email}`}
                          className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                        >
                          <Mail className="h-3 w-3" />
                          {b.email}
                        </a>
                      )}
                      {joinedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {joinedDate}
                        </span>
                      )}

                      {/* Feature pills */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {b?.features?.websiteEnabled && (
                          <span className="rounded-md border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-700">
                            Website
                          </span>
                        )}
                        {b?.features?.ecommerceEnabled && (
                          <span className="rounded-md border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[11px] font-medium text-purple-700">
                            E-commerce
                          </span>
                        )}
                        {b?.features?.blogEnabled && (
                          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                            Blog
                          </span>
                        )}
                        {b?.features?.invoicesEnabled && (
                          <span className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
                            Invoices
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 flex-wrap text-sm text-slate-700">
                      {displayDomain && (
                        <>
                          <span className="font-medium">
                            Website: {displayDomain}
                          </span>

                          {visitHref && (
                            <Link
                              href={visitHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 hover:bg-slate-200 transition"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Visit
                            </Link>
                          )}

                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(displayDomain)
                            }
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 hover:bg-slate-200 transition"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-lg h-8 px-3 text-xs"
                    >
                      <Link
                        href={`/admin/businesses/${b._id}/settings`}
                        className="flex items-center gap-1.5"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Settings
                      </Link>
                    </Button> */}

                    <Button
                      size="sm"
                      className="rounded-lg h-8 px-3 text-xs"
                      onClick={() => handleOpenDashboard(b)}
                    >
                      Open Dashboard
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg h-8 w-8 p-0"
                        >
                          <HiDotsVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-32 me-4" align="end">
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
        })}
      </div>

      {/* Footer: per-page + count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={String(itemsperpage)}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[72px] bg-white h-8 text-sm">
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
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="rounded-md h-8"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-1.5 text-muted-foreground text-sm"
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
                    className="rounded-md w-8 h-8 p-0 text-sm"
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
              className="rounded-md h-8"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBusiness;
