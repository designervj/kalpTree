"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  Trash2, 
  Image as ImageIcon, 
  Moon, 
  Sun, 
  Monitor,
  CheckCircle2,
  AlertCircle,
  Globe
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Types & Scaffold ---
type LogoVariant = {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
};

type LogoState = {
  primary: LogoVariant;
  dark: LogoVariant;
  light: LogoVariant;
  favicon: LogoVariant;
};

const initialLogos: LogoState = {
  primary: { src: "/logos/KalpTree-primary.svg", alt: "KalpTree Primary Logo" },
  dark: { src: "/logos/KalpTree-white.svg", alt: "KalpTree Dark Mode Logo" },
  light: { src: "/logos/KalpTree-black.svg", alt: "KalpTree Light Mode Logo" },
  favicon: { src: "/logos/favicon.ico", alt: "Favicon" },
};

// --- Helper Components ---
const ImageUploadZone = ({ 
  label, 
  preview, 
  onUpload, 
  onDelete, 
  helperText 
}: { 
  label: string; 
  preview: string | null; 
  onUpload: () => void; 
  onDelete: () => void; 
  helperText: string;
}) => (
  <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center transition-colors hover:bg-muted/30">
    {preview ? (
      <div className="relative group flex flex-col items-center">
        <div className="relative p-4 bg-checkerboard rounded-lg mb-4 border shadow-sm">
          {/* Checkerboard background for transparency simulation */}
          <img src={preview} alt="Preview" className="h-24 object-contain max-w-full" />
        </div>
        <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onUpload}>Change</Button>
            <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center space-y-3 py-6">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
            <UploadCloud className="w-6 h-6" />
        </div>
        <div className="space-y-1">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{helperText}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onUpload}>Select File</Button>
      </div>
    )}
  </div>
);

export default function LogoSettingsPage() {
  const [activeTab, setActiveTab] = useState("primary");
  const [logos, setLogos] = useState<LogoState>(initialLogos);

  // Mock handlers
  const handleUpload = (key: keyof LogoState) => {
    // Simulate upload
    setLogos(prev => ({ ...prev, [key]: { ...prev[key], src: "/placeholder-logo.png" } }));
  };
  const handleDelete = (key: keyof LogoState) => {
    setLogos(prev => ({ ...prev, [key]: { ...prev[key], src: null } }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Logo Settings</h1>
          <p className="text-muted-foreground">Manage your brand marks across different themes and devices.</p>
        </div>
      </div>

      <Tabs defaultValue="primary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[500px] mb-6">
          <TabsTrigger value="primary">Primary</TabsTrigger>
          <TabsTrigger value="theme">Dark / Light</TabsTrigger>
          <TabsTrigger value="favicon">Favicon</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {/* --- PRIMARY TAB --- */}
          {activeTab === "primary" && (
            <motion.div
              key="primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Primary Logo</CardTitle>
                  <CardDescription>This is your main logo used in the header, invoices, and emails.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUploadZone 
                    label="Upload Primary Logo"
                    helperText="SVG, PNG, or JPG. Max 2MB. Recommended height: 40px."
                    preview={logos.primary.src}
                    onUpload={() => handleUpload("primary")}
                    onDelete={() => handleDelete("primary")}
                  />
                  
                  <div className="grid gap-4 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label>Alt Text (SEO)</Label>
                        <Input value={logos.primary.alt} onChange={(e) => {
                            // handle alt change
                        }} />
                     </div>
                     <div className="space-y-2">
                        <Label>Link Destination</Label>
                        <Input defaultValue="/" />
                     </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* --- DARK / LIGHT TAB --- */}
          {activeTab === "theme" && (
             <motion.div
                key="theme"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sun className="w-4 h-4" /> Light Mode</CardTitle>
                        <CardDescription>Displayed on light backgrounds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUploadZone 
                            label="Upload Dark-colored Logo"
                            helperText="Best for white backgrounds."
                            preview={logos.light.src}
                            onUpload={() => handleUpload("light")}
                            onDelete={() => handleDelete("light")}
                        />
                    </CardContent>
                </Card>
                
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white"><Moon className="w-4 h-4" /> Dark Mode</CardTitle>
                        <CardDescription className="text-slate-400">Displayed on dark backgrounds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUploadZone 
                            label="Upload Light-colored Logo"
                            helperText="Best for dark headers/footers."
                            preview={logos.dark.src}
                            onUpload={() => handleUpload("dark")}
                            onDelete={() => handleDelete("dark")}
                        />
                    </CardContent>
                </Card>

                <Alert className="col-span-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Inheritance</AlertTitle>
                    <AlertDescription>
                        If no specific dark/light logos are uploaded, the <strong>Primary Logo</strong> will be used for all themes.
                    </AlertDescription>
                </Alert>
              </motion.div>
          )}

          {/* --- FAVICON TAB --- */}
          {activeTab === "favicon" && (
             <motion.div
                key="favicon"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Browser Icon (Favicon)</CardTitle>
                    <CardDescription>The small icon shown in browser tabs and bookmarks bar.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <ImageUploadZone 
                            label="Upload Favicon"
                            helperText="ICO, PNG, or SVG. 32x32px or 64x64px."
                            preview={logos.favicon.src}
                            onUpload={() => handleUpload("favicon")}
                            onDelete={() => handleDelete("favicon")}
                        />
                    </div>

                    {/* Preview Visualization */}
                    <div className="w-full md:w-[350px] space-y-3">
                        <Label>Browser Preview</Label>
                        <div className="bg-muted rounded-t-lg p-2 border border-b-0 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="bg-white rounded-md flex-1 mx-2 py-1 px-3 text-xs flex items-center gap-2 shadow-sm max-w-[200px]">
                                {logos.favicon.src ? (
                                    <img src={logos.favicon.src} className="w-4 h-4 object-contain" />
                                ) : (
                                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                                <span className="truncate">Home - KalpTree AI</span>
                            </div>
                        </div>
                        <div className="bg-background border rounded-b-lg h-32 flex items-center justify-center text-muted-foreground text-sm">
                            Page Content...
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
          )}
        </AnimatePresence>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
         <Button variant="outline">Reset to Defaults</Button>
         <Button className="gap-2"><CheckCircle2 className="w-4 h-4" /> Save Changes</Button>
      </div>
    </div>
  );
}