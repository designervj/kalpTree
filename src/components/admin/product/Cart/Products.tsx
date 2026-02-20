"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  Star,
  Trash2,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addProductInCart,
  removeProductInCart,
  updateProductQtyInCart,
} from "@/hooks/slices/product/ProductSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { groupAttributesByTitle } from "@/lib/utils";
import ProductCart from "./ProductCart";
import { ProductVariant } from "@/modules/ecommerce/types";
import { DEFAULT_CARD_CONFIG, DEFAULT_FILTER_CONFIG, DEFAULT_HERO_CONFIG, DEFAULT_LAYOUT_CONFIG, DEFAULT_PAGINATION_CONFIG, DEFAULT_STYLE_CONFIG } from "./util/Config";
import { ProductShowcaseProps } from "./CartModal";


const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  category = "All Products",
  layoutConfig = {},
  styleConfig = {},
  heroConfig = {},
  paginationConfig = {},
  filterConfig = {},
  cardConfig = {},
}) => {
  const mergedLayoutConfig = useMemo(
    () => ({
      ...DEFAULT_LAYOUT_CONFIG,
      ...layoutConfig,
      gridColumns: {
        ...DEFAULT_LAYOUT_CONFIG.gridColumns,
        ...layoutConfig?.gridColumns,
      },
    }),
    [layoutConfig],
  );

  const mergedStyleConfig = useMemo(
    () => ({
      ...DEFAULT_STYLE_CONFIG,
      ...styleConfig,
    }),
    [styleConfig],
  );

  const mergedHeroConfig = useMemo(
    () => ({
      ...DEFAULT_HERO_CONFIG,
      ...heroConfig,
      title: heroConfig?.title ?? category,
    }),
    [heroConfig, category],
  );

  const mergedPaginationConfig = useMemo(
    () => ({
      ...DEFAULT_PAGINATION_CONFIG,
      ...paginationConfig,
    }),
    [paginationConfig],
  );

  const mergedFilterConfig = useMemo(
    () => ({
      ...DEFAULT_FILTER_CONFIG,
      ...filterConfig,
    }),
    [filterConfig],
  );

   const mergedCardConfig = useMemo(
    () => ({
      ...DEFAULT_CARD_CONFIG,
      ...cardConfig,
    }),
    [cardConfig],
  );

  // Destructure with defaults
  const { filterPosition, gridColumns, showHeroSection, heroHeight } =
    mergedLayoutConfig;

  // Style
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    fontFamily,
    buttonStyle,
    cardStyle,
  } = mergedStyleConfig;

  // Hero
  const {
    backgroundImage,
    title,
    subtitle,
    overlayOpacity,
    titleColor,
    titleSize,
    titleTracking,
  } = mergedHeroConfig;

  // Pagination
  const {
    enabled: paginationEnabled,
    position: paginationPosition,
    style: paginationStyle,
    buttonShape,
    itemsPerPage,
    showPageInfo,
  } = mergedPaginationConfig;

  // Filter
  const {
    showCategoryFilter,
    showColorPalette,
    enableDynamicFilters,
    filterStyle,
  } = mergedFilterConfig;

  // Card
  const {
    showRating,
    showSaleBadge,
    imageAspectRatio,
    hoverEffect,
    placeholderIcon,
  } = mergedCardConfig;

  // State management
  const [showCart, setShowCart] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(
    filterPosition === "sidebar",
  );
  const [sortBy, setSortBy] = useState("price-high");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilters, setCategoryFilters] = useState({
    all: true,
    tops: false,
    knitwear: false,
  });
  const [dynamicFilters, setDynamicFilters] = useState<
    Record<string, string[]>
  >({});

  // Redux state
  const {
    listProduct: products,
    isProductLoading,
    cart,
    isCartLoading,
  } = useSelector((state: RootState) => state.product);

  const { listCategory } = useSelector((state: RootState) => state.category);

  console.log(listCategory);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Cart functions
  const removeFromCart = (index: number) => {
    dispatch(removeProductInCart(index));
  };

  const updateQuantity = (index: number, delta: number) => {
    dispatch(updateProductQtyInCart({ index, delta }));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products?.find((d) => d._id == item?.productId);
      const variant = product?.variants.find((d) => d._id == item?.variantId);
      const price = parseFloat(variant?.price || "0");
      return total + price * item?.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    const data = JSON.stringify(cart);
    const href = encodeURIComponent(data);
    if (cart.length <= 0) {
      toast.error("Please Add Product");
      return;
    }
    router.push(`/checkout?data=${href}`);
  };

  const handleProductClick = (product: any) => {
    router.push(`/product/${product._id}`);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Generate dynamic filters
  const filteringOptions = useMemo(() => {
    if (!enableDynamicFilters) return [];
    let data = products
      .flatMap((product: any) => product.options)
      .filter((d) => d.useForVariants);
    return groupAttributesByTitle(data);
  }, [products, enableDynamicFilters]);

  const toggleDynamicFilter = (filterTitle: string, value: string) => {
    setDynamicFilters((prev) => {
      const currentValues = prev[filterTitle] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterTitle]: newValues };
    });
    setCurrentPage(1); // Reset to first page when filtering
  };

  const isFilterSelected = (filterTitle: string, value: string) => {
    return dynamicFilters[filterTitle]?.includes(value) || false;
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    const slug =
      category !== "All Products"
        ? listCategory.find((d) => d.slug == category)
        : null;

    if (slug == undefined) {
      return [];
    }

    let filtered = [...products].filter((d) =>
      slug ? d?.allcategories?.includes(slug?._id) : true,
    );

    Object.entries(dynamicFilters).forEach(([filterTitle, selectedValues]) => {
      if (selectedValues.length > 0) {
        filtered = filtered.filter((product) =>
          product?.variants?.some((variant) =>
            variant?.attributes?.some(
              (attr) =>
                attr?.attributeName === filterTitle &&
                selectedValues.includes(attr?.value?.trim()),
            ),
          ),
        );
      }
    });

    return filtered;
  };

  const getSortedProducts = () => {
    const filtered = getFilteredProducts();

    if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const priceA = Math.min(...a?.variants?.map((v:ProductVariant) => parseFloat(v?.price??"0")));
        const priceB = Math.min(...b?.variants?.map((v:ProductVariant) => parseFloat(v?.price??"0")));
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const priceA = Math.min(...a?.variants?.map((v:ProductVariant) => parseFloat(v?.price??"0")));
        const priceB = Math.min(...b?.variants?.map((v:ProductVariant) => parseFloat(v?.price??"0")));
        return priceB - priceA;
      });
    }

    return filtered;
  };

  // Pagination
  const allProducts = getSortedProducts();
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);
   console.log("paginatedProducts",paginatedProducts)
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Get grid class based on configuration
  const getGridClass = () => {
    const mobile = gridColumns.mobile || 1;
    const tablet = gridColumns.tablet || 2;
    const desktop = gridColumns.desktop || 3;

    const gridMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };

    const tabletMap: Record<number, string> = {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
      6: "md:grid-cols-6",
    };

    const desktopMap: Record<number, string> = {
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
      6: "lg:grid-cols-6",
    };

    return `${gridMap[mobile]} ${tabletMap[tablet]} ${desktopMap[desktop]}`;
  };

  // Button shape class
  const getButtonShapeClass = () => {
    switch (buttonShape) {
      case "circular":
        return "rounded-full";
      case "rounded":
        return "rounded-lg";
      default:
        return "";
    }
  };

  // Get button style class based on buttonStyle prop
  const getButtonStyleClass = () => {
    switch (buttonStyle) {
      case "pill":
        return "rounded-full";
      case "rounded":
        return "rounded-lg";
      case "square":
      default:
        return "rounded-none";
    }
  };



  // Product Card Component
  // const ProductCard = ({ product }: { product: any }) => {
  //   const minPrice = Math.min(
  //     ...product.variants.map((v) => parseFloat(v.price)),
  //   );
  //   const hasDiscount = parseFloat(product.basePrice) > minPrice;

  //   const hoverClasses = {
  //     scale: "group-hover:scale-105",
  //     lift: "group-hover:-translate-y-2",
  //     none: "",
  //   };

  //   return (
  //     <div
  //       className={`group cursor-pointer transition-all duration-300 ${getCardStyleClasses()}`}
  //       onClick={() => handleProductClick(product)}
  //     >
  //       <div
  //         className="relative bg-gray-100 overflow-hidden mb-4"
  //         style={{ aspectRatio: imageAspectRatio }}
  //       >
  //         {placeholderIcon && (
  //           <div
  //             className={`absolute inset-0 flex items-center justify-center text-8xl opacity-20 transition-transform duration-600 ${hoverClasses[hoverEffect]}`}
  //           >
  //             {placeholderIcon}
  //           </div>
  //         )}
  //         {hasDiscount && showSaleBadge && (
  //           <div
  //             className="absolute top-3 left-3 text-white px-2.5 py-1 text-[10px] font-bold"
  //             style={{ backgroundColor: primaryColor }}
  //           >
  //             Sale
  //           </div>
  //         )}
  //       </div>

  //       {showRating && (
  //         <div
  //           className="stars text-[11px] mb-1.5"
  //           style={{ color: "#fbbf24" }}
  //         >
  //           ★★★★★
  //         </div>
  //       )}
  //       <div
  //         className="title text-sm font-medium mb-1.5"
  //         style={{ color: primaryColor }}
  //       >
  //         {product.title}
  //       </div>
  //       <div className="price text-[13px]">
  //         {hasDiscount && (
  //           <span
  //             className="old-price line-through mr-2"
  //             style={{ color: secondaryColor }}
  //           >
  //             ₹{product.basePrice}
  //           </span>
  //         )}
  //         <span className="new-price font-bold" style={{ color: primaryColor }}>
  //           ₹{minPrice}
  //         </span>
  //       </div>
  //     </div>
  //   );
  // };

  // Pagination Component
  const PaginationComponent = () => {
    if (!paginationEnabled || totalPages <= 1) return null;

    if (paginationStyle === "simple") {
      return (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-3 border transition-all ${getButtonShapeClass()}`}
            style={{
              borderColor: primaryColor,
              color: currentPage === 1 ? secondaryColor : primaryColor,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {showPageInfo && (
            <span style={{ color: secondaryColor }}>
              Page {currentPage} of {totalPages}
            </span>
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-3 border transition-all ${getButtonShapeClass()}`}
            style={{
              borderColor: primaryColor,
              color: currentPage === totalPages ? secondaryColor : primaryColor,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      );
    }

    if (paginationStyle === "compact") {
      const pages: (number | string)[] = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(
            1,
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
          );
        } else {
          pages.push(
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
          );
        }
      }

      return (
        <div className="flex justify-center gap-2">
          {pages.map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === "number" && goToPage(page)}
              disabled={page === "..."}
              className={`w-11 h-11 flex items-center justify-center border text-sm font-semibold transition-all ${getButtonShapeClass()}`}
              style={{
                backgroundColor:
                  page === currentPage ? primaryColor : "transparent",
                color: page === currentPage ? "#ffffff" : primaryColor,
                borderColor: page === currentPage ? primaryColor : "#e5e7eb",
                cursor: page === "..." ? "default" : "pointer",
              }}
            >
              {page}
            </button>
          ))}
        </div>
      );
    }

    // Default "numbers" style
    return (
      <div className="flex justify-center gap-2">
        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-11 h-11 flex items-center justify-center border text-sm font-semibold transition-all ${getButtonShapeClass()}`}
              style={{
                backgroundColor:
                  page === currentPage ? primaryColor : "transparent",
                color: page === currentPage ? "#ffffff" : primaryColor,
                borderColor: page === currentPage ? primaryColor : "#e5e7eb",
              }}
            >
              {page}
            </button>
          ),
        )}
      </div>
    );
  };

  // Top Filters (Select dropdowns)
  const TopFilters = () => (
    <div className="flex flex-wrap gap-4 mb-8">
      {showCategoryFilter && (
        <select
          className={`border px-4 py-2 text-sm font-semibold uppercase ${getButtonStyleClass()}`}
          style={{
            fontFamily,
            borderColor: primaryColor,
            color: primaryColor,
          }}
        >
          <option>All Categories</option>
          <option>Tops & Tees</option>
          <option>Knitwear</option>
        </select>
      )}

      {enableDynamicFilters &&
        filteringOptions.map((filter, idx) => (
          <select
            key={idx}
            onChange={(e) => {
              const value = e.target.value;
              if (value) toggleDynamicFilter(filter.title, value);
            }}
            className={`border px-4 py-2 text-sm font-semibold uppercase ${getButtonStyleClass()}`}
            style={{
              fontFamily,
              borderColor: primaryColor,
              color: primaryColor,
            }}
          >
            <option value="">{filter.title}</option>
            {filter.values.map((value, vIdx) => (
              <option key={vIdx} value={value}>
                {value}
              </option>
            ))}
          </select>
        ))}
    </div>
  );

  // Sidebar Filters
  const SidebarFilters = () => (
    <aside className="w-64 flex-shrink-0 sticky top-5">
      {showCategoryFilter && (
        <div className="mb-6 border-b border-gray-100 pb-5">
          <div className="flex justify-between items-center cursor-pointer py-2.5 mb-3">
            <h3
              className="text-[13px] uppercase tracking-wider font-semibold"
              style={{ fontFamily, color: primaryColor }}
            >
              Category
            </h3>
            <span>▲</span>
          </div>
          <div className="space-y-3">
            {["All Arrivals", "Tops & Tees", "Knitwear"].map((cat, idx) => (
              <label
                key={idx}
                className="flex items-center text-[13px] cursor-pointer"
                style={{ color: secondaryColor }}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-3"
                  style={{ accentColor: primaryColor }}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>
      )}

      {enableDynamicFilters &&
        filteringOptions.map((filter, filterIndex) => (
          <div key={filterIndex} className="mb-6 border-b border-gray-100 pb-5">
            <div className="flex justify-between items-center cursor-pointer py-2.5 mb-3">
              <h3
                className="text-[13px] uppercase tracking-wider font-semibold"
                style={{ fontFamily, color: primaryColor }}
              >
                {filter.title}
              </h3>
              <span>▲</span>
            </div>
            <div className="space-y-3">
              {/* {filter.values.map((value, valueIndex) => (
                <label
                  key={valueIndex}
                  className="flex items-center text-[13px] cursor-pointer"
                  style={{ color: secondaryColor }}
                >
                  <input
                    type="checkbox"
                    checked={isFilterSelected(filter.title, value)}
                    onChange={() => toggleDynamicFilter(filter.title, value)}
                    className="w-4 h-4 mr-3"
                    style={{ accentColor: primaryColor }}
                  />
                  {value}
                </label>
              ))} */}
            </div>
          </div>
        ))}

      {showColorPalette && (
        <div className="mb-6 border-b border-gray-100 pb-5">
          <div className="flex justify-between items-center cursor-pointer py-2.5 mb-3">
            <h3
              className="text-[13px] uppercase tracking-wider font-semibold"
              style={{ fontFamily, color: primaryColor }}
            >
              Color Palette
            </h3>
            <span>▲</span>
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {["#000000", "#1d4ed8", "#92400e", "#d1d5db", "#fbcfe8"].map(
              (color, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ),
            )}
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#fdfdfd]" style={{ fontFamily }}>
      {/* Hero Section */}
      {showHeroSection && (
        <header
          className="w-full bg-cover bg-center flex items-center justify-center text-center mb-8"
          style={{
            height: heroHeight,
            backgroundImage: `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url('${backgroundImage}')`,
          }}
        >
          <div>
            <h1
              className="uppercase drop-shadow-lg"
              style={{
                color: titleColor,
                letterSpacing: titleTracking,
                fontFamily,
                fontSize: titleSize.includes("xl")
                  ? titleSize.replace("text-", "").replace("md:text-", "")
                  : titleSize,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-lg" style={{ color: titleColor }}>
                {subtitle}
              </p>
            )}
          </div>
        </header>
      )}

      <div className="max-w-[1440px] mx-auto px-10 pb-24">
        {/* Top Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-b border-gray-200 mb-8 gap-5">
          <div className="flex gap-4">
            {filterPosition === "sidebar" && (
              <button
                onClick={toggleSidebar}
                className={`bg-white border px-5 py-3 text-xs font-semibold uppercase transition-colors flex items-center gap-2.5 ${getButtonStyleClass()}`}
                style={{
                  fontFamily,
                  borderColor: primaryColor,
                  color: primaryColor,
                }}
              >
                <span>☰</span>
                <span>{sidebarVisible ? "Hide Filters" : "Show Filters"}</span>
              </button>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`bg-white border px-5 py-3 pr-9 text-xs font-semibold uppercase appearance-none cursor-pointer ${getButtonStyleClass()}`}
              style={{
                fontFamily,
                borderColor: primaryColor,
                color: primaryColor,
              }}
            >
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {showPageInfo && (
            <div className="text-right">
              <div
                className="text-[13px] font-medium mb-1"
                style={{ color: secondaryColor }}
              >
                Showing {startIndex + 1}-
                {Math.min(endIndex, allProducts.length)} of {allProducts.length}{" "}
                Products
              </div>
            </div>
          )}
        </div>

        {/* Top Filters */}
        {filterPosition === "top" && <TopFilters />}

        {/* Pagination Top */}
        {paginationEnabled &&
          (paginationPosition === "top" || paginationPosition === "both") && (
            <div className="mb-8">
              <PaginationComponent />
            </div>
          )}

        <div className="flex gap-12 items-start">
          {/* Sidebar Filters */}
          {filterPosition === "sidebar" && sidebarVisible && <SidebarFilters />}

          {/* Product Grid */}
          <div className="flex-1">
            <ProductCart 
            product={paginatedProducts}
            cardConfig={mergedCardConfig}
            mergedStyleConfig={mergedStyleConfig}
            />
            {/* <main className={`grid gap-x-6 gap-y-10 ${getGridClass()}`}>
              {paginatedProducts.map((product) => (
                <ProductCart key={product._id} product={product} />
              ))} */}
            {/* </main> */}

            {/* Pagination Bottom */}
            {paginationEnabled &&
              (paginationPosition === "bottom" ||
                paginationPosition === "both") && (
                <div className="mt-20">
                  <PaginationComponent />
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowCart(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: primaryColor }}
                >
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  style={{ color: secondaryColor }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <p
                    className="text-center mt-8"
                    style={{ color: secondaryColor }}
                  >
                    Your cart is empty
                  </p>
                ) : (
                  cart.map((item, index) => {
                    const product = products.find(
                      (d) => d._id == item.productId,
                    );
                    const variant = product?.variants.find(
                      (d) => d._id == item.variantId,
                    );

                    return (
                      <div key={index} className="mb-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold">{product?.title}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {variant?.attributes.map((attr, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                                >
                                  {attr.attributeName}: {attr.value}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              SKU: {variant?.sku}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, 1)}
                              className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <span
                            className="font-bold"
                            style={{ color: accentColor }}
                          >
                            ₹{parseFloat(variant?.price || "0") * item.quantity}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: accentColor }}
                    >
                      ₹{getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className={`w-full py-3 font-semibold transition-colors ${getButtonStyleClass()}`}
                    style={{ backgroundColor: accentColor, color: "#ffffff" }}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-40"
        style={{ backgroundColor: primaryColor, color: "#ffffff" }}
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span
            className="absolute -top-2 -right-2 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold"
            style={{ backgroundColor: "#ef4444" }}
          >
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default ProductShowcase;
