
"use client"
import React, { Activity, ElementType, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Globe, Link as LinkIcon, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


type QuickStat = {
    title: string;
    value: number;
    href: string;
    icon: ElementType;
};

const GlanceCount = () => {
    const { user } = useSelector((state: RootState) => state.user)
    const { allAgencies } = useSelector((state: RootState) => state.agency)
    const { allBusiness } = useSelector((state: RootState) => state.business)
    const { websites } = useSelector((state: RootState) => state.websites)

    const allBusinessBasedOnAgency = useMemo(()=>{
        if(user?.role === "agency"){
            return allBusiness.filter((business)=>business.tenantId === user?.tenantId)
        }
        return allBusiness
    },[allBusiness,user])


  

  
    const allStats: QuickStat[] = [
        { title: "Agencies", value: allAgencies?.length || 0, href: "/admin/agencies", icon: FileText },
        { title: "Businesses", value: user?.role === "agency" ? allBusinessBasedOnAgency?.length : allBusiness?.length || 0, href: "/admin/businesses", icon: Globe },
        {
            title: "Website",
            value:  websites?.length || 0,
            href: "/admin/websites",
            icon: Globe,
        },
        {
            title: "Orders",
            value: 0,
            href: "/admin/ecommerce/orders",
            icon: ShoppingCart,
        },
        { title: "Categories", value: 0, href: "/admin/category", icon: Activity },
        { title: "Tags", value: 0, href: "/admin/tags", icon: Activity },
    ];

    // Filter out "Agencies" when user role is "agency"
    const stats = user?.role === "agency"
        ? allStats.filter(stat => stat.title !== "Agencies")
        : allStats;
    return (
        <>
            <div className="space-y-4">
                <div>
                    <h3 className="text-[22px] font-semibold text-slate-900">At a glance</h3>
                    <p className="text-sm text-muted-foreground">
                        Content + store totals across your workspace.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <Link key={s.title} href={s.href} className="block">
                                <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{s.title}</span>
                                                </div>
                                                <div className="mt-1 text-[42px] font-semibold text-slate-900">
                                                    {s.value}
                                                </div>
                                            </div>

                                            <div className="text-slate-400">
                                                <ExternalLink className="h-5 w-5" />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <Button className="rounded-md h-9 px-4 text-white">
                                                View {s.title}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default GlanceCount