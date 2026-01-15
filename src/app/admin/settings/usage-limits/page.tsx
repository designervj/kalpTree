import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";
import React from "react";

export default function UsageLimitsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* <h1 className="text-2xl font-semibold">Usage & Limits 1</h1> */}
      <BreadCrumbPage />
      {/* API Usage Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium">API Usage</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-100 h-6 rounded overflow-hidden">
            <div className="bg-blue-600 h-6 w-3/4"></div>
          </div>
          <span className="text-gray-700">75 / 100 requests</span>
        </div>
      </div>

      {/* Storage Usage Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium">Storage Usage</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-100 h-6 rounded overflow-hidden">
            <div className="bg-green-600 h-6 w-2/3"></div>
          </div>
          <span className="text-gray-700">20GB / 30GB</span>
        </div>
      </div>

      {/* Team Members Limit */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium">Team Members</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-100 h-6 rounded overflow-hidden">
            <div className="bg-purple-600 h-6 w-1/2"></div>
          </div>
          <span className="text-gray-700">5 / 10 members</span>
        </div>
      </div>

      {/* Customize Limits Button */}
      <div className="flex justify-end">
        <Button>
          Upgrade Limits
        </Button>
      </div>
    </div>
  );
}
