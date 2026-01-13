import { Users, Sparkles, Crown, BadgeCheck } from "lucide-react";
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

export default async function BusinessList() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id || !user.role) {
    return redirect("/auth/signin");
  }

  return (
    <>
      <BusinessHome />
    </>
  );
}
