import {
  DEFAULT_BACKGROUND,
  getBackgroundCSS,
} from "@/components/puckcomponents/CustomBackground";
import {
  DEFAULT_BORDER,
  generateBorderCSS,
} from "@/components/puckcomponents/CustomBorder";
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
  DEFAULT_TEXT,
  generateTextCSS,
  TextPanel,
} from "@/components/puckcomponents/CustomText";
import {
  accordionContentFields,
  DEFAULT_ACCORDION_CONTENT,
} from "@/components/puckcomponents/DirectComps/AccordianBlock";

import { toAddInElement } from "@/components/puckcomponents/DirectComps/AccordionItem";

import HeroSlider from "@/components/puckcomponents/DirectComps/Hero";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  backgroundFields,
  bodyTextFields,
  borderFields,
  boxShadowFields,
  closedTextFields,
  layoutFields,
  makeTextFields,
  sizingFields,
  spacingFields,
} from "./puckfields";
import { Container } from "./util/Container";
import { Hero } from "./util/Hero";
import { HeadingBlock } from "./util/HeadingBlock";
import { TextBlock } from "./util/TextBlock";
import { AccordionItem } from "./util/AccordionItem";
import { elementsFields } from "@/components/puckcomponents/CustomeElement";
import {
  ACCORDION_ITEM_STYLE_EDITORIAL,
  ACCORDION_ITEM_STYLE_GLASS,
  ACCORDION_ITEM_STYLE_SOFT,
  ACCORDION_STYLE_EDITORIAL,
  ACCORDION_STYLE_GLASS,
  ACCORDION_STYLE_SOFT,
} from "@/components/puckcomponents/DirectComps/AccordianStyles";

import { Grid } from "./util/Grid";

import { Button } from "./util/Button";
import { AccordionComponentNew } from "@/components/puckcomponents/DirectComps/AccordionBlockNew";

export const newconfig = {
  components: {
    Container: Container,
    HeadingBlock: HeadingBlock,
    TextBlock: TextBlock,
    HeroSection: Hero,
    // AccordionItem: AccordionItem,
    // Accordion: Accordion,
    Grid: Grid,
    Button: Button,
    // Container: {
    //   fields: {
    //     layout: layoutFields,
    //     sizing: sizingFields,
    //     spacing: spacingFields,
    //     border: borderFields,
    //     boxShadow: boxShadowFields,
    //     content: {
    //       type: "slot",
    //     },
    //     background: backgroundFields,
    //   },
    //   defaultProps: {
    //     boxShadow: DEFAULT_BOX_SHADOW,
    //     layout: DEFAULT_LAYOUT,
    //     sizing: DEFAULT_SIZING,
    //     spacing: DEFAULT_SPACING,
    //     border: DEFAULT_BORDER,
    //     background: DEFAULT_BACKGROUND,
    //   },

    //   render: (props: any) => {
    //     const { layout, sizing, spacing, border, boxShadow, background } =
    //       props;
    //     const sizestyle = generateCSS(sizing);
    //     const borderstyle = generateBorderCSS(border);
    //     const spacingstyle = generateSpacingCSS(spacing);
    //     const boxshadowstyle = generateBoxShadowCSS(boxShadow);
    //     const layoutstyle = generateLayoutCSS(layout);
    //     const backgroundstyle = getBackgroundCSS(background);

    //     return (
    //       <props.content
    //         style={{
    //           ...sizestyle,
    //           ...borderstyle,
    //           ...spacingstyle,
    //           ...boxshadowstyle,
    //           ...layoutstyle,
    //           ...backgroundstyle,
    //         }}
    //       />
    //     );
    //   },
    // },

    // TextBlock: {
    //   fields: {
    //     text: makeTextFields,
    //   },
    //   defaultProps: {
    //     text: DEFAULT_TEXT,
    //   },
    //   render: (props: any) => {
    //     const { text } = props;
    //     const textstyle = generateTextCSS(text[text.activeTag.toLowerCase()]);

    //     return <h1 style={{ ...textstyle }}>Himanshu</h1>;
    //   },
    // },

    // HeroSection: {
    //   render: (props: any) => {
    //     return <HeroSlider />;
    //   },
    // },

    AccordionItem: {
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
        background: backgroundFields,
      },
      defaultProps: {
        titletext: DEFAULT_TEXT,
        closedtitletext: DEFAULT_TEXT,
        bodytext: DEFAULT_TEXT,
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        boxShadow: DEFAULT_BOX_SHADOW,
        background: DEFAULT_BACKGROUND,
      },
      render: (props: any) => {
        return <AccordionItem {...props} />;
      },
    },
    Accordion: {
      fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        content: {
          type: "slot",
          allow: ["AccordionItem"],
        },
        elementsFields: elementsFields,
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
              id: "AccordionItem-0463b58c-b640-4999-969f-970501f5a15a",
            },
          },
        ],
      },

      render: (props: any) => {
        // compute CSS from field values and render your accordion UI
        return <AccordionComponentNew {...props} />;
      },
    },

    AccordionGlass: {
      fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        content: {
          type: "slot",
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
    },

    AccordionSoft: {
      fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        content: {
          type: "slot",
          allow: ["AccordionItem"],
        },
        elementsFields: elementsFields,
      },
      defaultProps: {
        ...ACCORDION_STYLE_SOFT,
        content: [
          {
            type: "AccordionItem",
            props: { ...ACCORDION_ITEM_STYLE_SOFT, id: "AccordionItem-soft-1" },
          },
        ],
      },
      render: (props: any) => <AccordionComponentNew {...props} />,
    },

    AccordionEditorial: {
      fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        content: {
          type: "slot",
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
    },
  },
};
