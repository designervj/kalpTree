import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/mongodb";
import { z } from "zod";
import { PageSEOModel } from "@/components/admin/website_seo/PageSEOModel";

// Validation schema
const pageSEOSchema = z.object({
    websiteId: z.string().optional(),
    pageName: z.string().optional(),
    slug: z.string().optional(),
    path: z.string().optional(),
    isMainPage: z.boolean().optional(),
    seo: z
        .object({
            title: z.string().optional(),
            metaDescription: z.string().optional(),
            focusKeywords: z.array(z.string()).optional(),
            hideFromSearchResults: z.boolean().optional(),
        })
        .optional(),
    searchPreview: z
        .object({
            displayTitle: z.string().optional(),
            displayUrl: z.string().optional(),
            displayDescription: z.string().optional(),
        })
        .optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
});

async function getCollection() {
    const db = await getDatabase();
    return db.collection<PageSEOModel>("websites_seo");
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (false) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const websiteId = searchParams.get("websiteId");
        const collection = await getCollection();

        const query: any = {};
        if (websiteId) {
            query.websiteId = new ObjectId(websiteId);
        }

        const items = await collection.find(query).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
            items,
            meta: { total: items.length, skip: 0, limit: items.length, hasMore: false },
        });
    } catch (error: any) {
        console.error("GET /api/pages_seo error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (false) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const json = await req.json();
        const parsed = pageSEOSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const collection = await getCollection();
        const data = parsed.data;

        const doc: any = {
            ...data,
            websiteId: data.websiteId ? new ObjectId(data.websiteId) : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        if (session?.user) {
            doc.createdBy = new ObjectId((session.user as any).id);
        }

        const result = await collection.insertOne(doc);
        const pageSEO = await collection.findOne({ _id: result.insertedId });

        return NextResponse.json({ pageSEO }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/pages_seo error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (false) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID parameter is required" },
                { status: 400 }
            );
        }

        const json = await req.json();
        const parsed = pageSEOSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid payload", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const collection = await getCollection();
        const data = parsed.data;

        const updateDoc: any = {
            ...data,
            updatedAt: new Date(),
        };

        if (data.websiteId) {
            updateDoc.websiteId = new ObjectId(data.websiteId);
        }

        if (session?.user) {
            updateDoc.updatedBy = new ObjectId((session.user as any).id);
        }

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateDoc },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json(
                { error: "Page SEO not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ pageSEO: result });
    } catch (error: any) {
        console.error("PUT /api/pages_seo error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (false) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID parameter is required" },
                { status: 400 }
            );
        }

        const collection = await getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Page SEO not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Page SEO deleted successfully",
            deletedId: id,
        });
    } catch (error: any) {
        console.error("DELETE /api/pages_seo error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
