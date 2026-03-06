"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { addProduct, removeProduct } from "@/hooks/slices/product/ProductSlice";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Papa from "papaparse";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductForm from "../forms/ProductForm";
import { ProductModel } from "../type/ProductModel";
import { buildWebsiteHref, CSVProcessing } from "@/lib/utils";
import { CSVImportModal } from "../ImportCSV";
import { toast } from "sonner";

const ProductTable = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const searchparams = Object.fromEntries(searchParams.entries());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(
    null,
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductModel | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { listProduct, isProductLoading } = useSelector(
    (state: RootState) => state.product,
  );

  const { listCategory } = useSelector((state: RootState) => state.category);
  const { listBrand } = useSelector((state: RootState) => state.brand);

  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const products = useMemo(() => {
    if (listProduct && listProduct.length > 0) {
      return listProduct.map((item) => {
        const categoryId = item.product_category_id;
        const brandId = item.brand_id;
        const segmentId = item.material_segment_id;

        const category = listCategory.find(
          (cat) => cat._id == categoryId,
        )?.name;
        const brand = listBrand.find((b) => (b as any)._id == brandId)?.name;

        return {
          ...item,
          category: category || "-",
          brand: brand || "-",
        };
      });
    }
    return [];
  }, [listCategory, listBrand, listProduct]);

  const handleAdd = () => {
    const href = buildWebsiteHref(
      "/admin/products/createproduct",
      params.website!,
      searchparams,
    );
    router.push(href);
  };

  const handleSaveAdd = async () => {
    if (!newProduct) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!newProduct.title?.trim()) {
      errors.name = "Name is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
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

      setIsAddDialogOpen(false);
      setNewProduct(null);
      dispatch(addProduct(created));
      // window.location.reload();
    } catch (err: any) {
      console.error("Failed to create category", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      return;
    }

    const ok = confirm(`Delete product "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeProduct(id));
    } catch (err: any) {
      console.error("Failed to delete product", err);
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;

    const href = buildWebsiteHref(
      `/admin/products/${id}`,
      params.website!,
      searchparams,
    );
    // navigate to edit/view page under admin
    router.push(href);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (!editingProduct.title?.trim()) {
      errors.name = "Name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const id = (editingProduct as ProductModel)._id ?? editingProduct.id;
      const { _id, ...updateData } = editingProduct as any;

      const res = await fetch(`/api/admin/category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateData, id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      setIsEditDialogOpen(false);
      setEditingProduct(null);
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to update category", err);
    } finally {
      setIsSaving(false);
    }
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "product_category_id", label: "Product category Id", hidden: true },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "categories", label: "Categories" },
    { key: "brands", label: "Brand" },
    { key: "segmentType", label: "Segment" },
    { key: "basePrice", label: "Price" },
    { key: "createdAt", label: "Created" },
  ];

  // const handleChange = (e: any) => {
  //   const file = e.target.files;
  //   Papa.parse(file[0], {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: (result) => {
  //       const cleanedData = result.data.map((row: Record<string, any>) => {
  //         return Object.fromEntries(
  //           Object.entries(row).filter(
  //             ([_, value]) =>
  //               value !== "" && value !== null && value !== undefined,
  //           ),
  //         );
  //       });

  //       let finalProduct = CSVProcessing(cleanedData);
  //       console.log(finalProduct);
  //     },
  //   });
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImport = async (data: any) => {
    try {
      const res = await fetch(
        `/api/admin/product/bulk?tenantId=${currentBusiness?._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await res.json();
      if (result.success) {
        toast.success("Product has been Created");
        return true;
      } else {
        toast.error("Error in Product Creation");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <div>
      <DataTableExt
        title="Products"
        data={products ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
        opentab={() => { }}
      />

      <Button onClick={() => setIsModalOpen(true)}>Import Products</Button>

      <CSVImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
      />

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          {newProduct && (
            <div className="space-y-4">
              <ProductForm
                product={newProduct}
                setProduct={(value) => {
                  if (typeof value === "function") {
                    setNewProduct((prev) => (prev ? value(prev) : prev));
                  } else {
                    setNewProduct(value);
                  }
                }}
                fieldErrors={fieldErrors}
                filterCategory={listCategory}
                listBrand={listBrand}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewProduct(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveAdd} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Add Category"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit PRODUCT Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4">
              <ProductForm
                product={editingProduct}
                setProduct={(value) => {
                  if (typeof value === "function") {
                    setEditingProduct((prev) => (prev ? value(prev) : null));
                  } else {
                    setEditingProduct(value);
                  }
                }}
                fieldErrors={fieldErrors}
                filterCategory={listCategory}
                listBrand={listBrand}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingProduct(null);
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

export default ProductTable;
