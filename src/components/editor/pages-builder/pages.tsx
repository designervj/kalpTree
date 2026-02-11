// "use client";

// import * as React from "react";
// import {
//   GripVertical,
//   Home,
//   FileText,
//   MoreHorizontal,
//   AlertCircle,
//   Image as ImageIcon,
//   Plus,
//   Info,
//   ChevronRight,
//   Clock,
//   ListPlus,
//   Link2,
//   Link as LinkLucide,
//   Trash2,
//   LayoutGrid,
//   ListFilter,
// } from "lucide-react";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { useMemo } from "react";
// import { createPortal } from "react-dom";
// import { setPageLoading, setPageEdit } from "@/hooks/slices/pageEditSlice";
// import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
// import PageMenu from "./PageMenu";
// import SeoPill from "./SeoPill";
// import { Website } from "@/components/admin/AppShell";
// import CurrentForm from "../sectionEdit/CurrentForm";
// import { updateWebsite } from "@/hooks/slices/websites/WebsiteThunk";
// import { toast } from "sonner";

// export type PageItem = {
//   id: string;
//   title: string;
//   icon: "home" | "doc";
//   seoIssue?: boolean;
//   inNavigation?: boolean;
//   isHomePage?: boolean;
//   url?: string;
//   seo?: WebsitePageModel["seo"];
// };

// const cx = (...classes: Array<string | false | null | undefined>) =>
//   classes.filter(Boolean).join(" ");

// function IconFor(item: PageItem) {
//   return item.icon === "home" ? (
//     <Home className="w-4 h-4" />
//   ) : (
//     <FileText className="w-4 h-4" />
//   );
// }
// // function SeoPill() {
// //   return (
// //     <span
// //       className={cx(
// //         "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
// //         "text-[12px] font-semibold",
// //         "bg-amber-50 text-amber-700 border border-amber-200",
// //         "dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20",
// //       )}
// //       onClick={() => {
// //         handleOpenSeoModal()
// //       }}
// //     >
// //       <AlertCircle className="w-4 h-4" />
// //       SEO
// //     </span>
// //   );
// // }

// function ToggleSwitch({
//   checked,
//   onChange,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onChange(!checked)}
//       className={cx(
//         "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
//         checked
//           ? "bg-violet-600 dark:bg-violet-500"
//           : "bg-slate-300 dark:bg-slate-700",
//       )}
//       aria-pressed={checked}
//     >
//       <span
//         className={cx(
//           "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
//           checked ? "translate-x-5" : "translate-x-1",
//         )}
//       />
//     </button>
//   );
// }

// /** ✅ DRAG & DROP (no external library) */
// function reorder<T>(list: T[], fromIndex: number, toIndex: number) {
//   const next = [...list];
//   const [moved] = next.splice(fromIndex, 1);
//   next.splice(toIndex, 0, moved);
//   return next;
// }

// type Props = {
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   openSeoModal: () => void;
//   handlePageType: (type: string) => void;
// };

// export default function Pages({
//   open,
//   setOpen,
//   openSeoModal,
//   handlePageType,
// }: Props) {
//   const [comingSoon, setComingSoon] = React.useState(false);
//   const { websitePages } = useSelector((state: RootState) => state.websitePage);
//   const dispatch = useDispatch<AppDispatch>();
//   const { currentWebsite } = useSelector((state: RootState) => state.websites);
//   const [mainNav, setMainNav] = React.useState<PageItem[]>([]);

//   const allPages = useMemo(() => {
//     if (
//       websitePages &&
//       websitePages.length > 0 &&
//       currentWebsite &&
//       currentWebsite.primaryDomain &&
//       currentWebsite.primaryDomain.length > 0
//     ) {
//       const primaryDomain = currentWebsite.primaryDomain[0];
//       setComingSoon(currentWebsite?.isComingSoon ?? true);
//       return websitePages.map((page): PageItem => {
//         return {
//           id: page._id,
//           title: page.title,
//           icon: page.isHomePage ? "home" : ("doc" as const),
//           seoIssue: true,
//           seo: page.seo,
//           inNavigation: true,
//           isHomePage: page.isHomePage,
//           url: `${primaryDomain}/${page.slug}`,
//         };
//       });
//     }
//     return [];
//   }, [websitePages, currentWebsite]);

//   const [hiddenNav, setHiddenNav] = React.useState<PageItem[]>([
//     {
//       id: "terms",
//       title: "Terms & conditions",
//       icon: "doc",
//       inNavigation: false,
//       url: "/terms",
//     },
//   ]);

//   const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

//   const draggingIdRef = React.useRef<string | null>(null);
//   const [dragOverId, setDragOverId] = React.useState<string | null>(null);

//   const onDragStart = (id: string) => (e: React.DragEvent) => {
//     draggingIdRef.current = id;
//     e.dataTransfer.effectAllowed = "move";
//     // helps some browsers
//     e.dataTransfer.setData("text/plain", id);
//   };

//   const onDragOver = (id: string) => (e: React.DragEvent) => {
//     e.preventDefault(); // ✅ required to allow drop
//     setDragOverId(id);
//     e.dataTransfer.dropEffect = "move";
//   };

//   const onDrop = (id: string) => (e: React.DragEvent) => {
//     e.preventDefault();
//     const fromId =
//       draggingIdRef.current ?? e.dataTransfer.getData("text/plain");
//     draggingIdRef.current = null;
//     setDragOverId(null);

//     if (!fromId || fromId === id) return;

//     setMainNav((prev) => {
//       const fromIndex = prev.findIndex((p) => p.id === fromId);
//       const toIndex = prev.findIndex((p) => p.id === id);
//       if (fromIndex < 0 || toIndex < 0) return prev;
//       return reorder(prev, fromIndex, toIndex);
//     });
//   };
//   // export default function Pages({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
//   //     const [comingSoon, setComingSoon] = React.useState(false);

//   //     const [mainNav, setMainNav] = React.useState<PageItem[]>([
//   //         { id: "home", title: "Home", icon: "home", seoIssue: true, inNavigation: true, isHomepage: true, url: "/" },
//   //         { id: "shop", title: "Shop", icon: "doc", seoIssue: true, inNavigation: true, url: "/shop" },
//   //         { id: "products", title: "Products", icon: "doc", seoIssue: true, inNavigation: true, url: "/products" },
//   //     ]);

//   // const makeHomepage = (id: string) => {
//   //   setMainNav((prev) =>
//   //     prev.map((p) => ({ ...p, isHomepage: p.id === id }))
//   //   );
//   // };

//   const toggleNav = (page: PageItem) => {
//     // In screenshot: "Show in navigation" for hidden pages.
//     if (page.inNavigation) {
//       // move from main -> hidden
//       setMainNav((prev) => prev.filter((p) => p.id !== page.id));
//       setHiddenNav((prev) => [{ ...page, inNavigation: false }, ...prev]);
//     } else {
//       // move from hidden -> main
//       setHiddenNav((prev) => prev.filter((p) => p.id !== page.id));
//       setMainNav((prev) => [...prev, { ...page, inNavigation: true }]);
//     }
//   };

//   const copyUrl = async (page: PageItem) => {
//     const url = page.url ?? "/";
//     try {
//       await navigator.clipboard.writeText(url);
//     } catch {
//       // fallback
//       const t = document.createElement("textarea");
//       t.value = url;
//       document.body.appendChild(t);
//       t.select();
//       document.execCommand("copy");
//       document.body.removeChild(t);
//     }
//   };

//   const onDragEnd = () => {
//     draggingIdRef.current = null;
//     setDragOverId(null);
//   };

//   const makeHomepage = (id: string) => {
//     setMainNav((prev) => prev.map((p) => ({ ...p, isHomepage: p.id === id })));
//   };

//   const deletePage = (page: PageItem) => {
//     if (page.inNavigation) setMainNav((p) => p.filter((x) => x.id !== page.id));
//     else setHiddenNav((p) => p.filter((x) => x.id !== page.id));
//   };

//   const handlePages = (page: PageItem) => {
//     console.log("I ran");
//     const currentPage = websitePages.find((p) => p._id === page.id);
//     if (currentPage) {
//       dispatch(setPageLoading(true));
//       dispatch(
//         setPageEdit({
//           page: currentPage,
//           type: "page",
//         }),
//       );
//     }
//   };

//   const handleOpenSeoModal = () => {
//     openSeoModal();
//   };

//   const handleComingSoon = async (checked: boolean) => {
//     setComingSoon(checked);
//     const data = {
//       ...currentWebsite,
//       isComingSoon: checked,
//     };
//     const response = await dispatch(
//       updateWebsite({ id: data._id?.toString() || "", websiteData: data }),
//     ).unwrap();
//     if (response) {
//       toast.success("Website updated successfully");
//     }
//   };

//   return (
//     <TooltipProvider delayDuration={150}>
//       <div className="h-full">
//         <div
//           className={cx(
//             "rounded-none overflow-hidden p-1",
//             "bg-white ",
//             "dark:bg-[#0b1220] dark:border-slate-800",
//           )}
//         >
//           {/* Header */}
//           <div className="relative"></div>

//           <div className="px-0 pb-6">
//             {/* Main navigation */}
//             <div>
//               <div>
//                 <h6 className="text-sm font-semibold mb-2">Main navigation</h6>
//               </div>

//               <div className="rounded-none dark:border-slate-800 overflow-hidden">
//                 <div className="px-0 border-b border-slate-200">
//                   {allPages.length > 0 &&
//                     allPages.map((p) => {
//                       const isDragOver = dragOverId === p.id;
//                       const isDragging = draggingIdRef.current === p.id;

//                       return (
//                         <div
//                           key={p.id}
//                           draggable
//                           onDragStart={onDragStart(p.id)}
//                           onDragOver={onDragOver(p.id)}
//                           onDrop={onDrop(p.id)}
//                           onDragEnd={onDragEnd}
//                           className={cx(
//                             "flex items-center gap-2 py-3 px-2 hover:bg-gray-50",
//                             "border-b border-slate-200 last:border-b-0",
//                             "dark:border-slate-800",
//                             "transition-colors",
//                             isDragOver && "bg-slate-50 dark:bg-white/5",
//                             isDragging && "opacity-60",
//                           )}
//                         >
//                           {/* ✅ drag handle look (still draggable on whole row) */}
//                           {/* <div className="w-7 grid place-items-center text-slate-400 1">

//                         </div> */}

//                           <div className=" flex gap-1  items-center text-slate-700 dark:text-slate-200">
//                             <span>
//                               {" "}
//                               <GripVertical className="w-4 h-4 cursor-move" />
//                             </span>
//                             <span>{IconFor(p)}</span>
//                           </div>

//                           <div
//                             className="flex items-center justify-between w-full"
//                             onClick={() => {
//                               handlePageType("normal");
//                               handlePages(p);
//                             }}
//                           >
//                             <div
//                               className="text-sm font-semibold text-slate-900 dark:text-slate-100"
//                               onClick={() => {
//                                 handlePageType("normal");
//                                 handlePages(p);
//                               }}
//                             >
//                               {p.title}
//                             </div>

//                             {/* {p.seoIssue ? <SeoPill /> : null} */}

//                             <div className="flex items-center">
//                               {p.seoIssue ? (
//                                 <SeoPill
//                                   pages={p}
//                                   openSeoModal={handleOpenSeoModal}
//                                 />
//                               ) : null}

//                               <PageMenu
//                                 open={openMenuId === p.id}
//                                 onOpenChange={(v) =>
//                                   setOpenMenuId(v ? p.id : null)
//                                 }
//                                 page={p}
//                                 onMakeHomepage={() => makeHomepage(p.id)}
//                                 onToggleNav={() => toggleNav(p)}
//                                 onCopyUrl={() => copyUrl(p)}
//                                 onDelete={() => deletePage(p)}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                 </div>
//               </div>

//               {/* small hint */}
//               <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
//                 Tip: drag and drop pages to reorder your main navigation.
//               </div>
//             </div>

//             {/* Other pages */}
//             <div className="mt-6">
//               <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
//                 <h6 className="text-sm font-semibold"> Other pages</h6>
//               </div>

//               <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
//                 <div className="px-3">
//                   <div
//                     className={cx(
//                       "flex items-center gap-3 py-2 ",
//                       "border-b border-slate-200 dark:border-slate-800",
//                     )}
//                   >
//                     <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200 ">
//                       <Clock className="w-4 h-4" />
//                     </div>
//                     <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
//                       Coming soon
//                     </div>
//                     <button
//                       type="button"
//                       className={cx(
//                         "h-9 w-9 rounded-lg grid place-items-center",
//                         "text-slate-500 hover:bg-slate-100",
//                         "dark:text-slate-200 dark:hover:bg-white/5",
//                       )}
//                       aria-label="Info"
//                     >
//                       <Info className="w-5 h-5" />
//                     </button>
//                     <ToggleSwitch
//                       checked={comingSoon}
//                       onChange={handleComingSoon}
//                     />
//                   </div>

//                   <div className="flex items-center gap-3 py-3">
//                     <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
//                       <LayoutGrid className="w-4 h-4" />
//                     </div>
//                     <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
//                       Product pages
//                     </div>
//                     <ChevronRight className="w-4 h-4 text-slate-400" />
//                   </div>

//                   <div
//                     onClick={() => handlePageType("product-category")}
//                     className="flex items-center gap-3 py-3"
//                   >
//                     <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
//                       <ListFilter className="w-4 h-4" />
//                     </div>
//                     <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
//                       Category page
//                     </div>
//                     <ChevronRight className="w-4 h-4 text-slate-400" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Hidden from navigation */}
//             <div className="mt-6">
//               <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
//                 <h6 className="text-sm font-semibold">
//                   {" "}
//                   Hidden from navigation
//                 </h6>
//               </div>

//               <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
//                 These pages are accessible through search engines and URLs but
//                 do not appear in your navigation.
//               </p>

//               <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
//                 <div className="px-3">
//                   {hiddenNav.map((p) => (
//                     <div
//                       key={p.id}
//                       className={cx(
//                         "flex items-center gap-3 py-1",
//                         "border-b border-slate-200 last:border-b-0",
//                         "dark:border-slate-800",
//                       )}
//                     >
//                       {/* <div className="w-7 grid place-items-center text-slate-400">
//                         <GripVertical className="w-4 h-4" />
//                       </div> */}

//                       <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
//                         <FileText className="w-4 h-4" />
//                       </div>

//                       <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
//                         {p.title}
//                       </div>

//                       <PageMenu
//                         open={openMenuId === p.id}
//                         onOpenChange={(v) => setOpenMenuId(v ? p.id : null)}
//                         page={p}
//                         onMakeHomepage={() => makeHomepage(p.id)}
//                         onToggleNav={() => toggleNav(p)}
//                         onCopyUrl={() => copyUrl(p)}
//                         onDelete={() => deletePage(p)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bottom actions */}
//           <div
//             className={cx(
//               "px-0 py-4 flex items-center justify-between",
//               "border-t border-slate-200 bg-white",
//               "dark:border-slate-800 dark:bg-[#0b1220]",
//             )}
//           >
//             <button
//               type="button"
//               className={cx(
//                 "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold",
//                 "bg-violet-600 text-white hover:bg-violet-700 transition-colors",
//               )}
//               onClick={() => setOpen(true)}
//             >
//               <Plus className="w-5 h-5" />
//               Add page
//             </button>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 className={cx(
//                   "h-11 w-11 rounded-xl grid place-items-center",
//                   "border border-slate-200 text-slate-700 hover:bg-slate-100",
//                   "dark:border-slate-800 dark:text-slate-200 dark:hover:bg-white/5",
//                 )}
//                 aria-label="Add to list"
//               >
//                 <ListPlus className="w-5 h-5" />
//               </button>

//               <button
//                 type="button"
//                 className={cx(
//                   "h-11 w-11 rounded-xl grid place-items-center",
//                   "border border-slate-200 text-slate-700 hover:bg-slate-100",
//                   "dark:border-slate-800 dark:text-slate-200 dark:hover:bg-white/5",
//                 )}
//                 aria-label="Link"
//               >
//                 <Link2 className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }

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

export type PageItem = {
  id: string;
  title: string;
  icon: "home" | "doc";
  seoIssue?: boolean;
  inNavigation?: boolean;
  isHomePage?: boolean;
  url?: string;
  seo?: WebsitePageModel["seo"];
};

// Styling configuration type for ProductShowcase
export type ProductShowcaseStyleConfig = {
  layoutConfig?: {
    filterPosition?: "sidebar" | "top";
    gridColumns?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    showHeroSection?: boolean;
    heroHeight?: string;
  };
  styleConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    buttonStyle?: "rounded" | "square" | "pill";
    cardStyle?: "elevated" | "flat" | "bordered";
  };
  heroConfig?: {
    backgroundImage?: string;
    title?: string;
    subtitle?: string;
    overlayOpacity?: number;
    titleColor?: string;
    titleSize?: string;
    titleTracking?: string;
  };
  paginationConfig?: {
    enabled?: boolean;
    position?: "top" | "bottom" | "both";
    style?: "numbers" | "simple" | "compact";
    buttonShape?: "square" | "rounded" | "circular";
    itemsPerPage?: number;
    showPageInfo?: boolean;
  };
  filterConfig?: {
    showCategoryFilter?: boolean;
    showColorPalette?: boolean;
    enableDynamicFilters?: boolean;
    filterStyle?: "checkbox" | "button" | "chip";
  };
  cardConfig?: {
    showRating?: boolean;
    showSaleBadge?: boolean;
    imageAspectRatio?: string;
    hoverEffect?: "scale" | "lift" | "none";
    placeholderIcon?: string;
  };
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
  setOpen: (open: boolean) => void;
  openSeoModal: () => void;
  handlePageType: (type: string) => void;
  pagetype: string;
  setCategoryStyleConfigs: any;
  categoryStyleConfigs: any;
};

// Style Sidebar Component
const StyleSidebar = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  config: ProductShowcaseStyleConfig;
  onConfigChange: (config: ProductShowcaseStyleConfig) => void;
}) => {
  const [activeGroup, setActiveGroup] = React.useState<string | null>("layout");

  const updateConfig = (
    section: keyof ProductShowcaseStyleConfig,
    key: string,
    value: any,
  ) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [key]: value,
      },
    });
  };

  const groups = [
    {
      id: "layout",
      label: "Layout",
      icon: <Layout className="w-4 h-4" />,
      sections: [
        {
          label: "Filter Position",
          type: "select",
          value: config.layoutConfig?.filterPosition || "sidebar",
          options: [
            { label: "Sidebar", value: "sidebar" },
            { label: "Top", value: "top" },
          ],
          onChange: (value: string) =>
            updateConfig("layoutConfig", "filterPosition", value),
        },
        {
          label: "Show Hero Section",
          type: "toggle",
          value: config.layoutConfig?.showHeroSection ?? true,
          onChange: (value: boolean) =>
            updateConfig("layoutConfig", "showHeroSection", value),
        },
        {
          label: "Hero Height",
          type: "text",
          value: config.layoutConfig?.heroHeight || "40vh",
          onChange: (value: string) =>
            updateConfig("layoutConfig", "heroHeight", value),
        },
        {
          label: "Grid Columns (Mobile)",
          type: "number",
          value: config.layoutConfig?.gridColumns?.mobile || 1,
          min: 1,
          max: 3,
          onChange: (value: number) =>
            updateConfig("layoutConfig", "gridColumns", {
              ...config.layoutConfig?.gridColumns,
              mobile: value,
            }),
        },
        {
          label: "Grid Columns (Tablet)",
          type: "number",
          value: config.layoutConfig?.gridColumns?.tablet || 2,
          min: 1,
          max: 4,
          onChange: (value: number) =>
            updateConfig("layoutConfig", "gridColumns", {
              ...config.layoutConfig?.gridColumns,
              tablet: value,
            }),
        },
        {
          label: "Grid Columns (Desktop)",
          type: "number",
          value: config.layoutConfig?.gridColumns?.desktop || 3,
          min: 1,
          max: 6,
          onChange: (value: number) =>
            updateConfig("layoutConfig", "gridColumns", {
              ...config.layoutConfig?.gridColumns,
              desktop: value,
            }),
        },
      ],
    },
    {
      id: "colors",
      label: "Colors & Theme",
      icon: <Palette className="w-4 h-4" />,
      sections: [
        {
          label: "Primary Color",
          type: "color",
          value: config.styleConfig?.primaryColor || "#000000",
          onChange: (value: string) =>
            updateConfig("styleConfig", "primaryColor", value),
        },
        {
          label: "Secondary Color",
          type: "color",
          value: config.styleConfig?.secondaryColor || "#666666",
          onChange: (value: string) =>
            updateConfig("styleConfig", "secondaryColor", value),
        },
        {
          label: "Accent Color",
          type: "color",
          value: config.styleConfig?.accentColor || "#2563eb",
          onChange: (value: string) =>
            updateConfig("styleConfig", "accentColor", value),
        },
        {
          label: "Button Style",
          type: "select",
          value: config.styleConfig?.buttonStyle || "square",
          options: [
            { label: "Square", value: "square" },
            { label: "Rounded", value: "rounded" },
            { label: "Pill", value: "pill" },
          ],
          onChange: (value: string) =>
            updateConfig("styleConfig", "buttonStyle", value),
        },
        {
          label: "Card Style",
          type: "select",
          value: config.styleConfig?.cardStyle || "flat",
          options: [
            { label: "Flat", value: "flat" },
            { label: "Elevated", value: "elevated" },
            { label: "Bordered", value: "bordered" },
          ],
          onChange: (value: string) =>
            updateConfig("styleConfig", "cardStyle", value),
        },
      ],
    },
    {
      id: "typography",
      label: "Typography",
      icon: <Type className="w-4 h-4" />,
      sections: [
        {
          label: "Font Family",
          type: "select",
          value: config.styleConfig?.fontFamily || "Montserrat",
          options: [
            { label: "Montserrat", value: "Montserrat" },
            { label: "Playfair Display", value: "Playfair Display" },
            { label: "Roboto", value: "Roboto" },
            { label: "Open Sans", value: "Open Sans" },
            { label: "Lato", value: "Lato" },
          ],
          onChange: (value: string) =>
            updateConfig("styleConfig", "fontFamily", value),
        },
        {
          label: "Title Size",
          type: "text",
          value: config.heroConfig?.titleSize || "4xl md:text-5xl",
          onChange: (value: string) =>
            updateConfig("heroConfig", "titleSize", value),
        },
        {
          label: "Title Tracking",
          type: "text",
          value: config.heroConfig?.titleTracking || "10px",
          onChange: (value: string) =>
            updateConfig("heroConfig", "titleTracking", value),
        },
      ],
    },
    {
      id: "hero",
      label: "Hero Section",
      icon: <Sparkles className="w-4 h-4" />,
      sections: [
        {
          label: "Title",
          type: "text",
          value: config.heroConfig?.title || "All Products",
          onChange: (value: string) =>
            updateConfig("heroConfig", "title", value),
        },
        {
          label: "Subtitle",
          type: "text",
          value: config.heroConfig?.subtitle || "",
          onChange: (value: string) =>
            updateConfig("heroConfig", "subtitle", value),
        },
        {
          label: "Background Image URL",
          type: "text",
          value: config.heroConfig?.backgroundImage || "",
          onChange: (value: string) =>
            updateConfig("heroConfig", "backgroundImage", value),
        },
        {
          label: "Overlay Opacity",
          type: "number",
          value: config.heroConfig?.overlayOpacity || 0.1,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: (value: number) =>
            updateConfig("heroConfig", "overlayOpacity", value),
        },
        {
          label: "Title Color",
          type: "color",
          value: config.heroConfig?.titleColor || "#ffffff",
          onChange: (value: string) =>
            updateConfig("heroConfig", "titleColor", value),
        },
      ],
    },
    {
      id: "pagination",
      label: "Pagination",
      icon: <ChevronRight className="w-4 h-4" />,
      sections: [
        {
          label: "Enable Pagination",
          type: "toggle",
          value: config.paginationConfig?.enabled ?? true,
          onChange: (value: boolean) =>
            updateConfig("paginationConfig", "enabled", value),
        },
        {
          label: "Items Per Page",
          type: "number",
          value: config.paginationConfig?.itemsPerPage || 9,
          min: 3,
          max: 50,
          onChange: (value: number) =>
            updateConfig("paginationConfig", "itemsPerPage", value),
        },
        {
          label: "Position",
          type: "select",
          value: config.paginationConfig?.position || "bottom",
          options: [
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Both", value: "both" },
          ],
          onChange: (value: string) =>
            updateConfig("paginationConfig", "position", value),
        },
        {
          label: "Style",
          type: "select",
          value: config.paginationConfig?.style || "numbers",
          options: [
            { label: "Numbers", value: "numbers" },
            { label: "Simple", value: "simple" },
            { label: "Compact", value: "compact" },
          ],
          onChange: (value: string) =>
            updateConfig("paginationConfig", "style", value),
        },
        {
          label: "Button Shape",
          type: "select",
          value: config.paginationConfig?.buttonShape || "square",
          options: [
            { label: "Square", value: "square" },
            { label: "Rounded", value: "rounded" },
            { label: "Circular", value: "circular" },
          ],
          onChange: (value: string) =>
            updateConfig("paginationConfig", "buttonShape", value),
        },
      ],
    },
    {
      id: "filters",
      label: "Filters",
      icon: <ListFilter className="w-4 h-4" />,
      sections: [
        {
          label: "Show Category Filter",
          type: "toggle",
          value: config.filterConfig?.showCategoryFilter ?? true,
          onChange: (value: boolean) =>
            updateConfig("filterConfig", "showCategoryFilter", value),
        },
        {
          label: "Show Color Palette",
          type: "toggle",
          value: config.filterConfig?.showColorPalette ?? true,
          onChange: (value: boolean) =>
            updateConfig("filterConfig", "showColorPalette", value),
        },
        {
          label: "Enable Dynamic Filters",
          type: "toggle",
          value: config.filterConfig?.enableDynamicFilters ?? true,
          onChange: (value: boolean) =>
            updateConfig("filterConfig", "enableDynamicFilters", value),
        },
      ],
    },
    {
      id: "cards",
      label: "Product Cards",
      icon: <Eye className="w-4 h-4" />,
      sections: [
        {
          label: "Show Rating",
          type: "toggle",
          value: config.cardConfig?.showRating ?? true,
          onChange: (value: boolean) =>
            updateConfig("cardConfig", "showRating", value),
        },
        {
          label: "Show Sale Badge",
          type: "toggle",
          value: config.cardConfig?.showSaleBadge ?? true,
          onChange: (value: boolean) =>
            updateConfig("cardConfig", "showSaleBadge", value),
        },
        {
          label: "Image Aspect Ratio",
          type: "text",
          value: config.cardConfig?.imageAspectRatio || "3/4",
          onChange: (value: string) =>
            updateConfig("cardConfig", "imageAspectRatio", value),
        },
        {
          label: "Hover Effect",
          type: "select",
          value: config.cardConfig?.hoverEffect || "scale",
          options: [
            { label: "Scale", value: "scale" },
            { label: "Lift", value: "lift" },
            { label: "None", value: "none" },
          ],
          onChange: (value: string) =>
            updateConfig("cardConfig", "hoverEffect", value),
        },
        {
          label: "Placeholder Icon",
          type: "text",
          value: config.cardConfig?.placeholderIcon || "👕",
          onChange: (value: string) =>
            updateConfig("cardConfig", "placeholderIcon", value),
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Style Settings
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border-b border-slate-200 dark:border-slate-800"
          >
            <button
              onClick={() =>
                setActiveGroup(activeGroup === group.id ? null : group.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-violet-600 dark:text-violet-400">
                  {group.icon}
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {group.label}
                </span>
              </div>
              {activeGroup === group.id ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {activeGroup === group.id && (
              <div className="px-4 pb-4 space-y-4 bg-slate-50 dark:bg-slate-800/30">
                {group.sections.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {section.label}
                    </label>

                    {section.type === "text" && (
                      <input
                        type="text"
                        value={section.value}
                        onChange={(e) => section.onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    )}

                    {section.type === "number" && (
                      <input
                        type="number"
                        value={section.value}
                        min={section.min}
                        max={section.max}
                        step={section.step || 1}
                        onChange={(e) =>
                          section.onChange(parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    )}

                    {section.type === "color" && (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={section.value}
                          onChange={(e) => section.onChange(e.target.value)}
                          className="h-10 w-20 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={section.value}
                          onChange={(e) => section.onChange(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    )}

                    {section.type === "select" && (
                      <select
                        value={section.value}
                        onChange={(e) => section.onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      >
                        {section.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {section.type === "toggle" && (
                      <ToggleSwitch
                        checked={section.value}
                        onChange={section.onChange}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
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
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { listCategory } = useSelector((state: RootState) => state.category);
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
      currentWebsite &&
      currentWebsite.primaryDomain &&
      currentWebsite.primaryDomain.length > 0
    ) {
      const primaryDomain = currentWebsite.primaryDomain[0];
      setComingSoon(currentWebsite?.isComingSoon ?? true);
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
        };
      });
    }
    return [];
  }, [websitePages, currentWebsite]);

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

  const handleComingSoon = async (checked: boolean) => {
    setComingSoon(checked);
    const data = {
      ...currentWebsite,
      isComingSoon: checked,
    };
    const response = await dispatch(
      updateWebsite({ id: data._id?.toString() || "", websiteData: data }),
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

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full">
        <div
          className={cx(
            "rounded-none overflow-hidden p-1",
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

              <div className="rounded-none dark:border-slate-800 overflow-hidden">
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

              <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                      <div className="pb-2 pl-10 space-y-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400 py-1">
                          No product pages yet
                        </div>
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
                          listCategory.map((category) => (
                            <div
                              key={category._id}
                              className="flex items-center justify-between group py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <div
                                className="flex-1 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                                onClick={() =>
                                  handleCategoryClick(category.slug)
                                }
                              >
                                {category.name}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStyle(category.slug);
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

              <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
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
              onClick={() => setOpen(true)}
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
