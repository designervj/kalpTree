import Link from "next/link";
import EntityCreateModal from "@/components/admin/EntityCreateModal";
import {
  entityComponents,
  isValidEntityComponent,
} from "@/components/admin/EntityRegistry";
import EntityModalForImport from "./EntityModalForImport";

export default async function EntityIndexPage(props: any) {
  const params = await props.params;

  const { entity } = params as { entity: string };

  // Check if entity is valid
  // if (!isValidEntityComponent(entity)) {
  //   return (
  //     <div className="mx-auto max-w-full px-6">
  //       <div className="text-center py-12">
  //         <h1 className="text-2xl font-semibold text-red-600">
  //           Entity "{entity}" not found
  //         </h1>
  //         <p className="mt-2 text-gray-600">
  //           Please check the entity name or add it to the EntityRegistry.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // Dynamically get the component for this entity
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
