import { getCollection } from "@/app/api/tenants/[id]/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");

    console.log(searchParams);

    const body = await req.json();

    let finalAdded;

    switch (type) {
      case "attribute":
        const attributeColl = await getCollection("product_attributes");
        const mapped = body.map((d: any) => {
          return {
            ...d,
            createdAt: new Date(d.createdAt),
            updatedAt: new Date(d.updatedAt),
          };
        });
        finalAdded = await attributeColl.insertMany(mapped);
        break;
      case "industry-type":
        const industryTypeColl = await getCollection("industry-type");
        finalAdded = await industryTypeColl.insertMany(body);
        break;
      case "product-type":
        const producttypeColl = await getCollection("product-types");
        finalAdded = await producttypeColl.insertMany(body);
        break;
      case "businesstype":
        const businessTypecoll = await getCollection("business_type");
        const attributesColl = await getCollection("product_attributes");
        const totalAttributes = await attributesColl.find().toArray();
        const mappedValue = body.map((d: any) => {
          const newMappped = totalAttributes
            .filter((attr) => d.attributes.includes(attr.slug))
            .map((d) => String(d._id));
          return {
            ...d,
            createdAt: new Date(),
            updatedAt: new Date(),
            attributes: newMappped,
          };
        });
        finalAdded = await businessTypecoll.insertMany(mappedValue);
        break;
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
