"use client";

import React from "react";
import { ChevronDown, UploadCloud, Globe, X } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ACCENT = "#6D5EF5";
const MAX_MB = 2;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const ACCEPTED = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];

const CompanyInformation = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [logoError, setLogoError] = React.useState<string>("");

  const openPicker = () => fileRef.current?.click();

  const resetLogo = () => {
    setLogoFile(null);
    setLogoError("");
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError("");
    const f = e.target.files?.[0];
    if (!f) return;

    // Validate type
    if (!ACCEPTED.includes(f.type)) {
      setLogoError("Please upload JPG, PNG, SVG, or WEBP.");
      e.target.value = "";
      return;
    }

    // Validate size
    if (f.size > MAX_BYTES) {
      setLogoError(`Max file size is ${MAX_MB}MB.`);
      e.target.value = "";
      return;
    }

    // Preview
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    const url = URL.createObjectURL(f);

    setLogoFile(f);
    setLogoPreview(url);
  };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="mx-auto w-full max-w-[980px] px-6 py-8">
        {/* Page Header */}
        <div>
          {/* <h1 className="text-[28px] font-semibold text-slate-900">
            Company information
          </h1> */}
          <h1 className="text-2xl font-semibold tracking-tight">Company information</h1>
          <p className="mt-2 text-sm text-slate-600">
            Information from here will appear on your invoices.
          </p>
        </div>

        {/* Card 1: Name & logo */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_360px]">
            {/* Left */}
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-slate-900">Name & logo</h2>

              <p className="mt-2 text-sm text-slate-600">
                If you don’t have a registered business, use your store name
                instead. For a logo, try our{" "}
                <a href="#" className="font-medium text-[#6D5EF5] hover:underline">
                  AI Logo Generator
                </a>
                .
              </p>

              <div className="mt-4 h-px w-full bg-slate-200" />

              <div className="mt-5 space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Company name
                </label>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2"
                  style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}
                  placeholder="Your official company name"
                />
              </div>
            </div>

            {/* Right: Upload logo box (WORKING) */}
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6">
              {/* Hidden input that actually picks the file */}
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.svg,.webp"
                className="hidden"
                onChange={onLogoChange}
              />

              <div className="flex h-full flex-col items-center justify-center text-center">
                {!logoPreview ? (
                  <>
                    <UploadCloud className="h-8 w-8 text-slate-500" />
                    <div className="mt-3 text-lg font-semibold text-slate-900">
                      Upload logo
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      Upload JPG, PNG, SVG, and WEBP images,
                      <br />
                      maximum 2MB each.
                    </div>

                    <button
                      type="button"
                      onClick={openPicker}
                      className="mt-5 py-2 rounded-lg px-8 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                      style={{ backgroundColor: ACCENT }}
                    >
                      Upload
                    </button>

                    {logoError ? (
                      <div className="mt-3 text-xs font-medium text-red-600">
                        {logoError}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={resetLogo}
                        className="absolute right-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
                        aria-label="Remove logo"
                      >
                        <X className="h-4 w-4 text-slate-600" />
                      </button>

                      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                        {/* Preview */}
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="max-h-[140px] w-auto rounded-lg object-contain"
                        />
                      </div>

                      <div className="mt-3 text-left">
                        <div className="text-sm font-semibold text-slate-900">
                          {logoFile?.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {logoFile ? `${(logoFile.size / 1024).toFixed(0)} KB` : ""}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={openPicker}
                          className="h-11 flex-1 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={resetLogo}
                          className="h-11 flex-1 rounded-lg text-sm font-semibold text-white hover:opacity-95"
                          style={{ backgroundColor: ACCENT }}
                        >
                          Remove
                        </button>
                      </div>

                      {logoError ? (
                        <div className="mt-3 text-xs font-medium text-red-600">
                          {logoError}
                        </div>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Contacts & address */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 pt-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Contacts & address
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              If you don’t have a physical address of your business, enter the
              shipping origin address.
            </p>
          </div>

          <div className="mt-5 h-px w-full bg-slate-200" />

          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  * Email
                </label>
                <input
                  className="h-12 mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2"
                  style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}
                  defaultValue="mail2deepakrai@gmail.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Phone number
                </label>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2"
                  style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}
                  placeholder="e.g., +37060012345"
                />
              </div>

              {/* Street */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Street address
                </label>
                <input
                  className="h-12 mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2"
                  style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}
                  placeholder="e.g., Vytauto g. 88-22"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">City</label>
                <input
                  className="h-12 mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2"
                  style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}
                  placeholder="e.g., Vilnius"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  * State
                </label>
                <div className="relative">
                  {/* <Select
                    className="h-12 mt-1 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none focus:ring-2"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    <option>California</option>
                    <option>Texas</option>
                    <option>Florida</option>
                    <option>New York</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /> */}

                  <Select>
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Select state</SelectLabel>
                        <SelectItem value="banana">California</SelectItem>
                        <SelectItem value="blueberry">Texas</SelectItem>
                        <SelectItem value="grapes">Florida</SelectItem>
                        <SelectItem value="pineapple">New York</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                </div>
              </div>

              {/* Zip */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Zip/Postal code
                </label>
                <Input
                  //   className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2"
                  style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}
                  placeholder="e.g., 12345"
                />
              </div>

              {/* Country */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-900 mb-2">
                  * Country
                </label>

                <div className="relative pt-1">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <Globe className="h-4 w-4 text-slate-500" />
                  </div>

                  <select
                    className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-medium text-slate-900 outline-none focus:ring-2"
                    defaultValue="United States"
                  >
                    <option>United States</option>
                    <option>India</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
};

export default CompanyInformation;
