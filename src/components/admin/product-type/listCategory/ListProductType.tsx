"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import {
  addProductType,
  removeProductType,
  updateProductType,
} from "@/hooks/slices/category/CategorySlice";
import { useToast } from "@/hooks/use-toast";
import { ProductType } from "@/hooks/slices/category/CategorySlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ListProductType = () => {
  const { listProductType, isProductTypeLoading } = useSelector(
    (state: RootState) => state.category,
  );

  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProductType, setEditingProductType] = useState<ProductType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProductType, setNewProductType] = useState<ProductType | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setNewProductType({
      name: "",
      slug: "",
    });
    setFieldErrors({});
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!newProductType) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};
    
    if (!newProductType.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!newProductType.slug?.trim()) {
      errors.slug = "Slug is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/producttype`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductType),
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
        description: `Product Type "${newProductType.name}" created successfully`,
      });
      setIsAddDialogOpen(false);
      setNewProductType(null);
      
      // Dispatch the imported action
      dispatch(addProductType(created));
    } catch (err: any) {
      console.error("Failed to create product type", err);
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
      toast({ title: "Delete failed", description: "Missing id", variant: "destructive" });
      return;
    }

    const ok = confirm(`Delete product type "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/producttype?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      
      // Dispatch the imported action
      dispatch(removeProductType(id));
      
      toast({
        title: "Deleted",
        description: `Product Type "${row?.name ?? id}" removed`,
      });
    } catch (err: any) {
      console.error("Failed to delete product type", err);
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
    setEditingProductType(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProductType) return;

    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (!editingProductType.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!editingProductType.slug?.trim()) {
      errors.slug = "Slug is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const id = (editingProductType as any)._id ?? editingProductType.name;
      const { _id, ...updateData } = editingProductType as any;

      const res = await fetch(`/api/admin/producttype`, {
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
        description: `Product Type "${editingProductType.name}" updated successfully`,
      });
      
      setIsEditDialogOpen(false);
      setEditingProductType(null);
      
      // Dispatch the imported action
      dispatch(updateProductType(updated));
    } catch (err: any) {
      console.error("Failed to update product type", err);
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
    { key: "slug", label: "Slug" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <div>
      <DataTableExt
        title="Product Types"
        data={listProductType ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
        opentab={() => {}}
      />

      {/* Add Product Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product Type</DialogTitle>
          </DialogHeader>
          {newProductType && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newProductType.name}
                  onChange={(e) =>
                    setNewProductType({ ...newProductType, name: e.target.value })
                  }
                  placeholder="Enter product type name"
                  className={fieldErrors.name ? "border-red-500" : ""}
                />
                {fieldErrors.name && (
                  <p className="text-sm text-red-500">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={newProductType.slug}
                  onChange={(e) =>
                    setNewProductType({ ...newProductType, slug: e.target.value })
                  }
                  placeholder="Enter slug (e.g., product-type-name)"
                  className={fieldErrors.slug ? "border-red-500" : ""}
                />
                {fieldErrors.slug && (
                  <p className="text-sm text-red-500">{fieldErrors.slug}</p>
                )}
                <p className="text-xs text-gray-500">
                  URL-friendly version of the name (lowercase, hyphens instead of spaces)
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewProductType(null);
                    setFieldErrors({});
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveAdd} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Add Product Type"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product Type</DialogTitle>
          </DialogHeader>

          {editingProductType && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editingProductType.name}
                  onChange={(e) =>
                    setEditingProductType({
                      ...editingProductType,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter product type name"
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
                  value={editingProductType.slug}
                  onChange={(e) =>
                    setEditingProductType({
                      ...editingProductType,
                      slug: e.target.value,
                    })
                  }
                  placeholder="Enter slug (e.g., product-type-name)"
                  className={fieldErrors.slug ? "border-red-500" : ""}
                />
                {fieldErrors.slug && (
                  <p className="text-sm text-red-500">{fieldErrors.slug}</p>
                )}
                <p className="text-xs text-gray-500">
                  URL-friendly version of the name (lowercase, hyphens instead of spaces)
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingProductType(null);
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

export default ListProductType;