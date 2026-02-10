

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
    brand: {
        primary: string;
        secondary: string;
        accent: string;
        dark: string;
        ring: string;
    };

    fonts: {
        body: string;
        heading: string;
        button: string;
    };

    headings: {
        h1: TypographyDetail;
        h2: TypographyDetail;
        h3: TypographyDetail;
        h4: TypographyDetail;
        h5: TypographyDetail;
        h6: TypographyDetail;
    };

    body: TypographyDetail & {
        maxWidth: string;
        paragraphGap: string;
    };

    buttons: {
        base: {
            size: string;
            weight: number;
            letterSpacing: string;
            transform: string;
            radius: string;
            height: string;
            paddingX: string;
            borderWidth: string;
            shadow: string;
            transition: string;
        };
        primary: ButtonStyle;
        secondary: ButtonStyle;
        outline: ButtonStyle;
    };

    themes: {
        light: ThemeColors;
        dark: ThemeColors;
    };

    createdAt: Date;
    updatedAt: Date;
}

const stripUnit = (val: string) => val ? val.replace(/[^\d.]/g, '') : '';
const getNum = (val: string, fallback: number) => {
    const n = parseFloat(stripUnit(val));
    return isNaN(n) ? fallback : n;
};

/**
 * Transforms a Record of CSS variables into a structured GlobalStyleModel.
 * Provides logical defaults if variables are missing.
 */
export const transformVarsToGlobalStyleModel = (vars: Record<string, string>): GlobalStyleModel => {
    const getVal = (key: string, fallback: string) => vars[key] || fallback;

    return {
        brand: {
            primary: getVal('--primary', '#898080'),
            secondary: getVal('--secondary', '#2EA76A'),
            accent: getVal('--accent', '#B9F3D5'),
            dark: getVal('--dark', '#0B3A2A'),
            ring: getVal('--ring', '#2EA76A'),
        },
        fonts: {
            body: getVal('--font-body', 'Inter, sans-serif'),
            heading: getVal('--font-heading', 'Inter, sans-serif'),
            button: getVal('--font-button', 'Inter, sans-serif'),
        },
        headings: {
            h1: { size: getVal('--h1-size', '20px'), weight: getNum(getVal('--h1-weight', '700'), 700), lineHeight: getNum(getVal('--h1-lh', '1.2'), 1.2), letterSpacing: getVal('--h1-ls', '0em') },
            h2: { size: getVal('--h2-size', '20px'), weight: getNum(getVal('--h2-weight', '700'), 700), lineHeight: getNum(getVal('--h2-lh', '1.2'), 1.2), letterSpacing: getVal('--h2-ls', '0em') },
            h3: { size: getVal('--h3-size', '20px'), weight: getNum(getVal('--h3-weight', '700'), 700), lineHeight: getNum(getVal('--h3-lh', '1.2'), 1.2), letterSpacing: getVal('--h3-ls', '0em') },
            h4: { size: getVal('--h4-size', '20px'), weight: getNum(getVal('--h4-weight', '700'), 700), lineHeight: getNum(getVal('--h4-lh', '1.2'), 1.2), letterSpacing: getVal('--h4-ls', '0em') },
            h5: { size: getVal('--h5-size', '20px'), weight: getNum(getVal('--h5-weight', '700'), 700), lineHeight: getNum(getVal('--h5-lh', '1.2'), 1.2), letterSpacing: getVal('--h5-ls', '0em') },
            h6: { size: getVal('--h6-size', '20px'), weight: getNum(getVal('--h6-weight', '700'), 700), lineHeight: getNum(getVal('--h6-lh', '1.2'), 1.2), letterSpacing: getVal('--h6-ls', '0em') },
        },
        body: {
            size: getVal('--body-size', '17px'),
            weight: getNum(getVal('--body-weight', '400'), 400),
            lineHeight: getNum(getVal('--body-lh', '1.7'), 1.7),
            letterSpacing: getVal('--body-ls', '0em'),
            maxWidth: getVal('--body-maxw', '62ch'),
            paragraphGap: getVal('--body-paragraph-gap', '14px'),
        },
        buttons: {
            base: {
                size: getVal('--btn-size', '14px'),
                weight: getNum(getVal('--btn-weight', '500'), 500),
                letterSpacing: getVal('--btn-ls', '0.02em'),
                transform: getVal('--btn-transform', 'none'),
                radius: getVal('--btn-radius', '12px'),
                height: getVal('--btn-height', '40px'),
                paddingX: getVal('--btn-padding-x', '1.5rem'),
                borderWidth: getVal('--btn-border-width', '1px'),
                shadow: getVal('--btn-shadow', 'none'),
                transition: getVal('--btn-transition', '160ms'),
            },
            primary: {
                bg: getVal('--btn-primary-bg', '#1F6F43'),
                text: getVal('--btn-primary-text', '#FFFFFF'),
                border: getVal('--btn-primary-border', '#1F6F43'),
                hoverBg: getVal('--btn-primary-hover-bg', '#185A37'),
                hoverText: getVal('--btn-primary-hover-text', '#FFFFFF'),
                hoverBorder: getVal('--btn-primary-hover-border', '#185A37'),
            },
            secondary: {
                bg: getVal('--btn-secondary-bg', '#2EA76A'),
                text: getVal('--btn-secondary-text', '#FFFFFF'),
                border: getVal('--btn-secondary-border', '#2EA76A'),
                hoverBg: getVal('--btn-secondary-hover-bg', '#28925C'),
                hoverText: getVal('--btn-secondary-hover-text', '#FFFFFF'),
                hoverBorder: getVal('--btn-secondary-hover-border', '#28925C'),
            },
            outline: {
                bg: getVal('--btn-outline-bg', 'transparent'),
                text: getVal('--btn-outline-text', '#1F6F43'),
                border: getVal('--btn-outline-border', '#1F6F43'),
                hoverBg: getVal('--btn-outline-hover-bg', '#1F6F43'),
                hoverText: getVal('--btn-outline-hover-text', '#FFFFFF'),
                hoverBorder: getVal('--btn-outline-hover-border', '#1F6F43'),
            },
        },
        themes: {
            light: {
                bg: getVal('--bg', '#F4F6F5'),
                surface: getVal('--surface', '#FFFFFF'),
                text: getVal('--text', '#0B2A1F'),
                mutedText: getVal('--muted-text', '#5E6E65'),
                border: getVal('--border', '#DDE6E1'),
            },
            dark: {
                bg: getVal('--bg-dark', '#0B2A1F'),
                surface: getVal('--surface-dark', '#153D2F'),
                text: getVal('--text-dark', '#F4F6F5'),
                mutedText: getVal('--muted-text-dark', '#A1B1A9'),
                border: getVal('--border-dark', '#1F4D3C'),
            },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

/**
 * Parses a raw CSS string (typically from :root or style tag) and returns a GlobalStyleModel.
 */
export const transformRawToGlobalStyleModel = (css: string): GlobalStyleModel => {
    const vars: Record<string, string> = {};
    const declRegex = /(--[\w-]+)\s*:\s*([^;]+)/g;
    let match;
    while ((match = declRegex.exec(css)) !== null) {
        vars[match[1]] = match[2].trim();
    }
    return transformVarsToGlobalStyleModel(vars);
};
