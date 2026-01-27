"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import {
  addAttribute,
  removeAttribute,
} from "@/hooks/slices/attribute/AttributeSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MaterialAttributes } from "../types/attributeModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import AttributeForm from "../forms/AttributeForm";
const AttributeTable = () => {
  const { listAttribute, isAttributeLoading } = useSelector(
    (state: RootState) => state.attribute,
  );
  const { listProductTypeCategory } = useSelector(
    (state: RootState) => state.category,
  );
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] =
    useState<MaterialAttributes | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAttribute, setNewAttribute] = useState<MaterialAttributes | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setNewAttribute({
      name: "",
      category_id: null,
      type: "",
      possible_values: [],
      data_type: undefined,
      websiteId: currentWebsite?._id,
      tenantId: user?.tenantId,
    });
    setFieldErrors({});
    setIsAddDialogOpen(true);
  };


  const handleSaveAdd = async () => {
    if (!newAttribute) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!newAttribute.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!newAttribute.category_id) {
      errors.category_id = "Category is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/attribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAttribute),
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
        description: `Attribute ${newAttribute.name} created successfully`,
      });
      setIsAddDialogOpen(false);
      setNewAttribute(null);
      dispatch(addAttribute(created));
      // window.location.reload();
    } catch (err: any) {
      console.error("Failed to create attribute", err);
      toast({
        title: "Create failed",
        description: String(err?.message || err),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentUser = useSelector((state: RootState) => state.user.user);


  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }

    const ok = confirm(`Delete attribute "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/attribute/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeAttribute(id));
      toast({
        title: "Deleted",
        description: `Attribute ${row?.name ?? id} removed`,
      });
    } catch (err: any) {
      console.error("Failed to delete attribute", err);
      toast({
        title: "Delete failed",
        description: String(err?.message || err),
      });
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    setEditingAttribute(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };
  const handleSaveEdit = async () => {
    if (!editingAttribute) return;

    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (!editingAttribute.name?.trim()) {
      errors.name = "Name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const id = (editingAttribute as any)._id ?? editingAttribute.id;
      const { _id, ...updateData } = editingAttribute as any;

      const res = await fetch(`/api/admin/attribute`, {
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
        description: `Category ${editingAttribute.name} updated successfully`,
      });
      setIsEditDialogOpen(false);
      setEditingAttribute(null);
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
    {
      key: "category",
      label: "Category",
      render: (value: any, row: any) => value?.name || "-",
    },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <div>
      <DataTableExt
        title="Attributes"
        data={listAttribute ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
        opentab={() => {}}
      />
      {/* Add Attribute Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Attribute</DialogTitle>
          </DialogHeader>
          {newAttribute && (
            <div className="space-y-4">
              <AttributeForm
                attribute={newAttribute}
                setAttribute={(value) => {
                  if (typeof value === "function") {
                    setNewAttribute((prev) => (prev ? value(prev) : prev));
                  } else {
                    setNewAttribute(value);
                  }
                }}
                fieldErrors={fieldErrors}
                filterCategory={listProductTypeCategory}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewAttribute(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveAdd} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Add Attribute"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          {editingAttribute && (
            <div className="space-y-4">
              <AttributeForm
                attribute={editingAttribute}
                setAttribute={(value) => {
                  if (typeof value === "function") {
                    setEditingAttribute((prev) => (prev ? value(prev) : null));
                  } else {
                    setEditingAttribute(value);
                  }
                }}
                fieldErrors={fieldErrors}
                filterCategory={listProductTypeCategory}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingAttribute(null);
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

export default AttributeTable;
