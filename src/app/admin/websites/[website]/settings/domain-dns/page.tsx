"use client";

import React from "react";
import { Globe, Plus, Trash2 } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";

export default function Page() {
  const dnsRecords = [
    {
      id: 1,
      type: "A",
      name: "@",
      value: "192.168.1.1",
      ttl: "Auto",
    },
    {
      id: 2,
      type: "CNAME",
      name: "www",
      value: "yourdomain.com",
      ttl: "Auto",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <BreadCrumbPage />
        <p className="text-gray-500 mt-1">
          Manage your domain and DNS records
        </p>
      </div>

      {/* DOMAIN INFO CARD */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-purple-600" />
          <h2 className="text-2xl font-bold tracking-tight">Connected Domain</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Domain Name</p>
            <p className="font-medium">example.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Active
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">SSL</p>
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              Enabled
            </span>
          </div>
        </div>
      </div>

      {/* DNS RECORDS */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">DNS Records</h2>
          <Button >
            <Plus size={18} />
            Add Record
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-100 text-sm">
                <th className="p-3">Type</th>
                <th className="p-3">Name</th>
                <th className="p-3">Value</th>
                <th className="p-3">TTL</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {dnsRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">{record.type}</td>
                  <td className="p-3">{record.name}</td>
                  <td className="p-3">{record.value}</td>
                  <td className="p-3">{record.ttl}</td>
                  <td className="p-3 text-right">
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
