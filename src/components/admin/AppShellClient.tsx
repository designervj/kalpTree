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
import { ObjectId } from "mongodb";

type AppShellClientProps = {
  children: React.ReactNode;
};

export function AppShellClient({ children }: AppShellClientProps) {
  // const {
  //   agencies,
  //   business,
  //   websites,
  //   currentAgency,
  //   currentWebsite,
  //   currentbusiness,
  //   totalwebsites,
  //   totalbusiness,
  // } = useSelector((state: RootState) => state.dashboardDetails);

  const router = useRouter();

  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const query = useSearchParams();

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    dispatch(clearCategories());
    dispatch(clearProducts());
  };
  const handleWebsiteChange = (websiteId: string) => {
    //  dispatch(onWebSiteChange({ websiteId }));
  };

  const handleTenantChange = (tenantId: string | ObjectId) => {
    //  dispatch(onBusinessChange({ tenantId }));
  };

  const handleAgencyChange = (agencyId: string) => {
 //   dispatch(onAgencyChange({ agencyId }));
  };

  // useEffect(() => {
  //   // Only update URL if we don't already have the correct params
  //   const currentAgencyId = currentAgency?._id;
  //   const currentBusinessId = currentbusiness?._id;
  //   const currentWebsiteId =
  //     currentWebsite?.primaryDomain?.find((d: any) =>
  //       d.includes("kalptree.xyz")
  //     ) ?? null;

  //   let href = "/admin/websites";

  //   if (currentWebsiteId) {
  //     href += `/${currentWebsiteId}`;
  //   }

  //   if (currentBusinessId) {
  //     href += `?businessid=${currentBusinessId}`;
  //   }

  //   if (currentAgencyId) {
  //     href += `&agencyid=${currentAgencyId}`;
  //   }

  //   if (currentWebsite || currentAgency || currentbusiness) {
  //     router.push(href);
  //   }
  // }, [currentAgency, currentWebsite, currentbusiness]);

  return (
    <AppShell
      onWebsiteChange={handleWebsiteChange}
      onTenantChange={handleTenantChange}
      onAgencyChage={handleAgencyChange}
    >
      {children}
    </AppShell>
  );
}
