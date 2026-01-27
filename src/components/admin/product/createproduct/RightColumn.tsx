"use client";

import { useEffect, useMemo, useState } from "react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { buildCategoryTree } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MaterialCategory } from "../../category/types/CategoryModel";
import { addCategory } from "@/hooks/slices/category/CategorySlice";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import CategoryForm from "../../category/forms/CategoryForm";
import { CategoryItem } from "./CategoryItem";

export const RightColumn = ({
  formData,
  handleInputChange,
  producttypecategory,
  setProductTypeCategory,
}: any) => {
  const {
    listCategory,
    isCategoryLoading,
    listProductType,
    listProductTypeCategory,
  } = useSelector((state: RootState) => state.category);

  const handleProductTypeCategory = (e: string) => {
    setProductTypeCategory(e);
  };
  // helper: make Select work like your handleInputChange
  const handleSelectChange = (name: string, value: string) => {
    handleInputChange({ target: { name, value } });
  };

  const NestedCategories = useMemo(() => {
    return buildCategoryTree(listCategory);
  }, [listCategory]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    let copied = structuredClone(selectedCategories);
    if (copied.includes(id)) {
      copied = copied.filter((str) => str != id);
      if (!copied.includes(formData.categories) && copied.length > 0) {
        handleInputChange({
          target: {
            name: "categories",
            value: copied[0],
          },
        });
      } else if (copied.length <= 0) {
        handleInputChange({
          target: {
            name: "categories",
            value: "",
          },
        });
      }
    } else {
      if (copied.length <= 0) {
        handleInputChange({
          target: {
            name: "categories",
            value: id,
          },
        });
      }
      copied.push(id);
    }

    setSelectedCategories(copied);
  };

  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { user } = useSelector((state: RootState) => state.user);

  const [newCategory, setNewCategory] = useState<MaterialCategory | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleSaveAdd = async () => {
    if (!newCategory) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!newCategory.name?.trim()) {
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

      setIsAddDialogOpen(false);
      setNewCategory(null);
      dispatch(addCategory(created));
      // window.location.reload();
    } catch (err: any) {
      console.error("Failed to create category", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    setNewCategory({
      name: "",
      icon: "",
      sort_order: 0,
      websiteId: currentWebsite?._id,
      tenantId: user?.tenantId,
      parentCategoryId: "",
    });
    setFieldErrors({});
    setIsAddDialogOpen(true);
  };


  return (
    <>
      <div className="relative lg:col-span-1">
        <Card className="  mb-2 ">
          <CardHeader className="pb-0 mb-0">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Organize
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Segment Type */}
            <div className="space-y-2">
              <Label htmlFor="Product Type">
                Product Type <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.productType}
                onValueChange={(v) => {
                  handleSelectChange("productType", v);
                  handleProductTypeCategory("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select segment type" />
                </SelectTrigger>
                <SelectContent>
                  {listProductType.map((d) => {
                    return (
                      <SelectItem value={String(d._id)}>{d.name}</SelectItem>
                    );
                  })}
                  {/* <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="packages">Packages</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Product Category Type">
                Product Category Type <span className="text-red-500">*</span>
              </Label>

              <Select
                value={producttypecategory}
                onValueChange={(v) => handleProductTypeCategory(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Product Category" />
                </SelectTrigger>
                <SelectContent>
                  {listProductTypeCategory
                    .filter((d) => {
                      return d.product_type === formData.productType;
                    })
                    .map((d) => {
                      return (
                        <SelectItem value={String(d._id)}>{d.name}</SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>

            {/* Categories */}
            {/* <div className="space-y-2">
              <Label htmlFor="categories">
                Categories <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.categories}
                onValueChange={(v) => handleSelectChange("categories", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"NA"}>Please Select Category</SelectItem>
                  {listCategory.map((d) => {
                    return (
                      <SelectItem key={String(d._id)} value={String(d._id)}>
                        {d.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div> */}

            {/* Brands */}
            {/* <div className="space-y-2">
              <Label htmlFor="brands">
                Brands <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.brands}
                onValueChange={(v) => handleSelectChange("brands", v)}
              >
                <SelectTrigger className="w-full border-2 border-blue-500 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PPG">PPG</SelectItem>
                  <SelectItem value="Sherwin-Williams">
                    Sherwin-Williams
                  </SelectItem>
                  <SelectItem value="Behr">Behr</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Tags */}
            {/* <div className="space-y-2">
              <Label htmlFor="tags">
                Tags <span className="text-gray-400 text-xs">Optional</span>
              </Label>

              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. premium, exterior"
              />
            </div> */}
          </CardContent>
        </Card>

        {listCategory.length > 0 && (
          <Card className="">
            <CardHeader className="pb-0 mb-0">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Select Category
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1">
                {NestedCategories.map((cat: any) => (
                  <CategoryItem
                    key={cat._id}
                    category={cat}
                    selected={selectedCategories}
                    onToggle={toggleCategory}
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                ))}
              </div>
              <Button onClick={handleAdd}>+ Add Category</Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            {newCategory && (
              <div className="space-y-4">
                <CategoryForm
                  category={newCategory}
                  setCategory={(value) => {
                    if (typeof value === "function") {
                      setNewCategory((prev) => (prev ? value(prev) : prev));
                    } else {
                      setNewCategory(value);
                    }
                  }}
                  fieldErrors={fieldErrors}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setNewCategory(null);
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
      </div>
    </>
  );
};
