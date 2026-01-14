"use client";

import React from "react";
import {
  Search,
  Folder,
  BookOpen,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function Page() {
  const libraries = [
    { id: 1, title: "Brand Guidelines", category: "Marketing" },
    { id: 2, title: "Product Datasheets", category: "Product" },
    { id: 3, title: "Installation Manuals", category: "Technical" },
    { id: 4, title: "Sales Pitch Decks", category: "Sales" },
  ];

  return (
    <div className="min-h-screen ">
      {/* PAGE TITLE */}
      <div className="mb-6">
        {/* <h1 className="text-3xl font-semibold">Promat Library</h1> */}
        <BreadCrumbPage/>
        <p className="text-gray-500 mt-1">
          Central place to manage all documents & resources
        </p>
      </div>

      {/* TOP ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* SEARCH */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search library..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ADD BUTTON */}
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} />
          Add Library Item
        </button>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["All", "Marketing", "Product", "Technical", "Sales"].map(
          (cat) => (
            <button
              key={cat}
              className="px-4 py-1.5 rounded-full border text-sm hover:bg-blue-50 hover:border-blue-500"
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* LIBRARY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraries.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* CARD HEADER */}
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <Folder size={20} />
              </div>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-xs text-gray-500">
                  {item.category}
                </p>
              </div>
            </div>

            {/* CARD BODY */}
            <div className="p-4 text-sm text-gray-600">
              This library contains important documents related to{" "}
              {item.category.toLowerCase()}.
            </div>

            {/* CARD ACTIONS */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                <Eye size={16} />
                View
              </button>

              <div className="flex gap-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <BookOpen size={18} />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
