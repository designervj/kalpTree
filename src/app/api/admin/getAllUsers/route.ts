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
     const db = await getCollection("users");
      if(userRole=== "superadmin"){
          let users = await db.find({}).toArray();
          return NextResponse.json({ users: users });
      }
      else if(userRole=== "agency"){
        
        let users = await db.find({agencyId: session.user.id}).toArray();
        return NextResponse.json({ users: users });
      }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
