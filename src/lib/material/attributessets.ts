import { AttributeSet } from "@/components/admin/attributessets/forms/AttributeSetsForm";
import { MaterialCategory } from "@/components/admin/category/types/CategoryModel";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "business_type";

const toObjectId = (id: string | ObjectId) =>
  typeof id === "string" ? new ObjectId(id) : id;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function createAttributessets(
  data: AttributeSet,
): Promise<AttributeSet> {
  if (!data?.name?.trim()) throw new Error("Name is required");

  const db = await getDatabase();
  const col = db.collection<AttributeSet>(COLLECTION);

  const now = new Date();

  const { attributes, categoryId, name, sort_order, tenantId, websiteId } =
    data;

  const doc: AttributeSet = {
    ...data,
    name: data.name.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as any);

  return { ...doc, _id: result.insertedId };
}

export async function getAttributeSetsById(
  id: string | ObjectId,
): Promise<AttributeSet | null> {
  const db = await getDatabase();
  const col = db.collection<AttributeSet>(COLLECTION);

  return col.findOne({ _id: toObjectId(id) });
}

export async function listAttributeSets(
  websiteId: string,
): Promise<AttributeSet[]> {
  const db = await getDatabase();
  const col = db.collection<AttributeSet>(COLLECTION);

  const filter: any = {};
  if (websiteId) {
    // websiteId is stored as string in the database, not ObjectId
    filter.websiteId = new ObjectId(websiteId);
  }

  // Add Filter for Filtering

  const data = await col.find().sort({ name: 1 }).toArray();

  return data;
}

export async function updateAttributeSets(
  id: string | ObjectId,
  data: Partial<AttributeSet>,
): Promise<MaterialCategory | null> {
  const db = await getDatabase();
  const col = db.collection<AttributeSet>(COLLECTION);

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

export async function deleteAttributeSets(
  id: string | ObjectId,
): Promise<boolean> {
  const db = await getDatabase();
  const col = db.collection<AttributeSet>(COLLECTION);

  const _id = toObjectId(id);
  const result = await col.deleteOne({ _id });
  return result.deletedCount === 1;
}
