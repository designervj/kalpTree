import Link from "next/link";
import { notFound } from "next/navigation";

export default function EntityDetailPage(props: any) {
  const { entity, id } = props.params as { entity: string; id: string };
  // TODO: Replace with a server-side fetch per entity (e.g. categoryService.getById)
  // const mockDb: Record<string, Record<string, { id: string; name: string; description?: string }>> = {
  //   category: {
  //     "1": { id: "1", name: "Marketing", description: "Marketing category" },
  //     "2": { id: "2", name: "Development", description: "Development category" },
  //   },
  //   brand: {
  //     a: { id: "a", name: "Acme", description: "Acme brand" },
  //     b: { id: "b", name: "Globex", description: "Globex brand" },
  //   },
  // };

  // const entityStore = mockDb[entity];
  // const item = entityStore ? entityStore[id] : undefined;

  // if (!item) return notFound();

  return (
    <div className="mx-auto max-w-4xl">
      {/* <h1 className="text-2xl font-semibold mb-2">{item.name}</h1>
      <p className="text-sm text-muted-foreground">{item.description}</p> */}

      <div className="mt-6">
        <Link href={`/admin/${entity}`} className="text-sm underline">
          ← Back to {entity} 

    
        </Link>
      </div>
    </div>
  );
}
