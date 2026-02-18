export function extractColors(cssString: string) {
    const colorRegex =
        /#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\([^)]+\)|\b(?:white|black|gray|grey|blue|red|green|yellow|orange|purple|pink)\b/gi;

    const matches = cssString.match(colorRegex) || [];

    const filteredMatches = matches.filter((color) => {
        const low = color.toLowerCase();

        // Filter out any colors that might start with 'var'
        if (low.startsWith("var")) {
            return false;
        }

        return true;
    });

    // Normalize colors and count occurrences
    const colorCounts = new Map<string, { color: string; count: number }>();

    for (const color of filteredMatches) {
        let normalized = color.toLowerCase();

        // Standardize hex values: #fff -> #ffffff
        if (normalized.startsWith("#") && normalized.length === 4) {
            normalized = "#" + normalized[1] + normalized[1] + normalized[2] + normalized[2] + normalized[3] + normalized[3];
        }

        const existing = colorCounts.get(normalized);
        if (existing) {
            existing.count++;
        } else {
            colorCounts.set(normalized, { color, count: 1 });
        }
    }

    // Convert Map to array and sort by count descending
    return Array.from(colorCounts.values()).sort((a, b) => b.count - a.count);
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
