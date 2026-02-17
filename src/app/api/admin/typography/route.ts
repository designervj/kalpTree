import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, key, url, fontType } = body;

    const typographycoll = await getCollection("typography");

    await typographycoll.insertOne({
      name,
      url,
      key,
      fontType,
    });

    const typographies = await typographycoll.find().toArray();

    if (typographies.length > 0) {
      return NextResponse.json({
        message: "Successfully fetched",
        success: true,
        data: typographies,
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

export async function GET(req: NextRequest) {
  try {
    const typographycoll = await getCollection("typography");

    const typographies = await typographycoll.find().toArray();

    if (typographies.length > 0) {
      return NextResponse.json({
        message: "Successfully fetched",
        success: true,
        data: typographies,
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
