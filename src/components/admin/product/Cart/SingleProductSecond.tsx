"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  X,
  Search,
  User,
  Share2,
  Leaf,
  Truck,
  RefreshCcw,
  ShoppingBag,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addProductInCart,
  removeProductInCart,
  updateProductQtyInCart,
} from "@/hooks/slices/product/ProductSlice";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductModel } from "../type/ProductModel";
import { ProductVariant } from "@/modules/ecommerce/types";

const SingleProductNestCraft = ({ slug }: { slug?: any }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [matchedVariant, setMatchedVariant] = useState<ProductVariant | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [theme, setTheme] = useState("light");

  const params = useParams();
  const productId = slug ? slug : params.slug;

  const {
    listProduct: products,
    isProductLoading,
    cart,
    isCartLoading,
  } = useSelector((state: RootState) => state.product);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  console.log("====>>", products)
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

    const variantOptions = (selectedProduct?.options || []).filter(
      (opt: any) => opt.useForVariants
    );
    const selectedKeys = Object.keys(selectedOptions);

    const allVariantOptionsSelected = variantOptions.every((opt: any) =>
      selectedKeys.includes(opt.id)
    );

    if (!allVariantOptionsSelected) {
      setMatchedVariant(null);
      return;
    }

    const variant = (selectedProduct?.variants || []).find((v: ProductVariant) => {
      return variantOptions.every((option: any) => {
        const attr = (v.attributes || []).find((a: any) => a.attributeId === option.id);
        return attr && attr.value === selectedOptions[option.id];
      });
    });

    setMatchedVariant(variant || null);
  }, [selectedOptions, selectedProduct]);

  const addToCart = (product: ProductModel, variant: ProductVariant) => {
    dispatch(
      addProductInCart({ productId: product._id, variantId: variant._id })
    );
  };

  const removeFromCart = (index: number) => {
    dispatch(removeProductInCart(index));
  };

  const updateQuantity = (index: number, delta: number) => {
    dispatch(updateProductQtyInCart({ index, delta }));
  };

  const getTotalPrice = () => {
    return cart.reduce((total: number, item: any) => {
      const product = products.find((d) => d._id == item.productId);
      const variant = product?.variants.find((d) => d._id == item.variantId);
      const price = parseFloat(variant?.price || 0);
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

  const handleOptionChange = (optionId: string, value: string) => {
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

    if ((matchedVariant.stock || 0) <= 0) {
      toast.error("This configuration is out of stock");
      return;
    }

    if (selectedProduct && matchedVariant) {
      addToCart(selectedProduct, matchedVariant);
    }
    toast.success("Added to cart successfully!");
    setShowCart(true);
  };

  const getOptionValues = (option: any) => {
    if (option.useForVariants) {
      const values = new Set<string>();
      (selectedProduct?.variants || []).forEach((variant: ProductVariant) => {
        const attr = (variant.attributes || []).find(
          (a: any) => a.attributeId === option.id
        );
        if (attr && attr.value) {
          values.add(attr.value);
        }
      });
      return Array.from(values);
    }
    return option.values;
  };

  const calculateDiscount = (basePrice: string | number, variantPrice: string | number) => {
    const base = typeof basePrice === 'string' ? parseFloat(basePrice) : basePrice;
    const variant = typeof variantPrice === 'string' ? parseFloat(variantPrice) : variantPrice;
    if (base <= variant) return 0;
    return Math.round(((base - variant) / base) * 100);
  };

  const changeQuantity = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 99) {
      setQuantity(newQty);
    }
  };

  const getSelectedSummary = () => {
    if (!matchedVariant) return "Please select all options";

    const parts = [];
    Object.entries(selectedOptions).forEach(([key, value]) => {
      parts.push(value);
    });
    parts.push(`Qty ${quantity}`);

    return parts.join(" • ");
  };

  const SingleProductPage = ({ product }) => {
    const variantOptions = product.options.filter((opt) => opt.useForVariants);
    const displayOptions = product.options.filter((opt) => !opt.useForVariants);

    const currentPrice = matchedVariant
      ? parseFloat(matchedVariant.price || "0")
      : Math.min(...product.variants.map((v) => parseFloat(v.price || "0")));

    const discount = calculateDiscount(
      product.basePrice,
      currentPrice.toString()
    );

    // Mock images - replace with actual product images
    const productImages = [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1800",
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&q=80&w=1800",
    ];

    // Color mapping for swatches
    const colorMap = {
      Forest: "#0d6533",
      Sage: "#98c45f",
      Sand: "#d8c7aa",
      Charcoal: "#2a2f2c",
      Black: "#000000",
      White: "#ffffff",
      Red: "#dc2626",
      Blue: "#2563eb",
    };

    return (
      <div className="min-h-screen">
        <style jsx global>{`
          :root {
            --primary: #0d6533;
            --secondary: #98c45f;
            --accent: #cfe7b1;
            --dark: #063a1d;
            --ring: rgba(152, 196, 95, 0.55);
            --bg: #f6faf6;
            --surface: #ffffff;
            --surface-2: #fbfdfb;
            --text: #0b1610;
            --muted: #5b6f62;
            --border: rgba(13, 101, 51, 0.14);
            --shadow-sm: 0 14px 40px rgba(0, 0, 0, 0.08);
            --shadow-md: 0 28px 80px rgba(0, 0, 0, 0.14);
            --chip-bg: rgba(13, 101, 51, 0.06);
            --chip-border: rgba(13, 101, 51, 0.14);
            --r-sm: 12px;
            --r-md: 18px;
            --r-lg: 26px;
          }

          [data-theme="dark"] {
            --bg: #06140c;
            --surface: #0a2013;
            --surface-2: #0d2818;
            --text: #eaf4ec;
            --muted: #a9b8ae;
            --border: rgba(152, 196, 95, 0.2);
            --shadow-sm: 0 18px 60px rgba(0, 0, 0, 0.35);
            --shadow-md: 0 30px 90px rgba(0, 0, 0, 0.45);
            --chip-bg: rgba(152, 196, 95, 0.12);
            --chip-border: rgba(152, 196, 95, 0.2);
          }

          body {
            background: var(--bg);
            color: var(--text);
          }
        `}</style>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b backdrop-blur-md" style={{
          backgroundColor: 'color-mix(in srgb, var(--bg) 82%, transparent)',
          borderColor: 'var(--border)',
        }}>
          <div className="max-w-[1200px] mx-auto px-[5%] h-[74px] flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3 font-black text-sm tracking-[0.08em] uppercase">
              <span className="w-9 h-9 rounded-full grid place-items-center border" style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 16%, transparent)',
                borderColor: 'var(--border)',
              }}>
                <Leaf className="w-[18px] h-[18px]" style={{ color: 'var(--secondary)' }} />
              </span>
              NestCraft
            </a>

            <div className="hidden md:flex gap-5 items-center">
              <a href="#overview" className="text-xs font-black tracking-[0.14em] uppercase opacity-85 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Overview</a>
              <a href="#details" className="text-xs font-black tracking-[0.14em] uppercase opacity-85 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Details</a>
              <a href="#reviews" className="text-xs font-black tracking-[0.14em] uppercase opacity-85 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Reviews</a>
            </div>

            <div className="flex gap-2.5 items-center">
              <button className="w-11 h-11 rounded-full border grid place-items-center transition-transform hover:-translate-y-0.5" style={{
                borderColor: 'var(--border)',
                backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
              }}>
                <Search className="w-[18px] h-[18px]" style={{ color: 'var(--text)' }} />
              </button>

              <button
                onClick={() => setShowCart(true)}
                className="w-11 h-11 rounded-full border grid place-items-center transition-transform hover:-translate-y-0.5 relative"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                }}
              >
                <ShoppingCart className="w-[18px] h-[18px]" style={{ color: 'var(--text)' }} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full grid place-items-center text-[10px] font-black text-white" style={{ backgroundColor: 'var(--primary)' }}>
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className="px-3.5 h-11 rounded-full border inline-flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 text-xs font-black tracking-[0.14em] uppercase"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                  color: 'var(--text)',
                }}
              >
                {theme === "dark" ? (
                  <Sun className="w-[18px] h-[18px]" style={{ color: 'var(--secondary)' }} />
                ) : (
                  <Moon className="w-[18px] h-[18px]" style={{ color: 'var(--secondary)' }} />
                )}
                <span>{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-[1200px] mx-auto px-[5%]">
          {/* Breadcrumbs */}
          <div className="pt-[26px] flex gap-2.5 flex-wrap items-center text-xs font-black tracking-[0.14em] uppercase" style={{ color: 'color-mix(in srgb, var(--text) 70%, transparent)' }}>
            <a href="/">Home</a>
            <span className="opacity-45">›</span>
            <a href="#">{product.brands || "Products"}</a>
            <span className="opacity-45">›</span>
            <strong>{product.title}</strong>
          </div>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-[22px] items-start py-[22px] pb-[60px]">
            {/* Gallery */}
            <div className="rounded-[26px] overflow-hidden border shadow-lg" style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
              boxShadow: 'var(--shadow-md)',
            }}>
              {/* Gallery Top Bar */}
              <div className="flex justify-between items-center gap-3 px-4 py-3.5 border-b" style={{
                borderColor: 'var(--border)',
                backgroundColor: 'color-mix(in srgb, var(--surface) 76%, transparent)',
              }}>
                <div className="flex gap-2.5 items-center flex-wrap">
                  {matchedVariant && (matchedVariant.stock || 0) > 0 && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-[10px] font-black tracking-[0.16em] uppercase" style={{
                      backgroundColor: 'var(--chip-bg)',
                      borderColor: 'var(--chip-border)',
                    }}>
                      <b style={{ color: 'var(--secondary)' }}>In</b> Stock
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-[10px] font-black tracking-[0.16em] uppercase" style={{
                      backgroundColor: 'var(--chip-bg)',
                      borderColor: 'var(--chip-border)',
                    }}>
                      <b style={{ color: 'var(--secondary)' }}>{discount}%</b> Off
                    </span>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)}
                    className="w-10 h-10 rounded-full border grid place-items-center transition-transform hover:-translate-y-0.5"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                    }}
                  >
                    <ChevronLeft className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % productImages.length)}
                    className="w-10 h-10 rounded-full border grid place-items-center transition-transform hover:-translate-y-0.5"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                    }}
                  >
                    <ChevronRight className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative h-[min(660px,70vh)] overflow-hidden" style={{ backgroundColor: theme === 'dark' ? '#081a10' : '#e9efe9' }}>
                <img
                  src={productImages[activeImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover scale-[1.02] transition-transform duration-[420ms] hover:scale-[1.06]"
                />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(900px 420px at 10% 10%, rgba(152, 196, 95, 0.18), transparent 55%)',
                }} />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-2.5 px-4 py-3.5 border-t" style={{
                borderColor: 'var(--border)',
                backgroundColor: 'color-mix(in srgb, var(--surface) 76%, transparent)',
              }}>
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 rounded-2xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-0.5 ${activeImageIndex === idx ? 'ring-4' : ''
                      }`}
                    style={{
                      borderColor: activeImageIndex === idx ? 'color-mix(in srgb, var(--secondary) 70%, var(--border))' : 'var(--border)',
                      backgroundColor: '#eee',
                      ...(activeImageIndex === idx && {
                        boxShadow: '0 0 0 4px color-mix(in srgb, var(--secondary) 22%, transparent)',
                      }),
                    }}
                  >
                    <img src={img.replace('w=1800', 'w=600')} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Box */}
            <aside className="lg:sticky lg:top-[88px] rounded-[26px] border shadow-sm overflow-hidden backdrop-blur-md" style={{
              borderColor: 'var(--border)',
              backgroundColor: 'color-mix(in srgb, var(--surface) 84%, transparent)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div className="p-5 pb-3.5">
                <div className="inline-flex items-center gap-2.5 text-xs font-black tracking-[0.14em] uppercase" style={{ color: 'var(--secondary)' }}>
                  {product.brands || "Premium Product"}
                </div>

                <h1 className="text-[44px] leading-tight mt-2.5 tracking-tight" style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                }}>
                  {product.title}
                </h1>

                <div className="mt-3 flex justify-between gap-3 items-center flex-wrap">
                  <div className="text-xs font-black tracking-[0.18em] uppercase" style={{ color: 'color-mix(in srgb, var(--muted) 95%, transparent)' }}>
                    ₹{currentPrice}
                    {discount > 0 && (
                      <span className="line-through opacity-50 ml-2">₹{product.basePrice}</span>
                    )}
                  </div>
                  <div className="inline-flex gap-1.5 items-center text-xs font-extrabold" style={{ color: 'color-mix(in srgb, var(--text) 72%, transparent)' }}>
                    <Star className="w-4 h-4 fill-current" style={{ color: 'var(--secondary)' }} />
                    <span>4.9 • 128</span>
                  </div>
                </div>

                <p className="mt-3 font-semibold" style={{ color: 'var(--muted)' }}>
                  {product.description}
                </p>

                {matchedVariant && (matchedVariant.stock || 0) === 0 && (
                  <div className="mt-2 inline-block px-3 py-1.5 rounded-xl text-xs font-black tracking-[0.14em] uppercase" style={{
                    backgroundColor: '#fee',
                    color: '#dc2626',
                  }}>
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

              <div className="p-5 pt-4 grid gap-3.5">
                {/* Variant Options */}
                {variantOptions.map((option) => {
                  const values = getOptionValues(option);
                  const selectedValue = selectedOptions[option.id];
                  const isColorOption =
                    option.title.toLowerCase().includes("color") ||
                    option.title.toLowerCase().includes("colour");

                  return (
                    <div key={option.id}>
                      <div className="flex justify-between items-baseline gap-2.5 mb-2.5">
                        <strong className="text-xs font-black tracking-[0.16em] uppercase" style={{ color: 'color-mix(in srgb, var(--text) 80%, transparent)' }}>
                          {option.title}
                        </strong>
                        <small className="font-extrabold" style={{ color: 'var(--muted)' }}>
                          {selectedValue || "Not selected"}
                        </small>
                      </div>

                      {isColorOption ? (
                        <div className="flex gap-2.5 flex-wrap">
                          {values.map((value) => (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.id, value)}
                              className={`w-[38px] h-[38px] rounded-full border cursor-pointer transition-all ${selectedValue === value ? 'ring-4' : ''
                                }`}
                              style={{
                                backgroundColor: colorMap[value] || "#cccccc",
                                borderColor: selectedValue === value
                                  ? 'color-mix(in srgb, var(--secondary) 70%, var(--border))'
                                  : 'var(--border)',
                                boxShadow: selectedValue === value
                                  ? '0 0 0 4px color-mix(in srgb, var(--secondary) 22%, transparent), 0 16px 28px rgba(0, 0, 0, 0.12)'
                                  : '0 12px 24px rgba(0, 0, 0, 0.10)',
                              }}
                              aria-label={value}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-2.5 flex-wrap">
                          {values.map((value) => (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.id, value)}
                              className={`h-10 px-3.5 rounded-full border transition-all hover:-translate-y-0.5 text-xs font-black tracking-[0.14em] uppercase ${selectedValue === value ? 'ring-4' : ''
                                }`}
                              style={{
                                borderColor: selectedValue === value
                                  ? 'color-mix(in srgb, var(--secondary) 75%, var(--border))'
                                  : 'var(--border)',
                                backgroundColor: selectedValue === value
                                  ? 'color-mix(in srgb, var(--secondary) 18%, transparent)'
                                  : 'color-mix(in srgb, var(--surface) 70%, transparent)',
                                ...(selectedValue === value && {
                                  boxShadow: '0 0 0 4px color-mix(in srgb, var(--secondary) 18%, transparent)',
                                }),
                              }}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Quantity + Add to Cart */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="h-[46px] rounded-full border flex items-center justify-between px-2.5 gap-2.5" style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                  }}>
                    <button
                      type="button"
                      onClick={() => changeQuantity(-1)}
                      className="w-10 h-10 rounded-full border-transparent grid place-items-center transition-all hover:border-[var(--border)] hover:-translate-y-0.5"
                      style={{ backgroundColor: 'transparent', border: '1px solid transparent' }}
                    >
                      <Minus className="w-[18px] h-[18px]" />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 text-center font-black bg-transparent border-none outline-none"
                      style={{ color: 'var(--text)' }}
                    />
                    <button
                      type="button"
                      onClick={() => changeQuantity(1)}
                      className="w-10 h-10 rounded-full border-transparent grid place-items-center transition-all hover:border-[var(--border)] hover:-translate-y-0.5"
                      style={{ backgroundColor: 'transparent', border: '1px solid transparent' }}
                    >
                      <Plus className="w-[18px] h-[18px]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!matchedVariant || (matchedVariant?.stock || 0) === 0}
                    className="h-[46px] rounded-full flex items-center justify-center gap-2.5 px-4 text-xs font-black tracking-[0.14em] uppercase transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 border whitespace-nowrap"
                  // style={{
                  //   backgroundColor: theme === 'dark' ? 'var(--secondary)' : 'var(--primary)',
                  //   color: theme === 'dark' ? '#06140c' : '#fff',
                  //   borderColor: theme === 'dark' ? 'var(--secondary)' : 'var(--primary)',
                  // }}
                  >
                    <ShoppingBag className="w-[18px] h-[18px]" />
                    <span className="inline-block">Add to Cart</span>
                  </button>
                </div>

                <button className="h-[46px] rounded-full inline-flex items-center justify-center gap-2.5 px-4 text-xs font-black tracking-[0.14em] uppercase transition-all hover:-translate-y-0.5" style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                }}>
                  <Heart className="w-[18px] h-[18px]" />
                  Wishlist
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-[18px] border p-3" style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                  }}>
                    <div className="flex items-center gap-2.5 text-xs font-black tracking-[0.14em] uppercase" style={{ color: 'color-mix(in srgb, var(--text) 82%, transparent)' }}>
                      <Truck className="w-[18px] h-[18px]" style={{ color: 'var(--secondary)' }} />
                      delivery
                    </div>
                    <p className="mt-1.5 text-xs font-bold" style={{ color: 'var(--muted)' }}>
                      Ships in <b>2–3 weeks</b>. White-glove available.
                    </p>
                  </div>

                  <div className="rounded-[18px] border p-3" style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                  }}>
                    <div className="flex items-center gap-2.5 text-xs font-black tracking-[0.14em] uppercase" style={{ color: 'color-mix(in srgb, var(--text) 82%, transparent)' }}>
                      <RefreshCcw className="w-[18px] h-[18px]" style={{ color: 'var(--secondary)' }} />
                      returns
                    </div>
                    <p className="mt-1.5 text-xs font-bold" style={{ color: 'var(--muted)' }}>
                      14-day return window. Easy pickup options.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-extrabold tracking-[0.06em]" style={{ color: 'var(--muted)' }}>
                  Selected: <span>{getSelectedSummary()}</span>
                </div>
              </div>
            </aside>
          </div>

          {/* Tabs Section */}
          <section className="py-[60px]" id="details">
            <div className="flex gap-[30px] border-b mb-[30px] flex-wrap" style={{ borderColor: 'var(--border)' }}>
              {["description", "specifications", "additional", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-black tracking-[0.16em] uppercase relative transition-colors ${activeTab === tab ? '' : 'opacity-50'
                    }`}
                  style={{ color: 'var(--text)' }}
                >
                  {tab === "description" && "Description"}
                  {tab === "specifications" && "Specifications"}
                  {tab === "additional" && "Additional Info"}
                  {tab === "reviews" && "Reviews"}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: 'var(--secondary)' }} />
                  )}
                </button>
              ))}
            </div>

            <div>
              {activeTab === "description" && (
                <div className="animate-fadeIn">
                  <p className="font-bold leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {product.description}
                  </p>
                  {displayOptions.length > 0 && (
                    <div className="mt-6">
                      <p className="font-bold mb-3" style={{ color: 'var(--text)' }}>Overview:</p>
                      <div className="grid gap-2.5">
                        {displayOptions.map((option, idx) => (
                          <div key={idx} className="flex justify-between gap-5 p-3 rounded-[18px] border" style={{
                            borderColor: 'var(--border)',
                            backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                          }}>
                            <strong className="text-xs font-black tracking-[0.16em] uppercase" style={{ color: 'color-mix(in srgb, var(--text) 78%, transparent)' }}>
                              {option.title}
                            </strong>
                            <span className="text-xs font-extrabold" style={{ color: 'var(--muted)' }}>
                              {option.values.join(", ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid gap-2.5">
                  {displayOptions.map((option, idx) => (
                    <div key={idx} className="flex justify-between gap-5 p-3 rounded-[18px] border" style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                    }}>
                      <strong className="text-xs font-black tracking-[0.16em] uppercase" style={{ color: 'color-mix(in srgb, var(--text) 78%, transparent)' }}>
                        {option.title}
                      </strong>
                      <span className="text-xs font-extrabold" style={{ color: 'var(--muted)' }}>
                        {option.values.join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "additional" && matchedVariant && (
                <div className="max-w-3xl grid gap-2.5">
                  <div className="flex justify-between gap-5 p-3 rounded-[18px] border" style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                  }}>
                    <strong className="text-xs font-black tracking-[0.16em] uppercase" style={{ color: 'color-mix(in srgb, var(--text) 78%, transparent)' }}>SKU</strong>
                    <span className="text-xs font-extrabold" style={{ color: 'var(--muted)' }}>{matchedVariant.sku}</span>
                  </div>
                  <div className="flex justify-between gap-5 p-3 rounded-[18px] border" style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
                  }}>
                    <strong className="text-xs font-black tracking-[0.16em] uppercase" style={{ color: 'color-mix(in srgb, var(--text) 78%, transparent)' }}>Stock</strong>
                    <span className="text-xs font-extrabold" style={{ color: 'var(--muted)' }}>{matchedVariant.stock} units</span>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Reviews</h3>
                  <p style={{ color: 'var(--muted)' }}>There are no reviews yet.</p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Cart Sidebar */}
        <div
          className={`fixed inset-0 bg-black/50 z-[1999] transition-opacity ${showCart ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setShowCart(false)}
        />

        <div
          className={`fixed top-0 right-0 h-full w-full max-w-[450px] z-[2000] flex flex-col transition-transform ${showCart ? "translate-x-0" : "translate-x-full"
            }`}
          style={{
            backgroundColor: 'var(--surface)',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-[28px]" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              Shopping Cart
            </h2>
            <button
              onClick={() => setShowCart(false)}
              className="w-10 h-10 rounded-full border grid place-items-center transition-all hover:bg-[color-mix(in_srgb,var(--text)_8%,transparent)]"
              style={{ borderColor: 'var(--border)' }}
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="text-center py-[60px]" style={{ color: 'var(--muted)' }}>
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((item, index) => {
                const product = products.find((d) => d._id == item.productId);
                const variant = product?.variants.find((d) => d._id == item.variantId);
                if (!product || !variant) return null;

                const itemTotal = parseFloat(variant.price || "0") * item.quantity;

                return (
                  <div key={index} className="p-4 border rounded-[18px] mb-4" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1.5">{product.title}</h3>
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {variant.attributes.map((attr, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full border"
                              style={{
                                backgroundColor: 'var(--chip-bg)',
                                borderColor: 'var(--chip-border)',
                              }}
                            >
                              {attr.attributeName}: {attr.value}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>
                          SKU: {variant.sku}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="w-8 h-8 rounded-full border grid place-items-center transition-all hover:bg-[#fee]"
                        style={{ borderColor: 'var(--border)', color: '#dc2626' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="w-8 h-8 rounded-full border grid place-items-center transition-all"
                          style={{
                            borderColor: 'var(--border)',
                            backgroundColor: 'var(--surface)',
                          }}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="w-8 h-8 rounded-full border grid place-items-center transition-all"
                          style={{
                            borderColor: 'var(--border)',
                            backgroundColor: 'var(--surface)',
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-lg font-black">₹{itemTotal.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-[28px] font-black">₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full h-[46px] rounded-full inline-flex items-center justify-center text-xs font-black tracking-[0.14em] uppercase transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--secondary)' : 'var(--primary)',
                  color: theme === 'dark' ? '#06140c' : '#fff',
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (isProductLoading || !products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }} />
          <p className="mt-4 font-medium" style={{ color: 'var(--muted)' }}>Loading product...</p>
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="text-center max-w-md px-6">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>404</h1>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--muted)' }}>
          Product Not Found
        </h2>
        <p className="mb-8" style={{ color: 'var(--muted)' }}>
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 rounded-full font-black tracking-[0.14em] uppercase text-sm transition-all hover:-translate-y-0.5"
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
          }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

// Add Moon and Sun icons since they weren't in the imports
const Moon = ({ className, style }: any) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const Sun = ({ className, style }: any) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default SingleProductNestCraft;