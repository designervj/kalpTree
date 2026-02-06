"use client";

import GetAllProductTypeCategory from "./listCategory/GetAllProductTypeCategory";
import ListProductTypeCategory from "./listCategory/ListProductTypeCategory";

const IndustryTypeHome = () => {
  return (
    <>
      <GetAllProductTypeCategory />
      <ListProductTypeCategory />
    </>
  );
};

export default IndustryTypeHome;
