"use client"
import BreadCrumbPage from '@/components/breadCrumb/BreadCrumbPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createHeader, updateHeader } from '@/hooks/slices/header/HeaderThunk';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { TemplateDocument } from '../templates/TemplateType';


export type FieldConfig = {
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "number";
    options?: { value: string; label: string }[];
    side: "left" | "right";
    placeholder?: string;
    rows?: number;
    readOnly?: boolean;
}

const fields: FieldConfig[] = [
    // Left side (8/12 width) - Main content
    {
        name: "content",
        label: "Header HTML Content",
        type: "textarea",
        side: "left",
        rows: 16,
        placeholder: "<header>Your header HTML here...</header>",
    },

    // Right side (4/12 width) - Metadata
    {
        name: "slug",
        label: "Slug",
        type: "text",
        side: "right",
        placeholder: "header-slug",
    },
    {
        name: "status",
        label: "Status",
        type: "select",
        side: "right",
        options: [
            { value: "draft", label: "Draft" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
        ],
    },
    {
        name: "website",
        label: "Website",
        type: "text",
        side: "right",
        placeholder: "Header Label",
        readOnly: true,
    },
    {
        name: "tenant",
        label: "Tenant",
        type: "text",
        side: "right",
        placeholder: "e.g., navbar, hero",
        readOnly: true,
    },
];


type Props = {
    header?: TemplateDocument
    isEdit?: boolean
}
const AddHeader = ({ header, isEdit }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const { currentWebsite } = useSelector((state: RootState) => state.websites);
    const { currentBusiness } = useSelector((state: RootState) => state.business);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<"html" | "preview">("html");
    const [msg, setMsg] = useState("");

    const [formData, setFormData] = useState<Record<string, any>>({
        slug: "header",
        content: "",
        status: "draft",
        // label: "",
        category: "navbar",
        tenant: "",
        website: "",
    });

    useEffect(() => {
        if (header) {
            setFormData((prev) => ({
                ...prev,
                content: header.content,
                slug: header.slug,
                status: header.status,

            }))
        }
    }, [header]);

    const leftFields = fields.filter((f) => f.side === "left");
    const rightFields = fields.filter((f) => f.side === "right");

    // Auto-populate website and tenant IDs
    useEffect(() => {
        if (currentWebsite?._id && currentWebsite?.tenantId && currentBusiness?._id) {
            setFormData(prev => ({
                ...prev,
                website: currentWebsite.name || "",
                tenant: currentBusiness.name || "",
            }));
        }
    }, [currentWebsite, currentBusiness]);

    const slugify = (value: string) => {
        return (value || "")
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from label
        if (name === "label" && !formData.slug) {
            setFormData(prev => ({ ...prev, slug: slugify(value) }));
        }
    };

    // Generate iframe document for preview
    const iframeDoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
            </style>
        </head>
        <body>
            ${formData.content || '<p style="color: #999; padding: 20px;">No content yet...</p>'}
        </body>
        </html>
    `;
    const renderField = (field: FieldConfig) => {
        const { name, label, type, options, placeholder, readOnly, rows } = field;

        // Content editor
        if (name === "content") {
            return (
                <div key={name} className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <Label className="text-[14px] font-semibold text-slate-900">{label}</Label>
                            <div className="text-xs text-slate-500 mt-0.5">
                                Enter your header HTML. Preview updates instantly.
                            </div>
                        </div>

                        <div className="flex items-center rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                            <Button
                                type="button"
                                variant={mode === "html" ? "default" : "ghost"}
                                className={cn("h-9 rounded-xl px-4", mode === "html" && "bg-violet-600 hover:bg-violet-700 text-white")}
                                onClick={() => setMode("html")}
                            >
                                HTML
                            </Button>
                            <Button
                                type="button"
                                variant={mode === "preview" ? "default" : "ghost"}
                                className={cn("h-9 rounded-xl px-4", mode === "preview" && "bg-violet-600 hover:bg-violet-700 text-white")}
                                onClick={() => setMode("preview")}
                            >
                                Preview
                            </Button>
                        </div>
                    </div>

                    {mode === "html" && (
                        <div className="rounded-md border border-slate-200 bg-white shadow-sm p-4">
                            <textarea
                                value={formData.content || ""}
                                onChange={(e) => handleChange("content", e.target.value)}
                                placeholder={placeholder || "<header>Your header HTML here...</header>"}
                                rows={rows || 16}
                                className={cn(
                                    "w-full rounded-md border border-slate-200 bg-white px-5 py-4",
                                    "font-mono text-[13px] leading-6 text-slate-900 outline-none",
                                    "focus:ring-2 focus:ring-violet-200 focus:border-violet-300",
                                    "resize-none"
                                )}
                            />

                        </div>
                    )}

                    {mode === "preview" && (
                        <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-900">Live Preview</div>
                                <div className="text-xs text-slate-500">Sandbox iframe</div>
                            </div>

                            <div className="p-4">
                                <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
                                    <iframe
                                        title="preview"
                                        className="w-full h-[520px] bg-white"
                                        srcDoc={iframeDoc}
                                        sandbox="allow-scripts allow-same-origin" // blocks scripts by default, keeps layout safe
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (type === "text") {
            return (
                <div key={name} className="space-y-2">
                    <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
                    <Input
                        value={formData[name] || ""}
                        onChange={(e) => handleChange(name, e.target.value)}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        className={cn("h-11 rounded-md bg-white border-slate-200", readOnly && "bg-slate-50 text-slate-700")}
                    />
                </div>
            );
        }

        if (type === "textarea") {
            return (
                <div key={name} className="space-y-2">
                    <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
                    <textarea
                        value={formData[name] || ""}
                        onChange={(e) => handleChange(name, e.target.value)}
                        placeholder={placeholder}
                        rows={rows || 6}
                        className={cn(
                            "w-full rounded-md border border-slate-200 bg-white px-5 py-4",
                            "text-[14px] leading-6 text-slate-900 outline-none",
                            "focus:ring-2 focus:ring-violet-200 focus:border-violet-300",
                            "resize-none"
                        )}
                    />
                </div>
            );
        }

        if (type === "select" && options) {
            return (
                <div key={name} className="space-y-2">
                    <Label className="text-[13px] font-semibold text-slate-900">{label}</Label>
                    <Select value={formData[name] || ""} onValueChange={(v) => handleChange(name, v)}>
                        <SelectTrigger className="h-11 w-full rounded-md bg-white border-slate-200">
                            <SelectValue placeholder={placeholder || "Select"} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        }

        return null;
    };
    const goBack = () => {
        router.back();
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.slug) {
            toast.error("Please enter a slug");
            return;
        }

        if (!formData.content) {
            toast.error("Please enter header content");
            return;
        }

        if (!currentWebsite?._id || !currentWebsite?.tenantId) {
            toast.error("Website information is missing. Please select a website.");
            return;
        }

        setSaving(true);
        setMsg("");

        try {
            const headerData: any = {
                slug: formData.slug,
                content: formData.content,
                tenantId: currentWebsite.tenantId,
                websiteId: currentWebsite._id,
                status: formData.status,
            };

            let result;
            if (isEdit && header?._id) {
                headerData._id = header._id;
                result = await dispatch(updateHeader(headerData));
            } else {
                result = await dispatch(createHeader(headerData));
            }

            if (createHeader.fulfilled.match(result) || updateHeader.fulfilled.match(result)) {
                const actionText = isEdit ? "updated" : "created";
                toast.success(`Header ${actionText} successfully!`);
                setMsg(`Success: Header ${actionText} successfully!`);
                // Optionally redirect back
                setTimeout(() => {
                    router.back();
                }, 1500);
            } else {
                const actionText = isEdit ? "update" : "create";
                toast.error(result.payload as string || `Failed to ${actionText} header`);
                setMsg(result.payload as string || `Failed to ${actionText} header`);
            }
        } catch (error) {
            const actionText = isEdit ? "updating" : "creating";
            toast.error(`An error occurred while ${actionText} header`);
            setMsg(`Error: An error occurred while ${actionText} header`);
        } finally {
            setSaving(false);
        }
    };
    return (
        <>
            <form onSubmit={onSubmit} className="min-h-screen w-full ">
                <div className="max-w-[1320px] mx-auto px-7 py-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            {/* <div className="text-[30px] font-semibold text-slate-900">Create</div>
            <div className="text-sm text-slate-500 mt-1">
              Create a page with content and metadata.
            </div> */}
                            <div className="mt-3">
                                <BreadCrumbPage />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                // className="h-10 rounded-md bg-white border-slate-200"
                                onClick={goBack}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={saving}
                            // className="h-10 rounded-md bg-violet-700 hover:bg-violet-800"
                            >
                                {saving ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update" : "Save")}
                            </Button>
                        </div>
                    </div>

                    {msg && (
                        <div className={cn(
                            "mt-5 rounded-md border px-4 py-3 shadow-sm",
                            msg.toLowerCase().includes("success")
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : "bg-rose-50 border-rose-200 text-rose-800"
                        )}>
                            <div className="text-sm font-medium">{msg}</div>
                        </div>
                    )}

                    <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-7">
                        {/* Left */}
                        <div className="lg:col-span-8">
                            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7">
                                <div className="space-y-7">
                                    {leftFields.map((f) => renderField(f))}
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="lg:col-span-4 space-y-7">
                            <div className="rounded-md border border-slate-200 bg-white shadow-sm p-7">
                                <div className="space-y-7">
                                    {rightFields.map((f) => renderField(f))}

                                    {/* Thumbnail Preview */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[13px] font-semibold text-slate-900">
                                                Thumbnail Preview
                                            </Label>
                                            <div className="text-xs text-slate-500">Auto from HTML</div>
                                        </div>

                                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
                                                <div className="relative aspect-[16/10] w-full bg-white overflow-hidden">
                                                    <iframe
                                                        title="thumbnail"
                                                        srcDoc={iframeDoc}
                                                        sandbox="allow-scripts allow-same-origin"
                                                        className="absolute left-0 top-0 origin-top-left w-full h-full"
                                                        style={{
                                                            transform: "scale(0.5)",
                                                            width: "200%",
                                                            height: "200%",
                                                            pointerEvents: "none",
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-2 text-xs text-slate-500">
                                                Mini preview of your header.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm h-[80px]" />
                        </div>
                    </div>
                </div>
            </form>

        </>
    )
}

export default AddHeader