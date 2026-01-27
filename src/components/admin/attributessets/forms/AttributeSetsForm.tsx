"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ObjectId } from "mongodb";
import { toast } from "sonner";

type AttributeSetFormProps = {
  attributeSet: AttributeSet;
  setAttributeSet: React.Dispatch<React.SetStateAction<AttributeSet>>;
  fieldErrors: Record<string, string>;
};

export interface AttributeSet {
  _id?: string | ObjectId;
  id?: string;
  name: string;
  sort_order: number;
  categoryId: string;
  attributes: (String | ObjectId)[];
  websiteId?: string;
  tenantId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function AttributeSetForm({
  attributeSet,
  setAttributeSet,
  fieldErrors,
}: AttributeSetFormProps) {
  const { listProductTypeCategory } = useSelector(
    (state: RootState) => state.category,
  );
  const { listAttribute } = useSelector((state: RootState) => state.attribute);

  const finalAttributes = useMemo(() => {
    return listAttribute.filter((d) => {
      return d.category_id?.includes(attributeSet.categoryId);
    });
  }, [attributeSet.categoryId]);

  const handleAddAttribute = () => {
    setAttributeSet({
      ...attributeSet,
      attributes: [...attributeSet.attributes, ""],
    });
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = attributeSet.attributes.filter((_, i) => i !== index);
    setAttributeSet({ ...attributeSet, attributes: newAttributes });
  };

  const handleAttributeChange = (index: number, value: string) => {
    const newAttributes = [...attributeSet.attributes];
    if (newAttributes.includes(value)) {
      toast.error("Already Added Attribute");
      return;
    }
    newAttributes[index] = value;
    setAttributeSet({ ...attributeSet, attributes: newAttributes });
  };

  return (
    <div className="space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium">Attribute Set Name</label>
        <input
          type="text"
          value={attributeSet.name || ""}
          onChange={(e) =>
            setAttributeSet({ ...attributeSet, name: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="Enter attribute set name"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={attributeSet.categoryId || ""}
          onChange={(e) =>
            setAttributeSet({ ...attributeSet, categoryId: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Select a category</option>
          {listProductTypeCategory &&
            listProductTypeCategory.map((cat: any) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
        {fieldErrors.categoryId && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.categoryId}
          </div>
        )}
      </div>

      {/* Attributes Array */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Attributes</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAttribute}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Attribute
          </Button>
        </div>

        {attributeSet.attributes.length === 0 ? (
          <div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
            No attributes added yet. Click "Add Attribute" to start.
          </div>
        ) : (
          <div className="space-y-3 border rounded-md p-3">
            {attributeSet.attributes.map((attr, index) => (
              <div
                key={index}
                className="flex gap-2 items-start p-3 bg-muted/50 rounded-md"
              >
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="text-xs font-medium">Attribute</label>
                    <select
                      value={String(attr)}
                      onChange={(e) =>
                        handleAttributeChange(index, e.target.value)
                      }
                      className="block w-full rounded-md border p-2 text-sm"
                    >
                      <option value="">Select an attribute</option>
                      {finalAttributes &&
                        finalAttributes.map((attribute: any) => (
                          <option
                            key={attribute._id || attribute.id}
                            value={attribute._id || attribute.id}
                          >
                            {attribute.name || attribute.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveAttribute(index)}
                  className="mt-5"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {fieldErrors.attributes && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.attributes}
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-medium">Sort Order</label>
        <input
          type="number"
          value={attributeSet.sort_order ?? 0}
          onChange={(e) =>
            setAttributeSet({
              ...attributeSet,
              sort_order: Number(e.target.value),
            })
          }
          className="block w-full rounded-md border p-2 text-sm"
        />
      </div>
    </div>
  );
}
