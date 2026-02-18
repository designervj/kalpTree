import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../tenants/[id]/route";
import { setrelatedtowebsites } from "../../../../utils/helperSet";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const websiteColl = await getCollection("websites");
    const websites = await websiteColl.find().toArray();
    const domains = websites
      .map((d) => {
        return d.primaryDomain;
      })
      .flat();

    domains.forEach((d) => setrelatedtowebsites.add(d));

    console.log(setrelatedtowebsites);

    return NextResponse.json({
      success: true,
      data: domains,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error,
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { website } = body;

  console.log(website);

  console.log(setrelatedtowebsites);

  if (setrelatedtowebsites.has(website)) {
    return NextResponse.json({
      message: "URL Present",
      success: false,
    });
  } else {
    return NextResponse.json({
      message: "URL Not Present",
      success: true,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const websiteId = req.nextUrl.searchParams.get("websiteId");

    if (!websiteId) {
      return NextResponse.json({
        success: false,
      });
    }

    const websiteColl = await getCollection("websites");

    const updateGlobalCss = await websiteColl.updateOne(
      {
        _id: new ObjectId(websiteId),
      },
      {
        $set: {
          globalStyle: `<style>${body}</style>`,
        },
      },
    );

    if (updateGlobalCss.acknowledged) {
      return NextResponse.json({
        success: true,
      });
    } else {
      return NextResponse.json({
        success: false,
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
    });
  }
}
