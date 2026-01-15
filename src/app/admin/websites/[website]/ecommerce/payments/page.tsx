"use client";

import React from "react";
import { CreditCard, CheckCircle2, AlertCircle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function PaymentsPage() {
  return (
    <div className="space-y-6 max-full mx-auto pb-10">
      <div>
         {/* <h1 className="text-2xl font-bold tracking-tight">Payment Providers</h1> */}
         <BreadCrumbPage/>
         <p className="text-muted-foreground">Accept payments through multiple gateways securely.</p>
      </div>

      <div className="grid gap-6">
         {/* Stripe (Active) */}
         <Card className="border-green-200 bg-white">
            <CardHeader>
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-[#635BFF] text-white flex items-center justify-center rounded-md font-bold text-lg">S</div>
                     <div>
                        <CardTitle>Stripe</CardTitle>
                        <CardDescription>Credit cards, Apple Pay, and Google Pay.</CardDescription>
                     </div>
                  </div>
                  <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
               </div>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4" /> Connected to account <strong>acct_1Hh...92x</strong>
               </div>
            </CardContent>
            <CardFooter className="border-t bg-white/50 py-3 flex justify-end gap-2">
               <Button variant="outline" size="sm">Manage on Stripe</Button>
               <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">Disconnect</Button>
            </CardFooter>
         </Card>

         {/* Razorpay (Configurable) */}
         <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="razorpay" className="border rounded-xl px-4 data-[state=open]:bg-white bg-white transition-colors">
               <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-[#072654] text-white flex items-center justify-center rounded-md font-bold text-lg">R</div>
                     <div className="text-left">
                        <div className="font-semibold text-lg">Razorpay</div>
                        <div className="text-sm text-muted-foreground font-normal">Popular in India & SE Asia.</div>
                     </div>
                  </div>
               </AccordionTrigger>
               <AccordionContent className="pt-4 pb-6 space-y-4 ">
                  <div className="grid gap-4 w-full">
                     <div className="space-y-2">
                        <Label>Key ID</Label>
                        <Input type="password" placeholder="rzp_live_..." />
                     </div>
                     <div className="space-y-2">
                        <Label>Key Secret</Label>
                        <Input type="password" placeholder="••••••••••••••" />
                     </div>
                     <div className="flex items-center space-x-2 pt-2">
                        <Switch id="razorpay-active" />
                        <Label htmlFor="razorpay-active">Enable Gateway</Label>
                     </div>
                  </div>
                  <div className="pt-2">
                     <Button>Save Credentials</Button>
                  </div>
               </AccordionContent>
            </AccordionItem>

            {/* PayPal */}
            <AccordionItem value="paypal" className="border rounded-xl px-4 mt-4 data-[state=open]:bg-gray-50 bg-white transition-colors">
               <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-[#003087] text-white flex items-center justify-center rounded-md font-bold text-lg">P</div>
                     <div className="text-left">
                        <div className="font-semibold text-lg">PayPal</div>
                        <div className="text-sm text-muted-foreground font-normal">Accept PayPal and Venmo.</div>
                     </div>
                  </div>
               </AccordionTrigger>
               <AccordionContent className="pt-4 pb-6">
                   <Button variant="outline" className="gap-2"><Key className="w-4 h-4"/> Connect PayPal Account</Button>
               </AccordionContent>
            </AccordionItem>
         </Accordion>

         {/* Manual Payments */}
         <Card>
            <CardHeader>
               <CardTitle className="text-base">Manual Payment Methods</CardTitle>
               <CardDescription>Cash on Delivery (COD), Bank Transfer, or Checks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                     <div className="bg-gray-100 p-2 rounded"><CreditCard className="w-4 h-4" /></div>
                     <span className="font-medium">Cash on Delivery (COD)</span>
                  </div>
                  <Switch />
               </div>
               <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                     <div className="bg-gray-100 p-2 rounded"><CreditCard className="w-4 h-4" /></div>
                     <span className="font-medium">Bank Transfer</span>
                  </div>
                  <Switch />
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}