import * as React from "react";

export function HelperText({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {children}
        </p>
    );
}
