"use client";

import GetAllProductType from "./listCategory/GetAllProductType";
import ListProductType from "./listCategory/ListProductType";

const ProductTypeHome = () => {
  return (
    <>
      <GetAllProductType />
      <ListProductType />
    </>
  );
};

export default ProductTypeHome;
