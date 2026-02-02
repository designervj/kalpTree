import { X } from "lucide-react";
import React from "react";
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
                  onClick={() => selectAttribute(option.id, attr._id)}
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
                          (valueSearchTerm[option.id] || "").toLowerCase(),
                        ) && !option.values.includes(val),
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
                        (valueSearchTerm[option.id] || "").toLowerCase(),
                      ) && !option.values.includes(val),
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
            {option &&
              option.values &&
              option.values.map((val, idx) => (
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

import { Plus, GripVertical, Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ProductOption {
  id: number;
  title: string;
  values: string[];
  useForVariants: boolean;
  unit?: string;
  attributeId?: string;
}

interface ProductOptionsProps {
  productOptions: ProductOption[];
  setProductOptions: React.Dispatch<React.SetStateAction<ProductOption[]>>;
  attributes: MaterialAttributes[];
}

interface AddOptionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (option: ProductOption) => void;
  attributes: MaterialAttributes[];
  editingOption?: ProductOption | null;
}

function AddOptionModal({
  open,
  onClose,
  onSave,
  attributes,
  editingOption,
}: AddOptionModalProps) {
  const [selectedAttribute, setSelectedAttribute] =
    useState<MaterialAttributes | null>(null);
  const [optionName, setOptionName] = useState("");
  const [selections, setSelections] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (editingOption) {
      setOptionName(editingOption.title);
      setSelections(editingOption.values);
      const attr = attributes.find((a) => a._id === editingOption.attributeId);
      if (attr) setSelectedAttribute(attr);
    } else {
      setOptionName("");
      setSelections([]);
      setSelectedAttribute(null);
    }
  }, [editingOption, open, attributes]);

  const handleAttributeSelect = (attr: MaterialAttributes) => {
    setSelectedAttribute(attr);
    setOptionName(attr.name);
    setSelections([]);
  };

  const toggleSelection = (value: string) => {
    setSelections((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const addNewValue = () => {
    const newValue = prompt("Enter new value:");
    if (newValue && newValue.trim() && !selections.includes(newValue.trim())) {
      setSelections((prev) => [...prev, newValue.trim()]);
    }
  };

  const removeSelection = (value: string) => {
    setSelections((prev) => prev.filter((v) => v !== value));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSelections = [...selections];
    const draggedItem = newSelections[draggedIndex];
    newSelections.splice(draggedIndex, 1);
    newSelections.splice(index, 0, draggedItem);

    setSelections(newSelections);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    if (!optionName.trim() || selections.length === 0) {
      alert("Please provide option name and at least one selection");
      return;
    }

    const option: ProductOption = {
      id: editingOption?.id || Date.now(),
      title: optionName,
      values: selections,
      useForVariants: editingOption?.useForVariants || false,
      unit: selectedAttribute?.unit,
      attributeId: selectedAttribute?._id,
    };

    onSave(option);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingOption ? "Edit option" : "Add option"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Attribute Selection Dropdown */}
          {!editingOption && (
            <div>
              <Label>Select Attribute</Label>
              <select
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  const attr = attributes.find((a) => a._id === e.target.value);
                  if (attr) handleAttributeSelect(attr);
                }}
                value={selectedAttribute?._id || ""}
              >
                <option value="">Choose an attribute...</option>
                {attributes.map((attr) => (
                  <option key={attr._id} value={attr._id}>
                    {attr.name}
                    {attr.unit ? ` (${attr.unit})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Option Name */}
          <div>
            <Label>* Option</Label>
            <Input
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              placeholder="e.g., Size, Color"
              className="mt-2"
              disabled={!!selectedAttribute}
            />
          </div>

          {/* Available Values (Checkboxes) */}
          {selectedAttribute && selectedAttribute.possible_values && (
            <div>
              <Label>Available Values</Label>
              <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                {selectedAttribute.possible_values.map((value, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 py-1 hover:bg-gray-50 px-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selections.includes(value)}
                      onChange={() => toggleSelection(value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Selected Values with Drag to Reorder */}
          {selections.length > 0 && (
            <div>
              <Label>* Selections for this option</Label>
              <div className="mt-2 space-y-2">
                {selections.map((value, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-move"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <Input
                      value={value}
                      readOnly
                      className="flex-1 border-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelection(value)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addNewValue}
                className="mt-2 text-violet-600 hover:text-violet-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add new
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProductOptionsSection({
  productOptions,
  setProductOptions,
  attributes,
}: ProductOptionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ProductOption | null>(
    null,
  );

  const handleAddOption = () => {
    setEditingOption(null);
    setIsModalOpen(true);
  };

  const handleEditOption = (option: ProductOption) => {
    setEditingOption(option);
    setIsModalOpen(true);
  };

  const handleSaveOption = (option: ProductOption) => {
    if (editingOption) {
      // Edit existing
      setProductOptions((prev) =>
        prev.map((opt) => (opt.id === option.id ? option : opt)),
      );
    } else {
      // Add new
      setProductOptions((prev) => [...prev, option]);
    }
  };

  const handleDeleteOption = (optionId: number) => {
    if (confirm("Are you sure you want to delete this option?")) {
      setProductOptions((prev) => prev.filter((opt) => opt.id !== optionId));
    }
  };

  const handleVariantToggle = (option: string | number, e: boolean) => {
    const found = productOptions.findIndex((d) => d.id == option);
    const cloned = structuredClone(productOptions);
    cloned[found].useForVariants = e;
    setProductOptions(cloned);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Options</h3>
          <p className="text-sm text-slate-600">
            Manage what options this product comes in, such as size, color, or
            weight. Unique variants will be created which you can then control
            individually.
          </p>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {productOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="font-medium text-sm text-gray-700">
                {option.title}
              </span>
              <div className="flex flex-wrap gap-1">
                {option.values.map((value, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Label htmlFor={`${option.id}Variant`}>Use for Variant</Label>

              <input
                type="checkbox"
                id={`${option.id}Variant`}
                checked={!!option.useForVariants}
                onChange={(e) => {
                  // update state here
                  handleVariantToggle(option.id, e.target.checked);
                }}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditOption(option)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteOption(option.id)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={handleAddOption}
        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add option
      </Button>

      {/* Add/Edit Option Modal */}
      <AddOptionModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOption(null);
        }}
        onSave={handleSaveOption}
        attributes={attributes}
        editingOption={editingOption}
      />
    </div>
  );
}
