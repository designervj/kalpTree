import { useParams, usePathname, useSearchParams } from "next/navigation";
import {
  currentWebsiteSections,
  FiCloseHint,
  sectionIconMap,
  useHasPermission,
  User as UserType,
  Website,
} from "../AppShell";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { buildWebsiteHref, cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowBigDown,
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  Globe2,
  LayoutDashboard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

type SidebarProps = {
  onTenantChange: (tenantId: string) => void;

  onWebsiteChange: (websiteId: string) => void;

  collapsed?: boolean;
  onToggleCollapse?: () => void;

  onAgencyChage: (agencyId: string) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Sidebar({
  onWebsiteChange,
  collapsed = false,
  onToggleCollapse,
  onTenantChange,
  onAgencyChage,
}: SidebarProps) {
  const { user } = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const hasPermission = useHasPermission(user);
  const searchParams = useSearchParams();
  const params = useParams();
  const searchparams = Object.fromEntries(searchParams.entries());
  // Might Crash if params is an array
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

  // open/close groups (dropdown like "Income" in screenshot)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      filteredWebsiteSections.forEach((s, idx) => (init[s.id] = idx === 0)); // first group open by default
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

  // collapsed hover floating panel (like screenshot right)
  const [hoverGroupId, setHoverGroupId] = React.useState<string | null>(null);

  const sentenceCase = (s: string | undefined) => {
    if (!s) return "";
    let t = s[0].toUpperCase() + s.slice(1).toLowerCase();
    return t;
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative hidden md:flex h-screen  max-h-[80vh] md:max-h-[90vh] lg:max-h-[92vh] overflow-y-auto bg-[#f5f6f7]        w-[450px]"
        )}
      >
        {/* ✅ soft container like screenshot */}
        <div className="w-full ">
          <div
          // className={cn(
          //   "h-full  border bg-[#f5f6f7] text-[#111]",
          //   "shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
          // )}
          >
            <div className="flex h-full flex-col">
              <ScrollArea
                className={cn("mt-3 flex-1 px-2 pb-3", collapsed && "px-2")}
              >
                <div className="space-y-2">
                  {!true ? (
                    <div
                      className={cn(
                        "px-3 py-6 text-sm text-black/45",
                        collapsed && "text-center px-1"
                      )}
                    >
                      Select website
                    </div>
                  ) : (
                    filteredWebsiteSections.map((section) => {
                      const HeaderIcon =
                        sectionIconMap[section.id] || LayoutDashboard;
                      const isOpen = !!openGroups[section.id];

                      // if collapsed: icon only + hover opens floating panel
                      if (collapsed) {
                        return (
                          <div
                            key={section.id}
                            className="relative"
                            onMouseEnter={() => setHoverGroupId(section.id)}
                            onMouseLeave={() => setHoverGroupId(null)}
                          >
                            <Tooltip delayDuration={150}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    "w-full flex items-center justify-center",
                                    "h-11 rounded-md bg-white/70 hover:bg-white transition",
                                    "border border-black/5 shadow-sm"
                                  )}
                                >
                                  <HeaderIcon className="h-5 w-5 text-black/70" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                {section.label}
                              </TooltipContent>
                            </Tooltip>

                            {/* floating panel like screenshot */}
                            <AnimatePresence>
                              {hoverGroupId === section.id && (
                                <motion.div
                                  initial={{ opacity: 0, x: 10, y: 0 }}
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
                                  className="absolute left-[92px] top-0 z-50 w-[240px]"
                                >
                                  <div className="rounded-md bg-white border shadow-[0_25px_60px_rgba(0,0,0,0.18)] p-3">
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
                                          pathname === item.href ||
                                          pathname?.startsWith(item.href + "/");

                                        return (
                                          <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block"
                                          >
                                            <div
                                              className={cn(
                                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                                                active
                                                  ? "bg-[#f2f3f4] text-black shadow-sm"
                                                  : "text-black/70 hover:bg-[#f6f7f8]"
                                              )}
                                            >
                                              <Icon className="h-4 w-4" />
                                              <span className="truncate flex-1">
                                                {item.label}
                                              </span>
                                              {item.badge && (
                                                <span className="text-[11px] rounded-lg bg-black/5 px-2 py-0.5">
                                                  {item.badge}
                                                </span>
                                              )}
                                              <ChevronRight className="h-4 w-4 opacity-40" />
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

                      // normal expanded sidebar
                      return (
                        <div key={section.id} className="rounded-md">
                          {/* Group header row (like “Income” in screenshot) */}
                          <button
                            type="button"
                            onClick={() => toggleGroup(section.id)}
                            className={cn(
                              "w-full flex items-center gap-3 rounded-md px-3 py-2.5",
                              "text-left bg-white/70 border border-black/5 shadow-sm",
                              "hover:bg-white transition"
                            )}
                          >
                            <div className="grid h-9 w-9 place-items-center rounded-md bg-white border shadow-sm">
                              <HeaderIcon className="h-4 w-4 text-black/70 " />
                            </div>

                            <div className="flex-1">
                              <div className="text-[13px] font-semibold text-black/80 ">
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

                          {/* Items (nested, with subtle left line like screenshot) */}
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
                                <div className="pl-[22px] pr-1 pt-2 pb-2">
                                  <div className="relative pl-5">
                                    <div className="absolute left-2 top-2 bottom-2 w-px bg-black/10" />
                                    <div className="space-y-1">
                                      {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const active =
                                          pathname === item.href ||
                                          pathname?.startsWith(item.href + "/");

                                        return (
                                          <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block"
                                          >
                                            <div
                                              className={cn(
                                                "group flex items-center gap-3 rounded-md px-3 py-2",
                                                active
                                                  ? "bg-[#fff] text-black shadow-sm"
                                                  : "text-black/70 hover:bg-[#f6f7f8]"
                                              )}
                                            >
                                              <Icon className="h-4 w-4 text-black/55" />
                                              <span className="text-[13px] font-medium truncate flex-1">
                                                {item.label}
                                              </span>

                                              {item.badge && (
                                                <span className="text-[11px] rounded-lg bg-[#dff4e7] text-[#146b3a] px-2 py-0.5 font-semibold">
                                                  {item.badge}
                                                </span>
                                              )}
                                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-40 transition" />
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
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
