"use client";

import React from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const redirects = [
    {
      id: 1,
      from: "/old-page",
      to: "/new-page",
      type: "301",
    },
    {
      id: 2,
      from: "/blog-old",
      to: "/blog",
      type: "302",
    },
  ];

  return (
    <div className="min-h-screen  p-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* <h1 className="text-3xl font-semibold">Redirects</h1> */}
          <BreadCrumbPage />
          <p className="text-gray-500 mt-1">
            Manage URL redirects for your website 
          </p>
        </div>

       <Link href="/admin/website/redirects/create">
       <Button >
          <Plus size={18} />
          Add Redirect 
        </Button></Link>
      </div>

     

      {/* REDIRECTS TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">From</th>
              <th className="text-left px-4 py-3">To</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-right px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {redirects.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-gray-700">
                  {item.from}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {item.to}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.type === "301"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
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
