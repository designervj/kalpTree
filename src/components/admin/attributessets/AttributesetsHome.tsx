"use client";
import { AppDispatch, RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import GetAllAttributesSets from "./listCategory/GetAllAttributesSets";
import GetAllAttribute from "../attribute/attributeList/GetAllAttribute";
import ListAttributeSets from "./listCategory/ListAttributeSets";
import GetAllProductTypeCategory from "../product-type-category/listCategory/GetAllProductTypeCategory";

const AttributeSetsHome = () => {
  return (
    <>
      <GetAllProductTypeCategory />
      <GetAllAttributesSets />
      <ListAttributeSets />
      <GetAllAttribute />
    </>
  );
};

export default AttributeSetsHome;
