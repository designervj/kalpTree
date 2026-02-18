/**
 * Template document schema for MongoDB "templates" collection
 */
export interface TemplateDocument {
    _id?: any;
    id?: string;
    slug?: string;
    templateId?: string;
    templateType?: string,
    pageType?: string,
    label?: string;
    category?: string;
    content?: string;
    description?: string;
    imageDataUrl?: string;
    attributes?: Record<string, any>;
    thumbnail?: string | null;
    version?: string;
    // Multi-tenant fields
    tenantId?: any;
    websiteId?: any;
    createdBy?: any;
    // Metadata
    status?: 'active' | 'inactive' | 'draft';
    isPublic?: boolean;
    isPremium?: boolean;
    tags?: string[];
    notes?: string;
    pageSlug?: string[]
    // Timestamps
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Template data for API responses (without MongoDB ObjectId)
 */
export interface Template {
    id: string;
    templateId: string;
    label: string;
    category: string;
    content: string;
    attributes: Record<string, any>;
    thumbnail: string | null;
    status: 'active' | 'inactive' | 'draft';
    isPublic: boolean;
    isPremium: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Template creation input
 */
export interface CreateTemplateInput {
    templateId: string;
    label: string;
    category: string;
    websiteId: string;
    content: string;
    attributes?: Record<string, any>;
    thumbnail?: string | null;
    status?: 'active' | 'inactive' | 'draft';
    isPublic?: boolean;
    isPremium?: boolean;
    tags?: string[];
}

/**
 * Template update input
 */
export interface UpdateTemplateInput {
    label?: string;
    category?: string;
    content?: string;
    attributes?: Record<string, any>;
    thumbnail?: string | null;
    status?: 'active' | 'inactive' | 'draft';
    isPublic?: boolean;
    isPremium?: boolean;
    tags?: string[];
}
