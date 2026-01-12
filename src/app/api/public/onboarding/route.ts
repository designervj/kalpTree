import { NextResponse } from "next/server";
import { tenantService } from "@/lib/tenant/tenant-service";
import { userService } from "@/lib/auth/user-service";
import { websiteService } from "@/lib/websites/website-service";

import { generateFileName, s3 } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // const email = formData.get("email") as string;
    // const password = formData.get("password") as string;
    // const role = formData.get("role") as string;
    // const service = formData.get("service") as string;
    // const business_name = formData.get("business_name") as string;
    // const businsess_url = formData.get("businsess_url") as string;
    const createdById = formData.get("createdById") as string;

    const agency_name = formData.get("agency_name") as string;
    // const agency_url_suffix = formData.get("agency_url_suffix") as string;
    const agency_email = formData.get("agency_email") as string;
    const agency_password = formData.get("agency_password") as string;
    // const agency_service = formData.get("agency_service") as string;

    const businessdetails = JSON.parse(
      formData.get("businessdetails") as string
    );

    const { email, password, role, service, business_name, businsess_url } =
      businessdetails;

    const branding = JSON.parse(formData.get("branding") as string);
    const logo = formData.get("logo") as File | null;

    let createByTenant = "";

    let logo_url = "";

    if (agency_name && agency_email && agency_password) {
      const tenant = await tenantService.createTenant({
        name: agency_name,
        email: agency_email,
        plan: "trial",
        createdById: createdById,
        branding: branding,
        businessdetails: businessdetails,
        type: "agency",
      });

      const agencyid = String(tenant._id);

      if (logo) {
        const buffer = Buffer.from(await logo.arrayBuffer());

        const fileName = generateFileName(logo.name);
        const key = `${agencyid}/${fileName}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: logo.type,
          })
        );

        logo_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      }

      const newBranding = {
        ...branding,
        logo: logo_url,
      };

      await tenantService.updateTenant(agencyid, {
        branding: newBranding,
      });

      createByTenant = agencyid;

      const t = await userService.createUser({
        email: agency_email,
        password: agency_password,
        name: agency_name,
        role: "agency",
        createdById: createdById,
        tenantId: tenant._id,
      });
    }

    const tenant = await tenantService.createTenant({
      name: business_name,
      email: email,
      plan: "trial",
      createdById: createdById,
      branding: branding,
      businessdetails: businessdetails,
      type: "business",
      tenantId: createByTenant,
    });

    const id = String(tenant._id);
    let logoUrl = "";
    if (logo) {
      const buffer = Buffer.from(await logo.arrayBuffer());
      const fileName = generateFileName(logo.name);
      const key = `${id}/${fileName}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: logo.type,
        })
      );

      logoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const newBranding = {
      ...branding,
      logo: logoUrl,
    };

    await tenantService.updateTenant(id, {
      branding: newBranding,
    });

    const t = await userService.createUser({
      email: email,
      password: password,
      name: business_name,
      role: role,
      createdById: createdById,
      tenantId: tenant._id,
    });

    const primaryDomain = [businsess_url];

    const website = await websiteService.create({
      tenantId: tenant._id,
      name: business_name,
      serviceType: service ?? "WEBSITE_ONLY",
      primaryDomain: primaryDomain,
    });

    return NextResponse.json({
      ok: true,
      tenantId: String(tenant._id),
      tenantSlug: tenant.slug,
      websiteId: website.websiteId,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal error" },
      { status: 500 }
    );
  }
}
