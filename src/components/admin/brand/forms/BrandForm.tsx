"use client";

import React, { useState } from "react";
import { MaterialBrandModel } from "../types/brandModel";
import UploadImage from "../../uploadImage/UploadImage";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type BrandFormProps = {
  brand: MaterialBrandModel;
  setBrand: React.Dispatch<React.SetStateAction<MaterialBrandModel>>;
  fieldErrors: Record<string, string>;
  handleLogoFile: (file?: File) => void;
};

export default function BrandForm({
  brand,
  setBrand,
  fieldErrors,
  handleLogoFile,
}: BrandFormProps) {
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
          value={brand.name || ""}
          onChange={(e) => setBrand({ ...brand, name: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">URL</label>
        <input
          value={brand.url || ""}
          onChange={(e) => setBrand({ ...brand, url: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.url && (
          <div className="text-sm text-destructive mt-1">{fieldErrors.url}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Logo</label>
        {/* <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleLogoFile(e.target.files ? e.target.files[0] : undefined)
          }
          className="mt-1 block w-full rounded-md border p-2"
        /> */}

        <UploadImage
          createdProjectId={`${brand.name}/logo` || null}
          jobImageUpload={CheckJobImageUpload}
          onUploadSuccess={(data) => {
            setImageLoading(false);
            setBrand({ ...brand, logo: data });
          }}
          onUploadError={() => setImageLoading(false)}
        />
        {brand.logo && (
          <div className="mt-2">
            <img
              src={brand.logo}
              alt="logo preview"
              className="h-16 object-contain"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={brand.description || ""}
          onChange={(e) => setBrand({ ...brand, description: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
        />
      </div>
    </>
  );
}
