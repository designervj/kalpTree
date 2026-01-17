import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";
import { success } from "zod";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const searchParams = req.nextUrl.searchParams;

    const websiteId = searchParams.get("websiteId");
    const tenantId = searchParams.get("tenantId");

    if (!websiteId || !tenantId) {
      return NextResponse.json({
        success: false,
        message: "Not Authorised to Add",
      });
    }

    const catgeoriesColl = await getCollection("product_categories");
    const attributesColl = await getCollection("product_attributes");
    const productColl = await getCollection("products");
    const variantColl = await getCollection("product_variants");

    const allcategories = await catgeoriesColl
      .find()
      .project({ _id: 1, slug: 1 })
      .toArray();
    const allattributes = await attributesColl
      .find()
      .project({ _id: 1, slug: 1, unit: 1 })
      .toArray();

    const product = [];

    const variantsdb = [];

    for (let i = 0; i < body.length; i++) {
      const singleProduct = body[i];
      const singleCategory = allcategories.find(
        (d) => String(d.slug) == singleProduct.categories,
      );

      singleProduct.categories = singleCategory?._id;

      // Processing Options
      singleProduct.options = singleProduct.options.map((option: any) => {
        const singleAttribute = allattributes.find(
          (attr) => String(attr.slug) == option.id,
        );

        if (singleProduct.variant.length > 0) {
          const variantattributes = singleProduct.variant[0].attributes.find(
            (varattri: any) => {
              return varattri.id == option.id;
            },
          );
          if (variantattributes) {
            option.useForVariants = true;
          } else {
            option.useForVariants = false;
          }
        }

        option.id = singleAttribute?._id;
        option.unit = singleAttribute?.unit ? singleAttribute?.unit : null;

        return {
          ...option,
        };
      });

      const variants = singleProduct.variant;

      delete singleProduct.variant;
      const insertProduct = await productColl.insertOne({
        ...singleProduct,
        tenantId: new ObjectId(tenantId),
        websiteId: new ObjectId(websiteId),
      });
      //   const insertProduct = {
      //     insertedId: `asfasf${i}`,
      //   };

      product.push({ ...singleProduct, _id: insertProduct.insertedId });

      if (insertProduct) {
        let finalvariants = variants.map((vary: any) => {
          let name = vary.attributes.map((d: any) => d.id).join("-");
          let attributesofvariant = vary.attributes.map((varyattr: any) => {
            const singlevaryattr = allattributes.find(
              (attr) => String(attr.slug) == varyattr.id,
            );

            return {
              attributeId: singlevaryattr?._id,
              attributeName: singlevaryattr?.name,
              value: varyattr.value,
              unit: varyattr.unit ? varyattr.unit : null,
            };
          });

          return {
            ...vary,
            attributes: attributesofvariant,
            productId: insertProduct.insertedId,
            tenantId: new ObjectId(tenantId),
            websiteId: new ObjectId(websiteId),
            name: name,
          };
        });

        const insertedVariant = await variantColl.insertMany(finalvariants);
        // const insertedVariant = true;

        if (insertedVariant) {
          variantsdb.push(...finalvariants);
        }
      }
    }
    if (product.length > 0 || variantsdb.length > 0) {
      return NextResponse.json({
        success: true,
        data: {
          product,
          variantsdb,
        },
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error,
    });
  }
}
