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
import { AlertCircle, CheckCircle2, Copy, Info, PlusCircle } from "lucide-react";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import BreadCrumbPage from "../breadCrumb/BreadCrumbPage";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createWebsitePage } from "@/hooks/slices/website/websitePageSlice";

/* -----------------------------
  Types
------------------------------ */
export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "array";
  options?: { value: string; label: string }[];
  side: "left" | "right";
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
};

export type PageCreatorProps = {
  item: any;
  fields: FieldConfig[];
  apiEndpoint?: string;
  onCreateRedirect?: string;
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

<!-- Testimonials -->
<section style="padding:44px 24px;background:#f8fafc;">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="margin:0;color:#0f172a;font-size:30px;line-height:1.2;">What people say</h2>
    <div style="margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;">
      ${[
        ["“Clean UI and easy editing.”", "Rahul", "Admin"],
        ["“Templates saved a lot of time.”", "Aditi", "Marketing"],
        ["“Preview + SEO is perfect.”", "Vikram", "Founder"],
      ]
        .map(
          ([q, n, r]) => `
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#fff;">
        <div style="color:#0f172a;font-weight:900;line-height:1.6;">${q}</div>
        <div style="margin-top:12px;display:flex;gap:10px;align-items:center;">
          <div style="width:38px;height:38px;border-radius:14px;background:#ddd6fe;display:flex;align-items:center;justify-content:center;font-weight:900;color:#4c1d95;">${n[0]}</div>
          <div>
            <div style="font-weight:900;color:#0f172a;line-height:1;">${n}</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;">${r}</div>
          </div>
        </div>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>

<!-- Pricing -->
<section style="padding:44px 24px;background:#ffffff;">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="margin:0;color:#0f172a;font-size:30px;line-height:1.2;">Pricing</h2>
    <p style="margin:10px 0 0;color:#475569;line-height:1.7;">Pick a plan and start building pages.</p>

    <div style="margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;">
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;">
        <div style="font-weight:900;color:#0f172a;">Starter</div>
        <div style="color:#64748b;margin-top:6px;">For small teams</div>
        <div style="margin-top:14px;font-size:30px;font-weight:900;color:#0f172a;">₹9,999</div>
        <ul style="margin:12px 0 0;padding-left:18px;color:#475569;line-height:1.8;">
          <li>Templates</li>
          <li>Preview</li>
          <li>Basic SEO</li>
        </ul>
        <a href="#" style="margin-top:14px;display:inline-block;text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:12px 14px;border-radius:12px;font-weight:900;">Choose</a>
      </div>

      <div style="border:1px solid #7c3aed;border-radius:18px;padding:18px;box-shadow:0 12px 40px rgba(124,58,237,.18);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
          <div style="font-weight:900;color:#0f172a;">Pro</div>
          <div style="font-size:12px;font-weight:900;color:#7c3aed;border:1px solid #ddd6fe;padding:6px 10px;border-radius:999px;background:#f5f3ff;">Popular</div>
        </div>
        <div style="color:#64748b;margin-top:6px;">For growing businesses</div>
        <div style="margin-top:14px;font-size:30px;font-weight:900;color:#0f172a;">₹24,999</div>
        <ul style="margin:12px 0 0;padding-left:18px;color:#475569;line-height:1.8;">
          <li>All Starter</li>
          <li>Advanced templates</li>
          <li>Priority support</li>
        </ul>
        <a href="#" style="margin-top:14px;display:inline-block;text-decoration:none;background:#7c3aed;color:#fff;padding:12px 14px;border-radius:12px;font-weight:900;">Choose</a>
      </div>

      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;">
        <div style="font-weight:900;color:#0f172a;">Enterprise</div>
        <div style="color:#64748b;margin-top:6px;">Custom needs</div>
        <div style="margin-top:14px;font-size:30px;font-weight:900;color:#0f172a;">Let’s talk</div>
        <ul style="margin:12px 0 0;padding-left:18px;color:#475569;line-height:1.8;">
          <li>Custom layouts</li>
          <li>SLA support</li>
          <li>Dedicated manager</li>
        </ul>
        <a href="#" style="margin-top:14px;display:inline-block;text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:12px 14px;border-radius:12px;font-weight:900;">Contact</a>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="padding:44px 24px;background:#ffffff;">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="margin:0;color:#0f172a;font-size:30px;line-height:1.2;">FAQ</h2>
    <div style="margin-top:14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;">
      ${[
        ["Can I edit the HTML?", "Yes, edit directly and preview instantly."],
        ["Can I reuse templates?", "Yes, apply templates to any page."],
        ["Does it support SEO?", "Add SEO title, meta description and keyword."],
        ["Is preview safe?", "Preview runs in sandbox iframe (no scripts)."],
      ]
        .map(
          ([q, a]) => `
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
        <div style="font-weight:900;color:#0f172a;">${q}</div>
        <div style="margin-top:6px;color:#64748b;line-height:1.7;">${a}</div>
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

    <div style="margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
        <div style="font-weight:900;color:#0f172a;font-size:18px;">Mission</div>
        <div style="margin-top:8px;color:#64748b;line-height:1.75;">
          Describe your mission in 2–4 lines. What do you do, for whom, and why does it matter?
        </div>
      </div>
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
        <div style="font-weight:900;color:#0f172a;font-size:18px;">Vision</div>
        <div style="margin-top:8px;color:#64748b;line-height:1.75;">
          Describe the long-term vision and where you want to take your customers.
        </div>
      </div>
    </div>

    <div style="margin-top:18px;">
      <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;">Values</h2>
      <div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;">
        ${[
          ["Quality", "Premium outcomes with attention to detail."],
          ["Speed", "Fast iterations without breaking trust."],
          ["Transparency", "Clear communication and no surprises."],
        ]
          .map(
            ([t, d]) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
          <div style="width:40px;height:40px;border-radius:14px;background:#f5f3ff;border:1px solid #ddd6fe;display:flex;align-items:center;justify-content:center;color:#7c3aed;font-weight:900;">✓</div>
          <div style="margin-top:10px;font-weight:900;color:#0f172a;">${t}</div>
          <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
        </div>`
          )
          .join("")}
      </div>
    </div>

    <div style="margin-top:18px;">
      <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;">Timeline</h2>
      <div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;">
        ${[
          ["2022", "Started with a small team."],
          ["2023", "Launched first premium templates."],
          ["2024", "Scaled to multiple brands and clients."],
        ]
          .map(
            ([y, d]) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
          <div style="font-weight:900;color:#7c3aed;font-size:18px;">${y}</div>
          <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
        </div>`
          )
          .join("")}
      </div>
    </div>

    <div style="margin-top:18px;">
      <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;">Team</h2>
      <div style="margin-top:12px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;">
        ${["A", "B", "C", "D"]
          .map(
            (x, i) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:14px;background:#fff;">
          <div style="height:140px;border-radius:16px;background:#f1f5f9;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:900;">
            Photo
          </div>
          <div style="margin-top:10px;font-weight:900;color:#0f172a;">Member ${i + 1}</div>
          <div style="margin-top:4px;color:#64748b;font-size:12px;">Role title</div>
        </div>`
          )
          .join("")}
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#faf5ff;">
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-weight:900;color:#0f172a;font-size:18px;">Want to collaborate?</div>
          <div style="margin-top:6px;color:#475569;line-height:1.7;">Add your CTA message here.</div>
        </div>
        <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">Contact us</a>
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

    <div style="margin-top:18px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;">
      ${[
        ["Website Development", "Modern responsive pages with premium UI."],
        ["SEO & Content", "Optimize titles, descriptions and page structure."],
        ["Automation", "Integrations and automation rules for growth."],
        ["Email Templates", "Professional templates for marketing campaigns."],
        ["E-commerce Setup", "Catalog, coupons, quotations and checkout."],
        ["Analytics", "Track conversions and improve performance."],
      ]
        .map(
          ([t, d]) => `
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
        <div style="width:40px;height:40px;border-radius:14px;background:#f5f3ff;border:1px solid #ddd6fe;display:flex;align-items:center;justify-content:center;color:#7c3aed;font-weight:900;">★</div>
        <div style="margin-top:10px;font-weight:900;color:#0f172a;">${t}</div>
        <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
        <a href="#" style="margin-top:12px;display:inline-block;text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:10px 12px;border-radius:12px;font-weight:900;">Learn more</a>
      </div>`
        )
        .join("")}
    </div>

    <div style="margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#f8fafc;">
      <div style="font-weight:900;color:#0f172a;font-size:18px;">Our process</div>
      <div style="margin-top:12px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;">
        ${[
          ["1. Discover", "Understand goals and requirements."],
          ["2. Design", "Premium layouts and clean UI."],
          ["3. Build", "Implement and test thoroughly."],
          ["4. Launch", "Deploy and iterate with feedback."],
        ]
          .map(
            ([t, d]) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:14px;background:#fff;">
          <div style="font-weight:900;color:#7c3aed;">${t}</div>
          <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
        </div>`
          )
          .join("")}
      </div>
    </div>

    <div style="margin-top:18px;">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-end;flex-wrap:wrap;">
        <div>
          <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;">Case studies</h2>
          <p style="margin:10px 0 0;color:#475569;line-height:1.7;">Show proof of results.</p>
        </div>
      </div>
      <div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;">
        ${[1, 2, 3]
          .map(
            (i) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;background:#fff;">
          <div style="height:160px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:900;">Image</div>
          <div style="padding:14px;">
            <div style="font-weight:900;color:#0f172a;">Project ${i}</div>
            <div style="margin-top:6px;color:#64748b;line-height:1.7;">Short summary of what you delivered.</div>
          </div>
        </div>`
          )
          .join("")}
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#faf5ff;">
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-weight:900;color:#0f172a;font-size:18px;">Ready to start?</div>
          <div style="margin-top:6px;color:#475569;line-height:1.7;">Add a CTA message here.</div>
        </div>
        <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">Contact</a>
      </div>
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

    <div style="margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#f8fafc;">
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
        <div>
          <div style="font-weight:900;color:#0f172a;font-size:18px;">Need quick help?</div>
          <div style="margin-top:6px;color:#475569;line-height:1.7;">Email us and we’ll reply within 24 hours.</div>
        </div>
        <a href="#" style="text-decoration:none;background:#0f172a;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">support@example.com</a>
      </div>
    </div>

    <div style="margin-top:18px;display:grid;grid-template-columns:.9fr 1.1fr;gap:14px;">
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#fff;">
        <div style="font-weight:900;color:#0f172a;font-size:18px;">Contact info</div>
        <div style="margin-top:10px;color:#64748b;line-height:1.8;">
          <strong style="color:#0f172a;">Email:</strong> support@example.com<br/>
          <strong style="color:#0f172a;">Phone:</strong> +91 99999 99999<br/>
          <strong style="color:#0f172a;">Address:</strong> Your address here
        </div>

        <div style="margin-top:12px;border-top:1px solid #e2e8f0;padding-top:12px;">
          <div style="font-weight:900;color:#0f172a;">Office hours</div>
          <div style="margin-top:6px;color:#64748b;">Mon–Sat, 10:00 AM – 6:00 PM</div>
        </div>

        <div style="margin-top:12px;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          <div style="height:180px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:900;">
            Map Placeholder
          </div>
        </div>
      </div>

      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#fff;">
        <div style="font-weight:900;color:#0f172a;font-size:18px;">Send a message</div>

        <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div>
            <div style="font-size:12px;color:#475569;font-weight:900;margin-bottom:6px;">Name</div>
            <div style="border:1px solid #e2e8f0;border-radius:12px;height:42px;background:#fff;"></div>
          </div>
          <div>
            <div style="font-size:12px;color:#475569;font-weight:900;margin-bottom:6px;">Email</div>
            <div style="border:1px solid #e2e8f0;border-radius:12px;height:42px;background:#fff;"></div>
          </div>
        </div>

        <div style="margin-top:10px;">
          <div style="font-size:12px;color:#475569;font-weight:900;margin-bottom:6px;">Subject</div>
          <div style="border:1px solid #e2e8f0;border-radius:12px;height:42px;background:#fff;"></div>
        </div>

        <div style="margin-top:10px;">
          <div style="font-size:12px;color:#475569;font-weight:900;margin-bottom:6px;">Message</div>
          <div style="border:1px solid #e2e8f0;border-radius:12px;height:140px;background:#fff;"></div>
        </div>

        <a href="#" style="margin-top:12px;display:inline-block;text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">
          Submit
        </a>

        <div style="margin-top:14px;color:#94a3b8;font-size:12px;line-height:1.7;">
          Note: This is template UI. Replace with your real form integration.
        </div>
      </div>
    </div>

    <div style="margin-top:18px;">
      <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;">FAQ</h2>
      <div style="margin-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;">
        ${[
          ["How fast do you respond?", "Usually within 24 hours on business days."],
          ["Can we schedule a call?", "Yes, add a link to your booking page."],
          ["Do you support WhatsApp?", "Add WhatsApp number if required."],
          ["Where are you located?", "Add your location in the map placeholder."],
        ]
          .map(
            ([q, a]) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
          <div style="font-weight:900;color:#0f172a;">${q}</div>
          <div style="margin-top:6px;color:#64748b;line-height:1.7;">${a}</div>
        </div>`
          )
          .join("")}
      </div>
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
            <span className="font-mono">&amp;lt;div&amp;gt;</span> will be converted automatically.
          </div>
        </div>
      </div>
    </div>
  );
});

/* -----------------------------
  SEO Helpers
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
  const cls = ok
    ? "text-emerald-600"
    : warn
    ? "text-amber-600"
    : "text-slate-500";

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
  Main Component
------------------------------ */
export default function PageCreator({ item, fields }: PageCreatorProps) {
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const { curretAgency } = useSelector((state: RootState) => state.agency);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [saving, startTransition] = useTransition();

  const [msg, setMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<"html" | "preview">("html");
  const [slugTouched, setSlugTouched] = useState(false);

  // ✅ Template Gallery state (right side red mark areas)
  const [tplCategory, setTplCategory] = useState<"all" | TemplateCategory>("all");
  const [tplSearch, setTplSearch] = useState("");
  const [selectedTplKey, setSelectedTplKey] = useState<string>(PAGE_TEMPLATES[0]?.key || "");
  const [showTplCode, setShowTplCode] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "array")
        initial[f.name] = Array.isArray(item?.[f.name]) ? item[f.name] : [];
      else initial[f.name] = item?.[f.name] ?? "";
    });

    initial.seoTitle = item?.seoTitle ?? "";
    initial.metaDescription = item?.metaDescription ?? "";
    initial.focusKeyword = item?.focusKeyword ?? "";

    if (currentWebsite?._id) initial.websiteId = currentWebsite._id;
    if (currentWebsite?.tenantId) initial.tenantId = currentWebsite.tenantId;

    return initial;
  });

  useEffect(() => {
    if (currentWebsite?._id && currentWebsite?.tenantId) {
      setFormData((p) => ({
        ...p,
        websiteId: currentWebsite._id,
        tenantId: currentWebsite.tenantId,
      }));
    }
  }, [currentWebsite]);

  const setContentValue = (raw: string) => {
    const normalized = unescapeHtmlIfNeeded(raw || "");
    setFormData((p) => ({ ...p, content: normalized }));
  };

  const handleChange = (name: string, value: any) => {
    if (name === "title") {
      const nextSlug = slugify(value);
      setFormData((p) => ({
        ...p,
        title: value,
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!formData?.title || !formData?.slug || !formData?.websiteId) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!formData?.content) {
      toast.error("Content is required");
      return;
    }

    startTransition(async () => {
      const res = await dispatch(createWebsitePage(formData));
      if (createWebsitePage.fulfilled.match(res)) {
        setMsg("Created successfully!");
        toast.success("Created successfully!");
        goBack();
      } else {
        setMsg("Create failed");
        toast.error("Create failed");
      }
    });
  };

  const leftFields = fields.filter((f) => f.side === "left");
  const rightFields = fields.filter((f) => f.side === "right");

  const renderableHtml = useMemo(
    () => unescapeHtmlIfNeeded(formData?.content || ""),
    [formData?.content]
  );
  const iframeDoc = useMemo(() => buildIframeDoc(renderableHtml), [renderableHtml]);

  // ✅ Thumbnail scaling (shows more of page in small box)
  const THUMB_SCALE = 0.32;
  const thumbW = `${100 / THUMB_SCALE}%`;
  const thumbH = `${100 / THUMB_SCALE}%`;

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

  // SEO computed
  const focusKeyword = (formData?.focusKeyword || "").trim();
  const seoTitleLen = String(formData?.seoTitle || "").trim().length;
  const metaLen = String(formData?.metaDescription || "").trim().length;

  const pageText = useMemo(() => stripHtmlToText(renderableHtml), [renderableHtml]);
  const wordCount = useMemo(() => countWords(pageText), [pageText]);

  const imgStats = useMemo(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        `<body>${renderableHtml}</body>`,
        "text/html"
      );
      const imgs = Array.from(doc.querySelectorAll("img"));
      const total = imgs.length;
      const withAlt = imgs.filter(
        (i) => (i.getAttribute("alt") || "").trim().length > 0
      ).length;
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

  const keywordIn = (hay: string) => {
    if (!focusKeyword) return null;
    return hay.toLowerCase().includes(focusKeyword.toLowerCase());
  };

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
    // Replace full content
    setContentValue(tpl.html);

    // Auto fill SEO (only if empty)
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
      // fallback append
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
    Field renderer
  ------------------------------ */
  const renderField = (field: FieldConfig) => {
    if (shouldHideField(field)) return null;

    const { name, label, type, options, placeholder, readOnly, rows } = field;

    if (type === "array") {
      const arr = formData[name] || [];
      return (
        <div key={name} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[13px] font-semibold text-slate-900">
              {label}
            </Label>
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

    // Content editor
    if (name === "content") {
      return (
        <div key={name} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label className="text-[14px] font-semibold text-slate-900">
                {label}
              </Label>
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
                  mode === "preview" &&
                    "bg-violet-600 hover:bg-violet-700 text-white"
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
                <div className="text-sm font-semibold text-slate-900">
                  Live Preview
                </div>
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
      );
    }

    if (type === "text") {
      return (
        <div key={name} className="space-y-2">
          <Label className="text-[13px] font-semibold text-slate-900">
            {label}
          </Label>
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
          <Label className="text-[13px] font-semibold text-slate-900">
            {label}
          </Label>
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
          <Label className="text-[13px] font-semibold text-slate-900">
            {label}
          </Label>
          <Select
            value={formData[name] || ""}
            onValueChange={(v) => handleChange(name, v)}
          >
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
    Thumbnails settings for templates (right panel)
  ------------------------------ */
  const CARD_SCALE = 0.22;
  const cardW = `${100 / CARD_SCALE}%`;
  const cardH = `${100 / CARD_SCALE}%`;

  const SELECTED_SCALE = 0.26;
  const selectedW = `${100 / SELECTED_SCALE}%`;
  const selectedH = `${100 / SELECTED_SCALE}%`;

  return (
    <form onSubmit={onSubmit} className="min-h-screen w-full">
      <div className="max-w-[1320px] mx-auto px-7 py-7">
        <div className="flex items-start justify-between gap-4">
          <div className="mt-3">
            <BreadCrumbPage />
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={goBack}>
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Save"}
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

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left */}
          <div className="lg:col-span-8">
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7">
              <div className="space-y-7">{leftFields.map((f) => renderField(f))}</div>
            </div>

            {/* SEO Panel */}
            <div className="rounded-md border border-slate-200 bg-white overflow-hidden mt-4">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                <div className="text-sm font-semibold text-slate-900">SEO</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Improve search visibility with better title, description and keywords.
                </div>
              </div>

              <div className="p-5 space-y-6">
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
                    {/* <SeoRow
                      ok={!!focusKeyword && keywordIn(String(formData.seoTitle || "")) === true}
                      warn={!focusKeyword || keywordIn(String(formData.seoTitle || "")) !== true}
                      text={
                        focusKeyword
                          ? `Include focus keyword (“${focusKeyword}”) in SEO title`
                          : "Add a focus keyword to improve SEO title"
                      }
                    /> */}
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
                  <div className="space-y-1 pt-1">
                    {/* <SeoRow
                      ok={inRange(metaLen, 120, 160)}
                      warn={metaLen > 0 && !inRange(metaLen, 120, 160)}
                      text={`Length: ${metaLen} (recommended 120–160)`}
                    /> */}
                    <SeoRow
                      ok={
                        !!focusKeyword &&
                        keywordIn(String(formData.metaDescription || "")) === true
                      }
                      warn={
                        !focusKeyword ||
                        keywordIn(String(formData.metaDescription || "")) !== true
                      }
                      text={
                        focusKeyword
                          ? `Include focus keyword (“${focusKeyword}”) in meta description`
                          : "Add a focus keyword to improve meta description"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-semibold text-slate-900">
                    Page URL
                  </Label>
                  <Input
                    value={formData.slug || ""}
                    readOnly
                    className="h-11 rounded-md bg-slate-50 border-slate-200 text-slate-700 mt-2"
                  />
                  <div className="text-xs text-slate-500 py-2">
                    Full URL: <span className="font-mono">{fullUrl || "—"}</span>
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
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-7">
            {/* RIGHT: Fields + Templates Gallery */}
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7">
              <div className="space-y-7">
                {rightFields.map((f) => renderField(f))}

                {/* =========================
                  ✅ Templates Panel (fills your RED marked areas)
                ========================== */}
                <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
                  {/* Top red area = search + category */}
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Page Templates
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Select template → see thumbnail → Apply / Insert
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={tplSearch}
                        onChange={(e) => setTplSearch(e.target.value)}
                        placeholder="Search templates..."
                        className="h-11 rounded-md bg-white border-slate-200"
                      />

                      <Select
                        value={tplCategory}
                        onValueChange={(v) => setTplCategory(v as any)}
                      >
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

                  {/* Middle red area = grid thumbnails */}
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

                  {/* Bottom red area = selected template preview + actions */}
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

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 rounded-md"
                          onClick={() => setShowTplCode((p) => !p)}
                        >
                          {showTplCode ? "Hide code" : "Show code"}
                        </Button>
                      </div>
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

                {/* ✅ Your existing Thumbnail (page content) */}
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
