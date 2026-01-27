"use client";
import React, { useEffect } from "react";
import {
  fetchCategories,
  fetchProductType,
} from "@/hooks/slices/category/CategorySlice";
import { AppDispatch, RootState } from "@/store/store";

import { useDispatch, useSelector } from "react-redux";

const GetAllProductType = () => {
  const { isProductTypeLoading, hasFetchedProductType } = useSelector(
    (state: RootState) => state.category,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetchedProductType && !isProductTypeLoading) {
      dispatch(fetchProductType());
    }
  }, [hasFetchedProductType, isProductTypeLoading]);

  return null;
};

export default GetAllProductType;
