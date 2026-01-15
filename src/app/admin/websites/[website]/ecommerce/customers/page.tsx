"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin,
  User,
  ShoppingBag,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

const customers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", orders: 12, spent: "$1,299.00", lastOrder: "2 days ago", group: "VIP" },
  { id: 2, name: "Mark Smith", email: "mark.s@example.com", orders: 1, spent: "$89.50", lastOrder: "5 days ago", group: "New" },
  { id: 3, name: "Elena Rodriguez", email: "elena@test.com", orders: 5, spent: "$450.00", lastOrder: "1 week ago", group: "Returning" },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1> */}
          <BreadCrumbPage/>
          <p className="text-sm text-muted-foreground mt-1">View and manage your customer base and segments.</p>
        </div>
        <Button className="bg-primary text-white">Add Customer</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex gap-4 justify-between items-center bg-gray-50/50">
           <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                 <Input placeholder="Search by name, email, or phone..." className="pl-9 bg-white border-gray-200" />
           </div>
           <div className="flex gap-2">
                <Button variant="outline" className="bg-white"><Filter className="mr-2 h-4 w-4" /> Segments</Button>
                <Button variant="outline" className="bg-white">More Actions</Button>
           </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium">Segment</th>
                        <th className="px-6 py-3 font-medium">Orders</th>
                        <th className="px-6 py-3 font-medium">Total Spent</th>
                        <th className="px-6 py-3 font-medium">Last Active</th>
                        <th className="px-6 py-3 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {customers.map((customer) => (
                        <tr key={customer.id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-gray-900">{customer.name}</div>
                                        <div className="text-xs text-gray-500">{customer.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant="outline" className={
                                    customer.group === 'VIP' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                    customer.group === 'New' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700"
                                }>{customer.group}</Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{customer.orders} orders</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{customer.spent}</td>
                            <td className="px-6 py-4 text-gray-500">{customer.lastOrder}</td>
                            <td className="px-6 py-4 text-center">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
           <span className="text-xs text-gray-500">Showing 1-10 of 124 customers</span>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
           </div>
        </div>
      </div>
    </div>
  );
}