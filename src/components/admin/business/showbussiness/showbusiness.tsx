"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { setBusinessWebsite, setCurrentBusiness } from "@/hooks/slices/business/BusinessSlice";
import { IBusiness } from "@/models/business";



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
  const params = useSearchParams();
  const itemsperpage = params.get("itemsperpage") || 30;
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();


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
                  <div
                    className={`h-12 w-12 rounded-lg grid place-items-center ${idx % 3 === 0
                        ? "bg-blue-100"
                        : idx % 3 === 1
                          ? "bg-slate-100"
                          : "bg-purple-100"
                      }`}
                  >
                    <span
                      className={`text-lg font-bold ${idx % 3 === 0
                          ? "text-blue-600"
                          : idx % 3 === 1
                            ? "text-slate-600"
                            : "text-purple-600"
                        }`}
                    >
                      {b.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-[26px] font-semibold text-slate-900 truncate">
                        {b.name}
                      </div>
                      <Badge variant="secondary">{b.plan}</Badge>
                      <Badge
                        variant={
                          b.status === "active" ? "default" : "destructive"
                        }
                      >
                        {b.status}
                      </Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline">
                        <Link
                          href={`/admin/businesses/${b._id}/websites`}
                          className="flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          Websites
                          <span className="ml-1 rounded-md bg-white/50 px-2 py-0.5 text-xs">
                            {b.websitesCount ?? 0}
                          </span>
                        </Link>
                      </Button>

                      <Button asChild variant="outline">
                        <Link
                          href={`/admin/businesses/${b._id}/users`}
                          className="flex items-center gap-2"
                        >
                          <Users className="h-4 w-4" />
                          Members
                          <span className="ml-1 rounded-md bg-white/50 px-2 py-0.5 text-xs">
                            {b.membersCount ?? 0}
                          </span>
                        </Link>
                      </Button>

                      {b.email && (
                        <Badge>
                          <Globe className="mr-1 h-3.5 w-3.5" />
                          {b.email}
                        </Badge>
                      )}
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
