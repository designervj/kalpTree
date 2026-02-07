"use client";

import React from "react";
import {
  Check,
  Building2,
  Globe,
  Palette,
  BadgeCheck,
  Mail,
  User,
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Top header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500">Businesses • Create</div>
          <div className="text-2xl font-bold text-gray-900">Create</div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Review Your Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Please review all details before submitting
                </p>
              </div>

              <div className="space-y-5">
                {/* Tenant Details */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Tenant Details
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Row label="Organization:" value="aa" />
                    <Row label="Slug:" value="aa" />
                    <Row
                      label="Email:"
                      value="vijendrajat693@gmail.com"
                      icon={<Mail className="h-4 w-4 text-gray-400" />}
                    />
                    <Row label="Account Type:" value="Architect" />
                    <Row label="Plan:" value="Pro" />
                    <Row
                      label="Brand Colors:"
                      value={
                        <div className="flex items-center justify-end gap-2">
                          <ColorDot color="#3B82F6" />
                          <ColorDot color="#8B5CF6" />
                          <ColorDot color="#EC4899" />
                        </div>
                      }
                    />
                  </div>
                </div>

                {/* Owner Account */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Owner Account
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Row label="Name:" value="-" />
                    <Row label="Email:" value="admin@demo.local" />
                    <Row label="Role:" value="Manufacturer" />
                  </div>
                </div>

                {/* Website Configuration */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Website Configuration
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Row label="Website Name:" value="-" />
                    <Row label="Service Type:" value="WEBSITE ONLY" />
                    <Row label="Primary Domains:" value="-" />
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <button className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Previous
                </button>

                <button className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 px-7 py-3 text-sm font-semibold text-white shadow hover:opacity-95">
                  Submit &amp; Create Tenant
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="rounded-2xl bg-gradient-to-b from-[#0b1220] via-[#0f1a2f] to-[#0b1220] p-6 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Account Setup</h3>
                  <p className="mt-1 text-sm text-white/70">
                    Complete all steps to get started
                  </p>
                </div>

                <div className="space-y-4">
                  <Step
                    idx={1}
                    title="Account Details"
                    desc="Basic information"
                    status="done"
                    icon={<Building2 className="h-4 w-4" />}
                  />
                  <Step
                    idx={2}
                    title="Website Setup"
                    desc="Configure your website"
                    status="done"
                    icon={<Globe className="h-4 w-4" />}
                  />
                  <Step
                    idx={3}
                    title="Branding"
                    desc="Colors, logo & typography"
                    status="done"
                    icon={<Palette className="h-4 w-4" />}
                  />
                  <Step
                    idx={4}
                    title="Review"
                    desc="Review & submit"
                    status="active"
                    icon={<Check className="h-4 w-4" />}
                    isLast
                  />
                </div>

                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/75">
                    Need help? Contact our support team at
                  </p>
                  <p className="mt-1 text-sm font-semibold text-blue-300">
                    support@example.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* end right */}
        </div>
      </div>
    </div>
  );
}

/* -------------------------
  Small UI helpers
------------------------- */

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 items-center gap-3 py-1.5">
      <div className="col-span-5 text-sm text-gray-600">{label}</div>
      <div className="col-span-7 flex items-center justify-end gap-2 text-sm font-semibold text-gray-900">
        {icon}
        <span className="text-right">{value}</span>
      </div>
    </div>
  );
}

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
      style={{ backgroundColor: color }}
      title={color}
    />
  );
}

function Step({
  idx,
  title,
  desc,
  status,
  icon,
  isLast,
}: {
  idx: number;
  title: string;
  desc: string;
  status: "done" | "active" | "idle";
  icon?: React.ReactNode;
  isLast?: boolean;
}) {
  const isDone = status === "done";
  const isActive = status === "active";

  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-[33px] top-[44px] h-[68px] w-[2px] bg-white/10" />
      )}

      <div
        className={[
          "w-full rounded-xl p-4 text-left transition",
          isActive ? "bg-white/10 ring-1 ring-white/15" : "bg-white/5",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <div
            className={[
              "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
              isDone
                ? "bg-emerald-500 text-white"
                : isActive
                ? "bg-blue-600 text-white ring-4 ring-blue-600/25"
                : "bg-white/10 text-white/70",
            ].join(" ")}
          >
            {isDone ? <Check className="h-4 w-4" /> : idx}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className={["font-semibold", isActive ? "text-white" : "text-white/80"].join(" ")}>
                {title}
              </p>
              <span className="text-white/50">{icon}</span>
            </div>
            <p className="mt-1 text-xs text-white/60">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
