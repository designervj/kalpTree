import { useDispatch } from "react-redux";
import { User, Website } from "../AppShell";
import { signOut } from "next-auth/react";
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";
// import { clearSegments } from "@/hooks/slices/segment/SegmentSlice";
import { clearCategories } from "@/hooks/slices/category/CategorySlice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { Bell, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type TopbarProps = {
  currentWebsite: Website | null;
  user: User | null;
  onToggleMobileSidebar: () => void;
  collapsed: boolean;
  onToggleCollapse: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

export function Topbar({
  currentWebsite,
  user,
  onToggleMobileSidebar,
  collapsed,
  onToggleCollapse,
}: TopbarProps) {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      resetRedux();
      localStorage.clear();
      sessionStorage.clear();

      const res = await fetch("/api/appshell-data", {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        await signOut({ callbackUrl: "/", redirect: true });
      }
    } catch (error) {
      console.error("Error during sign out:", error);
      await signOut({ callbackUrl: "/" });
    }
  };

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    // dispatch(clearSegments());
    dispatch(clearCategories());
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/80 px-8 backdrop-blur md:h-16 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3">
        {/* SIDEBAR COLLAPSE BUTTON */}
        <div className="border-none border-black/10 p-3">
          <Button
            variant="ghost"
            onClick={onToggleCollapse}
            // size={"xl"}
            className={cn(
              "w-full justify-between  hover:bg-transparent",
              "border-e border-black/5 bg-transparent rounded-none  text-black/70 "
            )}
          >
            {!collapsed ? (
              <>
                {/* <span className="text-xs font-medium">Collapse</span> */}
                {/* <FaChevronCircleLeft className="h-6 w-6" /> */}
                <GoSidebarExpand className="h-14 w-14 " size={48} />
              </>
            ) : (
              <>
                {/* <span className="sr-only">Expand</span> */}
                {/* <FaChevronCircleRight  /> */}
                <GoSidebarCollapse className="h-14 w-14  mx-auto" size={48} />
              </>
            )}
          </Button>
        </div>

        <div className="hidden text-sm font-medium text-black md:inline">
          Dashboard
        </div>

        {currentWebsite && (
          <div className="flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
              {currentWebsite.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden md:inline">{currentWebsite.name}</span>
            <span className="hidden text-[11px] text-muted-foreground/80 sm:inline">
              {currentWebsite.primaryDomain || currentWebsite.systemSubdomain}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60" />

          <Input
            type="search"
            placeholder="Search"
            className=" pl-9 h-8 bg-white/70  border border-black/10 rounded-sm focus-visible:ring-1"
          />
        </div>

        <Button variant="outline" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        <Button size="sm" className="text-xs">
          <Sparkles className="h-3 w-3 " />
          Ai Assistant
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 pt-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-white rounded-md shadow-md w-40"
          >
            <DropdownMenuLabel className="hover:bg-primary hover:text-white p-2">
              {user?.email || "User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-primary hover:text-white p-2">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary hover:text-white p-2">
              Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-primary hover:text-white p-2"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
