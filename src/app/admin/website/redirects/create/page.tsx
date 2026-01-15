"use client";

import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import React, { useState } from "react";
import { ArrowRight, Link2, Save } from "lucide-react";

// shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const page = () => {
  const [fromUrl, setFromUrl] = useState("");
  const [toUrl, setToUrl] = useState("");
  const [type, setType] = useState<"301" | "302">("301");

  const preview =
    fromUrl?.trim() && toUrl?.trim()
      ? `${fromUrl.trim()}  →  ${toUrl.trim()}`
      : "Add both URLs to see preview";

  return (
    <div className="space-y-6">
      <BreadCrumbPage />

      {/* Page header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Redirects</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage URL redirects (301/302) for your website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full px-3 bg-white">
            SEO
          </Badge>
          <Badge className="rounded-full px-3">
            URL Management
          </Badge>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
                    <Link2 className="h-5 w-5" />
                  </span>
                  Create New Redirect
                </CardTitle>
                <CardDescription className="mt-1">
                  Define a source path and where it should redirect.
                </CardDescription>
              </div>

              <Badge
                className="rounded-full px-3 py-1"
                variant={type === "301" ? "default" : "secondary"}
              >
                {type === "301" ? "301 Permanent" : "302 Temporary"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Big visual row */}
            <div className="rounded-md border bg-background p-4 md:p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-end">
                {/* From */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fromUrl" className="text-sm font-medium">
                    From URL
                  </Label>
                  <Input
                    id="fromUrl"
                    value={fromUrl}
                    onChange={(e) => setFromUrl(e.target.value)}
                    placeholder="/from-url"
                    className="h-11 bg-white"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: <span className="font-medium">/old-page</span>
                  </p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center pb-3 text-muted-foreground">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>

                {/* To */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="toUrl" className="text-sm font-medium">
                    To URL
                  </Label>
                  <Input
                    id="toUrl"
                    value={toUrl}
                    onChange={(e) => setToUrl(e.target.value)}
                    placeholder="/to-url"
                    className="h-11 bg-white"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: <span className="font-medium">/new-page</span>
                  </p>
                </div>
              </div>

              <Separator className="my-5" />

              {/* Type + actions */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Redirect type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as "301" | "302")}>
                    <SelectTrigger className="h-11 w-full md:w-[220px] bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="301">301 Permanent</SelectItem>
                      <SelectItem value="302">302 Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    301 is best for SEO when the move is permanent.
                  </p>
                </div>

                <div className="flex gap-2 md:justify-end">
                  <Button variant="outline" className="h-11 ">
                    Reset
                  </Button>
                  <Button className="h-11 gap-2">
                    <Save className="h-4 w-4" />
                    Save Redirect
                  </Button>
                </div>
              </div>
            </div>

            {/* Extra info row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Tip</CardTitle>
                  <CardDescription className="text-xs">
                    Keep paths clean (no full domain needed).
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Use only paths like <span className="font-medium">/about</span>, not
                  <span className="font-medium"> https://site.com/about</span>.
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Validation</CardTitle>
                  <CardDescription className="text-xs">
                    Avoid redirect loops and duplicates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Don’t redirect <span className="font-medium">/a → /b</span> and
                  <span className="font-medium"> /b → /a</span>.
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Right: preview panel */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Preview</CardTitle>
            <CardDescription>How this redirect will look.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground mb-2">Redirect</div>
              <div className="text-sm font-medium break-words">{preview}</div>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Type</div>
                <Badge variant={type === "301" ? "default" : "secondary"}>
                  {type}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {type === "301"
                  ? "Search engines will transfer most ranking signals to the new URL."
                  : "Use for temporary maintenance or short-term campaigns."}
              </p>
            </div>

            <div className="rounded-md border p-4">
              <div className="text-sm font-semibold">Status</div>
              <p className="mt-2 text-xs text-muted-foreground">
                {fromUrl.trim() && toUrl.trim()
                  ? "Ready to save."
                  : "Fill both URLs to enable saving."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
