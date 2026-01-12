import { usePathname } from "next/navigation";
import { currentWebsiteSections, sectionIconMap, useHasPermission, User, Website } from "../AppShell";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronDown, ChevronRight, LayoutDashboard, LayoutGrid, Link } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/models/user";

type MobileSidebarProps = {
  websites: Website[];
  currentWebsite: Website | null;
  user: User | IUser | null;
  onWebsiteChange: (websiteId: string) => void;
};


const ease = [0.22, 1, 0.36, 1] as const;


export function MobileSidebar({
  websites,
  currentWebsite,
  user,
  onWebsiteChange,
}: MobileSidebarProps) {
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

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      filteredWebsiteSections.forEach((s, idx) => (init[s.id] = idx === 0));
      return init;
    }
  );

  return (
    <div className="flex flex-col h-full">
      {websites.length > 0 && (
        <div className="p-3 border-b">
          <Select
            value={currentWebsite?._id?.toString() || ""}
            onValueChange={onWebsiteChange}
          >
            <SelectTrigger className="h-10 w-full rounded-md">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              {websites.map((site) => (
                <SelectItem key={site._id?.toString()} value={site._id?.toString() || ""}>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{site.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {site.primaryDomain || site.systemSubdomain}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {!currentWebsite ? (
            <div className="text-sm text-muted-foreground px-2 py-4">
              Select website
            </div>
          ) : (
            filteredWebsiteSections.map((section) => {
              const HeaderIcon = sectionIconMap[section.id] || LayoutDashboard;
              const isOpen = !!openGroups[section.id];

              return (
                <div
                  key={section.id}
                  className="rounded-md border bg-muted/10 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((p) => ({ ...p, [section.id]: !isOpen }))
                    }
                    className="w-full flex items-center justify-between px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-background border">
                        <LayoutGrid className="h-4 w-4 text-black/70" />
                      </div>
                      <div className="text-sm font-semibold">
                        {section.label}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-60" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: { duration: 0.2, ease },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: { duration: 0.14, ease },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 space-y-1">
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
                                      ? "bg-background shadow-sm"
                                      : "hover:bg-muted"
                                  )}
                                >
                                  <Icon className="h-4 w-4 opacity-70" />
                                  <span className="truncate flex-1">
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] px-1 py-0"
                                    >
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
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
  );
}