import Link from "next/link";
import EntityCreateModal from "@/components/admin/EntityCreateModal";
import ProductHome from "@/components/admin/product/ProductHome";

export default async function ProductPage(props: any) {
  

  return (
    <div className="mx-auto max-w-full px-6">
      <div className="flex items-center justify-between mb-6">
        {/* <EntityCreateModal entity={"products"} /> */}
      
      </div>

      <ProductHome />
    </div>
  );
}
