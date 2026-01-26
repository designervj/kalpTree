"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, ChevronRight, Check } from "lucide-react";

const OverviewPage = () => {
  const [openPayment, setOpenPayment] = React.useState(true);
  const [openCompany, setOpenCompany] = React.useState(false);

  return (
    <div className="w-full bg-[#f6f7fb] px-0 py-0 dark:bg-[#0a1020]">
      {/* Top card */}
      <div className="mx-auto w-full max-w-[1180px] rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[20px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Set up your store
            </div>
            <div className="mt-2 text-md text-slate-600 dark:text-slate-300">
              Complete these steps to finish setting up your store.
            </div>
          </div>

          {/* progress ring */}
          <div className="relative h-16 w-16 shrink-0">
            <div
              className="h-16 w-16 rounded-full"
              style={{
                background:
                  "conic-gradient(#10b981 0 50%, #e5e7eb 50% 100%)",
              }}
            />
            <div className="absolute inset-[8px] rounded-full bg-white dark:bg-[#0b1220]" />
            <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-900 dark:text-slate-100">
              2/4
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Step 1 header */}
          <div className="flex items-center gap-3 bg-[#f3f4f6] px-6 py-5 dark:bg-white/5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check className="h-5 w-5" />
            </span>
            <div className="text-md font-semibold text-slate-400">
              Add your first product
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Step 2 (expanded) */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div >
                <h5 className="text-md font-semibold text-slate-900 dark:text-slate-100">Set up a payment method</h5>
              </div>
              <button
                type="button"
                onClick={() => setOpenPayment((v) => !v)}
                className="rounded-full p-2 text-violet-700 hover:bg-slate-100 dark:text-violet-200 dark:hover:bg-white/5"
                aria-label="Toggle payment method"
              >
                {openPayment ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            {openPayment ? (
              <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-6">
                  {/* image placeholder */}
                  <div className="h-[120px] w-[210px] rounded-xl bg-gradient-to-br from-violet-700 via-violet-600 to-lime-300 p-3">
                    <div className="h-full w-full rounded-lg bg-white/95" />
                  </div>

                  <div className="max-w-[640px]">
                    <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                      Connect a payment provider to receive orders
                    </div>
                    <div className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                      To accept and let your customers pay, add at least one
                      payment method.
                    </div>
                  </div>
                </div>

                <Button className="h-12 rounded-2xl bg-violet-600 px-8 text-base text-white hover:bg-violet-600/90">
                  Add payments
                </Button>
              </div>
            ) : null}
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Step 3 (collapsed) */}
          <button
            type="button"
            onClick={() => setOpenCompany((v) => !v)}
            className={cn(
              "flex w-full items-center justify-between px-6 py-5 text-left",
              "hover:bg-slate-50 dark:hover:bg-white/5"
            )}
          >
            <div>
            <h5 className="text-md font-semibold text-slate-900 dark:text-slate-100">  Update company information</h5>
            </div>
            <span className="rounded-full p-2 text-slate-500 dark:text-slate-400">
              {openCompany ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </span>
          </button>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Step 4 header */}
          <div className="flex items-center gap-3 bg-[#f3f4f6] px-6 py-5 dark:bg-white/5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check className="h-4 w-4" />
            </span>
            <div >
              <h5 className="text-md font-semibold text-slate-900 dark:text-slate-100">Review and setup your shipping</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Guidance section */}
      <div className="mx-auto mt-10 w-full max-w-[1180px]">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Need some guidance?
          </div>

          <button
            type="button"
            className="inline-flex  items-center gap-2 text-md font-semibold text-violet-700 hover:opacity-90 dark:text-violet-200"
          >
            View all articles <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-lg text-slate-900 shadow-sm dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100">
            <p className="text-sm font-semibold">Change order of products in your online store</p>
            <ChevronRight className="h-6 w-6 text-slate-500 dark:text-slate-400" />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-lg text-slate-900 shadow-sm dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100">
            <p className="text-sm font-semibold">Set up your shippings</p>
            <ChevronRight className="h-6 w-6 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
