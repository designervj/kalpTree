import { getDatabase } from "@/lib/db/mongodb";
import { Collection, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function getCollection<T extends Document = Document>(
  collectionName: string
): Promise<Collection<any>> {
  const db = await getDatabase();
  return db.collection<any>(collectionName);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const param = await params;
  const tenantid = new ObjectId(param.id);

  const tenantcoll = await getCollection("tenants");

  const tenants = await tenantcoll
    .aggregate([
      {
        $match: {
          _id: tenantid,
        },
      },
      {
        $lookup: {
          from: "websites",
          localField: "_id",
          foreignField: "tenantId",
          as: "websites",
        },
      },
    ])
    .toArray();

  return NextResponse.json({ item: tenants[0] });
}
