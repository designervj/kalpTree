"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryConfig } from "./ProductGalleryPage";
import { Grid3x3, LayoutGrid, Columns3 } from "lucide-react";
import { handleBuildComplete } from "next/dist/build/adapter/build-complete";


const configOptions = [
  {
    layout: "grid",
     columns: 3, 
    gap: 20, 
    showBadge: true, 
    showRating: true,
    showPrice: true,
    showAddToCart: true,
    hoverEffect: "lift", 
      cardStyle: "default", 
       showDescription: false,  
    
  },
  {
    layout: "carousel",
    columns: 1, 
    gap: 0, 
    showBadge: true, 
    showRating: true,
    showPrice: true,
    showAddToCart: true,
    hoverEffect: "none", 
      cardStyle: "elevated", 
       showDescription: false,  
    
  },
  {
    layout: "masonry",
    columns: 2, 
    gap: 20, 
    showBadge: true, 
    showRating: true,
    showPrice: true,
    showAddToCart: true,
    hoverEffect: "lift", 
      cardStyle: "default", 
       showDescription: false,  
    
  },
];
interface ProductGallerySettingsProps {
  config: GalleryConfig;
  onConfigChange: (config: GalleryConfig) => void;
}

const ProductGallerySettings: React.FC<ProductGallerySettingsProps> = ({
  config,
  onConfigChange,
}) => {
  const updateConfig = (updates: Partial<GalleryConfig>) => {
    onConfigChange({ ...config, ...updates });
  };


  const handleLayoutType = (value: string) => {
    updateConfig({ layout: value as GalleryConfig["layout"] });
  };

  return (
    <div className="space-y-6">
      {/* Layout Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Layout</CardTitle>
          <CardDescription>Choose how products are displayed</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.layout}
            // onValueChange={(value) =>
            //   updateConfig({ layout: value as GalleryConfig["layout"] })
            // }


            onValueChange={(value)=>{handleLayoutType(value)}}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grid" id="layout-grid" />
              <Label htmlFor="layout-grid" className="flex items-center gap-2 cursor-pointer">
                <Grid3x3 className="w-4 h-4" />
                Grid Layout
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="carousel" id="layout-carousel" />
              <Label htmlFor="layout-carousel" className="flex items-center gap-2 cursor-pointer">
                <Columns3 className="w-4 h-4" />
                Carousel
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="masonry" id="layout-masonry" />
              <Label htmlFor="layout-masonry" className="flex items-center gap-2 cursor-pointer">
                <LayoutGrid className="w-4 h-4" />
                Masonry
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Columns */}
      {config.layout === "grid" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Columns</CardTitle>
            <CardDescription>Number of products per row</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{config.columns} columns</span>
            </div>
            <Slider
              value={[config.columns]}
              onValueChange={([value]) => updateConfig({ columns: value })}
              min={2}
              max={6}
              step={1}
              className="w-full"
            />
          </CardContent>
        </Card>
      )}

      {/* Gap/Spacing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spacing</CardTitle>
          <CardDescription>Gap between products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">{config.gap}px</span>
          </div>
          <Slider
            value={[config.gap]}
            onValueChange={([value]) => updateConfig({ gap: value })}
            min={0}
            max={60}
            step={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Card Style */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Card Style</CardTitle>
          <CardDescription>Visual appearance of product cards</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={config.cardStyle}
            onValueChange={(value) =>
              updateConfig({ cardStyle: value as GalleryConfig["cardStyle"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="elevated">Elevated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Hover Effect */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hover Effect</CardTitle>
          <CardDescription>Animation on product hover</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={config.hoverEffect}
            onValueChange={(value) =>
              updateConfig({ hoverEffect: value as GalleryConfig["hoverEffect"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lift">Lift</SelectItem>
              <SelectItem value="scale">Scale</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display Options</CardTitle>
          <CardDescription>Toggle product information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-badge" className="cursor-pointer">
              Show Badge
            </Label>
            <Switch
              id="show-badge"
              checked={config.showBadge}
              onCheckedChange={(checked) => updateConfig({ showBadge: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-price" className="cursor-pointer">
              Show Price
            </Label>
            <Switch
              id="show-price"
              checked={config.showPrice}
              onCheckedChange={(checked) => updateConfig({ showPrice: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-description" className="cursor-pointer">
              Show Description
            </Label>
            <Switch
              id="show-description"
              checked={config.showDescription}
              onCheckedChange={(checked) => updateConfig({ showDescription: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductGallerySettings;