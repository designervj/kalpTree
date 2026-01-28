"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PAGES } from "./constants";
import { Sidebar } from "./Sidebar";
import { SeoEditor } from "./SeoEditor";

export default function SeobuilderPage() {
  const [selectedId, setSelectedId] = React.useState(PAGES[5]?.id ?? "home");
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const pageName = React.useMemo(
    () => PAGES.find((p) => p.id === selectedId)?.name ?? "Page",
    [selectedId]
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR */}
        <div className="w-[320px] ">
          <Sidebar selectedId={selectedId} onSelect={handleSelect} />
        </div>

        {/* RIGHT EMPTY AREA (behind the offcanvas) */}
        <div className="flex-1" />
      </div>

      {/* OFFCANVAS: opens when page clicked */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="left"
          className={cn(
            "p-0 w-[420px] sm:w-[520px]",
            "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
          )}
        >
          <SheetHeader className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <SheetTitle className="text-left">SEO – {pageName}</SheetTitle>
          </SheetHeader>

          <SeoEditor pageName={pageName} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
