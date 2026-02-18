"use client";

import { useState, useTransition, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AppShell, Website, User } from "./AppShell";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "@/store/store";

import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";

import { clearCategories } from "@/hooks/slices/category/CategorySlice";
import { clearProducts } from "@/hooks/slices/product/ProductSlice";
// import {
//   onAgencyChange,
//   onBusinessChange,
//   onParamsChange,
//   onWebSiteChange,
// } from "@/hooks/slices/dashboardSlice/dashBoardSlice";


type AppShellClientProps = {
  children: React.ReactNode;
};

export function AppShellClient({ children }: AppShellClientProps) {
  return <AppShell>{children}</AppShell>;
}
