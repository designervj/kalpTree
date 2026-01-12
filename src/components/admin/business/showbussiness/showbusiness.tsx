"use client";

import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Plus,
    ExternalLink,
    Globe,
    Users,
    Settings,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Crown,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Trash,
    Badge,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Suspense } from "react";
import BusinessesToolbar from "@/app/admin/businesses/BusinessesToolbar";
import BusinessIcon from "./util/BusinessIcon";
import { IBusiness } from "@/models/business";
import GetPlanBadge from "./util/GetPlanBadge";
import GetStatusBadge from "./util/getStatusBadge";

const ShowBusiness = () => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { allBusiness } = useSelector((state: RootState) => state.business)
    return (
        <>
            <div className="w-full  space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-1">
                    <div>
                        {/* <h2 className="text-[26px] font-semibold text-slate-900">Businesses a</h2> */}
                        <BreadCrumbPage />
                        <p className="text-sm text-muted-foreground">
                            Manage businesses, switch context, and open a dashboard for each.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" className="rounded-md">
                            <Link href="/admin/rolesandpermission">
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Roles & Permissions
                            </Link>
                        </Button>

                        <Button asChild className="rounded-md">
                            <Link href="/admin/businesses/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Business
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Top actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Card className="rounded-md border bg-white shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-slate-100 grid place-items-center">
                                    <Sparkles className="h-5 w-5 text-slate-700" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">
                                        Quick tip
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Create a new business to separate websites, users, and
                                        billing.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <div className="space-y-4">
                        <BusinessesToolbar />
                    </div>

                    {allBusiness.map((b: IBusiness, idx) => {
                        // const planBadge = getPlanBadge(b.plan);
                        // const statusBadge = getStatusBadge(b.status);
                        // const subtext = getSubtext(b.type);
                        const href = `/admin/businesses/${b._id}`;

                        return (
                            <Card
                                key={String(b._id ?? "")}
                                className="rounded-md border bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        {/* LEFT */}
                                        <div className="flex items-start gap-5">
                                            <BusinessIcon
                                                tone={
                                                    idx % 3 === 0
                                                        ? "blue"
                                                        : idx % 3 === 1
                                                            ? "dark"
                                                            : "purple"
                                                }
                                            />

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="text-[26px] font-semibold text-slate-900 truncate">
                                                        {b.name}
                                                    </div>
                                                    {/* <Link
                            href={href}
                            className="text-slate-400 hover:text-slate-600">
                            <ExternalLink className="h-5 w-5" />
                          </Link> */}
                                                    {/*                     
                          {planBadge}
                          {statusBadge} */}

                                                    {b && b.plan && <GetPlanBadge plan={b.plan} />}
                                                    {b && b.status && <GetStatusBadge status={b.status} />}
                                                </div>

                                                {/* {subtext ? (
                                                    <div className="mt-1 text-sm text-muted-foreground">
                                                        {subtext}
                                                    </div>
                                                ) : null} */}

                                                <div className="mt-3 flex flex-wrap items-center gap-2 1">
                                                    <Button
                                                        asChild
                                                        // variant="secondary"
                                                        variant="outline"
                                                    // className="h-10 rounded-md px-4 text-sm font-semibold text-white"
                                                    >
                                                        <Link
                                                            href={`${href}/websites`}
                                                            className="flex items-center gap-2">
                                                            <Globe className="h-4 w-4" />
                                                            Websites{" "}
                                                            <span className="ml-1 rounded-md bg-white/50 px-2 py-0.5 text-xs">
                                                                {b.websitesCount ?? 0}
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                    // className="h-10 rounded-md px-4 text-sm font-semibold text-white"
                                                    >
                                                        <Link
                                                            href={`${href}/users`}
                                                            className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            Members{" "}
                                                            <span className="ml-1 rounded-md bg-white/50 px-2 py-0.5 text-xs">
                                                                {b.membersCount ?? 0}
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    {b.email ? (
                                                        <Badge>
                                                            <Globe className="mr-1 h-3.5 w-3.5" />
                                                            {b.email}
                                                        </Badge>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT */}
                                        <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="h-10 rounded-xl px-5 text-sm font-semibold">
                                                <Link
                                                    href={`${href}/settings`}
                                                    className="flex items-center gap-2">
                                                    <Settings className="h-4 w-4" />
                                                    Settings
                                                </Link>
                                            </Button>

                                            <Suspense fallback={null}>
                                                <>
                                                    <Link
                                                        href={href}
                                                        className="py-2 hover:no-underline rounded-md px-5 text-sm font-semibold bg-primary text-white hover:bg-primary hover:text-white"
                                                    >
                                                        Open Dashboard
                                                    </Link>
                                                </>
                                            </Suspense>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Pagination */}
                {/* {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1} to {endIndex} of {totalCount} businesses
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                className="rounded-md">
                                <Link
                                    href={`?page=${currentPage - 1}`}
                                    className={
                                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                    }>
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Link>
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => {
                                        const showPage =
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1);

                                        const showEllipsis =
                                            (page === currentPage - 2 && currentPage > 3) ||
                                            (page === currentPage + 2 &&
                                                currentPage < totalPages - 2);

                                        if (showEllipsis) {
                                            return (
                                                <span key={page} className="px-2 text-muted-foreground">
                                                    ...
                                                </span>
                                            );
                                        }

                                        if (!showPage) return null;

                                        return (
                                            <Button
                                                key={page}
                                                asChild
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                className="rounded-md w-10 h-10 p-0">
                                                <Link href={`?page=${page}`}>{page}</Link>
                                            </Button>
                                        );
                                    }
                                )}
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                className="rounded-md">
                                <Link
                                    href={`?page=${currentPage + 1}`}
                                    className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }>
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                )} */}
            </div>
        </>
    )
}

export default ShowBusiness




// import React, { useState } from "react";
// import { Search, MoreVertical, Plus, X, ExternalLink } from "lucide-react";

// export const BusinessShowcase = ({ business }: any) => {
//   const [businesses, setBusinesses] = useState(business);
//   const [editingBusiness, setEditingBusiness] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);


//   console.log(editingBusiness)

//   const typographyOptions = [
//     "Inter",
//     "Roboto",
//     "Open Sans",
//     "Lato",
//     "Montserrat",
//     "Poppins",
//     "Arial",
//     "Helvetica",
//   ];
//   const localeOptions = [
//     "en-US",
//     "en-GB",
//     "es-ES",
//     "fr-FR",
//     "de-DE",
//     "it-IT",
//     "pt-BR",
//     "ja-JP",
//     "zh-CN",
//   ];
//   const currencyOptions = [
//     "USD",
//     "EUR",
//     "GBP",
//     "JPY",
//     "CNY",
//     "INR",
//     "CAD",
//     "AUD",
//     "CHF",
//     "BRL",
//   ];
//   const timezoneOptions = [
//     "UTC",
//     "America/New_York",
//     "America/Los_Angeles",
//     "America/Chicago",
//     "Europe/London",
//     "Europe/Paris",
//     "Asia/Tokyo",
//     "Asia/Shanghai",
//     "Asia/Kolkata",
//     "Australia/Sydney",
//   ];

//   const openEditModal = (business) => {
//     setEditingBusiness({ ...business });
//     setIsModalOpen(true);
//     setOpenMenuId(null);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingBusiness(null);
//   };

//   const handleSave = () => {
//     setBusinesses(
//       businesses.map((b) =>
//         b._id === editingBusiness._id ? editingBusiness : b
//       )
//     );
//     closeModal();
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this business?")) {
//       setBusinesses(businesses.filter((b) => b._id !== id));
//       setOpenMenuId(null);
//     }
//   };

//   const updateField = (path, value) => {
//     const keys = path.split(".");
//     const updated = { ...editingBusiness };
//     let current = updated;

//     for (let i = 0; i < keys.length - 1; i++) {
//       current[keys[i]] = { ...current[keys[i]] };
//       current = current[keys[i]];
//     }

//     current[keys[keys.length - 1]] = value;
//     setEditingBusiness(updated);
//   };

//   const filteredBusinesses = businesses.filter(
//     (b) =>
//       b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       b.businessDetails?.business_website_url
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//   );

//   const toggleMenu = (id, event) => {
//     event.stopPropagation();
//     setOpenMenuId(openMenuId === id ? null : id);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
//           <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
//             <Plus size={20} />
//             Add Business
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search
//               className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <input
//               type="text"
//               placeholder="Search by domain, email, or name"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Business List */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
//               Premium Plan
//             </h2>
//           </div>

//           {filteredBusinesses.length === 0 ? (
//             <div className="px-6 py-12 text-center text-gray-500">
//               No businesses found
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {filteredBusinesses.map((business) => (
//                 <div
//                   key={business._id}
//                   className="px-6 py-5 hover:bg-gray-50 transition"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4 flex-1">
//                       {/* Business Icon/Logo */}
//                       <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
//                         <span className="text-indigo-700 font-bold text-base">
//                           {business.name.substring(0, 2).toUpperCase()}
//                         </span>
//                       </div>

//                       {/* Business Info */}
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <h3 className="text-base font-semibold text-gray-900">
//                             {business.businessDetails?.business_website_url ||
//                               business.name}
//                           </h3>
//                           <ExternalLink
//                             size={14}
//                             className="text-gray-400 hover:text-indigo-600 cursor-pointer"
//                           />
//                         </div>
//                         <div className="flex items-center gap-3 text-sm text-gray-600">
//                           <span>
//                             Plan:{" "}
//                             <span className="font-medium text-gray-800">
//                               {business.plan}
//                             </span>
//                           </span>
//                           <span className="text-gray-300">•</span>
//                           <span className="text-gray-500">
//                             {business.email}
//                           </span>
//                           <span className="text-gray-300">•</span>
//                           <span
//                             className={`font-semibold ${
//                               business.status === "active"
//                                 ? "text-green-600"
//                                 : "text-red-600"
//                             }`}
//                           >
//                             {business.status}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center gap-3">
//                       <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
//                         Dashboard
//                       </button>

//                       {/* More Options Menu */}
//                       <div className="relative">
//                         <button
//                           onClick={(e) => toggleMenu(business._id, e)}
//                           className="p-2 hover:bg-gray-100 rounded-lg transition"
//                         >
//                           <MoreVertical size={20} className="text-gray-500" />
//                         </button>

//                         {openMenuId === business._id && (
//                           <>
//                             <div
//                               className="fixed inset-0 z-10"
//                               onClick={() => setOpenMenuId(null)}
//                             />
//                             <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
//                               <button
//                                 onClick={() => openEditModal(business)}
//                                 className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
//                               >
//                                 Edit Business
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   window.open(
//                                     `https://${business.businessDetails?.business_website_url}`,
//                                     "_blank"
//                                   )
//                                 }
//                                 className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
//                               >
//                                 Visit Website
//                               </button>
//                               <div className="border-t border-gray-100 my-1"></div>
//                               <button
//                                 onClick={() => handleDelete(business._id)}
//                                 className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition font-medium"
//                               >
//                                 Delete Business
//                               </button>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {isModalOpen && editingBusiness && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//             {/* Modal Header */}
//             <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
//               <h3 className="text-2xl font-bold text-gray-900">
//                 Edit Business
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-600 transition"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Modal Content - Scrollable */}
//             <div className="flex-1 overflow-y-auto px-8 py-6">
//               <div className="space-y-8">
//                 {/* Basic Information */}

//                 <div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-3">
//                         Plan
//                       </label>
//                       <div className="space-y-2">
//                         {["trial", "basic", "premium", "enterprise"].map(
//                           (plan) => (
//                             <label
//                               key={plan}
//                               className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//                             >
//                               <input
//                                 type="radio"
//                                 name="plan"
//                                 value={plan}
//                                 checked={editingBusiness.plan === plan}
//                                 onChange={(e) =>
//                                   updateField("plan", e.target.value)
//                                 }
//                                 className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 border-gray-300"
//                               />
//                               <span className="ml-3 text-sm font-medium text-gray-700 capitalize">
//                                 {plan}
//                               </span>
//                             </label>
//                           )
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-3">
//                         Subscription Status
//                       </label>
//                       <div className="space-y-2">
//                         {["active", "inactive", "suspended", "cancelled"].map(
//                           (status) => (
//                             <label
//                               key={status}
//                               className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//                             >
//                               <input
//                                 type="radio"
//                                 name="subscriptionStatus"
//                                 value={status}
//                                 checked={
//                                   editingBusiness.subscriptionStatus === status
//                                 }
//                                 onChange={(e) =>
//                                   updateField(
//                                     "subscriptionStatus",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 border-gray-300"
//                               />
//                               <span className="ml-3 text-sm font-medium text-gray-700 capitalize">
//                                 {status}
//                               </span>
//                             </label>
//                           )
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-3">
//                         Status
//                       </label>
//                       <div className="space-y-2">
//                         {["active", "inactive"].map((status) => (
//                           <label
//                             key={status}
//                             className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//                           >
//                             <input
//                               type="radio"
//                               name="status"
//                               value={status}
//                               checked={editingBusiness.status === status}
//                               onChange={(e) =>
//                                 updateField("status", e.target.value)
//                               }
//                               className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 border-gray-300"
//                             />
//                             <span className="ml-3 text-sm font-medium text-gray-700 capitalize">
//                               {status}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Branding Section */}
//                 <div className="border-t border-gray-200 pt-6">
//                   <h4 className="text-lg font-bold text-gray-900 mb-5">
//                     Branding
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Primary Color
//                       </label>
//                       <div className="flex gap-3">
//                         <input
//                           type="color"
//                           value={editingBusiness.branding.primary_color}
//                           onChange={(e) =>
//                             updateField(
//                               "branding.primary_color",
//                               e.target.value
//                             )
//                           }
//                           className="h-11 w-16 rounded-lg border border-gray-300 cursor-pointer"
//                         />
//                         <input
//                           type="text"
//                           value={editingBusiness.branding.primary_color}
//                           onChange={(e) =>
//                             updateField(
//                               "branding.primary_color",
//                               e.target.value
//                             )
//                           }
//                           className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Secondary Color
//                       </label>
//                       <div className="flex gap-3">
//                         <input
//                           type="color"
//                           value={editingBusiness.branding.secondary_color}
//                           onChange={(e) =>
//                             updateField(
//                               "branding.secondary_color",
//                               e.target.value
//                             )
//                           }
//                           className="h-11 w-16 rounded-lg border border-gray-300 cursor-pointer"
//                         />
//                         <input
//                           type="text"
//                           value={editingBusiness.branding.secondary_color}
//                           onChange={(e) =>
//                             updateField(
//                               "branding.secondary_color",
//                               e.target.value
//                             )
//                           }
//                           className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Tertiary Color
//                       </label>
//                       <div className="flex gap-3">
//                         <input
//                           type="color"
//                           value={editingBusiness.branding.tertiary_color}
//                           onChange={(e) =>
//                             updateField(
//                               "branding.tertiary_color",
//                               e.target.value
//                             )
//                           }
//                           className="h-11 w-16 rounded-lg border border-gray-300 cursor-pointer"
//                         />
//                         <input
//                           type="text"
//                           value={editingBusiness.branding.tertiary_color}
//                           onChange={(e) =>
//                             updateField(
//                               "branding.tertiary_color",
//                               e.target.value
//                             )
//                           }
//                           className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Typography
//                       </label>
//                       <select
//                         value={editingBusiness.branding.typography}
//                         onChange={(e) =>
//                           updateField("branding.typography", e.target.value)
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900"
//                       >
//                         {typographyOptions.map((font) => (
//                           <option key={font} value={font}>
//                             {font}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Business Details Section */}
//                 <div className="border-t border-gray-200 pt-6">
//                   <h4 className="text-lg font-bold text-gray-900 mb-5">
//                     Business Details
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Website URL
//                       </label>
//                       <input
//                         type="text"
//                         value={
//                           editingBusiness.businessdetails.business_website_url
//                         }
//                         onChange={(e) =>
//                           updateField(
//                             "businessDetails.business_website_url",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="example.com"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Tagline
//                       </label>
//                       <input
//                         type="text"
//                         value={editingBusiness.businessdetails.tagline}
//                         onChange={(e) =>
//                           updateField("businessDetails.tagline", e.target.value)
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="Your business tagline"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Industry
//                       </label>
//                       <input
//                         type="text"
//                         value={editingBusiness.businessdetails.industry}
//                         onChange={(e) =>
//                           updateField(
//                             "businessDetails.industry",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="e.g., Technology"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Founded Year
//                       </label>
//                       <input
//                         type="text"
//                         value={editingBusiness.businessdetails.founded_year}
//                         onChange={(e) =>
//                           updateField(
//                             "businessDetails.founded_year",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="2023"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Public Email
//                       </label>
//                       <input
//                         type="email"
//                         value={editingBusiness.businessdetails.public_email}
//                         onChange={(e) =>
//                           updateField(
//                             "businessDetails.public_email",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="contact@example.com"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Phone
//                       </label>
//                       <input
//                         type="tel"
//                         value={editingBusiness.businessdetails.phone}
//                         onChange={(e) =>
//                           updateField("businessDetails.phone", e.target.value)
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="+1234567890"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Headquarters
//                       </label>
//                       <input
//                         type="text"
//                         value={editingBusiness.businessdetails.headquarters}
//                         onChange={(e) =>
//                           updateField(
//                             "businessDetails.headquarters",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="123 Main Street, City, Country"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         About
//                       </label>
//                       <textarea
//                         value={editingBusiness.businessdetails.about}
//                         onChange={(e) =>
//                           updateField("businessDetails.about", e.target.value)
//                         }
//                         rows={4}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
//                         placeholder="Tell us about your business..."
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Features Section */}
//                 <div className="border-t border-gray-200 pt-6">
//                   <h4 className="text-lg font-bold text-gray-900 mb-5">
//                     Features
//                   </h4>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <label className="flex items-center cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                       <input
//                         type="checkbox"
//                         checked={editingBusiness.features.websiteEnabled}
//                         onChange={(e) =>
//                           updateField(
//                             "features.websiteEnabled",
//                             e.target.checked
//                           )
//                         }
//                         className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 border-gray-300"
//                       />
//                       <span className="ml-3 text-sm font-medium text-gray-700">
//                         Website
//                       </span>
//                     </label>
//                     <label className="flex items-center cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                       <input
//                         type="checkbox"
//                         checked={editingBusiness.features.ecommerceEnabled}
//                         onChange={(e) =>
//                           updateField(
//                             "features.ecommerceEnabled",
//                             e.target.checked
//                           )
//                         }
//                         className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 border-gray-300"
//                       />
//                       <span className="ml-3 text-sm font-medium text-gray-700">
//                         E-commerce
//                       </span>
//                     </label>
//                     <label className="flex items-center cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                       <input
//                         type="checkbox"
//                         checked={editingBusiness.features.blogEnabled}
//                         onChange={(e) =>
//                           updateField("features.blogEnabled", e.target.checked)
//                         }
//                         className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 border-gray-300"
//                       />
//                       <span className="ml-3 text-sm font-medium text-gray-700">
//                         Blog
//                       </span>
//                     </label>
//                     <label className="flex items-center cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                       <input
//                         type="checkbox"
//                         checked={editingBusiness.features.invoicesEnabled}
//                         onChange={(e) =>
//                           updateField(
//                             "features.invoicesEnabled",
//                             e.target.checked
//                           )
//                         }
//                         className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 border-gray-300"
//                       />
//                       <span className="ml-3 text-sm font-medium text-gray-700">
//                         Invoices
//                       </span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Settings Section */}
//                 <div className="border-t border-gray-200 pt-6">
//                   <h4 className="text-lg font-bold text-gray-900 mb-5">
//                     Settings
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Locale
//                       </label>
//                       <select
//                         value={editingBusiness.settings.locale}
//                         onChange={(e) =>
//                           updateField("settings.locale", e.target.value)
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900"
//                       >
//                         {localeOptions.map((locale) => (
//                           <option key={locale} value={locale}>
//                             {locale}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Currency
//                       </label>
//                       <select
//                         value={editingBusiness.settings.currency}
//                         onChange={(e) =>
//                           updateField("settings.currency", e.target.value)
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900"
//                       >
//                         {currencyOptions.map((currency) => (
//                           <option key={currency} value={currency}>
//                             {currency}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Timezone
//                       </label>
//                       <select
//                         value={editingBusiness.settings.timezone}
//                         onChange={(e) =>
//                           updateField("settings.timezone", e.target.value)
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-gray-900"
//                       >
//                         {timezoneOptions.map((timezone) => (
//                           <option key={timezone} value={timezone}>
//                             {timezone}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
//               <button
//                 onClick={closeModal}
//                 className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-6 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
