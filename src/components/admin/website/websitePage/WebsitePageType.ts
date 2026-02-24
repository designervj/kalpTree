import type { ObjectId } from "mongodb";
import { TranslationDictionary } from "@/components/editor/translation/TranslationPage";

// WebsitePageModel interface for a website page document

export interface CommentModel {
  _id: string | ObjectId; // MongoDB ObjectId as string
  comment: string;

}

export interface PageCommentModal {
  _id?: string | ObjectId; // MongoDB ObjectId as string
  component?: {
    tagName: string;
    content: string;
  }
  allComments?: CommentModel[];
  createdAt?: Date; // ISO date string
  updatedAt?: Date; // ISO date string
}


export interface WebsitePageModel {
  _id: string; // MongoDB ObjectId as string
  tenantId: string;
  websiteId?: string;
  // MongoDB ObjectId as string
  slug: string;
  title: string;
  content: string;
  seo?: SeoModel;
  status: "published" | "draft" | "archived";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt: string; // ISO date string
  isHomePage?: boolean;
  seoIssue?: boolean;
  inNavigation?: boolean;
  dictionary?: TranslationDictionary;
}
export interface SeoModel {
  title?: string;
  slug?: string;
  metaDescription?: string;
  focusKeywords?: [
    {
      keyword: string;
      isSelected: boolean;
    },
  ];
  hideFromSearchResults?: boolean;
}
