import { NextRequest, NextResponse } from "next/server";
import { entityConfig, isValidEntity } from "@/lib/entities/entityConfig";

export async function POST(req: NextRequest, ctx: any) {
  const params = (await ctx?.params) ?? {};
  const { entity } = params ?? {};

  try {
    if (!isValidEntity(entity)) {
      return NextResponse.json(
        { error: `Unsupported entity: ${entity}` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const result = await entityConfig[entity].create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest, ctx: any) {
  const params = (await ctx?.params) ?? {};
  const { entity } = params ?? {};

  try {
    if (!isValidEntity(entity)) {
      return NextResponse.json(
        { error: `Unsupported entity: ${entity}` },
        { status: 400 }
      );
    }

    const id = req.nextUrl?.searchParams?.get("id");
    const websiteId = req.nextUrl?.searchParams?.get("websiteId") || "";

    // If ID is provided, get single item
    if (id) {
      const item = await entityConfig[entity].getById(id);
      if (!item) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ item });
    }

    // Otherwise, get list of items
    const items = await entityConfig[entity].list(websiteId);
    return NextResponse.json({ items });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, ctx: any) {
  const params = (await ctx?.params) ?? {};
  const { entity } = params ?? {};

  try {
    if (!isValidEntity(entity)) {
      return NextResponse.json(
        { error: `Unsupported entity: ${entity}` },
        { status: 400 }
      );
    }

    // Get id from query or body
    const idFromQuery = req.nextUrl?.searchParams?.get("id");
    console.log("idFromQuery")
    let id = idFromQuery;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const deleted = await entityConfig[entity].delete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest, ctx: any) {
  const params = (await ctx?.params) ?? {};
  const { entity } = params ?? {};

  try {
    if (!isValidEntity(entity)) {
      return NextResponse.json(
        { error: `Unsupported entity: ${entity}` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const id = body?.id ?? body?._id;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updated = await entityConfig[entity].update(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
