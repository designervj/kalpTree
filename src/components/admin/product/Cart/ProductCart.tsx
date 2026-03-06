import React from 'react'
import { ProductModel } from '../type/ProductModel'
import { ProductVariant } from '@/modules/ecommerce/types';
import { useRouter } from 'next/navigation';
import { CardConfigModal, StyleConfigModal } from './CartModal';
import { getCardStyleClasses } from './util/Config';

type Props = {
  product: ProductModel[],
  cardConfig: CardConfigModal,
  mergedStyleConfig: StyleConfigModal

}
const ProductCart = ({ product, cardConfig, mergedStyleConfig }: Props) => {
  const router = useRouter();
  const handleProductClick = (product: any) => {
    router.push(`/product/${product._id}`);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {product.map((p) => {
        const variants = p.variants || [];
        const minPrice = variants.length > 0
          ? Math.min(...variants.map((v: ProductVariant) => parseFloat(v?.price || "0")))
          : 0;

        const hasDiscount = parseFloat(p?.basePrice || "0") > minPrice;

        const hoverClasses = {
          scale: "group-hover:scale-105",
          lift: "group-hover:-translate-y-2",
          none: "",
        };

        return (
          <div
            className={`group cursor-pointer transition-all duration-300 ${getCardStyleClasses(mergedStyleConfig?.cardStyle || "")}`}
            onClick={() => handleProductClick(p)}
          >
            <div
              className="relative bg-gray-100 overflow-hidden mb-4"
              style={{ aspectRatio: cardConfig.imageAspectRatio }}
            >
              {cardConfig.placeholderIcon && (
                <div
                  className={`absolute inset-0 flex items-center justify-center text-8xl opacity-20 transition-transform duration-600 ${hoverClasses[cardConfig?.hoverEffect || 'none']}`}
                >
                  {cardConfig.placeholderIcon}
                </div>
              )}
              {hasDiscount && cardConfig.showSaleBadge && (
                <div
                  className="absolute top-3 left-3 text-white px-2.5 py-1 text-[10px] font-bold"
                  style={{ backgroundColor: mergedStyleConfig.primaryColor }}
                >
                  Sale
                </div>
              )}
            </div>

            {cardConfig?.showRating && (
              <div
                className="stars text-[11px] mb-1.5"
                style={{ color: "#fbbf24" }}
              >
                ★★★★★
              </div>
            )}
            <div
              className="title text-sm font-medium mb-1.5"
              style={{ color: mergedStyleConfig.primaryColor }}
            >
              {p?.title}
            </div>
            <div className="price text-[13px]">
              {hasDiscount && (
                <span
                  className="old-price line-through mr-2"
                  style={{ color: mergedStyleConfig?.secondaryColor }}
                >
                  ${p?.basePrice}
                </span>
              )}
              <span className="new-price font-bold" style={{ color: mergedStyleConfig.primaryColor }}>
                ${minPrice}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};


export default ProductCart


