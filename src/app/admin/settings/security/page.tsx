import React from "react";
import { Shield, Key, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";


export default function SecurityPage() {
  const sessions = [
    { device: "Chrome on Windows", location: "New York, USA", lastActive: "2 hours ago" },
    { device: "Firefox on Mac", location: "London, UK", lastActive: "1 day ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Security Settings </h1>
            <BreadCrumbPage />


      {/* Password Change */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Key size={20} /> Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current Password"
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="password"
            placeholder="New Password"
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Shield size={20} /> Two-Factor Authentication (2FA)
        </h2>
        <p className="text-gray-600">
          Add an extra layer of security to your account by enabling 2FA.
        </p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Enable 2FA
        </button>
      </div>

      {/* Active Sessions */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <LogOut size={20} /> Active Sessions
        </h2>
        <div className="divide-y">
          {sessions.map((session, idx) => (
            <div key={idx} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{session.device}</p>
                <p className="text-gray-500 text-sm">{session.location}</p>
                <p className="text-gray-400 text-xs">Last active: {session.lastActive}</p>
              </div>
              <button className="text-red-500 hover:text-red-700 text-sm">
                Sign Out
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Login Alerts */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Bell size={20} /> Login Alerts
        </h2>
        <p className="text-gray-600">
          Receive notifications when your account is accessed from a new device.
        </p>
        <Button>
          Enable Alerts
        </Button>
      </div>
    </div>
  );
}
