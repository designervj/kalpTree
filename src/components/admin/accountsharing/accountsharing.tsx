"use client";

import Link from "next/link";
import { useState } from "react";

export function AccountSharing() {
  const [activeTab, setActiveTab] = useState("request");
  const [sharedAccounts, setSharedAccounts] = useState([
    {
      email: "mail2deepakrai@gmail.com",
      accessType: "Manage Services & Billing",
      status: "Active",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>🏠</span>
            <span>-</span>
            <span>Profile</span>
            <span>-</span>
            <span>Account Sharing</span>
          </div>
          <h1 className="text-2xl font-semibold">Account Sharing</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("request")}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "request"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                Request access
              </button>
              <button
                onClick={() => setActiveTab("grant")}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "grant"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                Grant access
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "request" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Choose this option if there is another KalpTree account you
                  would like to manage. A request email will be sent to the
                  email address.
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Request access
                </button>
              </div>
            )}

            {activeTab === "grant" && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Choose this option if there is another Hostinger account you
                  would like to manage. A request email will be sent to the
                  email address.
                </p>
                <Link href={"/admin/accountsharing/grantaccess"}>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Grant access
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Shared Accounts Table */}
        <div className="bg-white rounded-lg shadow mt-6">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">
                  Email ⇅
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Access type ⇅
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Status ⇅
                </th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody>
              {sharedAccounts.map((account, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-900">{account.email}</td>
                  <td className="p-4 text-gray-900">{account.accessType}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {account.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="text-purple-600 hover:text-purple-700 px-4 py-2 border border-purple-600 rounded-lg font-medium transition-colors">
                        Manage services
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 p-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
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
