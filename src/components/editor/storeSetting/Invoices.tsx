"use client";

import React from "react";
import { Plus } from "lucide-react";

const ACCENT = "#6D5EF5";

const Invoices = () => {
  const [title, setTitle] = React.useState("Invoice");
  const [nextNumber, setNextNumber] = React.useState("1");

  const [showLogo, setShowLogo] = React.useState(true);
  const [showEmail, setShowEmail] = React.useState(true);
  const [showPhone, setShowPhone] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT: Invoice Preview */}
          <div className="relative">
            <div className="absolute left-4 top-[-10px] z-10 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-white">
              Invoice preview
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              {/* Top right meta */}
              <div className="flex justify-end">
                <div className="text-right text-sm text-slate-700">
                  <div className="font-semibold">Invoice 1</div>
                  <div>
                    Issue date:{" "}
                    <span className="text-slate-900">Jan 27, 2026</span>
                  </div>
                  <div>
                    Order number: <span className="text-slate-900">1001</span>
                  </div>
                </div>
              </div>

              {/* From/To */}
              <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="text-sm">
                  <div className="text-slate-500">From:</div>
                  <div className="mt-1 text-slate-900">United States</div>
                  {showEmail ? (
                    <div className="text-slate-900">mail2deepakrai@gmail.com</div>
                  ) : null}
                </div>

                <div className="text-sm">
                  <div className="text-slate-500">To:</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    Full Name
                  </div>
                  <div className="text-slate-700">Street Address</div>
                  <div className="text-slate-700">City, State, Postal Code</div>
                  <div className="text-slate-700">Country</div>
                  {showEmail ? <div className="text-slate-700">Email</div> : null}
                  {showPhone ? (
                    <div className="text-slate-700">Phone number</div>
                  ) : null}
                </div>
              </div>

              {/* Table */}
              <div className="mt-10">
                <div className="grid grid-cols-[2fr_.8fr_1fr_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-700">
                  <div>Product or Service</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Unit price incl. Tax</div>
                  <div className="text-right">Unit discount</div>
                  <div className="text-right">Unit price excl. Tax</div>
                  <div className="text-right">Tax (21%)</div>
                  <div className="text-right">Amount</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-100">
                  <div className="grid grid-cols-[2fr_.8fr_1fr_1fr_1fr_1fr_1fr] gap-3 py-5 text-sm text-slate-800">
                    <div>Test product name</div>
                    <div className="text-center">2</div>
                    <div className="text-right">$10.00</div>
                    <div className="text-right">$1.20</div>
                    <div className="text-right">$7.27</div>
                    <div className="text-right">$3.06</div>
                    <div className="text-right">$17.60</div>
                  </div>

                  <div className="grid grid-cols-[2fr_.8fr_1fr_1fr_1fr_1fr_1fr] gap-3 py-5 text-sm text-slate-800">
                    <div>Shipping</div>
                    <div className="text-center">1</div>
                    <div className="text-right">$2.00</div>
                    <div className="text-right">-</div>
                    <div className="text-right">$1.65</div>
                    <div className="text-right">$0.35</div>
                    <div className="text-right">$2.00</div>
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-10 flex justify-end">
                  <div className="w-full max-w-[320px] text-sm">
                    <div className="flex items-center justify-between py-2 text-slate-700">
                      <span>Total excl. Tax</span>
                      <span>$16.19</span>
                    </div>
                    <div className="flex items-center justify-between py-2 text-slate-700">
                      <span>Tax (21%)</span>
                      <span>$3.41</span>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between py-1 text-xs font-semibold text-slate-700">
                        <span>DISCOUNT</span>
                        <span>$2.40</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-xs font-semibold text-slate-700">
                        <span>Gift Cards</span>
                        <span>$0.20</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-900">
                        <span>TOTAL</span>
                        <span>$19.60</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-10 text-xs text-slate-500">
                This is not a tax invoice. You are fully responsible for ensuring
                that invoices you issue conform to any relevant legal
                requirements.
              </div>
            </div>
          </div>

          {/* RIGHT: Settings */}
          <div className="space-y-6">
            {/* General */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-lg font-semibold text-slate-900">
                  General
                </div>
              </div>

              <div className="space-y-5 px-6 py-5">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-900">
                    Title
                  </div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-900">
                    Next invoice number
                  </div>
                  <input
                    value={nextNumber}
                    onChange={(e) => setNextNumber(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2"
                  />
                </div>

                <div className="text-sm text-slate-600">
                  Numbers are unique and increase by 1 with each new invoice. You
                  can change the numbering of invoices, but only to a higher
                  number than the last issued invoice.
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-lg font-semibold text-slate-900">
                  Company
                </div>
              </div>

              <div className="px-6 py-5">
                <div className="flex gap-4">
                  {showLogo ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 text-sm text-slate-500">
                      Logo
                    </div>
                  ) : null}

                  <div className="text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">
                      Company name
                    </div>
                    <div className="text-slate-500">Street Address</div>
                    <div className="text-slate-500">
                      City, Region/Province, ZIP/Postal code
                    </div>
                    <div className="text-slate-900">United States</div>
                    {showEmail ? (
                      <div className="text-slate-900">mail2deepakrai@gmail.com</div>
                    ) : null}
                    {showPhone ? (
                      <div className="text-slate-500">Phone number</div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  All details are taken from your{" "}
                  <button
                    type="button"
                    className="font-medium hover:underline"
                    style={{ color: ACCENT }}
                  >
                    Company information
                  </button>
                  .
                </div>
              </div>
            </div>

            {/* Additional information */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-lg font-semibold text-slate-900">
                  Additional information
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-sm text-slate-600">
                  Add information that you want to provide additionally or that
                  is legally required in your country, e.g., Tax ID.
                </p>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: ACCENT }}
                >
                  <Plus className="h-4 w-4" />
                  Add information
                </button>
              </div>
            </div>

            {/* Other */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-lg font-semibold text-slate-900">Other</div>
              </div>

              <div className="space-y-4 px-6 py-5">
                <label className="flex items-center gap-3 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-[var(--accent)]"
                    style={{ ["--accent" as any]: ACCENT }}
                  />
                  Show logo
                </label>

                <label className="flex items-center gap-3 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-[var(--accent)]"
                    style={{ ["--accent" as any]: ACCENT }}
                  />
                  Show email
                </label>

                <label className="flex items-center gap-3 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={showPhone}
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-[var(--accent)]"
                    style={{ ["--accent" as any]: ACCENT }}
                  />
                  Show phone number
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
};

export default Invoices;
