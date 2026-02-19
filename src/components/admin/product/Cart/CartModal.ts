export interface CardConfigModal {
    showRating?: boolean;
    showSaleBadge?: boolean;
    imageAspectRatio?: string; // e.g., "3/4", "1/1", "16/9"
    hoverEffect?: "scale" | "lift" | "none";
    placeholderIcon?: string; // emoji or text

}


export interface LayoutConfigModal {
    filterPosition?: "sidebar" | "top"; // Filter as sidebar or top dropdowns
    gridColumns?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
    };
    showHeroSection?: boolean;
    heroHeight?: string; // e.g., "40vh", "300px"
}

export interface StyleConfigModal {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    buttonStyle?: "rounded" | "square" | "pill";
    cardStyle?: "elevated" | "flat" | "bordered";
}

export interface HeroConfigModal {
    backgroundImage?: string;
    title?: string;
    subtitle?: string;
    overlayOpacity?: number; // 0-1
    titleColor?: string;
    titleSize?: string;
    titleTracking?: string;
}

export interface PaginationConfigModal {
    enabled?: boolean;
    position?: "top" | "bottom" | "both";
    style?: "numbers" | "simple" | "compact";
    buttonShape?: "square" | "rounded" | "circular";
    itemsPerPage?: number;
    showPageInfo?: boolean;
}

export interface FilterConfigModal {
    showCategoryFilter?: boolean;
    showColorPalette?: boolean;
    enableDynamicFilters?: boolean;
    filterStyle?: "checkbox" | "button" | "chip";
}

export interface ProductShowcaseProps {
    category?: string;

    // Layout Configuration
    layoutConfig?: LayoutConfigModal

    // Styling Configuration
    styleConfig?: StyleConfigModal

    // Hero Section Configuration
    heroConfig?: HeroConfigModal

    // Pagination Configuration
    paginationConfig?: PaginationConfigModal

    // Filter Configuration
    filterConfig?: FilterConfigModal

    // Product Card Configuration
    cardConfig?: CardConfigModal
}

