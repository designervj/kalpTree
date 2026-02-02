"use client";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditor } from "@/hooks/use-editor";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { DeviceConfig } from "../../../types/editor";

import TopToolbar from "./GrapesJSEditor/toolbars/TopToolbar";
import BottomToolbar from "./GrapesJSEditor/toolbars/BottomToolbar";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearPageEdit, setPageLoading } from "@/hooks/slices/pageEditSlice";
import { AiChatModal } from "./aiChatModel/AiChatModal";
import { extractHtmlParts, extractStyles } from "@/lib/utils";
import PropertiesSidebar from "./GrapesJSEditor/sidebar/PropertiesSidebar";
import GetAllTemplate from "../admin/templates/GetAllTemplate";
import EditForm from "./editForm/EditForm";
import { EditorProvider } from "./EditorContext";

type PropertiesSidebarProps = {
  showSidebar: boolean;
  selectedElement: any;
  styles: any;
  onStyleChange: (property: string, value: string) => void;
  onAttributeChange: (name: string, value: any) => void;
  onInteractivityChange: (config: any) => void;
};

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
    editForm
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

  const dispatch = require("react-redux").useDispatch();
  const { page, isLoading: isPageLoading } = useSelector((state: RootState) => state.pageEdit);

  function extractScriptsFromHtml(html: string): string {
    const matches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (!matches) return "";
    return matches
      .map((scriptTag) => {
        // Skip external scripts (those with src attribute)
        if (scriptTag.includes("src=")) return "";
        const inner = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        return inner ? `(function(){ ${inner[1]} })();` : "";
      })
      .filter((script) => script.trim())
      .join("\n");
  }

  const isCalled = useRef<boolean>(false);
  const contentLoadedRef = useRef<boolean>(false);

  // update the page content into editor - wait for editor load event
  useEffect(() => {
    if (!state.editor || !page?.content) return;

    // Reset the content loaded flag when page content changes
    if (contentLoadedRef.current) {
      contentLoadedRef.current = false;
    }

    const loadContent = () => {
      // Prevent loading content multiple times
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
        const data = page.content;
        if (data) {
          // Safely set components with error handling
          state?.editor?.setComponents(data);

          const { body } = extractHtmlParts(data);
          setEditorHtml(body);

          // Extract and set CSS from the content
          const css = extractStyles(data);
          if (css && typeof state.editor.setStyle === "function") {
            state.editor.setStyle(css);
            setEditorCss(css);
          }

          const js = extractScriptsFromHtml(data);
          if (js && typeof state.editor.setJs === "function") {
            state.editor.setJs(js);
            setEditorJs(js);
          }

          // Refresh layers after content is loaded
          // Use longer delay and retry mechanism to ensure components are parsed
          console.log('🔄 Content loaded, refreshing layers...');

          let retryCount = 0;
          const maxRetries = 3;

          const tryRefreshLayers = () => {
            console.log(`🔄 Attempt ${retryCount + 1}/${maxRetries} - Calling refreshLayers...`);

            // Check if wrapper has components before refreshing
            const wrapper = state.editor?.Components?.getWrapper();
            const hasComponents = wrapper?.components?.()?.length > 0;

            console.log(`🔍 Wrapper has components? ${hasComponents}`);

            if (hasComponents || retryCount >= maxRetries - 1) {
              actions.refreshLayers();
              if (!hasComponents) {
                console.warn('⚠️ No components found after max retries');
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
  }, [state.editor, state.isLoading, page?.content]);

  useEffect(() => {
    if (!state.editor) return;
    const updateHandler = () => {
      const html = state.editor.getHtml();

      // console.log("hfjhhfdhhfhfh----",html)

      setEditorHtml(html);
      //  dispatch({ type: "pageEdit/setContent", payload: html });
    };
    state.editor.on("component:update", updateHandler);
    return () => {
      state.editor.off("component:update", updateHandler);
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

    if (append) {
      state.editor.addComponents(content);
    } else {
      state.editor.setComponents(content);
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
    // later connect to backend
    console.log(`Saving template: ${name}`);
    console.log(content);
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
    setEditorJs(state.editor.getJs ? state.editor.getJs() : "");

    state.editor.on("component:update", () => {
      setEditorHtml(state.editor!.getHtml());
      setEditorCss(state.editor!.getCss());
      setEditorJs(state.editor!.getJs ? state.editor!.getJs() : "");
    });

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
            setOpen={setOpen}
            open={open}
          />

          <div className="relative flex flex-1 flex-row-reverse overflow-hidden">
            {/* Canvas */}
            <div
              className="flex-1 min-w-0 transition-all duration-300 ease-in-out relative"
            >
              {(state.isLoading || isPageLoading) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80">
                  <div className="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin" />
                </div>
              )}
              <div id="gjs-editor" className="w-full h-full" ref={containerRef} />
            </div>

            {/* Sidebar */}
            <PropertiesSidebar
              showSidebar={showSidebar}
              selectedElement={state.selectedElement}
              styles={state.styles}
              onStyleChange={handleStyleChange}
              onAttributeChange={actions.updateAttribute}
              onInteractivityChange={handleUpdateInteractivity}
              open={open}
              setOpen={setOpen}
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

        {/* edit form */}
        <EditForm componentHtml={editForm} />


        <GetAllTemplate />
      </div>
    </EditorProvider>
  );
}
