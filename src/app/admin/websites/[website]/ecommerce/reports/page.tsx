"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Calendar,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center">
         <div>
            {/* <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics & Reports</h1> */}
            <BreadCrumbPage/>
            <p className="text-sm text-muted-foreground mt-1">Deep dive into sales performance and store insights.</p>
         </div>
         <div className="flex gap-2">
             <Select defaultValue="30d">
                 <SelectTrigger className="w-[150px] bg-white"><Calendar className="mr-2 h-4 w-4 text-gray-400" /> <SelectValue /></SelectTrigger>
                 <SelectContent>
                     <SelectItem value="7d">Last 7 Days</SelectItem>
                     <SelectItem value="30d">Last 30 Days</SelectItem>
                     <SelectItem value="90d">Last Quarter</SelectItem>
                     <SelectItem value="year">Year to Date</SelectItem>
                 </SelectContent>
             </Select>
             <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Sales" value="$45,231.89" trend="+20.1%" icon={CreditCard} />
          <StatCard title="Total Orders" value="1,203" trend="+15%" icon={ShoppingBag} />
          <StatCard title="Avg. Order Value" value="$85.20" trend="-2.3%" icon={TrendingUp} positive={false} />
          <StatCard title="New Customers" value="340" trend="+8.5%" icon={Users} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales by Product</TabsTrigger>
              <TabsTrigger value="traffic">Traffic Source</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
              <Card className="col-span-4">
                  <CardHeader>
                      <CardTitle>Revenue over time</CardTitle>
                      <CardDescription>Daily revenue comparison for the selected period.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                      {/* Placeholder for Recharts Graph */}
                      <div className="h-[300px] w-full bg-gradient-to-t from-gray-50 to-white border-dashed border-2 rounded-lg flex items-center justify-center text-gray-400">
                          [Graph Visualization Area]
                      </div>
                  </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                      <CardHeader>
                          <CardTitle>Top Selling Products</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-4">
                              {[1, 2, 3, 4, 5].map((i) => (
                                  <div key={i} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="h-10 w-10 bg-gray-100 rounded-md border" />
                                          <div>
                                              <div className="text-sm font-medium">Minimalist Chair</div>
                                              <div className="text-xs text-muted-foreground">SKU-123</div>
                                          </div>
                                      </div>
                                      <div className="font-medium text-sm">$12,400</div>
                                  </div>
                              ))}
                          </div>
                      </CardContent>
                  </Card>
                  
                   <Card>
                      <CardHeader>
                          <CardTitle>Sessions by Device</CardTitle>
                      </CardHeader>
                      <CardContent>
                           <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm"><span>Mobile</span><span className="font-bold">65%</span></div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[65%]" /></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm"><span>Desktop</span><span className="font-bold">25%</span></div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[25%]" /></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm"><span>Tablet</span><span className="font-bold">10%</span></div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[10%]" /></div>
                                </div>
                           </div>
                      </CardContent>
                  </Card>
              </div>
          </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, positive = true }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={`text-xs ${positive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                    {positive ? '↑' : '↓'} {trend} from last month
                </p>
            </CardContent>
        </Card>
    );
}

// Additional import for icon
import { ShoppingBag } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
