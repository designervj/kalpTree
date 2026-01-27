"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  ChevronRight,
  X,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Search,
  FileText,
  LayoutGrid,
  Layers,
  Image as ImageIcon,
  PenTool,
} from "lucide-react";

type ToolId = "image" | "writer" | "page" | "section" | "blog" | "product" | "seo";

const TOOLS: { id: ToolId; label: string; icon: React.ReactNode }[] = [
  { id: "image", label: "AI Image Generator", icon: <ImageIcon className="h-5 w-5" /> },
  { id: "writer", label: "AI Writer", icon: <PenTool className="h-5 w-5" /> },
  { id: "page", label: "AI Page Generator", icon: <LayoutGrid className="h-5 w-5" /> },
  { id: "section", label: "AI Section Generator", icon: <Layers className="h-5 w-5" /> },
  { id: "blog", label: "AI Blog Generator", icon: <FileText className="h-5 w-5" /> },
  { id: "product", label: "AI Product Details Generator", icon: <Sparkles className="h-5 w-5" /> },
  { id: "seo", label: "AI SEO Assistant", icon: <Search className="h-5 w-5" /> },
];

const TOOL_TITLES: Record<ToolId, string> = {
  image: "AI image generator",
  writer: "AI Writer",
  page: "Create a page with AI",
  section: "Create a section with AI",
  blog: "Create a blog post with AI",
  product: "AI Product Details Generator",
  seo: "AI SEO Assistant",
};

export default function AiToolsPage() {
  const [activeTool, setActiveTool] = React.useState<ToolId | null>(null);

  // per-tool inputs
  const maxChars = 3000;
  const maxSectionChars = 500;

  const [description, setDescription] = React.useState("");
  const [writerText, setWriterText] = React.useState("");
  const [pageText, setPageText] = React.useState("");
  const [sectionText, setSectionText] = React.useState("");
  const [blogText, setBlogText] = React.useState("");

  const [tone, setTone] = React.useState("Formal");
  const [length, setLength] = React.useState("300–500 words");

  const onOpenTool = (id: ToolId) => setActiveTool(id);
  const onBack = () => setActiveTool(null);

  const ToolShell = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="w-full">
        <div className="w-[420px] max-w-full rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#0b1220] dark:ring-slate-800">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-5">
            <div className="text-[30px] font-semibold leading-none text-slate-900 dark:text-slate-100">
              {activeTool ? TOOL_TITLES[activeTool] : "AI tools"}
            </div>

            <div className="flex items-center gap-2">
              {activeTool ? (
                <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
                  <X className="h-5 w-5" />
                </Button>
              ) : null}
            </div>
          </div>

          {children}
        </div>
      </div>
    );
  };

  // ----- LIST SCREEN (matches your list screenshot) -----
  if (!activeTool) {
    return (
      <ToolShell>
        <div className="px-3 pb-4 pt-4">
          <div className="space-y-2">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={cn(
                  "w-full flex items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors",
                  "hover:bg-slate-50 dark:hover:bg-white/5"
                )}
                onClick={() => onOpenTool(t.id)}
              >
                <span
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-full",
                    "bg-violet-700 text-white"
                  )}
                >
                  {t.icon}
                </span>

                <span className="flex-1 text-[20px] font-semibold text-slate-900 dark:text-slate-100">
                  {t.label}
                </span>

                <ChevronRight className="h-6 w-6 text-slate-300 dark:text-slate-700" />
              </button>
            ))}
          </div>
        </div>
      </ToolShell>
    );
  }

  // ----- DETAIL SCREENS (match your per-tool screenshots) -----
  const CountRow = ({ count, max }: { count: number; max: number }) => (
    <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
        <span>Try to be descriptive for best results!</span>
      </div>
      <span>
        {count}/{max}
      </span>
    </div>
  );

  const ExamplesLink = () => (
    <button
      type="button"
      className={cn("mt-3 inline-flex items-center gap-2 text-sm font-medium", "text-violet-700 hover:underline dark:text-violet-200")}
      onClick={() => {}}
    >
      <Lightbulb className="h-4 w-4" />
      See examples <ChevronRight className="h-4 w-4" />
    </button>
  );

  const PrimaryCTA = ({ label }: { label: string }) => (
    <>
      <div className="mt-6">
        <Button
          className={cn("h-14 w-full rounded-xl text-lg font-semibold", "bg-violet-600 hover:bg-violet-700 text-white")}
          onClick={() => {}}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {label}
        </Button>
      </div>

      <Separator className="my-4 bg-slate-200 dark:bg-slate-800" />

      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        AI outputs may be misleading or inaccurate
      </div>

      <button
        type="button"
        className={cn("mt-4 inline-flex items-center gap-2 text-sm", "text-slate-600 hover:underline dark:text-slate-300")}
        onClick={() => {}}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-300">
          🙂
        </span>
        <span>
          <span className="text-violet-700 dark:text-violet-200">Rate this feature.</span>{" "}
          Help us improve.
        </span>
      </button>
    </>
  );

  return (
    <ToolShell>
      {/* back row like screenshots (small arrow on top-left feel) */}
      <div className="px-5 pt-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-9 px-2 text-slate-600 dark:text-slate-300">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="px-5 pb-6 pt-3">
        {/* inner card like screenshot */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0b1220]">
          {activeTool === "image" && (
            <>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">Image description</div>
              <div className="mt-3">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                  placeholder="A small bird perched on a branch in a forest"
                  className={cn(
                    "min-h-[140px] resize-none rounded-xl",
                    "border-slate-200 bg-white text-slate-900",
                    "placeholder:text-slate-400 focus-visible:ring-0",
                    "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                  )}
                />
              </div>

              <CountRow count={description.length} max={maxChars} />
              <ExamplesLink />
              <PrimaryCTA label="Create images" />
            </>
          )}

          {activeTool === "writer" && (
            <>
              <div className="text-[28px] font-semibold text-slate-900 dark:text-slate-100">AI Writer</div>
              <div className="mt-2 text-base text-slate-500 dark:text-slate-400">
                Create content of any length, style, or tone. Paste it into a text element to edit or enhance with AI.
              </div>

              <div className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
                Describe what you want to write
              </div>

              <div className="mt-3">
                <Textarea
                  value={writerText}
                  onChange={(e) => setWriterText(e.target.value.slice(0, maxChars))}
                  placeholder="Write one paragraph for an About Us page of a yoga studio. Keep the tone friendly."
                  className={cn(
                    "min-h-[140px] resize-none rounded-xl",
                    "border-slate-200 bg-white text-slate-900",
                    "placeholder:text-slate-400 focus-visible:ring-0",
                    "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                  )}
                />
              </div>

              <CountRow count={writerText.length} max={maxChars} />
              <ExamplesLink />
              <PrimaryCTA label="Create text" />
            </>
          )}

          {activeTool === "page" && (
            <>
              <div className="text-center text-[28px] font-semibold text-slate-900 dark:text-slate-100">
                Create a page with AI
              </div>

              <div className="mt-8 text-base font-semibold text-slate-900 dark:text-slate-100">Page description</div>
              <div className="mt-3">
                <Textarea
                  value={pageText}
                  onChange={(e) => setPageText(e.target.value.slice(0, maxChars))}
                  placeholder="Create an About Us page for our sustainable Italian restaurant..."
                  className={cn(
                    "min-h-[140px] resize-none rounded-xl",
                    "border-slate-200 bg-white text-slate-900",
                    "placeholder:text-slate-400 focus-visible:ring-0",
                    "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                  )}
                />
              </div>

              <CountRow count={pageText.length} max={maxChars} />
              <ExamplesLink />

              <div className="mt-6 flex justify-center">
                <Button
                  className={cn("h-12 rounded-xl px-8 text-lg font-semibold", "bg-violet-600 hover:bg-violet-700 text-white")}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create page
                </Button>
              </div>
            </>
          )}

          {activeTool === "section" && (
            <>
              <div className="text-center text-[28px] font-semibold text-slate-900 dark:text-slate-100">
                Create a section with AI
              </div>

              <div className="mt-8 text-base font-semibold text-slate-900 dark:text-slate-100">Section description</div>
              <div className="mt-3">
                <Textarea
                  value={sectionText}
                  onChange={(e) => setSectionText(e.target.value.slice(0, maxSectionChars))}
                  placeholder="About us section for our sustainable fashion boutique..."
                  className={cn(
                    "min-h-[140px] resize-none rounded-xl",
                    "border-slate-200 bg-white text-slate-900",
                    "placeholder:text-slate-400 focus-visible:ring-0",
                    "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                  )}
                />
              </div>

              <CountRow count={sectionText.length} max={maxSectionChars} />
              <ExamplesLink />

              <div className="mt-6 flex justify-center">
                <Button
                  className={cn("h-12 rounded-xl px-8 text-lg font-semibold", "bg-violet-600 hover:bg-violet-700 text-white")}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create section
                </Button>
              </div>
            </>
          )}

          {activeTool === "blog" && (
            <>
              <div className="text-center text-[28px] font-semibold text-slate-900 dark:text-slate-100">
                Create a blog post with AI
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-100">Tone of voice</div>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-100">Length of content</div>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="150–300 words">150–300 words</SelectItem>
                      <SelectItem value="300–500 words">300–500 words</SelectItem>
                      <SelectItem value="500–800 words">500–800 words</SelectItem>
                      <SelectItem value="800–1200 words">800–1200 words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
                Blog post description.
              </div>

              <div className="mt-3">
                <Textarea
                  value={blogText}
                  onChange={(e) => setBlogText(e.target.value.slice(0, maxChars))}
                  placeholder="10 tips for creating marketing campaigns that skyrocket sales..."
                  className={cn(
                    "min-h-[140px] resize-none rounded-xl",
                    "border-slate-200 bg-white text-slate-900",
                    "placeholder:text-slate-400 focus-visible:ring-0",
                    "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                  )}
                />
              </div>

              <CountRow count={blogText.length} max={maxChars} />

              <div className="mt-6 flex justify-center">
                <Button
                  className={cn("h-12 rounded-xl px-8 text-lg font-semibold", "bg-violet-600 hover:bg-violet-700 text-white")}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create content
                </Button>
              </div>
            </>
          )}

          {activeTool === "product" && (
            <>
              <div className="text-[20px] font-semibold text-slate-900 dark:text-slate-100">AI Product Details Generator</div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                UI for <span className="font-semibold">{TOOL_TITLES[activeTool]}</span> can be added here.
              </div>
              <PrimaryCTA label="Generate details" />
            </>
          )}

          {activeTool === "seo" && (
            <>
              <div className="text-[20px] font-semibold text-slate-900 dark:text-slate-100">AI SEO Assistant</div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                UI for <span className="font-semibold">{TOOL_TITLES[activeTool]}</span> can be added here.
              </div>
              <PrimaryCTA label="Generate SEO" />
            </>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
