import GetAllAttribute from "@/components/admin/attribute/attributeList/GetAllAttribute";
import GetAllcategory from "@/components/admin/category/listCategory/GetAllcategory";
import ListCategory from "@/components/admin/category/listCategory/ListCategory";
import { CreateProduct } from "@/components/admin/product/createproduct/CreateProduct";

export default async function CreateProductPage(props: any) {
  return (
    <div className="mx-auto max-w-full px-6">
      <GetAllcategory />
      <GetAllAttribute />
      <CreateProduct />
    </div>
  );
}
