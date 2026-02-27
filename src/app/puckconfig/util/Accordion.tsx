import React from "react";
import {
    borderFields,
    boxShadowFields,
    layoutFields,
    sizingFields,
    spacingFields,
} from "../puckfields";
import {
    accordionContentFields,
    DEFAULT_ACCORDION_CONTENT,
} from "@/components/puckcomponents/DirectComps/AccordianBlock";
import { AccordionComponentNew } from "@/components/puckcomponents/DirectComps/AccordionBlockNew";
import { DEFAULT_BOX_SHADOW } from "@/components/puckcomponents/CustomBoxShadow";
import { DEFAULT_LAYOUT } from "@/components/puckcomponents/CustomLayout";
import { DEFAULT_SIZING } from "@/components/puckcomponents/CustomSIzing";
import { DEFAULT_SPACING } from "@/components/puckcomponents/CustomSpacing";
import { DEFAULT_BORDER } from "@/components/puckcomponents/CustomBorder";

export const Accordion = {
    fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        accordion: accordionContentFields,
        content: {
            type: "slot" as const,
            allow: ["AccordionItem"],
        },
    },
    defaultProps: {
        boxShadow: DEFAULT_BOX_SHADOW,
        layout: DEFAULT_LAYOUT,
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        accordion: DEFAULT_ACCORDION_CONTENT,
    },

    render: (props: any) => {
        // compute CSS from field values and render your accordion UI
        return <AccordionComponentNew {...props} />;
    },
};
