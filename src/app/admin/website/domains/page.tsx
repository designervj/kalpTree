"use client";

import React from "react";
import {
  Globe,
  Plus,
  CheckCircle,
  XCircle,
  Link2,
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Domain Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your connected domains and DNS status
        </p>
      </div>

      {/* ADD DOMAIN */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6 max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">
          Add New Domain
        </h2>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="example.com"
              className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} /> Add Domain
          </button>
        </div>
      </div>

      {/* DOMAIN LIST */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">
          Connected Domains
        </h2>

        <div className="divide-y">
          {/* DOMAIN ITEM */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="text-blue-600" />
              <div>
                <p className="font-medium">admincms.com</p>
                <p className="text-sm text-gray-500">
                  Primary Domain
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> Connected
            </span>
          </div>

          {/* DOMAIN ITEM */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="text-gray-500" />
              <div>
                <p className="font-medium">www.admincms.com</p>
                <p className="text-sm text-gray-500">
                  Secondary Domain
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
              <Link2 size={16} /> Pending DNS
            </span>
          </div>

          {/* DOMAIN ITEM */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="text-gray-400" />
              <div>
                <p className="font-medium">testsite.com</p>
                <p className="text-sm text-gray-500">
                  Not Verified
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
              <XCircle size={16} /> Not Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
