"use client";

import React from "react";
import { Mail, User, Phone, MessageSquare } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Forms</h1>
        <p className="text-gray-500 mt-1">
          Create and manage your form submissions
        </p>
      </div>

      {/* FORM CARD */}
      <div className="max-w-3xl bg-white rounded-2xl border shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">
          Contact Form
        </h2>

        <form className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="tel"
                placeholder="Enter mobile number"
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Message
            </label>
            <div className="relative">
              <MessageSquare
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <textarea
                rows={4}
                placeholder="Write your message..."
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="reset"
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
