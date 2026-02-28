"use client";

import React, { useMemo } from "react";
import {
    borderFields,
    boxShadowFields,
    sizingFields,
    spacingFields,
    makeTextFields,
} from "../puckfields";
import { DEFAULT_BORDER, generateBorderCSS } from "@/components/puckcomponents/CustomBorder";
import { DEFAULT_BOX_SHADOW, generateBoxShadowCSS } from "@/components/puckcomponents/CustomBoxShadow";
import { DEFAULT_SIZING, generateCSS } from "@/components/puckcomponents/CustomSIzing";
import { DEFAULT_SPACING, generateSpacingCSS } from "@/components/puckcomponents/CustomSpacing";
import { DEFAULT_TEXT, generateTextCSS } from "@/components/puckcomponents/CustomText";

export const Button = {
    fields: {
        label: {
            type: "text",
            label: "Label",
            defaultValue: "Button",
        },
        variant: {
            type: "select",
            label: "Variant",
            options: [
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
                { label: "Ghost", value: "ghost" },
                { label: "Link", value: "link" },
            ],
            defaultValue: "primary",
        },
        text: makeTextFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
    },
    defaultProps: {
        label: "Button",
        variant: "primary",
        text: DEFAULT_TEXT,
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        boxShadow: DEFAULT_BOX_SHADOW,
    },
    render: (props: any) => {
        const { label, variant, text, sizing, spacing, border, boxShadow, puck } = props;

        const variantStyles: Record<string, React.CSSProperties> = {
            primary: { backgroundColor: "#007bff", color: "#fff", border: "none" },
            secondary: { backgroundColor: "#6c757d", color: "#fff", border: "none" },
            ghost: { backgroundColor: "transparent", color: "#007bff", border: "1px solid #007bff" },
            link: { backgroundColor: "transparent", color: "#007bff", textDecoration: "underline", border: "none", padding: 0 },
        };

        const combinedStyle = useMemo(() => {
            const activeTag = text.activeTag?.toLowerCase() || "p";
            return {
                ...variantStyles[variant],
                ...generateTextCSS(text[activeTag]),
                ...generateCSS(sizing),
                ...generateSpacingCSS(spacing),
                ...generateBorderCSS(border),
                ...generateBoxShadowCSS(boxShadow),
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
            };
        }, [variant, text, sizing, spacing, border, boxShadow]);

        return (
            <div style={{ position: "relative", display: "inline-block" }}>
                {/* Boundary Visualization — Only visible in editor mode */}
                {(puck?.renderMode === "editor" || puck?.isEditing) && (
                    <div
                        style={{
                            position: "absolute",
                            inset: "-4px",
                            border: "1px dashed rgba(0, 0, 0, 0.12)",
                            pointerEvents: "none",
                            zIndex: 0,
                            borderRadius: combinedStyle.borderRadius,
                        }}
                    />
                )}
                <button style={{ ...combinedStyle, position: "relative", zIndex: 1 }}>
                    {label}
                </button>
            </div>
        );
    },
};
