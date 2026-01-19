import { cookies } from "next/headers";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../tenants/[id]/route";

export function serializeMongoDoc<T>(doc: T): any {
  if (doc === null || doc === undefined) return doc;

  // ObjectId instance
  if (doc instanceof ObjectId) {
    return doc.toString();
  }

  // Date
  if (doc instanceof Date) {
    return doc.toISOString();
  }

  // Array
  if (Array.isArray(doc)) {
    return doc.map(serializeMongoDoc);
  }

  // Object
  if (typeof doc === "object") {
    const plainObj: any = {};
    for (const key in doc) {
      plainObj[key] = serializeMongoDoc((doc as any)[key]);
    }
    return plainObj;
  }

  return doc;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const user = session?.user
    ? {
      id: session.user.id || "",
      email: session.user.email || "",
      role: session.user.role || "",
      permissions: Array.isArray((session.user as any).permissions)
        ? (session.user as any).permissions
        : undefined,
      createdById: session.user.createdById || "",
      tenantId: session.user.tenantId || "",
    }
    : null;
  let agencies: any[] = [];
  let business: any[] = [];
  let websites: any[] = [];
  let loggedinTenant: null | any | undefined = null;
  let agencyColl = await getCollection("tenants");
  let websiteColl = await getCollection("websites");

  if (user?.role == "superadmin") {
    agencies = await agencyColl
      .find({ type: "agency" })
      .project({
        _id: 1,
        name: 1,
        tenantId: 1,
      })
      .toArray();

    business = await agencyColl
      .find({ type: "business" })
      // .project({
      //   _id: 1,
      //   name: 1,
      //   tenantId: 1,
      //   email: 1,

      // })
      .toArray();

    websites = await websiteColl
      .find()
      .project({
        _id: 1,
        name: 1,
        tenantId: 1,
        primaryDomain: 1,
      })
      .toArray();
  } else if (user?.role == "agency") {
    agencies = await agencyColl
      .find({ type: "agency", _id: new ObjectId(user.tenantId) })
      .project({
        _id: 1,
        name: 1,
        tenantId: 1,
      })
      .toArray();


    business = await agencyColl
      .find({ tenantId: new ObjectId(user.tenantId) })
      .project({
        name: 1,
        _id: 1,
        tenantId: 1,
      })
      .toArray();

    console.log("allbusiness", business)
    websites = await websiteColl
      .find({
        tenantId: {
          $in: business.map((d) => d._id),
        },
      })
      .project({
        _id: 1,
        name: 1,
        tenantId: 1,
        primaryDomain: 1,
      })
      .toArray();
  } else if (user?.role == "business") {


 

    business = await agencyColl
      .find({ _id: new ObjectId(user.tenantId) })
      .project({
        name: 1,
        _id: 1,
        tenantId: 1,
        email: 1,
      })
      .toArray();


         agencies = await agencyColl
      .find({ type: "agency", _id: new ObjectId(business[0].tenantId) })
      .project({
        _id: 1,
        name: 1,
        tenantId: 1,
        email: 1,
      })
      .toArray();

    websites = await websiteColl
      .find({
        tenantId: new ObjectId(user.tenantId),
      })
      .project({
        _id: 1,
        name: 1,
        tenantId: 1,
        primaryDomain: 1,
      })
      .toArray();
  }

  return NextResponse.json({
    user,
    business,
    websites,
    loggedinTenant,
    agencies,
  });
}

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });

  response.cookies.delete("current_selected_agency_id");
  response.cookies.delete("current_selected_business_id");
  response.cookies.delete("current_website_id");

  return response;
}
