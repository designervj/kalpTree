import React from "react";
import PreviewHeader from "./PreviewHeader";
import Pill from "./Pill";
import GetBtnVisual from "./GetBtnVisual";
import { rgba, mixHex, cssFont } from "../util/ColorFunction";
import {
    BrandColors,
    LeftTab,
    HeadingKey,
    HeadingStyle,
    BtnKey,
    ButtonBaseStyle,
    ButtonColors,
    BodyStyle
} from "../GlobalStyleModal";

interface BrandGalleryPreviewProps {
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
    softBg: string;
    buttonColors: Record<BtnKey, ButtonColors>;
    hoveredBtn: BtnKey | null;
    setHoveredBtn: (k: BtnKey | null) => void;
    buttonBase: ButtonBaseStyle;
    globalFontFamily: string;
    body: BodyStyle;
}

const BrandGalleryPreview = ({
    uiPalette,
    mode,
    brand,
    headingFontFamily,
    headings,
    headingPx,
    leftTab,
    onLeftTab,
    cardPreviewStyle,
    softBg,
    buttonColors,
    hoveredBtn,
    setHoveredBtn,
    buttonBase,
    globalFontFamily,
    body,
}: BrandGalleryPreviewProps) => {
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
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold" style={{ color: uiPalette.text }}>
                            Brand Preview Gallery
                        </div>
                        <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
                            Task/goal: user ko ek glance me brand pages ka look feel samajh aata hai.
                        </div>
                    </div>
                    <Pill text="Templates" mode={mode} brand={brand} uiPalette={uiPalette} />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* BIG LEFT CARD */}
                    <div className="md:col-span-7">
                        <div className="rounded-2xl border overflow-hidden" style={cardPreviewStyle}>
                            <div
                                className="p-4 border-b"
                                style={{
                                    borderColor: uiPalette.border,
                                    background: mode === "light" ? rgba(brand?.accent || "#B9F3D5", 0.12) : rgba(brand?.accent || "#B9F3D5", 0.08),
                                }}
                            >
                                <div className="flex items-center justify-between text-[11px]">
                                    <span style={{ color: uiPalette.mutedText }}>Cover / Brand Guidelines</span>
                                    <Pill text="Hero" mode={mode} brand={brand} uiPalette={uiPalette} />
                                </div>
                            </div>

                            {/* ✅ solid hero (gradient removed) */}
                            <div
                                className="p-6"
                                style={{
                                    background: mode === "light" ? mixHex(brand?.dark || "#0B3A2A", "#000000", 0.08) : "#06140F",
                                    color: "#ffffff",
                                    minHeight: 170,
                                    position: "relative",
                                }}
                            >
                                <div style={{ fontFamily: headingFontFamily }}>
                                    <div className="text-2xl font-extrabold leading-tight">KalpTree</div>
                                    <div className="text-2xl font-extrabold leading-tight opacity-90">Brand Guidelines.</div>
                                </div>
                                <div className="mt-2 text-xs opacity-85" style={{ maxWidth: 360 }}>
                                    Premium layout, consistent spacing, and token-driven design.
                                </div>

                                <div className="mt-4 flex gap-2 flex-wrap">
                                    <span
                                        className="inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-semibold"
                                        style={{
                                            background: rgba("#ffffff", 0.14),
                                            border: `1px solid ${rgba("#ffffff", 0.22)}`,
                                        }}
                                    >
                                        KalpTree • Web System
                                    </span>
                                </div>

                                <div className="absolute right-5 bottom-5 text-[11px] opacity-70">v1.0</div>
                            </div>

                            {/* inside cards */}
                            <div className="p-4 grid grid-cols-1 gap-3" style={{ background: softBg }}>
                                {/* Typography */}
                                <div className="rounded-xl border p-4" style={cardPreviewStyle}>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-semibold">Typography</div>
                                        <Pill text="Type" mode={mode} brand={brand} uiPalette={uiPalette} />
                                    </div>

                                    <div className="mt-3">
                                        <div className="text-lg font-bold" style={{ fontFamily: headingFontFamily }}>
                                            {headingFontFamily}
                                        </div>
                                        <div className="text-[11px] mt-1" style={{ color: uiPalette.mutedText }}>
                                            Headings + Body scale
                                        </div>

                                        <div className="mt-3 flex items-end gap-2" style={{ fontFamily: headingFontFamily }}>
                                            <span className="text-lg font-extrabold">Aa</span>
                                            <span className="text-base font-bold opacity-90">Aa</span>
                                            <span className="text-sm font-semibold opacity-80">Aa</span>
                                            <span className="text-xs font-medium opacity-70">Aa</span>
                                            <span className="ml-auto text-[10px]" style={{ color: uiPalette.mutedText }}>
                                                Scale
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Palette */}
                                <div className="rounded-xl border p-4" style={cardPreviewStyle}>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-semibold">Color Palette</div>
                                        <Pill text="Colors" mode={mode} brand={brand} uiPalette={uiPalette} />
                                    </div>

                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {[
                                            { name: "Primary", v: brand?.primary || "" },
                                            { name: "Secondary", v: brand?.secondary || "" },
                                            { name: "Accent", v: brand?.accent || "" },
                                        ].map((c) => (
                                            <div key={c.name} className="rounded-xl border overflow-hidden" style={{ borderColor: uiPalette.border }}>
                                                <div style={{ height: 44, background: c.v }} />
                                                <div className="p-2">
                                                    <div className="text-[11px] font-semibold" style={{ color: uiPalette.text }}>
                                                        {c.name}
                                                    </div>
                                                    <div className="text-[10px]" style={{ color: uiPalette.mutedText }}>
                                                        {c.v}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ✅ Buttons (4 samples) */}
                                <div className="rounded-xl border p-4" style={cardPreviewStyle}>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-semibold">Buttons</div>
                                        <Pill text="UI" mode={mode} brand={brand} uiPalette={uiPalette} />
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => {
                                            const v = GetBtnVisual({ buttonColors, hoveredBtn, buttonBase, k });
                                            const label = k === "primary" ? "Primary" : k === "secondary" ? "Secondary" : "Outline";
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

                                        {/* 4th button (Ghost) */}
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
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="rounded-2xl border p-4" style={cardPreviewStyle}>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-semibold">Brand Overview</div>
                                <Pill text="About" mode={mode} brand={brand} uiPalette={uiPalette} />
                            </div>
                            <div className="mt-3 space-y-2">
                                {[80, 55, 70].map((w, i) => (
                                    <div
                                        key={i}
                                        className="h-2 rounded-full"
                                        style={{ background: rgba(uiPalette.border, 0.9), width: `${w}%` }}
                                    />
                                ))}
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <div className="h-10 rounded-xl border" style={{ borderColor: uiPalette.border, background: rgba(uiPalette.bg, 0.6) }} />
                                <div className="h-10 rounded-xl border" style={{ borderColor: uiPalette.border, background: rgba(uiPalette.bg, 0.6) }} />
                            </div>
                        </div>

                        <div className="rounded-2xl border p-4" style={cardPreviewStyle}>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-semibold">Brand story + values</div>
                                <Pill text="Layout A" mode={mode} brand={brand} uiPalette={uiPalette} />
                            </div>
                            <div className="mt-3 h-20 rounded-xl border" style={{ borderColor: uiPalette.border, background: softBg }} />
                        </div>

                        <div className="rounded-2xl border p-4" style={cardPreviewStyle}>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-semibold">Instagram Post</div>
                                <Pill text="Social" mode={mode} brand={brand} uiPalette={uiPalette} />
                            </div>
                            <div
                                className="mt-3 rounded-xl border overflow-hidden"
                                style={{
                                    borderColor: uiPalette.border,
                                    background: mixHex(brand?.accent || "", "#FFFFFF", mode === "light" ? 0.55 : 0.1),
                                }}
                            >
                                <div className="p-4">
                                    <div className="text-sm font-bold" style={{ color: uiPalette.text }}>
                                        Build clean pages
                                    </div>
                                    <div className="text-[11px] mt-1" style={{ color: uiPalette.mutedText }}>
                                        Consistent tokens • premium spacing • strong CTA
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <span className="h-2 w-2 rounded-full" style={{ background: brand?.primary || "" }} />
                                        <span className="h-2 w-2 rounded-full" style={{ background: brand?.secondary || "" }} />
                                        <span className="h-2 w-2 rounded-full" style={{ background: brand?.accent || "" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tokens block */}
                <div
                    className="mt-6 rounded-2xl border p-5"
                    style={{ ...cardPreviewStyle, background: rgba(uiPalette.bg, mode === "light" ? 0.6 : 0.15) }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold">Design Tokens (What is being used)</div>
                            <div className="text-xs mt-1" style={{ color: uiPalette.mutedText }}>
                                Colors + fonts + sizes + radius + shadow (same page me clear).
                            </div>
                        </div>
                        <Pill text="Tokens" mode={mode} brand={brand} uiPalette={uiPalette} />
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 rounded-xl border p-4" style={cardPreviewStyle}>
                            <div className="text-xs font-semibold">Font Family</div>
                            <div className="mt-2 text-[11px]" style={{ color: uiPalette.mutedText }}>
                                --font-body: <span className="font-mono">{cssFont(globalFontFamily)}</span>
                            </div>
                            <div className="mt-2 text-[11px]" style={{ color: uiPalette.mutedText }}>
                                --font-heading: <span className="font-mono">{cssFont(headingFontFamily)}</span>
                            </div>
                        </div>

                        <div className="md:col-span-6 rounded-xl border p-4" style={cardPreviewStyle}>
                            <div className="text-xs font-semibold">Core Sizes</div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]" style={{ color: uiPalette.mutedText }}>
                                <div className="font-mono">--h1: {headingPx("h1")}px</div>
                                <div className="font-mono">--h2: {headingPx("h2")}px</div>
                                <div className="font-mono">--h3: {headingPx("h3")}px</div>
                                <div className="font-mono">--h4: {headingPx("h4")}px</div>
                                <div className="font-mono">--body: {body.sizePx}px</div>
                                <div className="font-mono">--btn: {buttonBase.sizePx}px</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandGalleryPreview;
