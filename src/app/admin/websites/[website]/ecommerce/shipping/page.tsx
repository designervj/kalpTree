"use client";

import React from "react";
import { Truck, Map, Box, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ShippingPage() {
  return (
    <div className="space-y-6 max-full mx-auto pb-10">
      <div>
         {/* <h1 className="text-2xl font-bold tracking-tight">Shipping & Delivery</h1> */}
         <BreadCrumbPage/>
         <p className="text-muted-foreground">Manage where you ship and how much you charge.</p>
      </div>

      <div className="grid gap-6">
         {/* Shipping Zones */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="flex items-center gap-2"><Map className="w-5 h-5"/> Shipping Zones</CardTitle>
                  <CardDescription>Rates are calculated based on customer address.</CardDescription>
               </div>
               <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Create Zone</Button>
            </CardHeader>
            <CardContent className="space-y-0 divide-y">
               {/* Zone Item */}
               <div className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                     <div className="font-semibold flex items-center gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground" /> Domestic (US)
                     </div>
                     <div className="text-sm text-muted-foreground mt-1">50 States, 1 Territory</div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-right">
                     <span className="font-medium">Standard: Free</span>
                     <span className="text-muted-foreground">Express: $15.00</span>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
               </div>
               {/* Zone Item */}
               <div className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                     <div className="font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" /> International
                     </div>
                     <div className="text-sm text-muted-foreground mt-1">Canada, UK, Australia</div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-right">
                     <span className="font-medium">Flat Rate: $25.00</span>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
               </div>
            </CardContent>
         </Card>

         {/* Package Dimensions */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Box className="w-5 h-5"/> Standard Package</CardTitle>
               <CardDescription>Used to calculate calculated shipping rates at checkout.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                     <Label>Length (cm)</Label>
                     <Input placeholder="30" />
                  </div>
                  <div className="space-y-2">
                     <Label>Width (cm)</Label>
                     <Input placeholder="20" />
                  </div>
                  <div className="space-y-2">
                     <Label>Height (cm)</Label>
                     <Input placeholder="10" />
                  </div>
                  <div className="space-y-2">
                     <Label>Weight (kg)</Label>
                     <Input placeholder="0.5" />
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

// Icon import helper
import { Globe } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
