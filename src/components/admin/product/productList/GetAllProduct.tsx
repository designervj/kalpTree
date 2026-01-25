"use client";
import { fetchProducts } from "@/hooks/slices/product/ProductSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllProduct = ({ websiteId }: any) => {
  const { isProductLoading, hasFetched } = useSelector(
    (state: RootState) => state.product,
  );

  const { currentWebsite } = useSelector((state: RootState) => state.websites);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && !isProductLoading && (currentWebsite || websiteId)) {
      let idtoPass =
        currentWebsite && currentWebsite._id ? currentWebsite._id : websiteId;
      dispatch(fetchProducts({ websiteId: String(idtoPass) }));
    }
  }, [hasFetched, isProductLoading, currentWebsite, dispatch, websiteId]);
  return null;
};

export default GetAllProduct;
