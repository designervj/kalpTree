"use client";

import React from "react";
import { useParams, usePathname } from "next/navigation";
import {
  Home,
  Globe,
  Layers,
  Mail,
  Server,
  CreditCard,
  Package,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  LayoutDashboard,
  UserCircle,
  Shield,
  User,
  Sparkles,
  LogOut,
  Bell,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";

const navigationItems = [
  { id: "home", label: "Home", icon: Home, href: "/admin" },
  {
    id: "businesses",
    label: "Businesses",
    icon: LayoutDashboard,
    href: "/admin/businesses",
    hasSubmenu: true,
    submenuItems: [
      { label: "Businesses list", href: "/admin/businesses" },
      { label: "Add New Business", href: "/admin/businesses/createnew" },
    ],
  },
  {
    id: "agencies",
    label: "Agencies",
    icon: LayoutDashboard,
    href: "/admin/agencies",
    hasSubmenu: true,
    submenuItems: [
      { label: "Agencies list", href: "/admin/agencies" },
      { label: "Add New Agency", href: "/admin/agencies/createnew" },
    ],
  },
  {
    id: "domains",
    label: "Domains",
    icon: Globe,
    href: "/admin/domains",
    hasSubmenu: true,
    submenuItems: [
      { label: "Domain portfolio", href: "/domains/portfolio" },
      { label: "Get a new domain", href: "/domains/new" },
      { label: "Transfers", href: "/domains/transfers" },
    ],
  },
  // { id: "horizons", label: "Horizons", icon: Layers, href: "/horizons" },
  // { id: "emails", label: "Emails", icon: Mail, href: "/emails" },
  // { id: "vps", label: "VPS", icon: Server, href: "/vps" },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/admin/billing",
    hasSubmenu: true,
    submenuItems: [
      { label: "Subscriptions", href: "/admin/billing/subscriptions" },
      { label: "Payment history", href: "/admin/billing/payment-history" },
      { label: "Payment methods", href: "/admin/billing/payment-methods" },
    ],
  },
  {
    id: "all-services",
    label: "All services",
    icon: Package,
    href: "/admin/all-services",
    badge: "New",
    hasSubmenu: true,
    submenuItems: [
      { label: "Marketplace", href: "/admin/all-services/marketplace" },
      { label: "AI tools", href: "/admin/all-services/ai-tools" },
    ],
  },
  {
    id: "accountsharing",
    label: "Account Sharing",
    icon: UserCircle,
    href: "/admin/accountsharing",
  },
  {
    id: "roles",
    label: "Roles and Permissions",
    icon: Shield,
    href: "/admin/rolesandpermission",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type HighLevelSidebarProps = {
  user?: any;

  // ✅ parent controlled
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  // (optional) mobile use
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

export function HighLevelSidebar({
  user,
  collapsed,
  setCollapsed,
  showSidebar,
  setShowSidebar,
}: HighLevelSidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
  const [hoverItemId, setHoverItemId] = React.useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  const toggleCollapsed = () => setCollapsed((v) => !v);

  return (
    <div
      className={cn(
        "relative hidden md:flex h-screen transition-all duration-200 flex-shrink-0",
        collapsed ? "w-[84px]" : "w-[320px]"
      )}
    >
      <div className="w-full">
        <div
          className={cn(
            "h-full border bg-[#f5f6f7] text-[#111]",
            "shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
          )}
        >
          <div className="flex h-[93vh] flex-col">
            {/* Navigation */}
            <div
              className={cn(
                "mt-3 flex-1 px-2 pb-3 overflow-y-auto",
                collapsed && "px-2"
              )}
            >
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isOpen = !!openItems[item.id];
                  const isActive = pathname === item.href;

                  // ✅ Collapsed view
                  if (collapsed) {
                    return (
                      <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() =>
                          item.hasSubmenu && setHoverItemId(item.id)
                        }
                        onMouseLeave={() => setHoverItemId(null)}
                      >
                        <Link href={item.href}>
                          <button
                            type="button"
                            className={cn(
                              "w-full flex items-center justify-center relative",
                              "h-11 rounded-md transition",
                              isActive
                                ? "bg-white text-black shadow-sm"
                                : "bg-white/70 hover:bg-white",
                              "border border-black/5"
                            )}
                          >
                            <Icon className="h-5 w-5 text-black/70" />
                            {(item as any).badge && (
                              <span className="absolute -top-1 -right-1 text-[9px] rounded-full bg-purple-100 text-purple-700 px-1.5 py-0.5 font-semibold border border-purple-200">
                                {(item as any).badge}
                              </span>
                            )}
                          </button>
                        </Link>

                        <AnimatePresence>
                          {hoverItemId === item.id && item.hasSubmenu && (
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
                              className="absolute left-[92px] top-0 z-50 w-[240px]"
                            >
                              <div className="rounded-md bg-white border shadow-[0_25px_60px_rgba(0,0,0,0.18)] p-3">
                                <div className="flex items-center justify-between px-2 pb-2">
                                  <div className="text-sm font-semibold text-black/80">
                                    {item.label}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  {item.submenuItems?.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="block"
                                    >
                                      <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-black/70 hover:bg-[#f6f7f8]">
                                        <span className="truncate flex-1">
                                          {subItem.label}
                                        </span>
                                        <ChevronRight className="h-4 w-4 opacity-40" />
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  // ✅ Expanded view
                  return (
                    <div key={item.id}>
                      <div
                        className={cn(
                          "w-full flex items-center gap-3 rounded-md px-3 py-2.5 1",
                          "text-left transition",
                          isActive
                            ? "bg-white text-black shadow-sm"
                            : "bg-transparent hover:bg-white/50"
                        )}
                      >
                        <Icon className="h-5 w-5 text-black/70" />

                        <Link
                          href={item.href}
                          className="text-[13px] font-medium flex-1"
                        >
                          {item.label}
                        </Link>

                        {item.hasSubmenu && (
                          <button
                            type="button"
                            className="text-black/40"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleItem(item.id);
                            }}
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Submenu */}
                      <AnimatePresence initial={false}>
                        {isOpen && item.hasSubmenu && (
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
                            <div className="pl-11 pr-1 pt-1 pb-1">
                              <div className="space-y-0.5">
                                {item.submenuItems?.map((subItem) => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className="block"
                                  >
                                    <div className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-black/70 hover:bg-white/70">
                                      <span className="truncate flex-1">
                                        {subItem.label}
                                      </span>
                                    </div>
                                  </Link>
                                ))}
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

            {/* ✅ Collapse/Expand Button */}
            {/* <div className="border-t border-black/10 px-3 py-2">
              <button
                type="button"
                onClick={toggleCollapsed}
                className={cn(
                  "w-full flex items-center rounded-md transition hover:bg-white/60",
                  collapsed ? "justify-center h-10" : "justify-between px-3 py-2"
                )}
              >
                <span className="text-black/70">
                  {collapsed ? (
                    <GoSidebarExpand size={20} />
                  ) : (
                    <GoSidebarCollapse size={20} />
                  )}
                </span>

                {!collapsed && (
                  <span className="text-[12px] text-black/60">
                    Collapse sidebar
                  </span>
                )}
              </button>
            </div> */}

            {/* User menu */}
            <div className="border-t border-black/10 p-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2",
                      "text-left transition-colors hover:bg-muted focus:outline-none",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      <span className="w-[40px] h-[40px] flex items-center justify-center">
                        {user?.name?.[0]?.toUpperCase() || "SC"}
                      </span>
                    </div>

                    {!collapsed && (
                      <>
                        <div className="flex flex-col flex-1 text-left leading-tight">
                          <span className="text-sm font-medium">
                            {user?.name || "shadcn"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user?.email || "m@example.com"}
                          </span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                      </>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="right"
                  align="start"
                  sideOffset={12}
                  className="w-56 rounded-xl border bg-background shadow-lg p-1"
                >
                  <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="font-semibold">
                        {user?.name?.[0]?.toUpperCase() || "SC"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">
                        {user?.name || "shadcn"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email || "m@example.com"}
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem className="rounded-md">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem className="rounded-md">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>

                  <DropdownMenuItem className="rounded-md">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>

                  <DropdownMenuItem className="rounded-md">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem className="rounded-md text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
