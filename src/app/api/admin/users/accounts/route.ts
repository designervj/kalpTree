import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { tenantService } from "@/lib/tenant/tenant-service";
import { TenantModel } from "@/models/tenant";
import type { Tenant } from "@/types";
import { getDatabase } from "@/lib/db/mongodb";
import { cookies } from "next/headers";

// GET - Retrieve all tenants or a specific tenant by ID
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const db = await getDatabase();
    const user = session?.user;

    const tenantColl = db.collection("tenants");
    // const accountId = request.nextUrl.searchParams.get("accountId");
    // const tenantId = request.nextUrl.searchParams.get("tenantId");

    // If accountId is provided, fetch single account
    // if (accountId) {
    //   // Validate ObjectId format
    //   if (!ObjectId.isValid(accountId)) {
    //     return NextResponse.json(
    //       { error: "Invalid account ID format" },
    //       { status: 400 }
    //     );
    //   }

    // const tenant = await db.collection("tenants").findOne({
    //   _id: new ObjectId(accountId),
    // });

    const tenant = await db.collection("tenants").find().toArray();

    //   if (!tenant) {
    //     return NextResponse.json(
    //       { error: "Account not found" },
    //       { status: 404 }
    //     );
    //   }

    //   console.log("tenant---", tenant);
    //   return NextResponse.json({ tenant });
    // }

    // let tenants = await tenantColl
    //   .find({ tenantId: new ObjectId(tenantId!) })
    //   .toArray();

    return NextResponse.json({ tenants: tenant, count: tenant.length });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create a new tenant
// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Only superadmin can create tenants
//     if (session.user.role !== "superadmin") {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const body = await request.json();
//     const { slug, name, email, plan } = body;

//     // Validate required fields
//     if (!slug || !name || !email) {
//       return NextResponse.json(
//         { error: "Slug, name, and email are required" },
//         { status: 400 }
//       );
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: "Invalid email format" },
//         { status: 400 }
//       );
//     }

//     // Validate slug format (lowercase, alphanumeric, hyphens only)
//     const slugRegex = /^[a-z0-9-]+$/;
//     if (!slugRegex.test(slug)) {
//       return NextResponse.json(
//         { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
//         { status: 400 }
//       );
//     }

//     // Validate plan if provided
//     if (plan && !["trial", "basic", "pro", "enterprise"].includes(plan)) {
//       return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
//     }

//     // Check if email already exists
//     const existingTenantByEmail = await tenantService.getTenantByEmail(email);
//     if (existingTenantByEmail) {
//       return NextResponse.json(
//         { error: "Tenant with this email already exists" },
//         { status: 409 }
//       );
//     }

//     // Create tenant
//     const tenant = await tenantService.createTenant({
//       slug,
//       name,
//       email,
//       plan: plan || "trial",
//     });

//     return NextResponse.json(
//       {
//         message: "Tenant created successfully",
//         tenant,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Error creating tenant:", error);

//     // Handle duplicate slug error
//     if (error.message === "Tenant slug already exists") {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update an existing tenant
// export async function PUT(request: NextRequest) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Only superadmin can update tenants
//     if (session.user.role !== "superadmin") {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const body = await request.json();
//     const { id, ...updates } = body;

//     // Validate tenant ID
//     if (!id) {
//       return NextResponse.json(
//         { error: "Tenant ID is required" },
//         { status: 400 }
//       );
//     }

//     // Validate ObjectId format
//     if (!ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { error: "Invalid tenant ID format" },
//         { status: 400 }
//       );
//     }

//     // Check if tenant exists
//     const existingTenant = await tenantService.getTenantById(id);
//     if (!existingTenant) {
//       return NextResponse.json(
//         { error: "Tenant not found" },
//         { status: 404 }
//       );
//     }

//     // Validate plan if being updated
//     if (updates.plan && !["trial", "basic", "pro", "enterprise"].includes(updates.plan)) {
//       return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
//     }

//     // Validate status if being updated
//     if (updates.status && !["active", "suspended", "pending"].includes(updates.status)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     // Validate subscription status if being updated
//     if (updates.subscriptionStatus && !["active", "suspended", "cancelled"].includes(updates.subscriptionStatus)) {
//       return NextResponse.json({ error: "Invalid subscription status" }, { status: 400 });
//     }

//     // Prevent updating certain fields
//     const { _id, createdAt, ...allowedUpdates } = updates;

//     // Update tenant
//     const success = await tenantService.updateTenant(id, allowedUpdates);

//     if (!success) {
//       return NextResponse.json(
//         { error: "Failed to update tenant" },
//         { status: 500 }
//       );
//     }

//     // Fetch updated tenant
//     const updatedTenant = await tenantService.getTenantById(id);

//     return NextResponse.json({
//       message: "Tenant updated successfully",
//       tenant: updatedTenant,
//     });
//   } catch (error) {
//     console.error("Error updating tenant:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete a tenant (soft delete by setting status to suspended)
// export async function DELETE(request: NextRequest) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Only superadmin can delete tenants
//     if (session.user.role !== "superadmin") {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const { searchParams } = new URL(request.url);
//     const tenantId = searchParams.get("id");

//     // Validate tenant ID
//     if (!tenantId) {
//       return NextResponse.json(
//         { error: "Tenant ID is required" },
//         { status: 400 }
//       );
//     }

//     // Validate ObjectId format
//     if (!ObjectId.isValid(tenantId)) {
//       return NextResponse.json(
//         { error: "Invalid tenant ID format" },
//         { status: 400 }
//       );
//     }

//     // Check if tenant exists
//     const existingTenant = await tenantService.getTenantById(tenantId);
//     if (!existingTenant) {
//       return NextResponse.json(
//         { error: "Tenant not found" },
//         { status: 404 }
//       );
//     }

//     // Soft delete by suspending the tenant
//     const success = await tenantService.suspendTenant(tenantId);

//     if (!success) {
//       return NextResponse.json(
//         { error: "Failed to delete tenant" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       message: "Tenant deleted (suspended) successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting tenant:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
