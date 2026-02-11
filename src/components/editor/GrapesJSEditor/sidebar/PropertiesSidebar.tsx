"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { RiFileCopy2Line } from "react-icons/ri";
import {
  Box,
  CheckCircle2,
  LayoutGrid,
  Layers,
  MoreHorizontal,
  MousePointer,
  Palette,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InteractivityEditor } from "../../interactivity/interactivity-editor";
import { StyleEditor } from "../../style-editor/style-editor";
import { AttributesEditor } from "../../attributes-editor/attributes-editor";
import Pages from "../../pages-builder/pages";
import SeobuilderPage from "../../Seobuilder/SeobuilderPage";

import StorePage from "../../storeBuilder/StorePage";
import AiToolsPage from "../../aitools/AiToolsPage";
import ElemetsPage from "../../blogbuilder/BlogPage";
import BlogPage from "../../blogbuilder/BlogPage";
import { GoNote } from "react-icons/go";
import PageLayer from "./PageLayer";
import AllBuilderPage from "../../allbuilderpage/AllBuilderPage";
import FormsPage from "../../forms-manager/FormsPage";
import { useEffect } from "react";

// ✅ import your Pages component (adjust path)
// <-- change path as per your project

type PropertiesSidebarProps = {
  showSidebar: boolean;
  selectedElement: any;
  styles: any;
  onStyleChange: (property: string, value: string) => void;
  onAttributeChange: (name: string, value: any) => void;
  onInteractivityChange: (config: any) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
  actions: any;
  handlePageType: (type: string) => void;
  pagetype: string;
  categoryStyleConfigs: any;
  setCategoryStyleConfigs: any;
};

type TabKey =
  | "style"
  | "global"
  | "pages"
  | "forms"
  | "styles"
  | "ai"
  | "store"
  | "seo"
  | "more"
  | "layer"
  | "productgallery";

const TAB_TITLES: Record<TabKey, string> = {
  style: "Styles & Attributes ",
  global: "Global",
  // attributes: "Attributes",
  // interactivity: "Interactivity",
  layer: "Layer",
  //setup: "Setup",

  pages: "Pages and Navigation",
  forms: "Forms",
  styles: "Styles",
  ai: "AI Tools",
  store: "Store",
  seo: "SEO",
  productgallery: "Products",
  more: "More",
};

import { useEditorContext } from "../../EditorContext";
import ProductGalleryPage from "../../productgallery/ProductGalleryPage";
import GlobalStylesSection from "../../style-editor/GlobalStyle";
import GetAllcategory from "@/components/admin/category/listCategory/GetAllcategory";

const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  showSidebar,
  selectedElement,
  styles,
  onStyleChange,
  onAttributeChange,
  onInteractivityChange,
  setOpen,
  open,
  actions,
  handlePageType,
  pagetype,
  categoryStyleConfigs,
  setCategoryStyleConfigs,
}) => {
  const [tab, setTab] = React.useState<TabKey>("style");

  // ✅ Hooks must be called BEFORE any early returns
  const { editForm } = useEditorContext();

  // open forms page
  useEffect(() => {
    if (editForm) {
      setTab("forms");
      // setOpen(true);
    }
  }, [editForm]);

  // Early return AFTER all hooks
  if (!showSidebar) return null;
  const renderEmptySelectionMessage = (
    icon: "Box" | "MousePointer",
    type: string,
  ) => {
    const Icon = icon === "MousePointer" ? MousePointer : Box;

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500 dark:text-slate-400">
        <Icon className="w-10 h-10 mb-3 opacity-50" />
        <h3 className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-200">
          No Element Selected
        </h3>
        <p className="text-xs">
          Select an element on the canvas to edit its {type}.
        </p>
      </div>
    );
  };

  // ✅ allow JSX title too
  const renderPlaceholder = (title: React.ReactNode, desc?: string) => {
    return (
      <div className="h-full flex flex-col items-start justify-start gap-2">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </div>
        {/* <div className="text-xs text-slate-500 dark:text-slate-400">
          {desc ?? "This panel is not implemented yet."}
        </div> */}
      </div>
    );
  };

  const handleOpenSeoModal = () => {
    setTab("seo");
  };

  const renderRightContent = () => {
    switch (tab) {
      // case "style":
      //   if (!selectedElement) return renderEmptySelectionMessage("Box", "styles");
      //   return <StyleEditor styles={styles} onStyleChange={onStyleChange} /> ;

      case "style":
        if (!selectedElement)
          return renderEmptySelectionMessage("Box", "attributes");
        return (
          // <AttributesEditor
          //   selectedElement={selectedElement}
          //   onAttributeChange={onAttributeChange}
          // />

          <Tabs defaultValue="overview" className="">
            <TabsList>
              <TabsTrigger value="overview">Style</TabsTrigger>
              <TabsTrigger value="analytics">Attributes</TabsTrigger>
              <TabsTrigger value="reports">Interactivity</TabsTrigger>
              {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview">
              <StyleEditor
                selectedElement={selectedElement}
                styles={styles}
                onStyleChange={onStyleChange}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <AttributesEditor
                selectedElement={selectedElement}
                onAttributeChange={onAttributeChange}
              />
            </TabsContent>
            <TabsContent value="reports">
              {/* <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Generate and download your detailed reports. Export data in
              multiple formats for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have 5 reports ready and available to export.
          </CardContent>
        </Card> */}

              <InteractivityEditor
                selectedElement={selectedElement}
                onInteractivityChange={onInteractivityChange}
              />
            </TabsContent>
            {/* <TabsContent value="settings">
    
          <InteractivityEditor
            selectedElement={selectedElement}
            onInteractivityChange={onInteractivityChange}
          />
      </TabsContent> */}
          </Tabs>
        );

      case "global":
        return <GlobalStylesSection onStyleChange={onStyleChange} />;

      case "layer":
        return <PageLayer />;

      case "forms":
        return <FormsPage />;

      case "pages":
        return (
          <>
            <GetAllcategory />
            <Pages
              setOpen={setOpen}
              open={open}
              openSeoModal={handleOpenSeoModal}
              handlePageType={handlePageType}
              pagetype={pagetype}
              categoryStyleConfigs={categoryStyleConfigs}
              setCategoryStyleConfigs={setCategoryStyleConfigs}
            />
          </>
        );

      // ✅ HERE: show the Pages component when Pages tab is selected

      // case "ai":
      //   return renderPlaceholder(
      //     <span className="inline-flex items-center gap-2">
      //       <Sparkles className="w-4 h-4" /> AI Tools
      //     </span>,
      //     "Add AI-powered actions (rewrite, generate sections, optimize layout, etc.)."
      //   );

      case "ai":
        return <AiToolsPage />;

      // case "store":
      //   return renderPlaceholder(
      //     <span className="inline-flex items-center gap-2">
      //       <ShoppingCart className="w-4 h-4" /> Store
      //     </span>,
      //     "Connect products, carts, and checkout settings here."
      //   );

      case "store":
        return <StorePage />;

      // case "seo":
      //   return renderPlaceholder(
      //     <span className="inline-flex items-center gap-2">
      //       <Search className="w-4 h-4" /> SEO
      //     </span>,
      //     "Manage meta tags, social previews, indexing and sitemap settings."
      //   );

      case "seo":
        return renderPlaceholder(<SeobuilderPage />);

      case "seo":
        return renderPlaceholder(<SeobuilderPage />);

      case "more":
        return renderPlaceholder(<AllBuilderPage />);

      case "productgallery":
        return <ProductGalleryPage />;

      // case "more":
      //   return renderPlaceholder(
      //     <span className="inline-flex items-center gap-2">
      //       <AllBuilderPage className="w-4 h-4" /> More
      //     </span>,
      //     "Project settings, export, integrations, and advanced options."
      //   );

      default:
        return null;
    }
  };

  const title = TAB_TITLES[tab];

  return (
    <TooltipProvider delayDuration={150}>
      <aside className="w-[450px] h-full flex border-l bg-white border-slate-200 text-slate-900 dark:bg-[#0b1220] dark:border-slate-800 dark:text-slate-100">
        {/* LEFT ICON TABS */}
        <div className="w-[64px] shrink-0 border-r bg-slate-50 border-slate-200 flex flex-col items-center py-2 gap-2 dark:bg-[#081021] dark:border-slate-800">

          <IconTab
            active={tab === "global"}
            label="Global"
            onClick={() => setTab("global")}
            icon={<Box className="w-5 h-5" />}
          />
          <IconTab
            active={tab === "style"}
            label="Style"
            onClick={() => setTab("style")}
            icon={<Palette className="w-5 h-5" />}
          />
          {/* <IconTab
            active={tab === "interactivity"}
            label="Interactivity"
            onClick={() => setTab("interactivity")}
            icon={<MousePointer className="w-5 h-5" />}
          /> */}
          <IconTab
            active={tab === "layer"}
            label="Layer"
            onClick={() => setTab("layer")}
            icon={<Layers className="w-5 h-5" />}
          />
          {/* <IconTab
            active={tab === "setup"}
            label="Setup"
            onClick={() => setTab("setup")}
            icon={<CheckCircle2 className="w-5 h-5" />}
          /> */}

          <div className="my-1 w-8 h-px bg-slate-200 dark:bg-slate-800/70" />

          <IconTab
            active={tab === "pages"}
            label="Pages"
            onClick={() => setTab("pages")}
            icon={<RiFileCopy2Line className="w-5 h-5" />}
          />

          <IconTab
            active={tab === "forms"}
            label="Forms"
            onClick={() => setTab("forms")}
            icon={<GoNote className="w-5 h-5" />}
          />

          {/* <IconTab
            active={tab === "styles"}
            label="Styles"
            onClick={() => setTab("styles")}
            icon={<Palette className="w-5 h-5" />}
          /> */}

          <IconTab
            active={tab === "ai"}
            label="AI tools"
            onClick={() => setTab("ai")}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <IconTab
            active={tab === "store"}
            label="Store"
            onClick={() => setTab("store")}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <IconTab
            active={tab === "seo"}
            label="SEO"
            onClick={() => setTab("seo")}
            icon={<Search className="w-5 h-5" />}
          />
          <IconTab
            active={tab === "productgallery"}
            label="Product Gallery"
            onClick={() => setTab("productgallery")}
            icon={<LayoutGrid className="w-5 h-5" />}
          />
          <IconTab
            active={tab === "more"}
            label="More"
            onClick={() => setTab("more")}
            icon={<MoreHorizontal className="w-5 h-5" />}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col  border-e border-slate-200 ">
          {/* header */}
          <div className="h-14 px-4 flex items-center border-b border-slate-200 dark:border-slate-800">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
              {title}
            </div>
          </div>

          {/* content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 pt-1">
            {renderRightContent()}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default PropertiesSidebar;

/* ---------- small UI ---------- */

function IconTab({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={[
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors border",
            active
              ? "bg-violet-600/10 text-violet-700 border-violet-600/20 dark:bg-violet-600/20 dark:text-violet-200 dark:border-violet-500/20"
              : "text-slate-700 border-transparent hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-white/5",
          ].join(" ")}
        >
          {icon}
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}
