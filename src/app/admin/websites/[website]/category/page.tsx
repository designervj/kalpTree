import Link from "next/link";
import EntityCreateModal from "@/components/admin/EntityCreateModal";
import {
  entityComponents,
  isValidEntityComponent,
} from "@/components/admin/EntityRegistry";
import CategoryHome from "@/components/admin/category/CategoryHome";

export default async function CategoryPage(props: any) {
  const params = await props.params;

  const { entity } = params as { entity: string };


  return (
    <div className="mx-auto max-w-full px-6">
      <CategoryHome />
      {/* <EntityModalForImport type={entity} /> */}
    </div>
  );
}
