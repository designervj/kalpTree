import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "product_types";

export type ProductType = {
  _id?: ObjectId;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const toObjectId = (id: string | ObjectId) =>
  typeof id === "string" ? new ObjectId(id) : id;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function createProductType(
  data: ProductType,
): Promise<ProductType> {
  if (!data?.name?.trim()) throw new Error("Name is required");
  if (!data?.slug?.trim()) throw new Error("Slug is required");

  const db = await getDatabase();
  const col = db.collection<ProductType>(COLLECTION);

  // Prevent duplicate name (case-insensitive)
  const existsByName = await col.findOne({
    name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
  });
  if (existsByName)
    throw new Error("Product type with same name already exists");

  // Prevent duplicate slug (case-insensitive)
  const existsBySlug = await col.findOne({
    slug: { $regex: `^${escapeRegExp(data.slug)}$`, $options: "i" },
  });
  if (existsBySlug)
    throw new Error("Product type with same slug already exists");

  const now = new Date();

  const doc: ProductType = {
    ...data,
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as any);

  return { ...doc, _id: result.insertedId };
}

export async function getProductTypeById(
  id: string | ObjectId,
): Promise<ProductType | null> {
  const db = await getDatabase();
  const col = db.collection<ProductType>(COLLECTION);

  return col.findOne({ _id: toObjectId(id) });
}

export async function getProductTypeBySlug(
  slug: string,
): Promise<ProductType | null> {
  const db = await getDatabase();
  const col = db.collection<ProductType>(COLLECTION);

  return col.findOne({
    slug: { $regex: `^${escapeRegExp(slug)}$`, $options: "i" },
  });
}

export async function listProductTypes(): Promise<ProductType[]> {
  const db = await getDatabase();
  const col = db.collection<ProductType>(COLLECTION);

  const data = await col.find().sort({ name: 1 }).toArray();

  return data;
}

export async function updateProductType(
  id: string | ObjectId,
  data: Partial<ProductType>,
): Promise<ProductType | null> {
  const db = await getDatabase();
  const col = db.collection<ProductType>(COLLECTION);

  const _id = toObjectId(id);

  // Check if name is being updated and if it conflicts
  if (data.name) {
    data.name = data.name.trim();

    const existsByName = await col.findOne({
      _id: { $ne: _id },
      name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
    });
    if (existsByName)
      throw new Error("Product type with same name already exists");
  }

  // Check if slug is being updated and if it conflicts
  if (data.slug) {
    data.slug = data.slug.trim().toLowerCase();

    const existsBySlug = await col.findOne({
      _id: { $ne: _id },
      slug: { $regex: `^${escapeRegExp(data.slug)}$`, $options: "i" },
    });
    if (existsBySlug)
      throw new Error("Product type with same slug already exists");
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
    return null; // not found
  }

  return col.findOne({ _id });
}

export async function deleteProductType(
  id: string | ObjectId,
): Promise<boolean> {
  const db = await getDatabase();
  const col = db.collection<ProductType>(COLLECTION);

  const _id = toObjectId(id);
  const result = await col.deleteOne({ _id });
  return result.deletedCount === 1;
}
