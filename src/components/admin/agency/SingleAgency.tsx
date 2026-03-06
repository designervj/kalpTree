

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo, type ElementType } from "react";
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
  Image,
  Palette,
  Settings,
  Plus,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@/store/store";

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

function BusinessIcon({
  colors,
}: {
  colors?: { primary?: string; secondary?: string };
}) {
  const primaryColor = colors?.primary || "#6366f1";

  return (
    <div
      className="h-16 w-16 rounded-2xl grid place-items-center shrink-0 shadow-sm"
      style={{ backgroundColor: primaryColor }}
    >
      <Building2 className="h-8 w-8 text-white" />
    </div>
  );
}

function PillButton({
  href,
  icon: Icon,
  label,
  variant = "outline",
  className = "",
}: {
  href: string;
  icon: ElementType;
  label: string;
  variant?: "secondary" | "outline";
  className?: string;
}) {
  return (
    <Button asChild variant={variant} className={className}>
      <Link href={href} className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${isActive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-slate-100 text-slate-700 border border-slate-200"
        }`}
    >
      {isActive ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </div>
  );
}

export default function AdminIndex() {
  const param = useParams();
  const agencyId = param.id;

  const { allBusiness } = useSelector((state: RootState) => state.business);

  const business_related_agencies = useMemo(() => {
    return allBusiness.filter((d) => d.tenantId == agencyId);
  }, [allBusiness, agencyId]);

  const stats: QuickStat[] = useMemo(
    () => [
      {
        title: "Businesses",
        value: business_related_agencies.length,
        href: "/admin/businesses",
        icon: Globe,
      },
      {
        title: "Active Plans",
        value: business_related_agencies.filter(
          (b) => b.subscriptionStatus === "active"
        ).length,
        href: "/admin/subscriptions",
        icon: CheckCircle2,
      },
      {
        title: "Websites Enabled",
        value: business_related_agencies.filter(
          (b) => b.features?.websiteEnabled
        ).length,
        href: "/admin/websites",
        icon: Globe,
      },
      {
        title: "E-commerce Enabled",
        value: business_related_agencies.filter(
          (b) => b.features?.ecommerceEnabled
        ).length,
        href: "/admin/ecommerce",
        icon: ShoppingCart,
      },
    ],
    [business_related_agencies]
  );

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
      icon: Image,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[28px] font-semibold text-slate-900">
          Welcome to Agency dashboard
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
              Host up to 300 sites on one plan with full site isolation,
              per-site access control, and 24/7 priority support — built to save
              you time and costs.
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

        {/* Quick Tools */}
        <Card className="rounded-2xl border bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-slate-700" />
              <div className="text-base font-semibold text-slate-900">
                Quick tools
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Common actions to get things done faster.
            </p>

            <div className="mt-5 space-y-2">
              {[
                { href: "/admin/pages", label: "Manage pages", icon: FileText },
                {
                  href: "/admin/branding/logo",
                  label: "Branding",
                  icon: Palette,
                },
                { href: "/admin/media", label: "Media library", icon: Image },
                {
                  href: "/admin/ecommerce/orders",
                  label: "Orders",
                  icon: ShoppingCart,
                },
              ].map((x) => {
                const Icon = x.icon;
                return (
                  <Link key={x.href} href={x.href} className="block">
                    <div className="flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-3 hover:bg-slate-100 transition">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-slate-700" />
                        <span className="text-sm font-medium text-slate-900">
                          {x.label}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At a Glance */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[22px] font-semibold text-slate-900">
            At a glance
          </h3>
          <p className="text-sm text-muted-foreground">
            Business metrics across your agency workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.title}
                className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Icon className="h-4 w-4" />
                        <span>{s.title}</span>
                      </div>
                      <div className="mt-1 text-[42px] font-semibold text-slate-900">
                        {s.value}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Your Business */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-[22px] font-semibold text-slate-900">
              Your businesses
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage all businesses under your agency account.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-md">
              <Link href="/admin/businesses">
                <AiOutlineEye className="h-4 w-4" />
                View all businesses
              </Link>
            </Button>

            <Button asChild className="rounded-md">
              <Link href="/admin/businesses/new">
                <Plus className="h-4 w-4" />
                Add a business
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {business_related_agencies.length > 0 ? (
            business_related_agencies.map((business) => {
              const hasLogo = business.branding?.logo;
              const primaryColor =
                business.branding?.primary_color ||
                business.branding?.colors?.primary;
              const link = `/admin/businesses/${business._id}`;
              const industry = business.businessdetails?.industry;
              const foundedYear = business.businessdetails?.founded_year;

              return (
                <Card
                  key={String(business._id)}
                  className="rounded-3xl border bg-white shadow-sm hover:shadow-md transition"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-5 flex-1">
                        {hasLogo ? (
                          <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border bg-slate-50">
                            <img
                              src={business?.branding?.logo}
                              alt={business.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <BusinessIcon colors={{ primary: primaryColor }} />
                        )}


                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-3 flex-wrap">
                            <div className="text-[24px] font-semibold text-slate-900">
                              {business.name}
                            </div>
                            <StatusBadge
                              status={business?.status!}
                            />
                          </div>

                          {business.businessdetails?.tagline && (
                            <p className="mt-1 text-sm text-slate-600">
                              {business.businessdetails.tagline}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            {industry && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md">
                                <Building2 className="h-3 w-3" />
                                {industry}
                              </span>
                            )}
                            {foundedYear && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md">
                                <Calendar className="h-3 w-3" />
                                Founded {foundedYear}
                              </span>
                            )}
                            <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md">
                              <Calendar className="h-3 w-3" />
                              Joined {formatDate(business?.createdAt!)}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <PillButton
                              href={link}
                              icon={Globe}
                              label="View dashboard"
                              variant="outline"
                            />

                            {business.email && (
                              <PillButton
                                href={`mailto:${business.email}`}
                                icon={Mail}
                                label={business.email}
                                variant="outline"
                              />
                            )}

                            {business.businessdetails?.business_website_url && (
                              <Button asChild variant="outline" size="sm">
                                <Link
                                  href={`https://${business.businessdetails.business_website_url}`}
                                  target="_blank"
                                  className="flex items-center gap-2"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Visit site
                                </Link>
                              </Button>
                            )}
                          </div>

                          {/* Feature Pills */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {business.features?.websiteEnabled && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200">
                                Website
                              </span>
                            )}
                            {business.features?.ecommerceEnabled && (
                              <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-200">
                                E-commerce
                              </span>
                            )}
                            {business.features?.blogEnabled && (
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200">
                                Blog
                              </span>
                            )}
                            {business.features?.invoicesEnabled && (
                              <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-md border border-amber-200">
                                Invoices
                              </span>
                            )}
                          </div>
                        </div>



                      </div>

                      <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                        <Button
                          asChild
                          className="h-10 rounded-xl px-5 text-sm font-semibold"
                        >
                          <Link href={link}>
                            Open dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="rounded-2xl border bg-slate-50">
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No businesses yet
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Get started by creating your first business account.
                </p>
                <Button asChild>
                  <Link href="/admin/businesses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first business
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Center */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-[22px] font-semibold text-slate-900">
              Action center
            </h3>
            <p className="text-sm text-muted-foreground">
              Set up the most important parts of your website.             </p>
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
              <Button variant="secondary" className="rounded-md" asChild>
                <Link href="/admin/domains">
                  <Globe className="h-4 w-4" />
                  Manage domain
                </Link>
              </Button>

              <Button variant="secondary" className="rounded-md" asChild>
                <Link href="/admin/emails">
                  <Mail className="h-4 w-4" />
                  Manage email
                </Link>
              </Button>

              <Button variant="outline" className="rounded-md" asChild>
                <Link href="/admin/analytics">
                  <Activity className="h-4 w-4" />
                  View analytics
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
