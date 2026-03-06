"use client";

import React, { useEffect, useState } from "react";
import { Plus, HelpCircle, Calendar, Clock } from "lucide-react";
import { keyof } from "zod";
import { Button } from "@/components/ui/button";

type DiscountType = "percentage" | "fixed";

type AppliedTo = "all" | "specific";

export interface DiscountMain {
  discount_type: DiscountType;
  discount_code: string;
  discount_name: string;
  discount_price: number;
  applied_to: AppliedTo;
  categories?: string[];
}

export interface Discount {
  type: DiscountMain;
  discount_condition: {
    limit_uses: boolean;
    minimum_purchase: boolean;
    min_purchase_amount?: number;
    max_uses?: number;
  };
  active_dates: {
    startdate: string;
    enddate?: string;
  };
}

const DiscountPricing = () => {
  const [formData, setFormData] = useState<Discount>({
    type: {
      discount_type: "percentage",
      discount_code: "",
      discount_name: "",
      discount_price: 0,
      applied_to: "all",
    },
    discount_condition: {
      limit_uses: false,
      minimum_purchase: false,
    },
    active_dates: {
      startdate: "",
    },
  });

  const [hasEndDate, setHasEndDate] = useState(false);

  const setDiscountTypeHandler = (type: DiscountType) => {
    setFormData((prev) => ({
      ...prev,
      type: { ...prev.type, discount_type: type },
    }));
  };

  const setApplyToHandler = (value: AppliedTo) => {
    setFormData((prev) => ({
      ...prev,
      type: { ...prev.type, applied_to: value },
    }));
  };

  const onChangeHandler = <
    O extends keyof Discount,
    K extends keyof Discount[O],
  >(
    outerKey: O,
    key: K,
    value: any,
  ) => {
    if (key == "discount_price") {
      setFormData((prev) => ({
        ...prev,
        [outerKey]: {
          ...(prev[outerKey] as object),
          [key]: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [outerKey]: {
          ...(prev[outerKey] as object),
          [key]: value,
        },
      }));
    }
  };

  const handleSave = async () => {
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Add discount
          </h1>

          <Button onClick={handleSave}>Save Rule</Button>
        </div>

        {/* Discount Type Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Discount type
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setDiscountTypeHandler("percentage")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${formData.type.discount_type === "percentage"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 8l8 8M16 8l-8 8" />
                </svg>
                Percentage
              </button>
              <button
                onClick={() => setDiscountTypeHandler("fixed")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${formData.type.discount_type === "fixed"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
                Fixed amount
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                * Discount code
              </label>
              <input
                type="text"
                value={formData.type.discount_code}
                onChange={(e) =>
                  onChangeHandler("type", "discount_code", e.target.value)
                }
                placeholder="e.g., BLACKFRIDAY50"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Discount name
              </label>
              <input
                type="text"
                value={formData.type.discount_name}
                onChange={(e) =>
                  onChangeHandler("type", "discount_name", e.target.value)
                }
                placeholder="e.g., Black Friday Campaign"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your customers won't see the discount name.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              * Discount
            </label>
            <input
              type="number"
              defaultValue="1"
              value={formData.type.discount_price}
              onChange={(e) =>
                onChangeHandler("type", "discount_price", e.target.value)
              }
              className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {formData.type.discount_type === "percentage" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                * Apply to
              </label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="applyTo"
                    checked={formData.type.applied_to === "all"}
                    onChange={() => setApplyToHandler("all")}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-900">
                    All products
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="applyTo"
                    checked={formData.type.applied_to === "specific"}
                    onChange={() => setApplyToHandler("specific")}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-900">
                    Specific categories
                  </span>
                </label>
              </div>

              {formData.type.applied_to === "specific" && (
                <div className="mt-4 pl-7">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Select categories
                  </label>
                  <button className="flex items-center gap-2 text-purple-600 text-sm font-medium hover:text-purple-700">
                    <Plus className="w-4 h-4" />
                    Add category
                  </button>
                  <p className="text-xs text-red-500 mt-2">
                    At least 1 category is required
                  </p>
                </div>
              )}
            </div>
          )}

          {formData.type.discount_type === "fixed" &&
            formData.type.applied_to === "all" && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <HelpCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Discount will be applicable to all products and services.
                </p>
              </div>
            )}
        </div>

        {/* Discount Conditions Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Discount conditions
          </h2>

          <div className="space-y-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.discount_condition.limit_uses}
                onChange={(e) =>
                  onChangeHandler(
                    "discount_condition",
                    "limit_uses",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <span className="ml-3 text-sm text-gray-900">
                Limit the total number of uses for this discount
              </span>
            </label>

            {formData.discount_condition.limit_uses && (
              <div className="pl-8">
                <input
                  type="number"
                  defaultValue="0"
                  value={formData.discount_condition.max_uses}
                  onChange={(e) =>
                    onChangeHandler(
                      "discount_condition",
                      "max_uses",
                      e.target.value,
                    )
                  }
                  className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.discount_condition.minimum_purchase}
                onChange={(e) =>
                  onChangeHandler(
                    "discount_condition",
                    "minimum_purchase",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <div className="ml-3 flex items-center gap-1">
                <span className="text-sm text-gray-900">
                  Set minimum purchase amount for entire cart ($)
                </span>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
            </label>

            {formData.discount_condition.minimum_purchase && (
              <div className="pl-8">
                <input
                  type="number"
                  defaultValue="50.00"
                  step="0.01"
                  value={formData.discount_condition.min_purchase_amount}
                  onChange={(e) =>
                    onChangeHandler(
                      "discount_condition",
                      "min_purchase_amount",
                      e.target.value,
                    )
                  }
                  className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Active Dates Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Active dates
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.active_dates.startdate}
                  onChange={(e) =>
                    onChangeHandler("active_dates", "startdate", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white">
                  <option>00:00</option>
                  <option>01:00</option>
                  <option>02:00</option>
                  <option>03:00</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div> */}
          </div>

          <label className="flex items-start cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={hasEndDate}
              onChange={(e) => setHasEndDate(e.target.checked)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
            />
            <span className="ml-3 text-sm text-gray-900">Set end date</span>
          </label>

          {hasEndDate && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  End date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.active_dates.enddate}
                    onChange={(e) =>
                      onChangeHandler("active_dates", "enddate", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  End time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white">
                    <option>10:00</option>
                    <option>11:00</option>
                    <option>12:00</option>
                    <option>13:00</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div> */}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
          </svg>
          <a href="#" className="text-gray-700 hover:text-gray-900 underline">
            Rate discount creation experience.
          </a>
          <span>Help us improve.</span>
        </div>
      </div>
    </div>
  );
};

export default DiscountPricing;
