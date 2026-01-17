import { X } from "lucide-react";
import React from "react";
import { Attributes, ProductOption } from "./CreateProduct";
import { MaterialAttributes } from "../../attribute/types/attributeModel";

interface ProductOptionsProps {
  option: ProductOption;
  removeValue: (optionId: number, idx: number) => void;
  removeOption: (id: number) => void;
  availVals: any[];
  showValueDropdown: number | null;
  addValue: (optionId: number, value: string) => void;
  setShowValueDropdown: any;
  setValueSearchTerm: React.Dispatch<
    React.SetStateAction<{
      [key: number]: string;
    }>
  >;
  showDropdown: any;
  valueSearchTerm: any;
  filteredAttrs: MaterialAttributes[];
  selectAttribute: any;
  updateOption: any;
  setSearchTerm: any;
  setShowDropdown: any;
}

export const ProductOptions = ({
  option,
  removeValue,
  removeOption,
  availVals,
  showValueDropdown,
  addValue,
  setShowValueDropdown,
  setValueSearchTerm,
  showDropdown,
  valueSearchTerm,
  filteredAttrs,
  selectAttribute,
  updateOption,
  setSearchTerm,
  setShowDropdown,
}: ProductOptionsProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="relative attribute-dropdown-container">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={option.title}
            onChange={(e) => {
              updateOption(option.id, "title", e.target.value);
              setSearchTerm(e.target.value);
            }}
            onFocus={() => setShowDropdown(option.id)}
            placeholder="Search attribute..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {option.unit && (
            <span className="text-xs text-gray-500 mt-1 block">
              Unit: {option.unit}
            </span>
          )}
          {showDropdown === option.id && filteredAttrs.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredAttrs.map((attr) => (
                <button
                  key={String(attr._id)}
                  type="button"
                  onClick={() => selectAttribute(option.id, attr.id)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  <div className="font-medium">{attr.name}</div>
                  {attr.unit && (
                    <div className="text-xs text-gray-500">
                      Unit: {attr.unit}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="value-dropdown-container">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Values
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search or add value..."
              value={valueSearchTerm[option.id] || ""}
              onChange={(e) =>
                setValueSearchTerm((prev) => ({
                  ...prev,
                  [option.id]: e.target.value,
                }))
              }
              onFocus={() => setShowValueDropdown(option.id)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addValue(option.id, valueSearchTerm[option.id] || "");
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {showValueDropdown === option.id && availVals.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {availVals
                  .filter(
                    (val) =>
                      val
                        .toLowerCase()
                        .includes(
                          (valueSearchTerm[option.id] || "").toLowerCase()
                        ) && !option.values.includes(val)
                  )
                  .map((val, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addValue(option.id, val)}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 text-sm flex items-center justify-between"
                    >
                      <span>{val}</span>
                      <span className="text-blue-600 text-xs">+ Add</span>
                    </button>
                  ))}
                {availVals.filter(
                  (val) =>
                    val
                      .toLowerCase()
                      .includes(
                        (valueSearchTerm[option.id] || "").toLowerCase()
                      ) && !option.values.includes(val)
                ).length === 0 &&
                  (valueSearchTerm[option.id] || "").trim() && (
                    <button
                      type="button"
                      onClick={() =>
                        addValue(option.id, valueSearchTerm[option.id] || "")
                      }
                      className="w-full px-3 py-2 text-left hover:bg-green-50 text-sm flex items-center justify-between"
                    >
                      <span>Create "{valueSearchTerm[option.id]}"</span>
                      <span className="text-green-600 text-xs">
                        + Create New
                      </span>
                    </button>
                  )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {option.values.map((val, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                {val}
                <button
                  onClick={() => removeValue(option.id, idx)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={option.useForVariants}
            onChange={(e) =>
              updateOption(option.id, "useForVariants", e.target.checked)
            }
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Use for variants</span>
        </label>
        <button
          onClick={() => removeOption(option.id)}
          className="text-red-500 text-sm font-medium hover:text-red-600"
        >
          × Remove
        </button>
      </div>
    </div>
  );
};
