"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditor } from "@/hooks/use-editor";
import { useEffect, useRef, useState } from "react";
import { DeviceConfig } from "../../../types/editor";
import TopToolbar from "./GrapesJSEditor/toolbars/TopToolbar";
import BottomToolbar from "./GrapesJSEditor/toolbars/BottomToolbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setPageEdit, setPageLoading } from "@/hooks/slices/pageEditSlice";
import { AiChatModal } from "./aiChatModel/AiChatModal";
import {
  extractHtmlParts,
  extractScripts,
  extractStyles,
  wrapScripts,
} from "@/lib/utils";
import PropertiesSidebar from "./GrapesJSEditor/sidebar/PropertiesSidebar";
import GetAllTemplate from "../admin/templates/GetAllTemplate";
import { EditorProvider } from "./EditorContext";
import { addComponentAboveFooter } from "./utils/InsertionUtils";
import GetAllProduct from "../admin/product/productList/GetAllProduct";
import ProductShowcase from "../admin/product/Cart/Products";
import { ProductShowcaseStyleConfig } from "./pages-builder/pages";
import SingleProductShowcase from "../admin/product/Cart/SingleProduct";
import { isHeaderPresent } from "./utils/htmlParser";
import CommentsModal from "./commentModal/CommentModal";

import CategoryPage from "../categoryPage/CategoryPage";
import { PageModel } from "@/types/pages/PageModel";
import NewSingleProductPage from "../admin/product/Cart/NewSingleProductPage";

export default function GrapesJSEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Capture all props from useEditor to pass to Context
  const editorProps = useEditor("gjs-editor");
  const {
    state,
    actions,
    isAiChatOpen,
    setIsAiChatOpen,
    selectedComponentForAi,
    editForm,
    isCommentsOpen,
    setIsCommentsOpen,
  } = editorProps;

  const [showResponsivePanel, setShowResponsivePanel] = useState(false);
  const [customDevices, setCustomDevices] = useState<DeviceConfig[]>([]);
  const [editorHtml, setEditorHtml] = useState("");
  const [editorCss, setEditorCss] = useState("");
  const [editorJs, setEditorJs] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [recentBlocks, setRecentBlocks] = useState<string[]>([]);
  const [favoriteBlocks, setFavoriteBlocks] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAddPage, setIsAddPage] = useState(false);
  const dispatch = require("react-redux").useDispatch();
  const {
    page,
    type,
    isLoading: isPageLoading,
  } = useSelector((state: RootState) => state.pageEdit);

  const { currentHeader } = useSelector((state: RootState) => state.header);
  const { currentFooter } = useSelector((state: RootState) => state.footer);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentStyle } = useSelector((state: RootState) => state.globalStyle);

  const lastPageIdRef = useRef<string | null>(null);
  const contentLoadedRef = useRef<boolean>(false);

  // Reactive global style updates
  useEffect(() => {
    if (
      state.editor &&
      (currentWebsite?.globalStyle || currentStyle?.globalStyle)
    ) {
      console.log("🎨 Reactively updating global styles...");
      const globalStyle =
        currentWebsite?.globalStyle || currentStyle?.globalStyle;
      actions.setGlobalStyles(globalStyle);
    }
  }, [state.editor, currentWebsite?.globalStyle]);

  // Trigger loading state when page content changes
  useEffect(() => {
    if (
      page?.content &&
      !contentLoadedRef.current &&
      (currentWebsite?.globalStyle || currentStyle?.globalStyle)
    ) {
      dispatch(setPageLoading(true));
    }
  }, [
    page?._id,
    page?.content,
    currentWebsite?.globalStyle,
    currentHeader,
    currentStyle?.globalStyle,
    dispatch,
  ]);

  // update the page content into editor - wait for editor load event
  useEffect(() => {
    if (
      !state.editor ||
      !page?.content
      // !currentHeader?.content
    ) {
      console.log("not getting header, page.content");
      return;
    }

    // Reset the content loaded flag ONLY when page ID changes
    const currentPageId = page?._id?.toString() || null;
    if (lastPageIdRef.current !== currentPageId) {
      console.log(
        `📄 Page ID changed from ${lastPageIdRef.current} to ${currentPageId}, resetting content flag`,
      );
      contentLoadedRef.current = false;
      lastPageIdRef.current = currentPageId;
    }

    const loadContent = () => {
      // Prevent loading content if already loaded for this page
      if (contentLoadedRef.current) return;

      // Enhanced check for editor readiness
      const isEditorReady =
        state.editor &&
        typeof state.editor.setComponents === "function" &&
        state.editor.Components &&
        typeof state.editor.Components.getWrapper === "function" &&
        state.editor.Canvas; // Ensure Canvas is available

      if (!isEditorReady) {
        console.warn("Editor not fully initialized yet, retrying...");
        // Retry after a short delay if editor is not ready
        setTimeout(loadContent, 100);
        return;
      }

      try {
        const data = page.content?.replace(/\\n/g, "");
        const headerData = currentHeader?.content?.replace(/\\n/g, "").trim();
        const isHeaderPresentInCurrentPage = isHeaderPresent(data ?? "");
        if (data) {
          const pageParts = extractHtmlParts(data);
          let body = pageParts.body;
          let styles = pageParts.styles;
          let scripts = extractScripts(data);
          console.log("scripts===>", scripts);
          // If we are editing a normal page (not header/footer), prepend the site header
          if (type !== "header" && type !== "footer" && headerData) {
            const headerParts = extractHtmlParts(headerData);
            const headerScripts = extractScripts(headerData);
            // Merge styles
            if (headerParts.styles) {
              styles = `${headerParts.styles}\n${styles}`;
            }

            // Merge scripts
            if (headerScripts && headerScripts.length > 0) {
              scripts = [...headerScripts, ...scripts];
            }

            // Combine bodies with wrappers
            body = `
              ${!isHeaderPresentInCurrentPage
                ? `
              <div data-gjs-type="site-header" data-gjs-removable="false" data-gjs-draggable="false" data-gjs-copyable="false" data-gjs-badgable="false" data-gjs-stylable="false">
                ${headerParts.body}
              </div>
              `
                : ""
              }
              <div data-gjs-type="page-body">
                ${pageParts.body}
              </div>
            `;
          }

          // Only update components if they are different from current canvas content
          const currentHtml = state.editor.getHtml();
          if (currentHtml !== body) {
            state.editor.DomComponents.clear();
            state?.editor?.setComponents(body);
            setEditorHtml(body);
          }

          // Extract and set CSS from the content
          if (styles && typeof state.editor.setStyle === "function") {
            state.editor.setStyle(styles);
            setEditorCss(styles);
          }

          // Wrap the combined scripts
          const jsWrapped = wrapScripts(scripts);

          if (jsWrapped && typeof state.editor.setJs === "function") {
            state.editor.setJs(jsWrapped);
            setEditorJs(jsWrapped);
          }

          // Refresh layers after content is loaded

          let retryCount = 0;
          const maxRetries = 3;

          const tryRefreshLayers = () => {
            console.log(
              `🔄 Attempt ${retryCount + 1}/${maxRetries} - Calling refreshLayers...`,
            );

            // Check if wrapper has components before refreshing
            const wrapper = state.editor?.Components?.getWrapper();
            const hasComponents = wrapper?.components?.()?.length > 0;

            console.log(`🔍 Wrapper has components? ${hasComponents}`);

            if (hasComponents || retryCount >= maxRetries - 1) {
              actions.refreshLayers();
              if (!hasComponents) {
                console.warn("⚠️ No components found after max retries");
              }
            } else {
              retryCount++;
              console.log(`⏳ No components yet, retrying in 300ms...`);
              setTimeout(tryRefreshLayers, 300);
            }
          };

          setTimeout(tryRefreshLayers, 500);
        }

        contentLoadedRef.current = true;
        setTimeout(() => {
          dispatch(setPageLoading(false));
        }, 500);
      } catch (error) {
        console.error("Error setting editor content:", error);
        // Don't crash the app, just log the error
      }
    };

    // If editor is already loaded (load event already fired), load content immediately
    // Otherwise, wait for the load event
    const handleLoad = () => {
      // Small delay to ensure Canvas is fully ready
      setTimeout(loadContent, 100);
    };

    // Check if editor is already loaded
    if (state.editor && !state.isLoading) {
      // Editor is already loaded, try to load content
      handleLoad();
    } else {
      // Wait for load event
      state.editor?.on("load", handleLoad);
    }

    return () => {
      state.editor?.off("load", handleLoad);
    };
  }, [
    state.editor,
    state.isLoading,
    page?.content,
    currentWebsite?.globalStyle,
    currentStyle?.globalStyle,
    currentHeader,
  ]);


  useEffect(() => {
    if (!state.editor) return;
    const updateHandler = () => {
      // Debounce updates to the UI state to prevent excessive re-renders
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        if (!state.editor) return;
        const html = state.editor.getHtml();
        const css = state.editor.getCss() || "";
        const js = state.editor.getJs ? state.editor.getJs() : "";

        setEditorHtml(html);
        setEditorCss(css);
        setEditorJs(js || "");
      }, 500);
    };
    state.editor.on("component:update", updateHandler);
    state.editor.on("style:update", updateHandler);
    state.editor.on("storage:store", updateHandler);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      state.editor.off("component:update", updateHandler);
      state.editor.off("style:update", updateHandler);
      state.editor.off("storage:store", updateHandler);
    };
  }, [state.editor, dispatch]);
  // ─────────────────────────────
  // Import HTML modal
  // ─────────────────────────────
  const handleImportCode = () => {
    if (!state.editor) return;

    state.editor.Modal.open({
      title: "Import Code",
      content: `
        <div >
           <div style="padding: 18px; padding-bottom: 0;">
            <textarea id="import-code" style="width: 100%; height: 250px; padding: 10px; background-color: #f7f7f7; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; color:black;" placeholder="Paste your HTML code here"></textarea>
           </div> 
           <hr>
          <button id="import-button"  style="display:flex; margin-top:15px; margin-bottom:12px; margin-right: 0; margin-left: auto; padding: 8px 16px; background-color: #7f2e62; color: white; border: none; border-radius: 4px; cursor: pointer;">Import</button>
       
        </div>
      `,
      attributes: { class: "gjs-modal-import" },
    });

    setTimeout(() => {
      const importButton = document.getElementById("import-button");
      const importCode = document.getElementById(
        "import-code",
      ) as HTMLTextAreaElement | null;

      if (importButton && importCode) {
        importButton.addEventListener("click", () => {
          const code = importCode.value;
          actions.importCode(code);
          state.editor?.Modal.close();
        });
      }
    }, 100);
  };

  // ─────────────────────────────
  // Device management
  // ─────────────────────────────
  const handleAddDevice = (device: DeviceConfig) => {
    setCustomDevices((prev) => [...prev, device]);
    if (state.editor?.DeviceManager) {
      state.editor.DeviceManager.add(device);
    }
  };

  const handleRemoveDevice = (deviceId: string) => {
    setCustomDevices((prev) => prev.filter((d) => d.id !== deviceId));
    if (state.editor?.DeviceManager) {
      state.editor.DeviceManager.remove(deviceId);
    }
  };

  const [pagetype, setPageType] = useState("normal");

  const handlePageType = (type: string) => {
    console.log("page type", type);
    setPageType(type);
  };

  const handleUpdateDevice = (
    deviceId: string,
    updates: Partial<DeviceConfig>,
  ) => {
    if (!state.editor?.DeviceManager) return;

    const device = state.editor.DeviceManager.get(deviceId);
    if (device) {
      state.editor.DeviceManager.remove(deviceId);

      const updatedDevice = {
        ...device.attributes,
        ...updates,
        id: deviceId,
      };

      state.editor.DeviceManager.add(updatedDevice);

      if (state.currentDevice === deviceId) {
        state.editor.setDevice(deviceId);
      }
    } else {
      state.editor.DeviceManager.add({
        id: deviceId,
        name: "Custom",
        ...updates,
      });
    }
  };

  // ─────────────────────────────
  // Templates
  // ─────────────────────────────
  const handleSelectTemplate = (content: string, append = false) => {
    if (!state.editor) return;

    const { body, scripts, styles } = extractHtmlParts(content);
    // romovve the root style
    console.log("editorJs--", editorJs);

    const cleanedStyles = styles?.replace(/:root\s*{[\s\S]*?}/g, "").trim();

    if (append) {
      let contentToAdd = body;
      if (cleanedStyles) {
        contentToAdd = `<style>${cleanedStyles}</style>${body}`;
      }

      if (insertionIndex !== null) {
        const wrapper = state.editor.Components.getWrapper();
        if (wrapper) {
          // Find page-body container if it exists (combined mode), otherwise use wrapper
          const container =
            wrapper.find('[data-gjs-type="page-body"]')[0] || wrapper;

          container.append(contentToAdd, { at: insertionIndex });

          setInsertionIndex((prev) => (prev !== null ? prev + 1 : null));
        }
      } else {
        addComponentAboveFooter(state.editor, contentToAdd);
      }

      if (scripts && scripts.length > 0) {
        // Use editorJs state as the base to ensure we don't lose anything
        const currentJs = editorJs || "";
        console.log("currentJs (from state)-->", currentJs);

        let updatedJs = currentJs;

        scripts.forEach((scriptContent: string) => {
          if (scriptContent.trim()) {
            const wrapped = wrapScripts([scriptContent]);
            // Check if already present to avoid duplicates
            // We trim and check for the wrapped version to be safe
            if (!updatedJs.includes(wrapped.trim())) {
              updatedJs += (updatedJs.trim() ? "\n\n" : "") + wrapped;
            }
          }
        });

        if (updatedJs !== currentJs) {
          if (typeof (state.editor as any).setJs === "function") {
            (state.editor as any).setJs(updatedJs);
            setEditorJs(updatedJs);
          }
        }
      }
    } else {
      setIsAddPage(false);
      // Reset the flag so the loading useEffect can trigger and clear the loading state
      contentLoadedRef.current = false;
      dispatch(setPageLoading(true));

      state.editor.setComponents(body);
      if (cleanedStyles) {
        state.editor.setStyle(cleanedStyles);
      }

      if (scripts && scripts.length > 0) {
        const jsCode = wrapScripts(scripts);
        if (typeof (state.editor as any).setJs === "function") {
          (state.editor as any).setJs(jsCode);
          setEditorJs(jsCode);
        }
      } else {
        if (typeof (state.editor as any).setJs === "function") {
          (state.editor as any).setJs("");
          setEditorJs("");
        }
      }

      setEditorHtml(body);
      setEditorCss(cleanedStyles || "");
    }
  };

  const handleClearCanvas = () => {
    if (!state.editor) return;

    try {
      state.editor.setComponents("");
      state.editor.setStyle("");

      if (typeof state.editor.setJs === "function") {
        state.editor.setJs("");
      } else if (state.editor.StorageManager) {
        state.editor.StorageManager.store({ jsCode: "" });
      }
      console.log("caling clear canvas");
      setEditorHtml("");
      setEditorCss("");
      setEditorJs("");

      state.editor.refresh();
      console.log("Canvas cleared successfully");
    } catch (error) {
      console.error("Error clearing canvas:", error);
    }
  };

  const handleSaveTemplate = (name: string, content: string) => {

  };

  // ─────────────────────────────
  // Code editor sync
  // ─────────────────────────────
  const handleUpdateHtml = (html: string) => {
    console.log("update html");
    if (!state.editor) return;
    console.log("html ---", html);
    state.editor.setComponents(html);
    setEditorHtml(html);
  };

  const handleUpdateCss = (css: string) => {
    if (!state.editor) return;
    state.editor.setStyle(css);
    // setEditorCss(css);
  };

  const handleUpdateJs = (js: string) => {
    console.log("update js");
    if (!state.editor?.setJs) return;
    state.editor.setJs(js);
    setEditorJs(js);
  };

  // ─────────────────────────────
  // UI toggles
  // ─────────────────────────────
  const togglePreviewMode = () => {
    if (!state.editor) return;

    if (isPreviewMode) {
      state.editor.stopCommand("preview");
    } else {
      state.editor.runCommand("preview");
    }
    setIsPreviewMode((prev) => !prev);

    if (!isPreviewMode && showSidebar) {
      setShowSidebar(false);
    }
  };

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  // ─────────────────────────────
  // Local storage (recent / favorite blocks)
  // ─────────────────────────────
  const handleRecentBlocksChange = (blocks: string[]) => {
    setRecentBlocks(blocks);
    try {
      localStorage.setItem("grapesjs-recent-blocks", JSON.stringify(blocks));
    } catch (e) {
      console.warn("Could not save recent blocks to localStorage", e);
    }
  };

  const handleFavoriteBlocksChange = (blocks: string[]) => {
    setFavoriteBlocks(blocks);
    try {
      localStorage.setItem("grapesjs-favorite-blocks", JSON.stringify(blocks));
    } catch (e) {
      console.warn("Could not save favorite blocks to localStorage", e);
    }
  };

  const handleSaveData = () => {
    console.log("Clicked", actions.savePage());
  };

  // ─────────────────────────────
  // Editor init + listeners
  // ─────────────────────────────
  const loadSavedBlocks = () => {
    try {
      const savedRecentBlocks = localStorage.getItem("grapesjs-recent-blocks");
      const savedFavoriteBlocks = localStorage.getItem(
        "grapesjs-favorite-blocks",
      );

      if (savedRecentBlocks) {
        setRecentBlocks(JSON.parse(savedRecentBlocks));
      }
      if (savedFavoriteBlocks) {
        setFavoriteBlocks(JSON.parse(savedFavoriteBlocks));
      }
    } catch (e) {
      console.warn("Could not load saved blocks from localStorage", e);
    }
  };

  const setupResizeListener = () => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        state.editor?.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  };

  const initializeEditor = () => {
    if (!state.editor) return;

    setEditorHtml(state.editor.getHtml());
    setEditorCss(state.editor.getCss());
    const newJs = state.editor!.getJs ? state.editor!.getJs() || "" : "";
    setEditorJs(newJs || "");

    // state.editor.on("component:update", () => {
    //   setEditorHtml(state.editor!.getHtml());
    //   setEditorCss(state.editor!.getCss());
    //   setEditorJs(state.editor!.getJs ? state.editor!.getJs() || "" : "");
    // });

    state.editor.on("component:selected", (component: any) => {
      if (component?.get) {
        setShowSidebar(true);
        try {
          state.editor!.select(component);
        } catch (e) {
          console.error("Error focusing on selected component:", e);
        }
      }
    });

    if (state.editor.BlockManager) {
      state.editor.BlockManager.getAll().forEach((block: any) => {
        if (typeof block.get("category") === "object") {
          const category = block.get("category");
          block.set("category", category.label || "Basic");
        }
      });
    }

    loadSavedBlocks();
  };

  useEffect(() => {
    if (!state.editor) return;
    initializeEditor();
    return setupResizeListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.editor]);

  const allDevices = [
    ...(state.editor?.DeviceManager?.getAll()?.models?.map((model: any) => ({
      id: model.id,
      name: model.get("name"),
      width: model.get("width"),
    })) || []),
    ...customDevices,
  ];

  // Fix: handleStyleChange to match expected signature
  const handleStyleChange = (property: string, value: string) => {
    if (property && value) {
      actions.updateStyle(property, value);
    }
  };

  // Fix: handleStyleChange to match expected signature
  const handleUpdateInteractivity = (data: any) => {
    if (
      data &&
      data.type &&
      data.event &&
      data.action &&
      data.target &&
      data.options
    ) {
      actions.updateInteractivity(
        data.type,
        data.event,
        data.action,
        data.target,
        data.options,
      );
    }
  };

  const [open, setOpen] = useState(false);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);

  // callink function on As Section
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "object" || !event.data.type) return;

      if (event.data.type === "OPEN_TEMPLATE_MANAGER") {
        setInsertionIndex(event.data.index ?? null);
        setOpen(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleFormSave = (html: string) => {
    if (state.editor) {
      const selected = state.editor.getSelected();
      if (selected) {
        // Since 'html' includes the <form> tag, and 'selected' is the form component,
        // we replace the entire component to avoid nesting and ensure all attributes are updated.
        const newComponent = selected.replaceWith(html);

        // Re-select the new component so the sidebar/editor state remains consistent
        if (newComponent) {
          const toSelect = Array.isArray(newComponent)
            ? newComponent[0]
            : newComponent;
          state.editor.select(toSelect);
        }

        console.log("Form saved and updated on canvas");
      }
    }
  };

  const [categoryStyleConfigs, setCategoryStyleConfigs] = useState<
    Record<string, ProductShowcaseStyleConfig>
  >({});

  // Stores the latest HTML generated by CategoryPage so we can push it to canvas
  const [categoryPageHtml, setCategoryPageHtml] = useState<string>("");

  const handleCategoryHtmlGenerated = (html: string) => {
    setCategoryPageHtml(html);
  };
  const { page: currentPage } = useSelector((state: RootState) => state.pageEdit);
  const handlePushCategoryToCanvas = () => {
    if (!state.editor || !categoryPageHtml) return;
    dispatch(setPageLoading(true));

    // Reset the flag to ensure the content reload useEffect triggers
    contentLoadedRef.current = false;
    const data: PageModel = {
      ...currentPage,
      content: categoryPageHtml,
    };

    dispatch(
      setPageEdit({
        page: data,
        type: "page",
      }),
    );

    // Switch view back to the normal editor canvas
    setPageType("normal");
  };


  const handlePushSingleProductToCanvas = (html: string) => {

    if (!state.editor) return;
    dispatch(setPageLoading(true));

    // Reset the flag to ensure the content reload useEffect triggers
    contentLoadedRef.current = false;
    const data: PageModel = {
      ...currentPage,
      content: html,
    };

    dispatch(
      setPageEdit({
        page: data,
        type: "page",
      }),
    );

    // Switch view back to the normal editor canvas
    setPageType("normal");
  }
  useEffect(() => {
    if (state.editorJs && state.editorJs !== editorJs) {
      setEditorJs(state.editorJs);
    }
  }, [state.editorJs, editorJs]);


  const handleTemplateModal = ({ isOpen, pageType }: { isOpen: boolean; pageType: string }) => {
    setOpen(isOpen);
    if (pageType) {
      //  setPageType(pageType);
      setIsAddPage(true);
    }
  }

  return (
    <EditorProvider editorState={editorProps}>
      <div className="h-screen bg-[#0F172A] text-white overflow-hidden flex flex-col">
        <TooltipProvider delayDuration={300}>
          <TopToolbar
            blocks={state.blocks}
            actions={actions}
            editor={state.editor}
            editorHtml={editorHtml}
            editorCss={editorCss}
            editorJs={editorJs}
            isPreviewMode={isPreviewMode}
            showSidebar={showSidebar}
            recentBlocks={recentBlocks}
            favoriteBlocks={favoriteBlocks}
            onImportCode={handleImportCode}
            onClearCanvas={handleClearCanvas}
            onTogglePreview={togglePreviewMode}
            onToggleSidebar={toggleSidebar}
            onRecentBlocksChange={handleRecentBlocksChange}
            onFavoriteBlocksChange={handleFavoriteBlocksChange}
            onUpdateHtml={handleUpdateHtml}
            onUpdateCss={handleUpdateCss}
            onUpdateJs={handleUpdateJs}
            onSelectTemplate={handleSelectTemplate}
            onSaveTemplate={handleSaveTemplate}
            onSave={handleSaveData}
            setOpen={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                setInsertionIndex(null);
                setIsAddPage(false);
              }
            }}
            open={open}
            isAddPage={isAddPage}


          />

          <div className="relative flex flex-1 flex-row-reverse overflow-hidden">
            {/* Canvas - Normal Editor */}
            <div
              className={`flex-1 min-w-0 transition-all duration-300 ease-in-out relative ${pagetype !== "normal" ? "hidden" : ""
                }`}
            >
              {(state.isLoading || isPageLoading) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80">
                  <div className="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin" />
                </div>
              )}
              <div
                id="gjs-editor"
                className="w-full h-full"
                ref={containerRef}
              />
            </div>

            {/* Alternative view - Category Pages */}
            {pagetype !== "normal" && !pagetype.startsWith("product") && (
              <div className="flex-1 min-w-0 overflow-auto bg-white relative">

                {/* <div className="flex-1 min-w-0 overflow-auto bg-white">
                <GetAllProduct websiteId={currentWebsite?._id} />
                <ProductShowcase */}
                {/* Toolbar: push to canvas */}
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "#1e293b",
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>
                    Category Preview: <em style={{ fontWeight: 400 }}>{pagetype}</em>
                  </span>
                  <button
                    onClick={handlePushCategoryToCanvas}
                    style={{
                      background: "#6d28d9",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                    }}
                  >
                    ↩ Push to Canvas
                  </button>
                </div>

                <CategoryPage
                  category={pagetype}
                  onHtmlGenerated={handleCategoryHtmlGenerated}
                  options={categoryStyleConfigs[pagetype] ? {
                    showHero: categoryStyleConfigs[pagetype].layoutConfig?.showHeroSection,
                    desktopColumns: (categoryStyleConfigs[pagetype].layoutConfig?.gridColumns?.desktop ?? 3) as 2 | 3 | 4,
                    heroImageUrl: categoryStyleConfigs[pagetype].heroConfig?.backgroundImage,
                    categoryTitle: categoryStyleConfigs[pagetype].heroConfig?.title,
                    layout: categoryStyleConfigs[pagetype].layoutConfig?.filterPosition,
                  } : undefined}
                />
              </div>
            )}

            {pagetype !== "normal" && pagetype.startsWith("product") && (
              <div className="flex-1 min-w-0 overflow-auto bg-white">
                <GetAllProduct websiteId={currentWebsite?._id} />
                {/* <SingleProductShowcase slug={pagetype.split("-")[1]} /> */}
                <NewSingleProductPage slug={pagetype.split("-")[1]}
                  onPushToCanvas={handlePushSingleProductToCanvas}
                />
              </div>
            )}
            {/* Canvas */}
            {/* {pagetype == "normal" ? (
              <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out relative">
                {(state.isLoading || isPageLoading) && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80">
                    <div className="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin" />
                  </div>
                )}
                <div
                  id="gjs-editor"
                  className="w-full h-full"
                  ref={containerRef}
                />
              </div>
            ) : (
              <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out relative">
                My Name is Khan
              </div>
            )} */}
            {/* Sidebar */}
            <PropertiesSidebar
              editor={state.editor}
              showSidebar={showSidebar}
              selectedElement={state.selectedElement}
              styles={state.styles}
              onStyleChange={handleStyleChange}
              onAttributeChange={actions.updateAttribute}
              onInteractivityChange={handleUpdateInteractivity}
              open={open}
              setOpen={handleTemplateModal}
              actions={actions}
              handlePageType={handlePageType}
              pagetype={pagetype}
              categoryStyleConfigs={categoryStyleConfigs}
              setCategoryStyleConfigs={setCategoryStyleConfigs}
              editorHtml={editorHtml}
              handleUpdateHtml={handleUpdateHtml}
              blocks={state.blocks}
              recentBlocks={recentBlocks}
              favoriteBlocks={favoriteBlocks}
            />
          </div>

          <BottomToolbar
            currentDevice={state.currentDevice}
            showResponsivePanel={showResponsivePanel}
            devices={allDevices}
            onDeviceChange={actions.setDevice}
            onToggleResponsivePanel={() =>
              setShowResponsivePanel((prev) => !prev)
            }
            onAddDevice={handleAddDevice}
            onRemoveDevice={handleRemoveDevice}
            onUpdateDevice={handleUpdateDevice}
          />
        </TooltipProvider>

        {/* AI Chat Modal */}
        <AiChatModal
          isOpen={isAiChatOpen}
          onClose={() => setIsAiChatOpen(false)}
          component={selectedComponentForAi}
        />

        {/* Comments Modal */}
        <CommentsModal
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          component={selectedComponentForAi}
        />

        {/* edit form */}
        {/* <EditForm componentHtml={editForm} onSave={handleFormSave} /> */}

        <GetAllTemplate />
      </div>
    </EditorProvider>
  );
}
