import {
  CreateTemplateInput,
  TemplateDocument,
  UpdateTemplateInput,
} from "@/components/admin/templates/TemplateType";
import { getDatabase } from "../db/mongodb";

import { ObjectId } from "mongodb";

/**
 * Service for managing component templates in MongoDB
 */
export class TemplateService {
    private static COLLECTION_NAME = 'builder_templates';

    /**
     * Get all active public templates
     */
    static async getAllTemplates() {
        const db = await getDatabase();
        const templates = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .find({ status: 'active', isPublic: true })
            .sort({ createdAt: -1 })
            .toArray();

        return templates;
    }

    /**
     * Get templates by category
     */
    static async getTemplatesByCategory(category: string) {
        const db = await getDatabase();
        const templates = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .find({ category, status: 'active', isPublic: true })
            .sort({ createdAt: -1 })
            .toArray();

        return templates;
    }

    /**
     * Get a single template by templateId
     */
    static async getTemplateById(templateId: string) {
        const db = await getDatabase();
        const id = new ObjectId(templateId)
        const template = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .findOne({ _id: id, status: 'active' });

        return template;
    }

    /**
     * Search templates by label or tags
     */
    static async searchTemplates(query: string) {
        const db = await getDatabase();
        const templates = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .find({
                status: 'active',
                isPublic: true,
                $or: [
                    { label: { $regex: query, $options: 'i' } },
                    { tags: { $in: [new RegExp(query, 'i')] } },
                ],
            })
            .sort({ createdAt: -1 })
            .toArray();

        return templates;
    }

    /**
     * Create a new template
     */
    static async createTemplate(input: CreateTemplateInput) {
        const db = await getDatabase();
        const now = new Date();

        const template: Omit<TemplateDocument, '_id'> = {
            templateId: input.templateId,
            label: input.label,
            category: input.category,
            content: input.content,
            attributes: input.attributes || {},
            thumbnail: input.thumbnail || null,
            status: input.status || 'active',
            isPublic: input.isPublic ?? true,
            isPremium: input.isPremium ?? false,
            tags: input.tags || [input.category],
            createdAt: now,
            updatedAt: now,
        };

        const result = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .insertOne(template as TemplateDocument);

        return { ...template, _id: result.insertedId } as TemplateDocument;
    }

    /**
     * Update an existing template
     */
    static async updateTemplate(templateId: string, input: UpdateTemplateInput) {
        const db = await getDatabase();
        const now = new Date();
        const id = new ObjectId(templateId)
        const updateData = {
            ...input,
            updatedAt: now,
        };

        const result = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .updateOne(
                { _id: id },
                { $set: updateData }
            );

        return result.modifiedCount > 0;
    }

    /**
     * Delete a template (soft delete by setting status to inactive)
     */
    static async deleteTemplate(templateId: string) {
        const db = await getDatabase();
        const now = new Date();

        const result = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .updateOne(
                { templateId },
                { $set: { status: 'inactive', updatedAt: now } }
            );

        return result.modifiedCount > 0;
    }

    /**
     * Get template categories with counts
     */
    static async getTemplateCategories() {
        const db = await getDatabase();
        const categories = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .aggregate([
                { $match: { status: 'active', isPublic: true } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ])
            .toArray();

        return categories.map(cat => ({
            category: cat._id,
            count: cat.count,
        }));
    }

    /**
     * Get premium templates
     */
    static async getPremiumTemplates() {
        const db = await getDatabase();
        const templates = await db
            .collection<TemplateDocument>(this.COLLECTION_NAME)
            .find({ status: 'active', isPublic: true, isPremium: true })
            .sort({ createdAt: -1 })
            .toArray();

        return templates;
    }
}
