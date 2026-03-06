import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";

export async function GET(req: NextRequest) {
  try {
    const searhParams = req.nextUrl.searchParams;

    const userId = searhParams.get("userId");
    const websiteId = searhParams.get("websiteId");

    if (!userId || !websiteId) {
      return NextResponse.json({
        message: "Not Possible to Store Cart",
        success: false,
      });
    }

    const cartColl = await getCollection("cart");

    const cart = await cartColl.findOne({
      userId,
      websiteId,
    });

    if (cart.length > 0) {
      return NextResponse.json({
        data: cart,
        message: `${cart.length} are present in Cart`,
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: error,
      success: false,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const searhParams = req.nextUrl.searchParams;
    const userId = searhParams.get("userId");
    const websiteId = searhParams.get("websiteId");


  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: error,
      success: false,
    });
  }
}
