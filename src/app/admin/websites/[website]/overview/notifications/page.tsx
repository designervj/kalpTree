"use client";

import React, { useState } from "react";
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Trash2, 
  MoreVertical,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

// Mock Notifications
const initialNotifications = [
  { id: 1, title: "Export Completed", message: "Your product catalog CSV export is ready for download.", type: "success", time: "2 mins ago", read: false },
  { id: 2, title: "High Memory Usage", message: "Server usage exceeded 85% for more than 5 minutes.", type: "warning", time: "1 hour ago", read: false },
  { id: 3, title: "New Order #7829", message: "Alice Johnson placed a new order for $1,299.00.", type: "info", time: "3 hours ago", read: true },
  { id: 4, title: "Payment Failed", message: "Subscription renewal for 'Tech Corp' failed. Retrying in 24h.", type: "error", time: "5 hours ago", read: false },
  { id: 5, title: "System Update", message: "Scheduled maintenance will occur on Sunday at 2:00 AM UTC.", type: "info", time: "1 day ago", read: true },
];

export default function page() {
  const [activeTab, setActiveTab] = useState("all");

  const getIcon = (type: string) => {
    switch(type) {
      case "success": return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "error": return <AlertTriangle className="h-5 w-5 text-red-600" />; // Or XCircle
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case "success": return "bg-green-50";
      case "warning": return "bg-amber-50";
      case "error": return "bg-red-50";
      default: return "bg-blue-50";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight">Notifications</h1> */}
          <BreadCrumbPage/>
          <p className="text-muted-foreground">Stay updated with important system events and alerts.</p>
        </div>
        <div className="flex gap-2">
            <Button size="sm">
                <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
            {/* <Button variant="outline" className="py-2">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button> */}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread" className="relative">
                    Unread
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                </TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="text-muted-foreground">
                <Filter className="mr-2 h-3.5 w-3.5" /> Filter
            </Button>
        </div>

        <TabsContent value="all" className="space-y-3">
            {initialNotifications.map((notif) => (
                <Card 
                    key={notif.id} 
                    className={`p-4 transition-all hover:shadow-sm border-l-4 ${notif.read ? 'border-l-transparent opacity-75' : 'border-l-primary bg-white shadow-sm'}`}
                >
                    <div className="flex gap-4">
                        {/* Icon Box */}
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notif.type)}`}>
                            {getIcon(notif.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-semibold ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                    {notif.title}
                                </h4>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {notif.time}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notif.message}
                            </p>
                            
                            {!notif.read && (
                                <div className="mt-3 flex gap-3">
                                    <button className="text-xs font-medium text-primary hover:underline">Review Details</button>
                                    <button className="text-xs font-medium text-muted-foreground hover:text-gray-900">Mark as Read</button>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                                <DropdownMenuItem>Archive</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Card>
            ))}
        </TabsContent>
        
        {/* Placeholder for other tabs */}
        <TabsContent value="unread">
            <div className="py-10 text-center text-muted-foreground">Filtered view: Unread notifications only.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}