import { ProductModel } from "@/components/admin/product/type/ProductModel";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "products";

const toObjectId = (id: string | ObjectId) =>
  typeof id === "string" ? new ObjectId(id) : id;

const escapeRegExp = (s: string) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getProductById(
  id: string | ObjectId
): Promise<ProductModel | null> {
  const db = await getDatabase();
  const col = db.collection<ProductModel>(COLLECTION);

  return col.findOne({ _id: toObjectId(id) } as any);
}

export async function updateProduct(
  id: string | ObjectId,
  data: Partial<ProductModel>
): Promise<ProductModel | null> {
  const db = await getDatabase();
  const col = db.collection<ProductModel>(COLLECTION);

  if (data.name) data.name = data.name.trim();

  const _id = toObjectId(id);

  const updateResult = await col.updateOne(
    { _id } as any,
    { $set: { ...data, updated_at: new Date() } } as any
  );

  if (updateResult.matchedCount === 0) return null;

  return col.findOne({ _id } as any);
}

export async function createProduct(
  data: ProductModel
): Promise<ProductModel> {
  if (!data?.name?.trim()) throw new Error("Name is required");
  
  const db = await getDatabase();
  const col = db.collection<ProductModel>(COLLECTION);

  // prevent duplicate name (case-insensitive)
  const exists = await col.findOne({
    name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
  } as any);
  if (exists) throw new Error("Product with same name already exists");

  const now = new Date();

  const doc: any = {
    ...data,
    name: data.name.trim(),
    created_at: now.toISOString(),
  };

  const result = await col.insertOne(doc as any);
  return { ...doc, _id: result.insertedId } as ProductModel;
}

export async function deleteProduct(
  id: string | ObjectId
): Promise<boolean> {
  const db = await getDatabase();
  const col = db.collection<ProductModel>(COLLECTION);

  const _id = toObjectId(id);
  const result = await col.deleteOne({ _id } as any);
  return result.deletedCount === 1;
}

export async function listProducts(websiteId: string): Promise<ProductModel[]> {
  const db = await getDatabase();
  const col = db.collection<ProductModel>(COLLECTION);
  const filter: any = {};
  if (websiteId) {
    // websiteId is stored as string in the database, not ObjectId
    filter.websiteId = websiteId;
  }
  return col.find(filter).sort({ name: 1 }).toArray();
}
