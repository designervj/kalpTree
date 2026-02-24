"use client";
import React, { useEffect } from "react";
import { fetchCategories } from "@/hooks/slices/category/CategorySlice";
import { AppDispatch, RootState } from "@/store/store";

import { useDispatch, useSelector } from "react-redux";

const GetAllcategory = ({ websiteId }: { websiteId?: string }) => {
  const { isCategoryLoading, hasFetched } = useSelector(
    (state: RootState) => state.category,
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (!currentBusiness) return;

    if (hasFetched || isCategoryLoading) return;

    dispatch(fetchCategories({ tenantId: String(currentBusiness._id) }));
  }, [currentBusiness?._id, hasFetched, isCategoryLoading, dispatch]);

  return null;
};

export default GetAllcategory;
