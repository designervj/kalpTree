import { ObjectId } from "mongodb";

export interface IBusiness {
  _id?: string | ObjectId;
  slug: string;
  name: string;
  email: string;
  plan: "trial" | "free" | "pro" | "agency";
  subscriptionStatus: "active" | "paused" | "cancelled";
  customDomainVerified: boolean;
  branding?: {
    colors?: {
      primary?: string;
      secondary?: string;
    };
  };
  paymentGateways?: Record<string, any>;
  features?: {
    websiteEnabled?: boolean;
    ecommerceEnabled?: boolean;
    blogEnabled?: boolean;
    invoicesEnabled?: boolean;
  };
  settings?: {
    locale?: string;
    currency?: string;
    timezone?: string;
  };
  status: "active" | "paused" | "inactive";
  createdAt: string;
  updatedAt: string;
  createdById: string;
  type?: "business" | "franchise" | "agency";
  tenantId?: string;
    websitesCount?: number;
  membersCount?: number;
  websites?: Array<{ 
    name?: string;
    primaryDomain?: string[];
    serviceType?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
}
