import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const colorpalletColl = await getCollection("colors_pallets");

    let allPallets = await colorpalletColl.find().toArray();

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
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({
        message: "TenantId required",
        success: false,
      });
    }

    const tenantColl = await getCollection("tenants");
    const _id = new ObjectId();

    // 🔥 If new one is global → make all others false first
    if (body.isGlobal) {
      await tenantColl.updateOne(
        { _id: new ObjectId(tenantId) },
        {
          $set: {
            "website.branding.colors.$[].isGlobal": false,
          },
        },
      );
    }

    // Now push new color
    const updateColorsInWebsite = await tenantColl.updateOne(
      { _id: new ObjectId(tenantId) },
      {
        $push: {
          "website.branding.colors": {
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
    }

    return NextResponse.json({
      message: "Adding Unsuccessful",
      success: false,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to Add Colors",
      success: false,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const palletId = searchParams.get("palletId");

    if (tenantId && palletId) {
      const tenantColl = await getCollection("tenants");

      if (body.isGlobal) {
        await tenantColl.updateOne(
          { _id: new ObjectId(tenantId) },
          {
            $set: {
              "website.branding.colors.$[].isGlobal": false,
            },
          },
        );
      }

      const updateColorsInWebsite = await tenantColl.updateOne(
        {
          _id: new ObjectId(tenantId),
          "website.branding.colors._id": new ObjectId(palletId),
        },
        {
          $set: {
            "website.branding.colors.$": {
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
    const tenantId = searchParams.get("tenantId");
    const palletId = searchParams.get("palletId");

    if (tenantId && palletId) {
      const tenantColl = await getCollection("tenants");

      const updateColorsInWebsite = await tenantColl.updateOne(
        { _id: new ObjectId(tenantId) },
        {
          $pull: {
            "website.branding.colors": { _id: new ObjectId(palletId) },
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
