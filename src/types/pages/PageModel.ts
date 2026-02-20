import { ObjectId } from "mongodb";

export interface PageModel {
  _id?: ObjectId | string;
  id?: string;
  slug?: string;
  templateId?: string;
  templateType?: string;
  pageType?: string;
  label?: string;
  category?: string;
  content?: string;
  description?: string;
  imageDataUrl?: string;
  attributes?: Record<string, any>;
  thumbnail?: string | null;
  version?: string;
  // Multi-tenant fields
  tenantId?: ObjectId | string;
  websiteId?: ObjectId | string;
  createdBy?: ObjectId | string;
  // Metadata
  status?: "active" | "inactive" | "draft";
  isPublic?: boolean;
  isPremium?: boolean;
  tags?: string[];
  notes?: string;
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  dictionary?: Record<string, Record<string, string>>;
}
