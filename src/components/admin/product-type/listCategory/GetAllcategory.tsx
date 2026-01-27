"use client"
import React, { useEffect } from "react";
import { fetchCategories } from "@/hooks/slices/category/CategorySlice";
import { AppDispatch, RootState } from "@/store/store";

import { useDispatch, useSelector } from "react-redux";

const GetAllcategory = () => {
  const { isCategoryLoading, hasFetched } = useSelector(
    (state: RootState) => state.category
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && 
      !isCategoryLoading &&
    currentWebsite &&
  currentWebsite._id) {
      dispatch(fetchCategories({websiteId:currentWebsite._id}));
    }
  }, [hasFetched, isCategoryLoading, user,dispatch,currentWebsite]);

  return null;
};

export default GetAllcategory;
