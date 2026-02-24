import type { ObjectId } from "mongodb";

export interface IUser {
  _id?: string | ObjectId;
  id?: string | ObjectId;
  email?: string;
  passwordHash?: string;
  name?: string;
  role?: string;
  status?: string;
  createdAt?: Date;
  tenantId?: string;
  updatedAt?: Date;
  lastLoginAt?: Date;
  permissions?: string[];
}
