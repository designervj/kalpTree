"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import {
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
import { currenBusinessSections } from "./util/currenBusinessSections";

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

  const [internalCollapsed, setInternalCollapsed] = React.useState<boolean>(
    typeof collapsed === "boolean" ? collapsed : false,
  );

  React.useEffect(() => {
    if (typeof collapsed === "boolean") setInternalCollapsed(collapsed);
  }, [collapsed]);

  const isCollapsed = internalCollapsed;

  const toggleCollapse = React.useCallback(() => {
    setInternalCollapsed((p) => !p);
    onToggleCollapse?.();
  }, [onToggleCollapse]);

  const filteredWebsiteSections = React.useMemo(() => {
    return currenBusinessSections
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
  }, [hasPermission, params, searchparams]);

  const normalizePath = React.useCallback((href: string) => {
    return (href || "").split("?")[0].split("#")[0];
  }, []);

  const activeItemPath = React.useMemo(() => {
    const current = normalizePath(pathname || "");
    const allItems = filteredWebsiteSections.flatMap((s) => s.items);

    const matches = allItems
      .map((item) => normalizePath(item.href))
      .filter((href) => current === href || current.startsWith(href + "/"));

    if (matches.length === 0) return null;
    return matches.sort((a, b) => b.length - a.length)[0];
  }, [pathname, filteredWebsiteSections, normalizePath]);

  const activeSectionId = React.useMemo(() => {
    if (!activeItemPath) return null;
    const found = filteredWebsiteSections.find((section) =>
      section.items.some((item) => normalizePath(item.href) === activeItemPath),
    );
    return found?.id ?? null;
  }, [filteredWebsiteSections, activeItemPath, normalizePath]);

  const [openGroupId, setOpenGroupId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!filteredWebsiteSections.length) {
      setOpenGroupId(null);
      return;
    }

    const stillExists = filteredWebsiteSections.some((s) => s.id === openGroupId);
    if (stillExists) return;

    setOpenGroupId(activeSectionId ?? filteredWebsiteSections[0].id);
  }, [filteredWebsiteSections, openGroupId, activeSectionId]);

  React.useEffect(() => {
    if (activeSectionId) setOpenGroupId(activeSectionId);
  }, [activeSectionId]);

  const toggleGroup = React.useCallback((id: string) => {
    setOpenGroupId((prev) => (prev === id ? null : id));
  }, []);

  const isSectionActive = React.useCallback(
    (section: (typeof filteredWebsiteSections)[number]) => {
      return section.items.some((item) => normalizePath(item.href) === activeItemPath);
    },
    [activeItemPath, normalizePath],
  );

  const [hoverGroupId, setHoverGroupId] = React.useState<string | null>(null);

  return (
    <TooltipPrimitive.Provider>
      <div
        className={cn(
          "relative hidden md:flex h-screen max-h-[92vh]",
          "bg-background text-foreground",
          "transition-[width] duration-300 ease-out",
          "overflow-visible",
          isCollapsed ? "w-[92px]" : "w-[450px]",
        )}
      >
        {/* right edge hairline */}
        <div className="absolute right-0 top-0 h-full w-px bg-border" />

        {/* Collapse button */}
        <div className="absolute right-0 bottom-[78px] z-[1] translate-x-1/2">
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              "h-10 w-10 rounded-full shadow-lg",
              "grid place-items-center transition active:scale-[0.98]",
              "bg-primary text-primary-foreground hover:opacity-90",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
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

        {/* Inner scroll container */}
        <div className="w-full h-full overflow-hidden">
          <div className="h-full flex flex-col">
            <div className={cn("mt-3 flex-1 overflow-y-auto pb-3", "px-2")}>
              <div className="space-y-2">
                {filteredWebsiteSections.map((section) => {
                  const HeaderIcon = sectionIconMap[section.id] || LayoutDashboard;
                  const isOpen = openGroupId === section.id;
                  const sectionActive = isSectionActive(section);

                  // COLLAPSED VIEW
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
                                "w-full h-[58px] rounded-2xl border shadow-sm grid place-items-center transition",
                                sectionActive
                                  ? "bg-primary/10 border-primary/20 text-primary"
                                  : "bg-card border-border text-muted-foreground hover:bg-muted/50",
                              )}
                            >
                              <HeaderIcon className="h-5 w-5" />
                            </button>
                          </TooltipPrimitive.Trigger>

                          <TooltipPrimitive.Portal>
                            <TooltipPrimitive.Content
                              side="right"
                              sideOffset={10}
                              className="z-[100] rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-lg"
                            >
                              {section.label}
                              <TooltipPrimitive.Arrow className="fill-border" />
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
                              <div className="rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl p-3">
                                <div className="flex items-center justify-between px-2 pb-2">
                                  <div className="text-sm font-semibold">{section.label}</div>
                                  <FiCloseHint />
                                </div>

                                <div className="space-y-1">
                                  {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = normalizePath(item.href) === activeItemPath;

                                    return (
                                      <Link key={item.href} href={item.href} className="block">
                                        <div
                                          className={cn(
                                            "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition-colors",
                                            active
                                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                                              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                                          )}
                                        >
                                          <Icon className="h-4 w-4" />
                                          <span className="truncate flex-1">{item.label}</span>

                                          {item.badge && (
                                            <span className="text-[11px] rounded-lg bg-muted px-2 py-0.5 text-muted-foreground">
                                              {item.badge}
                                            </span>
                                          )}

                                          <ChevronRight
                                            className={cn(
                                              "h-4 w-4 transition-opacity",
                                              active
                                                ? "opacity-70"
                                                : "opacity-0 group-hover:opacity-50",
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

                  // EXPANDED VIEW
                  return (
                    <div key={section.id} className="rounded-2xl">
                      <button
                        type="button"
                        onClick={() => toggleGroup(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-2xl px-3 py-2",
                          "text-left border shadow-sm transition-colors",
                          sectionActive
                            ? "bg-card border-primary/20"
                            : "bg-card border-border hover:bg-muted/40",
                        )}
                      >
                        <div
                          className={cn(
                            "grid h-10 w-10 place-items-center rounded-2xl border shadow-sm",
                            sectionActive
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "bg-card border-border text-muted-foreground",
                          )}
                        >
                          <HeaderIcon className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                          <div className="text-[14px] font-semibold text-foreground">
                            {section.label}
                          </div>
                        </div>

                        <div className="text-muted-foreground">
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
                                <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

                                <div className="space-y-1">
                                  {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = normalizePath(item.href) === activeItemPath;

                                    return (
                                      <Link key={item.href} href={item.href} className="block">
                                        <div
                                          className={cn(
                                            "group flex items-center gap-3 rounded-xl px-3 py-2 border transition-colors",
                                            active
                                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                                              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                                          )}
                                        >
                                          <Icon className="h-4 w-4" />

                                          <span className="text-[13px] font-medium truncate flex-1">
                                            {item.label}
                                          </span>

                                          {item.badge && (
                                            <span className="text-[11px] rounded-lg bg-primary/10 text-primary px-2 py-0.5 font-semibold">
                                              {item.badge}
                                            </span>
                                          )}

                                          <ChevronRight
                                            className={cn(
                                              "h-4 w-4 transition-opacity",
                                              active
                                                ? "opacity-70"
                                                : "opacity-0 group-hover:opacity-50",
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