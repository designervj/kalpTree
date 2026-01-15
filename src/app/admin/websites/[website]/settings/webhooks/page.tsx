import React from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";


export default function WebhooksPage() {
  const webhooks = [
    { id: 1, name: "New User Signup", url: "https://example.com/webhook1" },
    { id: 2, name: "Payment Success", url: "https://example.com/webhook2" },
    { id: 3, name: "Order Completed", url: "https://example.com/webhook3" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* <h1 className="text-2xl font-semibold">Webhooks 1</h1> */}
      <div className="flex items-center justify-between">
       <BreadCrumbPage />

      {/* Add New Webhook */}
      <div className="flex justify-end mb-4">
        <Button>
          <Plus size={18} />
          Add Webhook
        </Button>
      </div>
      </div>

      {/* Webhooks Table */}
      <div className="bg-white border rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">URL</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((webhook) => (
              <tr key={webhook.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{webhook.name}</td>
                <td className="p-3 text-gray-700 truncate max-w-xs">{webhook.url}</td>
                <td className="p-3 text-right flex justify-end gap-2">
                  <button className="text-gray-500 hover:text-gray-700" title="Copy URL">
                    <Copy size={16} />
                  </button>
                  <button className="text-red-500 hover:text-red-700" title="Delete">
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
