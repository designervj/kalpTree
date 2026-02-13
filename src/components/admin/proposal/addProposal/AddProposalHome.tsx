"use client";

import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type {
  ProposalModel,
  ProposalPageModel,
  ProposalType,
} from "../ProposalModel";
import { useRouter } from "next/navigation";

type HtmlMode = "html" | "preview";

type AddProposalHomeProps = {
  page?: ProposalPageModel | null;
  body?: ProposalModel | null;
  onChange?: (value: { page: ProposalPageModel; body: ProposalModel }) => void;
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

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

/** Clean iframe document wrapper for live preview */
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

/** Simple HTML editor with line numbers and tab indent */
const HtmlCodeEditor = React.forwardRef<
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

const DEFAULT_PAGE: ProposalPageModel = {
  title: "",
  status: "draft",
  proposal_type: "standard" as ProposalType,
  headerHtml: "",
  footerHtml: "",
  css: "",
  pages: null,
};

const DEFAULT_BODY: ProposalModel = {
  pageNumber: 1,
  bodyHtml: "",
  bodyCss: "",
};

const AddProposalHome: React.FC<AddProposalHomeProps> = ({
  page,
  body,
  onChange,
}) => {
  const [pageState, setPageState] = useState<ProposalPageModel>(
    page ?? { ...DEFAULT_PAGE }
  );

  const router = useRouter();
  const [bodyState, setBodyState] = useState<ProposalModel>(
    body ?? { ...DEFAULT_BODY }
  );
  const [mode, setMode] = useState<HtmlMode>("html");

  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const combinedHtml = useMemo(() => {
    const header = pageState.headerHtml || "";
    const bodyHtml = bodyState.bodyHtml || "";
    const footer = pageState.footerHtml || "";
    const full = `${header}\n${bodyHtml}\n${footer}`.trim();
    return unescapeHtmlIfNeeded(full);
  }, [pageState.headerHtml, pageState.footerHtml, bodyState.bodyHtml]);

  const iframeDoc = useMemo(() => buildIframeDoc(combinedHtml), [combinedHtml]);

  const emitChange = (
    nextPage: ProposalPageModel,
    nextBody: ProposalModel
  ) => {
    onChange?.({
      page: nextPage,
      body: nextBody,
    });
  };

  const handlePageChange = <K extends keyof ProposalPageModel>(
    key: K,
    value: ProposalPageModel[K]
  ) => {
    const next = { ...pageState, [key]: value };
    setPageState(next);
    emitChange(next, bodyState);
  };

  const handleBodyChange = <K extends keyof ProposalModel>(
    key: K,
    value: ProposalModel[K]
  ) => {
    const next = { ...bodyState, [key]: value };
    setBodyState(next);
    emitChange(pageState, next);
  };

  const THUMB_SCALE = 0.32;
  const thumbW = `${100 / THUMB_SCALE}%`;
  const thumbH = `${100 / THUMB_SCALE}%`;

  return (
    <form className="min-h-screen w-full">
      <div className="max-w-[1320px] mx-auto px-7 py-7">
        <div className="flex items-start justify-between gap-4">
          <div className="mt-1">
            <div className="text-sm font-semibold text-slate-500">
              Proposals / New Proposal Page
            </div>
            <div className="text-lg font-semibold text-slate-900 mt-1">
              Add proposal page
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>

            <Button type="submit">Save Proposal</Button>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left – page content */}
          <div className="lg:col-span-8">
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Title
                </Label>
                <Input
                  value={pageState.title || ""}
                  onChange={(e) => handlePageChange("title", e.target.value)}
                  placeholder="Enter proposal page title"
                  className="h-11 rounded-md bg-white border-slate-200"
                />
              </div>

              {/* Header HTML */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Header HTML
                </Label>
                <Textarea
                  rows={4}
                  value={pageState.headerHtml || ""}
                  onChange={(e) =>
                    handlePageChange("headerHtml", e.target.value)
                  }
                  placeholder="<header>Logo, title, client details...</header>"
                  className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-[13.5px] leading-6 text-slate-900 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 resize-none"
                />
              </div>

              {/* Main HTML editor with HTML / Preview toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label className="text-[14px] font-semibold text-slate-900">
                      Page HTML
                    </Label>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Edit HTML and preview instantly. This is the main body
                      content of the proposal page.
                    </div>
                  </div>

                  <div className="flex items-center rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                    <Button
                      type="button"
                      variant={mode === "html" ? "default" : "ghost"}
                      className={cn(
                        "h-9 rounded-md px-4",
                        mode === "html" &&
                          "bg-violet-600 hover:bg-violet-700 text-white"
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
                    value={bodyState.bodyHtml || ""}
                    onChange={(v) => handleBodyChange("bodyHtml", v)}
                    rows={18}
                    placeholder="<h1>Title</h1><p>Content...</p>"
                  />
                )}

                {mode === "preview" && (
                  <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900">
                        Live Preview
                      </div>
                      <div className="text-xs text-slate-500">
                        Combined header · body · footer
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
                        <iframe
                          title="proposal-preview"
                          className="w-full h-[520px] bg-white"
                          srcDoc={iframeDoc}
                          sandbox="allow-same-origin"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer HTML */}
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Footer HTML
                </Label>
                <Textarea
                  rows={4}
                  value={pageState.footerHtml || ""}
                  onChange={(e) =>
                    handlePageChange("footerHtml", e.target.value)
                  }
                  placeholder="<footer>Contact, page numbers...</footer>"
                  className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-[13.5px] leading-6 text-slate-900 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right – meta from ProposalModel / ProposalPageModel */}
          <div className="lg:col-span-4 space-y-7">
            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7 space-y-5">
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Page Number
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={bodyState.pageNumber ?? 1}
                  onChange={(e) =>
                    handleBodyChange(
                      "pageNumber",
                      Number(e.target.value || 1) as number
                    )
                  }
                  className="h-11 rounded-md bg-white border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Proposal type
                </Label>
                <Select
                  value={pageState.proposal_type ?? "standard"}
                  onValueChange={(v) =>
                    handlePageChange("proposal_type", v as ProposalType)
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-md bg-white border-slate-200">
                    <SelectValue placeholder="Select proposal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="blank">Blank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Status
                </Label>
                <Select
                  value={pageState.status ?? "draft"}
                  onValueChange={(v) =>
                    handlePageChange("status", v as "draft" | "published" | "archived")
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-md bg-white border-slate-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Body CSS
                </Label>
                <Textarea
                  rows={6}
                  value={bodyState.bodyCss || ""}
                  onChange={(e) => handleBodyChange("bodyCss", e.target.value)}
                  placeholder={"/* Optional CSS for this page body */"}
                  className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-[13.5px] leading-6 text-slate-900 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Page CSS (header/footer)
                </Label>
                <Textarea
                  rows={4}
                  value={pageState.css || ""}
                  onChange={(e) => handlePageChange("css", e.target.value)}
                  placeholder={"/* Optional CSS for header/footer */"}
                  className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-[13.5px] leading-6 text-slate-900 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-slate-900">
                  Preview thumbnail
                </Label>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
                    <div className="relative aspect-[16/10] w-full bg-white overflow-hidden">
                      <iframe
                        title="proposal-thumbnail"
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
                    Small thumbnail automatically generated from your header,
                    body and footer HTML.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddProposalHome;