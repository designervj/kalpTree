import { ThemeColors } from "@/components/editor/style-editor/GlobalStyelModel";
import type { ObjectId } from "mongodb";

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
export type LeftTab = "colors" | "headings" | "body" | "buttons" | "root-file";
export type HeadingKey = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type BtnKey = "primary" | "secondary" | "outline" | "ghost" | "link";
export type RightPanelTab = "preview" | "root";

export type HeadingStyle = {
  scale: number;
  weight: number;
  lineHeight: number;
  letterSpacingEm: number;
};

export type BodyStyle = {
  sizePx?: number;
  weight?: number;
  letterSpacingEm?: number;
  transform: "none" | "uppercase" | "lowercase" | "capitalize";
  lineHeight?: number;
  radiusPx: number;
  heightPx: number;
  maxWidthCh?: number;
  paragraphGapPx?: number;
  paddingXPx: number;
  borderWidthPx: number;
  shadow: "none" | "sm" | "md" | "lg";
  transitionMs: number;
};

export type ButtonBaseStyle = {
  sizePx?: number;
  weight?: number;
  fontFamily?: string;
  letterSpacingEm?: number;
  transform?: "none" | "uppercase" | "lowercase" | "capitalize";
  radiusPx?: number;
  heightPx?: number;
  paddingXPx?: number;
  borderWidthPx?: number;
  shadow?: "none" | "sm" | "md" | "lg";
  transitionMs?: number;
  lineHeight?: number;
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
  primary?: string;
  secondary?: string;
  accent?: string;
  dark?: string;
  text?: string;
  mutedText?: string;
  border?: string;
  ring?: string;
};


export interface RootStyleModel {
  brand?: BrandColors;
  headings?: Record<HeadingKey, HeadingStyle>;
  body?: BodyStyle;
  buttons?: ButtonBaseStyle;
  themes?: {
    light: ThemeColors;
    dark: ThemeColors;
  };

}
