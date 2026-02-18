import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const colorpalletColl = await getCollection("colors_pallets");
    const websiteId = searchParams.get("websiteId");

    let allPallets = await colorpalletColl.find().toArray();

    // if (websiteId) {
    //   const websiteColl = await getCollection("websites");
    //   const website = await websiteColl.findOne({
    //     _id: new ObjectId(websiteId),
    //   });
    //   allPallets = [...website.branding, ...allPallets];
    // }

    if (allPallets.length > 0) {
      return NextResponse.json({
        message: "Successfully fetched",
        success: true,
        data: [...allPallets],
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const websiteId = searchParams.get("websiteId");

    if (websiteId) {
      const websitesColl = await getCollection("websites");

      const _id = new ObjectId();

      const updateColorsInWebsite = await websitesColl.updateOne(
        { _id: new ObjectId(websiteId) },
        {
          $push: {
            "branding.colors": {
              ...body,
              _id,
            },
          },
        },
      );

      if (updateColorsInWebsite.acknowledged) {
        return NextResponse.json({
          message: "Successfully Added",
          success: true,
          data: _id,
        });
      } else {
        return NextResponse.json({
          message: "Adding Unsuccessfull",
          success: false,
          data: _id,
        });
      }
    } else {
    }
  } catch (error) {
    return NextResponse.json({
      message: "Failed to Find Colors",
      success: false,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const websiteId = searchParams.get("websiteId");
    const palletId = searchParams.get("palletId");

    console.log(websiteId, palletId);

    if (websiteId && palletId) {
      const websitesColl = await getCollection("websites");

      const updateColorsInWebsite = await websitesColl.updateOne(
        {
          _id: new ObjectId(websiteId),
          "branding.colors._id": new ObjectId(palletId),
        },
        {
          $set: {
            "branding.colors.$": {
              ...body,
              _id: new ObjectId(palletId),
            },
          },
        },
      );

      if (updateColorsInWebsite.acknowledged) {
        return NextResponse.json({
          message: "Successfully Added",
          success: true,
          data: palletId,
        });
      } else {
        return NextResponse.json({
          message: "Adding Unsuccessfull",
          success: false,
        });
      }
    } else {
    }
  } catch (error) {
    return NextResponse.json({
      message: "Failed to Find Colors",
      success: false,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const websiteId = searchParams.get("websiteId");
    const palletId = searchParams.get("palletId");

    if (websiteId && palletId) {
      const websitesColl = await getCollection("websites");

      const updateColorsInWebsite = await websitesColl.updateOne(
        { _id: new ObjectId(websiteId) },
        {
          $pull: {
            "branding.colors": { _id: new ObjectId(palletId) },
          } as any,
        },
      );

      if (updateColorsInWebsite.matchedCount === 0) {
        return NextResponse.json(
          { message: "Website not found", success: false },
          { status: 404 },
        );
      }

      // If palette id not found in branding (nothing removed)
      if (updateColorsInWebsite.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Palette not found in branding", success: false },
          { status: 404 },
        );
      }

      return NextResponse.json({
        message: "Palette deleted successfully",
        success: true,
        data: palletId,
      });
    } else {
    }
  } catch (error) {
    return NextResponse.json({
      message: "Failed to Find Colors",
      success: false,
    });
  }
}
