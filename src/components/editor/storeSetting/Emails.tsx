"use client";

import React from "react";

const ACCENT = "#6D5EF5";

type EmailItem = {
  title: string;
  subtitle: string;
};

type EmailSection = {
  heading: string;
  items: EmailItem[];
};

const SECTIONS: EmailSection[] = [
  {
    heading: "Order confirmation",
    items: [
      {
        title: "Order confirmation",
        subtitle: "Sent automatically when an order is placed.",
      },
      {
        title: "Order confirmation (when manual payment used)",
        subtitle:
          "Sent automatically when an order is placed using a manual payment method.",
      },
      {
        title: "Order confirmation (when delayed payment used)",
        subtitle:
          "Sent automatically when an order is placed using a delayed payment method.",
      },
    ],
  },
  {
    heading: "Shipping",
    items: [
      {
        title: "Shipping confirmation (for physical products only)",
        subtitle: "Sent automatically when an order is marked as fulfilled.",
      },
      {
        title: "Shipping confirmation with tracking number (for physical products only)",
        subtitle:
          "Sent automatically when an order is marked as fulfilled and a tracking number is added.",
      },
      {
        title: "Shipping update (for physical products only)",
        subtitle:
          "Sent automatically when the tracking number of fulfilled order is updated.",
      },
    ],
  },
  {
    heading: "Digital file download",
    items: [
      {
        title: "Digital file download link",
        subtitle:
          "Sent automatically after successful payment for the digital file.",
      },
    ],
  },
  {
    heading: "Appointments",
    items: [
      {
        title: "Appointments confirmation",
        subtitle:
          "Sent automatically after successful payment for the appointment.",
      },
    ],
  },
  {
    heading: "Gift card",
    items: [
      {
        title: "Gift card details",
        subtitle: "Sent automatically after successful payment for the gift card.",
      },
    ],
  },
  {
    heading: "Invoices",
    items: [
      {
        title: "Invoice of the order",
        subtitle: "Sent manually for every order.",
      },
    ],
  },
];

const Emails = () => {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="mx-auto w-full max-w-[980px] px-6 pb-8">
        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">Emails</h1>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {SECTIONS.map((section) => (
            <div
              key={section.heading}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                  {section.heading}
                </h2>
              </div>

              <div className="divide-y divide-slate-200">
                {section.items.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900">
                        {item.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.subtitle}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-sm font-semibold hover:underline cursor-pointer"
                      style={{ color: ACCENT }}
                    >
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
};

export default Emails;
