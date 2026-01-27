"use client";

import React from "react";
import { Plus, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const ACCENT = "#6D5EF5";

const Taxes = () => {
  const [pageSize, setPageSize] = React.useState(5);
  const [taxMode, setTaxMode] = React.useState<"included" | "checkout">("checkout");

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold text-slate-900">Taxes</h1>
          </div>

          <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus className="h-5 w-5" />
            Add tax rules
          </button>
        </div>

        {/* Rules Table Card */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-[1.2fr_1.6fr_1fr_56px] border-b border-slate-200 px-6 py-4 text-sm font-semibold text-slate-900">
            <div>Rule</div>
            <div>Countries</div>
            <div>Tax rate</div>
            <div />
          </div>

          {/* Table row */}
          <div className="grid grid-cols-[1.2fr_1.6fr_1fr_56px] items-center px-6 py-8">
            <div className="text-base font-semibold text-slate-900">AAA</div>
            <div className="text-base text-slate-900">India (36 states)</div>
            <div className="text-base text-slate-500">—</div>

            <button
              type="button"
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50"
              aria-label="More"
            >
              <MoreHorizontal className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Footer / Pagination */}
          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
            {/* Left */}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span>Page size:</span>

                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-900 outline-none focus:ring-2"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div className="font-medium text-slate-700">1 to 1 of 1</div>
            </div>

            {/* Right */}
            <div className="flex items-center justify-between gap-3 text-sm text-slate-700 md:justify-end">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent hover:bg-slate-50"
                aria-label="Prev page"
              >
                <ChevronLeft className="h-5 w-5 text-slate-500" />
              </button>

              <div className="font-medium">Page 1 of 1</div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent hover:bg-slate-50"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Tax conditions */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-10 pt-10">
            <h2 className="text-[28px] font-semibold text-slate-900">
              Tax conditions
            </h2>
          </div>

          <div className="px-10">
            <div className="mt-6 h-px w-full bg-slate-200" />
          </div>

          <div className="px-10 pb-10 pt-7">
            <div className="flex flex-wrap items-center gap-2 text-base text-slate-800">
              <span>How would you like to collect tax?</span>
              <button
                type="button"
                className="font-medium hover:underline"
                style={{ color: ACCENT }}
              >
                See an example
              </button>
            </div>

            <div className="mt-7 space-y-5">
              {/* Radio 1 */}
              <label className="flex cursor-pointer items-center gap-4">
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <input
                    type="radio"
                    name="tax-mode"
                    className="peer sr-only"
                    checked={taxMode === "included"}
                    onChange={() => setTaxMode("included")}
                  />
                  <span
                    className="h-6 w-6 rounded-full border-2 border-slate-300 bg-white peer-checked:border-[var(--accent)]"
                    style={{ ["--accent" as any]: ACCENT }}
                  />
                  <span
                    className="absolute h-3 w-3 rounded-full bg-transparent peer-checked:bg-[var(--accent)]"
                    style={{ ["--accent" as any]: ACCENT }}
                  />
                </span>

                <span className="text-base text-slate-900">
                  Include taxes in product prices
                </span>
              </label>

              {/* Radio 2 */}
              <label className="flex cursor-pointer items-center gap-4">
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <input
                    type="radio"
                    name="tax-mode"
                    className="peer sr-only"
                    checked={taxMode === "checkout"}
                    onChange={() => setTaxMode("checkout")}
                  />
                  <span
                    className="h-6 w-6 rounded-full border-2 border-slate-300 bg-white peer-checked:border-[var(--accent)]"
                    style={{ ["--accent" as any]: ACCENT }}
                  />
                  <span
                    className="absolute h-3 w-3 rounded-full bg-transparent peer-checked:bg-[var(--accent)]"
                    style={{ ["--accent" as any]: ACCENT }}
                  />
                </span>

                <span className="text-base text-slate-900">
                  Add taxes on the checkout page
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
};

export default Taxes;