"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { groupAttributesByTitle } from "@/lib/utils";

// Type definitions for component props
interface CategoryPageProps {
  category?: string;

  categoryConfig?: {
    name?: string;
    description?: string;
    subcategories?: string[];
    backgroundImage?: string;
  };

  breadcrumbs?: Array<{ label: string; href: string }>;

  // Theme configuration
  theme?: "light" | "dark";
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  category = "All Products",
  categoryConfig = {
    name: "Living Room",
    description:
      "Curated seating, tables, and decor — premium textures and timeless shapes, built for everyday living.",
    subcategories: ["Seating", "Tables", "Lighting", "Decor", "Storage"],
    backgroundImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000",
  },
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ],
  theme = "light",
}) => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dynamicFilters, setDynamicFilters] = useState<
    Record<string, string[]>
  >({});

  const router = useRouter();

  // Redux state - same as first component
  const { listProduct: products, isProductLoading } = useSelector(
    (state: RootState) => state.product,
  );


  const { listCategory } = useSelector((state: RootState) => state.category);

  // Get current category data
  const currentCategory = useMemo(() => {
    if (category === "All Products") {
      
      return {
        name: categoryConfig.name || "All Products",
        description: categoryConfig.description || "",
        slug: "all",
      };
    }
    const foundCategory = listCategory.find((d) => d.slug === category);

    return {
      name: foundCategory?.name || categoryConfig.name || category,
      description:
        foundCategory?.description || categoryConfig.description || "",
      slug: foundCategory?.slug || category,
    };
  }, [category, listCategory, categoryConfig]);



  // Generate dynamic filters from product options (same as first component)
  const filteringOptions = useMemo(() => {
    let data = products
      .flatMap((product: any) => product.options)
      .filter((d) => d.useForVariants);
    return groupAttributesByTitle(data);
  }, [products]);

  const toggleDynamicFilter = (filterTitle: string, value: string) => {
    setDynamicFilters((prev) => {
      const currentValues = prev[filterTitle] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterTitle]: newValues };
    });
  };

  const isFilterSelected = (filterTitle: string, value: string) => {
    return dynamicFilters[filterTitle]?.includes(value) || false;
  };
  

  // Get filtered products by category (same logic as first component)
  const getFilteredProducts = () => {
    const slug =
      category !== "All Products"
        ? listCategory.find((d) => d.slug == category)
        : null;

     

    let filtered = [...products].filter((d) =>
      slug ? d.allcategories.includes(slug?._id) : true,
    );

    // Apply dynamic filters (same as first component)
    Object.entries(dynamicFilters).forEach(([filterTitle, selectedValues]) => {
      if (selectedValues.length > 0) {
        filtered = filtered.filter((product) =>
          product.variants.some((variant) =>
            variant.attributes.some(
              (attr) =>
                attr.attributeName === filterTitle &&
                selectedValues.includes(attr.value.trim()),
            ),
          ),
        );
      }
    });

    // Price filter
    if (minPrice || maxPrice) {
      filtered = filtered.filter((product) => {
        const minProductPrice = Math.min(
          ...product.variants.map((v) => parseFloat(v.price)),
        );
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        return minProductPrice >= min && minProductPrice <= max;
      });
    }

    return filtered;
  };

  const filteredProducts = useMemo(() => {
    return getFilteredProducts();
  }, [products, category, minPrice, maxPrice, dynamicFilters, listCategory]);

  const handleProductClick = (product: any) => {
    router.push(`/product/${product._id}`);
  };

  return (
    <div data-theme={currentTheme} style={{ minHeight: "100vh" }}>
      <style>{`
        /* Global Tokens */
        :root {
          --primary: #0d6533;
          --secondary: #98c45f;
          --accent: #cfe7b1;
          --dark: #063a1d;
          --ring: #98c45f;
          --bg: #ffffff;
          --surface: #ffffff;
          --surface-2: #ffffff;
          --text: #111;
          --muted-text: #666;
          --border: rgba(0, 0, 0, 0.12);
          --link: var(--primary);
          --link-hover: #0a522a;
          --shadow-sm: 0 6px 18px rgba(0, 0, 0, 0.06);
          --shadow-md: 0 16px 40px rgba(0, 0, 0, 0.1);
          --radius-sm: 10px;
          --radius-md: 14px;
          --radius-lg: 18px;
          --font-body: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          --font-heading: "Cormorant Garamond", Georgia, "Times New Roman", serif;
          --container-pad: 5%;
        }

        [data-theme="light"] {
          --bg: #f7faf5;
          --surface: #ffffff;
          --surface-2: #fcfdfb;
          --text: #0b1610;
          --muted-text: #55685b;
          --border: rgba(13, 101, 51, 0.14);
          --card-bg: #ffffff;
          --card-border: rgba(0, 0, 0, 0.08);
          --card-shadow: 0 14px 45px rgba(0, 0, 0, 0.08);
        }

        [data-theme="dark"] {
          --bg: #06130b;
          --surface: #0a2013;
          --surface-2: #0d2818;
          --text: #eaf4ec;
          --muted-text: #a9b8ae;
          --border: rgba(152, 196, 95, 0.22);
          --link: #a9e07a;
          --link-hover: #c9f2a7;
          --card-bg: #0b2416;
          --card-border: rgba(152, 196, 95, 0.22);
          --card-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
        }

        .category-container {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          line-height: 1.75;
          padding: 0 var(--container-pad);
        }

        .crumbs {
          margin: 22px 0 12px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--text) 70%, transparent);
        }

        .crumbs span {
          opacity: 0.55;
        }

        .crumbs a {
          color: inherit;
          text-decoration: none;
        }

        .crumbs a:hover {
          color: var(--secondary);
        }

        .pagehead {
          position: relative;
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          background: var(--surface);
        }

        .pagehead::before {
          content: "";
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
          filter: saturate(1.05) contrast(1.02);
        }

        .pagehead::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(247, 250, 245, 0.96) 0%,
            rgba(247, 250, 245, 0.92) 40%,
            rgba(247, 250, 245, 0.55) 72%,
            rgba(247, 250, 245, 0.25) 100%
          );
          pointer-events: none;
        }

        [data-theme="dark"] .pagehead::after {
          background: linear-gradient(
            90deg,
            rgba(6, 19, 11, 0.92) 0%,
            rgba(6, 19, 11, 0.86) 45%,
            rgba(6, 19, 11, 0.55) 75%,
            rgba(6, 19, 11, 0.22) 100%
          );
        }

        .pagehead-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 22px;
          min-height: 190px;
        }

        .pagehead-content {
          max-width: 780px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid color-mix(in srgb, var(--border) 85%, transparent);
          border-radius: 16px;
          box-shadow: 0 14px 38px rgba(0, 0, 0, 0.08);
          padding: 18px 18px 16px;
          backdrop-filter: blur(10px);
        }

        [data-theme="dark"] .pagehead-content {
          background: rgba(10, 32, 19, 0.72);
          border-color: rgba(152, 196, 95, 0.18);
        }

        .pagehead small {
          display: inline-block;
          color: var(--secondary);
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .pagehead h1 {
          font-family: var(--font-heading);
          font-size: 46px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .pagehead p {
          margin-top: 10px;
          color: color-mix(in srgb, var(--muted-text) 92%, transparent);
          font-weight: 700;
          max-width: 70ch;
        }

        .meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
          margin-left: auto;
        }

        .pill {
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.55);
          background: rgba(255, 255, 255, 0.56);
          backdrop-filter: blur(10px);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--text) 78%, transparent);
          white-space: nowrap;
        }

        [data-theme="dark"] .pill {
          background: rgba(10, 32, 19, 0.62);
          border-color: rgba(152, 196, 95, 0.18);
          color: color-mix(in srgb, var(--text) 88%, transparent);
        }

        .pill b {
          color: var(--secondary);
        }

        .subcats {
          margin-top: 14px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .subcats a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(10px);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: 0.16s ease;
          color: var(--text);
          text-decoration: none;
          cursor: pointer;
        }

        [data-theme="dark"] .subcats a {
          background: rgba(10, 32, 19, 0.62);
          border-color: rgba(152, 196, 95, 0.18);
        }

        .subcats a:hover {
          transform: translateY(-1px);
          border-color: rgba(152, 196, 95, 0.6);
          background: rgba(152, 196, 95, 0.14);
        }

        .section {
          padding: 22px 0 70px;
        }

        .layout {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 18px;
          align-items: start;
        }

        .sidebar {
          position: sticky;
          top: 18px;
        }

        .filter-card {
          border: 1px solid var(--border);
          background: var(--surface);
          border-radius: 20px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .filter-head {
          padding: 16px 16px 14px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .filter-head h3 {
          font-family: var(--font-heading);
          font-size: 26px;
          font-weight: 800;
          line-height: 1.05;
          margin: 0;
        }

        .filter-head span {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--muted-text) 90%, transparent);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 8px 10px;
          background: color-mix(in srgb, var(--bg) 55%, transparent);
          white-space: nowrap;
        }

        .filter-block {
          padding: 14px 16px 16px;
          border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
        }

        .filter-block:last-child {
          border-bottom: none;
        }

        .filter-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .filter-title strong {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text);
        }

        .checklist {
          display: grid;
          gap: 10px;
        }

        .check {
          display: flex;
          gap: 10px;
          align-items: center;
          font-weight: 700;
          color: color-mix(in srgb, var(--text) 78%, transparent);
          font-size: 13px;
          cursor: pointer;
        }

        .check input {
          width: 16px;
          height: 16px;
          accent-color: var(--secondary);
          cursor: pointer;
        }

        .check small {
          margin-left: auto;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          color: color-mix(in srgb, var(--muted-text) 88%, transparent);
        }

        .range-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .mini-input {
          height: 42px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--surface);
          padding: 0 12px;
          font-weight: 700;
          color: var(--text);
          outline: none;
          font-size: 13px;
        }

        .mini-input::placeholder {
          color: var(--muted-text);
          font-weight: 600;
          opacity: 0.8;
        }

        .mini-input:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 0 3px rgba(152, 196, 95, 0.15);
        }

        [data-theme="dark"] .mini-input {
          background: var(--surface-2);
          border-color: rgba(152, 196, 95, 0.25);
        }

        [data-theme="dark"] .mini-input::placeholder {
          color: var(--muted-text);
          opacity: 0.7;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .card {
          position: relative;
          border: 1px solid var(--border);
          background: var(--surface);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: 0.18s ease;
          min-height: 360px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-md);
          border-color: rgba(152, 196, 95, 0.55);
        }

        .img {
          height: 420px;
          background: #eee;
          overflow: hidden;
        }

        .img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.26s ease;
        }

        .card:hover .img img {
          transform: scale(1.06);
        }

        .body {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          padding: 14px 14px 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(10px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }

        [data-theme="dark"] .body {
          background: rgba(10, 32, 19, 0.72);
          border-color: rgba(152, 196, 95, 0.18);
        }

        .name {
          font-family: var(--font-heading);
          font-size: 26px;
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 10px;
          color: color-mix(in srgb, var(--text) 92%, transparent);
        }

        .line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          font-weight: 900;
          letter-spacing: 1px;
          color: color-mix(in srgb, var(--text) 75%, transparent);
        }

        .price {
          color: color-mix(in srgb, var(--muted-text) 92%, transparent);
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .rating {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--muted-text) 92%, transparent);
          white-space: nowrap;
        }

        .star {
          width: 12px;
          height: 12px;
          display: inline-block;
          background: conic-gradient(from 0deg, var(--secondary), var(--secondary));
          clip-path: polygon(
            50% 0%,
            61% 35%,
            98% 35%,
            68% 57%,
            79% 91%,
            50% 70%,
            21% 91%,
            32% 57%,
            2% 35%,
            39% 35%
          );
          opacity: 0.95;
        }

        .badge {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 8px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          color: color-mix(in srgb, var(--text) 82%, transparent);
        }

        [data-theme="dark"] .badge {
          background: rgba(10, 32, 19, 0.62);
          border-color: rgba(152, 196, 95, 0.18);
        }

        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }
          .sidebar {
            position: relative;
            top: auto;
          }
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pagehead-inner {
            min-height: 210px;
          }
          .meta {
            justify-content: flex-start;
            margin-left: 0;
          }
        }

        @media (max-width: 560px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .pagehead h1 {
            font-size: 34px;
          }
          .img {
            height: 380px;
          }
          .pagehead-content {
            padding: 14px;
          }
          .body {
            left: 12px;
            right: 12px;
            bottom: 12px;
          }
          .name {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="category-container">
        {/* Breadcrumbs */}
        <div className="crumbs">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <a href={crumb.href}>{crumb.label}</a>
              <span>›</span>
            </React.Fragment>
          ))}
          <strong>{currentCategory.name}</strong>
        </div>

        {/* Header */}
        <section className="pagehead">
          <div
            style={{
              backgroundImage: `url(${categoryConfig.backgroundImage})`,
              position: "absolute",
              inset: 0,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="pagehead-inner">
            <div className="pagehead-content">
              <small>Category</small>
              <h1>{currentCategory.name}</h1>
              <p>{currentCategory.description}</p>

              {categoryConfig.subcategories && (
                <div className="subcats">
                  {categoryConfig.subcategories.map((subcat, idx) => (
                    <a key={idx} href="#">
                      {subcat}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="meta">
              <div className="pill">
                <b>{filteredProducts.length}+</b> items
              </div>
              <div className="pill">
                <b>Fast</b> shipping
              </div>
              <div className="pill">
                <b>Top</b> rated
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="section">
          <div className="layout">
            {/* LEFT FILTERS */}
            <aside className="sidebar">
              <div className="filter-card">
                <div className="filter-head">
                  <h3>Filters</h3>
                  <span>
                    {currentCategory.name.split(" ")[0].toUpperCase()}
                  </span>
                </div>

                <div className="filter-block">
                  <div className="filter-title">
                    <strong>Price</strong>
                  </div>
                  <div className="range-row">
                    <input
                      className="mini-input"
                      type="text"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      className="mini-input"
                      type="text"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dynamic Filters from Product Options */}
                {filteringOptions.map((filter, filterIndex) => (
                  <div key={filterIndex} className="filter-block">
                    <div className="filter-title">
                      <strong>{filter.title}</strong>
                    </div>
                    <div className="checklist">
                      {filter.values.map((value, valueIndex) => (
                        <label key={valueIndex} className="check">
                          <input
                            type="checkbox"
                            checked={isFilterSelected(filter.title, value)}
                            onChange={() =>
                              toggleDynamicFilter(filter.title, value)
                            }
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* RIGHT GRID */}
            <div>
              <div className="grid">
                {isProductLoading ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    Loading products...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    No products found
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const minPrice = Math.min(
                      ...product.variants.map((v) => parseFloat(v.price)),
                    );
                    const hasDiscount =
                      parseFloat(product.basePrice) > minPrice;

                    return (
                      <div
                        key={product._id}
                        className="card"
                        onClick={() => handleProductClick(product)}
                        style={{ cursor: "pointer" }}
                      >
                        {hasDiscount && <div className="badge">Sale</div>}
                        <div className="img">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.title} />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "80px",
                                opacity: 0.3,
                              }}
                            >
                              🛋️
                            </div>
                          )}
                        </div>
                        <div className="body">
                          <div className="name">{product.title}</div>
                          <div className="line">
                            <span className="price">₹{minPrice}</span>
                            <span className="rating">
                              <i className="star"></i> {product.rating || "5.0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
