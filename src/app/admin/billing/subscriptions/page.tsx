import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Home, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function page() {
  // demo data (replace with API)
  const currentPlan = {
    name: "Trial",
    status: "active",
    renewsOn: "Jan 18, 2026",
    price: "$0",
    seats: 3,
    usedSeats: 1,
    websiteCount: 2,
    aiCredits: 500,
    aiCreditsUsed: 120,
  };

  const plans = [
    {
      name: "Starter",
      price: "$29/mo",
      desc: "For small businesses managing 1–2 websites.",
      features: ["1 website", "Basic analytics", "Email support", "1 team seat"],
      icon: Zap,
      popular: false,
    },
    {
      name: "Pro",
      price: "$79/mo",
      desc: "For growing teams & multi-site management.",
      features: ["5 websites", "Advanced analytics", "Priority support", "5 team seats"],
      icon: Sparkles,
      popular: true,
    },
    {
      name: "Business",
      price: "$199/mo",
      desc: "For agencies & enterprises with scale needs.",
      features: ["Unlimited websites", "Audit logs", "SLA support", "Unlimited seats"],
      icon: Sparkles,
      popular: false,
    },
  ];

  const seatPct = Math.round((currentPlan.usedSeats / currentPlan.seats) * 100);
  const creditsPct = Math.round((currentPlan.aiCreditsUsed / currentPlan.aiCredits) * 100);

  return (
    <div className="space-y-6">


      <div className="flex items-center gap-4 bg-transparent  py-4 border-b">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-slate-900">
          Subscriptions
        </h1>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-300" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Home className="h-4 w-4" />

          <span>–</span>

          <Link
            href="/billing"
            className="hover:text-slate-700 transition"
          >
            billing
          </Link>

          <span>–</span>

          <span className="text-slate-700 font-medium">
            Subscriptions
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your plan, upgrades, renewals, and usage.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Contact sales</Button>
          <Button>Upgrade plan</Button>
        </div>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Current plan</CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge>
              <span className="text-sm font-semibold text-slate-900">{currentPlan.name}</span>
              <span className="text-sm text-slate-500">· {currentPlan.price}</span>
              <span className="text-sm text-slate-500">· Renews on {currentPlan.renewsOn}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Manage billing</Button>
            <Button variant="outline">Cancel plan</Button>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 lg:grid-cols-3">
          {/* Seats */}
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Team seats</div>
            <div className="mt-1 text-sm text-slate-600">
              {currentPlan.usedSeats} / {currentPlan.seats} seats used
            </div>

            <div className="mt-3 h-2 w-full rounded bg-slate-100">
              <div
                className="h-2 rounded bg-slate-900"
                style={{ width: `${seatPct}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Usage</span>
              <span>{seatPct}%</span>
            </div>
          </div>

          {/* Websites */}
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Websites</div>
            <div className="mt-1 text-sm text-slate-600">{currentPlan.websiteCount} active websites</div>
            <Separator className="my-3" />
            <div className="text-xs text-slate-500">
              Tip: upgrade to Pro for multi-site analytics and access control.
            </div>
            <div className="mt-3">
              <Button variant="outline" className="w-full">
                View websites
              </Button>
            </div>
          </div>

          {/* AI Credits */}
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">AI credits</div>
            <div className="mt-1 text-sm text-slate-600">
              {currentPlan.aiCreditsUsed} / {currentPlan.aiCredits} credits used
            </div>

            <div className="mt-3 h-2 w-full rounded bg-slate-100">
              <div
                className="h-2 rounded bg-slate-900"
                style={{ width: `${creditsPct}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Usage</span>
              <span>{creditsPct}%</span>
            </div>

            <div className="mt-3">
              <Button variant="outline" className="w-full">
                Buy credits
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Plans</div>
          <div className="text-sm text-slate-600">Pick a plan that fits your team.</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name} className={p.popular ? "border-slate-900" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-slate-900">{p.name}</p>
                    {p.popular ? <Badge>Popular</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{p.price}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-2">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {f}
                  </div>
                ))}
              </div>

              <Button className="w-full" variant={p.popular ? "default" : "outline"}>
                Choose {p.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help */}
      <Card className="mb-16">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between ">
          <div>
            <div ><h5 className="font-bold pb-1">Need help with billing?</h5></div>
            <div className="text-sm text-slate-600">We can help you switch plans or manage invoices.</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">View docs</Button>
            <Button variant="outline">Chat support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
