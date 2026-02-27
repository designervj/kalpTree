import React from "react";
import {
    bodyTextFields,
    borderFields,
    boxShadowFields,
    closedTextFields,
    makeTextFields,
    sizingFields,
    spacingFields,
} from "../puckfields";
import { AccordionItem as AccordionItemComponent } from "@/components/puckcomponents/DirectComps/AccordionItem";
import { DEFAULT_TEXT } from "@/components/puckcomponents/CustomText";
import { DEFAULT_SIZING } from "@/components/puckcomponents/CustomSIzing";
import { DEFAULT_SPACING } from "@/components/puckcomponents/CustomSpacing";
import { DEFAULT_BORDER } from "@/components/puckcomponents/CustomBorder";
import { DEFAULT_BOX_SHADOW } from "@/components/puckcomponents/CustomBoxShadow";

export const AccordionItem = {
    fields: {
        title: {
            type: "text",
            label: "Title",
            defaultValue: "Accordion Title",
            contentEditable: true,
        },
        body: {
            type: "textarea",
            label: "Body",
            defaultValue: "Content goes here.",
            contentEditable: true,
        },
        titletext: makeTextFields,
        closedtitletext: closedTextFields,
        bodytext: bodyTextFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
    },
    defaultProps: {
        title: "Accordion Title",
        body: "Content goes here.",
        titletext: DEFAULT_TEXT,
        closedtitletext: DEFAULT_TEXT,
        bodytext: DEFAULT_TEXT,
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        boxShadow: DEFAULT_BOX_SHADOW,
    },
    render: (props: any) => {
        return <AccordionItemComponent {...props} />;
    },
};


