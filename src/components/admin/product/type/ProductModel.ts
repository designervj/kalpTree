import type { ObjectId } from "mongodb";
import { MaterialBrandModel } from "../../brand/types/brandModel";
import { MaterialCategory } from "../../category/types/CategoryModel";
import { ProductVariant } from "@/modules/ecommerce/types";
// import { MaterialSegmentModel } from "../../segment/types/SegmentModel";

export interface ProductModel {
  id?: number;
  _id?: string;
  title?: string;
  allcategories?: string[]
  brand_id?: string | ObjectId;
  brand?: MaterialBrandModel;
  product_category_id?: string | ObjectId;
  category?: MaterialCategory;
  created_at?: string;
  description?: string;
  photo?: string;
  bucket_path?: string;
  new_bucket?: number;
  ai_summary?: string | null;
  base_price?: number | null;
  material_segment_id?: string | ObjectId;
  // segment?:MaterialSegmentModel
  variants?: ProductVariant[];
  options?: any[];
  gallery?: string[];
  /** Images uploaded via the admin product form are stored under this key in MongoDB */
  imageUrls?: string[];
  websiteId?: string;
  tenantId?: string;

  basePrice?: string | number;
}
