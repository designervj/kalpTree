"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import {
  addCategory,
  removeCategory,
} from "@/hooks/slices/category/CategorySlice";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MaterialCategory } from "../types/CategoryModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from "../forms/CategoryForm";
import { Button } from "@/components/ui/button";
import { buildWebsiteHref } from "@/lib/utils";

const ListCategory = () => {
  const { listCategory, isCategoryLoading } = useSelector(
    (state: RootState) => state.category,
  );

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<MaterialCategory | null>(null);
  const [newCategory, setNewCategory] = useState<MaterialCategory | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();
  const params = useParams();
  const searchparams = Object.fromEntries(searchParams.entries());
  const handleAdd = () => {
    const href = buildWebsiteHref(
      "/admin/category/create",
      params.website!,
      searchparams,
    );
    router.push(href);
  };

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }

    const ok = confirm(`Delete category "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/category?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeCategory(id));
      toast({
        title: "Deleted",
        description: `Category ${row?.name ?? id} removed`,
      });
    } catch (err: any) {
      console.error("Failed to delete category", err);
      toast({
        title: "Delete failed",
        description: String(err?.message || err),
      });
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    setEditingCategory(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };
  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (!editingCategory.name?.trim()) {
      errors.name = "Name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const id = (editingCategory as any)._id ?? editingCategory.id;
      const { _id, ...updateData } = editingCategory as any;

      const res = await fetch(`/api/admin/category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateData, id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      toast({
        title: "Updated",
        description: `Category ${editingCategory.name} updated successfully`,
      });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to update category", err);
      toast({
        title: "Update failed",
        description: String(err?.message || err),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    { key: "icon", label: "Icon" },
    { key: "sort_order", label: "Sort Order" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <div>
      <DataTableExt
        title="Categories"
        data={listCategory ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
        opentab={() => { }}
      />

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <CategoryForm
                category={editingCategory}
                setCategory={(value) => {
                  if (typeof value === "function") {
                    setEditingCategory((prev) => (prev ? value(prev) : null));
                  } else {
                    setEditingCategory(value);
                  }
                }}
                fieldErrors={fieldErrors}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingCategory(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListCategory;
