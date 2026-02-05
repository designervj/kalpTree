"use client";

import GlanceCount from "@/components/adminDashBoard/GlanceCount";
import Promo from "@/components/adminDashBoard/Promo";
import QuickTool from "@/components/adminDashBoard/QuickTool";
import ShowListOfBusiness from "@/components/adminDashBoard/ShowListOfBusiness";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import {
  Activity,
  ArrowRight,
  FileText,
  Globe,
  ImageIcon,
  Mail,
  Palette,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ActionCard } from "./page";
import { Card, CardContent } from "@/components/ui/card";
import AdminHeader from "@/components/adminDashBoard/AdminHeader";

const MinorComp = ({ sessionUser }: any) => {
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { user } = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // wait until redux is hydrated
    if (!user) return;

    if (user && user.role !== "business") {
      setReady(true);
      return
    }

    if (user.role === "business" && currentWebsite &&  currentWebsite.primaryDomain) {
      const encodedName = decodeURIComponent(currentWebsite.primaryDomain[0]);
      router.replace(`/admin/websites/${encodedName}`);
    }
  }, [user, currentWebsite, router]);



  // ⛔ block UI until decision is made
  // if (!ready) {
  //   return (
  //     <div className="h-[60vh] grid place-items-center text-muted-foreground">
  //       Loading...
  //     </div>
  //   );
  // }

  const actions: ActionCard[] = [
    {
      title: "Create a new page",
      desc: "Start building your website content quickly with blocks.",
      href: "/admin/pages",
      icon: FileText,
      cta: "Create page",
    },
    {
      title: "Upload media",
      desc: "Add images and assets for banners, pages, and products.",
      href: "/admin/media",
      icon: ImageIcon,
      cta: "Open media",
    },
    {
      title: "Branding setup",
      desc: "Update logo, colors, typography and theme presets.",
      href: "/admin/branding/colors",
      icon: Palette,
      cta: "Open branding",
    },
    {
      title: "Configure store",
      desc: "Set payment, shipping, taxes and invoices in one place.",
      href: "/admin/ecommerce/settings",
      icon: Settings,
      cta: "Open settings",
    },
  ];

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <AdminHeader sessionUser={sessionUser?.user} />

      {/* Top Row: Promo + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Promo */}
        <Promo />

        {/* Quick Tools (right) */}
        <QuickTool />
      </div>

      {/* ✅ AT A GLANCE (counts moved here so "Your business" stays like screenshot) */}
      <GlanceCount />

      {/* ✅ YOUR BUSINESS (Hostinger-like list design) */}
      <ShowListOfBusiness />

      {/* Action Center */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-[22px] font-semibold text-slate-900">
              Action center
            </h3>
            <p className="text-sm text-muted-foreground">
              Set up the most important parts of your website.
            </p>
          </div>

          <Link href="/admin/settings/general">
            <Button variant="outline" className="rounded-md">
              Open settings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.title} href={a.href} className="block">
                <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-slate-100 grid place-items-center">
                        <Icon className="h-5 w-5 text-slate-800" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-slate-900">
                          {a.title}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {a.desc}
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-900">
                          <span>{a.cta}</span>
                          <ArrowRight className="h-4 w-4 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Helpful resources */}
      <Card className="rounded-2xl border bg-white shadow-sm mb-20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-base font-semibold text-slate-900">
                Helpful resources
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Need help setting up? Use quick links below.
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="rounded-md text-white"
                asChild
              >
                <Link href="/admin/domains">
                  <Globe className="mr-2 h-4 w-4" />
                  Manage domain
                </Link>
              </Button>

              <Button
                variant="secondary"
                className="rounded-md text-white"
                asChild
              >
                <Link href="/admin/emails">
                  <Mail className="mr-2 h-4 w-4" />
                  Manage email
                </Link>
              </Button>

              <Button variant="outline" className="rounded-md" asChild>
                <Link href="/admin/analytics">
                  <Activity className="mr-2 h-4 w-4" />
                  View analytics
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinorComp;
