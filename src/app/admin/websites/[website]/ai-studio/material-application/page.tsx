"use client";

import React from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function Page() {
  const applications = [
    {
      id: 1,
      material: "Aluminium",
      application: "Facade Cladding",
      category: "Exterior",
      status: "Active",
    },
    {
      id: 2,
      material: "Glass",
      application: "Office Partition",
      category: "Interior",
      status: "Active",
    },
    {
      id: 3,
      material: "ACP Sheet",
      application: "Signage Board",
      category: "Commercial",
      status: "Inactive",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* <h1 className="text-3xl font-semibold">Material Applications</h1> */}
          <BreadCrumbPage/>
          <p className="text-gray-500 mt-1">
            Manage how materials are used across different applications
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} />
          Add Application
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold">Material</th>
              <th className="px-6 py-4 text-sm font-semibold">Application</th>
              <th className="px-6 py-4 text-sm font-semibold">Category</th>
              <th className="px-6 py-4 text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {applications.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-sm">
                  {item.material}
                </td>

                <td className="px-6 py-4 text-sm">
                  {item.application}
                </td>

                <td className="px-6 py-4 text-sm">
                  {item.category}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit3 size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE (future use) */}
        {applications.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No material applications added yet
          </div>
        )}
      </div>
    </div>
  );
}
