"use client";

import React from "react";
import { Save } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        {/* <h1 className="text-3xl font-semibold">General Settings</h1> */}
         <BreadCrumbPage />
        <p className="text-gray-500 mt-1">
          Manage your application general configuration
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* App Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Application Name
            </label>
            <input
              type="text"
              placeholder="Dzinly Admin"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Dzinly Pvt Ltd"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Support Email
            </label>
            <input
              type="email"
              placeholder="support@dzinly.com"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Timezone
            </label>
            <select className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Default Language
            </label>
            <select className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Enable Maintenance Mode
            </span>
            <input type="checkbox" className="w-5 h-5 accent-purple-600" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Allow New User Registrations
            </span>
            <input type="checkbox" className="w-5 h-5 accent-purple-600" />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button>
            <Save size={18} />
             Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
