"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "grapesjs/dist/css/grapes.min.css";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type HeaderDesignKey = "hdrA" | "hdrB";
type FooterDesignKey = "ftrA" | "ftrB";
type CoverDesignKey = "coverA" | "coverB";

/* -----------------------------
   helpers
----------------------------- */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const normalizeHex = (v: string) => {
  if (!v) return null;
  let x = String(v).trim();
  if (!x.startsWith("#")) x = "#" + x;
  if (!/^#[0-9a-fA-F]{6}$/.test(x)) return null;
  return x.toLowerCase();
};

const removeRootBlock = (css: string) => (css || "").replace(/:root\s*\{[\s\S]*?\}\s*/g, "").trim();
const upsertRootVars = (css: string, vars: Record<string, string>) => {
  const clean = removeRootBlock(css);
  const body = Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ");
  return `:root{ ${body} }\n${clean}`;
};

const SWATCHES = ["#2563eb", "#0ea5e9", "#10b981", "#f97316", "#ef4444", "#111827", "#0b1220"];

/* -----------------------------
   Better Header / Footer designs
----------------------------- */
const HEADER_DESIGNS: Record<HeaderDesignKey, { name: string; html: string }> = {
  hdrA: {
    name: "Header A (Logo + Title)",
    html: `
      <div class="hdr hdr-a">
        <div class="hdr-left">
          <div class="hdr-logo" contenteditable="true">LOGO</div>
          <div class="hdr-brand">
            <div class="hdr-company" data-tpl="{company}"></div>
            <div class="hdr-sub" contenteditable="true">Project Proposal</div>
          </div>
        </div>

        <div class="hdr-right">
          <div class="hdr-title" data-tpl="{title}"></div>
          <div class="hdr-chip" data-tpl="{date}"></div>
        </div>
      </div>
    `,
  },
  hdrB: {
    name: "Header B (Primary Bar)",
    html: `
      <div class="hdr hdr-b">
        <div class="hdr-b-left">
          <div class="hdr-b-company" data-tpl="{company}"></div>
          <div class="hdr-b-client" data-tpl="Client: {client}"></div>
        </div>
        <div class="hdr-b-right">
          <div class="hdr-b-title" data-tpl="{title}"></div>
          <div class="hdr-b-date" data-tpl="{date}"></div>
        </div>
      </div>
    `,
  },
};

const FOOTER_DESIGNS: Record<FooterDesignKey, { name: string; html: string }> = {
  ftrA: {
    name: "Footer A (Contact + Page)",
    html: `
      <div class="ftr ftr-a">
        <div class="ftr-left" contenteditable="true">yourcompany.com · hello@company.com</div>
        <div class="ftr-mid" contenteditable="true">Confidential</div>
        <div class="ftr-right" data-tpl="Page {page} / {pages}"></div>
      </div>
    `,
  },
  ftrB: {
    name: "Footer B (Primary Strip)",
    html: `
      <div class="ftr ftr-b">
        <div class="ftr-b-left" data-tpl="{client}"></div>
        <div class="ftr-b-right" data-tpl="{company} · Page {page} of {pages}"></div>
      </div>
    `,
  },
};

/* -----------------------------
   Cover designs
----------------------------- */
const COVER_DESIGNS: Record<CoverDesignKey, { name: string; htmlBody: string; coverClass: string }> = {
  coverA: {
    name: "Cover A (Modern Split)",
    coverClass: "cover cover--a",
    htmlBody: `
      <div class="cover-a">
        <div class="cover-kicker" contenteditable="true">PROPOSAL</div>
        <h1 class="cover-title" contenteditable="true">Exterior Design Proposal</h1>
        <div class="cover-sub" contenteditable="true">Scope · Timeline · Estimate · Materials</div>

        <div class="cover-card">
          <div class="row"><div class="k">Client</div><div class="v" data-tpl="{client}"></div></div>
          <div class="row"><div class="k">Company</div><div class="v" data-tpl="{company}"></div></div>
          <div class="row"><div class="k">Date</div><div class="v" data-tpl="{date}"></div></div>
        </div>
      </div>
    `,
  },
  coverB: {
    name: "Cover B (Clean Center)",
    coverClass: "cover cover--b",
    htmlBody: `
      <div class="cover-b">
        <div class="badge" contenteditable="true">BUSINESS PROPOSAL</div>
        <h1 class="cover-title" contenteditable="true">Proposal Title</h1>
        <div class="cover-sub" contenteditable="true">Clear deliverables, pricing, and timeline aligned to your brand.</div>

        <div class="meta">
          <div class="meta-line"><span>Client</span><strong data-tpl="{client}"></strong></div>
          <div class="meta-line"><span>Prepared by</span><strong data-tpl="{company}"></strong></div>
          <div class="meta-line"><span>Date</span><strong data-tpl="{date}"></strong></div>
        </div>
      </div>
    `,
  },
};

/* -----------------------------
   Canvas CSS (INSIDE iframe)
   ✅ better page look + better header/footer
   ✅ canvasBg only behind pages
----------------------------- */
const BASE_CSS = `
:root{
  --primary:#2563eb;
  --text:#0f172a;
  --muted:#64748b;
  --page-bg:#ffffff;
  --canvas-bg:#eef2f7;
  --font: Inter, system-ui, sans-serif;

  --padx: 44px;
  --pady: 46px;
  --line: 1.55;
  --gap: 14px;

  --hdrh: 76px;
  --ftrh: 56px;
}

*{ box-sizing:border-box; }
body{
  margin:0;
  background: var(--canvas-bg);
  color: var(--text);
  font-family: var(--font);
}

/* doc spacing */
[data-proposal-doc]{
  padding: 32px 24px 40px;
  display:flex;
  flex-direction:column;
  gap: 28px;
}

/* Page */
.p-page{
  width: 794px;
  min-height: 1123px;
  margin: 0 auto;
  background: var(--page-bg);
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 16px 40px rgba(2,6,23,0.10),
    0 2px 8px rgba(2,6,23,0.06);
}

/* Header/Footer fixed in page */
.p-header{
  top:0; left:0; right:0;
  height: var(--hdrh);
  padding: 14px 22px;
  background: var(--page-bg);
  border-bottom: 1px solid rgba(15,23,42,0.08);
  z-index: 5;
}
.p-header:before{
  content:"";

  top:0; left:0; right:0;
  height: 4px;
  background: var(--primary);
}
.p-footer{
  position:absolute;
  bottom:0; left:0; right:0;
  height: var(--ftrh);
  padding: 10px 22px;
  background: var(--page-bg);
  border-top: 1px solid rgba(15,23,42,0.08);
  z-index: 5;
}

/* Body padding FIX (header/footer included) */
.p-body{
  padding-left: var(--padx);
  padding-right: var(--padx);
  padding-top: calc(var(--pady) + var(--hdrh));
  padding-bottom: calc(var(--pady) + var(--ftrh));
  line-height: var(--line);
}

/* Typography */
.p-kicker{
  display:inline-block;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .22em;
  color: var(--primary);
  text-transform: uppercase;
}
.p-h2{
  margin: 10px 0 0;
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.02em;
}
.p-p{
  margin: 10px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.p-section{ margin-top: var(--gap); }
.p-mini{
  margin-top: 12px;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0b1220;
}
.p-ul{ margin: 10px 0 0 18px; padding:0; }
.p-ul li{ margin: 7px 0; font-weight: 650; color:#0b1220; }

/* Table */
.p-table-wrap{ margin-top: var(--gap); }
.p-table{
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 13px;
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 12px;
  overflow: hidden;
}
.p-table th{
  text-align:left;
  padding: 12px 12px;
  background:#f8fafc;
  color: #334155;
  font-weight: 950;
  border-bottom: 1px solid rgba(15,23,42,0.08);
}
.p-table td{
  padding: 12px 12px;
  border-bottom: 1px solid rgba(15,23,42,0.08);
  color: #0b1220;
  font-weight: 650;
}
.p-table tr:last-child td{ border-bottom:0; }
.p-note{
  margin-top: 8px;
  font-size: 12px;
  font-weight: 750;
  color: var(--muted);
}

/* Header design A */
.hdr{ width:100%; height:100%; display:flex; align-items:center; justify-content:space-between; gap: 16px; }
.hdr-left{ display:flex; align-items:center; gap: 12px; min-width:0; }
.hdr-logo{
  width: 42px; height: 42px;
  border-radius: 12px;
  background: rgba(37,99,235,0.10);
  border: 1px solid rgba(37,99,235,0.20);
  display:flex; align-items:center; justify-content:center;
  font-weight: 950;
  color: var(--primary);
  letter-spacing: .10em;
  flex: 0 0 auto;
}
.hdr-brand{ display:flex; flex-direction:column; gap: 3px; min-width:0; }
.hdr-company{
  font-weight: 950;
  font-size: 12px;
  letter-spacing: .10em;
  text-transform: uppercase;
  color:#0b1220;
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
  max-width: 360px;
}
.hdr-sub{
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
  max-width: 360px;
}
.hdr-right{
  display:flex;
  align-items:flex-end;
  flex-direction:column;
  gap: 6px;
  text-align:right;
  min-width: 180px;
}
.hdr-title{
  font-weight: 950;
  font-size: 14px;
  letter-spacing: -0.01em;
  color:#0b1220;
}
.hdr-chip{
  display:inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15,23,42,0.05);
  border: 1px solid rgba(15,23,42,0.08);
  font-size: 12px;
  font-weight: 850;
  color: var(--muted);
}

/* Header design B */
.hdr-b{
  background: var(--primary);
  border-radius: 14px;
  padding: 10px 12px;
}
.hdr-b-left, .hdr-b-right{
  display:flex; flex-direction:column; gap: 4px;
}
.hdr-b-company{
  font-weight: 950;
  font-size: 12px;
  letter-spacing: .10em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.95);
}
.hdr-b-client{
  font-size: 12px;
  font-weight: 750;
  color: rgba(255,255,255,0.85);
}
.hdr-b-title{
  font-size: 14px;
  font-weight: 950;
  color: rgba(255,255,255,0.98);
}
.hdr-b-date{
  font-size: 12px;
  font-weight: 850;
  color: rgba(255,255,255,0.85);
}

/* Footer */
.ftr{
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  font-size: 12px;
  font-weight: 850;
  color: var(--muted);
}
.ftr-left{ white-space: nowrap; overflow:hidden; text-overflow: ellipsis; max-width: 45%; }
.ftr-mid{ opacity: 0.9; }
.ftr-right{ white-space: nowrap; }

.ftr-b{
  background: rgba(37,99,235,0.08);
  border: 1px solid rgba(37,99,235,0.16);
  border-radius: 12px;
  padding: 8px 12px;
  width: 100%;
}
.ftr-b-left{ font-weight: 950; color:#0b1220; }
.ftr-b-right{ font-weight: 850; }

/* Cover pages */
.cover .p-header, .cover .p-footer{ display:none; }
.cover.cover--show-hf .p-header,
.cover.cover--show-hf .p-footer{ display:block; }

.cover--a:before{
  content:"";
  position:absolute;
  left:0; top:0; bottom:0;
  width: 140px;
  background: var(--primary);
}
.cover-a .cover-kicker{
  font-size: 11px;
  font-weight: 950;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--muted);
}
.cover-title{
  margin: 16px 0 0;
  font-size: 56px;
  line-height: 1.05;
  font-weight: 950;
  letter-spacing: -0.03em;
}
.cover-sub{
  margin-top: 14px;
  font-size: 14px;
  font-weight: 750;
  color: #334155;
}
.cover-card{
  margin-top: 26px;
  max-width: 520px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 14px;
  overflow:hidden;
}
.cover-card .row{
  display:flex;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(15,23,42,0.08);
}
.cover-card .row:last-child{ border-bottom:0; }
.cover-card .k{ font-size:12px; font-weight:900; color:#334155; }
.cover-card .v{ font-size:12px; font-weight:950; color:#0b1220; }

.cover--b:before{
  content:"";
  position:absolute;
  left:0; top:0; right:0;
  height: 320px;
  background: linear-gradient(135deg, var(--primary), rgba(37,99,235,0.08));
}
.cover-b .badge{
  display:inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.25);
  border: 1px solid rgba(255,255,255,0.35);
  font-size: 11px;
  font-weight: 950;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.98);
}
.cover-b .cover-title{ color:#0b1220; }
.cover-b .meta{
  margin-top: 28px;
  max-width: 520px;
  background:#fff;
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 14px;
  padding: 10px 14px;
}
.cover-b .meta-line{
  display:flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(15,23,42,0.08);
}
.cover-b .meta-line:last-child{ border-bottom:0; }
`;

/* -----------------------------
   builders
----------------------------- */

const buildFooterWrapper = () => `<div class="p-footer" data-ftr data-ftr-design=""></div>`;

const buildInternalPage = () => `
<section class="p-page" data-page>
  ${buildHeaderWrapper()}
  <div class="p-body" data-body>
    <div class="p-kicker">SECTION</div>
    <h2 class="p-h2">Overview</h2>
    <p class="p-p">Edit this page. Add sections from the left panel (Tables, Two-column, etc.).</p>

    <div class="p-section">
      <div class="p-mini">Goals</div>
      <ul class="p-ul">
        <li>Clear scope and deliverables</li>
        <li>Brand-consistent layout</li>
        <li>Transparent estimate and timeline</li>
      </ul>
    </div>
  </div>
  ${buildFooterWrapper()}
</section>
`;

const buildCoverPage = (design: CoverDesignKey) => {
  const d = COVER_DESIGNS[design];
  return `
    ${buildHeaderWrapper()}
<section class="p-page ${d.coverClass}" data-page data-cover>

  <div class="p-body" data-body>
    ${d.htmlBody}
  </div>
  ${buildFooterWrapper()}
</section>
`;
};

const buildHeaderWrapper = () => `<div class="p-header" data-hdr data-hdr-design=""></div>`;

export default function Page() {
  const gjsRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);

  const [mode, setMode] = useState<"edit" | "customize">("customize");
  const [tab, setTab] = useState<"cover" | "header" | "footer" | "brand" | "layout" | "sections">("brand");
  const [zoom, setZoom] = useState(0.85);

  const [brand, setBrand] = useState({
    company: "YOUR COMPANY",
    title: "Proposal",
    client: "Client Name",
    date: new Date().toLocaleDateString(),
    primary: "#2563eb",
    text: "#0f172a",
    muted: "#64748b",
    pageBg: "#ffffff",
    canvasBg: "#eef2f7",
    font: "Inter, system-ui, sans-serif",
  });

  const [layout, setLayout] = useState({
    padX: 44,
    padY: 46,
    line: 1.55,
    gap: 14,
  });

  const [headerDesign, setHeaderDesign] = useState<HeaderDesignKey>("hdrA");
  const [footerDesign, setFooterDesign] = useState<FooterDesignKey>("ftrA");
  const [coverShowHF, setCoverShowHF] = useState(false);

  const syncingRef = useRef({ header: false, footer: false });

  const uiStyleVars = useMemo(
    () => ({
      ["--ui-app-bg" as any]: "#f5f7fb",
      ["--ui-surface" as any]: "#ffffff",
      ["--ui-surface2" as any]: "#f8fafc",
      ["--ui-border" as any]: "#e6eaf2",
      ["--ui-text" as any]: "#0f172a",
      ["--ui-muted" as any]: "#64748b",
      ["--ui-btn" as any]: "#111827",
      ["--ui-btn-text" as any]: "#ffffff",
    }),
    []
  );

  /* -----------------------------
     Grapes helpers
----------------------------- */
  const getEditor = () => editorRef.current;

  const getWrapper = () => {
    const ed = getEditor();
    if (!ed) return null;
    return ed.DomComponents.getWrapper();
  };

  const findDoc = () => {
    const wrap = getWrapper();
    if (!wrap) return null;
    return wrap.find("[data-proposal-doc]")?.[0] ?? null;
  };

  const getPages = () => {
    const wrap = getWrapper();
    if (!wrap) return [];
    return wrap.find("[data-page]") || [];
  };

  const findIn = (cmp: any, sel: string) => cmp?.find?.(sel)?.[0] ?? null;

  const applyZoomToCanvas = (z: number) => {
    const canvasEl = document.querySelector(".gjs-cv-canvas") as HTMLElement | null;
    if (!canvasEl) return;
    const safe = clamp(z, 0.55, 1.15);
    canvasEl.style.transform = `scale(${safe})`;
    canvasEl.style.transformOrigin = "top center";
    canvasEl.style.width = `${100 / safe}%`;
  };

  const applyRootVarsToCanvasCss = () => {
    const ed = getEditor();
    if (!ed) return;

    const css = ed.getCss() || BASE_CSS;
    const next = upsertRootVars(css, {
      "--primary": brand.primary,
      "--text": brand.text,
      "--muted": brand.muted,
      "--page-bg": brand.pageBg,
      "--canvas-bg": brand.canvasBg,
      "--font": brand.font,
      "--padx": `${layout.padX}px`,
      "--pady": `${layout.padY}px`,
      "--line": String(layout.line),
      "--gap": `${layout.gap}px`,
    });
    ed.setStyle(next);
  };

  const ensureBaseDoc = () => {
    const ed = getEditor();
    if (!ed) return;
    const doc = findDoc();
    if (doc) return;

    ed.setComponents(`
      <div data-proposal-doc>
        ${buildInternalPage()}
      </div>
    `);
    ed.setStyle(BASE_CSS);
  };

  // ✅ migrate existing saved project pages to required structure
  const ensurePageStructure = () => {
    const pages = getPages();
    pages.forEach((p: any) => {
      const hasHdr = !!findIn(p, "[data-hdr]");
      const hasFtr = !!findIn(p, "[data-ftr]");
      const body = findIn(p, "[data-body]");

      if (!hasHdr) p.prepend(buildHeaderWrapper());
      if (!hasFtr) p.append(buildFooterWrapper());

      if (!body) {
        // create body + move all non hdr/ftr nodes into it
        const comps = [...(p.components()?.models || [])];
        const move: any[] = [];

        comps.forEach((c: any) => {
          const a = c.getAttributes?.() || {};
          const isHdr = a["data-hdr"] !== undefined;
          const isFtr = a["data-ftr"] !== undefined;
          if (!isHdr && !isFtr) move.push(c);
        });

        const bodyCmp = p.append(`<div class="p-body" data-body></div>`);
        const newBody = Array.isArray(bodyCmp) ? bodyCmp[0] : bodyCmp;

        move.forEach((c: any) => {
          try {
            c.remove();
            newBody.append(c);
          } catch {}
        });
      }
    });
  };

  const applyHeaderDesignToAllPages = (designKey: HeaderDesignKey) => {
    const pages = getPages();
    const html = HEADER_DESIGNS[designKey].html;

    pages.forEach((p: any) => {
      const hdr = findIn(p, "[data-hdr]");
      if (!hdr) return;

      const attrs = hdr.getAttributes?.() || {};
      const current = String(attrs["data-hdr-design"] || "");
      const empty = (hdr.components?.()?.length || 0) === 0;

      if (empty || current !== designKey) {
        hdr.addAttributes?.({ "data-hdr-design": designKey });
        hdr.components(html);
      }
    });

    setHeaderDesign(designKey);
  };

  const applyFooterDesignToAllPages = (designKey: FooterDesignKey) => {
    const pages = getPages();
    const html = FOOTER_DESIGNS[designKey].html;

    pages.forEach((p: any) => {
      const ftr = findIn(p, "[data-ftr]");
      if (!ftr) return;

      const attrs = ftr.getAttributes?.() || {};
      const current = String(attrs["data-ftr-design"] || "");
      const empty = (ftr.components?.()?.length || 0) === 0;

      if (empty || current !== designKey) {
        ftr.addAttributes?.({ "data-ftr-design": designKey });
        ftr.components(html);
      }
    });

    setFooterDesign(designKey);
  };

  const setCoverHFVisibility = (show: boolean) => {
    const pages = getPages();
    pages.forEach((p: any) => {
      const isCover = !!p.getAttributes?.()?.["data-cover"];
      if (!isCover) return;
      if (show) p.addClass?.("cover--show-hf");
      else p.removeClass?.("cover--show-hf");
    });
  };

  const renderTokensAllPages = () => {
    const pages = getPages();
    const total = pages.length || 1;

    const common: Record<string, string> = {
      "{company}": brand.company,
      "{title}": brand.title,
      "{client}": brand.client,
      "{date}": brand.date,
    };

    pages.forEach((p: any, idx: number) => {
      const tokens = {
        ...common,
        "{page}": String(idx + 1),
        "{pages}": String(total),
      };

      const tplNodes = p.find?.("[data-tpl]") || [];
      tplNodes.forEach((n: any) => {
        const attrs = n.getAttributes?.() || {};
        const tpl = String(attrs["data-tpl"] || "");
        if (!tpl) return;

        let out = tpl;
        Object.entries(tokens).forEach(([k, v]) => (out = out.replaceAll(k, v)));
        n.components(out);
      });
    });
  };

  const syncHeaderFromMaster = () => {
    const pages = getPages();
    if (pages.length < 2) return;

    const master = pages[0];
    const masterHdr = findIn(master, "[data-hdr]");
    if (!masterHdr) return;

    syncingRef.current.header = true;
    const json = masterHdr.components?.().toJSON?.();
    const html = masterHdr.toHTML?.() || "";

    pages.slice(1).forEach((p: any) => {
      const hdr = findIn(p, "[data-hdr]");
      if (!hdr) return;
      hdr.components(json || html);
      hdr.addAttributes?.({ "data-hdr-design": masterHdr.getAttributes?.()?.["data-hdr-design"] || "" });
    });

    syncingRef.current.header = false;
    renderTokensAllPages();
  };

  const syncFooterFromMaster = () => {
    const pages = getPages();
    if (pages.length < 2) return;

    const master = pages[0];
    const masterFtr = findIn(master, "[data-ftr]");
    if (!masterFtr) return;

    syncingRef.current.footer = true;
    const json = masterFtr.components?.().toJSON?.();
    const html = masterFtr.toHTML?.() || "";

    pages.slice(1).forEach((p: any) => {
      const ftr = findIn(p, "[data-ftr]");
      if (!ftr) return;
      ftr.components(json || html);
      ftr.addAttributes?.({ "data-ftr-design": masterFtr.getAttributes?.()?.["data-ftr-design"] || "" });
    });

    syncingRef.current.footer = false;
    renderTokensAllPages();
  };

  const addInternalPage = () => {
    const doc = findDoc();
    if (!doc) return;

    doc.append(buildInternalPage());

    setTimeout(() => {
      ensurePageStructure();
      applyHeaderDesignToAllPages(headerDesign);
      applyFooterDesignToAllPages(footerDesign);
      setCoverHFVisibility(coverShowHF);
      renderTokensAllPages();
    }, 20);
  };

  const addCoverPage = (design: CoverDesignKey) => {
    const doc = findDoc();
    if (!doc) return;

    doc.prepend(buildCoverPage(design));

    setTimeout(() => {
      ensurePageStructure();
      applyHeaderDesignToAllPages(headerDesign);
      applyFooterDesignToAllPages(footerDesign);
      setCoverHFVisibility(coverShowHF);
      renderTokensAllPages();
    }, 20);
  };

  const insertIntoActiveBody = (html: string) => {
    const ed = getEditor();
    if (!ed) return;

    const sel = ed.getSelected?.();
    const pages = getPages();
    if (!pages.length) return;

    let page: any = null;
    if (sel) {
      let cur = sel;
      for (let i = 0; i < 22 && cur; i++) {
        const a = cur.getAttributes?.() || {};
        if (a["data-page"] !== undefined) {
          page = cur;
          break;
        }
        cur = cur.parent?.();
      }
    }
    if (!page) page = pages[0];

    const body = findIn(page, "[data-body]");
    if (!body) return;

    body.append(html);
    setTimeout(() => renderTokensAllPages(), 10);
  };

  /* -----------------------------
     sections buttons
----------------------------- */
  const SECTIONS = useMemo(
    () => [
      {
        id: "sec_heading_para",
        name: "Heading + Paragraph",
        html: `
          <div class="p-section">
            <div class="p-kicker">SECTION</div>
            <h2 class="p-h2">New Heading</h2>
            <p class="p-p">Write your paragraph here...</p>
          </div>
        `,
      },
      {
        id: "sec_bullets",
        name: "Bullets",
        html: `
          <div class="p-section">
            <div class="p-mini">Key Points</div>
            <ul class="p-ul">
              <li>Point 1</li><li>Point 2</li><li>Point 3</li>
            </ul>
          </div>
        `,
      },
      {
        id: "sec_two_col",
        name: "Two Column (Left/Right)",
        html: `
          <div class="p-section" style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <div class="p-mini">Left</div>
              <p class="p-p">Left column content...</p>
            </div>
            <div>
              <div class="p-mini">Right</div>
              <p class="p-p">Right column content...</p>
            </div>
          </div>
        `,
      },
      {
        id: "sec_table",
        name: "Table (Estimate)",
        html: `
          <div class="p-table-wrap">
            <div class="p-mini">Estimate</div>
            <table class="p-table">
              <thead>
                <tr>
                  <th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Paint</td><td>Exterior paint</td><td>—</td><td>sq ft</td><td>—</td><td>—</td></tr>
                <tr><td>Trim</td><td>Fascia + trims</td><td>—</td><td>linear ft</td><td>—</td><td>—</td></tr>
                <tr><td>Labor</td><td>Prep + application</td><td>—</td><td>lump sum</td><td>—</td><td>—</td></tr>
              </tbody>
            </table>
            <div class="p-note">Replace the dashes with your numbers.</div>
          </div>
        `,
      },
      {
        id: "sec_image",
        name: "Image Placeholder",
        html: `
          <div class="p-section">
            <div class="p-mini">Image</div>
            <div style="height: 220px; border: 1px dashed rgba(15,23,42,0.25); border-radius: 14px; background: #f8fafc; display:flex; align-items:center; justify-content:center; font-weight: 950; color:#64748b;">
              DROP IMAGE HERE
            </div>
            <div class="p-note" contenteditable="true">Caption / note about this image...</div>
          </div>
        `,
      },
    ],
    []
  );

  const PanelInput = ({ label, value, onChange, type = "text", min, max, step }: any) => (
    <label className="block">
      <div className="text-xs font-bold text-[var(--ui-muted)]">{label}</div>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-bold text-[var(--ui-text)] outline-none"
      />
    </label>
  );

  /* -----------------------------
     Grapes init
----------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!gjsRef.current) return;

      const grapesjs = (await import("grapesjs")).default;
      const presetWebpage = (await import("grapesjs-preset-webpage")).default;

      if (!mounted) return;

      const editor = grapesjs.init({
        container: gjsRef.current,
        height: "100%",
        fromElement: false,
        storageManager: {
          type: "local",
          autosave: true,
          autoload: true,
          stepsBeforeSave: 2,
          options: { local: { key: "proposal_builder_v3" } },
        },
        plugins: [presetWebpage],
        pluginsOpts: {
          [presetWebpage as any]: {
            blocksBasicOpts: { flexGrid: true },
            navbarOpts: false,
            countdownOpts: false,
            formsOpts: false,
            exportOpts: false,
          },
        },
        canvas: {
          styles: [
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
          ],
        },
        selectorManager: { componentFirst: true },
        panels: { defaults: [] },
      });

      editorRef.current = editor;

      editor.on("load", () => {
        ensureBaseDoc();
        editor.setStyle(editor.getCss() || BASE_CSS);

        // migrate/repair + apply styling
        ensurePageStructure();
        applyRootVarsToCanvasCss();

        // apply modern designs
        applyHeaderDesignToAllPages(headerDesign);
        applyFooterDesignToAllPages(footerDesign);

        setCoverHFVisibility(coverShowHF);
        renderTokensAllPages();

        setTimeout(() => applyZoomToCanvas(zoom), 50);
      });

      // master sync (page 1)
      editor.on("component:update", (model: any) => {
        if (syncingRef.current.header || syncingRef.current.footer) return;
        const pages = getPages();
        if (!pages.length) return;

        const master = pages[0];
        let cur = model;
        let insideHeader = false;
        let insideFooter = false;
        let insideMasterPage = false;

        for (let i = 0; i < 26 && cur; i++) {
          const a = cur.getAttributes?.() || {};
          if (a["data-hdr"] !== undefined) insideHeader = true;
          if (a["data-ftr"] !== undefined) insideFooter = true;
          if (a["data-page"] !== undefined) {
            insideMasterPage = cur === master;
            break;
          }
          cur = cur.parent?.();
        }

        if (insideMasterPage && insideHeader) {
          syncingRef.current.header = true;
          setTimeout(() => {
            syncHeaderFromMaster();
            syncingRef.current.header = false;
          }, 10);
        }
        if (insideMasterPage && insideFooter) {
          syncingRef.current.footer = true;
          setTimeout(() => {
            syncFooterFromMaster();
            syncingRef.current.footer = false;
          }, 10);
        }
      });
    })();

    return () => {
      mounted = false;
      try {
        editorRef.current?.destroy?.();
      } catch {}
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyZoomToCanvas(zoom);
  }, [zoom]);

  useEffect(() => {
    applyRootVarsToCanvasCss();
    setTimeout(() => renderTokensAllPages(), 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, layout]);

  useEffect(() => {
    setCoverHFVisibility(coverShowHF);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverShowHF]);

  const gridCols = mode === "edit" ? "lg:grid-cols-1" : "lg:grid-cols-[360px_1fr]";

  const router = useRouter();

  const {currentWebsite} = useSelector((state: RootState) => state.websites);
   const {currentBusiness} = useSelector((state: RootState) => state.business);
   const {curretAgency} = useSelector((state: RootState) => state.agency);

  const addPageTemplate = () => {
    router.push(`/admin/websites/${currentWebsite?.websiteId}/marketing/proposal/create?businessId=${currentBusiness?._id}&agencyId=${curretAgency?._id}`);
  }; 
  return (
    <div style={uiStyleVars as any} className="min-h-screen bg-[var(--ui-app-bg)] text-[var(--ui-text)]">
      {/* Topbar */}
      <div className="h-16 border-b border-[var(--ui-border)] bg-[var(--ui-surface)]">
        <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-4">
          <div className="text-[18px] font-semibold tracking-tight">Proposal Builder</div>

          <div className="flex items-center gap-3">
            <div className="inline-flex overflow-hidden rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)]">
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={[
                  "px-4 py-2 text-sm font-semibold",
                  mode === "edit"
                    ? "bg-[var(--ui-surface2)] text-[var(--ui-text)]"
                    : "text-[var(--ui-muted)] hover:bg-[var(--ui-surface2)]",
                ].join(" ")}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setMode("customize")}
                className={[
                  "px-4 py-2 text-sm font-semibold",
                  mode === "customize"
                    ? "bg-[var(--ui-surface2)] text-[var(--ui-text)]"
                    : "text-[var(--ui-muted)] hover:bg-[var(--ui-surface2)]",
                ].join(" ")}
              >
                Customize
              </button>
            </div>  

            <div className="flex items-center gap-2 rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-2">
              <div className="w-14 text-right text-sm font-semibold text-[var(--ui-muted)]">
                {Math.round(zoom * 100)}%
              </div>
              <button
                type="button"
                className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                onClick={() => setZoom((z) => Math.max(0.55, +(z - 0.05).toFixed(2)))}
              >
                −
              </button>
              <button
                type="button"
                className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                onClick={() => setZoom((z) => Math.min(1.15, +(z + 0.05).toFixed(2)))}
              >
                +
              </button>
              <button
                type="button"
                className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                onClick={() => setZoom(0.85)}
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              onClick={addInternalPage}
              className="rounded-md bg-[var(--ui-btn)] px-4 py-2 text-sm font-semibold text-[var(--ui-btn-text)] hover:opacity-90"
            >
              Add Page
            </button>
            <button
              type="button"
              onClick={addPageTemplate}
              className="rounded-md bg-[var(--ui-btn)] px-4 py-2 text-sm font-semibold text-[var(--ui-btn-text)] hover:opacity-90"
            >
              Add Template
            </button>
          </div>
        </div>
      </div>

      <div className={["mx-auto grid h-[calc(100vh-64px)] max-w-[1500px] grid-cols-1 gap-4 p-4", gridCols].join(" ")}>
        {/* Left */}
        {mode === "customize" && (
          <aside className="min-h-0 overflow-hidden rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
            <div className="grid grid-cols-3 gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-surface2)] p-2">
              {[
                { id: "cover", label: "Cover" },
                { id: "header", label: "Header" },
                { id: "footer", label: "Footer" },
                { id: "brand", label: "Brand" },
                { id: "layout", label: "Layout" },
                { id: "sections", label: "Sections" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id as any)}
                  className={[
                    "rounded-md border px-3 py-2 text-sm font-semibold",
                    tab === (t.id as any)
                      ? "border-[var(--ui-border)] bg-[var(--ui-surface)] text-[var(--ui-text)]"
                      : "border-[var(--ui-border)] bg-[var(--ui-surface2)] text-[var(--ui-muted)] hover:bg-[var(--ui-surface)]",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="min-h-0 overflow-auto p-3">
              {/* Cover */}
              {tab === "cover" && (
                <div className="space-y-3 rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Cover Designs</div>
                    <label className="flex items-center gap-2 text-xs font-bold text-[var(--ui-muted)]">
                      <input type="checkbox" checked={coverShowHF} onChange={(e) => setCoverShowHF(e.target.checked)} />
                      Show HF on Cover
                    </label>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {(Object.keys(COVER_DESIGNS) as CoverDesignKey[]).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => addCoverPage(k)}
                        className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-3 text-left hover:bg-[var(--ui-surface2)]"
                      >
                        <div className="text-sm font-semibold">{COVER_DESIGNS[k].name}</div>
                        <div className="mt-1 text-xs font-semibold text-[var(--ui-muted)]">Adds new cover page on top.</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Header */}
              {tab === "header" && (
                <div className="space-y-3 rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                  <div className="text-sm font-semibold">Header Designs</div>
                  <div className="mt-3 grid gap-2">
                    {(Object.keys(HEADER_DESIGNS) as HeaderDesignKey[]).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          applyHeaderDesignToAllPages(k);
                          setTimeout(() => {
                            renderTokensAllPages();
                            syncHeaderFromMaster();
                          }, 20);
                        }}
                        className={[
                          "rounded-md border p-3 text-left",
                          k === headerDesign
                            ? "border-[var(--ui-text)] bg-[var(--ui-surface)]"
                            : "border-[var(--ui-border)] bg-[var(--ui-surface)] hover:bg-[var(--ui-surface2)]",
                        ].join(" ")}
                      >
                        <div className="text-sm font-semibold">{HEADER_DESIGNS[k].name}</div>
                        <div className="mt-1 text-xs font-semibold text-[var(--ui-muted)]">Edit on Page 1 → auto sync.</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={syncHeaderFromMaster}
                      className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                    >
                      Sync Header
                    </button>
                    <button
                      type="button"
                      onClick={renderTokensAllPages}
                      className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                    >
                      Refresh Tokens
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              {tab === "footer" && (
                <div className="space-y-3 rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                  <div className="text-sm font-semibold">Footer Designs</div>
                  <div className="mt-3 grid gap-2">
                    {(Object.keys(FOOTER_DESIGNS) as FooterDesignKey[]).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          applyFooterDesignToAllPages(k);
                          setTimeout(() => {
                            renderTokensAllPages();
                            syncFooterFromMaster();
                          }, 20);
                        }}
                        className={[
                          "rounded-md border p-3 text-left",
                          k === footerDesign
                            ? "border-[var(--ui-text)] bg-[var(--ui-surface)]"
                            : "border-[var(--ui-border)] bg-[var(--ui-surface)] hover:bg-[var(--ui-surface2)]",
                        ].join(" ")}
                      >
                        <div className="text-sm font-semibold">{FOOTER_DESIGNS[k].name}</div>
                        <div className="mt-1 text-xs font-semibold text-[var(--ui-muted)]">Edit on Page 1 → auto sync.</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={syncFooterFromMaster}
                      className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                    >
                      Sync Footer
                    </button>
                    <button
                      type="button"
                      onClick={renderTokensAllPages}
                      className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                    >
                      Refresh Tokens
                    </button>
                  </div>
                </div>
              )}

              {/* Brand */}
              {tab === "brand" && (
                <div className="space-y-3">
                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="text-sm font-semibold">Brand Tokens</div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <PanelInput label="Company" value={brand.company} onChange={(e: any) => setBrand((p) => ({ ...p, company: e.target.value }))} />
                      <PanelInput label="Title" value={brand.title} onChange={(e: any) => setBrand((p) => ({ ...p, title: e.target.value }))} />
                      <PanelInput label="Client" value={brand.client} onChange={(e: any) => setBrand((p) => ({ ...p, client: e.target.value }))} />
                      <PanelInput label="Date" value={brand.date} onChange={(e: any) => setBrand((p) => ({ ...p, date: e.target.value }))} />
                    </div>

                    <button
                      type="button"
                      onClick={renderTokensAllPages}
                      className="mt-3 w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                    >
                      Apply Tokens to All Pages
                    </button>
                  </div>

                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="text-sm font-semibold">Brand Colors (inside pages)</div>

                    <PanelInput
                      label="Primary"
                      value={brand.primary}
                      onChange={(e: any) => {
                        const hex = normalizeHex(e.target.value) || brand.primary;
                        setBrand((p) => ({ ...p, primary: hex }));
                      }}
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      {SWATCHES.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setBrand((p) => ({ ...p, primary: hex }))}
                          className="h-10 w-10 rounded-md border-2 border-[var(--ui-border)]"
                          style={{ background: hex }}
                        />
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <PanelInput label="Text" value={brand.text} onChange={(e: any) => setBrand((p) => ({ ...p, text: e.target.value }))} />
                      <PanelInput label="Muted" value={brand.muted} onChange={(e: any) => setBrand((p) => ({ ...p, muted: e.target.value }))} />
                      <PanelInput label="Page BG" value={brand.pageBg} onChange={(e: any) => setBrand((p) => ({ ...p, pageBg: e.target.value }))} />
                      <PanelInput label="Canvas BG" value={brand.canvasBg} onChange={(e: any) => setBrand((p) => ({ ...p, canvasBg: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* Layout */}
              {tab === "layout" && (
                <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                  <div className="text-sm font-semibold">Padding & Spacing</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <PanelInput
                      label="Pad X (px)"
                      type="number"
                      min={0}
                      max={100}
                      value={layout.padX}
                      onChange={(e: any) => setLayout((p) => ({ ...p, padX: parseInt(e.target.value || "44", 10) }))}
                    />
                    <PanelInput
                      label="Pad Y (px)"
                      type="number"
                      min={0}
                      max={100}
                      value={layout.padY}
                      onChange={(e: any) => setLayout((p) => ({ ...p, padY: parseInt(e.target.value || "46", 10) }))}
                    />
                    <PanelInput
                      label="Line height"
                      type="number"
                      step={0.05}
                      min={1}
                      max={2}
                      value={layout.line}
                      onChange={(e: any) => setLayout((p) => ({ ...p, line: parseFloat(e.target.value || "1.55") }))}
                    />
                    <PanelInput
                      label="Section gap (px)"
                      type="number"
                      min={6}
                      max={50}
                      value={layout.gap}
                      onChange={(e: any) => setLayout((p) => ({ ...p, gap: parseInt(e.target.value || "14", 10) }))}
                    />
                  </div>
                </div>
              )}

              {/* Sections */}
              {tab === "sections" && (
                <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Add Sections</div>
                    <div className="text-xs font-bold text-[var(--ui-muted)]">Adds to selected page</div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {SECTIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => insertIntoActiveBody(s.html)}
                        className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-3 text-left hover:bg-[var(--ui-surface2)]"
                      >
                        <div className="text-sm font-semibold">{s.name}</div>
                        <div className="mt-1 text-xs font-semibold text-[var(--ui-muted)]">Click to insert.</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Editor */}
        <main className="min-h-0 overflow-hidden rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
          <div className="flex items-center justify-between border-b border-[var(--ui-border)] bg-[var(--ui-surface)] p-3">
            <div className="text-sm font-semibold text-[var(--ui-muted)]">Canvas</div>
            <button

              type="button"
              onClick={() => {
                // Force token refresh + sync (quick repair button)
                renderTokensAllPages();
                syncHeaderFromMaster();
                syncFooterFromMaster();
              }}
              className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
            >
              Refresh
            </button>
          </div>

          <div className="h-[calc(100%-52px)]">
            <div ref={gjsRef} className="h-full" />
          </div>
        </main>
      </div>

      {/* Global GrapesJS UI tweaks (outside brand colors) */}
      <style jsx global>{`
        .gjs-one-bg {
          background-color: var(--ui-surface) !important;
        }
        .gjs-two-color {
          color: var(--ui-text) !important;
        }
        .gjs-four-color {
          color: var(--ui-muted) !important;
        }
        .gjs-pn-panel,
        .gjs-pn-panels {
          background-color: var(--ui-surface) !important;
          border-color: var(--ui-border) !important;
        }
        .gjs-cv-canvas__frames {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
}

/**
 * Install:
 *   npm i grapesjs grapesjs-preset-webpage
 *
 * Notes:
 * - Header/Footer tokens render from elements with data-tpl attribute.
 * - Master Header/Footer = page 1; edit there and it auto-syncs to all pages.
 * - Brand colors/padding apply inside the proposal pages (canvas CSS vars).
 */
