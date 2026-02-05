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
import {
  addCategory,
  addProductType,
  addProductTypeCategory,
} from "@/hooks/slices/category/CategorySlice";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import CategoryForm from "../../category/forms/CategoryForm";
import { CategoryItem } from "./CategoryItem";
import EntityCreateModal from "../../EntityCreateModal";
import { ProductTypeModal } from "./ProductTypeModal";
import { ProductType } from "@/lib/material/product_type";
import { toast } from "sonner";
import { CategoryModal } from "./CategoryModal";
import { ProductTypeCategory } from "@/lib/material/product_type_category";
import { ProductCategoryTypeModal } from "./ProductCategoryType";
import { AttributeSet } from "../../attributessets/forms/AttributeSetsForm";
import { addAttributeSet } from "@/hooks/slices/attributessets/attributeSetsSlice";
import { ProductSetModal } from "./ProductSetModal";

export const RightColumn = ({
  formData,
  handleInputChange,
  producttypecategory,
  setProductTypeCategory,
  attributesetid,
  setAttributeSetId,
  listAttributeSets,
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

  const handleSetChange = (e: string) => {
    setAttributeSetId(e);
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<string>("");
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

      setIsAddDialogOpen("");
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
    setIsAddDialogOpen("category");
  };

  const handleAddProductType = () => {
    setNewProductType({
      name: "",
      slug: "",
    });
    setFieldErrors({});
    setIsAddDialogOpen("producttype");
  };

  const handleSaveProductTypeAdd = async () => {
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
      setIsAddDialogOpen("");
      setNewProductType(null);

      // Dispatch the imported action
      dispatch(addProductType(created));
    } catch (err: any) {
      console.error("Failed to create product type", err);
    } finally {
      setIsSaving(false);
    }
  };

  const [newProductType, setNewProductType] = useState<ProductType | null>(
    null,
  );

  const [newCategoryType, setNewCategoryType] =
    useState<ProductTypeCategory | null>(null);

  const handleProductTypeCategoryAdd = () => {
    setNewCategoryType({
      name: "",
      slug: "",
      product_type: "",
      icon: "",
      sort_order: 0,
      description: "",
    });
    setFieldErrors({});
    setIsAddDialogOpen("producttypecategory");
  };

  const handleProductTypeCategorySaveAdd = async () => {
    if (!newCategoryType) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (!newCategoryType.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!newCategoryType.slug?.trim()) {
      errors.slug = "Slug is required";
    }
    if (!newCategoryType.product_type?.trim()) {
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

      setIsAddDialogOpen("");
      setNewCategory(null);
      dispatch(addProductTypeCategory(created));
    } catch (err: any) {
      console.error("Failed to create category", err);
    } finally {
      setIsSaving(false);
    }
  };

  const [newAttributeSet, setNewAttributeSet] = useState<AttributeSet | null>(
    null,
  );

  const handleAttributeAdd = () => {
    setNewAttributeSet({
      name: "",
      categoryId: "",
      attributes: [],
      sort_order: 0,
      websiteId: String(currentWebsite?._id),
      tenantId: user?.tenantId,
    });
    setFieldErrors({});
    setIsAddDialogOpen("attribute");
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

  const handleSaveAttributeAdd = async () => {
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
      setIsAddDialogOpen("");
      setNewAttributeSet(null);

      dispatch(addAttributeSet(created));
    } catch (err: any) {
      console.error("Failed to create attribute set", err);
      toast.success(`${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ProductTypeModal
        isAddDialogOpen={isAddDialogOpen == "producttype"}
        setIsAddDialogOpen={setIsAddDialogOpen}
        newProductType={newProductType}
        setNewProductType={setNewProductType}
        fieldErrors={fieldErrors}
        isSaving={isSaving}
        handleSaveAdd={handleSaveProductTypeAdd}
        setFieldErrors={setFieldErrors}
      />
      <CategoryModal
        isAddDialogOpen={isAddDialogOpen == "category"}
        setIsAddDialogOpen={setIsAddDialogOpen}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        isSaving={isSaving}
        handleSaveAdd={handleSaveAdd}
        fieldErrors={fieldErrors}
      />
      <ProductCategoryTypeModal
        isAddDialogOpen={isAddDialogOpen == "producttypecategory"}
        setIsAddDialogOpen={setIsAddDialogOpen}
        newCategory={newCategoryType}
        setNewCategory={setNewCategoryType}
        fieldErrors={fieldErrors}
        isSaving={isSaving}
        handleSaveAdd={handleProductTypeCategorySaveAdd}
        listProductType={listProductType}
        setFieldErrors={setFieldErrors}
      />

      <ProductSetModal
        isAddDialogOpen={isAddDialogOpen == "attribute"}
        setIsAddDialogOpen={setIsAddDialogOpen}
        newAttributeSet={newAttributeSet}
        setNewAttributeSet={setNewAttributeSet}
        fieldErrors={fieldErrors}
        isSaving={isSaving}
        handleSaveAdd={handleSaveAttributeAdd}
      />
      <div className="relative lg:col-span-1">
        <Card className="  mb-2 ">
          <CardHeader className="pb-0 mb-0">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Organize
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Product Type <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.productType}
                onValueChange={(v) => {
                  handleSelectChange("productType", v);
                  handleProductTypeCategory("");
                  handleSetChange("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select segment type" />
                </SelectTrigger>

                <SelectContent>
                  {listProductType.map((d) => (
                    <SelectItem key={d._id} value={String(d._id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Add Button */}
              <Button onClick={handleAddProductType}>+ Add Product Type</Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Product Category Type">
                Product Category Type <span className="text-red-500">*</span>
              </Label>

              <Select
                value={producttypecategory}
                onValueChange={(v) => {
                  handleProductTypeCategory(v);
                  handleSetChange("");
                }}
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
              <Button onClick={handleProductTypeCategoryAdd}>
                + Add Product Category
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Product Category Type">
                Product Sets<span className="text-red-500">*</span>
              </Label>

              <Select
                value={attributesetid}
                onValueChange={(v) => handleSetChange(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Product Set" />
                </SelectTrigger>
                <SelectContent>
                  {producttypecategory &&
                    listAttributeSets
                      .filter((d: any) => {
                        return d.categoryId === producttypecategory;
                      })
                      .map((d: any) => {
                        return (
                          <SelectItem value={String(d._id)}>
                            {d.name}
                          </SelectItem>
                        );
                      })}
                </SelectContent>
              </Select>

              <Button onClick={handleAttributeAdd}>+ Add Product Sets</Button>
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
      </div>
    </>
  );
};
