import { AppDispatch, RootState } from "@/store/store";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCategory } from "../../category/types/CategoryModel";
import { DialogHeader } from "@/components/ui/dialog";
import CategoryForm from "../../category/forms/CategoryForm";
import { Button } from "@/components/ui/button";
import { addCategory } from "@/hooks/slices/category/CategorySlice";

export function CategoryItem({
  category,
  level = 0,
  selected,
  onToggle,
  handleInputChange,
  formData,
}: any) {
  const [open, setOpen] = useState(true);
  const hasChildren = category.children?.length > 0;

  const handleMakePrimary = (id: string) => {
    const e = {
      target: {
        name: "categories",
        value: id,
      },
    };
    if (formData.categories == e.target.value) {
      return;
    } else if (selected.length > 0) {
      handleInputChange(e);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1 rounded-md hover:bg-muted"
        style={{ paddingLeft: `${level * 5}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="text-muted-foreground"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

        {!hasChildren && <span className="w-4" />}

        <input
          type="checkbox"
          checked={selected.includes(category._id)}
          onChange={() => onToggle(category._id)}
          className="accent-primary"
        />

        <span className="text-sm">
          {category.name}{" "}
          <button
            onClick={() => handleMakePrimary(category._id)}
            className={`text-[10px] ${formData.categories == category._id ? "text-green-500 font-bold" : "text-gray-500 font-bold"}`}
          >
            {formData.categories == category._id && selected.length > 0
              ? "Primary"
              : selected.includes(category._id)
                ? "Make Primary"
                : ""}
          </button>
        </span>
      </div>

      {open &&
        hasChildren &&
        category.children.map((child: any) => (
          <CategoryItem
            key={child._id}
            category={child}
            level={level + 1}
            selected={selected}
            onToggle={onToggle}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        ))}
    </div>
  );
}
