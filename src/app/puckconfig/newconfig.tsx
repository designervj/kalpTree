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
import { Accordion } from "./util/Accordion";
import { AccordionItem } from "./util/AccordionItem";

import { Grid } from "./util/Grid";

import { Button } from "./util/Button";



export const newconfig = {

  components: {
    Container: Container,
    HeadingBlock: HeadingBlock,
    TextBlock: TextBlock,
    HeroSection: Hero,
    AccordionItem: AccordionItem,
    Accordion: Accordion,
    Grid: Grid,
    Button: Button,
  },
};
