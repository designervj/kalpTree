import React from "react";
import PreviewHeader from "./PreviewHeader";
import GetBtnVisual from "./GetBtnVisual";
import { rgba } from "../util/ColorFunction";
import {
    BrandColors,
    LeftTab,
    HeadingKey,
    HeadingStyle,
    BtnKey,
    ButtonBaseStyle,
    ButtonColors
} from "../GlobalStyleModal";

interface ButtonsPreviewProps {
    uiPalette: {
        bg: string;
        surface: string;
        text: string;
        mutedText: string;
        border: string;
    };
    mode: string;
    brand: BrandColors;
    headingFontFamily: string;
    headings: Record<HeadingKey, HeadingStyle>;
    headingPx: (k: HeadingKey) => number;
    leftTab: LeftTab;
    onLeftTab: (t: LeftTab) => void;
    cardPreviewStyle: React.CSSProperties;
    buttonBase: ButtonBaseStyle;
    buttonColors: Record<BtnKey, ButtonColors>;
    hoveredBtn: BtnKey | null;
    setHoveredBtn: (k: BtnKey | null) => void;
}

const ButtonsPreview = ({
    uiPalette,
    mode,
    brand,
    headingFontFamily,
    headings,
    headingPx,
    leftTab,
    onLeftTab,
    cardPreviewStyle,
    buttonBase,
    buttonColors,
    hoveredBtn,
    setHoveredBtn,
}: ButtonsPreviewProps) => {
    return (
        <div className="space-y-6">
            <PreviewHeader
                uiPalette={uiPalette}
                mode={mode}
                brand={brand}
                headingFontFamily={headingFontFamily}
                headings={headings}
                headingPx={headingPx}
                leftTab={leftTab}
                onLeftTab={onLeftTab}
            />

            <div
                className="mt-6 rounded-2xl border p-5"
                style={{ ...cardPreviewStyle, background: rgba(uiPalette.bg, mode === "light" ? 0.6 : 0.15) }}
            >
                <div className="text-sm font-semibold" style={{ color: uiPalette.text }}>
                    Buttons Preview
                </div>
                <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
                    Hover to see hover colors/border.
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => {
                        const label = k === "primary" ? "Primary" : k === "secondary" ? "Secondary" : "Outline";
                        const v = GetBtnVisual({ buttonColors, hoveredBtn, buttonBase, k });
                        return (
                            <button
                                key={k}
                                type="button"
                                className={v.className}
                                style={v.style}
                                onMouseEnter={() => setHoveredBtn(k)}
                                onMouseLeave={() => setHoveredBtn(null)}
                            >
                                {label}
                            </button>
                        );
                    })}

                    {/* 4th button */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background"
                        style={{
                            fontFamily: buttonBase.fontFamily,
                            fontSize: `${buttonBase.sizePx}px`,
                            fontWeight: buttonBase.weight as any,
                            letterSpacing: `${buttonBase.letterSpacingEm}em`,
                            textTransform: buttonBase.transform,
                            height: buttonBase.heightPx,
                            paddingLeft: buttonBase.paddingXPx,
                            paddingRight: buttonBase.paddingXPx,
                            borderRadius: buttonBase.radiusPx,
                            background: "transparent",
                            color: uiPalette.text,
                            border: `${buttonBase.borderWidthPx}px solid transparent`,
                        }}
                    >
                        Ghost
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ButtonsPreview;
