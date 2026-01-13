// import { NextResponse } from "next/server";
// import { tenantService } from "@/lib/tenant/tenant-service";
// import { userService } from "@/lib/auth/user-service";
// import { websiteService } from "@/lib/websites/website-service";

// import { generateFileName, s3 } from "@/lib/utils";
// import { PutObjectCommand } from "@aws-sdk/client-s3";

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const createdById = formData.get("createdById") as string;
//     const agency_name = formData.get("agency_name") as string;
//     const agency_email = formData.get("agency_email") as string;
//     const agency_password = formData.get("agency_password") as string;

//     const businessdetails = JSON.parse(
//       formData.get("businessdetails") as string
//     );

//     const { email, password, service, business_name, businsess_url } =
//       businessdetails;

//     const branding = JSON.parse(formData.get("branding") as string);
//     const logo = formData.get("logo") as File | null;

//     let createByTenant = "";

//     let logo_url = "";

//     if (agency_name && agency_email && agency_password) {
//       const tenant = await tenantService.createTenant({
//         name: agency_name,
//         email: agency_email,
//         plan: "trial",
//         createdById: createdById,
//         branding: branding,
//         businessdetails: businessdetails,
//         type: "agency",
//       });

//       const agencyid = String(tenant._id);

//       if (logo) {
//         const buffer = Buffer.from(await logo.arrayBuffer());

//         const fileName = generateFileName(logo.name);
//         const key = `${agencyid}/${fileName}`;

//         await s3.send(
//           new PutObjectCommand({
//             Bucket: process.env.AWS_S3_BUCKET!,
//             Key: key,
//             Body: buffer,
//             ContentType: logo.type,
//           })
//         );

//         logo_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
//       }

//       const newBranding = {
//         ...branding,
//         logo: logo_url,
//       };

//       await tenantService.updateTenant(agencyid, {
//         branding: newBranding,
//       });

//       createByTenant = agencyid;

//       const t = await userService.createUser({
//         email: agency_email,
//         password: agency_password,
//         name: agency_name,
//         role: "agency",
//         createdById: createdById,
//         tenantId: tenant._id,
//       });
//     }

//     const tenant = await tenantService.createTenant({
//       name: business_name,
//       email: email,
//       plan: "trial",
//       createdById: createdById,
//       branding: branding,
//       businessdetails: businessdetails,
//       type: "business",
//       tenantId: createByTenant,
//     });

//     const id = String(tenant._id);
//     let logoUrl = "";
//     if (logo) {
//       const buffer = Buffer.from(await logo.arrayBuffer());
//       const fileName = generateFileName(logo.name);
//       const key = `${id}/${fileName}`;

//       await s3.send(
//         new PutObjectCommand({
//           Bucket: process.env.AWS_S3_BUCKET!,
//           Key: key,
//           Body: buffer,
//           ContentType: logo.type,
//         })
//       );

//       logoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
//     }

//     const newBranding = {
//       ...branding,
//       logo: logoUrl,
//     };

//     await tenantService.updateTenant(id, {
//       branding: newBranding,
//     });

//     const t = await userService.createUser({
//       email: email,
//       password: password,
//       name: business_name,
//       role: "business",
//       createdById: createdById,
//       tenantId: tenant._id,
//     });

//     const primaryDomain = [businsess_url];

//     const website = await websiteService.create({
//       tenantId: tenant._id,
//       name: business_name,
//       serviceType: service ?? "WEBSITE_ONLY",
//       primaryDomain: primaryDomain,
//     });

//     return NextResponse.json({
//       ok: true,
//       tenantId: String(tenant._id),
//       tenantSlug: tenant.slug,
//       websiteId: website.websiteId,
//     });
//   } catch (e) {
//     return NextResponse.json(
//       { ok: false, error: e instanceof Error ? e.message : "Internal error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { tenantService } from "@/lib/tenant/tenant-service";
import { userService } from "@/lib/auth/user-service";
import { websiteService } from "@/lib/websites/website-service";

import { generateFileName, s3 } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  console.log("🚀 POST /api/tenant/create — request received");

  try {
    const formData = await req.formData();
    console.log("📦 FormData received");

    const createdById = formData.get("createdById") as string;
    const agency_name = formData.get("agency_name") as string;
    const agency_email = formData.get("agency_email") as string;
    const agency_password = formData.get("agency_password") as string;

    console.log("👤 Creator ID:", createdById);
    console.log("🏢 Agency details:", {
      agency_name,
      agency_email,
      hasPassword: !!agency_password,
    });

    const businessdetails = JSON.parse(
      formData.get("businessdetails") as string
    );

    console.log("🏪 Business details:", businessdetails);

    const { email, password, service, business_name, businsess_url } =
      businessdetails;

    const branding = JSON.parse(formData.get("branding") as string);
    console.log("🎨 Branding data:", branding);

    const logo = formData.get("logo") as File | null;
    console.log("🖼️ Logo received:", logo ? logo.name : "No logo");

    let createByTenant = "";
    let logo_url = "";

    /**
     * ---------------------------
     * CREATE AGENCY TENANT
     * ---------------------------
     */
    if (agency_name && agency_email && agency_password) {
      console.log("🏗️ Creating agency tenant...");

      const tenant = await tenantService.createTenant({
        name: agency_name,
        email: agency_email,
        plan: "trial",
        createdById,
        branding,
        businessdetails,
        type: "agency",
      });

      const agencyid = String(tenant._id);
      console.log("✅ Agency tenant created:", agencyid);

      if (logo) {
        console.log("⬆️ Uploading agency logo to S3...");

        const buffer = Buffer.from(await logo.arrayBuffer());
        const fileName = generateFileName(logo.name);
        const key = `${agencyid}/${fileName}`;

        console.log("🗂️ S3 Key:", key);

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: logo.type,
          })
        );

        logo_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        console.log("✅ Agency logo uploaded:", logo_url);
      }

      const newBranding = {
        ...branding,
        logo: logo_url,
      };

      await tenantService.updateTenant(agencyid, {
        branding: newBranding,
      });

      console.log("🎨 Agency branding updated");

      createByTenant = agencyid;

      const agencyUser = await userService.createUser({
        email: agency_email,
        password: agency_password,
        name: agency_name,
        role: "agency",
        createdById,
        tenantId: tenant._id,
      });

      console.log("👤 Agency user created:", agencyUser?._id);
    }

    /**
     * ---------------------------
     * CREATE BUSINESS TENANT
     * ---------------------------
     */
    console.log("🏗️ Creating business tenant...");

    const tenant = await tenantService.createTenant({
      name: business_name,
      email,
      plan: "trial",
      createdById,
      branding,
      businessdetails,
      type: "business",
      tenantId: createByTenant,
    });

    const id = String(tenant._id);
    console.log("✅ Business tenant created:", id);

    let logoUrl = "";

    if (logo) {
      console.log("⬆️ Uploading business logo to S3...");

      const buffer = Buffer.from(await logo.arrayBuffer());
      const fileName = generateFileName(logo.name);
      const key = `${id}/${fileName}`;

      console.log("🗂️ S3 Key:", key);

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: logo.type,
        })
      );

      logoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      console.log("✅ Business logo uploaded:", logoUrl);
    }

    const newBranding = {
      ...branding,
      logo: logoUrl,
    };

    await tenantService.updateTenant(id, {
      branding: newBranding,
    });

    console.log("🎨 Business branding updated");

    const businessUser = await userService.createUser({
      email,
      password,
      name: business_name,
      role: "business",
      createdById,
      tenantId: tenant._id,
    });

    console.log("👤 Business user created:", businessUser?._id);

    /**
     * ---------------------------
     * CREATE WEBSITE
     * ---------------------------
     */
    const primaryDomain = [businsess_url];
    console.log("🌐 Creating website with domain:", primaryDomain);

    const website = await websiteService.create({
      tenantId: tenant._id,
      name: business_name,
      serviceType: service ?? "WEBSITE_ONLY",
      primaryDomain,
    });

    console.log("✅ Website created:", website.websiteId);

    return NextResponse.json({
      ok: true,
      tenantId: String(tenant._id),
      tenantSlug: tenant.slug,
      websiteId: website.websiteId,
    });
  } catch (e) {
    console.error("❌ ERROR in tenant creation API:", e);

    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Internal error",
      },
      { status: 500 }
    );
  }
}
