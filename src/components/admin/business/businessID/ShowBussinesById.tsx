"use client";
import React, { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  Palette,
  ShieldCheck,
  Sparkles,
  Store,
  XCircle,
  LayoutGrid,
  ShoppingCart,
  Megaphone,
  Calendar,
  Languages,
  Users,
  Icon,
  FileText,
  ImageIcon,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { IBusiness } from "@/models/business";
import { useSearchParams } from "next/navigation";
import { toCreateHref } from "@/lib/utils/url-helpers";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BusinessModal } from "./BusinessModal";
import { IUser } from "@/models/user";
import GetAllAgency from "../../agency/GetAllAgency";
import GetAllBusiness from "../GetAllBusiness";
import GetAllWebsites from "../../website/GetAllWebsites";
import { ActionCard } from "@/app/admin/page";

type Props = {
  business: IBusiness;
  user: IUser;
};

// Service type mapping
const SERVICE_OPTIONS = [
  {
    value: "WEBSITE_ONLY",
    title: "Website Only",
    desc: "Basic website hosting and management with space 1GB",
    Icon: Globe,
  },
  {
    value: "WEBSITE_CATALOGUE",
    title: "Website and Catalogue",
    desc: "Website hosting and catalogue with space 2GB",
    Icon: LayoutGrid,
  },
  {
    value: "WEBSITE_CATALOGUE_ECOMMERCE",
    title: "Website, Catalogue and E-commerce",
    desc: "Website hosting + catalogue + e-commerce with space 3GB",
    Icon: ShoppingCart,
  },
  {
    value: "WEBSITE_CATALOGUE_ECOMMERCE_MARKETING",
    title: "Website, Catalogue, E-commerce and Marketing",
    desc: "Everything included with space 5GB and marketing",
    Icon: Megaphone,
  },
];



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




function FeaturePill({
  label,
  enabled,
}: {
  label: string;
  enabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition-colors ${enabled
          ? "border-emerald-200 bg-white"
          : "border-slate-200 bg-white opacity-80"
        }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`h-2.5 w-2.5 rounded-full ${enabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
        />
        <span className="text-sm font-medium text-slate-800">{label}</span>
      </div>

      <div
        className={`inline-flex items-center gap-1 text-xs font-medium ${enabled ? "text-emerald-700" : "text-slate-500"
          }`}
      >
        {enabled ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Enabled
          </>
        ) : (
          <>
            <XCircle className="h-3.5 w-3.5" />
            Disabled
          </>
        )}
      </div>
    </div>
  );
}


function getServiceTypeInfo(serviceType?: string) {
  const service = SERVICE_OPTIONS.find((opt) => opt.value === serviceType);
  return (
    service || {
      value: serviceType || "—",
      title: serviceType || "—",
      desc: "Unknown service type",
      Icon: Globe,
    }
  );
}

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
          : "bg-slate-700 text-white hover:bg-slate-700",
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

const ShowBussinesById = ({ business, user }: Props) => {
  const { businessWebsite, allBusiness } = useSelector(
    (state: RootState) => state.business,
  );

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [modal, setModal] = useState<null | string>(null);
  const [open, setOpen] = useState(false);

  const handleOpenModal = (modaltype: string) => {
    setModal(modaltype);
    setOpen(true);
  };

  // The website is now embedded directly inside businessWebsite
  const websiteData = businessWebsite?.website;
  const primaryDomain = websiteData?.primaryDomain?.[0] || "—";

  const kalptreeDomain = websiteData?.primaryDomain?.find((d: string) =>
    d?.includes("kalptree.xyz"),
  );

  const agencyId = useMemo(() => {
    if (user?.role === "agency") {
      return user?.tenantId?.toString() ?? null;
    }

    return businessWebsite?.tenantId ?? null;
  }, [user, allBusiness, businessWebsite]);

  const tenantId = businessWebsite?.tenantId?.toString() ?? null;

  const href = toCreateHref(kalptreeDomain!, tenantId, agencyId, user?.role!);

  const manageWebsiteHref = toCreateHref(
    `${kalptreeDomain}/website/pages`,
    tenantId,
    agencyId,
    user?.role!,
  );

  const brandingHref = toCreateHref(
    `${kalptreeDomain}/branding/typography`,
    tenantId,
    agencyId,
    user?.role!,
  );

  const domainDnsHref = toCreateHref(
    `${kalptreeDomain}/settings/domain-dns`,
    tenantId,
    agencyId,
    user?.role!,
  );

  const usersHref = toCreateHref(
    `${kalptreeDomain}/users/all-user`,
    tenantId,
    agencyId,
    user?.role!,
  );

  const serviceInfo = getServiceTypeInfo(websiteData?.serviceType);
  const ServiceIcon = serviceInfo.Icon;

  return (
    <>
      <GetAllAgency />
      <GetAllBusiness />
      <GetAllWebsites />

      <BusinessModal
        open={open}
        business={business}
        onClose={() => setOpen(false)}
      />

      <div className="w-full space-y-6 p-6">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-md border bg-white shadow-sm">
          <div className="absolute inset-0 bg-white" />
          <div className="relative p-6 md:p-8">
            {/* Breadcrumb + Actions */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link
                    href="/admin"
                    className="transition hover:text-slate-900"
                  >
                    Admin
                  </Link>
                  <span>/</span>
                  <Link
                    href="/admin/businesses"
                    className="transition hover:text-slate-900"
                  >
                    Businesses
                  </Link>
                  <span>/</span>
                  <span className="text-slate-900">
                    {business?.name || "Business"}
                  </span>
                </div>

                {/* Business Name & Status */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-slate-900 text-lg font-semibold text-white">
                    {(business.name?.[0] || "B").toUpperCase()}
                    {(business.name?.[1] || "Z").toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="text-[26px] font-semibold leading-tight text-slate-900 md:text-[32px]">
                      {business.name || "Business"}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge
                        className="rounded-full text-primary"
                        variant="outline"
                      >
                        {(business.plan || "—").toUpperCase()}
                      </Badge>
                      {statusPill(business.subscriptionStatus)}
                      {business.email ? (
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {business.email}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Website Domain */}
                {websiteData && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{primaryDomain}</span>
                    {primaryDomain !== "—" ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-900 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-full px-6" asChild>
                  <Link href="/admin/businesses">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>

                <Button className="rounded-full px-6" asChild>
                  <span onClick={() => handleOpenModal("business")}>
                    <Sparkles className="h-4 w-4" />
                    Edit
                  </span>
                </Button>
              </div>
            </div>

            {/* STATS STRIP */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md border bg-gray-100 p-4">
                <div className="text-xs font-semibold text-muted-foreground">
                  Primary domain
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Globe className="h-4 w-4 text-slate-600" />
                  <span className="truncate">{primaryDomain}</span>
                </div>
              </div>

              <div className="rounded-md border bg-gray-100 p-4">
                <div className="text-xs font-semibold text-muted-foreground">
                  Websites
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {websiteData ? 1 : 0}
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  Total projects
                </div>
              </div>

              <div className="rounded-md border bg-gray-100 p-4">
                <div className="text-xs font-semibold text-muted-foreground">
                  Last updated
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Clock className="h-4 w-4 text-slate-600" />
                  {fmtDate(business?.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            {/* WEBSITE */}
            <Card className="rounded-md border bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Store className="h-5 w-5 text-slate-700" />
                  Website
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Linked website for this business.
                </p>
              </CardHeader>

              <CardContent className="space-y-3 p-5 pt-0">
                {websiteData ? (
                  <div className="rounded-md border bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                    <div className="space-y-4">
                      {/* Header Row */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <div className="truncate text-base font-semibold text-slate-900">
                              {websiteData.name || "Website"}
                            </div>
                            {statusPill(businessWebsite?.status)}
                          </div>
                          {/* Domain */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span className="truncate">{primaryDomain}</span>
                            {primaryDomain !== "—" ? (
                              <Link
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-slate-900 hover:underline"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            ) : null}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-1 text-xs font-semibold text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium text-slate-700">
                              Created:
                            </span>
                            {fmtDate(businessWebsite?.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium text-slate-700">
                              Updated:
                            </span>
                            {fmtDate(businessWebsite?.updatedAt)}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Service Type & Configuration */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Service Type */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold uppercase text-muted-foreground">
                            Service Type
                          </div>
                          <div className="flex items-start gap-3 rounded-md border bg-white p-3">
                            <ServiceIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-900">
                                {serviceInfo.title}
                              </div>
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                {serviceInfo.desc}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Configuration */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold uppercase text-muted-foreground">
                            Configuration
                          </div>
                          <div className="space-y-2 rounded-md border bg-white p-3">
                            {/* Languages */}
                            {websiteData.lang &&
                              websiteData.lang.length > 0 && (
                                <div className="flex items-center justify-between gap-2 text-xs">
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <Languages className="h-3 w-3" />
                                    Languages
                                  </span>
                                  <span className="text-right font-medium text-slate-900">
                                    {websiteData.lang
                                      .map((l: any) => l.name)
                                      .join(", ")
                                      .toUpperCase()}
                                    {websiteData.lang.find(
                                      (l: any) => l.default,
                                    ) && (
                                        <Badge
                                          className="ml-1 h-4 text-[10px]"
                                          variant="outline"
                                        >
                                          Default:{" "}
                                          {websiteData.lang
                                            .find((l: any) => l.default)
                                            ?.name?.toUpperCase()}
                                        </Badge>
                                      )}
                                  </span>
                                </div>
                              )}

                            {/* Coming Soon Status */}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Coming Soon
                              </span>
                              <span className="font-medium text-slate-900">
                                {websiteData.isComingSoon ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50"
                                  >
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50"
                                  >
                                    Live
                                  </Badge>
                                )}
                              </span>
                            </div>

                            {/* System Subdomain */}
                            {websiteData?.systemSubdomain && (
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="text-muted-foreground">
                                  System Subdomain
                                </span>
                                <span className="max-w-[200px] truncate font-medium text-slate-900">
                                  {websiteData?.systemSubdomain}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Website Action Shortcuts */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button
                          className="h-12 justify-between rounded-md"
                          asChild
                        >
                          <Link
                            href={manageWebsiteHref}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Store className="h-4 w-4" /> Manage website
                            </span>
                            <ExternalLink className="h-4 w-4 opacity-70" />
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-12 justify-between rounded-md"
                          asChild
                        >
                          <Link
                            href={domainDnsHref}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Globe className="h-4 w-4" /> Domain & SSL
                            </span>
                            <ExternalLink className="h-4 w-4 opacity-60" />
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-12 justify-between rounded-md"
                          asChild
                        >
                          <Link
                            href={brandingHref}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Palette className="h-4 w-4" /> Branding
                            </span>
                            <ExternalLink className="h-4 w-4 opacity-60" />
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-12 justify-between rounded-md"
                          asChild
                        >
                          <Link
                            href={usersHref}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Users className="h-4 w-4" /> Users
                            </span>
                            <ExternalLink className="h-4 w-4 opacity-60" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border bg-slate-50 p-6 text-center">
                    <div className="text-sm font-semibold text-slate-900">
                      No website yet
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Add a website to start managing pages, domains and
                      ecommerce.
                    </div>
                    <div className="mt-4">
                      <Button className="rounded-full" asChild>
                        <Link href={`/admin/businesses/${id}/websites/new`}>
                          Add Website
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QUICK LINKS / FEATURES */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-[20px] font-semibold text-slate-900">
                      <div className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-slate-50">
                        <ShieldCheck className="h-4.5 w-4.5 text-slate-700" />
                      </div>
                      Quick Links
                    </CardTitle>
                    <p className="mt-2 text-sm text-slate-500">
                      Manage what’s enabled and jump into the most-used business settings.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active modules
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Enabled modules */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Enabled Modules
                    </p>
                    <p className="text-xs text-slate-500">
                      {[
                        business.features?.websiteEnabled,
                        business.features?.ecommerceEnabled,
                        business.features?.blogEnabled,
                        business.features?.invoicesEnabled,
                      ].filter(Boolean).length}
                      /4 enabled
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <FeaturePill
                      label="Website"
                      enabled={business.features?.websiteEnabled}
                    />
                    <FeaturePill
                      label="Ecommerce"
                      enabled={business.features?.ecommerceEnabled}
                    />
                    <FeaturePill
                      label="Blog"
                      enabled={business.features?.blogEnabled}
                    />
                    <FeaturePill
                      label="Invoices"
                      enabled={business.features?.invoicesEnabled}
                    />
                  </div>
                </div>

                {/* Action cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {actions.map((a) => {
                    const Icon = a.icon;

                    return (
                      <Link key={a.title} href={a.href} className="group block">
                        <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
                          {/* subtle top glow */}
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-slate-50 to-transparent" />

                          <div className="relative flex h-full flex-col">
                            <div className="flex items-start gap-3">
                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 transition-colors group-hover:bg-slate-100">
                                <Icon className="h-5 w-5 text-slate-700" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h3 className="text-[16px] font-semibold leading-5 text-slate-900">
                                  {a.title}
                                </h3>
                                <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">
                                  {a.desc}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors group-hover:border-slate-300 group-hover:bg-slate-50">
                                {a.cta}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                              </span>

                              {/* optional small status/label */}
                              <span className="text-xs text-slate-400">Open</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </>
  );
};

export default ShowBussinesById;
