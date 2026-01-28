import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export function SoftTextarea(props: React.ComponentProps<typeof Textarea>) {
    return (
        <Textarea
            {...props}
            className={cn(
                "min-h-[130px] rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400",
                "focus-visible:ring-2 focus-visible:ring-violet-500/40",
                "dark:border-slate-800 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500",
                props.className
            )}
        />
    );
}
