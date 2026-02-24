import type { ObjectId } from "mongodb";

export interface BlockManagerModel {
  _id?: string | ObjectId;
  id?: string;
  label: string;
  category: string;
  content: string;
  styles?: Record<string, any>; // or a more specific type if you know the structure
  premium?: boolean;
  icon?: string;
}