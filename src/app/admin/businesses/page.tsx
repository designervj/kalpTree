import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Globe,
  Users,
  Settings,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Crown,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { auth } from "@/auth";
import React, { Suspense } from "react";
import UpdateBusiness from "./UpdateBusiness";
const ShowBusiness = React.lazy(() => import("@/components/admin/business/showbusiness"));

type Business = {
  _id: string;
  slug: string;
  name: string;
  email: string;
  plan: "trial" | "free" | "pro" | "agency";
  subscriptionStatus: "active" | "paused" | "cancelled";
  customDomainVerified: boolean;
  branding?: {
    colors?: {
      primary?: string;
      secondary?: string;
    };
  };
  paymentGateways?: Record<string, any>;
  features?: {
    websiteEnabled?: boolean;
    ecommerceEnabled?: boolean;
    blogEnabled?: boolean;
    invoicesEnabled?: boolean;
  };
  settings?: {
    locale?: string;
    currency?: string;
    timezone?: string;
  };
  status: "active" | "paused" | "inactive";
  createdAt: string;
  updatedAt: string;
  createdById: string;
  type?: "business" | "franchise" | "agency";
  websitesCount?: number;
  membersCount?: number;
};

function Badge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "neutral" | "purple" | "green" | "amber";
}) {
  const cls =
    variant === "purple"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : variant === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : variant === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

function BusinessIcon({
  tone = "blue",
}: {
  tone?: "blue" | "dark" | "purple";
}) {
  const bg =
    tone === "purple"
      ? "bg-purple-600"
      : tone === "dark"
      ? "bg-slate-900"
      : "bg-[#0b6d8e]";
  return (
    <div
      className={`h-14 w-14 rounded-md ${bg} grid place-items-center text-white font-bold`}
    >
      <Users className="h-6 w-6" />
    </div>
  );
}

function getPlanBadge(plan: string) {
  const normalizedPlan = plan.toLowerCase();
  if (normalizedPlan === "agency") {
    return (
      <Badge variant="purple">
        <Crown className="mr-1 h-3.5 w-3.5" />
        Agency
      </Badge>
    );
  } else if (normalizedPlan === "pro") {
    return (
      <Badge variant="green">
        <BadgeCheck className="mr-1 h-3.5 w-3.5" />
        Pro
      </Badge>
    );
  } else if (normalizedPlan === "trial") {
    return (
      <Badge variant="amber">
        <Sparkles className="mr-1 h-3.5 w-3.5" />
        Trial
      </Badge>
    );
  } else {
    return <Badge>Free</Badge>;
  }
}

function getStatusBadge(status: string) {
  if (status === "active") {
    return <Badge variant="green">Active</Badge>;
  } else if (status === "paused") {
    return <Badge variant="amber">Paused</Badge>;
  } else {
    return <Badge>Inactive</Badge>;
  }
}

function getSubtext(type?: string) {
  if (!type) return null;
  if (type === "franchise") return "Franchise panel";
  if (type === "agency") return "Agency panel";
  return "Business panel";
}

export default async function BusinessList({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const session = await auth();
  const user = session?.user;
  const itemsPerPage = 2;
  const currentPage = Number(params.page) || 1;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tenants?id=${user?.id}&role=${user?.role}&page=${currentPage}&limit=${itemsPerPage}`
  );

  const result = await res.json();
  const businesses: Business[] = result.item || [];
  console.log("businesses--",businesses)
  const totalCount = result.totalCount || businesses.length;

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  if (businesses.length === 0) {
    return (
      <div className="w-full max-w-[1200px] space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-[26px] font-semibold text-slate-900">
            Businesses
          </h2>
          <p className="text-sm text-muted-foreground">
            No businesses found. Create your first business to get started.
          </p>
        </div>
        <Card className="rounded-3xl border bg-white shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-md bg-slate-100 grid place-items-center mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Businesses Yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first business to manage websites, users, and billing.
            </p>
            <Button asChild className="rounded-md">
              <Link href="/admin/businesses/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Business
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


 
  return (
    <>

    <UpdateBusiness
    business={businesses??[]}
    />
     <div className="w-full max-w-[1200px] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[26px] font-semibold text-slate-900">Businesses</h2>
        <p className="text-sm text-muted-foreground">
          Manage businesses, switch context, and open a dashboard for each.
        </p>
      </div>

      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
                  Create a new business to separate websites, users, and
                  billing.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

      {/* List */}
      <div className="space-y-4">
        {businesses.map((b, idx) => {
          const planBadge = getPlanBadge(b.plan);
          const statusBadge = getStatusBadge(b.status);
          const subtext = getSubtext(b.type);
          const href = `/admin/businesses/${b._id}`;

          return (
            <Card key={b._id} className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* LEFT */}
                  <div className="flex items-start gap-5">
                    <BusinessIcon
                      tone={
                        idx % 3 === 0
                          ? "blue"
                          : idx % 3 === 1
                          ? "dark"
                          : "purple"
                      }
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-[26px] font-semibold text-slate-900 truncate">
                          {b.name}
                        </div>
                        <Link
                          href={href}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>

                        {planBadge}
                        {statusBadge}
                      </div>

                      {subtext ? (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {subtext}
                        </div>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button
                          asChild
                          variant="secondary"
                          className="py-2 rounded-md px-4 text-sm font-semibold text-white"
                        >
                          <Link
                            href={`${href}/websites`}
                            className="flex items-center gap-2"
                          >
                            <Globe className="h-4 w-4" />
                            Websites{" "}
                            <span className="ml-1 rounded-md bg-white/50 px-2 py-0.5 text-xs">
                              {b.websitesCount ?? 0}
                            </span>
                          </Link>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          className="py-2 rounded-md px-4 text-sm font-semibold text-white"
                        >
                          <Link
                            href={`${href}/users`}
                            className="flex items-center gap-2"
                          >
                            <Users className="h-4 w-4" />
                            Members{" "}
                            <span className="ml-1 rounded-md bg-white/50 px-2 py-0.5 text-xs">
                              {b.membersCount ?? 0}
                            </span>
                          </Link>
                        </Button>

                        {b.email ? (
                          <Badge>
                            <Globe className="mr-1 h-3.5 w-3.5" />
                            {b.email}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 rounded-md px-5 text-sm font-semibold"
                    >
                      <Link
                        href={`${href}/settings`}
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </Button>

                    <Suspense fallback={null}>
                      <>
                        <ShowBusiness businessId={b._id} />
                      </>
                    </Suspense>
                 
                   
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {totalCount} businesses
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              className="rounded-md"
            >
              <Link
                href={`?page=${currentPage - 1}`}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  const showEllipsis =
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span key={page} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <Button
                      key={page}
                      asChild
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="rounded-md w-10 h-10 p-0"
                    >
                      <Link href={`?page=${page}`}>{page}</Link>
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              className="rounded-md"
            >
              <Link
                href={`?page=${currentPage + 1}`}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
    </>
   
  );
}
