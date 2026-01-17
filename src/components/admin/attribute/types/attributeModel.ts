import { ObjectId } from "mongodb";
import { MaterialCategory } from "../../category/types/CategoryModel";

type Data_Type = "enum" | "number" | "text";
export interface MaterialAttributes {
  _id?: string | ObjectId;
  id?: number | string | ObjectId;
  websiteId?: string | ObjectId;
  tenantId?: string | ObjectId;
  name: string;
  data_type?: Data_Type;
  unit?: string;
  possible_values?: (string | number)[] | null;
  type?: string;
  category_id?: (string | number | MaterialCategory)[] | null;
  category?: MaterialCategory;
}
