// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Grid3x3,
//   List,
//   Plus,
//   Trash2,
//   Eye,
//   Settings,
//   RefreshCw,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import ProductGallerySettings from "./ProductGallerySettings";
// import ProductGalleryPreview from "./ProductGalleryPreview";

// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   category?: string;
//   description?: string;
//   stock?: number;
//   badge?: string;
// }

// export interface GalleryConfig {
//   layout: "grid" | "carousel" | "masonry";
//   columns: number;
//   gap: number;
//   showBadge: boolean;
//   showPrice: boolean;
//   showDescription: boolean;
//   cardStyle: "default" | "minimal" | "elevated";
//   hoverEffect: "lift" | "scale" | "none";
// }

// const ProductGalleryPage: React.FC = ({ actions }: any) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState<
//     "browse" | "selected" | "settings"
//   >("browse");

//   const [galleryConfig, setGalleryConfig] = useState<GalleryConfig>({
//     layout: "grid",
//     columns: 3,
//     gap: 20,
//     showBadge: true,
//     showPrice: true,
//     showDescription: false,
//     cardStyle: "default",
//     hoverEffect: "lift",
//   });

//   // Fetch products - Replace this with your actual API call
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       // TODO: Replace with your actual API endpoint
//       // const response = await fetch('/api/products');
//       // const data = await response.json();
//       // setProducts(data);

//       // Mock data for demonstration
//       const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
//         id: `product-${i + 1}`,
//         name: `Product ${i + 1}`,
//         price: Math.floor(Math.random() * 1000) + 100,
//         image: `https://images.unsplash.com/photo-${1523275335684 + i}?w=400&h=400&fit=crop`,
//         category: ["Electronics", "Fashion", "Home", "Beauty"][
//           Math.floor(Math.random() * 4)
//         ],
//         description: `High-quality product description for Product ${i + 1}`,
//         stock: Math.floor(Math.random() * 100),
//         badge:
//           Math.random() > 0.7
//             ? "Sale"
//             : Math.random() > 0.5
//               ? "New"
//               : undefined,
//       }));

//       setProducts(mockProducts);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Filter products based on search
//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   // Toggle product selection
//   const toggleProductSelection = (product: Product) => {
//     setSelectedProducts((prev) => {
//       const isSelected = prev.some((p) => p.id === product.id);
//       if (isSelected) {
//         return prev.filter((p) => p.id !== product.id);
//       } else {
//         return [...prev, product];
//       }
//     });
//   };

//   // Check if product is selected
//   const isProductSelected = (productId: string) => {
//     return selectedProducts.some((p) => p.id === productId);
//   };

//   // Remove product from selected
//   const removeFromSelected = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
//   };

//   // Add gallery to canvas
//   const addGalleryToCanvas = () => {
//     // TODO: Implement logic to add the gallery component to GrapesJS canvas
//     // This will depend on your GrapesJS integration
//     console.log("Adding gallery to canvas with:", {
//       products: selectedProducts,
//       config: galleryConfig,
//     });

//     // Example: Generate HTML/CSS for the gallery
//     const galleryHTML = generateGalleryHTML(selectedProducts, galleryConfig);
//     console.log("Generated HTML:", galleryHTML);

//     // You can dispatch an action or call a function to add this to the editor
//     actions.addComponent(galleryHTML);
//   };

//   // Generate HTML for the gallery
//   // Generate HTML for the gallery with navigation
//   const generateGalleryHTML = (
//     products: Product[],
//     config: GalleryConfig,
//   ): string => {
//     const productCards = products
//       .map(
//         (product, index) => `
// <div class="gallery-item" data-index="${index}" style="display: ${index === 0 ? "block" : "none"}">
//   <div class="product-card" style="
//     background: white;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//     max-width: 600px;
//     margin: 0 auto;
//   ">
//     <div style="position: relative;">
//       <img
//         src="${product.image}"
//         alt="${product.name}"
//         style="width: 100%; height: 400px; object-fit: cover;"
//       />
//       ${
//         config.showBadge && product.badge
//           ? `
//         <span style="
//           position: absolute;
//           top: 16px;
//           right: 16px;
//           background: #ef4444;
//           color: white;
//           padding: 6px 12px;
//           border-radius: 6px;
//           font-size: 14px;
//           font-weight: 600;
//         ">${product.badge}</span>
//       `
//           : ""
//       }
//     </div>
//     <div style="padding: 24px;">
//       <h3 style="
//         font-size: 24px;
//         font-weight: 700;
//         margin: 0 0 8px 0;
//         color: #1f2937;
//       ">${product.name}</h3>
//       ${
//         product.category
//           ? `
//         <p style="
//           color: #6b7280;
//           font-size: 14px;
//           margin: 0 0 12px 0;
//         ">${product.category}</p>
//       `
//           : ""
//       }
//       ${
//         config.showDescription && product.description
//           ? `
//         <p style="
//           color: #4b5563;
//           font-size: 16px;
//           line-height: 1.6;
//           margin: 0 0 16px 0;
//         ">${product.description}</p>
//       `
//           : ""
//       }
//       ${
//         config.showPrice
//           ? `
//         <p style="
//           font-size: 28px;
//           font-weight: 700;
//           color: #059669;
//           margin: 0;
//         ">$${product.price}</p>
//       `
//           : ""
//       }
//       ${
//         product.stock !== undefined
//           ? `
//         <p style="
//           color: ${product.stock > 0 ? "#059669" : "#ef4444"};
//           font-size: 14px;
//           margin-top: 8px;
//         ">${product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
//       `
//           : ""
//       }
//     </div>
//   </div>
// </div>
//       `,
//       )
//       .join("");

//     return `
// <div class="product-gallery-container" style="
//   position: relative;
//   width: 100%;
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 40px 20px;
// ">
//   <!-- Gallery Items -->
//   <div class="gallery-items" style="position: relative; min-height: 500px;">
//     ${productCards}
//   </div>

//   <!-- Navigation Controls -->
//   <div style="
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 20px;
//     margin-top: 30px;
//   ">
//     <!-- Previous Button -->
//     <button
//       id="prevBtn"
//       class="gallery-nav-btn"
//       style="
//         background: #3b82f6;
//         color: white;
//         border: none;
//         padding: 12px 24px;
//         border-radius: 8px;
//         font-size: 16px;
//         font-weight: 600;
//         cursor: pointer;
//         display: flex;
//         align-items: center;
//         gap: 8px;
//         transition: all 0.3s ease;
//         box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//       "
//       onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)';"
//       onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';"
//     >
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//         <polyline points="15 18 9 12 15 6"></polyline>
//       </svg>
//       Previous
//     </button>

//     <!-- Counter -->
//     <div style="
//       font-size: 16px;
//       font-weight: 600;
//       color: #1f2937;
//       min-width: 80px;
//       text-align: center;
//     ">
//       <span id="currentIndex">1</span> / <span id="totalItems">${products.length}</span>
//     </div>

//     <!-- Next Button -->
//     <button
//       id="nextBtn"
//       class="gallery-nav-btn"
//       style="
//         background: #3b82f6;
//         color: white;
//         border: none;
//         padding: 12px 24px;
//         border-radius: 8px;
//         font-size: 16px;
//         font-weight: 600;
//         cursor: pointer;
//         display: flex;
//         align-items: center;
//         gap: 8px;
//         transition: all 0.3s ease;
//         box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//       "
//       onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)';"
//       onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';"
//     >
//       Next
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//         <polyline points="9 18 15 12 9 6"></polyline>
//       </svg>
//     </button>
//   </div>

//   <!-- Progress Dots -->
//   <div style="
//     display: flex;
//     justify-content: center;
//     gap: 8px;
//     margin-top: 20px;
//   ">
//     ${products
//       .map(
//         (_, index) => `
//       <button
//         class="dot-indicator"
//         data-index="${index}"
//         style="
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           border: none;
//           background: ${index === 0 ? "#3b82f6" : "#d1d5db"};
//           cursor: pointer;
//           transition: all 0.3s ease;
//           padding: 0;
//         "
//         onmouseover="if(this.style.background !== 'rgb(59, 130, 246)') this.style.background='#9ca3af';"
//         onmouseout="if(this.style.background !== 'rgb(59, 130, 246)') this.style.background='#d1d5db';"
//       ></button>
//     `,
//       )
//       .join("")}
//   </div>

//   <script>
//     (function() {
//       let currentIndex = 0;
//       const totalItems = ${products.length};
//       const galleryItems = document.querySelectorAll('.gallery-item');
//       const dots = document.querySelectorAll('.dot-indicator');
//       const prevBtn = document.getElementById('prevBtn');
//       const nextBtn = document.getElementById('nextBtn');
//       const currentIndexEl = document.getElementById('currentIndex');

//       function updateGallery(newIndex) {
//         // Hide all items
//         galleryItems.forEach(item => {
//           item.style.display = 'none';
//           item.style.opacity = '0';
//         });

//         // Show current item with fade effect
//         galleryItems[newIndex].style.display = 'block';
//         setTimeout(() => {
//           galleryItems[newIndex].style.transition = 'opacity 0.3s ease';
//           galleryItems[newIndex].style.opacity = '1';
//         }, 10);

//         // Update dots
//         dots.forEach((dot, index) => {
//           dot.style.background = index === newIndex ? '#3b82f6' : '#d1d5db';
//           dot.style.transform = index === newIndex ? 'scale(1.2)' : 'scale(1)';
//         });

//         // Update counter
//         currentIndexEl.textContent = newIndex + 1;

//         // Update button states
//         prevBtn.disabled = newIndex === 0;
//         nextBtn.disabled = newIndex === totalItems - 1;

//         prevBtn.style.opacity = newIndex === 0 ? '0.5' : '1';
//         nextBtn.style.opacity = newIndex === totalItems - 1 ? '0.5' : '1';
//         prevBtn.style.cursor = newIndex === 0 ? 'not-allowed' : 'pointer';
//         nextBtn.style.cursor = newIndex === totalItems - 1 ? 'not-allowed' : 'pointer';

//         currentIndex = newIndex;
//       }

//       // Previous button
//       prevBtn.addEventListener('click', () => {
//         if (currentIndex > 0) {
//           updateGallery(currentIndex - 1);
//         }
//       });

//       // Next button
//       nextBtn.addEventListener('click', () => {
//         if (currentIndex < totalItems - 1) {
//           updateGallery(currentIndex + 1);
//         }
//       });

//       // Dot indicators
//       dots.forEach((dot, index) => {
//         dot.addEventListener('click', () => {
//           updateGallery(index);
//         });
//       });

//       // Keyboard navigation
//       document.addEventListener('keydown', (e) => {
//         if (e.key === 'ArrowLeft' && currentIndex > 0) {
//           updateGallery(currentIndex - 1);
//         } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
//           updateGallery(currentIndex + 1);
//         }
//       });

//       // Touch swipe support
//       let touchStartX = 0;
//       let touchEndX = 0;

//       const galleryContainer = document.querySelector('.product-gallery-container');

//       galleryContainer.addEventListener('touchstart', (e) => {
//         touchStartX = e.changedTouches[0].screenX;
//       });

//       galleryContainer.addEventListener('touchend', (e) => {
//         touchEndX = e.changedTouches[0].screenX;
//         handleSwipe();
//       });

//       function handleSwipe() {
//         if (touchEndX < touchStartX - 50 && currentIndex < totalItems - 1) {
//           updateGallery(currentIndex + 1);
//         }
//         if (touchEndX > touchStartX + 50 && currentIndex > 0) {
//           updateGallery(currentIndex - 1);
//         }
//       }

//       // Auto-play (optional - uncomment to enable)
//       // setInterval(() => {
//       //   if (currentIndex < totalItems - 1) {
//       //     updateGallery(currentIndex + 1);
//       //   } else {
//       //     updateGallery(0);
//       //   }
//       // }, 5000);
//     })();
//   </script>
// </div>
//   `;
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <Tabs
//         value={activeTab}
//         onValueChange={(v) => setActiveTab(v as typeof activeTab)}
//         className="flex-1 flex flex-col"
//       >
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="browse">
//             Browse ({filteredProducts.length})
//           </TabsTrigger>
//           <TabsTrigger value="selected">
//             Selected ({selectedProducts.length})
//           </TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         {/* Browse Products Tab */}
//         <TabsContent value="browse" className="flex-1 flex flex-col mt-0">
//           <div className="p-4 space-y-4">
//             {/* Search and View Controls */}
//             <div className="flex items-center gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <Input
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() =>
//                   setViewMode(viewMode === "grid" ? "list" : "grid")
//                 }
//               >
//                 {viewMode === "grid" ? (
//                   <List className="w-4 h-4" />
//                 ) : (
//                   <Grid3x3 className="w-4 h-4" />
//                 )}
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={fetchProducts}
//                 disabled={loading}
//               >
//                 <RefreshCw
//                   className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
//                 />
//               </Button>
//             </div>

//             {/* Products Grid/List */}
//             <ScrollArea className="h-[calc(100vh-280px)]">
//               {loading ? (
//                 <div className="flex items-center justify-center h-40">
//                   <RefreshCw className="w-8 h-8 animate-spin text-violet-600" />
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="text-center py-12 text-slate-500">
//                   <p>No products found</p>
//                 </div>
//               ) : viewMode === "grid" ? (
//                 <div className="grid grid-cols-2 gap-3">
//                   {filteredProducts.map((product) => (
//                     <ProductCard
//                       key={product.id}
//                       product={product}
//                       isSelected={isProductSelected(product.id)}
//                       onToggle={() => toggleProductSelection(product)}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {filteredProducts.map((product) => (
//                     <ProductListItem
//                       key={product.id}
//                       product={product}
//                       isSelected={isProductSelected(product.id)}
//                       onToggle={() => toggleProductSelection(product)}
//                     />
//                   ))}
//                 </div>
//               )}
//             </ScrollArea>
//           </div>
//         </TabsContent>

//         {/* Selected Products Tab */}
//         <TabsContent value="selected" className="flex-1 flex flex-col mt-0">
//           <div className="p-4 space-y-4">
//             {selectedProducts.length === 0 ? (
//               <div className="text-center py-12 text-slate-500">
//                 <Grid3x3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                 <p className="font-medium">No products selected</p>
//                 <p className="text-sm mt-1">
//                   Browse and select products to add to your gallery
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-slate-600">
//                     {selectedProducts.length} product
//                     {selectedProducts.length !== 1 ? "s" : ""} selected
//                   </p>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setSelectedProducts([])}
//                   >
//                     Clear All
//                   </Button>
//                 </div>

//                 <ScrollArea className="h-[calc(100vh-340px)]">
//                   <div className="space-y-2">
//                     {selectedProducts.map((product) => (
//                       <SelectedProductItem
//                         key={product.id}
//                         product={product}
//                         onRemove={() => removeFromSelected(product.id)}
//                       />
//                     ))}
//                   </div>
//                 </ScrollArea>

//                 <Button
//                   className="w-full"
//                   onClick={addGalleryToCanvas}
//                   disabled={selectedProducts.length === 0}
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Gallery to Canvas
//                 </Button>
//               </>
//             )}
//           </div>
//         </TabsContent>

//         {/* Settings Tab */}
//         <TabsContent value="settings" className="flex-1 mt-0">
//           <div className="p-4 space-y-4">
//             <ProductGallerySettings
//               config={galleryConfig}
//               onConfigChange={setGalleryConfig}
//             />

//             {/* Preview */}
//             {selectedProducts.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-sm font-medium mb-3">Preview</h3>
//                 <ProductGalleryPreview
//                   products={selectedProducts.slice(0, 6)}
//                   config={galleryConfig}
//                 />
//               </div>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default ProductGalleryPage;

// // Product Card Component (Grid View)
// const ProductCard: React.FC<{
//   product: Product;
//   isSelected: boolean;
//   onToggle: () => void;
// }> = ({ product, isSelected, onToggle }) => {
//   return (
//     <Card
//       className={`cursor-pointer transition-all ${
//         isSelected
//           ? "ring-2 ring-violet-600 bg-violet-50/50 dark:bg-violet-900/10"
//           : "hover:shadow-md"
//       }`}
//       onClick={onToggle}
//     >
//       <CardContent className="p-3 space-y-2">
//         <div className="relative">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-32 object-cover rounded-md"
//           />
//           {product.badge && (
//             <Badge className="absolute top-2 left-2 text-xs">
//               {product.badge}
//             </Badge>
//           )}
//           <Checkbox
//             checked={isSelected}
//             className="absolute top-2 right-2 bg-white"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//         <div>
//           <h4 className="font-medium text-sm truncate">{product.name}</h4>
//           <p className="text-xs text-slate-500">{product.category}</p>
//           <p className="text-sm font-semibold text-violet-600 mt-1">
//             ${product.price}
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Product List Item Component (List View)
// const ProductListItem: React.FC<{
//   product: Product;
//   isSelected: boolean;
//   onToggle: () => void;
// }> = ({ product, isSelected, onToggle }) => {
//   return (
//     <Card
//       className={`cursor-pointer transition-all ${
//         isSelected
//           ? "ring-2 ring-violet-600 bg-violet-50/50 dark:bg-violet-900/10"
//           : "hover:shadow-sm"
//       }`}
//       onClick={onToggle}
//     >
//       <CardContent className="p-3 flex items-center gap-3">
//         <Checkbox checked={isSelected} onClick={(e) => e.stopPropagation()} />
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-16 h-16 object-cover rounded-md"
//         />
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2">
//             <h4 className="font-medium text-sm truncate">{product.name}</h4>
//             {product.badge && (
//               <Badge variant="secondary" className="text-xs">
//                 {product.badge}
//               </Badge>
//             )}
//           </div>
//           <p className="text-xs text-slate-500">{product.category}</p>
//         </div>
//         <p className="text-sm font-semibold text-violet-600">
//           ${product.price}
//         </p>
//       </CardContent>
//     </Card>
//   );
// };

// // Selected Product Item Component
// const SelectedProductItem: React.FC<{
//   product: Product;
//   onRemove: () => void;
// }> = ({ product, onRemove }) => {
//   return (
//     <Card>
//       <CardContent className="p-3 flex items-center gap-3">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-12 h-12 object-cover rounded-md"
//         />
//         <div className="flex-1 min-w-0">
//           <h4 className="font-medium text-sm truncate">{product.name}</h4>
//           <p className="text-xs text-slate-500">{product.category}</p>
//         </div>
//         <p className="text-sm font-semibold text-violet-600">
//           ${product.price}
//         </p>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onRemove}
//           className="shrink-0"
//         >
//           <Trash2 className="w-4 h-4 text-red-500" />
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Grid3x3,
  List,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

export interface SavedGallery {
  id: string;
  heading: string;
  subheading: string;
  description: string;
  products: Product[];
  config: GalleryConfig;
  createdAt: Date;
}

const ProductGalleryPage: React.FC = ({ actions }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Gallery management
  const [savedGalleries, setSavedGalleries] = useState<SavedGallery[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<SavedGallery | null>(
    null,
  );

  // Modal state
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Gallery form state
  const [galleryHeading, setGalleryHeading] = useState("");
  const [gallerySubheading, setGallerySubheading] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");

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

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
        id: `product-${i + 1}`,
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 1000) + 100,
        image: `https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
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

  // Filter products
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

  const isProductSelected = (productId: string) => {
    return selectedProducts.some((p) => p.id === productId);
  };

  const removeFromSelected = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Open modal for new gallery
  const openAddGalleryModal = () => {
    setEditingGallery(null);
    setSelectedProducts([]);
    setGalleryHeading("");
    setGallerySubheading("");
    setGalleryDescription("");
    setGalleryConfig({
      layout: "grid",
      columns: 3,
      gap: 20,
      showBadge: true,
      showPrice: true,
      showDescription: false,
      cardStyle: "default",
      hoverEffect: "lift",
    });
    setModalStep(1);
    setSearchTerm("");
    setIsModalOpen(true);
  };

  // Edit existing gallery
  const editGallery = (gallery: SavedGallery) => {
    setEditingGallery(gallery);
    setSelectedProducts([...gallery.products]);
    setGalleryHeading(gallery.heading);
    setGallerySubheading(gallery.subheading);
    setGalleryDescription(gallery.description);
    setGalleryConfig({ ...gallery.config });
    setModalStep(1);
    setIsModalOpen(true);
  };

  // Save gallery and automatically add to canvas
  const saveGallery = () => {
    if (!galleryHeading.trim()) {
      alert("Please enter a gallery heading");
      return;
    }

    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    const newGallery: SavedGallery = {
      id: editingGallery?.id || `gallery-${Date.now()}`,
      heading: galleryHeading,
      subheading: gallerySubheading,
      description: galleryDescription,
      products: [...selectedProducts],
      config: { ...galleryConfig },
      createdAt: editingGallery?.createdAt || new Date(),
    };

    if (editingGallery) {
      setSavedGalleries((prev) =>
        prev.map((g) => (g.id === editingGallery.id ? newGallery : g)),
      );
    } else {
      setSavedGalleries((prev) => [...prev, newGallery]);
    }

    // Automatically add to canvas
    addGalleryToCanvas(newGallery);

    setIsModalOpen(false);
    resetModal();
  };

  const resetModal = () => {
    setSelectedProducts([]);
    setGalleryHeading("");
    setGallerySubheading("");
    setGalleryDescription("");
    setModalStep(1);
    setSearchTerm("");
  };

  const deleteGallery = (galleryId: string) => {
    if (confirm("Are you sure you want to delete this gallery?")) {
      setSavedGalleries((prev) => prev.filter((g) => g.id !== galleryId));
    }
  };

  const addGalleryToCanvas = (gallery: SavedGallery) => {
    const galleryHTML = generateGalleryHTML(
      gallery.heading,
      gallery.subheading,
      gallery.description,
      gallery.products,
      gallery.config,
    );

    if (actions && actions.addComponent) {
      actions.addComponent(galleryHTML);
    }

    console.log("Gallery added to canvas");
  };

  const goToNextStep = () => {
    if (modalStep === 1 && selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }
    if (modalStep < 3) {
      setModalStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const goToPreviousStep = () => {
    if (modalStep > 1) {
      setModalStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const generateGalleryHTML = (
    heading: string,
    subheading: string,
    description: string,
    products: Product[],
    config: GalleryConfig,
  ): string => {
    const productCards = products
      .map(
        (product, index) => `
<div class="gallery-item" data-index="${product.id}" style="display: ${index === 0 ? "block" : "none"}">
  <div class="product-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto;">
    <div style="position: relative;">
      <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 400px; object-fit: cover;" />
      ${config.showBadge && product.badge ? `<span style="position: absolute; top: 16px; right: 16px; background: #ef4444; color: white; padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 600;">${product.badge}</span>` : ""}
    </div>
    <div style="padding: 24px;">
      <h3 pro-hint="price" style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0; color: #1f2937;">${product.name}</h3>
      ${product.category ? `<p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">${product.category}</p>` : ""}
      ${config.showDescription && product.description ? `<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">${product.description}</p>` : ""}
      ${config.showPrice ? `<p style="font-size: 28px; font-weight: 700; color: #059669; margin: 0;">$${product.price}</p>` : ""}
    </div>
  </div>
</div>`,
      )
      .join("");

      

    return `
<div class="product-gallery-container" style="position: relative; width: 100%; max-width: 800px; margin: 0 auto; padding: 40px 20px;">
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-size: 36px; font-weight: 800; color: #1f2937; margin: 0 0 12px 0;">[pro_head]</h1>
    ${subheading ? `<h2 style="font-size: 20px; font-weight: 500; color: #6b7280; margin: 0 0 16px 0;">${subheading}</h2>` : ""}
    ${description ? `<p style="font-size: 16px; color: #4b5563; line-height: 1.6; max-width: 600px; margin: 0 auto;">${description}</p>` : ""}
  </div>
  <div class="gallery-items" style="position: relative; min-height: 500px;">${productCards}</div>
  <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 30px;">
    <button id="prevBtn" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;">Previous</button>
    <div style="font-size: 16px; font-weight: 600; color: #1f2937;"><span id="currentIndex">1</span> / ${products.length}</div>
    <button id="nextBtn" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;">Next</button>
  </div>
  <script>
    (function() {
      let currentIndex = 0;
      const totalItems = ${products.length};
      const items = document.querySelectorAll('.gallery-item');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const currentIndexEl = document.getElementById('currentIndex');
      
      function updateGallery(newIndex) {
        items.forEach(item => {
          item.style.display = 'none';
          item.style.opacity = '0';
        });
        items[newIndex].style.display = 'block';
        setTimeout(() => {
          items[newIndex].style.transition = 'opacity 0.3s ease';
          items[newIndex].style.opacity = '1';
        }, 10);
        currentIndexEl.textContent = newIndex + 1;
        prevBtn.disabled = newIndex === 0;
        nextBtn.disabled = newIndex === totalItems - 1;
        prevBtn.style.opacity = newIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = newIndex === totalItems - 1 ? '0.5' : '1';
        prevBtn.style.cursor = newIndex === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.cursor = newIndex === totalItems - 1 ? 'not-allowed' : 'pointer';
        currentIndex = newIndex;
      }
      
      prevBtn.addEventListener('click', () => { if (currentIndex > 0) updateGallery(currentIndex - 1); });
      nextBtn.addEventListener('click', () => { if (currentIndex < totalItems - 1) updateGallery(currentIndex + 1); });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          updateGallery(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
          updateGallery(currentIndex + 1);
        }
      });
    })();
  </script>
</div>`;
  };

  return (
    <div className="h-full flex flex-col p-6 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Product Galleries
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Create and manage your product showcases
            </p>
          </div>
          <Button
            onClick={openAddGalleryModal}
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Gallery
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {savedGalleries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Grid3x3 className="w-12 h-12 text-violet-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No galleries yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-lg">
              Create your first product gallery to showcase your items in style.
              It only takes a few clicks!
            </p>
            <Button
              onClick={openAddGalleryModal}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Gallery
            </Button>
          </div>
        ) : (
          <div className="">
            {savedGalleries.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                onEdit={() => editGallery(gallery)}
                onDelete={() => deleteGallery(gallery.id)}
                onAddToCanvas={() => addGalleryToCanvas(gallery)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingGallery ? "Edit Gallery" : "Create New Gallery"}
            </DialogTitle>
            <DialogDescription>
              {modalStep === 1 && "Select products for your gallery"}
              {modalStep === 2 && "Configure gallery style and appearance"}
              {modalStep === 3 && "Add gallery details and information"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-4 py-4 border-b">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  modalStep >= 1
                    ? "bg-violet-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-medium ${
                  modalStep >= 1 ? "text-slate-900" : "text-slate-400"
                }`}
              >
                Products
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  modalStep >= 2
                    ? "bg-violet-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  modalStep >= 2 ? "text-slate-900" : "text-slate-400"
                }`}
              >
                Style
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  modalStep >= 3
                    ? "bg-violet-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-medium ${
                  modalStep >= 3 ? "text-slate-900" : "text-slate-400"
                }`}
              >
                Details
              </span>
            </div>
          </div>

          {modalStep === 1 && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 space-y-4">
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
                  <Badge variant="secondary" className="font-semibold">
                    {selectedProducts.length} selected
                  </Badge>
                </div>

                <ScrollArea className="h-[400px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-40">
                      <RefreshCw className="w-8 h-8 animate-spin text-violet-600" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <p>No products found</p>
                    </div>
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-4 gap-3">
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
            </div>
          )}

          {modalStep === 2 && (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[500px] px-6">
                <div className="space-y-6 py-4">
                  <ProductGallerySettings
                    config={galleryConfig}
                    onConfigChange={setGalleryConfig}
                  />

                  {selectedProducts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">Preview</h3>
                      <ProductGalleryPreview
                        products={selectedProducts.slice(0, 6)}
                        config={galleryConfig}
                      />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {modalStep === 3 && (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[500px] px-6">
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="heading">Heading *</Label>
                    <Input
                      id="heading"
                      placeholder="e.g., Summer Collection 2024"
                      value={galleryHeading}
                      onChange={(e) => setGalleryHeading(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subheading">Subheading</Label>
                    <Input
                      id="subheading"
                      placeholder="e.g., Discover our latest arrivals"
                      value={gallerySubheading}
                      onChange={(e) => setGallerySubheading(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Add a detailed description..."
                      value={galleryDescription}
                      onChange={(e) => setGalleryDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Selected Products ({selectedProducts.length})</Label>
                    <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProducts.slice(0, 8).map((product) => (
                          <div key={product.id} className="relative group">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-20 object-cover rounded"
                            />
                            <button
                              onClick={() => removeFromSelected(product.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {selectedProducts.length > 8 && (
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          +{selectedProducts.length - 8} more products
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4 px-6 pb-6">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={modalStep === 1}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsModalOpen(false);
                  resetModal();
                }}
              >
                Cancel
              </Button>
              {modalStep < 3 ? (
                <Button onClick={goToNextStep}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={saveGallery}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {editingGallery ? "Update Gallery" : "Add Gallery"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGalleryPage;

const ProductCard: React.FC<{
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ product, isSelected, onToggle }) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "ring-2 ring-violet-600 bg-violet-50/50"
          : "hover:shadow-md"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-2 space-y-2">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-24 object-cover rounded-md"
          />
          {product.badge && (
            <Badge className="absolute top-1 left-1 text-xs">
              {product.badge}
            </Badge>
          )}
          <Checkbox
            checked={isSelected}
            className="absolute top-1 right-1 bg-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div>
          <h4 className="font-medium text-xs truncate">{product.name}</h4>
          <p className="text-xs text-violet-600 font-semibold mt-1">
            ${product.price}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductListItem: React.FC<{
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ product, isSelected, onToggle }) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "ring-2 ring-violet-600 bg-violet-50/50"
          : "hover:shadow-sm"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <Checkbox checked={isSelected} onClick={(e) => e.stopPropagation()} />
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
      </CardContent>
    </Card>
  );
};

const GalleryCard: React.FC<{
  gallery: SavedGallery;
  onEdit: () => void;
  onDelete: () => void;
  onAddToCanvas: () => void;
}> = ({ gallery, onEdit, onDelete, onAddToCanvas }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-violet-200">
      {/* Image Preview */}
      <div className="aspect-video bg-gradient-to-br from-violet-100 via-purple-50 to-pink-50 relative overflow-hidden group">
        <div className="absolute inset-0 grid grid-cols-2 gap-2 p-3">
          {gallery.products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
        {gallery.products.length > 4 && (
          <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
            +{gallery.products.length - 4} more
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="bg-white hover:bg-slate-100"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold line-clamp-1 text-slate-900">
              {gallery.heading}
            </CardTitle>
            {gallery.subheading && (
              <CardDescription className="mt-1.5 line-clamp-1 text-slate-600">
                {gallery.subheading}
              </CardDescription>
            )}
          </div>
          <Badge
            variant="secondary"
            className="ml-2 capitalize bg-violet-100 text-violet-700 font-semibold shrink-0"
          >
            {gallery.config.layout}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 bg-white">
        {gallery.description && (
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {gallery.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5">
            <Grid3x3 className="w-4 h-4 text-violet-600" />
            <span className="font-medium">
              {gallery.products.length} products
            </span>
          </div>
          {gallery.config.layout === "grid" && (
            <>
              <span className="text-slate-300">•</span>
              <span className="font-medium">
                {gallery.config.columns} columns
              </span>
            </>
          )}
          <span className="text-slate-300">•</span>
          <span className="font-medium capitalize">
            {gallery.config.cardStyle} style
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold"
            onClick={onAddToCanvas}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Canvas
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            className="border-slate-300 hover:bg-slate-100"
          >
            <Edit2 className="w-4 h-4 text-slate-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="border-red-200 hover:bg-red-50 text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
