"use client";

import React from "react";
import { 
  Plus, 
  Zap, 
  UserPlus, 
  ShoppingBag, 
  FileText, 
  RefreshCcw, 
  Database, 
  Mail, 
  Shield, 
  Globe,
  UploadCloud,
  Eraser
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function page() {
  const actions = [
    {
      category: "Content & Catalog",
      items: [
        { label: "Add Product", icon: ShoppingBag, desc: "Create a new product listing", color: "text-blue-600 bg-blue-50" },
        { label: "New Blog Post", icon: FileText, desc: "Write and publish an article", color: "text-indigo-600 bg-indigo-50" },
        { label: "Upload Media", icon: UploadCloud, desc: "Bulk upload images/assets", color: "text-pink-600 bg-pink-50" },
      ]
    },
    {
      category: "Store Operations",
      items: [
        { label: "Create Order", icon: Plus, desc: "Manually draft a new order", color: "text-green-600 bg-green-50" },
        { label: "Issue Refund", icon: RefreshCcw, desc: "Process a return or refund", color: "text-orange-600 bg-orange-50" },
        { label: "Send Email", icon: Mail, desc: "Compose newsletter to segment", color: "text-purple-600 bg-purple-50" },
      ]
    },
    {
      category: "System Maintenance",
      items: [
        { label: "Clear Cache", icon: Eraser, desc: "Purge CDN and app cache", color: "text-red-600 bg-red-50" },
        { label: "Backup Data", icon: Database, desc: "Trigger manual DB snapshot", color: "text-slate-600 bg-slate-50" },
        { label: "Deploy Site", icon: Globe, desc: "Push changes to live production", color: "text-cyan-600 bg-cyan-50" },
      ]
    },
    {
      category: "User Management",
      items: [
        { label: "Invite User", icon: UserPlus, desc: "Send email invitation to team", color: "text-teal-600 bg-teal-50" },
        { label: "Review Roles", icon: Shield, desc: "Audit permission access", color: "text-yellow-600 bg-yellow-50" },
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight">Quick Actions</h1> */}
          <BreadCrumbPage/>
          <p className="text-muted-foreground">Shortcuts for your most frequent administrative tasks.</p>
        </div>
        <Button variant="secondary" className="bg-primary text-white hover:bg-secondary text-sm"><Zap className="mr-0 h-4 w-4" /> Customize Shortcuts</Button>
      </div>

      <div className="grid gap-6">
        {actions.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {section.category}
              <div className="h-px bg-gray-200 flex-1 ml-2" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.items.map((action, i) => (
                <Card 
                  key={i} 
                  className="hover:shadow-md transition-all cursor-pointer group border-gray-200 hover:border-primary/50 relative overflow-hidden"
                >
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        {action.label}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {action.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}