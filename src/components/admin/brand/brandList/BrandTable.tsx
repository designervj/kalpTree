"use client";

import React, { useMemo, useState } from "react";
import { MaterialBrandModel } from "../types/brandModel";
import { DataTableExt } from "../../DataTableExt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BrandForm from "../forms/BrandForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addBrand } from "@/hooks/slices/brand/BrandSlice";

const BrandTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<MaterialBrandModel | null>(
    null,
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBrand, setNewBrand] = useState<MaterialBrandModel | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { listBrand, isBrandLoading } = useSelector(
    (state: RootState) => state.brand,
  );
  const handleAdd = () => {
    setNewBrand({
      name: "",
      url: "",
      description: "",
      logo: "",
      tenantId: currentBusiness?._id,
    });
    setFieldErrors({});
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!newBrand) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!newBrand.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!newBrand.url?.trim()) {
      errors.url = "URL is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSaving(true);
    const data = {
      ...newBrand,
      tenantId: user?.tenantId,
    };
    try {
      const res = await fetch(`/api/admin/brand`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBrand),
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
        description: `Brand ${newBrand.name} created successfully`,
      });
      setIsAddDialogOpen(false);
      setNewBrand(null);
      dispatch(addBrand(created));
      // window.location.reload();
    } catch (err: any) {
      console.error("Failed to create brand", err);
      toast({
        title: "Create failed",
        description: String(err?.message || err),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    setEditingBrand(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBrand) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!editingBrand.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!editingBrand.url?.trim()) {
      errors.url = "URL is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSaving(true);
    try {
      const id = (editingBrand as any)._id ?? (editingBrand as any).id;
      const { _id, ...updateData } = editingBrand as any;
      const res = await fetch(`/api/admin/brand`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateData, id }),
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
        title: "Updated",
        description: `Brand ${editingBrand.name} updated successfully`,
      });
      setIsEditDialogOpen(false);
      setEditingBrand(null);
      dispatch(addBrand(created));
      // window.location.reload();
    } catch (err: any) {
      console.error("Failed to update brand", err);
      toast({
        title: "Update failed",
        description: String(err?.message || err),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const product_brand = useMemo(() => {
    if (
      currentBusiness &&
      currentBusiness._id &&
      listBrand &&
      listBrand.length > 0
    ) {
      const list = listBrand.filter(
        (item) => item.tenantId === currentBusiness._id,
      );
      return list.length > 0 ? list : listBrand;
    }
    return [];
  }, [currentBusiness, listBrand]);

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }

    const ok = confirm(`Delete brand "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/brand?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      // dispatch(removeCategory(id));
      toast({
        title: "Deleted",
        description: `Brand ${row?.name ?? id} removed`,
      });
    } catch (err: any) {
      console.error("Failed to delete category", err);
      toast({
        title: "Delete failed",
        description: String(err?.message || err),
      });
    }
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    { key: "url", label: "URL" },
    { key: "description", label: "Description" },
    { key: "logo", label: "Logo" },
    { key: "websiteId", label: "Website ID" },
    { key: "tenantId", label: "Tenant ID" },
    { key: "created_at", label: "Created" },
    { key: "updated_at", label: "Updated" },
  ];
  return (
    <div>
      <DataTableExt
        title="Brands"
        data={product_brand ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
        opentab={() => {}}
      />

      {/* Add Brand Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Brand</DialogTitle>
          </DialogHeader>
          {newBrand && (
            <div className="space-y-4">
              <BrandForm
                brand={newBrand}
                setBrand={(value) => {
                  if (typeof value === "function") {
                    setNewBrand((prev) => (prev ? value(prev) : prev));
                  } else {
                    setNewBrand(value);
                  }
                }}
                fieldErrors={fieldErrors}
                handleLogoFile={() => {}}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewBrand(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveAdd} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Add Brand"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          {editingBrand && (
            <div className="space-y-4">
              <BrandForm
                brand={editingBrand}
                setBrand={(value) => {
                  if (typeof value === "function") {
                    setEditingBrand((prev) => (prev ? value(prev) : null));
                  } else {
                    setEditingBrand(value);
                  }
                }}
                fieldErrors={fieldErrors}
                handleLogoFile={() => {}}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingBrand(null);
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

export default BrandTable;
