"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StoreDetails = () => {
  const [currency, setCurrency] = useState("usd");
  const [measurement, setMeasurement] = useState("imperial");

  return (
    <div className="min-h-screen w-full bg-[#f6f7fb] text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      <div className="mx-auto w-full  px-4 py-10">
        {/* Page title */}
        <div>
            {/* <h4 className="text-[28px] font-semibold leading-none">Store details</h4> */}
                  <h1 className="text-2xl font-semibold  tracking-tight">Store details </h1>
        </div>

        {/* Main card */}
        <Card className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1220]">
          {/* Header area */}
          <div className="px-8 py-0">
            <div>
              <h5 className="text-[22px] font-semibold leading-tight">Regional settings</h5>
            </div>
            <div className="mt-2">
              <p className="text-slate-600 dark:text-slate-400">Choose the currency your products are sold in and a measurement system
              needed for shipping.</p>
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Form area */}
          <div className="px-8 pb-3">
            {/* Currency */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Currency
              </Label>

              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger
                  className={cn(
                    "h-14 rounded-xl px-5 text-base w-full",
                    "border-slate-200 bg-white",
                    "focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-0",
                    "dark:border-slate-800 dark:bg-[#0b1220]"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="rounded-xl w-full">
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-base text-slate-500 dark:text-slate-400">
                Store currency can't be changed after connecting any payment method.
              </div>
            </div>

            {/* Measurement system */}
            <div className="mt-4 space-y-3">
              <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Measurement System
              </Label>

              <Select value={measurement} onValueChange={setMeasurement}>
                {/* Purple focused border like screenshot */}
                <SelectTrigger
                  className={cn(
                    "h-16 rounded-xl px-5 text-base w-full",
                    "border-2 border-violet-500 bg-white",
                    "shadow-[0_0_0_3px_rgba(139,92,246,0.12)]",
                    "dark:bg-[#0b1220] dark:border-violet-500"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>

                {/* Dropdown look like screenshot */}
                <SelectContent className="rounded-2xl p-2">
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (oz, in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StoreDetails;
