"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Globe,
  Users,
  Settings,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Trash2,
  ExternalLink,
  Mail,
  Building2,
  Calendar,
} from "lucide-react";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { setBusinessWebsite, setCurrentBusiness, setEditBusiness } from "@/hooks/slices/business/BusinessSlice";
import { IBusiness } from "@/models/business";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { deleteBusiness } from "@/hooks/slices/business/BusinessThunk";
import { toast } from "sonner";
import { setCurrentWebsite } from "@/hooks/slices/websites/WebsiteSlice";
import { setCurretAgency } from "@/hooks/slices/user/agencySlice";



interface Pagination {
  page: number;
  itemsPerPage: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const ShowBusiness = () => {
  const { allBusiness, pagination } = useSelector(
    (state: RootState) => state.business
  );

  console.log("====>>",allBusiness)
  const params = useSearchParams();
  const itemsperpage = params.get("itemsperpage") || 30;
  const router = useRouter();
  const { websites } = useSelector((state: RootState) => state.websites);
  const {user} = useSelector((state: RootState) => state.user);
  const {allAgencies} = useSelector((state: RootState) => state.agency);
  const dispatch = useDispatch<AppDispatch>();


  const [filtersOpen, setFiltersOpen] = useState(false);
  const [status, setStatus] = useState("__all__");
  const [q, setQ] = useState("");

  const handlePageChange = (newPage: number) => {
    //   setPagination((prev) => ({
    //     ...prev,
    //     page: newPage,
    //     hasNextPage: newPage < prev.totalPages,
    //     hasPrevPage: newPage > 1,
    //   }));
    // Dispatch your Redux action here to fetch new data
    router.push(
      `/admin/businesses?page=${newPage}&itemsperpage=${itemsperpage}`
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
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
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
          pagination.totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          pagination.page - 1,
          pagination.page,
          pagination.page + 1,
          "...",
          pagination.totalPages
        );
      }
    }

    return pages;
  };

  const startIndex = (pagination.page - 1) * pagination.itemsPerPage + 1;
  const endIndex = Math.min(
    pagination.page * pagination.itemsPerPage,
    pagination.totalCount
  );


  const handleOpenDashboard = (business: IBusiness) => {
    dispatch(setBusinessWebsite(business));
    router.push(`/admin/businesses/${business._id}`);
  };

  const handleDeleteBusiness = async (business: IBusiness) => {
    const response = await dispatch(deleteBusiness(business?._id?.toString() || "")).unwrap();
    if (response) {
      toast.success("Business deleted successfully");
    }
  };

  const handleEditBusiness = (business: IBusiness) => {

    const website = websites.find((website) => website.tenantId === business._id);
    console.log("current Agency website", website);
    if(!website){
      toast.error("Website not found");
      return;
    }

    const agency = allAgencies.find((agency) => agency._id === business.tenantId);
      if(!agency){
        toast.error("Agency not found");
        return;
      }
    console.log("current Agency", agency);
    dispatch(setCurretAgency(agency));
    dispatch(setCurrentWebsite(website));
    dispatch(setEditBusiness(business));
    router.push(`/admin/businesses/edit`);
  };
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <div>
          <h2 className="text-[26px] font-semibold text-slate-900">
            Businesses
          </h2>
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
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-slate-100 grid place-items-center">
              <Sparkles className="h-5 w-5 text-slate-700" />
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

      {/* Items per page selector */}


      <Card className="rounded-xl border bg-white shadow-sm py-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  // setPage(1);
                }}
                placeholder="Search"
                className="h-11 rounded-md pl-12 text-base"
              />
            </div>

            {/* Filters */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 rounded-md px-6 text-base font-semibold"
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
                    <Select
                      value={status}
                    // onValueChange={(v) => {
                    //   setStatus(v);
                    //   setPage(1);
                    // }}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="All " />
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
                    // value={sortBy}
                    // onValueChange={(v) => {
                    //   setSortBy(v as "newest" | "oldest" | "name");
                    //   setPage(1);
                    // }}
                    >
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
                    // onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Showing{" "}
                    {/* <span className="font-semibold">{filtered.length}</span> of{" "} */}
                    {/* <span className="font-semibold">{allAgencies.length}</span> */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>


      {/* Business List */}
      <div className="space-y-4">
        {allBusiness.map((b, idx) => (
          <Card
            key={String(b._id)}
            className="rounded-md border bg-white shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-5">
                  {/* Left icon card (like screenshot) */}
                  <div className="h-14 w-14 rounded-2xl bg-indigo-600 shadow-sm grid place-items-center">
                    {/* simple “doc” icon look */}
                    <div className="relative h-8 w-8 rounded-lg bg-white/15 border border-white/25 grid place-items-center">
                      <div className="h-5 w-4 rounded-sm border-2 border-white/80 relative">
                        <div className="absolute left-1 top-1 h-1 w-2.5 rounded bg-white/80" />
                        <div className="absolute left-1 top-3 h-1 w-2 rounded bg-white/70" />
                        <div className="absolute left-1 top-5 h-1 w-2.5 rounded bg-white/60" />
                      </div>
                    </div>
                  </div>

                  {/* Right content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3 flex-wrap">
                      <div className="text-[28px] font-semibold text-slate-900 leading-tight">
                        {b.name}
                      </div>

                      {/* Active badge like screenshot */}
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
                          b.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            b.status === "active" ? "bg-emerald-500" : "bg-rose-500",
                          ].join(" ")}
                        />
                        {b.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* tagline (optional) */}
                    {b?.tagline ? (
                      <p className="mt-1 text-[15px] text-slate-600">
                        {b.tagline}
                      </p>
                    ) : null}

                    {/* meta pills row */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      {/* {b?.industry ? (/ */}
                      <span className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
                        <Building2 className="h-4 w-4 text-slate-600" />
                        {/* {b.industry} */}
                      </span>
                      {/* ) : null}/ */}

                      {/* {b?.foundedYear ? ( */}
                      <span className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
                        <Calendar className="h-4 w-4 text-slate-600" />
                        Founded
                        {/* {b.foundedYear} */}
                      </span>
                      {/* ) : null} */}

                      {b?.createdAt ? (
                        <span className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
                          <Calendar className="h-4 w-4 text-slate-600" />
                          Joined
                          {/* {formatDate(b.createdAt)} */}
                        </span>
                      ) : null}
                    </div>

                    {/* action pills (like screenshot) */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                        <Link
                          href={`/admin/businesses/${b._id}/websites`}
                          className="flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          View dashboard
                        </Link>
                      </Button>

                      {b.email ? (
                        <Button
                          asChild
                          variant="outline"
                          className="h-11 rounded-xl px-5"
                        >
                          <a href={`mailto:${b.email}`} className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {b.email}
                          </a>
                        </Button>
                      ) : null}

                      {/* {b?.website ? ( */}

                      <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                        <Link
                          //  href={b.website.startsWith("http") ? b.website : `https://${b.website}`}
                          href="#"
                          target="_blank"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Visit site
                        </Link>
                      </Button>
                      {/* ) : null}  */}
                    </div>

                    {/* Feature pills row */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b?.features?.websiteEnabled ? (
                        <span className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          Website
                        </span>
                      ) : null}
                      {b?.features?.ecommerceEnabled ? (
                        <span className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
                          E-commerce
                        </span>
                      ) : null}
                      {b?.features?.blogEnabled ? (
                        <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          Blog
                        </span>
                      ) : null}
                      {b?.features?.invoicesEnabled ? (
                        <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                          Invoices
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>


                <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link
                      href={`/admin/businesses/${b._id}/settings`}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </Button>

                  <Button
                    onClick={() => handleOpenDashboard(b)}
                  >
                    {/* <Link href={`/admin/businesses/${b._id}`}> */}
                    Open Dashboard
                    {/* </Link> */}
                  </Button>


                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline"><HiDotsVertical /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-10 me-6" align="start">

                      <DropdownMenuGroup>
                        <DropdownMenuItem className="text-[#ff0000] hover:bg-transparent cursor-pointer"
                          onClick={() => handleEditBusiness(b)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#ff0000] hover:bg-transparent cursor-pointer"
                          onClick={() => handleDeleteBusiness(b)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={String(itemsperpage)}
            onValueChange={handleItemsPerPageChange}

          >

            <SelectTrigger className="w-[80px] bg-white">
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
            Showing {startIndex} to {endIndex} of {pagination.totalCount}{" "}
            {pagination.totalCount === 1 ? "business" : "businesses"}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="rounded-md"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-muted-foreground"
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
                    className="rounded-md w-10 h-10 p-0"
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
              className="rounded-md"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBusiness;

