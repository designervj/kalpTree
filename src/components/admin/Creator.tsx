"use client";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BreadCrumbPage from "../breadCrumb/BreadCrumbPage";
import {
  createWebsitePage,
  updateWebsitePages,
} from "@/hooks/slices/website/websitePageSlice";

// Field configuration type
export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "array";
  options?: { value: string; label: string }[];
  side: "left" | "right";
  placeholder?: string;
  rows?: number;
};

export type PageCreatorProps = {
  item: any;
  fields: FieldConfig[];
  apiEndpoint?: string;
  onCreateRedirect?: string;
};

export default function PageCreator({
  item,
  fields,
  apiEndpoint = "/api/pages",
  onCreateRedirect = "/admin/pages",
}: PageCreatorProps) {
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const {currentBusiness} = useSelector((state: RootState) => state.business);
  const {curretAgency} = useSelector((state: RootState) => state.agency);
  // const {currentbusiness,currentWebsite} = useSelector((state: RootState) => state.dashboardDetails);
const searchParams = useSearchParams()
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // Single state object for all form data
  const [formData, setFormData] = useState(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      const { name, type } = field;
      if (name === "websiteId") {
        initialData[name] = currentWebsite?._id;
      }
      if (type === "array") {
        initialData[name] = Array.isArray(item[name]) ? item[name] : [];
      } else {
        initialData[name] = item[name] || "";
      }
    });
    return initialData;
  });

  // Update websiteId when currentWebsite changes
  useEffect(() => {
    if (currentWebsite?._id && currentWebsite?.tenantId) {
      setFormData((prev) => ({
        ...prev,
        websiteId: currentWebsite._id,
        tenantId: currentWebsite.tenantId,
      }));
    }
  }, [currentWebsite]);

  const [saving, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  // Generic change handler
  const handleChange = (name: string, value: any) => {
    // If changing the title, also auto-update the slug
    if (name === "title") {
      const slug = value.toLowerCase().replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, [name]: value, slug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Array handlers
  const handleArrayAdd = (name: string) => {
    const currentArray = formData[name] || [];
    setFormData((prev) => ({ ...prev, [name]: [...currentArray, ""] }));
  };

  const handleArrayChange = (name: string, index: number, value: string) => {
    const currentArray = [...(formData[name] || [])];
    currentArray[index] = value;
    setFormData((prev) => ({ ...prev, [name]: currentArray }));
  };

  const handleArrayRemove = (name: string, index: number) => {
    const currentArray = [...(formData[name] || [])];
    currentArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [name]: currentArray }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (
      !formData?.content ||
      !formData?.title ||
      !formData?.slug ||
      !formData?.websiteId
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    const result = await dispatch(createWebsitePage(formData));

    if (createWebsitePage.fulfilled.match(result)) {
      setMsg("Created successfully!");
    const params = new URLSearchParams(searchParams.toString())
      params.set('agencyid', curretAgency?._id?.toString()??"")
      params.set('businessid', currentBusiness?._id?.toString()??"")
    const primaryBusiness = currentWebsite?.primaryDomain?.[0]??null
      router.push(`/admin/websites/${primaryBusiness}/website/pages?${params.toString()}`)  
      // router.push("/admin/website/pages");
      toast.success("Created successfully!");
    } else {
      setMsg("Create failed");
      toast.error("Create failed");
    }
  };

  const handleCancel = () => {
    // clear form data
    setFormData(() => {
      const initialData: Record<string, any> = {};
      fields.forEach((field) => {
        const { name, type } = field;
        if (type === "array") {
          initialData[name] = Array.isArray(item[name]) ? item[name] : [];
        } else {
          initialData[name] = item[name] || "";
        }
      });
      return initialData;
    });
 const params = new URLSearchParams(searchParams.toString())
      params.set('agencyid', curretAgency?._id?.toString()??"")
      params.set('businessid', currentBusiness?._id?.toString()??"")
    const primaryBusiness = currentWebsite?.primaryDomain?.[0]??null
      router.push(`/admin/websites/${primaryBusiness}/website/pages?${params.toString()}`)  

  };

  // Render fields
  const renderField = (field: FieldConfig) => {
    const { name, label, type, options, placeholder, rows } = field;

    if (type === "array") {
      const arrayValue = formData[name] || [];

      return (
        <div key={name} className="space-y-3">
          <label className="text-sm block font-semibold text-gray-700">
            {label}
          </label>

          <div className="space-y-3">
            {arrayValue.map((item: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200"
              >
                <input
                  className="border border-gray-300 p-3 flex-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(name, index, e.target.value)
                  }
                  placeholder={placeholder}
                />
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium shadow-sm hover:shadow"
                  onClick={() => handleArrayRemove(name, index)}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              className="px-4 py-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 flex items-center gap-2"
              onClick={() => handleArrayAdd(name)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add {label}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={name} className="space-y-2">
        <Label className="text-sm block font-semibold text-gray-700">
          {label}
        </Label>

        {type === "text" && (
          <Input
            // className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
          />
        )}

        {type === "textarea" && (
          <textarea
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2  focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 resize-none"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
            rows={rows || 6}
          />
        )}

        {type === "select" && options && (
          <Select
            value={formData[name] || ""}
            onValueChange={(value) => handleChange(name, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>

            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  // Split fields
  const leftFields = fields.filter((f) => f.side === "left");
  const rightFields = fields.filter((f) => f.side === "right");

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between mb-6 p-0 rounded-xl">
        {/* <h2 className="text-xl font-bold text-gray-800">Create New Page </h2> */}
        <BreadCrumbPage />
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="text-white"
            // className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 font-medium hover:from-gray-300 hover:to-gray-400 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            type="button"
            // className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-green-600 to-green-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 disabled:transform-none"
            disabled={saving}
            onClick={onSubmit}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Success/Error message with animation */}
      {msg && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
            msg.includes("success")
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
              : "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
          }`}
        >
          <p
            className={`font-medium flex items-center gap-2 ${
              msg.includes("success") ? "text-green-700" : "text-red-700"
            }`}
          >
            {msg.includes("success") ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {msg}
          </p>
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Main content */}
        <div className="lg:w-8/12 p-6 space-y-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          {leftFields.map((field) => renderField(field))}
        </div>

        {/* Right side - Metadata */}
        <div className="lg:w-4/12 p-6 space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          {rightFields.map((field) => renderField(field))}
        </div>
      </div>
    </div>
  );
}
