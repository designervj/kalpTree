import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { getDatabase, getDb } from "@/lib/db/mongodb";
import { RBACService } from "@/lib/rbac/rbac-service";
import { DEFAULT_USER_PERMISSIONS } from "@/lib/rbac/roles";
import { User } from "@/types";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId("dfas");

    // Check if user has permission to read users
    const hasPermission = await RBACService.hasPermission(
      userId,
      "users",
      "read",
      {
        tenantId,
      }
    );

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get manageable users for this user
    const users = await RBACService.getManageableUsers(userId, tenantId);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    const body = await request.json();
    const { email, passwordHash, permissions } = body;

    if (!email || !passwordHash || permissions.length <= 0) {
      return NextResponse.json({
        message: "Please Enter Details Correctly",
        success: false,
      });
    }

    const db = await getDatabase();
    const roleColl = db.collection("roles");
    const userColl = db.collection("users");

    const check = await userColl.findOne({ email: body.email });

    if (check?._id) {
      return NextResponse.json({
        message: "Email Already Exist",
        success: false,
      });
    }
    const roledata = await roleColl.find({ code: body.role }).toArray();

    const { canMultipleTenants } = roledata[0];

    if (!canMultipleTenants) {
      body.tenantId = new ObjectId(body.tenantId);
    } else {
      body.tenantId = body.tenantId.map((d: string) => new ObjectId(d));
    }

    body.passwordHash = await bcrypt.hash(passwordHash, 12);

    if (userRole != "superadmin" && userRole != "agency") {
      body.tenantId = tenantId;
    }

    const createdUser = await userColl.insertOne(body);

    if (createdUser.insertedId) {
      return NextResponse.json({
        message: "User created successfully",
        success: true,
        user: {
          ...body,
          _id: createdUser.insertedId,
        },
      });
    } else {
      return NextResponse.json({
        message: "Process Failed",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    });
  }
}
