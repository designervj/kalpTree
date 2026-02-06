"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Grid3x3,
  List,
  Plus,
  Trash2,
  Eye,
  Settings,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductGallerySettings from "./ProductGallerySettings";
import ProductGalleryPreview from "./ProductGalleryPreview";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  stock?: number;
  badge?: string;
}

export interface GalleryConfig {
  layout: "grid" | "carousel" | "masonry";
  columns: number;
  gap: number;
  showBadge: boolean;
  showPrice: boolean;
  showDescription: boolean;
  cardStyle: "default" | "minimal" | "elevated";
  hoverEffect: "lift" | "scale" | "none";
}

const ProductGalleryPage: React.FC = ({ actions }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "browse" | "selected" | "settings"
  >("browse");

  const [galleryConfig, setGalleryConfig] = useState<GalleryConfig>({
    layout: "grid",
    columns: 3,
    gap: 20,
    showBadge: true,
    showPrice: true,
    showDescription: false,
    cardStyle: "default",
    hoverEffect: "lift",
  });

  // Fetch products - Replace this with your actual API call
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/products');
      // const data = await response.json();
      // setProducts(data);

      // Mock data for demonstration
      const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
        id: `product-${i + 1}`,
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 1000) + 100,
        image: `https://images.unsplash.com/photo-${1523275335684 + i}?w=400&h=400&fit=crop`,
        category: ["Electronics", "Fashion", "Home", "Beauty"][
          Math.floor(Math.random() * 4)
        ],
        description: `High-quality product description for Product ${i + 1}`,
        stock: Math.floor(Math.random() * 100),
        badge:
          Math.random() > 0.7
            ? "Sale"
            : Math.random() > 0.5
              ? "New"
              : undefined,
      }));

      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Toggle product selection
  const toggleProductSelection = (product: Product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Check if product is selected
  const isProductSelected = (productId: string) => {
    return selectedProducts.some((p) => p.id === productId);
  };

  // Remove product from selected
  const removeFromSelected = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Add gallery to canvas
  const addGalleryToCanvas = () => {
    // TODO: Implement logic to add the gallery component to GrapesJS canvas
    // This will depend on your GrapesJS integration
    console.log("Adding gallery to canvas with:", {
      products: selectedProducts,
      config: galleryConfig,
    });

    // Example: Generate HTML/CSS for the gallery
    const galleryHTML = generateGalleryHTML(selectedProducts, galleryConfig);
    console.log("Generated HTML:", galleryHTML);

    // You can dispatch an action or call a function to add this to the editor
    actions.addComponent(galleryHTML);
  };

  // Generate HTML for the gallery
  // Generate HTML for the gallery with navigation
  const generateGalleryHTML = (
    products: Product[],
    config: GalleryConfig,
  ): string => {
    const productCards = products
      .map(
        (product, index) => `
<div class="gallery-item" data-index="${index}" style="display: ${index === 0 ? "block" : "none"}">
  <div class="product-card" style="
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-width: 600px;
    margin: 0 auto;
  ">
    <div style="position: relative;">
      <img 
        src="${product.image}" 
        alt="${product.name}"
        style="width: 100%; height: 400px; object-fit: cover;"
      />
      ${
        config.showBadge && product.badge
          ? `
        <span style="
          position: absolute;
          top: 16px;
          right: 16px;
          background: #ef4444;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
        ">${product.badge}</span>
      `
          : ""
      }
    </div>
    <div style="padding: 24px;">
      <h3 style="
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: #1f2937;
      ">${product.name}</h3>
      ${
        product.category
          ? `
        <p style="
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 12px 0;
        ">${product.category}</p>
      `
          : ""
      }
      ${
        config.showDescription && product.description
          ? `
        <p style="
          color: #4b5563;
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 16px 0;
        ">${product.description}</p>
      `
          : ""
      }
      ${
        config.showPrice
          ? `
        <p style="
          font-size: 28px;
          font-weight: 700;
          color: #059669;
          margin: 0;
        ">$${product.price}</p>
      `
          : ""
      }
      ${
        product.stock !== undefined
          ? `
        <p style="
          color: ${product.stock > 0 ? "#059669" : "#ef4444"};
          font-size: 14px;
          margin-top: 8px;
        ">${product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
      `
          : ""
      }
    </div>
  </div>
</div>
      `,
      )
      .join("");

    return `
<div class="product-gallery-container" style="
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
">
  <!-- Gallery Items -->
  <div class="gallery-items" style="position: relative; min-height: 500px;">
    ${productCards}
  </div>

  <!-- Navigation Controls -->
  <div style="
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
  ">
    <!-- Previous Button -->
    <button 
      id="prevBtn" 
      class="gallery-nav-btn"
      style="
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      "
      onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)';"
      onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Previous
    </button>

    <!-- Counter -->
    <div style="
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      min-width: 80px;
      text-align: center;
    ">
      <span id="currentIndex">1</span> / <span id="totalItems">${products.length}</span>
    </div>

    <!-- Next Button -->
    <button 
      id="nextBtn" 
      class="gallery-nav-btn"
      style="
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      "
      onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)';"
      onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';"
    >
      Next
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>

  <!-- Progress Dots -->
  <div style="
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
  ">
    ${products
      .map(
        (_, index) => `
      <button 
        class="dot-indicator" 
        data-index="${index}"
        style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: ${index === 0 ? "#3b82f6" : "#d1d5db"};
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        "
        onmouseover="if(this.style.background !== 'rgb(59, 130, 246)') this.style.background='#9ca3af';"
        onmouseout="if(this.style.background !== 'rgb(59, 130, 246)') this.style.background='#d1d5db';"
      ></button>
    `,
      )
      .join("")}
  </div>

  <script>
    (function() {
      let currentIndex = 0;
      const totalItems = ${products.length};
      const galleryItems = document.querySelectorAll('.gallery-item');
      const dots = document.querySelectorAll('.dot-indicator');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const currentIndexEl = document.getElementById('currentIndex');

      function updateGallery(newIndex) {
        // Hide all items
        galleryItems.forEach(item => {
          item.style.display = 'none';
          item.style.opacity = '0';
        });

        // Show current item with fade effect
        galleryItems[newIndex].style.display = 'block';
        setTimeout(() => {
          galleryItems[newIndex].style.transition = 'opacity 0.3s ease';
          galleryItems[newIndex].style.opacity = '1';
        }, 10);

        // Update dots
        dots.forEach((dot, index) => {
          dot.style.background = index === newIndex ? '#3b82f6' : '#d1d5db';
          dot.style.transform = index === newIndex ? 'scale(1.2)' : 'scale(1)';
        });

        // Update counter
        currentIndexEl.textContent = newIndex + 1;

        // Update button states
        prevBtn.disabled = newIndex === 0;
        nextBtn.disabled = newIndex === totalItems - 1;
        
        prevBtn.style.opacity = newIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = newIndex === totalItems - 1 ? '0.5' : '1';
        prevBtn.style.cursor = newIndex === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.cursor = newIndex === totalItems - 1 ? 'not-allowed' : 'pointer';

        currentIndex = newIndex;
      }

      // Previous button
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          updateGallery(currentIndex - 1);
        }
      });

      // Next button
      nextBtn.addEventListener('click', () => {
        if (currentIndex < totalItems - 1) {
          updateGallery(currentIndex + 1);
        }
      });

      // Dot indicators
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          updateGallery(index);
        });
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          updateGallery(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
          updateGallery(currentIndex + 1);
        }
      });

      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      
      const galleryContainer = document.querySelector('.product-gallery-container');
      
      galleryContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });
      
      galleryContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });
      
      function handleSwipe() {
        if (touchEndX < touchStartX - 50 && currentIndex < totalItems - 1) {
          updateGallery(currentIndex + 1);
        }
        if (touchEndX > touchStartX + 50 && currentIndex > 0) {
          updateGallery(currentIndex - 1);
        }
      }

      // Auto-play (optional - uncomment to enable)
      // setInterval(() => {
      //   if (currentIndex < totalItems - 1) {
      //     updateGallery(currentIndex + 1);
      //   } else {
      //     updateGallery(0);
      //   }
      // }, 5000);
    })();
  </script>
</div>
  `;
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">
            Browse ({filteredProducts.length})
          </TabsTrigger>
          <TabsTrigger value="selected">
            Selected ({selectedProducts.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Browse Products Tab */}
        <TabsContent value="browse" className="flex-1 flex flex-col mt-0">
          <div className="p-4 space-y-4">
            {/* Search and View Controls */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid3x3 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchProducts}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            {/* Products Grid/List */}
            <ScrollArea className="h-[calc(100vh-280px)]">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <RefreshCw className="w-8 h-8 animate-spin text-violet-600" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No products found</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected={isProductSelected(product.id)}
                      onToggle={() => toggleProductSelection(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      isSelected={isProductSelected(product.id)}
                      onToggle={() => toggleProductSelection(product)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Selected Products Tab */}
        <TabsContent value="selected" className="flex-1 flex flex-col mt-0">
          <div className="p-4 space-y-4">
            {selectedProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Grid3x3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No products selected</p>
                <p className="text-sm mt-1">
                  Browse and select products to add to your gallery
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    {selectedProducts.length} product
                    {selectedProducts.length !== 1 ? "s" : ""} selected
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProducts([])}
                  >
                    Clear All
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="space-y-2">
                    {selectedProducts.map((product) => (
                      <SelectedProductItem
                        key={product.id}
                        product={product}
                        onRemove={() => removeFromSelected(product.id)}
                      />
                    ))}
                  </div>
                </ScrollArea>

                <Button
                  className="w-full"
                  onClick={addGalleryToCanvas}
                  disabled={selectedProducts.length === 0}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gallery to Canvas
                </Button>
              </>
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="flex-1 mt-0">
          <div className="p-4 space-y-4">
            <ProductGallerySettings
              config={galleryConfig}
              onConfigChange={setGalleryConfig}
            />

            {/* Preview */}
            {selectedProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Preview</h3>
                <ProductGalleryPreview
                  products={selectedProducts.slice(0, 6)}
                  config={galleryConfig}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductGalleryPage;

// Product Card Component (Grid View)
const ProductCard: React.FC<{
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ product, isSelected, onToggle }) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "ring-2 ring-violet-600 bg-violet-50/50 dark:bg-violet-900/10"
          : "hover:shadow-md"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-3 space-y-2">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 object-cover rounded-md"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 text-xs">
              {product.badge}
            </Badge>
          )}
          <Checkbox
            checked={isSelected}
            className="absolute top-2 right-2 bg-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div>
          <h4 className="font-medium text-sm truncate">{product.name}</h4>
          <p className="text-xs text-slate-500">{product.category}</p>
          <p className="text-sm font-semibold text-violet-600 mt-1">
            ${product.price}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Product List Item Component (List View)
const ProductListItem: React.FC<{
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ product, isSelected, onToggle }) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "ring-2 ring-violet-600 bg-violet-50/50 dark:bg-violet-900/10"
          : "hover:shadow-sm"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <Checkbox checked={isSelected} onClick={(e) => e.stopPropagation()} />
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{product.name}</h4>
            {product.badge && (
              <Badge variant="secondary" className="text-xs">
                {product.badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">{product.category}</p>
        </div>
        <p className="text-sm font-semibold text-violet-600">
          ${product.price}
        </p>
      </CardContent>
    </Card>
  );
};

// Selected Product Item Component
const SelectedProductItem: React.FC<{
  product: Product;
  onRemove: () => void;
}> = ({ product, onRemove }) => {
  return (
    <Card>
      <CardContent className="p-3 flex items-center gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-md"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{product.name}</h4>
          <p className="text-xs text-slate-500">{product.category}</p>
        </div>
        <p className="text-sm font-semibold text-violet-600">
          ${product.price}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="shrink-0"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </CardContent>
    </Card>
  );
};
