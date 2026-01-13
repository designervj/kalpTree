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
        const type = searchParams.get("type") || "business";
        console.log(type)
        const ITEMS_PER_PAGE = Number(searchParams.get("itemsperpage") || 30);

        const skip = (page - 1) * ITEMS_PER_PAGE;
    
        const tenantcoll = await getCollection("tenants");

        let filter: Record<string, any> = {};

        // if (user.role === "agency") {
        //     filter.createdById = new ObjectId(user.id);
        // }

        if (user.role === "superadmin") {
            filter.type = type;
        }   

        const [businesses, totalCount] = await Promise.all([
            tenantcoll.find(filter).skip(skip).limit(ITEMS_PER_PAGE).toArray(),
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
