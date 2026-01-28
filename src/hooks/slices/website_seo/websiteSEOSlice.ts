import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    fetchPageSEOByWebsite,
    fetchPageSEOById,
    fetchPageSEOBySlug,
    createPageSEO,
    updatePageSEO,
    deletePageSEO,
    fetchMainPageSEO,
    fetchPageSEOByStatus,
    searchPageSEO,
    bulkUpdatePageSEOStatus,
} from "./WebsiteSEOThunk";
import { PageSEOModel } from "@/components/admin/website_seo/PageSEOModel";
import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";

export type WebsiteSEOState = {
    listPageSEO: WebsitePageModel[];
    currentPageSEO: WebsitePageModel | null;
    mainPageSEO: WebsitePageModel | null;
    isPageSEOLoading: boolean;
    hasFetched: boolean;
    error: string | null;
};

const initialState: WebsiteSEOState = {
    listPageSEO: [],
    currentPageSEO: null,
    mainPageSEO: null,
    isPageSEOLoading: false,
    hasFetched: false,
    error: null,
};

const websiteSEOSlice = createSlice({
    name: "websiteSEO",
    initialState,
    reducers: {
        setPageSEO(state, action: PayloadAction<WebsitePageModel[]>) {
            state.listPageSEO = action.payload;
        },
        setCurrentPageSEO(state, action: PayloadAction<WebsitePageModel | null>) {
            state.currentPageSEO = action.payload;
        },
        addPageSEOToList(state, action: PayloadAction<  WebsitePageModel>) {
            state.listPageSEO.push(action.payload);
        },
        updatePageSEOInList(state, action: PayloadAction<WebsitePageModel>) {
            const updated = action.payload;
            const idx = state.listPageSEO.findIndex((page:WebsitePageModel) => {
                if (!page) return false;
                if ((page as any)._id && (updated as any)._id)
                    return String((page as any)._id) === String((updated as any)._id);
                if (page.slug && updated.slug)
                    return page.slug === updated.slug;
                return page.title === updated.title;
            });
            if (idx !== -1) {
                state.listPageSEO[idx] = {
                    ...state.listPageSEO[idx],
                    ...updated,
                };
            }
        },
        removePageSEOFromList(state, action: PayloadAction<string | undefined>) {
            const id = action.payload;
            // state.listPageSEO = state.listPageSEO.filter((page) => {
            //     if (!page) return false;
            //     if ((page as any)._id && id)
            //         return String((page as any)._id) !== String(id);
            //     if (page.slug && id)
            //         return page.slug !== id;
            //     return page.pageName !== String(id);
            // });
        },
        clearPageSEO(state) {
            state.listPageSEO = [];
            state.currentPageSEO = null;
            state.mainPageSEO = null;
            state.hasFetched = false;
            state.isPageSEOLoading = false;
            state.error = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Page SEO by Website
            .addCase(fetchPageSEOByWebsite.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                fetchPageSEOByWebsite.fulfilled,
                (state, action: PayloadAction<PageSEOModel[]>) => {
                    // state.listPageSEO = action.payload;
                    // state.hasFetched = true;
                    // state.isPageSEOLoading = false;
                }
            )
            .addCase(fetchPageSEOByWebsite.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Fetch Page SEO by ID
            .addCase(fetchPageSEOById.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                fetchPageSEOById.fulfilled,
                (state, action: PayloadAction<PageSEOModel>) => {
                    // state.currentPageSEO = action.payload;
                    // state.isPageSEOLoading = false;
                }
            )
            .addCase(fetchPageSEOById.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Fetch Page SEO by Slug
            .addCase(fetchPageSEOBySlug.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                fetchPageSEOBySlug.fulfilled,
                (state, action: PayloadAction<PageSEOModel>) => {
                    // state.currentPageSEO = action.payload;
                    // state.isPageSEOLoading = false;
                }
            )
            .addCase(fetchPageSEOBySlug.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Create Page SEO
            .addCase(createPageSEO.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                createPageSEO.fulfilled,
                (state, action: PayloadAction<PageSEOModel>) => {
                    // state.listPageSEO.push(action.payload);
                    // state.currentPageSEO = action.payload;
                    // state.isPageSEOLoading = false;
                }
            )
            .addCase(createPageSEO.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Update Page SEO
            .addCase(updatePageSEO.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                updatePageSEO.fulfilled,
                (state, action: PayloadAction<PageSEOModel>) => {
                    const updated = action.payload;
                    const idx = state.listPageSEO.findIndex((page) => {
                        if (!page) return false;
                        if ((page as any)._id && (updated as any)._id)
                            return String((page as any)._id) === String((updated as any)._id);
                        return false;
                    });
                    if (idx !== -1) {
                        // state.listPageSEO[idx] = updated;
                    }
                    if (state.currentPageSEO &&
                        String((state.currentPageSEO as any)._id) === String((updated as any)._id)) {
                        // state.currentPageSEO = updated;
                    }
                    state.isPageSEOLoading = false;
                }
            )
            .addCase(updatePageSEO.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Delete Page SEO
            .addCase(deletePageSEO.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                deletePageSEO.fulfilled,
                (state, action: PayloadAction<{ deletedId: string }>) => {
                    const deletedId = action.payload.deletedId;
                    state.listPageSEO = state.listPageSEO.filter((page) => {
                        if (!page) return false;
                        return String((page as any)._id) !== String(deletedId);
                    });
                    if (state.currentPageSEO &&
                        String((state.currentPageSEO as any)._id) === String(deletedId)) {
                        state.currentPageSEO = null;
                    }
                    state.isPageSEOLoading = false;
                }
            )
            .addCase(deletePageSEO.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Fetch Main Page SEO
            .addCase(fetchMainPageSEO.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                fetchMainPageSEO.fulfilled,
                (state, action: PayloadAction<PageSEOModel>) => {
                    // state.mainPageSEO = action.payload;
                    state.isPageSEOLoading = false;
                }
            )
            .addCase(fetchMainPageSEO.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Fetch Page SEO by Status
            .addCase(fetchPageSEOByStatus.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                fetchPageSEOByStatus.fulfilled,
                (state, action: PayloadAction<PageSEOModel[]>) => {
                    // state.listPageSEO = action.payload;
                    state.isPageSEOLoading = false;
                }
            )
            .addCase(fetchPageSEOByStatus.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Search Page SEO
            .addCase(searchPageSEO.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(
                searchPageSEO.fulfilled,
                (state, action: PayloadAction<PageSEOModel[]>) => {
                    // state.listPageSEO = action.payload;
                    state.isPageSEOLoading = false;
                }
            )
            .addCase(searchPageSEO.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            })

            // Bulk Update Page SEO Status
            .addCase(bulkUpdatePageSEOStatus.pending, (state) => {
                state.isPageSEOLoading = true;
                state.error = null;
            })
            .addCase(bulkUpdatePageSEOStatus.fulfilled, (state) => {
                state.isPageSEOLoading = false;
            })
            .addCase(bulkUpdatePageSEOStatus.rejected, (state, action) => {
                state.isPageSEOLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setPageSEO,
    setCurrentPageSEO,
    addPageSEOToList,
    updatePageSEOInList,
    removePageSEOFromList,
    clearPageSEO,
    clearError,
} = websiteSEOSlice.actions;

export default websiteSEOSlice.reducer;

// Selectors
export const selectPageSEOList = (state: { websiteSEO: WebsiteSEOState }) =>
    state.websiteSEO.listPageSEO;

export const selectCurrentPageSEO = (state: { websiteSEO: WebsiteSEOState }) =>
    state.websiteSEO.currentPageSEO;

export const selectMainPageSEO = (state: { websiteSEO: WebsiteSEOState }) =>
    state.websiteSEO.mainPageSEO;

export const selectPageSEOLoading = (state: { websiteSEO: WebsiteSEOState }) =>
    state.websiteSEO.isPageSEOLoading;

export const selectPageSEOHasFetched = (state: { websiteSEO: WebsiteSEOState }) =>
    state.websiteSEO.hasFetched;

export const selectPageSEOError = (state: { websiteSEO: WebsiteSEOState }) =>
    state.websiteSEO.error;
