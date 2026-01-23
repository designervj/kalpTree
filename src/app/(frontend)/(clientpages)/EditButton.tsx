"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

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
  Plus,

  FileText,
  
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
import { AppDispatch, RootState } from "@/store/store";
import { IUser } from "@/models/user";
import { Website } from "@/components/admin/AppShell";
import { useMemo } from "react";



export default function BuilderSidebarLayout({
  user,
  currentWebsite,
  pageData,
  type,
}: {

  user: IUser | null;
  currentWebsite: Website | null;
  pageData: WebsitePageModel | TemplateDocument;
  type: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {user:reduxUser} = useSelector((state: RootState) => state.user);


  const currentUser = useMemo(() => {
    return user || reduxUser;
  }, [user, reduxUser]);  


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

   console.log("user--", user)

  return (
    <>
 { user &&
 (user.role === "superadmin" || user.role === "business" || user.role === "agency" )&&
 <TooltipProvider delayDuration={120}>
      {/* ================= TOP HEADER ================= */}
      <div
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
           {
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
      </div>

    
    </TooltipProvider>}
    </>
  );
}



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