import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";


// GET: Get website by id
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tenantIdParam = searchParams.get("tenantId");
    const db = await getDatabase();
  const collection = db.collection("websites");

    // If tenantId is provided, filter by it; otherwise fetch all websites
    let websites;
    if (tenantIdParam!=="" && tenantIdParam!==null) {
        const tenantId = new ObjectId(tenantIdParam);
        websites = await collection.find({ tenantId: tenantId }).toArray();
    } else {
        websites = await collection.find({}).toArray();
    }

    return NextResponse.json({ item: websites });

}

// POST: Create a new website
export async function POST(req: Request) {
  const db = await getDatabase();
  const collection = db.collection("websites");
  const body = await req.json();
  // Add validation as needed
  const result = await collection.insertOne({
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const website = await collection.findOne({ _id: result.insertedId });
  return NextResponse.json({ item: website }, { status: 201 });
}

// PUT: Update website by id
export async function PUT(req: Request) {
  const db = await getDatabase();
  const collection = db.collection("websites");
  const body = await req.json();
  const { id, ...updateData } = body;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  const _id = new ObjectId(id);
  updateData.updatedAt = new Date();
  await collection.updateOne({ _id }, { $set: updateData });
  const website = await collection.findOne({ _id });
  return NextResponse.json({ item: website });
}

// DELETE: Delete website by id
export async function DELETE(req: Request) {
  const db = await getDatabase();
  const collection = db.collection("websites");
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  // Accept both ObjectId and string
  let _id;
  try {
    _id = typeof id === "string" ? new ObjectId(id) : id;
  } catch {
    return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
  }
  const result = await collection.deleteOne({ _id });
  if (result.deletedCount === 1) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ error: "Not found or already deleted" }, { status: 404 });
  }
}
