"use client";
import { fetchProducts } from "@/hooks/slices/product/ProductSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllProduct = () => {
  const { isProductLoading, hasFetched } = useSelector(
    (state: RootState) => state.product,
  );

  const { currentWebsite } = useSelector((state: RootState) => state.websites);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      !hasFetched &&
      !isProductLoading &&
      currentWebsite &&
      currentWebsite._id
    ) {
      dispatch(fetchProducts({ websiteId: String(currentWebsite._id) }));
    }
  }, [hasFetched, isProductLoading, currentWebsite, dispatch]);
  return null;
};

export default GetAllProduct;
