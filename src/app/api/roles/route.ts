import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const db = await getDatabase();
  const collection = db.collection("roles");
  const businessid = req.nextUrl.searchParams.get("businessid");
  if (!businessid) {
    throw new Error("Business ID is required");
  }
  const roles = await collection.find({
    $or: [
      { tenantId: businessid },
      { tenantId: new ObjectId(businessid) }
    ]
  }).toArray();
  return NextResponse.json({ items: roles });
}

export async function POST(req: NextRequest) {
  const db = await getDatabase();
  const collection = db.collection("roles");
  const body = await req.json();
  const roles = await collection.insertOne(body);
  //  get full object
  const fullRole = await collection.findOne({ _id: new ObjectId(roles.insertedId) });
  return NextResponse.json({ items: fullRole });
}
// update role  
export async function PUT(req: NextRequest) {
  const db = await getDatabase();
  const collection = db.collection("roles");
  const userCollection = db.collection("users");
  const body = await req.json();
  const { _id, ...updateData } = body;
  const existingRole = await collection.findOne({ _id: new ObjectId(_id) });
  if (!existingRole) {
    const result = await userCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { permissions: updateData.permissions, updatedAt: new Date() } }
    );
    return NextResponse.json({ items: result, updated: body, target: 'user' });
  }
  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData }
  );
  return NextResponse.json({ items: result, updated: body, target: 'role' });
}
