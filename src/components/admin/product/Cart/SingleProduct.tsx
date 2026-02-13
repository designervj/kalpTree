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
  Search,
  User,
  Share2,
  Minus,
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

const SingleProductShowcase = ({slug}:{slug?:any}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [matchedVariant, setMatchedVariant] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const params = useParams();
  const productId = slug? slug : params.slug;

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

    const allVariantOptionsSelected = variantOptions.every((opt) =>
      selectedKeys.includes(opt.id),
    );

    if (!allVariantOptionsSelected) {
      setMatchedVariant(null);
      return;
    }

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

  const changeQuantity = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1) {
      setQuantity(newQty);
    }
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
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-base line-clamp-2 leading-snug">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-gray-900">₹{minPrice}</span>
            {maxDiscount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.basePrice}
              </span>
            )}
          </div>
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

    // Mock images - replace with actual product images
    const productImages = [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
      "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=600",
    ];

    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="px-10 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-50">
          <div className="font-bold text-xl tracking-[4px] font-montserrat">
            MILITARY GEAR
          </div>
          <div className="flex gap-5 text-gray-600 text-lg">
            <Search className="cursor-pointer" size={20} />
            <User className="cursor-pointer" size={20} />
            <div
              className="relative cursor-pointer"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-10 py-5 text-xs text-gray-500 uppercase">
          <span className="cursor-pointer hover:text-gray-900">Home</span>
          <span className="mx-2 opacity-50">/</span>
          <span className="cursor-pointer hover:text-gray-900">Products</span>
          <span className="mx-2 opacity-50">/</span>
          <span>{product.title}</span>
        </div>

        {/* Main Product Section */}
        <div className="max-w-7xl mx-auto px-10 pb-16">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16">
            {/* Gallery */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 w-20">
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[3/4] cursor-pointer border transition-all ${
                      activeImageIndex === idx
                        ? "border-gray-900 opacity-100"
                        : "border-transparent opacity-60 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 border border-gray-200 overflow-hidden">
                <img
                  src={productImages[activeImageIndex]}
                  alt={product.title}
                  className="w-full h-auto transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="sticky top-24 h-fit">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-3">
                {product.brands || "Limited Edition Series"}
              </span>

              <h1 className="text-3xl font-extrabold leading-tight mb-3">
                {product.title}
              </h1>

              <div className="text-3xl font-bold text-gray-900 mb-5">
                ₹{currentPrice}
              </div>

              {/* Meta Info */}
              <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900">SKU:</span>
                  <span className="text-gray-600">
                    {matchedVariant?.sku || product.variants[0]?.sku || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900">Categories:</span>
                  <span className="text-gray-600">
                    <a href="#" className="hover:underline">
                      Products
                    </a>
                    {product.brands && (
                      <>
                        ,{" "}
                        <a href="#" className="hover:underline">
                          {product.brands}
                        </a>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variant Options */}
              {variantOptions.length > 0 && (
                <div className="mb-9">
                  {variantOptions.map((option) => {
                    const values = getOptionValues(option);
                    const selectedValue = selectedOptions[option.id];

                    return (
                      <div key={option.id} className="mb-6">
                        <span className="text-xs font-bold uppercase block mb-4">
                          Select {option.title}:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value) => {
                            const isSelected = selectedValue === value;
                            return (
                              <button
                                key={value}
                                onClick={() =>
                                  handleOptionChange(option.id, value)
                                }
                                className={`border px-4 py-2.5 min-w-[65px] text-center text-sm cursor-pointer rounded-md transition-all font-medium ${
                                  isSelected
                                    ? "border-[#967249] bg-[#fdf8f2]"
                                    : "border-[#d4bda2] bg-white hover:border-[#967249] hover:bg-[#fdf8f2]"
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

              {/* Add to Cart Section */}
              <div className="flex gap-4 py-6 border-t border-b border-gray-200 mb-5">
                {/* Quantity Box */}
                <div className="flex border border-gray-200">
                  <button
                    onClick={() => changeQuantity(-1)}
                    className="px-5 py-3 bg-white hover:bg-gray-50 text-lg"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-none font-bold outline-none"
                  />
                  <button
                    onClick={() => changeQuantity(1)}
                    className="px-5 py-3 bg-white hover:bg-gray-50 text-lg"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !matchedVariant ||
                    parseInt(matchedVariant?.stock || 0) === 0
                  }
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 font-bold uppercase text-sm transition-all ${
                    !matchedVariant ||
                    parseInt(matchedVariant?.stock || 0) === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>

              {/* Wishlist and Share */}
              <div className="flex gap-5 text-gray-600 text-xs font-semibold">
                <span className="cursor-pointer hover:text-gray-900 flex items-center gap-2">
                  <Heart size={16} />
                  ADD TO WISHLIST
                </span>
                <span className="cursor-pointer hover:text-gray-900 flex items-center gap-2">
                  <Share2 size={16} />
                  SHARE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-7xl mx-auto px-10 py-16 border-t border-gray-200">
          {/* Tab Headers */}
          <div className="flex gap-10 border-b border-gray-200 mb-8 flex-wrap">
            {["description", "sizeGuide", "additionalInfo", "reviews"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-5 font-bold text-xs uppercase relative transition-colors ${
                    activeTab === tab
                      ? "text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab === "description" && "Description"}
                  {tab === "sizeGuide" && "Size Guide"}
                  {tab === "additionalInfo" && "Additional Information"}
                  {tab === "reviews" && "Reviews (0)"}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></span>
                  )}
                </button>
              ),
            )}
          </div>

          {/* Tab Content */}
          <div className="text-gray-600 text-sm leading-relaxed">
            {activeTab === "description" && (
              <div className="animate-fadeIn">
                <p className="mb-4">{product.description}</p>
                {displayOptions.length > 0 && (
                  <>
                    <p className="font-bold text-gray-900 mt-6 mb-3">
                      Overview:
                    </p>
                    <ul className="space-y-2 ml-5">
                      {displayOptions.map((option, idx) => (
                        <li key={idx} className="relative pl-5">
                          <span className="absolute left-0 text-gray-500">
                            •
                          </span>
                          <span className="font-medium">{option.title}:</span>{" "}
                          {option.values.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === "sizeGuide" && (
              <div className="animate-fadeIn">
                <p className="mb-4">Please refer to our sizing chart below:</p>
                <table className="w-full max-w-2xl border-collapse mt-5">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b border-gray-200 px-3 py-3 text-center text-xs uppercase">
                        Size
                      </th>
                      <th className="border-b border-gray-200 px-3 py-3 text-center text-xs uppercase">
                        Chest (in.)
                      </th>
                      <th className="border-b border-gray-200 px-3 py-3 text-center text-xs uppercase">
                        Waist (in.)
                      </th>
                      <th className="border-b border-gray-200 px-3 py-3 text-center text-xs uppercase">
                        Hips (in.)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        size: "XS",
                        chest: "34-36",
                        waist: "27-29",
                        hips: "34.5-36.5",
                      },
                      {
                        size: "S",
                        chest: "36-38",
                        waist: "29-31",
                        hips: "36.5-38.5",
                      },
                      {
                        size: "M",
                        chest: "38-40",
                        waist: "31-33",
                        hips: "38.5-40.5",
                      },
                      {
                        size: "L",
                        chest: "40-42",
                        waist: "33-36",
                        hips: "40.5-43.5",
                      },
                      {
                        size: "XL",
                        chest: "42-45",
                        waist: "36-40",
                        hips: "43.5-47.5",
                      },
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td className="border-b border-gray-200 px-3 py-3 text-center">
                          {row.size}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-3 text-center">
                          {row.chest}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-3 text-center">
                          {row.waist}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-3 text-center">
                          {row.hips}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "additionalInfo" && (
              <div className="animate-fadeIn max-w-3xl">
                <div className="flex border-b border-gray-200 py-3">
                  <div className="w-40 font-bold text-gray-900">Weight</div>
                  <div className="flex-1">2 lbs</div>
                </div>
                {matchedVariant && (
                  <>
                    <div className="flex border-b border-gray-200 py-3">
                      <div className="w-40 font-bold text-gray-900">SKU</div>
                      <div className="flex-1">{matchedVariant.sku}</div>
                    </div>
                    <div className="flex border-b border-gray-200 py-3">
                      <div className="w-40 font-bold text-gray-900">Stock</div>
                      <div className="flex-1">{matchedVariant.stock} units</div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Reviews
                </h3>
                <p className="text-gray-500">There are no reviews yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="py-20 bg-gray-100">
          <h3 className="text-center font-bold text-2xl uppercase tracking-[3px] mb-10 font-montserrat">
            Complete the Look
          </h3>
          <div className="max-w-7xl mx-auto px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.slice(0, 4).map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-10 pt-20 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div>
                <div className="font-bold text-sm tracking-[4px] mb-6 font-montserrat">
                  MILITARY GEAR
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Premium tactical gear designed for professionals. Quality,
                  durability, and performance.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-6">Customer Support</h4>
                <ul className="space-y-3 text-xs text-gray-600">
                  <li className="cursor-pointer hover:text-gray-900">
                    Contact Us
                  </li>
                  <li className="cursor-pointer hover:text-gray-900">
                    Shipping & Returns
                  </li>
                  <li className="cursor-pointer hover:text-gray-900">
                    Size Guide
                  </li>
                  <li className="cursor-pointer hover:text-gray-900">
                    Order Tracking
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-6">Legal</h4>
                <ul className="space-y-3 text-xs text-gray-600">
                  <li className="cursor-pointer hover:text-gray-900">
                    Privacy Policy
                  </li>
                  <li className="cursor-pointer hover:text-gray-900">
                    Terms of Service
                  </li>
                  <li className="cursor-pointer hover:text-gray-900">
                    Cookie Policy
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-6">Newsletter</h4>
                <div className="border-b border-gray-900 flex items-center py-1">
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="flex-1 bg-transparent border-none outline-none text-xs placeholder:text-gray-500"
                  />
                  <span className="cursor-pointer">→</span>
                </div>
              </div>
            </div>

            <div className="text-center border-t border-gray-300 pt-5 text-xs text-gray-500 uppercase">
              © 2026 Military Gear. All rights reserved.
            </div>
          </div>
        </footer>

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
                            <span className="font-bold text-gray-900">
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
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-semibold uppercase text-sm"
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
  };

  // Loading state
  if (isProductLoading || !products.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // Product found
  if (selectedProduct) {
    return <SingleProductPage product={selectedProduct} />;
  }

  // Product not found (404)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-semibold uppercase text-sm"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default SingleProductShowcase;
