import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { success } from "zod";
import { getCollection } from "../../tenants/[id]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ host: string }> }
) {
  const { host } = await params; //

  const db = await getDatabase();
  const collection = db.collection("websites");

  const website = await collection.findOne({
    primaryDomain: { $in: [host] },
  });

  // console.log("website---->",website)
  if (website) {
    return Response.json({ item: String(website._id) });
  }

  return Response.json({ item: null });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ host: string }> }
) {
  const param = await params;
  const hostid = new ObjectId(param.host);

  const body = await req.json();
  try {
    if (!hostid) {
      return NextResponse.json({
        success: false,
        message: "No ID Found",
      });
    }

    const { name, primaryDomain, status, systemSubdomain, serviceType } = body;

    const websiteColl = await getCollection("websites");
    const updatedValue = await websiteColl.updateOne(
      {
        _id: hostid,
      },
      {
        $set: {
          name,
          primaryDomain,
          status,
          systemSubdomain,
          serviceType,
          updatedAt: new Date(),
        },
      }
    );

    if (updatedValue.acknowledged) {
      return NextResponse.json({
        success: true,
        message: "SuccessFull",
        data: body,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "UnSuccessFull",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error,
    });
  }
}
