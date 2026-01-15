"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Calendar,
  ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

// --- Mock Data ---
const orders = [
  { id: "ORD-7829", customer: "Alice Johnson", date: "2025-12-17", total: "$1,299.00", status: "Processing", payment: "Paid", items: 3 },
  { id: "ORD-7830", customer: "Mark Smith", date: "2025-12-16", total: "$89.50", status: "Shipped", payment: "Paid", items: 1 },
  { id: "ORD-7831", customer: "Elena Rodriguez", date: "2025-12-16", total: "$450.00", status: "Delivered", payment: "Paid", items: 2 },
  { id: "ORD-7832", customer: "Tech Corp Inc.", date: "2025-12-15", total: "$2,400.00", status: "Cancelled", payment: "Refunded", items: 10 },
  { id: "ORD-7833", customer: "John Doe", date: "2025-12-15", total: "$120.00", status: "Pending", payment: "Unpaid", items: 1 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Processing": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Processing</Badge>;
    case "Shipped": return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200">Shipped</Badge>;
    case "Delivered": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Delivered</Badge>;
    case "Cancelled": return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Cancelled</Badge>;
    default: return <Badge variant="secondary">Pending</Badge>;
  }
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1> */}
          <BreadCrumbPage/>
          <p className="text-sm text-muted-foreground mt-1">Manage and track customer orders across all channels.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-9"><Download className="mr-2 h-4 w-4" /> Export</Button>
           <Button size="sm" className="h-9 bg-primary text-white">Create Order</Button>
        </div>
      </div>

      {/* KPI Cards (Quick Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
            { label: "Total Revenue", value: "$45,231.89", trend: "+20.1%", positive: true },
            { label: "Orders (30d)", value: "+2,350", trend: "+180.1%", positive: true },
            { label: "Pending Orders", value: "12", trend: "-4", positive: true },
            { label: "Refund Rate", value: "1.2%", trend: "+0.2%", positive: false },
        ].map((stat, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                <div className="text-2xl font-bold mt-2 text-gray-900">{stat.value}</div>
                <div className={`text-xs mt-1 ${stat.positive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                    {stat.positive ? '↑' : '↓'} {stat.trend} from last month
                </div>
            </div>
        ))}
      </div>

      {/* Main Content Area: Table with Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
           {/* Search & Filter Group */}
           <div className="flex flex-1 w-full sm:w-auto gap-2">
              <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                 <Input placeholder="Search orders, customers..." className="pl-9 bg-white border-gray-200" />
              </div>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="bg-white border-gray-200 text-gray-700">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
                          <DropdownMenuItem key={s}>
                             <Checkbox className="mr-2 h-4 w-4" /> {s}
                          </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
              </DropdownMenu>
              <Select defaultValue="7d">
                  <SelectTrigger className="w-[140px] bg-white border-gray-200">
                     <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                     <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
              </Select>
           </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
           <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                 <tr>
                    <th className="px-6 py-3 font-medium w-10"><Checkbox /></th>
                    <th className="px-6 py-3 font-medium">Order ID</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Payment</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                    <th className="px-6 py-3 font-medium text-center">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {orders.map((order) => (
                    <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                       <td className="px-6 py-4"><Checkbox onClick={(e) => e.stopPropagation()} /></td>
                       <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                       <td className="px-6 py-4 text-gray-500">{order.date}</td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                {order.customer.charAt(0)}
                             </div>
                             <span className="font-medium text-gray-700">{order.customer}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                              order.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 
                              order.payment === 'Refunded' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-700'
                          }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                  order.payment === 'Paid' ? 'bg-emerald-500' : 
                                  order.payment === 'Refunded' ? 'bg-gray-500' : 'bg-amber-500'
                              }`} />
                              {order.payment}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right font-semibold text-gray-900">{order.total}</td>
                       <td className="px-6 py-4 text-center">
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700" onClick={(e) => e.stopPropagation()}>
                                   <MoreHorizontal className="h-4 w-4" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                                   <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem><Truck className="mr-2 h-4 w-4" /> Mark Shipped</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600"><XCircle className="mr-2 h-4 w-4" /> Cancel Order</DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Pagination Footer (Matching existing design) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
           <span className="text-xs text-gray-500">Showing 1-10 of 2,350 orders</span>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
           </div>
        </div>
      </div>

      {/* Order Details Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
         <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader className="mb-6">
               <div className="flex items-center gap-3 mb-2">
                   <SheetTitle className="text-xl">Order #{selectedOrder?.id}</SheetTitle>
                   {selectedOrder && getStatusBadge(selectedOrder.status)}
               </div>
               <SheetDescription>
                   Placed on {selectedOrder?.date} by {selectedOrder?.customer}
               </SheetDescription>
            </SheetHeader>
            
            {/* Sheet Content */}
            <div className="space-y-8">
                {/* Items List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Items</h3>
                    <div className="border rounded-lg divide-y">
                        {[1, 2].map((i) => (
                            <div key={i} className="p-3 flex gap-4 items-center">
                                <div className="h-12 w-12 bg-gray-100 rounded-md border" />
                                <div className="flex-1">
                                    <div className="font-medium text-sm">Modern Sofa - Grey</div>
                                    <div className="text-xs text-muted-foreground">Variant: 3-Seater</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-sm">$450.00</div>
                                    <div className="text-xs text-muted-foreground">Qty: 1</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between pt-2 border-t mt-4">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-lg">{selectedOrder?.total}</span>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide mb-3">Shipping Address</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>{selectedOrder?.customer}</p>
                            <p>123 Innovation Dr.</p>
                            <p>Suite 400</p>
                            <p>San Francisco, CA 94103</p>
                            <p>United States</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide mb-3">Billing Address</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>Same as shipping</p>
                        </div>
                    </div>
                </div>

                {/* Timeline / Actions */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-sm mb-3">Order Actions</h3>
                    <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline"><Truck className="mr-2 h-3.5 w-3.5"/> Fulfill Item</Button>
                        <Button size="sm" variant="outline"><Download className="mr-2 h-3.5 w-3.5"/> Invoice</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">Refund</Button>
                    </div>
                </div>
            </div>
         </SheetContent>
      </Sheet>
    </div>
  );
}