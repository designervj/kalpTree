/**
 * Extracts CSS variables from :root selector in HTML/CSS content
 */
export function extractCssVariables(htmlContent: string): string {
    if (!htmlContent) return '';

    // Try to extract <style> tags from HTML
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const styleMatches = htmlContent.matchAll(styleRegex);

    let rootCssVariables = '';

    for (const match of styleMatches) {
        const styleContent = match[1];

        // Extract :root block
        const rootRegex = /:root\s*\{([^}]*)\}/gi;
        const rootMatch = rootRegex.exec(styleContent);

        if (rootMatch && rootMatch[1]) {
            rootCssVariables += rootMatch[1].trim();
        }
    }

    return rootCssVariables;
}

/**
 * Extracts complete <style> content including :root and other styles
 */
export function extractStyleContent(htmlContent: string): string {
    if (!htmlContent) return '';

    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const styleMatches = htmlContent.matchAll(styleRegex);

    let allStyles = '';

    for (const match of styleMatches) {
        allStyles += match[1] + '\n';
    }

    return allStyles.trim();
}

/**
 * Extracts font links from HTML head
 */
export function extractFontLinks(htmlContent: string): string[] {
    if (!htmlContent) return [];

    const fontLinkRegex = /<link[^>]*href=["']([^"']*(?:fonts|font-awesome|all\.min\.css|css2\?family)[^"']*)["'][^>]*>/gi;
    const matches = htmlContent.matchAll(fontLinkRegex);

    const fontUrls: string[] = [];

    for (const match of matches) {
        fontUrls.push(match[1]);
    }

    return fontUrls;
}

/**
 * Creates a complete style string for injection into canvas
 */
export function createCanvasStyleString(htmlContent: string): string {
    const styleContent = extractStyleContent(htmlContent);

    if (!styleContent) {
        return `
      :root {
        --primary: #6366f1;
        --background: #ffffff;
        --text: #0f172a;
      }
      
      * { box-sizing: border-box; }
      
      body {
        margin: 0;
        font-family: system-ui, -apple-system, sans-serif;
      }
    `;
    }

    return styleContent;
}
