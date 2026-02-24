"use client";

import { useEffect, useRef, useState } from "react";
import { EditorState, LayerItem } from "../../types/editor";
import { createEditorConfig } from "../../utils/editor-config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { savePageThunk } from "./slices/pageEditSlice";
import { toast } from "sonner";
import { updateFooter } from "./slices/footer/FooterThunk";
import { updateHeader } from "./slices/header/HeaderThunk";
import {
  createCanvasStyleString,
  extractFontLinks,
} from "@/utils/extract-css-variables";
import { extractHtmlParts as extractParts } from "@/lib/utils";

import {
  handleInteractivityChange,
  getGlobalInteractivityScript,
} from "@/hooks/editor-interactivity";

import { defaultBlocks } from "../../utils/block-library";
import {
  applyHoverableRestriction,
  isComponentUnderSection,
} from "@/components/editor/utils/ApplyHoverableRestriction";

import { addComponentAboveFooter } from "@/components/editor/utils/InsertionUtils";
import { cleanupComponentStylesAndScripts } from "@/components/editor/utils/CleanupComponentStylesAndScripts";
import { generateGlobalStyleContent } from "@/components/editor/utils/generateGlobalStyleContent";
import { GrapesJSEditor } from "@/components/editor/GrapeJsType";

/**
 * Generates the full CSS content for global styles, including variables and base rules.
 */
// Extend HTMLElement to include event handlers storage
declare global {
  interface HTMLElement {
    __eventHandlers?: Record<string, EventListener>;
  }
}

// Update your EditorState interface in types/editor.ts to include editorJs
// If you can't modify that file directly, you can extend it here:
interface ExtendedEditorState extends EditorState {
  editorJs?: string;
}

export function useEditor(containerId: string) {
  const editorRef = useRef<GrapesJSEditor | null>(null);

  const [state, setState] = useState<ExtendedEditorState>({
    editor: null,
    selectedElement: null,
    currentDevice: "desktop",
    isLoading: true,
    blocks: defaultBlocks,
    layers: [],
    editorJs: "", // Add JavaScript content to state
    autoExpandedLayers: [], // Track which layers should be auto-expanded
    selectedLayerId: undefined, // Track the currently selected layer ID
    styles: {
      typography: {
        fontFamily: "Inter",
        fontSize: "16px",
        fontWeight: "normal",
        color: "#000000",
        textAlign: "left",
      },
      spacing: {
        borderRadius: 0,
        padding: "0px",
        margin: "0px",
      },
      colors: {
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        borderWidth: "0px",
        borderStyle: "solid",
      },
      layout: {
        display: "block",
      },
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const { page, type } = useSelector((state: RootState) => state.pageEdit);
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const { style: globalStyleData } = useSelector(
    (state: RootState) => state.globalStyle,
  );

  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedComponentForAi, setSelectedComponentForAi] =
    useState<any>(null);
  const [editForm, setEditForm] = useState<any>(null);

  // Handle messages from GrapesJS modals (e.g., adding a section)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "object" || !event.data.type) return;

      const { type, index, template } = event.data;

      if (type === "ADD_SECTION" && editorRef.current) {
        console.log(`➕ Adding ${template} section at index ${index}`);

        let content: any =
          '<section class="py-16 bg-gray-50"><div class="container mx-auto px-4 max-w-6xl">New Section</div></section>';

        if (template === "basic") {
          const block = defaultBlocks.find((b) => b.id === "section");
          if (block) content = block.content;
        } else if (template === "feature") {
          const block = defaultBlocks.find((b) => b.id === "cta");
          if (block) content = block.content;
        }

        const wrapper = editorRef.current.Components.getWrapper();
        if (wrapper) {
          wrapper.append(content, { at: index });
          editorRef.current.Modal.close();
          toast.success(
            `${template.charAt(0).toUpperCase() + template.slice(1)} section added!`,
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [state.editor]);

  // Inject styles into canvas iframe
  const injectCanvasStyles = (
    editor: any,
    pageContent?: string,
    globalStyle?: string,
    retryCount = 0,
  ): void => {
    console.log(
      "🔍 injectCanvasStyles called with globalStyle:",
      globalStyle ? "YES (length: " + globalStyle.length + ")" : "NO/UNDEFINED",
    );
    if (globalStyle) {
      console.log(
        "📄 Global Style Content Preview:",
        globalStyle.substring(0, 100) + "...",
      );
    }
    const MAX_RETRIES = 3;
    const frame = editor.Canvas?.getFrameEl?.();
    const doc = frame?.contentDocument;

    if (!doc) {
      console.warn("Canvas iframe not available");
      if (retryCount < MAX_RETRIES) {
        setTimeout(
          () =>
            injectCanvasStyles(
              editor,
              pageContent,
              globalStyle,
              retryCount + 1,
            ),
          200,
        );
      }
      return;
    }

    const root = doc.documentElement;
    if (root && !root.getAttribute("data-theme")) {
      root.setAttribute("data-theme", "light");
      console.log("✅ Canvas data-theme set to light");
    }

    if (!doc.head || !doc.body) {
      console.warn("Canvas iframe head/body not ready");
      if (retryCount < MAX_RETRIES) {
        setTimeout(
          () =>
            injectCanvasStyles(
              editor,
              pageContent,
              globalStyle,
              retryCount + 1,
            ),
          200,
        );
      }
      return;
    }

    // Check readyState
    if (doc.readyState === "loading") {
      console.log("Waiting for iframe DOMContentLoaded...");
      doc.addEventListener(
        "DOMContentLoaded",
        () => {
          injectCanvasStyles(editor, pageContent, globalStyle, retryCount);
        },
        { once: true },
      );
      return;
    }

    try {
      // Remove existing custom styles
      doc.querySelector('[data-root-vars="true"]')?.remove();
      doc
        .querySelectorAll('[data-font="true"]')
        .forEach((el: Element) => el.remove());
      doc.querySelector('[data-tailwind="true"]')?.remove();

      // Inject Lucide Icons for icon hydration - avoid redundant reloads
      if (!doc.querySelector('[data-lucide-script="true"]')) {
        const lucideScript = doc.createElement("script");
        lucideScript.src = "https://unpkg.com/lucide@latest";
        lucideScript.setAttribute("data-lucide-script", "true");
        doc.head.appendChild(lucideScript);
        lucideScript.onload = () => {
          if ((doc.defaultView as any).lucide) {
            (doc.defaultView as any).lucide.createIcons();
          }
        };
      } else {
        // If script already exists, just re-run createIcons to catch new components
        if ((doc.defaultView as any).lucide) {
          (doc.defaultView as any).lucide.createIcons();
        }
      }

      // Inject Tailwind CSS CDN for styling Tailwind classes in HTML strings
      const tailwindScript = doc.createElement("script");
      tailwindScript.src = "https://cdn.tailwindcss.com";
      tailwindScript.setAttribute("data-tailwind", "true");
      doc.head.appendChild(tailwindScript);

      // Inject global styles from website settings
      if (globalStyle) {
        doc.querySelector('[data-global-styles="true"]')?.remove();
        const gStyle = doc.createElement("style");
        gStyle.setAttribute("data-global-styles", "true");

        // Parse variables to ensure base rules are included
        const vars: Record<string, string> = {};
        const declRegex = /(--[\w-]+)\s*:\s*([^;]+)/g;
        let match;
        while ((match = declRegex.exec(globalStyle)) !== null) {
          vars[match[1]] = match[2].trim();
        }

        gStyle.innerHTML = generateGlobalStyleContent(vars);
        doc.head.appendChild(gStyle);
        console.log("✅ Global styles injected");
      }

      if (pageContent) {
        // Inject CSS variables
        const style = doc.createElement("style");
        style.setAttribute("data-root-vars", "true");
        const styleString = createCanvasStyleString(pageContent);
        style.innerHTML = globalStyle
          ? styleString.replace(/:root\s*{[\s\S]*?}/g, "")
          : styleString;
        doc.head.appendChild(style);

        // Inject font links
        extractFontLinks(pageContent).forEach((url) => {
          const link = doc.createElement("link");
          link.rel = "stylesheet";
          link.href = url;
          link.setAttribute("data-font", "true");
          doc.head.appendChild(link);
        });

        console.log("✅ Canvas styles, fonts, and Tailwind CSS injected");
      } else {
        console.log("✅ Tailwind CSS injected");
      }

      // Inject Floating Add Section Button Styles
      const addSectionStyle = doc.createElement("style");
      addSectionStyle.setAttribute("data-add-section-styles", "true");
      addSectionStyle.innerHTML = `
        .gjs-add-section-btn {
          position: absolute;
          left: 5%;
          top:16px;
          transform: translate(-50%, -50%);
          padding: 8px 16px; 
          background-color: #3b82f6; 
          color: white;
          border-radius: 9999px; 
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
          pointer-events: auto;
          border: none;
          opacity: 1;
          gap: 8px;
        }
        .gjs-add-section-btn:hover {
          background-color: #2563eb;
          transform: translate(-50%, -50%) scale(1.05);
        }
        .gjs-add-section-btn svg {
          width: 18px;
          height: 18px;
          pointer-events: none;
        }
      `;
      doc.head.appendChild(addSectionStyle);
    } catch (error) {
      console.error("❌ Error injecting canvas styles:", error);
      if (retryCount < MAX_RETRIES) {
        setTimeout(
          () =>
            injectCanvasStyles(
              editor,
              pageContent,
              globalStyle,
              retryCount + 1,
            ),
          200,
        );
      }
    }
  };

  // Wait for iframe to be fully ready
  const waitForIframe = (editor: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const maxAttempts = 50; // 5 seconds maximum
      let attempts = 0;

      const check = () => {
        attempts++;
        const frame = editor.Canvas?.getFrameEl?.();
        const doc = frame?.contentDocument;

        // Check if document is fully ready
        if (doc && doc.readyState !== "loading" && doc.head && doc.body) {
          console.log("✅ Iframe fully loaded");
          resolve();
          return;
        }

        if (attempts >= maxAttempts) {
          console.error("❌ Iframe failed to load within timeout");
          reject(new Error("Iframe loading timeout"));
          return;
        }

        requestAnimationFrame(check);
      };
      check();
    });
  };

  // Helper to safely destroy editor
  const destroyEditor = () => {
    if (editorRef.current) {
      try {
        editorRef.current.off?.(); // Remove all event listeners
        editorRef.current.destroy();
      } catch (e) {
        console.warn("Editor destroy error", e);
      }
      editorRef.current = null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      try {
        await new Promise((r) => requestAnimationFrame(r));
        if (!isMounted) return;

        // Dynamically import GrapesJS modules
        const grapesjs = await import("grapesjs");
        if (!isMounted) return;

        const gjsPresetWebpage = await import("grapesjs-preset-webpage");
        if (!isMounted) return;

        const gjsBlocksBasic = await import("grapesjs-blocks-basic");
        if (!isMounted) return;

        const gjsScriptEditor = await import("grapesjs-script-editor");
        if (!isMounted) return;

        // Wait for container element
        let containerEl = document.getElementById(containerId);
        if (!containerEl) {
          console.log(`Container "${containerId}" not found, waiting...`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          containerEl = document.getElementById(containerId);
        }

        if (!containerEl || !isMounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        // Initialize editor with config
        const config = {
          ...createEditorConfig(containerEl, {}),
          plugins: [
            gjsPresetWebpage.default,
            gjsBlocksBasic.default,
            gjsScriptEditor.default,
          ],
          pluginsOpts: {
            [String(gjsPresetWebpage.default)]: {
              exportOpts: {},
              aviaryOpts: false,
              filestackOpts: false,
            },
            [String(gjsBlocksBasic.default)]: {
              // Don't override blocks - let editor-config.ts handle block registration
            },
            [String(gjsScriptEditor.default)]: {},
          },
          layerManager: {
            custom: true,
          },
        } as any;

        if (!isMounted) return;
        const editor = grapesjs.default.init(config);
        if (!editor || !isMounted) return;

        editorRef.current = editor as any;

        // Add JS fallback methods if not present
        if (typeof (editor as any).setJs !== "function") {
          (editor as any).setJs = (js: string) => {
            console.log(
              "Setting JS in editor:",
              js ? js.substring(0, 50) + "..." : "empty",
            );
            const wrapper = editor.Components.getWrapper();
            if (!wrapper) return;

            // Search for existing custom script component by ID or type
            let script =
              wrapper.find("#interactivity-engine")[0] ||
              wrapper.find('script[data-gjs-type="custom-script"]')[0];

            if (!script) {
              console.log("No custom-script found, adding new one to wrapper");
              const added = wrapper.append({
                tagName: "script",
                type: "custom-script",
                attributes: {
                  id: "interactivity-engine",
                  "data-gjs-type": "custom-script",
                },
                content: js,
                selectable: false,
                hoverable: false,
                draggable: false,
                removable: false,
                layerable: false,
                copyable: false,
              });
              script = Array.isArray(added) ? added[0] : added;
            } else {
              script.set("content", js);
            }

            // Explicitly sync to state to ensure UI updates
            setState((prev) => ({ ...prev, editorJs: js }));
          };
        }

        if (typeof (editor as any).getJs !== "function") {
          (editor as any).getJs = () => {
            const wrapper = editor.Components.getWrapper();
            if (!wrapper) return "";

            const script =
              wrapper.find("#interactivity-engine")[0] ||
              wrapper.find('script[data-gjs-type="custom-script"]')[0];

            return script?.get("content") || "";
          };
        }

        // Wait for editor to fully load
        editor.on("load", async () => {
          if (!isMounted) return;

          try {
            // Get frames using GrapesJS API (if available)
            try {
              if (
                editor.Canvas &&
                typeof editor.Canvas.getFrames === "function"
              ) {
                const frames = editor.Canvas.getFrames();
                console.log("📊 Frames available:", frames?.length || 0);
              } else {
                console.log("📊 getFrames() not available, using fallback");
              }
            } catch (frameError) {
              console.warn("⚠️ Could not get frames:", frameError);
            }

            // Wait for iframe to be ready
            await waitForIframe(editor);
            if (!isMounted) return;

            // Load page content if available
            if (page?.content) {
              console.log("📄 Loading page content into editor");
              try {
                editor.setComponents(page.content);
              } catch (error) {
                console.error("❌ Error setting components:", error);
              }
            }

            // Small delay to let components render
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Inject canvas styles
            console.log("🚀 Triggering injectCanvasStyles...");

            let styleToInject = currentBusiness?.website?.globalStyle;

            if (!styleToInject) {
              // Find the style for the current tenant or just use the first one if only one exist
              console.log("🔄 Using fallback globalStyle from Redux slice");
            }

            injectCanvasStyles(editor, page?.content, styleToInject);

            // Setup event listeners
            setupEventListeners(editor as unknown as GrapesJSEditor);

            // Apply hoverable restriction to existing components
            const wrapper = editor.Components.getWrapper();
            if (wrapper) {
              applyHoverableRestriction(wrapper);
            }

            // Get blocks
            try {
              const blockManager = editor.BlockManager;
              if (
                blockManager &&
                blockManager.getAll &&
                typeof blockManager.getAll === "function"
              ) {
                const allBlocks = blockManager.getAll();
                console.log(
                  "📦 Block Manager - Total blocks found:",
                  allBlocks?.models?.length || 0,
                );

                if (allBlocks && allBlocks.models) {
                  const blockList = allBlocks.models.map((block: any) => {
                    // Extract category properly
                    let category = "Basic";
                    try {
                      const blockCategory = block.attributes.category;
                      if (typeof blockCategory === "string") {
                        category = blockCategory;
                      } else if (
                        blockCategory &&
                        typeof blockCategory === "object"
                      ) {
                        // Try to get the label or name property
                        category =
                          blockCategory.label ||
                          blockCategory.name ||
                          blockCategory.id ||
                          "Basic";
                      }
                    } catch (error) {
                      console.error("Error processing block category:", error);
                    }

                    return {
                      id: block.id,
                      label: block.attributes.label,
                      category: category,
                      content: block.attributes.content,
                    };
                  });

                  // Get initial JavaScript content if available
                  let initialJs = "";
                  if (editor.getJs) {
                    try {
                      initialJs = editor.getJs();
                    } catch (e) {
                      console.warn("Error getting initial JavaScript:", e);
                    }
                  }

                  // Update state with blocks and initial JS
                  setState((prev) => ({
                    ...prev,
                    editor,
                    blocks: blockList,
                    editorJs: initialJs,
                    isLoading: false,
                  }));

                  // Update layers
                  updateLayers(editor as unknown as GrapesJSEditor);
                } else {
                  console.warn("Block models not available");
                  setState((prev) => ({
                    ...prev,
                    editor,
                    isLoading: false,
                  }));
                }
              } else {
                console.warn("BlockManager or getAll method not available");
                setState((prev) => ({
                  ...prev,
                  editor,
                  isLoading: false,
                }));
              }
            } catch (blockError) {
              console.error("Error loading blocks:", blockError);
              setState((prev) => ({
                ...prev,
                editor,
                isLoading: false,
              }));
            }

            console.log("✅ Editor fully initialized");
          } catch (error) {
            console.error("❌ Error in load event:", error);
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        });

        const domc = editor.DomComponents;
        const bm = editor.BlockManager;

        // Register Form component to ensure it's recognized even from raw HTML
        // Register custom component types for form children to prevent selection
        domc.addType("form-input", {
          isComponent: (el: HTMLElement) => {
            if (el.tagName === "INPUT" && el.closest("form")) {
              return { type: "form-input" };
            }
            return false;
          },
          model: {
            defaults: {
              selectable: false,
              hoverable: false,
              draggable: false,
              droppable: false,
              editable: false,
              layerable: false,
              highlightable: false,
              badgable: false,
            },
          },
        });

        domc.addType("form-textarea", {
          isComponent: (el: HTMLElement) => {
            if (el.tagName === "TEXTAREA" && el.closest("form")) {
              return { type: "form-textarea" };
            }
            return false;
          },
          model: {
            defaults: {
              selectable: false,
              hoverable: false,
              draggable: false,
              droppable: false,
              editable: false,
              layerable: false,
              highlightable: false,
              badgable: false,
            },
          },
        });

        domc.addType("form-select", {
          isComponent: (el: HTMLElement) => {
            if (el.tagName === "SELECT" && el.closest("form")) {
              return { type: "form-select" };
            }
            return false;
          },
          model: {
            defaults: {
              selectable: false,
              hoverable: false,
              draggable: false,
              droppable: false,
              editable: false,
              layerable: false,
              highlightable: false,
              badgable: false,
            },
          },
        });

        domc.addType("form-label", {
          isComponent: (el: HTMLElement) => {
            if (el.tagName === "LABEL" && el.closest("form")) {
              return { type: "form-label" };
            }
            return false;
          },
          model: {
            defaults: {
              selectable: false,
              hoverable: false,
              draggable: false,
              droppable: false,
              editable: false,
              layerable: false,
              highlightable: false,
              badgable: false,
            },
          },
        });

        // Add form-div component type to make divs inside forms non-selectable
        domc.addType("form-div", {
          isComponent: (el: HTMLElement) => {
            if (el.tagName === "DIV" && el.closest("form")) {
              return { type: "form-div" };
            }
            return false;
          },
          model: {
            defaults: {
              selectable: false,
              hoverable: false,
              draggable: false,
              droppable: false,
              editable: false,
              layerable: false,
              highlightable: false,
              badgable: false,
            },
          },
        });

        // Add form-button component type
        domc.addType("form-button", {
          isComponent: (el: HTMLElement) => {
            if (el.tagName === "BUTTON" && el.closest("form")) {
              return { type: "form-button" };
            }
            return false;
          },
          model: {
            defaults: {
              selectable: false,
              hoverable: false,
              draggable: false,
              droppable: false,
              editable: false,
              layerable: false,
              highlightable: false,
              badgable: false,
            },
          },
        });

        // Register container types to ensure GrapesJS recognizes their attributes for DND
        domc.addType("site-header", {
          isComponent: (el: HTMLElement) =>
            el.getAttribute?.("data-gjs-type") === "site-header"
              ? { type: "site-header" }
              : false,
          model: {
            defaults: { name: "Header", draggable: false, droppable: true },
          },
        });

        domc.addType("site-footer", {
          isComponent: (el: HTMLElement) =>
            el.getAttribute?.("data-gjs-type") === "site-footer"
              ? { type: "site-footer" }
              : false,
          model: {
            defaults: { name: "Footer", draggable: false, droppable: true },
          },
        });

        domc.addType("page-body", {
          isComponent: (el: HTMLElement) =>
            el.getAttribute?.("data-gjs-type") === "page-body"
              ? { type: "page-body" }
              : false,
          model: {
            defaults: { name: "Page Body", draggable: false, droppable: true },
          },
        });

        // Register Section component type to prevent nesting
        domc.addType("section", {
          isComponent: (el: HTMLElement) => {
            if (el.tagName === "SECTION") {
              return { type: "section" };
            }
            return false;
          },
          model: {
            defaults: {
              name: "Section",
              tagName: "section",
              // Prevent other sections from being dropped inside this one
              droppable: ":not(section)",
              // Allow sections to be dropped into high-level containers
              draggable: ":not(section)",
              attributes: { class: "gjs-section" },
            },
          },
        });

        domc.addType("form", {
          isComponent: (el: HTMLElement) => {
            if (el.tagName === "FORM") {
              return { type: "form" };
            }
            return false;
          },
          model: {
            defaults: {
              name: "Form",
              tagName: "form",
              droppable: ":not(form)",
              draggable: ":not(form)",
              attributes: { class: "gjs-form" },
              traits: [
                {
                  type: "text",
                  name: "action",
                  label: "Action",
                },
                {
                  type: "select",
                  name: "method",
                  label: "Method",
                  options: [
                    { id: "get", value: "get", name: "GET" },
                    { id: "post", value: "post", name: "POST" },
                  ],
                },
                {
                  type: "select",
                  name: "enctype",
                  label: "Encoding",
                  options: [
                    {
                      id: "application/x-www-form-urlencoded",
                      value: "application/x-www-form-urlencoded",
                      name: "URL Encoded",
                    },
                    {
                      id: "multipart/form-data",
                      value: "multipart/form-data",
                      name: "Multipart",
                    },
                    {
                      id: "text/plain",
                      value: "text/plain",
                      name: "Text Plain",
                    },
                  ],
                },
              ],
            },
            init() {
              // Recursively disable selection on all children when form is initialized
              this.on("component:add", (component: any) => {
                this.disableChildrenSelection(component);
              });

              // Disable selection on existing children
              this.get("components")?.forEach((child: any) => {
                this.disableChildrenSelection(child);
              });
            },
            disableChildrenSelection(component: any) {
              if (!component) return;

              // Set the component to be non-selectable
              component.set({
                selectable: false,
                hoverable: false,
                draggable: false,
                droppable: false,
                editable: false,
                layerable: false,
                highlightable: false,
                badgable: false,
              });

              // Recursively disable children
              const children = component.get("components");
              if (children && children.length > 0) {
                children.forEach((child: any) => {
                  this.disableChildrenSelection(child);
                });
              }
            },
          },
          view: {
            events: {
              submit: (e: Event) => e.preventDefault(),
            } as any,
            onRender() {
              if (this.el) {
                // Disable all form inputs at DOM level
                const inputs = this.el.querySelectorAll(
                  "input, textarea, select, button",
                );
                inputs.forEach((input) => {
                  (input as any).disabled = true;
                  (input as HTMLElement).style.pointerEvents = "none";
                  (input as HTMLElement).style.userSelect = "none";
                });

                // Make all children non-selectable via CSS
                const allChildren = this.el.querySelectorAll("*");
                allChildren.forEach((child) => {
                  (child as HTMLElement).style.pointerEvents = "none";
                  (child as HTMLElement).style.userSelect = "none";
                });
              }
            },
          },
        });

        domc.addType("product-list", {
          model: {
            defaults: {
              tagName: "div",
              droppable: false,
              copyable: true,
              draggable: true,
              attributes: {
                "data-component": "product-list",
                "data-api-url": "https://dummyjson.com/products/category",
                "data-collection": "featured",
                "data-limit": "8",
                "data-layout": "grid",
              },
              traits: [
                {
                  type: "text",
                  name: "apiUrl",
                  label: "API URL",
                  placeholder: "https://api.example.com/products",
                },
                {
                  type: "text",
                  name: "collection",
                  label: "Collection Slug",
                },
                {
                  type: "number",
                  name: "limit",
                  label: "Max items",
                  min: 1,
                  max: 50,
                },
                {
                  type: "select",
                  name: "layout",
                  label: "Layout",
                  options: [
                    { id: "grid", name: "Grid" },
                    { id: "carousel", name: "Carousel" },
                  ],
                },
              ],
            },
            init() {
              const updateFromTraits = () => {
                this.addAttributes({
                  "data-api-url":
                    this.get("apiUrl") ||
                    "https://dummyjson.com/products/category",
                  "data-collection": this.get("collection") || "featured",
                  "data-limit": this.get("limit") || "8",
                  "data-layout": this.get("layout") || "grid",
                });
              };
              this.on(
                "change:apiUrl change:collection change:limit change:layout",
                updateFromTraits,
              );
            },
          },
          view: {
            init() {
              this.categories = ["smartphones", "laptops", "fragrances"];
              this.activeCategory = this.categories[0];
              this.productsCache = {};
            },

            async fetchProducts(category: string) {
              if (this.productsCache[category]) {
                return this.productsCache[category];
              }

              try {
                const attrs = this.model.getAttributes();
                const apiUrl =
                  attrs["data-api-url"] ||
                  "https://dummyjson.com/products/category";

                const res = await fetch(`${apiUrl}/${category}`);
                const data = await res.json();
                this.productsCache[category] = data.products;
                return data.products;
              } catch (err) {
                console.error("Failed to fetch products:", err);
                return [];
              }
            },

            renderProducts(products: any[]) {
              const attrs = this.model.getAttributes();
              const limit = parseInt(attrs["data-limit"]) || 8;
              const layout = attrs["data-layout"] || "grid";

              return `
        <div class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
          ${products
            .slice(0, limit)
            .map(
              (p: any) => `
            <div class="product-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; text-align: center;">
              <img src="${p.thumbnail}" alt="${p.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 12px;">
              <h3 style="font-size: 16px; margin: 8px 0;">${p.title}</h3>
              <p style="color: #666; margin: 4px 0; font-size: 14px;">$${p.price}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
            },

            async updateProducts(category: string) {
              const productsContainer = this.el.querySelector(
                ".products-container",
              );
              if (!productsContainer) return;

              productsContainer.innerHTML = `<div style="text-align: center; padding: 40px;">Loading products...</div>`;

              const products = await this.fetchProducts(category);

              if (products.length === 0) {
                productsContainer.innerHTML = `<div style="text-align: center; padding: 40px; color: #999;">Failed to load products</div>`;
              } else {
                productsContainer.innerHTML = this.renderProducts(products);
              }
            },

            render() {
              this.el.innerHTML = `
        <div style="font-family: Arial, sans-serif;">
          <div class="category-tabs" style="display: flex; gap: 8px; border-bottom: 2px solid #e0e0e0; margin-bottom: 20px;">
            ${this.categories
              .map(
                (cat: string) => `
              <button 
                class="tab-btn" 
                data-category="${cat}"
                style="
                  padding: 12px 24px;
                  background: ${
                    cat === this.activeCategory ? "#007bff" : "transparent"
                  };
                  color: ${cat === this.activeCategory ? "white" : "#333"};
                  border: none;
                  border-bottom: 3px solid ${
                    cat === this.activeCategory ? "#007bff" : "transparent"
                  };
                  cursor: pointer;
                  font-size: 14px;
                  text-transform: capitalize;
                  transition: all 0.3s;
                "
              >
                ${cat}
              </button>
            `,
              )
              .join("")}
          </div>
          <div class="products-container">
            <div style="text-align: center; padding: 40px;">Loading products...</div>
          </div>
        </div>
      `;

              // Add click handlers to tabs
              const tabBtns = this.el.querySelectorAll(".tab-btn");
              tabBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                  const target = e.target as HTMLElement;
                  const category = target.getAttribute("data-category");

                  if (category && category !== this.activeCategory) {
                    this.activeCategory = category;

                    // Update tab styles
                    tabBtns.forEach((b) => {
                      const btnEl = b as HTMLElement;
                      const isActive =
                        btnEl.getAttribute("data-category") === category;
                      btnEl.style.background = isActive
                        ? "#007bff"
                        : "transparent";
                      btnEl.style.color = isActive ? "white" : "#333";
                      btnEl.style.borderBottom = isActive
                        ? "3px solid #007bff"
                        : "3px solid transparent";
                    });

                    // Load products for selected category
                    this.updateProducts(category);
                  }
                });
              });

              // Load initial products
              this.updateProducts(this.activeCategory);

              return this;
            },
          },
        });

        bm.add("product-list", {
          label: "Product List",
          category: "E‑commerce",
          content: {
            type: "product-list",
          },
        });
      } catch (error) {
        console.error("Error initializing GrapesJS:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      destroyEditor();
    };
  }, [containerId]); // Only re-initialize when container changes

  // Function to clean up styles and scripts when a component is deleted

  const setupEventListeners = (editor: GrapesJSEditor) => {
    // on mouse
    let addSectionBtn: HTMLElement | null = null;

    editor.on("component:hover", (component: any) => {
      // @ts-ignore - Canvas might be undefined in some types
      const canvas = editor.Canvas;
      const frame = canvas?.getFrameEl?.();
      const doc = frame?.contentDocument;
      if (!doc) return;

      // Helper to remove button
      const removeBtn = () => {
        if (addSectionBtn) {
          addSectionBtn.remove();
          addSectionBtn = null;
        }
      };

      // Tag name or type check for section
      const isSection =
        component?.get?.("tagName") === "section" ||
        component?.get?.("type") === "section";

      if (isSection) {
        const el = component.getEl();
        if (!el) return;

        // Remove old if exists
        removeBtn();

        // Inject button styles once into the iframe head
        const STYLE_ID = "gjs-add-section-style";
        if (!doc.getElementById(STYLE_ID)) {
          const styleEl = doc.createElement("style");
          styleEl.id = STYLE_ID;
          styleEl.textContent = `
            .gjs-add-section-btn {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: #4F6EF7;
              color: #fff;
              border: none;
              border-radius: 999px;
              padding: 8px 20px;
              font-size: 14px;
              font-weight: 600;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              cursor: pointer;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(79,110,247,0.25);
              transition: background 0.15s, box-shadow 0.15s;
              user-select: none;
              position: relative;
              z-index: 1;
            }
            .gjs-add-section-btn:hover {
              background: #3a57e8;
              box-shadow: 0 4px 14px rgba(79,110,247,0.4);
            }
          `;
          doc.head.appendChild(styleEl);
        }

        // Measure the real visible width of the iframe
        const docWidth =
          doc.documentElement.clientWidth || doc.body.clientWidth || 800;
        const scrollY = doc.defaultView?.scrollY || 0;
        const rect = el.getBoundingClientRect();

        // Wrapper: absolutely centered across the full document width
        const wrapper = doc.createElement("div");
        Object.assign(wrapper.style, {
          position: "absolute",
          top: `${rect.bottom + scrollY}px`,
          left: "0",
          width: `${docWidth}px`,
          height: "0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: "9999",
        });

        // Horizontal divider line (full width behind the button)
        const line = doc.createElement("div");
        Object.assign(line.style, {
          position: "absolute",
          top: "50%",
          left: "0",
          right: "0",
          height: "2px",
          background: "#4F6EF7",
          transform: "translateY(-50%)",
        });

        // The pill button
        const btn = doc.createElement("button");
        btn.className = "gjs-add-section-btn";
        btn.style.pointerEvents = "all";
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add section</span>
        `;

        wrapper.appendChild(line);
        wrapper.appendChild(btn);
        addSectionBtn = wrapper;

        btn.onclick = (e) => {
          e.stopPropagation();
          const targetIndex = component.index() + 1;
          window.parent.postMessage(
            { type: "OPEN_TEMPLATE_MANAGER", index: targetIndex },
            "*",
          );
        };

        doc.body.appendChild(addSectionBtn);
      } else {
        // Not a section, remove button if it belongs to a different type
        removeBtn();
      }
    });

    // Cleanup button when mouse leaves canvas or component selection changes
    editor.on("component:hovered:out", () => {
      // Optional: add a small delay before removing to allow clicking
      // For now, we'll keep it simple
    });
    // Component selection
    editor.on("component:selected", (component: any) => {
      console.log("component.nes s --->", component);

      if (component?.attributes?.tagName === "form") {
        console.log("form selected");
        // how to know the child of form
        const componentHtml = component.toHTML();

        //editForm
        setEditForm(componentHtml);
      } else if (component?.attributes?.tagName === "header") {
        console.log("header selected");
        // const componentHtml = component.toHTML();
        // setEditForm(componentHtml)
      } else {
        setEditForm(null);
      }
      // Validate component exists before processing
      if (!component) {
        console.warn("component:selected fired with no component");
        return;
      }

      // Get the hierarchy path to auto-expand parent layers
      const hierarchy = getComponentHierarchy(component);
      console.log("Component hierarchy for auto-expand:", hierarchy);

      setState((prev) => ({
        ...prev,
        selectedElement: component,
        autoExpandedLayers: hierarchy, // Expand all parents
        selectedLayerId:
          typeof component.getId === "function"
            ? component.getId()
            : component.cid, // Highlight the selected layer
      }));
      updateStylesFromComponent(component);

      // Initialize interactions if not already present

      console.log("interaction", component.get("interactions"));

      try {
        if (
          component.get &&
          typeof component.get === "function" &&
          !component.get("interactions")
        ) {
          console.log("interaction", component.get("interactions"));
          if (component.set && typeof component.set === "function") {
            component.set("interactions", []);
          }
        }
      } catch (error) {
        console.error("Error initializing interactions:", error);
      }

      // Custom Toolbar Logic: Clean up & Add Features
      let toolbar = component.get("toolbar") || [];

      // 1. Remove "Move" (Drag) and "Script" (Edit Code) icons
      // 'tlb-move' is the standard drag handle.
      // 'open-code', 'script-editor', or anything with title 'Script' often comes from plugins.
      toolbar = toolbar.filter((btn: any) => {
        const cmd = btn.command;
        const title = btn.attributes?.title || "";
        const id = btn.id || "";

        // Remove standard "Move" (Drag), "Script", and potentially the first icon if it's "Info"/"View"
        // User specifically asked to "remove first icon".
        // In many setups, the first icon is 'tlb-move', but we filter that by command.
        // If it's something else, let's look for common unwanted starters.
        if (cmd === "tlb-move") return false;
        if (title.toLowerCase().includes("script") || cmd === "open-code")
          return false;
        if (cmd === "core:preview" || title === "View") return false; // often the eye/first icon
        if (id === "arrow-up") return false; // sometimes the up arrow is first
        return true;
      });

      // Force remove the very first icon if it's still there and looks like a generic file/page icon (as seen in image 1)
      // The image 1 shows: [FileIcon] [UpArrow] ...
      // If we filtered correctly, it might catch it, but to be sure matching the "remove first icon" request:
      if (
        toolbar.length > 0 &&
        (toolbar[0].command === "tlb-info" ||
          toolbar[0].id === "icon-fa-file-o")
      ) {
        toolbar.shift();
      }
      // Or just blindly shift if they insist, but let's try to be smart first.
      // Actually, let's just shift if it's NOT one of our desired ones (Delete, Clone, AI, Comments)
      if (toolbar.length > 0) {
        const first = toolbar[0];
        // If the first icon is NOT Clone, Delete, or our custom ones... remove it.
        // Common first icons: Move, Up Arrow, Select Parent, Info.
        const keepCommands = ["tlb-clone", "tlb-delete", "tlb-edit"];
        const keepTitles = [
          "AI Chat",
          "Comments",
          "Duplicate",
          "Delete",
          "Edit",
        ];

        const isKeeper =
          keepCommands.includes(first.command) ||
          keepTitles.some((t) => first.attributes?.title?.includes(t));

        if (!isKeeper && !first.label?.includes("AI Chat")) {
          // It's likely the unwanted "Page/File" icon or "Select Parent"
          toolbar.shift();
        }
      }

      // 2. Add "AI Chat" if missing
      const hasAiChat = toolbar.some(
        (btn: any) => btn.attributes?.title === "AI Chat",
      );
      if (!hasAiChat) {
        toolbar.push({
          attributes: { title: "AI Chat", class: "gjs-tlb-btn-ai" }, // Add class for potential styling
          // Purple Sparkle Icon
          label: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 8V4H8"></path>
  <rect width="16" height="12" x="4" y="8" rx="2" fill="transparent"></rect>
  <path d="M2 14h2"></path>
  <path d="M20 14h2"></path>
  <path d="M15 13v2"></path>
  <path d="M9 13v2"></path>
</svg>`,
          command: (editor: any) => {
            const componentHtml = component.toHTML();
            setSelectedComponentForAi({
              component,
              html: componentHtml,
              css: editorRef?.current?.getCss?.() || "",
              type: component.get("type"),
              tagName: component.get("tagName"),
            });
            setIsAiChatOpen(true);
          },
        });
      }

      // 3. Add "Comments" if missing
      const hasComments = toolbar.some(
        (btn: any) => btn.attributes?.title === "Comments",
      );
      if (!hasComments) {
        toolbar.push({
          attributes: { title: "Comments" },
          label: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path fill="transparent" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>`,
          command: (editor: any) => {
            const componentHtml = component.toHTML();
            setSelectedComponentForAi({
              component,
              html: componentHtml,
              css: editorRef?.current?.getCss?.() || "",
              type: component.get("type"),
              tagName: component.get("tagName"),
            });
            setIsCommentsOpen(true);
          },
        });
      }

      component.set("toolbar", toolbar);
    });

    editor.on("component:deselected", () => {
      setState((prev) => ({
        ...prev,
        selectedElement: null,
      }));
    });

    // Device change
    editor.on("change:device", () => {
      try {
        if (editor && typeof editor.getDevice === "function") {
          setState((prev) => ({
            ...prev,
            currentDevice: editor.getDevice(),
          }));
        }
      } catch (error) {
        console.error("Error handling device change:", error);
      }
    });

    // Script-related events
    editor.on("script:update", () => {
      try {
        if (
          editor &&
          (editor as any).getJs &&
          typeof (editor as any).getJs === "function"
        ) {
          const js = (editor as any).getJs() || "";
          setState((prev) => ({
            ...prev,
            editorJs: js,
          }));
        }
      } catch (error) {
        console.error("Error handling script update:", error);
      }
    });

    editor.on("script:add", () => {
      try {
        if (editor && editor.getJs && typeof editor.getJs === "function") {
          const js = editor.getJs() || "";
          setState((prev) => ({
            ...prev,
            editorJs: js,
          }));
        }
      } catch (error) {
        console.error("Error handling script add:", error);
      }
    });

    editor.on("script:remove", () => {
      if (editor && (editor as any).getJs) {
        const js = (editor as any).getJs() || "";
        setState((prev) => ({
          ...prev,
          editorJs: js,
        }));
      }
    });

    // Component changes - commented out component:update to prevent excessive updates
    // editor.on("component:update", () => updateLayers(editor));

    const hydrateIcons = () => {
      const frame = editor.Canvas?.getFrameEl?.();
      const doc = frame?.contentDocument;
      if (!doc || !doc.defaultView) return;
      const win = doc.defaultView as any;

      if (win.lucide && typeof win.lucide.createIcons === "function") {
        win.lucide.createIcons();
      } else {
        // Fallback in case lucide is not yet available in the iframe window
        const interval = setInterval(() => {
          if (win.lucide && typeof win.lucide.createIcons === "function") {
            win.lucide.createIcons();
            clearInterval(interval);
          }
        }, 100);
        setTimeout(() => clearInterval(interval), 2000); // Stop trying after 2s
      }
    };

    editor.on("component:add", (component: any) => {
      const tagName = component.get("tagName");
      if (tagName === "div" && isComponentUnderSection(component)) {
        component.set("hoverable", false);
      }
      updateLayers(editor);
      hydrateIcons();
    });

    editor.on("component:update", hydrateIcons);
    editor.on("canvas:drop", hydrateIcons);

    editor.on("component:remove", (component: any) => {
      // Clean up styles and scripts associated with the deleted component
      const currentJs = cleanupComponentStylesAndScripts(
        editor as unknown as GrapesJSEditor,
        component,
      );
      if (typeof currentJs === "string") {
        setState((prev) => ({ ...prev, editorJs: currentJs }));
      }
      updateLayers(editor);
      hydrateIcons();
    });

    // Inject Unified Interactivity engine
    editor.on("load", () => {
      const wrapper = editor.Components.getWrapper();
      const INTERACTIVITY_SCRIPT_ID = "interactivity-engine";

      if (wrapper && !wrapper.find(`#${INTERACTIVITY_SCRIPT_ID}`).length) {
        editor.addComponents({
          tagName: "script",
          type: "custom-script",
          attributes: {
            id: INTERACTIVITY_SCRIPT_ID,
            "data-gjs-type": "custom-script",
          },
          content: getGlobalInteractivityScript(),
          layerable: false, // Keep it out of the layers panel for a cleaner UI
          removable: false,
          draggable: false,
          selectable: false,
          copyable: false,
        });
        console.log("✅ Unified Interactivity Engine Injected");

        // Sync existing interactions after injection
        const {
          syncInteractivityScript,
        } = require("@/hooks/editor-interactivity");
        setTimeout(() => syncInteractivityScript(editor), 200);
      }
    });
  };

  // Helper function to get the full hierarchy path of a component
  const getComponentHierarchy = (component: any): string[] => {
    const hierarchy: string[] = [];
    let current = component;

    while (current) {
      // Use getId() to match the ID format used in PageLayer.tsx
      const id =
        typeof current.getId === "function" ? current.getId() : current.cid;
      if (id) {
        hierarchy.unshift(id); // Add to beginning of array
      }
      // Different ways to access parent depending on GrapesJS version
      current =
        typeof current.parent === "function"
          ? current.parent()
          : current.parent;
    }

    console.log("📊 Component hierarchy (IDs):", hierarchy);
    return hierarchy;
  };

  const updateLayers = (editor: GrapesJSEditor) => {
    if (!editor || !editor.Components) {
      return;
    }

    try {
      // Get the wrapper component first, then get its children
      const wrapper = editor.Components.getWrapper();

      if (!wrapper) {
        setState((prev) => ({
          ...prev,
          layers: [],
        }));
        return;
      }

      // Get components from the wrapper
      let components = [];

      if (typeof wrapper.components === "function") {
        components = wrapper.components();
      } else if (wrapper.get && typeof wrapper.get === "function") {
        const comps = wrapper.get("components");

        if (comps && typeof comps.models !== "undefined") {
          components = comps.models;
        } else if (Array.isArray(comps)) {
          components = comps;
        }
      }

      // Verify components is valid before mapping
      if (
        !components ||
        !Array.isArray(components) ||
        components.length === 0
      ) {
        setState((prev) => ({
          ...prev,
          layers: [],
        }));
        return;
      }

      const layerItems = mapComponentsToLayers(components);

      setState((prev) => ({
        ...prev,
        layers: layerItems,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        layers: [],
      }));
    }
  };

  const mapComponentsToLayers = (
    components: any[] | undefined,
    level = 0,
  ): LayerItem[] => {
    // Return empty array if components is undefined or not an array
    if (!components || !Array.isArray(components)) {
      return [];
    }

    return components.map((component) => {
      // Make sure component exists
      if (!component) {
        return {
          id: `unknown-${Math.random().toString(36).substr(2, 9)}`,
          name: "Unknown",
          level,
          children: [],
        };
      }

      // Safely get children components
      let children = [];
      try {
        // Check if component has a components method
        if (
          component.components &&
          typeof component.components === "function"
        ) {
          children = component.components();
        } else if (component.get && typeof component.get === "function") {
          const componentsMethod = component.get("components");
          if (componentsMethod && typeof componentsMethod === "function") {
            children = componentsMethod();
          } else if (Array.isArray(componentsMethod)) {
            children = componentsMethod;
          }
        }
      } catch (error) {
        console.error("Error getting child components:", error);
      }

      return {
        id: component.cid || `comp-${Math.random().toString(36).substr(2, 9)}`,
        name:
          component.getName?.() || component.get?.("tagName") || "Component",
        level,
        children:
          children && children.length
            ? mapComponentsToLayers(children, level + 1)
            : [],
      };
    });
  };

  const updateStylesFromComponent = (component: any) => {
    if (!component) return;

    try {
      const style = component.getStyle() || {};

      // Parse text-shadow if it exists
      let textShadowX = "0px";
      let textShadowY = "0px";
      let textShadowBlur = "0px";
      let textShadowColor = "rgba(0,0,0,0.5)";

      if (style["text-shadow"]) {
        try {
          // Handle both space-separated and comma-separated formats
          let textShadowParts = style["text-shadow"].includes(",")
            ? style["text-shadow"].split(",")[0].trim().split(" ")
            : style["text-shadow"].split(" ");

          // Filter out empty parts that might come from extra spaces
          textShadowParts = textShadowParts.filter(
            (part: string) => part.trim() !== "",
          );

          if (textShadowParts.length >= 3) {
            // First two parts are always X and Y offsets
            textShadowX = textShadowParts[0];
            textShadowY = textShadowParts[1];

            // For the blur and color, we need to determine which is which
            // If the third part starts with a number or has 'px', it's the blur
            if (/^-?\d|px/.test(textShadowParts[2])) {
              textShadowBlur = textShadowParts[2];
              // The rest is the color
              if (textShadowParts.length > 3) {
                textShadowColor = textShadowParts.slice(3).join(" ");
              }
            } else {
              // If the third part doesn't look like a size, it's probably the color
              textShadowBlur = "0px";
              textShadowColor = textShadowParts.slice(2).join(" ");
            }
          }
        } catch (e) {
          console.error("Error parsing text-shadow:", e);
          // Provide fallback values if parsing fails
          textShadowX = "0px";
          textShadowY = "0px";
          textShadowBlur = "0px";
          textShadowColor = "rgba(0,0,0,0.5)";
        }
      }

      // Parse border-radius to extract the numeric value
      let borderRadius = 0;
      if (style["border-radius"]) {
        try {
          const radiusValue = style["border-radius"]
            .replace("rem", "")
            .replace("px", "")
            .replace("em", "");
          borderRadius = Number.parseFloat(radiusValue) || 0;
        } catch (e) {
          console.error("Error parsing border-radius:", e);
        }
      }

      // Ensure color values have proper defaults and formats
      // Get computed styles for more accurate values if browser environment
      const backgroundColor = style["background-color"] || "#FFFFFF";
      const borderColor = style["border-color"] || "#E5E7EB";
      const borderWidth =
        style["border-width"] || style["border"]
          ? style["border"].split(" ")[0]
          : "0px";
      const borderStyle =
        style["border-style"] ||
        (style["border"] ? style["border"].split(" ")[1] : "solid");

      // Get current state to ensure we only update what's changed
      setState((prev) => {
        // Only update the states that have changed to prevent unnecessary re-renders
        const newStyles = {
          typography: {
            fontFamily:
              style["font-family"] ||
              prev.styles.typography.fontFamily ||
              "Arial, sans-serif",
            fontSize:
              style["font-size"] || prev.styles.typography.fontSize || "16px",
            fontWeight:
              style["font-weight"] ||
              prev.styles.typography.fontWeight ||
              "normal",
            fontStyle:
              style["font-style"] ||
              prev.styles.typography.fontStyle ||
              "normal",
            color: style["color"] || prev.styles.typography.color || "#000000",
            textAlign:
              style["text-align"] || prev.styles.typography.textAlign || "left",
            lineHeight:
              style["line-height"] ||
              prev.styles.typography.lineHeight ||
              "1.5",
            letterSpacing:
              style["letter-spacing"] ||
              prev.styles.typography.letterSpacing ||
              "0px",
            textDecoration:
              style["text-decoration"] ||
              prev.styles.typography.textDecoration ||
              "none",
            textTransform:
              style["text-transform"] ||
              prev.styles.typography.textTransform ||
              "none",
            textShadowX,
            textShadowY,
            textShadowBlur,
            textShadowColor,
          },
          spacing: {
            borderRadius,
            padding: style["padding"] || prev.styles.spacing.padding || "0px",
            margin: style["margin"] || prev.styles.spacing.margin || "0px",
          },
          colors: {
            backgroundColor,
            borderColor,
            borderWidth,
            borderStyle,
          },
        };

        return {
          ...prev,
          styles: newStyles,
        };
      });
    } catch (error) {
      console.error("Error updating styles from component:", error);
    }
  };

  // Editor actions
  const actions = {
    setGlobalStyles: (
      globalStyle?: string,
      theme: "light" | "dark" = "light",
    ) => {
      if (editorRef.current) {
        const frame = editorRef.current.Canvas?.getFrameEl?.();
        const doc = frame?.contentDocument;
        if (doc) {
          doc.documentElement.setAttribute("data-theme", theme);
        }
        injectCanvasStyles(
          editorRef.current,
          page?.content,
          globalStyle || currentBusiness?.website?.globalStyle,
        );
      }
    },
    setDevice: (device: string) => {
      if (editorRef.current) {
        editorRef.current.setDevice(device);
        setState((prev) => ({ ...prev, currentDevice: device }));
      }
    },

    undo: () => {
      if (editorRef.current) {
        editorRef.current.UndoManager.undo();
      }
    },

    redo: () => {
      if (editorRef.current) {
        editorRef.current.UndoManager.redo();
      }
    },
    clearCanvas: () => {
      if (editorRef.current) {
        editorRef.current.setComponents("");
        editorRef.current.setStyle("");
        setState((prev) => ({
          ...prev,
          editorJs: "",
          selectedElement: null,
        }));
      }
    },

    // Add updateJs action
    updateJs: (js: string) => {
      try {
        if (
          editorRef.current &&
          typeof editorRef.current.setJs === "function"
        ) {
          editorRef.current.setJs(js);

          setState((prev) => ({
            ...prev,
            editorJs: js,
          }));
        } else {
          console.warn("setJs method not available on editor");
        }
      } catch (error) {
        console.error("Error updating JavaScript:", error);
      }
    },

    // Manually refresh canvas styles
    refreshCanvasStyles: () => {
      if (!editorRef.current || !page?.content) {
        console.warn(
          "Cannot refresh styles: editor or page content not available",
        );
        return;
      }

      console.log("🔄 Manually refreshing canvas styles");
      const frame = editorRef.current.Canvas?.getFrameEl?.();
      const doc = frame?.contentDocument;

      if (!doc || !doc.head || !doc.body) {
        console.warn("Canvas iframe not ready for style refresh");
        return;
      }

      try {
        // Remove existing custom styles
        doc.querySelector('[data-root-vars="true"]')?.remove();
        doc
          .querySelectorAll('[data-font="true"]')
          .forEach((el: Element) => el.remove());
        doc.querySelector('[data-tailwind="true"]')?.remove();

        // Inject Tailwind CSS CDN
        const tailwindScript = doc.createElement("script");
        tailwindScript.src = "https://cdn.tailwindcss.com";
        tailwindScript.setAttribute("data-tailwind", "true");
        doc.head.appendChild(tailwindScript);

        // Inject CSS variables
        const style = doc.createElement("style");
        style.setAttribute("data-root-vars", "true");
        style.innerHTML = createCanvasStyleString(page.content);
        doc.head.appendChild(style);

        // Inject font links
        extractFontLinks(page.content).forEach((url) => {
          const link = doc.createElement("link");
          link.rel = "stylesheet";
          link.href = url;
          link.setAttribute("data-font", "true");
          doc.head.appendChild(link);
        });

        console.log("✅ Canvas styles manually refreshed");
      } catch (error) {
        console.error("❌ Error refreshing canvas styles:", error);
      }
    },

    savePage: async () => {
      if (!page?._id) {
        toast.error("No page ID found. Cannot save.");
        return;
      }
      if (!editorRef.current) {
        toast.error("Editor not initialized.");
        return;
      }

      // Safely get HTML, CSS and JS with error handling
      let html = "";
      let css = "";
      let js = "";

      try {
        const wrapper =
          editorRef.current.Components?.getWrapper() ||
          (editorRef.current as any).getWrapper?.();
        const pageBody = wrapper?.find('[data-gjs-type="page-body"]')[0];

        // If we found a page-body wrapper, it means we are in the combined mode
        if (pageBody && type !== "header" && type !== "footer") {
          console.log("📄 Extracting content from page-body only");
          // Extract HTML: only children of page-body
          html = "";
          const components = pageBody.get("components");
          if (components && components.forEach) {
            components.forEach((comp: any) => {
              html += comp.toHTML();
            });
          }

          // Extract JS: scan page-body AND look for global scripts
          js = "";

          // 1. Get global JS via the helper if available
          if (typeof (editorRef.current as any).getJs === "function") {
            js = (editorRef.current as any).getJs() || "";
          }

          // 2. Also scan for any other scripts that might be missed
          const allFoundScripts: any[] = [];
          const scanRecursive = (comp: any) => {
            if (!comp) return;
            const tagName = comp.get("tagName")?.toLowerCase();
            const compType = comp.get("type");
            if (tagName === "script" || compType === "script") {
              const isGlobal =
                comp.getAttributes()?.["data-gjs-type"] === "custom-script";
              // If it's the global script, we already got it via getJs()
              if (!isGlobal) {
                allFoundScripts.push(comp);
              }
            }
            const children = comp.get("components");
            if (children && children.forEach) {
              children.forEach((child: any) => scanRecursive(child));
            }
          };

          scanRecursive(pageBody);

          allFoundScripts.forEach((scriptComp: any) => {
            let content = scriptComp.get("content");
            if (!content) {
              const innerComps = scriptComp.get("components");
              if (innerComps && innerComps.length > 0) {
                content = innerComps.at(0).get("content");
              }
            }
            if (content) {
              const trimmedContent = content.trim();
              const id = scriptComp.getAttributes()?.id;
              // Only add if not already in the combined js
              if (trimmedContent && !js.includes(trimmedContent)) {
                js += `\n/* Interactivity Script: ${id || "anonymous"} */\n${content}`;
              }
            }
          });
        } else {
          // Fallback to default behavior
          html = editorRef.current.getHtml();

          // Get JS from internal GrapesJS logic
          if (typeof editorRef.current.getJs === "function") {
            js = editorRef.current.getJs() || "";
          }

          if (wrapper) {
            const allFoundScripts: any[] = [];

            const scanRecursive = (comp: any) => {
              if (!comp) return;

              const tagName = comp.get("tagName")?.toLowerCase();
              const compType = comp.get("type");

              if (tagName === "script" || compType === "script") {
                const isGlobal =
                  comp.getAttributes()?.["data-gjs-type"] === "custom-script";
                // If it's the global script, we already got it via getJs()
                if (!isGlobal) {
                  allFoundScripts.push(comp);
                }
              }

              const children = comp.get("components");
              if (children && children.forEach) {
                children.forEach((child: any) => scanRecursive(child));
              }
            };

            scanRecursive(wrapper);

            allFoundScripts.forEach((scriptComp: any) => {
              let content = scriptComp.get("content");

              if (!content) {
                const innerComps = scriptComp.get("components");
                if (innerComps && innerComps.length > 0) {
                  content = innerComps.at(0).get("content");
                }
              }

              if (content) {
                const trimmedContent = content.trim();
                const id = scriptComp.getAttributes()?.id;

                if (trimmedContent && !js.includes(trimmedContent)) {
                  js += `\n/* Interactivity Script: ${id || "anonymous"} */\n${content}`;
                }
              }
            });
          }
        }
        try {
          if (typeof editorRef.current.getCss === "function") {
            css = editorRef.current.getCss() || "";
          }
        } catch (error) {
          console.warn("Error getting CSS:", error);
        }
      } catch (error) {
        console.warn("Error getting HTML/JS:", error);
      }
      // Option A: store CSS and JS inline with HTML
      const fullHtml = `
    <style>
      ${css}
    </style>
    ${html}
    ${js ? `<script>${js}</script>` : ""}
  `;
      // console.log("Saving page", page._id, html);
      if (type === "footer") {
        const response = await dispatch(
          updateFooter({
            ...page,
            _id: page._id?.toString() ?? "",
            tenantId: page.tenantId ?? "",
            content: fullHtml,
          }),
        ).unwrap();
        if (response) {
          toast.success("Footer content updated successfully!");
        }
      } else if (type === "header") {
        const response = await dispatch(
          updateHeader({
            ...page,
            _id: page._id?.toString() ?? "",
            tenantId: page.tenantId ?? "",
            content: fullHtml,
          }),
        ).unwrap();
        if (response) {
          toast.success("Header content updated successfully!");
        }
      } else {
        const response = await dispatch(
          savePageThunk({
            id: page._id ?? "",
            tenantId: page.tenantId ?? "",
            content: fullHtml,
          }),
        ).unwrap();
        // console.log("console.log", response)
        if (response) {
          toast.success("Page content updated successfully!");
        }
      }

      // Optionally handle response or errors here
    },

    exportHtml: () => {
      if (editorRef.current) {
        const html = editorRef.current.getHtml();

        // Safely get CSS with fallback
        let css = "";
        try {
          if (typeof editorRef.current.getCss === "function") {
            css = editorRef.current.getCss() || "";
          }
        } catch (error) {
          console.warn("Error getting CSS:", error);
        }

        // Get JavaScript with better error handling
        let js = "";
        try {
          if (typeof editorRef.current.getJs === "function") {
            js = editorRef.current.getJs();
          }
        } catch (error) {
          console.warn("Error getting JavaScript:", error);
        }

        // Generate initialization code for animations
        const initCode = `
          // Initialize elements with animations
          document.addEventListener('DOMContentLoaded', function() {
            // Hide elements that should be initially hidden
            document.querySelectorAll('[data-initial-state="hidden"]').forEach(function(el) {
              el.style.display = 'none';
              el.style.opacity = '0';
            });

            // Setup Intersection Observer for scroll-triggered elements
            const scrollElements = document.querySelectorAll('[data-scroll-action]');
            if (scrollElements.length > 0 && 'IntersectionObserver' in window) {
              scrollElements.forEach(function(el) {
                const offset = parseFloat(el.getAttribute('data-scroll-offset') || '0') / 100;
                
                const observer = new IntersectionObserver(function(entries) {
                  entries.forEach(function(entry) {
                    if (entry.isIntersecting && !el.classList.contains('scroll-triggered')) {
                      el.classList.add('scroll-triggered');
                      const action = el.getAttribute('data-scroll-action');
                      
                      if (action === 'show') {
                        el.style.display = 'block';
                        setTimeout(function() { el.style.opacity = '1'; }, 10);
                      } else if (action === 'add-class') {
                        const className = el.getAttribute('data-scroll-class');
                        if (className) el.classList.add(className);
                      }
                    }
                  });
                }, {
                  threshold: offset || 0.1,
                  rootMargin: '0px'
                });
                
                observer.observe(el);
              });
            }
          });
        `;

        // Create a full HTML document with proper script separation
        const fullHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Exported Landing Page</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>${css}</style>
          </head>
          <body>
            ${html}
            ${js ? `<script>${js}</script>` : ""}
            <script>${initCode}</script>
          </body>
          </html>
        `;

        return fullHtml;
      }
      return "";
    },

    downloadHtml: () => {
      const fullHtml = actions.exportHtml();
      if (fullHtml) {
        // Create a download link
        const blob = new Blob([fullHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "landing-page.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },

    addComponent: (content: any) => {
      if (!editorRef.current) return;
      console.log("calling add function");
      console.log("content", content);
      try {
        // Enhanced handling for different content types
        if (typeof content === "string") {
          // For HTML strings - this is the most common case for blocks
          // Extract scripts if present to ensure they load on canvas
          const { body, scripts, styles } = extractParts(content);

          // Re-attach styles to the body if they exist
          let contentToAdd = body;
          if (styles) {
            contentToAdd = `<style>${styles}</style>${body}`;
          }

          addComponentAboveFooter(editorRef.current, contentToAdd);

          if (scripts && scripts.length > 0) {
            console.log(`Adding ${scripts.length} scripts from component`);
            scripts.forEach((scriptContent: string) => {
              if (scriptContent.trim()) {
                // Use actions.updateJs or directly setJs
                const currentJs = editorRef.current!.getJs
                  ? editorRef.current!.getJs()
                  : "";
                if (!currentJs.includes(scriptContent.trim())) {
                  const newJs = currentJs + "\n" + scriptContent.trim();
                  if (typeof (editorRef.current as any).setJs === "function") {
                    (editorRef.current as any).setJs(newJs);
                    setState((prev) => ({ ...prev, editorJs: newJs }));
                  }
                }
              }
            });
          }
        }

        // Handle object content (like for image components)
        else if (typeof content === "object") {
          // If content has a specific GrapesJS component type
          if (content.type) {
            addComponentAboveFooter(editorRef.current, {
              type: content.type,
              ...content,
            });
          }
          // Try to convert object to component
          else {
            addComponentAboveFooter(editorRef.current, content);
          }
        }

        // Fallback for any other type
        else {
          console.warn("Unrecognized content format", content);
          editorRef.current.addComponents(
            `<div>Error: Invalid content format</div>`,
          );
        }
      } catch (error) {
        console.error("Error adding component:", error);
        // Try with a safer fallback
        try {
          editorRef.current.addComponents(
            "<div>Component could not be added</div>",
          );
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
        }
      }
    },

    importCode: (code: string, append = false) => {
      if (editorRef.current) {
        if (append) {
          editorRef.current.addComponents(code);
        } else {
          editorRef.current.setComponents(code);
        }
      }
    },

    updateStyle: (property: string, value: string) => {
      try {
        // Check if this is a global CSS variable (starts with --)
        if (property.startsWith("--")) {
          // Handle global CSS variables
          if (editorRef.current) {
            const canvas = editorRef.current.Canvas;

            // Check if Canvas module and getDocument method exist
            if (!canvas || typeof canvas.getDocument !== "function") {
              console.warn("Canvas module or getDocument method not available");
              return;
            }

            const canvasDoc = canvas.getDocument();
            const canvasHead = canvasDoc?.head;

            if (canvasHead) {
              // Find or create the global styles element
              let globalStyleEl = canvasDoc.querySelector(
                '[data-global-styles="true"]',
              );
              console.log("globalStyleEl--->", globalStyleEl);
              if (!globalStyleEl) {
                globalStyleEl = canvasDoc.createElement("style");
                globalStyleEl.setAttribute("data-global-styles", "true");
                canvasHead.appendChild(globalStyleEl);
              }

              // Get existing global styles
              const existingStyles = globalStyleEl.innerHTML;

              console.log("existingStyles--->", existingStyles);
              // Standard CSS variable regex
              const cssVars: Record<string, string> = {};

              console.log("cssVars--->", cssVars);
              // Parse all variables from the content
              const declRegex = /(--[\w-]+)\s*:\s*([^;]+)/g;
              let match;
              while ((match = declRegex.exec(existingStyles)) !== null) {
                cssVars[match[1]] = match[2].trim();
              }

              // Update or add the new variable
              cssVars[property] = value;

              const newGlobalStyle = generateGlobalStyleContent(cssVars);
              globalStyleEl.innerHTML = newGlobalStyle;

              // Do not change the value of redux on edit.
              // Instead, trigger a local state update to ensure UI re-renders and reflects canvas changes.
              setState((prev) => ({ ...prev }));

              console.log(
                `✅ Global CSS variable ${property} set to ${value} (Canvas only)`,
              );

              // Force editor refresh to apply variables if needed
              editorRef.current?.refresh();
            }
          }
          return;
        }

        // Handle regular component styles
        if (state.selectedElement) {
          // Get existing styles and merge with the new property
          const currentStyles = state.selectedElement.getStyle() || {};
          const updatedStyles = { ...currentStyles, [property]: value };
          console.log("updatedStyles", updatedStyles);
          // Apply the merged styles to the element
          state.selectedElement.setStyle(updatedStyles);

          // REDIRECT
          // This block is intended for the interactivity script, not updateStyle.
          // The instruction seems to have placed it incorrectly.
          // Assuming this was a mistake and the user meant to provide a different change for updateStyle.
          // For now, I will *not* insert the redirect block here as it's syntactically incorrect and out of context.
          // I will proceed with the rest of the updateStyle function as it was before,
          // and assume the redirect logic was meant for a different part of the code,
          // possibly related to event handling in the exported HTML.

          // Update local state based on property type
          setState((prev) => {
            // Handle typography properties
            if (property === "font-family") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    fontFamily: value,
                  },
                },
              };
            } else if (property === "font-size") {
              console.log("Font Size", value);
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    fontSize: value,
                  },
                },
              };
            } else if (property === "font-weight") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    fontWeight: value,
                  },
                },
              };
            } else if (property === "font-style") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    fontStyle: value,
                  },
                },
              };
            } else if (property === "color") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    color: value,
                  },
                },
              };
            } else if (property === "text-align") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    textAlign: value,
                  },
                },
              };
            } else if (property === "line-height") {
              // Ensure line-height is properly formatted
              let formattedValue = value;

              // If it's just a number without units, keep it as is (unitless line-height)
              // If it has units or is a complex value, use it directly
              if (
                !isNaN(Number.parseFloat(value)) &&
                isFinite(Number(value)) &&
                !value.match(/[a-z%]/i)
              ) {
                formattedValue = value; // Keep unitless values as is
              } else if (
                !value.match(/px|em|rem|%/i) &&
                !isNaN(Number.parseFloat(value))
              ) {
                // If it's a number-like string without units, keep it unitless
                formattedValue = Number.parseFloat(value).toString();
              }

              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    lineHeight: formattedValue,
                  },
                },
              };
            } else if (property === "letter-spacing") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    letterSpacing: value,
                  },
                },
              };
            } else if (property === "text-decoration") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    textDecoration: value,
                  },
                },
              };
            } else if (property === "text-transform") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  typography: {
                    ...prev.styles.typography,
                    textTransform: value,
                  },
                },
              };
            } else if (property === "text-shadow") {
              // Parse text-shadow value to update all shadow properties
              const textShadowParts = value.split(" ");
              if (textShadowParts.length >= 3) {
                const textShadowX = textShadowParts[0];
                const textShadowY = textShadowParts[1];
                const textShadowBlur = textShadowParts[2];

                // The color could be in different formats
                let textShadowColor = "rgba(0,0,0,0.5)";
                if (textShadowParts.length === 4) {
                  textShadowColor = textShadowParts[3];
                } else if (textShadowParts.length > 4) {
                  textShadowColor = textShadowParts.slice(3).join(" ");
                }

                return {
                  ...prev,
                  styles: {
                    ...prev.styles,
                    typography: {
                      ...prev.styles.typography,
                      textShadowX,
                      textShadowY,
                      textShadowBlur,
                      textShadowColor,
                    },
                  },
                };
              }
            }
            // Handle spacing properties
            else if (property.startsWith("padding")) {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  spacing: {
                    ...prev.styles.spacing,
                    [property]: value,
                  },
                },
              };
            } else if (property.startsWith("margin")) {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  spacing: {
                    ...prev.styles.spacing,
                    [property]: value,
                  },
                },
              };
            } else if (property === "border-radius") {
              // Extract numeric value from border-radius
              const radiusValue = value
                .replace("rem", "")
                .replace("px", "")
                .replace("em", "");
              const borderRadius = Number.parseFloat(radiusValue) || 0;

              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  spacing: {
                    ...prev.styles.spacing,
                    borderRadius: borderRadius,
                  },
                },
              };
            }
            // Handle color properties
            else if (property === "background-color") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  colors: {
                    ...prev.styles.colors,
                    backgroundColor: value,
                  },
                },
              };
            } else if (property === "border-color") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  colors: {
                    ...prev.styles.colors,
                    borderColor: value,
                  },
                },
              };
            } else if (property === "border-width") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  colors: {
                    ...prev.styles.colors,
                    borderWidth: value,
                  },
                },
              };
            } else if (property === "border-style") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  colors: {
                    ...prev.styles.colors,
                    borderStyle: value,
                  },
                },
              };
            }
            // Handle layout properties
            else if (property === "display") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  layout: {
                    ...prev.styles.layout,
                    display: value,
                  },
                },
              };
            }

            // If no property matched, return prev unchanged
            return prev;
          });

          // Trigger editor refresh to update the view
          if (editorRef.current) {
            console.log("editorRef.current", editorRef.current);
            try {
              // Use a timeout to ensure the state is updated first
              setTimeout(() => {
                editorRef.current?.refresh();
                // Reselect the component to ensure it's still selected
                if (state.selectedElement) {
                  editorRef.current?.select(state.selectedElement);
                }
              }, 10);
            } catch (e) {
              console.error("Error refreshing editor:", e);
            }
          }
        }
        //  console.log("edit get edit---get html", state.editor.getHtml())
        // console.log("selected Elememnt---", state.selectedElement)
      } catch (error) {
        console.error("Error updating style:", error);
      }
    },

    // updateAttribute: (name: string, value: string) => {
    //   if (state.selectedElement) {
    //     // If value is empty, remove the attribute
    //     if (value === "") {
    //       state.selectedElement.removeAttributes(name);
    //     } else {
    //       state.selectedElement.addAttributes({ [name]: value });
    //     }
    //   }
    // },

    updateAttribute: (name: string, value: string) => {
      if (state.selectedElement) {
        try {
          // First, try to update via trait (this handles component-specific attributes)
          const trait = state.selectedElement.getTrait(name);
          if (trait) {
            trait.setValue(value);
          }

          // Then update the actual HTML attribute
          if (value === "") {
            // If value is empty, remove the attribute
            state.selectedElement.removeAttributes(name);
          } else {
            // Otherwise, add/update the attribute
            state.selectedElement.addAttributes({ [name]: value });
          }

          // For specific attributes that need special handling
          if (name === "href" || name === "src") {
            // Force a view update for links and images
            const view = state.selectedElement.view;
            if (view) {
              view.render();
            }
          }

          // Refresh the editor to ensure changes are visible
          if (editorRef.current) {
            editorRef.current.refresh();
          }
        } catch (error) {
          console.error(`Error updating attribute ${name}:`, error);
        }
      }
    },

    selectComponent: (componentId: string) => {
      if (editorRef.current) {
        const component = editorRef.current.Components.getById(componentId);
        console.log("component---", component);
        if (component) {
          editorRef.current.select(component);
        }
      }
    },

    updateInteractivity: (
      type: string,
      event: string,
      action: string,
      target?: string,
      options?: any,
    ) => {
      handleInteractivityChange(
        state.selectedElement,
        {
          type,
          event,
          action,
          target,
          options,
        },
        editorRef.current,
      );
    },

    refreshLayers: () => {
      if (editorRef.current) {
        updateLayers(editorRef.current);
      }
    },
  };

  return {
    state,
    actions,
    isAiChatOpen,
    setIsAiChatOpen,
    selectedComponentForAi,
    editForm,
    isCommentsOpen,
    setIsCommentsOpen,
  };
}
