"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

/** ✅ mock products (screenshot-like) */
const PRODUCTS = [
  { id: "p1", name: "'Balance' Vase", thumb: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=120&q=70" },
  { id: "p2", name: "'Binocular' Vase", thumb: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=120&q=70" },
  { id: "p3", name: "'Bubble' Flowerpot", thumb: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=120&q=70" },
  { id: "p4", name: "'Bulb' Vase", thumb: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=120&q=70" },
  { id: "p5", name: "'Candy' Flowerpot", thumb: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=120&q=70" },
  { id: "p6", name: "'Drop' Vase", thumb: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=120&q=70" },
  { id: "p7", name: "'Mango' Vase", thumb: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=120&q=70" },
  { id: "p8", name: "'Sun' Vase", thumb: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=120&q=70" },
  { id: "p9", name: "'Wave' Vase", thumb: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=120&q=70" },
  { id: "p10", name: "Original Flavor Roasted Peanuts Pack", thumb: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=120&q=70" },
];

function GridLineChart({ height = 220 }: { height?: number }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-xl bg-white">
      {/* grid */}
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-[18%] h-px bg-slate-100" />
        <div className="absolute left-0 right-0 top-[40%] h-px bg-slate-100" />
        <div className="absolute left-0 right-0 top-[62%] h-px bg-slate-100" />
        <div className="absolute left-0 right-0 top-[84%] h-px bg-slate-100" />
      </div>

      {/* axis labels (left + bottom) */}
      <div className="relative" style={{ height }}>
        <div className="absolute left-0 top-0 bottom-0 w-[44px]">
          <div className="absolute left-0 top-[13%] text-[11px] text-slate-400">$0</div>
          <div className="absolute left-0 top-[35%] text-[11px] text-slate-400">$0</div>
          <div className="absolute left-0 top-[57%] text-[11px] text-slate-400">$0</div>
        </div>

        <div className="absolute left-[44px] right-0 top-0 bottom-0">
          {/* baseline */}
          <div className="absolute left-0 right-0 bottom-[18px] h-[2px] rounded-full bg-violet-600" />

          {/* x labels */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-between text-[11px] text-slate-400">
            <span>Dec 28</span>
            <span>Jan 7</span>
            <span>Jan 17</span>
            <span>Jan 25</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniGridChart({ height = 200 }: { height?: number }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-xl bg-white" style={{ height }}>
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-[18%] h-px bg-slate-100" />
        <div className="absolute left-0 right-0 top-[40%] h-px bg-slate-100" />
        <div className="absolute left-0 right-0 top-[62%] h-px bg-slate-100" />
        <div className="absolute left-0 right-0 top-[84%] h-px bg-slate-100" />
      </div>

      <div className="absolute left-4 top-6 text-[11px] text-slate-400">0</div>
      <div className="absolute left-4 top-[48%] text-[11px] text-slate-400">0.5</div>
      <div className="absolute left-4 bottom-7 text-[11px] text-slate-400">0</div>

      <div className="absolute left-[44px] right-4 bottom-[18px] h-[2px] rounded-full bg-violet-600" />
      <div className="absolute left-[44px] bottom-0 text-[11px] text-slate-400">Dec 28</div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen ">
      <div className="mx-auto w-full max-w-[980px] space-y-6">
        <div className="text-3xl font-semibold">Analytics</div>

        {/* filters row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs text-slate-500">Dec 28, 2025 — Jan 26, 2026</div>

          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm"
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm border border-slate-300" />
                Dec 28, 2025 — Jan 26, 2026
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm"
          >
            <span className="inline-flex items-center gap-2">
              No comparison <ChevronDown className="h-4 w-4 text-slate-500" />
            </span>
          </Button>
        </div>

        {/* Total sales card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-3 rounded-sm bg-violet-600" />
            <div>
              <div className="text-sm text-slate-600">Total Sales</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">$0.00</div>
            </div>
          </div>

          <GridLineChart height={230} />
        </div>

        {/* 2 cards row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-3 rounded-sm bg-violet-600" />
              <div>
                <div className="text-sm text-slate-600">Total Orders</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">0</div>
              </div>
            </div>

            <MiniGridChart height={210} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-3 rounded-sm bg-violet-600" />
              <div>
                <div className="text-sm text-slate-600">Average order value</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">$0.00</div>
              </div>
            </div>

            <MiniGridChart height={210} />
          </div>
        </div>

        {/* Total sales by product */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Total sales by product</div>
            <button type="button" className="text-sm font-medium text-violet-700">
              Sort by: Sales ↓
            </button>
          </div>

          <div className="mt-4">
            <div className="space-y-4">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.thumb}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover"
                      draggable={false}
                    />
                    <div className="text-sm font-medium text-slate-900">{p.name}</div>
                  </div>
                  <div className="text-sm text-slate-600">0 sales</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right side empty space like screenshot (page still centered) */}
        <div className="h-6" />
      </div>
    </div>
  );
}
