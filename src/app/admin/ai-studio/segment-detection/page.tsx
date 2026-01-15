"use client";

import React from "react";
import {
  UploadCloud,
  Scan,
  Layers,
  Trash2,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function Page() {
  return (
    <div className="min-h-screen ">
      {/* PAGE HEADER */}
      <div className="mb-6">
        {/* <h1 className="text-3xl font-semibold">Segment Detection</h1> */}
        <BreadCrumbPage />
        <p className="text-gray-500 mt-1">
          Upload image and detect segments automatically
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT – IMAGE UPLOAD */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <UploadCloud size={18} />
            Upload Image
          </h2>

          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition">
            <UploadCloud className="mx-auto text-gray-400" size={40} />
            <p className="mt-3 text-sm text-gray-600">
              Drag & drop image here
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG up to 10MB
            </p>

            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Select Image
            </button>
          </div>
        </div>

        {/* CENTER – PREVIEW */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Scan size={18} />
            Image Preview
          </h2>

          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            Image Preview Here
          </div>

          <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Run Segment Detection
          </button>
        </div>

        {/* RIGHT – DETECTED SEGMENTS */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Layers size={18} />
            Detected Segments
          </h2>

          <div className="space-y-3">
            {["Wall", "Floor", "Sofa", "Table"].map((segment, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border"
              >
                <span className="text-sm">{segment}</span>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full px-4 py-2 border rounded-lg hover:bg-gray-100">
            Clear Segments
          </button>
        </div>
      </div>
    </div>
  );
}
