import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export function generateFileName(originalName: string) {
  const ext = originalName.split(".").pop()?.toLowerCase() || "png";

  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // replace spaces & special chars
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "")
    .replace("T", "-")
    .slice(0, 15); // YYYY-MM-DD-HHMMSS

  return `${baseName}-${timestamp}.${ext}`;
}

const ROLE_MAP = {
  superadmin: "",
  agency: "",
  business: "",
} as const;

type Role = keyof typeof ROLE_MAP;

export function toCreateHref(
  url: string,
  tenantId: string | null = null,
  businessId: string | null = null,
  role: string,
) {
  if (!(role in ROLE_MAP)) {
    throw new Error("Invalid role");
  }
  const obj: Record<Role, string> = {
    superadmin: `/admin/websites/${url}?businessid=${businessId}&tenantId=${tenantId}`,
    agency: `/admin/websites/${url}?businessid=${businessId}`,
    business: `/admin/websites/${url}`,
  };

  return obj[role as Role];
}

export const buildWebsiteHref = (
  href: string,
  websiteId: string | undefined | string[],
  arr: Record<string, string>,
) => {
  if (!websiteId) return href;

  const clean = href.replace(/^\/admin/, "");
  let main = "?";
  const keys = Object.keys(arr);

  if (keys.length > 0) {
    keys.forEach((key, index) => {
      main += `${key}=${arr[key]}`;
      if (index !== keys.length - 1) {
        main += "&";
      }
    });
  }

  const final = main !== "?" ? main : "";

  return `/admin/websites/${websiteId}${clean}${final}`;
};

export function formatBrandSlug(brand: string) {
  if (!brand) return "";

  // Convert to lowercase
  let cleaned = brand.toLowerCase();

  // Replace special characters with space (keep letters & numbers)
  cleaned = cleaned.replace(/[^a-z0-9]+/g, " ");

  // Split into words
  const words = cleaned.trim().split(/\s+/);

  // Take last two meaningful parts
  const result = words.join("-");

  return result;
}

export async function uploadBase64ToS3(base64: string) {
  const [meta, data] = base64.split(",");
  const mime = meta.match(/:(.*?);/)?.[1];

  if (!mime) throw new Error("Invalid base64 image");

  const buffer = Buffer.from(data, "base64");
  const ext = mime.split("/")[1];
  const key = `products/${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: mime,
    }),
  );

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

export const CSVProcessing = (t: any) => {
  let variant = t.filter((d: any) => !Boolean(d.product_title));
  let product = t
    .filter((d: any) => Boolean(d.product_title))
    .map((product: any) => {
      const options: any = [];

      Object.keys(product).forEach((key) => {
        if (key.startsWith("option_id_")) {
          const index = key.split("_").pop(); // "1", "2", "3"

          const id = product[`option_id_${index}`];
          const value = product[`option_value_${index}`];
          const unit = product[`option_unit_${index}`];

          options.push({
            id,
            values: value?.includes(",") ? value.split(",") : value,
            ...(unit ? { unit } : {}),
          });
        }
      });

      const filterVariantData = variant
        .filter((d: any) => d.product_type == product.product_type)
        .map((attr: any) => {
          let attributes: any = [];

          Object.keys(attr).forEach((key) => {
            if (key.startsWith("attribute_id_")) {
              const index = key.split("_").pop(); // "1", "2", "3"

              const id = attr[`attribute_id_${index}`];
              const value = attr[`attribute_value_${index}`];

              attributes.push({
                id,
                value: value?.includes(",") ? value.split(",") : value,
              });
            }
          });
          return {
            price: attr.variant_price,
            stock: attr.variant_stock,
            sku: attr.variant_sku,
            attributes,
          };
        });

      return {
        title: product.product_title,
        basePrice: product.base_price,
        description: product.description,
        segmentType: product.segment_type,
        categories: product.category_id,
        brands: product.brand,
        options,
        variant: filterVariantData,
      };
    });

  return product;
};

export function buildCategoryTree(categories: any) {
  const map: any = {};
  const roots: any = [];

  categories.forEach((cat: any) => {
    map[cat._id] = { ...cat, children: [] };
  });

  categories.forEach((cat: any) => {
    if (cat.parentCategoryId && map[cat.parentCategoryId]) {
      map[cat.parentCategoryId].children.push(map[cat._id]);
    } else {
      roots.push(map[cat._id]);
    }
  });

  return roots;
}

export function extractHtmlParts(html: string) {
  let styles = "";
  let scripts: string[] = [];
  let body = html;

  // 1. Extract all <style> tags
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);

  if (styleMatches) {
    styles = styleMatches
      .map((tag) => tag.replace(/<\/?style[^>]*>/gi, ""))
      .join("\n");

    // Remove styles from HTML
    body = body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  }

  // 2. Extract all <script> tags
  const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);

  if (scriptMatches) {
    scripts = scriptMatches
      .map((scriptTag) => {
        // Skip external scripts (those with src attribute)
        if (scriptTag.includes("src=")) return "";
        const inner = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        return inner ? inner[1].trim() : "";
      })
      .filter((script) => script.trim());

    // Remove scripts from HTML
    body = body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  }

  // 3. Remove <body> wrapper if present
  body = body.replace(/<\/?body[^>]*>/gi, "").trim();

  return { styles, body, scripts };
}

export const extractScripts = (html: string): string => {
  const { scripts } = extractHtmlParts(html);
  return scripts.join("\n");
};


export const extractStyles = (htmlContent: string): string => {
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const styles: string[] = [];
  let match;

  while ((match = styleRegex.exec(htmlContent)) !== null) {
    if (match[1]) {
      styles.push(match[1]);
    }
  }

  return styles.join('\n');
};


export function groupAttributesByTitle(data:any) {
  const map = new Map();

  data.forEach((item:any) => {
    const title = item.title;
    const values = item.values || [];

    if (!map.has(title)) {
      map.set(title, new Set());
    }

    values.forEach((value:any) => {
      if (typeof value === "string") {
        map.get(title).add(value.trim());
      }
    });
  });

  return Array.from(map.entries()).map(([title, valuesSet]) => ({
    title,
    values: Array.from(valuesSet)
  }));
}
