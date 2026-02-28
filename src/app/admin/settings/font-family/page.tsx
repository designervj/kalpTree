"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type FontItem = {
  family: string;
  variants: string[];
  category?: string;
};

type TargetKey = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

const TARGETS: { key: TargetKey; label: string }[] = [
  { key: "h1", label: "H1" },
  { key: "h2", label: "H2" },
  { key: "h3", label: "H3" },
  { key: "h4", label: "H4" },
  { key: "h5", label: "H5" },
  { key: "h6", label: "H6" },
  { key: "p", label: "P" },
];

const STORAGE_KEY = "typography_font_map_v1";

function familyToQuery(family: string) {
  return family.trim().replace(/\s+/g, "+");
}

function googleFontsCssUrl(family: string, variants: string[]) {
  const weights = new Set<number>();

  for (const v of variants || []) {
    if (v === "regular") weights.add(400);
    else if (v === "italic") weights.add(400);
    else {
      const n = Number(String(v).replace("italic", ""));
      if (!Number.isNaN(n) && n > 0) weights.add(n);
    }
  }

  const w = [...weights].sort((a, b) => a - b);
  const weightParam = w.length ? `:wght@${w.join(";")}` : "";

  const fam = familyToQuery(family);
  return `https://fonts.googleapis.com/css2?family=${fam}${weightParam}&display=swap`;
}

function injectGoogleFontLink(href: string, id = "dynamic-google-font") {
  const existing = document.getElementById(id) as HTMLLinkElement | null;
  if (existing) {
    existing.href = href;
    return;
  }
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function googleFontsFamilyPage(family: string) {
  return `https://fonts.google.com/specimen/${familyToQuery(family)}`;
}

function makeFontStack(family: string) {
  return `"${family}", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif`;
}

function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

export default function FontFamilyPage() {
  const [loading, setLoading] = useState(true);
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // left search
  const [query, setQuery] = useState("");

  // active element (top boxes)
  const [activeTarget, setActiveTarget] = useState<TargetKey>("h1");

  // typography mapping (h1..p)
  const [fontMap, setFontMap] = useState<Record<TargetKey, string>>({
    h1: "",
    h2: "",
    h3: "",
    h4: "",
    h5: "",
    h6: "",
    p: "",
  });

  // preview input
  const [previewText, setPreviewText] = useState(
    "Whereas recognition of the inherent dignity"
  );

  // style preview controls
  const [px, setPx] = useState<number>(38);
  const [opticalOn, setOpticalOn] = useState<boolean>(true);

  // copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load fonts + restore saved fontMap
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/google-fonts?sort=popularity");
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error || "Failed to fetch fonts");

        const items: FontItem[] = json.items || [];
        if (!mounted) return;

        setFonts(items);

        const first = items?.[0]?.family || "Inter";

        // restore saved font map (if any)
        const saved = safeParse<Record<TargetKey, string>>(
          typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
        );

        const nextMap: Record<TargetKey, string> = {
          h1: saved?.h1 || first,
          h2: saved?.h2 || first,
          h3: saved?.h3 || first,
          h4: saved?.h4 || first,
          h5: saved?.h5 || first,
          h6: saved?.h6 || first,
          p: saved?.p || first,
        };

        setFontMap(nextMap);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load fonts");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);


  // Helper: get FontItem by family
  const fontByFamily = useMemo(() => {
    const map = new Map<string, FontItem>();
    for (const f of fonts) map.set(f.family, f);
    return map;
  }, [fonts]);

  // Filter left list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fonts.slice(0, 60);
    return fonts.filter((f) => f.family.toLowerCase().includes(q)).slice(0, 100);
  }, [fonts, query]);

  console.log("filtered", filtered)
  // Current active family
  const activeFamily = fontMap[activeTarget] || "";

  // Current active font item
  const activeFontItem = useMemo(() => {
    if (!activeFamily) return null;
    return fontByFamily.get(activeFamily) || null;
  }, [activeFamily, fontByFamily]);

  // Inject fonts for ALL relevant families (so previews render)
  useEffect(() => {
    if (!fonts.length) return;

    const selectedFamilies = new Set(Object.values(fontMap).filter(Boolean));
    const listFamilies = filtered.map((f) => f.family);
    const allToLoad = Array.from(new Set([...selectedFamilies, ...listFamilies]));

    allToLoad.forEach((family) => {
      const item = fontByFamily.get(family);
      if (!item) return;

      const isSelected = selectedFamilies.has(family);
      // For listed items, we only need regular weight to show the name.
      // For selected items, we need all variants for the styles preview.
      const href = isSelected
        ? googleFontsCssUrl(item.family, item.variants)
        : googleFontsCssUrl(item.family, ["regular"]);

      const id = `gf_${familyToQuery(family)}`;
      injectGoogleFontLink(href, id);
    });
  }, [fontMap, filtered, fonts.length, fontByFamily]);

  // Save to localStorage whenever map changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ready = Object.values(fontMap).every(Boolean);
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fontMap));
  }, [fontMap]);

  // ✅ Apply to :root (global save) using CSS variables
  const rootCss = useMemo(() => {
    const toVar = (k: TargetKey) => `--font-${k}`;
    const lines = TARGETS.map(({ key }) => {
      const fam = fontMap[key] ? makeFontStack(fontMap[key]) : "inherit";
      return `  ${toVar(key)}: ${fam};`;
    }).join("\n");

    return `:root {\n${lines}\n}\n\n/* Example usage (optional):
h1 { font-family: var(--font-h1); }
p  { font-family: var(--font-p);  }
*/`;
  }, [fontMap]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let style = document.getElementById("typography-root-vars") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "typography-root-vars";
      document.head.appendChild(style);
    }
    style.textContent = rootCss;
  }, [rootCss]);

  // Preview style helpers
  const styleFor = (k: TargetKey): React.CSSProperties => {
    const family = fontMap[k];
    if (!family) return {};
    return { fontFamily: `var(--font-${k})` };
  };

  // snippets
  const activeCssHref = useMemo(() => {
    if (!activeFontItem) return "";
    return googleFontsCssUrl(activeFontItem.family, activeFontItem.variants);
  }, [activeFontItem]);

  async function copy(text: string, k: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(k);
      window.setTimeout(() => setCopiedKey(null), 1200);
    } catch { }
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-5">
        <BreadCrumbPage />
        <p className="mt-1 text-sm text-muted-foreground">
          Pick fonts for H1–H6 and P, preview styles, and save to :root.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading Google Fonts…
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">
              {error}
              <div className="mt-2 text-xs text-muted-foreground">
                Check: <span className="font-mono">GOOGLE_FONTS_API_KEY</span> in{" "}
                <span className="font-mono">.env.local</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* ✅ TOP RED BOXES AREA (H1..P target buttons) */}
              <div className="flex flex-wrap gap-2 rounded-2xl border p-3">
                {TARGETS.map((t) => {
                  const active = t.key === activeTarget;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setActiveTarget(t.key)}
                      className={cn(
                        "h-10 rounded-xl border px-4 text-sm font-medium transition cursor-pointer",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted/40"
                      )}
                      title={`Edit ${t.label} font`}
                    >
                      {t.label}
                      <span
                        className={cn(
                          "h-10 rounded-xl px-2 text-sm font-medium transition",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted/40"
                        )}
                        style={fontMap[t.key] ? { fontFamily: makeFontStack(fontMap[t.key]) } : {}}
                      >
                        {fontMap[t.key] ? fontMap[t.key] : "—"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Preview input */}
              <Input
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Type here to preview text"
                className="h-11 rounded-full px-5"
              />

              {/* Left list + Right panel */}
              <div className="grid gap-3 md:grid-cols-[1fr_1.4fr]">
                {/* LEFT */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Search font family (applies to {activeTarget.toUpperCase()})
                  </Label>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search… e.g. Inter, Montserrat, Poppins"
                    className="h-11 rounded-xl"
                  />

                  <div className="max-h-[360px] overflow-auto rounded-2xl border">
                    {filtered.map((f) => {
                      const isActive = f.family === activeFamily;
                      return (
                        <button
                          key={f.family}
                          onClick={() =>
                            setFontMap((prev) => ({
                              ...prev,
                              [activeTarget]: f.family,
                            }))
                          }
                          className={cn(
                            "w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-muted/50",
                            isActive && "bg-muted"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div
                                className="truncate text-sm font-medium"
                                style={{ fontFamily: makeFontStack(f.family) }}
                              >
                                {f.family}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {f.category || "category"} •{" "}
                                {f.variants?.length || 0} variants
                              </div>
                            </div>
                            {isActive ? (
                              <span className="text-xs text-muted-foreground">
                                Selected
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-muted-foreground">
                    Showing {filtered.length} results{" "}
                    {query ? "(filtered)" : "(top by popularity)"}
                  </div>
                </div>

                <Card className="rounded-2xl">
                  <CardContent className="p-0">
                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Styles</div>
                          <div className="text-xs text-muted-foreground">
                            Preview: {activeTarget.toUpperCase()} • {activeFamily || "—"}
                          </div>
                        </div>
                        <div className="rounded-full border px-2 py-1 text-xs text-muted-foreground">
                          {px}px
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="divide-y">
                      <div className="px-5 py-5">
                        <div className="text-xs text-muted-foreground">
                          Regular 400
                        </div>
                        <div
                          className="mt-3 leading-tight"
                          style={{
                            fontFamily: `var(--font-${activeTarget})`,
                            fontSize: px,
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                        >
                          {previewText}
                        </div>
                      </div>

                      <div className="px-5 py-5">
                        <div className="text-xs text-muted-foreground">
                          Regular 400 Italic
                        </div>
                        <div
                          className="mt-3 leading-tight"
                          style={{
                            fontFamily: `var(--font-${activeTarget})`,
                            fontSize: px,
                            fontWeight: 400,
                            fontStyle: "italic",
                          }}
                        >
                          {previewText}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          Note: if italic variant not available, browser will fake-italic.
                        </div>
                      </div>

                      <div className="px-5 py-5">
                        <div className="text-xs text-muted-foreground">
                          Medium 500
                        </div>
                        <div
                          className="mt-3 leading-tight"
                          style={{
                            fontFamily: `var(--font-${activeTarget})`,
                            fontSize: px,
                            fontWeight: 500,
                            fontStyle: "normal",
                          }}
                        >
                          {previewText}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>



              </div>

              <div className="grid gap-3 md:grid-cols-[1.8fr_1fr]">

                {/* RIGHT */}
                <div className="space-y-3">
                  {/* ✅ Styles panel FIRST (as you asked) */}
                  <div className="rounded-2xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">
                          Styles (active: {activeTarget.toUpperCase()})
                        </div>
                        <div
                          className="truncate text-base font-semibold"
                          style={activeFamily ? { fontFamily: makeFontStack(activeFamily) } : {}}
                        >
                          {activeFamily || "—"}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Use slider to preview size in the “Styles” card below.
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => {
                          if (!activeFamily) return;
                          window.open(
                            googleFontsFamilyPage(activeFamily),
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        disabled={!activeFamily}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center gap-3">
                      <div className="w-[110px]">
                        <Label className="text-xs text-muted-foreground">
                          Size
                        </Label>
                        <div className="mt-2 rounded-xl border px-3 py-2 text-sm">
                          {px}px
                        </div>
                      </div>

                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">
                          Font size slider
                        </Label>
                        <Slider
                          value={[px]}
                          onValueChange={(v) => setPx(v?.[0] ?? 38)}
                          min={12}
                          max={96}
                          step={1}
                          className="py-4"
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between rounded-2xl border px-4 py-3">
                      <div>
                        <div className="text-sm font-medium">Optical Size</div>
                        <div className="text-xs text-muted-foreground">
                          UI toggle (optional)
                        </div>
                      </div>
                      <Switch checked={opticalOn} onCheckedChange={setOpticalOn} />
                    </div>
                  </div>

                  {/* ✅ Selected family section MOVED DOWN (as you asked) */}
                  <div className="rounded-2xl border p-4">
                    <div className="text-xs font-medium text-muted-foreground">
                      Selected family (active target)
                    </div>

                    <div className="mt-2 rounded-xl bg-muted p-3 text-xs font-mono break-all">
                      {activeCssHref
                        ? `<link rel="stylesheet" href="${activeCssHref}" />`
                        : "—"}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() =>
                          copy(
                            `<link rel="stylesheet" href="${activeCssHref}" />`,
                            "active_link"
                          )
                        }
                        disabled={!activeCssHref}
                      >
                        {copiedKey === "active_link" ? (
                          <Check className="mr-2 h-4 w-4" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copy
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() =>
                          copy(`@import url("${activeCssHref}");`, "active_import")
                        }
                        disabled={!activeCssHref}
                      >
                        {copiedKey === "active_import" ? (
                          <Check className="mr-2 h-4 w-4" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copy @import
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    {/* ✅ ROOT SAVE OUTPUT */}
                    <div className="text-xs font-medium text-muted-foreground">
                      Saved in :root (auto) – CSS variables
                    </div>
                    <div className="mt-2 rounded-xl bg-muted p-3 text-xs font-mono whitespace-pre-wrap">
                      {rootCss}
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => copy(rootCss, "root_css")}
                      >
                        {copiedKey === "root_css" ? (
                          <Check className="mr-2 h-4 w-4" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copy :root CSS
                      </Button>
                    </div>
                  </div>
                </div>



                <div className="grid gap-4">

                  <Card className="rounded-2xl">
                    <CardContent className="p-5 space-y-3">
                      <div className="text-xs font-medium text-muted-foreground">
                        Heading previews (uses :root vars)
                      </div>

                      <h1 className="text-3xl font-semibold" style={styleFor("h1")}>
                        H1 – {fontMap.h1}
                      </h1>
                      <h2 className="text-2xl font-semibold" style={styleFor("h2")}>
                        H2 – {fontMap.h2}
                      </h2>
                      <h3 className="text-xl font-semibold" style={styleFor("h3")}>
                        H3 – {fontMap.h3}
                      </h3>
                      <h4 className="text-lg font-semibold" style={styleFor("h4")}>
                        H4 – {fontMap.h4}
                      </h4>
                      <h5 className="text-base font-semibold" style={styleFor("h5")}>
                        H5 – {fontMap.h5}
                      </h5>
                      <h6 className="text-sm font-semibold" style={styleFor("h6")}>
                        H6 – {fontMap.h6}
                      </h6>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardContent className="p-5">
                      <div className="text-xs font-medium text-muted-foreground">
                        Paragraph preview
                      </div>
                      <p className="mt-3 text-base leading-7" style={styleFor("p")}>
                        P – ({fontMap.p}) • Select fonts for each element from the
                        top buttons. Changes are saved to :root and persisted in
                        localStorage.
                      </p>
                    </CardContent>
                  </Card>
                </div>

              </div>


              {/* ✅ H1..P preview (shows real mapping) */}

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}