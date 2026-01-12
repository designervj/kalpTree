
import {

  Users,

  Sparkles,
  Crown,
  BadgeCheck,

} from "lucide-react";
import { auth } from "@/auth";
import React, { Suspense } from "react";

import { redirect } from "next/navigation";
import BusinessHome from "@/components/admin/business/BusinessHome";



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
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${cls}`}>
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
      className={`h-14 w-14 rounded-md ${bg} grid place-items-center text-white font-bold`}>
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
  if (!user || !user.id || !user.role) {
    return redirect("/auth/signin");
  }

  // Direct database call instead of HTTP fetch to avoid ECONNREFUSED
  const { getCollection } = await import("@/app/api/tenants/[id]/route");
  const { ObjectId } = await import("mongodb");

  const skip = (currentPage - 1) * itemsPerPage;
  const tenantcoll = await getCollection("tenants");
  const createdById = new ObjectId(user.id);

  let businesses: Business[] = [];
  let totalCount = 0;

  if (user.role === "agency") {
    businesses = (await tenantcoll
      .find({ createdById: createdById })
      .limit(itemsPerPage)
      .skip(skip)
      .toArray()) as Business[];
    totalCount = await tenantcoll.countDocuments({ createdById: createdById });
  } else if (user.role === "superadmin") {
    businesses = (await tenantcoll
      .find({ type: "business" })
      .limit(itemsPerPage)
      .skip(skip)
      .toArray()) as Business[];
    totalCount = await tenantcoll.countDocuments({ type: "business" });
  }

  const handleDeleteBusiness = async () => {

  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  // if (businesses.length === 0) {
  //   return (
  //     <div className="w-full max-full space-y-6">
  //       <div className="flex flex-col gap-1">
  //         <h2 className="text-[26px] font-semibold text-slate-900">
  //           Businesses
  //         </h2>

  //         <p className="text-sm text-muted-foreground">
  //           No businesses found. Create your first business to get started.
  //         </p>
  //       </div>
  //       <Card className="rounded-md border bg-white shadow-sm">
  //         <CardContent className="p-12 text-center">
  //           <div className="mx-auto h-16 w-16 rounded-md bg-slate-100 grid place-items-center mb-4">
  //             <Users className="h-8 w-8 text-slate-400" />
  //           </div>
  //           <h3 className="text-lg font-semibold text-slate-900 mb-2">
  //             No Businesses Yet
  //           </h3>
  //           <p className="text-sm text-muted-foreground mb-6">
  //             Create your first business to manage websites, users, and billing.
  //           </p>
  //           <Button asChild className="rounded-md">
  //             <Link href="/admin/businesses/create">
  //               <Plus className="mr-2 h-4 w-4" />
  //               Add Business
  //             </Link>
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <>
      <BusinessHome business={businesses} />

    </>
  );
}
