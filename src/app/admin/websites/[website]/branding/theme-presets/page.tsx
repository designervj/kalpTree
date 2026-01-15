"use client";

import React from "react";
import { Check, Download, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const themes = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean lines, ample whitespace, and high contrast typography. Perfect for architecture firms.",
    colors: ["#18181b", "#ffffff", "#e4e4e7"],
    font: "Inter",
    active: true
  },
  {
    id: "vibrant-creative",
    name: "Vibrant Creative",
    description: "Bold primary colors and gradients to showcase innovation and energy.",
    colors: ["#7c3aed", "#f472b6", "#fff1f2"],
    font: "Poppins",
    active: false
  },
  {
    id: "corporate-trust",
    name: "Corporate Trust",
    description: "Reliable blue tones and serif headings for a professional, established look.",
    colors: ["#1e3a8a", "#1e40af", "#eff6ff"],
    font: "Merriweather",
    active: false
  },
  {
    id: "dark-mode-pro",
    name: "Dark Future",
    description: "A fully dark-themed preset with neon accents for high-tech SaaS vibes.",
    colors: ["#09090b", "#27272a", "#22c55e"],
    font: "Space Grotesk",
    active: false
  },
];

export default function ThemePresetsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Theme Presets</h1>
        <p className="text-muted-foreground">Instantly apply a cohesive look to your entire workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
            <Card key={theme.id} className={`overflow-hidden transition-all hover:border-primary/50 ${theme.active ? 'ring-2 ring-primary border-primary' : ''}`}>
                {/* Theme Preview Image Area */}
                <div className="h-32 bg-slate-100 relative group">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                        <Button variant="secondary" size="sm">Preview Demo</Button>
                    </div>
                    {/* Abstract Color Representation */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 flex">
                        <div className="flex-1" style={{ backgroundColor: theme.colors[0] }} />
                        <div className="flex-1" style={{ backgroundColor: theme.colors[1] }} />
                        <div className="flex-1" style={{ backgroundColor: theme.colors[2] }} />
                    </div>
                </div>

                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{theme.name}</CardTitle>
                        {theme.active && <Badge variant="default" className="gap-1"><Check className="w-3 h-3" /> Active</Badge>}
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                        {theme.description}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                    <div className="flex items-center text-xs text-muted-foreground gap-4">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-black">Font:</span> {theme.font}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-black">Radius:</span> 8px
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    {theme.active ? (
                        <Button variant="outline" className="w-full" disabled>Applied</Button>
                    ) : (
                        <Button className="w-full">Apply Theme</Button>
                    )}
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}