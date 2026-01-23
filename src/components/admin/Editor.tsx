

"use client";
import { updateWebsitePage } from "@/hooks/slices/website/websitePageSlice";
import { AppDispatch, RootState } from "@/store/store";

import { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WebsitePageModel } from "./website/websitePage/WebsitePageType";
import { routeModule } from "next/dist/build/templates/pages";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";


// Field configuration type
export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "readonly" | "array";
  options?: { value: string; label: string }[];
  side: "left" | "right" | "NA";
  placeholder?: string;
  rows?: number;
  nestedKey?: string;
  readOnly?: boolean // For nested objects like author.userId
};

type PageEditorProps = {
  id: string;
  item: any;
  fields: FieldConfig[];
  apiEndpoint?: string;
  onDeleteRedirect?: string;
  viewUrl?: any; // URL to view the page
};

export default function PageEditor({
  id,
  item,
  fields,
  apiEndpoint = "/api/pages",
  onDeleteRedirect = "/admin/pages",
  viewUrl,
}: PageEditorProps) {

  const dispatch= useDispatch<AppDispatch>()
    const router = useRouter();
    const searchParams = useSearchParams()

      const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const {currentBusiness} = useSelector((state: RootState) => state.business);
  const {curretAgency} = useSelector((state: RootState) => state.agency);
  // Single state object for all form data
  const [formData, setFormData] = useState(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type !== "readonly") {
        const { name, type, nestedKey } = field;
        
        // Handle nested objects (e.g., author.userId)
        if (nestedKey && item[name] && typeof item[name] === 'object') {
          initialData[name] = item[name][nestedKey] || "";
        }
        // Handle arrays
        else if (type === "array") {
          initialData[name] = Array.isArray(item[name]) ? item[name] : [];
        }
        // Handle regular fields
        else {
          initialData[name] = item[name] || "";
        }
      }
    });
    return initialData;
  });


  const [saving, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  // Format date/time to readable format
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  // Generic change handler
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      // If the name field is changed, also update slug
      if (name === "title" || name === "name") {
        const slugValue = value
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "");
        return { ...prev, [name]: value, slug: slugValue };
      }
      return { ...prev, [name]: value };
    });
  };

  // Array field handlers
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

  const onSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    // Ensure all WebsitePageModel fields are present
    const data: WebsitePageModel = {
      _id: item._id,
      tenantId: formData.tenantId ?? item.tenantId ?? "",
      websiteId: formData.websiteId ?? item.websiteId ?? "",
      slug: formData.slug ?? item.slug ?? "",
      title: formData.title ?? item.title ?? "",
      content: formData.content ?? item.content ?? "",
      status: formData.status ?? item.status ?? "draft",
      createdAt: item.createdAt ?? "",
      updatedAt: item.updatedAt ?? "",
      publishedAt: item.publishedAt ?? "",
    };
   const response= await dispatch(updateWebsitePage(data)).unwrap();
   if(response){
   const params = new URLSearchParams(searchParams.toString())
      params.set('agencyid', curretAgency?._id?.toString()??"")
      params.set('businessid', currentBusiness?._id?.toString()??"")
    const primaryBusiness = currentWebsite?.primaryDomain?.[0]??null
      router.push(`/admin/websites/${primaryBusiness}/website/pages?${params.toString()}`)  
     toast.success("Page Updated Successfully")
   }
   
  };

  const handleDelete = async () => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = onDeleteRedirect;
    } else {
      setMsg("Delete failed");
    }
  };

  // Render individual field
  const renderField = (field: FieldConfig) => {
    const { name, readOnly,label, type, options, placeholder, rows, nestedKey } = field;

    if (type === "readonly") {
      const value = nestedKey && item[name] && typeof item[name] === 'object' 
        ? item[name][nestedKey] 
        : item[name];
      
      // Check if field name suggests it's a date/time field
      const isDateTime = name.toLowerCase().includes('at') || name.toLowerCase().includes('date');
      const displayValue = (isDateTime && value) ? formatDateTime(value) : (value || "N/A");
      
      return (
        <div key={name} className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">{label}:</span>
          <span className="text-sm text-gray-600 px-3 py-1 bg-white rounded-lg border border-gray-200">{displayValue}</span>
        </div>
      );
    }

    if (type === "array") {
      const arrayValue = formData[name] || [];
      return (
        <div key={name} className="space-y-3">
          <label className="text-sm block font-semibold text-gray-700">{label}</label>
          <div className="space-y-3">
            {arrayValue.map((item: string, index: number) => (
              <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                <input
                  className="border border-gray-300 p-3 flex-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                  value={item}
                  onChange={(e) => handleArrayChange(name, index, e.target.value)}
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add {label}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={name} className="space-y-2">
        <label className="text-sm block font-semibold text-gray-700">{label}</label>
        {type === "text" && (
          <input
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly ? readOnly : false}
          />
        )}
        {type === "textarea" && (
          <textarea
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 resize-none"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
            rows={rows || 6}
          />
        )}
        {type === "select" && options && (
          <select
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 cursor-pointer"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // Separate fields by side
  const leftFields = fields.filter((f) => f.side === "left");
  const rightFields = fields.filter((f) => f.side === "right");
  const readonlyFields = fields.filter((f) => f.type === "readonly");

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with smooth shadow and better spacing */}
      <div className="flex items-center justify-between mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap items-center">
          {readonlyFields.map((field) => renderField(field))}
        </div>
        <div className="flex gap-3">
          {viewUrl && (
            <a
              // href={`//${viewUrl.item.primaryDomain[0]}${item.slug}`}
              rel="noopener noreferrer"
              target="_blank"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 text-white font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </a>
          )}
       
        </div>
      </div>

      {/* Success message with animation */}
      {msg && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-green-700 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {msg}
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Main content with smooth elevation */}
        <div className="lg:w-8/12 p-6 space-y-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          {leftFields.map((field) => renderField(field))}
        </div>

        {/* Right side - Metadata with subtle background */}
        <div className="lg:w-4/12 p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          {rightFields.map((field) => renderField(field))}
        </div>
      </div>

    <div className="w-full flex justify-end gap-2 mt-8">
         <Button
            type="button"
            variant="outline"
            // className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            type="button"
            // className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 disabled:transform-none"
            disabled={saving}
            onClick={onSubmit}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
    </div>

    </div>
  );
}