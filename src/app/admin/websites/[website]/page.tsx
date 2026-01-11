"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useParams, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Building2, Users, Calendar, Mail, Tag, Settings } from "lucide-react";

const WebsiteDetailsPage = () => {
  const path = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // Get URL parameters
  const businessid = searchParams.get("businessid");
  const agencyid = searchParams.get("agencyid");
  const websiteSlug = Array.isArray(params.website)
    ? params.website[0]
    : params.website;

  // Get data from Redux store
  // const {
  //   currentWebsite,
  //   currentbusiness,
  //   currentAgency,
  //   totalwebsites,
  //   totalbusiness,
  //   agencies,
  // } = useSelector((state: RootState) => state.dashboardDetails);

  // // Local state for specific data
  // const [websiteData, setWebsiteData] = useState<any>(null);
  // const [businessData, setBusinessData] = useState<any>(null);
  // const [agencyData, setAgencyData] = useState<any>(null);

  // useEffect(() => {
  //   console.log("Path:", path);
  //   console.log("Params:", params);
  //   console.log("Business ID:", businessid);
  //   console.log("Agency ID:", agencyid);
  //   console.log("Website Slug:", websiteSlug);

  //   // Find website by slug or current website
  //   const decodedSlug = decodeURIComponent(websiteSlug || "");
  //   const foundWebsite =
  //     totalwebsites.find((w) => w.primaryDomain?.includes(decodedSlug)) ||
  //     currentWebsite;
  //   setWebsiteData(foundWebsite);

  //   // Find business by ID or current business
  //   const foundBusiness =
  //     totalbusiness.find((b) => b._id === businessid) || currentbusiness;
  //   setBusinessData(foundBusiness);

  //   // Find agency by ID or current agency
  //   const foundAgency =
  //     agencies.find((a) => a._id === agencyid) || currentAgency;
  //   setAgencyData(foundAgency);
  // }, [
  //   businessid,
  //   agencyid,
  //   websiteSlug,
  //   currentWebsite,
  //   currentbusiness,
  //   currentAgency,
  //   totalwebsites,
  //   totalbusiness,
  //   agencies,
  // ]);

  return (
    null
    // <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
    //   <div className="mb-6">
    //     <h1 className="text-3xl font-bold text-gray-900">Website Details</h1>
    //     <p className="text-gray-600 mt-2">
    //       Complete information about the website, business, and agency
    //     </p>
    //   </div>

    //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    //     {/* Website Information */}
    //     <Card className="shadow-lg">
    //       <CardHeader className="bg-blue-50">
    //         <CardTitle className="flex items-center gap-2 text-blue-900">
    //           <Globe className="h-5 w-5" />
    //           Website Information
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent className="pt-6 space-y-4">
    //         {websiteData ? (
    //           <>
    //             <div className="space-y-3">
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Website ID
    //                 </p>
    //                 <p className="text-base text-gray-900 font-mono">
    //                   {websiteData._id}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">Name</p>
    //                 <p className="text-base text-gray-900">
    //                   {websiteData.name}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Primary Domain
    //                 </p>
    //                 <div className="flex flex-wrap gap-2 mt-1">
    //                   {websiteData.primaryDomain?.map(
    //                     (domain: string, idx: number) => (
    //                       <Badge key={idx} variant="secondary">
    //                         {domain}
    //                       </Badge>
    //                     )
    //                   )}
    //                 </div>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   System Subdomain
    //                 </p>
    //                 <p className="text-base text-gray-900">
    //                   {websiteData.systemSubdomain || "N/A"}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Service Type
    //                 </p>
    //                 <Badge
    //                   variant={
    //                     websiteData.serviceType === "ECOMMERCE"
    //                       ? "default"
    //                       : "outline"
    //                   }
    //                 >
    //                   {websiteData.serviceType}
    //                 </Badge>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Status
    //                 </p>
    //                 <Badge
    //                   variant={
    //                     websiteData.status === "active"
    //                       ? "default"
    //                       : websiteData.status === "paused"
    //                         ? "secondary"
    //                         : "destructive"
    //                   }
    //                 >
    //                   {websiteData.status || "active"}
    //                 </Badge>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Tenant ID
    //                 </p>
    //                 <p className="text-base text-gray-900 font-mono">
    //                   {websiteData.tenantId || "N/A"}
    //                 </p>
    //               </div>
    //             </div>
    //           </>
    //         ) : (
    //           <p className="text-gray-500 italic">No website data available</p>
    //         )}
    //       </CardContent>
    //     </Card>

    //     {/* Business Information */}
    //     <Card className="shadow-lg">
    //       <CardHeader className="bg-green-50">
    //         <CardTitle className="flex items-center gap-2 text-green-900">
    //           <Building2 className="h-5 w-5" />
    //           Business Information
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent className="pt-6 space-y-4">
    //         {businessData ? (
    //           <>
    //             <div className="space-y-3">
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Business ID
    //                 </p>
    //                 <p className="text-base text-gray-900 font-mono">
    //                   {businessData._id}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">Name</p>
    //                 <p className="text-base text-gray-900">
    //                   {businessData.name}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">Slug</p>
    //                 <p className="text-base text-gray-900 font-mono">
    //                   {businessData.slug}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Email
    //                 </p>
    //                 <p className="text-base text-gray-900 flex items-center gap-2">
    //                   <Mail className="h-4 w-4" />
    //                   {businessData.email}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">Plan</p>
    //                 <Badge variant="default">{businessData.plan}</Badge>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Subscription Status
    //                 </p>
    //                 <Badge
    //                   variant={
    //                     businessData.subscriptionStatus === "active"
    //                       ? "default"
    //                       : businessData.subscriptionStatus === "paused"
    //                         ? "secondary"
    //                         : "destructive"
    //                   }
    //                 >
    //                   {businessData.subscriptionStatus}
    //                 </Badge>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Status
    //                 </p>
    //                 <Badge
    //                   variant={
    //                     businessData.status === "active"
    //                       ? "default"
    //                       : "secondary"
    //                   }
    //                 >
    //                   {businessData.status}
    //                 </Badge>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">Type</p>
    //                 <Badge variant="outline">
    //                   {businessData.type || "business"}
    //                 </Badge>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Tenant ID
    //                 </p>
    //                 <p className="text-base text-gray-900 font-mono">
    //                   {businessData.tenantId || "N/A"}
    //                 </p>
    //               </div>
    //             </div>
    //           </>
    //         ) : (
    //           <p className="text-gray-500 italic">
    //             No business data available
    //           </p>
    //         )}
    //       </CardContent>
    //     </Card>

    //     {/* Agency Information */}
    //     {agencyData && (
    //       <Card className="shadow-lg lg:col-span-2">
    //         <CardHeader className="bg-yellow-50">
    //           <CardTitle className="flex items-center gap-2 text-yellow-900">
    //             <Users className="h-5 w-5" />
    //             Agency Information
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="pt-6 space-y-4">
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //             <div className="space-y-3">
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Agency ID
    //                 </p>
    //                 <p className="text-base text-gray-900 font-mono">
    //                   {agencyData._id}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">Name</p>
    //                 <p className="text-base text-gray-900">
    //                   {agencyData.name || "N/A"}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Email
    //                 </p>
    //                 <p className="text-base text-gray-900 flex items-center gap-2">
    //                   <Mail className="h-4 w-4" />
    //                   {agencyData.email || "N/A"}
    //                 </p>
    //               </div>
    //             </div>
    //             <div className="space-y-3">
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">Slug</p>
    //                 <p className="text-base text-gray-900 font-mono">
    //                   {agencyData.slug || "N/A"}
    //                 </p>
    //               </div>
    //               <Separator />
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600">
    //                   Status
    //                 </p>
    //                 <Badge
    //                   variant={
    //                     agencyData.status === "active"
    //                       ? "default"
    //                       : "secondary"
    //                   }
    //                 >
    //                   {agencyData.status || "active"}
    //                 </Badge>
    //               </div>
    //             </div>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     )}

    //     {/* Additional Features Section */}
    //     {businessData?.features && (
    //       <Card className="shadow-lg lg:col-span-2">
    //         <CardHeader className="bg-purple-50">
    //           <CardTitle className="flex items-center gap-2 text-purple-900">
    //             <Settings className="h-5 w-5" />
    //             Business Features
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="pt-6">
    //           <div className="flex flex-wrap gap-3">
    //             {businessData.features.websiteEnabled && (
    //               <Badge variant="default">Website Enabled</Badge>
    //             )}
    //             {businessData.features.ecommerceEnabled && (
    //               <Badge variant="default">E-commerce Enabled</Badge>
    //             )}
    //             {businessData.features.blogEnabled && (
    //               <Badge variant="default">Blog Enabled</Badge>
    //             )}
    //             {businessData.features.invoicesEnabled && (
    //               <Badge variant="default">Invoices Enabled</Badge>
    //             )}
    //           </div>
    //         </CardContent>
    //       </Card>
    //     )}

    //     {/* Debug Information */}
    //     <Card className="shadow-lg lg:col-span-2 bg-gray-100">
    //       <CardHeader>
    //         <CardTitle className="text-gray-700">Debug Information</CardTitle>
    //       </CardHeader>
    //       <CardContent className="pt-6">
    //         <div className="space-y-2 text-sm font-mono">
    //           <p>
    //             <strong>Path:</strong> {path}
    //           </p>
    //           <p>
    //             <strong>Website Slug (from URL):</strong> {websiteSlug}
    //           </p>
    //           <p>
    //             <strong>Business ID (from query):</strong> {businessid || "N/A"}
    //           </p>
    //           <p>
    //             <strong>Agency ID (from query):</strong> {agencyid || "N/A"}
    //           </p>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  );
};

export default WebsiteDetailsPage;