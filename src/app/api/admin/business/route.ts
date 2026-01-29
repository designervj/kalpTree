import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { getCollection } from "@/app/api/tenants/[id]/route";

export async function GET(req: Request) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user || !user.id || !user.role) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;

        const tenantId = searchParams.get("tenantId");
        const type = searchParams.get("type") || "business";
        console.log(type)
        const ITEMS_PER_PAGE = Number(searchParams.get("itemsperpage") || 30);

        const skip = (page - 1) * ITEMS_PER_PAGE;

        const tenantcoll = await getCollection("tenants");

        let filter: Record<string, any> = {};

        if (user.role === "agency" && tenantId) {
            filter.tenantId = new ObjectId(tenantId);
            filter.type = "business";
        }

        if (user.role === "superadmin") {
            filter.type = type;
        }

        const [businesses, totalCount] = await Promise.all([
            tenantcoll.find(filter).sort({ _id: -1 }).skip(skip).limit(ITEMS_PER_PAGE).toArray(),
            tenantcoll.countDocuments(filter),
        ]);

        return NextResponse.json({
            data: businesses,
            pagination: {
                page,
                itemsPerPage: ITEMS_PER_PAGE,
                totalCount,
                totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
                hasNextPage: skip + ITEMS_PER_PAGE < totalCount,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error("BUSINESS LIST API ERROR:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


// Delete API
export async function DELETE(req: Request) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user || !user.id || !user.role) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");

        if (!businessId) {
            return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(businessId)) {
            return NextResponse.json({ error: "Invalid business ID format" }, { status: 400 });
        }

        const tenantcoll = await getCollection("tenants");

        // Check if business exists
        const business = await tenantcoll.findOne({ _id: new ObjectId(businessId) });

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        // Authorization check: only superadmin or agency (if it's their tenant) can delete
        if (user.role === "agency" && business.tenantId?.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden: You don't have permission to delete this business" }, { status: 403 });
        }

        // Delete the business
        const result = await tenantcoll.deleteOne({ _id: new ObjectId(businessId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Failed to delete business" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Business deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("BUSINESS DELETE API ERROR:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// craete  a method to update a business
export async function PUT(req: Request) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user || !user.id || !user.role) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");
        const body = await req.json();
        const {input} = body;
        if (!businessId) {
            return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(businessId)) {
            return NextResponse.json({ error: "Invalid business ID format" }, { status: 400 });
        }

        const tenantcoll = await getCollection("tenants");

        // Check if business exists
        const business = await tenantcoll.findOne({ _id: new ObjectId(businessId) });

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        // Authorization check: only superadmin or agency (if it's their tenant) can update
        if (user.role === "agency" && business.tenantId?.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden: You don't have permission to update this business" }, { status: 403 });
        }

        // Update the business
        const result = await tenantcoll.updateOne({ _id: new ObjectId(businessId) }, { $set: input });

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Business updated successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("BUSINESS UPDATE API ERROR:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}