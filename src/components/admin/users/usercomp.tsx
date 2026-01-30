"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  Palette,
  Home,
} from "lucide-react";

import { Brandingdetails } from "@/components/admin/users/brandingdetails";
import { Businessdetails } from "@/components/admin/users/businessdetails";
import { Userdetails } from "@/components/admin/users/userdetails";
import Link from "next/link";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatBrandSlug } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { addCreatedAgency } from "@/hooks/slices/user/agencySlice";
import { addCreatedBusiness } from "@/hooks/slices/business/BusinessSlice";
import { addCreatedWebsite } from "@/hooks/slices/websites/WebsiteSlice";
import { RootState } from "@/store/store";
import { IUser } from "@/models/user";
import { IBusiness } from "@/models/business";

type Role = "superadmin" | "admin" | "business" | "agency";

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

  const [activeTab, setActiveTab] = useState(
    isAgencyPath ? "agency" : "business"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [logoPreview, setLogoPreview] = useState<any>(null);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");

  const [formData, setFormData] = useState(() => ({
    // Only include agency fields if isAgencyPath is true
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


  React.useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      createdById: safeUser.id,
      role:
        safeUser.role === "superadmin" && isAgencyPath ? "agency" : prev.role,
      businessdetails: {
        ...formData.businessdetails,
        tenantId: "",
      },
    }));
  }, [safeUser.id, safeUser.role, isAgencyPath]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files } = e.target;
    console.log(name, value, type, files);

    if (name == "businessdetails.brand_name") {
      let newvalu = formatBrandSlug(value);
      console.log(newvalu);
      const cloned = structuredClone(formData);
      cloned.businessdetails.business_url = newvalu;
      setFormData(cloned);
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

    // if (name === "agency_name") {
    //   if (!/^[a-zA-Z0-9 ]*$/.test(value)) return;

    //   setFormData((prev: any) => ({
    //     ...prev,
    //     agency_name: value,
    //     agency_url_suffix: slugify(value),
    //   }));
    //   return;
    // }

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

      // Only append agency fields if path includes "agency"
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
        })
      );

      if (formData.branding.logo) {
        fd.append("logo", formData.branding.logo);
      }

      const res = await fetch("/api/public/onboarding", {
        method: "POST",
        body: fd,
      });

      const result = await res.json();

      if (result?.tenantId &&
        result?.agency &&
        result?.business &&
        result?.website) {
        // dispatch add created agency
        dispatch(addCreatedAgency(result.agency));

        // dispatch add created business
        dispatch(addCreatedBusiness(result.business));

        // dispatch add created website
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
      { id: "agency", label: "Agency Details", icon: User },
      { id: "business", label: "Business Details", icon: Briefcase },
      { id: "branding", label: "Branding", icon: Palette },
    ]
    : [
      { id: "business", label: "Business Details", icon: Briefcase },
      { id: "branding", label: "Branding", icon: Palette },
    ];

  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className=" mx-auto">
        <div className="mb-8">
          <BreadCrumbPage />

          <p className="text-gray-600">
            {isAgencyPath
              ? "Create agency and business accounts with complete branding"
              : "Create and manage business accounts with complete branding"}
          </p>
        </div>

        <div className="bg-white rounded-md  overflow-hidden border border-primary-100">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-semibold transition-all relative ${activeTab === tab.id
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-8">
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
                  }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {message.text}
              </div>
            )}

            {activeTab === "agency" && isAgencyPath && (
              <Userdetails
                handleInputChange={handleInputChange}
                formData={formData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                role={safeUser.role}
              />
            )}

            {activeTab === "business" && (
              <Businessdetails
                handleInputChange={handleInputChange}
                formData={formData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                user={user}
                agencies={agencies}
              />
            )}

            {activeTab === "branding" && (
              <Brandingdetails
                handleInputChange={handleInputChange}
                formData={formData}
                logoPreview={logoPreview}
              />
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  const idx = tabs.findIndex((t) => t.id === activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1].id);
                }}
                disabled={activeTab === tabs[0].id}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                Previous
              </button>

              <div className="flex gap-3">
                {activeTab === "branding" ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 disabled:from-primary-400 disabled:to-purple-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const idx = tabs.findIndex((t) => t.id === activeTab);
                      if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                    }}
                    className="px-8 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
