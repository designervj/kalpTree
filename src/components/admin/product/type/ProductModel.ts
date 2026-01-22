import { ObjectId } from "mongodb";
import { MaterialBrandModel } from "../../brand/types/brandModel";
import { MaterialCategory } from "../../category/types/CategoryModel";
import { ProductVariant } from "@/modules/ecommerce/types";
// import { MaterialSegmentModel } from "../../segment/types/SegmentModel";

export interface ProductModel {
  id?: number;
  _id?: string;
  title?: string;
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
  product_variants?: ProductVariant[];
  gallery?: string[];
  websiteId?: string;
  tenantId?: string;
  basePrice?: string;
}
