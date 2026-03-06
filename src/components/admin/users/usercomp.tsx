// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   CheckCircle,
//   XCircle,
//   User,
//   Briefcase,
//   Palette,
//   Check,
// } from "lucide-react";

// import { Brandingdetails } from "@/components/admin/users/brandingdetails";
// import { Businessdetails } from "@/components/admin/users/businessdetails";
// import { Userdetails } from "@/components/admin/users/userdetails";
// import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

// import { usePathname, useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { formatBrandSlug } from "@/lib/utils";
// import { useDispatch } from "react-redux";

// import { addCreatedAgency } from "@/hooks/slices/user/agencySlice";
// import { addCreatedBusiness } from "@/hooks/slices/business/BusinessSlice";
// import { addCreatedWebsite } from "@/hooks/slices/websites/WebsiteSlice";

// import { IUser } from "@/models/user";
// import { IBusiness } from "@/models/business";
// import { PrimaryDomains } from "./PrimaryDomain";

// type Role = "superadmin" | "admin" | "business" | "agency";
// type StepId = "agency" | "general" | "business" | "branding" | "review";

// function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
//   return (
//     <div className="grid grid-cols-12 gap-3 py-2">
//       <div className="col-span-5 text-sm text-gray-600">{label}</div>
//       <div className="col-span-7 text-sm font-semibold text-gray-900 text-right">
//         {value ?? <span className="text-gray-400 font-medium">-</span>}
//       </div>
//     </div>
//   );
// }

// function ColorDots({ colors }: { colors: string[] }) {
//   return (
//     <div className="flex items-center justify-end gap-2">
//       {colors.map((c) => (
//         <span
//           key={c}
//           className="h-5 w-5 rounded-md border border-gray-200 shadow-sm"
//           style={{ backgroundColor: c }}
//           title={c}
//         />
//       ))}
//     </div>
//   );
// }

// export default function BusinessCreatePage({
//   user,
//   agencies,
// }: {
//   user?: IUser;
//   agencies?: IBusiness[];
// }) {
//   const path = usePathname();
//   const router = useRouter();
//   const isAgencyPath = path.includes("agencies");
//   const dispatch = useDispatch();

//   const safeUser = useMemo(() => {
//     return {
//       id: user?.id ?? "",
//       role: (user?.role ?? "admin") as Role,
//       name: user?.name ?? "User",
//       email: user?.email ?? "",
//     };
//   }, [user]);

//   const [activeTab, setActiveTab] = useState<StepId>(
//     isAgencyPath ? "agency" : "business",
//   );
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [logoPreview, setLogoPreview] = useState<any>(null);

//   const [formData, setFormData] = useState<any>(() => ({
//     ...(isAgencyPath && {
//       agency_name: "",
//       agency_email: "",
//       agency_password: "",
//     }),
//     businessdetails: {
//       email: "",
//       password: "",
//       service: "",
//       business_name: "",
//       business_url: "",
//       tagline: "",
//       industry: "",
//       founded_year: "2023",
//       about: "",
//       public_email: "",
//       phone: "",
//       headquarters: "",
//       brand_name: "",
//       lang: [],
//       tenantId: "",
//       primary_domain: "",
//       globalStyle: "",
//       logo: "",
//     },
//     createdById: safeUser?.id,
//   }));

//   const [businessType, setBusinessType] = useState<any[]>([]);

//   useEffect(() => {
//     if (formData.businessdetails.industry) {
//       (async () => {
//         try {
//           const req = await fetch("/api/admin/attributessets");
//           const res = await req.json();
//           setBusinessType(res.items.length > 0 ? res.items : []);
//         } catch (error) {
//           toast.error(String(error));
//         }
//       })();
//     }
//   }, [formData.businessdetails.industry]);

//   useEffect(() => {
//     setFormData((prev: any) => ({
//       ...prev,
//       createdById: safeUser.id,
//       role:
//         safeUser.role === "superadmin" && isAgencyPath ? "agency" : prev.role,
//       businessdetails: {
//         ...prev.businessdetails,
//         tenantId: "",
//       },
//     }));
//   }, [safeUser.id, safeUser.role, isAgencyPath]);

//   const handleInputChange = (e: any) => {
//     const { name, value, type, files } = e.target;

//     if (name === "businessdetails.brand_name") {
//       const newvalu = formatBrandSlug(value);
//       setFormData((prev: any) => ({
//         ...prev,
//         businessdetails: {
//           ...prev.businessdetails,
//           brand_name: value,
//           business_url: newvalu,
//         },
//       }));
//       return;
//     }

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev: any) => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value },
//       }));
//       return;
//     }

//     if (type === "file") {
//       const file = files?.[0];
//       if (file) {
//         setFormData((prev: any) => ({
//           ...prev,
//           // branding: { ...prev.branding, logo: file },
//           businessdetails: { ...prev.businessdetails, logo: file },
//         }));
//         const reader = new FileReader();
//         reader.onloadend = () => setLogoPreview(reader.result);
//         reader.readAsDataURL(file);
//       }
//       return;
//     }

//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       setIsSubmitting(true);
//       setMessage({ type: "", text: "" });

//       const fd = new FormData();

//       if (isAgencyPath && safeUser.role === "superadmin") {
//         fd.append("agency_name", formData.agency_name || "");
//         fd.append("agency_email", formData.agency_email || "");
//         fd.append("agency_password", formData.agency_password || "");
//       }

//       fd.append("createdById", safeUser?.id.toString());
//       fd.append("businessdetails", JSON.stringify(formData.businessdetails));
//       // fd.append(
//       //   "branding",
//       //   JSON.stringify({
//       //     primary_color: formData.branding.primary_color,
//       //     secondary_color: formData.branding.secondary_color,
//       //     tertiary_color: formData.branding.tertiary_color,
//       //     typography: formData.branding.typography,
//       //   }),
//       // );

//       if (formData.businessdetails.logo)
//         fd.append("logo", formData.businessdetails.logo);

//       const res = await fetch("/api/public/onboarding", {
//         method: "POST",
//         body: fd,
//       });
//       const result = await res.json();

//       if (
//         result?.tenantId &&
//         result?.agency &&
//         result?.business &&
//         result?.website
//       ) {
//         dispatch(addCreatedAgency(result.agency));
//         dispatch(addCreatedBusiness(result.business));
//         dispatch(addCreatedWebsite(result.website));
//         toast.success(result.message);
//         setMessage({ type: "success", text: "Account created successfully!" });
//         setLogoPreview(null);
//         router.push(`/admin/agencies`);
//       } else {
//         setMessage({
//           type: "error",
//           text: result?.message || "Failed to create account.",
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage({
//         type: "error",
//         text: "Failed to create account. Please try again.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const tabs = isAgencyPath
//     ? [
//         {
//           id: "agency" as const,
//           label: "Agency Details",
//           desc: "Basic organization setup",
//           icon: User,
//         },
//         {
//           id: "business" as const,
//           label: "Website Setup",
//           desc: "Configure your website",
//           icon: Briefcase,
//         },
//         {
//           id: "general" as const,
//           label: "Account Details",
//           desc: "Basic information & branding",
//           icon: Briefcase,
//         },
//         {
//           id: "branding" as const,
//           label: "Branding",
//           desc: "Colors, logo & typography",
//           icon: Palette,
//         },
//         {
//           id: "review" as const,
//           label: "Review",
//           desc: "Review & submit",
//           icon: CheckCircle,
//         },
//       ]
//     : [
//         {
//           id: "business" as const,
//           label: "Business Setup",
//           desc: "Configure your business",
//           icon: Briefcase,
//         },
//         {
//           id: "general" as const,
//           label: "Account Details",
//           desc: "Basic information",
//           icon: Briefcase,
//         },
//         {
//           id: "branding" as const,
//           label: "Branding",
//           desc: "Colors, logo & typography",
//           icon: Palette,
//         },
//         {
//           id: "review" as const,
//           label: "Review",
//           desc: "Review & submit",
//           icon: CheckCircle,
//         },
//       ];

//   const currentIdx = useMemo(
//     () => tabs.findIndex((t) => t.id === activeTab),
//     [tabs, activeTab],
//   );

//   const goPrev = () => {
//     if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1].id);
//   };

//   const goNext = () => {
//     if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1].id);
//   };

//   const orgName = formData?.businessdetails?.business_name;
//   const slug =
//     formData?.businessdetails?.business_url ||
//     formatBrandSlug(formData?.businessdetails?.brand_name || "");
//   const ownerEmail = formData?.businessdetails?.email;
//   const plan = formData?.businessdetails?.service;
//   const colors = [
//     formData?.branding?.primary_color || "#6366f1",
//     formData?.branding?.secondary_color || "#8b5cf6",
//     formData?.branding?.tertiary_color || "#ec4899",
//   ];
//   const websiteFull =
//     formData?.businessdetails?.primary_domain ||
//     (slug ? `${slug}.kalptree.xyz` : "-");

//   const progressPercent = Math.round(((currentIdx + 1) / tabs.length) * 100);

//   return (
//     <div className="min-h-screen bg-[#f3f4f6]">
//       <div className="mx-auto max-w-5xl px-6 py-8">
//         {/* Breadcrumb */}
//         <div className="mb-6">
//           <BreadCrumbPage />
//         </div>

//         {/* ── HORIZONTAL STEPPER (top) ── */}
//         <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#0b1220] via-[#0f1a2f] to-[#0b1220] px-8 py-6 shadow-xl">
//           {/* Header row */}
//           <div className="mb-5 flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold text-white">Account Setup</h3>
//             </div>
//           </div>

//           {/* Steps */}
//           <div className="relative flex items-start gap-0">
//             {/* connector line behind */}
//             <div
//               className="absolute top-[18px] left-0 right-0 h-[2px] bg-white/10"
//               style={{ zIndex: 0 }}
//             />
//             {/* filled connector */}
//             <div
//               className="absolute top-[18px] left-0 h-[2px] bg-gradient-to-r from-blue-500 to-fuchsia-500 transition-all duration-500"
//               style={{
//                 width:
//                   currentIdx === 0
//                     ? "0%"
//                     : `${(currentIdx / (tabs.length - 1)) * 100}%`,
//                 zIndex: 1,
//               }}
//             />

//             {tabs.map((step, idx) => {
//               const isActive = idx === currentIdx;
//               const isDone = idx < currentIdx;

//               return (
//                 <button
//                   key={step.id}
//                   type="button"
//                   onClick={() => setActiveTab(step.id)}
//                   className="relative z-10 flex flex-1 flex-col items-center gap-2 px-2 text-center group"
//                 >
//                   {/* Circle */}
//                   <div
//                     className={[
//                       "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
//                       isDone
//                         ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
//                         : isActive
//                           ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-4 ring-blue-500/20"
//                           : "border-white/20 bg-[#0b1220] text-white/50 group-hover:border-white/40 group-hover:text-white/80",
//                     ].join(" ")}
//                   >
//                     {isDone ? <Check className="h-4 w-4" /> : idx + 1}
//                   </div>

//                   {/* Label */}
//                   <div>
//                     <p
//                       className={[
//                         "text-xs font-semibold leading-tight transition-colors",
//                         isActive
//                           ? "text-white"
//                           : isDone
//                             ? "text-emerald-400"
//                             : "text-white/50 group-hover:text-white/80",
//                       ].join(" ")}
//                     >
//                       {step.label}
//                     </p>
//                     <p className="mt-0.5 text-[10px] text-white/40 hidden sm:block">
//                       {step.desc}
//                     </p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── FORM AREA (full width) ── */}
//         <div>
//           {message.text && (
//             <div
//               className={`mb-5 rounded-xl border p-4 flex items-center gap-3 ${
//                 message.type === "success"
//                   ? "bg-green-50 text-green-800 border-green-200"
//                   : "bg-red-50 text-red-800 border-red-200"
//               }`}
//             >
//               {message.type === "success" ? (
//                 <CheckCircle className="h-5 w-5 shrink-0" />
//               ) : (
//                 <XCircle className="h-5 w-5 shrink-0" />
//               )}
//               <span className="text-sm">{message.text}</span>
//             </div>
//           )}

//           <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
//             {/* Step label inside form */}
//             <div className="mb-6 flex items-center gap-3">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C2D64]/10">
//                 {React.createElement(tabs[currentIdx]?.icon ?? Briefcase, {
//                   className: "h-4 w-4 text-[#7C2D64]",
//                 })}
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold text-gray-900">
//                   {tabs[currentIdx]?.label}
//                 </h2>
//                 <p className="text-xs text-gray-500">
//                   {tabs[currentIdx]?.desc}
//                 </p>
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="mb-6 h-px bg-gray-100" />

//             {/* Step content */}
//             {activeTab === "agency" && isAgencyPath && (
//               <Userdetails
//                 handleInputChange={handleInputChange}
//                 formData={formData}
//                 showPassword={showPassword}
//                 setShowPassword={setShowPassword}
//                 role={safeUser.role}
//               />
//             )}

//             {activeTab === "general" && (
//               <Businessdetails
//                 step="general"
//                 handleInputChange={handleInputChange}
//                 formData={formData}
//                 showPassword={showPassword}
//                 setShowPassword={setShowPassword}
//                 user={user}
//                 agencies={agencies}
//                 businessType={businessType}
//               />
//             )}

//             {activeTab === "business" && (
//               <div className="space-y-6">
//                 <Businessdetails
//                   step="business"
//                   handleInputChange={handleInputChange}
//                   formData={formData}
//                   showPassword={showPassword}
//                   setShowPassword={setShowPassword}
//                   user={user}
//                   agencies={agencies}
//                   businessType={businessType}
//                 />
//                 <div className="pt-6 border-t border-gray-200">
//                   <PrimaryDomains
//                     formData={formData}
//                     handleInputChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//             )}

//             {activeTab === "branding" && (
//               <Brandingdetails
//                 handleInputChange={handleInputChange}
//                 logoPreview={logoPreview}
//               />
//             )}

//             {/* Review step */}
//             {activeTab === "review" && (
//               <div className="space-y-6">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">
//                     Review Your Information
//                   </h2>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Please review all details before submitting
//                   </p>
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                   {/* Tenant Details */}
//                   <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
//                     <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
//                       Tenant Details
//                     </h3>
//                     <div className="mt-3 divide-y divide-gray-100">
//                       <InfoRow label="Organization:" value={orgName} />
//                       <InfoRow label="Slug:" value={slug} />
//                       <InfoRow label="Email:" value={ownerEmail} />
//                       <InfoRow
//                         label="Account Type:"
//                         value={formData?.businessdetails?.industry}
//                       />
//                       <InfoRow label="Plan:" value={plan} />
//                       <InfoRow
//                         label="Brand Colors:"
//                         value={<ColorDots colors={colors} />}
//                       />
//                     </div>
//                   </div>

//                   {/* Owner Account */}
//                   <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
//                     <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
//                       Owner Account
//                     </h3>
//                     <div className="mt-3 divide-y divide-gray-100">
//                       <InfoRow label="Name:" value={safeUser?.name} />
//                       <InfoRow
//                         label="Email:"
//                         value={safeUser?.email || ownerEmail}
//                       />
//                       <InfoRow label="Role:" value={safeUser?.role} />
//                     </div>
//                   </div>

//                   {/* Website Configuration */}
//                   <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 sm:col-span-2">
//                     <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
//                       Website Configuration
//                     </h3>
//                     <div className="mt-3 divide-y divide-gray-100">
//                       <InfoRow
//                         label="Website Name:"
//                         value={formData?.businessdetails?.brand_name}
//                       />
//                       <InfoRow label="Service Type:" value={plan} />
//                       <InfoRow label="Primary Domain:" value={websiteFull} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer navigation */}
//           <div className="mt-6 flex items-center justify-between">
//             <button
//               onClick={goPrev}
//               disabled={currentIdx === 0}
//               className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//             >
//               ← Previous
//             </button>

//             {activeTab === "review" ? (
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
//               >
//                 {isSubmitting ? "Submitting…" : "Submit & Create Tenant"}
//               </button>
//             ) : (
//               <button
//                 onClick={goNext}
//                 className="rounded-lg bg-[#7C2D64] px-8 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#6B2457] transition-colors"
//               >
//                 Next →
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  Palette,
  Check,
} from "lucide-react";

import { Brandingdetails } from "@/components/admin/users/brandingdetails";
import { Businessdetails } from "@/components/admin/users/businessdetails";
import { Userdetails } from "@/components/admin/users/userdetails";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatBrandSlug } from "@/lib/utils";
import { useDispatch } from "react-redux";

import { addCreatedAgency } from "@/hooks/slices/user/agencySlice";
import { addCreatedBusiness } from "@/hooks/slices/business/BusinessSlice";
import { addCreatedWebsite } from "@/hooks/slices/websites/WebsiteSlice";

import { IUser } from "@/models/user";
import { IBusiness } from "@/models/business";
import { PrimaryDomains } from "./PrimaryDomain";
import { extractStyleContent } from "@/utils/extract-css-variables";
import { transformRawToGlobalStyleModel } from "@/components/editor/style-editor/GlobalStyelModel";
import GetAlColorPallet from "../branding/color_pallet/GetAlColorPallet";
import AllColorPallets from "./AllColorPallets";

type Role = "superadmin" | "admin" | "business" | "agency";
type StepId = "agency" | "general" | "business" | "branding" | "review";

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-3 py-2">
      <div className="col-span-5 text-sm text-gray-600">{label}</div>
      <div className="col-span-7 text-sm font-semibold text-gray-900 text-right">
        {value ?? <span className="text-gray-400 font-medium">-</span>}
      </div>
    </div>
  );
}

function ColorDots({ colors }: { colors: string[] }) {
  return (
    <div className="flex items-center justify-end gap-1">
      {colors.map((c, idx) => (
        <div key={idx} className="flex flex-col items-center gap-1">
          <span
            className="h-6 w-6 rounded-md border border-gray-200 shadow-sm"
            style={{ backgroundColor: c || "#e5e7eb" }}
            title={c}
          />
        </div>
      ))}
    </div>
  );
}

export default function BusinessCreatePage({
  user,
  agencies,
}: {
  user?: IUser;
  agencies?: IBusiness[];
}) {
  const path = usePathname();
  const router = useRouter();
  const isAgencyPath = path.includes("agencies");
  const dispatch = useDispatch();

  const safeUser = useMemo(() => {
    return {
      id: user?.id ?? "",
      role: (user?.role ?? "admin") as Role,
      name: user?.name ?? "User",
      email: user?.email ?? "",
    };
  }, [user]);

  const [activeTab, setActiveTab] = useState<StepId>(
    isAgencyPath ? "agency" : "business",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [logoPreview, setLogoPreview] = useState<any>(null);

  const [formData, setFormData] = useState<any>(() => ({
    ...(isAgencyPath && {
      agency_name: "",
      agency_email: "",
      agency_password: "",
    }),
    businessdetails: {
      email: "",
      password: "",
      service: "",
      business_name: "",
      business_url: "",
      tagline: "",
      industry: "",
      founded_year: "",
      about: "",
      public_email: "",
      phone: "",
      headquarters: "",
      brand_name: "",
      lang: [],
      tenantId: "",
      primary_domain: "",
      globalStyle: "",
      logo: "",
    },
    createdById: safeUser?.id,
  }));

  const [businessType, setBusinessType] = useState<any[]>([]);

  useEffect(() => {
    if (formData.businessdetails.industry) {
      (async () => {
        try {
          const req = await fetch("/api/admin/attributessets");
          const res = await req.json();
          setBusinessType(res.items.length > 0 ? res.items : []);
        } catch (error) {
          toast.error(String(error));
        }
      })();
    }
  }, [formData.businessdetails.industry]);

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      createdById: safeUser.id,
      role:
        safeUser.role === "superadmin" && isAgencyPath ? "agency" : prev.role,
      businessdetails: {
        ...prev.businessdetails,
        tenantId: "",
      },
    }));
  }, [safeUser.id, safeUser.role, isAgencyPath]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files } = e.target;

    if (name === "businessdetails.brand_name") {
      const newvalu = formatBrandSlug(value);
      setFormData((prev: any) => ({
        ...prev,
        businessdetails: {
          ...prev.businessdetails,
          brand_name: value,
          business_url: newvalu,
        },
      }));
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
      return;
    }

    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setFormData((prev: any) => ({
          ...prev,
          businessdetails: { ...prev.businessdetails, logo: file },
        }));
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      }
      return;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const styleContentSelected = useMemo(() => {
    const major = transformRawToGlobalStyleModel(
      formData.businessdetails.globalStyle,
    );
    return Object.values(major.brand);
  }, [formData.businessdetails.globalStyle]);

  console.log(styleContentSelected);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setMessage({ type: "", text: "" });

      const fd = new FormData();

      const major = transformRawToGlobalStyleModel(
        formData.businessdetails.globalStyle,
      );

      const branding = {
        colors: [
          {
            name: "Default Color",
            seed: "",
            colors: {
              brand: major.body,
              buttons: major.buttonColors,
            },
            isGlobal: true,
          },
        ],
      };

      if (isAgencyPath && safeUser.role === "superadmin") {
        fd.append("agency_name", formData.agency_name || "");
        fd.append("agency_email", formData.agency_email || "");
        fd.append("agency_password", formData.agency_password || "");
      }

      fd.append("createdById", safeUser?.id.toString());
      fd.append("businessdetails", JSON.stringify(formData.businessdetails));
      fd.append("branding", JSON.stringify("branding"));
      if (formData.businessdetails.logo)
        fd.append("logo", formData.businessdetails.logo);

      const res = await fetch("/api/public/onboarding", {
        method: "POST",
        body: fd,
      });
      const result = await res.json();

      if (
        result?.tenantId &&
        result?.agency &&
        result?.business &&
        result?.website
      ) {
        dispatch(addCreatedAgency(result.agency));
        dispatch(addCreatedBusiness(result.business));
        dispatch(addCreatedWebsite(result.website));
        toast.success(result.message);
        setMessage({ type: "success", text: "Account created successfully!" });
        setLogoPreview(null);
        router.push(`/admin/agencies`);
      } else {
        setMessage({
          type: "error",
          text: result?.message || "Failed to create account.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to create account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = isAgencyPath
    ? [
        {
          id: "agency" as const,
          label: "Agency Details",
          desc: "Basic organization setup",
          icon: User,
        },
        {
          id: "business" as const,
          label: "Website Setup",
          desc: "Configure your website",
          icon: Briefcase,
        },
        {
          id: "general" as const,
          label: "Account Details",
          desc: "Basic information & branding",
          icon: Briefcase,
        },
        {
          id: "branding" as const,
          label: "Branding",
          desc: "Colors, logo & typography",
          icon: Palette,
        },
        {
          id: "review" as const,
          label: "Review",
          desc: "Review & submit",
          icon: CheckCircle,
        },
      ]
    : [
        {
          id: "business" as const,
          label: "Business Setup",
          desc: "Configure your business",
          icon: Briefcase,
        },
        {
          id: "general" as const,
          label: "Account Details",
          desc: "Basic information",
          icon: Briefcase,
        },
        {
          id: "branding" as const,
          label: "Branding",
          desc: "Colors, logo & typography",
          icon: Palette,
        },
        {
          id: "review" as const,
          label: "Review",
          desc: "Review & submit",
          icon: CheckCircle,
        },
      ];

  const currentIdx = useMemo(
    () => tabs.findIndex((t) => t.id === activeTab),
    [tabs, activeTab],
  );

  const goPrev = () => {
    if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1].id);
  };

  const goNext = () => {
    if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1].id);
  };

  // ── Derived review values (all from businessdetails) ──
  const bd = formData?.businessdetails ?? {};
  const orgName = bd.business_name;
  const slug = bd.business_url || formatBrandSlug(bd.brand_name || "");
  const ownerEmail = bd.email;
  const plan = bd.service;
  const industry = bd.industry;
  const phone = bd.phone;
  const headquarters = bd.headquarters;
  const tagline = bd.tagline;
  const publicEmail = bd.public_email;
  const typography = bd.typography;
  const foundedYear = bd.founded_year;
  const primaryDomain =
    bd.primary_domain || (slug ? `${slug}.kalptree.xyz` : "-");

  return (
    <>
      {/* get all color pallets */}
      <GetAlColorPallet />
      <div className="min-h-screen bg-[#f3f4f6] a">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <BreadCrumbPage />
          </div>

          {/* ── HORIZONTAL STEPPER (top) ── */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#0b1220] via-[#0f1a2f] to-[#0b1220] px-8 py-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Account Setup</h3>
              </div>
            </div>

            <div className="relative flex items-start gap-0">
              <div
                className="absolute top-[18px] left-0 right-0 h-[2px] bg-white/10"
                style={{ zIndex: 0 }}
              />
              <div
                className="absolute top-[18px] left-0 h-[2px] bg-gradient-to-r from-blue-500 to-fuchsia-500 transition-all duration-500"
                style={{
                  width:
                    currentIdx === 0
                      ? "0%"
                      : `${(currentIdx / (tabs.length - 1)) * 100}%`,
                  zIndex: 1,
                }}
              />

              {tabs.map((step, idx) => {
                const isActive = idx === currentIdx;
                const isDone = idx < currentIdx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveTab(step.id)}
                    className="relative z-10 flex flex-1 flex-col items-center gap-2 px-2 text-center group"
                  >
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                        isDone
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                          : isActive
                            ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-4 ring-blue-500/20"
                            : "border-white/20 bg-[#0b1220] text-white/50 group-hover:border-white/40 group-hover:text-white/80",
                      ].join(" ")}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>

                    <div>
                      <p
                        className={[
                          "text-xs font-semibold leading-tight transition-colors",
                          isActive
                            ? "text-white"
                            : isDone
                              ? "text-emerald-400"
                              : "text-white/50 group-hover:text-white/80",
                        ].join(" ")}
                      >
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-white/40 hidden sm:block">
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── FORM AREA ── */}
          <div>
            {message.text && (
              <div
                className={`mb-5 rounded-xl border p-4 flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              {/* Step label inside form */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C2D64]/10">
                  {React.createElement(tabs[currentIdx]?.icon ?? Briefcase, {
                    className: "h-4 w-4 text-[#7C2D64]",
                  })}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {tabs[currentIdx]?.label}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {tabs[currentIdx]?.desc}
                  </p>
                </div>
              </div>

              <div className="mb-6 h-px bg-gray-100" />

              {/* Step content */}
              {activeTab === "agency" && isAgencyPath && (
                <Userdetails
                  handleInputChange={handleInputChange}
                  formData={formData}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  role={safeUser.role}
                />
              )}

              {activeTab === "general" && (
                <Businessdetails
                  step="general"
                  handleInputChange={handleInputChange}
                  formData={formData}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  user={user}
                  agencies={agencies}
                  businessType={businessType}
                />
              )}

              {activeTab === "business" && (
                <div className="space-y-6">
                  <Businessdetails
                    step="business"
                    handleInputChange={handleInputChange}
                    formData={formData}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    user={user}
                    agencies={agencies}
                    businessType={businessType}
                  />
                  <div className="pt-6 border-t border-gray-200">
                    <PrimaryDomains
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {activeTab === "branding" && (
                <Brandingdetails
                  handleInputChange={handleInputChange}
                  logoPreview={logoPreview}
                />
              )}

              {/* ── Rev  iew Step ── */}
              {activeTab === "review" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Review Your Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Please review all details before submitting
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* ── Business Details ── */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                        Business Details
                      </h3>
                      <div className="divide-y divide-gray-100">
                        <InfoRow label="Business Name:" value={orgName} />
                        <InfoRow label="Industry:" value={industry} />
                        <InfoRow label="Founded Year:" value={foundedYear} />
                        <InfoRow label="Tagline:" value={tagline} />
                        <InfoRow label="Headquarters:" value={headquarters} />
                        <InfoRow label="Phone:" value={phone} />
                        <InfoRow label="Public Email:" value={publicEmail} />
                      </div>
                    </div>

                    {/* ── Account Details ── */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                        Account Details
                      </h3>
                      <div className="divide-y divide-gray-100">
                        <InfoRow label="Login Email:" value={ownerEmail} />
                        <InfoRow label="Plan / Service:" value={plan} />
                        <InfoRow label="Created By:" value={safeUser?.name} />
                        {/* <InfoRow label="Role:" value={safeUser?.role} /> */}
                        {isAgencyPath && safeUser.role === "superadmin" && (
                          <>
                            <InfoRow
                              label="Agency Name:"
                              value={formData?.agency_name}
                            />
                            <InfoRow
                              label="Agency Email:"
                              value={formData?.agency_email}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* ── Website Configuration ── */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                        Website Configuration
                      </h3>
                      <div className="divide-y divide-gray-100">
                        <InfoRow label="Brand Name:" value={bd.brand_name} />
                        <InfoRow label="URL Slug:" value={slug} />
                        <InfoRow
                          label="Primary Domain:"
                          value={primaryDomain}
                        />
                      </div>
                    </div>

                    {/* ── Branding ── */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                        Branding
                      </h3>
                      <div className="divide-y divide-gray-100">
                        {/* <InfoRow label="Typography:" value={typography} /> */}
                        <InfoRow
                          label="Brand Colors:"
                          value={<ColorDots colors={styleContentSelected} />}
                        />
                        <InfoRow
                          label="Logo:"
                          value={
                            logoPreview ? (
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="ml-auto h-10 w-10 rounded-md object-contain border border-gray-200"
                              />
                            ) : (
                              <span className="text-gray-400 font-medium">
                                No logo uploaded
                              </span>
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer navigation */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentIdx === 0}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>

              {activeTab === "review" ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                >
                  {isSubmitting ? "Submitting…" : "Submit & Create Tenant"}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="rounded-lg bg-[#7C2D64] px-8 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#6B2457] transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
