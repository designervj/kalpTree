"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Building2,
  Globe,
  Palette,
  Zap,
  X,
  Check,
  Save,
  Loader2,
  Plus,
  Trash2,
  LayoutGrid,
  ShoppingCart,
  Megaphone,
  MapPin,
  Mail,
  Phone,
  Languages,
  Settings,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LanguageSelector } from "../../users/languageSupport";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  business: any;
  onClose: () => void;
  type: string | null; // "business" | website._id | "createwebsite"
  businesswebsites: any[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  {
    value: "ECOMMERCE",
    title: "E-Commerce",
    desc: "Full online store",
    Icon: ShoppingCart,
  },
  {
    value: "WEBSITE",
    title: "Website",
    desc: "Professional website hosting",
    Icon: Globe,
  },
  {
    value: "BLOG",
    title: "Blog",
    desc: "Content management platform",
    Icon: LayoutGrid,
  },
  {
    value: "WEBSITE_CATALOGUE_ECOMMERCE_MARKETING",
    title: "All-in-One",
    desc: "Website + Catalogue + E-commerce + Marketing",
    Icon: Megaphone,
  },
];

const FEATURE_CONFIG = [
  { key: "websiteEnabled", label: "Website", Icon: Globe },
  { key: "ecommerceEnabled", label: "E-Commerce", Icon: ShoppingCart },
  { key: "blogEnabled", label: "Blog", Icon: LayoutGrid },
  { key: "invoicesEnabled", label: "Invoices", Icon: Zap },
];

const PLAN_OPTIONS = ["trial", "free", "pro", "agency"];
const STATUS_OPTIONS = ["active", "paused", "inactive"];
const SUBSCRIPTION_OPTIONS = ["active", "inactive", "cancelled", "past_due"];
const FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Roboto",
  "Montserrat",
  "Lato",
  "Nunito",
  "Playfair Display",
];
const LOCALE_OPTIONS = [
  "en-US",
  "en-GB",
  "fr-FR",
  "de-DE",
  "es-ES",
  "hi-IN",
  "ja-JP",
  "zh-CN",
];
const TIMEZONE_OPTIONS = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Asia/Shanghai",
];
const CURRENCY_OPTIONS = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "JPY",
  "AUD",
  "CAD",
  "SGD",
];

const BUS_SECTIONS = [
  { id: "account", label: "Account", icon: CreditCard },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "details", label: "Details", icon: Building2 },
  { id: "features", label: "Features", icon: Zap },
  { id: "settings", label: "Settings", icon: Settings },
];

const WEB_SECTIONS = [
  { id: "details", label: "Details", icon: Globe },
  { id: "service", label: "Service Type", icon: Zap },
  { id: "domains", label: "Domains", icon: Globe },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const inp =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-900 transition-all";
const lbl =
  "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildBusinessForm(b: any) {
  return {
    plan: b.plan || "trial",
    status: b.status || "active",
    subscriptionStatus: b.subscriptionStatus || "active",
    branding: {
      primary_color: b?.branding?.primary_color || "#3b82f6",
      secondary_color: b?.branding?.secondary_color || "#f4e04f",
      tertiary_color: b?.branding?.tertiary_color || "#ec4899",
      typography: b?.branding?.typography || "Inter",
      logo: b?.branding?.logo || "",
    },
    businessdetails: {
      tagline: b?.businessdetails?.tagline || "",
      about: b?.businessdetails?.about || "",
      founded_year: b?.businessdetails?.founded_year || "",
      industry: b?.businessdetails?.industry || "",
      businessType: b?.businessdetails?.businessType || [],
      public_email: b?.businessdetails?.public_email || "",
      phone: b?.businessdetails?.phone || "",
      headquarters: b?.businessdetails?.headquarters || "",
      brand_name: b?.businessdetails?.brand_name || "",
      business_website_url: b?.businessdetails?.business_website_url || "",
    },
    features: {
      websiteEnabled: b?.features?.websiteEnabled ?? false,
      ecommerceEnabled: b?.features?.ecommerceEnabled ?? false,
      blogEnabled: b?.features?.blogEnabled ?? false,
      invoicesEnabled: b?.features?.invoicesEnabled ?? false,
    },
    settings: {
      locale: b?.settings?.locale || "en-US",
      currency: b?.settings?.currency || "USD",
      timezone: b?.settings?.timezone || "UTC",
    },
    website: {
      name: b.name,
      serviceType: b.serviceType,
      primaryDomain: b.primaryDomain,
      lang: b.primaryDomain,
      isComingSoon: b.isComingSoon,
    },
  };
}

function buildWebsiteForm(w: any) {
  return {
    name: w.name || "",
    status: w.status || "active",
    serviceType: w.serviceType || "WEBSITE",
    isComingSoon: w.isComingSoon ?? false,
    lang: w.lang || [],
    primaryDomain: w.primaryDomain || [],
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SidebarNav({
  sections,
  active,
  onChange,
}: {
  sections: { id: string; label: string; icon: React.ElementType }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="w-44 flex-shrink-0 border-r border-gray-100 pr-3 space-y-0.5 pt-1">
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
            active === id
              ? "bg-slate-900 text-white"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {label}
        </button>
      ))}
    </nav>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 mb-5 border-b border-gray-100">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 flex-shrink-0">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function ColorRow({
  label,
  colorKey,
  value,
  onChange,
}: {
  label: string;
  colorKey: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const id = `cp-${colorKey}`;
  return (
    <div>
      <label className={lbl}>{label}</label>
      <div
        className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 bg-white cursor-pointer hover:border-gray-300 transition-colors"
        onClick={() => document.getElementById(id)?.click()}
      >
        <div
          className="h-8 w-8 rounded-md border border-gray-200 flex-shrink-0 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <span className="text-sm text-gray-700 font-mono flex-1">{value}</span>
        <span className="text-xs text-gray-400 px-2 py-1 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors select-none">
          Pick
        </span>
      </div>
    </div>
  );
}

function LanguageManager({
  langs,
  onChange,
}: {
  langs: { name: string; default?: boolean }[];
  onChange: (v: any[]) => void;
}) {
  const [input, setInput] = React.useState("");

  const add = () => {
    const val = input.trim().toLowerCase();
    if (!val || langs.find((l) => l.name.toLowerCase() === val)) return;
    onChange([...langs, { name: val, default: langs.length === 0 }]);
    setInput("");
  };

  const remove = (name: string) => {
    const updated = langs.filter((l) => l.name !== name);
    if (updated.length && !updated.find((l) => l.default))
      updated[0].default = true;
    onChange(updated);
  };

  const setDef = (name: string) =>
    onChange(langs.map((l) => ({ ...l, default: l.name === name })));

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="en, fr, hi…"
          className={cn(inp, "flex-1")}
        />
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {langs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {langs.map((lang) => (
            <div
              key={lang.name}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border",
                lang.default
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-gray-700 border-gray-200",
              )}
            >
              <Languages className="h-3 w-3" />
              <span className="uppercase">{lang.name}</span>
              {lang.default ? (
                <span className="opacity-60 text-[10px]">(default)</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setDef(lang.name)}
                  className="text-[10px] underline opacity-60 hover:opacity-100"
                >
                  default
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(lang.name)}
                className="opacity-50 hover:opacity-100 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Industry / BusinessType selectors ───────────────────────────────────────

function IndustrySelector({
  value,
  onChange,
  industries,
  loading,
}: {
  value: string;
  onChange: (id: string) => void;
  industries: any;
  loading: boolean;
}) {
  if (loading)
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 py-4">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading industries…
      </div>
    );

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {industries.map((opt: any) => {
        const sel = value === opt._id;
        return (
          <button
            key={opt._id}
            type="button"
            // FIX 1: Always set the new industry id — never toggle off to empty.
            // Previously: onChange(sel ? "" : opt._id) caused the selected industry
            // to deselect on re-click, wiping out the industryId and preventing
            // BusinessTypeSelector from fetching types.
            onClick={() => onChange(opt._id)}
            className={cn(
              "relative flex flex-col items-start rounded-xl border px-3 py-3 text-left transition-all",
              sel
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            <span className="text-sm font-semibold">{opt.name}</span>
            {opt.desc && (
              <span
                className={cn(
                  "text-[11px] mt-0.5",
                  sel ? "text-white/60" : "text-gray-400",
                )}
              >
                {opt.desc}
              </span>
            )}
            {sel && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                <Check className="h-2.5 w-2.5 text-white" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function BusinessTypeSelector({
  industryId,
  value,
  onChange,
  types,
  loading,
}: {
  industryId: string;
  value: string[];
  onChange: (ids: string[]) => void;
  types: any[];
  loading: boolean;
}) {
  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );
  };

  const finalTypes = React.useMemo(() => {
    return types.filter((d) => d.categoryId == industryId) || [];
  }, [industryId]);

  if (!industryId)
    return (
      <p className="text-xs text-gray-400 py-3 italic">
        Select an industry above to see business types.
      </p>
    );
  if (loading)
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 py-3">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading types…
      </div>
    );
  if (!types.length)
    return (
      <p className="text-xs text-gray-400 py-3 italic">
        No business types found for this industry.
      </p>
    );

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {finalTypes.map((opt) => {
        const sel = value.includes(opt._id);
        return (
          <button
            key={opt._id}
            type="button"
            onClick={() => toggle(opt._id)}
            className={cn(
              "relative flex flex-col items-start rounded-xl border px-3 py-3 text-left transition-all",
              sel
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            <span className="text-sm font-semibold">{opt.name}</span>
            {sel && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                <Check className="h-2.5 w-2.5 text-white" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Business Form ────────────────────────────────────────────────────────────

function BusinessForm({
  fd,
  set,
}: {
  fd: any;
  set: (key: string, val: any) => void;
}) {
  const [sec, setSec] = React.useState("account");
  const [industries, setIndustries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [businessTypeLoading, setBusinessTypeLoading] = React.useState(true);

  const setBD = (k: string, v: any) => {
    set("businessdetails", { ...fd.businessdetails, [k]: v });
  };
  const setB = (k: string, v: any) =>
    set("branding", { ...fd.branding, [k]: v });
  const setSt = (k: string, v: any) =>
    set("settings", { ...fd.settings, [k]: v });
  const [businessType, setBusinessType] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (fd.businessdetails.industry) {
      (async () => {
        try {
          const req = await fetch("/api/admin/attributessets");
          const res = await req.json();
          if (res.items.length > 0) {
            setBusinessType(res.items);
          } else {
            setBusinessType([]);
          }
        } catch (error) {
          toast.error(String(error));
        } finally {
          setBusinessTypeLoading(false);
        }
      })();
    }
  }, [fd.businessdetails.industry]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/producttypecategory");
        const data = await res.json();
        setIndustries(data.items || []);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex gap-6 h-full min-h-0">
      <SidebarNav sections={BUS_SECTIONS} active={sec} onChange={setSec} />

      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        {/* ── Account ── */}
        {sec === "account" && (
          <>
            <SectionHeader
              icon={CreditCard}
              title="Account & Subscription"
              subtitle="Plan, billing status, and account state"
            />
            <div className="grid grid-cols-3 gap-x-5 gap-y-4">
              <div>
                <label className={lbl}>Plan</label>
                <select
                  value={fd.plan}
                  onChange={(e) => set("plan", e.target.value)}
                  className={inp}
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Account Status</label>
                <select
                  value={fd.status}
                  onChange={(e) => set("status", e.target.value)}
                  className={inp}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Subscription Status</label>
                <select
                  value={fd.subscriptionStatus}
                  onChange={(e) => set("subscriptionStatus", e.target.value)}
                  className={inp}
                >
                  {SUBSCRIPTION_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status badges */}
            <div className="mt-6 p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Plan:</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">
                  {fd.plan}
                </span>
              </div>
              <div className="h-4 border-r border-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Status:</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    fd.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600",
                  )}
                >
                  {fd.status}
                </span>
              </div>
              <div className="h-4 border-r border-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Subscription:</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    fd.subscriptionStatus === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700",
                  )}
                >
                  {fd.subscriptionStatus}
                </span>
              </div>
            </div>
          </>
        )}

        {/* ── Branding ── */}
        {sec === "branding" && (
          <>
            <SectionHeader
              icon={Palette}
              title="Brand Colors & Typography"
              subtitle="Visual identity — maps to business.branding fields"
            />
            <div className="space-y-4">
              <ColorRow
                label="Primary Color"
                colorKey="primary"
                value={fd.branding.primary_color}
                onChange={(v) => setB("primary_color", v)}
              />
              <ColorRow
                label="Secondary Color"
                colorKey="secondary"
                value={fd.branding.secondary_color}
                onChange={(v) => setB("secondary_color", v)}
              />
              <ColorRow
                label="Tertiary Color"
                colorKey="tertiary"
                value={fd.branding.tertiary_color}
                onChange={(v) => setB("tertiary_color", v)}
              />
              <div>
                <label className={lbl}>Typography</label>
                <select
                  value={fd.branding.typography}
                  onChange={(e) => setB("typography", e.target.value)}
                  className={inp}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              {fd.branding.logo && (
                <div>
                  <label className={lbl}>Current Logo</label>
                  <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <img
                      src={fd.branding.logo}
                      alt="logo"
                      className="h-12 w-auto object-contain rounded"
                    />
                    <span className="text-xs text-gray-500 truncate flex-1">
                      {fd.branding.logo}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Logo can be updated from the branding section in the website
                    editor.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Details (businessdetails) ── */}
        {sec === "details" && (
          <>
            <SectionHeader
              icon={Building2}
              title="Business Details"
              subtitle="Tagline, about, contact, and industry classification"
            />
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <div className="col-span-2">
                  <label className={lbl}>Brand Name</label>
                  <input
                    value={fd.businessdetails.brand_name}
                    onChange={(e) => setBD("brand_name", e.target.value)}
                    placeholder="Nestcraft Living"
                    className={inp}
                  />
                </div>
                <div className="col-span-2">
                  <label className={lbl}>Tagline / Slogan</label>
                  <input
                    value={fd.businessdetails.tagline}
                    onChange={(e) => setBD("tagline", e.target.value)}
                    placeholder="Your catchy tagline"
                    className={inp}
                  />
                </div>
                <div className="col-span-2">
                  <label className={lbl}>About / Bio</label>
                  <textarea
                    value={fd.businessdetails.about}
                    onChange={(e) => setBD("about", e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Write something about the business…"
                    className={cn(inp, "resize-none")}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {fd.businessdetails.about?.length || 0}/500
                  </p>
                </div>
                <div>
                  <label className={lbl}>Founded Year</label>
                  <input
                    type="number"
                    value={fd.businessdetails.founded_year}
                    onChange={(e) => setBD("founded_year", e.target.value)}
                    placeholder="2020"
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>Website URL</label>
                  <input
                    value={fd.businessdetails.business_website_url}
                    onChange={(e) =>
                      setBD("business_website_url", e.target.value)
                    }
                    placeholder="example.com"
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>Public Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={fd.businessdetails.public_email}
                      onChange={(e) => setBD("public_email", e.target.value)}
                      placeholder="contact@example.com"
                      className={cn(inp, "pl-9")}
                    />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={fd.businessdetails.phone}
                      onChange={(e) => setBD("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={cn(inp, "pl-9")}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={lbl}>Headquarters</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={fd.businessdetails.headquarters}
                      onChange={(e) => setBD("headquarters", e.target.value)}
                      placeholder="123 Main St, City, Country"
                      className={cn(inp, "pl-9")}
                    />
                  </div>
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className={cn(lbl, "mb-2.5")}>Industry</label>
                <IndustrySelector
                  value={fd.businessdetails.industry}
                  industries={industries}
                  loading={loading}
                  onChange={(id) => {
                    setBD("industry", id);
                    // Only reset business types when the industry actually changes
                    // if (id !== fd.businessdetails.industry) {
                    //   setBD("businessType", []);
                    // }
                  }}
                />
              </div>

              {/* Business Type */}
              <div>
                <label className={cn(lbl, "mb-2.5")}>
                  Business Type{" "}
                  <span className="normal-case font-normal text-gray-400">
                    (multi-select)
                  </span>
                </label>
                <BusinessTypeSelector
                  industryId={fd.businessdetails.industry}
                  value={fd.businessdetails.businessType || []}
                  onChange={(ids) => setBD("businessType", ids)}
                  types={businessType}
                  loading={businessTypeLoading}
                />
              </div>
            </div>
          </>
        )}

        {/* ── Features ── */}
        {sec === "features" && (
          <>
            <SectionHeader
              icon={Zap}
              title="Feature Modules"
              subtitle="Toggle enabled modules for this business"
            />
            <div className="grid grid-cols-2 gap-3">
              {FEATURE_CONFIG.map(({ key, label, Icon }) => {
                const on = fd.features?.[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      set("features", { ...fd.features, [key]: !on })
                    }
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                      on
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0",
                        on ? "bg-white/15" : "bg-gray-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          on ? "text-white" : "text-gray-600",
                        )}
                      />
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                    {on && (
                      <Check className="absolute right-3 top-3 h-3.5 w-3.5 text-white/70" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Settings ── */}
        {sec === "settings" && (
          <>
            <SectionHeader
              icon={Settings}
              title="Business Settings"
              subtitle="Locale, currency, and timezone preferences"
            />
            <div className="grid grid-cols-3 gap-x-5 gap-y-4">
              <div>
                <label className={lbl}>Locale</label>
                <select
                  value={fd.settings.locale}
                  onChange={(e) => setSt("locale", e.target.value)}
                  className={inp}
                >
                  {LOCALE_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Currency</label>
                <select
                  value={fd.settings.currency}
                  onChange={(e) => setSt("currency", e.target.value)}
                  className={inp}
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Timezone</label>
                <select
                  value={fd.settings.timezone}
                  onChange={(e) => setSt("timezone", e.target.value)}
                  className={inp}
                >
                  {TIMEZONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 font-medium mb-1">Preview</p>
              <p className="text-sm text-gray-700">
                Dates displayed as <strong>{fd.settings.locale}</strong>,
                amounts in <strong>{fd.settings.currency}</strong>, server time{" "}
                <strong>{fd.settings.timezone}</strong>.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Website Form ─────────────────────────────────────────────────────────────

function WebsiteForm({
  fd,
  set,
}: {
  fd: any;
  set: (key: string, val: any) => void;
}) {
  const [sec, setSec] = React.useState("details");

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    set("lang", value);
  };

  return (
    <div className="flex gap-6 h-full min-h-0">
      <SidebarNav sections={WEB_SECTIONS} active={sec} onChange={setSec} />

      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        {/* ── Details ── */}
        {sec === "details" && (
          <>
            <SectionHeader
              icon={Globe}
              title="Website Details"
              subtitle="Name, status, and visibility configuration"
            />
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <div className="col-span-2">
                <label className={lbl}>Website Name</label>
                <input
                  value={fd.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="My Website"
                  className={inp}
                />
              </div>
              <div className="col-span-2">
                <label className={lbl}>Visibility Mode</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    {
                      val: false,
                      emoji: "🟢",
                      title: "Live",
                      desc: "Visitors can see your website",
                    },
                    {
                      val: true,
                      emoji: "🟡",
                      title: "Coming Soon",
                      desc: "Show a coming soon page",
                    },
                  ].map(({ val, emoji, title, desc }) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => set("isComingSoon", val)}
                      className={cn(
                        "flex flex-col items-start rounded-xl border px-4 py-3.5 text-left transition-all",
                        fd.isComingSoon === val
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <span className="text-sm font-semibold">
                        {emoji} {title}
                      </span>
                      <span
                        className={cn(
                          "text-xs mt-0.5",
                          fd.isComingSoon === val
                            ? "text-white/60"
                            : "text-gray-400",
                        )}
                      >
                        {desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className={lbl}>Languages</label>
                <LanguageSelector
                  formData={fd}
                  handleInputChange={handleInputChange}
                />
                {/* <LanguageManager
                  langs={fd.lang || []}
                  onChange={(v) => set("lang", v)}
                /> */}
              </div>
            </div>
          </>
        )}

        {/* ── Service Type ── */}
        {sec === "service" && (
          <>
            <SectionHeader
              icon={Zap}
              title="Service Type"
              subtitle="What kind of website is this?"
            />
            <div className="grid grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map(({ value, title, desc, Icon }) => {
                const sel = fd.serviceType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("serviceType", value)}
                    className={cn(
                      "relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                      sel
                        ? "border-slate-900 bg-slate-900 ring-1 ring-slate-900"
                        : "border-gray-200 bg-white hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0",
                        sel ? "bg-white/15" : "bg-gray-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          sel ? "text-white" : "text-gray-600",
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          sel ? "text-white" : "text-gray-900",
                        )}
                      >
                        {title}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-0.5",
                          sel ? "text-white/60" : "text-gray-500",
                        )}
                      >
                        {desc}
                      </p>
                    </div>
                    {sel && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Domains ── */}
        {sec === "domains" && (
          <>
            <SectionHeader
              icon={Globe}
              title="Primary Domains"
              subtitle="All domains pointing to this website"
            />
            <div className="space-y-2">
              {(!fd.primaryDomain || fd.primaryDomain.length === 0) && (
                <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center">
                  <Globe className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No domains added yet</p>
                </div>
              )}
              {(fd.primaryDomain || []).map((domain: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center flex-1 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-slate-900/15 focus-within:border-slate-900 bg-white transition-all">
                    <Globe className="ml-3 h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <input
                      value={domain}
                      onChange={(e) => {
                        const updated = [...fd.primaryDomain];
                        updated[i] = e.target.value;
                        set("primaryDomain", updated);
                      }}
                      placeholder="example.com"
                      className="flex-1 px-2 py-2.5 outline-none text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "primaryDomain",
                        fd.primaryDomain.filter(
                          (_: any, idx: number) => idx !== i,
                        ),
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  set("primaryDomain", [...(fd.primaryDomain || []), ""])
                }
                className="flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors mt-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                Add Domain
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Payload builders ─────────────────────────────────────────────────────────

function buildBusinessPayload(fd: any) {
  return {
    plan: fd.plan,
    status: fd.status,
    subscriptionStatus: fd.subscriptionStatus,
    branding: fd.branding,
    businessdetails: fd.businessdetails,
    features: fd.features,
    settings: fd.settings,
    website: {
      name: fd.name,
      serviceType: fd.serviceType,
      isComingSoon: fd.isComingSoon,
      lang: fd.lang,
      primaryDomain: fd.primaryDomain,
    },
  };
}

function buildWebsitePayload(fd: any) {
  return {
    name: fd.name,
    serviceType: fd.serviceType,
    isComingSoon: fd.isComingSoon,
    lang: fd.lang,
    primaryDomain: fd.primaryDomain,
  };
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export const BusinessModal = ({
  open,
  business,
  businesswebsites,
  onClose,
  type,
}: ModalProps) => {
  console.log(business);
  const [formData, setFormData] = React.useState<any>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setError(null);

    if (type === "business" && business) {
      setFormData(buildBusinessForm(business));
    } else if (type === "createwebsite") {
      setFormData({
        name: "",
        serviceType: "WEBSITE",
        isComingSoon: false,
        lang: [],
        primaryDomain: [],
      });
    } else if (type) {
      const w = businesswebsites?.find((d: any) => d._id === type);
      if (w) setFormData(buildWebsiteForm(w));
    }
  }, [open, type, business, businesswebsites]);

  if (!formData) return null;

  const set = (key: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const isBusinessEdit = type === "business";
      const url = isBusinessEdit
        ? `/api/admin/business/${business._id}`
        : type === "createwebsite"
          ? `/api/domain`
          : `/api/domain/${type}`;
      const method = type === "createwebsite" ? "POST" : "PUT";
      const payload = isBusinessEdit
        ? buildBusinessPayload(formData)
        : buildWebsitePayload(formData);

      const req = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const res = await req.json();

      if (res.success) {
        toast.success(res.message);
        onClose();
      } else {
        setError(res.message || "Something went wrong.");
      }
    } catch (e) {
      toast.error(String(e));
      setError("Network error. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const isWebsite = type !== "business";
  const modalTitle =
    type === "business"
      ? business?.name || "Edit Business"
      : type === "createwebsite"
        ? "Add New Website"
        : formData?.name || "Edit Website";
  const modalSub = isWebsite
    ? "Name · Service Type · Domains · Languages · Visibility"
    : "Account · Branding · Details · Features · Settings";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] flex flex-col gap-0 p-0 h-[90vh] overflow-hidden rounded-2xl border border-gray-200 shadow-2xl">
        {/* ── Header ── */}
        <div className=" flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
              {isWebsite ? (
                <Globe className="h-5 w-5 text-white" />
              ) : (
                <Building2 className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {modalTitle}
              </h2>
              <p className="text-xs text-gray-400">{modalSub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mx-8 mt-4 flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 flex-shrink-0">
            <X className="h-4 w-4 flex-shrink-4" /> {error}
          </div>
        )}

        {/* ── Body ── */}
        <div className="flex-1 min-h-0 overflow-hidden px-8 py-5">
          {type === "business" ? (
            <BusinessForm fd={formData} set={set} />
          ) : (
            <WebsiteForm fd={formData} set={set} />
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-gray-50/80 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
