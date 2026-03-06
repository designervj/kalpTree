"use client";

import React from "react";
import { Check, Palette } from "lucide-react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { themePresets, useAdminTheme } from "@/components/admin/ThemeProvider";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";


export default function ThemePage() {
  const { currentTheme, setTheme } = useAdminTheme();

  // Helper: Ensures color is always valid CSS
  const formatColor = (value: string) => {
    if (!value) return "transparent";
    if (value.includes("(") || value.startsWith("#")) {
      return value;
    }
    return `hsl(${value})`;
  };

  return (
    <div className="min-h-screen px-3 pt-1">

      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex  gap-2 items-center justify-between">
          <div>
            {/* <div className="p-2 bg-primary/10 rounded-lg">
              <Palette className="w-6 h-6" />
            </div> */}
            {/* <h1 className="text-3xl font-bold tracking-tight text-foreground">Theme Settings</h1> */}

            <BreadCrumbPage />
            <p className="text-muted-foreground text-lg max-w-2xl">
              Choose a theme that fits your brand. Changes reflect immediately.
            </p>
          </div>
          <Button>Save</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(themePresets).map((theme) => {
            const isActive = currentTheme === theme.id;

            // Extract colors for preview
            const bg = formatColor(theme.cssVars["--background"]);
            const sidebar = formatColor(theme.cssVars["--sidebar"]);
            const primary = formatColor(theme.cssVars["--primary"]);
            const cardColor = formatColor(theme.cssVars["--card"]);
            const textColor = theme.cssVars["--foreground"]; // Keep raw for HSL wrap below

            return (
              <Card
                key={theme.id}
                className={`group overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${isActive
                    ? 'border-primary ring-1 ring-primary/20 shadow-lg scale-[1.01]'
                    : 'border-border/60 hover:border-primary/50'
                  }`}
              >
                {/* Live Preview Area */}
                <div className="h-44 relative border-b w-full overflow-hidden">
                  <div className="absolute inset-0 flex">

                    {/* Sidebar Preview */}
                    <div
                      className="w-[28%] h-full border-r border-border/10 flex flex-col gap-3 p-3 transition-colors"
                      style={{ backgroundColor: sidebar }}
                    >
                      <div className="w-8 h-8 rounded-md mb-2 opacity-80" style={{ backgroundColor: primary }} />
                      <div className="w-full h-2 rounded-full opacity-20 bg-current" />
                      <div className="w-3/4 h-2 rounded-full opacity-20 bg-current" />
                      <div className="w-1/2 h-2 rounded-full opacity-20 bg-current" />
                    </div>

                    {/* Content Preview */}
                    <div
                      className="flex-1 h-full p-4 flex flex-col gap-3 transition-colors"
                      style={{
                        backgroundColor: bg,
                        color: `hsl(${textColor})` // CRITICAL FIX: Enforce theme text color
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="w-24 h-3 rounded opacity-10 bg-current" />
                        <div className="w-6 h-6 rounded-full opacity-10 bg-current" />
                      </div>

                      <div
                        className="w-full flex-1 rounded-lg border shadow-sm p-3 space-y-3"
                        style={{
                          backgroundColor: cardColor,
                          borderColor: 'currentColor',
                          borderWidth: '1px',

                        }}
                      >
                        <div
                          className="w-20 h-6 rounded text-[10px] font-medium flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: primary }}
                        >
                          Active
                        </div>
                        <div className="w-full h-2 rounded opacity-10 bg-current" />
                        <div className="w-4/5 h-2 rounded opacity-10 bg-current" />
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3 pt-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">{theme.name}</CardTitle>
                    {isActive && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-2.5 py-0.5">
                        <Check className="w-3.5 h-3.5" />
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardFooter className="pb-5">
                  <Button
                    variant={isActive ? "outline" : "default"}
                    className={`w-full font-medium ${isActive ? 'bg-background text-muted-foreground hover:bg-muted' : ''}`}
                    disabled={isActive}
                    onClick={() => setTheme(theme.id)}
                  >
                    {isActive ? "Currently Applied" : "Apply Theme"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}