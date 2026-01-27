"use client";
import React, { useEffect } from "react";
import {
  fetchProductType,
  fetchProductTypeCategories,
} from "@/hooks/slices/category/CategorySlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

const GetAllProductTypeCategory = () => {
  const {
    isProductTypeCategoryLoading,
    hasFetchedProductTypeCategory,
    isProductTypeLoading,
    hasFetchedProductType,
  } = useSelector((state: RootState) => state.category);

  const dispatch = useDispatch<AppDispatch>();

  // Fetch product types first
  useEffect(() => {
    if (!hasFetchedProductType && !isProductTypeLoading) {
      dispatch(fetchProductType());
    }
  }, [hasFetchedProductType, isProductTypeLoading, dispatch]);

  // Then fetch product type categories
  useEffect(() => {
    if (
      !hasFetchedProductTypeCategory &&
      !isProductTypeCategoryLoading &&
      hasFetchedProductType
    ) {
      dispatch(fetchProductTypeCategories());
    }
  }, [
    hasFetchedProductTypeCategory,
    isProductTypeCategoryLoading,
    hasFetchedProductType,
    dispatch,
  ]);

  return null;
};

export default GetAllProductTypeCategory;