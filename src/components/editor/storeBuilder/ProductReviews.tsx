"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronDown,
  Smile,
} from "lucide-react";

type StatusTab = "All" | "Published" | "Pending" | "Rejected";

const ProductReviews = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [ratingLabel] = useState("All"); // hook ready if you add a dropdown later
  const [selectedAll, setSelectedAll] = useState(false);

  const tabs: StatusTab[] = useMemo(
    () => ["All", "Published", "Pending", "Rejected"],
    []
  );

  return (
    <div className="min-h-screen w-[92%]">
      <div className=" ">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Product reviews
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600">
              Customers are less likely to trust products with only perfect
              reviews. Showing all feedback helps build trust and credibility
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-violet-600 shadow-sm hover:bg-slate-50"
          >
            <SettingsIcon className="h-5 w-5" />
            Settings
          </button>
        </div>

        {/* Search */}
        <div className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              {tabs.map((t) => {
                const active = activeTab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTab(t)}
                    className={[
                      "rounded-xl px-3 py-1.5 text-sm font-medium transition",
                      active
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="mx-2 hidden h-6 w-px bg-slate-200 md:block" />

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              aria-label="Rating filter"
            >
              <span className="text-slate-600">Rating:</span>
              <span className="text-slate-900">{ratingLabel}</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Table */}
          <div className="w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm">
                    <th className="w-[56px] px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedAll((s) => !s)}
                        aria-label="Select all"
                        className={[
                          "grid h-6 w-6 place-items-center rounded-md border-2 transition",
                          selectedAll
                            ? "border-violet-600 bg-violet-50"
                            : "border-violet-600 bg-white hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {selectedAll ? (
                          <span className="h-2.5 w-2.5 rounded-sm bg-violet-600" />
                        ) : null}
                      </button>
                    </th>
                    <th className="px-4 py-4 font-semibold text-slate-900">
                      Product
                    </th>
                    <th className="px-4 py-4 font-semibold text-slate-900">
                      Review
                    </th>
                    <th className="px-4 py-4 font-semibold text-slate-900">
                      Date
                    </th>
                    <th className="px-4 py-4 font-semibold text-slate-900">
                      <span className="inline-flex items-center gap-2">
                        AI scan
                        <HelpCircle className="h-4 w-4 text-slate-500" />
                      </span>
                    </th>
                    <th className="px-4 py-4 font-semibold text-slate-900">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan={6}
                      className="border-t border-slate-200 px-6 py-16"
                    >
                      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                        <p className="text-lg font-semibold text-slate-900">
                          There are no product reviews yet
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          As soon as a customer leaves one, it’ll appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center gap-3 text-slate-600">
          <Smile className="h-5 w-5 text-slate-500" />
          <button
            type="button"
            className="text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            Rate reviews experience.
          </button>
          <span className="text-sm">Help us improve.</span>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
