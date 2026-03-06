"use client";

import React from "react";
import { Product, GalleryConfig } from "./ProductGalleryPage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductGalleryPreviewProps {
  products: Product[];
  config: GalleryConfig;
}

const ProductGalleryPreview: React.FC<ProductGalleryPreviewProps> = ({
  products,
  config,
}) => {
  const getCardStyleClasses = () => {
    const base = "rounded-lg overflow-hidden transition-all duration-300";

    switch (config.cardStyle) {
      case "minimal":
        return `${base} border border-slate-200 dark:border-slate-800`;
      case "elevated":
        return `${base} shadow-lg`;
      default:
        return `${base} shadow-md`;
    }
  };

  const getHoverClasses = () => {
    switch (config.hoverEffect) {
      case "lift":
        return "hover:-translate-y-2 hover:shadow-xl";
      case "scale":
        return "hover:scale-105";
      default:
        return "";
    }
  };

  const getLayoutClasses = () => {
    if (config.layout === "grid") {
      return `grid grid-cols-${config.columns}`;
    }
    if (config.layout === "masonry") {
      return "columns-2 md:columns-3";
    }
    return "flex overflow-x-auto";
  };

  if (products.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center text-slate-500">
        <p>Select products to see preview</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
      <div
        className={`${getLayoutClasses()}`}
        style={{ gap: `${config.gap}px` }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`${getCardStyleClasses()} ${getHoverClasses()} cursor-pointer bg-white dark:bg-slate-800 ${config.layout === "masonry" ? "mb-4 break-inside-avoid" : ""
              }`}
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              {config.showBadge && product.badge && (
                <Badge className="absolute top-2 left-2 text-xs">
                  {product.badge}
                </Badge>
              )}
            </div>
            <div className="p-3 space-y-1">
              <h3 className="font-medium text-sm truncate dark:text-white">
                {product.name}
              </h3>
              {config.showDescription && product.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {product.description}
                </p>
              )}
              {config.showPrice && (
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                  ${product.price}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGalleryPreview;
