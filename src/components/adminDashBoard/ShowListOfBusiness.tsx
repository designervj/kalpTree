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
import ShowBusiness from '../admin/business/showbussiness/showbusiness';

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
           <ShowBusiness/>
        </>
    )
}

export default ShowListOfBusiness