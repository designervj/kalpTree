import type { ObjectId } from "mongodb";
import { BrandingSettings } from "@/types";

export interface TenantModel {
  _id: ObjectId;
  slug?: string;
  name: string;
  email: string;
  type?: string;
  customDomainVerified: boolean;
  plan: "trial" | "basic" | "pro" | "enterprise";
  subscriptionStatus: "active" | "suspended" | "cancelled";
  branding: BrandingSettings;
  paymentGateways: Record<string, unknown>;
  franchise?: string | ObjectId
  features: {
    websiteEnabled: boolean;
    ecommerceEnabled: boolean;
    blogEnabled: boolean;
    invoicesEnabled: boolean;
  };
  settings: {
    locale: string;
    currency: string;
    timezone: string;
    taxRate?: number;
    maxUsers?: number;
    maxSubTenants?: number;
  };
  status: "active" | "suspended" | "pending";
  createdAt: Date;
  updatedAt: Date;
  userId?: ObjectId | string;
  createdById?: string | ObjectId
  businessdetails?: any;
  tenantId?: string | ObjectId
}
