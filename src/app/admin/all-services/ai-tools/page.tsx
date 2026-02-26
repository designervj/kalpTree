"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  Sparkles,
  Image as ImageIcon,
  Scissors,
  Maximize2,
  Eye,
  QrCode,
  PenTool,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Tool = {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  href?: string;
};

const TOOLS: Tool[] = [
  {
    id: "image-generator",
    title: "Image generator",
    desc: "Create unique graphics tailored to the needs of your brand.",
    icon: ImageIcon,
    href: "/services/ai-tools/image-generator",
  },
  {
    id: "bg-remover",
    title: "Background remover",
    desc: "Remove the background of any image to get that professional look.",
    icon: Scissors,
    href: "/services/ai-tools/background-remover",
  },
  {
    id: "upscaler",
    title: "Image upscaler",
    desc: "Upload an image that you want to enhance.",
    icon: Maximize2,
    href: "/services/ai-tools/image-upscaler",
  },
  {
    id: "heatmap",
    title: "Attention heatmap",
    desc: "Visualize user behavior to optimize engagement and increase conversions.",
    icon: Eye,
    href: "/services/ai-tools/attention-heatmap",
  },
  {
    id: "qr",
    title: "QR generator",
    desc: "Generate QR codes instantly from URL, text, and more.",
    icon: QrCode,
    href: "/services/ai-tools/qr-generator",
  },
  {
    id: "content",
    title: "Content generator",
    desc: "Create blog posts, email, or social media content with AI.",
    icon: PenTool,
    href: "/services/ai-tools/content-generator",
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Card className="rounded-md border bg-white shadow-sm">
      <CardContent className="p-7">
        <div className="flex flex-col gap-4">
          {/* icon square */}
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary">
            <Icon className="h-6 w-6 text-white" />
          </div>

          <div className="space-y-2">
            <div className="text-lg font-semibold text-slate-900">
              {tool.title}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{tool.desc}</p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              className={cn(
                "h-10 rounded-md px-6 font-semibold",
                "text-black border-slate-200 hover:bg-primary hover:text-white"
              )}
              asChild
            >
              <Link href={tool.href ?? "#"}>Try now</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AIToolsHostingerStylePage() {
  // demo credits (replace with API)
  const credits = 0;

  return (
    <div className="min-h-screen bg-transparent ">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        {/* Top bar: title + breadcrumb + credits pill */}
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <h1 className="text-2xl font-semibold text-slate-900">AI tools</h1>
          <span className="text-slate-300">|</span>
          <Home className="h-4 w-4" />
          <span>–</span>
          <span className="text-slate-700 font-medium">AI tools</span>

          {/* <div className="ml-auto flex items-center gap-3">
            <span className="text-slate-500">Your AI credits:</span>

            <div className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">{credits}</span>
            </div>
          </div> */}
        </div>

        {/* Big white container like screenshot */}
        <div className="mt-6 rounded-[8px] border bg-white px-6 py-10 md:px-10 md:py-12 shadow-sm">
          {/* Center header */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                Hostinger AI tools
              </h2>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-base text-slate-500">
              Enhance your online presence with these cutting-edge AI tools.
            </p>
          </div>

          {/* Cards grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
