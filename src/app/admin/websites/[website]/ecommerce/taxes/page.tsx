"use client";

import React from "react";
import { Calculator, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function TaxesPage() {
  return (
    <div className="space-y-6 max-full mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold tracking-tight">Taxes & Duties</h1> */}
          <BreadCrumbPage/>
          <p className="text-muted-foreground">Configure how taxes are collected at checkout.</p>
        </div>
      </div>

      <div className="grid gap-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5"/> Tax Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <Label className="text-base">All prices include tax</Label>
                     <p className="text-sm text-muted-foreground">If enabled, taxes are calculated backwards from the listing price.</p>
                  </div>
                  <Switch />
               </div>
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <Label className="text-base">Charge tax on shipping rates</Label>
                     <p className="text-sm text-muted-foreground">Apply local tax rates to the shipping fee.</p>
                  </div>
                  <Switch defaultChecked />
               </div>
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <Label className="text-base">Digital Goods VAT</Label>
                     <p className="text-sm text-muted-foreground">Apply EU VAT rules for digital services.</p>
                  </div>
                  <Switch />
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>Regional Tax Rates</CardTitle>
               <CardDescription>Override global settings for specific countries or states.</CardDescription>
            </CardHeader>
            <CardContent>
               <Alert className="mb-6 bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Automated Tax</AlertTitle>
                  <AlertDescription className="text-blue-700">
                     We automatically calculate sales tax for US, Canada, EU, and UK based on customer address.
                  </AlertDescription>
               </Alert>

               <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg">
                     <div className="col-span-5 space-y-2">
                        <Label>Country / Region</Label>
                        <Input defaultValue="United States" readOnly className="bg-gray-50" />
                     </div>
                     <div className="col-span-3 space-y-2">
                        <Label>Tax Name</Label>
                        <Input defaultValue="Sales Tax" />
                     </div>
                     <div className="col-span-2 space-y-2">
                        <Label>Rate (%)</Label>
                        <Input defaultValue="Auto" readOnly className="bg-gray-50" />
                     </div>
                     <div className="col-span-2">
                        <Button variant="outline" className="w-full">Edit</Button>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg">
                     <div className="col-span-5 space-y-2">
                        <Label>Country / Region</Label>
                        <Input defaultValue="Rest of World" readOnly className="bg-gray-50" />
                     </div>
                     <div className="col-span-3 space-y-2">
                        <Label>Tax Name</Label>
                        <Input placeholder="e.g. VAT" />
                     </div>
                     <div className="col-span-2 space-y-2">
                        <Label>Rate (%)</Label>
                        <Input placeholder="0" />
                     </div>
                     <div className="col-span-2">
                        <Button variant="secondary" className="w-full">Save</Button>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}