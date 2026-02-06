import { getCollection } from "@/app/api/tenants/[id]/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");

    const body = await req.json();

    let finalAdded;

    switch (type) {
      case "attribute":
        const attributeColl = await getCollection("product_attributes");
        finalAdded = await attributeColl.insertMany(body);
        break;
      case "industry-type":
        const industryTypeColl = await getCollection("industry-type");
        finalAdded = await industryTypeColl.insertMany(body);
      case "product-type":
        const producttypeColl = await getCollection("product-types");
        finalAdded = await producttypeColl.insertMany(body);
    }

    if (finalAdded && finalAdded.acknowledged) {
      return NextResponse.json({
        message: "Added Successful",
        success: true,
      });
    } else {
      return NextResponse.json({
        message: "Added Unsuccessful",
        success: false,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Failed to Add",
      success: false,
    });
  }
}
