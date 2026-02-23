import {
  colorModal,
  ColorPalletModal,
} from "@/components/admin/branding/color_pallet/Color_Pallet_Modal";
import { ObjectId } from "mongodb";

export interface IBusiness {
  tagline: any;
  _id?: string | ObjectId;
  slug?: string;
  name?: string;
  email?: string;
  plan?:
    | "trial"
    | "free"
    | "pro"
    | "agency"
    | "enterprise"
    | "basic"
    | undefined;
  subscriptionStatus?:
    | "active"
    | "paused"
    | "cancelled"
    | "suspended"
    | "inactive"
    | "pending"
    | undefined;
  customDomainVerified?: boolean;
  branding?: {
    primary_color?: string;
    secondary_color?: string;
    tertiary_color?: string;
    typography?: string;
    logo?: string;
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
  status?: "active" | "paused" | "inactive";
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  type?: "business" | "franchise" | "agency";
  tenantId?: string;
  websitesCount?: number;
  membersCount?: number;
  website?: {
    name?: string;
    primaryDomain?: string[];
    serviceType?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    globalStyle?: string;
    branding: {
      colors: ColorPalletModal[];
    };
    isComingSoon: boolean;
    lang?: { name: string; default: boolean }[];
  };
  businessdetails?: BussinessDetailModel;
  socialPresence?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
    telegram?: string;
  };
}

export interface BussinessDetailModel {
  business_website_url?: string;
  tagline?: string;
  industry?: string;
  founded_year?: string;
  about?: string;
  public_email?: string;
  phone?: string;
  headquarters?: string;
  brand_name?: string;
  service?: string;
}
