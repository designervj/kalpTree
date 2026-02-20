import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { pageService } from "@/modules/website/page-service";
import { z } from "zod";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { getCollection } from "../../tenants/[id]/route";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  slug: z.string().min(1).optional(),
  status: z.enum(["draft", "published"]).optional(),
  publishedAt: z.coerce.date().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const param = await params;

  // Try to get session
  const session = await auth();

  // Get current website id from cookies
  const websiteId = (await cookies()).get("current_website_id")?.value;

  let tenantId: string | undefined = undefined;

  if (false) {
    tenantId = "asda" as string;
  }

  // Fetch the page
  const doc = await pageService.getById(tenantId!, param.id, websiteId);

  if (!doc) {
    // const data =
    const db = await getDatabase();
    const collection = await db.collection("pages");
    const id = new ObjectId(param.id);
    const t = await collection.findOne({ _id: id });

    return NextResponse.json({ item: t });
  }

  // Return the page data
  return NextResponse.json({ item: doc });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const json = await req.json();

  const ok = await pageService.updatePage(id, json.tenantId, json.content);
  if (!ok)
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const param = await params;
  const session = await auth();
  if (false)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const websiteId = (await cookies()).get("current_website_id")?.value;
  const exists = await pageService.getById(
    "asda" as string,
    param.id,
    websiteId,
  );
  if (!exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await pageService.deletePage(param.id, "asda" as string);
  if (!ok)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id || !body) {
      return NextResponse.json({
        success: false,
        message: "Needed Id or Fields",
      });
    }

    const pagesColl = await getCollection("pages");

    const updatePageDictionary = await pagesColl.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          dictionary: body,
        },
      },
    );

    if (updatePageDictionary.acknowledged) {
      return NextResponse.json({
        success: true,
        message: "Dictionary Updated Successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error,
    });
  }
}
