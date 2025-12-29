"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  FileText,
  Layers,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Page() {
  const [open, setOpen] = useState<string | null>("posts");

  const toggle = (key: string) => {
    setOpen(open === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Navigation</h1>
        <p className="text-gray-500 mt-1">
          Manage your website navigation and menus
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-sm border max-w-4xl">
        <div className="divide-y">

          {/* DASHBOARD */}
          <div className="p-5 flex items-center gap-4 hover:bg-gray-50 cursor-pointer">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <LayoutGrid size={18} />
            </div>
            <span className="font-medium text-gray-800">
              Dashboard
            </span>
          </div>

          {/* POSTS */}
          <div className="p-5">
            <div
              onClick={() => toggle("posts")}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <FileText size={18} />
                </div>
                <span className="font-medium text-gray-800">
                  Posts
                </span>
              </div>
              {open === "posts" ? (
                <ChevronDown className="text-gray-500" />
              ) : (
                <ChevronRight className="text-gray-500" />
              )}
            </div>

            {open === "posts" && (
              <div className="mt-4 ml-14 space-y-3 text-sm text-gray-600">
                <div className="hover:text-black cursor-pointer">
                  All Posts
                </div>
                <div className="hover:text-black cursor-pointer">
                  Add New
                </div>
                <div className="hover:text-black cursor-pointer">
                  Categories
                </div>
              </div>
            )}
          </div>

          {/* PAGES */}
          <div className="p-5">
            <div
              onClick={() => toggle("pages")}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Layers size={18} />
                </div>
                <span className="font-medium text-gray-800">
                  Pages
                </span>
              </div>
              {open === "pages" ? (
                <ChevronDown className="text-gray-500" />
              ) : (
                <ChevronRight className="text-gray-500" />
              )}
            </div>

            {open === "pages" && (
              <div className="mt-4 ml-14 space-y-3 text-sm text-gray-600">
                <div className="hover:text-black cursor-pointer">
                  All Pages
                </div>
                <div className="hover:text-black cursor-pointer">
                  Add Page
                </div>
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <div className="p-5 flex items-center gap-4 hover:bg-gray-50 cursor-pointer">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <Settings size={18} />
            </div>
            <span className="font-medium text-gray-800">
              Settings
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
