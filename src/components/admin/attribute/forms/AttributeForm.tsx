"use client";

import React, { useState } from "react";
import { MaterialAttributes } from "../types/attributeModel";
import { MaterialCategory } from "../../category/types/CategoryModel";
import { X, ChevronDown } from "lucide-react";

type AttributeFormProps = {
  attribute: MaterialAttributes;
  setAttribute: React.Dispatch<React.SetStateAction<MaterialAttributes>>;
  fieldErrors: Record<string, string>;
  filterCategory: MaterialCategory[];
};

export default function AttributeForm({
  attribute,
  setAttribute,
  fieldErrors,
  filterCategory,
}: AttributeFormProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = attribute.category_id
      ? Array.isArray(attribute.category_id)
        ? attribute.category_id
        : [attribute.category_id]
      : [];

    const isSelected = currentCategories.includes(categoryId);

    const updatedCategories = isSelected
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    if (attribute.category == null || Array.isArray(attribute.category_id))
      setAttribute({
        ...attribute,
        category_id: updatedCategories.length > 0 ? updatedCategories : null,
      });
  };

  const removeCategory = (categoryId: string) => {
    const currentCategories = Array.isArray(attribute.category_id)
      ? attribute.category_id
      : attribute.category_id
        ? [attribute.category_id]
        : [];

    const updatedCategories = currentCategories.filter(
      (id) => id !== categoryId
    );

    setAttribute({
      ...attribute,
      category_id: updatedCategories.length > 0 ? updatedCategories : null,
    });
  };

  const selectedCategories = attribute.category_id
    ? Array.isArray(attribute.category_id)
      ? attribute.category_id
      : [attribute.category_id]
    : [];

  const filteredCategories = filterCategory.filter(
    (cat) =>
      cat &&
      cat.name &&
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSelectedCategoryNames = () => {
    return filterCategory
      .filter((cat) => selectedCategories.includes(String(cat._id || cat.id)))
      .map((cat) => cat.name);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Name
        </label>
        <input
          value={attribute.name || ""}
          onChange={(e) => setAttribute({ ...attribute, name: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Enter attribute name"
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
            <span className="text-red-500">⚠</span> {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Categories
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-left flex items-center justify-between"
          >
            <span className="text-gray-700">
              {selectedCategories.length > 0
                ? `${selectedCategories.length} selected`
                : "Select categories"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="max-h-60 overflow-y-auto">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => {
                    const categoryId = String(cat._id || cat.id);
                    const isChecked = selectedCategories.includes(categoryId);

                    return (
                      <label
                        key={categoryId}
                        className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryToggle(categoryId)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 font-medium">
                          {cat.name}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No categories found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedCategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {getSelectedCategoryNames().map((name, index) => (
              <span
                key={String(selectedCategories[index])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {name}
                <button
                  type="button"
                  onClick={() =>
                    removeCategory(String(selectedCategories[index]))
                  }
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Unit
        </label>
        <input
          value={attribute.unit || ""}
          onChange={(e) =>
            setAttribute({
              ...attribute,
              unit: e.target.value,
            })
          }
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g., kg, cm, pcs"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Possible Values
          <span className="text-gray-500 font-normal text-xs ml-2">
            (comma separated)
          </span>
        </label>
        <input
          value={(attribute.possible_values || []).join(",")}
          onChange={(e) =>
            setAttribute({
              ...attribute,
              possible_values: e.target.value
                ? e.target.value.split(",").map((v) => v.trim())
                : [],
            })
          }
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g., Red, Blue, Green"
        />
      </div>
    </div>
  );
}
