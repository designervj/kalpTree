"use client";

import GetAllProductTypeCategory from "./listCategory/GetAllProductTypeCategory";
import ListProductTypeCategory from "./listCategory/ListProductTypeCategory";

const ProductTypeCategoryHome = () => {
  return (
    <>
      <GetAllProductTypeCategory />
      <ListProductTypeCategory />
    </>
  );
};

export default ProductTypeCategoryHome;
