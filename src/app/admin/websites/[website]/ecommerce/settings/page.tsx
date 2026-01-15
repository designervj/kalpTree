"use client";

import React, { useState } from "react";
import { Save, Globe, Hash, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function StoreSettingsPage() {
  return (
    <div className="space-y-6 max-full mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight">Store Configuration</h1> */}
          <BreadCrumbPage/>
          <p className="text-muted-foreground">Manage global settings for your e-commerce storefront.</p>
        </div>
        <Button><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
      </div>

      <div className="grid gap-6">
        {/* Store Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5"/> Store Details</CardTitle>
            <CardDescription>This information appears on invoices and emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input defaultValue="Dzinly Store" />
               </div>
               <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@dzinly.com" />
               </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Store Currency</Label>
                  <Select defaultValue="usd">
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                        <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                        <SelectItem value="inr">INR - Indian Rupee (₹)</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="utc-5">
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (US & Canada)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (US & Canada)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                        <SelectItem value="utc+5.30">New Delhi (GMT+5:30)</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Standards */}
        <Card>
           <CardHeader>
              <CardTitle className="flex items-center gap-2"><Hash className="w-5 h-5"/> Order Standards</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                    <Label className="text-base">Order ID Formatting</Label>
                    <p className="text-sm text-muted-foreground">Customize how order numbers appear (e.g., #ORD-1001)</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <Input className="w-20" placeholder="Prefix" defaultValue="ORD-" />
                    <Input className="w-20" placeholder="Suffix" />
                 </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                    <Label className="text-base">Guest Checkout</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to purchase without an account.</p>
                 </div>
                 <Switch defaultChecked />
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}