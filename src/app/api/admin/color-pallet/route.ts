import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";

export async function GET(req: NextRequest) {
  try {
    const colorpalletColl = await getCollection("colors_pallets");

    const allPallets = await colorpalletColl.find().toArray();

    if (allPallets.length > 0) {
      return NextResponse.json({
        message: "Successfully fetched",
        success: true,
        data: allPallets,
      });
    } else {
      return NextResponse.json({
        message: "Un-Successfully fetched",
        success: false,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Failed to Find Colors",
      success: false,
    });
  }
}
