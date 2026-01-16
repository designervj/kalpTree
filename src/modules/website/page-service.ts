import { ObjectId } from "mongodb";
import { Filter } from "mongodb";

import { getDatabase } from "@/lib/db/mongodb";
import type { Page } from "./types";
import { BaseDocument } from "@/types";

export class PageService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Page>("pages");
  }

  async getPageBySlug(
    tenantId: string | ObjectId,
    slug: string
  ): Promise<Page | null> {
    const collection = await this.getCollection();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    return collection.findOne({ tenantId: tid, slug, status: "published" });
  }

  async getBySlugForWebsite(
    tenantId: string | ObjectId,
    slug: string,
    websiteId?: string | ObjectId
  ): Promise<Page | null> {
    const col = await this.getCollection();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId
      ? typeof websiteId === "string"
        ? new ObjectId(websiteId)
        : websiteId
      : undefined;
    const query: Filter<Page> = {
      tenantId: tid,
      slug,
      status: "published",
    } as any;
    if (wid)
      (query as any).$or = [
        { websiteId: wid },
        { websiteId: { $exists: false } },
      ];
    return col.findOne(query);
  }

  async getById(
    tenantId: string | ObjectId,
    id: string | ObjectId,
    websiteId?: string | ObjectId
  ): Promise<Page | null> {
    const col = await this.getCollection();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const oid = typeof id === "string" ? new ObjectId(id) : id;
    const wid = websiteId
      ? typeof websiteId === "string"
        ? new ObjectId(websiteId)
        : websiteId
      : undefined;
    const query: Filter<Page> = { _id: oid, tenantId: tid } as any;
    if (wid)
      (query as any).$or = [
        { websiteId: wid },
        { websiteId: { $exists: false } },
      ];
    return col.findOne(query);
  }

  async listPages(
    tenantId: string | ObjectId,
    websiteId?: string | ObjectId
  ): Promise<Page[]> {
    const collection = await this.getCollection();

    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId
      ? typeof websiteId === "string"
        ? new ObjectId(websiteId)
        : websiteId
      : undefined;
    const query: any = { tenantId: tid };
    if (wid)
      query.$or = [{ websiteId: wid }, { websiteId: { $exists: false } }];
    return collection.find(query).sort({ createdAt: -1 }).toArray();
  }

  async createPage(
    tenantId: string | ObjectId,
    data: Omit<Page, keyof BaseDocument>,
    websiteId?: string | ObjectId
  ): Promise<Page> {
    const collection = await this.getCollection();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId
      ? typeof websiteId === "string"
        ? new ObjectId(websiteId)
        : websiteId
      : undefined;
    const page: Omit<Page, "_id"> = {
      ...data,
      tenantId: tid,
      ...(wid ? { websiteId: wid } : {}),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(page as Page);
    return { ...page, _id: result.insertedId } as Page;
  }

  async updatePage(
    id: string | ObjectId,
    tenantId: string | ObjectId,
    // updates: Partial<Page>
    updates: string
  ): Promise<boolean> {
    const collection = await this.getCollection();
    const oid = typeof id === "string" ? new ObjectId(id) : id;
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    // const result = await collection.updateOne(
    //   { _id: oid, tenantId: tid },
    //   {
    //     $set: {
    //       ...updates,
    //       updatedAt: new Date(),
    //     },
    //   }
    // );

    const result = await collection.updateOne(
      { _id: oid, tenantId: tid },
      { $set: { content: updates } }
    );
    return result.modifiedCount > 0;
  }

  async deletePage(
    id: string | ObjectId,
    tenantId: string | ObjectId
  ): Promise<boolean> {
    const collection = await this.getCollection();
    const oid = typeof id === "string" ? new ObjectId(id) : id;
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const result = await collection.deleteOne({ _id: oid, tenantId: tid });
    return result.deletedCount > 0;
  }
}

export const pageService = new PageService();
