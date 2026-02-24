import type { ObjectId } from "mongodb";

export interface MaterialBrandModel {
  id?: number;
  url?: string;
  name?: string;
  description?: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
  websiteId?: string | ObjectId;
  tenantId?: string | ObjectId;
}