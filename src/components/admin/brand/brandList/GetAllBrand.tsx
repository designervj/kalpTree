"use client";
import { fetchBrands } from "@/hooks/slices/brand/BrandSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllBrand = () => {
  const { isBrandLoading, hasFetched } = useSelector(
    (state: RootState) => state.brand,
  );
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      !hasFetched &&
      !isBrandLoading &&
      currentBusiness &&
      currentBusiness._id
    ) {
      dispatch(fetchBrands({ websiteId: String(currentBusiness._id) }));
    }
  }, [hasFetched, isBrandLoading, currentBusiness, dispatch]);
  return null;
};

export default GetAllBrand;
