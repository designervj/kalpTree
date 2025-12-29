import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";
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
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

type SidebarProps = {
  tenants: any[];
  currentTenant: any | null;
  onTenantChange: (tenantId: string) => void;

  websites: Website[];
  currentWebsite: Website | null;
  onWebsiteChange: (websiteId: string) => void;

  user: UserType | null;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  loggedinTenant: any;

  currentagency: any;
  agencies: any[];
  onAgencyChage: (agencyId: string) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Sidebar({
  websites,
  currentWebsite,
  user,
  onWebsiteChange,
  collapsed = false,
  onToggleCollapse,
  tenants,
  currentTenant,
  onTenantChange,
  loggedinTenant,
  agencies,
  currentagency,
  onAgencyChage,
}: SidebarProps) {
  const pathname = usePathname();
  const hasPermission = useHasPermission(user);

  const filteredWebsiteSections = React.useMemo(() => {
    return currentWebsiteSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => hasPermission(item.permission)),
      }))
      .filter((section) => section.items.length > 0);
  }, [hasPermission]);

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
          "relative hidden md:flex h-screen  max-h-[80vh] md:max-h-[90vh] lg:max-h-[92vh] overflow-y-auto bg-[#f5f6f7]",
          collapsed ? "w-[84px]" : "w-[320px]"
        )}
      >
        {/* ✅ soft container like screenshot */}
        <div className="w-full ">
          <div
            className={cn(
              "h-full  border bg-[#f5f6f7] text-[#111]",
              "shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
            )}
          >
            <div className="flex h-full flex-col">
              <div className="border-b pb-4 ">
                <div className="flex justify-between items-center">
                  <div className={cn("px-4 pt-4 pb-0", collapsed && "px-3")}>
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-md">
                        <img
                          src="../kalptree-main-logo.svg"
                          className="w-10 h-10"
                        ></img>
                      </div>
                      {!collapsed && (
                        <div className="leading-tight">
                          <div className="text-md uppercase font-semibold">
                            {loggedinTenant?.name}
                          </div>
                          <div className="text-[11px] text-black/45">
                            {sentenceCase(user?.role)} panel
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {user?.role == "superadmin" && (
                  <div className="relative mt-2">
                    {agencies.length > 0 && (
                      <div className={cn("px-3 pt-2 ", collapsed && "px-2")}>
                        <div className="relative">
                          <Select
                            value={currentagency?._id || ""}
                            onValueChange={onAgencyChage}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-14 w-full rounded-lg bg-white border-2 border-gray-600 focus:ring-2 focus:ring-gray-600 focus:border-gray-600",
                                "text-left px-4 py-2 h-[500px]",
                                "[&>svg]:hidden",
                                collapsed && "justify-center px-2"
                              )}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-base text-gray-900">
                                  {currentagency?.name || ""}
                                </span>
                                <ChevronDown className="h-4 w-4 text-black/70" />
                              </div>
                            </SelectTrigger>

                            <SelectContent className="w-[260px] rounded-lg border shadow-lg ">
                              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                                Tenants
                              </div>

                              {agencies.map((agency) => (
                                <SelectItem key={agency._id} value={agency._id}>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-black/60" />
                                    <span className="text-sm font-medium">
                                      {agency.name}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Floating Label */}
                          <label
                            className={cn(
                              "absolute left-7 transition-all duration-200 pointer-events-none bg-white px-1",
                              currentTenant?._id
                                ? "-top-2.5 text-xs text-gray-600"
                                : "top-6 text-base text-gray-500"
                            )}
                          >
                            Select Agency
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(user?.role == "agency" || user?.role == "superadmin") && (
                  <div className="relative mt-2">
                    {tenants.length > 0 && (
                      <div className={cn("px-3 pt-2 ", collapsed && "px-2")}>
                        <div className="relative">
                          <Select
                            value={currentTenant?._id || ""}
                            onValueChange={onTenantChange}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-14 w-full rounded-lg bg-white border-2 border-gray-600 focus:ring-2 focus:ring-gray-600 focus:border-gray-600",
                                "text-left px-4 py-2 h-[500px]",
                                "[&>svg]:hidden",
                                collapsed && "justify-center px-2"
                              )}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-base text-gray-900">
                                  {currentTenant?.name || ""}
                                </span>
                                <ChevronDown className="h-4 w-4 text-black/70" />
                              </div>
                            </SelectTrigger>

                            <SelectContent className="w-[260px] rounded-lg border shadow-lg ">
                              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                                Tenants
                              </div>

                              {tenants.map((tenant) => (
                                <SelectItem key={tenant._id} value={tenant._id}>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-black/60" />
                                    <span className="text-sm font-medium">
                                      {tenant.name}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Floating Label */}
                          <label
                            className={cn(
                              "absolute left-7 transition-all duration-200 pointer-events-none bg-white px-1",
                              currentTenant?._id
                                ? "-top-2.5 text-xs text-gray-600"
                                : "top-6 text-base text-gray-500"
                            )}
                          >
                            Select Businesses
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="relative mt-2">
                  {websites.length > 0 && (
                    <div className={cn("px-3 pt-2 ", collapsed && "px-2")}>
                      <div className="relative">
                        <Select
                          value={currentWebsite?._id || ""}
                          onValueChange={onWebsiteChange}
                        >
                          <SelectTrigger
                            className={cn(
                              "h-14 w-full rounded-lg bg-white border-2 border-gray-600 focus:ring-2 focus:ring-gray-600 focus:border-gray-600",
                              "text-left px-4 py-2 h-[500px]",
                              "[&>svg]:hidden",
                              collapsed && "justify-center px-2"
                            )}
                          >
                            {!collapsed ? (
                              <div className="flex items-center justify-between w-full">
                                {/* <Globe2 className="h-4 w-4 text-black/60" /> */}
                                <span className="text-sm font-medium truncate">
                                  {currentWebsite?.name || ""}
                                </span>
                                <ChevronDown className="h-4 w-4 text-black/70" />
                              </div>
                            ) : (
                              <Globe2 className="h-4 w-4 text-black/70" />
                            )}
                          </SelectTrigger>

                          <SelectContent className="w-[260px] rounded-lg border shadow-lg">
                            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                              Websites
                            </div>

                            {websites.map((site) => (
                              <SelectItem key={site._id} value={site._id}>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {site.name}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {site.primaryDomain || site.systemSubdomain}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Floating Label */}
                        <label
                          className={cn(
                            "absolute left-7  transition-all duration-200 pointer-events-none bg-white px-1",
                            currentWebsite?._id
                              ? "-top-2.5 text-xs text-gray-600"
                              : "top-6 text-base text-gray-500"
                          )}
                        >
                          Select Website
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

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

              {/* collapse button */}
              {/* <div className="border-t border-black/10 p-3">
                <div className="mt-4">
                  <DropdownMenu>
                
                    <DropdownMenuTrigger asChild>
                      <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col flex-1 text-left leading-tight">
                          <span className="text-sm font-medium">shadcn</span>
                          <span className="text-xs text-muted-foreground">
                            m@example.com
                          </span>
                        </div>

                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>

             
                    <DropdownMenuContent
                      side="right" 
                      align="start" 
                      sideOffset={12} 
                      className="w-56 rounded-xl shadow-xl mb-2"
                    >
                    
                      <DropdownMenuLabel className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium">shadcn</span>
                          <span className="text-xs text-muted-foreground">
                            m@example.com
                          </span>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Account
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
