"use client"
import { AppDispatch, RootState } from '@/store/store'
import React, { ElementType } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
    ExternalLink,
    Globe,
    Mail,

    Image as ImageIcon,

    Plus,
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { IBusiness } from '@/models/business';
import { setBusinessWebsite } from '@/hooks/slices/business/BusinessSlice';

function SiteIcon({ style }: { style?: "wp" | "code" }) {
    const isWP = style === "wp";
    return (
        <div
            className={[
                "h-16 w-16 rounded-2xl grid place-items-center shrink-0",
                isWP ? "bg-[#0b6d8e]" : "bg-[#111214]",
            ].join(" ")}
        >
            {isWP ? (
                <div className="h-9 w-9 rounded-md border-2 border-white grid place-items-center text-white font-bold">
                    W
                </div>
            ) : (
                <div className="h-9 w-9 rounded-lg border-2 border-white grid place-items-center text-white font-bold">
                    {"</>"}
                </div>
            )}
        </div>
    );
}

function PillButton({
    href,
    icon: Icon,
    label,
    variant = "secondary",
    className = "",
}: {
    href: string;
    icon: ElementType;
    label: string;
    variant?: "secondary" | "outline";
    className?: string;
}) {
    return (
        <Button
            asChild
            variant={variant}
            className={`h-10 rounded-md px-4 text-sm font-semibold text-white ${className}`}
        >
            <Link href={href} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
            </Link>
        </Button>
    );
}
const ShowListOfBusiness = () => {
   const router = useRouter()
    const { allBusiness } = useSelector((state: RootState) => state.business)
     const dispatch= useDispatch<AppDispatch>()
    const handleClick = (site: IBusiness) => {
        dispatch(setBusinessWebsite(site))
        router.push(`/admin/businesses/${site._id}`)
    }
    return (
        <>
            <div className="space-y-4">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h3 className="text-[22px] font-semibold text-slate-900">
                            Your business
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Quick access to domain, email and dashboard for each website.
                        </p>
                    </div>

                    <Button asChild variant="outline" className="rounded-md">
                        <Link href="/admin/websites/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add website
                        </Link>
                    </Button>
                </div>

                <div className="space-y-4">
                    {allBusiness && allBusiness?.length > 0 &&
                        allBusiness.map((site) => {
                            const openLink = ""
                            // const openLink = `https://${site.domain}`;
                            // const hasEmail = Boolean(site.hasEmail);

                            return (
                                <Card
                                    key={site._id?.toString()}
                                    className="rounded-3xl border bg-white shadow-sm"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between 1">
                                            {/* LEFT */}
                                            <div className="flex items-start gap-5">
                                                {/* <SiteIcon style={site.iconStyle} /> */}

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-[28px] font-semibold text-slate-900 truncate">
                                                            {site.businessdetails?.business_website_url ?? site.name}
                                                        </div>

                                                        <Link
                                                            href={site.businessdetails?.business_website_url ?? "#"}
                                                            target="_blank"
                                                            className="text-slate-400 hover:text-slate-600"
                                                        >
                                                            <ExternalLink className="h-5 w-5" />
                                                        </Link>
                                                    </div>

                                                    {/* Pills */}
                                                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md">
                                                        <PillButton
                                                        href='#'
                                                            // href={site?.businessdetails?.business_website_url ?? site.name}
                                                            icon={Globe}
                                                            label="Manage domain"
                                                        />

                                                        {site?.businessdetails?.public_email ? (
                                                            <PillButton
                                                                href={site?.businessdetails?.public_email ?? ""}
                                                                icon={Mail}
                                                                label="Manage email"
                                                            />
                                                        ) : (
                                                            <Button
                                                                asChild
                                                                variant="secondary"
                                                                className="h-10 rounded-md px-4 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100"
                                                            >
                                                                <Link
                                                                    href={site?.businessdetails?.public_email ?? ""}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                    Set up email
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                                                {site.businessdetails?.business_website_url ? (
                                                    <Button
                                                        variant="outline"
                                                        className="h-10 rounded-xl px-5 text-sm font-semibold border-purple-200 text-purple-700 hover:bg-purple-50"
                                                    >
                                                        WordPress Admin
                                                        <ExternalLink className="ml-2 h-4 w-4" />
                                                    </Button>
                                                ) : null}

                                                <Button
                                                    variant="outline"
                                                    className="h-10 rounded-xl px-5 text-sm font-semibold bg-primary text-white hover:text-white hover:bg-primary hover:no-underline"
                                                 onClick= {()=>handleClick(site)}
                                               >
                                                    Dashboard
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                </div>
            </div>
        </>
    )
}

export default ShowListOfBusiness