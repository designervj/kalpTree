import { NextResponse } from "next/server";
import { s3 } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { tenantService } from "@/lib/tenant/tenant-service";

export async function POST(req: Request) {
  try {
    const { tenantId, brandingData } = await req.json();
    const variants = ["primary", "favicon", "dark", "light"] as const;

    for (const key of variants) {
      const variantData = brandingData[key];

      // Since JSON.stringify strips File objects, we check if src is a base64 string from the preview
      if (variantData.src && variantData.src.startsWith("data:image")) {
        const [meta, data] = variantData.src.split(",");
        const mime = meta.match(/:(.*?);/)?.[1] || "image/png";
        const buffer = Buffer.from(data, "base64");

        // Use a generic name if file info is lost in JSON serialization
        const extension = mime.split("/")[1] || "png";
        const fileName = `${key}_${Date.now()}.${extension}`;
        const s3Key = `${tenantId}/logo/${fileName}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: s3Key,
            Body: buffer,
            ContentType: mime,
          }),
        );

        // Update the src to the S3 URL
        variantData.src = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${s3Key}`;
      }
    }

    // update the branding data in the database
    const tenant = await tenantService.updateTenant(tenantId, {
      branding: brandingData,
    });

    return NextResponse.json(
      { success: true, message: "Logos uploaded successfully", brandingData },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Logo upload API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload logos" },
      { status: 500 },
    );
  }
}
