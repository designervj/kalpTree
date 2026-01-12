
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IBusiness } from "@/models/business";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,

  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toCreateHref } from "@/lib/utils/url-helpers";

function cn(...c: (string | null | undefined | false)[]) {
  return c.filter(Boolean).join(" ");
}

// type Business = {
//   _id: string;
//   tenantId: string;
//   name: string;
//   email?: string;
//   plan?: string;
//   subscriptionStatus?: string;
//   customDomainVerified?: boolean;
//   branding?: { colors?: { primary?: string; secondary?: string } };
//   features?: {
//     websiteEnabled?: boolean;
//     ecommerceEnabled?: boolean;
//     blogEnabled?: boolean;
//     invoicesEnabled?: boolean;
//   };
//   settings?: { locale?: string; currency?: string; timezone?: string };
//   status?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   websites?: Array<{
//     name?: string;
//     primaryDomain?: string[];
//     serviceType?: string;
//     status?: string;
//     createdAt?: string;
//     updatedAt?: string;
//   }>;
// };

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusPill(status?: string) {
  const s = (status || "").toLowerCase();
  const ok = s === "active";
  return (
    <Badge
      className={cn(
        "rounded-full",
        ok
          ? "bg-emerald-600 text-white hover:bg-emerald-600"
          : "bg-slate-700 text-white hover:bg-slate-700"
      )}
    >
      {status || "—"}
    </Badge>
  );
}

function FeatureRow({ label, enabled }: { label: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-white px-4 py-3">
      <div className="text-sm font-medium text-slate-900">{label}</div>
      {enabled ? (
        <span className="inline-flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Enabled
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm text-slate-500">
          <XCircle className="h-4 w-4" />
          Disabled
        </span>
      )}
    </div>
  );
}

export default async function BusinesswithID({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const user = session?.user;
  const param = await params;
  let id = param.id;

  let business: IBusiness;

  try {
    // Import database utilities
    const { getDatabase } = await import("@/lib/db/mongodb");
    const { ObjectId } = await import("mongodb");

    const db = await getDatabase();
    const tenantcoll = db.collection("tenants");
    const tenantid = new ObjectId(id);

    const tenants = await tenantcoll
      .aggregate([
        {
          $match: {
            _id: tenantid,
          },
        },
        {
          $lookup: {
            from: "websites",
            localField: "_id",
            foreignField: "tenantId",
            as: "websites",
          },
        },
      ])
      .toArray();

    const rawBusiness = tenants[0];

    if (!rawBusiness) {
      throw new Error("Business not found");
    }

    // Serialize ObjectId fields to strings for client component
    business = JSON.parse(JSON.stringify(rawBusiness, (key, value) => {
      if (value && typeof value === 'object' && value._bsontype === 'ObjectId') {
        return value.toString();
      }
      return value;
    })) as IBusiness;
  } catch (error) {
    console.error("Error fetching business data:", error);
    // Return a fallback UI or redirect
    throw error; // Re-throw to trigger Next.js error boundary
  }

  const primary = business.branding?.colors?.primary || "#111827";
  const secondary = business.branding?.colors?.secondary || "#e5e7eb";

  const websites = business.websites || [];

  const totalWebsites = websites.length;
  const primaryDomain = websites?.[0]?.primaryDomain?.[0] || "—";
  const ShowBussinesById = (await import("@/components/admin/business/businessID/ShowBussinesById")).default;
  return (
    <>
      <ShowBussinesById business={business} />
    </>
  );
}
