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
import { AccordionItem } from "@/components/puckcomponents/DirectComps/AccordionItem";
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
import { elementsFields } from "@/components/puckcomponents/CustomeElement";

import { Button } from "./util/Button";
import { Accordion } from "./util/Accordion";
import { AccordionGlass } from "./util/AccordionGlass";
import { AccordionSoft } from "./util/AccordionSoft";
import { AccordionEditorial } from "./util/AccordionEditorial";
import { GridBlock } from "./util/GridBlock";

import { AccordionComponentNew } from "@/components/puckcomponents/DirectComps/AccordionBlockNew";
import { Card } from "./util/Card";

export const newconfig = {
  components: {
    Container: Container,
    HeadingBlock: HeadingBlock,
    TextBlock: TextBlock,
    HeroSection: Hero,

    GridBlock: GridBlock,
    Button: Button,
    Card: Card,

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
    Accordion: Accordion,
    AccordionGlass: AccordionGlass,
    AccordionSoft: AccordionSoft,
    AccordionEditorial: AccordionEditorial,
  },
};
