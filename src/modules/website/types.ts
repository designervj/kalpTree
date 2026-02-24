import { BaseDocument } from "@/types";
import type { ObjectId } from "mongodb";

// Pages
export interface Page extends BaseDocument {
  slug: string; // "/about", "/contact"
  title: string;
  content: string; // Rich HTML content
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  status: "draft" | "published";
  publishedAt?: Date;
}

// Posts (Blog)
export interface Post extends BaseDocument {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  categoryId?: string;
  tags: string[];
  author: {
    userId: string;
    name: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  status: "draft" | "published";
  publishedAt?: Date;
}

// Categories
export interface Category extends BaseDocument {
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // For nested categories
}

// Media Library
export interface Media extends BaseDocument {
  name: string;
  category: string;
  tags?: string | string[]; // bytes
  url: string;
}
