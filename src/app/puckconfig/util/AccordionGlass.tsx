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
    ACCORDION_ITEM_STYLE_GLASS,
    ACCORDION_STYLE_GLASS,
} from "@/components/puckcomponents/DirectComps/AccordianStyles";
import { AccordionComponentNew } from "@/components/puckcomponents/DirectComps/AccordionBlockNew";

export const AccordionGlass = {
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
        ...ACCORDION_STYLE_GLASS,
        content: [
            {
                type: "AccordionItem",
                props: {
                    ...ACCORDION_ITEM_STYLE_GLASS,
                    id: "AccordionItem-glass-1",
                },
            },
        ],
    },
    render: (props: any) => <AccordionComponentNew {...props} />,
};
