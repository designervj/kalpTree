"use client";
import { fetchProducts } from "@/hooks/slices/product/ProductSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllProduct = ({ websiteId }: any) => {
  const { isProductLoading, hasFetched } = useSelector(
    (state: RootState) => state.product,
  );

  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && !isProductLoading && (currentBusiness || websiteId)) {
      let idtoPass =
        currentBusiness && currentBusiness._id
          ? currentBusiness._id
          : websiteId;
      dispatch(fetchProducts({ websiteId: String(idtoPass) }));
    }
  }, [hasFetched, isProductLoading, currentBusiness, dispatch, websiteId]);
  return null;
};

export default GetAllProduct;
