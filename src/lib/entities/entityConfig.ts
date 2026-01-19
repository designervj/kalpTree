import {
  createCategory,
  listCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from "@/lib/material/category";
import {
  getBrandById,
  updateBrand,
  createBrand,
  listBrands,
  deleteBrand,
} from "@/lib/material/product_brand";
import {
  getAttributeById,
  updateAttribute,
  createAttribute,
  listAttributes,
  deleteAttribute,
} from "@/lib/material/product_attribute";

import {
  getProductById,
  updateProduct,
  createProduct,
  listProducts,
  deleteProduct,
} from "@/lib/material/product";
import { createAttributessets, deleteAttributeSets, getAttributeSetsById, listAttributeSets, updateAttributeSets } from "../material/attributessets";

export interface EntityOperations {
  create: (data: any) => Promise<any>;
  list: (websiteId: string) => Promise<any>;
  getById: (id: string) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

export const entityConfig: Record<string, EntityOperations> = {
  category: {
    create: createCategory,
    list: listCategories,
    getById: getCategoryById,
    update: updateCategory,
    delete: deleteCategory,
  },
  brand: {
    create: createBrand,
    list: listBrands,
    getById: getBrandById,
    update: updateBrand,
    delete: deleteBrand,
  },
  attribute: {
    create: createAttribute,
    list: listAttributes,
    getById: getAttributeById,
    update: updateAttribute,
    delete: deleteAttribute,
  },

  products: {
    create: createProduct,
    list: listProducts,
    getById: getProductById,
    update: updateProduct,
    delete: deleteProduct,
  },

  attributessets: {
    create: createAttributessets,
    list: listAttributeSets,
    getById: getAttributeSetsById,
    update: updateAttributeSets,
    delete: deleteAttributeSets,
  },
  // Add more entities here as needed
};

export const isValidEntity = (
  entity: string,
): entity is keyof typeof entityConfig => {
  return entity in entityConfig;
};
