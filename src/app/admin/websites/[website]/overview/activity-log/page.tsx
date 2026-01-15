"use client";

import React from "react";
import { Search, Filter, ShieldAlert, FileEdit, Trash2, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

const logs = [
  { id: 1, user: "Admin User", action: "Updated Product", target: "Modern Sofa v2", ip: "192.168.1.1", time: "2 mins ago", type: "update" },
  { id: 2, user: "Sarah Designer", action: "Deleted Asset", target: "hero-banner-old.jpg", ip: "10.0.0.5", time: "1 hour ago", type: "delete" },
  { id: 3, user: "System", action: "Failed Login", target: "user@example.com", ip: "45.22.19.12", time: "3 hours ago", type: "security" },
  { id: 4, user: "John Doe", action: "Logged In", target: "Admin Panel", ip: "192.168.1.42", time: "5 hours ago", type: "login" },
];

export default function ActivityLogPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
       <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1> */}
          <BreadCrumbPage/>
          <p className="text-muted-foreground">Audit trail of all actions performed within the system.</p>
        </div>
        <Button><Filter className="mr-2 h-4 w-4" /> Advanced Filters</Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
         <div className="p-4 border-b bg-gray-50/50 flex gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input placeholder="Search logs by user, action, or IP..." className="pl-9 bg-white" />
            </div>
            <Select defaultValue="all">
               <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Event Type" /></SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="crud">Data Changes</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                     <th className="px-6 py-3 font-medium">User</th>
                     <th className="px-6 py-3 font-medium">Event</th>
                     <th className="px-6 py-3 font-medium">Target Resource</th>
                     <th className="px-6 py-3 font-medium">IP Address</th>
                     <th className="px-6 py-3 font-medium text-right">Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                     <tr key={log.id} className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8  text-black text-xs">
                                 <AvatarFallback className="text-black h-8 w-8  text-white text-xs bg-primary flex justify-center items-center rounded-full ">{log.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-900">{log.user}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant="outline" className={`gap-1.5 ${
                              log.type === 'security' ? 'bg-red-50 text-red-700 border-red-200' :
                              log.type === 'delete' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              log.type === 'login' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-blue-50 text-blue-700 border-blue-200'
                           }`}>
                              {log.type === 'security' && <ShieldAlert className="w-3 h-3" />}
                              {log.type === 'delete' && <Trash2 className="w-3 h-3" />}
                              {log.type === 'login' && <LogIn className="w-3 h-3" />}
                              {log.type === 'update' && <FileEdit className="w-3 h-3" />}
                              {log.action}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{log.target}</td>
                        <td className="px-6 py-4 text-gray-500">{log.ip}</td>
                        <td className="px-6 py-4 text-right text-muted-foreground">{log.time}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}