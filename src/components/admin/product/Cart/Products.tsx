"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Star, Trash2, X, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addProductInCart,
  removeProductInCart,
  updateProductQtyInCart,
} from "@/hooks/slices/product/ProductSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductShowcase = ({ category }: { category?: string }) => {
  const [showCart, setShowCart] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sortBy, setSortBy] = useState("price-high");
  const [categoryFilters, setCategoryFilters] = useState({
    all: true,
    tops: false,
    knitwear: false,
  });
  const [sizeFilters, setSizeFilters] = useState({
    xs: true,
    s: false,
    m: false,
    l: false,
    xl: false,
  });

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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const getSortedProducts = () => {
    const sorted = [...products];

    if (sortBy === "price-low") {
      sorted.sort((a, b) => {
        const priceA = Math.min(...a.variants.map((v) => parseFloat(v.price)));
        const priceB = Math.min(...b.variants.map((v) => parseFloat(v.price)));
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => {
        const priceA = Math.min(...a.variants.map((v) => parseFloat(v.price)));
        const priceB = Math.min(...b.variants.map((v) => parseFloat(v.price)));
        return priceB - priceA;
      });
    } else if (sortBy === "rating") {
      // Sort by rating (you can customize this logic)
      sorted.sort((a, b) => 0);
    }

    return sorted;
  };

  const ProductCard = ({ product }) => {
    const minPrice = Math.min(
      ...product.variants.map((v) => parseFloat(v.price)),
    );
    const hasDiscount = parseFloat(product.basePrice) > minPrice;

    return (
      <div
        className="group cursor-pointer"
        onClick={() => handleProductClick(product)}
      >
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 transition-transform duration-600 group-hover:scale-105">
            👕
          </div>
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 text-[10px] font-bold">
              Sale
            </div>
          )}
        </div>

        <div className="stars text-[11px] text-yellow-500 mb-1.5">★★★★★</div>
        <div className="title text-sm font-medium mb-1.5 text-gray-900">
          {product.title}
        </div>
        <div className="price text-[13px]">
          {hasDiscount && (
            <span className="old-price line-through text-gray-500 mr-2">
              ₹{product.basePrice}
            </span>
          )}
          <span className="new-price font-bold text-gray-900">₹{minPrice}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd]">
      {/* Hero Section */}
      <header
        className="w-full h-[40vh] bg-gradient-to-b from-black/10 to-black/10 bg-cover bg-center flex items-center justify-center text-white text-center mb-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <h1 className="font-['Montserrat'] text-4xl md:text-5xl uppercase tracking-[10px] drop-shadow-lg">
          {category}
        </h1>
      </header>

      <div className="max-w-[1440px] mx-auto px-10 pb-24">
        {/* Top Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-b border-gray-200 mb-8 gap-5">
          <div className="flex gap-4">
            <button
              onClick={toggleSidebar}
              className="bg-white border border-gray-200 px-5 py-3 text-xs font-semibold uppercase font-['Montserrat'] hover:border-black transition-colors flex items-center gap-2.5"
            >
              <span>☰</span>
              <span>{sidebarVisible ? "Hide Filters" : "Show Filters"}</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 px-5 py-3 pr-9 text-xs font-semibold uppercase font-['Montserrat'] hover:border-black transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 15px center",
              }}
            >
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          <div className="text-right">
            <div className="text-[13px] font-medium text-gray-500 mb-1">
              Showing 1-{products.length} of {products.length} Products
            </div>
            <div className="flex gap-4 items-center text-[13px] font-semibold">
              <span className="text-black underline cursor-pointer">1</span>
              <span className="text-gray-500 cursor-pointer hover:text-black hover:underline">
                2
              </span>
              <span className="text-gray-500 cursor-pointer hover:text-black hover:underline">
                3
              </span>
              <span className="text-gray-500">...</span>
              <span className="text-gray-500 cursor-pointer hover:text-black hover:underline">
                10
              </span>
              <ChevronRight size={10} className="ml-1" />
            </div>
          </div>
        </div>

        <div className="flex gap-12 items-start">
          {/* Sidebar Filters */}
          {sidebarVisible && (
            <aside className="w-64 flex-shrink-0 sticky top-5">
              {/* Category Filter */}
              <div className="mb-6 border-b border-gray-100 pb-5">
                <div className="flex justify-between items-center cursor-pointer py-2.5 mb-3">
                  <h3 className="font-['Montserrat'] text-[13px] uppercase tracking-wider font-semibold">
                    Category
                  </h3>
                  <span>▲</span>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center text-[13px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryFilters.all}
                      onChange={(e) =>
                        setCategoryFilters({
                          ...categoryFilters,
                          all: e.target.checked,
                        })
                      }
                      className="w-4 h-4 mr-3 accent-black"
                    />
                    All Arrivals
                  </label>
                  <label className="flex items-center text-[13px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryFilters.tops}
                      onChange={(e) =>
                        setCategoryFilters({
                          ...categoryFilters,
                          tops: e.target.checked,
                        })
                      }
                      className="w-4 h-4 mr-3 accent-black"
                    />
                    Tops & Tees
                  </label>
                  <label className="flex items-center text-[13px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryFilters.knitwear}
                      onChange={(e) =>
                        setCategoryFilters({
                          ...categoryFilters,
                          knitwear: e.target.checked,
                        })
                      }
                      className="w-4 h-4 mr-3 accent-black"
                    />
                    Knitwear
                  </label>
                </div>
              </div>

              {/* Color Palette */}
              <div className="mb-6 border-b border-gray-100 pb-5">
                <div className="flex justify-between items-center cursor-pointer py-2.5 mb-3">
                  <h3 className="font-['Montserrat'] text-[13px] uppercase tracking-wider font-semibold">
                    Color Palette
                  </h3>
                  <span>▲</span>
                </div>
                <div className="grid grid-cols-5 gap-2.5">
                  <div className="w-6 h-6 bg-black border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="w-6 h-6 bg-blue-700 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="w-6 h-6 bg-amber-800 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="w-6 h-6 bg-gray-300 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="w-6 h-6 bg-pink-200 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6 border-b border-gray-100 pb-5">
                <div className="flex justify-between items-center cursor-pointer py-2.5 mb-3">
                  <h3 className="font-['Montserrat'] text-[13px] uppercase tracking-wider font-semibold">
                    Size
                  </h3>
                  <span>▲</span>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center text-[13px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sizeFilters.xs}
                      onChange={(e) =>
                        setSizeFilters({ ...sizeFilters, xs: e.target.checked })
                      }
                      className="w-4 h-4 mr-3 accent-black"
                    />
                    XS
                  </label>
                  <label className="flex items-center text-[13px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sizeFilters.s}
                      onChange={(e) =>
                        setSizeFilters({ ...sizeFilters, s: e.target.checked })
                      }
                      className="w-4 h-4 mr-3 accent-black"
                    />
                    S
                  </label>
                  <label className="flex items-center text-[13px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sizeFilters.m}
                      onChange={(e) =>
                        setSizeFilters({ ...sizeFilters, m: e.target.checked })
                      }
                      className="w-4 h-4 mr-3 accent-black"
                    />
                    M
                  </label>
                  <label className="flex items-center text-[13px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sizeFilters.l}
                      onChange={(e) =>
                        setSizeFilters({ ...sizeFilters, l: e.target.checked })
                      }
                      className="w-4 h-4 mr-3 accent-black"
                    />
                    L
                  </label>
                  <label className="flex items-center text-[13px] text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sizeFilters.xl}
                      onChange={(e) =>
                        setSizeFilters({ ...sizeFilters, xl: e.target.checked })
                      }
                      className="w-4 h-4 mr-3 accent-black"
                    />
                    XL
                  </label>
                </div>
              </div>
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {getSortedProducts().map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </main>

            {/* Bottom Pagination */}
            <div className="flex justify-center mt-20 gap-2.5">
              <div className="w-11 h-11 flex items-center justify-center border border-gray-200 text-sm font-semibold cursor-pointer transition-all bg-black text-white">
                1
              </div>
              <div className="w-11 h-11 flex items-center justify-center border border-gray-200 text-sm font-semibold cursor-pointer transition-all hover:bg-black hover:text-white hover:border-black">
                2
              </div>
              <div className="w-11 h-11 flex items-center justify-center border border-gray-200 text-sm font-semibold cursor-pointer transition-all hover:bg-black hover:text-white hover:border-black">
                3
              </div>
              <div className="w-11 h-11 flex items-center justify-center border border-gray-200 text-sm font-semibold cursor-pointer transition-all hover:bg-black hover:text-white hover:border-black">
                <ChevronRight size={16} />
              </div>
            </div>
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

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all z-40"
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default ProductShowcase;
