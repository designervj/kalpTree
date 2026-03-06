"use client";

import * as React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  LayoutGrid,
  Link as LinkIcon,
  Image as ImageIcon,
  Star,
  ChevronDown,
} from "lucide-react";

/* -------------------------------------------
   Types (robust mega menu model)
------------------------------------------- */

type BadgeVariant = "blue" | "red" | "green" | "violet" | "slate";
type TriggerMode = "hover" | "click";
type AnimationMode = "fade" | "fade-in-up" | "scale" | "none";
type ContainerWidth = "container" | "full" | "wide" | "custom";

type NavItemType = "standard" | "mega";

type MegaLayoutPreset =
  | "featured-grid"
  | "category-columns"
  | "image-grid"
  | "mixed"
  | "simple";

type ColumnWidth = "1/4" | "1/3" | "1/2" | "2/3" | "full";
type ColumnType =
  | "link-list"
  | "featured-card"
  | "banner"
  | "image-grid"
  | "icon-list";

type NavBadge = { text: string; variant: BadgeVariant };

type MegaLink = {
  id: string;
  label: string;
  href: string;
  description?: string;
  isBold?: boolean;
  badge?: NavBadge;
  icon?: string; // optional for future
};

type MegaSection = {
  id: string;
  title?: string;
  titleHref?: string;
  description?: string;
  links: MegaLink[];
};

type FeaturedCard = {
  image: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  overlayPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  aspectRatio?: "square" | "video" | "portrait";
};

type ImageGridItem = {
  id: string;
  title: string;
  href: string;
  image: string;
  subtitle?: string;
  badge?: NavBadge;
};

type MegaColumn = {
  id: string;
  columnWidth: ColumnWidth;
  type: ColumnType;

  // link-list
  sections?: MegaSection[];

  // featured-card
  featuredCard?: FeaturedCard;

  // image-grid (future ready)
  imageGrid?: { items: ImageGridItem[]; columns?: 2 | 3; };

  // banner/icon-list etc can be added later
};

type MegaMenuSettings = {
  layout: MegaLayoutPreset;
  containerWidth: ContainerWidth;
  containerMaxWidthPx?: number; // if custom
  animation: AnimationMode;
  trigger: TriggerMode;
  openDelayMs?: number;
  closeDelayMs?: number;
  showBackdrop?: boolean;

  // optional: accessibility / mobile behavior
  mobileBehavior?: "accordion" | "drawer" | "native";
  columns: MegaColumn[];
};

type NavigationItem = {
  id: string;
  label: string;
  href: string;
  type: NavItemType;
  icon?: string;
  badge?: NavBadge;

  megaMenuSettings?: MegaMenuSettings;
};

type HeaderConfig = { navigation: NavigationItem[] };

/* -------------------------------------------
   Helpers
------------------------------------------- */

const uid = () => Math.random().toString(36).slice(2, 10);

function moveItem<T>(arr: T[], from: number, to: number) {
  const next = [...arr];
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}

function badgeClass(v?: BadgeVariant) {
  const base = "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold";
  switch (v) {
    case "red":
      return `${base} bg-rose-50 text-rose-700`;
    case "green":
      return `${base} bg-emerald-50 text-emerald-700`;
    case "violet":
      return `${base} bg-violet-50 text-violet-700`;
    case "blue":
      return `${base} bg-sky-50 text-sky-700`;
    default:
      return `${base} bg-slate-100 text-slate-700`;
  }
}

/* -------------------------------------------
   Sample config (your JSON + robust defaults)
------------------------------------------- */

const SAMPLE_HEADER: HeaderConfig = {
  navigation: [
    {
      id: "nav-101",
      label: "Products",
      href: "/products",
      type: "mega",
      icon: "Package",
      badge: { text: "New", variant: "blue" },
      megaMenuSettings: {
        layout: "featured-grid",
        containerWidth: "container",
        animation: "fade-in-up",
        trigger: "hover",
        openDelayMs: 80,
        closeDelayMs: 120,
        showBackdrop: false,
        mobileBehavior: "accordion",
        columns: [
          {
            id: "col-1",
            columnWidth: "1/4",
            type: "link-list",
            sections: [
              {
                id: "sec-1",
                title: "Men's Apparel",
                titleHref: "/mens",
                links: [
                  {
                    id: "lnk-1",
                    label: "T-Shirts",
                    href: "/mens/t-shirts",
                    isBold: false,
                    badge: { text: "Sale", variant: "red" },
                    description: "Premium cotton tees",
                  },
                  { id: "lnk-2", label: "Jackets", href: "/mens/jackets", isBold: true },
                ],
              },
              {
                id: "sec-2",
                title: "Accessories",
                links: [
                  { id: "lnk-3", label: "Watches", href: "/accessories/watches" },
                  { id: "lnk-4", label: "Belts", href: "/accessories/belts" },
                ],
              },
            ],
          },
          {
            id: "col-2",
            columnWidth: "1/4",
            type: "link-list",
            sections: [
              {
                id: "sec-3",
                title: "Women's Apparel",
                links: [
                  { id: "lnk-5", label: "Dresses", href: "/womens/dresses" },
                  { id: "lnk-6", label: "Skirts", href: "/womens/skirts" },
                ],
              },
            ],
          },
          {
            id: "col-3",
            columnWidth: "1/2",
            type: "featured-card",
            featuredCard: {
              image: "/images/promo-summer.jpg",
              title: "Summer Collection 2026",
              description: "Discover our latest seasonal drops with sustainable materials.",
              ctaLabel: "Shop Collection",
              ctaHref: "/collections/summer",
              overlayPosition: "bottom-left",
              aspectRatio: "video",
            },
          },
        ],
      },
    },
    {
      id: "nav-102",
      label: "About Us",
      href: "/about",
      type: "standard",
      icon: "Info",
    },
    {
      id: "nav-103",
      label: "Resources",
      href: "/resources",
      type: "mega",
      badge: { text: "Hot", variant: "violet" },
      megaMenuSettings: {
        layout: "mixed",
        containerWidth: "wide",
        animation: "fade",
        trigger: "click",
        openDelayMs: 0,
        closeDelayMs: 0,
        showBackdrop: true,
        mobileBehavior: "drawer",
        columns: [
          {
            id: "col-r1",
            columnWidth: "1/3",
            type: "link-list",
            sections: [
              {
                id: "sec-r1",
                title: "Learn",
                links: [
                  { id: "lnk-r11", label: "Guides", href: "/resources/guides", description: "Step-by-step articles" },
                  { id: "lnk-r12", label: "Tutorials", href: "/resources/tutorials" },
                ],
              },
              {
                id: "sec-r2",
                title: "Company",
                links: [
                  { id: "lnk-r21", label: "Case Studies", href: "/resources/case-studies", isBold: true },
                  { id: "lnk-r22", label: "Changelog", href: "/resources/changelog" },
                ],
              },
            ],
          },
          {
            id: "col-r2",
            columnWidth: "2/3",
            type: "image-grid",
            imageGrid: {
              columns: 3,
              items: [
                { id: "img-1", title: "2026 Trends", href: "/resources/trends-2026", image: "/images/tile-1.jpg", subtitle: "Popular picks", badge: { text: "New", variant: "blue" } },
                { id: "img-2", title: "Exterior Playbook", href: "/resources/playbook", image: "/images/tile-2.jpg", subtitle: "Best practices" },
                { id: "img-3", title: "Color Academy", href: "/resources/colors", image: "/images/tile-3.jpg", subtitle: "Learn palettes", badge: { text: "Pro", variant: "green" } },
              ],
            },
          },
        ],
      },
    },
  ],
};

/* -------------------------------------------
   HTML Generator (optional - for your builder)
------------------------------------------- */

function generateMegaMenuHtml(item: NavigationItem) {
  if (item.type !== "mega" || !item.megaMenuSettings) return "";

  const s = item.megaMenuSettings;
  const container =
    s.containerWidth === "full"
      ? "w-screen"
      : s.containerWidth === "wide"
        ? "max-w-6xl mx-auto"
        : s.containerWidth === "custom"
          ? `max-w-[${s.containerMaxWidthPx || 1100}px] mx-auto`
          : "max-w-5xl mx-auto";

  const anim =
    s.animation === "fade-in-up"
      ? "animate-[fadeInUp_.18s_ease-out]"
      : s.animation === "fade"
        ? "animate-[fadeIn_.15s_ease-out]"
        : s.animation === "scale"
          ? "animate-[scaleIn_.12s_ease-out]"
          : "";

  const colClass = (w: ColumnWidth) => {
    if (w === "1/4") return "md:col-span-3 col-span-12";
    if (w === "1/3") return "md:col-span-4 col-span-12";
    if (w === "1/2") return "md:col-span-6 col-span-12";
    if (w === "2/3") return "md:col-span-8 col-span-12";
    return "col-span-12";
  };

  const cols = (s.columns || [])
    .map((c) => {
      if (c.type === "featured-card" && c.featuredCard) {
        const fc = c.featuredCard;
        return `
<div class="${colClass(c.columnWidth)}">
  <a href="${fc.ctaHref || "#"}" class="block overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/5">
    <div class="aspect-video w-full bg-slate-100" style="background-image:url('${fc.image}'); background-size:cover; background-position:center;"></div>
    <div class="p-4">
      <div class="text-base font-semibold text-slate-900">${fc.title}</div>
      ${fc.description ? `< div class="mt-1 text-sm text-slate-600" >${fc.description}</div > ` : ""}
      ${fc.ctaLabel ? `< div class="mt-3 inline-flex rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white" >${fc.ctaLabel}</div > ` : ""}
    </div>
  </a>
</div>`;
      }

      if (c.type === "image-grid" && c.imageGrid) {
        const gridCols = c.imageGrid.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
        const tiles = (c.imageGrid.items || [])
          .map((it) => {
            return `
<a href="${it.href}" class="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
  <div class="aspect-video bg-slate-100" style="background-image:url('${it.image}'); background-size:cover; background-position:center;"></div>
  <div class="p-3">
    <div class="flex items-center justify-between gap-2">
      <div class="text-sm font-semibold text-slate-900">${it.title}</div>
      ${it.badge ? `< span class="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold" >${it.badge.text}</span > ` : ""}
    </div>
    ${it.subtitle ? `< div class="mt-1 text-xs text-slate-500" >${it.subtitle}</div > ` : ""}
  </div>
</a>`;
          })
          .join("");

        return `
<div class="${colClass(c.columnWidth)}">
  <div class="grid grid-cols-1 ${gridCols} gap-3">${tiles}</div>
</div>`;
      }

      // link-list default
      const sections = (c.sections || [])
        .map((sec) => {
          const links = (sec.links || [])
            .map(
              (l) => `
<a href="${l.href}" class="group flex items-start justify-between gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
  <div>
    <div class="text-sm ${l.isBold ? "font-semibold" : "font-medium"} text-slate-900">${l.label}</div>
    ${l.description ? `< div class= "text-xs text-slate-500" >${l.description}</div > ` : ""}
  </div>
  ${l.badge ? `< span class= "rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold" >${l.badge.text}</span > ` : ""}
</a>`
            )
            .join("");

          return `
<div class="space-y-1">
  ${sec.title
              ? `< a href = "${sec.titleHref || "#"}" class="text-sm font-semibold text-slate-900 hover:underline" >${sec.title}</a > `
              : ""
            }
  ${sec.description ? `< div class="text-xs text-slate-500" >${sec.description}</div > ` : ""}
  <div class="mt-1 space-y-1">${links}</div>
</div>`;
        })
        .join("");

      return `
<div class="${colClass(c.columnWidth)}">
  <div class="space-y-6">${sections}</div>
</div>`;
    })
    .join("");

  return `
<div class="${anim} ${container} p-5">
  <div class="grid grid-cols-12 gap-4">
    ${cols}
  </div>
</div>
`.trim();
}

/* -------------------------------------------
   Admin Editor
------------------------------------------- */

function LayoutCard({
  title,
  desc,
  active,
  onClick,
  icon,
}: {
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-3 text-left transition",
        active ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className={["mt-0.5", active ? "text-violet-700" : "text-slate-700"].join(" ")}>
          {icon}
        </div>
        <div>
          <div className={["text-sm font-semibold", active ? "text-violet-800" : "text-slate-900"].join(" ")}>
            {title}
          </div>
          <div className={["text-xs", active ? "text-violet-700" : "text-slate-500"].join(" ")}>
            {desc}
          </div>
        </div>
      </div>
    </button>
  );
}

function ColumnIcon({ type }: { type: ColumnType }) {
  if (type === "featured-card") return <Star className="h-4 w-4" />;
  if (type === "image-grid") return <ImageIcon className="h-4 w-4" />;
  return <LinkIcon className="h-4 w-4" />;
}

export function AdminMegaMenuSettings() {
  const [config, setConfig] = React.useState<HeaderConfig>(SAMPLE_HEADER);
  const [activeNavId, setActiveNavId] = React.useState<string>(config.navigation[0]?.id ?? "");
  const active = config.navigation.find((n) => n.id === activeNavId);

  const updateNav = (navId: string, patch: Partial<NavigationItem>) => {
    setConfig((p) => ({
      ...p,
      navigation: p.navigation.map((n) => (n.id === navId ? { ...n, ...patch } : n)),
    }));
  };

  const updateMega = (navId: string, patch: Partial<MegaMenuSettings>) => {
    setConfig((p) => ({
      ...p,
      navigation: p.navigation.map((n) => {
        if (n.id !== navId) return n;
        if (n.type !== "mega") return n;
        return {
          ...n,
          megaMenuSettings: { ...(n.megaMenuSettings as MegaMenuSettings), ...patch },
        };
      }),
    }));
  };

  const addColumn = (navId: string) => {
    if (!active?.megaMenuSettings) return;
    const newCol: MegaColumn = {
      id: uid(),
      columnWidth: "1/4",
      type: "link-list",
      sections: [
        {
          id: uid(),
          title: "New Section",
          links: [{ id: uid(), label: "New link", href: "/", description: "" }],
        },
      ],
    };
    updateMega(navId, { columns: [...active.megaMenuSettings.columns, newCol] });
  };

  const removeColumn = (navId: string, colId: string) => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, { columns: active.megaMenuSettings.columns.filter((c) => c.id !== colId) });
  };

  const moveColumn = (navId: string, colId: string, dir: "up" | "down") => {
    if (!active?.megaMenuSettings) return;
    const idx = active.megaMenuSettings.columns.findIndex((c) => c.id === colId);
    if (idx < 0) return;
    const to = dir === "up" ? idx - 1 : idx + 1;
    if (to < 0 || to >= active.megaMenuSettings.columns.length) return;
    updateMega(navId, { columns: moveItem(active.megaMenuSettings.columns, idx, to) });
  };

  const updateColumn = (navId: string, colId: string, patch: Partial<MegaColumn>) => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, {
      columns: active.megaMenuSettings.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)),
    });
  };

  const addSection = (navId: string, colId: string) => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, {
      columns: active.megaMenuSettings.columns.map((c) => {
        if (c.id !== colId) return c;
        const sections = c.sections || [];
        return {
          ...c,
          sections: [...sections, { id: uid(), title: "New Section", links: [] }],
        };
      }),
    });
  };

  const removeSection = (navId: string, colId: string, secId: string) => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, {
      columns: active.megaMenuSettings.columns.map((c) => {
        if (c.id !== colId) return c;
        return { ...c, sections: (c.sections || []).filter((s) => s.id !== secId) };
      }),
    });
  };

  const moveSection = (navId: string, colId: string, secId: string, dir: "up" | "down") => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, {
      columns: active.megaMenuSettings.columns.map((c) => {
        if (c.id !== colId) return c;
        const secs = c.sections || [];
        const idx = secs.findIndex((s) => s.id === secId);
        if (idx < 0) return c;
        const to = dir === "up" ? idx - 1 : idx + 1;
        if (to < 0 || to >= secs.length) return c;
        return { ...c, sections: moveItem(secs, idx, to) };
      }),
    });
  };

  const updateSection = (navId: string, colId: string, secId: string, patch: Partial<MegaSection>) => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, {
      columns: active.megaMenuSettings.columns.map((c) => {
        if (c.id !== colId) return c;
        return {
          ...c,
          sections: (c.sections || []).map((s) => (s.id === secId ? { ...s, ...patch } : s)),
        };
      }),
    });
  };

  const addLink = (navId: string, colId: string, secId: string) => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, {
      columns: active.megaMenuSettings.columns.map((c) => {
        if (c.id !== colId) return c;
        return {
          ...c,
          sections: (c.sections || []).map((s) => {
            if (s.id !== secId) return s;
            return {
              ...s,
              links: [...(s.links || []), { id: uid(), label: "New Link", href: "/", description: "" }],
            };
          }),
        };
      }),
    });
  };

  const removeLink = (navId: string, colId: string, secId: string, linkId: string) => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, {
      columns: active.megaMenuSettings.columns.map((c) => {
        if (c.id !== colId) return c;
        return {
          ...c,
          sections: (c.sections || []).map((s) => {
            if (s.id !== secId) return s;
            return { ...s, links: (s.links || []).filter((l) => l.id !== linkId) };
          }),
        };
      }),
    });
  };

  const updateLink = (
    navId: string,
    colId: string,
    secId: string,
    linkId: string,
    patch: Partial<MegaLink>
  ) => {
    if (!active?.megaMenuSettings) return;
    updateMega(navId, {
      columns: active.megaMenuSettings.columns.map((c) => {
        if (c.id !== colId) return c;
        return {
          ...c,
          sections: (c.sections || []).map((s) => {
            if (s.id !== secId) return s;
            return {
              ...s,
              links: (s.links || []).map((l) => (l.id === linkId ? { ...l, ...patch } : l)),
            };
          }),
        };
      }),
    });
  };

  const exportHtml = active ? generateMegaMenuHtml(active) : "";

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">Mega Menu Settings</div>
          <div className="text-sm text-slate-500">Configure layouts, columns, sections, and promos.</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9">Reset</Button>
          <Button className="h-9 bg-violet-600 hover:bg-violet-700">Save changes</Button>
        </div>
      </div>

      <div className="grid h-[560px] grid-cols-12">
        {/* Left nav */}
        <aside className="col-span-4 border-r border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 text-sm font-semibold text-slate-900">Navigation Items</div>

          <div className="space-y-2">
            {config.navigation.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setActiveNavId(n.id)}
                className={[
                  "w-full rounded-xl border px-3 py-3 text-left transition",
                  n.id === activeNavId
                    ? "border-violet-200 bg-white shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">{n.label}</div>
                  <span className={n.type === "mega" ? badgeClass("violet") : badgeClass("slate")}>
                    {n.type === "mega" ? "Mega" : "Standard"}
                  </span>
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {n.href}
                  {n.type === "mega" && n.megaMenuSettings
                    ? ` • ${n.megaMenuSettings.layout} • ${n.megaMenuSettings.columns.length} cols`
                    : ""}
                </div>
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="text-xs text-slate-500 leading-relaxed">
            Tip: only items with <span className="font-semibold">type = mega</span> show mega menu settings.
          </div>
        </aside>

        {/* Editor */}
        <main className="col-span-8 p-4 overflow-auto">
          {!active || active.type !== "mega" || !active.megaMenuSettings ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Select a <span className="font-semibold">Mega</span> nav item to edit mega menu settings.
            </div>
          ) : (
            <>
              {/* Top settings */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-900">Behavior</div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-slate-600">Trigger</div>
                      <Select
                        value={active.megaMenuSettings.trigger}
                        onValueChange={(v) => updateMega(active.id, { trigger: v as TriggerMode })}
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hover">Hover</SelectItem>
                          <SelectItem value="click">Click</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-slate-600">Animation</div>
                      <Select
                        value={active.megaMenuSettings.animation}
                        onValueChange={(v) => updateMega(active.id, { animation: v as AnimationMode })}
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Animation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fade-in-up">Fade in up</SelectItem>
                          <SelectItem value="fade">Fade</SelectItem>
                          <SelectItem value="scale">Scale</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-slate-600">Container Width</div>
                      <Select
                        value={active.megaMenuSettings.containerWidth}
                        onValueChange={(v) => updateMega(active.id, { containerWidth: v as ContainerWidth })}
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Width" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="container">Container</SelectItem>
                          <SelectItem value="wide">Wide</SelectItem>
                          <SelectItem value="full">Full width</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-slate-600">Open delay (ms)</div>
                      <Input
                        className="h-10 rounded-xl"
                        value={String(active.megaMenuSettings.openDelayMs ?? 0)}
                        onChange={(e) => updateMega(active.id, { openDelayMs: Number(e.target.value || 0) })}
                      />
                    </div>

                    <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                      <div className="text-sm font-semibold text-slate-900">Backdrop</div>
                      <Switch
                        checked={!!active.megaMenuSettings.showBackdrop}
                        onCheckedChange={(v) => updateMega(active.id, { showBackdrop: v })}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-900">Layout preset</div>

                  <div className="grid grid-cols-2 gap-2">
                    <LayoutCard
                      title="Featured Grid"
                      desc="Links + promo card"
                      active={active.megaMenuSettings.layout === "featured-grid"}
                      onClick={() => updateMega(active.id, { layout: "featured-grid" })}
                      icon={<Star className="h-4 w-4" />}
                    />
                    <LayoutCard
                      title="Category Columns"
                      desc="3–5 link columns"
                      active={active.megaMenuSettings.layout === "category-columns"}
                      onClick={() => updateMega(active.id, { layout: "category-columns" })}
                      icon={<LayoutGrid className="h-4 w-4" />}
                    />
                    <LayoutCard
                      title="Image Grid"
                      desc="Tiles with images"
                      active={active.megaMenuSettings.layout === "image-grid"}
                      onClick={() => updateMega(active.id, { layout: "image-grid" })}
                      icon={<ImageIcon className="h-4 w-4" />}
                    />
                    <LayoutCard
                      title="Mixed"
                      desc="Links + tiles + promos"
                      active={active.megaMenuSettings.layout === "mixed"}
                      onClick={() => updateMega(active.id, { layout: "mixed" })}
                      icon={<ChevronDown className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </div>

              {/* Columns */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Columns</div>
                    <div className="text-xs text-slate-500">
                      Each column can be a link list, featured card, or image grid.
                    </div>
                  </div>
                  <Button variant="outline" className="h-10 rounded-xl" onClick={() => addColumn(active.id)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Column
                  </Button>
                </div>

                <div className="p-4 space-y-3">
                  {active.megaMenuSettings.columns.map((col, colIdx) => (
                    <div key={col.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700">
                            <ColumnIcon type={col.type} />
                          </span>
                          <div className="text-sm font-semibold text-slate-900">
                            Column {colIdx + 1}
                          </div>
                          <span className={badgeClass("slate")}>{col.type}</span>
                          <span className={badgeClass("slate")}>{col.columnWidth}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9"
                            disabled={colIdx === 0}
                            onClick={() => moveColumn(active.id, col.id, "up")}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9"
                            // disabled={colIdx === active.megaMenuSettings.columns.length - 1}
                            onClick={() => moveColumn(active.id, col.id, "down")}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="h-9 w-9 bg-rose-50 text-rose-700 hover:bg-rose-100"
                            onClick={() => removeColumn(active.id, col.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-slate-600">Column type</div>
                          <Select
                            value={col.type}
                            onValueChange={(v) => {
                              const nextType = v as ColumnType;

                              // normalize payload when switching types
                              if (nextType === "featured-card") {
                                updateColumn(active.id, col.id, {
                                  type: nextType,
                                  featuredCard:
                                    col.featuredCard ??
                                    ({
                                      image: "/images/promo.jpg",
                                      title: "Featured",
                                      description: "",
                                      ctaLabel: "Explore",
                                      ctaHref: "/",
                                      overlayPosition: "bottom-left",
                                      aspectRatio: "video",
                                    } as FeaturedCard),
                                  sections: undefined,
                                  imageGrid: undefined,
                                });
                                return;
                              }

                              if (nextType === "image-grid") {
                                updateColumn(active.id, col.id, {
                                  type: nextType,
                                  imageGrid:
                                    col.imageGrid ??
                                    ({
                                      columns: 3,
                                      items: [
                                        { id: uid(), title: "Tile 1", href: "/", image: "/images/tile-1.jpg" },
                                        { id: uid(), title: "Tile 2", href: "/", image: "/images/tile-2.jpg" },
                                        { id: uid(), title: "Tile 3", href: "/", image: "/images/tile-3.jpg" },
                                      ],
                                    } as any),
                                  sections: undefined,
                                  featuredCard: undefined,
                                });
                                return;
                              }

                              // default to link-list
                              updateColumn(active.id, col.id, {
                                type: "link-list",
                                sections:
                                  col.sections ??
                                  [
                                    {
                                      id: uid(),
                                      title: "New Section",
                                      links: [{ id: uid(), label: "New link", href: "/", description: "" }],
                                    },
                                  ],
                                featuredCard: undefined,
                                imageGrid: undefined,
                              });
                            }}
                          >
                            <SelectTrigger className="h-10 rounded-xl">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="link-list">Link list</SelectItem>
                              <SelectItem value="featured-card">Featured card</SelectItem>
                              <SelectItem value="image-grid">Image grid</SelectItem>
                              <SelectItem value="banner">Banner (coming)</SelectItem>
                              <SelectItem value="icon-list">Icon list (coming)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-slate-600">Width</div>
                          <Select
                            value={col.columnWidth}
                            onValueChange={(v) => updateColumn(active.id, col.id, { columnWidth: v as ColumnWidth })}
                          >
                            <SelectTrigger className="h-10 rounded-xl">
                              <SelectValue placeholder="Width" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1/4">1/4</SelectItem>
                              <SelectItem value="1/3">1/3</SelectItem>
                              <SelectItem value="1/2">1/2</SelectItem>
                              <SelectItem value="2/3">2/3</SelectItem>
                              <SelectItem value="full">Full</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Column body */}
                      {col.type === "featured-card" && col.featuredCard && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-2 text-sm font-semibold text-slate-900">Featured Card</div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <div className="text-xs font-medium text-slate-600">Image URL</div>
                              <Input
                                className="h-10 rounded-xl bg-white"
                                value={col.featuredCard.image}
                                onChange={(e) =>
                                  updateColumn(active.id, col.id, {
                                    featuredCard: { ...col.featuredCard!, image: e.target.value },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1.5">
                              <div className="text-xs font-medium text-slate-600">Title</div>
                              <Input
                                className="h-10 rounded-xl bg-white"
                                value={col.featuredCard.title}
                                onChange={(e) =>
                                  updateColumn(active.id, col.id, {
                                    featuredCard: { ...col.featuredCard!, title: e.target.value },
                                  })
                                }
                              />
                            </div>

                            <div className="col-span-2 space-y-1.5">
                              <div className="text-xs font-medium text-slate-600">Description</div>
                              <Textarea
                                className="rounded-xl bg-white"
                                value={col.featuredCard.description || ""}
                                onChange={(e) =>
                                  updateColumn(active.id, col.id, {
                                    featuredCard: { ...col.featuredCard!, description: e.target.value },
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="text-xs font-medium text-slate-600">CTA Label</div>
                              <Input
                                className="h-10 rounded-xl bg-white"
                                value={col.featuredCard.ctaLabel || ""}
                                onChange={(e) =>
                                  updateColumn(active.id, col.id, {
                                    featuredCard: { ...col.featuredCard!, ctaLabel: e.target.value },
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="text-xs font-medium text-slate-600">CTA Href</div>
                              <Input
                                className="h-10 rounded-xl bg-white"
                                value={col.featuredCard.ctaHref || ""}
                                onChange={(e) =>
                                  updateColumn(active.id, col.id, {
                                    featuredCard: { ...col.featuredCard!, ctaHref: e.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {col.type === "image-grid" && col.imageGrid && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-2 text-sm font-semibold text-slate-900">Image Grid</div>
                          <div className="text-xs text-slate-500 mb-3">
                            (Editable in next iteration: add/remove tiles, badges, subtitles, etc.)
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {(col.imageGrid.items || []).slice(0, 6).map((it) => (
                              <div key={it.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                                <div className="aspect-video bg-slate-100" />
                                <div className="p-3">
                                  <div className="text-sm font-semibold text-slate-900">{it.title}</div>
                                  <div className="text-xs text-slate-500">{it.href}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {col.type === "link-list" && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold text-slate-900">Sections</div>
                              <div className="text-xs text-slate-500">Edit section titles + links inside.</div>
                            </div>
                            <Button variant="outline" className="h-10 rounded-xl" onClick={() => addSection(active.id, col.id)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Section
                            </Button>
                          </div>

                          <div className="mt-3 space-y-3">
                            {(col.sections || []).map((sec, secIdx) => (
                              <div key={sec.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm font-semibold text-slate-900">
                                    Section {secIdx + 1}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-9 w-9"
                                      disabled={secIdx === 0}
                                      onClick={() => moveSection(active.id, col.id, sec.id, "up")}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-9 w-9"
                                      disabled={secIdx === (col.sections || []).length - 1}
                                      onClick={() => moveSection(active.id, col.id, sec.id, "down")}
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      className="h-9 w-9 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                      onClick={() => removeSection(active.id, col.id, sec.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <div className="text-xs font-medium text-slate-600">Title</div>
                                    <Input
                                      className="h-10 rounded-xl bg-slate-50"
                                      value={sec.title || ""}
                                      onChange={(e) => updateSection(active.id, col.id, sec.id, { title: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="text-xs font-medium text-slate-600">Title href</div>
                                    <Input
                                      className="h-10 rounded-xl bg-slate-50"
                                      value={sec.titleHref || ""}
                                      onChange={(e) => updateSection(active.id, col.id, sec.id, { titleHref: e.target.value })}
                                    />
                                  </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-semibold text-slate-900">Links</div>
                                  <Button variant="outline" className="h-9 rounded-xl" onClick={() => addLink(active.id, col.id, sec.id)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Link
                                  </Button>
                                </div>

                                <div className="mt-3 space-y-3">
                                  {(sec.links || []).map((lnk) => (
                                    <div key={lnk.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="text-xs font-semibold text-slate-700">Link</div>
                                        <Button
                                          size="icon"
                                          className="h-9 w-9 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                          onClick={() => removeLink(active.id, col.id, sec.id, lnk.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>

                                      <div className="mt-2 grid grid-cols-12 gap-2">
                                        <Input
                                          className="col-span-4 h-10 rounded-xl bg-white"
                                          placeholder="Label"
                                          value={lnk.label}
                                          onChange={(e) => updateLink(active.id, col.id, sec.id, lnk.id, { label: e.target.value })}
                                        />
                                        <Input
                                          className="col-span-5 h-10 rounded-xl bg-white"
                                          placeholder="/path"
                                          value={lnk.href}
                                          onChange={(e) => updateLink(active.id, col.id, sec.id, lnk.id, { href: e.target.value })}
                                        />
                                        <Input
                                          className="col-span-3 h-10 rounded-xl bg-white"
                                          placeholder="Description"
                                          value={lnk.description || ""}
                                          onChange={(e) => updateLink(active.id, col.id, sec.id, lnk.id, { description: e.target.value })}
                                        />

                                        <div className="col-span-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                                          <div className="text-sm font-semibold text-slate-900">Bold</div>
                                          <Switch
                                            checked={!!lnk.isBold}
                                            onCheckedChange={(v) => updateLink(active.id, col.id, sec.id, lnk.id, { isBold: v })}
                                          />
                                        </div>

                                        <div className="col-span-6 space-y-1.5">
                                          <div className="text-xs font-medium text-slate-600">Badge (optional)</div>
                                          <Input
                                            className="h-10 rounded-xl bg-white"
                                            placeholder="e.g. New / Sale / Pro"
                                            value={lnk.badge?.text || ""}
                                            onChange={(e) =>
                                              updateLink(active.id, col.id, sec.id, lnk.id, {
                                                badge: e.target.value
                                                  ? { text: e.target.value, variant: lnk.badge?.variant || "slate" }
                                                  : undefined,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Export */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">Generated HTML</div>
                  <Button
                    variant="outline"
                    className="h-9"
                    onClick={() => navigator.clipboard.writeText(exportHtml)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <div className="p-4">
                  <Textarea className="h-40 font-mono text-xs" value={exportHtml} readOnly />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <Separator />

      {/* Optional: quick preview */}
      <div className="p-4 bg-slate-50 h-[80vh]">
        <div className="text-sm font-semibold text-slate-900 mb-2">Frontend preview</div>
        <FrontendHeaderMegaMenu config={config} />
      </div>
    </div>
  );
}

/* -------------------------------------------
   Frontend Renderer (website header mega menu)
   - Uses same config
------------------------------------------- */

export function FrontendHeaderMegaMenu({ config }: { config: HeaderConfig }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">Website Header</div>
        <div className="text-xs text-slate-500">Config-driven mega menu preview</div>
      </div>

      <Separator />

      <div className="relative px-4 py-3">
        <div className="flex items-center gap-2">
          {config.navigation.map((item) => {
            const isOpen = openId === item.id;
            const isMega = item.type === "mega" && !!item.megaMenuSettings;

            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  className={[
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                    "hover:bg-slate-50",
                    isOpen ? "bg-slate-50" : "bg-white",
                  ].join(" ")}
                  onClick={() => {
                    if (!isMega) return;
                    const trigger = item.megaMenuSettings!.trigger;
                    if (trigger === "hover") {
                      // still allow click in preview
                      setOpenId(isOpen ? null : item.id);
                    } else {
                      setOpenId(isOpen ? null : item.id);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isMega) return;
                    if (item.megaMenuSettings!.trigger !== "hover") return;
                    setOpenId(item.id);
                  }}
                  onMouseLeave={() => {
                    if (!isMega) return;
                    if (item.megaMenuSettings!.trigger !== "hover") return;
                    // small delay could be applied; keeping simple here
                  }}
                >
                  <span>{item.label}</span>
                  {item.badge?.text ? (
                    <span className={badgeClass(item.badge.variant)}>{item.badge.text}</span>
                  ) : null}
                </button>

                {/* Mega panel */}
                {isMega && isOpen && (
                  <div
                    className={[
                      "absolute left-0 top-[44px] z-50",
                      "rounded-2xl border border-slate-200 bg-white shadow-xl",
                      "min-w-[720px]",
                    ].join(" ")}
                    onMouseEnter={() => {
                      if (item.megaMenuSettings!.trigger !== "hover") return;
                      setOpenId(item.id);
                    }}
                    onMouseLeave={() => {
                      if (item.megaMenuSettings!.trigger !== "hover") return;
                      setOpenId(null);
                    }}
                  >
                    <MegaPanel item={item} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MegaPanel({ item }: { item: NavigationItem }) {
  const s = item.megaMenuSettings!;
  const colClass = (w: ColumnWidth) => {
    if (w === "1/4") return "md:col-span-3 col-span-12";
    if (w === "1/3") return "md:col-span-4 col-span-12";
    if (w === "1/2") return "md:col-span-6 col-span-12";
    if (w === "2/3") return "md:col-span-8 col-span-12";
    return "col-span-12";
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-12 gap-4">
        {s.columns.map((c) => {
          if (c.type === "featured-card" && c.featuredCard) {
            const fc = c.featuredCard;
            return (
              <div key={c.id} className={colClass(c.columnWidth)}>
                <a href={fc.ctaHref || "#"} className="block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="aspect-video bg-slate-100" />
                  <div className="p-4">
                    <div className="text-base font-semibold text-slate-900">{fc.title}</div>
                    {fc.description ? <div className="mt-1 text-sm text-slate-600">{fc.description}</div> : null}
                    {fc.ctaLabel ? (
                      <div className="mt-3 inline-flex rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white">
                        {fc.ctaLabel}
                      </div>
                    ) : null}
                  </div>
                </a>
              </div>
            );
          }

          if (c.type === "image-grid" && c.imageGrid) {
            return (
              <div key={c.id} className={colClass(c.columnWidth)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {c.imageGrid.items.map((it) => (
                    <a key={it.id} href={it.href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <div className="aspect-video bg-slate-100" />
                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-900">{it.title}</div>
                          {it.badge?.text ? <span className={badgeClass(it.badge.variant)}>{it.badge.text}</span> : null}
                        </div>
                        {it.subtitle ? <div className="mt-1 text-xs text-slate-500">{it.subtitle}</div> : null}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          }

          // link-list
          return (
            <div key={c.id} className={colClass(c.columnWidth)}>
              <div className="space-y-6">
                {(c.sections || []).map((sec) => (
                  <div key={sec.id} className="space-y-2">
                    {sec.title ? (
                      <a href={sec.titleHref || "#"} className="text-sm font-semibold text-slate-900 hover:underline">
                        {sec.title}
                      </a>
                    ) : null}
                    {sec.description ? <div className="text-xs text-slate-500">{sec.description}</div> : null}

                    <div className="space-y-1">
                      {sec.links.map((l) => (
                        <a
                          key={l.id}
                          href={l.href}
                          className="flex items-start justify-between gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"
                        >
                          <div>
                            <div className={["text-sm text-slate-900", l.isBold ? "font-semibold" : "font-medium"].join(" ")}>
                              {l.label}
                            </div>
                            {l.description ? <div className="text-xs text-slate-500">{l.description}</div> : null}
                          </div>
                          {l.badge?.text ? <span className={badgeClass(l.badge.variant)}>{l.badge.text}</span> : null}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------
   Optional wrapper that matches your modal space
------------------------------------------- */

export default function HeaderMegaMenuSettingsModalSpace() {
  return (
    <div className="w-full max-w-[980px]">
      <AdminMegaMenuSettings />
    </div>
  );
}
