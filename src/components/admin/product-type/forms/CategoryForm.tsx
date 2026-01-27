"use client";

import React from "react";
import { IconSVG } from "@/components/ui/icon-display";
import { businessTypeIcons } from "./businessTypeIcons";
import { MaterialCategory } from "../types/CategoryModel";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import slugify from "slugify";

type CategoryFormProps = {
  category: MaterialCategory;
  setCategory: React.Dispatch<React.SetStateAction<MaterialCategory>>;
  fieldErrors: Record<string, string>;
};

export default function CategoryForm({
  category,
  setCategory,
  fieldErrors,
}: CategoryFormProps) {
  const { listCategory } = useSelector((state: RootState) => state.category);

  return (
    <>
      <div>
        <label className="block text-sm font-medium">Category Name</label>
        <input
          type="text"
          value={category.name || ""}
          onChange={(e) =>
            setCategory({
              ...category,
              name: e.target.value,
              slug: slugify(e.target.value, {
                lower: true,
              }),
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="Enter category name"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Parent Category (Optional)
        </label>
        <select
          value={String(category.parentCategoryId) || ""}
          onChange={(e) =>
            setCategory({
              ...category,
              parentCategoryId: e.target.value || undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">None (Top Level Category)</option>
          {listCategory &&
            listCategory.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
        {fieldErrors.parentCategoryId && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.parentCategoryId}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          type="text"
          value={category.slug || ""}
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="Enter category name"
          readOnly={true}
          disabled={true}
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Icon</label>
        <div className="mt-1">
          <select
            value={category.icon || ""}
            onChange={(e) => setCategory({ ...category, icon: e.target.value })}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select an icon</option>
            {Object.entries(businessTypeIcons).map(([type, svg]) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {category.icon && businessTypeIcons[category.icon] && (
            <IconSVG svg={businessTypeIcons[category.icon]} />
          )}
          Selected: {category.icon || "None"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Sort Order</label>
        <input
          type="number"
          value={category.sort_order ?? 0}
          onChange={(e) =>
            setCategory({
              ...category,
              sort_order: Number(e.target.value),
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.sort_order && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.sort_order}
          </div>
        )}
      </div>
    </>
  );
}
