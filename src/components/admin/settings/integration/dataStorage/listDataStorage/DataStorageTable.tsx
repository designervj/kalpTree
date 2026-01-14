"use client"
import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { getAllDataStorage, deleteDataStorage, updateDataStorage, createDataStorage } from "@/hooks/slices/dataStorage/DataStorageSlice";
import { DataTableExt } from "@/components/dataTable/DataTableExt";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StorageForm from "../form/StorageForm";
import { Button } from "@/components/ui/button";

const DataStorageTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.dataStorage);
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStorage, setEditingStorage] = useState<any | null>(null);
  const defaultFormState = {
    provider: "",
    region: "",
    bucket: "",
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: "",
    isActive: true,
    isDefault: false,
    name: "",
    description: "",
  };
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(getAllDataStorage());
  }, [dispatch]);

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    { key: "provider", label: "Provider" },
    { key: "region", label: "Region" },
    { key: "bucket", label: "Bucket" },
    { key: "connectionStatus", label: "Status" },
    { key: "createdAt", label: "Created" },
  ];

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }
    const ok = confirm(`Delete storage \"${row?.name ?? id}\"?`);
    if (!ok) return;
    try {
      await dispatch(deleteDataStorage(id)).unwrap();
      toast({ title: "Deleted", description: `Storage ${row?.name ?? id} removed` });
    } catch (err: any) {
      toast({ title: "Delete failed", description: String(err?.message || err) });
    }
  };

  const handleView = (row: any) => {
    setEditingStorage({ ...defaultFormState, ...row });
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  // TODO: Implement save logic for edit
  const handleSaveEdit = async () => {
    if (!editingStorage) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!editingStorage.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!editingStorage.provider) {
      errors.provider = "Provider is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSaving(true);
    try {
      const id = editingStorage._id ?? editingStorage.id;
      const { _id, ...updateData } = editingStorage;
      await dispatch(updateDataStorage({ id, input: updateData })).unwrap();
      toast({ title: "Updated", description: `Storage ${editingStorage.name} updated successfully` });
      setIsEditDialogOpen(false);
      setEditingStorage(null);
    } catch (err: any) {
      toast({ title: "Update failed", description: String(err?.message || err), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // TODO: Implement add logic
  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingStorage({ ...defaultFormState });
    setFieldErrors({});
  };

  return (
    <>
      <div>
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddNew} variant="default">Create New</Button>
        </div>
        <DataTableExt
          title="Data Storage"
          data={items ?? []}
          initialColumns={initialColumns}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Storage</DialogTitle>
          </DialogHeader>
          {editingStorage && (
            <div className="space-y-4">
              <StorageForm
                value={editingStorage}
                onChange={setEditingStorage}
                fieldErrors={fieldErrors}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingStorage(null); }} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSaveEdit} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Data Storage</DialogTitle>
          </DialogHeader>
          {editingStorage && (
            <div className="space-y-4">
              <StorageForm
                value={editingStorage}
                onChange={setEditingStorage}
                fieldErrors={fieldErrors}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={isSaving}>Cancel</Button>
                <Button onClick={async () => {
                  setFieldErrors({});
                  const errors: Record<string, string> = {};
                  if (!editingStorage?.name?.trim()) errors.name = "Name is required";
                  if (!editingStorage?.provider) errors.provider = "Provider is required";
                  if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
                  setIsSaving(true);
                  try {
                    await dispatch(createDataStorage(editingStorage)).unwrap();
                    toast({ title: "Created", description: `Storage ${editingStorage.name} created successfully` });
                    setShowAddForm(false);
                    setEditingStorage(null);
                  } catch (err: any) {
                    toast({ title: "Create failed", description: String(err?.message || err), variant: "destructive" });
                  } finally {
                    setIsSaving(false);
                  }
                }} disabled={isSaving}>{isSaving ? "Saving..." : "Create Storage"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataStorageTable;