"use client";

import React from "react";
import { Search, MoreHorizontal, Repeat, PauseCircle, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

const subscriptions = [
  { id: "SUB-8821", customer: "Tech Solutions Ltd", plan: "Enterprise Annual", amount: "$2,400", interval: "Yearly", status: "Active", nextBill: "Dec 20, 2025" },
  { id: "SUB-8822", customer: "John Doe", plan: "Pro Monthly", amount: "$49", interval: "Monthly", status: "Past Due", nextBill: "Retrying..." },
  { id: "SUB-8823", customer: "Jane Smith", plan: "Starter", amount: "$19", interval: "Monthly", status: "Canceled", nextBill: "-" },
];

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight text-gray-900">Subscriptions</h1> */}
          <BreadCrumbPage/>
          <p className="text-sm text-muted-foreground mt-1">Manage recurring billing cycles and subscriber status.</p>
        </div>
        <Button className="bg-primary text-white">Create Subscription</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 justify-between items-center bg-gray-50/50">
           <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                 <Input placeholder="Search subscribers..." className="pl-9 bg-white" />
           </div>
           {/* Simple Tabs for Status */}
           <div className="flex bg-white border rounded-lg p-1">
               <button className="px-3 py-1 text-xs font-medium bg-gray-100 rounded text-gray-900">All</button>
               <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">Active</button>
               <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">Canceled</button>
           </div>
        </div>

        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 font-medium">Subscription ID</th>
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium">Plan</th>
                        <th className="px-6 py-3 font-medium">Interval</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Next Billing</th>
                        <th className="px-6 py-3 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {subscriptions.map((sub) => (
                        <tr key={sub.id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{sub.id}</td>
                            <td className="px-6 py-4 font-medium">{sub.customer}</td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-medium">{sub.plan}</span>
                                    <span className="text-xs text-gray-500">{sub.amount}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 flex items-center gap-1 text-gray-600">
                                <Repeat className="w-3 h-3" /> {sub.interval}
                            </td>
                            <td className="px-6 py-4">
                                <Badge className={
                                    sub.status === 'Active' ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" :
                                    sub.status === 'Past Due' ? "bg-red-100 text-red-700 hover:bg-red-100 border-none" : "bg-gray-100 text-gray-600 border-none"
                                }>
                                    {sub.status === 'Active' && <CheckCircle2 className="w-3 h-3 mr-1"/>}
                                    {sub.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{sub.nextBill}</td>
                            <td className="px-6 py-4 text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><PauseCircle className="mr-2 h-4 w-4" /> Pause Billing</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600"><XCircle className="mr-2 h-4 w-4" /> Cancel Subscription</DropdownMenuItem>
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