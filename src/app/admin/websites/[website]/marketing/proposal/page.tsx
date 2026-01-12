"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "grapesjs/dist/css/grapes.min.css";

/* -----------------------------
   Types + Helpers
----------------------------- */
type TemplateKey = "classic" | "traditional" | "professional" | "clean" | "simpleATS";

type ResumeTemplate = {
  name: string;
  tag?: string | null;
  primary: string;
  html: string;
  css: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const normalizeHex = (v: string) => {
  if (!v) return null;
  let x = String(v).trim();
  if (!x.startsWith("#")) x = "#" + x;
  if (!/^#[0-9a-fA-F]{6}$/.test(x)) return null;
  return x.toLowerCase();
};

const removeRootPrimary = (css: string) =>
  (css || "").replace(/:root\s*\{[^}]*--primary\s*:\s*[^;]+;[^}]*\}\s*/g, "").trim();

const upsertPrimaryRoot = (css: string, hex: string) => {
  const clean = removeRootPrimary(css);
  return `:root{ --primary: ${hex}; }\n${clean}`;
};

const SWATCHES = ["#2563eb", "#0ea5e9", "#10b981", "#f97316", "#ef4444", "#111827", "#0b1220"];

/* -----------------------------
   Templates (same as your HTML demo)
----------------------------- */
const TEMPLATES: Record<TemplateKey, ResumeTemplate> = {
  classic: {
    name: "Classic",
    tag: null,
    primary: "#111827",
    html: `
      <div class="resume" data-resume>
        <header class="r-header">
          <div class="r-name">YOUR NAME</div>
          <div class="r-contact">you@email.com · +91-00000-00000 · City, Country · linkedin.com/in/you</div>
        </header>

        <section class="r-section">
          <div class="r-h">PROFILE</div>
          <p>Write a 2–3 line summary focusing on your impact, tools, and outcomes. Keep it crisp and ATS-friendly.</p>
        </section>

        <section class="r-section">
          <div class="r-h">EXPERIENCE</div>
          <div class="r-item">
            <div class="r-row"><strong>Role Title</strong><span>Company · 2023–Present</span></div>
            <ul>
              <li>Achievement bullet with numbers (e.g., improved conversion by 18%).</li>
              <li>Tooling/stack and scope of work.</li>
              <li>Leadership / collaboration impact.</li>
            </ul>
          </div>
          <div class="r-item">
            <div class="r-row"><strong>Role Title</strong><span>Company · 2021–2023</span></div>
            <ul>
              <li>Impact bullet.</li>
              <li>Impact bullet.</li>
            </ul>
          </div>
        </section>

        <section class="r-section">
          <div class="r-h">SKILLS</div>
          <p><strong>Core:</strong> React, TypeScript, Node.js, Python, SQL · <strong>Tools:</strong> Git, AWS, Docker</p>
        </section>

        <section class="r-section">
          <div class="r-h">EDUCATION</div>
          <div class="r-row"><strong>Degree</strong><span>University · Year</span></div>
        </section>
      </div>
    `,
    css: `
      :root{ --primary: #111827; }
      body{ background:#eef2f7; }
      .resume{    width: 980px !important;
    height: 950px !important; background:#fff; margin: 24px auto; padding: 28px; font-family: Inter, system-ui, sans-serif; color:#0f172a; line-height: 1.45; }
      .r-header{ background: var(--primary); color:#fff; padding: 26px 24px; border-radius: 10px; text-align:center; }
      .r-name{ font-size: 40px; font-weight: 800; letter-spacing: 0.06em; }
      .r-contact{ margin-top: 8px; font-size: 12px; opacity: 0.92; }
      .r-section{ margin-top: 18px; }
      .r-h{ font-weight: 800; letter-spacing: 0.22em; font-size: 12px; padding: 10px 12px; border-radius: 10px; background:#f1f5f9; }
      .r-item{ margin-top: 12px; }
      .r-row{ display:flex; justify-content: space-between; gap: 14px; font-size: 14px; }
      ul{ margin: 8px 0 0 18px; }
      li{ margin: 6px 0; }
    `,
  },

  traditional: {
    name: "Traditional",
    tag: null,
    primary: "#0f172a",
    html: `
      <div class="resume" data-resume>
        <div class="top">
          <div>
            <div class="name">YOUR NAME</div>
            <div class="title">Job Title · Key Specialty</div>
          </div>
          <div class="contact">
            <div>you@email.com</div>
            <div>+91-00000-00000</div>
            <div>City, Country</div>
            <div>linkedin.com/in/you</div>
          </div>
        </div>

        <div class="rule"></div>

        <div class="grid">
          <div>
            <div class="h">SUMMARY</div>
            <p>2–3 lines summary. Focus on outcomes and strengths.</p>

            <div class="h">SKILLS</div>
            <p><strong>Frontend:</strong> React, Next.js, TypeScript</p>
            <p><strong>Backend:</strong> FastAPI, Node.js</p>
            <p><strong>Cloud:</strong> AWS, S3, CI/CD</p>
          </div>

          <div>
            <div class="h">EXPERIENCE</div>
            <div class="job">
              <div class="jr"><strong>Role</strong><span>2023–Present</span></div>
              <div class="muted">Company</div>
              <ul>
                <li>Achievement bullet with metric.</li>
                <li>Achievement bullet.</li>
              </ul>
            </div>

            <div class="h">EDUCATION</div>
            <div class="jr"><strong>Degree</strong><span>Year</span></div>
            <div class="muted">University</div>
          </div>
        </div>
      </div>
    `,
    css: `
      :root{ --primary:#0f172a; }
      .resume{ width:794px; min-height:1123px; background:#fff; margin: 24px auto; padding: 28px; font-family: Inter, system-ui, sans-serif; color:#0f172a; line-height:1.5; }
      .top{ display:flex; justify-content: space-between; gap: 16px; }
      .name{ font-size: 34px; font-weight: 800; letter-spacing:-0.02em; }
      .title{ color:#475569; font-weight: 700; margin-top: 4px; }
      .contact{ text-align:right; font-size: 12px; color:#475569; font-weight: 600; }
      .rule{ height: 3px; background: var(--primary); border-radius: 999px; margin: 16px 0; }
      .grid{ display:grid; grid-template-columns: 1fr 1.4fr; gap: 22px; }
      .h{ margin-top: 14px; font-weight: 900; letter-spacing: 0.14em; font-size: 12px; color: var(--primary); }
      .job{ margin-top: 8px; }
      .jr{ display:flex; justify-content: space-between; gap: 12px; }
      .muted{ color:#64748b; font-weight: 700; font-size: 12px; }
      ul{ margin: 8px 0 0 18px; }
      li{ margin: 6px 0; }
    `,
  },

  professional: {
    name: "Professional",
    tag: null,
    primary: "#111827",
    html: `
      <div class="resume" data-resume>
        <header class="head">
          <div>
            <div class="name">YOUR NAME</div>
            <div class="subtitle">Senior Role · Domain</div>
          </div>
          <div class="pill">Open to: Full-time · Remote/Hybrid</div>
        </header>

        <div class="meta">
          <div><strong>Email:</strong> you@email.com</div>
          <div><strong>Phone:</strong> +91-00000-00000</div>
          <div><strong>Location:</strong> City</div>
          <div><strong>LinkedIn:</strong> linkedin.com/in/you</div>
        </div>

        <div class="cols" data-cols>
          <aside class="left">
            <div class="h">SKILLS</div>
            <div class="chips">
              <span class="chip">React</span><span class="chip">TypeScript</span><span class="chip">Next.js</span>
              <span class="chip">FastAPI</span><span class="chip">AWS</span><span class="chip">Postgres</span>
            </div>

            <div class="h">HIGHLIGHTS</div>
            <ul>
              <li>Shipped X features in Y months</li>
              <li>Reduced costs by Z%</li>
              <li>Led team of N</li>
            </ul>
          </aside>

          <section class="right">
            <div class="h">SUMMARY</div>
            <p>Short summary with measurable impact. Mention your stack + domain expertise.</p>

            <div class="h">EXPERIENCE</div>
            <div class="job">
              <div class="jr"><strong>Role</strong><span>Company · 2023–Present</span></div>
              <ul>
                <li>Achievement with numbers.</li>
                <li>Achievement with scope/impact.</li>
              </ul>
            </div>

            <div class="h">PROJECTS</div>
            <ul>
              <li><strong>Project:</strong> 1-liner + result</li>
              <li><strong>Project:</strong> 1-liner + result</li>
            </ul>

            <div class="h">EDUCATION</div>
            <div class="jr"><strong>Degree</strong><span>University · Year</span></div>
          </section>
        </div>
      </div>
    `,
    css: `
      :root{ --primary:#111827; }
      .resume{ width:794px; min-height:1123px; background:#fff; margin: 24px auto; padding: 28px; font-family: Inter, system-ui, sans-serif; color:#0f172a; line-height:1.5; }
      .head{ display:flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
      .name{ font-size: 36px; font-weight: 900; letter-spacing:-0.03em; }
      .subtitle{ color:#475569; font-weight: 700; margin-top: 4px; }
      .pill{ background: #0f172a; color:#fff; padding: 10px 12px; border-radius: 999px; font-weight: 800; font-size: 12px; }
      .meta{ display:grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; margin-top: 14px; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 14px; color:#334155; font-weight: 600; font-size: 12px; }
      .cols{ display:grid; grid-template-columns: 1fr 1.6fr; gap: 22px; margin-top: 18px; }
      .h{ font-weight: 900; letter-spacing: 0.14em; font-size: 12px; color: var(--primary); margin-top: 12px; }
      .left{ border-right: 1px solid #e2e8f0; padding-right: 18px; }
      .chips{ display:flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
      .chip{ background:#f1f5f9; border: 1px solid #e2e8f0; padding: 8px 10px; border-radius: 999px; font-weight: 800; font-size: 12px; }
      .jr{ display:flex; justify-content: space-between; gap: 12px; }
      ul{ margin: 8px 0 0 18px; }
      li{ margin: 6px 0; }
    `,
  },

  clean: {
    name: "Clean",
    tag: null,
    primary: "#111827",
    html: `
      <div class="resume" data-resume>
        <div class="name">YOUR NAME</div>
        <div class="sub">you@email.com · +91-00000-00000 · City · LinkedIn</div>

        <div class="h">SUMMARY</div>
        <p>Minimal, clean, and easy to scan. Great for most roles.</p>

        <div class="h">EXPERIENCE</div>
        <div class="job">
          <div class="jr"><strong>Role</strong><span>Company · 2023–Present</span></div>
          <ul>
            <li>Impact bullet.</li>
            <li>Impact bullet.</li>
          </ul>
        </div>

        <div class="h">SKILLS</div>
        <p>React · TypeScript · Node · Python · SQL · AWS</p>

        <div class="h">EDUCATION</div>
        <div class="jr"><strong>Degree</strong><span>University · Year</span></div>
      </div>
    `,
    css: `
      :root{ --primary:#111827; }
      .resume{ width:794px; min-height:1123px; background:#fff; margin: 24px auto; padding: 32px; font-family: Inter, system-ui, sans-serif; color:#0f172a; line-height:1.6; }
      .name{ font-size: 38px; font-weight: 900; letter-spacing:-0.03em; }
      .sub{ color:#475569; font-weight: 700; margin-top: 6px; }
      .h{ margin-top: 18px; font-weight: 900; letter-spacing: 0.14em; font-size: 12px; color: var(--primary); }
      .job{ margin-top: 8px; }
      .jr{ display:flex; justify-content: space-between; gap: 12px; }
      ul{ margin: 8px 0 0 18px; }
      li{ margin: 6px 0; }
    `,
  },

  simpleATS: {
    name: "Simple ATS",
    tag: "ATS",
    primary: "#0f172a",
    html: `
      <div class="resume" data-resume>
        <div class="top">
          <div class="name">YOUR NAME</div>
          <div class="sub">City, Country | +91-00000-00000 | you@email.com | linkedin.com/in/you</div>
        </div>

        <div class="h">SUMMARY</div>
        <p>Plain layout, strong hierarchy, minimal styling. ATS-friendly.</p>

        <div class="h">SKILLS</div>
        <p>React, TypeScript, Next.js, FastAPI, PostgreSQL, AWS, Docker</p>

        <div class="h">EXPERIENCE</div>
        <div class="job">
          <div class="jr"><strong>Role</strong> — Company <span>2023–Present</span></div>
          <ul>
            <li>Action + tool + measurable result.</li>
            <li>Action + tool + measurable result.</li>
          </ul>
        </div>

        <div class="h">EDUCATION</div>
        <div class="jr"><strong>Degree</strong> — University <span>Year</span></div>
      </div>
    `,
    css: `
      :root{ --primary:#0f172a; }
      .resume{ width:794px; min-height:1123px; background:#fff; margin: 24px auto; padding: 28px; font-family: Arial, Helvetica, sans-serif; color:#000; line-height:1.5; }
      .top{ margin-bottom: 10px; }
      .name{ font-size: 30px; font-weight: 800; }
      .sub{ font-size: 12px; margin-top: 6px; }
      .h{ margin-top: 14px; font-weight: 800; font-size: 12px; text-transform: uppercase; }
      .job{ margin-top: 8px; }
      .jr{ display:flex; justify-content: space-between; gap: 12px; font-size: 13px; }
      ul{ margin: 6px 0 0 18px; }
      li{ margin: 5px 0; }
    `,
  },
};

/* -----------------------------
   Component
----------------------------- */
export default function Page() {
  const gjsRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);

  // UI mode
  const [mode, setMode] = useState<"edit" | "customize">("customize");
  const [tab, setTab] = useState<"templates" | "text" | "layout" | "theme">("templates");

  // Resume template settings
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("classic");
  const templateOrder = useMemo<TemplateKey[]>(
    () => ["classic", "traditional", "professional", "clean", "simpleATS"],
    []
  );

  // Zoom (fix: FULL WIDTH canvas using width compensation)
  const [zoom, setZoom] = useState<number>(0.6);

  // Selected element style controls
  const [fontSize, setFontSize] = useState<number>(14);
  const [fontWeight, setFontWeight] = useState<string>("600");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [textColor, setTextColor] = useState<string>("#0f172a");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [fontFamily, setFontFamily] = useState<string>("Inter, system-ui, sans-serif");

  // Layout controls
  const [padY, setPadY] = useState<number>(28);
  const [padX, setPadX] = useState<number>(28);
  const [lineHeight, setLineHeight] = useState<number>(1.45);
  const [sectionGap, setSectionGap] = useState<number>(16);
  const [pageBg, setPageBg] = useState<string>("#ffffff");
  const [canvasBg, setCanvasBg] = useState<string>("#eef2f7");

  // Theme Builder (app UI theme)
  const [uiTheme, setUiTheme] = useState({
    appBg: "#f5f7fb",
    surface: "#ffffff",
    surface2: "#f8fafc",
    border: "#e6eaf2",
    text: "#0f172a",
    muted: "#64748b",
    primary: "#111827",
    primaryText: "#ffffff",
  });

  const uiStyleVars = useMemo(
    () => ({
      ["--ui-app-bg" as any]: uiTheme.appBg,
      ["--ui-surface" as any]: uiTheme.surface,
      ["--ui-surface2" as any]: uiTheme.surface2,
      ["--ui-border" as any]: uiTheme.border,
      ["--ui-text" as any]: uiTheme.text,
      ["--ui-muted" as any]: uiTheme.muted,
      ["--ui-primary" as any]: uiTheme.primary,
      ["--ui-primary-text" as any]: uiTheme.primaryText,
    }),
    [uiTheme]
  );

  /* -----------------------------
     GrapesJS helpers
  ----------------------------- */
  const findAllResumePages = () => {
    const ed = editorRef.current;
    if (!ed) return [];
    return ed.DomComponents.getWrapper().find("[data-resume]") || [];
  };

  const findFirstResume = () => {
    const all = findAllResumePages();
    return all?.[0] ?? null;
  };

  const applyCanvasBg = (color: string) => {
    const ed = editorRef.current;
    if (!ed) return;
    const iframe = ed.Canvas.getFrameEl();
    const doc = iframe?.contentDocument;
    if (!doc) return;

    try {
      doc.documentElement.style.background = color;
      doc.body.style.background = color;
    } catch {}
  };

  const applyZoomToCanvas = (z: number) => {
    // Fix: scale canvas AND compensate width/height so it uses full area (no empty whitespace)
    const canvasEl = document.querySelector(".gjs-cv-canvas") as HTMLElement | null;
    const bodyEl = document.querySelector(".gjs-cv-canvas__frames") as HTMLElement | null;

    if (!canvasEl) return;

    const safe = clamp(z, 0.4, 1.4);

    canvasEl.style.transform = `scale(${safe})`;
    canvasEl.style.transformOrigin = "0 0";
    canvasEl.style.width = `${100 / safe}%`;
    canvasEl.style.height = `${100 / safe}%`;

    // Ensure parent scroll works nicely
    if (bodyEl) {
      bodyEl.style.overflow = "auto";
    }
  };

  const setPrimary = (hexLike: string) => {
    const ed = editorRef.current;
    if (!ed) return;

    const hex = normalizeHex(hexLike);
    if (!hex) return;

    const css = ed.getCss();
    ed.setStyle(upsertPrimaryRoot(css, hex));
  };

  const applyTemplate = (key: TemplateKey) => {
    const ed = editorRef.current;
    if (!ed) return;

    const tpl = TEMPLATES[key];
    if (!tpl) return;

    ed.DomComponents.clear();
    ed.CssComposer.clear();

    // Wrap in a doc container so we can add new pages easily
    const docHtml = `
      <div data-resume-doc>
        ${tpl.html}
      </div>
    `;

    ed.setComponents(docHtml);
    ed.setStyle(tpl.css);

    setPrimary(tpl.primary);
    setActiveTemplate(key);

    // Apply page BG and typography
    setTimeout(() => {
      applyResumeWideStyles();
      applyCanvasBg(canvasBg);
      applyZoomToCanvas(zoom);
    }, 60);
  };

  const applyResumeWideStyles = () => {
    const root = findAllResumePages();
    if (!root?.length) return;

    const py = clamp(padY, 0, 80);
    const px = clamp(padX, 0, 80);
    const lh = clamp(lineHeight, 1, 2);

    root.forEach((r: any) => {
      r.addStyle({
        padding: `${py}px ${px}px`,
        "line-height": String(lh),
        "font-family": fontFamily,
        "background-color": pageBg,
      });
    });

    // section gap rule (applies for templates using .r-section)
    const ed = editorRef.current;
    if (!ed) return;

    const gap = clamp(sectionGap, 4, 40);
    const css = ed.getCss();
    const withoutGap = css.replace(/\n?\.r-section\{[^}]*margin-top\s*:\s*[^;]+;[^}]*\}\s*/g, "");
    ed.setStyle(withoutGap + `\n.r-section{ margin-top: ${gap}px; }\n`);
  };

  const syncSelectedControls = () => {
    const ed = editorRef.current;
    if (!ed) return;

    const sel = ed.getSelected();
    if (!sel) return;

    const st = sel.getStyle?.() || {};
    if (st["font-size"]) {
      const n = parseInt(String(st["font-size"]).replace("px", ""), 10);
      if (!Number.isNaN(n)) setFontSize(n);
    }
    if (st["font-weight"]) setFontWeight(String(st["font-weight"]));
    if (st["text-align"]) setTextAlign(String(st["text-align"]) as any);
    if (st["color"]) setTextColor(String(st["color"]));
    if (st["background-color"]) setBgColor(String(st["background-color"]));
  };

  const setSelectedStyle = (patch: Record<string, any>) => {
    const ed = editorRef.current;
    if (!ed) return;
    const sel = ed.getSelected();
    if (!sel) return;
    sel.addStyle(patch);
  };

  const addNewPage = () => {
    const ed = editorRef.current;
    if (!ed) return;

    const pages = findAllResumePages();
    const first = pages?.[0];
    if (!first) return;

    // Clone first page as new page
    const html = first.toHTML?.() || first.getEl?.()?.outerHTML || `<div data-resume>New Page</div>`;
    const doc = ed.DomComponents.getWrapper().find("[data-resume-doc]")?.[0];

    if (!doc) {
      // fallback: just append to wrapper
      ed.addComponents(html);
    } else {
      doc.append(html);
    }

    setTimeout(() => {
      applyResumeWideStyles();
      applyZoomToCanvas(zoom);
    }, 50);
  };

  const downloadPdf = async () => {
    const ed = editorRef.current;
    if (!ed) return;

    const iframe = ed.Canvas.getFrameEl();
    const doc = iframe?.contentDocument;
    if (!doc) return;

    // Export ALL pages inside [data-resume-doc]
    const resumeDoc = (doc.querySelector("[data-resume-doc]") as HTMLElement | null) || doc.body;

    const css = ed.getCss();
    const html = resumeDoc.outerHTML;

    const wrap = document.createElement("div");
    wrap.style.position = "fixed";
    wrap.style.left = "-10000px";
    wrap.style.top = "0";
    wrap.style.width = "794px";
    wrap.innerHTML = `
      <style>
        ${css}
        @page{ size: A4; margin: 0; }
        /* ensure multiple pages break nicely */
        [data-resume]{ page-break-after: always; }
        [data-resume]:last-child{ page-break-after: auto; }
      </style>
      ${html}
    `;
    document.body.appendChild(wrap);

    try {
      const html2pdf = (await import("html2pdf.js")).default as any;
      const opt = {
        margin: 0,
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(wrap).save();
    } finally {
      document.body.removeChild(wrap);
    }
  };

  /* -----------------------------
     GrapesJS init
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
        storageManager: { type: "local", autosave: true, autoload: true, stepsBeforeSave: 3 },
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
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
          ],
        },
        panels: { defaults: [] },
        selectorManager: { componentFirst: true },
        styleManager: { sectors: [] },
      });

      editorRef.current = editor;

      editor.on("load", () => {
        // If no local project, load default template
        const hasData = !!localStorage.getItem("gjsProject");
        if (!hasData) applyTemplate("classic");

        // Minimal blocks
        editor.BlockManager.add("text", {
          label: "Text",
          category: "Basics",
          content: "<p>New text...</p>",
        });
        editor.BlockManager.add("section", {
          label: "Section",
          category: "Resume",
          content: '<section class="r-section"><div class="r-h">SECTION</div><p>Content...</p></section>',
        });
        editor.BlockManager.add("list", {
          label: "List",
          category: "Resume",
          content: "<ul><li>Bullet</li><li>Bullet</li></ul>",
        });

        // canvas bg + zoom fix
        setTimeout(() => {
          applyCanvasBg(canvasBg);
          applyZoomToCanvas(zoom);
          applyResumeWideStyles();
        }, 200);
      });

      editor.on("component:selected", syncSelectedControls);
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

  // Apply zoom fixes
  useEffect(() => {
    applyZoomToCanvas(zoom);
  }, [zoom]);

  // Apply resume-wide styling
  useEffect(() => {
    applyResumeWideStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [padY, padX, lineHeight, sectionGap, pageBg, fontFamily]);

  // Apply canvas background
  useEffect(() => {
    applyCanvasBg(canvasBg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasBg]);

  /* -----------------------------
     UI
  ----------------------------- */
  const PanelInput = ({
    label,
    value,
    onChange,
    onBlur,
    type = "text",
    placeholder,
    min,
    max,
    step,
  }: any) => (
    <label className="block">
      <div className="text-xs font-bold text-[var(--ui-muted)]">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onBlur={onBlur}
        className="mt-1 w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-bold text-[var(--ui-text)] outline-none"
      />
    </label>
  );

  const ColorRow = ({
    label,
    value,
    onChange,
    onCommit,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    onCommit?: (v: string) => void;
  }) => (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs font-bold text-[var(--ui-muted)]">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={normalizeHex(value) || "#000000"}
          onChange={(e) => {
            onChange(e.target.value);
            onCommit?.(e.target.value);
          }}
          className="h-9 w-10 cursor-pointer rounded-lg border border-[var(--ui-border)] bg-transparent p-1"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onCommit?.(value)}
          className="w-32 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-bold text-[var(--ui-text)] outline-none"
        />
      </div>
    </div>
  );

  const gridCols = mode === "edit" ? "lg:grid-cols-1" : "lg:grid-cols-[360px_1fr]";

  return (
    <div
      style={uiStyleVars as any}
      className="min-h-screen bg-[var(--ui-app-bg)] text-[var(--ui-text)]"
    >
      {/* Topbar */}
      <div className="sticky top-0 z-20 h-16 border-b border-[var(--ui-border)] bg-[var(--ui-surface)]">
        <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-4">
          <div className="text-[18px] font-semibold tracking-tight">Resume Builder</div>

          <div className="flex items-center gap-3">
            {/* Mode segmented */}
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

            {/* Zoom */}
            <div className="flex items-center gap-2 rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-2">
              <div className="w-14 text-right text-sm font-semibold text-[var(--ui-muted)]">
                {Math.round(zoom * 100)}%
              </div>
              <button
                type="button"
                className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))}
              >
                −
              </button>
              <button
                type="button"
                className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))}
              >
                +
              </button>
              <button
                type="button"
                className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                onClick={() => setZoom(0.6)}
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              onClick={addNewPage}
              className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] px-4 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
            >
              Add Page
            </button>

            <button
              type="button"
              onClick={downloadPdf}
              className="rounded-md bg-[var(--ui-primary)] px-4 py-2 text-sm font-semibold text-[var(--ui-primary-text)] hover:opacity-90"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className={["mx-auto grid h-[calc(100vh-64px)] max-w-[1500px] grid-cols-1 gap-4 p-4", gridCols].join(" ")}>
        {/* Left panel */}
        {mode === "customize" && (
          <aside className="min-h-0 overflow-hidden rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-surface2)] p-2">
              {[
                { id: "templates", label: "Template & Colors" },
                { id: "text", label: "Text" },
                { id: "layout", label: "Layout" },
                // { id: "theme", label: "Theme" },
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

            {/* Body */}
            <div className="min-h-0 overflow-auto p-3">
              {/* Templates */}
              {tab === "templates" && (
                <div className="space-y-3">
                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold">Main color</div>
                      <input
                        defaultValue={TEMPLATES[activeTemplate].primary}
                        onBlur={(e) => setPrimary(e.target.value)}
                        className="w-36 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-bold text-[var(--ui-text)] outline-none"
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {SWATCHES.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setPrimary(hex)}
                          className="h-10 w-10 rounded-md border-2 border-[var(--ui-border)]"
                          style={{ background: hex }}
                          aria-label={`swatch-${hex}`}
                        />
                      ))}
                    </div>

                    <p className="mt-3 text-xs font-semibold text-[var(--ui-muted)]">
                      Tip: resume accents update using <code>--primary</code>.
                    </p>
                  </div>

                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Templates</div>
                      <div className="text-xs font-bold text-[var(--ui-muted)]">Click any template</div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {templateOrder.map((key) => {
                        const t = TEMPLATES[key];
                        const active = key === activeTemplate;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => applyTemplate(key)}
                            className={[
                              "rounded-md border p-3 text-left",
                              active
                                ? "border-[var(--ui-text)] ring-2 ring-black/10"
                                : "border-[var(--ui-border)] hover:bg-[var(--ui-surface2)]",
                            ].join(" ")}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold">{t.name}</div>
                              {t.tag ? (
                                <span className="rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-800">
                                  {t.tag}
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-2 h-[110px] overflow-hidden rounded-xl border border-[var(--ui-border)] bg-gradient-to-b from-slate-50 to-white" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Text */}
              {tab === "text" && (
                <div className="space-y-3">
                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="text-sm font-semibold">Selected element</div>
                    <p className="mt-1 text-xs font-semibold text-[var(--ui-muted)]">
                      Resume preview (right) me click karo, fir font size/weight/alignment change karo.
                    </p>

                    <div className="my-4 h-px bg-[var(--ui-border)]" />

                    <div className="grid grid-cols-2 gap-3">
                      <PanelInput
                        label="Font size (px)"
                        type="number"
                        min={8}
                        max={120}
                        value={fontSize}
                        onChange={(e: any) => setFontSize(parseInt(e.target.value || "14", 10))}
                        onBlur={() => setSelectedStyle({ "font-size": `${fontSize}px` })}
                      />

                      <label className="block">
                        <div className="text-xs font-bold text-[var(--ui-muted)]">Font weight</div>
                        <select
                          value={fontWeight}
                          onChange={(e) => {
                            setFontWeight(e.target.value);
                            setSelectedStyle({ "font-weight": e.target.value });
                          }}
                          className="mt-1 w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-bold text-[var(--ui-text)] outline-none"
                        >
                          {["300", "400", "500", "600", "700", "800"].map((w) => (
                            <option key={w} value={w}>
                              {w}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <div className="text-xs font-bold text-[var(--ui-muted)]">Text align</div>
                        <select
                          value={textAlign}
                          onChange={(e) => {
                            const v = e.target.value as any;
                            setTextAlign(v);
                            setSelectedStyle({ "text-align": v });
                          }}
                          className="mt-1 w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-bold text-[var(--ui-text)] outline-none"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </label>

                      <PanelInput
                        label="Text color"
                        value={textColor}
                        onChange={(e: any) => setTextColor(e.target.value)}
                        onBlur={() => setSelectedStyle({ color: textColor })}
                      />

                      <PanelInput
                        label="Background color (selected)"
                        value={bgColor}
                        onChange={(e: any) => setBgColor(e.target.value)}
                        onBlur={() => setSelectedStyle({ "background-color": bgColor })}
                      />
                    </div>
                  </div>

                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="text-sm font-semibold">Typography</div>
                    <div className="mt-2 text-xs font-bold text-[var(--ui-muted)]">Resume font family</div>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-bold text-[var(--ui-text)] outline-none"
                    >
                      <option value="Inter, system-ui, sans-serif">Inter</option>
                      <option value="Georgia, 'Times New Roman', serif">Georgia</option>
                      <option value="'Times New Roman', Times, serif">Times New Roman</option>
                      <option value="Arial, Helvetica, sans-serif">Arial</option>
                      <option value="'Calibri', Arial, sans-serif">Calibri</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Layout */}
              {tab === "layout" && (
                <div className="space-y-3">
                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="text-sm font-semibold">Resume Page</div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <PanelInput
                        label="Top/Bottom padding (px)"
                        type="number"
                        min={0}
                        max={80}
                        value={padY}
                        onChange={(e: any) => setPadY(parseInt(e.target.value || "28", 10))}
                      />
                      <PanelInput
                        label="Left/Right padding (px)"
                        type="number"
                        min={0}
                        max={80}
                        value={padX}
                        onChange={(e: any) => setPadX(parseInt(e.target.value || "28", 10))}
                      />
                      <PanelInput
                        label="Line height"
                        type="number"
                        step={0.05}
                        min={1}
                        max={2}
                        value={lineHeight}
                        onChange={(e: any) => setLineHeight(parseFloat(e.target.value || "1.45"))}
                      />
                      <PanelInput
                        label="Section gap (px)"
                        type="number"
                        min={4}
                        max={40}
                        value={sectionGap}
                        onChange={(e: any) => setSectionGap(parseInt(e.target.value || "16", 10))}
                      />
                    </div>

                    <div className="mt-4 space-y-3">
                      <ColorRow
                        label="Resume page background"
                        value={pageBg}
                        onChange={(v) => setPageBg(v)}
                        onCommit={(v) => setPageBg(v)}
                      />
                      <ColorRow
                        label="Canvas background"
                        value={canvasBg}
                        onChange={(v) => setCanvasBg(v)}
                        onCommit={(v) => setCanvasBg(v)}
                      />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-[var(--ui-muted)]">
                      Tip: Add Page = new resume page for multi-page PDF.
                    </p>
                  </div>

                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="text-sm font-semibold">Columns</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const ed = editorRef.current;
                          if (!ed) return;
                          const cols = ed.DomComponents.getWrapper().find("[data-cols]");
                          if (!cols?.[0]) {
                            alert("This template does not use a column wrapper (try Professional / Traditional).");
                            return;
                          }
                          cols[0].addStyle({ display: "block" });
                        }}
                        className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                      >
                        Single column
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const ed = editorRef.current;
                          if (!ed) return;
                          const cols = ed.DomComponents.getWrapper().find("[data-cols]");
                          if (!cols?.[0]) {
                            alert("This template does not use a column wrapper (try Professional / Traditional).");
                            return;
                          }
                          cols[0].addStyle({ display: "grid" });
                        }}
                        className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
                      >
                        Two column
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme Builder */}
              {tab === "theme" && (
                <div className="space-y-3">
                  <div className="rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
                    <div className="text-sm font-semibold">Theme Builder (UI)</div>
                    <p className="mt-1 text-xs font-semibold text-[var(--ui-muted)]">
                      App background / panels / text colors change karo (builder UI).
                    </p>

                    <div className="my-4 h-px bg-[var(--ui-border)]" />

                    <div className="space-y-3">
                      <ColorRow
                        label="App background"
                        value={uiTheme.appBg}
                        onChange={(v) => setUiTheme((p) => ({ ...p, appBg: v }))}
                      />
                      <ColorRow
                        label="Surface (cards/panels)"
                        value={uiTheme.surface}
                        onChange={(v) => setUiTheme((p) => ({ ...p, surface: v }))}
                      />
                      <ColorRow
                        label="Surface 2 (tab bg)"
                        value={uiTheme.surface2}
                        onChange={(v) => setUiTheme((p) => ({ ...p, surface2: v }))}
                      />
                      <ColorRow
                        label="Border"
                        value={uiTheme.border}
                        onChange={(v) => setUiTheme((p) => ({ ...p, border: v }))}
                      />
                      <ColorRow
                        label="Text"
                        value={uiTheme.text}
                        onChange={(v) => setUiTheme((p) => ({ ...p, text: v }))}
                      />
                      <ColorRow
                        label="Muted text"
                        value={uiTheme.muted}
                        onChange={(v) => setUiTheme((p) => ({ ...p, muted: v }))}
                      />
                      <ColorRow
                        label="Primary button"
                        value={uiTheme.primary}
                        onChange={(v) => setUiTheme((p) => ({ ...p, primary: v }))}
                      />
                      <ColorRow
                        label="Primary text"
                        value={uiTheme.primaryText}
                        onChange={(v) => setUiTheme((p) => ({ ...p, primaryText: v }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Editor (always full width when Edit mode) */}
        <main className="min-h-0 overflow-hidden rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
          <div className="flex items-center justify-between border-b border-[var(--ui-border)] bg-[var(--ui-surface)] p-3">
            <div className="text-sm font-semibold text-[var(--ui-muted)]">Preview</div>
            <button
              type="button"
              onClick={() => {
                applyTemplate("classic");
                setMode("customize");
                setTab("templates");
              }}
              className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--ui-surface2)]"
            >
              Demo
            </button>
          </div>

          <div className="h-[calc(100%-52px)]">
            <div ref={gjsRef} className="h-full" />
          </div>
        </main>
      </div>

      {/* Global GrapesJS tweaks + FULL WIDTH FIXES */}
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
        .gjs-pn-panel {
          background-color: var(--ui-surface) !important;
        }
        .gjs-pn-views,
        .gjs-pn-options {
          display: none !important;
        }

        /* Make the canvas wrapper scrollable so scaled content still fills width */
        .gjs-cv-canvas__frames {
   width: 980px !important;
    height: 950px !important;
  background: transparent !important;
  overflow: auto !important;
        }
        .gjs-cv-canvas {
    width: 980px !important;
    height: 950px !important;
  padding: 24px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: flex-start !important;
  background: transparent !important;
        }
      `}</style>
    </div>
  );
}

/**
 * Install packages:
 *   npm i grapesjs grapesjs-preset-webpage html2pdf.js
 */
