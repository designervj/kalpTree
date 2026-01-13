"use client";

import * as React from "react";
import Link from "next/link";

import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";

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
  Plus,
  Pencil,
  Search,
  Settings,
  FileText,
  Image as ImageIcon,
  ShoppingBag,
  UserPlus,
  Wrench,
  Sparkles,
} from "lucide-react";
import { BsBoxArrowRight, BsGear, BsPersonCircle, BsSpeedometer2, BsStars } from "react-icons/bs";
import { IUser } from "@/models/user";
import { Website } from "@/components/admin/AppShell";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";

export default function WpAdminEditorBar({
  pageData,user,currentWebsite
}: {
  pageData: WebsitePageModel;
  user:IUser
  currentWebsite: Website
}) {

const router= useRouter()
  const dispatch=useDispatch<AppDispatch>()

  // ✅ Fix: pageData.id may not exist in your type
  const pageId =
    (pageData as any)?._id ?? (pageData as any)?.id ?? (pageData as any)?.pageId ?? "";


  const handleEditInBuilder = () => {
     dispatch(setPageEdit(pageData));
     router.push(pageData?.slug ? `/${pageData.slug}/builder` : "/builder");
  };

  const handleEditInAdmin = () => {
    // // adjust as per your admin route
    // if (!pageId) return;
    // router.push(`/admin/websites/pages/${pageId}`);
  };

  return (
    <TooltipProvider delayDuration={120}>
      <header
        className="
          w-full h-10
          bg-gradient-to-b from-[#2a3138] to-[#1f252b]
          text-slate-200
          border-b border-white/10
          shadow-[0_1px_0_rgba(255,255,255,0.06)]
          sticky top-0 z-50 px-4
        "
      >
        <div className="h-full flex items-center justify-between gap-2">
          {/* LEFT */}
          <div className="flex items-center gap-1 min-w-0">
            <img
              src="/dzinly-favicon.svg"
              alt="Dzinly"
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

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Create
                </DropdownMenuLabel>

                <Link href="/admin/pages/new">
                  <DropdownMenuItem className="gap-2">
                    <FileText className="h-4 w-4" /> Page
                  </DropdownMenuItem>
                </Link>

                <Link href="/admin/posts/new">
                  <DropdownMenuItem className="gap-2">
                    <FileText className="h-4 w-4" /> Post
                  </DropdownMenuItem>
                </Link>

                <Link href="/admin/products/new">
                  <DropdownMenuItem className="gap-2">
                    <ShoppingBag className="h-4 w-4" /> Product
                  </DropdownMenuItem>
                </Link>

                <Link href="/admin/media">
                  <DropdownMenuItem className="gap-2">
                    <ImageIcon className="h-4 w-4" /> Media
                  </DropdownMenuItem>
                </Link>

                <Link href="/admin/users/new">
                  <DropdownMenuItem className="gap-2">
                    <UserPlus className="h-4 w-4" /> User
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* EDIT */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-8 px-2 rounded-sm flex items-center gap-2 hover:bg-[#2c3338] text-[13px] font-medium"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-60">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Editing
                </DropdownMenuLabel>

                <DropdownMenuItem
                  className="gap-2"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleEditInAdmin();
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit in Admin
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="gap-2"
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
                  <DropdownMenuItem className="gap-2">
                    <Settings className="h-4 w-4" />
                    Page Settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick action */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleEditInBuilder}
              className="h-8 px-2 rounded-sm hover:bg-[#2c3338] text-[#c3c4c7] hover:text-white text-[13px] font-semibold"
              title="Edit this page in Builder"
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

              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Search
                </DropdownMenuLabel>
                <div className="p-2">
                  <Input
                    placeholder="Search pages, posts, products..."
                    className="h-9"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Tip: add global search later (Cmd+K) if needed.
                  </p>
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
                  <span className="hidden sm:inline">Hello, {user?.name}</span>
                  <span className="sm:hidden">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {/* <Link href="/admin/dashboard"> */}
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {currentWebsite?.name}
                  </DropdownMenuLabel>
                {/* </Link> */}

             
              <Link href="/admin/dashboard">
  <DropdownMenuItem className="gap-2 font-semibold">
    <BsSpeedometer2 className="text-[16px] opacity-90" />
    Dashboard
  </DropdownMenuItem>
</Link>

<DropdownMenuSeparator />

<Link href="/admin/profile">
  <DropdownMenuItem className="gap-2 font-semibold">
    <BsPersonCircle className="text-[16px] opacity-90" />
    Profile
  </DropdownMenuItem>
</Link>

<DropdownMenuSeparator />

<Link href={`/admin/websites/${pageData?.websiteId || ""}/settings`}>
  <DropdownMenuItem className="gap-2 font-semibold">
    <BsGear className="text-[16px] opacity-90" />
    Website Settings
  </DropdownMenuItem>
</Link>

<DropdownMenuItem className="gap-2 font-semibold">
  <BsStars className="text-[16px] opacity-90" />
  LLM Setting:
  <span className="ml-1 text-xs opacity-80">
    {/* {currentLLMSetting ? "Loaded" : "Not loaded"} */}
  </span>
</DropdownMenuItem>

<DropdownMenuSeparator />

<DropdownMenuItem className="gap-2 text-red-600 font-semibold">
  <BsBoxArrowRight className="text-[16px] opacity-90" />
  Log Out
</DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}

/* ----------------- Small UI helpers ----------------- */

function BarIconOnly({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
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


