import React, { useState } from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type BookingType =
  | "DATE_RANGE"
  | "FIXED_PACKAGE"
  | "DATE_TIME"
  | "HOURLY"
  | "TICKET";

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface BaseRules {
  advanceBookingDays?: number;
  maxAdvanceBookingDays?: number;
  cancellationHours?: number;
  blackoutDates?: string[];
}

export interface DateRangeRules extends BaseRules {
  minNights: number;
  maxNights: number;
  checkInTime: string;
  checkOutTime: string;
  allowSameDayCheckout?: boolean;
}

export interface FixedPackageRules extends BaseRules {
  duration: {
    days: number;
    nights: number;
  };
  fixedItinerary?: boolean;
}

export interface DateTimeRules extends BaseRules {
  duration: number; // in minutes
  slotInterval?: number; // in minutes
  allowedDays?: DayOfWeek[];
}

export interface HourlyRules extends BaseRules {
  minHours: number;
  maxHours: number;
  slotInterval?: number; // in minutes (e.g., 30, 60)
  allowedDays?: DayOfWeek[];
}

export interface TicketRules extends BaseRules {
  validityDays?: number;
  timeSlotRequired?: boolean;
  transferable?: boolean;
}

export interface Schedule {
  startDates?: string[];
  openingTime?: string;
  closingTime?: string;
  timeSlots?: string[];
  seasonalPricing?: boolean;
  availableDays?: DayOfWeek[];
}

export interface Capacity {
  minGuests: number;
  maxGuests: number;
  childrenAllowed: boolean;
  infantsAllowed?: boolean;
  maxChildren?: number;
  totalCapacity?: number;
}

export interface Policies {
  refundable: boolean;
  modifiable: boolean;
  depositRequired?: boolean;
  depositPercentage?: number;
  fullPaymentDays?: number;
  gracePeriodMinutes?: number;
}

export interface PricingRules {
  basePrice?: number;
  currency?: string;
  pricePerPerson?: boolean;
  childDiscount?: number;
  weekendSurcharge?: number;
}

export type BookingRules =
  | DateRangeRules
  | FixedPackageRules
  | DateTimeRules
  | HourlyRules
  | TicketRules;

export interface BookingConfig<T extends BookingType = BookingType> {
  bookingType: T;
  rules: T extends "DATE_RANGE"
    ? DateRangeRules
    : T extends "FIXED_PACKAGE"
      ? FixedPackageRules
      : T extends "DATE_TIME"
        ? DateTimeRules
        : T extends "HOURLY"
          ? HourlyRules
          : T extends "TICKET"
            ? TicketRules
            : BookingRules;
  schedule: Schedule;
  capacity: Capacity;
  policies: Policies;
  pricing?: PricingRules;
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_CONFIGS: Record<BookingType, BookingConfig> = {
  DATE_RANGE: {
    bookingType: "DATE_RANGE",
    rules: {
      minNights: 1,
      maxNights: 30,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      allowSameDayCheckout: false,
      advanceBookingDays: 1,
      maxAdvanceBookingDays: 365,
      cancellationHours: 24,
    },
    schedule: {
      availableDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    },
    capacity: {
      minGuests: 1,
      maxGuests: 4,
      childrenAllowed: true,
      maxChildren: 2,
    },
    policies: {
      refundable: true,
      modifiable: true,
      depositRequired: true,
      depositPercentage: 20,
      fullPaymentDays: 7,
    },
  },
  FIXED_PACKAGE: {
    bookingType: "FIXED_PACKAGE",
    rules: {
      duration: { days: 5, nights: 4 },
      fixedItinerary: true,
      advanceBookingDays: 7,
      cancellationHours: 72,
    },
    schedule: {
      startDates: [],
      seasonalPricing: true,
    },
    capacity: {
      minGuests: 2,
      maxGuests: 10,
      childrenAllowed: true,
    },
    policies: {
      refundable: false,
      modifiable: true,
      depositRequired: true,
      depositPercentage: 50,
    },
  },
  DATE_TIME: {
    bookingType: "DATE_TIME",
    rules: {
      duration: 120,
      slotInterval: 30,
      allowedDays: ["MON", "TUE", "WED", "THU", "FRI"],
      advanceBookingDays: 0,
      cancellationHours: 2,
    },
    schedule: {
      openingTime: "09:00",
      closingTime: "18:00",
      timeSlots: [],
    },
    capacity: {
      minGuests: 1,
      maxGuests: 8,
      childrenAllowed: true,
    },
    policies: {
      refundable: true,
      modifiable: true,
      gracePeriodMinutes: 15,
    },
  },
  HOURLY: {
    bookingType: "HOURLY",
    rules: {
      minHours: 1,
      maxHours: 8,
      slotInterval: 60,
      allowedDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      advanceBookingDays: 0,
    },
    schedule: {
      openingTime: "08:00",
      closingTime: "22:00",
    },
    capacity: {
      minGuests: 1,
      maxGuests: 20,
      childrenAllowed: true,
      totalCapacity: 50,
    },
    policies: {
      refundable: true,
      modifiable: true,
      depositRequired: false,
    },
  },
  TICKET: {
    bookingType: "TICKET",
    rules: {
      validityDays: 30,
      timeSlotRequired: false,
      transferable: true,
      advanceBookingDays: 0,
    },
    schedule: {
      timeSlots: [],
    },
    capacity: {
      minGuests: 1,
      maxGuests: 10,
      childrenAllowed: true,
      infantsAllowed: true,
    },
    policies: {
      refundable: false,
      modifiable: false,
    },
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function BookingConfiguration({
  bookingConfig,
  setBookingConfig,
}: {
  bookingConfig: BookingConfig;
  setBookingConfig: any;
}) {
  const handleBookingTypeChange = (type: BookingType) => {
    setBookingConfig(DEFAULT_CONFIGS[type]);
  };

  const updateRules = (key: string, value: any) => {
    setBookingConfig((prev: any) => ({
      ...prev,
      rules: { ...prev.rules, [key]: value },
    }));
  };

  const updateSchedule = <K extends keyof Schedule>(
    key: K,
    value: Schedule[K],
  ) => {
    setBookingConfig((prev: any) => ({
      ...prev,
      schedule: { ...prev.schedule, [key]: value },
    }));
  };

  const updateCapacity = <K extends keyof Capacity>(
    key: K,
    value: Capacity[K],
  ) => {
    setBookingConfig((prev: any) => ({
      ...prev,
      capacity: { ...prev.capacity, [key]: value },
    }));
  };

  const updatePolicies = <K extends keyof Policies>(
    key: K,
    value: Policies[K],
  ) => {
    setBookingConfig((prev: any) => ({
      ...prev,
      policies: { ...prev.policies, [key]: value },
    }));
  };

  return (
    <div className="max-w-4xl  space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Booking Configuration
        </h1>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Booking Type
          </label>
          <select
            value={bookingConfig.bookingType}
            onChange={(e) =>
              handleBookingTypeChange(e.target.value as BookingType)
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DATE_RANGE">🏨 Date Range (Hotel / Stay)</option>
            <option value="FIXED_PACKAGE">✈️ Travel Package</option>
            <option value="DATE_TIME">📅 Date & Time (Appointment)</option>
            <option value="HOURLY">⏰ Hourly Booking</option>
            <option value="TICKET">🎫 Ticket / Event</option>
          </select>
        </div>
      </div>

      {/* Type-specific Rules */}
      {bookingConfig.bookingType === "DATE_RANGE" && (
        <ConfigSection title="Stay Rules">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Minimum Nights"
              type="number"
              value={(bookingConfig.rules as DateRangeRules).minNights}
              onChange={(v) => updateRules("minNights", +v)}
            />
            <InputField
              label="Maximum Nights"
              type="number"
              value={(bookingConfig.rules as DateRangeRules).maxNights}
              onChange={(v) => updateRules("maxNights", +v)}
            />
            <InputField
              label="Check-in Time"
              type="time"
              value={(bookingConfig.rules as DateRangeRules).checkInTime}
              onChange={(v) => updateRules("checkInTime", v)}
            />
            <InputField
              label="Check-out Time"
              type="time"
              value={(bookingConfig.rules as DateRangeRules).checkOutTime}
              onChange={(v) => updateRules("checkOutTime", v)}
            />
          </div>
          <CheckboxField
            label="Allow Same-Day Checkout"
            checked={
              (bookingConfig.rules as DateRangeRules).allowSameDayCheckout ||
              false
            }
            onChange={(v) => updateRules("allowSameDayCheckout", v)}
          />
        </ConfigSection>
      )}

      {bookingConfig.bookingType === "FIXED_PACKAGE" && (
        <ConfigSection title="Package Details">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Days"
              type="number"
              value={(bookingConfig.rules as FixedPackageRules).duration.days}
              onChange={(v) =>
                updateRules("duration", {
                  ...(bookingConfig.rules as FixedPackageRules).duration,
                  days: +v,
                })
              }
            />
            <InputField
              label="Nights"
              type="number"
              value={(bookingConfig.rules as FixedPackageRules).duration.nights}
              onChange={(v) =>
                updateRules("duration", {
                  ...(bookingConfig.rules as FixedPackageRules).duration,
                  nights: +v,
                })
              }
            />
          </div>
          <CheckboxField
            label="Fixed Itinerary"
            checked={
              (bookingConfig.rules as FixedPackageRules).fixedItinerary || false
            }
            onChange={(v) => updateRules("fixedItinerary", v)}
          />
          <TextAreaField
            label="Start Dates (comma-separated: YYYY-MM-DD)"
            value={(bookingConfig.schedule.startDates || []).join(", ")}
            onChange={(v) =>
              updateSchedule(
                "startDates",
                v.split(",").map((d) => d.trim()),
              )
            }
            placeholder="2024-06-01, 2024-07-01, 2024-08-01"
          />
        </ConfigSection>
      )}

      {bookingConfig.bookingType === "DATE_TIME" && (
        <ConfigSection title="Appointment Settings">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Duration (minutes)"
              type="number"
              value={(bookingConfig.rules as DateTimeRules).duration}
              onChange={(v) => updateRules("duration", +v)}
            />
            <InputField
              label="Slot Interval (minutes)"
              type="number"
              value={(bookingConfig.rules as DateTimeRules).slotInterval || 30}
              onChange={(v) => updateRules("slotInterval", +v)}
            />
            <InputField
              label="Opening Time"
              type="time"
              value={bookingConfig.schedule.openingTime || "09:00"}
              onChange={(v) => updateSchedule("openingTime", v)}
            />
            <InputField
              label="Closing Time"
              type="time"
              value={bookingConfig.schedule.closingTime || "18:00"}
              onChange={(v) => updateSchedule("closingTime", v)}
            />
          </div>
        </ConfigSection>
      )}

      {bookingConfig.bookingType === "HOURLY" && (
        <ConfigSection title="Hourly Booking Rules">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Minimum Hours"
              type="number"
              value={(bookingConfig.rules as HourlyRules).minHours}
              onChange={(v) => updateRules("minHours", +v)}
            />
            <InputField
              label="Maximum Hours"
              type="number"
              value={(bookingConfig.rules as HourlyRules).maxHours}
              onChange={(v) => updateRules("maxHours", +v)}
            />
            <InputField
              label="Opening Time"
              type="time"
              value={bookingConfig.schedule.openingTime || "08:00"}
              onChange={(v) => updateSchedule("openingTime", v)}
            />
            <InputField
              label="Closing Time"
              type="time"
              value={bookingConfig.schedule.closingTime || "22:00"}
              onChange={(v) => updateSchedule("closingTime", v)}
            />
          </div>
        </ConfigSection>
      )}

      {bookingConfig.bookingType === "TICKET" && (
        <ConfigSection title="Ticket Configuration">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Validity (days)"
              type="number"
              value={(bookingConfig.rules as TicketRules).validityDays || 30}
              onChange={(v) => updateRules("validityDays", +v)}
            />
          </div>
          <CheckboxField
            label="Time Slot Required"
            checked={
              (bookingConfig.rules as TicketRules).timeSlotRequired || false
            }
            onChange={(v) => updateRules("timeSlotRequired", v)}
          />
          <CheckboxField
            label="Transferable"
            checked={(bookingConfig.rules as TicketRules).transferable || false}
            onChange={(v) => updateRules("transferable", v)}
          />
        </ConfigSection>
      )}

      {/* Capacity Configuration */}
      <ConfigSection title="Capacity">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Minimum Guests"
            type="number"
            value={bookingConfig.capacity.minGuests}
            onChange={(v) => updateCapacity("minGuests", +v)}
          />
          <InputField
            label="Maximum Guests"
            type="number"
            value={bookingConfig.capacity.maxGuests}
            onChange={(v) => updateCapacity("maxGuests", +v)}
          />
        </div>
        <CheckboxField
          label="Children Allowed"
          checked={bookingConfig.capacity.childrenAllowed}
          onChange={(v) => updateCapacity("childrenAllowed", v)}
        />
        {bookingConfig.capacity.childrenAllowed && (
          <InputField
            label="Maximum Children"
            type="number"
            value={bookingConfig.capacity.maxChildren || 0}
            onChange={(v) => updateCapacity("maxChildren", +v)}
          />
        )}
      </ConfigSection>

      {/* Policies */}
      <ConfigSection title="Booking Policies">
        <div className="space-y-3">
          <CheckboxField
            label="Refundable"
            checked={bookingConfig.policies.refundable}
            onChange={(v) => updatePolicies("refundable", v)}
          />
          <CheckboxField
            label="Modifiable"
            checked={bookingConfig.policies.modifiable}
            onChange={(v) => updatePolicies("modifiable", v)}
          />
          <CheckboxField
            label="Deposit Required"
            checked={bookingConfig.policies.depositRequired || false}
            onChange={(v) => updatePolicies("depositRequired", v)}
          />
          {bookingConfig.policies.depositRequired && (
            <InputField
              label="Deposit Percentage (%)"
              type="number"
              value={bookingConfig.policies.depositPercentage || 0}
              onChange={(v) => updatePolicies("depositPercentage", +v)}
            />
          )}
        </div>
      </ConfigSection>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const ConfigSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField: React.FC<{
  label: string;
  type: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ label, type, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const TextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const CheckboxField: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
    />
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </label>
);
