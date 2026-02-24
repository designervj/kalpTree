"use client";

import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addCategory } from "@/hooks/slices/category/CategorySlice";
import { MaterialCategory } from "../types/CategoryModel";
import CategoryForm from "../forms/CategoryForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  List,
  LayoutList,
  Columns2,
  Rows3,
  PanelTop,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

// ─── Layout Options ──────────────────────────────────────────────────────────

type LayoutOption = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
};

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: "grid",
    label: "Grid",
    description: "Cards in a responsive grid",
    icon: <LayoutGrid className="h-4 w-4" />,
    preview: (
      <div className="grid h-full w-full grid-cols-3 gap-1 p-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-sm bg-current opacity-70" />
        ))}
      </div>
    ),
  },
  {
    id: "list",
    label: "List",
    description: "Stacked full-width rows",
    icon: <List className="h-4 w-4" />,
    preview: (
      <div className="flex h-full w-full flex-col gap-1 p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 rounded-sm bg-current opacity-70" />
        ))}
      </div>
    ),
  },
  {
    id: "masonry",
    label: "Masonry",
    description: "Variable card heights",
    icon: <LayoutList className="h-4 w-4" />,
    preview: (
      <div className="grid h-full w-full grid-cols-2 gap-1 p-1">
        {[3, 5, 4, 3, 5, 4].map((h, i) => (
          <div
            key={i}
            className="rounded-sm bg-current opacity-70"
            style={{ height: `${h * 6}px` }}
          />
        ))}
      </div>
    ),
  },
  {
    id: "two-column",
    label: "Two Column",
    description: "Balanced side-by-side",
    icon: <Columns2 className="h-4 w-4" />,
    preview: (
      <div className="grid h-full w-full grid-cols-2 gap-1 p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-sm bg-current opacity-70" />
        ))}
      </div>
    ),
  },
  {
    id: "rows",
    label: "Rows with Thumb",
    description: "Thumbnail + text rows",
    icon: <Rows3 className="h-4 w-4" />,
    preview: (
      <div className="flex h-full w-full flex-col gap-1 p-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="h-4 w-5 flex-shrink-0 rounded-sm bg-current opacity-70" />
            <div className="h-4 flex-1 rounded-sm bg-current opacity-40" />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "hero",
    label: "Hero Banner",
    description: "Featured top banner",
    icon: <PanelTop className="h-4 w-4" />,
    preview: (
      <div className="flex h-full w-full flex-col gap-1 p-1">
        <div className="h-5 w-full rounded-sm bg-current opacity-70" />
        <div className="grid flex-1 grid-cols-3 gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-sm bg-current opacity-40" />
          ))}
        </div>
      </div>
    ),
  },
];

// ─── Small UI Helpers ────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  subtitle,
  children,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
    <div className="border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {subtitle ? (
            <p className="text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </section>
);

// ─── Layout Selector ─────────────────────────────────────────────────────────

type LayoutSelectorProps = {
  selected: string;
  onChange: (id: string) => void;
};

const LayoutSelector = ({ selected, onChange }: LayoutSelectorProps) => {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          Category Layout
        </label>
        <span className="text-xs text-slate-500">Pick one layout style</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LAYOUT_OPTIONS.map((layout) => {
          const isSelected = selected === layout.id;

          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onChange(layout.id)}
              aria-pressed={isSelected}
              className={cn(
                "group relative flex flex-col rounded-xl border p-3 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isSelected
                  ? "border-primary/40 bg-primary/[0.04] shadow-sm ring-1 ring-primary/10"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
              )}
            >
              {/* Preview */}
              <div
                className={cn(
                  "mb-3 h-20 w-full overflow-hidden rounded-lg border transition-colors",
                  isSelected
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-slate-200 bg-slate-50 text-slate-400 group-hover:bg-slate-100",
                )}
              >
                {layout.preview}
              </div>

              {/* Label row */}
              <div className="mb-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    "transition-colors",
                    isSelected ? "text-primary" : "text-slate-500",
                  )}
                >
                  {layout.icon}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-primary" : "text-slate-800",
                  )}
                >
                  {layout.label}
                </span>
              </div>

              <p className="text-xs leading-snug text-slate-500">
                {layout.description}
              </p>

              {/* selected badge */}
              {isSelected && (
                <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Create Category Page ────────────────────────────────────────────────────

const CreateCategory = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();

  const [category, setCategory] = useState<MaterialCategory>({
    name: "",
    icon: "",
    sort_order: 0,
    tenantId: currentBusiness?._id,
    parentCategoryId: "",
  });

  const [selectedLayout, setSelectedLayout] = useState<string>("grid");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const selectedLayoutMeta = useMemo(
    () => LAYOUT_OPTIONS.find((l) => l.id === selectedLayout),
    [selectedLayout],
  );

  const handleSave = async () => {
    const errors: Record<string, string> = {};
    if (!category.name?.trim()) errors.name = "Name is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const payload = { ...category, layout: selectedLayout };

      const res = await fetch(`/api/admin/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data?.error ??
          data?.message ??
          (typeof data === "string" ? data : undefined) ??
          "Failed to create";
        throw new Error(msg);
      }

      const created = data?.item ?? data;
      dispatch(addCategory(created));

      toast({
        title: "Created",
        description: `Category "${category.name}" created successfully`,
      });

      router.push("/categories");
    } catch (err: any) {
      toast({
        title: "Create failed",
        description: String(err?.message || err),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create Category
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Add category details and choose how items should be displayed.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
              <Sparkles className="h-3.5 w-3.5" />
              Layout:{" "}
              <span className="font-medium text-slate-800">
                {selectedLayoutMeta?.label || "Grid"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Category Details */}
          <SectionCard
            title="Category Details"
            subtitle="Basic information for your category"
            icon={<LayoutGrid className="h-4 w-4" />}
          >
            <CategoryForm
              category={category}
              setCategory={(value) => {
                if (typeof value === "function") {
                  setCategory((prev) => value(prev));
                } else {
                  setCategory(value);
                }
              }}
              fieldErrors={fieldErrors}
            />
          </SectionCard>

          {/* Layout Selector */}
          <SectionCard
            title="Layout Style"
            subtitle="This controls how category items will be shown"
            icon={<PanelTop className="h-4 w-4" />}
          >
            <LayoutSelector
              selected={selectedLayout}
              onChange={setSelectedLayout}
            />
          </SectionCard>

          {/* Preview Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Ready to create
                  {category.name?.trim() ? `: ${category.name}` : " category"}
                </p>
                <p className="text-xs text-slate-500">
                  Selected layout:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedLayoutMeta?.label || "Grid"}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSaving}
                  className="min-w-[90px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-w-[130px]"
                >
                  {isSaving ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
