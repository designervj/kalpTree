import React from "react";
import CategoryHome from "./category/CategoryHome";
import BrandHome from "./brand/BrandHome";
import AttributeHome from "./attribute/AttributeHome";
import ProductHome from "./product/ProductHome";
import AttributeSetsHome from "./attributessets/AttributesetsHome";

// Entity component registry
export const entityComponents: Record<string, React.ComponentType> = {
  category: CategoryHome,
  brand: BrandHome,
  attribute: AttributeHome,
  products: ProductHome,
  attributessets: AttributeSetsHome,
  // agencies:AgenciesHome
  // Add more entities here as needed
};

// Helper to check if entity exists
export const isValidEntityComponent = (
  entity: string,
): entity is keyof typeof entityComponents => {
  return entity in entityComponents;
};
