import { ObjectId } from "mongodb";
import { getDatabase } from "../db/mongodb";
import type { Tenant } from "@/types";
import { TenantModel } from "@/models/tenant";

export class TenantService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Tenant>("tenants");
  }

  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const collection = await this.getCollection();
    return collection.findOne({ slug: slug.toLowerCase() });
  }

  async getTenantById(id: string | ObjectId): Promise<Tenant | null> {
    const collection = await this.getCollection();
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    return collection.findOne({ _id: objectId });
  }

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const collection = await this.getCollection();
    return collection.findOne({
      customDomain: domain.toLowerCase(),
      customDomainVerified: true,
    });
  }

  async createTenant(data: {
    slug?: string;
    name: string;
    email: string;
    plan?: Tenant["plan"];
    createdById: ObjectId | string;
    businessdetails?: any;
    branding?: any;
    type: string;
    tenantId?: string | ObjectId | undefined;
  }): Promise<Tenant> {
    const collection = await this.getCollection();

    // Check if slug already exists
    let existing = null;
    if (data.slug) {
      existing = await this.getTenantBySlug(data.slug);
    }

    if (existing) {
      throw new Error("Tenant slug already exists");
    }

    const tenant: Omit<TenantModel, "_id"> = {
      type: data.type,
      slug: data.slug ? data.slug.toLowerCase() : "",
      name: data.name,
      email: data.email,
      createdById: new ObjectId(data.createdById),
      plan: data.plan || "trial",
      subscriptionStatus: "active",
      customDomainVerified: false,
      branding: data.branding,
      paymentGateways: {},
      businessdetails: data.businessdetails,
      features: {
        websiteEnabled: true,
        ecommerceEnabled: true,
        blogEnabled: true,
        invoicesEnabled: true,
      },
      settings: {
        locale: "en-US",
        currency: "USD",
        timezone: "UTC",
      },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const tenantID = data.tenantId ? new ObjectId(data.tenantId) : "";

    if (tenantID) {
      tenant.tenantId = tenantID;
    }

    const result = await collection.insertOne(tenant as Tenant);
    return { ...tenant, _id: result.insertedId } as Tenant;
  }

  async updateTenant(
    id: string | ObjectId,
    updates: Partial<Tenant>
  ): Promise<boolean> {
    const collection = await this.getCollection();
    const objectId = typeof id === "string" ? new ObjectId(id) : id;

    const result = await collection.updateOne(
      { _id: objectId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }



  async suspendTenant(id: string | ObjectId): Promise<boolean> {
    return this.updateTenant(id, { status: "suspended" });
  }

  async activateTenant(id: string | ObjectId): Promise<boolean> {
    return this.updateTenant(id, { status: "active" });
  }

  async verifyCustomDomain(
    id: string | ObjectId,
    domain: string
  ): Promise<boolean> {
    return this.updateTenant(id, {
      customDomain: domain.toLowerCase(),
      customDomainVerified: true,
    });
  }

  async updateBusinessDetails(
    id: string | ObjectId,
    businessDetails: {
      brandName?: string;
      tagline?: string;
      description?: string;
      industry?: string;
      foundedYear?: string;
      phone?: string;
      address?: string;
      email?: string;
      socials?: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
      };
    }
  ): Promise<Tenant | null> {
    const collection = await this.getCollection();
    const objectId = typeof id === "string" ? new ObjectId(id) : id;

    // Get existing tenant to merge data
    const existingTenant = await this.getTenantById(objectId);
    if (!existingTenant) {
      return null;
    }

    // Prepare updates
    const updates: Partial<Tenant> = {};

    // Update businessdetails
    if (
      businessDetails.brandName !== undefined ||
      businessDetails.tagline !== undefined ||
      businessDetails.description !== undefined ||
      businessDetails.industry !== undefined ||
      businessDetails.foundedYear !== undefined ||
      businessDetails.phone !== undefined ||
      businessDetails.address !== undefined
    ) {
      updates.businessdetails = {
        ...existingTenant.businessdetails,
        ...(businessDetails.brandName !== undefined && {
          brand_name: businessDetails.brandName,
        }),
        ...(businessDetails.tagline !== undefined && {
          tagline: businessDetails.tagline,
        }),
        ...(businessDetails.description !== undefined && {
          about: businessDetails.description,
        }),
        ...(businessDetails.industry !== undefined && {
          industry: businessDetails.industry,
        }),
        ...(businessDetails.foundedYear !== undefined && {
          founded_year: businessDetails.foundedYear,
        }),
        ...(businessDetails.phone !== undefined && {
          phone: businessDetails.phone,
        }),
        ...(businessDetails.address !== undefined && {
          headquarters: businessDetails.address,
        }),
      };
    }

    // Update email
    if (businessDetails.email !== undefined) {
      // updates.email = businessDetails.email;
    }

    // Update social presence - create if doesn't exist, merge if it does
    console.log("businessDetails.socials", businessDetails.socials);
    if (businessDetails.socials !== undefined && businessDetails.socials !== null) {
      // Only update if socials object has at least one property
      const hasValues = Object.keys(businessDetails.socials).length > 0;
      if (hasValues) {
        updates.socialPresence = {
          ...(existingTenant.socialPresence || {}),
          ...businessDetails.socials,
        };
      }
    }

    // Perform update
    await this.updateTenant(objectId, updates);

    // Return updated tenant
    return this.getTenantById(objectId);
  }

  async listTenants(options?: {
    skip?: number;
    limit?: number;
    status?: Tenant["status"];
  }): Promise<Tenant[]> {
    const collection = await this.getCollection();
    const query: Partial<Pick<Tenant, "status">> = {};
    if (options?.status) {
      query.status = options.status;
    }
    return collection
      .find(query)
      .skip(options?.skip || 0)
      .limit(options?.limit || 50)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getWebsiteByDomain(host: string): Promise<Tenant | null> {
    const collection = await this.getCollection();
    const extractSubdomain = (hostname: string) => {

      const withoutPort = hostname.split(':')[0];

      const parts = withoutPort.split('.');
      return parts.length > 1 ? parts[0] : null;
    };
    const subdomain = extractSubdomain(host);
    console.log("subdomain==", subdomain)
    const orConditions: any[] = [
      { primaryDomain: host }, // exact match for string
      { primaryDomain: { $elemMatch: { $eq: host } } }, // exact match in array
      { systemSubdomain: host }, // exact match for system subdomain
    ];

    if (subdomain) {
      // Match domains that start with the subdomain pattern
      // e.g., "ai-tech" matches "ai-tech.kalptree.xyz" or "ai-tech.localhost:55803"
      orConditions.push({
        "website.primaryDomain": {
          $elemMatch: {
            $regex: `^${subdomain}\\.`,
            $options: 'i'
          }
        }
      });
    }

    const doc = await collection.findOne({
      $or: orConditions,
    });
    return doc;
  }
}

export const tenantService = new TenantService();
