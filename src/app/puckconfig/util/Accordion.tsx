import {
  borderFields,
  boxShadowFields,
  layoutFields,
  sizingFields,
  spacingFields,
} from "../puckfields";
import { AccordionComponentNew } from "@/components/puckcomponents/DirectComps/AccordionBlockNew";
import { DEFAULT_BOX_SHADOW } from "@/components/puckcomponents/CustomBoxShadow";
import { DEFAULT_LAYOUT } from "@/components/puckcomponents/CustomLayout";
import { DEFAULT_SIZING } from "@/components/puckcomponents/CustomSIzing";
import { DEFAULT_SPACING } from "@/components/puckcomponents/CustomSpacing";
import { DEFAULT_BORDER } from "@/components/puckcomponents/CustomBorder";
import { toAddInElement } from "@/components/puckcomponents/DirectComps/AccordionItem";

export const Accordion = {
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
  },
  defaultProps: {
    boxShadow: DEFAULT_BOX_SHADOW,
    layout: DEFAULT_LAYOUT,
    sizing: DEFAULT_SIZING,
    spacing: DEFAULT_SPACING,
    border: DEFAULT_BORDER,
    content: [
      {
        type: "AccordionItem",
        props: {
          ...toAddInElement,
          id: "AccordionItem-asdfafsa",
        },
      },
    ],
  },

  render: (props: any) => {
    // compute CSS from field values and render your accordion UI
    return <AccordionComponentNew {...props} />;
  },
};
