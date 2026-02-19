import React from "react";
import { rgba } from "../util/ColorFunction";
import { BrandColors, LeftTab, HeadingKey, HeadingStyle } from "../GlobalStyleModal";

interface PreviewHeaderProps {
    uiPalette: { border: string };
    mode: string;
    brand: BrandColors;
    headingFontFamily: string;
    headings: Record<HeadingKey, HeadingStyle>;
    headingPx: (k: HeadingKey) => number;
    leftTab: LeftTab;
    onLeftTab: (t: LeftTab) => void;
}

const PreviewHeader = ({
    uiPalette,
    mode,
    brand,
    headingFontFamily,
    headings,
    headingPx,
    leftTab,
    onLeftTab,
}: PreviewHeaderProps) => {
    const tabs = [
        { key: "colors" as const, label: "Colors" },
        { key: "headings" as const, label: "Typography" },
        { key: "body" as const, label: "Design Tokens" },
        { key: "buttons" as const, label: "Preview Gallery" },
    ];

    return (
        <div
            className="rounded-2xl overflow-hidden border"
            style={{
                borderColor: uiPalette.border,
                boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
            }}
        >
            <div
                className="p-6 md:p-7"
                style={{
                    background: mode === "light" ? (brand?.dark || "#0B3A2A") : "#06140F",
                    color: "#FFFFFF",
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold"
                            style={{ borderColor: rgba("#ffffff", 0.35) }}
                        >
                            ✓
                        </span>
                        <div className="leading-tight">
                            <div className="text-xs font-semibold opacity-90">KalpTree</div>
                            <div className="text-[11px] opacity-75">Brand Guidelines</div>
                        </div>
                    </div>

                    <div className="text-[11px] opacity-75">
                        font: <b>{headingFontFamily}</b> • token-driven
                    </div>
                </div>

                <div className="mt-4" style={{ fontFamily: headingFontFamily }}>
                    <div
                        style={{
                            fontSize: `${headingPx("h2")}px`,
                            fontWeight: headings?.h2?.weight,
                            lineHeight: headings?.h2?.lineHeight,
                            letterSpacing: `${headings?.h2?.letterSpacingEm}em`,
                        }}
                    >
                        Brand Guidelines for Web
                    </div>
                    <div className="mt-2 text-sm opacity-85" style={{ maxWidth: 740 }}>
                        Is page ka goal: user ko clearly dikhaana chahiye ki kaunse colors, fonts, aur font sizes use ho rahe hain.
                        Sab kuch root tokens se control hota hai.
                    </div>
                </div>

                {/* ✅ 4 buttons (clickable) */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {tabs.map((t) => {
                        const isActive = leftTab === t.key;
                        return (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => onLeftTab(t.key)}
                                className="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold"
                                style={{
                                    background: isActive ? rgba("#ffffff", 0.16) : rgba("#ffffff", 0.1),
                                    borderColor: rgba("#ffffff", isActive ? 0.38 : 0.22),
                                    color: "#ffffff",
                                }}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PreviewHeader;
