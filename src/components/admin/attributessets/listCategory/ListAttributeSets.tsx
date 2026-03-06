"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AttributeSetForm, { AttributeSet } from "../forms/AttributeSetsForm";
import {
  addAttributeSet,
  removeAttributeSet,
} from "@/hooks/slices/attributessets/attributeSetsSlice";
import { toast } from "sonner";
import { BusinessTypeModal } from "../../product/createproduct/BusinessTypeModal";

const ListAttributeSets = () => {
  const { listAttributeSets } = useSelector(
    (state: RootState) => state.attributeSets,
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const dispatch = useDispatch<AppDispatch>();
  // const { toast } = useToast();
  const router = useRouter();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAttributeSet, setEditingAttributeSet] =
    useState<AttributeSet | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAttributeSet, setNewAttributeSet] = useState<AttributeSet | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setNewAttributeSet({
      name: "",
      categoryId: "",
      attributes: [],
      sort_order: 0,
      tenantId: String(currentBusiness?._id),
    });
    setFieldErrors({});
    setIsAddDialogOpen(true);
  };

  const validateAttributeSet = (attributeSet: AttributeSet) => {
    const errors: Record<string, string> = {};

    if (!attributeSet.name?.trim()) {
      errors.name = "Name is required";
    }

    if (!attributeSet.categoryId) {
      errors.categoryId = "Category is required";
    }

    if (!attributeSet.attributes || attributeSet.attributes.length === 0) {
      errors.attributes = "At least one attribute is required";
    }

    return errors;
  };

  const handleSaveAdd = async () => {
    if (!newAttributeSet) return;

    setFieldErrors({});
    const errors = validateAttributeSet(newAttributeSet);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/attributessets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAttributeSet),
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

      toast.success(
        `Attribute Sets has been created with Name: ${newAttributeSet.name}`,
      );
      setIsAddDialogOpen(false);
      setNewAttributeSet(null);

      dispatch(addAttributeSet(created));
    } catch (err: any) {
      console.error("Failed to create attribute set", err);
      toast.success(`${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAttributeSets = useMemo(() => {
    if (
      currentBusiness &&
      currentBusiness._id &&
      listAttributeSets &&
      listAttributeSets.length > 0
    ) {
      const list = listAttributeSets.filter(
        (item: any) => item.tenantId === currentBusiness._id,
      );
      return list.length > 0 ? list : listAttributeSets;
    }
    return [];
  }, [currentBusiness, listAttributeSets]);

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast.error(`Missing Id`);
      return;
    }

    const ok = confirm(`Delete attribute set "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/attributessets?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeAttributeSet(id));

      toast.success(`Attribute Set ${row?.name ?? id} removed`);
    } catch (err: any) {
      console.error("Failed to delete attribute set", err);
      toast.error(err);
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    setEditingAttributeSet(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAttributeSet) return;

    setFieldErrors({});
    const errors = validateAttributeSet(editingAttributeSet);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const id = (editingAttributeSet as any)._id ?? editingAttributeSet.id;
      const { _id, ...updateData } = editingAttributeSet as any;

      const res = await fetch(`/api/admin/attribute-sets`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateData, id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      toast.success(
        `Attribute Set ${editingAttributeSet.name} updated successfully`,
      );
      setIsEditDialogOpen(false);
      setEditingAttributeSet(null);
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to update attribute set", err);
      toast.error(String(err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    { key: "categoryId", label: "Category ID" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <div>
      <DataTableExt
        title="Business Type"
        data={filteredAttributeSets ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
        opentab={() => { }}
      />

      {/* Add Attribute Set Dialog */}
      <BusinessTypeModal
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        newAttributeSet={newAttributeSet}
        setNewAttributeSet={setNewAttributeSet}
        fieldErrors={fieldErrors}
        isSaving={isSaving}
        handleSaveAdd={handleSaveAdd}
      />

      {/* Edit Attribute Set Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Attribute Set</DialogTitle>
          </DialogHeader>

          {editingAttributeSet && (
            <div className="space-y-4">
              <AttributeSetForm
                attributeSet={editingAttributeSet}
                setAttributeSet={(value) => {
                  if (typeof value === "function") {
                    setEditingAttributeSet((prev) =>
                      prev ? value(prev) : null,
                    );
                  } else {
                    setEditingAttributeSet(value);
                  }
                }}
                fieldErrors={fieldErrors}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingAttributeSet(null);
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

export default ListAttributeSets;
