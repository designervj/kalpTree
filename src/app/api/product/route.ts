import { getDatabase } from "@/lib/db/mongodb";
import { uploadBase64ToS3 } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const jsondata = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const websiteId = searchParams.get("websiteId");

    if (!tenantId || !websiteId) {
      return NextResponse.json({
        success: false,
        message: "Not Allowed to Add Product Without TenantId and WebsiteId",
      });
    }

    if (!jsondata)
      return NextResponse.json({
        success: false,
        message: "Product Not Added",
      });

    const db = await getDatabase();
    const products = db.collection("products");
    const variants = db.collection("product_variants");

    const {
      title,
      basePrice,
      description,
      categories,
      brands,
      tags,
      options,
      images,
    } = jsondata.productdata;

    let imageUrls: string[] = [];

    if (images?.length > 0) {
      try {
        imageUrls = await Promise.all(
          images.map((img: string) => uploadBase64ToS3(img))
        );
      } catch (err) {
        return NextResponse.json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    if (imageUrls.length > 0) {
      jsondata.productdata.images = imageUrls;
    }

    if (!title || !basePrice || !categories || options.length <= 0) {
      return NextResponse.json({
        success: false,
        message: "Please Input Everything Needed",
      });
    }

    const productresponse = await products.insertOne({
      title,
      categories,
      brands,
      tags,
      options,
      imageUrls,
      description,
      basePrice,
      websiteId: new ObjectId(websiteId),
      tenantId: new ObjectId(tenantId),
    });

    const productvariants = jsondata.variantData;

    if (productvariants.length > 0) {
      const check = productvariants.every((d: any) => {
        return d.sku && d.price && d.attributes.length > 0;
      });

      if (!check) {
        await products.deleteOne({ _id: productresponse.insertedId });

        return NextResponse.json({
          success: false,
          message: "Issue in Variants",
        });
      }

      const finalVariants = productvariants.map((d: any) => ({
        ...d,
        productId: productresponse.insertedId,
        createdAt: new Date(),
      }));

      const variantResponse = await variants.insertMany(finalVariants);

      if (variantResponse.insertedCount !== finalVariants.length) {
        await products.deleteOne({ _id: productresponse.insertedId });

        const insertedIds = Object.values(variantResponse.insertedIds);

        if (insertedIds.length > 0) {
          await variants.deleteMany({
            _id: { $in: insertedIds },
          });
        }

        return NextResponse.json({
          success: false,
          message: "Variant insert mismatch",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product Added Successfully",
      data: productresponse.insertedId,
    });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
