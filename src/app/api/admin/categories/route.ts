import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const websiteId =
      searchParams.get("websiteId") || "696729dde1222ee82bdd906d";

    if (!websiteId) {
      return NextResponse.json({
        message: "No Id Present",
        success: false,
      });
    }

    const productColl = await getCollection("products");

    // const products = await productColl
    //   .find({
    //     websiteId: new ObjectId(websiteId),
    //   })
    //   .toArray();

    const finalProducts = await productColl
      .aggregate([
        {
          $match: {
            websiteId: new ObjectId(websiteId),
          },
        },
        {
          $lookup: {
            from: "product_variants",
            localField: "_id",
            foreignField: "productId",
            as: "variants",
          },
        },
      ])
      .toArray();

    const variantsArray = finalProducts.flatMap((product) => product.variants);

    if (finalProducts.length > 0) {
      return NextResponse.json({
        message: "Successfully Fetched Products",
        items: variantsArray,
        success: true,
      });
    } else {
      return NextResponse.json({
        message: "Failed to Fetch Products",
        success: false,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
      success: false,
    });
  }
}
