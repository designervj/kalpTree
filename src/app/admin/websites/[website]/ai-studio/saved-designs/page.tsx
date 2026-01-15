"use client";

import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  LayoutTemplate,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function Page() {
  const designs = [
    {
      id: 1,
      name: "Homepage Banner",
      type: "Landing Page",
      updated: "2 days ago",
    },
    {
      id: 2,
      name: "Product Card Layout",
      type: "E-commerce",
      updated: "5 days ago",
    },
    {
      id: 3,
      name: "Blog Header Design",
      type: "Blog",
      updated: "1 week ago",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* PAGE TITLE */}
      <div className="mb-6">
        {/* <h1 className="text-3xl font-semibold">Saved Designs</h1> */}
        <BreadCrumbPage />
        <p className="text-gray-500 mt-1">
          Manage your saved layouts and templates
        </p>
      </div>

      {/* DESIGN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <div
            key={design.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* PREVIEW */}
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              <LayoutTemplate className="text-gray-400" size={42} />
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="font-semibold text-lg">
                {design.name}
              </h3>
              <p className="text-sm text-gray-500">
                {design.type}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Last updated: {design.updated}
              </p>

              {/* ACTIONS */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <button className="p-2 rounded-md border hover:bg-gray-100">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-md border hover:bg-gray-100">
                    <Edit size={16} />
                  </button>
                </div>

                <button className="p-2 rounded-md text-red-500 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE (future use) */}
      {designs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No saved designs found
        </div>
      )}
    </div>
  );
}
