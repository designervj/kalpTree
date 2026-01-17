
"use client"
import { ArrowRight, FileText, ImageIcon, Link as LinkIcon, Palette, ShoppingCart, Sparkles } from 'lucide-react';
import React from 'react'
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const QuickTool = () => {
        const {user} = useSelector((state: RootState) => state.user);
    return (
        <>
           { user?.role != "business" && <Card className="rounded-2xl border bg-white shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-slate-700" />
                        <div className="text-base font-semibold text-slate-900">
                            Quick tools
                        </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Common actions to get things done faster.
                    </p>

                    <div className="mt-5 space-y-2">
                        {[
                            { href: "/admin/pages", label: "Manage pages", icon: FileText },
                            { href: "/admin/branding/logo", label: "Branding", icon: Palette },
                            { href: "/admin/media", label: "Media library", icon: ImageIcon },
                            { href: "/admin/ecommerce/orders", label: "Orders", icon: ShoppingCart },
                        ].map((x) => {
                            const Icon = x.icon;
                            return (
                                <Link key={x.href} href={x.href} className="block">
                                    <div className="flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-3 hover:bg-slate-100 transition">
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-4 w-4 text-slate-700" />
                                            <span className="text-sm font-medium text-slate-900">
                                                {x.label}
                                            </span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-400" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>}
        </>
    )
}

export default QuickTool