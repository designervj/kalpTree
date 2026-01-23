"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

// shadcn
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// icons
import {
  ChevronDown,
  ChevronRight,
  Search,
  CheckCircle2,
  Plus,
  LayoutGrid,
  Palette,
  Sparkles,
  ShoppingCart,
  MoreHorizontal,
  MessageSquare,
  Home,
  FileText,
  Store,
  Shield,
  File,
  X,
  Pencil,
  Settings,
  Image as ImageIcon,
  ShoppingBag,
  UserPlus,
  Wrench,
} from "lucide-react";
import {
  BsBoxArrowRight,
  BsGear,
  BsPersonCircle,
  BsSpeedometer2,
  BsStars,
} from "react-icons/bs";

// ✅ keep these imports as in your project
import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";
import { AppDispatch } from "@/store/store";
import { IUser } from "@/models/user";
import { Website } from "@/components/admin/AppShell";

/**
 * ✅ FIXED LAYOUT (proper spacing + full look)
 * - Header fixed (40px)
 * - Rail fixed below header
 * - Panel fixed below header
 * - Content is FIXED and fills remaining viewport (no big white empty area)
 */
const HEADER_H = 40;
const RAIL_W = 92;
const PANEL_W = 360;

export default function BuilderSidebarLayout({
  children,
  defaultOpenKey = "seo",
  user,
  currentWebsite,
  pageData,
  type,
}: {
  children?: React.ReactNode;
  defaultOpenKey?: SidebarKey | null;
  user: IUser | null;
  currentWebsite: Website | null;
  pageData: WebsitePageModel | TemplateDocument;
  type: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [openKey, setOpenKey] = React.useState<SidebarKey | null>(defaultOpenKey);

  const activeKeyFromPath = React.useMemo(() => {
    const p = pathname || "";
    if (p.includes("/builder/seo")) return "seo";
    if (p.includes("/builder/setup")) return "setup";
    if (p.includes("/builder/elements")) return "elements";
    if (p.includes("/builder/pages")) return "pages";
    if (p.includes("/builder/styles")) return "styles";
    if (p.includes("/builder/ai-tools")) return "ai";
    if (p.includes("/builder/store")) return "store";
    if (p.includes("/builder/more")) return "more";
    return null;
  }, [pathname]);

  React.useEffect(() => {
    if (activeKeyFromPath) setOpenKey(activeKeyFromPath);
  }, [activeKeyFromPath]);

  // ✅ Fix: pageData.id may not exist in your type
  const pageId =
    (pageData as any)?._id ??
    (pageData as any)?.id ??
    (pageData as any)?.pageId ??
    "";

  const safeName = user?.name || "User";

  const handleEditInBuilder = () => {
    dispatch(
      setPageEdit({
        page: JSON.parse(JSON.stringify(pageData)),
        type,
      })
    );

    const lang = currentWebsite?.lang ? currentWebsite.lang[0].name : "en";
    const slug = (pageData as any)?.slug ? (pageData as any).slug : "";
    router.push(slug ? `/${lang}/${slug}/builder` : "/builder");
  };

  const railItems: RailItem[] = [
    { key: "setup", label: "Setup", icon: <CheckCircle2 className="h-5 w-5" /> },
    { key: "elements", label: "Elements", icon: <Plus className="h-5 w-5" /> },
    { key: "pages", label: "Pages", icon: <LayoutGrid className="h-5 w-5" /> },
    { key: "styles", label: "Styles", icon: <Palette className="h-5 w-5" /> },
    { key: "ai", label: "AI tools", icon: <Sparkles className="h-5 w-5" /> },
    { key: "divider", label: "", icon: null as any },
    { key: "store", label: "Store", icon: <ShoppingCart className="h-5 w-5" /> },
    { key: "seo", label: "SEO", icon: <Search className="h-5 w-5" /> },
    { key: "more", label: "More", icon: <MoreHorizontal className="h-5 w-5" /> },
  ];

  const contentLeft = RAIL_W + (openKey ? PANEL_W : 0);

  return (
    <TooltipProvider delayDuration={120}>
      {/* ================= TOP HEADER ================= */}
      <header
        className="
          fixed top-0 left-0 right-0
          h-10
          bg-gradient-to-b from-[#2a3138] to-[#1f252b]
          text-slate-200
          border-b border-white/10
          shadow-[0_1px_0_rgba(255,255,255,0.06)]
          z-[200]
          px-4
        "
      >
        <div className="h-full flex items-center justify-between gap-2">
          {/* LEFT */}
          <div className="flex items-center gap-1 min-w-0">
            <img
              src="/dzinly-favicon.svg"
              alt="KalpTree"
              className="w-[28px] h-[28px]"
            />

            <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />

            {/* NEW */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-8 px-2 rounded-sm flex items-center gap-2 hover:bg-[#2c3338] text-[13px] font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>New</span>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 z-[300]">
                <DropdownMenuLabel className="text-xs text-muted-foreground"  style={{padding:"4px", margin:"4px", paddingLeft:"10px"}}> 
                  Create
                </DropdownMenuLabel>

                <Link href="/admin/pages/new">
                  <DropdownMenuItem className="gap-2"  style={{padding:"4px", margin:"4px", paddingLeft:"10px"}}>
                    <FileText className="h-4 w-4" /> Page
                  </DropdownMenuItem>
                </Link>

                <Link href="/admin/posts/new">
                  <DropdownMenuItem className="gap-2"  style={{padding:"4px", margin:"4px", paddingLeft:"10px"}}>
                    <FileText className="h-4 w-4" /> Post
                  </DropdownMenuItem>
                </Link>

                <Link href="/admin/products/new">
                  <DropdownMenuItem className="gap-2"  style={{padding:"4px", margin:"4px", paddingLeft:"10px"}}>
                    <ShoppingBag className="h-4 w-4" /> Product
                  </DropdownMenuItem>
                </Link>

                <Link href="/admin/media">
                  <DropdownMenuItem className="gap-2"  style={{padding:"4px", margin:"4px", paddingLeft:"10px"}}>
                    <ImageIcon className="h-4 w-4" /> Media
                  </DropdownMenuItem>
                </Link>

                <Link href="/admin/users/new">
                  <DropdownMenuItem className="gap-2"  style={{padding:"4px", margin:"4px", paddingLeft:"10px"}}>
                    <UserPlus className="h-4 w-4" /> User
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* EDIT */}
           {user?.role == "superadmin" ||
           user?.role == "business" ||
           user?.role == "agency" &&
           <DropdownMenu 
            
            >
              <DropdownMenuTrigger asChild 
             
              >
                <button
                  type="button"
                  className="h-8 px-2 rounded-sm flex items-center gap-2 hover:bg-[#2c3338] text-[13px] font-medium"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64 z-[300]">
                <DropdownMenuLabel className="text-xs text-muted-foreground" style={{paddingLeft:"10px", paddingRight:"10px", paddingTop:"10px", }}>
                  Editing
                </DropdownMenuLabel>

                <DropdownMenuItem className="gap-2"  style={{padding:"4px", margin:"4px"}}>
                  <Pencil className="h-4 w-4" />
                  Edit in Admin
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="gap-2"
                 style={{padding:"4px", margin:"4px"}}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleEditInBuilder();
                  }}
                >
                  <Wrench className="h-4 w-4" />
                  Edit in Builder
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <Link href={`/admin/pages/${pageId}/settings`}>
                  <DropdownMenuItem className="gap-2" style={{padding:"4px", margin:"4px"}}>
                    <Settings className="h-4 w-4" />
                    Page Settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleEditInBuilder}
              className="h-8 px-2 rounded-sm hover:bg-[#2c3338] text-[#c3c4c7] hover:text-white text-[13px] font-semibold"
            >
              Edit in Builder
            </Button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1">
            {/* Search dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <BarIconOnly label="Search" icon={<Search className="h-4 w-4" />} />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 z-[300]">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Search
                </DropdownMenuLabel>
                <div className="p-2">
                  <Input placeholder="Search pages, posts, products..." className="h-9" />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-8 px-2 rounded-sm flex items-center gap-2 hover:bg-[#2c3338] text-[13px] font-medium"
                  type="button"
                >
                  <span className="hidden sm:inline">Hello, {safeName}</span>
                  <span className="sm:hidden">{safeName}</span>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 z-[300]">
                <DropdownMenuLabel className="text-xs text-muted-foreground"  style={{padding:"4px", margin:"4px"}}>
                  {currentWebsite?.name || "Website"}
                </DropdownMenuLabel>

                <Link href="/admin/dashboard">
                  <DropdownMenuItem className="gap-2 font-semibold"  style={{padding:"4px", margin:"4px"}}>
                    <BsSpeedometer2 className="text-[16px] opacity-90" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <Link href="/admin/profile">
                  <DropdownMenuItem className="gap-2 font-semibold "  style={{padding:"4px", margin:"4px"}}>
                    <BsPersonCircle className="text-[16px] opacity-90" />
                    Profile
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="gap-2 font-semibold"  style={{padding:"4px", margin:"4px"}}>
                  <BsGear className="text-[16px] opacity-90" />
                  Website Settings
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-2 font-semibold"  style={{padding:"4px", margin:"4px"}}>
                  <BsStars className="text-[16px] opacity-90" />
                  LLM Setting
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="gap-2 text-red-600 font-semibold"  style={{padding:"4px", margin:"4px"}}>
                  <BsBoxArrowRight className="text-[16px] opacity-90" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ================= LEFT ICON RAIL ================= */}
      <aside
        className="
          fixed left-0 
          top-10
          h-[calc(100vh-40px)]
          w-[92px]
          bg-white
          border-r border-slate-200
          z-[120]
          flex flex-col
          py-3
        "
        style={{
          paddingLeft:"10px", paddingRight:"10px", paddingTop:"10px",
        }}
      >
        <div className="px-4 py-4 grid gap-1 ">
          {railItems.map((it, idx) => {
            if (it.key === "divider") {
              return <Separator key={`div-${idx}`} className="my-2" />;
            }
            return (
              <RailButton
                key={it.key}
                label={it.label}
                icon={it.icon}
                active={openKey === it.key}
                onClick={() => setOpenKey((prev) => (prev === it.key ? null : it.key))}
              />
            );
          })}
        </div>

        <div className="mt-auto px-2 pb-2">
          <RailButton
            label="Feedback"
            icon={<MessageSquare className="h-5 w-5" />}
            active={openKey === "feedback"}
            onClick={() => setOpenKey((prev) => (prev === "feedback" ? null : "feedback"))}
          />
        </div>
      </aside>

      {/* ================= SECOND PANEL ================= */}
      <SecondPanel openKey={openKey} onClose={() => setOpenKey(null)} />

      {/* ================= CONTENT (FULL HEIGHT / NO GAP) ================= */}
      <main
        style={{
          position: "fixed",
          top: HEADER_H,
          left: contentLeft,
          right: 0,
          bottom: 0,
          overflow: "auto",
          background: "#f8fafc",
        }}
      >
        {/* Optional: add padding for normal pages. For iframe/canvas, remove p-4 */}
        <div className="min-h-full p-4">{children}</div>
      </main>
    </TooltipProvider>
  );
}

/* ---------------- Panel ---------------- */

function SecondPanel({
  openKey,
  onClose,
}: {
  openKey: SidebarKey | null;
  onClose: () => void;
}) {
  const show = Boolean(openKey);

  return (
    <div
      className={[
        "fixed left-[92px] top-10 px-4",
        "h-[calc(100vh-40px)] w-[360px]",
        "bg-white border-r border-slate-200 z-[110]",
        "transition-transform duration-200 ease-out",
        show ? "translate-x-0" : "-translate-x-[380px]",
      ].join(" ")}
      style={{
        paddingLeft:"10px", paddingRight: "10px",
      }}
    >
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="font-semibold text-slate-900">{panelTitle(openKey)}</div>

        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-[calc(100%-56px)] overflow-y-auto">
        {openKey === "seo" ? <SeoPanel /> : null}
        {openKey === "pages" ? <PagesPanel /> : null}
        {openKey === "store" ? <StorePanel /> : null}
        {openKey === "setup" ? (
          <SimplePanel icon={<CheckCircle2 className="h-4 w-4" />} title="Setup" desc="Project setup options." />
        ) : null}
        {openKey === "elements" ? (
          <SimplePanel icon={<Plus className="h-4 w-4" />} title="Elements" desc="Add blocks and widgets." />
        ) : null}
        {openKey === "styles" ? (
          <SimplePanel icon={<Palette className="h-4 w-4" />} title="Styles" desc="Theme + typography + colors." />
        ) : null}
        {openKey === "ai" ? (
          <SimplePanel icon={<Sparkles className="h-4 w-4" />} title="AI tools" desc="AI assistance tools list." />
        ) : null}
        {openKey === "more" ? (
          <SimplePanel icon={<MoreHorizontal className="h-4 w-4" />} title="More" desc="More settings and utilities." />
        ) : null}
        {openKey === "feedback" ? (
          <SimplePanel icon={<MessageSquare className="h-4 w-4" />} title="Feedback" desc="Send feedback to team." />
        ) : null}
      </div>
    </div>
  );
}

function panelTitle(openKey: SidebarKey | null) {
  switch (openKey) {
    case "seo":
      return "Let’s be found on Google (SEO)";
    case "pages":
      return "Pages";
    case "store":
      return "Store";
    case "setup":
      return "Setup";
    case "elements":
      return "Elements";
    case "styles":
      return "Styles";
    case "ai":
      return "AI tools";
    case "more":
      return "More";
    case "feedback":
      return "Feedback";
    default:
      return "";
  }
}

/* ---------------- SEO Panel ---------------- */

function SeoPanel() {
  const [q, setQ] = React.useState("");
  const [mainOpen, setMainOpen] = React.useState(true);

  const pages = React.useMemo(
    () => [
      { label: "Home", icon: <Home className="h-4 w-4" />, status: "warn" as const },
      { label: "Shop", icon: <Store className="h-4 w-4" />, status: "warn" as const },
      { label: "Products", icon: <ShoppingCart className="h-4 w-4" />, status: "warn" as const },
      { label: "Terms & conditions", icon: <Shield className="h-4 w-4" />, status: "warn" as const },
    ],
    []
  );

  const filtered = pages.filter((p) => p.label.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="p-3 space-y-3">
      <button
        type="button"
        className="w-full flex items-center gap-3 rounded-xl bg-violet-50 border border-violet-100 px-3 py-3 text-left"
              style={{paddingTop:"15px"}}
        
      >
        <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-slate-900">Website overview</div>
        </div>
      </button>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setMainOpen((v) => !v)}
          className="w-full px-3 py-3 flex items-center justify-between"
        >
          <div className="font-medium text-slate-900">Main pages</div>
          {mainOpen ? (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {mainOpen && (
          <div className="px-3 pb-3 space-y-2">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pages..."
                className="pl-9 h-10"
              />
            </div>

            <div className="space-y-1">
              {filtered.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 text-left 1"
                        style={{paddingTop:"15px"}}
                >
                  <StatusDot status={p.status} />
                  <div className="flex items-center gap-2 text-slate-900">
                    {p.icon}
                    <span className="text-[14px]">{p.label}</span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 ? (
                <div className="text-sm text-slate-500 px-2 py-3">No pages found.</div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Other panels ---------------- */

function PagesPanel() {
  return (
    <div className="p-3 space-y-2">
      <PanelRow icon={<FileText className="h-4 w-4" />} label="All pages" />
      <PanelRow icon={<Home className="h-4 w-4" />} label="Homepage" />
      <PanelRow icon={<File className="h-4 w-4" />} label="Drafts" />
    </div>
  );
}

function StorePanel() {
  return (
    <div className="p-3 space-y-2">
      <PanelRow icon={<ShoppingCart className="h-4 w-4" />} label="Products" />
      <PanelRow icon={<Store className="h-4 w-4" />} label="Orders" />
      <PanelRow icon={<Shield className="h-4 w-4" />} label="Payments" />
    </div>
  );
}

function SimplePanel({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-slate-900 font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

/* ---------------- UI helpers ---------------- */

function BarIconOnly({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 px-0 rounded-sm hover:bg-[#2c3338] text-[#c3c4c7] hover:text-white"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}

function RailButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full",
        "flex flex-col items-center justify-center",
        "gap-1.5",
        "px-2 py-3",
        "rounded-xl",
        "transition-colors",
        active ? "bg-violet-50" : "hover:bg-slate-50",
      ].join(" ")}
      style={{paddingTop:"5px", paddingBottom:"10px"}}
    >
      <div
        className={[
          "h-10 w-10 rounded-full",
          "flex items-center justify-center",
          active ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-700",
        ].join(" ")}
        // style={{paddingTop:"10px"}}
      >
        {icon}
      </div>
      <div className={["text-[12px] font-medium leading-none", active ? "text-violet-700" : "text-slate-700"].join(" ")}>
        {label}
      </div>
    </button>
  );
}

function StatusDot({ status }: { status: "warn" | "ok" }) {
  return (
    <span
      className={[
        "h-2.5 w-2.5 rounded-full",
        status === "ok" ? "bg-emerald-500" : "bg-amber-500",
      ].join(" ")}
    />
  );
}

function PanelRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-50 text-left 1"
      

    >
      <div className="text-slate-600">{icon}</div>
      <div className="text-[14px] text-slate-900">{label}</div>
    </button>
  );
}

/* ---------------- Types ---------------- */

type SidebarKey =
  | "setup"
  | "elements"
  | "pages"
  | "styles"
  | "ai"
  | "store"
  | "seo"
  | "more"
  | "feedback";

type RailItem =
  | {
      key: SidebarKey;
      label: string;
      icon: React.ReactNode;
    }
  | {
      key: "divider";
      label: string;
      icon: React.ReactNode;
    };
