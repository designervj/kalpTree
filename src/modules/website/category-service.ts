import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';
import type { Category } from './types';

export class WebsiteCategoryService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Category>('categories');
  }

  async getBySlug(tenantId: string | ObjectId, slug: string): Promise<Category | null> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return col.findOne({ tenantId: tid, slug });
  }

  async list(tenantId: string | ObjectId, websiteId?: string | ObjectId): Promise<Category[]> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const query: any = { tenantId: tid };
    if (wid) query.$or = [{ websiteId: wid }, { websiteId: { $exists: false } }];
    return col.find(query).sort({ name: 1 }).toArray();
  }

  async create(tenantId: string | ObjectId, data: Omit<Category, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>, websiteId?: string | ObjectId): Promise<Category> {
    const col = await this.getCollection();
    console.log("col---", col)
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const doc: Omit<Category, '_id'> = { ...data, tenantId: tid, ...(wid ? { websiteId: wid } : {}), createdAt: new Date(), updatedAt: new Date() };
    const r = await col.insertOne(doc as Category);
    return { ...doc, _id: r.insertedId } as Category;
  }
}

export const websiteCategoryService = new WebsiteCategoryService();
