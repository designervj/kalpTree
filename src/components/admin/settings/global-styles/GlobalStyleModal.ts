import { ObjectId } from "mongodb";

export interface GlobalStyleSettings {
    _id?: ObjectId | string;
    key?: string;
    tenantId?: ObjectId | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    value?: {
        siteName?: string;
        tagline?: string;
    };
    globalStyle?: string;
}

export type Mode = "light" | "dark";
export type LeftTab = "colors" | "headings" | "body" | "buttons";
export type HeadingKey = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type BtnKey = "primary" | "secondary" | "outline";
export type RightPanelTab = "preview" | "root";

export type HeadingStyle = {
  scale: number;
  weight: number;
  lineHeight: number;
  letterSpacingEm: number;
};

export type BodyStyle = {
  sizePx: number;
  weight: number;
  lineHeight: number;
  letterSpacingEm: number;
  maxWidthCh: number;
  paragraphGapPx: number;
};

export type ButtonBaseStyle = {
  fontFamily: string;
  sizePx: number;
  weight: number;
  letterSpacingEm: number;
  transform: "none" | "uppercase" | "lowercase" | "capitalize";
  radiusPx: number;
  heightPx: number;
  paddingXPx: number;
  borderWidthPx: number;
  shadow: "none" | "sm" | "md" | "lg";
  transitionMs: number;
};

    export interface ButtonColors {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  hoverBorder: string;
};


export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  text: string;
  mutedText: string;
  border: string;
  ring: string;
};