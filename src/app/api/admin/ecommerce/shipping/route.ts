import { getCollection } from "@/app/api/tenants/[id]/route";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { name, locations, rates } = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const websiteId = searchParams.get("websiteId");
    const tenantId = searchParams.get("tenantId");

    if (!websiteId || !tenantId) {
      return NextResponse.json({
        message: "Please Provider Website and Tenant Info",
        success: false,
      });
    }

    const shippingColl = await getCollection("shippings");

    if (!name || locations.length <= 0) {
      return NextResponse.json({
        message: "Name or Location is missing",
        success: false,
      });
    }

    const shipping = await shippingColl.insertOne({
      name,
      locations,
      rates,
      tenantId: new ObjectId(tenantId),
      websiteId: new ObjectId(websiteId),
    });

    if (shipping.acknowledged) {
      return NextResponse.json({
        success: true,
        data: {
          rates,
          locations,
          name,
          _id: shipping.insertedId,
        },
        message: "Added Shipping Zone Successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "",
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
      success: false,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const websiteId = searchParams.get("websiteId");
    const tenantId = searchParams.get("tenantId");

    if (!websiteId || !tenantId) {
      return NextResponse.json({
        message: "Please Provider Website and Tenant Info",
        success: false,
      });
    }

    const shippingColl = await getCollection("shippings");

    const shipping = await shippingColl
      .find({
        websiteId: new ObjectId(websiteId),
        tenantId: new ObjectId(tenantId),
      })
      .project({
        rates: 1,
        locations: 1,
        name: 1,
        _id: 1,
      })
      .toArray();

    if (shipping.length >= 1) {
      return NextResponse.json({
        success: true,
        data: shipping,
        message: "Fetched Shipping Zone Successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No Zones Added",
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
      success: false,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { name, locations, rates } = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const websiteId = searchParams.get("websiteId");
    const tenantId = searchParams.get("tenantId");
    const idofdocument = searchParams.get("id");

    if (!websiteId || !tenantId || !idofdocument) {
      return NextResponse.json({
        message: "Please Provider Website and Tenant Info",
        success: false,
      });
    }

    const shippingColl = await getCollection("shippings");

    if (!name || locations.length <= 0) {
      return NextResponse.json({
        message: "Name or Location is missing",
        success: false,
      });
    }

    const shipping = await shippingColl.updateOne(
      {
        _id: new ObjectId(idofdocument),
      },
      {
        $set: {
          name: name,
          locations,
          rates,
        },
      },
    );

    if (shipping.acknowledged) {
      return NextResponse.json({
        success: true,
        data: {
          rates,
          locations,
          name,
          _id: idofdocument,
        },
        message: "Updated Shipping Zone Successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Updating Shipping Zone Failed",
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
      success: false,
    });
  }
}
