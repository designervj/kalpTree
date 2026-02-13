import { NextRequest, NextResponse } from "next/server";
import { TemplateService } from "@/lib/templates/template-service";
import {
  CreateTemplateInput,
  TemplateDocument,
  UpdateTemplateInput,
} from "@/components/admin/templates/TemplateType";
import { TemplateFormData } from "@/components/admin/templates/showTemplate/TemplateFrom";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get("templateId");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const premium = searchParams.get("premium");
    const categories = searchParams.get("categories");

    // Fetch template categories with counts
    if (categories === "true") {
      const categoryList = await TemplateService.getTemplateCategories();
      return NextResponse.json({ categories: categoryList });
    }

    // Fetch single template by templateId
    if (templateId) {
      const template = await TemplateService.getTemplateById(templateId);

      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ template });
    }

    // Fetch premium templates
    if (premium === "true") {
      const templates = await TemplateService.getPremiumTemplates();
      return NextResponse.json({ templates });
    }

    // Search templates by query
    if (search) {
      const templates = await TemplateService.searchTemplates(search);
      return NextResponse.json({ templates });
    }

    // Fetch templates by category
    if (category) {
      const templates = await TemplateService.getTemplatesByCategory(category);
      return NextResponse.json({ templates });
    }

    // Fetch all active public templates
    const templates = await TemplateService.getAllTemplates();
    console.log("template --", templates.length);
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("GET /api/template error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

/**
 * POST - Create a new template
 * Body: CreateTemplateInput
 */
export async function POST(req: NextRequest) {
  try {
    const body: TemplateFormData = await req.json();

    // Validate required fields
    if (!body.label || !body.category || !body.content) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: label, category, and content are required",
        },
        { status: 400 },
      );
    }

    // Transform TemplateDocument to CreateTemplateInput
    const templateInput: CreateTemplateInput = {
      templateId: body.slug || `template-${Date.now()}`,
      label: body.label,
      category: body.category,
      content: body.content,
      attributes: {
        templateType: body.templateType,
        pageType: body.pageType,
        description: body.description,
        demo: body.demo,
        version: body.version,
        notes: body.notes,
      },
      thumbnail: body.imageDataUrl || null,
      status: "active",
      isPublic: body.isPublic ?? true,
      isPremium: false,
      tags: body.tags
        ? typeof body.tags === "string"
          ? body.tags?.split(",").map((t: string) => t.trim())
          : body.tags
        : [body.category],
    };

    // Create the template
    const insertedId = await TemplateService.createTemplate(templateInput);

    return NextResponse.json({ insertedId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/template error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

/**
 * PUT - Update an existing template
 * Query params: ?templateId=<template_id>
 * Body: UpdateTemplateInput
 */
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get("templateId");
    const body: UpdateTemplateInput = await req.json();

    if (!templateId) {
      return NextResponse.json(
        { error: "Missing templateId parameter" },
        { status: 400 },
      );
    }

    // Check if template exists
    const existingTemplate = await TemplateService.getTemplateById(templateId);
    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    // Update the template
    const success = await TemplateService.updateTemplate(templateId, body);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update template" },
        { status: 500 },
      );
    }

    // Fetch and return the updated template
    const updatedTemplate = await TemplateService.getTemplateById(templateId);
    return NextResponse.json({ template: updatedTemplate });
  } catch (error) {
    console.error("PUT /api/template error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

/**
 * DELETE - Soft delete a template (sets status to inactive)
 * Query params: ?templateId=<template_id>
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get("templateId");

    if (!templateId) {
      return NextResponse.json(
        { error: "Missing templateId parameter" },
        { status: 400 },
      );
    }

    // Check if template exists
    const template = await TemplateService.getTemplateById(templateId);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    // Soft delete the template
    const success = await TemplateService.deleteTemplate(templateId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete template" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully (soft delete)",
    });
  } catch (error) {
    console.error("DELETE /api/template error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
