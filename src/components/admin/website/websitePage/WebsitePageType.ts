
// WebsitePageModel interface for a website page document
export interface WebsitePageModel {
	_id: string; // MongoDB ObjectId as string
	tenantId: string;
	websiteId?: string;
	// MongoDB ObjectId as string
	slug: string;
	title: string;
	content: string;
	seo?: SeoModel;
	status: 'published' | 'draft' | 'archived';
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	publishedAt: string; // ISO date string
	isHomePage?: boolean
	seoIssue?: boolean;
	inNavigation?: boolean;
}
export interface SeoModel {
	title?: string;
	metaDescription?: string;
	focusKeywords?:{
		keyword:string;
		isSelected:boolean;
		
	};
	hideFromSearchResults?: boolean;
};