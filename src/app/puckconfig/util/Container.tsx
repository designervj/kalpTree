"use client";

import React, { useMemo } from "react";
import {
    layoutFields,
    sizingFields,
    spacingFields,
    borderFields,
    boxShadowFields,
    backgroundFields,
} from "./fields";
import {
    DEFAULT_BOX_SHADOW,
    generateBoxShadowCSS,
} from "@/components/puckcomponents/CustomBoxShadow";
import {
    DEFAULT_LAYOUT,
    generateLayoutCSS,
} from "@/components/puckcomponents/CustomLayout";
import {
    DEFAULT_SIZING,
    generateCSS,
} from "@/components/puckcomponents/CustomSIzing";
import {
    DEFAULT_SPACING,
    generateSpacingCSS,
} from "@/components/puckcomponents/CustomSpacing";
import {
    DEFAULT_BORDER,
    generateBorderCSS,
} from "@/components/puckcomponents/CustomBorder";
import {
    DEFAULT_BACKGROUND,
    getBackgroundCSS,
} from "@/components/puckcomponents/CustomBackground";

export const Container = {
    fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        content: {
            type: "slot",
        },
        background: backgroundFields,
    },
    defaultProps: {
        boxShadow: DEFAULT_BOX_SHADOW,
        layout: DEFAULT_LAYOUT,
        sizing: {
            ...DEFAULT_SIZING,
            minHeight: { value: "100", unit: "px" },
        },
        spacing: {
            ...DEFAULT_SPACING,
            paddingTop: { value: "24", unit: "px" },
            paddingBottom: { value: "24", unit: "px" },
            paddingLeft: { value: "24", unit: "px" },
            paddingRight: { value: "24", unit: "px" },
        },
        border: {
            ...DEFAULT_BORDER,
            allWidth: { value: "1", unit: "px" },
            allStyle: "Dashed",
            allColor: "rgba(0,0,0,0.15)",
        },
        background: DEFAULT_BACKGROUND,
    },

    render: (props: any) => {
        const { layout, sizing, spacing, border, boxShadow, background, content: Content, puck } = props;

        const combinedStyle = useMemo(() => {
            const sizestyle = generateCSS(sizing);
            const borderstyle = generateBorderCSS(border);
            const spacingstyle = generateSpacingCSS(spacing);
            const boxshadowstyle = generateBoxShadowCSS(boxShadow);
            const layoutstyle = generateLayoutCSS(layout);
            const backgroundstyle = getBackgroundCSS(background);

            return {
                ...sizestyle,
                ...borderstyle,
                ...spacingstyle,
                ...boxshadowstyle,
                ...layoutstyle,
                ...backgroundstyle,
            };
        }, [layout, sizing, spacing, border, boxShadow, background]);

        return (
            <div style={{ position: "relative", ...combinedStyle }}>
                {/* Boundary Visualization — Only visible if no border width is explicitly set high AND we are in editor mode */}
                {(puck?.renderMode === "editor" || puck?.isEditing) && (
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        border: "1px dashed rgba(0, 0, 0, 0.12)",
                        pointerEvents: "none",
                        zIndex: 0,
                        borderRadius: combinedStyle.borderRadius,
                        display: (border?.allWidth?.value === "0" || !border?.allWidth?.value) ? "block" : "none"
                    }} />
                )}

                <div style={{ position: "relative", zIndex: 1 }}>
                    <Content />
                </div>
            </div>
        );
    },
};
