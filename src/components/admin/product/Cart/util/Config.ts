// ================= DEFAULT CONFIGS =================

export const DEFAULT_LAYOUT_CONFIG = {
  filterPosition: "sidebar" as const,
  gridColumns: { mobile: 1, tablet: 2, desktop: 3 },
  showHeroSection: true,
  heroHeight: "40vh",
};

export const DEFAULT_STYLE_CONFIG = {
  primaryColor: "#000000",
  secondaryColor: "#666666",
  accentColor: "#2563eb",
  fontFamily: "Montserrat",
  buttonStyle: "square" as const,
  cardStyle: "flat" as const,
};

export const DEFAULT_HERO_CONFIG = {
  backgroundImage:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
  title: "",
  subtitle: "",
  overlayOpacity: 0.1,
  titleColor: "#ffffff",
  titleSize: "4xl md:text-5xl",
  titleTracking: "10px",
};

export const DEFAULT_PAGINATION_CONFIG = {
  enabled: true,
  position: "bottom" as const,
  style: "numbers" as const,
  buttonShape: "square" as const,
  itemsPerPage: 9,
  showPageInfo: true,
};

export const DEFAULT_FILTER_CONFIG = {
  showCategoryFilter: true,
  showColorPalette: true,
  enableDynamicFilters: true,
  filterStyle: "checkbox" as const,
};

export const DEFAULT_CARD_CONFIG = {
  showRating: true,
  showSaleBadge: true,
  imageAspectRatio: "3/4",
  hoverEffect: "scale" as const,
  placeholderIcon: "👕",
};


  // Get card style classes
  export const getCardStyleClasses = (cardStyle: string) => {
    switch (cardStyle) {
      case "elevated":
        return "shadow-lg hover:shadow-xl";
      case "bordered":
        return "border border-gray-200";
      case "flat":
      default:
        return "";
    }
  };