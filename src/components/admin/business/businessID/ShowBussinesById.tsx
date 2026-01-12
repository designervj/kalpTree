
"use client"
import React from 'react'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock,
    CreditCard,
    ExternalLink,
    Globe,
    LayoutDashboard,
    Mail,
    Palette,
    Settings,
    ShieldCheck,
    Sparkles,
    Store,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { IBusiness } from '@/models/business';
import { useSearchParams } from 'next/navigation';
import { toCreateHref } from '@/lib/utils/url-helpers';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

type Props = {
    business: IBusiness;
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

const ROLE_MAP = {
    superadmin: "",
    agency: "",
    business: "",
} as const;

type Role = keyof typeof ROLE_MAP;
const ShowBussinesById = ({ business }: Props) => {

    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    console.log(id);
    const primary = business.branding?.colors?.primary || "#111827";
    const secondary = business.branding?.colors?.secondary || "#e5e7eb";
    const { user } = useSelector((state: RootState) => state.user);
    return (
        <>
            <div className="w-full max-full space-y-6">
                {/* HERO */}
                <div className="relative overflow-hidden rounded-md border bg-white shadow-sm">
                    <div className="absolute inset-0 bg-white" />
                    <div className="relative p-6 md:p-8">
                        {/* Breadcrumb + Actions */}
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Link href="/admin" className="hover:text-slate-900 transition">
                                        Admin
                                    </Link>
                                    <span>/</span>
                                    <Link
                                        href="/admin/businesses"
                                        className="hover:text-slate-900 transition"
                                    >
                                        Businesses
                                    </Link>
                                    <span>/</span>
                                    <span className="text-slate-900">
                                        {business?.name || "Business"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="h-12 w-12 rounded-md bg-slate-900 text-white grid place-items-center font-semibold">
                                        {(business.name?.[0] || "B").toUpperCase()}
                                        {(business.name?.[1] || "Z").toUpperCase()}
                                    </div>

                                    <div>
                                        <h1 className="text-[26px] md:text-[32px] font-semibold text-slate-900 leading-tight">
                                            {business.name || "Business"}
                                        </h1>
                                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                                            <Badge
                                                className="rounded-full text-white"
                                                variant="secondary"
                                            >
                                                {(business.plan || "—").toUpperCase()}
                                            </Badge>
                                            {statusPill(business.subscriptionStatus)}
                                            {statusPill(business.status)}
                                            {business.email ? (
                                                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-4 w-4" />
                                                    {business.email}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="rounded-full" asChild>
                                    <Link href="/admin/businesses">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Link>
                                </Button>

                                <Button className="rounded-full" asChild>
                                    <Link href={`/admin/businesses/${id}/edit`}>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Manage
                                    </Link>
                                </Button>
                            </div>
                        </div>


                        {/* STATS STRIP */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="rounded-md border bg-gray-100 p-4">
                                <div className="text-xs text-muted-foreground font-semibold">
                                    Primary domain
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <Globe className="h-4 w-4 text-slate-600" />
                                    <span className="truncate">{business.websites?.[0]?.primaryDomain?.[0] || "—"}</span>
                                </div>
                            </div>

                            <div className="rounded-md border bg-gray-100 p-4">
                                <div className="text-xs text-muted-foreground font-semibold">
                                    Websites
                                </div>
                                <div className="mt-2 text-2xl font-semibold text-slate-900">
                                    {business.websites?.length || 0}
                                </div>
                                <div className="text-xs text-muted-foreground font-semibold">
                                    Total projects
                                </div>
                            </div>

                            <div className="rounded-md border bg-gray-100 p-4">
                                <div className="text-xs text-muted-foreground font-semibold">
                                    Domain verified
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    {business.customDomainVerified ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-slate-400" />
                                    )}
                                    {business.customDomainVerified ? "Verified" : "Not verified"}
                                </div>
                            </div>

                            <div className="rounded-md border bg-gray-100 p-4">
                                <div className="text-xs text-muted-foreground font-semibold">
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

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* LEFT */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* QUICK ACTIONS */}
                        <Card className="rounded-md border bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <LayoutDashboard className="h-5 w-5 text-slate-700" />
                                    Quick actions
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Fast shortcuts for common setup tasks.
                                </p>
                            </CardHeader>
                            <CardContent className="p-5 pt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Button className="rounded-md h-12 justify-between" asChild>
                                        <Link href={`/admin/businesses/${id}/websites`}>
                                            <span className="inline-flex items-center gap-2">
                                                <Store className="h-4 w-4" /> Manage websites
                                            </span>
                                            <ExternalLink className="h-4 w-4 opacity-70" />
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="rounded-md h-12 justify-between"
                                        asChild
                                    >
                                        <Link href={`/admin/businesses/${id}/domains`}>
                                            <span className="inline-flex items-center gap-2">
                                                <Globe className="h-4 w-4" /> Domain & SSL
                                            </span>
                                            <ExternalLink className="h-4 w-4 opacity-60" />
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="rounded-md h-12 justify-between"
                                        asChild
                                    >
                                        <Link href={`/admin/businesses/${id}/branding`}>
                                            <span className="inline-flex items-center gap-2">
                                                <Palette className="h-4 w-4" /> Branding
                                            </span>
                                            <ExternalLink className="h-4 w-4 opacity-60" />
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="rounded-md h-12 justify-between"
                                        asChild
                                    >
                                        <Link href={`/admin/businesses/${id}/billing`}>
                                            <span className="inline-flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" /> Billing
                                            </span>
                                            <ExternalLink className="h-4 w-4 opacity-60" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* WEBSITES */}
                        <Card className="rounded-md border bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Store className="h-5 w-5 text-slate-700" />
                                    Websites
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Linked websites for this business.
                                </p>
                            </CardHeader>

                            <CardContent className="p-5 pt-0 space-y-3">
                                {business.websites && business.websites.length ? (
                                    business.websites.map((w: any, idx: number) => {
                                        const dom = w.primaryDomain?.[0] || "—";
                                        const domain = w.primaryDomain.find((d: string) =>
                                            d.includes("kalptree.xyz")
                                        );
                                        let href = toCreateHref(
                                            domain,
                                            business?._id?.toString() ?? null,
                                            business?.tenantId?.toString() ?? null,
                                            user?.role!
                                        );
                                        return (
                                            <div
                                                key={`${w.name || "website"}-${idx}`}
                                                className="rounded-md border bg-slate-50 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-base font-semibold text-slate-900 truncate">
                                                                {w.name || "Website"}
                                                            </div>
                                                            {statusPill(w.status)}
                                                            <Badge
                                                                className="rounded-full text-white"
                                                                variant="secondary"
                                                            >
                                                                {w.serviceType || "—"}
                                                            </Badge>
                                                        </div>

                                                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Globe className="h-4 w-4" />
                                                            <span className="truncate">{dom}</span>
                                                            {dom !== "—" ? (
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

                                                    <div className="text-xs text-muted-foreground font-semibold space-y-1">
                                                        <div>
                                                            <span className="font-medium text-slate-700">
                                                                Created:
                                                            </span>{" "}
                                                            {fmtDate(w.createdAt)}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-slate-700">
                                                                Updated:
                                                            </span>{" "}
                                                            {fmtDate(w.updatedAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-md border bg-slate-50 p-6 text-center">
                                        <div className="text-sm font-semibold text-slate-900">
                                            No websites yet
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            Add a website to start managing pages, domains and
                                            ecommerce.
                                        </div>
                                        <div className="mt-4">
                                            <Button className="rounded-full" asChild>
                                                <Link
                                                    href={`/admin/businesses/${id}/websites/new`}
                                                >
                                                    Add Website
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* FEATURES */}
                        <Card className="rounded-md border bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-slate-700" />
                                    Features & modules
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    What is enabled for this business.
                                </p>
                            </CardHeader>

                            <CardContent className="p-5 pt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FeatureRow
                                        label="Website"
                                        enabled={business.features?.websiteEnabled}
                                    />
                                    <FeatureRow
                                        label="Ecommerce"
                                        enabled={business.features?.ecommerceEnabled}
                                    />
                                    <FeatureRow
                                        label="Blog"
                                        enabled={business.features?.blogEnabled}
                                    />
                                    <FeatureRow
                                        label="Invoices"
                                        enabled={business.features?.invoicesEnabled}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* BRANDING */}
                        <Card className="rounded-md border bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-slate-700" />
                                    Branding
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Primary & secondary theme colors.
                                </p>
                            </CardHeader>

                            <CardContent className="p-5 pt-0 space-y-4">
                                <div className="rounded-md border bg-slate-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold text-slate-900">
                                            Primary
                                        </div>
                                        <div className="text-xs text-muted-foreground font-semibold">
                                            {primary}
                                        </div>
                                    </div>
                                    <div className="h-10 rounded-md border bg-white overflow-hidden">
                                        <div
                                            className="h-full w-full"
                                            style={{ backgroundColor: primary }}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold text-slate-900">
                                            Secondary
                                        </div>
                                        <div className="text-xs text-muted-foreground font-semibold">
                                            {secondary}
                                        </div>
                                    </div>
                                    <div className="h-10 rounded-md border bg-white overflow-hidden">
                                        <div
                                            className="h-full w-full"
                                            style={{ backgroundColor: secondary }}
                                        />
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="rounded-full w-full bg-primary/10 hover:no-underline"
                                    asChild
                                >
                                    <Link href={`/admin/businesses/${id}/branding`}>
                                        Manage branding
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* SETTINGS */}
                        <Card className="rounded-md border bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-slate-700" />
                                    Settings
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Locale, currency and timezone.
                                </p>
                            </CardHeader>

                            <CardContent className="p-5 pt-0 space-y-3">
                                <div className="rounded-md border bg-slate-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-700">Locale</div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {business.settings?.locale || "—"}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-700">Currency</div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {business.settings?.currency || "—"}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-700">Timezone</div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {business.settings?.timezone || "—"}
                                        </div>
                                    </div>
                                </div>

                                <Button variant="outline" className="rounded-full w-full" asChild>
                                    <Link href={`/admin/businesses/${id}/settings`}>
                                        Edit settings
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* BUSINESS META */}
                        <Card className="rounded-md border bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-slate-700" />
                                    Business info
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    System metadata (safe view).
                                </p>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span className="font-medium text-slate-900">
                                        {fmtDate(business.createdAt)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Updated</span>
                                    <span className="font-medium text-slate-900">
                                        {fmtDate(business.updatedAt)}
                                    </span>
                                </div>
                                <Separator />
                                <div className="text-xs text-muted-foreground font-semibold">
                                    Logged in as{" "}
                                    <span className="font-medium text-slate-900">
                                        {user?.name || "User"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShowBussinesById