"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Copy, 
  RefreshCcw, 
  Check, 
  Palette,
  Layout,
  MousePointer2,
  Save,
  MoreHorizontal
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// --- Mock Data ---
const savedPalettes = [
  { id: 1, name: "Ocean Breeze", colors: { primary: "#0ea5e9", secondary: "#e0f2fe", accent: "#f59e0b" } },
  { id: 2, name: "Midnight Pro", colors: { primary: "#0f172a", secondary: "#1e293b", accent: "#6366f1" } },
  { id: 3, name: "Forest Calm", colors: { primary: "#059669", secondary: "#d1fae5", accent: "#b45309" } },
];

export default function ColorsPage() {
  const [activeTab, setActiveTab] = useState("primary");
  const [colorMode, setColorMode] = useState<"solid" | "gradient">("solid");
  
  // State for the currently edited color
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  const [gradientStart, setGradientStart] = useState("#3b82f6");
  const [gradientEnd, setGradientEnd] = useState("#9333ea");
  const [gradientDegree, setGradientDegree] = useState(90);

  const getBackgroundStyle = () => {
    return colorMode === "solid" 
      ? { backgroundColor: currentColor }
      : { backgroundImage: `linear-gradient(${gradientDegree}deg, ${gradientStart}, ${gradientEnd})` };
  };

  const ColorEditor = ({ label }: { label: string }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{label} Color</Label>
        <div className="flex items-center gap-2">
            <Label htmlFor="mode-switch" className="text-xs text-muted-foreground">Solid</Label>
            <Switch 
                id="mode-switch" 
                checked={colorMode === "gradient"}
                onCheckedChange={(c) => setColorMode(c ? "gradient" : "solid")}
            />
            <Label htmlFor="mode-switch" className="text-xs text-muted-foreground">Gradient</Label>
        </div>
      </div>

      {/* Visual Color Picker Area */}
      <div className="p-6 border rounded-xl bg-muted/20 space-y-6">
        <div className="flex gap-6">
            {/* Color Input(s) */}
            <div className="flex-1 space-y-4">
                {colorMode === "solid" ? (
                    <div className="space-y-3">
                        <Label>Hex Code</Label>
                        <div className="flex gap-2">
                            <div 
                                className="w-10 h-10 rounded-md border shadow-sm shrink-0" 
                                style={{ backgroundColor: currentColor }} 
                            />
                            <Input 
                                value={currentColor} 
                                onChange={(e) => setCurrentColor(e.target.value)} 
                                className="font-mono"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Start Color</Label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-md border shrink-0" style={{ backgroundColor: gradientStart }} />
                                <Input value={gradientStart} onChange={(e) => setGradientStart(e.target.value)} className="font-mono h-8" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>End Color</Label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-md border shrink-0" style={{ backgroundColor: gradientEnd }} />
                                <Input value={gradientEnd} onChange={(e) => setGradientEnd(e.target.value)} className="font-mono h-8" />
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-xs">
                                <span>Angle</span>
                                <span>{gradientDegree}°</span>
                            </div>
                            <Slider 
                                value={[gradientDegree]} 
                                max={360} 
                                step={1} 
                                onValueChange={(v) => setGradientDegree(v[0])} 
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Live UI Preview Card */}
            <div className="w-[280px] bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="h-4 bg-gray-100 border-b flex items-center gap-1 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"/>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"/>
                </div>
                <div className="p-4 flex flex-col items-center justify-center flex-1 gap-3">
                    <div className="text-xs text-muted-foreground font-medium">UI Preview</div>
                    
                    {/* Primary Button Preview */}
                    <button 
                        className="px-4 py-2 rounded-md text-white text-sm font-medium shadow-md transition-transform hover:scale-105"
                        style={getBackgroundStyle()}
                    >
                        Call to Action
                    </button>

                    {/* Badge / Tag Preview */}
                    <div 
                        className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-opacity-10 border"
                        style={{ 
                            borderColor: colorMode === 'solid' ? currentColor : gradientStart,
                            color: colorMode === 'solid' ? currentColor : gradientStart,
                            backgroundColor: '#fff' 
                        }}
                    >
                        Active Tag
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Colors & Palettes</h1>
            <p className="text-muted-foreground">Manage brand colors, gradients, and preset schemes.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm"><RefreshCcw className="w-3.5 h-3.5 mr-2" /> Reset</Button>
            <Button size="sm"><Save className="w-3.5 h-3.5 mr-2" /> Save Palette</Button>
        </div>
      </div>

      <Tabs defaultValue="primary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
          <TabsTrigger value="primary">Primary</TabsTrigger>
          <TabsTrigger value="secondary">Secondary</TabsTrigger>
          <TabsTrigger value="accent">Accent</TabsTrigger>
          <TabsTrigger value="saved">Saved Palettes</TabsTrigger>
        </TabsList>

        <Card className="min-h-[400px]">
            <CardContent className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === "saved" ? (
                        <motion.div 
                            key="saved"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {/* Create New Card */}
                            <button className="h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 transition-colors">
                                <Plus className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm font-medium">Create New Palette</span>
                            </button>

                            {savedPalettes.map(palette => (
                                <div key={palette.id} className="group relative border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="secondary" size="icon" className="h-6 w-6"><MoreHorizontal className="w-3 h-3" /></Button>
                                    </div>
                                    <div className="h-28 flex">
                                        <div className="flex-1" style={{ backgroundColor: palette.colors.primary }} />
                                        <div className="flex-1" style={{ backgroundColor: palette.colors.secondary }} />
                                        <div className="flex-1" style={{ backgroundColor: palette.colors.accent }} />
                                    </div>
                                    <div className="p-3 bg-white">
                                        <div className="font-medium text-sm">{palette.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 flex gap-2">
                                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400"/> Used in Theme A</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="sm" variant="default" className="h-7 text-xs">Apply</Button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="editor"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        >
                            <ColorEditor label={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}