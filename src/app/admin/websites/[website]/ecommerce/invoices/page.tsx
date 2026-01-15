"use client";

import React from "react";
import { Search, Filter, Download, MoreHorizontal, FileText, Send } from "lucide-react";
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

const invoices = [
  { id: "INV-2024-001", customer: "Alice Johnson", date: "Dec 17, 2025", dueDate: "Dec 17, 2025", amount: "$1,299.00", status: "Paid" },
  { id: "INV-2024-002", customer: "Mark Smith", date: "Dec 16, 2025", dueDate: "Jan 16, 2026", amount: "$89.50", status: "Outstanding" },
  { id: "INV-2024-003", customer: "Tech Corp Inc.", date: "Dec 15, 2025", dueDate: "Dec 15, 2025", amount: "$2,400.00", status: "Void" },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight text-gray-900">Invoices</h1> */}
          <BreadCrumbPage/>
          <p className="text-sm text-muted-foreground mt-1">History of all generated invoices and their payment status.</p>
          <p className="text-sm text-muted-foreground mt-1">History of all generated invoices and their payment status.</p>
        </div>
        <Button ><Download className="mr-2 h-4 w-4" /> Export Report</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 justify-between items-center bg-gray-50/50">
           <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                 <Input placeholder="Search invoice #..." className="pl-9 bg-white" />
           </div>
           <Button variant="outline" className="bg-white"><Filter className="mr-2 h-4 w-4" /> Filter Date</Button>
        </div>

        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 font-medium">Invoice</th>
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium">Issue Date</th>
                        <th className="px-6 py-3 font-medium">Due Date</th>
                        <th className="px-6 py-3 font-medium">Amount</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {invoices.map((inv) => (
                        <tr key={inv.id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-900">{inv.id}</span>
                            </td>
                            <td className="px-6 py-4">{inv.customer}</td>
                            <td className="px-6 py-4 text-gray-500">{inv.date}</td>
                            <td className="px-6 py-4 text-gray-500">{inv.dueDate}</td>
                            <td className="px-6 py-4 font-semibold">{inv.amount}</td>
                            <td className="px-6 py-4">
                                <Badge variant="outline" className={
                                    inv.status === 'Paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    inv.status === 'Outstanding' ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-100 text-gray-600"
                                }>
                                    {inv.status}
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
                                        <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download PDF</DropdownMenuItem>
                                        <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Resend Email</DropdownMenuItem>
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