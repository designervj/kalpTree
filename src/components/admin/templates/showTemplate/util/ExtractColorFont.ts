export function extractColors(cssString: string) {
    const colorRegex =
        /#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\([^)]+\)|var\(--[^)]+\)|\b(?:white|black|gray|grey|blue|red|green|yellow|orange|purple|pink)\b/gi;

    const matches = cssString.match(colorRegex) || [];

    // Patterns that are definitely NOT colors (structural properties)
    const nonColorIndicators = [
        "-size", "-weight", "-lh", "-ls", "-h", "-w", "-pad", "-radius",
        "-border-w", "-transform", "-transition", "-height", "-width", "-gap",
        "-index", "-duration", "-delay", "-opacity", "-shadow"
    ];

    // Specific variables to exclude as they represent functional/abstract concepts rather than palette colors
    const excludedVariables = [
        "var(--border)", "var(--bg)", "var(--link)", "var(--link-hover)",
        "var(--announce-h)", "var(--nav-h)", "var(--font-heading)", "var(--font-body)",
        "var(--input-focus-border)", "var(--input-focus-shadow)", "var(--btn-height)"
    ];

    const filteredMatches = matches.filter((color) => {
        const low = color.toLowerCase();

        // Exclude explicit names marked by the user
        if (excludedVariables.includes(low)) return false;

        // Filter out CSS variables that represent non-color properties
        if (low.startsWith("var(--")) {
            if (nonColorIndicators.some((indicator) => low.includes(indicator))) {
                return false;
            }
            // Exclude generic font/spacing variables
            if (low.includes("font-") || low.includes("spacing-")) {
                return false;
            }
        }

        return true;
    });

    // Normalize colors to prevent duplicates (e.g., #fff vs #ffffff)
    const seenNormalized = new Set<string>();
    const uniqueColors: string[] = [];

    for (const color of filteredMatches) {
        let normalized = color.toLowerCase();

        // Standardize hex values: #fff -> #ffffff
        if (normalized.startsWith("#") && normalized.length === 4) {
            normalized = "#" + normalized[1] + normalized[1] + normalized[2] + normalized[2] + normalized[3] + normalized[3];
        }

        if (!seenNormalized.has(normalized)) {
            seenNormalized.add(normalized);
            uniqueColors.push(color);
        }
    }

    return uniqueColors;
}


export function extractFontsAndSizesFromHTML(htmlString: string) {
    // 1️⃣ Extract <style> content
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let cssContent = "";
    let match;

    while ((match = styleRegex.exec(htmlString)) !== null) {
        cssContent += match[1] + "\n";
    }

    // 2️⃣ Extract inline styles
    const inlineRegex = /style\s*=\s*["']([^"']+)["']/gi;
    while ((match = inlineRegex.exec(htmlString)) !== null) {
        cssContent += match[1] + "\n";
    }

    const fonts = new Set<string>();
    const fontSizes = new Set<string>();

    // 3️⃣ Extract font-family
    const fontFamilyRegex = /font-family\s*:\s*([^;}\n]+)/gi;
    while ((match = fontFamilyRegex.exec(cssContent)) !== null) {
        const families = match[1]
            .split(",")
            .map(f => f.trim().replace(/['"]/g, ""));
        families.forEach(f => {
            if (!f.startsWith("var(--")) {
                fonts.add(f);
            }
        });
    }

    // 4️⃣ Extract font-size
    const fontSizeRegex = /font-size\s*:\s*([^;}\n]+)/gi;
    while ((match = fontSizeRegex.exec(cssContent)) !== null) {
        const size = match[1].trim();
        if (!size.startsWith("var(--")) {
            fontSizes.add(size);
        }
    }

    // 5️⃣ Extract Google Fonts
    const googleFontRegex =
        /fonts\.googleapis\.com\/css2\?family=([^"&]+)/gi;

    while ((match = googleFontRegex.exec(htmlString)) !== null) {
        const families = match[1]
            .split("&family=")
            .map(f => decodeURIComponent(f.split(":")[0]));
        families.forEach(f => {
            if (!f.startsWith("var(--")) {
                fonts.add(f);
            }
        });
    }

    return {
        fontFamilies: Array.from(fonts),
        fontSizes: Array.from(fontSizes),
    };
}
