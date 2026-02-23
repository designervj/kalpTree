import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/mongodb";

export type ServiceType = "WEBSITE_ONLY" | "ECOMMERCE";

export interface WebsiteDoc {
  _id: ObjectId;
  websiteId: string;
  tenantId: ObjectId;
  name: string;
  serviceType: string;
  primaryDomain?: string[] | null;
  systemSubdomain?: string;
  branding?: {
    // legacy fields
    logoUrl?: string | null;
    colorPaletteJson?: Record<string, unknown> | null;
    headerLayoutId?: string | null;
    footerContentHtml?: string | null;
    // new structured branding
    header?: {
      logoUrl?: string | null;
      navLinks?: { label: string; href: string }[];
    };
    footer?: {
      text?: string | null;
      links?: { label: string; href: string }[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
  lang: any[];
  isComingSoon?: boolean;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

export class WebsiteService {
  private async col() {
    const db = await getDatabase();
    return db.collection<WebsiteDoc>("websites");
  }

  async ensureIndexes() {
    const c = await this.col();
    await Promise.all([
      c.createIndex(
        { websiteId: 1 },
        { unique: true, name: "uniq_websites_id" }
      ),
      c.createIndex(
        { tenantId: 1, createdAt: -1 },
        { name: "websites_tenant_createdAt" }
      ),
      c.createIndex(
        { systemSubdomain: 1 },
        { unique: true, name: "uniq_websites_sys_sub" }
      ),
      // Unique only for actual string domains; avoid indexing nulls
      c.createIndex(
        { primaryDomain: 1 },
        { unique: true, sparse: true, name: "uniq_websites_primary_domain" }
      ),
    ]);
  }

  async listSingleByTenant(tenantId: string) {
    const c = await getDatabase();
    const coll = await c.collection("tenants");
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    return coll.findOne({ _id: tid });
  }

  async listByTenant(tenantId: string | ObjectId) {
    const c = await this.col();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    return c.find({ tenantId: tid }).sort({ createdAt: -1 }).toArray();
  }

  async listByWebsiteId(tenantId: string | ObjectId) {
    const c = await this.col();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    return c.find({ _id: tid }).sort({ createdAt: -1 }).toArray();
  }

  // async listTenantById(tenantId: string | ObjectId) {
  //   const c = await getDatabase();
  //   const coll = await c.collection("tenants");
  //   const tid =
  //     typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
  //   return coll.find({ _id: tid }).sort({ createdAt: -1 }).toArray();
  // }

  async listByUserId(tenantId: string | ObjectId, role?: string) {
    const c = await getDatabase();
    const coll = await c.collection("tenants");
    const userId = new ObjectId(tenantId);
    let getTenants;
    if (role == "business") {
      getTenants = await coll.find({ userId: userId }).toArray();
    } else {
      getTenants = await coll.find({ tenantId: userId }).toArray();
    }
    return getTenants;
  }

  async listSingleWebsiteByWebsiteId(
    tenantId: string | ObjectId,
    role?: string
  ) {
    const c = await getDatabase();
    const coll = await c.collection("tenants");
    const userId = new ObjectId(tenantId);
    const c1 = await this.col();
    let getTenants;
    if (role == "business") {
      getTenants = await coll.find({ userId: userId }).toArray();
    } else {
      getTenants = await coll.find({ franchise: userId }).toArray();
    }
    return getTenants;
  }

  async listforSuperadmin(tenantId: string | ObjectId) {
    const c = await this.col();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    return c.find({ tenantId: tid }).sort({ createdAt: -1 }).toArray();
  }

  async getByHost(host: string) {
    const c = await this.col();

    // Extract subdomain from host (e.g., "ai-tech" from "ai-tech.localhost")
    const extractSubdomain = (hostname: string) => {

      const withoutPort = hostname.split(':')[0];

      const parts = withoutPort.split('.');
      return parts.length > 1 ? parts[0] : null;
    };

    const subdomain = extractSubdomain(host);
    console.log("subdomain====", subdomain);
    // Build query conditions
    const orConditions: any[] = [
      { primaryDomain: host }, // exact match for string
      { primaryDomain: { $elemMatch: { $eq: host } } }, // exact match in array
      { systemSubdomain: host }, // exact match for system subdomain
    ];

    // If we have a subdomain, add regex matching for primaryDomain array elements
    if (subdomain) {
      // Match domains that start with the subdomain pattern
      // e.g., "ai-tech" matches "ai-tech.kalptree.xyz" or "ai-tech.localhost:55803"
      orConditions.push({
        primaryDomain: {
          $elemMatch: {
            $regex: `^${subdomain}\\.`,
            $options: 'i'
          }
        }
      });
    }
    console.log("orConditions====", orConditions);
    const doc = await c.findOne({
      $or: orConditions,
    });
    console.log("doc====", doc);
    return doc || null;
  }

  private async generateSystemSubdomain(
    tenantSlug: string,
    websiteName: string
  ) {
    const base = process.env.SYSTEM_BASE_DOMAIN || "KalpTree.xyz";
    const left = `${slugify(tenantSlug)}-${slugify(websiteName)}`.slice(0, 60);
    const candidate = `${left}.${base}`;
    const c = await this.col();
    const exists = await c.findOne({ systemSubdomain: candidate });
    if (!exists) return candidate;
    const suf = Math.random().toString(36).slice(2, 6);
    return `${left}-${suf}.${base}`;
  }

  async create(params: {
    tenantId: string | ObjectId;
    name: string;
    serviceType: string;
    primaryDomain?: string[] | null;
    systemSubdomain?: string;
    lang: any[];
    isComingSoon?: boolean;
    // isHomePage?:boolean
  }) {
    const c = await this.col();
    const tid =
      typeof params.tenantId === "string"
        ? new ObjectId(params.tenantId)
        : params.tenantId;
    const websiteId = new ObjectId().toHexString();

    const now = new Date();
    const doc: Omit<WebsiteDoc, "_id"> = {
      websiteId,
      tenantId: tid,
      name: params.name,
      serviceType: params.serviceType,
      ...(params.primaryDomain ? { primaryDomain: params.primaryDomain } : {}),
      branding: {},
      createdAt: now,
      updatedAt: now,
      systemSubdomain: params.systemSubdomain,
      lang: params.lang,
      isComingSoon: params.isComingSoon,
      // isHomepage:params.isHomepage
    };
    const r = await c.insertOne(doc as WebsiteDoc);
    return { ...doc, _id: r.insertedId } as WebsiteDoc;
  }

  async getByWebsiteId(websiteId: string) {
    const c = await this.col();
    return c.findOne({ websiteId });
  }

  async updateBranding(
    websiteId: string,
    updates: NonNullable<WebsiteDoc["branding"]>
  ) {
    const c = await this.col();
    const r = await c.updateOne(
      { websiteId },
      { $set: { branding: updates, updatedAt: new Date() } }
    );
    return r.modifiedCount > 0;
  }

  async updateDomain(websiteId: string, primaryDomain: string[] | null) {
    const c = await this.col();
    const r = await c.updateOne(
      { websiteId },
      { $set: { primaryDomain, updatedAt: new Date() } }
    );
    return r.modifiedCount > 0;
  }

  async websiteCount() {
    const c = await getDatabase();
    const coll = await c.collection("websites");
    return coll.countDocuments();
  }
}

export const websiteService = new WebsiteService();