import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db/mongodb";

// GET - Retrieve all tenants where type === "business"
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
         const searchParams=request.nextUrl.searchParams.get("type")
        // Get database connection
        const db = await getDatabase();
        const tenantCollection = db.collection("tenants");

        // Fetch all tenants where type === "business"
        const businesses = await tenantCollection
            .find({ type: searchParams })
            .toArray();

        // Return the results
        return NextResponse.json({
            businesses,
            count: businesses.length,
        });
    } catch (error) {
        console.error("Error fetching business tenants:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
