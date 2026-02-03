"use client";

import * as React from "react";
import {
  Box,
  Sparkles,
  DownloadCloud,
  BadgeCheck,
  CalendarDays,
  Heart,
  Gift,
  Shirt,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  Wand2,
  Info,
  X,
  Upload,
} from "lucide-react";
import { IoClose } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GetAllcategory from "@/components/admin/category/listCategory/GetAllcategory";
import GetAllAttribute from "@/components/admin/attribute/attributeList/GetAllAttribute";
import GetAllProductTypeCategory from "@/components/admin/product-type-category/listCategory/GetAllProductTypeCategory";
import GetAllAttributesSets from "@/components/admin/attributessets/listCategory/GetAllAttributesSets";

import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import BookingConfiguration, {
  BookingConfig,
  DEFAULT_CONFIGS,
} from "@/components/admin/product/createproduct/BookingType";
import { ProductOptionsSection } from "@/components/admin/product/createproduct/ProductOptions";
import { CategoryItem } from "@/components/admin/product/createproduct/CategoryItem";
import { buildCategoryTree } from "@/lib/utils";
import { MaterialCategory } from "@/components/admin/category/types/CategoryModel";
import { DialogTitle } from "@radix-ui/react-dialog";
import CategoryForm from "@/components/admin/category/forms/CategoryForm";
import { addCategory } from "@/hooks/slices/category/CategorySlice";

type SellType =
  | "physical"
  | "multi_physical"
  | "digital"
  | "service"
  | "appointment"
  | "donation"
  | "gift_card"
  | "print_on_demand";

type TypeCard = {
  key: SellType;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: { text: string; tone: "beta" | "new" };
};

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

function BadgePill({ text, tone }: { text: string; tone: "beta" | "new" }) {
  const cls =
    tone === "new"
      ? "bg-violet-50 text-violet-700 border-violet-100"
      : "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span
      className={[
        "ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        cls,
      ].join(" ")}
    >
      {text}
    </span>
  );
}

function OptionCard({
  item,
  onPick,
}: {
  item: TypeCard;
  onPick: (key: SellType) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onPick(item.key)}
      className="group w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:bg-slate-50/40"
    >
      <div className="flex h-full min-h-[92px]">
        <div className="grid w-[86px] place-items-center border-r border-slate-200 bg-slate-50">
          <Icon className="h-6 w-6 text-slate-600" />
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <div className="flex items-center">
              <p className="truncate text-[15px] font-semibold text-slate-900">
                {item.title}
              </p>
              {item.badge ? (
                <BadgePill text={item.badge.text} tone={item.badge.tone} />
              ) : null}
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {item.desc}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
        </div>
      </div>
    </button>
  );
}

function DividerRow() {
  return <div className="h-px w-full bg-slate-200" />;
}

function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle ? (
            <span className="text-sm text-slate-500">{subtitle}</span>
          ) : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function MiniHelpIcon() {
  return (
    <span className="inline-flex items-center justify-center">
      <Info className="h-4 w-4 text-slate-400" />
    </span>
  );
}

function ProductFormMock({ onBack }: { onBack: () => void }) {
  // Redux state
  const { listAttribute: attributes, isAttributeLoading } = useSelector(
    (state: RootState) => state.attribute,
  );
  const { listAttributeSets } = useSelector(
    (state: RootState) => state.attributeSets,
  );
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { listProduct, isProductLoading } = useSelector(
    (state: RootState) => state.product,
  );

  const {
    listCategory,
    isCategoryLoading,
    listProductType,
    listProductTypeCategory,
  } = useSelector((state: RootState) => state.category);

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  const NestedCategories = React.useMemo(() => {
    return buildCategoryTree(listCategory);
  }, [listCategory]);

  // State from CreateProduct
  const [producttypecategory, setProductTypeCategory] = React.useState("");

  const [formData, setFormData] = React.useState<FormData>({
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
    subtitle: ""
  });

  const [images, setImages] = React.useState<ImageFile[]>([]);
  const [productOptions, setProductOptions] = React.useState<ProductOption[]>(
    [],
  );

  const [variantConfigs, setVariantConfigs] = React.useState<VariantConfig[]>(
    [],
  );

  const [bookingConfig, setBookingConfig] = React.useState<BookingConfig>(
    DEFAULT_CONFIGS.DATE_RANGE,
  );

  const [drag, setDrag] = React.useState<null | number>(null);

  React.useEffect(() => {
    if (producttypecategory) {
      const attr = listAttributeSets.find((d) => {
        return d.categoryId == producttypecategory;
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
      }
    }
  }, [producttypecategory, listAttributeSets, attributes]);

  // Generate variants based on product options
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

  React.useEffect(() => {
    generateVariants();
  }, [productOptions]);

  const handleInputChange = (e: any) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (id: string) => {
    let copied = structuredClone(selectedCategories);
    if (copied.includes(id)) {
      copied = copied.filter((str) => str != id);
      if (!copied.includes(formData.categories) && copied.length > 0) {
        handleInputChange({
          name: "categories",
          value: copied[0],
        });
      } else if (copied.length <= 0) {
        handleInputChange({
          name: "categories",
          value: "",
        });
      }
    } else {
      if (copied.length <= 0) {
        handleInputChange({
          name: "categories",
          value: id,
        });
      }
      copied.push(id);
    }

    setSelectedCategories(copied);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageFile[] = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

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

  const handleRemoveVariant = (idx: number) => {
    setVariantConfigs((prev) => prev.filter((cfg, index) => index != idx));
  };

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
      },
      variantData: variantConfigs,
    };

    if (images.length > 0) {
      const image: string[] = [];

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
        `/api/admin/product?tenantId=${currentWebsite?.tenantId}&websiteId=${currentWebsite?._id}`,
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
  const { user } = useSelector((state: RootState) => state.user);

  const [newCategory, setNewCategory] = React.useState<MaterialCategory | null>(
    null,
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

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

  console.log(formData);

  return (
    <div className="bg-slate-50">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-lg font-semibold text-slate-900">Product</p>
          </div>
        </div>

        <Select defaultValue="active">
          <SelectTrigger className=" w-[110px]  rounded-sm bg-white">
            <SelectValue placeholder="Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="grid gap-6">
          {/* Product card */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <div className="grid gap-5">
              {/* Upload boxes */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  type="button"
                  className="group flex min-h-[70px] w-full items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-left hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50">
                      <Wand2 className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        <span className="mr-2 text-[11px] font-semibold text-violet-600">
                          Fast and easy
                        </span>
                        Upload images and generate product details with AI
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                </button>

                <label className="group flex min-h-[70px] w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-left hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                      <ImageIcon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Upload images
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
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

              {/* Title / Ribbon */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-8">
                  <Label className="text-xs text-slate-700">* Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Your product title"
                    className="mt-2 h-10 rounded-xl"
                  />
                </div>
                <div className="md:col-span-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-slate-700">Ribbon</Label>
                    <MiniHelpIcon />
                  </div>
                  <Input
                    name="ribbon"
                    value={formData.ribbon}
                    onChange={handleInputChange}
                    placeholder="e.g. NEW"
                    className="mt-2 h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-8">
                  <Label className="text-xs text-slate-700">Subtitle</Label>
                  <Input
                   name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Your product subtitle"
                    className="mt-2 h-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Description editor mock */}
              <div>
                <Label className="text-xs text-slate-700">Description</Label>

                <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-violet-600 hover:bg-violet-50"
                    >
                      AI Writer
                    </button>
                    <div className="mx-2 h-5 w-px bg-slate-200" />
                    {["H2", "H3", "B", "I", "U", "•", "1.", "〰", "≡"].map(
                      (t) => (
                        <button
                          key={t}
                          type="button"
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {t}
                        </button>
                      ),
                    )}
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[160px] w-full resize-none bg-white p-4 text-sm text-slate-900 outline-none"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <SectionTitle title="Pricing" />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
              <div>
                <Label className="text-xs text-slate-700">* Price</Label>
                <Input
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="mt-2 h-10 rounded-xl"
                  placeholder="₹"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-700">Discount price</Label>
                <Input
                  name="baseDiscount"
                  value={formData.baseDiscount}
                  onChange={handleInputChange}
                  className="mt-2 h-10 rounded-xl"
                  placeholder="₹"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Your final price with the discount applied.
                </p>
              </div>
              <div>
                <Label className="text-xs text-slate-700">SKU</Label>
                <Input
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="mt-2 h-10 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-700">Weight (kg)</Label>
                <Input
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="mt-2 h-10 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-700">
                  Quantity (nos.)
                </Label>
                <Input
                  name="baseQuantity"
                  value={formData.baseQuantity}
                  onChange={handleInputChange}
                  className="mt-2 h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-700">
                  Hide "Add to bag" button
                </span>
                <Switch
                  name="bagbutton"
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      bagbutton: checked,
                    }))
                  }
                  checked={formData.bagbutton}
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-slate-700">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                i
              </span>
              To accept and let your customers pay, add at least one payment
              method. You can do it after creating a Product or now in{" "}
              <span className="font-semibold text-violet-700">
                Payments page.
              </span>
            </div>
          </Card>

          {/* Options - Using CreateProduct Logic */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <ProductOptionsSection
              productOptions={productOptions}
              setProductOptions={setProductOptions}
              attributes={attributes}
            />
          </Card>

          {/* Variants Configuration */}
          {variantConfigs.length > 0 && (
            <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
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
            </Card>
          )}

          {/* Custom field */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Custom field
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Enable customers to personalize this product by adding a custom
              text on it.
            </p>

            <div className="mt-4">
              <Label className="text-xs text-slate-700">Title</Label>
              <Input
                className="mt-2 h-10 rounded-xl"
                placeholder="e.g. What message would you like engraved on your product?"
              />
              <label className="mt-4 flex items-center gap-3">
                <Checkbox />
                <span className="text-sm text-slate-700">Mandatory</span>
              </label>
            </div>
          </Card>

          {/* Categories */}

          {/* <h3 className="text-base font-semibold text-slate-900">
              Categories
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Use categories to organize products on your online store.
              <span className="ml-2 text-violet-700">Learn more</span>
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-violet-700 hover:bg-violet-50"
              >
                + Add new category
              </Button>
            </div> */}

          {listCategory.length > 0 && (
            <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
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

          {/* Related products */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Related products
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Increase your sales by showing related products on this product's
              page, such as "You may also like", "Goes well together", or
              similar.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Checkbox />
              <span className="text-sm text-slate-700">
                Show related products
              </span>
            </div>
          </Card>

          {/* Booking Configuration */}
          {formData.productType === "hotel" && (
            <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
              <BookingConfiguration
                bookingConfig={bookingConfig}
                setBookingConfig={setBookingConfig}
              />
            </Card>
          )}

          {/* Save Button at Bottom */}
          <div className="flex justify-end">
            <Button onClick={handleSaveProduct} className="rounded-xl">
              Save Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddProduct() {
  const [step, setStep] = React.useState<"choose" | "form">("choose");
  const [picked, setPicked] = React.useState<SellType | null>(null);

  const cards: Record<SellType, TypeCard> = {
    physical: {
      key: "physical",
      title: "Physical product",
      desc: "Products that require shipping or pick up",
      icon: Box,
    },
    multi_physical: {
      key: "multi_physical",
      title: "Multiple physical products",
      desc: "Add up to 10 physical product at once using AI",
      icon: Sparkles,
    },
    digital: {
      key: "digital",
      title: "Digital product",
      desc: "Products that could be downloaded via link after purchase",
      icon: DownloadCloud,
    },
    service: {
      key: "service",
      title: "Service",
      desc: "Offer your expertise or abilities as a product",
      icon: BadgeCheck,
    },
    appointment: {
      key: "appointment",
      title: "Appointment",
      desc: "Services, that require date & time selection, before going to checkout",
      icon: CalendarDays,
    },
    donation: {
      key: "donation",
      title: "Donation",
      desc: "Collect donations for your campaign here",
      icon: Heart,
    },
    gift_card: {
      key: "gift_card",
      title: "Gift card",
      desc: "Prepaid cards that can be redeemed for store purchases",
      icon: Gift,
      badge: { text: "Beta", tone: "beta" },
    },
    print_on_demand: {
      key: "print_on_demand",
      title: "Print on demand product",
      desc: "Create a product with your custom design",
      icon: Shirt,
      badge: { text: "New", tone: "new" },
    },
  };

  const rows: [TypeCard, TypeCard][] = [
    [cards.physical, cards.multi_physical],
    [cards.digital, cards.service],
    [cards.appointment, cards.donation],
    [cards.gift_card, cards.print_on_demand],
  ];

  const pickType = (k: SellType) => {
    setPicked(k);
    setStep("form");
  };

  const backToChoose = () => {
    setStep("choose");
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // reset
          setStep("choose");
          setPicked(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-sm">Add product</Button>
      </DialogTrigger>

      <DialogContent className="w-[1200px] min-w-[1000px] overflow-hidden rounded-2xl border-slate-200 p-0 shadow-xl">
        {/* Step: Choose type */}
        {step === "choose" ? (
          <div className="bg-white">
            <div className="px-8 pb-4 py-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">
                What do you want to sell?
              </h2>

              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="rounded-full w-8 h-8 cursor-pointer"
                >
                  <IoClose />
                </Button>
              </DialogClose>
            </div>

            <div className="px-8 pb-8">
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="px-6 py-6">
                  <div className="space-y-6">
                    {rows.map((pair, idx) => (
                      <div key={idx} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <OptionCard item={pair[0]} onPick={pickType} />
                          <OptionCard item={pair[1]} onPick={pickType} />
                        </div>
                        {idx !== rows.length - 1 ? <DividerRow /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  {picked ? `Selected: ${picked}` : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Step: Form mock (scrollable)
          <div className="max-h-[85vh] overflow-auto">
            <GetAllcategory />
            <GetAllAttribute />
            <GetAllProductTypeCategory />
            <GetAllAttributesSets />
            <ProductFormMock onBack={backToChoose} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
