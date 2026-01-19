/**
 * Extracts script content from HTML string
 * @param html - The HTML string containing script tags
 * @returns Object containing HTML without scripts and array of script contents
 */
export function extractScriptsFromHtml(html: string): {
    htmlWithoutScripts: string;
    scripts: string[];
} {
    const scripts: string[] = [];

    // Extract all script tags and their content
    const htmlWithoutScripts = html.replace(
        /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
        (match, scriptContent) => {
            // Only extract inline scripts (not external src scripts)
            if (!match.includes('src=')) {
                scripts.push(scriptContent.trim());
            }
            return ''; // Remove the script tag from HTML
        }
    );

    return {
        htmlWithoutScripts: htmlWithoutScripts.trim(),
        scripts,
    };
}

/**
 * Extracts CSS from HTML string
 * @param html - The HTML string containing style tags
 * @returns Extracted CSS content
 */
export function extractCssFromHtml(html: string): string {
    const matches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (!matches) return '';

    return matches
        .map((styleTag) => {
            const inner = styleTag.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            return inner ? inner[1] : '';
        })
        .join('\n');
}

/**
 * Executes a script string safely in the browser
 * @param scriptContent - The JavaScript code to execute
 */
export function executeScript(scriptContent: string): void {
    try {
        // Create a new script element
        const script = document.createElement('script');
        script.textContent = scriptContent;

        // Append to document body to execute
        document.body.appendChild(script);

        // Optional: Remove the script element after execution
        // Uncomment if you want to clean up the DOM
        // document.body.removeChild(script);
    } catch (error) {
        console.error('Error executing script:', error);
    }
}
