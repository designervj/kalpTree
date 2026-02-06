import { NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";

export async function GET(req: NextResponse) {
  try {
    const industryColl = await getCollection("industry");

    const industries = await industryColl.find().toArray();

    if (industries.length > 0) {
      return NextResponse.json({
        message: "Successfull",
        success: true,
        data: industries,
      });
    } else {
      return NextResponse.json({
        message: "Unsuccessfull",
        success: false,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Failed to Get Industry",
      success: false,
    });
  }
}
