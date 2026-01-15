import {
  Building2,
  MapPin,
  Eye,
  EyeOff,
  Globe,
  LayoutGrid,
  ShoppingCart,
  Megaphone,
  CheckCheck,
  X,
  CircleDotDashed,
} from "lucide-react";
import { usePathname } from "next/navigation";
import IndustryRadioList from "./IndustryRadioList";
import { formatBrandSlug } from "@/lib/utils";
import { useEffect, useState } from "react";
import { setrelatedtowebsites } from "../../../../utils/helperSet";
import { toast } from "sonner";
import { LanguageSelector } from "./languageSupport";

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

export const Businessdetails = ({
  handleInputChange,
  formData,
  showPassword,
  setShowPassword,
  user,
  agencies = [
    {
      _id: "234234",
      name: "Admin",
    },
  ],
}: any) => {
  const path = usePathname();

  useEffect(() => {
    (async () => {
      const req = await fetch("/api/websites");
      const res = await req.json();
    })();
  }, []);

  const handleCheck = async (websitename: string) => {
    if (!websitename) {
      return;
    }
    const url = `${websitename}.kalptree.xyz`;
    const req = await fetch("/api/websites", {
      method: "POST",
      body: JSON.stringify({ website: url }),
    });
    const res = await req.json();
    setChecked(res.success);
  };

  const [checked, setChecked] = useState<null | Boolean>(null);

  const selected = formData?.businessdetails?.service ?? "";

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 p-6 rounded-md border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          General Information
        </h3>
        {/* Business User Fields */}
        <div className="bg-gray-100  rounded-md">
          <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
            Business Account Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="businessdetails.email"
                value={formData.businessdetails.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="businessdetails.password"
                  value={formData.businessdetails.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="businessdetails.business_name"
                value={formData.businessdetails.business_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="KalpTree"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                name="businessdetails.brand_name"
                value={formData.businessdetails.brand_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                placeholder="KaplTree"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Website URL
                {
                  {
                    true: (
                      <>
                        <CheckCheck className="text-green-600" size={16} />
                        <span className="text-xs font-medium text-green-600">
                          Website available
                        </span>
                      </>
                    ),
                    false: (
                      <>
                        <X className="text-red-600" size={16} />
                        <span className="text-xs font-medium text-red-600">
                          Website already exists
                        </span>
                      </>
                    ),
                    pending: (
                      <CircleDotDashed className="text-orange-500" size={16} />
                    ),
                  }[
                    checked === true
                      ? "true"
                      : checked === false
                      ? "false"
                      : "pending"
                  ]
                }
              </label>

              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 bg-white">
                <input
                  type="text"
                  name="businessdetails.businsess_url"
                  value={formData.businessdetails.business_url}
                  // onChange={handleInputChange}
                  className="flex-1 px-3 py-3 outline-none"
                  placeholder="kalptree"
                  disabled={true}
                />
                <span className="px-2 text-gray-500">.kalptree.com</span>
                {!checked && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCheck(
                        formatBrandSlug(formData.businessdetails.brand_name)
                      )
                    }
                    className="px-4 py-3.5 bg-primary text-white text-sm font-semibold hover:bg-primary transition-all"
                  >
                    Check
                  </button>
                )}
              </div>

              {formData.businessdetails.brand_name && (
                <p className="mt-2">
                  Complete URL: https://
                  {formatBrandSlug(formData.businessdetails.brand_name)}
                  .kalptree.xyz
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tagline / Slogan
            </label>
            <input
              type="text"
              name="businessdetails.tagline"
              value={formData.businessdetails.tagline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              placeholder="AI-Powered Architecture & Design"
            />
          </div>

          <hr className="col-span-2" />

          <div className="md:col-span-2">
            <IndustryRadioList
              formData={formData}
              handleInputChange={handleInputChange}
              // industries={yourDynamicIndustryArray} // optional (if you have API data)
            />
          </div>
        </div>

        <hr className="col-span-2 mt-8" />

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Service Type
          </label>

          {/* 3 per row like screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICE_OPTIONS.map((opt, idx) => {
              const checked = selected === opt.value;
              const id = `service_${idx}_${opt.value}`;
              const Icon = opt.Icon;

              return (
                <label
                  key={opt.value}
                  htmlFor={id}
                  className={[
                    "relative  flex items-start gap-4 rounded-xl border  p-5 cursor-pointer transition-all",
                    "hover:shadow-sm",
                    checked
                      ? "border-0 ring-1 ring-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {/* Hidden radio (card click selects) */}
                  <input
                    id={id}
                    type="radio"
                    name="businessdetails.service"
                    value={opt.value}
                    checked={checked}
                    onChange={handleInputChange}
                    className="sr-only"
                  />

                  {/* Icon bubble */}
                  <div
                    className={[
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      checked ? "bg-primary-50" : "bg-gray-50",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-6 w-6",
                        checked ? "text-primary-600" : "text-primary-600",
                      ].join(" ")}
                    />
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900">
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {opt.desc}
                    </div>
                  </div>

                  {/* Selected pill top-right */}
                  {checked && (
                    <span className="absolute right-3 top-3 rounded-full bg-primary/80 text-white px-3 py-1 text-xs font-semibold text-primary-700 border border-primary-200">
                      Selected
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <hr className="col-span-2 mt-8" />

        <LanguageSelector
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          About / Bio
        </label>
        <textarea
          name="businessdetails.about"
          value={formData.businessdetails.about}
          onChange={handleInputChange}
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white resize-none"
          placeholder="KalpTree is the leading platform for visualizing home exteriors using advanced AI material rendering."
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {formData.businessdetails.about.length}/500 characters
        </div>
      </div>

      <div className="bg-white p-6 rounded-md border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Contact & Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website URL
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all bg-white">
              <span className="px-3 text-gray-500">https://</span>
              <input
                type="text"
                name="businessdetails.business_website_url"
                value={formData.businessdetails.business_website_url}
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
              value={formData.businessdetails.public_email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
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
              value={formData.businessdetails.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
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
              value={formData.businessdetails.headquarters}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              placeholder="123 Innovation Dr, Tech City, CA"
            />
          </div>
        </div>
      </div>

      {user?.role === "superadmin" && !path.includes("agencies") && (
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Assign Agency (Tenant)
          </label>

          <select
            name="businessdetails.tenantId"
            value={formData.businessdetails.tenantId || ""}
            onChange={handleInputChange}
            required={user?.role === "superadmin"}
            className="w-full px-4 py-3 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="" disabled>
              Select an agency
            </option>

            {agencies.map((agency: any) => (
              <option key={agency._id} value={agency._id}>
                {agency.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
