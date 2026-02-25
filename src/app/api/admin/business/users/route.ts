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

    const tenantId = request.nextUrl.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const userColl = db.collection("users");
    const users = await userColl.find({ tenantId: new ObjectId(tenantId) }).toArray();
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



    const body = await request.json();
    const { email, passwordHash, permissions } = body;

    if (!email || !passwordHash || permissions.length <= 0) {
      return NextResponse.json({
        message: "Please Enter Details Correctly",
        success: false,
      });
    }

    const db = await getDatabase();
    const userColl = db.collection("users");

    const check = await userColl.findOne({ email: body.email });

    if (check?._id) {
      return NextResponse.json({
        message: "Email Already Exist",
        success: false,
      });
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


// update busniess user

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
  
    if (!body.email || body.permissions.length <= 0) {
      return NextResponse.json({
        message: "Please Enter Details Correctly",
        success: false,
      });
    }

    const db = await getDatabase();
    const userColl = db.collection("users");

    const check = await userColl.findOne({ email: body.email });

    if (check?._id) {
      // update all user permission
      const updatedUser = await userColl.updateOne({ email: body.email }, { $set: { permissions: body.permissions } });
      if (updatedUser.modifiedCount > 0) {
        return NextResponse.json({
          message: "User updated successfully",
          success: true,
          user: {
            ...body,
            _id: check._id,
          },
        });
      } else {
        return NextResponse.json({
          message: "Process Failed",
          success: false,
        });
      }
    }

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    });
  }
}

// delete business user

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id=request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        message: "Please Enter Details Correctly",
        success: false,
      });
    }

    const db = await getDatabase();
    const userColl = db.collection("users");

    const deletedUser = await userColl.deleteOne({ _id: new ObjectId(id) });
    if (deletedUser.deletedCount > 0) {
      return NextResponse.json({
        message: "User deleted successfully",
        success: true,
      });
    } else {
      return NextResponse.json({
        message: "Process Failed",
        success: false,
      });
    }

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    });
  }
}