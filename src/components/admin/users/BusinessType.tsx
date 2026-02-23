// import React, { useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { GoArrowDown, GoArrowUp } from "react-icons/go";

// type IndustryOption = {
//   _id: string;
//   name: string;
//   categoryId?: string;
//   attributes?: string[];
//   desc?: string;
// };

// export default function BusinessTypeRadioList({
//   formData,
//   handleInputChange,
//   businessType,
// }: {
//   formData: any;
//   handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   businessType: any[];
// }) {
//   const MAX_VISIBLE = 6;
//   const [showAll, setShowAll] = useState(false);

//   // ✅ Use businessType prop directly (already fetched from parent)
//   const industries: IndustryOption[] = useMemo(() => {
//     return businessType
//       .filter((d) => d.categoryId == formData.businessdetails.industry)
//       .map((type) => ({
//         _id: type._id,
//         name: type.name,
//         categoryId: type.categoryId,
//         attributes: type.attributes,
//         desc: type.categoryId
//           ? `${type.attributes?.length || 0} attributes`
//           : undefined,
//       }));
//   }, [formData.businessdetails.industry]);

//   // ✅ Get selected business type ID from formData
//   const selectedId = formData?.businessdetails?.businessType ?? "";

//   const visibleIndustries = showAll
//     ? industries
//     : industries.slice(0, MAX_VISIBLE);
//   const canToggle = industries.length > MAX_VISIBLE;

//   return (
//     <div className="space-y-3">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h6 className="text-sm font-semibold text-gray-900">Business Type</h6>
//         {canToggle && (
//           <button
//             type="button"
//             onClick={() => setShowAll((v) => !v)}
//             className="text-sm font-semibold text-blue-600 hover:text-blue-800"
//           >
//             {showAll
//               ? "VIEW LESS"
//               : `VIEW MORE (${industries.length - MAX_VISIBLE})`}
//           </button>
//         )}
//       </div>

//       {/* ✅ Bubble grid: 3 per row */}
//       <div className="grid grid-cols-3 gap-3">
//         {visibleIndustries.map((opt, idx) => {
//           const checked = selectedId === opt._id;
//           const id = `businessType_${idx}_${opt._id}`;

//           return (
//             <label
//               key={opt._id}
//               htmlFor={id}
//               className={[
//                 "relative cursor-pointer select-none rounded-md border p-3 transition-all",
//                 "flex flex-col gap-1",
//                 checked
//                   ? "cursor-pointer transition hover:bg-gray-50 border-blue-500 bg-blue-50 ring-1 ring-blue-200"
//                   : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50",
//               ].join(" ")}
//             >
//               {/* ✅ Hidden radio input - saves _id as value */}
//               <input
//                 id={id}
//                 type="radio"
//                 name="businessdetails.businessType"
//                 value={opt._id}
//                 checked={checked}
//                 onChange={handleInputChange}
//                 className="sr-only"
//               />

//               {/* Title and description */}
//               <div className="min-w-0">
//                 <div className="text-sm font-semibold truncate">{opt.name}</div>
//               </div>

//               {/* Selected badge */}
//               {checked && (
//                 <span className="absolute right-2 top-2 rounded-full bg-white shadow px-2 py-0.5 text-[10px] font-semibold">
//                   Selected
//                 </span>
//               )}
//             </label>
//           );
//         })}
//       </div>

//       {/* Bottom View more/less button */}
//       <div className="flex justify-center pt-2">
//         {canToggle && (
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => setShowAll((v) => !v)}
//           >
//             {showAll ? (
//               <span className="inline-flex items-center gap-2">
//                 <GoArrowUp className="h-4 w-4" />
//                 View less
//               </span>
//             ) : (
//               <span className="inline-flex items-center gap-2">
//                 <GoArrowDown className="h-4 w-4" />
//                 {`View more (${industries.length - MAX_VISIBLE})`}
//               </span>
//             )}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { IoClose } from "react-icons/io5";

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

  if (!formData.businessdetails.industry) {
    return (
      <div className="flex min-h-[220px] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center shadow-sm">
          <div className="mb-3 text-2xl">🏷️</div>
          <h3 className="text-lg font-semibold text-amber-900">
            Select Industry
          </h3>
          <p className="mt-2 text-sm text-amber-700">
            Please select an industry first to continue.
          </p>
        </div>
      </div>
    );
  }

  if (industries.length <= 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-dashed border-blue-300 bg-blue-50 p-6 text-center shadow-sm">
          <div className="mb-3 text-2xl">📂</div>
          <h3 className="text-lg font-semibold text-blue-900">
            No Business Type Found
          </h3>
          <p className="mt-2 text-sm text-blue-700">
            No business type options are available right now.
          </p>
        </div>
      </div>
    );
  }

  // ✅ selectedIds is now an array
  const selectedIds: string[] = formData?.businessdetails?.businessType ?? [];

  const toggleSelection = (id: string) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((s) => s !== id)
      : [...selectedIds, id];

    // Simulate a synthetic change event to keep handleInputChange compatible
    handleInputChange({
      target: {
        name: "businessdetails.businessType",
        value: updated,
      },
    } as any);
  };

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

      {/* ✅ Selected tags */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const opt = industries.find((o) => o._id === id);
            if (!opt) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {opt.name}
                <button
                  type="button"
                  onClick={() => toggleSelection(id)}
                  className="ml-1 rounded-full hover:bg-blue-200 p-0.5"
                  aria-label={`Remove ${opt.name}`}
                >
                  <IoClose className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* ✅ Grid */}
      <div className="grid grid-cols-3 gap-3">
        {visibleIndustries.length > 0 &&
          visibleIndustries.map((opt, idx) => {
            const checked = selectedIds.includes(opt._id);
            const id = `businessType_${idx}_${opt._id}`;

            return (
              <label
                key={opt._id}
                htmlFor={id}
                className={[
                  "relative cursor-pointer select-none rounded-md border p-3 transition-all",
                  "flex flex-col gap-1",
                  checked
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50",
                ].join(" ")}
              >
                {/* ✅ Checkbox instead of radio */}
                <input
                  id={id}
                  type="checkbox"
                  name="businessdetails.businessType"
                  value={opt._id}
                  checked={checked}
                  onChange={() => toggleSelection(opt._id)}
                  className="sr-only"
                />

                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {opt.name}
                  </div>
                </div>

                {/* ✅ Remove button on selected cards */}
                {checked && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSelection(opt._id);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-white shadow p-0.5 hover:bg-red-50"
                    aria-label={`Remove ${opt.name}`}
                  >
                    <IoClose className="h-3 w-3 text-red-500" />
                  </button>
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
