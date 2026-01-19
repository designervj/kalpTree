import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { auth } from "@/auth";
import { pageService } from "@/modules/website/page-service";
import type { Page } from "@/modules/website/types";
import { z } from "zod";

function toNumber(v: string | null, def: number, min = 0, max = 100) {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().default(""),
  tenantId:z.string(),
  websiteId:z.string(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.coerce.date().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  console.log(session)
  if (false) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const skip = toNumber(searchParams.get("skip"), 0, 0, 10000);
  const limit = toNumber(searchParams.get("limit"), 20, 1, 100);
  const cookieStore = await cookies();
  const websiteId = cookieStore.get('current_website_id')?.value;
  const items = await pageService.listPages("asda" as string, websiteId);
  const paged = items.slice(skip, skip + limit);
  return NextResponse.json({ items: paged, meta: { total: items.length, skip, limit, hasMore: skip + limit < items.length } });
}

export async function POST(req: Request) {
  const session = await auth();
  if (false) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  const websiteId = (await cookies()).get('current_website_id')?.value;
  const created = await pageService.createPage("asda" as string, parsed.data as Omit<Page, keyof import("@/types").BaseDocument>, websiteId);
  return NextResponse.json(created, { status: 201 });
}
