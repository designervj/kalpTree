import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "industry_type";

export type ProductTypeCategory = {
  _id?: ObjectId;
  name: string;
  slug: string;
  product_type: string; // ID of product type
  icon?: string;
  sort_order?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const toObjectId = (id: string | ObjectId) =>
  typeof id === "string" ? new ObjectId(id) : id;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function createProductTypeCategory(
  data: ProductTypeCategory,
): Promise<ProductTypeCategory> {
  if (!data?.name?.trim()) throw new Error("Name is required");
  if (!data?.slug?.trim()) throw new Error("Slug is required");
  if (!data?.product_type?.trim()) throw new Error("Product type is required");

  const db = await getDatabase();
  const col = db.collection<ProductTypeCategory>(COLLECTION);

  // Prevent duplicate name within same product type
  const existsByName = await col.findOne({
    product_type: data.product_type,
    name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
  });
  if (existsByName) {
    throw new Error("Category with same name already exists for this product type");
  }

  // Prevent duplicate slug within same product type
  const existsBySlug = await col.findOne({
    product_type: data.product_type,
    slug: { $regex: `^${escapeRegExp(data.slug)}$`, $options: "i" },
  });
  if (existsBySlug) {
    throw new Error("Category with same slug already exists for this product type");
  }

  const now = new Date();

  const doc: ProductTypeCategory = {
    ...data,
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    sort_order: data.sort_order ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as any);

  return { ...doc, _id: result.insertedId };
}

export async function getProductTypeCategoryById(
  id: string | ObjectId,
): Promise<ProductTypeCategory | null> {
  const db = await getDatabase();
  const col = db.collection<ProductTypeCategory>(COLLECTION);

  return col.findOne({ _id: toObjectId(id) });
}

export async function getProductTypeCategoriesByProductType(
  productTypeId: string,
): Promise<ProductTypeCategory[]> {
  const db = await getDatabase();
  const col = db.collection<ProductTypeCategory>(COLLECTION);

  return col
    .find({ product_type: productTypeId })
    .sort({ sort_order: 1, name: 1 })
    .toArray();
}

export async function listProductTypeCategories(): Promise<ProductTypeCategory[]> {
  const db = await getDatabase();
  const col = db.collection<ProductTypeCategory>(COLLECTION);

  return col.find().sort({ product_type: 1, sort_order: 1, name: 1 }).toArray();
}

export async function updateProductTypeCategory(
  id: string | ObjectId,
  data: Partial<ProductTypeCategory>,
): Promise<ProductTypeCategory | null> {
  const db = await getDatabase();
  const col = db.collection<ProductTypeCategory>(COLLECTION);

  const _id = toObjectId(id);

  // Get existing document to check product_type
  const existing = await col.findOne({ _id });
  if (!existing) return null;

  const productType = data.product_type || existing.product_type;

  // Check if name is being updated and if it conflicts
  if (data.name) {
    data.name = data.name.trim();

    const existsByName = await col.findOne({
      _id: { $ne: _id },
      product_type: productType,
      name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
    });
    if (existsByName) {
      throw new Error("Category with same name already exists for this product type");
    }
  }

  // Check if slug is being updated and if it conflicts
  if (data.slug) {
    data.slug = data.slug.trim().toLowerCase();

    const existsBySlug = await col.findOne({
      _id: { $ne: _id },
      product_type: productType,
      slug: { $regex: `^${escapeRegExp(data.slug)}$`, $options: "i" },
    });
    if (existsBySlug) {
      throw new Error("Category with same slug already exists for this product type");
    }
  }

  const updateResult = await col.updateOne(
    { _id },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
  );

  if (updateResult.matchedCount === 0) {
    return null;
  }

  return col.findOne({ _id });
}

export async function deleteProductTypeCategory(
  id: string | ObjectId,
): Promise<boolean> {
  const db = await getDatabase();
  const col = db.collection<ProductTypeCategory>(COLLECTION);

  const _id = toObjectId(id);
  const result = await col.deleteOne({ _id });
  return result.deletedCount === 1;
}