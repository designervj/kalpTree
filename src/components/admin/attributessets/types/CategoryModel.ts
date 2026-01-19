import { ObjectId } from "mongodb";

export interface MaterialCategory {
  _id?: string | ObjectId;
  id?: number | string | ObjectId;
  websiteId?: string | ObjectId;
  tenantId?: string | ObjectId;
  name?: string;
  icon?: string;
  sort_order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
