// productGalleryPlugin.ts
// This file contains the GrapesJS component definition for the product gallery

import { Product, GalleryConfig } from "./ProductGalleryPage";

export const registerProductGalleryComponent = (editor: any) => {
  const domc = editor.DomComponents;
  const bm = editor.BlockManager;

  // Register the Product Gallery component
  domc.addType("product-gallery-dynamic", {
    model: {
      defaults: {
        tagName: "div",
        droppable: false,
        copyable: true,
        draggable: true,
        attributes: {
          "data-component": "product-gallery-dynamic",
          "data-products": "[]",
          "data-layout": "grid",
          "data-columns": "3",
          "data-gap": "20",
          "data-show-badge": "true",
          "data-show-price": "true",
          "data-show-description": "false",
          "data-card-style": "default",
          "data-hover-effect": "lift",
        },
        traits: [
          {
            type: "number",
            name: "columns",
            label: "Columns",
            min: 2,
            max: 6,
            changeProp: 1,
          },
          {
            type: "number",
            name: "gap",
            label: "Gap (px)",
            min: 0,
            max: 60,
            changeProp: 1,
          },
          {
            type: "select",
            name: "layout",
            label: "Layout",
            options: [
              { id: "grid", name: "Grid" },
              { id: "carousel", name: "Carousel" },
              { id: "masonry", name: "Masonry" },
            ],
          },
          {
            type: "select",
            name: "cardStyle",
            label: "Card Style",
            options: [
              { id: "default", name: "Default" },
              { id: "minimal", name: "Minimal" },
              { id: "elevated", name: "Elevated" },
            ],
          },
          {
            type: "select",
            name: "hoverEffect",
            label: "Hover Effect",
            options: [
              { id: "lift", name: "Lift" },
              { id: "scale", name: "Scale" },
              { id: "none", name: "None" },
            ],
          },
          {
            type: "checkbox",
            name: "showBadge",
            label: "Show Badge",
          },
          {
            type: "checkbox",
            name: "showPrice",
            label: "Show Price",
          },
          {
            type: "checkbox",
            name: "showDescription",
            label: "Show Description",
          },
        ],
      },
      init() {
        const updateFromTraits = () => {
          this.addAttributes({
            "data-layout": this.get("layout") || "grid",
            "data-columns": this.get("columns") || "3",
            "data-gap": this.get("gap") || "20",
            "data-show-badge": this.get("showBadge") ? "true" : "false",
            "data-show-price": this.get("showPrice") ? "true" : "false",
            "data-show-description": this.get("showDescription")
              ? "true"
              : "false",
            "data-card-style": this.get("cardStyle") || "default",
            "data-hover-effect": this.get("hoverEffect") || "lift",
          });
        };

        this.on(
          "change:layout change:columns change:gap change:showBadge change:showPrice change:showDescription change:cardStyle change:hoverEffect",
          updateFromTraits,
        );
      },
    },
    view: {
      init() {
        // Parse products from data attribute
        this.products = [];
        try {
          const productsData = this.model.getAttributes()["data-products"];
          if (productsData) {
            this.products = JSON.parse(productsData);
          }
        } catch (e) {
          console.error("Error parsing products:", e);
        }
      },

      getConfig() {
        const attrs = this.model.getAttributes();
        return {
          layout: attrs["data-layout"] || "grid",
          columns: parseInt(attrs["data-columns"]) || 3,
          gap: parseInt(attrs["data-gap"]) || 20,
          showBadge: attrs["data-show-badge"] === "true",
          showPrice: attrs["data-show-price"] === "true",
          showDescription: attrs["data-show-description"] === "true",
          cardStyle: attrs["data-card-style"] || "default",
          hoverEffect: attrs["data-hover-effect"] || "lift",
        };
      },

      getCardStyleClasses() {
        const config = this.getConfig();
        const base = "product-card";

        let classes = [base];

        if (config.cardStyle === "minimal") {
          classes.push("card-minimal");
        } else if (config.cardStyle === "elevated") {
          classes.push("card-elevated");
        } else {
          classes.push("card-default");
        }

        if (config.hoverEffect === "lift") {
          classes.push("hover-lift");
        } else if (config.hoverEffect === "scale") {
          classes.push("hover-scale");
        }

        return classes.join(" ");
      },

      renderProducts() {
        const config = this.getConfig();

        if (!this.products || this.products.length === 0) {
          return `
            <div style="padding: 40px; text-align: center; color: #94a3b8; border: 2px dashed #cbd5e0; border-radius: 8px;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 12px;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              <p style="font-weight: 500; margin-bottom: 4px;">No products added</p>
              <p style="font-size: 14px;">Select products from the sidebar to display them here</p>
            </div>
          `;
        }

        return `
          <div class="product-gallery" data-layout="${config.layout}" style="display: ${
            config.layout === "grid"
              ? "grid"
              : config.layout === "carousel"
                ? "flex"
                : "block"
          }; grid-template-columns: repeat(${config.columns}, 1fr); gap: ${config.gap}px; ${
            config.layout === "carousel"
              ? "overflow-x: auto; scroll-snap-type: x mandatory;"
              : ""
          } ${config.layout === "masonry" ? "column-count: " + config.columns + ";" : ""}">
            ${this.products
              .map(
                (product: Product) => `
              <div class="${this.getCardStyleClasses()}" ${
                config.layout === "carousel"
                  ? 'style="flex: 0 0 calc(33.333% - 14px); scroll-snap-align: start;"'
                  : ""
              }>
                <div class="product-image-wrapper">
                  <img src="${product.image}" alt="${product.name}" class="product-image">
                  ${
                    config.showBadge && product.badge
                      ? `<span class="product-badge">${product.badge}</span>`
                      : ""
                  }
                </div>
                <div class="product-content">
                  <h3 class="product-title">${product.name}</h3>
                  ${
                    config.showDescription && product.description
                      ? `<p class="product-description">${product.description}</p>`
                      : ""
                  }
                  ${
                    config.showPrice
                      ? `<p class="product-price">$${product.price}</p>`
                      : ""
                  }
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        `;
      },

      render() {
        const config = this.getConfig();

        this.el.innerHTML = `
          <div class="product-gallery-container" style="padding: 20px; background: #f8fafc;">
            ${this.renderProducts()}
          </div>
          
          <style>
            .product-gallery-container {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .product-card {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              cursor: pointer;
              ${config.layout === "masonry" ? "break-inside: avoid; margin-bottom: " + config.gap + "px;" : ""}
            }
            
            .card-default {
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .card-minimal {
              border: 1px solid #e2e8f0;
            }
            
            .card-elevated {
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .hover-lift:hover {
              transform: translateY(-8px);
              box-shadow: 0 12px 24px rgba(0,0,0,0.15);
            }
            
            .hover-scale:hover {
              transform: scale(1.05);
            }
            
            .product-image-wrapper {
              position: relative;
              width: 100%;
              overflow: hidden;
            }
            
            .product-image {
              width: 100%;
              height: 200px;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
            
            .product-card:hover .product-image {
              transform: scale(1.1);
            }
            
            .product-badge {
              position: absolute;
              top: 12px;
              left: 12px;
              background: #ef4444;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            
            .product-content {
              padding: 16px;
            }
            
            .product-title {
              font-size: 16px;
              font-weight: 600;
              color: #1e293b;
              margin: 0 0 8px 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            .product-description {
              font-size: 14px;
              color: #64748b;
              margin: 8px 0;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            
            .product-price {
              font-size: 18px;
              font-weight: 700;
              color: #7c3aed;
              margin: 8px 0 0 0;
            }
            
            ${
              config.layout === "carousel"
                ? `
              .product-gallery::-webkit-scrollbar {
                height: 8px;
              }
              
              .product-gallery::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 4px;
              }
              
              .product-gallery::-webkit-scrollbar-thumb {
                background: #cbd5e0;
                border-radius: 4px;
              }
              
              .product-gallery::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
            `
                : ""
            }
          </style>
        `;

        return this;
      },
    },
  });

  // Add block to the Block Manager
  bm.add("product-gallery-dynamic", {
    label: `
      <div style="text-align: center;">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke-width="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke-width="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke-width="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke-width="1.5"/>
        </svg>
        <div style="margin-top: 5px; font-size: 11px;">Product Gallery</div>
      </div>
    `,
    category: "E-commerce",
    content: {
      type: "product-gallery-dynamic",
      // Default products can be set here
      attributes: {
        "data-products": JSON.stringify([]),
      },
    },
  });
};

// Helper function to update products in an existing component
export const updateProductGalleryProducts = (
  editor: any,
  componentId: string,
  products: Product[],
) => {
  const component = editor.Components.getById(componentId);
  if (component) {
    component.addAttributes({
      "data-products": JSON.stringify(products),
    });
    // Force re-render
    const view = component.view;
    if (view) {
      view.products = products;
      view.render();
    }
  }
};
