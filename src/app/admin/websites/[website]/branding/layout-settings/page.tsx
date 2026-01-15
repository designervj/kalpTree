"use client";

import React, { useState } from "react";
import { LayoutGrid, Maximize, MoveHorizontal, Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LayoutSettingsPage() {
  const [containerWidth, setContainerWidth] = useState(1280);
  const [gridColumns, setGridColumns] = useState("12");
  const [gapSize, setGapSize] = useState(24);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Layout Settings</h1>
          <p className="text-muted-foreground">Configure the structural grid and spacing of your website.</p>
        </div>
        <Button>Save Settings</Button>
      </div>

      <Tabs defaultValue="container" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="container">Container Width</TabsTrigger>
          <TabsTrigger value="grid">Grid System</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
        </TabsList>

        {/* --- CONTAINER TAB --- */}
        <TabsContent value="container">
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Maximize className="w-5 h-5"/> Max Container Width</CardTitle>
               <CardDescription>Controls the maximum width of your content on large screens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Width (px)</Label>
                        <span className="font-mono text-sm">{containerWidth}px</span>
                    </div>
                    <Slider 
                        value={[containerWidth]} 
                        min={1024} max={1920} step={10} 
                        onValueChange={(v) => setContainerWidth(v[0])} 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Laptop (1024px)</span>
                        <span>Wide (1920px)</span>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="bg-slate-100 rounded-lg h-48 w-full flex items-center justify-center relative overflow-hidden border border-dashed border-slate-300">
                    <div className="absolute inset-x-0 top-0 h-6 bg-white border-b flex items-center px-4 space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-400"/>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"/>
                        <div className="w-2 h-2 rounded-full bg-green-400"/>
                    </div>
                    
                    {/* The Resizable Container */}
                    <div 
                        className="bg-white border-x border-primary/30 h-full shadow-lg relative transition-all duration-300 flex flex-col items-center justify-center"
                        style={{ width: `${(containerWidth / 1920) * 100}%`, minWidth: '200px' }}
                    >
                        <div className="w-px h-full bg-primary/20 absolute left-1/2 -translate-x-1/2" />
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded shadow-sm z-10">
                            {containerWidth}px
                        </span>
                        <div className="absolute bottom-2 w-full flex justify-between px-2 text-[10px] text-primary/50">
                            <MoveHorizontal className="w-3 h-3"/>
                            <MoveHorizontal className="w-3 h-3"/>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- GRID TAB --- */}
        <TabsContent value="grid">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LayoutGrid className="w-5 h-5"/> Grid Columns & Gaps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <RadioGroup defaultValue="12" onValueChange={setGridColumns} className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 border p-4 rounded-lg has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer">
                            <RadioGroupItem value="12" id="r12" />
                            <Label htmlFor="r12" className="cursor-pointer">12 Columns (Standard)</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-lg has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer">
                            <RadioGroupItem value="16" id="r16" />
                            <Label htmlFor="r16" className="cursor-pointer">16 Columns (Complex)</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-lg has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer">
                            <RadioGroupItem value="5" id="r5" />
                            <Label htmlFor="r5" className="cursor-pointer">5 Columns (Dashboard)</Label>
                        </div>
                    </RadioGroup>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Gap Size (px)</Label>
                            <span className="font-mono text-sm">{gapSize}px</span>
                        </div>
                        <Slider 
                            value={[gapSize]} min={0} max={64} step={4} 
                            onValueChange={(v) => setGapSize(v[0])} 
                        />
                    </div>

                    {/* Grid Visualizer */}
                    <div className="bg-white border rounded-lg h-32 p-4 flex gap-x-[var(--gap)]" style={{ '--gap': `${gapSize/4}px` } as any}>
                        {Array.from({ length: parseInt(gridColumns) }).map((_, i) => (
                            <div key={i} className="flex-1 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center text-[10px] text-primary/50">
                                {i+1}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- SPACING TAB --- */}
        <TabsContent value="spacing">
            <Card>
                <CardHeader>
                    <CardTitle>Global Spacing Scale</CardTitle>
                    <CardDescription>Multipliers for margins and paddings.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex items-end gap-2 h-40 border-b pb-4">
                        {[4, 8, 12, 16, 24, 32, 48, 64].map((space) => (
                            <div key={space} className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div 
                                    className="bg-blue-500 rounded-t-sm w-8 transition-all group-hover:bg-blue-600" 
                                    style={{ height: `${space * 2}px` }} 
                                />
                                <span className="text-xs text-muted-foreground">{space}</span>
                            </div>
                        ))}
                     </div>
                     <p className="text-sm text-muted-foreground pt-4">Click bars to edit individual spacing tokens (Advanced).</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}