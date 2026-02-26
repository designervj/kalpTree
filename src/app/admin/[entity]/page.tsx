import Link from "next/link";
import EntityCreateModal from "@/components/admin/EntityCreateModal";
import {
  entityComponents,
  isValidEntityComponent,
} from "@/components/admin/EntityRegistry";
import EntityModalForImport from "../websites/[website]/[entity]/EntityModalForImport";

export default async function EntityIndexPage(props: any) {
  const params = await props.params;

  const { entity } = params as { entity: string };
   console.log(entity);
  const EntityComponent = entityComponents[entity];

  return (
    <div className="mx-auto max-w-full px-6">
      <div className="flex items-center justify-between mb-6">
        <EntityCreateModal entity={entity} />
      </div>

      <EntityComponent />
      <EntityModalForImport type={entity} />
    </div>
  );
}
