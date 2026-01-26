"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ChevronRight,
  X,
  Sparkles,
  Type,
  LayoutGrid,
  Rows3,
  FileText,
  Search,
  Lightbulb,
  SmilePlus,
  ShoppingBag,
} from "lucide-react";

type ToolId =
  | "image"
  | "writer"
  | "page"
  | "section"
  | "blog"
  | "product_details"
  | "seo";

const TOOLS: Array<{
  id: ToolId;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: "image", label: "AI Image Generator", icon: <Sparkles className="h-4 w-4" /> },
  { id: "writer", label: "AI Writer", icon: <Type className="h-4 w-4" /> },
  { id: "page", label: "AI Page Generator", icon: <LayoutGrid className="h-4 w-4" /> },
  { id: "section", label: "AI Section Generator", icon: <Rows3 className="h-4 w-4" /> },
  { id: "blog", label: "AI Blog Generator", icon: <FileText className="h-4 w-4" /> },
  {
    id: "product_details",
    label: "AI Product Details Generator",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  { id: "seo", label: "AI SEO Assistant", icon: <Search className="h-4 w-4" /> },
];

const TOOL_TITLES: Record<ToolId, string> = {
  image: "AI image generator",
  writer: "AI Writer",
  page: "Create a page with AI",
  section: "Create a section with AI",
  blog: "Create a blog post with AI",
  product_details: "AI Product Details Generator",
  seo: "AI SEO Assistant",
};

const TOOL_SUBTITLES: Partial<Record<ToolId, string>> = {
  writer:
    "Create content of any length, style, or tone. Paste it into a text element to edit or enhance with AI.",
};

export default function AiToolsPage() {
  const [activeTool, setActiveTool] = React.useState<ToolId | null>(null);

  // shared text inputs
  const [description, setDescription] = React.useState<string>(
    "A small bird perched on a branch in a forest"
  );

  // blog options
  const [blogTone, setBlogTone] = React.useState<string>("Formal");
  const [blogLen, setBlogLen] = React.useState<string>("300–500 words");

  const maxChars = React.useMemo(() => {
    if (!activeTool) return 3000;
    if (activeTool === "section") return 500;
    return 3000;
  }, [activeTool]);

  const count = description.length;

  const handleOpenTool = (id: ToolId) => {
    setActiveTool(id);

    // set sensible defaults per tool (optional)
    if (id === "writer") {
      setDescription(
        "Write one paragraph for an About Us page of a yoga studio. Keep the tone friendly."
      );
    } else if (id === "page") {
      setDescription(
        "Create an About Us page for our sustainable Italian restaurant, where we craft authentic dishes using only the finest locally sourced ingredients..."
      );
    } else if (id === "section") {
      setDescription(
        "About us section for our sustainable fashion boutique, where we curate stylish collections using only ethically sourced fabrics..."
      );
    } else if (id === "blog") {
      setDescription(
        "10 tips for creating marketing campaigns that skyrocket sales and strengthen your brand..."
      );
    } else if (id === "product_details") {
      setDescription(
        "Write product title, short description, key benefits, and 5 bullet points for a premium ceramic planter. Tone: modern and minimal."
      );
    } else if (id === "seo") {
      setDescription(
        "Generate SEO title, meta description, and 3 focus keywords for an All products page."
      );
    } else if (id === "image") {
      setDescription("A small bird perched on a branch in a forest");
    }
  };

  const showList = !activeTool;

  return (
    <div className="w-full">
      {/* List view (screenshot 1) */}
      {showList && (
        <div className={cn("w-full ")}>
    
            <div className="space-y-2">
              {TOOLS.map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "w-full flex items-center gap-4 rounded-xl px-2 py-2 text-left transition-colors",
                    "hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-4 text-left"
                    onClick={() => handleOpenTool(t.id)}
                  >
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-full",
                        "bg-violet-700 text-white"
                      )}
                    >
                      {t.icon}
                    </span>

                    <span className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {t.label}
                    </span>
                  </button>

                  {/* ✅ ChevronRight click = open tool (hide list, show detail) */}
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full",
                      "hover:bg-transprant dark:hover:bg-white/5"
                    )}
                    onClick={() => handleOpenTool(t.id)}
                    aria-label={`Open ${t.label}`}
                  >
                    <ChevronRight className="h-6 w-6 text-slate-300 dark:text-slate-700" />
                  </button>
                </div>
              ))}
            </div>

        </div>
      )}

      {/* Detail view (screenshot 2 + other tool screens) */}
      {!showList && activeTool && (
        <div className={cn("w-full rounded-2xl bg-white dark:bg-[#0b1220]")}>
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-2 pt-0">
            <div className="min-w-0">
              <div className="text-[16px] font-semibold leading-none text-violet-700  dark:text-violet-200  mt-3">
                {TOOL_TITLES[activeTool]}
              </div>

              {TOOL_SUBTITLES[activeTool] && (
                <div className="mt-2 max-w-[560px]  leading-snug text-slate-500 dark:text-slate-400">
                  <p className="text-sm">{TOOL_SUBTITLES[activeTool]}</p>
                </div>
              )}
            </div>

            {/* close -> back to list */}
       
          </div>

          {/* Body */}
          <div className="px-2 pb-6 pt-4">
            <div className=" bg-white   dark:border-slate-800 dark:bg-[#0b1220]">
              {/* IMAGE GENERATOR (modal screenshot) */}
              {activeTool === "image" && (
                <>
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Image description
                  </div>

                  <div className="mt-3">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                      className={cn(
                        "min-h-[140px] resize-none rounded-xl",
                        "border-slate-200 bg-white text-slate-900",
                        "placeholder:text-slate-400 focus-visible:ring-0",
                        "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                      )}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      <span>Try to be descriptive for best results!</span>
                    </div>
                    <span>
                      {count}/{maxChars}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 text-sm font-medium",
                      "text-violet-700 hover:underline dark:text-violet-200"
                    )}
                    onClick={() => {}}
                  >
                    <Lightbulb className="h-4 w-4" />
                    See examples <ChevronRight className="h-4 w-4" />
                  </button>

                  <div className="mt-5 flex justify-center gap-2 items-center">
                    <Button
                      className={cn(
                        "rounded-md text-sm font-semibold w-36",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className="h-5 w-5" />
                      Create images
                    </Button>

                         <Button
                            variant="outline"
                            //   className={cn(
                            //     "rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                            //     "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100"
                            //   )}
                            className="w-36"
                            onClick={() => setActiveTool(null)}
                            aria-label="Close"
                            >
                         <X className="h-4 w-4" /> Close
                      </Button>

                  </div>

                  <Separator className="my-4 bg-slate-200 dark:bg-slate-800" />

                  <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    AI outputs may be misleading or inaccurate
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "mt-4 inline-flex items-center gap-2 text-sm",
                      "text-slate-600 hover:underline dark:text-slate-300"
                    )}
                    onClick={() => {}}
                  >
                    <SmilePlus className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <span>
                      <span className="text-violet-700 dark:text-violet-200">
                        Rate this feature.
                      </span>{" "}
                      Help us improve.
                    </span>
                  </button>
                </>
              )}

              {/* WRITER (screenshot) */}
              {activeTool === "writer" && (
                <>
                  <div className=" font-semibold text-slate-900 dark:text-slate-100">
                    <p className="text-sm"> Describe what you want to write</p>
                  </div>

                  <div className="mt-3">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                      className={cn(
                        "min-h-[160px] resize-none rounded-xl",
                        "border-slate-200 bg-white text-slate-900",
                        "placeholder:text-slate-400 focus-visible:ring-0",
                        "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                      )}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      <span>Try to be descriptive for best results!</span>
                    </div>
                    <span>
                      {count}/{maxChars}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 text-sm font-medium",
                      "text-violet-700 hover:underline dark:text-violet-200"
                    )}
                    onClick={() => {}}
                  >
                    <Lightbulb className="h-4 w-4" />
                    See examples <ChevronRight className="h-4 w-4" />
                  </button>

                  <div className="mt-6 flex justify-center items-center gap-2">
                    <Button
                      className={cn(
                        "w-36  rounded-md text-sm font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className=" h-5 w-5" />
                      Create text
                    </Button>


                      <Button
                            variant="outline"
                            //   className={cn(
                            //     "rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                            //     "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100"
                            //   )}
                            className="w-36"
                            onClick={() => setActiveTool(null)}
                            aria-label="Close"
                            >
                         <X className="h-4 w-4" /> Close
                      </Button>
                  </div>
                </>
              )}

              {/* PAGE GENERATOR (center button screenshot) */}
              {activeTool === "page" && (
                <>
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    <h5 className="text-gray-700 font-medium text-sm">Page description</h5>
                  </div>

                  <div className="mt-3">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                      className={cn(
                        "min-h-[160px] resize-none rounded-xl",
                        "border-slate-200 bg-white text-slate-900",
                        "placeholder:text-slate-400 focus-visible:ring-0",
                        "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                      )}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      <span>Try to be descriptive for best results!</span>
                    </div>
                    <span>
                      {count}/{maxChars}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 text-sm font-medium",
                      "text-violet-700 hover:underline dark:text-violet-200"
                    )}
                    onClick={() => {}}
                  >
                    <Lightbulb className="h-4 w-4" />
                    See examples <ChevronRight className="h-4 w-4" />
                  </button>

                  <div className="mt-8 flex justify-center">
                    {/* <Button
                      className={cn(
                        "h-12 rounded-xl px-8 text-base font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create page
                    </Button> */}

                     <div className="mt-6 flex justify-center items-center gap-2">
                    <Button
                      className={cn(
                        "w-36  rounded-md text-sm font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className=" h-5 w-5" />
                       Create page
                    </Button>


                      <Button
                            variant="outline"
                            //   className={cn(
                            //     "rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                            //     "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100"
                            //   )}
                            className="w-36"
                            onClick={() => setActiveTool(null)}
                            aria-label="Close"
                            >
                         <X className="h-4 w-4" /> Close
                      </Button>
                  </div>

                  </div>
                </>
              )}

              {/* SECTION GENERATOR (max 500) */}
              {activeTool === "section" && (
                <>
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    
                     <h5 className="text-gray-700 font-medium text-sm">Section description</h5>
                  </div>

                  <div className="mt-3">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                      className={cn(
                        "min-h-[160px] resize-none rounded-xl",
                        "border-slate-200 bg-white text-slate-900",
                        "placeholder:text-slate-400 focus-visible:ring-0",
                        "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                      )}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      <span>Try to be descriptive for best results!</span>
                    </div>
                    <span>
                      {count}/{maxChars}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 text-sm font-medium",
                      "text-violet-700 hover:underline dark:text-violet-200"
                    )}
                    onClick={() => {}}
                  >
                    <Lightbulb className="h-4 w-4" />
                    See examples <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* <div className="mt-8 flex justify-center">
                    <Button
                      className={cn(
                        "h-12 rounded-xl px-8 text-base font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create section
                    </Button>
                  </div> */}

                   <div className="mt-6 flex justify-center items-center gap-2">
                    <Button
                      className={cn(
                        "w-36  rounded-md text-sm font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className=" h-5 w-5" />
                      Create section
                    </Button>


                      <Button
                            variant="outline"
                            //   className={cn(
                            //     "rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                            //     "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100"
                            //   )}
                            className="w-36"
                            onClick={() => setActiveTool(null)}
                            aria-label="Close"
                            >
                         <X className="h-4 w-4" /> Close
                      </Button>
                  </div>

                </>
              )}

              {/* BLOG GENERATOR (two selects + textarea) */}
              {activeTool === "blog" && (
                <>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-slate-100">
                        Tone of voice
                      </Label>
                      <Select value={blogTone} onValueChange={setBlogTone}>
                        <SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {["Formal", "Friendly", "Professional", "Casual"].map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-slate-100">
                        Length of content
                      </Label>
                      <Select value={blogLen} onValueChange={setBlogLen}>
                        <SelectTrigger className="h-12 rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {["300–500 words", "500–800 words", "800–1200 words"].map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-sm font-medium text-gray-700 dark:text-slate-100">
                      Blog post description.
                    </div>

                    <div className="mt-3">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                        className={cn(
                          "min-h-[160px] resize-none rounded-xl",
                          "border-slate-200 bg-white text-slate-900",
                          "placeholder:text-slate-400 focus-visible:ring-0",
                          "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                        )}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                        <span>Try to be descriptive for best results!</span>
                      </div>
                      <span>
                        {count}/{maxChars}
                      </span>
                    </div>

                    {/* <div className="mt-8 flex justify-center">
                      <Button
                        className={cn(
                          "h-12 rounded-xl px-10 text-base font-semibold",
                          "bg-violet-600 hover:bg-violet-700 text-white"
                        )}
                        onClick={() => {}}
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Create content
                      </Button>
                    </div> */}



                    <div className="mt-6 flex justify-center items-center gap-2">
                    <Button
                      className={cn(
                        "w-36  rounded-md text-sm font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className=" h-5 w-5" />
                      Create content
                    </Button>


                      <Button
                            variant="outline"
                            className="w-36"
                            onClick={() => setActiveTool(null)}
                            aria-label="Close"
                            >
                         <X className="h-4 w-4" /> Close
                      </Button>
                  </div>

                  </div>
                </>
              )}

              {/* PRODUCT DETAILS GENERATOR */}
              {activeTool === "product_details" && (
                <>
                  <div >
                     <h5 className="text-gray-700 font-medium text-sm">Describe the product</h5>
                    
                  </div>

                  <div className="mt-3">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                      className={cn(
                        "min-h-[160px] resize-none rounded-xl",
                        "border-slate-200 bg-white text-slate-900",
                        "placeholder:text-slate-400 focus-visible:ring-0",
                        "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                      )}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      <span>Try to be descriptive for best results!</span>
                    </div>
                    <span>
                      {count}/{maxChars}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 text-sm font-medium",
                      "text-violet-700 hover:underline dark:text-violet-200"
                    )}
                    onClick={() => {}}
                  >
                    <Lightbulb className="h-4 w-4" />
                    See examples <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* <div className="mt-6">
                    <Button
                      className={cn(
                        "h-14 w-full rounded-xl text-lg font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create details
                    </Button>
                  </div> */}


                  <div className="mt-6 flex justify-center items-center gap-2">
                    <Button
                      className={cn(
                        "w-36  rounded-md text-sm font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                        onClick={() => {}}
                    >
                      <Sparkles className=" h-5 w-5" />
                        Create details
                    </Button>


                      <Button
                            variant="outline"
                            className="w-36"
                            onClick={() => setActiveTool(null)}
                            aria-label="Close"
                            >
                         <X className="h-4 w-4" /> Close
                      </Button>
                  </div>
                </>
              )}

              {/* SEO ASSISTANT (simple form-style, matches same pattern) */}
              {activeTool === "seo" && (
                <>
                  <div >
                    
                     <h5 className="text-gray-700 font-medium text-sm">Describe the page you want SEO for</h5>
                  </div>

                  <div className="mt-3">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                      className={cn(
                        "min-h-[160px] resize-none rounded-xl",
                        "border-slate-200 bg-white text-slate-900",
                        "placeholder:text-slate-400 focus-visible:ring-0",
                        "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500"
                      )}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      <span>Try to be descriptive for best results!</span>
                    </div>
                    <span>
                      {count}/{maxChars}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 text-sm font-medium",
                      "text-violet-700 hover:underline dark:text-violet-200"
                    )}
                    onClick={() => {}}
                  >
                    <Lightbulb className="h-4 w-4" />
                    See examples <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* <div className="mt-6">
                    <Button
                      className={cn(
                        "h-14 w-full rounded-xl text-lg font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                      onClick={() => {}}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate SEO
                    </Button>
                  </div> */}


                   <div className="mt-6 flex justify-center items-center gap-2">
                    <Button
                      className={cn(
                        "w-36  rounded-md text-sm font-semibold",
                        "bg-violet-600 hover:bg-violet-700 text-white"
                      )}
                        onClick={() => {}}
                    >
                      <Sparkles className=" h-5 w-5" />
                      Generate SEO
                    </Button>


                      <Button
                            variant="outline"
                            className="w-36"
                            onClick={() => setActiveTool(null)}
                            aria-label="Close"
                            >
                         <X className="h-4 w-4" /> Close
                      </Button>
                  </div>

                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
