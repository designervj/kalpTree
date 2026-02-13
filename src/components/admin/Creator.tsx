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
import { PAGE_TEMPLATES } from "./DemoTemplate";
import { TemplateDocument } from "./templates/TemplateType";

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

export type PageTemplate = {
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
  const { allTemplate } = useSelector((state: RootState) => state.template);


  // get all template of category type page
  const pageTemplates = useMemo(() => {
    return allTemplate.filter((t) => t.category === "page");
  }, [allTemplate]);
  console.log("pageTemplates", pageTemplates);
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
  const [selectedTplKey, setSelectedTplKey] = useState<string>(pageTemplates[0]?._id?.toString() || "");
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
    () => allTemplate.find((t) => t._id === selectedTplKey) || allTemplate[0],
    [selectedTplKey]
  );


  console.log("selectedTemplate--",selectedTemplate)
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

  const applyTemplate = (tpl: TemplateDocument, withSeoDefaults = true) => {
    // Replace full content
   // setContentValue(tpl?.content);

    // Auto fill SEO (only if empty)
    // if (withSeoDefaults && tpl.seo) {
    //   setFormData((p) => ({
    //     ...p,
    //     focusKeyword: p.focusKeyword || tpl.seo?.focusKeyword || "",
    //     seoTitle: p.seoTitle || tpl.seo?.seoTitle || "",
    //     metaDescription: p.metaDescription || tpl.seo?.metaDescription || "",
    //   }));
    // }

    toast.success(`Applied template: ${tpl.label}`);
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
                    sandbox="allow-scripts allow-same-origin"

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
                      {pageTemplates.map((t) => {
                        const isActive = t._id === selectedTplKey;
                        const doc = buildIframeDoc(t?.content ?? "");
                        return (
                          <button
                            type="button"
                            key={t._id?.toString()}
                            onClick={() => {
                              setSelectedTplKey(t?._id?.toString() || "");
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
                                {/* {t.name} */}
                                {t?.label}
                              </div>
                              <div className="text-[11px] text-slate-500 capitalize">
                                {t.category}
                              </div>
                            </div>

                            <div className="p-2 bg-slate-50">
                              <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
                                <div className="relative aspect-[16/10] w-full bg-white overflow-hidden">
                                  <iframe
                                    title={`tpl-${t._id?.toString()}`}
                                    srcDoc={doc}
                                    sandbox="allow-scripts allow-same-origin"
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
                          {selectedTemplate?.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {selectedTemplate?.description}
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
                            srcDoc={buildIframeDoc(selectedTemplate?.content || "")}
                            sandbox="allow-scripts allow-same-origin"
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
                         // onClick={() => insertTemplateAtCursor(selectedTemplate)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Insert
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-md"
                         // onClick={() => copyToClipboard(selectedTemplate?.html || "")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>

                      {showTplCode && (
                        <div className="mt-3">
                          <pre className="max-h-[240px] overflow-auto rounded-md border border-slate-200 bg-white p-3 text-[12px] leading-5 text-slate-800">
                            {selectedTemplate?.content || ""}
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
                          sandbox="allow-scripts allow-same-origin"
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
