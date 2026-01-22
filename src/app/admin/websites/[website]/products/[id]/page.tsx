import GetAllAttribute from "@/components/admin/attribute/attributeList/GetAllAttribute";
import GetAllBrand from "@/components/admin/brand/brandList/GetAllBrand";
import GetAllcategory from "@/components/admin/category/listCategory/GetAllcategory";
import ListCategory from "@/components/admin/category/listCategory/ListCategory";
import { CreateProduct } from "@/components/admin/product/createproduct/CreateProduct";
import GetAllProduct from "@/components/admin/product/productList/GetAllProduct";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const productId = param.id;

  return (
    <div className="mx-auto max-w-full px-6">
      <GetAllcategory />
      <GetAllProduct />
      <GetAllAttribute />
      <GetAllBrand />
      <CreateProduct productId={productId} />
    </div>
  );
}
