"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Globe,
  LayoutGrid,
  ShoppingCart,
  Megaphone,
  CheckCheck,
  X,
  CircleDotDashed,
  EyeOff,
  Eye,
} from "lucide-react";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { usePathname } from "next/navigation";
import IndustryRadioList from "./IndustryRadioList";
import BusinessTypeRadioList from "./BusinessType";
import { formatBrandSlug } from "@/lib/utils";
import { toast } from "sonner";
import { LanguageSelector } from "./languageSupport";
import { IUser } from "@/models/user";
import { IBusiness } from "@/models/business";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICE_OPTIONS = [
  {
    value: "WEBSITE_ONLY",
    title: "Website Only",
    desc: "Basic website hosting and management with space 1GB",
    Icon: Globe,
  },
  {
    value: "WEBSITE_CATALOGUE",
    title: "Website and Catalogue",
    desc: "Website hosting and catalogue with space 2GB",
    Icon: LayoutGrid,
  },
  {
    value: "WEBSITE_CATALOGUE_ECOMMERCE",
    title: "Website, Catalogue and E-commerce",
    desc: "Website hosting + catalogue + e-commerce with space 3GB",
    Icon: ShoppingCart,
  },
  {
    value: "WEBSITE_CATALOGUE_ECOMMERCE_MARKETING",
    title: "Website, Catalogue, E-commerce and Marketing",
    desc: "Everything included with space 5GB and marketing",
    Icon: Megaphone,
  },
];

interface Props {
  step: "general" | "business";
  handleInputChange: (e: any) => void;
  formData: any;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  user?: IUser;
  agencies?: IBusiness[];
  businessType?: any[];
}

export const Businessdetails = ({
  step,
  handleInputChange,
  formData,
  user,
  agencies,
  businessType = [],
}: Props) => {
  const path = usePathname();

  const [checked, setChecked] = useState<boolean | null>(null);

  const subdomain =
    formData?.businessdetails?.business_url ||
    formatBrandSlug(formData?.businessdetails?.brand_name || "");

  const handleCheck = async () => {
    const slug = formatBrandSlug(subdomain || "");
    if (!slug) return;

    setChecked(null);
    const url = `${slug}.kalptree.xyz`;

    try {
      const req = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: url }),
      });
      const res = await req.json();
      setChecked(!!res?.success);
      res?.success
        ? toast.success("Website available")
        : toast.error("Website already exists");
    } catch {
      setChecked(false);
      toast.error("Failed to check website");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleSetShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // -----------------------------
  // STEP 1: GENERAL INFORMATION
  // -----------------------------
  if (step === "general") {
    return (
      <div className="space-y-6">
        <div className="bg-gray-100 p-6 rounded-md border border-indigo-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Account and Business Information
          </h3>

          <div className="space-y-8">
            {/* Admin Credential Group */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
                Admin Credential
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Brand name info"
                      >
                        <Info size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">Use this for login.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    name="businessdetails.email"
                    value={formData?.businessdetails?.email || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="businessdetails.password"
                      value={formData?.businessdetails?.password || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Time@1234"
                    />

                    <button
                      type="button"
                      onClick={handleSetShowPassword}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details Group */}
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Company Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name
                  </label> */}
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Business Name
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Business name info"
                          >
                            <Info size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-xs">
                            Provide full business name as per registration for
                            legal and policy page.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="text"
                    name="businessdetails.business_name"
                    value={formData?.businessdetails?.business_name || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="KalpTree"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Brand Name
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Brand name info"
                          >
                            <Info size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-xs">
                            This is the brand name which will be used for SEO
                            and Promotions throughout the website.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="text"
                    name="businessdetails.brand_name"
                    value={formData?.businessdetails?.brand_name || ""}
                    onChange={(e) => {
                      setChecked(null);
                      handleInputChange(e);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    placeholder="codified"
                  />
                </div>

                {/* Website URL block (keep commented if needed)
      <div className="md:col-span-2">
        ...
      </div>
      */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    name="businessdetails.tagline"
                    value={formData?.businessdetails?.tagline || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    placeholder="AI-Powered Architecture & Design"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About / Bio
                  </label>
                  <textarea
                    name="businessdetails.about"
                    value={formData?.businessdetails?.about || ""}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white resize-none"
                    placeholder="Write something about the business..."
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formData?.businessdetails?.about?.length || 0}/500
                    characters
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md border border-blue-100 mt-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Contact & Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website URL
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white">
                  <span className="px-3 text-gray-500">https://</span>
                  <input
                    type="text"
                    name="businessdetails.business_website_url"
                    value={
                      formData?.businessdetails?.business_website_url || ""
                    }
                    onChange={handleInputChange}
                    className="flex-1 px-2 py-3 outline-none"
                    placeholder="KalpTree.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Public Email
                </label>
                <input
                  type="email"
                  name="businessdetails.public_email"
                  value={formData?.businessdetails?.public_email || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
                  placeholder="contact@KalpTree.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="businessdetails.phone"
                  value={formData?.businessdetails?.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Headquarters Address
                </label>
                <input
                  type="text"
                  name="businessdetails.headquarters"
                  value={formData?.businessdetails?.headquarters || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
                  placeholder="123 Innovation Dr, Tech City, CA"
                />
              </div>
            </div>
          </div>

          {user?.role === "superadmin" && !path.includes("agencies") && (
            <div className="bg-white p-6 rounded-md border border-gray-200 mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assign Agency (Tenant)
              </label>

              <Select
                value={formData?.businessdetails?.tenantId || ""}
                onValueChange={(v) =>
                  handleInputChange({
                    target: { name: "businessdetails.tenantId", value: v },
                  } as unknown as React.ChangeEvent<HTMLSelectElement>)
                }
              >
                <SelectTrigger className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-primary-500">
                  <SelectValue placeholder="Select an agency" />
                </SelectTrigger>

                <SelectContent>
                  {agencies?.map((agency: any) => (
                    <SelectItem key={agency?._id} value={agency?._id}>
                      {agency?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------
  // STEP 2: BUSINESS DETAILS
  // -----------------------------
  const selected = formData?.businessdetails?.service ?? "";

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 p-6 rounded-md border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          Business Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <IndustryRadioList
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>

          <div className="md:col-span-2">
            <BusinessTypeRadioList
              formData={formData}
              handleInputChange={handleInputChange}
              businessType={businessType}
            />
          </div>

          <hr className="col-span-2" />

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Service Type
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {SERVICE_OPTIONS.map((opt, idx) => {
                const isChecked = selected === opt.value;
                const id = `service_${idx}_${opt.value}`;
                const Icon = opt.Icon;

                return (
                  <label
                    key={opt.value}
                    htmlFor={id}
                    className={[
                      "relative flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-all",
                      "hover:shadow-sm",
                      isChecked
                        ? "border-0 ring-1 ring-primary bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white",
                    ].join(" ")}
                  >
                    <input
                      id={id}
                      type="radio"
                      name="businessdetails.service"
                      value={opt.value}
                      checked={isChecked}
                      onChange={handleInputChange}
                      className="sr-only"
                    />

                    <div
                      className={[
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        isChecked ? "bg-primary-50" : "bg-gray-50",
                      ].join(" ")}
                    >
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {opt.title}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>

                    {isChecked && (
                      <span className="absolute right-3 top-3 rounded-full bg-primary/80 text-white px-3 py-1 text-xs font-semibold border border-accent00">
                        Selected
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <hr className="col-span-2" />

          <div className="md:col-span-2">
            <LanguageSelector
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
