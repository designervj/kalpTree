"use client";
import { AppDispatch, RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import GetAllAttributesSets from "./listCategory/GetAllAttributesSets";
import GetAllcategory from "../category/listCategory/GetAllcategory";
import GetAllAttribute from "../attribute/attributeList/GetAllAttribute";
import ListAttributeSets from "./listCategory/ListAttributeSets";

const AttributeSetsHome = () => {
  const { listAttributeSets, isAttributeSetsLoading } = useSelector(
    (state: RootState) => state.attributeSets,
  );
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <GetAllcategory />
      <GetAllAttributesSets />
      <ListAttributeSets />
      <GetAllAttribute />
    </>
  );
};

export default AttributeSetsHome;
