"use client"
import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { usePathname } from "next/navigation";

const BreadCrumbPage = () => {
    const pathname = usePathname();
    const [urlPath, setUrlPath] = useState<string[]>([]);

    useEffect(() => {
        // Split pathname and filter out empty strings
        const pathSegments = pathname.split("/").filter(segment => segment !== "");
        setUrlPath(pathSegments);
        console.log("urlPath", pathSegments);
    }, [pathname]);



    return (
        <>
            <div className=" items-center gap-3 ">
               

                <Breadcrumb>
                    <BreadcrumbList>
                        {/* Home */}
                        <BreadcrumbItem>
                            <BreadcrumbLink >
                                <Link href="/admin" className="inline-flex items-center gap-1">
                                    <IoMdHome className="h-5 w-5 text-muted-foreground" />
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {/* <span className="mx-0 select-none">-</span> */}

                        {/* Websites */}
                        {urlPath &&urlPath.length > 2 && <BreadcrumbItem>
                            <BreadcrumbLink>
                                <Link href={`/admin/${urlPath[urlPath.length - 2]}`} className="text-muted-foreground font-normal capitalize">{urlPath[urlPath.length - 2]}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        }
                 

                        {/* Current */}
                    {urlPath &&urlPath.length > 1  && 
                    <>
                           <span className="mx-0 select-none">-</span>
                     <BreadcrumbItem>
                            <BreadcrumbLink>
                                <Link href={`/admin/${urlPath[urlPath.length - 1]}`} className="text-muted-foreground font-normal capitalize">{urlPath[urlPath.length - 1]}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                   
                        }
                    </BreadcrumbList>
                </Breadcrumb>

                 {/* <h1 className="text-2xl font-bold tracking-tight border-r  pe-4">{urlPath[urlPath.length - 1]?.charAt(0).toUpperCase() + urlPath[urlPath.length - 1]?.slice(1)}</h1> */}
                 <h1 className="text-2xl font-bold tracking-tight  pe-4">{urlPath[urlPath.length - 1]?.charAt(0).toUpperCase() + urlPath[urlPath.length - 1]?.slice(1)}</h1>

            </div>
        </>
    )
}

export default BreadCrumbPage