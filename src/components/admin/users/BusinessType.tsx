import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { GoArrowDown, GoArrowUp } from "react-icons/go";

type IndustryOption = {
  _id: string;
  name: string;
  categoryId?: string;
  attributes?: string[];
  desc?: string;
};

export default function BusinessTypeRadioList({
  formData,
  handleInputChange,
  businessType,
}: {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  businessType: any[];
}) {
  const MAX_VISIBLE = 6;
  const [showAll, setShowAll] = useState(false);

  // ✅ Use businessType prop directly (already fetched from parent)
  const industries: IndustryOption[] = useMemo(() => {
    return businessType
      .filter((d) => d.categoryId == formData.businessdetails.industry)
      .map((type) => ({
        _id: type._id,
        name: type.name,
        categoryId: type.categoryId,
        attributes: type.attributes,
        desc: type.categoryId
          ? `${type.attributes?.length || 0} attributes`
          : undefined,
      }));
  }, [formData.businessdetails.industry]);

  // ✅ Get selected business type ID from formData
  const selectedId = formData?.businessdetails?.businessType ?? "";

  const visibleIndustries = showAll
    ? industries
    : industries.slice(0, MAX_VISIBLE);
  const canToggle = industries.length > MAX_VISIBLE;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h6 className="text-sm font-semibold text-gray-900">Business Type</h6>
        {canToggle && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            {showAll
              ? "VIEW LESS"
              : `VIEW MORE (${industries.length - MAX_VISIBLE})`}
          </button>
        )}
      </div>

      {/* ✅ Bubble grid: 3 per row */}
      <div className="grid grid-cols-3 gap-3">
        {visibleIndustries.map((opt, idx) => {
          const checked = selectedId === opt._id;
          const id = `businessType_${idx}_${opt._id}`;

          return (
            <label
              key={opt._id}
              htmlFor={id}
              className={[
                "relative cursor-pointer select-none rounded-md border p-3 transition-all",
                "flex flex-col gap-1",
                checked
                  ? "cursor-pointer transition hover:bg-gray-50 border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                  : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50",
              ].join(" ")}
            >
              {/* ✅ Hidden radio input - saves _id as value */}
              <input
                id={id}
                type="radio"
                name="businessdetails.businessType"
                value={opt._id}
                checked={checked}
                onChange={handleInputChange}
                className="sr-only"
              />

              {/* Title and description */}
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{opt.name}</div>
              </div>

              {/* Selected badge */}
              {checked && (
                <span className="absolute right-2 top-2 rounded-full bg-white shadow px-2 py-0.5 text-[10px] font-semibold">
                  Selected
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Bottom View more/less button */}
      <div className="flex justify-center pt-2">
        {canToggle && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? (
              <span className="inline-flex items-center gap-2">
                <GoArrowUp className="h-4 w-4" />
                View less
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <GoArrowDown className="h-4 w-4" />
                {`View more (${industries.length - MAX_VISIBLE})`}
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
