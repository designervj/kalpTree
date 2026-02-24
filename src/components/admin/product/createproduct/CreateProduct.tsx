

"use client";

import React, {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RightColumn } from "./RightColumn";
import { ProductOptions } from "./ProductOptions";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BookingConfiguration, {
  BookingConfig,
  DEFAULT_CONFIGS,
} from "./BookingType";
import { toast } from "sonner";
import EntityCreateModal from "../../EntityCreateModal";

interface FormData {
  title: string;
  basePrice: string;
  description: string;
  productType: string;
  categories: string;
  brands?: string;
  tags?: string;
  allcategories?: string[];
  baseDiscount?: string;
  sku?: string;
  weight?: string;
  bagbutton?: boolean;
  baseQuantity?: string;
  ribbon?: string;
  subtitle?: string;
}

interface ImageFile {
  id: number;
  url: string;
  file: File;
}

export interface ProductOption {
  id: number;
  title: string;
  values: string[];
  useForVariants: boolean;
  unit?: string;
}

interface VariantAttribute {
  attributeId: number;
  attributeName: string;
  value: string;
  unit?: string;
  weight?: string;
}

interface VariantConfig {
  id: number;
  sku: string;
  stock: number;
  price: string;
  attributes: VariantAttribute[];
  weight: string;
}

export interface Attributes {
  id: number;
  name: string;
  category_id: string;
  unit?: string;
  possible_values: string[];
}

export function CreateProduct({ productId }: { productId?: string }) {
  const { listAttribute: attributes, isAttributeLoading } = useSelector(
    (state: RootState) => state.attribute,
  );
  const { listAttributeSets } = useSelector(
    (state: RootState) => state.attributeSets,
  );

  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const { listProduct, isProductLoading } = useSelector(
    (state: RootState) => state.product,
  );

  const [producttypecategory, setProductTypeCategory] = useState("");

  const [attributesetid, setAttributeSetId] = useState("");


  const [formData, setFormData] = useState<FormData>({
    title: "",
    basePrice: "",
    description: "",
    productType: "",
    categories: "",
    allcategories: [],
    baseDiscount: "",
    sku: "",
    weight: "",
    bagbutton: false,
    baseQuantity: "",
    ribbon: "",
    subtitle: "",
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [variantConfigs, setVariantConfigs] = useState<VariantConfig[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [showValueDropdown, setShowValueDropdown] = useState<number | null>(
    null,
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [valueSearchTerm, setValueSearchTerm] = useState<{
    [key: number]: string;
  }>({});

  const [bookingConfig, setBookingConfig] = useState<BookingConfig>(
    DEFAULT_CONFIGS.DATE_RANGE,
  );

  useLayoutEffect(() => {
    const singleSelectedProduct = listProduct.find((d) => d._id == productId);
    if (singleSelectedProduct && attributes.length > 0) {
      const {
        title,
        basePrice,
        description,
        categories,
        brands,
        options,
        variants,
        ribbon,
        subtitle,
        baseDiscount,
        sku,
        weight,
        bagbutton,
        baseQuantity,
      } = singleSelectedProduct;

      setFormData({
        title: title ? title : "",
        basePrice: basePrice ? basePrice : "",
        description: description ? description : "",
        productType: "",
        categories: categories ? categories : "",
        brands: brands ? brands : "",
        tags: "",
        ribbon: ribbon || "",
        subtitle: subtitle || "",
        baseDiscount: baseDiscount || "",
        sku: sku || "",
        weight: weight || "",
        bagbutton: bagbutton || false,
        baseQuantity: baseQuantity || "",
      });

      const attributesparsed = options.map((parsed) => {
        const relevantAttr = attributes.find((d) => d._id == parsed.id);

        return {
          id: relevantAttr?._id,
          title: relevantAttr?.name,
          values: parsed.values,
          unit: parsed.unit ?? "",
          useForVariants: parsed.useForVariants,
        };
      });

      setProductOptions(attributesparsed);
      setVariantConfigs(variants);
    }
  }, [listProduct, productId]);

  console.log(attributes)

  useEffect(() => {
    if (!productId && attributesetid) {
      const attr = listAttributeSets.find((d) => {
        return d._id == attributesetid;
      })?.attributes;

      const relevantAttrs =
        attr && attr.length > 0
          ? attributes.filter((d) => {
              return attr?.includes(String(d._id));
            })
          : [];

      if (relevantAttrs.length > 0) {
        setProductOptions((prev: any) => {
          return relevantAttrs.map((attr) => {
            const existing = prev.find((opt: any) => opt.id === attr.id);
            return (
              existing ?? {
                id: attr._id,
                title: attr.name,
                values: attr.possible_values,
                useForVariants: false,
                unit: attr.unit,
              }
            );
          });
        });
      } else {
        setProductOptions([]);
      }
    }
  }, [attributesetid]);

  const generateVariants = () => {
    const variantOptions = productOptions.filter(
      (opt) => opt.useForVariants && opt.values.length > 0,
    );

    if (variantOptions.length === 0) {
      setVariantConfigs([]);
      return;
    }
    const combinations: VariantAttribute[][] = [];
    const generate = (depth: number, current: VariantAttribute[]) => {
      if (depth === variantOptions.length) {
        combinations.push(current);
        return;
      }

      const option = variantOptions[depth];

      option.values.forEach((value) => {
        generate(depth + 1, [
          ...current,
          {
            attributeId: option.id!,
            attributeName: option.title,
            value,
            unit: option.unit,
            weight: "",
          },
        ]);
      });
    };

    generate(0, []);

    const variants: VariantConfig[] = combinations.map((attrs, idx) => ({
      id: idx,
      sku: "",
      stock: 0,
      price: "",
      attributes: attrs,
      weight: "0",
    }));

    setVariantConfigs(variants);
  };

  useEffect(() => {
    if (!productId) {
      generateVariants();
    }
  }, [productOptions]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name == "allCategories") {
      const copied = structuredClone(formData);
      if (formData.allcategories?.includes(value)) {
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageFile[] = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const [drag, setDrag] = useState<null | number>(null);

  const handleDrag = (index: number) => {
    setDrag(index);
  };

  const handleDragEnd = (index: number) => {
    if (drag === null || drag === index) return;
    const cloned = [...images];
    if (drag !== null) {
      [cloned[drag], cloned[index]] = [cloned[index], cloned[drag]];
    }
    setImages(cloned);
    setDrag(null);
  };

  const removeImage = (id: number) =>
    setImages((prev) => prev.filter((img) => img.id !== id));

  const addProductOption = () => {
    setProductOptions((prev) => [
      ...prev,
      { id: Date.now(), title: "", values: [], useForVariants: false },
    ]);
  };

  const updateOption = (
    id: number,
    field: keyof ProductOption,
    value: string | boolean,
  ) => {
    setProductOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)),
    );
  };

  const selectAttribute = (optionId: number, attrId: string) => {
    const attr = attributes.find((a) => a._id === attrId);
    if (!attr) return;
    setProductOptions((prev: any) =>
      prev.map((opt: any) =>
        opt.id === optionId
          ? { ...opt, title: attr.name, attributeId: attr.id, unit: attr.unit }
          : opt,
      ),
    );
    setShowDropdown(null);
    setSearchTerm("");
  };

  const removeOption = (id: number) =>
    setProductOptions((prev) => prev.filter((opt) => opt.id !== id));

  const addValue = (optionId: number, value: string) => {
    if (!value.trim()) return;

    const clonedOption = structuredClone(productOptions);

    const index = clonedOption.findIndex((d) => d.id == optionId);

    // Check if value already exists
    if (clonedOption[index]?.values.includes(value.trim())) return;

    clonedOption[index].values.push(value);

    setProductOptions(clonedOption);
    setValueSearchTerm((prev) => ({ ...prev, [optionId]: "" }));
  };

  const removeValue = (optionId: number, idx: number) => {
    setProductOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId
          ? { ...opt, values: opt.values.filter((_, i) => i !== idx) }
          : opt,
      ),
    );
  };

  const autoGenConfigs = () => {
    const stock =
      document.querySelector<HTMLInputElement>(
        'input[placeholder="Enter Stock"]',
      )?.value || "0";

    const price =
      document.querySelector<HTMLInputElement>(
        'input[placeholder="Enter Variant Price $ 0.00"]',
      )?.value || "0.00";

    const princeInNum = parseFloat(price).toFixed(2);

    setVariantConfigs((prev) =>
      prev.map((cfg) => ({
        ...cfg,
        stock: parseInt(stock) || 0,
        price: princeInNum,
      })),
    );
  };

  const updateConfig = (
    id: number,
    field: keyof VariantConfig,
    value: string | number,
  ) => {
    setVariantConfigs((prev) =>
      prev.map((cfg) => (cfg.id === id ? { ...cfg, [field]: value } : cfg)),
    );
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".attribute-dropdown-container")) {
        setShowDropdown(null);
      }
      if (!target.closest(".value-dropdown-container")) {
        setShowValueDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSaveProduct = async () => {
    const finalObj: {
      productdata: any;
      variantData: any;
    } = {
      productdata: {
        ...formData,
        options: productOptions,
        allcategories: [...selectedCategories],
      },
      variantData: variantConfigs,
    };

    if (images.length > 0) {
      const mapped = images.map((d) => {
        return fileToBase64(d.file);
      });

      const finalImages = await Promise.all(mapped);

      finalObj.productdata.images = finalImages;
    }

    if (formData.productType == "hotel") {
      finalObj.productdata.bookingConfg = bookingConfig;
    }

    try {
      const req = await fetch(
        `/api/admin/product?tenantId=${currentBusiness?._id}`,
        {
          method: "POST",
          body: JSON.stringify(finalObj),
        },
      );
      const res = await req.json();
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveVariant = (idx: number) => {
    const cloned = structuredClone(variantConfigs).filter(
      (d, index) => index !== idx,
    );
    if (cloned.length > 0) {
      setVariantConfigs(cloned);
    }
  };



  return (
    <div className="min-h-screen">
      <div className="w-full mb-4 flex justify-between items-center">
        <BreadCrumbPage />

        <Button onClick={handleSaveProduct}>Save Product</Button>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* General */}
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                General
              </h2>
              <div className="space-y-4">
                {/* Title and Ribbon in same row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      * Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Your product title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                      Ribbon
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs">
                        i
                      </span>
                    </label>
                    <input
                      type="text"
                      name="ribbon"
                      value={formData.ribbon}
                      onChange={handleInputChange}
                      placeholder="e.g. NEW"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Your product subtitle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description with AI Writer toolbar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-300">
                      <button
                        type="button"
                        className="px-3 py-1 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded"
                      >
                        AI Writer
                      </button>
                      <div className="h-5 w-px bg-gray-300" />
                      {["H2", "H3", "B", "I", "U", "•", "1.", "~", "≡"].map(
                        (btn) => (
                          <button
                            key={btn}
                            type="button"
                            className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                          >
                            {btn}
                          </button>
                        ),
                      )}
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-medium mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    * Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="text"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="text"
                      name="baseDiscount"
                      value={formData.baseDiscount}
                      onChange={handleInputChange}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Your final price with the discount applied.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (nos.)
                  </label>
                  <input
                    type="text"
                    name="baseQuantity"
                    value={formData.baseQuantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Hide Add to bag toggle */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Hide "Add to bag" button
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bagbutton}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bagbutton: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Payment info box */}
              <div className="mt-4 flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-md p-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  i
                </div>
                <p className="text-sm text-gray-700">
                  To accept and let your customers pay, add at least one payment
                  method. You can do it after creating a Product or now in{" "}
                  <span className="text-purple-700 font-medium">
                    Payments page
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Product Options */}
            <div className="bg-white rounded-md shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Product options
                  </h2>
                  <p className="text-sm text-gray-500">
                    Define options for the product based on category
                  </p>
                </div>
                <button
                  onClick={addProductOption}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {productOptions.map((option) => {
                  const linkedAttr = attributes.find(
                    (attr: any) => attr._id === option.id,
                  );

                  const availVals = linkedAttr?.possible_values || [];
                  const filteredAttrs = attributes.filter((attr) =>
                    attr.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  );

                  return (
                    <ProductOptions
                      key={option.id}
                      option={option}
                      removeValue={removeValue}
                      removeOption={removeOption}
                      availVals={availVals}
                      showValueDropdown={showValueDropdown}
                      addValue={addValue}
                      setShowValueDropdown={setShowValueDropdown}
                      setValueSearchTerm={setValueSearchTerm}
                      showDropdown={showDropdown}
                      valueSearchTerm={valueSearchTerm}
                      filteredAttrs={filteredAttrs}
                      selectAttribute={selectAttribute}
                      updateOption={updateOption}
                      setSearchTerm={setSearchTerm}
                      setShowDropdown={setShowDropdown}
                    />
                  );
                })}
              </div>
            </div>

            {/* Variants */}
            {variantConfigs.length > 0 && (
              <div className="bg-white rounded-md shadow p-6 ">
                <h2 className="text-2xl font-bold tracking-tight">
                  Configure Variants
                </h2>
                <p className="text-sm text-gray-500">
                  Set SKU, pricing, and inventory
                </p>
                <div className="flex items-center gap-4 mt-4 mb-6">
                  <input
                    type="text"
                    placeholder="Enter Stock"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Enter Variant Price $ 0.00"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={autoGenConfigs}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Auto Generate
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Variant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {variantConfigs.map((cfg, index) => (
                        <tr key={cfg.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            {cfg.attributes
                              .map((a) => `${a.attributeName}: ${a.value}`)
                              .join(" / ")}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={cfg.sku}
                              onChange={(e) =>
                                updateConfig(cfg.id, "sku", e.target.value)
                              }
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={cfg.stock}
                              onChange={(e) =>
                                updateConfig(
                                  cfg.id,
                                  "stock",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-20 px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={cfg.price}
                              onChange={(e) =>
                                updateConfig(cfg.id, "price", e.target.value)
                              }
                              className="w-20 px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={cfg.weight}
                              onChange={(e) =>
                                updateConfig(cfg.id, "weight", e.target.value)
                              }
                              className="w-20 px-2 py-1 border rounded text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button onClick={() => handleRemoveVariant(index)}>
                              <X color="red" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-medium mb-1">
                Media{" "}
                <span className="text-gray-400 text-sm font-normal">
                  Optional
                </span>
              </h2>
              <div className="mt-4">
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {images.map((img, idx) => (
                      <div
                        draggable={true}
                        onDragStart={() => handleDrag(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDragEnd(idx)}
                        key={img.id}
                        className="relative group"
                      >
                        <img
                          src={img.url}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-24 object-cover rounded border-2 border-gray-200"
                        />
                        {idx === 0 && (
                          <div className="absolute bottom-1 left-1 bg-white rounded-full p-1">
                            <div className="w-4 h-4 border-2 border-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop an image here or click to upload.
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <RightColumn
            formData={formData}
            handleInputChange={handleInputChange}
            producttypecategory={producttypecategory}
            setProductTypeCategory={setProductTypeCategory}
            attributesetid={attributesetid}
            setAttributeSetId={setAttributeSetId}
            listAttributeSets={listAttributeSets}
            setSelectedCategories={setSelectedCategories}
            selectedCategories={selectedCategories}
          />
        </div>
        {formData.productType === "hotel" && (
          <div className="mt-5">
            <BookingConfiguration
              bookingConfig={bookingConfig}
              setBookingConfig={setBookingConfig}
            />
          </div>
        )}
      </div>
    </div>
  );
}
