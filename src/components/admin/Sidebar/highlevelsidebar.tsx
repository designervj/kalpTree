"use client";

import React from "react";
import { useParams, usePathname } from "next/navigation";
import {
  Home,
  Globe,
  CreditCard,
  
  Package,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  LayoutDashboard,
  UserCircle,
  Network ,
  Shield,
  Building2,
  BriefcaseBusiness,
  User,
  Sparkles,
  LogOut,
  Bell,
  Palette,
} from "lucide-react";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";

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
import { Button } from "@/components/ui/button";

const navigationItems = [
  { id: "home", label: "Home", icon: Home, href: "/admin" },

  {
    id: "agencies",
    label: "Agencies",
    icon: Building2,
    href: "/admin/agencies",
    hasSubmenu: true,
    submenuItems: [
      { label: "Agencies list", href: "/admin/agencies" },
      { label: "Add New Agency", href: "/admin/agencies/create" },
    ],
  },

    {
    id: "businesses",
    label: "Businesses",
    icon: Network,
    href: "/admin/businesses",
    hasSubmenu: true,
    submenuItems: [
      { label: "Businesses list", href: "/admin/businesses" },
      { label: "Add New Business", href: "/admin/businesses/create" },
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

    {
    id: "themes",
    label: "Themes",
    icon: Palette,
    href: "/admin/themes",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type HighLevelSidebarProps = {
  user?: any;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
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


  const getRoleAvatarClass = (role?: string) => {
  const r = (role || "").toLowerCase().trim();

  if (r === "super admin" || r === "superadmin" || r === "admin") {
    return "bg-red-500 text-white";
  }
  if (r === "business") {
    return "bg-green-600 text-white";
  }
  if (r === "agency") {
    return "bg-yellow-400 text-black";
  }

  // fallback
  return "bg-primary text-white";
};

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
            "h-full border",
            "bg-[var(--admin-sidebar-bg)] text-[color:var(--admin-sidebar-fg)]",
            "border-[color:var(--admin-sidebar-border)]",
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
                  const Icon = item.icon as any;
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
                              "h-11 rounded-md transition border",
                              "border-[color:var(--admin-sidebar-border)]",
                              isActive
                                ? "bg-[var(--admin-sidebar-active-bg)] text-[color:var(--admin-sidebar-active-fg)] shadow-sm"
                                : "bg-white/50 hover:bg-[var(--admin-sidebar-hover)]"
                            )}
                          >
                            <Icon className="h-5 w-5 opacity-80" />
                            {(item as any).badge && (
                              <span
                                className="absolute -top-1 -right-1 text-[9px] rounded-full px-1.5 py-0.5 font-semibold border"
                                style={{
                                  background: "var(--admin-sidebar-badge-bg)",
                                  color: "var(--admin-sidebar-badge-fg)",
                                  borderColor: "var(--admin-sidebar-border)",
                                }}
                              >
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
                          "w-full flex items-center gap-3 rounded-md px-3 py-2.5",
                          "text-left transition border border-transparent",
                          isActive
                            ? "bg-[var(--admin-sidebar-active-bg)] text-[color:var(--admin-sidebar-active-fg)] shadow-sm border-[color:var(--admin-sidebar-border)]"
                            : "hover:bg-[var(--admin-sidebar-hover)]"
                        )}
                      >
                        <Icon className="h-5 w-5 opacity-80" />

                        <Link
                          href={item.href}
                          className="text-[13px] font-medium flex-1"
                        >
                          {item.label}
                        </Link>

                        {item.hasSubmenu && (
                          <button
                            type="button"
                            className="opacity-60"
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
                                    <div className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-[color:var(--admin-sidebar-muted)] hover:bg-[var(--admin-sidebar-hover)]">
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

            {/* User menu */}
            <div className="border-t p-3 border-[color:var(--admin-sidebar-border)]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2",
                      "text-left transition-colors focus:outline-none",
                      "hover:bg-[var(--admin-sidebar-hover)]",
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
                          <span className="text-sm font-medium capitalize">
                           {user?.name || user?.role}
                          </span>
                          <span className="text-xs text-[color:var(--admin-sidebar-muted)]">
                            {user?.email || "m@example.com"}
                          </span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 text-[color:var(--admin-sidebar-muted)]" />
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
                    
                    {/* <Avatar className="h-8 w-8 ">
                      <AvatarFallback className="font-semibold">
                        {user?.name?.[0]?.toUpperCase() || "SC"}
                      </AvatarFallback>
                    </Avatar> */}

                    <Avatar className="h-7 w-7">
                            <AvatarFallback
                              className={cn(
                                "h-7 w-7 flex items-center justify-center rounded-full font-semibold",
                                getRoleAvatarClass(user?.role)
                              )}
                            >
                              
                              {user?.email?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>

                    <div className="flex flex-col leading-tight">
                      <span className=" font-medium capitalize">
                        {user?.name || user?.role}
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

                  <Link href="/admin/themes" className="no-underline cursor-pointer">
                    <DropdownMenuItem className="rounded-md font-normal">
                      <Palette className="mr-2 h-4 w-4" />
                      Themes
                    </DropdownMenuItem>
                  </Link>

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
