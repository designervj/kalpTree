"use client";

import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import React from "react";

export default function ImageUploadsPage() {
  return (
    <div className=" space-y-6  min-h-screen">

      {/* Page Title */}
      <div className="mb-6">
        {/* <h1 className="text-2xl font-semibold text-gray-800">
          Image Uploads
        </h1> */}
        <BreadCrumbPage/>
        <p className="text-sm text-gray-500">
          Upload and manage your images for AI processing
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
          <p className="text-gray-500 mb-4">
            Drag & drop images here
          </p>
          <p className="text-gray-400 text-sm mb-6">
            PNG, JPG up to 10MB
          </p>

          <button className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
            Browse Files
          </button>
        </div>
      </div>

      {/* Uploaded Images */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            Uploaded Images
          </h2>

          <button className="text-sm text-purple-600 hover:underline">
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="group relative bg-gray-100 rounded-lg h-32 flex items-center justify-center"
            >
              <span className="text-gray-400 text-sm">
                Image {item}
              </span>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
                <button className="px-3 py-1 bg-white text-sm rounded">
                  View
                </button>
                <button className="px-3 py-1 bg-red-500 text-white text-sm rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
