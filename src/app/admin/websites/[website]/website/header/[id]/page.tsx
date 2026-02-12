import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import HeaderEdit from "@/components/admin/header/HeaderEdit";


export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ website: string, id: string }>,
  searchParams: Promise<{ businessid: string, agencyid: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  console.log("resolvedParams", resolvedParams);
  const { website, id } = resolvedParams;
  const { businessid, agencyid } = resolvedSearchParams;
  if (!id) {
    return (
      <div>
        <h2>No Header ID provided</h2>
      </div>
    )
  }
  const db = await getDatabase();
  const allheader_coll = await db.collection("templates_header");
  const header = await allheader_coll.findOne({ _id: new ObjectId(id) });
  if (!header) {
    return (
      <div>
        <h2>Header not found</h2>
      </div>
    )
  }

  return (
    <div>
      <HeaderEdit
        header={JSON.parse(JSON.stringify(header))}

      />
    </div>
  );
}