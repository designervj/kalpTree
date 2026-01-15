import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../tenants/[id]/route";
import { setrelatedtowebsites } from "../../../../utils/helperSet";

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
