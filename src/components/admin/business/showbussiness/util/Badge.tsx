"use client"
import React from 'react'
const Badge = ({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "neutral" | "purple" | "green" | "amber";
}) => {
  const cls =
    variant === "purple"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : variant === "green"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : variant === "amber"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}
export default Badge