import React from 'react'
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProductGallerySettings from './ProductGallerySettings';
import ProductGalleryPreview from './ProductGalleryPreview';
import { SavedGallery, GalleryConfig } from './ProductGalleryPage';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingGallery: SavedGallery | null;
  modalStep: number;
  setModalStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  selectedProducts: any[];
  toggleProductSelection: (product: any) => void;
  isProductSelected: (productId: string) => boolean;
  viewMode: string;
  setViewMode: React.Dispatch<React.SetStateAction<"grid" | "list">>;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  loading: boolean;
  filteredProducts: any[];
  ProductCard: React.ComponentType<any>;
  ProductListItem: React.ComponentType<any>;
  galleryConfig: GalleryConfig;
  setGalleryConfig: (config: GalleryConfig) => void;
  galleryHeading: string;
  setGalleryHeading: (heading: string) => void;
  gallerySubheading: string;
  setGallerySubheading: (subheading: string) => void;
  galleryDescription: string;
  setGalleryDescription: (description: string) => void;
  removeFromSelected: (productId: string) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  resetModal: () => void;
  saveGallery: () => void;
}

const SelectGalleryModal = ({
  isModalOpen,
  setIsModalOpen,
  editingGallery,
  modalStep,
  setModalStep,
  selectedProducts,
  toggleProductSelection,
  isProductSelected,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  loading,
  filteredProducts,
  ProductCard,
  ProductListItem,
  galleryConfig,
  setGalleryConfig,
  galleryHeading,
  setGalleryHeading,
  gallerySubheading,
  setGallerySubheading,
  galleryDescription,
  setGalleryDescription,
  removeFromSelected,
  goToPreviousStep,
  goToNextStep,
  resetModal,
  saveGallery
}: Props) => {


  
  return (
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
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${modalStep >= 1
                ? "bg-violet-600 text-white"
                : "bg-slate-200 text-slate-600"
                }`}
            >
              1
            </div>
            <span
              className={`text-sm font-medium ${modalStep >= 1 ? "text-slate-900" : "text-slate-400"
                }`}
            >
              Products
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${modalStep >= 2
                ? "bg-violet-600 text-white"
                : "bg-slate-200 text-slate-600"
                }`}
            >
              2
            </div>
            <span
              className={`text-sm font-medium ${modalStep >= 2 ? "text-slate-900" : "text-slate-400"
                }`}
            >
              Style
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${modalStep >= 3
                ? "bg-violet-600 text-white"
                : "bg-slate-200 text-slate-600"
                }`}
            >
              3
            </div>
            <span
              className={`text-sm font-medium ${modalStep >= 3 ? "text-slate-900" : "text-slate-400"
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
  )
}

export default SelectGalleryModal