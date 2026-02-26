"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  ReceiptText,
  WalletCards,
  LifeBuoy,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// shadcn
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Item = {
  key: "subscriptions" | "payment-history" | "payment-methods";
  title: string;
  href: string;
  subtitle: string;
  icon: React.ElementType;
};

const NAV_ITEMS: Item[] = [
  {
    key: "subscriptions",
    title: "Subscriptions",
    href: "/billing/subscriptions",
    subtitle: "Plan, usage & renewal",
    icon: CreditCard,
  },
  {
    key: "payment-history",
    title: "Payment history",
    href: "/billing/payment-history",
    subtitle: "Invoices & downloads",
    icon: ReceiptText,
  },
  {
    key: "payment-methods",
    title: "Payment methods",
    href: "/billing/payment-methods",
    subtitle: "Cards & default method",
    icon: WalletCards,
  },
];

function getActiveItem(pathname: string | null) {
  if (!pathname) return NAV_ITEMS[0];
  return (
    NAV_ITEMS.find((x) => pathname === x.href || pathname.startsWith(x.href + "/")) ??
    NAV_ITEMS[0]
  );
}

/**
 * Usage:
 * app/billing/layout.tsx => return <BillingShell>{children}</BillingShell>
 */
export default function BillingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = useMemo(() => getActiveItem(pathname), [pathname]);

  return (

    
    <div className="min-h-screen px-3 pt-1">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.35]">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-slate-200 blur-3xl" />
        <div className="absolute top-32 right-[-200px] h-[420px] w-[420px] rounded-full bg-slate-200 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8">
        {/* main surface */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* SIDEBAR */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-6">
              <Card className="rounded-md border-slate-200/70 bg-white shadow-sm overflow-hidden">
                {/* Sidebar header */}
                <div className="px-6 pt-6 pb-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-bold text-slate-900">Billing</div>
                      <div className="mt-1 text-sm text-slate-500">
                        Manage subscription & payments
                      </div>
                    </div>

                    <Badge className="rounded-full bg-primary text-white">PRO</Badge>
                  </div>

                  {/* mini plan card */}
                  <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-500">Current plan</div>
                        <div className="mt-1 text-sm font-bold text-slate-900">
                          Pro Monthly
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Next renewal</div>
                        <div className="mt-1 text-sm font-bold text-slate-900">Jan 15</div>
                      </div>
                    </div>

                    <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full w-[48%] rounded-full bg-slate-900" />
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      Usage: <span className="font-bold text-slate-700">48%</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Nav */}
                <nav className="p-4">
                  <div className="space-y-2">
                    {NAV_ITEMS.map((it) => {
                      const isActive =
                        pathname === it.href || pathname?.startsWith(it.href + "/");
                      const Icon = it.icon;

                      return (
                        <Link
                          key={it.href}
                          href={it.href}
                          className={cn(
                            "group flex items-center gap-4 rounded-2xl border px-4 py-4 transition",
                            isActive
                              ? "border-slate-900/15 bg-slate-900/[0.04]"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-12 w-12 place-items-center rounded-2xl border transition",
                              isActive
                                ? "border-slate-900/15 bg-white"
                                : "border-slate-200 bg-slate-50 group-hover:bg-white"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                isActive ? "text-slate-900" : "text-slate-600"
                              )}
                            />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-slate-900">
                              {it.title}
                            </span>
                            <span className="block text-xs text-slate-500">
                              {it.subtitle}
                            </span>
                          </span>

                          <ArrowUpRight
                            className={cn(
                              "h-4 w-4 transition",
                              isActive
                                ? "text-slate-900 opacity-80"
                                : "text-slate-400 opacity-0 group-hover:opacity-100"
                            )}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                <Separator />

            
              </Card>
            </div>
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-8 xl:col-span-9">
            {/* RIGHT SURFACE CARD */}
            <Card className="rounded-md border-slate-200/70 bg-white shadow-sm overflow-hidden">
              {/* Top header bar (Hostinger-like) */}
              <div className="px-7 pt-6 pb-5 bg-gradient-to-b from-slate-50 to-white">
                {/* breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-600">Billing</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-slate-900 font-bold">{active.title}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-slate-900">
                      {active.title}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{active.subtitle}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-md">
                      View invoices
                    </Button>
                    <Button className="rounded-md bg-primary   hover:bg-slate-800">
                      Manage billing
                    </Button>
                  </div>
                </div>

                {/* Stats band */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard label="Plan" value="Pro" meta="Monthly billing" />
                  <StatCard label="Next charge" value="$29.00" meta="On Jan 15" />
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="text-xs text-slate-500">Status</div>
                    <div className="mt-3">
                      <Badge className="rounded-full bg-emerald-600 text-white">Active</Badge>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">Auto-renew ON</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Content well */}
              <div className="px-7 py-7">
                {/* IMPORTANT: children should render actual page UI, not empty */}
                {children}
              </div>



              
            </Card>

                {/* Help box */}
                <div className="py-4">
                  <div className="rounded-md bg-white border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <LifeBuoy className="h-4 w-4" />
                      Need help?
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      Contact support for billing assistance.
                    </div>

                    <Button className="mt-4  rounded-md bg-primary hover:bg-slate-800   ">
                      Contact Support
                    </Button>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="h-4 w-4" />
                      Payments are secure & encrypted
                    </div>
                  </div>
                </div>

          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-2 text-sm text-slate-600">{meta}</div>
    </div>
  );
}
