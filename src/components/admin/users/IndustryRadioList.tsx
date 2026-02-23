import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import {
  Landmark,
  Sofa,
  Home,
  Cpu,
  HardHat,
  Hammer,
  Factory,
  ShoppingBag,
  Megaphone,
  Briefcase,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

export type IndustryOption = {
  _id: string;
  value?: string;
  name: string;
  desc?: string;
  icon?: LucideIcon;
  slug?:string // ✅ icon support
};

export default function IndustryRadioList({
  formData,
  handleInputChange,
}: {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ✅ default icons mapping (if icon not provided)
  const ICON_MAP: Record<string, LucideIcon> = useMemo(
    () => ({
      Architecture: Landmark,
      "Interior Design": Sofa,
      "Real Estate": Home,
      Technology: Cpu,
      Construction: HardHat,
      "Home Improvement": Hammer,
      Manufacturing: Factory,
      Retail: ShoppingBag,
      Marketing: Megaphone,
      Consulting: Briefcase,
    }),
    [],
  );

  const [defaultIndustries, setDefaultIndustries] = useState<IndustryOption[]>(
    [],
  );

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch("/api/admin/producttypecategory");
        const res = await req.json();

        if (res) {
          setDefaultIndustries(res.items);
        } else {
          setDefaultIndustries([]);
        }
      } catch (error) {
        toast.error(String(error));
      }
    })();
  }, []);

  const MAX_VISIBLE = 6;
  const [showAll, setShowAll] = useState(false);

  const selected = formData?.businessdetails?.industry ?? "";
  const visibleIndustries = showAll
    ? defaultIndustries
    : defaultIndustries.slice(0, MAX_VISIBLE);
  const canToggle = defaultIndustries.length > MAX_VISIBLE;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h6 className="text-sm font-semibold text-gray-900">Industry</h6>
        {canToggle && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            {showAll
              ? "VIEW LESS"
              : `VIEW MORE (${defaultIndustries.length - MAX_VISIBLE})`}
          </button>
        )}
      </div>

      {/* ✅ Bubble grid: 3 per row */}
      <div className="grid grid-cols-3 gap-3">
        {visibleIndustries.map((opt, idx) => {
          const checked = selected === opt._id;
          const industryValue = opt.value || opt.name || opt._id;
          const id = `industry_${idx}_${industryValue.replace(/\s+/g, "_")}`;

          const Icon = ICON_MAP[opt.name] || Briefcase;

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
              {/* Hidden radio input (still works in form) */}
              <input
                id={id}
                type="radio"
                name="businessdetails.industry"
                value={opt._id}
                checked={checked}
                onChange={handleInputChange}
                className="sr-only"
              />

              {/* top row: icon + title */}
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    checked ? "bg-white/15" : "bg-blue-50",
                  ].join(" ")}
                >
                  <Icon
                    className={
                      checked
                        ? "h-5 w-5 text-blue-600"
                        : "h-5 w-5 text-blue-600"
                    }
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold ">
                    {opt.name}
                  </div>
                  {opt.desc ? (
                    <div
                      className={
                        checked
                          ? "text-[11px] text-gray-500"
                          : "text-[11px] text-gray-500"
                      }
                    >
                      {opt.desc}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* selected badge */}
              {checked && (
                <span className="absolute right-2 top-2 rounded-full bg-white shadow px-2 py-0.5 text-[10px] font-semibold">
                  Selected
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Bottom View more / less button */}
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
                {`View more (${defaultIndustries.length - MAX_VISIBLE})`}
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
