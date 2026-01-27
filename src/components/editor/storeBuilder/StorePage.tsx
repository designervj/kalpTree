"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  X,
  ChevronRight,
  Download,
  Store,
  Box,
  Star,
  Calendar,
  Percent,
  LayoutGrid,
  BarChart3,
  Users,
  Settings,
  MoreVertical,
} from "lucide-react";
import StorePagesModel from "./StorePagesModel";

type SetupItem = { id: string; label: string; done?: boolean };
type NavItem = { id: string; label: string; icon: React.ReactNode };

const SETUP: SetupItem[] = [
  { id: "shipping", label: "Update shipping options", done: true },
  { id: "add-product", label: "Add a product", done: true },
  { id: "payment", label: "Add a payment method", done: false },
  { id: "company", label: "Update company details", done: false },
];

const NAV: NavItem[] = [
  { id: "orders", label: "Orders", icon: <Download className="h-4 w-4" /> },
  { id: "product-pages", label: "Product pages", icon: <Store className="h-4 w-4" /> },
  { id: "products", label: "Products", icon: <Box className="h-4 w-4" /> },
  { id: "reviews", label: "Product reviews", icon: <Star className="h-4 w-4" /> },
  { id: "appointments", label: "Appointments", icon: <Calendar className="h-4 w-4" /> },
  { id: "discounts", label: "Discounts", icon: <Percent className="h-4 w-4" /> },
  { id: "categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "customers", label: "Customers", icon: <Users className="h-4 w-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

function CheckDot({ done }: { done?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded-full border",
        done
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-slate-300 bg-white text-transparent dark:border-slate-700 dark:bg-transparent"
      )}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={done ? "opacity-100" : "opacity-0"}>
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function StorePage() {
  return (
    <div className="w-full max-w-[420px] bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      {/* Header */}
      {/* <div className="flex items-start justify-between px-0 pt-0">
        <div className="text-[32px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Manage store 1
        </div>

        <button
          type="button"
          className={cn(
            "rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
            "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100"
          )}
          aria-label="Close"
          onClick={() => {}}
        >
          <X className="h-5 w-5" />
        </button>
      </div> */}

      {/* Setup card */}
      <div className="px-0 pt-2">
        <div
          className={cn(
            "rounded-sm bg-white ring-1 ring-slate-200/60",
            // "shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
            "dark:bg-[#0b1220] dark:ring-slate-800/70 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          )}
        >
          <div className="px-5 pt-5 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Set up your store
          </div>

          <div className="px-2 pb-4 pt-2">
            <div className="rounded-xl">
              {SETUP.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                    "hover:bg-slate-50",
                    "dark:hover:bg-white/5"
                  )}
                  onClick={() => {}}
                >
                  <div className="flex items-center gap-3">
                    <CheckDot done={s.done}/>
                    <div className="text-sm text-slate-700 dark:text-slate-200">{s.label}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />

                 </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nav list */}
      <div className="mt-6">
        {NAV.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between px-4 py-4 text-left transition-colors",
                "hover:bg-slate-50",
                "dark:hover:bg-white/5"
              )}
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-700 dark:text-slate-300">{item.icon}</span>
                <span className="text-[15px] text-slate-700 dark:text-slate-200">{item.label}</span>
              </div>
              {/* <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" /> */}
              <StorePagesModel/>
            </button>

            <div className="mx-0 h-px bg-slate-200/70 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-8 border-t border-slate-200 bg-white px-0 py-4 dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className={cn(
              "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold",
              "text-violet-700 hover:bg-slate-50",
              "dark:border-slate-800 dark:bg-transparent dark:text-violet-200 dark:hover:bg-white/5"
            )}
            onClick={() => {}}
          >
            Manage store
          </button>

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-500",
              "hover:bg-slate-100 hover:text-slate-700",
              "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100"
            )}
            aria-label="More"
            onClick={() => {}}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
