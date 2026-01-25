"use client";

import React, { useState } from "react";
import { ShoppingCart, Eye, Plus, Trash2, X, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addProductInCart,
  removeProductInCart,
  updateProductQtyInCart,
} from "@/hooks/slices/product/ProductSlice";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductShowcase = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const {
    listProduct: products,
    isProductLoading,
    cart,
    isCartLoading,
  } = useSelector((state: RootState) => state.product);

  const dispatch = useDispatch<AppDispatch>();

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
      const { productId, variantId } = item;
      const product = products.find((d) => d._id == item.productId);
      const variant = product.variants.find((d) => d._id == item.variantId);
      const price = parseInt(variant.price);
      return total + price * item.quantity;
    }, 0);
  };

  const router = useRouter();

  const handleCheckout = () => {
    const data = JSON.stringify(cart);
    const href = encodeURIComponent(data);
    if (cart.length <= 0) {
      toast.error("Please Add Product");
    }
    router.push(`/checkout?data=${href}`);
  };

  const ProductCard = ({ product }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <div className="text-6xl">👕</div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800">{product.title}</h3>
            <span className="text-2xl font-bold text-blue-600">
              ₹{product.basePrice}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3">{product.description}</p>
          <p className="text-xs text-gray-500 mb-4">Brand: {product.brands}</p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                setSelectedProduct(product);
                setSelectedVariant(product.variants?.[0] || null);
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Eye size={18} />
              Show Product
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VariantSelector = ({ variants, selectedVariant, onSelect }) => {
    return (
      <div className="space-y-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?._id === variant._id;
          const isOutOfStock = parseInt(variant.stock) === 0;

          return (
            <div
              key={variant._id}
              onClick={() => !isOutOfStock && onSelect(variant)}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : isOutOfStock
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : "border-gray-200 hover:border-blue-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.attributes.map((attr, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700"
                        >
                          <span className="font-semibold">
                            {attr.attributeName}:
                          </span>
                          <span className="ml-1">
                            {attr.value}
                            {attr.unit ? ` ${attr.unit}` : ""}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-8 text-xs text-gray-500">
                    SKU: {variant.sku}
                  </div>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <span className="text-lg font-bold text-blue-600">
                    ₹{variant.price}
                  </span>
                  <span
                    className={`text-xs mt-1 ${
                      isOutOfStock
                        ? "text-red-500 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {isOutOfStock ? "Out of Stock" : `Stock: ${variant.stock}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Products Showcase
          </h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            <span className="font-semibold">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </main>

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

                    console.log(variant, product);

                    return (
                      <div key={index} className="mb-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold">{product.title}</h3>
                            <p className="text-sm text-gray-600">
                              {product.brand}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {variant.attributes.map((attr, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                                >
                                  {attr.value}
                                  {attr.unit ? ` ${attr.unit}` : ""}
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
                            ₹{parseInt(Number(variant.price)) * item.quantity}
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
                      ₹{getTotalPrice()}
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedProduct(null);
            setSelectedVariant(null);
          }}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-6 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Brand: {selectedProduct.brands}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedVariant(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">
                  Available Options:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.options
                    .filter((option) => !option.useForVariants)
                    .map((option, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                      >
                        <p className="text-sm text-gray-700">
                          {option.values.join(", ")}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {selectedProduct.variants &&
                selectedProduct.variants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">
                      Select Variant:
                    </h3>
                    <VariantSelector
                      variants={selectedProduct.variants}
                      selectedVariant={selectedVariant}
                      onSelect={setSelectedVariant}
                    />
                  </div>
                )}

              <button
                onClick={() => {
                  if (selectedVariant) {
                    if (parseInt(selectedVariant.stock) > 0) {
                      addToCart(selectedProduct, selectedVariant);
                      setSelectedProduct(null);
                      setSelectedVariant(null);
                    } else {
                      alert("This variant is out of stock");
                    }
                  } else {
                    alert("Please select a variant");
                  }
                }}
                disabled={
                  !selectedVariant ||
                  parseInt(selectedVariant?.stock || 0) === 0
                }
                className={`w-full py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-semibold ${
                  !selectedVariant ||
                  parseInt(selectedVariant?.stock || 0) === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Plus size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductShowcase;
