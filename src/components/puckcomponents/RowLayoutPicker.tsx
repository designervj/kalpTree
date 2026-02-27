import React from "react";

interface LayoutOption {
    label: string;
    columns: string;
    icon: number[]; // Ratios for the icon, e.g. [1, 1] for 2 equal columns
}

interface LayoutCategory {
    title: string;
    options: LayoutOption[];
}

const LAYOUTDATA: LayoutCategory[] = [
    {
        title: "Equal Columns",
        options: [
            { label: "1 Column", columns: "1fr", icon: [1] },
            { label: "2 Columns", columns: "1fr 1fr", icon: [1, 1] },
            { label: "3 Columns", columns: "1fr 1fr 1fr", icon: [1, 1, 1] },
            { label: "4 Columns", columns: "1fr 1fr 1fr 1fr", icon: [1, 1, 1, 1] },
            { label: "5 Columns", columns: "1fr 1fr 1fr 1fr 1fr", icon: [1, 1, 1, 1, 1] },
            { label: "6 Columns", columns: "1fr 1fr 1fr 1fr 1fr 1fr", icon: [1, 1, 1, 1, 1, 1] },
        ],
    },
    {
        title: "Offset Columns",
        options: [
            { label: "1/3 - 2/3", columns: "1fr 2fr", icon: [1, 2] },
            { label: "2/3 - 1/3", columns: "2fr 1fr", icon: [2, 1] },
            { label: "1/4 - 3/4", columns: "1fr 3fr", icon: [1, 3] },
            { label: "3/4 - 1/4", columns: "3fr 1fr", icon: [3, 1] },
            { label: "1/4 - 1/2 - 1/4", columns: "1fr 2fr 1fr", icon: [1, 2, 1] },
            { label: "3/5 - 2/5", columns: "3fr 2fr", icon: [3, 2] },
        ],
    },
];

export function RowLayoutPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col gap-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl overflow-y-auto max-h-[500px]">
            {LAYOUTDATA.map((category) => (
                <div key={category.title} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            Flex
                        </span>
                        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            {category.title}
                        </h3>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {category.options.map((option) => {
                            const isActive = value === option.columns;
                            return (
                                <button
                                    key={option.label}
                                    onClick={() => onChange(option.columns)}
                                    className={`group relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all duration-200 ${isActive
                                            ? "border-blue-500 bg-blue-50/50 shadow-md"
                                            : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                                        }`}
                                    title={option.label}
                                >
                                    <div className="w-full h-10 flex gap-0.5 bg-slate-200/50 rounded-md overflow-hidden p-1">
                                        {option.icon.map((ratio, i) => (
                                            <div
                                                key={i}
                                                className={`h-full rounded-sm transition-colors ${isActive ? "bg-blue-400" : "bg-slate-300 group-hover:bg-slate-400"
                                                    }`}
                                                style={{ flex: ratio }}
                                            />
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
