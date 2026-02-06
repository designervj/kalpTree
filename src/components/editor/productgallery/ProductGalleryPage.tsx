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

const ProductGalleryPage: React.FC = () => {
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
    // actions.addComponent(galleryHTML);
  };

  // Generate HTML for the gallery
  const generateGalleryHTML = (
    products: Product[],
    config: GalleryConfig,
  ): string => {
    const productCards = products
      .map(
        (product) => `
      <div class="product-card" data-product-id="${product.id}">
        ${config.showBadge && product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          ${config.showDescription && product.description ? `<p class="product-description">${product.description}</p>` : ""}
          ${config.showPrice ? `<p class="product-price">$${product.price}</p>` : ""}
        </div>
      </div>
    `,
      )
      .join("");

    return `
      <div class="product-gallery-container" data-layout="${config.layout}" data-columns="${config.columns}">
        <div class="product-gallery">
          ${productCards}
        </div>
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
