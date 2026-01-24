import React from 'react'
import { StyleState } from '../../../../types/editor';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '../color-picker/color-picker';
import { Input } from '@/components/ui/input';

type SectionProps = {
  styles: StyleState;
  onStyleChange: (property: string, value: string) => void;
}
const    GlobalStylesSection = ({ styles, onStyleChange }: SectionProps) => {
  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-400 mb-2">
        Define global CSS variables for your page theme
      </div>

      {/* Primary Color */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Primary Color</Label>
        <div className="flex items-center gap-2">
          <ColorPicker
            color="#007bff"
            onChange={(color) => onStyleChange("--primary-color", color)}
          />
          <Input
            defaultValue="#007bff"
            onChange={(e) => onStyleChange("--primary-color", e.target.value)}
            className="flex-1 text-xs h-7 bg-slate-800 border-slate-700"
            placeholder="#007bff"
          />
        </div>
      </div>

      {/* Secondary Color */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Secondary Color</Label>
        <div className="flex items-center gap-2">
          <ColorPicker
            color="#6c757d"
            onChange={(color) => onStyleChange("--secondary-color", color)}
          />
          <Input
            defaultValue="#6c757d"
            onChange={(e) => onStyleChange("--secondary-color", e.target.value)}
            className="flex-1 text-xs h-7 bg-slate-800 border-slate-700"
            placeholder="#6c757d"
          />
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Font Family</Label>
        <Input
          defaultValue="'Inter', sans-serif"
          onChange={(e) => onStyleChange("--font-family", e.target.value)}
          className="text-xs h-7 bg-slate-800 border-slate-700"
          placeholder="'Inter', sans-serif"
        />
      </div>

      {/* Body Styles Section */}
      <div className="space-y-1.5 pt-2">
        <Label className="text-xs font-semibold text-slate-300">Body styles</Label>

        {/* Body Background */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Body Background</Label>
          <div className="flex items-center gap-2">
            <ColorPicker
              color="rgba(240, 237, 255, 1)"
              onChange={(color) => onStyleChange("--body-background", color)}
            />
            <Input
              defaultValue="rgba(240, 237, 255, 1)"
              onChange={(e) => onStyleChange("--body-background", e.target.value)}
              className="flex-1 text-xs h-7 bg-slate-800 border-slate-700"
              placeholder="rgba(240, 237, 255, 1)"
            />
          </div>
        </div>

        {/* Body Color */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Body Color</Label>
          <div className="flex items-center gap-2">
            <ColorPicker
              color="#484c51"
              onChange={(color) => onStyleChange("--body-color", color)}
            />
            <Input
              defaultValue="#484c51"
              onChange={(e) => onStyleChange("--body-color", e.target.value)}
              className="flex-1 text-xs h-7 bg-slate-800 border-slate-700"
              placeholder="#484c51"
            />
          </div>
        </div>
      </div>

      {/* H1 Section */}
      <div className="space-y-1.5 pt-2">
        <Label className="text-xs font-semibold text-slate-300">H1</Label>

        {/* H1 Color */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">H1 Color</Label>
          <div className="flex items-center gap-2">
            <ColorPicker
              color="rgba(73, 49, 230, 1)"
              onChange={(color) => onStyleChange("--h1-color", color)}
            />
            <Input
              defaultValue="rgba(73, 49, 230, 1)"
              onChange={(e) => onStyleChange("--h1-color", e.target.value)}
              className="flex-1 text-xs h-7 bg-slate-800 border-slate-700"
              placeholder="rgba(73, 49, 230, 1)"
            />
          </div>
        </div>

        {/* H1 Size */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">H1 Size</Label>
          <div className="flex items-center gap-2">
            <Input
              defaultValue="2"
              onChange={(e) => onStyleChange("--h1-size", `${e.target.value}rem`)}
              className="flex-1 text-xs h-7 bg-slate-800 border-slate-700"
              type="number"
              min="0"
              step="0.1"
              placeholder="2"
            />
            <span className="text-xs text-slate-400 w-8">rem</span>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="space-y-1.5 pt-2">
        <Label className="text-xs font-semibold text-slate-300">Buttons</Label>
        <div className="text-[10px] text-slate-500 p-2 bg-slate-800/50 rounded">
          Button styles can be configured here
        </div>
      </div>

      <div className="text-[10px] text-slate-500 mt-4 p-2 bg-slate-800/50 rounded">
        💡 Use with <code className="text-blue-400">var(--primary-color)</code> in component styles
      </div>
    </div>
  );
}

export default GlobalStylesSection
