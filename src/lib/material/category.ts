import { MaterialCategory } from "@/components/admin/category/types/CategoryModel";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "product_categories";

const toObjectId = (id: string | ObjectId) =>
  typeof id === "string" ? new ObjectId(id) : id;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function createCategory(
  data: MaterialCategory,
): Promise<MaterialCategory> {
  if (!data?.name?.trim()) throw new Error("Name is required");

  const db = await getDatabase();
  const col = db.collection<MaterialCategory>(COLLECTION);

  const now = new Date();

  const doc: MaterialCategory = {
    ...data,
    name: data.name.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as any);

  return { ...doc, _id: result.insertedId };
}

export async function getCategoryById(
  id: string | ObjectId,
): Promise<MaterialCategory | null> {
  const db = await getDatabase();
  const col = db.collection<MaterialCategory>(COLLECTION);

  return col.findOne({ _id: toObjectId(id) });
}

export async function listCategories(
  websiteId: string,
): Promise<MaterialCategory[]> {
  const db = await getDatabase();
  const col = db.collection<MaterialCategory>(COLLECTION);

  const filter: any = {};
  if (websiteId) {
    // websiteId is stored as string in the database, not ObjectId
    filter.websiteId = websiteId;
  }
  // Add Filter If need filtering
  const data = await col.find().sort({ name: 1 }).toArray();

  return data;
}

export async function updateCategory(
  id: string | ObjectId,
  data: Partial<MaterialCategory>,
): Promise<MaterialCategory | null> {
  const db = await getDatabase();
  const col = db.collection<MaterialCategory>(COLLECTION);

  if (data.name) {
    data.name = data.name.trim();

    const exists = await col.findOne({
      _id: { $ne: toObjectId(id) },
      name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
    });
    if (exists) throw new Error("Category with same name already exists");
  }

  const _id = toObjectId(id);

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

export async function deleteCategory(id: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const col = db.collection<MaterialCategory>(COLLECTION);

  const _id = toObjectId(id);
  const result = await col.deleteOne({ _id });
  return result.deletedCount === 1;
}
