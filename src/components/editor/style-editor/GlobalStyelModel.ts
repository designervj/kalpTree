import {
  BodyStyle,
  BrandColors,
  ButtonBaseStyle,
  ButtonColors,
  HeadingStyle,
  HeadingKey,
  BtnKey,
} from "@/components/admin/settings/global-styles/GlobalStyleModal";

export interface TypographyDetail {
  size: string;
  weight: number;
  lineHeight: number;
  letterSpacing: string;
}

export interface ButtonStyle {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  hoverBorder: string;
}

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
}

export interface GlobalStyleModel {
  brand: BrandColors;

  fonts: {
    body: string;
    heading: string;
    button: string;
  };

  headings: Record<HeadingKey, HeadingStyle>;

  body: BodyStyle;

  buttonColors: Record<BtnKey, ButtonColors>;
  buttonBase: ButtonBaseStyle;

  buttons: {
    base: ButtonBaseStyle;
    primary: ButtonColors;
    secondary: ButtonColors;
    outline: ButtonColors;
    ghost: ButtonColors;
    link: ButtonColors;
  };

  themes: {
    light: ThemeColors;
    dark: ThemeColors;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

const stripUnit = (val: string) => (val ? val.replace(/[^-0-9.]/g, "") : "");
const getNum = (val: string, fallback: number) => {
  const n = parseFloat(stripUnit(val));
  return isNaN(n) ? fallback : n;
};

/**
 * Transforms a Record of CSS variables into a structured GlobalStyleModel.
 * Provides logical defaults if variables are missing.
 */
export const transformVarsToGlobalStyleModel = (
  vars: Record<string, string>,
): GlobalStyleModel => {
  const getVal = (key: string, fallback: string) => vars[key] || fallback;

  return {
    brand: {
      primary: getVal("--primary", "#1F6F43"),
      secondary: getVal("--secondary", "#2EA76A"),
      accent: getVal("--accent", "#B9F3D5"),
      dark: getVal("--dark", "#0B3A2A"),
      ring: getVal("--ring", "#2EA76A"),
      text: getVal("--text", "#0B2A1F"),
      mutedText: getVal("--muted-text", "#5E6E65"),
      border: getVal("--border", "#DDE6E1"),
    },

    headings: {
      h1: {
        scale: getNum(getVal("--h1-size", "43px"), 43),
        weight: getNum(getVal("--h1-weight", "800"), 800),
        lineHeight: getNum(getVal("--h1-lh", "1.05"), 1.05),
        letterSpacingEm: getNum(getVal("--h1-ls", "-0.03em"), -0.03),
      },
      h2: {
        scale: getNum(getVal("--h2-size", "34px"), 34),
        weight: getNum(getVal("--h2-weight", "800"), 800),
        lineHeight: getNum(getVal("--h2-lh", "1.1"), 1.1),
        letterSpacingEm: getNum(getVal("--h2-ls", "-0.02em"), -0.02),
      },
      h3: {
        scale: getNum(getVal("--h3-size", "26px"), 26),
        weight: getNum(getVal("--h3-weight", "700"), 700),
        lineHeight: getNum(getVal("--h3-lh", "1.15"), 1.15),
        letterSpacingEm: getNum(getVal("--h3-ls", "-0.01em"), -0.01),
      },
      h4: {
        scale: getNum(getVal("--h4-size", "21px"), 21),
        weight: getNum(getVal("--h4-weight", "700"), 700),
        lineHeight: getNum(getVal("--h4-lh", "1.2"), 1.2),
        letterSpacingEm: getNum(getVal("--h4-ls", "0em"), 0),
      },
      h5: {
        scale: getNum(getVal("--h5-size", "19px"), 19),
        weight: getNum(getVal("--h5-weight", "600"), 600),
        lineHeight: getNum(getVal("--h5-lh", "1.25"), 1.25),
        letterSpacingEm: getNum(getVal("--h5-ls", "0em"), 0),
      },
      h6: {
        scale: getNum(getVal("--h6-size", "17px"), 17),
        weight: getNum(getVal("--h6-weight", "600"), 600),
        lineHeight: getNum(getVal("--h6-lh", "1.3"), 1.3),
        letterSpacingEm: getNum(getVal("--h6-ls", "0.01em"), 0.01),
      },
    },
    fonts: {
      body: getVal("--font-body", "Inter, system-ui, sans-serif"),
      heading: getVal("--font-heading", "Inter, system-ui, sans-serif"),
      button: getVal("--font-button", "Inter, system-ui, sans-serif"),
    },
    body: {
      sizePx: parseInt(getVal("--body-size", "17px")),
      weight: getNum(getVal("--body-weight", "400"), 400),
      lineHeight: getNum(getVal("--body-lh", "1.7"), 1.7),
      letterSpacingEm: parseFloat(getVal("--body-ls", "0em")),
      maxWidthCh: parseInt(getVal("--body-maxw", "62ch")),
      paragraphGapPx: parseInt(getVal("--body-paragraph-gap", "14px")),
      transform: "none",
      radiusPx: 0,
      heightPx: 0,
      paddingXPx: 0,
      borderWidthPx: 0,
      shadow: "none",
      transitionMs: 0,
    },
    buttonBase: {
      sizePx: parseInt(getVal("--btn-size", "14px")),
      weight: getNum(getVal("--btn-weight", "500"), 500),
      letterSpacingEm: parseFloat(getVal("--btn-ls", "0em")),
      transform: getVal("--btn-transform", "none") as any,
      radiusPx: parseInt(getVal("--btn-radius", "8px")),
      heightPx: parseInt(getVal("--btn-height", "44px")),
      paddingXPx: parseInt(getVal("--btn-padding-x", "16px")),
      borderWidthPx: parseInt(getVal("--btn-border-width", "1px")),
      shadow: getVal("--btn-shadow", "sm") as any,
      transitionMs: parseInt(getVal("--btn-transition", "200")),
      lineHeight: getNum(getVal("--body-lh", "1.7"), 1.7),
    },
    buttonColors: {
      primary: {
        bg: getVal("--btn-primary-bg", "#EAF7F0"),
        text: getVal("--btn-primary-text", "#0B2A1F"),
        border: getVal("--btn-primary-border", "#DDE6E1"),
        hoverBg: getVal("--btn-primary-hover-bg", "#DAF2E6"),
        hoverText: getVal("--btn-primary-hover-text", "#0B2A1F"),
        hoverBorder: getVal("--btn-primary-hover-border", "#CFE4DA"),
      },
      secondary: {
        bg: getVal("--btn-secondary-bg", "#EAF7F0"),
        text: getVal("--btn-secondary-text", "#0B2A1F"),
        border: getVal("--btn-secondary-border", "#DDE6E1"),
        hoverBg: getVal("--btn-secondary-hover-bg", "#DAF2E6"),
        hoverText: getVal("--btn-secondary-hover-text", "#0B2A1F"),
        hoverBorder: getVal("--btn-secondary-hover-border", "#CFE4DA"),
      },
      outline: {
        bg: getVal("--btn-outline-bg", "transparent"),
        text: getVal("--btn-outline-text", "#0B2A1F"),
        border: getVal("--btn-outline-border", "#CFE4DA"),
        hoverBg: getVal("--btn-outline-hover-bg", "#F4FBF7"),
        hoverText: getVal("--btn-outline-hover-text", "#0B2A1F"),
        hoverBorder: getVal("--btn-outline-hover-border", "#9ED7C0"),
      },
      ghost: {
        bg: getVal("--btn-ghost-bg", "transparent"),
        text: getVal("--btn-ghost-text", "#0B2A1F"),
        border: getVal("--btn-ghost-border", "transparent"),
        hoverBg: getVal("--btn-ghost-hover-bg", "#F4F6F5"),
        hoverText: getVal("--btn-ghost-hover-text", "#0B2A1F"),
        hoverBorder: getVal("--btn-ghost-hover-border", "transparent"),
      },
      link: {
        bg: getVal("--btn-link-bg", "transparent"),
        text: getVal("--btn-link-text", "#1F6F43"),
        border: getVal("--btn-link-border", "transparent"),
        hoverBg: getVal("--btn-link-hover-bg", "transparent"),
        hoverText: getVal("--btn-link-hover-text", "#2EA76A"),
        hoverBorder: getVal("--btn-link-hover-border", "transparent"),
      },
    },
    buttons: {
      base: {
        sizePx: parseInt(getVal("--btn-size", "14px")),
        weight: getNum(getVal("--btn-weight", "500"), 500),
        letterSpacingEm: parseFloat(getVal("--btn-ls", "0em")),
        transform: getVal("--btn-transform", "none") as any,
        radiusPx: parseInt(getVal("--btn-radius", "8px")),
        heightPx: parseInt(getVal("--btn-height", "44px")),
        paddingXPx: parseInt(getVal("--btn-padding-x", "16px")),
        borderWidthPx: parseInt(getVal("--btn-border-width", "1px")),
        shadow: getVal("--btn-shadow", "sm") as any,
        transitionMs: parseInt(getVal("--btn-transition", "200")),
        lineHeight: getNum(getVal("--body-lh", "1.7"), 1.7),
      },
      primary: {
        bg: getVal("--btn-primary-bg", "#EAF7F0"),
        text: getVal("--btn-primary-text", "#0B2A1F"),
        border: getVal("--btn-primary-border", "#DDE6E1"),
        hoverBg: getVal("--btn-primary-hover-bg", "#DAF2E6"),
        hoverText: getVal("--btn-primary-hover-text", "#0B2A1F"),
        hoverBorder: getVal("--btn-primary-hover-border", "#CFE4DA"),
      },
      secondary: {
        bg: getVal("--btn-secondary-bg", "#EAF7F0"),
        text: getVal("--btn-secondary-text", "#0B2A1F"),
        border: getVal("--btn-secondary-border", "#DDE6E1"),
        hoverBg: getVal("--btn-secondary-hover-bg", "#DAF2E6"),
        hoverText: getVal("--btn-secondary-hover-text", "#0B2A1F"),
        hoverBorder: getVal("--btn-secondary-hover-border", "#CFE4DA"),
      },
      outline: {
        bg: getVal("--btn-outline-bg", "transparent"),
        text: getVal("--btn-outline-text", "#0B2A1F"),
        border: getVal("--btn-outline-border", "#CFE4DA"),
        hoverBg: getVal("--btn-outline-hover-bg", "#F4FBF7"),
        hoverText: getVal("--btn-outline-hover-text", "#0B2A1F"),
        hoverBorder: getVal("--btn-outline-hover-border", "#9ED7C0"),
      },
      ghost: {
        bg: getVal("--btn-ghost-bg", "transparent"),
        text: getVal("--btn-ghost-text", "#0B2A1F"),
        border: getVal("--btn-ghost-border", "transparent"),
        hoverBg: getVal("--btn-ghost-hover-bg", "#F4F6F5"),
        hoverText: getVal("--btn-ghost-hover-text", "#0B2A1F"),
        hoverBorder: getVal("--btn-ghost-hover-border", "transparent"),
      },
      link: {
        bg: getVal("--btn-link-bg", "transparent"),
        text: getVal("--btn-link-text", "#1F6F43"),
        border: getVal("--btn-link-border", "transparent"),
        hoverBg: getVal("--btn-link-hover-bg", "transparent"),
        hoverText: getVal("--btn-link-hover-text", "#2EA76A"),
        hoverBorder: getVal("--btn-link-hover-border", "transparent"),
      },
    },
    themes: {
      light: {
        bg: getVal("--bg", "#F4F6F5"),
        surface: getVal("--surface", "#FFFFFF"),
        text: getVal("--text", "#0B2A1F"),
        mutedText: getVal("--muted-text", "#5E6E65"),
        border: getVal("--border", "#DDE6E1"),
      },
      dark: {
        bg: getVal("--bg-dark", "#071B14"),
        surface: getVal("--surface-dark", "#0B2A1F"),
        text: getVal("--text-dark", "#EAF7F0"),
        mutedText: getVal("--muted-text-dark", "#98a19c"),
        border: getVal("--border-dark", "rgba(185, 243, 213, 0.22)"),
      },
    },
  };
};

/**
 * Parses a raw CSS string (typically from :root or style tag) and returns a GlobalStyleModel.
 */
export const transformRawToGlobalStyleModel = (
  css: string,
): GlobalStyleModel => {
  const vars: Record<string, string> = {};
  const declRegex = /(--[\w-]+)\s*:\s*([^;]+)/g;

  let match;
  while ((match = declRegex.exec(css)) !== null) {
    const key = match[1];
    const value = match[2].trim();

    // ✅ prevent overwrite (keeps :root value)
    if (!(key in vars)) {
      vars[key] = value;
    }
  }

  return transformVarsToGlobalStyleModel(vars);
};

/**
 * Updates a CSS string (containing variable declarations) with new values from a color palette.
 * This is useful for applying a full brand/button color palette to an existing CSS template.
 */
export const updateCssWithColors = (
  css: string,
  palette: {
    brand: BrandColors;
    buttons: Record<string, ButtonColors>;
  }
): string => {
  let updatedCss = css;

  // 1. Update Brand Colors
  const brandMap: Record<string, keyof BrandColors> = {
    "--primary": "primary",
    "--secondary": "secondary",
    "--accent": "accent",
    "--dark": "dark",
    "--ring": "ring",
    "--text": "text",
    "--muted-text": "mutedText",
    "--border": "border",
 
  };

  Object.entries(brandMap).forEach(([varName, key]) => {
    const value = palette.brand[key];
    if (value) {
      const regex = new RegExp(`${varName}\\s*:\\s*[^;]+`, 'g');
      updatedCss = updatedCss.replace(regex, `${varName}: ${value}`);
    }
  });

  // 2. Update Button Colors (primary, secondary, outline, etc.)
  Object.entries(palette.buttons).forEach(([btnType, colors]) => {
    //console.log("btnType", btnType);
    //console.log("colors", colors);
    const btnMap: Record<string, keyof ButtonColors> = {
      "bg": "bg",
      "text": "text",
      "border": "border",
      "hover-bg": "hoverBg",
      "hover-text": "hoverText",
      "hover-border": "hoverBorder",
    };

    Object.entries(btnMap).forEach(([subKey, colorKey]) => {
      
      const varName = `--btn-${btnType}-${subKey}`;
      const value = colors[colorKey];

      console.log("varName", varName);
      console.log("value", value);
      if (value) {
        const regex = new RegExp(`${varName}\\s*:\\s*[^;]+`, 'g');
        console.log("regex", regex);
        updatedCss = updatedCss.replace(regex, `${varName}: ${value}`);
      }
    });
  });

  return updatedCss;
};
