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
  Clock,
  ListPlus,
  Link2,
  Link as LinkLucide,
  Trash2,
  LayoutGrid,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";
import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
import PageMenu from "./PageMenu";
import SeoPill from "./SeoPill";


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


const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function IconFor(item: PageItem) {
  return item.icon === "home" ? (
    <Home className="w-4 h-4" />
  ) : (
    <FileText className="w-4 h-4" />
  );
}
// function SeoPill() {
//   return (
//     <span
//       className={cx(
//         "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
//         "text-[12px] font-semibold",
//         "bg-amber-50 text-amber-700 border border-amber-200",
//         "dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20",
//       )}
//       onClick={() => {
//         handleOpenSeoModal()
//       }}
//     >
//       <AlertCircle className="w-4 h-4" />
//       SEO
//     </span>
//   );
// }

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
};

export default function Pages({ open, setOpen, openSeoModal }: Props) {
  const [comingSoon, setComingSoon] = React.useState(false);
  const { websitePages } = useSelector((state: RootState) => state.websitePage);
  const dispatch = useDispatch<AppDispatch>();
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const [mainNav, setMainNav] = React.useState<PageItem[]>([]);

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
          icon: page.isHomePage ? "home" : "doc" as const,
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
    // helps some browsers
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (id: string) => (e: React.DragEvent) => {
    e.preventDefault(); // ✅ required to allow drop
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
  // export default function Pages({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  //     const [comingSoon, setComingSoon] = React.useState(false);

  //     const [mainNav, setMainNav] = React.useState<PageItem[]>([
  //         { id: "home", title: "Home", icon: "home", seoIssue: true, inNavigation: true, isHomepage: true, url: "/" },
  //         { id: "shop", title: "Shop", icon: "doc", seoIssue: true, inNavigation: true, url: "/shop" },
  //         { id: "products", title: "Products", icon: "doc", seoIssue: true, inNavigation: true, url: "/products" },
  //     ]);

  // const makeHomepage = (id: string) => {
  //   setMainNav((prev) =>
  //     prev.map((p) => ({ ...p, isHomepage: p.id === id }))
  //   );
  // };

  const toggleNav = (page: PageItem) => {
    // In screenshot: "Show in navigation" for hidden pages.
    if (page.inNavigation) {
      // move from main -> hidden
      setMainNav((prev) => prev.filter((p) => p.id !== page.id));
      setHiddenNav((prev) => [{ ...page, inNavigation: false }, ...prev]);
    } else {
      // move from hidden -> main
      setHiddenNav((prev) => prev.filter((p) => p.id !== page.id));
      setMainNav((prev) => [...prev, { ...page, inNavigation: true }]);
    }
  };

  const copyUrl = async (page: PageItem) => {
    const url = page.url ?? "/";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
  };

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
    console.log("I ran")
    const currentPage = websitePages.find((p) => p._id === page.id);
    if (currentPage) {
      dispatch(
        setPageEdit({
          page: currentPage,
          type: "page",
        }),
      );
    }
  };

  const handleOpenSeoModal = () => {
 openSeoModal()
  };


  const handleComingSoon = async (checked: boolean) => {
    setComingSoon(checked);
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
          {/* Header */}
          <div className="relative">
          
          </div>

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
                          isDragging && "opacity-60"
                        )}
                      >
                    
                        {/* ✅ drag handle look (still draggable on whole row) */}
                        {/* <div className="w-7 grid place-items-center text-slate-400 1">
                         
                        </div> */}
                            
                        <div className=" flex gap-1  items-center text-slate-700 dark:text-slate-200">
                          <span> <GripVertical className="w-4 h-4 cursor-move" /></span>
                          <span>{IconFor(p)}</span>
                        </div>

                        <div className="flex-1 min-w-0 ms-1"
                        onClick={()=>{
                        handlePages(p)
                        }}
                        >
                        

                          <div
                            className="flex-1 min-w-0"
                           
                          >
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                            
                             onClick={() => {
                              handlePages(p);
                            }}>
                              {p.title}
                            </div>
                          </div>

                          {/* {p.seoIssue ? <SeoPill /> : null} */}

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

                        {p.seoIssue ? <SeoPill 
                         pages={p}
                         openSeoModal={handleOpenSeoModal}
                        /> : null}

                      
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* small hint */}
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Tip: drag and drop pages to reorder your main navigation.
              </div>
            </div>

            {/* Other pages */}
            <div className="mt-6">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Other pages
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-3">
                  <div
                    className={cx(
                      "flex items-center gap-3 py-3 ",
                      "border-b border-slate-200 dark:border-slate-800",
                    )}
                  >
                    <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
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

                  <div className="flex items-center gap-3 py-3">
                    <div className="w-7 grid place-items-center text-slate-700 dark:text-slate-200">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Product pages
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden from navigation */}
            <div className="mt-6">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Hidden from navigation
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                These pages are accessible through search engines and URLs but
                do not appear in your navigation.
              </p>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-3">
                  {hiddenNav.map((p) => (
                    <div
                      key={p.id}
                      className={cx(
                        "flex items-center gap-3 py-3",
                        "border-b border-slate-200 last:border-b-0",
                        "dark:border-slate-800",
                      )}
                    >
                      {/* <div className="w-7 grid place-items-center text-slate-400">
                        <GripVertical className="w-4 h-4" />
                      </div> */}

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
    </TooltipProvider>
  );
}
