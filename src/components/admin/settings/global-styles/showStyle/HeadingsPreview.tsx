import React from "react";
import PreviewHeader from "./PreviewHeader";
import {
    BrandColors,
    LeftTab,
    HeadingKey,
    HeadingStyle
} from "../GlobalStyleModal";

interface HeadingsPreviewProps {
    uiPalette: {
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
    headingBaseSize: number;
}

const HeadingsPreview = ({
    uiPalette,
    mode,
    brand,
    headingFontFamily,
    headings,
    headingPx,
    leftTab,
    onLeftTab,
    cardPreviewStyle,
    headingBaseSize,
}: HeadingsPreviewProps) => {
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

            <div className="mt-6">
                <div className="text-sm font-semibold" style={{ color: uiPalette.text }}>
                    Typography Preview
                </div>
                <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
                    Change font family / sliders → yahan live update.
                </div>

                <div
                    className="mt-4 rounded-2xl border p-5"
                    style={{
                        ...cardPreviewStyle,
                        background: mode === "light" ? "#FFFFFF" : uiPalette.surface,
                    }}
                >
                    <div className="space-y-5" style={{ fontFamily: headingFontFamily }}>
                        {(["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).map((k) => {
                            const s = headings[k];
                            const Tag = k as any;
                            return (
                                <div key={k} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono" style={{ color: uiPalette.mutedText }}>
                                            {k.toUpperCase()} / {headingPx(k)}px
                                        </span>
                                        <span className="text-[11px]" style={{ color: uiPalette.mutedText }}>
                                            w:{s.weight} · lh:{s.lineHeight.toFixed(2)} · ls:{s.letterSpacingEm.toFixed(2)}em
                                        </span>
                                    </div>

                                    <Tag
                                        style={{
                                            fontSize: `${headingBaseSize * s.scale}px`,
                                            fontWeight: s.weight,
                                            lineHeight: s.lineHeight,
                                            letterSpacing: `${s.letterSpacingEm}em`,
                                            color: uiPalette.text,
                                        }}
                                    >
                                        {k === "h1" && "Brand typography that feels premium"}
                                        {k === "h2" && "Clean hierarchy for web pages"}
                                        {k === "h3" && "Consistent rhythm + spacing"}
                                        {k === "h4" && "Section title sample"}
                                        {k === "h5" && "Small heading sample"}
                                        {k === "h6" && "Label / micro heading"}
                                    </Tag>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeadingsPreview;
