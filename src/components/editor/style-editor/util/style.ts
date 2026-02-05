export interface ClassInfo {
    category: string;
    property: string;
    value: { px: string; rem: string; pxValue: number };
    displayName: string;
}

export interface FontSizeInfo {
    className: string;
    px: string;
    rem: string;
    pxValue: number;
}

// Tailwind CSS font size mappings
export const FONT_SIZE_MAP: Record<string, { px: string; rem: string; pxValue: number }> = {
    'text-xs': { px: '12px', rem: '0.75rem', pxValue: 12 },
    'text-sm': { px: '14px', rem: '0.875rem', pxValue: 14 },
    'text-base': { px: '16px', rem: '1rem', pxValue: 16 },
    'text-lg': { px: '18px', rem: '1.125rem', pxValue: 18 },
    'text-xl': { px: '20px', rem: '1.25rem', pxValue: 20 },
    'text-2xl': { px: '24px', rem: '1.5rem', pxValue: 24 },
    'text-3xl': { px: '30px', rem: '1.875rem', pxValue: 30 },
    'text-4xl': { px: '36px', rem: '2.25rem', pxValue: 36 },
    'text-5xl': { px: '48px', rem: '3rem', pxValue: 48 },
    'text-6xl': { px: '60px', rem: '3.75rem', pxValue: 60 },
    'text-7xl': { px: '72px', rem: '4.5rem', pxValue: 72 },
    'text-8xl': { px: '96px', rem: '6rem', pxValue: 96 },
    'text-9xl': { px: '128px', rem: '8rem', pxValue: 128 },
};

// Font size regex pattern
const FONT_SIZE_PATTERN = /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/;

/**
 * Parse font-size className and return ClassInfo
 * @param className - The Tailwind className to parse (e.g., 'text-xl')
 * @returns ClassInfo object if className matches font-size pattern, null otherwise
 */
export function parseFontSizeClass(className: string[]): ClassInfo | null {
    if (className.length === 0) return null;

    // Iterate through classNames to find a font-size class
    for (const item of className) {
        // Remove responsive prefixes (e.g., 'md:text-6xl' -> 'text-6xl')
        const baseClass = item.includes(':') ? item.split(':')[1] : item;

        // Check if this is a font-size class
        if (baseClass.startsWith('text-') && FONT_SIZE_MAP[baseClass]) {
            const sizeInfo = FONT_SIZE_MAP[baseClass];
            const size = baseClass.replace('text-', '');

            console.log("size", size);
            console.log("sizeInfo", sizeInfo);

            return {
                category: 'typography',
                property: 'font-size',
                value: sizeInfo,
                displayName: `Size: ${size.toUpperCase()} (${sizeInfo.px})`
            };
        }
    }

    return null;
}

/**
 * Get font size info by className
 * @param className - The Tailwind className (e.g., 'text-xl')
 * @returns Font size information or null if not found
 */
export function getFontSizeInfo(className: string): { px: string; rem: string; pxValue: number } | null {
    return FONT_SIZE_MAP[className] || null;
}


