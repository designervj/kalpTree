"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Clock, 
  ShoppingCart,
  ArrowRight,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

const abandonedCarts = [
  { id: "AC-1023", customer: "Guest (john.doe@gmail.com)", items: 3, total: "$120.00", time: "2 hours ago", status: "Not Sent" },
  { id: "AC-1022", customer: "Sarah Connor", items: 1, total: "$850.00", time: "5 hours ago", status: "Sent" },
  { id: "AC-1021", customer: "Kyle Reese", items: 5, total: "$45.50", time: "1 day ago", status: "Recovered" },
];

export default function AbandonedCartsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight text-gray-900">Abandoned Carts</h1> */}
          <BreadCrumbPage/>
          <p className="text-sm text-muted-foreground mt-1">Review carts left behind and trigger recovery emails.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Settings</Button>
            <Button>Recover All (3)</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="text-sm text-muted-foreground">Abandonment Rate</div>
            <div className="text-2xl font-bold mt-1">68.5%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="text-sm text-muted-foreground">Recoverable Revenue</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">$12,450.00</div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="text-sm text-muted-foreground">Recovery Rate</div>
            <div className="text-2xl font-bold mt-1 text-green-600">12.4%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex gap-4 justify-between items-center bg-gray-50/50">
           <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                 <Input placeholder="Search carts..." className="pl-9 bg-white" />
           </div>
           <Button variant="outline" className="bg-white"><Filter className="mr-2 h-4 w-4" /> Filter Status</Button>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 font-medium">Cart ID</th>
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium">Items</th>
                        <th className="px-6 py-3 font-medium">Total Value</th>
                        <th className="px-6 py-3 font-medium">Time Elapsed</th>
                        <th className="px-6 py-3 font-medium">Recovery Status</th>
                        <th className="px-6 py-3 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {abandonedCarts.map((cart) => (
                        <tr key={cart.id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs">{cart.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[10px]">{cart.customer.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="truncate max-w-[200px]">{cart.customer}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">{cart.items} items</td>
                            <td className="px-6 py-4 font-semibold">{cart.total}</td>
                            <td className="px-6 py-4 text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {cart.time}
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant="secondary" className={
                                    cart.status === 'Recovered' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                    cart.status === 'Sent' ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "bg-gray-100 text-gray-600"
                                }>
                                    {cart.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Send Email</DropdownMenuItem>
                                        <DropdownMenuItem><ShoppingCart className="mr-2 h-4 w-4" /> View Cart</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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