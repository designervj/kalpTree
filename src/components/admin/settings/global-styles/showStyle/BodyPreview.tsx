import React from "react";
import PreviewHeader from "./PreviewHeader";
import { rgba } from "../util/ColorFunction";
import {
    BrandColors,
    LeftTab,
    HeadingKey,
    HeadingStyle,
    BodyStyle
} from "../GlobalStyleModal";

interface BodyPreviewProps {
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
    body: BodyStyle;
    globalFontFamily: string;
}

const BodyPreview = ({
    uiPalette,
    mode,
    brand,
    headingFontFamily,
    headings,
    headingPx,
    leftTab,
    onLeftTab,
    cardPreviewStyle,
    body,
    globalFontFamily,
}: BodyPreviewProps) => {
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
                    Body Preview
                </div>
                <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
                    Paragraph spacing + max-width live.
                </div>

                <div className="mt-4" style={{ maxWidth: `${body.maxWidthCh}ch` }}>
                    <div className="text-xs font-mono" style={{ color: uiPalette.mutedText }}>
                        Body / {body.sizePx}px · w:{body.weight} · lh:{body.lineHeight.toFixed(2)} · ls:{body.letterSpacingEm.toFixed(2)}em
                    </div>

                    <div
                        className="mt-3"
                        style={{
                            fontSize: `${body.sizePx}px`,
                            fontWeight: body.weight,
                            lineHeight: body.lineHeight,
                            letterSpacing: `${body.letterSpacingEm}em`,
                            color: uiPalette.text,
                            fontFamily: globalFontFamily,
                        }}
                    >
                        <p style={{ marginBottom: body.paragraphGapPx, color: uiPalette.mutedText }}>
                            Tokens-based system: aap jo left side change karte ho (colors / fonts / sizes), woh instantly is preview me reflect hota hai.
                        </p>
                        <p style={{ color: uiPalette.mutedText }}>
                            Isse user ko samajhne me asaani hoti hai ki actual website pages ka look & feel kaisa hoga.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyPreview;
