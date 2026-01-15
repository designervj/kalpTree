"use client";

import React, { useState } from "react";
import { Type, AlignLeft, MoveVertical, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function TypographyPage() {
  const [activeTab, setActiveTab] = useState("headings");
  const [baseSize, setBaseSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Inter");

  // Mock settings per tab
  const [settings, setSettings] = useState({
    weight: "700",
    lineHeight: 1.2,
    letterSpacing: -0.02
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Typography</h1>
          <p className="text-muted-foreground">Define your global font stack and hierarchy scales.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Global Settings */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Primary Font Family</Label>
                        <Select value={fontFamily} onValueChange={setFontFamily}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                                <SelectItem value="Merriweather">Merriweather (Serif)</SelectItem>
                                <SelectItem value="Space Mono">Space Mono (Monospace)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Base Size (px)</Label>
                            <span className="text-xs text-muted-foreground">{baseSize}px</span>
                        </div>
                        <Slider 
                            value={[baseSize]} 
                            min={12} max={24} step={1} 
                            onValueChange={(v) => setBaseSize(v[0])} 
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Tabbed Controls */}
            <Tabs defaultValue="headings" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                    <TabsTrigger value="headings">Headings</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="buttons">Buttons</TabsTrigger>
                </TabsList>
                
                <Card>
                    <CardContent className="pt-6 space-y-5">
                        <div className="space-y-3">
                            <Label>Font Weight</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {['400', '500', '600', '700', '900'].map(w => (
                                    <Button 
                                        key={w} 
                                        variant={settings.weight === w ? "default" : "outline"} 
                                        size="sm"
                                        onClick={() => setSettings({...settings, weight: w})}
                                    >
                                        {w}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="flex items-center gap-2"><MoveVertical className="w-3 h-3"/> Line Height</Label>
                                <span className="text-xs text-muted-foreground">{settings.lineHeight}</span>
                            </div>
                            <Slider 
                                value={[settings.lineHeight]} min={0.8} max={2.0} step={0.1}
                                onValueChange={(v) => setSettings({...settings, lineHeight: v[0]})}
                            />
                        </div>
                        
                        <div className="space-y-3">
                             <div className="flex justify-between">
                                <Label className="flex items-center gap-2"><AlignLeft className="w-3 h-3"/> Letter Spacing</Label>
                                <span className="text-xs text-muted-foreground">{settings.letterSpacing}em</span>
                            </div>
                            <Slider 
                                value={[settings.letterSpacing * 100]} min={-10} max={20} step={1}
                                onValueChange={(v) => setSettings({...settings, letterSpacing: v[0]/100})}
                            />
                        </div>
                    </CardContent>
                </Card>
            </Tabs>
        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="lg:col-span-8">
            <Card className="h-full min-h-[500px] border-2 border-muted/40 bg-white/50">
                <div className="border-b p-2 flex justify-end gap-2 bg-white rounded-t-lg">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Smartphone className="w-4 h-4 text-muted-foreground" /></Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8"><Monitor className="w-4 h-4 text-primary" /></Button>
                </div>
                <CardContent className="p-10 space-y-8" style={{ fontFamily: fontFamily }}>
                    
                    {/* Headings Preview */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground font-mono">H1 / {Math.round(baseSize * 2.5)}px</span>
                            <h1 
                                style={{ 
                                    fontSize: `${baseSize * 2.5}px`, 
                                    fontWeight: activeTab === 'headings' ? settings.weight : '700',
                                    lineHeight: activeTab === 'headings' ? settings.lineHeight : 1.2,
                                    letterSpacing: activeTab === 'headings' ? `${settings.letterSpacing}em` : '-0.02em',
                                }}
                                className="text-gray-900"
                            >
                                Building the Future of Design
                            </h1>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground font-mono">H2 / {Math.round(baseSize * 2)}px</span>
                            <h2 
                                style={{ fontSize: `${baseSize * 2}px` }}
                                className="font-bold text-gray-800"
                            >
                                AI-Driven Architecture
                            </h2>
                        </div>
                    </div>

                    <Separator />

                    {/* Body Preview */}
                    <div className="space-y-2 max-w-xl">
                        <span className="text-xs text-muted-foreground font-mono">Body / {baseSize}px</span>
                        <p 
                            style={{ 
                                fontSize: `${baseSize}px`,
                                lineHeight: 1.6,
                                color: '#374151'
                            }}
                        >
                            KalpTree transforms the way architects visualize exteriors. 
                            Our advanced material rendering engine allows for real-time 
                            customization of textures, colors, and lighting, ensuring 
                            that every project matches the client's exact vision.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button style={{ fontFamily: fontFamily }}>Primary Action</Button>
                        <Button variant="outline" style={{ fontFamily: fontFamily }}>Secondary</Button>
                    </div>

                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}