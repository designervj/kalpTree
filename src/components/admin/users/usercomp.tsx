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
    <div className="flex items-center justify-end gap-2">
      {colors.map((c) => (
        <span
          key={c}
          className="h-5 w-5 rounded-md border border-gray-200 shadow-sm"
          style={{ backgroundColor: c }}
          title={c}
        />
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
    isAgencyPath ? "agency" : "general",
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
      industry: "Architecture",
      founded_year: "2023",
      about: "",
      public_email: "",
      phone: "",
      headquarters: "",
      brand_name: "",
      lang: [],
      tenantId: "",
      business_website_url: "",
      primary_domain: "",
      added_domains: [],
    },

    branding: {
      logo: null as File | null,
      primary_color: "#6366f1",
      secondary_color: "#8b5cf6",
      tertiary_color: "#ec4899",
      typography: "Inter",
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
          if (res.items.length > 0) {
            setBusinessType(res.items);
          } else {
            setBusinessType([]);
          }
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

  // Update primary_domain when business_url changes
  // useEffect(() => {
  //   if (formData.businessdetails.business_url) {
  //     setFormData((prev: any) => ({
  //       ...prev,
  //       businessdetails: {
  //         ...prev.businessdetails,
  //         primary_domain: `${formData.businessdetails.business_url}.kalptree.xyz`,
  //       },
  //     }));
  //   }
  // }, [formData.businessdetails.business_url]);


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
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
      return;
    }

    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setFormData((prev: any) => ({
          ...prev,
          branding: {
            ...prev.branding,
            logo: file,
          },
        }));

        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      }
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setMessage({ type: "", text: "" });

      const fd = new FormData();

      if (isAgencyPath && safeUser.role === "superadmin") {
        fd.append("agency_name", formData.agency_name || "");
        fd.append("agency_email", formData.agency_email || "");
        fd.append("agency_password", formData.agency_password || "");
      }

      fd.append("createdById", safeUser?.id.toString());
      fd.append("businessdetails", JSON.stringify(formData.businessdetails));

      fd.append(
        "branding",
        JSON.stringify({
          primary_color: formData.branding.primary_color,
          secondary_color: formData.branding.secondary_color,
          tertiary_color: formData.branding.tertiary_color,
          typography: formData.branding.typography,
        }),
      );

      if (formData.branding.logo) fd.append("logo", formData.branding.logo);

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

  // ✅ 4 Steps
  const tabs = isAgencyPath
    ? [
        {
          id: "agency" as const,
          label: "Agency Details",
          desc: "Basic organization setup",
          icon: User,
        },
        {
          id: "general" as const,
          label: "Account Details",
          desc: "Basic information & branding",
          icon: Briefcase,
        },
        {
          id: "business" as const,
          label: "Website Setup",
          desc: "Configure your website",
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
          id: "general" as const,
          label: "Account Details",
          desc: "Basic information",
          icon: Briefcase,
        },
        {
          id: "business" as const,
          label: "Website Setup",
          desc: "Configure your website",
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

  // values for review
  const orgName = formData?.businessdetails?.business_name;
  const slug =
    formData?.businessdetails?.business_url ||
    formatBrandSlug(formData?.businessdetails?.brand_name || "");
  const ownerEmail = formData?.businessdetails?.email;
  const plan = formData?.businessdetails?.service;
  const colors = [
    formData?.branding?.primary_color || "#6366f1",
    formData?.branding?.secondary_color || "#8b5cf6",
    formData?.branding?.tertiary_color || "#ec4899",
  ];

  const websiteFull =
    formData?.businessdetails?.primary_domain ||
    (slug ? `${slug}.kalptree.xyz` : "-");

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <BreadCrumbPage />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden">
              {message.text && (
                <div
                  className={`mb-5 rounded-xl border p-4 flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              {/* main */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
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

                    {/* Primary Domains Section - Added after About section */}
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
                    formData={formData}
                    logoPreview={logoPreview}
                  />
                )}

                {/* ✅ REVIEW STEP */}
                {activeTab === "review" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Review Your Information
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Please review all details before submitting
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Tenant Details */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <h3 className="text-base font-semibold text-gray-900">
                          Tenant Details
                        </h3>
                        <div className="mt-3">
                          <InfoRow label="Organization:" value={orgName} />
                          <InfoRow label="Slug:" value={slug} />
                          <InfoRow label="Email:" value={ownerEmail} />
                          <InfoRow
                            label="Account Type:"
                            value={formData?.businessdetails?.industry}
                          />
                          <InfoRow label="Plan:" value={plan} />
                          <InfoRow
                            label="Brand Colors:"
                            value={<ColorDots colors={colors} />}
                          />
                        </div>
                      </div>

                      {/* Owner Account */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <h3 className="text-base font-semibold text-gray-900">
                          Owner Account
                        </h3>
                        <div className="mt-3">
                          <InfoRow label="Name:" value={safeUser?.name} />
                          <InfoRow
                            label="Email:"
                            value={safeUser?.email || ownerEmail}
                          />
                          <InfoRow label="Role:" value={safeUser?.role} />
                        </div>
                      </div>

                      {/* Website Configuration */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <h3 className="text-base font-semibold text-gray-900">
                          Website Configuration
                        </h3>
                        <div className="mt-3">
                          <InfoRow
                            label="Website Name:"
                            value={formData?.businessdetails?.brand_name}
                          />
                          <InfoRow label="Service Type:" value={plan} />
                          <InfoRow
                            label="Primary Domain:"
                            value={websiteFull}
                          />
                          {formData?.businessdetails?.added_domains?.length >
                            0 && (
                            <InfoRow
                              label="Additional Domains:"
                              value={
                                <div className="text-right space-y-1">
                                  {formData.businessdetails.added_domains.map(
                                    (domain: string) => (
                                      <div key={domain} className="text-sm">
                                        {domain}
                                      </div>
                                    ),
                                  )}
                                </div>
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* footer buttons */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={goPrev}
                  disabled={currentIdx === 0}
                  className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {activeTab === "review" ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full ml-6 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 px-7 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit & Create Tenant"}
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    className="rounded-md bg-[#7C2D64] px-7 py-2 text-sm font-semibold text-white shadow hover:bg-[#6B2457]"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="rounded-2xl bg-gradient-to-b from-[#0b1220] via-[#0f1a2f] to-[#0b1220] p-6 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Account Setup
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    Complete all steps to get started
                  </p>
                </div>

                <div className="space-y-4">
                  {tabs.map((step, idx) => {
                    const isActive = idx === currentIdx;
                    const isDone = idx < currentIdx;

                    return (
                      <div key={step.id} className="relative">
                        {idx !== tabs.length - 1 && (
                          <div className="absolute left-[33px] top-[42px] h-[68px] w-[2px] bg-white/10" />
                        )}

                        <button
                          type="button"
                          onClick={() => setActiveTab(step.id)}
                          className={[
                            "w-full rounded-xl p-4 text-left transition",
                            isActive
                              ? "bg-white/10 ring-1 ring-white/15"
                              : "bg-white/5 hover:bg-white/10",
                          ].join(" ")}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={[
                                "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                                isDone
                                  ? "bg-emerald-500 text-white"
                                  : isActive
                                    ? "bg-blue-600 text-white ring-4 ring-blue-600/25"
                                    : "bg-white/10 text-white/70",
                              ].join(" ")}
                            >
                              {isDone ? <Check className="h-4 w-4" /> : idx + 1}
                            </div>

                            <div className="min-w-0">
                              <p
                                className={[
                                  "font-semibold",
                                  isActive ? "text-white" : "text-white/80",
                                ].join(" ")}
                              >
                                {step.label}
                              </p>
                              <p className="mt-1 text-xs text-white/60">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/75">
                    Need help? Contact our support team at
                  </p>
                  <p className="mt-1 text-sm font-semibold text-blue-300">
                    support@example.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* end right */}
        </div>
      </div>
    </div>
  );
}


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
//     isAgencyPath ? "agency" : "general",
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
//       industry: "Architecture",
//       founded_year: "2023",
//       about: "",
//       public_email: "",
//       phone: "",
//       headquarters: "",
//       brand_name: "",
//       lang: [],
//       tenantId: "",
//       business_website_url: "",
//     },

//     branding: {
//       logo: null as File | null,
//       primary_color: "#6366f1",
//       secondary_color: "#8b5cf6",
//       tertiary_color: "#ec4899",
//       typography: "Inter",
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
//           if (res.items.length > 0) {
//             setBusinessType(res.items);
//           }
//           else{
//             setBusinessType([])
//           }
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

//   console.log(formData);

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
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }));
//       return;
//     }

//     if (type === "file") {
//       const file = files?.[0];
//       if (file) {
//         setFormData((prev: any) => ({
//           ...prev,
//           branding: {
//             ...prev.branding,
//             logo: file,
//           },
//         }));

//         const reader = new FileReader();
//         reader.onloadend = () => setLogoPreview(reader.result);
//         reader.readAsDataURL(file);
//       }
//       return;
//     }

//     setFormData((prev: any) => ({
//       ...prev,
//       [name]: value,
//     }));
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

//       fd.append(
//         "branding",
//         JSON.stringify({
//           primary_color: formData.branding.primary_color,
//           secondary_color: formData.branding.secondary_color,
//           tertiary_color: formData.branding.tertiary_color,
//           typography: formData.branding.typography,
//         }),
//       );

//       if (formData.branding.logo) fd.append("logo", formData.branding.logo);

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

//   // ✅ 4 Steps
//   const tabs = isAgencyPath
//     ? [
//         {
//           id: "agency" as const,
//           label: "Agency Details",
//           desc: "Basic organization setup",
//           icon: User,
//         },
//         {
//           id: "general" as const,
//           label: "Account Details",
//           desc: "Basic information & branding",
//           icon: Briefcase,
//         },
//         {
//           id: "business" as const,
//           label: "Website Setup",
//           desc: "Configure your website",
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
//           id: "general" as const,
//           label: "Account Details",
//           desc: "Basic information",
//           icon: Briefcase,
//         },
//         {
//           id: "business" as const,
//           label: "Website Setup",
//           desc: "Configure your website",
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

//   // values for review
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

//   const websiteFull = slug ? `https://${slug}.kalptree.xyz` : "-";

//   return (
//     <div className="min-h-screen bg-[#f3f4f6]">
//       <div className="mx-auto max-w-7xl px-6 py-8">
//         <div className="mb-6">
//           <BreadCrumbPage />
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
//           {/* LEFT */}
//           <div className="lg:col-span-8">
//             <div className="overflow-hidden">
//               {message.text && (
//                 <div
//                   className={`mb-5 rounded-xl border p-4 flex items-center gap-3 ${
//                     message.type === "success"
//                       ? "bg-green-50 text-green-800 border-green-200"
//                       : "bg-red-50 text-red-800 border-red-200"
//                   }`}
//                 >
//                   {message.type === "success" ? (
//                     <CheckCircle className="h-5 w-5" />
//                   ) : (
//                     <XCircle className="h-5 w-5" />
//                   )}
//                   <span className="text-sm">{message.text}</span>
//                 </div>
//               )}

//               {/* main */}
//               <div className="rounded-xl border border-gray-200 bg-white p-6">
//                 {activeTab === "agency" && isAgencyPath && (
//                   <Userdetails
//                     handleInputChange={handleInputChange}
//                     formData={formData}
//                     showPassword={showPassword}
//                     setShowPassword={setShowPassword}
//                     role={safeUser.role}
//                   />
//                 )}

//                 {activeTab === "general" && (
//                   <Businessdetails
//                     step="general"
//                     handleInputChange={handleInputChange}
//                     formData={formData}
//                     showPassword={showPassword}
//                     setShowPassword={setShowPassword}
//                     user={user}
//                     agencies={agencies}
//                     businessType={businessType}
//                   />
//                 )}

//                 {activeTab === "business" && (
//                   <Businessdetails
//                     step="business"
//                     handleInputChange={handleInputChange}
//                     formData={formData}
//                     showPassword={showPassword}
//                     setShowPassword={setShowPassword}
//                     user={user}
//                     agencies={agencies}
//                     businessType={businessType}
//                   />
//                 )}

//                 {activeTab === "branding" && (
//                   <Brandingdetails
//                     handleInputChange={handleInputChange}
//                     formData={formData}
//                     logoPreview={logoPreview}
//                   />
//                 )}

//                 {/* ✅ REVIEW STEP */}
//                 {activeTab === "review" && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         Review Your Information
//                       </h2>
//                       <p className="mt-1 text-sm text-gray-600">
//                         Please review all details before submitting
//                       </p>
//                     </div>

//                     <div className="space-y-4">
//                       {/* Tenant Details */}
//                       <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
//                         <h3 className="text-base font-semibold text-gray-900">
//                           Tenant Details
//                         </h3>
//                         <div className="mt-3">
//                           <InfoRow label="Organization:" value={orgName} />
//                           <InfoRow label="Slug:" value={slug} />
//                           <InfoRow label="Email:" value={ownerEmail} />
//                           <InfoRow
//                             label="Account Type:"
//                             value={formData?.businessdetails?.industry}
//                           />
//                           <InfoRow label="Plan:" value={plan} />
//                           <InfoRow
//                             label="Brand Colors:"
//                             value={<ColorDots colors={colors} />}
//                           />
//                         </div>
//                       </div>

//                       {/* Owner Account */}
//                       <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
//                         <h3 className="text-base font-semibold text-gray-900">
//                           Owner Account
//                         </h3>
//                         <div className="mt-3">
//                           <InfoRow label="Name:" value={safeUser?.name} />
//                           <InfoRow
//                             label="Email:"
//                             value={safeUser?.email || ownerEmail}
//                           />
//                           <InfoRow label="Role:" value={safeUser?.role} />
//                         </div>
//                       </div>

//                       {/* Website Configuration */}
//                       <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
//                         <h3 className="text-base font-semibold text-gray-900">
//                           Website Configuration
//                         </h3>
//                         <div className="mt-3">
//                           <InfoRow
//                             label="Website Name:"
//                             value={formData?.businessdetails?.brand_name}
//                           />
//                           <InfoRow label="Service Type:" value={plan} />
//                           <InfoRow
//                             label="Primary Domain:"
//                             value={websiteFull}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* footer buttons */}
//               <div className="mt-6 flex items-center justify-between">
//                 <button
//                   onClick={goPrev}
//                   disabled={currentIdx === 0}
//                   className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>

//                 {activeTab === "review" ? (
//                   <button
//                     onClick={handleSubmit}
//                     disabled={isSubmitting}
//                     className="w-full ml-6 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 px-7 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting ? "Submitting..." : "Submit & Create Tenant"}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={goNext}
//                     className="rounded-md bg-[#7C2D64] px-7 py-2 text-sm font-semibold text-white shadow hover:bg-[#6B2457]"
//                   >
//                     Next
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="lg:col-span-4">
//             <div className="sticky top-6">
//               <div className="rounded-2xl bg-gradient-to-b from-[#0b1220] via-[#0f1a2f] to-[#0b1220] p-6 shadow-xl">
//                 <div className="mb-6">
//                   <h3 className="text-xl font-bold text-white">
//                     Account Setup
//                   </h3>
//                   <p className="mt-1 text-sm text-white/70">
//                     Complete all steps to get started
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   {tabs.map((step, idx) => {
//                     const isActive = idx === currentIdx;
//                     const isDone = idx < currentIdx;

//                     return (
//                       <div key={step.id} className="relative">
//                         {idx !== tabs.length - 1 && (
//                           <div className="absolute left-[33px] top-[42px] h-[68px] w-[2px] bg-white/10" />
//                         )}

//                         <button
//                           type="button"
//                           onClick={() => setActiveTab(step.id)}
//                           className={[
//                             "w-full rounded-xl p-4 text-left transition",
//                             isActive
//                               ? "bg-white/10 ring-1 ring-white/15"
//                               : "bg-white/5 hover:bg-white/10",
//                           ].join(" ")}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div
//                               className={[
//                                 "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
//                                 isDone
//                                   ? "bg-emerald-500 text-white"
//                                   : isActive
//                                     ? "bg-blue-600 text-white ring-4 ring-blue-600/25"
//                                     : "bg-white/10 text-white/70",
//                               ].join(" ")}
//                             >
//                               {isDone ? <Check className="h-4 w-4" /> : idx + 1}
//                             </div>

//                             <div className="min-w-0">
//                               <p
//                                 className={[
//                                   "font-semibold",
//                                   isActive ? "text-white" : "text-white/80",
//                                 ].join(" ")}
//                               >
//                                 {step.label}
//                               </p>
//                               <p className="mt-1 text-xs text-white/60">
//                                 {step.desc}
//                               </p>
//                             </div>
//                           </div>
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
//                   <p className="text-sm text-white/75">
//                     Need help? Contact our support team at
//                   </p>
//                   <p className="mt-1 text-sm font-semibold text-blue-300">
//                     support@example.com
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* end right */}
//         </div>
//       </div>
//     </div>
//   );
// }

