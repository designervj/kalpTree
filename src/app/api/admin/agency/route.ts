import { NextRequest, NextResponse } from "next/server";
import { getDatabase, toObjectId } from "@/lib/db/mongodb";

// GET: List agencies (with optional pagination)
export async function GET(req: NextRequest) {
  const db = await getDatabase();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  // Filters
  const role = searchParams.get("role");
  const userId = searchParams.get("userId");
  const query: any = {};

  console.log(" role--", role);
  console.log(" userId---", userId);
  // If superadmin, get all agencies (role=agency)
  if (role === "agency" && !userId) {
    query.type = "agency";
  }
  // If agency, get only the agency for this user
  if (role === "agency" && userId) {
    query.type = "agency";
    try {
      query._id = toObjectId(userId);
    } catch (e) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }
  }

  const [items, totalCount] = await Promise.all([
    db.collection("tenants").find(query).skip(skip).limit(limit).toArray(),
    db.collection("tenants").countDocuments(query),
  ]);

  return NextResponse.json({ item: items, totalCount });
}

// // POST: Create a new agency
// export async function POST(req: NextRequest) {
// 	const db = await getDatabase();
// 	const data = await req.json();
// 	const now = new Date();
// 	const agency: Agency = {
// 		name: data.name,
// 		email: data.email,
// 		status: data.status || "active",
// 		createdAt: now,
// 		updatedAt: now,
// 	};
// 	const result = await db.collection(COLLECTION).insertOne(agency);
// 	return NextResponse.json({ _id: result.insertedId, ...agency });
// }

// // PUT: Update an agency by id
// export async function PUT(req: NextRequest) {
// 	const db = await getDatabase();
// 	const data = await req.json();
// 	if (!data._id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
// 	const _id = toObjectId(data._id);
// 	const update: Partial<Agency> = { ...data, updatedAt: new Date() };
// 	delete update._id;
// 	const result = await db.collection(COLLECTION).findOneAndUpdate(
// 		{ _id },
// 		{ $set: update },
// 		{ returnDocument: "after" }
// 	);
// 	return NextResponse.json(result.value);
// }

// DELETE: Delete an agency by id (expects ?id=...)
export async function DELETE(req: NextRequest) {
  const db = await getDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const _id = toObjectId(id);
  const result = await db.collection("tenants").deleteOne({ _id });
  return NextResponse.json({ deleted: result.deletedCount === 1 });
}
