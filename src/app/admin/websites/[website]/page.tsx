"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ShoppingBag,
  Clock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import ColorPaletteGenerator from "./branding/typography/ColorsPallet";

// --- Mock Data for Chart ---
const chartData = [
  { name: "Mon", total: 1200 },
  { name: "Tue", total: 2100 },
  { name: "Wed", total: 1800 },
  { name: "Thu", total: 2400 },
  { name: "Fri", total: 3200 },
  { name: "Sat", total: 3800 },
  { name: "Sun", total: 4200 },
];

export default function DashboardPage() {
  return (
    <>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <BreadCrumbPage />

          <p className="text-muted-foreground mt-1">
            Overview of your store's performance and AI usage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[160px] bg-white">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
            <ArrowDownRight className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <KPICard
          title="Total Revenue"
          value="$45,231.89"
          trend="+20.1%"
          positive={true}
          icon={CreditCard}
          desc="from last month"
        />
        <KPICard
          title="Active Subscriptions"
          value="+2,350"
          trend="+180.1%"
          positive={true}
          icon={Users}
          desc="new users"
        />
        <KPICard
          title="AI Generations"
          value="12,234"
          trend="+19%"
          positive={true}
          icon={Sparkles}
          desc="images rendered"
        />
        <KPICard
          title="Active Orders"
          value="573"
          trend="-24"
          positive={false}
          icon={ShoppingBag}
          desc="since last hour"
        />
      </div>

      {/* Main Grid: Charts vs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Charts & Tables) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Daily revenue performance over the last 7 days.
                </CardDescription>
              </div>
              <Tabs defaultValue="revenue" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="traffic">Traffic</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pl-0">
              <div
                className="h-[350px] w-full pt-4"
                style={{ minHeight: "350px", minWidth: "100%" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0f172a"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0f172a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                      formatter={(value: number) => [`$${value}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#0f172a"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders List */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  You have 12 pending orders today.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                View All Orders
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    id: "ORD-721",
                    user: "Olivia Martin",
                    amount: "$1,999.00",
                    status: "Paid",
                    img: "OM",
                  },
                  {
                    id: "ORD-722",
                    user: "Jackson Lee",
                    amount: "$39.00",
                    status: "Pending",
                    img: "JL",
                  },
                  {
                    id: "ORD-723",
                    user: "Isabella Nguyen",
                    amount: "$299.00",
                    status: "Processing",
                    img: "IN",
                  },
                  {
                    id: "ORD-724",
                    user: "William Kim",
                    amount: "$99.00",
                    status: "Paid",
                    img: "WK",
                  },
                  {
                    id: "ORD-725",
                    user: "Sofia Davis",
                    amount: "$39.00",
                    status: "Failed",
                    img: "SD",
                  },
                ].map((order, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-9 w-9 border rounded-full flex items-center justify-center bg-slate-50">
                        <AvatarFallback className="text-xs font-medium text-slate-600 bg-slate-50">
                          {order.img}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none group-hover:text-blue-600 transition-colors cursor-pointer">
                          {order.user}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge
                        variant="secondary"
                        className={`w-20 justify-center ${order.status === "Paid"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : order.status === "Pending"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            : order.status === "Failed"
                              ? "bg-red-100 text-red-700 hover:bg-red-100"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          }`}
                      >
                        {order.status}
                      </Badge>
                      <div className="font-semibold text-sm w-[70px] text-right">
                        {order.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (AI & Activity) */}
        <div className="space-y-6">
          {/* Premium AI Credits Card */}

          {/* Recent Renders (Grid) */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Renders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group cursor-pointer"
                  >
                    {/* IMAGE */}
                    <img
                      src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/Kaitlin_L_Reformatted.png"
                      alt={`Image ${i}`}
                      className="h-full w-full object-cover"
                    />

                    {/* PLACEHOLDER TEXT */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
                      {/* <span className="text-xs font-medium">Image {i}</span> */}
                    </div>

                    {/* HOVER OVERLAY WITH ICON */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full shadow-lg"
                      >
                        <ArrowUpRight className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-xs">
                View Gallery
              </Button>
            </CardContent>
          </Card>

          {/* Activity Timeline */}

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-2 space-y-6">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200" />

                {[
                  {
                    title: "New Product Published",
                    desc: "Modern Velvet Sofa added to catalog.",
                    time: "10m ago",
                    icon: ShoppingBag,
                    color: "bg-blue-500",
                  },
                  {
                    title: "System Alert",
                    desc: "High traffic detected on checkout.",
                    time: "45m ago",
                    icon: TrendingUp,
                    color: "bg-amber-500",
                  },
                  {
                    title: "User Signup",
                    desc: "New enterprise user registered.",
                    time: "2h ago",
                    icon: Users,
                    color: "bg-green-500",
                  },
                  {
                    title: "Backup Completed",
                    desc: "Daily database snapshot saved.",
                    time: "5h ago",
                    icon: Clock,
                    color: "bg-slate-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 relative z-10">
                    <div
                      className={`mt-0.5 h-6 w-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0 ${item.color}`}
                    >
                      <item.icon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}


// Reusable KPI Card Component
function KPICard({ title, value, trend, positive, icon: Icon, desc }: any) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className="text-xs flex items-center mt-1 text-muted-foreground">
          <span
            className={`${positive ? "text-green-600" : "text-red-600"} flex items-center font-medium mr-1`}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            )}
            {trend}
          </span>
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}
