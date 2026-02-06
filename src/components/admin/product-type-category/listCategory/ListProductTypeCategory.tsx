

"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import {
  addProductTypeCategory,
  removeProductTypeCategory,
  updateProductTypeCategory,
  ProductTypeCategory,
} from "@/hooks/slices/category/CategorySlice";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProductCategoryTypeModal } from "../../product/createproduct/ProductCategoryType";

const ListProductTypeCategory = () => {
  const { listProductTypeCategory, listProductType } = useSelector(
    (state: RootState) => state.category,
  );

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductTypeCategory | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<ProductTypeCategory | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setNewCategory({
      name: "",
      slug: "",
      product_type: "",
      icon: "",
      sort_order: 0,
      description: "",
    });
    setFieldErrors({});
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!newCategory) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (!newCategory.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!newCategory.slug?.trim()) {
      errors.slug = "Slug is required";
    }
    if (!newCategory.product_type?.trim()) {
      errors.product_type = "Product type is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/producttypecategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
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
      toast({
        title: "Created",
        description: `Category "${newCategory.name}" created successfully`,
      });
      setIsAddDialogOpen(false);
      setNewCategory(null);
      dispatch(addProductTypeCategory(created));
    } catch (err: any) {
      console.error("Failed to create category", err);
      toast({
        title: "Create failed",
        description: String(err?.message || err),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({
        title: "Delete failed",
        description: "Missing id",
        variant: "destructive",
      });
      return;
    }

    const ok = confirm(`Delete category "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/producttypecategory?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeProductTypeCategory(id));
      toast({
        title: "Deleted",
        description: `Category "${row?.name ?? id}" removed`,
      });
    } catch (err: any) {
      console.error("Failed to delete category", err);
      toast({
        title: "Delete failed",
        description: String(err?.message || err),
        variant: "destructive",
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
    if (!editingCategory.slug?.trim()) {
      errors.slug = "Slug is required";
    }
    if (!editingCategory.product_type?.trim()) {
      errors.product_type = "Product type is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const id = (editingCategory as any)._id ?? editingCategory.name;
      const { _id, createdAt, updatedAt, ...updateData } =
        editingCategory as any;

      const res = await fetch(`/api/admin/producttypecategory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateData, id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const updated = data?.item ?? data;

      toast({
        title: "Updated",
        description: `Category "${editingCategory.name}" updated successfully`,
      });

      setIsEditDialogOpen(false);
      setEditingCategory(null);
      dispatch(updateProductTypeCategory(updated));
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

  // Get product type name by ID
  const getProductTypeName = (productTypeId: string) => {
    const productType = listProductType.find((pt) => pt._id === productTypeId);
    return productType?.name || productTypeId;
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    {
      key: "product_type",
      label: "Product Type",
      render: (value: string) => getProductTypeName(value),
    },
    { key: "slug", label: "Slug" },
    { key: "sort_order", label: "Sort Order" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <div>
      <DataTableExt
        title="Industry Type"
        data={listProductTypeCategory ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
        opentab={() => {}}
      />

      <ProductCategoryTypeModal
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        fieldErrors={fieldErrors}
        isSaving={isSaving}
        handleSaveAdd={handleSaveAdd}
        listProductType={listProductType}
        setFieldErrors={setFieldErrors}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product Type Category</DialogTitle>
          </DialogHeader>

          {editingCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-product_type">Product Type *</Label>
                <Select
                  value={editingCategory.product_type}
                  onValueChange={(value) =>
                    setEditingCategory({
                      ...editingCategory,
                      product_type: value,
                    })
                  }
                >
                  <SelectTrigger
                    className={fieldErrors.product_type ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    {listProductType.map((pt) => (
                      <SelectItem key={pt._id} value={pt._id!}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.product_type && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.product_type}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter category name"
                  className={fieldErrors.name ? "border-red-500" : ""}
                />
                {fieldErrors.name && (
                  <p className="text-sm text-red-500">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input
                  id="edit-slug"
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      slug: e.target.value,
                    })
                  }
                  placeholder="category-slug"
                  className={fieldErrors.slug ? "border-red-500" : ""}
                />
                {fieldErrors.slug && (
                  <p className="text-sm text-red-500">{fieldErrors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon</Label>
                <Input
                  id="edit-icon"
                  value={editingCategory.icon || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      icon: e.target.value,
                    })
                  }
                  placeholder="Icon name or URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sort_order">Sort Order</Label>
                <Input
                  id="edit-sort_order"
                  type="number"
                  value={editingCategory.sort_order || 0}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingCategory(null);
                    setFieldErrors({});
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

export default ListProductTypeCategory;
