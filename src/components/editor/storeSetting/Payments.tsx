"use client";

import React from "react";
import {
  ChevronDown,
  CreditCard,
  Plus,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

const Payments = () => {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="mx-auto w-full max-w-[980px] px-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Payments
            </h1>
            <p className="mt-2 text-sm text-slate-600">Popular in your location</p>
          </div>

          {/* Location dropdown */}
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50">
            <span className="text-slate-500">Your company location:</span>
            <span className="font-medium text-slate-900">India</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* Cards */}
        <div className="mt-6 space-y-4">
          {/* Razorpay */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <CreditCard className="h-5 w-5 text-slate-700" />
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    Razorpay
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  Create or connect a Razorpay account to accept online payments.
                  Razorpay charges{" "}
                  <span className="text-[#6D5EF5] hover:underline cursor-pointer">
                    processing fees
                  </span>
                  .
                </p>

                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  <span className="font-semibold">Important:</span> Razorpay
                  payments are only available for orders with a total value of{" "}
                  <span className="font-medium">$1</span> or more. Your customers
                  can either increase the order value or choose another payment
                  method.
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-slate-700">
                    Available payment methods:
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {["VISA", "Mastercard", "RuPay", "UPI", "NetBanking"].map(
                      (t) => (
                        <span
                          key={t}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                        >
                          {t}
                        </span>
                      )
                    )}

                    <button className="ml-1 text-xs font-medium text-[#6D5EF5] hover:underline">
                      See all
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    By connecting, you consent that our platform would perform
                    necessary actions for accepting payments and access
                    transaction-related information.
                  </p>
                </div>
              </div>

              <button className="h-10 rounded-lg bg-[#6D5EF5] px-5 text-sm font-semibold text-white shadow-sm hover:opacity-95">
                Connect
              </button>
            </div>
          </div>

          {/* Manual payment */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-base font-semibold text-slate-900">
                  Manual payment
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Customers can pay you offline, based on your instruction.
                  Ability to have cash on delivery (COD), money orders, and bank
                  transfers. You'll need to approve all orders by updating the
                  payment status on the Orders page.
                </p>
              </div>

              <button className="h-10 rounded-lg bg-[#6D5EF5] px-5 text-sm font-semibold text-white shadow-sm hover:opacity-95">
                Add
              </button>
            </div>
          </div>

          {/* Additional payment methods */}
          <div className="pt-4">
            <div className="text-base font-semibold text-slate-900">
              Additional payment methods
            </div>
            <p className="mt-1 text-sm text-slate-600">
              You can add more payment methods to give your customers more
              abilities to choose from.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <span className="text-sm font-bold text-slate-700">
                        P
                      </span>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-slate-900">
                        PayPal
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        Create or connect PayPal Business account to let
                        customers pay with a PayPal.
                      </div>
                    </div>
                  </div>
                </div>

                <button className="h-10 rounded-lg bg-[#6D5EF5] px-5 text-sm font-semibold text-white shadow-sm hover:opacity-95">
                  Connect
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <HelpCircle className="h-4 w-4" />
              <span className="hover:underline cursor-pointer">
                Rate payment management experience
              </span>
              <span>•</span>
              <span>Help us improve.</span>
            </div>
          </div>

          {/* Guidance */}
          <div className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold text-slate-900">
                Need some guidance?
              </div>
              <button className="flex items-center gap-2 text-sm font-medium text-[#6D5EF5] hover:underline">
                View all articles <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                "Set up online payment gateways",
                "Accept bank card payments",
                "What are supported currencies in online store",
                "Getting paid with Stripe",
                "Set up online payments with PayPal",
                "Enable manual (offline) payments",
              ].map((t) => (
                <button
                  key={t}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm hover:bg-slate-50"
                >
                  <span className="text-sm font-medium text-slate-800">{t}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
