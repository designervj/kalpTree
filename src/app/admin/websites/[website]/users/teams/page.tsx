"use client";

import React from "react";
import {
  Users,
  Plus,
  MoreVertical,
  Shield,
  Mail,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";

export default function Page() {
  const teams = [
    {
      id: 1,
      name: "Deepak Rai",
      email: "deepak@gmail.com",
      role: "Admin",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      role: "Editor",
    },
    {
      id: 3,
      name: "Ankit Verma",
      email: "ankit@gmail.com",
      role: "Viewer",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
        <BreadCrumbPage/>
          <p className="text-gray-500 mt-1">
            Manage team members and their roles
          </p>
        </div>

        <Button >
          <Plus size={18} />
          Add Member
        </Button>
      </div>

      {/* TEAM LIST */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-600">
                Member
              </th>
              <th className="p-4 text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="p-4 text-sm font-medium text-gray-600">
                Role
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody>
            {teams.map((member) => (
              <tr
                key={member.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Users size={18} />
                  </div>
                  <span className="font-medium">
                    {member.name}
                  </span>
                </td>

                <td className="p-4 text-gray-600 flex items-center gap-2">
                  <Mail size={16} />
                  {member.email}
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                      ${
                        member.role === "Admin"
                          ? "bg-red-100 text-red-600"
                          : member.role === "Editor"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-200 text-gray-600"
                      }
                    `}
                  >
                    <Shield size={14} />
                    {member.role}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical size={18} />
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
