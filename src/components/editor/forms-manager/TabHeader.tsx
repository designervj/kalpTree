import * as React from "react";
import { X } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function TabHeader() {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight">
                    Contact form settings
                </h3>
            </div>
            <DialogClose asChild>
                <button
                    className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700",
                        "hover:bg-slate-50"
                    )}
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </DialogClose>
        </div>
    );
}
