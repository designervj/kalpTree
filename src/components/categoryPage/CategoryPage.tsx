import { RootState } from '@/store/store';
import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { generateCategoryPageHtml } from '../editor/utils/GenerateCategoryHtml';


export interface FilterAttributeModal {
    [key: string]: string[]
}

export interface CategoryPageHtmlOptions {
    /** Category display name shown in the hero banner */
    categoryTitle?: string;
    /** Hero background image URL */
    heroImageUrl?: string;
    /** Number of product columns on desktop (default: 3) */
    desktopColumns?: 2 | 3 | 4;
    /** Show hero section (default: true) */
    showHero?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — exported so GenerateCategoryHtml.ts can share the type, but each
// file keeps its own implementation so there is no circular dependency.
// ─────────────────────────────────────────────────────────────────────────────

export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─────────────────────────────────────────────────────────────────────────────
// CategoryPage React component
// Computes the filter map, generates the HTML and renders it inline so it is
// visible on the GrapesJS alternative-view panel.  It also fires the optional
// onHtmlGenerated callback so the parent can push the HTML onto the canvas.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
    category: string;
    /** Called with the generated HTML string whenever products / filters change */
    onHtmlGenerated?: (html: string) => void;
    options?: CategoryPageHtmlOptions;
};

const CategoryPage = ({ category, onHtmlGenerated, options }: Props) => {
    const {
        listProduct: products,
    } = useSelector((state: RootState) => state.product);

    const { listCategory } = useSelector((state: RootState) => state.category);

    // Resolve category document
    const categoryDoc = useMemo(() =>
        listCategory.find((d) => d.slug === category),
        [listCategory, category]
    );

    const categoryId = categoryDoc?._id?.toString();

    // Products that belong to this category
    const categoryProducts = useMemo(() => {
        if (!products || !categoryId) return [];
        return products.filter((d) => d?.allcategories?.includes(categoryId));
    }, [products, categoryId]);

    // Build { [attributeName]: string[] } from all variants in the product list
    const filterAttributes = useMemo((): FilterAttributeModal => {
        const data: FilterAttributeModal = {};
        categoryProducts.forEach((product) => {
            (product.variants ?? []).forEach((variant) => {
                (variant.attributes ?? []).forEach((attribute) => {
                    const key = attribute.attributeName;
                    const value = attribute.value;
                    if (key && value) {
                        if (data[key]) {
                            if (!data[key].includes(value)) data[key].push(value);
                        } else {
                            data[key] = [value];
                        }
                    }
                });
            });
        });
        return data;
    }, [categoryProducts]);

    // Build options, merging the category title from the resolved doc


    // Generate the HTML string
    const generatedHtml = useMemo(() => {
        if (!categoryProducts || !filterAttributes) return "";
        return generateCategoryPageHtml(
            categoryProducts,
            filterAttributes,

        );
    }, [categoryProducts, filterAttributes]);

    // Notify parent whenever the HTML changes
    useEffect(() => {
        if (generatedHtml) {
            onHtmlGenerated?.(generatedHtml);
        }
    }, [generatedHtml, onHtmlGenerated]);

    // Render the generated HTML directly so it is visible in the editor panel
    return (

        <div
            style={{ width: '100%', minHeight: '100vh' }}
            dangerouslySetInnerHTML={{ __html: generatedHtml }}
        />
    );
};

export default CategoryPage;