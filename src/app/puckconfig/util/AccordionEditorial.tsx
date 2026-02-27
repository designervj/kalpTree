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
  ACCORDION_ITEM_STYLE_EDITORIAL,
  ACCORDION_STYLE_EDITORIAL,
} from "@/components/puckcomponents/DirectComps/AccordianStyles";
import { AccordionComponentNew } from "@/components/puckcomponents/DirectComps/AccordionBlockNew";

export const AccordionEditorial = {
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
    ...ACCORDION_STYLE_EDITORIAL,
    content: [
      {
        type: "AccordionItem",
        props: {
          ...ACCORDION_ITEM_STYLE_EDITORIAL,
          id: "AccordionItem-editorial-1",
        },
      },
    ],
  },
  render: (props: any) => <AccordionComponentNew {...props} />,
};
