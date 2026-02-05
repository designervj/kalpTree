import GetAllAttribute from "@/components/admin/attribute/attributeList/GetAllAttribute";
import GetAllAttributesSets from "@/components/admin/attributessets/listCategory/GetAllAttributesSets";
import GetAllcategory from "@/components/admin/category/listCategory/GetAllcategory";

import GetAllProductTypeCategory from "@/components/admin/product-type-category/listCategory/GetAllProductTypeCategory";
import GetAllProductType from "@/components/admin/product-type/listCategory/GetAllProductType";
import { CreateProduct } from "@/components/admin/product/createproduct/CreateProduct";

export default async function CreateProductPage(props: any) {
  return (
    <div className="mx-auto max-w-full px-6">
      <GetAllcategory />
      <GetAllAttribute />
      <CreateProduct />
      <GetAllProductTypeCategory />
      <GetAllAttributesSets />
      <GetAllProductType />
    </div>
  );
}
