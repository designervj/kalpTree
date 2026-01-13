import { NextResponse } from "next/server";
import { tenantService } from "@/lib/tenant/tenant-service";
import { userService } from "@/lib/auth/user-service";
import { websiteService } from "@/lib/websites/website-service";

import { generateFileName, s3 } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const formData = await req.formData();
    const createdById = formData.get("createdById") as string;
    const agency_name = formData.get("agency_name") as string;
    const agency_email = formData.get("agency_email") as string;
    const agency_password = formData.get("agency_password") as string;

    const businessdetails = JSON.parse(
      formData.get("businessdetails") as string
    );

    const { email, password, service, business_name, businsess_url, tenantId } =
      businessdetails;

    const branding = JSON.parse(formData.get("branding") as string);
    const logo = formData.get("logo") as File | null;

    let createByTenant = "";

    let logo_url = "";

    let message = "";

    if (!tenantId && !agency_name && !agency_password && session) {
      createByTenant = session?.user?.tenantId;
    } else if (tenantId && !agency_name && !agency_password) {
      createByTenant = tenantId;
    }

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

      message += "Agency ";
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
    if (logo_url) {
      logoUrl = logo_url;
    } else if (logo && !logo_url) {
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
      role: "business",
      createdById: createdById,
      tenantId: tenant._id,
    });

    const urlDefault = businsess_url
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const primaryDomain = [
      `${urlDefault}.localhost:55803`,
      `${urlDefault}.kalptree.xyz`,
      businsess_url,
    ];

    const website = await websiteService.create({
      tenantId: tenant._id,
      name: business_name,
      serviceType: service ?? "WEBSITE_ONLY",
      primaryDomain: primaryDomain,
      systemSubdomain: `${urlDefault}.kalptree.xyz`,
    });

    return NextResponse.json({
      ok: true,
      tenantId: String(tenant._id),
      tenantSlug: tenant.slug,
      websiteId: website.websiteId,
      message: `${message}Business Created`,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal error" },
      { status: 500 }
    );
  }
}
