import { MaterialBrandModel } from "@/components/admin/brand/types/brandModel";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "product_brands";

const toObjectId = (id: string | ObjectId) =>
  typeof id === "string" ? new ObjectId(id) : id;

const escapeRegExp = (s: string) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getBrandById(
  id: string | ObjectId
): Promise<MaterialBrandModel | null> {
  const db = await getDatabase();
  const col = db.collection<MaterialBrandModel>(COLLECTION);

  return col.findOne({ _id: toObjectId(id) } as any);
}

export async function updateBrand(
  id: string | ObjectId,
  data: Partial<MaterialBrandModel>
): Promise<MaterialBrandModel | null> {
  const db = await getDatabase();
  const col = db.collection<MaterialBrandModel>(COLLECTION);

  if (data.name) data.name = data.name.trim();

  const _id = toObjectId(id);

  const updateResult = await col.updateOne(
    { _id } as any,
    { $set: { ...data, updatedAt: new Date() } } as any
  );

  if (updateResult.matchedCount === 0) return null;

  return col.findOne({ _id } as any);
}


export async function createBrand(
  data: MaterialBrandModel
): Promise<MaterialBrandModel> {
  if (!data?.name?.trim()) throw new Error("Name is required");

  const db = await getDatabase();
  const col = db.collection<MaterialBrandModel>(COLLECTION);

  // prevent duplicate name (case-insensitive)
  const exists = await col.findOne({
    name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
  } as any);
  if (exists) throw new Error("Brand with same name already exists");

  const now = new Date();

  const doc: any = {
    ...data,

    name: data.name.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as any);
  return { ...doc, _id: result.insertedId } as MaterialBrandModel;
}


export async function deleteBrand(
  id: string | ObjectId
): Promise<boolean> {
  const db = await getDatabase();
  const col = db.collection<MaterialBrandModel>(COLLECTION);

  const _id = toObjectId(id);
  const result = await col.deleteOne({ _id } as any);
  return result.deletedCount === 1;
}


export async function listBrands(websiteId: string): Promise<MaterialBrandModel[]> {
  const db = await getDatabase();
  const col = db.collection<MaterialBrandModel>(COLLECTION);
  const filter: any = {};
  if (websiteId) {
    // websiteId is stored as string in the database, not ObjectId
    filter.websiteId = websiteId;
  }
  return col.find(filter).sort({ name: 1 }).toArray();
}
