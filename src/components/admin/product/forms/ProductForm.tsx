"use client";

import React, { useState } from "react";
import { ProductModel } from "../type/ProductModel";
import { MaterialBrandModel } from "../../brand/types/brandModel";
import { MaterialCategory } from "../../category/types/CategoryModel";
import { MaterialSegmentModel } from "../../segment/types/SegmentModel";
import UploadImage from "../../uploadImage/UploadImage";
import { toast } from "sonner";

type ProductFormProps = {
  product: ProductModel;
  setProduct: React.Dispatch<React.SetStateAction<ProductModel>>;
  fieldErrors: Record<string, string>;
  filterCategory: MaterialCategory[];
  listBrand: MaterialBrandModel[];

};

export default function ProductForm({
  product,
  setProduct,
  fieldErrors,
  filterCategory,
  listBrand,

}: ProductFormProps) {

  const [imageLoading, setImageLoading] = useState(false);
  const CheckJobImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size must be less than 10MB");
      return false;
    }
    setImageLoading(true);
    return true;
  };
  return (
    <>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={product.name || ""}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={product.description || ""}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={String(product.product_category_id || "")}
          onChange={(e) =>
            setProduct({
              ...product,
              product_category_id: e.target.value || undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Select category</option>
          {filterCategory.map((cat) => (
            <option
              key={String(cat._id || cat.id)}
              value={String(cat._id || cat.id)}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Brand</label>
        <select
          value={String(product.brand_id || "")}
          onChange={(e) =>
            setProduct({
              ...product,
              brand_id: e.target.value || undefined,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Select brand</option>
          {listBrand.map((brand) => (
            <option
              key={String((brand as any)._id || brand.id)}
              value={String((brand as any)._id || brand.id)}
            >
              {brand.name}
            </option>
          ))}
        </select>
      </div>



      <div>
        <label className="block text-sm font-medium">Base Price</label>
        <input
          type="number"
          step="0.01"
          value={product.base_price ?? ""}
          onChange={(e) =>
            setProduct({
              ...product,
              base_price: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Photo URL</label>
        {/* <input
          type="text"
          value={product.photo || ""}
          onChange={(e) => setProduct({ ...product, photo: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="https://example.com/photo.jpg"
        /> */}
        <UploadImage
          createdProjectId={`${product.name}/logo` || null}
          jobImageUpload={CheckJobImageUpload}
          onUploadSuccess={(data) => {
            setImageLoading(false);
            setProduct({ ...product, photo: data })
          }}
          onUploadError={() => setImageLoading(false)}
        />
        {product.photo && (
          <div className="mt-2">
            <img
              src={product.photo}
              alt="product preview"
              className="h-20 w-20 object-cover rounded border"
            />
          </div>
        )}
      </div>

      {/* <div>
        <label className="block text-sm font-medium">AI Summary</label>
        <span className="text-gray-400 text-xs font-normal">Optional</span>
        <textarea
          value={product.ai_summary || ""}
          onChange={(e) =>
            setProduct({ ...product, ai_summary: e.target.value || null })
          }
          className="mt-1 block w-full rounded-md border p-2"
          rows={2}
          placeholder="AI-generated product summary"
        />
      </div> */}
    </>
  );
}
