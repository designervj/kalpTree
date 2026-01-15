"use client";

import React from "react";
import {
  Clock,
  User,
  Shield,
  Trash2,
  Filter,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const logs = [
    {
      id: 1,
      user: "Admin",
      action: "Logged in",
      module: "Authentication",
      time: "10 Sep 2025, 10:32 AM",
      status: "Success",
    },
    {
      id: 2,
      user: "Deepak Rai",
      action: "Updated page",
      module: "Pages",
      time: "10 Sep 2025, 11:10 AM",
      status: "Success",
    },
    {
      id: 3,
      user: "Admin",
      action: "Deleted media",
      module: "Media",
      time: "10 Sep 2025, 12:05 PM",
      status: "Warning",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        {/* <h1 className="text-3xl font-semibold">Activity Logs</h1> */}
        <BreadCrumbPage/>
        <p className="text-gray-500 mt-1">
          Track all user and system activities
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters</span>
        </div>

        {/* <select className="border rounded-lg px-3 py-2 text-sm">
          <option>All Users</option>
          <option>Admin</option>
          <option>Editor</option>
        </select> */}

         <Select defaultValue="all">
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select module" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="admin">Pages</SelectItem>
            <SelectItem value="editor">Media</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>

          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select module" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>

        {/* <select className="border rounded-lg px-3 py-2 text-sm">
          <option>All Modules</option>
          <option>Pages</option>
          <option>Media</option>
          <option>Settings</option>
        </select>

        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>All Status</option>
          <option>Success</option>
          <option>Warning</option>
        </select> */}
      </div>

      {/* LOGS TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-5 py-3">User</th>
              <th className="text-left px-5 py-3">Action</th>
              <th className="text-left px-5 py-3">Module</th>
              <th className="text-left px-5 py-3">Time</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-5 py-4 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  {log.user}
                </td>

                <td className="px-5 py-4">{log.action}</td>

                <td className="px-5 py-4 flex items-center gap-2">
                  <Shield size={16} className="text-gray-400" />
                  {log.module}
                </td>

                <td className="px-5 py-4 flex items-center gap-2 text-gray-500">
                  <Clock size={16} />
                  {log.time}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
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
