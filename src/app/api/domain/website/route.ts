import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// Helper function to serialize MongoDB documents for Redux
function serializeDocument(doc: any) {
  if (!doc) return doc;

  const serialized: any = {};
  for (const key in doc) {
    const value = doc[key];
    if (value instanceof ObjectId) {
      serialized[key] = value.toString();
    } else if (value instanceof Date) {
      serialized[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      serialized[key] = value.map((item) =>
        typeof item === "object" ? serializeDocument(item) : item,
      );
    } else if (value && typeof value === "object") {
      serialized[key] = serializeDocument(value);
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
}

// GET: Get website by id
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tenantIdParam = searchParams.get("tenantId");
  const websiteIdParam = searchParams.get("websiteId");
  const idParam = searchParams.get("id");
  const db = await getDatabase();
  const collection = db.collection("websites");

  // If tenantId is provided, filter by it; otherwise fetch all websites
  let websites;
  try {
    if (tenantIdParam && ObjectId.isValid(tenantIdParam)) {
      const tenantId = new ObjectId(tenantIdParam);
      websites = await collection.find({ tenantId: tenantId }).toArray();
    } else if (websiteIdParam && ObjectId.isValid(websiteIdParam)) {
      const websiteId = new ObjectId(websiteIdParam);
      websites = await collection.find({ _id: websiteId }).toArray();
    } else if (idParam && ObjectId.isValid(idParam)) {
      const id = new ObjectId(idParam);
      websites = await collection.find({ _id: id }).toArray();
    } else {
      // If a param was provided but was invalid, we might want to return 400 or empty
      if ((tenantIdParam || websiteIdParam || idParam) &&
        (tenantIdParam !== "" && websiteIdParam !== "" && idParam !== "")) {
        return NextResponse.json({ item: [] }); // Or return an error
      }
      websites = await collection.find({}).toArray();
    }
  } catch (error) {
    console.error("Error fetching websites:", error);
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  // Serialize the documents before returning
  const serializedWebsites = websites.map(serializeDocument);
  return NextResponse.json({ item: serializedWebsites });
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
  return NextResponse.json(
    { item: serializeDocument(website) },
    { status: 201 },
  );
}

// PUT: Update website by id
export async function PUT(req: Request) {
  const db = await getDatabase();
  const collection = db.collection("websites");
  const body = await req.json();
  const { _id: id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  const _id = new ObjectId(id);
  updateData.updatedAt = new Date();
  await collection.updateOne({ _id }, { $set: updateData });
  const website = await collection.findOne({ _id });
  return NextResponse.json({ item: serializeDocument(website) });
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
    return NextResponse.json(
      { error: "Not found or already deleted" },
      { status: 404 },
    );
  }
}
