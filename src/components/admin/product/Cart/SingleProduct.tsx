"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronLeft,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addProductInCart,
  removeProductInCart,
  updateProductQtyInCart,
} from "@/hooks/slices/product/ProductSlice";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const SingleProductShowcase = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [matchedVariant, setMatchedVariant] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const params = useParams();
  const productId = params.slug;

  console.log(productId);

  const {
    listProduct: products,
    isProductLoading,
    cart,
    isCartLoading,
  } = useSelector((state: RootState) => state.product);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Load product from URL params on mount
  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find((p) => p._id === productId);
      if (product) {
        setSelectedProduct(product);
        setSelectedOptions({});
        setMatchedVariant(null);
      }
    }
  }, [productId, products]);

  // Find matching variant based on selected options
  useEffect(() => {
    if (!selectedProduct) return;

    const variantOptions = selectedProduct.options.filter(
      (opt) => opt.useForVariants,
    );
    const selectedKeys = Object.keys(selectedOptions);

    // Check if all variant options are selected
    const allVariantOptionsSelected = variantOptions.every((opt) =>
      selectedKeys.includes(opt.id),
    );

    if (!allVariantOptionsSelected) {
      setMatchedVariant(null);
      return;
    }

    // Find variant that matches all selected variant options
    const variant = selectedProduct.variants.find((v) => {
      return variantOptions.every((option) => {
        const attr = v.attributes.find((a) => a.attributeId === option.id);
        return attr && attr.value === selectedOptions[option.id];
      });
    });

    setMatchedVariant(variant || null);
  }, [selectedOptions, selectedProduct]);

  const addToCart = (product, variant) => {
    dispatch(
      addProductInCart({ productId: product._id, variantId: variant._id }),
    );
  };

  const removeFromCart = (index) => {
    dispatch(removeProductInCart(index));
  };

  const updateQuantity = (index, delta) => {
    dispatch(updateProductQtyInCart({ index, delta }));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products.find((d) => d._id == item.productId);
      const variant = product.variants.find((d) => d._id == item.variantId);
      const price = parseFloat(variant.price);
      return total + price * item.quantity;
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

  const handleProductClick = (product) => {
    router.push(`/product/${product._id}`);
  };

  const handleBackToShowcase = () => {
    router.push(window.location.pathname);
    setSelectedProduct(null);
    setSelectedOptions({});
    setMatchedVariant(null);
  };

  const handleOptionChange = (optionId, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!matchedVariant) {
      toast.error("Please select all required options");
      return;
    }

    if (parseInt(matchedVariant.stock) <= 0) {
      toast.error("This configuration is out of stock");
      return;
    }

    addToCart(selectedProduct, matchedVariant);
    toast.success("Added to cart successfully!");
  };

  const getOptionValues = (option) => {
    if (option.useForVariants) {
      // Get unique values from variants
      const values = new Set();
      selectedProduct.variants.forEach((variant) => {
        const attr = variant.attributes.find(
          (a) => a.attributeId === option.id,
        );
        if (attr) {
          values.add(attr.value);
        }
      });
      return Array.from(values);
    }
    return option.values;
  };

  const calculateDiscount = (basePrice, variantPrice) => {
    const base = parseFloat(basePrice);
    const variant = parseFloat(variantPrice);
    if (base <= variant) return 0;
    return Math.round(((base - variant) / base) * 100);
  };

  const ProductCard = ({ product }) => {
    const minPrice = Math.min(
      ...product.variants.map((v) => parseFloat(v.price)),
    );
    const maxDiscount = Math.max(
      ...product.variants.map((v) =>
        calculateDiscount(product.basePrice, v.price),
      ),
    );

    return (
      <div
        onClick={() => handleProductClick(product)}
        className="group bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100"
      >
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">
            👕
          </div>
          {maxDiscount > 0 && (
            <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded">
              {maxDiscount}% off
            </div>
          )}
          <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-50">
            <Heart size={18} className="text-gray-600" />
          </button>
          {product.variants.some(
            (v) => parseInt(v.stock) > 0 && parseInt(v.stock) <= 5,
          ) && (
            <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
              Only few left
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base line-clamp-2 leading-snug">
                {product.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {product.brands || "Brand Name"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center bg-green-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
              4.2 <Star size={10} fill="white" className="ml-0.5" />
            </div>
            <span className="text-xs text-gray-500">(1.2k)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">₹{minPrice}</span>
            {maxDiscount > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.basePrice}
                </span>
                <span className="text-xs font-semibold text-green-600">
                  {maxDiscount}% off
                </span>
              </>
            )}
          </div>

          {product.options.some(
            (opt) => opt.id === "6989922a2c688a2e332257b3",
          ) && (
            <div className="mt-2 text-xs text-gray-600">
              Size:{" "}
              {product.options
                .find((opt) => opt.id === "6989922a2c688a2e332257b3")
                ?.values.join(", ")}
            </div>
          )}
        </div>
      </div>
    );
  };

  const SingleProductPage = ({ product }) => {
    const variantOptions = product.options.filter((opt) => opt.useForVariants);
    const displayOptions = product.options.filter((opt) => !opt.useForVariants);

    const allVariantOptionsSelected = variantOptions.every((opt) =>
      Object.keys(selectedOptions).includes(opt.id),
    );

    const currentPrice = matchedVariant
      ? parseFloat(matchedVariant.price)
      : Math.min(...product.variants.map((v) => parseFloat(v.price)));

    const discount = calculateDiscount(
      product.basePrice,
      currentPrice.toString(),
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={handleBackToShowcase}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ChevronLeft size={20} />
              Back to Products
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200">
                <div className="text-[200px] opacity-20">👕</div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition"
                  >
                    <div className="text-4xl opacity-20">👕</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center bg-green-600 text-white text-sm font-semibold px-2 py-1 rounded">
                    4.2 <Star size={12} fill="white" className="ml-1" />
                  </div>
                  <span className="text-sm text-gray-600">1,234 ratings</span>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{currentPrice}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.basePrice}
                      </span>
                      <span className="text-lg font-semibold text-green-600">
                        {discount}% off
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Display Options (non-variant) */}
              {displayOptions.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Product Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {displayOptions.map((option) => (
                      <div key={option.id} className="text-sm">
                        <span className="text-gray-600">{option.title}: </span>
                        <span className="font-medium text-gray-900">
                          {option.values.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Options (required for purchase) */}
              {variantOptions.length > 0 && (
                <div className="space-y-5">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Select Options <span className="text-red-500">*</span>
                  </h3>

                  {variantOptions.map((option) => {
                    const values = getOptionValues(option);
                    const selectedValue = selectedOptions[option.id];

                    return (
                      <div key={option.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-medium text-gray-700">
                            {option.title}
                          </label>
                          {selectedValue && (
                            <span className="text-sm text-gray-500">
                              Selected: {selectedValue}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value) => {
                            const isSelected = selectedValue === value;
                            return (
                              <button
                                key={value}
                                onClick={() =>
                                  handleOptionChange(option.id, value)
                                }
                                className={`px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-50 text-blue-900"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Variant Information */}
              {matchedVariant && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">SKU:</span>
                    <span className="text-gray-700">{matchedVariant.sku}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Stock:</span>
                    <span
                      className={`font-semibold ${
                        parseInt(matchedVariant.stock) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {parseInt(matchedVariant.stock) > 0
                        ? `${matchedVariant.stock} available`
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>
              )}

              {/* Warning messages */}
              {!allVariantOptionsSelected && variantOptions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    Please select all required options to continue
                  </p>
                </div>
              )}

              {allVariantOptionsSelected && !matchedVariant && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium">
                    This combination is not available. Please try different
                    options.
                  </p>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !matchedVariant ||
                    parseInt(matchedVariant?.stock || 0) === 0
                  }
                  className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                    !matchedVariant ||
                    parseInt(matchedVariant?.stock || 0) === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <ShoppingCart size={22} />
                  {!matchedVariant
                    ? "Select All Options"
                    : parseInt(matchedVariant?.stock || 0) === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If productId in params, show single product page
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Cart Button - Fixed */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110"
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
        </button>

        <SingleProductPage product={selectedProduct} />

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
                  <h2 className="text-2xl font-bold">Shopping Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center mt-8">
                      Your cart is empty
                    </p>
                  ) : (
                    cart.map((item, index) => {
                      const product = products.find(
                        (d) => d._id == item.productId,
                      );
                      const variant = product.variants.find(
                        (d) => d._id == item.variantId,
                      );

                      return (
                        <div key={index} className="mb-4 p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold">{product.title}</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {variant.attributes.map((attr, idx) => (
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
                              className="text-red-500 hover:text-red-700"
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
                            <span className="font-bold text-blue-600">
                              ₹{parseFloat(variant.price) * item.quantity}
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
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>Normal</>;
};

export default SingleProductShowcase;
