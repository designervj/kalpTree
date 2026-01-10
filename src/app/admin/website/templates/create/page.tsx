"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Upload, X, Wand2, Image as ImageIcon } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

const TEMPLATE_TYPES = [
  { value: "section", label: "Section" },
  { value: "page", label: "Full Page" },
  { value: "header", label: "Header" },
  { value: "footer", label: "Footer" },
  { value: "navigation", label: "Navigation" },
  { value: "banner", label: "Banner" },
  { value: "cta", label: "Call To Action" },
  { value: "products", label: "Products" },
  { value: "ecommerce", label: "Ecommerce" },
] as const;

const PAGE_TYPES = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "services", label: "Services" },
  { value: "contact", label: "Contact" },
  { value: "blog", label: "Blog" },
  { value: "post", label: "Post" },
  { value: "product", label: "Product" },
  { value: "category", label: "Category" },
  { value: "landing", label: "Landing" },
  { value: "custom", label: "Custom" },
] as const;

const PostSchema = z.object({
  title: z.string().min(3, "Title is required (min 3 chars)"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),

  templateType: z.enum(
    TEMPLATE_TYPES.map((o) => o.value) as [string, ...string[]]
  ),
  pageType: z.enum(PAGE_TYPES.map((o) => o.value) as [string, ...string[]]),

  html: z.string().min(10, "HTML is required (min 10 chars)"),

  // image: optional
  imageDataUrl: z.string().optional().default(""),

  // suggested extra fields
  description: z.string().max(300, "Max 300 chars").optional().default(""),
  tags: z.string().optional().default(""), // comma-separated
  demo: z.string().optional().default(""),
  category: z.string().optional().default(""),
  version: z.string().optional().default("1.0.0"),
  isPublished: z.boolean().optional().default(false),
  notes: z.string().optional().default(""),
});

export type TemplateFormValues = z.infer<typeof PostSchema>;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ✅ API placeholder (apne backend route se connect kar dena)
async function apiCreateTemplate(payload: TemplateFormValues) {
  const res = await fetch("/api/admin/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json() as Promise<{ id: string }>;
}

export default function AddTemplatePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [imgPreview, setImgPreview] = React.useState<string>("");

  const form = useForm<TemplateFormValues>({
    // resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      slug: "",
      templateType: "section",
      pageType: "home",
      html: "",
      imageDataUrl: "",

      description: "",
      tags: "",
      demo: "",
      category: "",
      version: "1.0.0",
      isPublished: false,
      notes: "",
    },
    mode: "onChange",
  });

  const title = form.watch("title");
  const isPublished = form.watch("isPublished");
  const imageDataUrl = form.watch("imageDataUrl");

  React.useEffect(() => {
    setImgPreview(imageDataUrl || "");
  }, [imageDataUrl]);

  const onAutoSlug = () => {
    const s = slugify(title || "");
    if (s.length >= 3) form.setValue("slug", s, { shouldValidate: true });
  };

  const onPickImage = async (file: File | null) => {
    if (!file) return;

    // basic validation
    const okTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!okTypes.includes(file.type)) {
      toast.error("Only PNG / JPG / WEBP allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size max 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      form.setValue("imageDataUrl", result, { shouldValidate: true });
      toast.success("Image added");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    form.setValue("imageDataUrl", "", { shouldValidate: true });
    toast.message("Image removed");
  };

  const onSubmit = (values: TemplateFormValues) => {
    startTransition(async () => {
      try {
        const created = await apiCreateTemplate(values);
        toast.success("Template created");
        router.push(`/admin/templates/${created.id}/edit`);
      } catch (e) {
        toast.error("Create failed");
      }
    });
  };

  return (
    <div className="w-full">
          <div className="mb-6">
           <BreadCrumbPage/>
           <p>Title, slug, template type, page type, and HTML. Image upload</p>
         </div>


      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT */}

       
        <Card className="rounded-md">

            
          {/* <CardHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl">Add Template</CardTitle>
                <CardDescription>
                  Title, slug, template type, page type, and HTML. Image upload
                
                </CardDescription>
              </div>

              <Badge
                variant={isPublished ? "default" : "secondary"}
                className="rounded-full">
                {isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          </CardHeader> */}

          <CardContent className="space-y-6">
            {/* Title + Slug */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. Shop 35 - 2 column offer"
                  {...form.register("title")}
                  onBlur={(e) => {
                    form.register("title").onBlur(e);
                    onAutoSlug();
                  }}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Slug</Label>
                  {/* <Button type="button" variant="ghost" size="sm" onClick={onAutoSlug}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Auto
                  </Button> */}
                </div>
                <Input
                  placeholder="shop-35-2-column-offer"
                  {...form.register("slug")}
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            {/* Template Type + Page Type */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Template Type</Label>
                <Select
                  value={form.watch("templateType")}
                  onValueChange={(v) =>
                    form.setValue("templateType", v as any, {
                      shouldValidate: true,
                    })
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>

                  {/* dropdown width match trigger */}
                  <SelectContent className="w-[var(--radix-select-trigger-width)]">
                    {TEMPLATE_TYPES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.templateType && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.templateType.message as any}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Page Type</Label>
                <Select
                  value={form.watch("pageType")}
                  onValueChange={(v) =>
                    form.setValue("pageType", v as any, {
                      shouldValidate: true,
                    })
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select page type" />
                  </SelectTrigger>
                  <SelectContent className="w-[var(--radix-select-trigger-width)]">
                    {PAGE_TYPES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.pageType && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.pageType.message as any}
                  </p>
                )}
              </div>
            </div>

            {/* Description + Tags */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  rows={3}
                  placeholder="Short description..."
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tags (optional)</Label>
                <Input
                  placeholder="e.g. shop, ecommerce, banner"
                  {...form.register("tags")}
                />
                <p className="text-xs text-muted-foreground">Comma separated</p>
              </div>
            </div>

            <Separator />

            {/* HTML */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">HTML</h3>
                <Badge variant="outline" className="rounded-full">
                  required
                </Badge>
              </div>
              <Textarea
                rows={16}
                placeholder="Paste your HTML here..."
                className="font-mono text-sm"
                {...form.register("html")}
              />
              {form.formState.errors.html && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.html.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                rows={4}
                placeholder="Internal notes for editors..."
                {...form.register("notes")}
              />
            </div>
          </CardContent>
        </Card>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Publish */}
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Publish</CardTitle>
              <CardDescription>Status & meta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Published</p>
                  <p className="text-xs text-muted-foreground">
                    Toggle to publish/unpublish
                  </p>
                </div>
                <Switch
                  checked={!!isPublished}
                  onCheckedChange={(checked) =>
                    form.setValue("isPublished", checked, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>

              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label>Demo (optional)</Label>
                  <Input
                    placeholder="e.g. Shop 35"
                    {...form.register("demo")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category (optional)</Label>
                  <Input
                    placeholder="e.g. Ecommerce / Banner Sliders"
                    {...form.register("category")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Version (optional)</Label>
                  <Input placeholder="1.0.0" {...form.register("version")} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? "Saving..." : "Create Template"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  disabled={isPending}
                  onClick={() => router.push("/admin/templates")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Image</CardTitle>
              <CardDescription>Upload thumbnail (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-dashed p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upload image</p>
                    <p className="text-xs text-muted-foreground">
                      PNG/JPG/WEBP • max 2MB
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-black/90">
                        <Upload className="h-4 w-4" />
                        Choose File
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) =>
                            onPickImage(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>

                      {imgPreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="rounded-lg">
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {imgPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imgPreview}
                  alt="template preview"
                  className="h-44 w-full rounded-md border object-cover"
                />
              ) : (
                <div className="h-44 w-full rounded-md border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                  No image selected
                </div>
              )}

              {/* Hidden field so it gets saved */}
              <input type="hidden" {...form.register("imageDataUrl")} />
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Dev hint */}
      <p className="mt-6 text-xs text-muted-foreground">
        Note: image is saved as <b>base64 dataUrl</b> right now. Production me
        S3/Supabase upload karke url store karna best hai.
      </p>
    </div>
  );
}
