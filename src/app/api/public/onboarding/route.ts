import { NextResponse } from "next/server";
import { tenantService } from "@/lib/tenant/tenant-service";
import { userService } from "@/lib/auth/user-service";
import { websiteService } from "@/lib/websites/website-service";

import { generateFileName, s3 } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { getCollection } from "../../tenants/[id]/route";
import { demoPages } from "../../../../../utils/utlis";
import { ObjectId } from "mongodb";
import { Tenant } from "@/types";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const formData = await req.formData();
    const createdById = formData.get("createdById") as string;
    const agency_name = formData.get("agency_name") as string;
    const agency_email = formData.get("agency_email") as string;
    const agency_password = formData.get("agency_password") as string;
    const colors = JSON.parse(formData.get("branding") as string);

    const businessdetails = JSON.parse(
      formData.get("businessdetails") as string,
    );

    const {
      email,
      password,
      service,
      business_name,
      tagline,
      industry,
      founded_year,
      about,
      public_email,
      phone,
      headquarters,
      brand_name,
      tenantId,
      lang,
      business_url,
      primary_domain,
      businessType,
      globalStyle,
    } = businessdetails;

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
    let tenant: Tenant | null = null;
    if (agency_name && agency_email && agency_password) {
      tenant = await tenantService.createTenant({
        name: agency_name,
        email: agency_email,
        plan: "trial",
        createdById: createdById,
        businessdetails: {
          tagline,
          founded_year,
          about,
          public_email,
          phone,
          headquarters,
          brand_name,
        },
        type: "agency",
      });

      const agencyid = String(tenant?._id);

      if (logo) {
        const buffer = Buffer.from(await logo.arrayBuffer());

        const fileName = generateFileName(logo.name);
        const key = `${agencyid}/logo/${fileName}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: logo.type,
          }),
        );

        logo_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      }

      const newBusinessDetails = {
        tagline,
        founded_year,
        about,
        public_email,
        phone,
        headquarters,
        brand_name,
        logo: logo_url,
      };

      await tenantService.updateTenant(agencyid, {
        businessdetails: newBusinessDetails,
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

    const businessTenant = await tenantService.createTenant({
      name: business_name,
      email: email,
      plan: "trial",
      createdById: createdById,
      branding: branding,
      businessdetails: {
        tagline,
        industry,
        founded_year,
        about,
        public_email,
        phone,
        headquarters,
        brand_name,
        businessType,
      },
      type: "business",
      tenantId: createByTenant,
    });

    const id = String(businessTenant._id);
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
        }),
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
      tenantId: businessTenant._id,
    });

    const primaryDomain = [
      `${business_url}.kalptree.xyz`,
      `${business_url}.localhost:55803`,
      ...primary_domain,
    ];

    const finalDomain = new Set([...primaryDomain]);

    const website = {
      name: business_name,
      serviceType: service ?? "WEBSITE_ONLY",
      primaryDomain: [...finalDomain],
      systemSubdomain: `${business_url}.kalptree.xyz`,
      lang,
      isComingSoon: true,
      globalStyle: globalStyle,
      branding: colors,
    };

    await tenantService.updateTenant(id, {
      website: website,
    });

    // const website = await websiteService.create({
    // tenantId: businessTenant._id,
    // name: business_name,
    // serviceType: service ?? "WEBSITE_ONLY",
    // primaryDomain: [...finalDomain],
    // systemSubdomain: `${business_url}.kalptree.xyz`,
    // lang,
    // isComingSoon: true,
    //   // isHomePage:true
    // });

    const pageColl = await getCollection("pages");

    const mappedValue = demoPages.map((d) => {
      return {
        ...d,
        tenantId: new ObjectId(String(businessTenant._id)),
        // websiteId: new ObjectId(String(website._id)),
        seo: {
          title: d.title,
          slug: d.slug,
          metaDescription: "",
          focusKeywords: [
            {
              keyword: "",
              isSelected: false,
            },
          ],
          hideFromSearchResults: false,
          inNavigation: false,
          isHomePage: true,
        },
      };
    });

    const page = await pageColl.insertMany(mappedValue);

    return NextResponse.json({
      ok: true,
      agency: tenant,
      business: businessTenant,
      website: website,
      tenantId: String(businessTenant._id),
      tenantSlug: businessTenant.slug,
      websiteId: businessTenant._id,
      message: `${message}Business Created`,
      page: page.insertedCount,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal error" },
      { status: 500 },
    );
  }
}
