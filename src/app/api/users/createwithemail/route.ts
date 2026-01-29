import { getDatabase } from "@/lib/db/mongodb";
import { Collection, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";
import { userService } from "@/lib/auth/user-service";
import { transporter } from "@/lib/nodemailer";

export async function GET(req: NextRequest) {
  const coll = await getCollection("users");
  const body = await req.json();

  body.tenantId = new ObjectId(body.tenantId);

  return NextResponse.json({ item: "tenants" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  body.tenantId = new ObjectId(body.tenantId);
  body.createdById = new ObjectId(body.createdById);
  body.managedServices = body.managedServices.map((d: any) => {
    return {
      managedBusiness: new ObjectId(d.managedBusiness),
      managedWebsites: d.managedWebsites.map((l: any) => new ObjectId(l)),
    };
  });

  const rolescoll = await getCollection("roles");
  const roles = await rolescoll.findOne({ code: "franchise" });
  body.permissions = roles.permissions;

  const userCreated = await userService.createwithemail(body);

  const text = `${process.env.NEXTAUTH_URL}/auth/emailuser?id=${String(
    userCreated._id
  )}`;

  const info = await transporter.sendMail({
    from: '"Roveo" <hello@roveo.in>',
    to: body.email,
    subject: "Verify your email",
    text: `Verify your email using this link: ${text}`, // fallback
    html: `
    <p>Hello,</p>
    <p>Please verify your email by clicking the link below:</p>
    <p>
      <a href="${text}" target="_blank" style="
        display:inline-block;
        padding:10px 16px;
        background:#2563eb;
        color:#ffffff;
        text-decoration:none;
        border-radius:6px;
        font-weight:500;
      ">
        Verify Email
      </a>
    </p>
    <p>If the button doesn’t work, copy and paste this URL:</p>
    <p>${text}</p>
  `,
  });

  return NextResponse.json({ item: "tenants" });
}

export async function PUT(req: NextRequest) {
  const request = await req;
  const body = await request.json();
  const {email,password} = body;
  const userscoll = await getCollection("users");
  const exist = await userscoll.findOne({ email });

  if (!exist)
    return NextResponse.json({
      message: "No User Found",
    });

  const finalResult = await userService.updatepasswordafterverification({
    id: exist._id!,
    name: exist.name,
    password: password,
  });

  return NextResponse.json({ message: "User Verified Successfully" });
}
