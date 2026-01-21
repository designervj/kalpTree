import { getCollection } from "@/app/api/tenants/[id]/route";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const websiteId = searchParams.get("websiteId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!websiteId) {
      return NextResponse.json({
        message: "Not Authorised",
        success: false,
      });
    }

    const bookingInventory = await getCollection("booking_inventory");

    let query: any = {
      websiteId: new ObjectId(websiteId),
    };

    // Only add date filter if both dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      query.date = {
        $gte: start,
        $lte: end, // Changed from $lt to $lte to include the end date
      };
    }

    console.log(query);

    let AllBooking = await bookingInventory
      .aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productId",
          },
        },
        {
          $lookup: {
            from: "product_variants",
            localField: "variantId",
            foreignField: "_id",
            as: "variantId",
          },
        },
        {
          $unwind: {
            path: "$productId",
          },
        },
        {
          $unwind: {
            path: "$variantId",
          },
        },
      ])
      .toArray();

    const map: any = {};

    for (let i = 0; i < AllBooking.length; i++) {
      let final = AllBooking[i];
      let date = final.date.toISOString().split("T")[0];
      const {
        variantId,
        productId,
        _id,
        totalUnits,
        bookedUnits,
        priceOverride,
      } = final;
      const { _id: variant_id, sku, price, attributes } = variantId;
      const { _id: product_id, title, basePrice, bookingConfg } = productId;

      let main = {
        totalUnits,
        bookedUnits,
        priceOverride,
        date: date,
        variantPrice: price,
        attributes,
        sku,
        product_title: title,
        product_price: basePrice,
        bookingConfig: bookingConfg ? bookingConfg : {},
        product_id,
        variant_id,
        inventory_id: _id,
      };
      const finalId = String(variant_id);

      if (map[finalId]) {
        map[finalId].masterData[date] = main;
      } else {
        map[finalId] = {
          masterData: {},
          _id: variant_id,
        };
        map[finalId].masterData[date] = main;
      }
    }

    console.log(map);

    // if (AllBooking.length === 0) {
    //   // Changed from < 0 to === 0
    //   return NextResponse.json({
    //     message: "No inventory found for the selected date range",
    //     success: false,
    //     data: [],
    //   });
    // }

    if (map) {
      // Changed from < 0 to === 0
      return NextResponse.json({
        message: "No inventory found for the selected date range",
        success: false,
        data: Object.values(map),
      });
    }

    return NextResponse.json({
      message: "Successfully fetched",
      success: true,
      data: AllBooking,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({
      message: String(error),
      success: false,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const body = await req.json();
    const websiteId = searchParams.get("websiteId");
    const tenantId = searchParams.get("tenantId");

    const {
      productId,
      variantId,
      date,
      totalUnits,
      bookedUnits,
      priceOverride,
    } = body;

    if (!websiteId || !tenantId) {
      return NextResponse.json({
        message: "Not Authorised",
        success: false,
      });
    }

    if (!productId || !variantId || !date || !totalUnits) {
      return NextResponse.json({
        message: "Please Enter the Required Details",
        success: false,
      });
    }

    const inventoryManage = await getCollection("booking_inventory");
    const createInventory = await inventoryManage.insertOne({
      productId: new ObjectId(productId),
      variantId: new ObjectId(variantId),
      date: new Date(date),
      totalUnits,
      bookedUnits,
      priceOverride,
      websiteId: new ObjectId(websiteId),
      tenantId: new ObjectId(tenantId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (createInventory.insertedId) {
      return NextResponse.json({
        message: "Successfully inserted",
        success: true,
        data: { ...body, _id: createInventory.insertedId },
      });
    } else {
      return NextResponse.json({
        message: "Failed to Add in Inventory",
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
