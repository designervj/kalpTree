import React from "react";
import {
    borderFields,
    boxShadowFields,
    layoutFields,
    sizingFields,
    spacingFields,
} from "../puckfields";
import { elementsFields } from "@/components/puckcomponents/CustomeElement";
import {
    ACCORDION_ITEM_STYLE_SOFT,
    ACCORDION_STYLE_SOFT,
} from "@/components/puckcomponents/DirectComps/AccordianStyles";
import { AccordionComponentNew } from "@/components/puckcomponents/DirectComps/AccordionBlockNew";

export const AccordionSoft = {
    fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        content: {
            type: "slot" as const,
            allow: ["AccordionItem"],
        },
        elementsFields: elementsFields,
    },
    defaultProps: {
        ...ACCORDION_STYLE_SOFT,
        content: [
            {
                type: "AccordionItem",
                props: {
                    ...ACCORDION_ITEM_STYLE_SOFT,
                    id: "AccordionItem-soft-1",
                },
            },
        ],
    },
    render: (props: any) => <AccordionComponentNew {...props} />,
};
