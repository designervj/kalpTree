import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { permission } from "process";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const param = await params;
    const id = new ObjectId(param.id);
    console.log(id)
    if (!id) {
      return NextResponse.json({ success: false, message: "Fetched Role" });
    }

    const db = await getDatabase();
    const collection = db.collection("roles");

    const roles = await collection.findOne({
      _id: id,
    });

    return NextResponse.json({ success: true, items: roles });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const json = await req;
  const body = await json.json();
  const param = await params;
  const id = new ObjectId(param.id);

  const db = await getDatabase();
  const collection = db.collection("roles");

  const roles = await collection.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        permissions: body.permissions,
      },
    }
  );
  const role = body.code;

  const usercoll = db.collection("users");

  const finalchangestoall = await usercoll.updateMany(
    { role: role },
    {
      $set: {
        permissions: body.permissions,
      },
    }
  );

  console.log(finalchangestoall);

  return NextResponse.json({ items: roles });
}
