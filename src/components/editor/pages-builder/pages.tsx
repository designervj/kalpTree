"use client";

import * as React from "react";
import {
  GripVertical,
  Home,
  FileText,
  MoreHorizontal,
  AlertCircle,
  Pencil,
  Copy,
  EyeOff,
  KeyRound,
  Search,
  Image as ImageIcon,
  QrCode,
  Plus,
  X,
  Info,
  ChevronRight,
  Clock,
  ListPlus,
  Link2,
  Link as LinkLucide,
  Trash2,
  LayoutGrid,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMemo } from "react";

type PageItem = {
  id: string;
  title: string;
  icon: "home" | "doc";
  seoIssue?: boolean;
  inNavigation?: boolean;
  isHomepage?: boolean;
  url?: string;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

/** click outside helper */
function useClickOutside<T extends HTMLElement>(
  onOutside: () => void,
  enabled: boolean
) {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside, enabled]);

  return ref;
}

function IconFor(item: PageItem) {
  return item.icon === "home" ? (
    <Home className="w-4 h-4" />
  ) : (
    <FileText className="w-4 h-4" />
  );
}

function SeoPill() {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "text-[12px] font-semibold",
        "bg-amber-50 text-amber-700 border border-amber-200",
        "dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20"
      )}
    >
      <AlertCircle className="w-4 h-4" />
      SEO
    </span>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked
          ? "bg-violet-600 dark:bg-violet-500"
          : "bg-slate-300 dark:bg-slate-700"
      )}
      aria-pressed={checked}
    >
      <span
        className={cx(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  rightIcon,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  rightIcon?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full px-4 py-3 flex items-center gap-3 text-left",
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          : "text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/5"
      )}
    >
      <span className={cx(danger ? "text-red-500" : "text-slate-700 dark:text-slate-200")}>
        {icon}
      </span>
      <span className="text-sm font-medium flex-1">{label}</span>
      {rightIcon ? <span>{rightIcon}</span> : null}
    </button>
  );
}

function PageMenu({
  open,
  onOpenChange,
  page,
  onMakeHomepage,
  onToggleNav,
  onCopyUrl,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  page: PageItem;
  onMakeHomepage: () => void;
  onToggleNav: () => void;
  onCopyUrl: () => void;
  onDelete: () => void;
}) {
  const ref = useClickOutside<HTMLDivElement>(() => onOpenChange(false), open);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cx(
          "h-9 w-9 rounded-lg grid place-items-center transition-colors",
          "text-slate-600 hover:bg-slate-100",
          "dark:text-slate-200 dark:hover:bg-white/5"
        )}
        aria-label="Open menu"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open ? (
        <div
          className={cx(
            "absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-2xl",
            "bg-white border border-slate-200 shadow-xl",
            "dark:bg-[#0b1220] dark:border-slate-800"
          )}
        >
          <MenuItem
            icon={<Home className="w-4 h-4" />}
            label={page.isHomepage ? "Homepage" : "Make homepage"}
            onClick={() => {
              if (!page.isHomepage) onMakeHomepage();
              onOpenChange(false);
            }}
          />
          <MenuItem
            icon={<LinkLucide className="w-4 h-4" />}
            label="Page URL"
            onClick={() => {
              onCopyUrl();
              onOpenChange(false);
            }}
          />
          <MenuItem icon={<Pencil className="w-4 h-4" />} label="Rename" />
          <MenuItem icon={<Copy className="w-4 h-4" />} label="Duplicate" />

          <MenuItem
            icon={<EyeOff className="w-4 h-4" />}
            label={page.inNavigation ? "Hide from navigation" : "Show in navigation"}
            onClick={() => {
              onToggleNav();
              onOpenChange(false);
            }}
          />

          <MenuItem icon={<KeyRound className="w-4 h-4" />} label="Password" />

          <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

          <MenuItem
            icon={<Search className="w-4 h-4" />}
            label="SEO settings"
            rightIcon={<AlertCircle className="w-4 h-4 text-amber-500" />}
          />
          <MenuItem icon={<ImageIcon className="w-4 h-4" />} label="Social image" />
          <MenuItem icon={<QrCode className="w-4 h-4" />} label="Create QR code" />

          <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

          <MenuItem
            icon={<Trash2 className="w-4 h-4" />}
            label="Delete"
            danger
            onClick={() => {
              onDelete();
              onOpenChange(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

/** ✅ DRAG & DROP (no external library) */
function reorder<T>(list: T[], fromIndex: number, toIndex: number) {
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}


export default function Pages() {
  const [comingSoon, setComingSoon] = React.useState(false);
  const { websitePages } = useSelector((state: RootState) => state.websitePage)

  const { currentWebsite } = useSelector((state: RootState) => state.websites)
  const [mainNav, setMainNav] = React.useState<PageItem[]>([
    { id: "home", title: "Home", icon: "home", seoIssue: true, inNavigation: true, isHomepage: true, url: "/" },
    { id: "shop", title: "Shop", icon: "doc", seoIssue: true, inNavigation: true, url: "/shop" },
    { id: "products", title: "Products", icon: "doc", seoIssue: true, inNavigation: true, url: "/products" },
  ]);


  const allPages = useMemo(() => {
    if (websitePages &&
      websitePages.length > 0 &&
      currentWebsite && currentWebsite.primaryDomain &&
      currentWebsite.primaryDomain.length > 0) {
      const primaryDomain = currentWebsite.primaryDomain[0];
      return websitePages.map((page): PageItem => {
        return {
          id: page._id,
          title: page.title,
          icon: "doc" as const,
          seoIssue: false,
          inNavigation: false,
          isHomepage: false,
          url: `${primaryDomain}/${page.slug}`,
        }
      })
    }
    return [];
  }, [websitePages, currentWebsite])
  const [hiddenNav, setHiddenNav] = React.useState<PageItem[]>([
    { id: "terms", title: "Terms & conditions", icon: "doc", inNavigation: false, url: "/terms" },
  ]);

  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const draggingIdRef = React.useRef<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const onDragStart = (id: string) => (e: React.DragEvent) => {
    draggingIdRef.current = id;
    e.dataTransfer.effectAllowed = "move";
    // helps some browsers
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (id: string) => (e: React.DragEvent) => {
    e.preventDefault(); // ✅ required to allow drop
    setDragOverId(id);
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromId = draggingIdRef.current ?? e.dataTransfer.getData("text/plain");
    draggingIdRef.current = null;
    setDragOverId(null);

    if (!fromId || fromId === id) return;

    setMainNav((prev) => {
      const fromIndex = prev.findIndex((p) => p.id === fromId);
      const toIndex = prev.findIndex((p) => p.id === id);
      if (fromIndex < 0 || toIndex < 0) return prev;
      return reorder(prev, fromIndex, toIndex);
    });
  };

  const onDragEnd = () => {
    draggingIdRef.current = null;
    setDragOverId(null);
  };

  const makeHomepage = (id: string) => {
    setMainNav((prev) =>
      prev.map((p) => ({ ...p, isHomepage: p.id === id }))
    );
  };

  const toggleNav = (page: PageItem) => {
    // In screenshot: "Show in navigation" for hidden pages.
    if (page.inNavigation) {
      // move from main -> hidden
      setMainNav((prev) => prev.filter((p) => p.id !== page.id));
      setHiddenNav((prev) => [{ ...page, inNavigation: false }, ...prev]);
    } else {
      // move from hidden -> main
      setHiddenNav((prev) => prev.filter((p) => p.id !== page.id));
      setMainNav((prev) => [...prev, { ...page, inNavigation: true }]);
    }
  };

  const copyUrl = async (page: PageItem) => {
    const url = page.url ?? "/";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
  };

  const deletePage = (page: PageItem) => {
    if (page.inNavigation) setMainNav((p) => p.filter((x) => x.id !== page.id));
    else setHiddenNav((p) => p.filter((x) => x.id !== page.id));
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full">
        <div
          className={cx(
            "rounded-2xl overflow-hidden",
            "bg-white ",
            "dark:bg-[#0b1220] dark:border-slate-800"
          )}
        >
          {/* Header */}
          <div className="relative">


            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Pages and navigation
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage every page of your website here
            </p>
          </div>

          <div className="px-0 pb-6">
            {/* Main navigation */}
            <div className="mt-2">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Main navigation
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-3">
                  {allPages && allPages.map((p) => {
                    const isDragOver = dragOverId === p.id;
                    const isDragging = draggingIdRef.current === p.id;

                    return (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={onDragStart(p.id)}
                        onDragOver={onDragOver(p.id)}
                        onDrop={onDrop(p.id)}
                        onDragEnd={onDragEnd}
                        className={cx(
                          "flex items-center gap-3 py-3",
                          "border-b border-slate-200 last:border-b-0",
                          "dark:border-slate-800",
                          "transition-colors",
                          isDragOver && "bg-slate-50 dark:bg-white/5",
                          isDragging && "opacity-60"
                        )}
                      >
                        {/* ✅ drag handle look (still draggable on whole row) */}
                        <div className="w-7 grid place-items-center text-slate-400">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
                          {IconFor(p)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {p.title}
                          </div>
                        </div>

                        {p.seoIssue ? <SeoPill /> : null}

                        <PageMenu
                          open={openMenuId === p.id}
                          onOpenChange={(v) => setOpenMenuId(v ? p.id : null)}
                          page={p}
                          onMakeHomepage={() => makeHomepage(p.id)}
                          onToggleNav={() => toggleNav(p)}
                          onCopyUrl={() => copyUrl(p)}
                          onDelete={() => deletePage(p)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* small hint */}
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Tip: drag and drop pages to reorder your main navigation.
              </div>
            </div>

            {/* Other pages */}
            <div className="mt-6">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Other pages
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-3">
                  <div
                    className={cx(
                      "flex items-center gap-3 py-3",
                      "border-b border-slate-200 dark:border-slate-800"
                    )}
                  >
                    <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Coming soon
                    </div>
                    <button
                      type="button"
                      className={cx(
                        "h-9 w-9 rounded-lg grid place-items-center",
                        "text-slate-500 hover:bg-slate-100",
                        "dark:text-slate-200 dark:hover:bg-white/5"
                      )}
                      aria-label="Info"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    <ToggleSwitch checked={comingSoon} onChange={setComingSoon} />
                  </div>

                  <div className="flex items-center gap-3 py-3">
                    <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Product pages
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden from navigation */}
            <div className="mt-6">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Hidden from navigation
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                These pages are accessible through search engines and URLs but do
                not appear in your navigation.
              </p>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-3">
                  {hiddenNav.map((p) => (
                    <div
                      key={p.id}
                      className={cx(
                        "flex items-center gap-3 py-3",
                        "border-b border-slate-200 last:border-b-0",
                        "dark:border-slate-800"
                      )}
                    >
                      <div className="w-7 grid place-items-center text-slate-400">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {p.title}
                      </div>

                      <PageMenu
                        open={openMenuId === p.id}
                        onOpenChange={(v) => setOpenMenuId(v ? p.id : null)}
                        page={p}
                        onMakeHomepage={() => makeHomepage(p.id)}
                        onToggleNav={() => toggleNav(p)}
                        onCopyUrl={() => copyUrl(p)}
                        onDelete={() => deletePage(p)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div
            className={cx(
              "px-6 py-4 flex items-center justify-between",
              "border-t border-slate-200 bg-white",
              "dark:border-slate-800 dark:bg-[#0b1220]"
            )}
          >
            <button
              type="button"
              className={cx(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold",
                "bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              )}
            >
              <Plus className="w-5 h-5" />
              Add page
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cx(
                  "h-11 w-11 rounded-xl grid place-items-center",
                  "border border-slate-200 text-slate-700 hover:bg-slate-100",
                  "dark:border-slate-800 dark:text-slate-200 dark:hover:bg-white/5"
                )}
                aria-label="Add to list"
              >
                <ListPlus className="w-5 h-5" />
              </button>

              <button
                type="button"
                className={cx(
                  "h-11 w-11 rounded-xl grid place-items-center",
                  "border border-slate-200 text-slate-700 hover:bg-slate-100",
                  "dark:border-slate-800 dark:text-slate-200 dark:hover:bg-white/5"
                )}
                aria-label="Link"
              >
                <Link2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
