import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import { type ElementType } from "react";
import GetAllAgency from "@/components/admin/agency/GetAllAgency";
import GetAllBusiness from "@/components/admin/business/GetAllBusiness";
import GetAllWebsites from "@/components/admin/website/GetAllWebsites";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MinorComp from "./minorcomp";

/* ------------------------------------------
   Helpers
------------------------------------------ */

async function fetchWithCookies(path: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return fetch(path, { cache: "no-store", headers: { cookie } });
}

async function fetchCount(path: string) {
  try {
    const res = await fetchWithCookies(path);
    if (!res.ok) return 0;
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items;
    return Array.isArray(items) ? items.length : 0;
  } catch {
    return 0;
  }
}

type BusinessSite = {
  id: string;
  domain: string;
  platform?: "wordpress" | "code";
  hasEmail?: boolean;

  // links
  manageDomainHref: string;
  manageEmailHref?: string;
  setupEmailHref?: string;
  dashboardHref: string;
  wordpressAdminHref?: string;

  // icon appearance
  iconStyle?: "wp" | "code";
};

// ✅ Try to load real websites from your API.
// If API doesn’t exist yet, it will fall back to demo items.
async function fetchWebsites(): Promise<BusinessSite[]> {
  try {
    const res = await fetchWithCookies("/api/websites");
    if (!res.ok) throw new Error("no websites api");

    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items;
    if (!Array.isArray(items)) throw new Error("bad websites payload");

    // IMPORTANT:
    // Adjust mapping to your real shape.
    // Below is a safe guess.
    return items.map((w: any) => {
      const domain =
        w.primaryDomain?.[0] ||
        w.primaryDomain ||
        w.systemSubdomain ||
        w.domain ||
        w.name ||
        "website";

      const platform: "wordpress" | "code" =
        (w.platform || w.cms) === "wordpress" ? "wordpress" : "code";

      const hasEmail = Boolean(w.hasEmail ?? w.emailEnabled ?? false);

      return {
        id: String(w._id || w.id || domain),
        domain,
        platform,
        hasEmail,
        manageDomainHref: `/admin/domains?website=${encodeURIComponent(
          String(w._id || w.id || ""),
        )}`,
        manageEmailHref: `/admin/emails?website=${encodeURIComponent(
          String(w._id || w.id || ""),
        )}`,
        setupEmailHref: `/admin/emails/setup?website=${encodeURIComponent(
          String(w._id || w.id || ""),
        )}`,
        dashboardHref: `/admin/dashboard?website=${encodeURIComponent(
          String(w._id || w.id || ""),
        )}`,
        wordpressAdminHref:
          platform === "wordpress"
            ? `/admin/wordpress?website=${encodeURIComponent(
                String(w._id || w.id || ""),
              )}`
            : undefined,
        iconStyle: platform === "wordpress" ? "wp" : "code",
      } satisfies BusinessSite;
    });
  } catch {
    // ✅ Demo fallback (matches screenshot)
    return [
      {
        id: "1",
        domain: "bravvionsports.com",
        platform: "wordpress",
        hasEmail: true,
        manageDomainHref: "/admin/domains",
        manageEmailHref: "/admin/emails",
        dashboardHref: "/admin/dashboard",
        wordpressAdminHref: "/wp-admin",
        iconStyle: "wp",
      },
      {
        id: "2",
        domain: "livegoodyear.creativeconsult.co.in",
        platform: "code",
        hasEmail: false,
        manageDomainHref: "/admin/domains",
        setupEmailHref: "/admin/emails/setup",
        dashboardHref: "/admin/dashboard",
        iconStyle: "code",
      },
      {
        id: "3",
        domain: "creativeconsult.co.in",
        platform: "wordpress",
        hasEmail: true,
        manageDomainHref: "/admin/domains",
        manageEmailHref: "/admin/emails",
        dashboardHref: "/admin/dashboard",
        wordpressAdminHref: "/wp-admin",
        iconStyle: "wp",
      },
    ];
  }
}

/* ------------------------------------------
   Types
------------------------------------------ */

export type QuickStat = {
  title: string;
  value: number;
  href: string;
  icon: ElementType;
};

export type ActionCard = {
  title: string;
  desc: string;
  href: string;
  icon: ElementType;
  cta: string;
};

/* ------------------------------------------
   UI Helpers
------------------------------------------ */

function SiteIcon({ style }: { style?: "wp" | "code" }) {
  const isWP = style === "wp";
  return (
    <div
      className={[
        "h-16 w-16 rounded-2xl grid place-items-center shrink-0",
        isWP ? "bg-[#0b6d8e]" : "bg-[#111214]",
      ].join(" ")}
    >
      {isWP ? (
        <div className="h-9 w-9 rounded-md border-2 border-white grid place-items-center text-white font-bold">
          W
        </div>
      ) : (
        <div className="h-9 w-9 rounded-lg border-2 border-white grid place-items-center text-white font-bold">
          {"</>"}
        </div>
      )}
    </div>
  );
}

function PillButton({
  href,
  icon: Icon,
  label,
  variant = "secondary",
  className = "",
}: {
  href: string;
  icon: ElementType;
  label: string;
  variant?: "secondary" | "outline";
  className?: string;
}) {
  return (
    <Button
      asChild
      variant={variant}
      className={`h-10 rounded-md px-4 text-sm font-semibold text-white ${className}`}
    >
      <Link href={href} className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}

/* ------------------------------------------
   Page
------------------------------------------ */

import BusinessPage from "../admin/websites/[website]/page";
export default async function AdminIndex() {
  const session = await auth();

  // Server-side authentication check
  if (!session) {
    redirect("/auth/signin");
  }


  
  return (
    <>
      <GetAllAgency />
      <GetAllBusiness />
      <GetAllWebsites />
     {session?.user &&
     (session?.user?.role ==="superadmin" || session?.user?.role ==="agency") ?
      <MinorComp sessionUser={session?.user} /> : 
      <BusinessPage/>
      }
    </>
  );
}
