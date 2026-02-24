"use client";

import * as React from "react";
import {
  GripVertical,
  Home,
  FileText,
  MoreHorizontal,
  AlertCircle,
  Image as ImageIcon,
  Plus,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Clock,
  ListPlus,
  Link2,
  Link as LinkLucide,
  Trash2,
  LayoutGrid,
  ListFilter,
  Settings,
  X,
  Palette,
  Type,
  Layout,
  Sparkles,
  Eye,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { setPageLoading, setPageEdit } from "@/hooks/slices/pageEditSlice";
import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
import PageMenu from "./PageMenu";
import SeoPill from "./SeoPill";
import { Website } from "@/components/admin/AppShell";
import CurrentForm from "../sectionEdit/CurrentForm";
import { updateWebsite } from "@/hooks/slices/websites/WebsiteThunk";
import { toast } from "sonner";
import {
  CardConfigModal,
  FilterConfigModal,
  HeroConfigModal,
  LayoutConfigModal,
  PaginationConfigModal,
  StyleConfigModal,
} from "@/components/admin/product/Cart/CartModal";
import { TranslationDictionary } from "../translation/TranslationPage";
import StyleSidebar from "./StyleSidebar";
import { updateBusiness } from "@/hooks/slices/business/BusinessThunk";
import { IBusiness } from "@/models/business";

export type PageItem = {
  id: string;
  title: string;
  icon: "home" | "doc";
  seoIssue?: boolean;
  inNavigation?: boolean;
  isHomePage?: boolean;
  url?: string;
  seo?: WebsitePageModel["seo"];
  dictionary?: TranslationDictionary;
};

// Styling configuration type for ProductShowcase
export type ProductShowcaseStyleConfig = {
  layoutConfig?: LayoutConfigModal;
  styleConfig?: StyleConfigModal;
  heroConfig?: HeroConfigModal;
  paginationConfig?: PaginationConfigModal;
  filterConfig?: FilterConfigModal;
  cardConfig?: CardConfigModal;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function IconFor(item: PageItem) {
  return item.icon === "home" ? (
    <Home className="w-4 h-4" />
  ) : (
    <FileText className="w-4 h-4" />
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked
          ? "bg-violet-600 dark:bg-violet-500"
          : "bg-slate-300 dark:bg-slate-700",
      )}
      aria-pressed={checked}
    >
      <span
        className={cx(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

/** ✅ DRAG & DROP (no external library) */
function reorder<T>(list: T[], fromIndex: number, toIndex: number) {
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

type Props = {
  open: boolean;
  setOpen: (args: { isOpen: boolean; pageType: string }) => void;
  openSeoModal: () => void;
  handlePageType: (type: string) => void;
  pagetype: string;
  setCategoryStyleConfigs: any;
  categoryStyleConfigs: any;
};

export default function Pages({
  open,
  setOpen,
  openSeoModal,
  handlePageType,
  pagetype,
  categoryStyleConfigs,
  setCategoryStyleConfigs,
}: Props) {
  const [comingSoon, setComingSoon] = React.useState(false);
  const { websitePages } = useSelector((state: RootState) => state.websitePage);
  const dispatch = useDispatch<AppDispatch>();
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const { listCategory } = useSelector((state: RootState) => state.category);
  const { listProduct } = useSelector((state: RootState) => state.product);

  const [mainNav, setMainNav] = React.useState<PageItem[]>([]);

  // Collapsible sections state
  const [productPagesExpanded, setProductPagesExpanded] = React.useState(false);
  const [categoryPageExpanded, setCategoryPageExpanded] = React.useState(false);

  // Style sidebar state
  const [styleSidebarOpen, setStyleSidebarOpen] = React.useState(false);
  const [selectedCategoryForStyle, setSelectedCategoryForStyle] =
    React.useState<string | null>(null);

  const allPages = useMemo(() => {
    if (
      websitePages &&
      websitePages.length > 0 &&
      currentBusiness &&
      currentBusiness?.website?.primaryDomain &&
      currentBusiness?.website?.primaryDomain.length > 0
    ) {
      const primaryDomain = currentBusiness.website.primaryDomain[0];
      setComingSoon(currentBusiness.website?.isComingSoon ?? true);
      return websitePages.map((page): PageItem => {
        return {
          id: page._id,
          title: page.title,
          icon: page.isHomePage ? "home" : ("doc" as const),
          seoIssue: true,
          seo: page.seo,
          inNavigation: true,
          isHomePage: page.isHomePage,
          url: `${primaryDomain}/${page.slug}`,
          dictionary: page.dictionary ? page.dictionary : {},
        };
      });
    }
    return [];
  }, [websitePages, currentBusiness?.website]);

  const [hiddenNav, setHiddenNav] = React.useState<PageItem[]>([
    {
      id: "terms",
      title: "Terms & conditions",
      icon: "doc",
      inNavigation: false,
      url: "/terms",
    },
  ]);

  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const draggingIdRef = React.useRef<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const onDragStart = (id: string) => (e: React.DragEvent) => {
    draggingIdRef.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(id);
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromId =
      draggingIdRef.current ?? e.dataTransfer.getData("text/plain");
    draggingIdRef.current = null;
    setDragOverId(null);

    if (!fromId || fromId === id) return;

    setMainNav((prev) => {
      const fromIndex = prev.findIndex((p) => p.id === fromId);
      const toIndex = prev.findIndex((p) => p.id === id);
      if (fromIndex < 0 || toIndex < 0) return prev;
      return reorder(prev, fromIndex, toIndex);
    });
  };

  const toggleNav = (page: PageItem) => {
    if (page.inNavigation) {
      setMainNav((prev) => prev.filter((p) => p.id !== page.id));
      setHiddenNav((prev) => [{ ...page, inNavigation: false }, ...prev]);
    } else {
      setHiddenNav((prev) => prev.filter((p) => p.id !== page.id));
      setMainNav((prev) => [...prev, { ...page, inNavigation: true }]);
    }
  };

  const copyUrl = async (page: PageItem) => {
    const url = page.url ?? "/";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
  };

  const getDefaultStyleConfig = (): ProductShowcaseStyleConfig => ({
    layoutConfig: {
      filterPosition: "sidebar",
      gridColumns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      showHeroSection: true,
      heroHeight: "40vh",
    },
    styleConfig: {
      primaryColor: "#000000",
      secondaryColor: "#666666",
      accentColor: "#2563eb",
      fontFamily: "Montserrat",
      buttonStyle: "square",
      cardStyle: "flat",
    },
    heroConfig: {
      backgroundImage:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      title: "All Products",
      subtitle: "",
      overlayOpacity: 0.1,
      titleColor: "#ffffff",
      titleSize: "4xl md:text-5xl",
      titleTracking: "10px",
    },
    paginationConfig: {
      enabled: true,
      position: "bottom",
      style: "numbers",
      buttonShape: "square",
      itemsPerPage: 9,
      showPageInfo: true,
    },
    filterConfig: {
      showCategoryFilter: true,
      showColorPalette: true,
      enableDynamicFilters: true,
      filterStyle: "checkbox",
    },
    cardConfig: {
      showRating: true,
      showSaleBadge: true,
      imageAspectRatio: "3/4",
      hoverEffect: "scale",
      placeholderIcon: "👕",
    },
  });

  const onDragEnd = () => {
    draggingIdRef.current = null;
    setDragOverId(null);
  };

  const makeHomepage = (id: string) => {
    setMainNav((prev) => prev.map((p) => ({ ...p, isHomepage: p.id === id })));
  };

  const deletePage = (page: PageItem) => {
    if (page.inNavigation) setMainNav((p) => p.filter((x) => x.id !== page.id));
    else setHiddenNav((p) => p.filter((x) => x.id !== page.id));
  };

  const handlePages = (page: PageItem) => {
    const currentPage = websitePages.find((p) => p._id === page.id);
    if (currentPage) {
      dispatch(setPageLoading(true));
      dispatch(
        setPageEdit({
          page: currentPage,
          type: "page",
        }),
      );
    }
  };

  const handleOpenSeoModal = () => {
    openSeoModal();
  };

  // Need to be updated with Business Function

  const handleComingSoon = async (checked: boolean) => {
    setComingSoon(checked);
    let cloned = structuredClone(currentBusiness);

    if (cloned && cloned.website) {
      cloned.website.isComingSoon = checked;
    }

    // const response = await dispatch(
    //   updateWebsite({ id: data._id?.toString() || "", cloned: data }),
    // ).unwrap();
    const response = await dispatch(
      updateBusiness({
        businessId: cloned!._id?.toString() || "",
        input: cloned!,
      }),
    ).unwrap();
    if (response) {
      toast.success("Website updated successfully");
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    handlePageType(categorySlug);
    if (!categoryStyleConfigs[categorySlug]) {
      const category = listCategory.find((c) => c.slug === categorySlug);

      const defaultConfig = getDefaultStyleConfig();

      // Optionally customize the title based on category name
      if (category && defaultConfig.heroConfig) {
        defaultConfig.heroConfig.title = category.name;
      }

      setCategoryStyleConfigs({
        ...categoryStyleConfigs,
        [categorySlug]: defaultConfig,
      });
    }
  };

  const handleProductClick = (productid: string) => {
    handlePageType(productid);
  };

  const handleEditStyle = (categorySlug: string) => {
    setSelectedCategoryForStyle(categorySlug);
    setStyleSidebarOpen(true);
  };

  const handleStyleConfigChange = (config: ProductShowcaseStyleConfig) => {
    if (selectedCategoryForStyle) {
      setCategoryStyleConfigs({
        ...categoryStyleConfigs,
        [selectedCategoryForStyle]: config,
      });
      // Here you would typically save this to your backend/state management
      toast.success("Style updated successfully");
    }
  };

  const handleAddPage = () => {
    setOpen({
      isOpen: true,
      pageType: "add-Page",
    });
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full">
        <div
          className={cx(
            "rounded-none overflow-x-auto p-1",
            "bg-white ",
            "dark:bg-[#0b1220] dark:border-slate-800",
          )}
        >
          <div className="relative"></div>

          <div className="px-0 pb-6">
            {/* Main navigation */}
            <div>
              <div>
                <h6 className="text-sm font-semibold mb-2">Main navigation</h6>
              </div>

              <div className="rounded-none dark:border-slate-800 overflow-x-auto">
                <div className="px-0 border-b border-slate-200">
                  {allPages.length > 0 &&
                    allPages.map((p) => {
                      const isDragOver = dragOverId === p.id;
                      const isDragging = draggingIdRef.current === p.id;

                      return (
                        <div
                          key={p.id}
                          draggable
                          onDragStart={onDragStart(p.id)}
                          onDragOver={onDragOver(p.id)}
                          onDrop={onDrop(p.id)}
                          onDragEnd={onDragEnd}
                          className={cx(
                            "flex items-center gap-2 py-3 px-2 hover:bg-gray-50",
                            "border-b border-slate-200 last:border-b-0",
                            "dark:border-slate-800",
                            "transition-colors",
                            isDragOver && "bg-slate-50 dark:bg-white/5",
                            isDragging && "opacity-60",
                          )}
                        >
                          <div className=" flex gap-1  items-center text-slate-700 dark:text-slate-200">
                            <span>
                              <GripVertical className="w-4 h-4 cursor-move" />
                            </span>
                            <span>{IconFor(p)}</span>
                          </div>

                          <div
                            className="flex items-center justify-between w-full"
                            onClick={() => {
                              handlePageType("normal");
                              handlePages(p);
                            }}
                          >
                            <div
                              className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                              onClick={() => {
                                handlePageType("normal");
                                handlePages(p);
                              }}
                            >
                              {p.title}
                            </div>

                            <div className="flex items-center">
                              {p.seoIssue ? (
                                <SeoPill
                                  pages={p}
                                  openSeoModal={handleOpenSeoModal}
                                />
                              ) : null}

                              <PageMenu
                                open={openMenuId === p.id}
                                onOpenChange={(v) =>
                                  setOpenMenuId(v ? p.id : null)
                                }
                                page={p}
                                onMakeHomepage={() => makeHomepage(p.id)}
                                onToggleNav={() => toggleNav(p)}
                                onCopyUrl={() => copyUrl(p)}
                                onDelete={() => deletePage(p)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Tip: drag and drop pages to reorder your main navigation.
              </div>
            </div>

            {/* Other pages */}
            <div className="mt-6">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                <h6 className="text-sm font-semibold"> Other pages</h6>
              </div>

              <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <div className="px-3">
                  <div
                    className={cx(
                      "flex items-center gap-3 py-2 ",
                      "border-b border-slate-200 dark:border-slate-800",
                    )}
                  >
                    <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200 ">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Coming soon
                    </div>
                    <button
                      type="button"
                      className={cx(
                        "h-9 w-9 rounded-lg grid place-items-center",
                        "text-slate-500 hover:bg-slate-100",
                        "dark:text-slate-200 dark:hover:bg-white/5",
                      )}
                      aria-label="Info"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    <ToggleSwitch
                      checked={comingSoon}
                      onChange={handleComingSoon}
                    />
                  </div>

                  {/* Product Pages - Collapsible */}
                  <div className="border-b border-slate-200 dark:border-slate-800">
                    <div
                      className="flex items-center gap-3 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      onClick={() =>
                        setProductPagesExpanded(!productPagesExpanded)
                      }
                    >
                      <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Product pages
                      </div>
                      {productPagesExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {productPagesExpanded && (
                      <div className="pb-2 pl-10 space-y-2">
                        {listProduct && listProduct.length > 0 ? (
                          listProduct.map((product) => (
                            <div
                              key={product._id}
                              className="flex items-center justify-between group py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <div
                                className="flex-1 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                                onClick={() =>
                                  handleProductClick(`product-${product._id}`)
                                }
                              >
                                {product.title}
                              </div>
                              <button
                                // onClick={(e) => {
                                //   e.stopPropagation();
                                //   handleEditStyle(category.slug);
                                // }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-opacity"
                                title="Edit style"
                              >
                                <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-500 dark:text-slate-400 py-1">
                            No categories yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Category Page - Collapsible */}
                  <div>
                    <div
                      className="flex items-center gap-3 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      onClick={() =>
                        setCategoryPageExpanded(!categoryPageExpanded)
                      }
                    >
                      <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
                        <ListFilter className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Category pages
                      </div>
                      {categoryPageExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {categoryPageExpanded && (
                      <div className="pb-2 pl-10 space-y-2">
                        {listCategory && listCategory.length > 0 ? (
                          listCategory.map((category, idx) => (
                            <div
                              key={category._id?.toString() || idx}
                              className="flex items-center justify-between group py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <div
                                className="flex-1 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                                onClick={() =>
                                  handleCategoryClick(category.slug || "")
                                }
                              >
                                {category.name}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStyle(category.slug || "");
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-opacity"
                                title="Edit style"
                              >
                                <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-500 dark:text-slate-400 py-1">
                            No categories yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden from navigation */}
            <div className="mt-6">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                <h6 className="text-sm font-semibold">
                  Hidden from navigation
                </h6>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                These pages are accessible through search engines and URLs but
                do not appear in your navigation.
              </p>

              <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <div className="px-3">
                  {hiddenNav.map((p) => (
                    <div
                      key={p.id}
                      className={cx(
                        "flex items-center gap-3 py-1",
                        "border-b border-slate-200 last:border-b-0",
                        "dark:border-slate-800",
                      )}
                    >
                      <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {p.title}
                      </div>

                      <PageMenu
                        open={openMenuId === p.id}
                        onOpenChange={(v) => setOpenMenuId(v ? p.id : null)}
                        page={p}
                        onMakeHomepage={() => makeHomepage(p.id)}
                        onToggleNav={() => toggleNav(p)}
                        onCopyUrl={() => copyUrl(p)}
                        onDelete={() => deletePage(p)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div
            className={cx(
              "px-0 py-4 flex items-center justify-between",
              "border-t border-slate-200 bg-white",
              "dark:border-slate-800 dark:bg-[#0b1220]",
            )}
          >
            <button
              type="button"
              className={cx(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold",
                "bg-violet-600 text-white hover:bg-violet-700 transition-colors",
              )}
              onClick={handleAddPage}
            >
              <Plus className="w-5 h-5" />
              Add page
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cx(
                  "h-11 w-11 rounded-xl grid place-items-center",
                  "border border-slate-200 text-slate-700 hover:bg-slate-100",
                  "dark:border-slate-800 dark:text-slate-200 dark:hover:bg-white/5",
                )}
                aria-label="Add to list"
              >
                <ListPlus className="w-5 h-5" />
              </button>

              <button
                type="button"
                className={cx(
                  "h-11 w-11 rounded-xl grid place-items-center",
                  "border border-slate-200 text-slate-700 hover:bg-slate-100",
                  "dark:border-slate-800 dark:text-slate-200 dark:hover:bg-white/5",
                )}
                aria-label="Link"
              >
                <Link2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Style Sidebar */}
      <StyleSidebar
        isOpen={styleSidebarOpen}
        onClose={() => setStyleSidebarOpen(false)}
        config={
          selectedCategoryForStyle
            ? categoryStyleConfigs[selectedCategoryForStyle] || {}
            : {}
        }
        onConfigChange={handleStyleConfigChange}
      />
    </TooltipProvider>
  );
}
