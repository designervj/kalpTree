import { MaterialAttributes } from "@/components/admin/attribute/types/attributeModel";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "product_attributes";

const toObjectId = (id: string | ObjectId) =>
  typeof id === "string" ? new ObjectId(id) : id;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getAttributeById(
  id: string | ObjectId
): Promise<MaterialAttributes | null> {
  const db = await getDatabase();
  const col = db.collection<MaterialAttributes>(COLLECTION);

  return col.findOne({ _id: toObjectId(id) } as any);
}

export async function updateAttribute(
  id: string | ObjectId,
  data: Partial<MaterialAttributes>
): Promise<MaterialAttributes | null> {
  const db = await getDatabase();
  const col = db.collection<MaterialAttributes>(COLLECTION);

  if (data.name) data.name = data.name.trim();

  const _id = toObjectId(id);

  const updateResult = await col.updateOne(
    { _id } as any,
    { $set: { ...data, updatedAt: new Date() } } as any
  );

  if (updateResult.matchedCount === 0) return null;

  return col.findOne({ _id } as any);
}

export async function createAttribute(
  data: MaterialAttributes
): Promise<MaterialAttributes> {
  if (!data?.name?.trim()) throw new Error("Name is required");

  const db = await getDatabase();
  const col = db.collection<MaterialAttributes>(COLLECTION);

  // prevent duplicate name (case-insensitive) for the same websiteId
  const exists = await col.findOne({
    name: { $regex: `^${escapeRegExp(data.name)}$`, $options: "i" },
    websiteId: data.websiteId,
  } as any);
  if (exists)
    throw new Error("Attribute with same name already exists for this website");

  const now = new Date();

  const doc: any = {
    ...data,
    category_id: data.category_id?.map((d) => {
      return new ObjectId(String(d));
    }),
    name: data.name.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as any);
  return { ...doc, _id: result.insertedId } as MaterialAttributes;
}

export async function deleteAttribute(id: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const col = db.collection<MaterialAttributes>(COLLECTION);

  const _id = toObjectId(id);
  const result = await col.deleteOne({ _id } as any);
  return result.deletedCount === 1;
}

export async function listAttributes(
  websiteId: string
): Promise<MaterialAttributes[]> {
  const db = await getDatabase();
  const col = db.collection<MaterialAttributes>(COLLECTION);
  const filter: any = {};
  if (websiteId) {
    // websiteId is stored as string in the database, not ObjectId
    filter.websiteId = websiteId;
  }
  // return col.find(filter).sort({ name: 1 }).toArray();
  return col.find().sort({ name: 1 }).toArray();
}
