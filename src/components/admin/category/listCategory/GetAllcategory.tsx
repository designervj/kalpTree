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
  const { currentWebsite } = useSelector((state: RootState) => state.websites);

  const resolvedWebsiteId = websiteId ?? currentWebsite?._id;

  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   if (
  //     !hasFetched &&
  //     !isCategoryLoading &&
  //     currentWebsite &&
  //     currentWebsite._id
  //   ) {
  //     dispatch(fetchCategories({ websiteId: resolvedWebsiteId }));
  //   }
  // }, [hasFetched, isCategoryLoading, user, dispatch, currentWebsite]);

  useEffect(() => {
    if (!resolvedWebsiteId) return;

    if (hasFetched || isCategoryLoading) return;

    dispatch(fetchCategories({ websiteId: resolvedWebsiteId }));
  }, [resolvedWebsiteId, hasFetched, isCategoryLoading, dispatch]);

  return null;
};

export default GetAllcategory;
