import * as React from "react";

export function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {children}
        </div>
    );
}
