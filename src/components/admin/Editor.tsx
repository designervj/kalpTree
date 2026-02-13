"use client";

import React, {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Info,
  PlusCircle,
  Eye,
  Trash2,
} from "lucide-react";

import BreadCrumbPage from "../breadCrumb/BreadCrumbPage";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateWebsitePage } from "@/hooks/slices/website/websitePageSlice";
import { extractHeader } from "./website/websitePage/util/ExtractHeader";

/* -----------------------------
  Types
------------------------------ */
export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "readonly" | "array";
  options?: { value: string; label: string }[];
  side: "left" | "right" | "NA";
  placeholder?: string;
  rows?: number;
  nestedKey?: string;
  readOnly?: boolean;
};

type PageEditorProps = {
  id: string;
  item: any;
  fields: FieldConfig[];
  apiEndpoint?: string;
  onDeleteRedirect?: string;
  viewUrl?: any;
};

type TemplateCategory = "home" | "about" | "services" | "contact";

type PageTemplate = {
  key: string;
  name: string;
  category: TemplateCategory;
  desc: string;
  html: string;
  seo?: {
    focusKeyword?: string;
    seoTitle?: string;
    metaDescription?: string;
  };
};

/* -----------------------------
  Helpers
------------------------------ */
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const slugify = (value: string) => {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/** If user pasted escaped HTML (&lt;div&gt;), convert back */
const unescapeHtmlIfNeeded = (s: string) => {
  const str = s || "";
  const looksEscaped = /&lt;[a-zA-Z!/]/.test(str) || /&gt;/.test(str);
  if (!looksEscaped) return str;

  return str
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
};

const looksLikeFullDoc = (html: string) =>
  /<html[\s>]/i.test(html) || /<!doctype/i.test(html) || /<body[\s>]/i.test(html);

/** Clean iframe document wrapper */
const buildIframeDoc = (userHtml: string) => {
  const html = (userHtml || "").trim();

  if (!html) {
    return `<!doctype html><html><head><meta charset="utf-8"/>
      <style>
        body{margin:0;font-family:ui-sans-serif,system-ui;background:#fff;color:#64748b}
        .empty{padding:16px}
      </style>
    </head><body><div class="empty">No content yet</div></body></html>`;
  }

  if (looksLikeFullDoc(html)) return html;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    html,body{margin:0;padding:0;background:#fff;color:#0f172a}
    *{box-sizing:border-box}
    img{max-width:100%;height:auto}
    a{color:inherit}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
};

const stripHtmlToText = (html: string) => {
  const s = (html || "").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const t = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  return t
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const countWords = (text: string) => {
  const cleaned = (text || "").trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
};

function inRange(n: number, min: number, max: number) {
  return n >= min && n <= max;
}

/* -----------------------------
  4 FULL PAGE TEMPLATES (Home + About + Services + Contact)
  (Same as your PageCreator templates)
------------------------------ */
const PAGE_TEMPLATES: PageTemplate[] = [
  {
    key: "home-modern-01",
    category: "home",
    name: "Homepage – Modern Premium",
    desc: "Hero, logos, features, showcase, testimonials, pricing, FAQ, footer",
    seo: {
      focusKeyword: "modern website",
      seoTitle: "Modern Premium Website Template",
      metaDescription:
        "A clean modern homepage layout with hero, features, testimonials and pricing. Ready to customize for your business.",
    },
    html: `
<!-- Header -->
<header style="position:sticky;top:0;z-index:10;background:#ffffff;border-bottom:1px solid #e2e8f0;">
  <div style="max-width:1100px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:34px;height:34px;border-radius:12px;background:#7c3aed;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;">W</div>
      <div>
        <div style="font-weight:900;color:#0f172a;line-height:1;">Website</div>
        <div style="font-size:12px;color:#64748b;line-height:1;">Premium Builder</div>
      </div>
    </div>
    <nav style="display:flex;gap:16px;align-items:center;color:#334155;font-weight:700;font-size:13px;">
      <a href="#" style="text-decoration:none;">Home</a>
      <a href="#" style="text-decoration:none;">Features</a>
      <a href="#" style="text-decoration:none;">Pricing</a>
      <a href="#" style="text-decoration:none;">Contact</a>
    </nav>
    <div style="display:flex;gap:10px;align-items:center;">
      <a href="#" style="text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:10px 12px;border-radius:12px;font-weight:800;font-size:13px;">Login</a>
      <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:10px 12px;border-radius:12px;font-weight:900;font-size:13px;">Get Started</a>
    </div>
  </div>
</header>

<!-- Hero -->
<section style="padding:56px 24px;font-family:ui-sans-serif,system-ui;background:linear-gradient(180deg,#ffffff 0%,#faf5ff 100%);">
  <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:18px;align-items:center;">
    <div>
      <div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e2e8f0;border-radius:999px;padding:7px 10px;color:#334155;font-size:12px;background:#fff;">
        <span style="width:8px;height:8px;border-radius:999px;background:#7c3aed;display:inline-block;"></span>
        New: Premium templates included
      </div>
      <h1 style="font-size:44px;line-height:1.1;margin:14px 0 12px;color:#0f172a;">
        Build stunning pages fast — <span style="color:#7c3aed;">no design stress</span>
      </h1>
      <p style="margin:0;color:#475569;max-width:68ch;font-size:16px;line-height:1.75;">
        Use ready-made full page templates for Home, About, Services and Contact.
        Edit HTML instantly and preview right away.
      </p>

      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;">
        <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">Create Page</a>
        <a href="#" style="text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:12px 16px;border-radius:14px;font-weight:900;background:#fff;">View Templates</a>
      </div>

      <div style="display:flex;gap:14px;align-items:center;margin-top:18px;color:#64748b;font-size:13px;">
        <div style="display:flex;gap:8px;align-items:center;"><span style="width:10px;height:10px;border-radius:999px;background:#22c55e;display:inline-block;"></span> Live preview</div>
        <div style="display:flex;gap:8px;align-items:center;"><span style="width:10px;height:10px;border-radius:999px;background:#22c55e;display:inline-block;"></span> SEO fields</div>
        <div style="display:flex;gap:8px;align-items:center;"><span style="width:10px;height:10px;border-radius:999px;background:#22c55e;display:inline-block;"></span> Fast editing</div>
      </div>
    </div>

    <div style="border:1px solid #e2e8f0;border-radius:18px;background:#fff;overflow:hidden;box-shadow:0 18px 60px rgba(2,6,23,.08);">
      <div style="padding:14px;border-bottom:1px solid #e2e8f0;background:#fafafa;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-weight:900;color:#0f172a;">Preview</div>
        <div style="font-size:12px;color:#64748b;">Your page</div>
      </div>
      <div style="padding:14px;">
        <div style="height:220px;border-radius:16px;background:linear-gradient(135deg,#ddd6fe,#fff);border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:800;">
          Image / Banner
        </div>
        <div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;">
          <div style="border:1px solid #e2e8f0;border-radius:14px;padding:10px;">
            <div style="font-weight:900;color:#0f172a;">Fast</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;line-height:1.5;">Quick edits</div>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:14px;padding:10px;">
            <div style="font-weight:900;color:#0f172a;">Clean</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;line-height:1.5;">Premium layout</div>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:14px;padding:10px;">
            <div style="font-weight:900;color:#0f172a;">SEO</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;line-height:1.5;">Optimized</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Logos -->
<section style="padding:24px 24px;background:#ffffff;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="color:#64748b;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;">
      Trusted by teams
    </div>
    <div style="margin-top:10px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;">
      ${Array.from({ length: 6 })
        .map(
          (_, i) => `
      <div style="border:1px dashed #e2e8f0;border-radius:14px;height:44px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-weight:900;">
        Logo ${i + 1}
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>

<!-- Features -->
<section style="padding:44px 24px;background:#ffffff;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-end;flex-wrap:wrap;">
      <div style="max-width:700px;">
        <h2 style="margin:0;color:#0f172a;font-size:30px;line-height:1.2;">Everything you need</h2>
        <p style="margin:10px 0 0;color:#475569;line-height:1.7;">
          Use templates, edit HTML quickly, preview instantly and manage SEO.
        </p>
      </div>
      <a href="#" style="text-decoration:none;border:1px solid #e2e8f0;padding:10px 12px;border-radius:12px;font-weight:900;color:#0f172a;background:#fff;">Explore</a>
    </div>

    <div style="margin-top:16px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;">
      ${[
        ["Template Gallery", "Choose full pages and sections with live thumbnails."],
        ["Inline Editing", "Edit code with line numbers and quick actions."],
        ["SEO Panel", "Add focus keyword, title and meta description."],
        ["Safe Preview", "Sandboxed iframe preview (no scripts)."],
        ["Reusable Pages", "Use the same template for multiple pages quickly."],
        ["Fast Publishing", "Save and publish when ready."],
      ]
        .map(
          ([t, d]) => `
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#fff;">
        <div style="width:40px;height:40px;border-radius:14px;background:#f5f3ff;border:1px solid #ddd6fe;display:flex;align-items:center;justify-content:center;color:#7c3aed;font-weight:900;">★</div>
        <div style="margin-top:10px;font-weight:900;color:#0f172a;">${t}</div>
        <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>

<!-- Footer -->
<footer style="padding:24px 24px;background:#0b1220;color:#cbd5e1;">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;">
    <div style="font-weight:900;">Website • Premium Builder</div>
    <div style="display:flex;gap:14px;font-weight:800;font-size:13px;">
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Privacy</a>
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Terms</a>
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Support</a>
    </div>
  </div>
</footer>
`,
  },
  {
    key: "about-premium-01",
    category: "about",
    name: "About – Company Story",
    desc: "Hero, mission, values, timeline, team, CTA, footer",
    seo: {
      focusKeyword: "about company",
      seoTitle: "About Our Company",
      metaDescription:
        "Learn about our mission, values, team and journey. A premium about page layout ready to customize.",
    },
    html: `
<section style="padding:56px 24px;font-family:ui-sans-serif,system-ui;background:#ffffff;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between;">
      <div style="max-width:720px;">
        <div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e2e8f0;border-radius:999px;padding:7px 10px;color:#334155;font-size:12px;background:#fff;">
          <span style="width:8px;height:8px;border-radius:999px;background:#7c3aed;display:inline-block;"></span>
          About us
        </div>
        <h1 style="margin:12px 0 10px;font-size:40px;line-height:1.12;color:#0f172a;">We build premium experiences</h1>
        <p style="margin:0;color:#475569;line-height:1.75;max-width:70ch;">
          Write your company story here. Keep it simple, credible and focused on customer impact.
        </p>
      </div>
      <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">Work with us</a>
    </div>

    <div style="margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
      <div style="height:240px;background:linear-gradient(135deg,#ddd6fe,#ffffff);display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:900;">
        Company Banner Image
      </div>
    </div>
  </div>
</section>

<footer style="padding:24px 24px;background:#0b1220;color:#cbd5e1;font-family:ui-sans-serif,system-ui;">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;">
    <div style="font-weight:900;">Company</div>
    <div style="display:flex;gap:14px;font-weight:800;font-size:13px;">
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Privacy</a>
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Terms</a>
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Support</a>
    </div>
  </div>
</footer>
`,
  },
  {
    key: "services-premium-01",
    category: "services",
    name: "Services – Premium List",
    desc: "Hero, service cards, process, case studies, CTA, footer",
    seo: {
      focusKeyword: "services",
      seoTitle: "Our Services",
      metaDescription:
        "Explore our services, process and case studies. A premium services page layout ready to customize.",
    },
    html: `
<section style="padding:56px 24px;font-family:ui-sans-serif,system-ui;background:#ffffff;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between;">
      <div style="max-width:760px;">
        <div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e2e8f0;border-radius:999px;padding:7px 10px;color:#334155;font-size:12px;background:#fff;">
          <span style="width:8px;height:8px;border-radius:999px;background:#7c3aed;display:inline-block;"></span>
          Services
        </div>
        <h1 style="margin:12px 0 10px;font-size:40px;line-height:1.12;color:#0f172a;">Services that grow your business</h1>
        <p style="margin:0;color:#475569;line-height:1.75;max-width:70ch;">
          Add a short introduction. Keep it benefit-focused and simple.
        </p>
      </div>
      <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">Get a Quote</a>
    </div>
  </div>
</section>

<footer style="padding:24px 24px;background:#0b1220;color:#cbd5e1;font-family:ui-sans-serif,system-ui;">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;">
    <div style="font-weight:900;">Services</div>
    <div style="display:flex;gap:14px;font-weight:800;font-size:13px;">
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Privacy</a>
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Terms</a>
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Support</a>
    </div>
  </div>
</footer>
`,
  },
  {
    key: "contact-premium-01",
    category: "contact",
    name: "Contact – Premium",
    desc: "CTA band, contact info, map placeholder, form layout, FAQ, footer",
    seo: {
      focusKeyword: "contact",
      seoTitle: "Contact Us",
      metaDescription:
        "Get in touch with us. Use this premium contact page layout with CTA, contact details and form section.",
    },
    html: `
<section style="padding:56px 24px;font-family:ui-sans-serif,system-ui;background:#ffffff;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between;">
      <div style="max-width:760px;">
        <div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e2e8f0;border-radius:999px;padding:7px 10px;color:#334155;font-size:12px;background:#fff;">
          <span style="width:8px;height:8px;border-radius:999px;background:#7c3aed;display:inline-block;"></span>
          Contact
        </div>
        <h1 style="margin:12px 0 10px;font-size:40px;line-height:1.12;color:#0f172a;">Let’s talk</h1>
        <p style="margin:0;color:#475569;line-height:1.75;max-width:70ch;">
          Add a short line about response time and what details the customer should share.
        </p>
      </div>
      <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">Book a Call</a>
    </div>
  </div>
</section>

<footer style="padding:24px 24px;background:#0b1220;color:#cbd5e1;font-family:ui-sans-serif,system-ui;">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;">
    <div style="font-weight:900;">Contact</div>
    <div style="display:flex;gap:14px;font-weight:800;font-size:13px;">
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Privacy</a>
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Terms</a>
      <a href="#" style="text-decoration:none;color:#cbd5e1;">Support</a>
    </div>
  </div>
</footer>
`,
  },
];

/* -----------------------------
  HTML Editor (line numbers + tab indent)
------------------------------ */
const HtmlCodeEditor = forwardRef<
  HTMLTextAreaElement,
  {
    value: string;
    onChange: (v: string) => void;
    rows?: number;
    placeholder?: string;
  }
>(function HtmlCodeEditor(
  { value, onChange, rows = 18, placeholder = "<h1>Title</h1><p>Content...</p>" },
  ref
) {
  const lnRef = useRef<HTMLPreElement | null>(null);

  const lineCount = useMemo(
    () => Math.max(1, (value || "").split("\n").length),
    [value]
  );
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => String(i + 1)).join("\n"),
    [lineCount]
  );

  const syncScroll = (ta?: HTMLTextAreaElement | null) => {
    if (!ta || !lnRef.current) return;
    lnRef.current.scrollTop = ta.scrollTop;
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();

    const el = e.currentTarget;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const insert = "  ";
    const next = (value || "").slice(0, start) + insert + (value || "").slice(end);
    onChange(next);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + insert.length;
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">HTML Editor</div>
        <div className="text-xs text-slate-500">Tab indent • Live preview</div>
      </div>

      <div className="grid grid-cols-[52px_1fr]">
        <div className="border-r border-slate-200 bg-slate-50">
          <pre
            ref={lnRef}
            className={cn(
              "h-full max-h-[560px] overflow-hidden",
              "px-3 py-4 text-right",
              "font-mono text-[12.5px] leading-6 text-slate-400 select-none"
            )}
          >
            {lineNumbers}
          </pre>
        </div>

        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={(e) => syncScroll(e.currentTarget)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={rows}
            className={cn(
              "w-full max-h-[560px] min-h-[520px] overflow-auto",
              "px-5 py-4",
              "font-mono text-[13px] leading-6 text-slate-900",
              "outline-none bg-white",
              "focus:ring-2 focus:ring-violet-200 focus:border-violet-300",
              "resize-none"
            )}
          />
          <div className="px-5 pb-3 pt-3 text-xs text-slate-500">
            Escaped HTML like{" "}
            <span className="font-mono">&amp;lt;div&amp;gt;</span> will be converted
            automatically.
          </div>
        </div>
      </div>
    </div>
  );
});

/* -----------------------------
  SEO helpers (same style)
------------------------------ */
function SeoRow({
  ok,
  warn,
  text,
}: {
  ok?: boolean;
  warn?: boolean;
  text: string;
}) {
  const Icon = ok ? CheckCircle2 : warn ? AlertCircle : Info;
  const cls = ok ? "text-emerald-600" : warn ? "text-amber-600" : "text-slate-500";

  return (
    <div className="flex items-start gap-2 text-[12.5px]">
      <Icon className={cn("mt-0.5 h-4 w-4", cls)} />
      <div
        className={cn(
          "leading-5",
          ok ? "text-slate-700" : warn ? "text-slate-700" : "text-slate-600"
        )}
      >
        {text}
      </div>
    </div>
  );
}

/* -----------------------------
  Main Component (EDIT PAGE) — same UI like PageCreator
------------------------------ */
export default function   PageEditor({
  id,
  item,
  fields,
  apiEndpoint = "/api/pages",
  onDeleteRedirect = "/admin/pages",
  viewUrl,
}: PageEditorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const { curretAgency } = useSelector((state: RootState) => state.agency);

  const [saving, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const [mode, setMode] = useState<"html" | "preview">("html");
  const [slugTouched, setSlugTouched] = useState(false);

  // ✅ Template Gallery state (right side panel)
  const [tplCategory, setTplCategory] = useState<"all" | TemplateCategory>("all");
  const [tplSearch, setTplSearch] = useState("");
  const [selectedTplKey, setSelectedTplKey] = useState<string>(
    PAGE_TEMPLATES[0]?.key || ""
  );
  const [showTplCode, setShowTplCode] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // Hide tenant/website fields in UI (still in payload)
  const HIDDEN_FIELDS = useMemo(
    () =>
      new Set([
        "tenantId",
        "websiteId",
        "tenant",
        "website",
        "tenant_id",
        "website_id",
      ]),
    []
  );

  const shouldHideField = (field: FieldConfig) => {
    if (HIDDEN_FIELDS.has(field.name)) return true;
    const lbl = (field.label || "").toLowerCase().trim();
    if (lbl === "tenant" || lbl === "website") return true;
    return false;
  };

  // Form state (includes SEO like PageCreator)
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "readonly") return;

      const { name, type, nestedKey } = field;

      if (nestedKey && item?.[name] && typeof item[name] === "object") {
        initial[name] = item[name]?.[nestedKey] ?? "";
      } else if (type === "array") {
        initial[name] = Array.isArray(item?.[name]) ? item[name] : [];
      } else {
        initial[name] = item?.[name] ?? "";
      }
    });

    // normalize HTML content
    if (typeof initial.content === "string") {
      initial.content = unescapeHtmlIfNeeded(initial.content);
    }

    // SEO fields (safe even if backend ignores)
    initial.seoTitle = item?.seoTitle ?? "";
    initial.metaDescription = item?.metaDescription ?? "";
    initial.focusKeyword = item?.focusKeyword ?? "";

    // Keep ids
    initial.tenantId = item?.tenantId ?? "";
    initial.websiteId = item?.websiteId ?? "";

    return initial;
  });

  // Keep ids from currentWebsite if available
  useEffect(() => {
    if (currentWebsite?._id && currentWebsite?.tenantId) {
      setFormData((p) => ({
        ...p,
        websiteId: p.websiteId || currentWebsite._id,
        tenantId: p.tenantId || currentWebsite.tenantId,
      }));
    }
  }, [currentWebsite]);

  const setContentValue = (raw: string) => {
    const normalized = unescapeHtmlIfNeeded(raw || "");
    setFormData((p) => ({ ...p, content: normalized }));
  };

  const handleChange = (name: string, value: any) => {
    if (name === "title" || name === "name") {
      const nextSlug = slugify(String(value || ""));
      setFormData((p) => ({
        ...p,
        [name]: value,
        ...(slugTouched ? {} : { slug: nextSlug }),
      }));
      return;
    }

    if (name === "slug") setSlugTouched(true);

    if (name === "content") {
      setContentValue(value);
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Array field handlers
  const handleArrayAdd = (name: string) => {
    const arr = [...(formData[name] || [])];
    arr.push("");
    setFormData((p) => ({ ...p, [name]: arr }));
  };
  const handleArrayChange = (name: string, idx: number, value: string) => {
    const arr = [...(formData[name] || [])];
    arr[idx] = value;
    setFormData((p) => ({ ...p, [name]: arr }));
  };
  const handleArrayRemove = (name: string, idx: number) => {
    const arr = [...(formData[name] || [])];
    arr.splice(idx, 1);
    setFormData((p) => ({ ...p, [name]: arr }));
  };

  const goBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("agencyid", curretAgency?._id?.toString() ?? "");
    params.set("businessid", currentBusiness?._id?.toString() ?? "");
    const primaryBusiness = currentWebsite?.primaryDomain?.[0] ?? null;
    router.push(
      `/admin/websites/${primaryBusiness}/website/pages?${params.toString()}`
    );
  };

  // Build payload (supports nestedKey)
  const buildPayload = () => {
    const payload: Record<string, any> = { ...item };

    // Always keep ids
    payload._id = item?._id || id;
    payload.tenantId = formData.tenantId ?? item?.tenantId ?? "";
    payload.websiteId = formData.websiteId ?? item?.websiteId ?? "";

    fields.forEach((f) => {
      if (f.type === "readonly") return;
      if (shouldHideField(f)) {
        // still allow payload to be updated if you want; keeping item values
        return;
      }

      const { name, nestedKey } = f;

      if (nestedKey) {
        payload[name] = typeof payload[name] === "object" && payload[name] ? payload[name] : {};
        payload[name][nestedKey] = formData[name];
      } else {
        payload[name] = formData[name];
      }
    });

    // SEO fields (optional)
    payload.seoTitle = formData.seoTitle;
    payload.metaDescription = formData.metaDescription;
    payload.focusKeyword = formData.focusKeyword;

    return payload;
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setMsg(null);
    const {header, updatedHtml} = extractHeader(editorRef.current?.value ?? null);
    console.log("hehhhhh", header)
    if (!formData?.title || !formData?.slug || !formData?.websiteId) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!formData?.content) {
      toast.error("Content is required");
      return;
    }
    const keepHeader = confirm("Do you want to keep the existing header?");

    if (keepHeader) {
      // User clicked "OK" (Yes)
      console.log("Keeping existing header");
      handleUpdate()
    } else {
      handleUpdate()
    }

    // startTransition(async () => {
    //   try {
    //     const payload = buildPayload();
    //     const res = await dispatch(updateWebsitePage(payload as any));
    //     if (updateWebsitePage.fulfilled.match(res)) {
    //       setMsg("Updated successfully!");
    //       toast.success("Page Updated Successfully");
    //       goBack();
    //     } else {
    //       setMsg("Update failed");
    //       toast.error("Update failed");
    //     }
    //   } catch (err) {
    //     setMsg("Update failed");
    //     toast.error("Update failed");
    //   }
    // });
  };



  const handleUpdate = () => {
    startTransition(async () => {
      try {
        const payload = buildPayload();
        const res = await dispatch(updateWebsitePage(payload as any));
  
        if (updateWebsitePage.fulfilled.match(res)) {
          setMsg("Updated successfully!");
          toast.success("Page Updated Successfully");
          goBack();
        } else {
          setMsg("Update failed");
          toast.error("Update failed");
        }
      } catch (err) {
        setMsg("Update failed");
        toast.error("Update failed");
      }
    });
  };
  const handleDelete = async () => {
    if (!confirm("Delete this page?")) return;
    try {
      const res = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted");
        window.location.href = onDeleteRedirect;
      } else {
        toast.error("Delete failed");
        setMsg("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
      setMsg("Delete failed");
    }
  };

  /* -----------------------------
    Computed preview + SEO stats
  ------------------------------ */
  const renderableHtml = useMemo(
    () => unescapeHtmlIfNeeded(String(formData?.content || "")),
    [formData?.content]
  );
  const iframeDoc = useMemo(() => buildIframeDoc(renderableHtml), [renderableHtml]);

  const focusKeyword = (formData?.focusKeyword || "").trim();
  const seoTitleLen = String(formData?.seoTitle || "").trim().length;

  const pageText = useMemo(() => stripHtmlToText(renderableHtml), [renderableHtml]);
  const wordCount = useMemo(() => countWords(pageText), [pageText]);

  const imgStats = useMemo(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<body>${renderableHtml}</body>`, "text/html");
      const imgs = Array.from(doc.querySelectorAll("img"));
      const total = imgs.length;
      const withAlt = imgs.filter((i) => (i.getAttribute("alt") || "").trim().length > 0)
        .length;
      return { total, withAlt };
    } catch {
      return { total: 0, withAlt: 0 };
    }
  }, [renderableHtml]);

  const baseUrl = useMemo(() => {
    const domain = currentWebsite?.primaryDomain?.[0];
    if (domain) return `https://${domain}`;
    return "";
  }, [currentWebsite]);

  const fullUrl = useMemo(() => {
    const s = (formData?.slug || "").trim();
    if (!s) return "";
    return baseUrl ? `${baseUrl}/${s}` : `/${s}`;
  }, [baseUrl, formData?.slug]);

  /* -----------------------------
    Templates Gallery (RIGHT SIDE)
  ------------------------------ */
  const selectedTemplate = useMemo(
    () => PAGE_TEMPLATES.find((t) => t.key === selectedTplKey) || PAGE_TEMPLATES[0],
    [selectedTplKey]
  );

  const filteredTemplates = useMemo(() => {
    const q = tplSearch.trim().toLowerCase();
    return PAGE_TEMPLATES.filter((t) => {
      const catOk = tplCategory === "all" ? true : t.category === tplCategory;
      const qOk = !q
        ? true
        : (t.name + " " + t.desc + " " + t.category).toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [tplCategory, tplSearch]);

  const applyTemplate = (tpl: PageTemplate, withSeoDefaults = true) => {
    setContentValue(tpl.html);

    if (withSeoDefaults && tpl.seo) {
      setFormData((p) => ({
        ...p,
        focusKeyword: p.focusKeyword || tpl.seo?.focusKeyword || "",
        seoTitle: p.seoTitle || tpl.seo?.seoTitle || "",
        metaDescription: p.metaDescription || tpl.seo?.metaDescription || "",
      }));
    }

    toast.success(`Applied template: ${tpl.name}`);
  };

  const insertTemplateAtCursor = (tpl: PageTemplate) => {
    const el = editorRef.current;
    const current = String(formData?.content || "");
    const insertText = `\n${tpl.html}\n`;

    if (!el) {
      setContentValue(current + insertText);
      toast.success(`Inserted template: ${tpl.name}`);
      return;
    }

    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + insertText + current.slice(end);
    setContentValue(next);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + insertText.length;
      el.setSelectionRange(pos, pos);
    });

    toast.success(`Inserted template: ${tpl.name}`);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  /* -----------------------------
    Fields split
  ------------------------------ */
  const leftFields = fields.filter((f) => f.side === "left" || f.side === "NA");
  const rightFields = fields.filter((f) => f.side === "right");
  const readonlyFields = fields.filter((f) => f.type === "readonly");

  /* -----------------------------
    Field renderer (same style like PageCreator)
  ------------------------------ */
  const renderField = (field: FieldConfig) => {
    if (shouldHideField(field)) return null;

    const { name, label, type, options, placeholder, readOnly, rows, nestedKey } =
      field;

    if (type === "readonly") {
      const raw =
        nestedKey && item?.[name] && typeof item[name] === "object"
          ? item[name]?.[nestedKey]
          : item?.[name];

      const value =
        raw == null || raw === "" ? "—" : String(raw);

      return (
    
          <div key={`${name}${nestedKey ? "." + nestedKey : ""}`} className="grid items-center gap-2">
        
          <span className="text-xs font-semibold text-slate-600">{label}:</span>
          <span className="text-xs text-slate-700 px-2.5 py-2 rounded-md border border-slate-200 bg-white">
            {value}
          </span>
          </div>
      );
    }

    if (type === "array") {
      const arr = formData[name] || [];
      return (
        <div key={name} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-md"
              onClick={() => handleArrayAdd(name)}
            >
              + Add
            </Button>
          </div>

          <div className="space-y-2">
            {arr.map((v: string, i: number) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={v}
                  onChange={(e) => handleArrayChange(name, i, e.target.value)}
                  className="h-11 rounded-md border-slate-200"
                  placeholder={placeholder}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-md border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleArrayRemove(name, i)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (name === "content") {
      return (
        <>
        <div key={name} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label className="text-[14px] font-semibold text-slate-900">{label}</Label>
              <div className="text-xs text-slate-500 mt-0.5">
                Edit HTML and preview instantly. Use templates from the right panel.
              </div>
            </div>

            <div className="flex items-center rounded-md border border-slate-200 bg-white p-1 shadow-sm">
              <Button
                type="button"
                variant={mode === "html" ? "default" : "ghost"}
                className={cn(
                  "h-9 rounded-md px-4",
                  mode === "html" && "bg-violet-600 hover:bg-violet-700 text-white"
                )}
                onClick={() => setMode("html")}
              >
                HTML
              </Button>
              <Button
                type="button"
                variant={mode === "preview" ? "default" : "ghost"}
                className={cn(
                  "h-9 rounded-md px-4",
                  mode === "preview" && "bg-violet-600 hover:bg-violet-700 text-white"
                )}
                onClick={() => setMode("preview")}
              >
                Preview
              </Button>
            </div>
          </div>

          {mode === "html" && (
            <HtmlCodeEditor
              ref={editorRef}
              value={formData.content || ""}
              onChange={(v) => handleChange("content", v)}
              rows={rows || 18}
              placeholder="<h1>Title</h1><p>Content...</p>"
            />
          )}

          {mode === "preview" && (
            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Live Preview</div>
                <div className="text-xs text-slate-500">Sandbox iframe</div>
              </div>

              <div className="p-4">
                <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
                  <iframe
                    title="preview"
                    className="w-full h-[520px] bg-white"
                    srcDoc={iframeDoc}
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      );
    }

    if (type === "text") {
      return (
        <div key={name} className="space-y-2">
          <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
          <Input
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            className={cn(
              "h-11 rounded-md bg-white border-slate-200",
              readOnly && "bg-slate-50 text-slate-700"
            )}
          />
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div key={name} className="space-y-2">
          <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
          <textarea
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
            rows={rows || 6}
            className={cn(
              "w-full rounded-md border border-slate-200 bg-white px-5 py-4",
              "text-[14px] leading-6 text-slate-900 outline-none",
              "focus:ring-2 focus:ring-violet-200 focus:border-violet-300",
              "resize-none"
            )}
          />
        </div>
      );
    }

    if (type === "select" && options) {
      return (
        <div key={name} className="space-y-2">
          <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
          <Select value={formData[name] || ""} onValueChange={(v) => handleChange(name, v)}>
            <SelectTrigger className="h-11 w-full rounded-md bg-white border-slate-200">
              <SelectValue placeholder={placeholder || "Select"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return null;
  };

  /* -----------------------------
    Thumbnails settings (same as PageCreator)
  ------------------------------ */
  const THUMB_SCALE = 0.32;
  const thumbW = `${100 / THUMB_SCALE}%`;
  const thumbH = `${100 / THUMB_SCALE}%`;

  const CARD_SCALE = 0.22;
  const cardW = `${100 / CARD_SCALE}%`;
  const cardH = `${100 / CARD_SCALE}%`;

  const SELECTED_SCALE = 0.26;
  const selectedW = `${100 / SELECTED_SCALE}%`;
  const selectedH = `${100 / SELECTED_SCALE}%`;

  return (
    <form onSubmit={onSubmit} className="min-h-screen w-full">
      <div className=" mx-auto px-2 py-7">
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4">
          <div className="mt-3">
            <BreadCrumbPage />
            {/* {readonlyFields.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">{readonlyFields.map(renderField)}</div>
            )} */}
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            {viewUrl && (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  const domain = viewUrl?.item?.primaryDomain?.[0] || currentWebsite?.primaryDomain?.[0];
                  const slug = String(formData?.slug || item?.slug || "");
                  if (!domain) {
                    toast.error("No domain found");
                    return;
                  }
                  const url = `https://${domain}/${slug.replace(/^\//, "")}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
            )}

            <Button type="button" variant="outline" onClick={goBack}>
              Cancel
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {msg && (
          <div
            className={cn(
              "mt-5 rounded-md border px-4 py-3 shadow-sm",
              msg.toLowerCase().includes("success")
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            )}
          >
            <div className="text-sm font-medium">{msg}</div>
          </div>
        )}

        {/* Main grid */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left */}
          <div className="lg:col-span-8">
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7">
              <div className="space-y-4">
                {leftFields.map((f) => renderField(f))}
                </div>
            </div>

            {/* SEO Panel (same style) */}
            <div className="rounded-md border border-slate-200 bg-white overflow-hidden mt-4">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                <div className="text-sm font-semibold text-slate-900">SEO</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Improve search visibility with better title, description and keywords.
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="space-y-2">
                  <Label className="text-[13px] font-semibold text-slate-900">
                    Focus keyword
                  </Label>
                  <Input
                    value={formData.focusKeyword || ""}
                    onChange={(e) => handleChange("focusKeyword", e.target.value)}
                    placeholder="e.g. sustainability, roofing, modern exterior"
                    className="h-11 rounded-md bg-white border-slate-200"
                  />
                  <div className="text-xs text-slate-500">
                    Use a phrase you want this page to rank for.
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-semibold text-slate-900">
                    SEO title
                  </Label>
                  <Input
                    value={formData.seoTitle || ""}
                    onChange={(e) => handleChange("seoTitle", e.target.value)}
                    placeholder="Page SEO title"
                    className="h-11 rounded-md bg-white border-slate-200"
                  />
                  <div className="space-y-1 pt-1">
                    <SeoRow
                      ok={inRange(seoTitleLen, 10, 60)}
                      warn={seoTitleLen > 0 && !inRange(seoTitleLen, 10, 60)}
                      text={`Length: ${seoTitleLen} (recommended 10–60)`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-semibold text-slate-900">
                    Meta description
                  </Label>
                  <textarea
                    value={formData.metaDescription || ""}
                    onChange={(e) => handleChange("metaDescription", e.target.value)}
                    placeholder="Write a short summary for search results..."
                    rows={4}
                    className={cn(
                      "w-full rounded-md border border-slate-200 bg-white px-4 py-3",
                      "text-[13.5px] leading-6 text-slate-900 outline-none",
                      "focus:ring-2 focus:ring-violet-200 focus:border-violet-300",
                      "resize-none"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-semibold text-slate-900">Page URL</Label>
                  <Input
                    value={formData.slug || ""}
                    readOnly
                    className="h-11 rounded-md bg-slate-50 border-slate-200 text-slate-700 mt-2"
                  />
                  <div className="text-xs text-slate-500 py-2">
                    Full URL: <span className="font-mono">{fullUrl || "—"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-semibold text-slate-900">
                    Other SEO tips
                  </Label>
                  <div className="space-y-1">
                    <SeoRow
                      ok={wordCount >= 300}
                      warn={wordCount > 0 && wordCount < 300}
                      text={`Recommended 300+ words. Current: ${wordCount}`}
                    />
                    <SeoRow
                      ok={imgStats.total === 0 ? true : imgStats.withAlt === imgStats.total}
                      warn={imgStats.total > 0 && imgStats.withAlt < imgStats.total}
                      text={`Images with alt text: ${imgStats.withAlt}/${imgStats.total}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-7">
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7">
              <div className="space-y-7">
                {rightFields.map((f) => renderField(f))}

                {/* ✅ Templates Panel (same as PageCreator) */}
                <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Page Templates
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Select template → see thumbnail → Apply / Insert
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={tplSearch}
                        onChange={(e) => setTplSearch(e.target.value)}
                        placeholder="Search templates..."
                        className="h-11 rounded-md bg-white border-slate-200"
                      />

                      <Select value={tplCategory} onValueChange={(v) => setTplCategory(v as any)}>
                        <SelectTrigger className="h-11 rounded-md bg-white border-slate-200">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="about">About</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="contact">Contact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-auto pr-1">
                      {filteredTemplates.map((t) => {
                        const isActive = t.key === selectedTplKey;
                        const doc = buildIframeDoc(t.html);
                        return (
                          <button
                            type="button"
                            key={t.key}
                            onClick={() => {
                              setSelectedTplKey(t.key);
                              setShowTplCode(false);
                            }}
                            className={cn(
                              "text-left rounded-md border bg-white overflow-hidden shadow-sm",
                              isActive
                                ? "border-violet-400 ring-2 ring-violet-200"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <div className="px-3 py-2 border-b border-slate-200 bg-white">
                              <div className="text-[12.5px] font-semibold text-slate-900 truncate">
                                {t.name}
                              </div>
                              <div className="text-[11px] text-slate-500 capitalize">
                                {t.category}
                              </div>
                            </div>

                            <div className="p-2 bg-slate-50">
                              <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
                                <div className="relative aspect-[16/10] w-full bg-white overflow-hidden">
                                  <iframe
                                    title={`tpl-${t.key}`}
                                    srcDoc={doc}
                                    sandbox="allow-same-origin"
                                    className="absolute left-0 top-0 origin-top-left"
                                    style={{
                                      transform: `scale(${CARD_SCALE})`,
                                      width: cardW,
                                      height: cardH,
                                      pointerEvents: "none",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 p-4 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {selectedTemplate?.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {selectedTemplate?.desc}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-md"
                        onClick={() => setShowTplCode((p) => !p)}
                      >
                        {showTplCode ? "Hide code" : "Show code"}
                      </Button>
                    </div>

                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                      <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
                        <div className="relative aspect-[16/10] w-full bg-white overflow-hidden">
                          <iframe
                            title="selected-template"
                            srcDoc={buildIframeDoc(selectedTemplate?.html || "")}
                            sandbox="allow-same-origin"
                            className="absolute left-0 top-0 origin-top-left"
                            style={{
                              transform: `scale(${SELECTED_SCALE})`,
                              width: selectedW,
                              height: selectedH,
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          className="h-10 rounded-md"
                          onClick={() => applyTemplate(selectedTemplate, true)}
                        >
                          Apply Template
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-md"
                          onClick={() => insertTemplateAtCursor(selectedTemplate)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Insert
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-md"
                          onClick={() => copyToClipboard(selectedTemplate?.html || "")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>

                      {showTplCode && (
                        <div className="mt-3">
                          <pre className="max-h-[240px] overflow-auto rounded-md border border-slate-200 bg-white p-3 text-[12px] leading-5 text-slate-800">
                            {selectedTemplate?.html || ""}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ Page Thumbnail Preview (current page) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[13px] font-semibold text-slate-900">
                      Page Thumbnail Preview
                    </Label>
                    <div className="text-xs text-slate-500">Auto from HTML</div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                    <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
                      <div className="relative aspect-[16/10] w-full bg-white overflow-hidden">
                        <iframe
                          title="thumbnail"
                          srcDoc={iframeDoc}
                          sandbox="allow-same-origin"
                          className="absolute left-0 top-0 origin-top-left"
                          style={{
                            transform: `scale(${THUMB_SCALE})`,
                            width: thumbW,
                            height: thumbH,
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      Mini preview shows more of the page now (scaled).
                    </div>
                  </div>
                </div>

                {/* Hidden IDs (still in payload) */}
                <input type="hidden" name="tenantId" value={formData.tenantId || ""} />
                <input type="hidden" name="websiteId" value={formData.websiteId || ""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
