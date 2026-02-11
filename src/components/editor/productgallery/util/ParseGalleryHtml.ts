import { GalleryConfig, Product, SavedGallery } from "../ProductGalleryPage";

/**
 * Parses a gallery HTML string back into a SavedGallery object.
 * @param html String containing the gallery HTML
 * @returns SavedGallery object
 */
export const parseGalleryHtml = (html: string): SavedGallery | null => {
    if (typeof window === 'undefined') return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const section = doc.querySelector('section[class^="product-gallery-"]');

    if (!section) return null;

    const classes = section.className;
    let layout: "grid" | "carousel" | "masonry" = "grid";
    if (classes.includes("carousel")) layout = "carousel";
    if (classes.includes("masonry")) layout = "masonry";

    const heading = section.querySelector('h1')?.textContent?.trim() || "";
    const subheading = section.querySelector('h2')?.textContent?.trim() || "";
    const description = section.querySelector('h2 + p')?.textContent?.trim() || "";

    const productElements = section.querySelectorAll('.grid-item, .gallery-item, .masonry-item');
    const products: Product[] = Array.from(productElements).map((el, index) => {
        const name = el.querySelector('h3')?.textContent?.trim() || "";
        const image = el.querySelector('img')?.getAttribute('src') || "";
        const badge = el.querySelector('span')?.textContent?.trim();

        // In the user's HTML: h3 is name, next p is category, next p is price
        const pElements = el.querySelectorAll('p');
        const category = pElements.length > 0 ? pElements[0].textContent?.trim() : "";
        const priceText = pElements.length > 1 ? pElements[1].textContent?.trim() : "0";
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

        return {
            id: el.getAttribute('data-index') || el.id || `product-${Date.now()}-${index}`,
            name,
            price,
            image,
            category,
            badge,
        };
    });


    // Extract config from styles if possible, else use defaults
    const config: GalleryConfig = {
        layout,
        columns: 3, // Default, would need more complex parsing to get from style
        gap: 20,    // Default
        showBadge: !!section.querySelector('span'),
        showPrice: !!section.querySelector('p[style*="font-size: 22px"], p[style*="font-size: 28px"]'),
        showDescription: false, // Hard to tell from just existence
        cardStyle: "default",
        hoverEffect: "lift",
    };

    return {
        id: section.id || `gallery-${Date.now()}`,
        heading,
        subheading,
        description,
        products,
        config,
        createdAt: new Date(),
    };
};
