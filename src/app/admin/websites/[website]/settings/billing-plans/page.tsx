import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";
import React from "react";

export default function BillingPlansPage() {
  return (
    <div className="p-6 space-y-6">
      {/* <h1 className="text-2xl font-semibold">Billing & Plans</h1> */}
               <BreadCrumbPage />
      

      {/* Current Plan Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium">Current Plan</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-700">Pro Plan</p>
            <p className="text-gray-500 text-sm">Next billing date: 30 Dec 2025</p>
          </div>
          <Button variant="secondary">
            Change Plan
          </Button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium">Payment Methods</h2>
        <div className="flex justify-between items-center border-b py-2">
          <div>
            <p className="text-gray-700">Visa **** 1234</p>
            <p className="text-gray-500 text-sm">Expiry: 12/26</p>
          </div>
          <button className="text-red-500">Remove</button>
        </div>
        <Button>
          Add Payment Method
        </Button>
      </div>

      {/* Billing History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-3">Billing History</h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "01 Dec 2025", plan: "Pro Plan", amount: "$29", status: "Paid" },
              { date: "01 Nov 2025", plan: "Pro Plan", amount: "$29", status: "Paid" },
              { date: "01 Oct 2025", plan: "Basic Plan", amount: "$15", status: "Paid" },
            ].map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.date}</td>
                <td className="p-3">{item.plan}</td>
                <td className="p-3">{item.amount}</td>
                <td className="p-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
