import * as React from "react";
import { cn } from "@/lib/utils";
import { ACCENT } from "./constants";

export function IconRadio({
    checked,
    title,
    desc,
}: {
    checked: boolean;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex items-start gap-3">
            {/* Radio Icon */}
            <div
                className={cn(
                    "relative mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center",
                    checked ? "border-transparent" : "border-slate-400"
                )}
                style={checked ? { backgroundColor: ACCENT } : undefined}
            >
                {checked && (
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
            </div>

            {/* Text */}
            <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 leading-tight">
                    {title}
                </div>
                <p className="text-[12px] text-slate-500 leading-snug">
                    {desc}
                </p>
            </div>
        </div>
    );
}
