"use client";

import React from "react";
import {
  Clock,
  Image,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Eye,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function Page() {
  const renders = [
    {
      id: 1,
      name: "Living Room Render",
      date: "12 Sep 2025 • 10:45 AM",
      status: "completed",
    },
    {
      id: 2,
      name: "Bedroom Scene",
      date: "11 Sep 2025 • 06:20 PM",
      status: "processing",
    },
    {
      id: 3,
      name: "Kitchen View",
      date: "10 Sep 2025 • 02:15 PM",
      status: "failed",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* PAGE TITLE */}
      <div className="mb-6">
        {/* <h1 className="text-3xl font-semibold">Render History</h1> */}
        <BreadCrumbPage />
        <p className="text-gray-500 mt-1">
          Track and manage all generated renders
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-6 py-4">Render</th>
              <th className="text-left px-6 py-4">Date</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {renders.map((render) => (
              <tr
                key={render.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* NAME */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Image size={18} className="text-gray-400" />
                  </div>
                  <span className="font-medium">{render.name}</span>
                </td>

                {/* DATE */}
                <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                  <Clock size={14} />
                  {render.date}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  {render.status === "completed" && (
                    <span className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs">
                      <CheckCircle size={14} />
                      Completed
                    </span>
                  )}

                  {render.status === "processing" && (
                    <span className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">
                      <RefreshCcw size={14} className="animate-spin" />
                      Processing
                    </span>
                  )}

                  {render.status === "failed" && (
                    <span className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs">
                      <XCircle size={14} />
                      Failed
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
