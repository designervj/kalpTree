"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { toast } from "sonner";

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

/** If user already provided full HTML doc, keep it. Else wrap as body fragment */
const looksLikeFullDoc = (html: string) =>
  /<html[\s>]/i.test(html) || /<!doctype/i.test(html) || /<body[\s>]/i.test(html);

/** Clean iframe document wrapper (NO extra padding that breaks layout) */
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

  // If full doc already
  if (looksLikeFullDoc(html)) return html;

  // Wrap fragment
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    html,body{margin:0;padding:0;background:#fff;color:#0f172a}
    *{box-sizing:border-box}
    img{max-width:100%;height:auto}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
};

/* -----------------------------
  Basic Rich Editor
------------------------------ */
function RichContentEditor({
  value,
  onChange,
  placeholder = "Write your page content...",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if ((ref.current.innerHTML || "") !== (value || "")) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    // @ts-ignore
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML || "");
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <Button type="button" variant="outline" className="h-9 rounded-xl px-3" onClick={() => exec("bold")}>
          <span className="font-semibold">B</span>
        </Button>
        <Button type="button" variant="outline" className="h-9 rounded-xl px-3 italic" onClick={() => exec("italic")}>
          I
        </Button>
        <Button type="button" variant="outline" className="h-9 rounded-xl px-3 underline" onClick={() => exec("underline")}>
          U
        </Button>

        <div className="h-7 w-px bg-slate-200 mx-1" />

        <Button type="button" variant="outline" className="h-9 rounded-xl px-3" onClick={() => exec("insertUnorderedList")}>
          • List
        </Button>
        <Button type="button" variant="outline" className="h-9 rounded-xl px-3" onClick={() => exec("insertOrderedList")}>
          1. List
        </Button>

        <div className="ml-auto text-xs text-slate-500">Rich editor</div>
      </div>

      <div className="p-4">
        <div
          ref={ref}
          contentEditable
          onInput={() => onChange(ref.current?.innerHTML || "")}
          className={cn(
            "min-h-[360px] w-full rounded-md border border-slate-200 bg-white px-5 py-4",
            "text-[14px] leading-6 text-slate-900 outline-none",
            "focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
          )}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
        <style jsx>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #94a3b8;
          }
        `}</style>
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
  const [mode, setMode] = useState<"rich" | "html" | "preview">("rich");
  const [slugTouched, setSlugTouched] = useState(false);

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "array") initial[f.name] = Array.isArray(item?.[f.name]) ? item[f.name] : [];
      else initial[f.name] = item?.[f.name] ?? "";
    });
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

  const handleChange = (name: string, value: any) => {
    if (name === "title") {
      const nextSlug = slugify(value);
      setFormData((p) => ({ ...p, title: value, ...(slugTouched ? {} : { slug: nextSlug }) }));
      return;
    }
    if (name === "slug") setSlugTouched(true);
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
    router.push(`/admin/websites/${primaryBusiness}/website/pages?${params.toString()}`);
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

  // ✅ Renderable preview html
  const renderableHtml = useMemo(
    () => unescapeHtmlIfNeeded(formData?.content || ""),
    [formData?.content]
  );

  const iframeDoc = useMemo(() => buildIframeDoc(renderableHtml), [renderableHtml]);

  // ✅ Thumbnail scaling (shows more of page in small box)
  const THUMB_SCALE = 0.32; // smaller => more content visible
  const thumbW = `${100 / THUMB_SCALE}%`;
  const thumbH = `${100 / THUMB_SCALE}%`;

  const renderField = (field: FieldConfig) => {
    const { name, label, type, options, placeholder, readOnly, rows } = field;

    if (type === "array") {
      const arr = formData[name] || [];
      return (
        <div key={name} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
            <Button type="button" variant="outline" className="h-9 rounded-xl" onClick={() => handleArrayAdd(name)}>
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
              <Label className="text-[14px] font-semibold text-slate-900">{label}</Label>
              <div className="text-xs text-slate-500 mt-0.5">
                Choose editor type. Preview updates instantly.
              </div>
            </div>

            <div className="flex items-center rounded-md border border-slate-200 bg-white p-1 shadow-sm">
              {/* <Button
                type="button"
                variant={mode === "rich" ? "default" : "ghost"}
                className={cn("h-9 rounded-xl px-4", mode === "rich" && "bg-violet-600 hover:bg-violet-700 text-white")}
                onClick={() => setMode("rich")}
              >
                Rich
              </Button> */}
              <Button
                type="button"
                variant={mode === "html" ? "default" : "ghost"}
                className={cn("h-9 rounded-xl px-4", mode === "html" && "bg-violet-600 hover:bg-violet-700 text-white")}
                onClick={() => setMode("html")}
              >
                HTML
              </Button>
              <Button
                type="button"
                variant={mode === "preview" ? "default" : "ghost"}
                className={cn("h-9 rounded-xl px-4", mode === "preview" && "bg-violet-600 hover:bg-violet-700 text-white")}
                onClick={() => setMode("preview")}
              >
                Preview
              </Button>
            </div>
          </div>

          {mode === "rich" && (
            <RichContentEditor
              value={formData.content || ""}
              onChange={(html) => handleChange("content", html)}
            />
          )}

          {mode === "html" && (
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-4">
              <textarea
                value={formData.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="<h1>Title</h1><p>Content...</p>"
                rows={rows || 16}
                className={cn(
                  "w-full rounded-md border border-slate-200 bg-white px-5 py-4",
                  "font-mono text-[13px] leading-6 text-slate-900 outline-none",
                  "focus:ring-2 focus:ring-violet-200 focus:border-violet-300",
                  "resize-none"
                )}
              />
              <div className="mt-2 text-xs text-slate-500">
                Escaped HTML like <span className="font-mono">&amp;lt;div&amp;gt;</span> will auto-render in preview/thumbnail.
              </div>
            </div>
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
                    sandbox="allow-same-origin" // blocks scripts by default, keeps layout safe
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
          <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
          <Input
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            className={cn("h-11 rounded-md bg-white border-slate-200", readOnly && "bg-slate-50 text-slate-700")}
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

  return (
    <form onSubmit={onSubmit} className="min-h-screen w-full ">
      <div className="max-w-[1320px] mx-auto px-7 py-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* <div className="text-[30px] font-semibold text-slate-900">Create</div>
            <div className="text-sm text-slate-500 mt-1">
              Create a page with content and metadata.
            </div> */}
            <div className="mt-3">
              <BreadCrumbPage />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              // className="h-10 rounded-md bg-white border-slate-200"
              onClick={goBack}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              // className="h-10 rounded-md bg-violet-700 hover:bg-violet-800"
            >
              {saving ? "Creating..." : "Save"}
            </Button>
          </div>
        </div>

        {msg && (
          <div className={cn(
            "mt-5 rounded-md border px-4 py-3 shadow-sm",
            msg.toLowerCase().includes("success")
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          )}>
            <div className="text-sm font-medium">{msg}</div>
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left */}
          <div className="lg:col-span-8">
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7">
              <div className="space-y-7">
                {leftFields.map((f) => renderField(f))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-7">
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7">
              <div className="space-y-7">
                {rightFields.map((f) => renderField(f))}

                {/* ✅ Thumbnail that shows more of the page (scaled iframe) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[13px] font-semibold text-slate-900">
                      Thumbnail Preview
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
                            pointerEvents: "none", // behaves like image
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      Mini preview shows more of the page now (scaled).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm h-[80px]" />
          </div>
        </div>
      </div>
    </form>
  );
}
