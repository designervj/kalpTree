import * as React from "react";

export function SettingRow({
    title,
    desc,
    left,
    right,
}: {
    title: string;
    desc?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    {left}
                    <div className="text-sm font-medium text-slate-900">{title}</div>
                </div>
                {desc ? (
                    <div className="mt-0.5 text-sm text-slate-500">{desc}</div>
                ) : null}
            </div>
            {right ? <div className="shrink-0">{right}</div> : null}
        </div>
    );
}
