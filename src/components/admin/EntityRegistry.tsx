import React from "react";
import CategoryHome from "./category/CategoryHome";
import BrandHome from "./brand/BrandHome";
import AttributeHome from "./attribute/AttributeHome";
import ProductHome from "./product/ProductHome";
import AttributeSetsHome from "./attributessets/AttributesetsHome";
import ProductTypeCategoryHome from "./product-type-category/ProductTypeCategoryHome";
import ProductTypeHome from "./product-type/ProductTypeHome";

// Entity component registry
export const entityComponents: Record<string, React.ComponentType> = {
  category: CategoryHome,
  brand: BrandHome,
  attribute: AttributeHome,
  products: ProductHome,
  attributessets: AttributeSetsHome,
  "product-type-category": ProductTypeCategoryHome,
  "product-type": ProductTypeHome,

  // agencies:AgenciesHome
  // Add more entities here as needed
};

// Helper to check if entity exists
export const isValidEntityComponent = (
  entity: string,
): entity is keyof typeof entityComponents => {
  return entity in entityComponents;
};
