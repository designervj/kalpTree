import { getCollection } from "@/app/api/tenants/[id]/route";
import { IBusiness } from "@/models/business";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const param = await params;
    const id = param.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Id" },
        { status: 400 },
      );
    }

    const {
      branding,
      businessdetails,
      features,
      plan,
      settings,
      status,
      subscriptionStatus,
    } = await req.json();

    const businessColl = await getCollection("tenants");

    const result = await businessColl.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          branding,
          businessdetails,
          features,
          plan,
          settings,
          status,
          subscriptionStatus,
          updatedAt: new Date(),
        },
      },
    );

    if (!result.acknowledged) {
      return NextResponse.json(
        { success: false, message: "Business not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Business updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Not Updated" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const param = await params;
  let id = param.id;

  let business: IBusiness;
  try {
    const tenantcoll = await getCollection("tenants");
    const tenantid = new ObjectId(id);

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

    const rawBusiness = tenants[0];

    if (!rawBusiness) {
      return NextResponse.json({
        message: "No Business Found",
        success: false,
      });
    }

    // Serialize ObjectId fields to strings for client component
    business = JSON.parse(
      JSON.stringify(rawBusiness, (key, value) => {
        if (
          value &&
          typeof value === "object" &&
          value._bsontype === "ObjectId"
        ) {
          return value.toString();
        }
        return value;
      }),
    ) as IBusiness;

    return NextResponse.json({
      data: business as IBusiness,
      message: "Found Business",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching business data:", error);
    return NextResponse.json({
      message: error,
      success: false,
    });
  }
}
