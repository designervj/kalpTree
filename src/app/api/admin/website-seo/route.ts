import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/mongodb";
import { z } from "zod";
import { PageSEOModel } from "@/components/admin/website_seo/PageSEOModel";

// Validation schema for creating/updating page SEO
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

// Helper function to get the collection
async function getCollection() {
    const db = await getDatabase();
    return db.collection<PageSEOModel>("websites_seo");
}

// GET - Fetch page SEO records
export async function GET(req: Request) {
    try {
        const session = await auth();
        // Authentication check (currently disabled with false)
        if (false) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const websiteId = searchParams.get("websiteId");
        const slug = searchParams.get("slug");
        const isMainPage = searchParams.get("isMainPage");
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const collection = await getCollection();

        // Fetch by ID
        if (id) {
            const pageSEO = await collection.findOne({ _id: new ObjectId(id) });
            if (!pageSEO) {
                return NextResponse.json(
                    { error: "Page SEO not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ pageSEO });
        }

        // Build query
        const query: any = {};

        if (websiteId) {
            query.websiteId = new ObjectId(websiteId);
        }

        if (slug) {
            query.slug = slug;
        }

        if (isMainPage === "true") {
            query.isMainPage = true;
        }

        if (status) {
            query.status = status;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { pageName: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
                { "seo.title": { $regex: search, $options: "i" } },
            ];
        }

        // Fetch single record by slug or isMainPage
        if (slug || isMainPage === "true") {
            const pageSEO = await collection.findOne(query);
            if (!pageSEO) {
                return NextResponse.json(
                    { error: "Page SEO not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ pageSEO });
        }

        // Fetch multiple records
        const items = await collection
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({
            items,
            meta: {
                total: items.length,
                skip: 0,
                limit: items.length,
                hasMore: false,
            },
        });
    } catch (error: any) {
        console.error("GET /api/admin/website-seo error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create a new page SEO record
export async function POST(req: Request) {
    try {
        const session = await auth();
        // Authentication check (currently disabled with false)
        if (false) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const json = await req.json();
        const parsed = pageSEOSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid payload",
                    issues: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const collection = await getCollection();
        const data = parsed.data;

        // Prepare document for insertion
        const doc: any = {
            ...data,
            websiteId: data.websiteId ? new ObjectId(data.websiteId) : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Add createdBy if session exists
        if (session?.user) {
            doc.createdBy = new ObjectId((session.user as any).id);
        }

        const result = await collection.insertOne(doc);
        const pageSEO = await collection.findOne({ _id: result.insertedId });

        return NextResponse.json({ pageSEO }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/admin/website-seo error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT - Update an existing page SEO record
export async function PUT(req: Request) {
    try {
        const session = await auth();
        // Authentication check (currently disabled with false)
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
                {
                    error: "Invalid payload",
                    issues: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const collection = await getCollection();
        const data = parsed.data;

        // Prepare update document
        const updateDoc: any = {
            ...data,
            updatedAt: new Date(),
        };

        // Convert websiteId to ObjectId if provided
        if (data.websiteId) {
            updateDoc.websiteId = new ObjectId(data.websiteId);
        }

        // Add updatedBy if session exists
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
        console.error("PUT /api/admin/website-seo error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a page SEO record
export async function DELETE(req: Request) {
    try {
        const session = await auth();
        // Authentication check (currently disabled with false)
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
        console.error("DELETE /api/admin/website-seo error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
