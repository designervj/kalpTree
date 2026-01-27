import React from "react";
import GetAllAttribute from "./attributeList/GetAllAttribute";
import AttributeTable from "./attributeList/AttributeTable";
import GetAllProductTypeCategory from "../product-type-category/listCategory/GetAllProductTypeCategory";

const AttributeHome = () => {
  return (
    <>
      <AttributeTable />
      <GetAllAttribute />
      <GetAllProductTypeCategory />
    </>
  );
};

export default AttributeHome;
