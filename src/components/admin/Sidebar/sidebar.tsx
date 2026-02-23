"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import {
  currentWebsiteSections,
  FiCloseHint,
  sectionIconMap,
  useHasPermission,
} from "../AppShell";
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { buildWebsiteHref, cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

type SidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { user } = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const hasPermission = useHasPermission(user);
  const searchParams = useSearchParams();
  const params = useParams();
  const searchparams = Object.fromEntries(searchParams.entries());

  /**
   * ✅ IMPORTANT FIX:
   * Always keep internal state so collapse works even if parent doesn't update prop.
   */
  const [internalCollapsed, setInternalCollapsed] = React.useState<boolean>(
    typeof collapsed === "boolean" ? collapsed : false
  );

  // If parent changes collapsed prop later, sync it.
  React.useEffect(() => {
    if (typeof collapsed === "boolean") setInternalCollapsed(collapsed);
  }, [collapsed]);

  const isCollapsed = internalCollapsed;

  const toggleCollapse = React.useCallback(() => {
    setInternalCollapsed((p) => !p);
    onToggleCollapse?.();
  }, [onToggleCollapse]);

  // Build sections + permission filter
  const filteredWebsiteSections = React.useMemo(() => {
    return currentWebsiteSections
      .map((section) => ({
        ...section,
        items: section.items
          .filter((item) => hasPermission(item.permission))
          .map((d) => ({
            ...d,
            href: buildWebsiteHref(d.href, params.website!, searchparams),
          })),
      }))
      .filter((section) => section.items.length > 0);
  }, [hasPermission, params, searchParams]);

  // open/close groups
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      filteredWebsiteSections.forEach((s, idx) => (init[s.id] = idx === 0));
      return init;
    }
  );

  React.useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      filteredWebsiteSections.forEach((s, idx) => {
        if (typeof next[s.id] === "undefined") next[s.id] = idx === 0;
      });
      return next;
    });
  }, [filteredWebsiteSections]);

  const toggleGroup = (id: string) =>
    setOpenGroups((p) => ({ ...p, [id]: !p[id] }));

  // ✅ Normalize path (remove query/hash)
  const normalizePath = React.useCallback((href: string) => {
    return (href || "").split("?")[0].split("#")[0];
  }, []);

  // ✅ Find ONLY one active item (longest matching path wins)
  const activeItemPath = React.useMemo(() => {
    const current = normalizePath(pathname || "");
    const allItems = filteredWebsiteSections.flatMap((s) => s.items);

    const matches = allItems
      .map((item) => normalizePath(item.href))
      .filter((href) => current === href || current.startsWith(href + "/"));

    if (matches.length === 0) return null;

    // Most specific route wins (e.g. /notifications over /dashboard parent)
    return matches.sort((a, b) => b.length - a.length)[0];
  }, [pathname, filteredWebsiteSections, normalizePath]);

  // ✅ Optional helper if you later want active parent section styling
  const isSectionActive = React.useCallback(
    (section: (typeof filteredWebsiteSections)[number]) => {
      return section.items.some(
        (item) => normalizePath(item.href) === activeItemPath
      );
    },
    [activeItemPath, normalizePath]
  );

  // collapsed hover floating panel
  const [hoverGroupId, setHoverGroupId] = React.useState<string | null>(null);

  return (
    <TooltipPrimitive.Provider>
      <div
        className={cn(
          "relative hidden md:flex h-screen max-h-[92vh] bg-[#f5f6f7]",
          "transition-[width] duration-300 ease-out",
          "overflow-visible", // ✅ so purple button never gets clipped
          isCollapsed ? "w-[92px]" : "w-[450px]"
        )}
      >
        {/* right edge hairline */}
        <div className="absolute right-0 top-0 h-full w-px bg-black/10 " />

        {/* ✅ Collapse button (purple circle) */}
        <div className="absolute right-0 bottom-[78px] z-[1] translate-x-1/2">
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              "h-10 w-10 rounded-full bg-[#6D28D9] text-white shadow-lg",
              "grid place-items-center hover:bg-[#5B21B6] active:scale-[0.98] transition",
              "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* ✅ Inner scroll container (only this scrolls) */}
        <div className="w-full h-full overflow-hidden">
          <div className="h-full flex flex-col">
            <div
              className={cn(
                "mt-3 flex-1 overflow-y-auto pb-3",
                isCollapsed ? "px-2" : "px-2"
              )}
            >
              <div className="space-y-2">
                {filteredWebsiteSections.map((section) => {
                  const HeaderIcon =
                    sectionIconMap[section.id] || LayoutDashboard;
                  const isOpen = !!openGroups[section.id];
                  const _sectionActive = isSectionActive(section); // currently not changing UI, just available

                  /**
                   * ✅ COLLAPSED VIEW:
                   * - icon only
                   * - NO dropdown list shown
                   * - hover shows floating panel
                   */
                  if (isCollapsed) {
                    return (
                      <div
                        key={section.id}
                        className="relative"
                        onMouseEnter={() => setHoverGroupId(section.id)}
                        onMouseLeave={() => setHoverGroupId(null)}
                      >
                        <TooltipPrimitive.Root delayDuration={150}>
                          <TooltipPrimitive.Trigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "w-full h-[58px] rounded-2xl",
                                "bg-white border border-black/10 shadow-sm",
                                "grid place-items-center hover:bg-white/90 transition"
                              )}
                            >
                              <HeaderIcon className="h-5 w-5 text-black/70" />
                            </button>
                          </TooltipPrimitive.Trigger>

                          <TooltipPrimitive.Portal>
                            <TooltipPrimitive.Content
                              side="right"
                              sideOffset={10}
                              className="z-[100] rounded-md bg-black px-3 py-1.5 text-xs text-white shadow-lg"
                            >
                              {section.label}
                              <TooltipPrimitive.Arrow className="fill-black" />
                            </TooltipPrimitive.Content>
                          </TooltipPrimitive.Portal>
                        </TooltipPrimitive.Root>

                        {/* floating panel */}
                        <AnimatePresence>
                          {hoverGroupId === section.id && (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                transition: { duration: 0.18, ease },
                              }}
                              exit={{
                                opacity: 0,
                                x: 10,
                                transition: { duration: 0.14, ease },
                              }}
                              className="absolute left-full ml-3 top-0 z-[90] w-[270px]"
                            >
                              <div className="rounded-2xl bg-white border border-black/10 shadow-[0_25px_60px_rgba(0,0,0,0.18)] p-3">
                                <div className="flex items-center justify-between px-2 pb-2">
                                  <div className="text-sm font-semibold text-black/80">
                                    {section.label}
                                  </div>
                                  <FiCloseHint />
                                </div>

                                <div className="space-y-1">
                                  {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active =
                                      normalizePath(item.href) === activeItemPath;

                                    return (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block"
                                      >
                                        <div
                                          className={cn(
                                            "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
                                            active
                                              ? "bg-[#eef2ff] text-black shadow-sm border border-[#dfe5ff]"
                                              : "text-black/70 hover:bg-[#f6f7f8]"
                                          )}
                                        >
                                          <Icon
                                            className={cn(
                                              "h-4 w-4",
                                              active
                                                ? "text-black"
                                                : "text-black/55"
                                            )}
                                          />
                                          <span className="truncate flex-1">
                                            {item.label}
                                          </span>
                                          {item.badge && (
                                            <span className="text-[11px] rounded-lg bg-black/5 px-2 py-0.5">
                                              {item.badge}
                                            </span>
                                          )}
                                          <ChevronRight
                                            className={cn(
                                              "h-4 w-4 transition-opacity",
                                              active
                                                ? "opacity-60 text-black"
                                                : "opacity-0 group-hover:opacity-40"
                                            )}
                                          />
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  /**
                   * ✅ EXPANDED VIEW:
                   * group header + dropdown items
                   */
                  return (
                    <div key={section.id} className="rounded-2xl">
                      <button
                        type="button"
                        onClick={() => toggleGroup(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-2xl px-3 py-2",
                          "text-left bg-white border border-black/10 shadow-sm",
                          "hover:bg-white/90 transition"
                        )}
                      >
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white border border-black/10 shadow-sm">
                          <HeaderIcon className="h-5 w-5 text-black/70" />
                        </div>

                        <div className="flex-1">
                          <div className="text-[14px] font-semibold text-black/80">
                            {section.label}
                          </div>
                        </div>

                        <div className="text-black/40">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transition: { duration: 0.22, ease },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: { duration: 0.16, ease },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pl-[22px] pr-2 pt-2 pb-2">
                              <div className="relative pl-6">
                                <div className="absolute left-3 top-2 bottom-2 w-px bg-black/10" />

                                <div className="space-y-1">
                                  {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active =
                                      normalizePath(item.href) === activeItemPath;

                                    return (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block"
                                      >
                                        <div
                                          className={cn(
                                            "group flex items-center gap-3 rounded-xl px-3 py-2",
                                            active
                                              ? "bg-[#eef2ff] text-black shadow-sm border border-[#dfe5ff]"
                                              : "text-black/70 hover:bg-[#f6f7f8]"
                                          )}
                                        >
                                          <Icon
                                            className={cn(
                                              "h-4 w-4",
                                              active
                                                ? "text-black"
                                                : "text-black/55"
                                            )}
                                          />

                                          <span className="text-[13px] font-medium truncate flex-1">
                                            {item.label}
                                          </span>

                                          {item.badge && (
                                            <span className="text-[11px] rounded-lg bg-[#dff4e7] text-[#146b3a] px-2 py-0.5 font-semibold">
                                              {item.badge}
                                            </span>
                                          )}

                                          <ChevronRight
                                            className={cn(
                                              "h-4 w-4 transition-opacity",
                                              active
                                                ? "opacity-60 text-black"
                                                : "opacity-0 group-hover:opacity-40"
                                            )}
                                          />
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  );
}