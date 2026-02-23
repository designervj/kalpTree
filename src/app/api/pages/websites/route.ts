import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// GET: Get a page by id or slug (with websiteId)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const tenantId = searchParams.get("tenantId") || id;

  const db = await getDatabase();
  const collection = db.collection("pages");
  const filter: any = {};
  if (tenantId) {
    // websiteId is stored as string in the database, not ObjectId
    filter._id =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
  }
  const data = await collection.find(filter).sort({ name: 1 }).toArray();

  console.log(data)

  return NextResponse.json(data);
}

// POST: Create a new page
export async function POST(req: Request) {
  try {
    const db = await getDatabase();
    const collection = db.collection("pages");
    const body = await req.json();
    body.tenantId = new ObjectId(body.tenantId);
    // Optionally validate body here
    const now = new Date().toISOString();
    const newPage = {
      ...body,
      createdAt: now,
      updatedAt: now,
      publishedAt: body.status === "published" ? now : null,
    };
    const result = await collection.insertOne(newPage);
    return NextResponse.json(
      { ...newPage, _id: result.insertedId },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create page" },
      { status: 500 },
    );
  }
}

// PUT: Update a page by id
export async function PUT(req: Request) {
  try {
    const db = await getDatabase();
    const collection = db.collection("pages");
    const body = await req.json();

    if (!body._id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }
    let id;
    if (typeof body._id === "object" && body._id.$oid) {
      id = new ObjectId(body._id.$oid);
    } else {
      id = new ObjectId(String(body._id));
    }
    // Trim name if present
    if (body.name) body.name = body.name.trim();

    // Convert tenantId and websiteId to ObjectId if they exist
    if (body.tenantId) {
      body.tenantId = new ObjectId(body.tenantId);
    }
    if (body.websiteId) {
      body.websiteId = new ObjectId(body.websiteId);
    }

    const now = new Date().toISOString();
    const updateDoc = {
      ...body,
      updatedAt: now,
      publishedAt: body.status === "published" ? body.publishedAt || now : null,
    };
    delete updateDoc._id;

    if (updateDoc.isHomePage) {
      // update all other pages isHomePage to false
      await collection.updateMany(
        { websiteId: updateDoc.websiteId, _id: { $ne: updateDoc._id } },
        { $set: { isHomePage: false } },
      );
    }

    const updateResult = await collection.updateOne(
      { _id: id },
      { $set: updateDoc },
    );
    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    const updated = await collection.findOne({ _id: id });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update page" },
      { status: 500 },
    );
  }
}

// DELETE: Delete a page by id (expects ?id=...)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    console.log("deleet id", id);
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const db = await getDatabase();
    const collection = db.collection("pages");
    const result = await collection.deleteOne({
      _id: new ObjectId(String(id)),
    });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete page" },
      { status: 500 },
    );
  }
}
