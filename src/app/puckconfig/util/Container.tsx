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
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        background: DEFAULT_BACKGROUND,
    },

    render: (props: any) => {
        const { layout, sizing, spacing, border, boxShadow, background } = props;

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
            <props.content
                style={combinedStyle}
            />
        );
    },
};
