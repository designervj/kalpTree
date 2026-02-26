

"use client";
import * as React from "react";
import {
  Menu,

  Tags,
  Bell,
  Palette,
  Share2,
  LayoutTemplate,
  Globe,
 
  Users,

  Bot,
  Network,

  Image as ImageIcon,
  Megaphone,
  BookOpen,

  ShoppingCart,

  LayoutGrid,


  User,
  Sparkles,
  ChevronsUpDown,
  LogOut,
  Settings,

} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Sidebar } from "./Sidebar/sidebar";
import { MobileSidebar } from "./Sidebar/mobileSidebar";
import { HighLevelSidebar } from "./Sidebar/highlevelsidebar";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Button } from "../ui/button";
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";

import { clearCategories } from "@/hooks/slices/category/CategorySlice";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FiSearch, FiBell, FiChevronLeft } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { Label } from "../ui/label";
import { UpperBar } from "./Sidebar/UpperBar";
import type { ObjectId } from "mongodb";
import { IUser } from "@/models/user";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { clearUser } from "@/hooks/slices/user/userSlice";
// import { Combo } from "@/app/admin/websites/[website]/branding/typography/ColorPallet";
import { ColorPalletModal } from "./branding/color_pallet/Color_Pallet_Modal";
// ---------------------------------------------------------------------------
// Types & interfaces
// ---------------------------------------------------------------------------

export type Website = {
  _id?: string | ObjectId;
  tenantId?: string;
  websiteId?: string;
  name?: string;
  primaryDomain?: string[] | null;
  systemSubdomain?: string;
  serviceType?: "WEBSITE_ONLY" | "ECOMMERCE";
  status?: "active" | "paused" | "error";
  lang?: { name: string; default: boolean }[];
  isComingSoon?: boolean;
  globalStyle?: string;
  branding?: {
    colors: ColorPalletModal[];
    typography: any[];
  };
};

export type User = {
  _id?: string | ObjectId;
  id?: string | ObjectId;
  email: string;
  name?: string;
  tenantId?: string;
  // tenantSlug: string;
  role: string;
  permissions?: string[];
  createdById?: string;
};

type AppShellProps = {
  children: React.ReactNode;
  onWebsiteChange?: (websiteId: string) => void;
  onTenantChange?: (tenantId: string) => void;
  onAgencyChage?: (agencyId: string) => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  permission?: string | string[];
  badge?: string;
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  permission?: string;
};


export const getRoleAvatarClass = (role?: string) => {
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

const ease = [0.22, 1, 0.36, 1] as const;

export function useHasPermission(user: User | IUser | null) {
  return React.useCallback(
    (permission?: string | string[]) => {
      if (!permission) return true;
      if (!user) return true;

      const required = Array.isArray(permission) ? permission : [permission];
      if (!user.permissions || !Array.isArray(user.permissions)) return true;

      return required.some((p) => user.permissions!.includes(p));
    },
    [user],
  );
}

// Section "header icon" like screenshot (one icon per group)
export const sectionIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  "dashboard-overview": LayoutGrid,
  websites: Globe,
  branding: Palette,
  products: Tags,
  ecommerce: ShoppingCart,
  marketing: Megaphone,
  "ai-studio": Bot,
  users: Users,
  settings: Settings,
  domains: Network,
};

export function FiCloseHint() {
  return <div className="text-[11px] text-black/35">hover</div>;
}

export function AppShell({ children }: AppShellProps) {
  // const { user, websites, currentWebsite } = useSelector(
  //   (state: RootState) => state.dashboardDetails
  // );
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  // Used inside mobile off-canvas (we don't allow collapsing there)
  const noopSetCollapsed = React.useCallback((_: any) => { }, []);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const businessid = searchParams.get("businessid");
  const agencyid = searchParams.get("agencyid");
  const { user } = useSelector((state: RootState) => state.user);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { currentBusiness, allBusiness } = useSelector((state: RootState) => state.business);

  const router = useRouter();

  const param = useParams();
  const { website } = param;

  // Track loading state during transitions
  const [isLoading, setIsLoading] = React.useState(false);
  const prevWebsiteRef = React.useRef<string | string[] | undefined>(undefined);

  React.useEffect(() => {
    const currentWebsite = website;
    const prevWebsite = prevWebsiteRef.current;

    // Only show loading when transitioning between states (not on initial mount)
    if (prevWebsite !== undefined && prevWebsite !== currentWebsite) {
      setIsLoading(true);
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }

    prevWebsiteRef.current = currentWebsite;
    setIsLoading(false);
  }, [website]);

  // Compute directly instead of using state to prevent sidebar flash on page load
  const isHighLevelCollapsed = Boolean(website);

  const handleSignOut = async () => {
    const redirect = `${window.location.origin}/auth/signin`;

    try {
      // 1️⃣ Server-side cleanup (optional but good)
      await fetch("/api/appshell-data", { method: "POST" });

      // 2️⃣ Clear redux
      resetRedux();

      // 3️⃣ Clear storages
      localStorage.clear();
      sessionStorage.clear();

      // 4️⃣ Best-effort cookie cleanup
      const cookiesToClear = [
        "admin-cart-token",
        "current_website_data",
        "current_website",
        "current_website_id",
        "authjs.session-token",
        "authjs.csrf-token",
        "authjs.callback-url",
        "__Secure-authjs.session-token",
        "__Host-authjs.csrf-token",
      ];

      cookiesToClear.forEach((cookieName) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

        const rootDomain = window.location.hostname
          .split(".")
          .slice(-2)
          .join(".");

        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
      });

      // 5️⃣ Tell NextAuth to logout BUT DO NOT REDIRECT
      await signOut({ redirect: false });

      // 6️⃣ YOU decide where to go
      window.location.href = redirect;
    } catch (err) {
      console.error("Logout error:", err);

      // fallback hard redirect
      window.location.href = redirect;
    }
  };

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    dispatch(clearUser());
    dispatch(clearCategories());
  };
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = React.useState(Boolean(params.website));
  const [showSidebar, setShowSidebar] = React.useState(true);
  const { isSecondDashBoard } = useSelector((state: RootState) => state.user);

  const handleAdmin = () => {
    resetRedux();
    router.push(`/admin`);
  };

  
  const handleWebsiteBuilder = () => {
    const url = `/builder/${currentBusiness?._id}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <header className="h-16 w-full bg-white border-b border-gray-200 flex items-center justify-between px-5">
        {/* LEFT */}

        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-15 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              <img
                src="/kalptree-favicon.svg"
                alt="KalpTree"
                className="h-18 w-18 cursor-pointer"
                onClick={handleAdmin}
              />
            </div>
          </div>
        </div>
        {isHighLevelCollapsed && <UpperBar />}
        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Search */}

             <Button onClick={handleWebsiteBuilder} size="sm" className="text-xs tracking-wide cursor-pointer">
                  Website Builder
              </Button>

          <div className="relative hidden md:block">
            <FiSearch className="absolute left-3 top-[9px] text-gray-400 text-sm" />
            <Input
              placeholder="Search"
              className="h-8 w-52 rounded-full pl-9 text-sm border-gray-200 focus-visible:ring-0"
            />
          </div>

          {/* Notification */}
          <div className="relative cursor-pointer hidden md:block">
            <FiBell className="text-gray-600 text-[18px]" />
            <span className="absolute -top-1 -right-1 h-[6px] w-[6px] bg-red-500 rounded-full" />
          </div>

          {/* AI Assistant */}
          <Button size="sm" className="text-xs ">
            <Sparkles className="h-3 w-3 " />
            Ai Assistant
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent text-black"
              >
                <Avatar className="h-7 w-7 text-black">
                  <AvatarFallback
                    className={cn(
                      "h-7 w-7 flex items-center justify-center text-black rounded-full font-semibold",
                      isMounted
                        ? getRoleAvatarClass(user?.role)
                        : "bg-primary text-white",
                    )}
                  >
                    {isMounted
                      ? user?.email?.charAt(0).toUpperCase() || "U"
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={10}
              className="w-56 rounded-xl border bg-background shadow-lg p-1"
            >
              <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
                <div className="flex flex-col leading-tight px-2 ">
                  <span className="text-sm font-medium capitalize ">
                    {user?.role}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email || "m@example.com"}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-1" />

              <div className="px-2 pb-2">
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground capitalize">
                  {user?.role || "Super Admin"}
                </span>
              </div>

              <DropdownMenuItem className="rounded-md">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="rounded-md">
                <Settings className="mr-2 h-4 w-4" />
                Account settings
              </DropdownMenuItem>


              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="rounded-md text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>

      {/* Loading screen during transitions */}
      {isLoading ? (
        <div className="flex h-[92vh] bg-[#e8e9eb] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="flex h-[92vh] bg-[#e8e9eb] text-foreground overflow-hidden">
          {user && (user.role == "superadmin" || user.role == "agency") && !isHighLevelCollapsed && (
            <HighLevelSidebar
              user={user}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
            />
          )}

          {user && (user.role != "superadmin" && user.role != "agency") && (
            <Sidebar
              collapsed={false}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          )}

          <div className="flex  flex-col w-full">
            <div className="px-3 py-4 md:px-6 md:py-6 overflow-auto ">
              <div className="mx-auto">{children}</div>
            </div>
          </div>

          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[320px] sm:w-80">
              {/* Off-canvas header */}
              <div className="h-16 border-b px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/kalptree-favicon.svg"
                    alt="KalpTree"
                    className="h-9 w-9"
                  />
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">KalpTree</div>
                    <div className="text-[11px] text-muted-foreground">
                      Navigation
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  // size="icon"
                  className="bg-white flex itms-center justify-center rounded-md p-2 hover:bg-gray-100 shadow z-50 absolute top-4 right-4 z-50"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="Close"
                >
                  <IoMdClose className="w-[28px]" />
                </Button>
              </div>

              {/* Main navigation (High-level sidebar) */}
              <div className="h-[calc(100vh-64px)] flex flex-col">
                <HighLevelSidebar
                  user={user}
                  collapsed={false}
                  setCollapsed={noopSetCollapsed as any}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                  variant="mobile"
                  onNavigate={() => setMobileSidebarOpen(false)}
                />

                {/* Optional: website-specific menu (existing mobile sidebar) */}
                <div className="border-t">
                  <SheetHeader className="px-4 py-3">
                    <SheetTitle className="text-sm font-semibold">
                      Website
                    </SheetTitle>
                  </SheetHeader>

                  {isHighLevelCollapsed && (
                    <MobileSidebar
                      business={allBusiness}
                      currentBusiness={currentBusiness}
                      user={user}
                    // onWebsiteChange={(websiteId) => {
                    //   onWebsiteChange(websiteId);
                    //   setMobileSidebarOpen(false);
                    // }}
                    />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
}
