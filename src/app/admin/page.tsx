import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import type { ElementType } from "react";
import {
  ExternalLink,
  Globe,
  Mail,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Activity,
  ShoppingCart,
  FileText,
  Image as ImageIcon,
  Palette,
  Settings,
  Plus,
} from "lucide-react";
import GetAllAgency from "@/components/admin/agency/GetAllAgency";
import GetAllBusiness from "@/components/admin/business/GetAllBusiness";
import ShowListOfBusiness from "@/components/adminDashBoard/ShowListOfBusiness";
import QuickTool from "@/components/adminDashBoard/QuickTool";
import GlanceCount from "@/components/adminDashBoard/GlanceCount";
import GetAllWebsites from "@/components/admin/website/GetAllWebsites";

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
          String(w._id || w.id || "")
        )}`,
        manageEmailHref: `/admin/emails?website=${encodeURIComponent(
          String(w._id || w.id || "")
        )}`,
        setupEmailHref: `/admin/emails/setup?website=${encodeURIComponent(
          String(w._id || w.id || "")
        )}`,
        dashboardHref: `/admin/dashboard?website=${encodeURIComponent(
          String(w._id || w.id || "")
        )}`,
        wordpressAdminHref:
          platform === "wordpress"
            ? `/admin/wordpress?website=${encodeURIComponent(
              String(w._id || w.id || "")
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

type QuickStat = {
  title: string;
  value: number;
  href: string;
  icon: ElementType;
};

type ActionCard = {
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

export default async function AdminIndex() {
  const [agencies, businesses, websitesData, orders, categories, tags] =
    await Promise.all([
      fetchCount("/api/agencies"),
      fetchCount("/api/businesses"),
      fetchCount("/api/websites"),
      fetchCount("/api/orders"),
      fetchCount("/api/categories"),
      fetchCount("/api/blog_tags"),
    ]);


  const actions: ActionCard[] = [
    {
      title: "Create a new page",
      desc: "Start building your website content quickly with blocks.",
      href: "/admin/pages",
      icon: FileText,
      cta: "Create page",
    },
    {
      title: "Upload media",
      desc: "Add images and assets for banners, pages, and products.",
      href: "/admin/media",
      icon: ImageIcon,
      cta: "Open media",
    },
    {
      title: "Branding setup",
      desc: "Update logo, colors, typography and theme presets.",
      href: "/admin/branding/colors",
      icon: Palette,
      cta: "Open branding",
    },
    {
      title: "Configure store",
      desc: "Set payment, shipping, taxes and invoices in one place.",
      href: "/admin/ecommerce/settings",
      icon: Settings,
      cta: "Open settings",
    },
  ];

  return (
    <>
      <GetAllAgency />
      <GetAllBusiness />
      <GetAllWebsites/>
      <div className="w-full space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-[28px] font-semibold text-slate-900">
            Welcome to Admin dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to manage website, branding, products & marketing.
          </p>
        </div>

        {/* Top Row: Promo + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Promo */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border bg-black shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(124,58,237,0.95),rgba(0,0,0,0.9)_55%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

            <div className="relative z-10 p-7 lg:p-9 text-white">
              <span className="w-fit rounded-md bg-white/90 text-black px-3 py-1 text-xs font-medium">
                For agencies
              </span>

              <h3 className="mt-4 text-[34px] leading-tight font-semibold text-white">
                Scale smarter with the Agency plan
              </h3>

              <p className="mt-3 max-w-2xl text-white/80 leading-relaxed">
                Host up to 300 sites on one plan with full site isolation, per-site
                access control, and 24/7 priority support — built to save you time
                and costs.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button className="rounded-xl px-6">Try now</Button>
                <div className="flex items-center gap-2 text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-sm text-emerald-200/90">
                    30-day money-back guarantee
                  </span>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-white/90" />
                    <div className="text-[15px] font-semibold">
                      Per-website sharing
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-white/90" />
                    <div className="text-[15px] font-semibold">
                      30% faster load time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tools (right) */}
          <QuickTool />

        </div>


        {/* ✅ AT A GLANCE (counts moved here so "Your business" stays like screenshot) */}
         <GlanceCount/>


        {/* ✅ YOUR BUSINESS (Hostinger-like list design) */}
        <ShowListOfBusiness />



        {/* Action Center */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-[22px] font-semibold text-slate-900">
                Action center
              </h3>
              <p className="text-sm text-muted-foreground">
                Set up the most important parts of your website.
              </p>
            </div>

            <Link href="/admin/settings/general">
              <Button variant="outline" className="rounded-md">
                Open settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.title} href={a.href} className="block">
                  <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-11 w-11 rounded-2xl bg-slate-100 grid place-items-center">
                          <Icon className="h-5 w-5 text-slate-800" />
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-semibold text-slate-900">
                            {a.title}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {a.desc}
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-900">
                            <span>{a.cta}</span>
                            <ArrowRight className="h-4 w-4 text-slate-500" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Helpful resources */}
        <Card className="rounded-2xl border bg-white shadow-sm mb-20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-base font-semibold text-slate-900">
                  Helpful resources
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Need help setting up? Use quick links below.
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" className="rounded-md text-white" asChild>
                  <Link href="/admin/domains">
                    <Globe className="mr-2 h-4 w-4" />
                    Manage domain
                  </Link>
                </Button>

                <Button variant="secondary" className="rounded-md text-white" asChild>
                  <Link href="/admin/emails">
                    <Mail className="mr-2 h-4 w-4" />
                    Manage email
                  </Link>
                </Button>

                <Button variant="outline" className="rounded-md" asChild>
                  <Link href="/admin/analytics">
                    <Activity className="mr-2 h-4 w-4" />
                    View analytics
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


