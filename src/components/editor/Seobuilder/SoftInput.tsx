import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function SoftInput(props: React.ComponentProps<typeof Input>) {
    return (
        <Input
            {...props}
            className={cn(
                "h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400",
                "focus-visible:ring-2 focus-visible:ring-violet-500/40",
                "dark:border-slate-800 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500",
                props.className
            )}
        />
    );
}
