import { NextRequest, NextResponse } from "next/server";
import { tenantService } from "@/lib/tenant/tenant-service";
import { auth } from "@/auth";

/**
 * PUT /api/admin/branding/brandingProfile
 * Partial update of tenant brand profile information
 */
export async function PUT(req: NextRequest) {
    try {
        // Get session to verify authentication
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await req.json();
        const {
            tenantId,
            brandName,
            tagline,
            description,
            industry,
            foundedYear,
            website,
            email,
            phone,
            address,
            socials,
        } = body;

        // Validate required field
        if (!tenantId) {
            return NextResponse.json(
                { error: "Tenant ID is required" },
                { status: 400 }
            );
        }

        // Update business details using the service method
        const updatedTenant = await tenantService.updateBusinessDetails(tenantId, {
            brandName,
            tagline,
            description,
            industry,
            foundedYear,
            phone,
            address,
            email,
            socials,
        });

        if (!updatedTenant) {
            return NextResponse.json(
                { error: "Tenant not found or update failed" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Brand profile updated successfully",
            data: updatedTenant,
        });

    } catch (error) {
        console.error("Error updating brand profile:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
