"use client";

import React, { useMemo } from "react";
import { layoutFields, spacingFields } from "../puckfields";
import { DEFAULT_LAYOUT, generateLayoutCSS } from "@/components/puckcomponents/CustomLayout";
import { DEFAULT_SPACING, generateSpacingCSS } from "@/components/puckcomponents/CustomSpacing";

export const Grid = {
    fields: {
        layout: layoutFields,
        spacing: spacingFields,
        content: {
            type: "slot",
        },
    },
    defaultProps: {
        layout: {
            ...DEFAULT_LAYOUT,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "1rem",
        },
        spacing: DEFAULT_SPACING,
    },
    render: (props: any) => {
        const { layout, spacing, content } = props;

        const combinedStyle = useMemo(() => {
            return {
                ...generateLayoutCSS(layout),
                ...generateSpacingCSS(spacing),
            };
        }, [layout, spacing]);

        return (
            <div style={combinedStyle}>
                {content}
            </div>
        );
    },
};
