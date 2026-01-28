import * as React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ValidationRow({
    type,
    children,
}: {
    type: "ok" | "warn";
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-2 text-sm">
            {type === "ok" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
            )}
            <div className="text-slate-700 dark:text-slate-200">{children}</div>
        </div>
    );
}
