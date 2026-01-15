"use client";

import React from "react";
import { 
  BarChart3, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download, 
  MousePointerClick,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function page() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
               <BreadCrumbPage/>
          {/* <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1> */}
          <p className="text-muted-foreground">Real-time insights into your platform's performance.</p>
        </div>
        <div className="flex gap-2">
           <Select defaultValue="30d">
              <SelectTrigger className="w-[140px] bg-white">
                 <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                 <SelectValue />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="24h">Last 24 Hours</SelectItem>
                 <SelectItem value="7d">Last 7 Days</SelectItem>
                 <SelectItem value="30d">Last 30 Days</SelectItem>
                 <SelectItem value="90d">Last Quarter</SelectItem>
              </SelectContent>
           </Select>
           <Button ><Download className="mr-2 h-4 w-4" /> Export Report</Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Visitors" value="128,430" trend="+12.5%" icon={Users} positive />
        <KPICard title="Bounce Rate" value="42.3%" trend="-2.1%" icon={ArrowDownRight} positive />
        <KPICard title="Avg. Session" value="4m 32s" trend="+18s" icon={Clock} positive />
        <KPICard title="Total Clicks" value="1.2M" trend="-5.4%" icon={MousePointerClick} positive={false} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Chart */}
         <Card className="lg:col-span-2">
            <CardHeader>
               <CardTitle>Traffic Overview</CardTitle>
               <CardDescription>Daily unique visitors vs page views.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-[350px] w-full bg-gradient-to-t from-gray-50 to-white border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="w-10 h-10 mb-2 opacity-20" />
                  <span>Interactive Graph Visualization Placeholder</span>
               </div>
            </CardContent>
         </Card>

         {/* Side Stats */}
         <Card>
            <CardHeader>
               <CardTitle>Top Devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Desktop</span><span className="font-bold">52%</span></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 w-[52%]"/></div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Mobile</span><span className="font-bold">38%</span></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[38%]"/></div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Tablet</span><span className="font-bold">10%</span></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 w-[10%]"/></div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, positive }: any) {
   return (
      <Card>
         <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
               <span className="text-sm font-medium text-muted-foreground">{title}</span>
               <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <p className={`text-xs flex items-center mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
               {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
               {trend} vs last period
            </p>
         </CardContent>
      </Card>
   )
}