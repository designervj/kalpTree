import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/mongodb";
import { RBACService } from "@/lib/rbac/rbac-service";
import { User } from "@/types";
import { getCollection } from "../../tenants/[id]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRole = session.user.role;
    const current_selected_business_id = await request.cookies.get(
      "current_selected_business_id"
    )?.value;
    const current_selected_agency_id = await request.cookies.get(
      "current_selected_agency_id"
    )?.value;
    const current_website_id = await request.cookies.get("current_website_id")
      ?.value;

    const db = await getCollection("users");

    let users = await db
      .find({ tenantId: new ObjectId(current_selected_business_id) })
      .toArray();

    return NextResponse.json({ users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
