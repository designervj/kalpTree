import * as React from "react";
import { cn } from "@/lib/utils";
import { ACCENT } from "./constants";

export function AnimationCard({
    active,
    title,
    onClick,
}: {
    active: boolean;
    title: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group rounded-2xl border bg-white p-4 text-left transition",
                active ? "border-transparent" : "border-slate-200 hover:bg-slate-50"
            )}
            style={active ? { outline: `2px solid ${ACCENT}` } : undefined}
        >
            <div className="flex h-16 items-center justify-center rounded-md bg-slate-100">
                <div className="h-6 w-16 rounded-md bg-slate-400" />
            </div>
            <div className="mt-3 text-sm font-medium text-slate-900">{title}</div>
        </button>
    );
}
