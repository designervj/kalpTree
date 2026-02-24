"use client";
import { fetchAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllAttribute = () => {
  const { isAttributeLoading, hasFetched } = useSelector(
    (state: RootState) => state.attribute,
  );
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      !hasFetched &&
      !isAttributeLoading &&
      currentBusiness &&
      currentBusiness._id
    ) {
      dispatch(fetchAttributes({ websiteId: String(currentBusiness._id) }));
    }
  }, [hasFetched, isAttributeLoading, currentBusiness, dispatch]);
  return null;
};

export default GetAllAttribute;
