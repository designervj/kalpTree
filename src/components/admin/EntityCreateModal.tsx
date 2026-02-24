"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import type { MaterialCategory } from "./category/types/CategoryModel";
import type { MaterialBrandModel } from "./brand/types/brandModel";
import { MaterialAttributes } from "./attribute/types/attributeModel";

import { ProductModel } from "./product/type/ProductModel";
import CategoryForm from "./category/forms/CategoryForm";
import BrandForm from "./brand/forms/BrandForm";

import AttributeForm from "./attribute/forms/AttributeForm";
import ProductForm from "./product/forms/ProductForm";

type Props = { entity: string };

export default function EntityCreateModal({ entity }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { listCategory } = useSelector((state: RootState) => state.category);
  const { listBrand } = useSelector((state: RootState) => state.brand);

  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const filterCategory = listCategory.filter(
    (item) => item.tenantId === currentBusiness?._id,
  );

  const filterBrand = listBrand.filter(
    (item) => (item as any).websiteId === currentBusiness?._id,
  );

  const dispatch = useDispatch();

  const [category, setCategory] = useState<MaterialCategory>({
    name: "",
    icon: "",
    sort_order: 0,
  });

  const [brand, setBrand] = useState<MaterialBrandModel>({
    name: "",
    url: "",
    description: "",
    logo: "",
  });

  const [attribute, setAttribute] = useState<MaterialAttributes>({
    name: "",
    unit: "",
    possible_values: [],
    category_id: null,
  });

  // Generic simple state for other entities
  const [name, setName] = useState("");
  const [extra, setExtra] = useState("");

  const close = () => {
    setOpen(false);
    setError(null);
    setLoading(false);
    // reset
    setCategory({ name: "", icon: "", sort_order: 0 });

    setBrand({ name: "", url: "", description: "", logo: "" });
    setAttribute({
      name: "",
      unit: "",
      possible_values: [],
      type: undefined,
      category_id: null,
    });
    setName("");
    setExtra("");
  };

  // Reset form state when entity changes so the visible fields match the current entity
  useEffect(() => {
    setError(null);
    setLoading(false);
    setCategory({ name: "", icon: "", sort_order: 0 });
    setBrand({ name: "", url: "", description: "", logo: "" });

    setAttribute({
      name: "",
      unit: "",
      possible_values: [],
      type: undefined,
      category_id: null,
    });

    setName("");
    setExtra("");
    // Auto-open modal when entity prop changes
    setOpen(false);
  }, [entity]);

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (entity === "category") {
      if (!category.name || category.name.trim() === "")
        errs.name = "Name is required";
      if (Number.isNaN(Number(category.sort_order)) || category.sort_order! < 0)
        errs.sort_order = "Sort order must be >= 0";
    } else if (entity === "brand") {
      if (!brand.name || brand.name.trim() === "")
        errs.name = "Name is required";
      if (brand.url && brand.url.trim() !== "") {
        // basic URL validation
        try {
          // allow data: URLs (from stub upload) and http(s)
          if (
            !(brand.url.startsWith("data:") || /^https?:\/\//.test(brand.url))
          ) {
            // attempt to construct URL to validate
            new URL(brand.url);
          }
        } catch {
          errs.url = "Invalid URL format";
        }
      }
    } else if (entity === "attribute") {
      if (!attribute.name || attribute.name.trim() === "")
        errs.name = "Name is required";
    } else {
      if (!name || name.trim() === "") errs.name = "Name is required";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // File upload stub: read file as data URL and store in brand.logo
  const handleLogoFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setBrand((b) => ({ ...b, logo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // client-side validation
    if (!validate()) {
      setLoading(false);
      return;
    }

    let payload: any;
    if (entity === "category") {
      // include websiteId and tenantId for multi-tenant scoping
      payload = { ...category } as any;
      if (currentBusiness?._id) payload.tenantId = currentBusiness?._id;
    } else if (entity === "brand") {
      payload = { ...brand } as any;
      if (currentBusiness?._id) payload.tenantId = currentBusiness?._id;
    } else if (entity === "attribute") {
      payload = { ...attribute } as any;
      if (currentBusiness?._id) payload.tenantId = currentBusiness?._id;
    } else payload = { name, extra };

    try {
      const res = await fetch(`/api/admin/${entity}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON body for structured errors or response
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data?.error ??
          data?.message ??
          (typeof data === "string" ? data : undefined) ??
          "Failed to create";
        throw new Error(msg);
      }

      // If backend returned the created resource, add it to redux so UI updates immediately
      try {
        if (entity === "category") {
          // backend may return the created item directly or under keys like `item` or `category`
          const created = data?.item ?? data?.category ?? data;
          if (created) {
            const { addCategory } =
              await import("@/hooks/slices/category/CategorySlice");
            dispatch(addCategory(created));
          }
        } else if (entity === "brand") {
          // backend may return the created item directly or under keys like `item` or `brand`
          const created = data?.item ?? data?.brand ?? data;
          if (created) {
            const { addBrand } =
              await import("@/hooks/slices/brand/BrandSlice");
            dispatch(addBrand(created));
          }
        } else if (entity === "attribute") {
          // backend may return the created item directly or under keys like `item` or `brand`
          const created = data?.item ?? data?.brand ?? data;
          if (created) {
            const { addAttribute } =
              await import("@/hooks/slices/attribute/AttributeSlice");
            dispatch(addAttribute(created));
          }
        } else if (entity === "products") {
          // backend may return the created item directly or under keys like `item` or `product`
          const created = data?.item ?? data?.product ?? data;
          if (created) {
            const { addProduct } =
              await import("@/hooks/slices/product/ProductSlice");
            dispatch(addProduct(created));
          }
        }
      } catch (e) {
        // ignore dispatch errors and continue with navigation
        // (we still close the modal and navigate back)
      }

      close();
      // navigate back to list or refresh
      router.push(`/admin/${entity}`);
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
      setLoading(false);
    }
  };

  return (
    <>
      {/* <button
        onClick={() => setOpen(true)}
        className="text-sm btn btn-primary"
        type="button"
      >
        + New {entity}
      </button> */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={close} />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] rounded bg-background shadow-lg flex flex-col">
            <div className="px-6 pt-6 pb-4 border-b">
              <h2 className="text-lg font-semibold">Create new {entity}</h2>
            </div>
            <form onSubmit={submit} className="flex flex-col flex-1 min-h-0">
              <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
                {entity === "category" ? (
                  <CategoryForm
                    category={category}
                    setCategory={setCategory}
                    fieldErrors={fieldErrors}
                  />
                ) : entity === "brand" ? (
                  <BrandForm
                    brand={brand}
                    setBrand={setBrand}
                    fieldErrors={fieldErrors}
                    handleLogoFile={handleLogoFile}
                  />
                ) : entity === "attribute" ? (
                  <AttributeForm
                    attribute={attribute}
                    setAttribute={setAttribute}
                    fieldErrors={fieldErrors}
                    filterCategory={filterCategory}
                  />
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Extra</label>
                      <input
                        value={extra}
                        onChange={(e) => setExtra(e.target.value)}
                        className="mt-1 block w-full rounded-md border p-2"
                      />
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="px-6 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="px-6 py-4 border-t flex items-center gap-2 bg-gray-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Creating…" : "Create"}
                </button>
                <button
                  type="button"
                  className="text-sm hover:underline"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
