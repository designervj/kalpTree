"use client";

import React from "react";
import Link from "next/link";
import {
  Home as HomeIcon,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Search,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "All",
  "Hosting",
  "VPS",
  "Websites",
  "Domains",
  "Email",
  "WordPress",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];
type ProductCategory = Exclude<Category, "All">;

type Product = {
  id: string;
  title: string;
  desc: string;
  category: ProductCategory;
  discountLabel?: string; // "Save up to 80%"
  pill?: string; // "AI"
  ctaPrimary: { label: string; href?: string };
  ctaSecondary?: { label: string; href?: string };
  highlight?: boolean; // recommended primary card
};

const RECOMMENDED: Product[] = [
  {
    id: "rec-1",
    title: "Business Email",
    desc: "Build your brand with a professional email address, like you@yourdomain.com.",
    category: "Email",
    discountLabel: "Save up to 87%",
    ctaPrimary: { label: "Explore offer", href: "/services/marketplace/email" },
  },
  {
    id: "rec-2",
    title: "Hostinger Reach",
    desc: "Create inbox-ready newsletters with an AI-powered email marketing tool.",
    category: "Email",
    discountLabel: "Save up to 67%",
    pill: "AI",
    ctaSecondary: { label: "Try for free", href: "/services/marketplace/reach" },
    ctaPrimary: { label: "Buy now", href: "/services/marketplace/reach/buy" },
    highlight: true,
  },
];

const PRODUCTS: Product[] = [
  {
    id: "h-1",
    title: "Web Hosting",
    desc: "Fast hosting for businesses & portfolios. Free SSL and backups.",
    category: "Hosting",
    discountLabel: "Save up to 80%",
    ctaPrimary: { label: "Buy now", href: "/services/marketplace/hosting" },
    ctaSecondary: { label: "Compare plans", href: "/services/marketplace/hosting/plans" },
  },
  {
    id: "h-2",
    title: "Cloud Hosting",
    desc: "More power for high traffic sites. Dedicated resources.",
    category: "Hosting",
    discountLabel: "Save up to 71%",
    ctaPrimary: { label: "Buy now", href: "/services/marketplace/cloud-hosting" },
    ctaSecondary: { label: "See details", href: "/services/marketplace/cloud-hosting/details" },
  },
  {
    id: "h-3",
    title: "Managed WordPress",
    desc: "Optimized stack for WordPress with staging and security.",
    category: "WordPress",
    discountLabel: "Save up to 58%",
    ctaPrimary: { label: "Buy now", href: "/services/marketplace/wordpress" },
    ctaSecondary: { label: "Learn more", href: "/services/marketplace/wordpress/about" },
  },
  {
    id: "v-1",
    title: "VPS Starter",
    desc: "Deploy apps with full control. SSH access and snapshots.",
    category: "VPS",
    discountLabel: "Save up to 45%",
    ctaPrimary: { label: "Buy now", href: "/services/marketplace/vps" },
    ctaSecondary: { label: "Configure", href: "/services/marketplace/vps/configure" },
  },
  {
    id: "d-1",
    title: "Domains",
    desc: "Search and register your perfect domain name.",
    category: "Domains",
    discountLabel: "Save up to 30%",
    ctaPrimary: { label: "Get domain", href: "/services/marketplace/domains" },
    ctaSecondary: { label: "Transfer", href: "/services/marketplace/domains/transfer" },
  },
  {
    id: "w-1",
    title: "Website Builder",
    desc: "Drag & drop sections, publish fast with templates.",
    category: "Websites",
    discountLabel: "Save up to 55%",
    ctaPrimary: { label: "Start building", href: "/services/marketplace/website-builder" },
    ctaSecondary: { label: "Templates", href: "/services/marketplace/website-builder/templates" },
  },
];

function SectionTitle({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      {right}
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm font-medium transition",
        "border border-slate-200 bg-white hover:bg-slate-50",
        active && "bg-slate-900 text-white border-slate-900 hover:bg-slate-900"
      )}
    >
      {children}
    </button>
  );
}

function PromoCard({ item, artwork }: { item: Product; artwork: "a" | "b" }) {
  return (
    <Card className="rounded-3xl border bg-white overflow-hidden shadow-sm">
      {/* Artwork */}
      <div
        className={cn(
          "relative h-[210px]",
          artwork === "a"
            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_45%),linear-gradient(135deg,#4c1d95,#6d28d9,#2563eb)]"
            : "bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.7),transparent_45%),linear-gradient(135deg,#eef2ff,#f5f3ff,#fdf2f8)]"
        )}
      >
        {item.discountLabel && (
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
              {item.discountLabel}
            </span>
          </div>
        )}

        {/* Floating “preview” */}
        <div
          className={cn(
            "absolute left-6 right-6 bottom-6 rounded-3xl border border-white/60 bg-white/85 backdrop-blur",
            "shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
          )}
        >
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-700">
              {item.category}
            </div>
            {item.pill && (
              <Badge className="rounded-full bg-violet-100 text-violet-700 hover:bg-violet-100">
                <Sparkles className="h-3 w-3 mr-1" />
                {item.pill}
              </Badge>
            )}
          </div>
          <div className="px-5 pb-4 -mt-2 text-sm text-slate-500">
            Preview artwork
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="text-lg font-semibold text-slate-900">
            {item.title}
          </div>
          <div className="text-sm text-slate-600 leading-relaxed">
            {item.desc}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {item.ctaSecondary ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl h-11 px-5 font-semibold"
              asChild
            >
              <Link href={item.ctaSecondary.href ?? "#"}>
                {item.ctaSecondary.label}
                <ExternalLink className="h-4 w-4 ml-2 opacity-70" />
              </Link>
            </Button>
          ) : null}

          <Button
            type="button"
            className={cn(
              "rounded-xl h-11 px-6 font-semibold",
              item.highlight ? "bg-violet-600 hover:bg-violet-700" : ""
            )}
            variant={item.highlight ? "default" : "outline"}
            asChild
          >
            <Link href={item.ctaPrimary.href ?? "#"}>{item.ctaPrimary.label}</Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="ml-auto h-11 w-11 rounded-xl"
            asChild
          >
            <Link href={item.ctaPrimary.href ?? "#"} aria-label="Open">
              <ArrowUpRight className="h-5 w-5 text-violet-600" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductCard({ item }: { item: Product }) {
  return (
    <Card className="rounded-3xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative h-36 bg-[linear-gradient(135deg,#f8fafc,#f1f5f9)]">
        {item.discountLabel && (
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm border border-slate-100">
              {item.discountLabel}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="space-y-2">
          <div className="font-semibold text-slate-900">{item.title}</div>
          <div className="text-sm text-slate-600 leading-relaxed">
            {item.desc}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            className="rounded-xl h-10 px-4 font-semibold bg-violet-600 hover:bg-violet-700"
            asChild
          >
            <Link href={item.ctaPrimary.href ?? "#"}>{item.ctaPrimary.label}</Link>
          </Button>

          {item.ctaSecondary ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl h-10 px-4 font-semibold"
              asChild
            >
              <Link href={item.ctaSecondary.href ?? "#"}>{item.ctaSecondary.label}</Link>
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            className="ml-auto h-10 w-10 rounded-xl"
            asChild
          >
            <Link href={item.ctaPrimary.href ?? "#"} aria-label="Open">
              <ArrowRight className="h-5 w-5 text-slate-500" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MarketplaceHostingerStyle() {
  const [active, setActive] = React.useState<Category>("All");
  const [q, setQ] = React.useState("");

  const visibleProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = active === "All" ? true : p.category === active;
      const matchQ = `${p.title} ${p.desc} ${p.category}`
        .toLowerCase()
        .includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [active, q]);

  const byCategory = React.useCallback(
    (cat: ProductCategory) => visibleProducts.filter((p) => p.category === cat),
    [visibleProducts]
  );

  return (
    <div className="min-h-screen px-3 pt-1">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6">
        {/* Top header (breadcrumb + search) */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <h1 className="text-2xl font-semibold text-slate-900">Marketplace</h1>
            <span className="text-slate-300">|</span>
            <HomeIcon className="h-4 w-4" />
            <span>–</span>
            <span className="text-slate-700 font-medium">Marketplace</span>
          </div>

          <div className="w-full md:max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="h-11 rounded-xl pl-10 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Chips row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <Chip key={c} active={c === active} onClick={() => setActive(c)}>
              {c}
            </Chip>
          ))}
        </div>

        {/* Recommended */}
        <SectionTitle title="Recommended" />
        <div className="grid gap-5 md:grid-cols-2">
          <PromoCard item={RECOMMENDED[0]} artwork="a" />
          <PromoCard item={RECOMMENDED[1]} artwork="b" />
        </div>

        {/* Category sections */}
        {active === "All" ? (
          <div className="space-y-10">
            {(CATEGORIES.filter((c) => c !== "All") as ProductCategory[]).map(
              (cat) => {
                const items = byCategory(cat);
                if (items.length === 0) return null;

                return (
                  <div key={cat} className="space-y-4">
                    <SectionTitle title={cat} />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((p) => (
                        <ProductCard key={p.id} item={p} />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <SectionTitle title={active} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} item={p} />
              ))}
            </div>

            {visibleProducts.length === 0 && (
              <Card className="rounded-3xl border bg-white">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No items found for “{active}”.
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help footer */}
        <Card className="rounded-3xl border bg-white">
          <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <div className="font-semibold text-slate-900">Need help?</div>
              <div className="text-sm text-slate-600">
                Talk to support for the best plan for your business.
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="rounded-xl">
                View docs
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-violet-600 hover:bg-violet-700"
              >
                Chat support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
