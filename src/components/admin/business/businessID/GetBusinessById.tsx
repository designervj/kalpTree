"use client";
import { fetchBusinessById } from "@/hooks/slices/business/BusinessThunk";
import { AppDispatch, RootState } from "@/store/store";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetBusinessById = () => {
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const businessId = pathname.split("/")[3];
  const searchParams = pathname.split("/")[2];

  useEffect(() => {
    if (businessId && searchParams === "businesses" && !currentBusiness) {
      dispatch(fetchBusinessById(businessId));
    }
  }, [businessId, searchParams]);

  return null;
};

export default GetBusinessById;
