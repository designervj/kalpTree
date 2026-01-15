"use client";

import React from "react";
import { Activity, Database, Server, Globe, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function page() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight">System Health</h1> */}
          <BreadCrumbPage/>
          <p className="text-muted-foreground">Monitor service status, API latency, and database uptime.</p>
        </div>
        <Button ><RefreshCw className="mr-2 h-4 w-4" /> Refresh Status</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Overall Status */}
         <Card className="md:col-span-3 bg-green-50 border-green-200">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
               </div>
               <div>
                  <h3 className="text-lg font-semibold text-green-900">All Systems Operational</h3>
                  <p className="text-green-700">No incidents reported in the last 24 hours.</p>
               </div>
            </CardContent>
         </Card>

         {/* Services */}
         <StatusCard 
            title="API Server" 
            status="Operational" 
            uptime="99.99%" 
            latency="45ms" 
            icon={Server} 
         />
         <StatusCard 
            title="Database Cluster" 
            status="Operational" 
            uptime="99.95%" 
            latency="12ms" 
            icon={Database} 
         />
         <StatusCard 
            title="CDN & Assets" 
            status="Degraded" 
            uptime="98.50%" 
            latency="120ms" 
            icon={Globe} 
            warning 
         />
      </div>

      {/* Resource Usage */}
      <h2 className="text-lg font-semibold mt-4">Resource Usage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">CPU Load (Average)</CardTitle></CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">24%</div>
               <div className="h-2 w-full bg-gray-100 rounded-full mt-2"><div className="h-full bg-blue-500 w-[24%] rounded-full"/></div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Memory Usage</CardTitle></CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">62%</div>
               <div className="h-2 w-full bg-gray-100 rounded-full mt-2"><div className="h-full bg-purple-500 w-[62%] rounded-full"/></div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function StatusCard({ title, status, uptime, latency, icon: Icon, warning }: any) {
   return (
      <Card>
         <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg"><Icon className="h-5 w-5 text-gray-600" /></div>
                  <span className="font-semibold">{title}</span>
               </div>
               {warning ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse"><AlertTriangle className="w-3 h-3 mr-1"/> Issues</Badge>
               ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Healthy</Badge>
               )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div>
                  <div className="text-muted-foreground">Uptime</div>
                  <div className="font-medium">{uptime}</div>
               </div>
               <div>
                  <div className="text-muted-foreground">Latency</div>
                  <div className="font-medium">{latency}</div>
               </div>
            </div>
         </CardContent>
      </Card>
   )
}