"use client";
import * as React from "react";
import {
  LayoutDashboard,
  Globe2,
  FileText,
  Type,
  Tags,
  Bell,
  Palette,
  Share2,
  LayoutTemplate,
  Globe,
  Settings2,
  CreditCard,
  Activity,
  Blocks,
  Webhook,
  Download,
  ShieldCheck,
  Users,
  Fingerprint,
  UsersRound,
  UserPlus,
  History,
  KeyRound,
  ImagePlus,
  ScanSearch,
  Paintbrush,
  Bot,
  Network,
  Compass,
  Terminal,
  Heart,
  GalleryVerticalEnd,
  Cpu,
  Image as ImageIcon,
  Megaphone,
  BookOpen,
  TicketPercent,
  MailPlus,
  Zap,
  ShoppingBag,
  BarChart4,
  ShoppingCart,
  RefreshCcw,
  ReceiptIndianRupee, // or Banknote / Percent
  Truck,
  Settings,
  Package,
  LayoutGrid,
  Award,
  Layers,
  ListTree,
  Hash,
  Component,
  Boxes,
  CircleDollarSign,
  Image,
  SwatchBook,
  BarChart3,
  HeartPulse,
  FileCode2,
  Newspaper,
  PanelTop,
  PanelBottom,
  ClipboardList,
  ArrowLeftRight,
  User,
  Sparkles,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Sidebar } from "./Sidebar/sidebar";
import { Topbar } from "./Sidebar/topbar";
import { MobileSidebar } from "./Sidebar/mobileSidebar";
import { HighLevelSidebar } from "./Sidebar/highlevelsidebar";
import { useParams, useRouter, useSearchParams } from "next/navigation";

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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { Label } from "../ui/label";
import { UpperBar } from "./Sidebar/UpperBar";
import { ObjectId } from "mongodb";
import { IUser } from "@/models/user";
// ---------------------------------------------------------------------------
// Types & interfaces
// ---------------------------------------------------------------------------

export type Website = {
  _id?: string | ObjectId;
  tenantId?: string;
  websiteId?: string;
  name: string;
  primaryDomain?: string[] | null;
  systemSubdomain?: string;
  serviceType: "WEBSITE_ONLY" | "ECOMMERCE";
  status?: "active" | "paused" | "error";
  lang?: [{ name: string; code: string }];
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

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  permission?: string;
};

export const currentWebsiteSections: NavSection[] = [
  {
    id: "dashboard-overview",
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      {
        label: "Analytics",
        href: "/admin/overview/analytics",
        icon: BarChart3,
        permission: "dashboard:update",
      },
      {
        label: "Activity Log",
        href: "/admin/overview/activity-log",
        icon: Activity,
        permission: "analytics:read",
      },
      {
        label: "Notifications",
        href: "/admin/overview/notifications",
        icon: Bell,
        permission: "security:read",
      },
      {
        label: "System Health",
        href: "/admin/overview/system-health",
        icon: HeartPulse,
        permission: "security:read",
      },
      {
        label: "Quick Actions",
        href: "/admin/overview/quick-actions",
        icon: Zap,
        permission: "security:read",
      },
    ],
  },

  {
    id: "website",
    label: "Website",
    items: [
      {
        label: "Pages",
        href: "/admin/website/pages",
        icon: FileCode2,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Posts",
        href: "/admin/website/posts",
        icon: Newspaper,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Media",
        href: "/admin/website/media",
        icon: ImageIcon,
        permission: ["media:update", "media:read", "media:delete"],
      },
      {
        label: "Templates",
        href: "/admin/website/templates",
        icon: ImageIcon,
        permission: ["media:update", "media:read", "media:delete"],
      },
      {
        label: "Header",
        href: "/admin/website/header",
        icon: PanelTop,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Footer",
        href: "/admin/website/footer",
        icon: PanelBottom,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Navigation",
        href: "/admin/website/navigation",
        icon: Compass,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Forms",
        href: "/admin/website/forms",
        icon: ClipboardList,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Redirects",
        href: "/admin/website/redirects",
        icon: ArrowLeftRight,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Domain Settings",
        href: "/admin/website/domains",
        icon: Globe2,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
    ],
  },

  {
    id: "branding",
    label: "Branding & Design",
    items: [
      {
        label: "Brand Profile",
        href: "/admin/branding/brand-profile",
        icon: LayoutGrid,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Logo",
        href: "/admin/branding/logo",
        icon: Image,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Colors",
        href: "/admin/branding/colors",
        icon: Palette,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Typography",
        href: "/admin/branding/typography",
        icon: Type,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Layout Settings",
        href: "/admin/branding/layout-settings",
        icon: LayoutTemplate,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Theme Presets",
        href: "/admin/branding/theme-presets",
        icon: SwatchBook,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "products",
    label: "Products",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Category",
        href: "/admin/category",
        icon: LayoutGrid,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Brand",
        href: "/admin/brand",
        icon: Award,
        permission: ["product:read", "product:update", "product:delete"],
      },

      {
        label: "Attribute",
        href: "/admin/attribute",
        icon: ListTree,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Styles",
        href: "/admin/styles",
        icon: Palette,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Tags",
        href: "/admin/tags",
        icon: Hash,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Attribute Sets",
        href: "/admin/attributes-list",
        icon: Component,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Variants",
        href: "/admin/variants",
        icon: Boxes,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Pricing Rules",
        href: "/admin/pricing-rules",
        icon: CircleDollarSign,
        permission: ["product:read", "product:update", "product:delete"],
      },
    ],
  },

  {
    id: "ecommerce",
    label: "E-Commerce",
    items: [
      {
        label: "Orders",
        href: "/admin/ecommerce/orders",
        icon: ShoppingBag,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Customers",
        href: "/admin/ecommerce/customers",
        icon: Users,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Reports",
        href: "/admin/ecommerce/reports",
        icon: BarChart4,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Abandoned Carts",
        href: "/admin/ecommerce/abandoned-carts",
        icon: ShoppingCart,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Subscriptions",
        href: "/admin/ecommerce/subscriptions",
        icon: RefreshCcw,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Taxes",
        href: "/admin/ecommerce/taxes",
        icon: ReceiptIndianRupee,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Shipping",
        href: "/admin/ecommerce/shipping",
        icon: Truck,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Payments",
        href: "/admin/ecommerce/payments",
        icon: CreditCard,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Invoices",
        href: "/admin/ecommerce/invoices",
        icon: FileText,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Settings",
        href: "/admin/ecommerce/settings",
        icon: Settings,
        permission: ["product:read", "product:update", "product:delete"],
      },
    ],
  },

  {
    id: "marketing",
    label: "Marketing",
    items: [
      {
        label: "Proposal",
        href: "/admin/marketing/proposal",
        icon: ImageIcon,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Banners",
        href: "/admin/marketing/banners",
        icon: ImageIcon,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Campaigns",
        href: "/admin/marketing/campaigns",
        icon: Megaphone,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Catalog Generation",
        href: "/admin/marketing/catalog-generation",
        icon: BookOpen,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Quotations",
        href: "/admin/marketing/quotations",
        icon: FileText,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Coupons",
        href: "/admin/marketing/coupons",
        icon: TicketPercent,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Email Templates",
        href: "/admin/marketing/email-templates",
        icon: MailPlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Integrations",
        href: "/admin/marketing/integrations",
        icon: Share2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Automation Rules",
        href: "/admin/marketing/automation-rules",
        icon: Zap,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "ai-studio",
    label: "AI Studio",
    items: [
      {
        label: "Image Uploads",
        href: "/admin/ai-studio/image-uploads",
        icon: ImagePlus,
        permission: ["ai:read", "ai:update", "ai:delete"],
      },
      {
        label: "Segment Detection",
        href: "/admin/ai-studio/segment-detection",
        icon: ScanSearch,
        permission: ["ai:read", "ai:update", "ai:delete"],
      },
      {
        label: "Material Application",
        href: "/admin/ai-studio/material-application",
        icon: Paintbrush,
        permission: ["ai:read", "ai:update", "ai:delete"],
      },
      {
        label: "Prompt Library",
        href: "/admin/ai-studio/prompt-library",
        icon: Terminal,
        permission: ["ai:read", "ai:update", "ai:delete"],
      },
      {
        label: "Render History",
        href: "/admin/ai-studio/render-history",
        icon: History,
        permission: ["ai:read", "ai:update", "ai:delete"],
      },
      {
        label: "Saved Designs",
        href: "/admin/ai-studio/saved-designs",
        icon: Heart,
        permission: ["ai:read", "ai:update", "ai:delete"],
      },
      {
        label: "Reference Images",
        href: "/admin/ai-studio/reference-images",
        icon: GalleryVerticalEnd,
        permission: ["ai:read", "ai:update", "ai:delete"],
      },
      {
        label: "AI Settings",
        href: "/admin/ai-studio/ai-settings",
        icon: Cpu,
        permission: ["ai:read", "ai:update", "ai:delete"],
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    items: [
      {
        label: "All Users",
        href: "/admin/users/all-user",
        icon: Users,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Create Users",
        href: "/admin/users/create",
        icon: UserPlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Roles & Permissions",
        href: "/admin/users/roles-permissions",
        icon: Fingerprint,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Teams",
        href: "/admin/users/teams",
        icon: UsersRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Activity Logs",
        href: "/admin/users/activity-logs",
        icon: History,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "API Access",
        href: "/admin/users/api-access",
        icon: KeyRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      {
        label: "General",
        href: "/admin/settings/general",
        icon: Settings2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Domain & DNS",
        href: "/admin/settings/domain-dns",
        icon: Globe,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Billing & Plans",
        href: "/admin/settings/billing-plans",
        icon: CreditCard,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Usage & Limits",
        href: "/admin/settings/usage-limits",
        icon: Activity,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Integrations",
        href: "/admin/settings/integrations",
        icon: Blocks,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Webhooks",
        href: "/admin/settings/webhooks",
        icon: Webhook,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Data Export",
        href: "/admin/settings/data-export",
        icon: Download,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Security",
        href: "/admin/settings/security",
        icon: ShieldCheck,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },
  {
    id: "block-manager",
    label: "Block Manager",
    items: [
      {
        label: "Blocks",
        href: "/admin/block-manager/blocks",
        icon: Blocks,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "domains",
    label: "Domain & Hosting",
    items: [
      {
        label: "Domains",
        href: "/admin/domain",
        icon: Globe,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },
];

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
    [user]
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

export function AppShell({
  children,
  onWebsiteChange = () => {},
  onTenantChange = () => {},
  onAgencyChage = () => {},
}: AppShellProps) {
  // const { user, websites, currentWebsite } = useSelector(
  //   (state: RootState) => state.dashboardDetails
  // );
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isHighLevelCollapsed, setIsHighLevelCollapsed] = React.useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const businessid = searchParams.get("businessid");
  const agencyid = searchParams.get("agencyid");
  const { user } = useSelector((state: RootState) => state.user);
  const { websites, currentWebsite } = useSelector(
    (state: RootState) => state.websites
  );
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  // const {currentbusiness,currentAgency} = useSelector((state: RootState) => state.dashboardDetails);
  const router = useRouter();
  React.useEffect(() => {
    if (currentBusiness && currentBusiness._id) {
      setIsHighLevelCollapsed(true);
    } else {
      setIsHighLevelCollapsed(false);
    }
  }, [currentBusiness]);
  // const isHighLevelCollapsed = !params.website ? false : true;
  // const isHighLevelCollapsed = true
  const handleSignOut = async () => {
    try {
      resetRedux();
      localStorage.clear();
      sessionStorage.clear();
      await signOut({ callbackUrl: "/auth/signin" });
    } catch (error) {
      console.error("Error during sign out:", error);
      // await signOut({ callbackUrl: "/" });
    }
  };

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());

    dispatch(clearCategories());
  };
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = React.useState(Boolean(params.website));
  const [showSidebar, setShowSidebar] = React.useState(true);
  const { isSecondDashBoard } = useSelector((state: RootState) => state.user);
  return (
    <>
      <header className="h-16 w-full bg-white border-b border-gray-200 flex items-center justify-between px-5">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-15 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              <img
                src="/kalptree-favicon.svg"
                alt="KalpTree"
                className="h-18 w-18"
              />
            </div>
            {/* <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className={cn(
                "w-full rounded-md transition hover:bg-white/60",
                collapsed
                  ? "h-10 flex items-center justify-center"
                  : "h-10 flex items-center justify-between px-3"
              )}
            >
              <span className="text-black/70">
                {collapsed ? (
                  <GoSidebarExpand size={20} />
                ) : (
                  <GoSidebarCollapse size={20} />
                )}
              </span>
            </button> */}
          </div>
        </div>
        {isHighLevelCollapsed && <UpperBar />}
        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-[9px] text-gray-400 text-sm" />
            <Input
              placeholder="Search"
              className="h-8 w-52 rounded-full pl-9 text-sm border-gray-200 focus-visible:ring-0"
            />
          </div>

          {/* Notification */}
          <div className="relative cursor-pointer">
            <FiBell className="text-gray-600 text-[18px]" />
            <span className="absolute -top-1 -right-1 h-[6px] w-[6px] bg-red-500 rounded-full" />
          </div>

          {/* AI Assistant */}
          <Button size="sm" className="text-xs">
            <Sparkles className="h-3 w-3 " />
            Ai Assistant
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent"
              >
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
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={10}
              className="w-56 rounded-xl border bg-background shadow-lg p-1"
            >
              <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
                <div className="flex flex-col leading-tight px-2">
                  <span className="text-sm font-medium capitalize">
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

          {/* <DropdownMenuItem
                onClick={handleSignOut}
                className="rounded-md text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </header>

      <div className="flex h-[92vh] bg-[#e8e9eb] text-foreground overflow-hidden">
        <HighLevelSidebar
          user={user}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        {isHighLevelCollapsed && (
          <Sidebar
            onTenantChange={onTenantChange}
            onWebsiteChange={onWebsiteChange}
            collapsed={false}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onAgencyChage={onAgencyChage}
          />
        )}

        <div className="flex  flex-col w-full">
          <div className=" px-3 py-4 md:px-6 md:py-6 overflow-auto ">
            <div className="mx-auto">{children}</div>
          </div>
        </div>

        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle className="text-sm font-semibold">
                Navigation
              </SheetTitle>
            </SheetHeader>
            <MobileSidebar
              websites={websites}
              currentWebsite={currentWebsite}
              user={user}
              onWebsiteChange={(websiteId) => {
                onWebsiteChange(websiteId);
                setMobileSidebarOpen(false);
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
