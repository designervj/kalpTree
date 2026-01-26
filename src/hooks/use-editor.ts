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
import { createCanvasStyleString, extractFontLinks } from "@/utils/extract-css-variables";



// Improved type definition for GrapesJS editor
interface GrapesJSEditor {
  getHtml: () => string;
  getCss: () => string | undefined;
  getJs?: () => string;
  setJs?: (js: string) => void;
  setComponents: (components: string | object) => any;
  addComponents: (components: string | object) => any;
  setStyle: (style: string | object) => any;
  UndoManager: {
    undo: () => void;
    redo: () => void;
  };
  select: (component: any) => void;
  getSelected: () => any;
  refresh: () => void;
  setDevice: (device: string) => void;
  getDevice: () => string;
  Components: {
    getComponents: () => any[];
    getById: (id: string) => any;
    getWrapper: () => any;
  };
  BlockManager: {
    getAll: () => any;
  };
  DeviceManager: {
    getAll: () => any;
    get: (id: string) => any;
    add: (device: any) => void;
    remove: (id: string) => void;
  };
  Modal: {
    open: (options: any) => void;
    close: () => void;
  };
  StorageManager: {
    store: (data: Record<string, any>) => void;
    get: (key: string) => any;
  };
  Canvas: {
    getDocument: () => Document | null;
  };
  on: (event: string, callback: Function) => void;
  destroy: () => void;
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
    blocks: [],
    layers: [],
    editorJs: "", // Add JavaScript content to state
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


  const dispatch = useDispatch<AppDispatch>()
  const { page, type } = useSelector((state: RootState) => state.pageEdit)
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [selectedComponentForAi, setSelectedComponentForAi] = useState<any>(null);
  useEffect(() => {
    const initEditor = async () => {
      try {
        // Dynamically import GrapesJS
        const grapesjs = await import("grapesjs");
        const gjsPresetWebpage = await import("grapesjs-preset-webpage");
        const gjsBlocksBasic = await import("grapesjs-blocks-basic");
        const gjsScriptEditor = await import("grapesjs-script-editor");

        // Wait for the container element to be available
        let containerEl = document.getElementById(containerId);

        // If container doesn't exist yet, wait a bit and try again
        if (!containerEl) {
          console.log(
            `Container element with id "${containerId}" not found, waiting...`
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
          containerEl = document.getElementById(containerId);
        }

        if (!containerEl) {
          console.error(
            `Container element with id "${containerId}" not found after waiting`
          );
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }
        const config = {
          ...createEditorConfig(containerEl, {}),
          plugins: [
            gjsPresetWebpage.default,
            gjsBlocksBasic.default,
            gjsScriptEditor.default,
          ],
          pluginsOpts: {
            [String(gjsPresetWebpage.default)]: {
              blocksBasicOpts: {
                blocks: [],
                flexGrid: true,
              },
              exportOpts: {},
              aviaryOpts: false,
              filestackOpts: false,
            },
            [String(gjsBlocksBasic.default)]: {
              blocks: [], // Empty array to not include any blocks from the plugin
            },
            [String(gjsScriptEditor.default)]: {
              // Script editor options if needed
            },
          },
        } as any;

        const editor = grapesjs.default.init(config);
        editorRef.current = editor as any;

        // Function to inject CSS variables dynamically from page content
        const injectCanvasStyles = (pageContent?: string) => {
          const canvas = editor.Canvas;
          const canvasDoc = canvas.getDocument();
          const canvasHead = canvasDoc?.head;

          if (!canvasHead) return;

          // Remove existing custom styles if any
          const existingStyle = canvasDoc.querySelector('[data-custom-root-vars="true"]');
          if (existingStyle) {
            existingStyle.remove();
          }

          // Remove existing font links
          const existingFonts = canvasDoc.querySelectorAll('link[data-custom-fonts="true"]');
          existingFonts.forEach(link => link.remove());

          // Extract and inject styles from page content
          const styleContent = pageContent ? createCanvasStyleString(pageContent) : '';

          if (styleContent) {
            const styleEl = canvasDoc.createElement('style');
            styleEl.setAttribute('data-custom-root-vars', 'true');
            styleEl.innerHTML = styleContent;
            canvasHead.appendChild(styleEl);
            console.log('✅ CSS variables dynamically injected from page content');
          }

          // Extract and inject font links
          if (pageContent) {
            const fontUrls = extractFontLinks(pageContent);
            fontUrls.forEach(fontUrl => {
              const fontLink = canvasDoc.createElement('link');
              fontLink.rel = 'stylesheet';
              fontLink.href = fontUrl;
              fontLink.setAttribute('data-custom-fonts', 'true');
              canvasHead.appendChild(fontLink);
            });

            if (fontUrls.length > 0) {
              console.log(`✅ ${fontUrls.length} font link(s) injected into canvas`);
            }
          }
        };

        // Inject styles on editor load
        editor.on('load', () => {
          // Use page content if available
          injectCanvasStyles(page?.content);
        });

        // Add fallback methods if needed
        if (typeof (editor as any).setJs !== "function") {

          (editor as any).setJs = (js: string) => {
            // Store JS in editor's storage
            editor.StorageManager.store({
              jsCode: js
            });

            // Find or create script component
            let scriptComponent = editor.Components.getWrapper()?.find(
              'script[data-gjs-type="custom-script"]'
            )[0];

            if (!scriptComponent) {
              // Create a new script component if it doesn't exist
              const addedComponents = editor.Components.addComponent({
                tagName: "script",
                attributes: { "data-gjs-type": "custom-script" },
                content: js,
                removable: false,
                draggable: false,
                droppable: false,
                copyable: false,
                // Hide from the structure panel
                layerable: false,
              });
              scriptComponent = Array.isArray(addedComponents)
                ? addedComponents[0]
                : addedComponents;
            } else {
              // Update existing script
              scriptComponent.set("content", js);
            }
          };
        }

        const domc = editor.DomComponents;
        const bm = editor.BlockManager;

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
                updateFromTraits
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
          `
                  )
                  .join("")}
        </div>
      `;
            },

            async updateProducts(category: string) {
              const productsContainer = this.el.querySelector(
                ".products-container"
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
                  background: ${cat === this.activeCategory ? "#007bff" : "transparent"
                      };
                  color: ${cat === this.activeCategory ? "white" : "#333"};
                  border: none;
                  border-bottom: 3px solid ${cat === this.activeCategory ? "#007bff" : "transparent"
                      };
                  cursor: pointer;
                  font-size: 14px;
                  text-transform: capitalize;
                  transition: all 0.3s;
                "
              >
                ${cat}
              </button>
            `
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

        if (typeof editor.getJs !== "function") {
          console.log("Adding custom getJs method");
          editor.getJs = () => {
            // Try to get from storage first
            const stored = editor.StorageManager.get("jsCode");
            if (typeof stored === "string") return stored;

            // Otherwise try to find script component
            const scriptComponent = editor.Components.getWrapper()?.find(
              'script[data-gjs-type="custom-script"]'
            )[0];
            const content = scriptComponent ? scriptComponent.get("content") : "";
            return typeof content === "string" ? content : "";
          };
        }

        // Set up event listeners
        setupEventListeners(editor as unknown as GrapesJSEditor);

        // Update state
        setState((prev) => ({
          ...prev,
          editor,
          isLoading: false,
        }));

        return () => {
          editor.destroy();
        };
      } catch (error) {
        console.error("Error initializing GrapesJS:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initEditor();
  }, [containerId]);

  const setupEventListeners = (editor: GrapesJSEditor) => {
    // Component selection
    editor.on("component:selected", (component: any) => {
      // Validate component exists before processing
      if (!component) {
        console.warn('component:selected fired with no component');
        return;
      }

      setState((prev) => ({
        ...prev,
        selectedElement: component,
      }));
      updateStylesFromComponent(component);

      // Initialize interactions if not already present
      try {
        if (component.get && typeof component.get === 'function' && !component.get("interactions")) {
          if (component.set && typeof component.set === 'function') {
            component.set("interactions", []);
          }
        }
      } catch (error) {
        console.error('Error initializing interactions:', error);
      }

      // Add custom toolbar button only if it doesn't already exist
      const defaultToolbar = component.get('toolbar');
      const hasAiChatButton = defaultToolbar.some((btn: any) =>
        btn.attributes?.title === 'AI Chat'
      );

      if (!hasAiChatButton) {
        const customToolbar = [
          ...defaultToolbar,
          {
            attributes: { title: 'AI Chat' },
            label: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="9" cy="10" r="1"></circle>
              <circle cx="15" cy="10" r="1"></circle>
              <path d="M9 14s1 1 3 1 3-1 3-1"></path>
            </svg>`,
            command: (editor: any) => {
              console.log('AI Chat button clicked!', component);

              // Get component HTML
              const componentHtml = component.toHTML();
              // console.log('Component HTML:', componentHtml);

              // Store component with its HTML and CSS
              setSelectedComponentForAi({
                component,
                html: componentHtml,
                css: editorRef?.current?.getCss?.() || "",
                type: component.get('type'),
                tagName: component.get('tagName')
              });
              setIsAiChatOpen(true);
            },
          },
        ];
        component.set('toolbar', customToolbar);
      }
    });

    // Commented out to prevent excessive state updates
    // editor.on("component:update", (component: any) => {
    //   if (
    //     state.selectedElement &&
    //     component &&
    //     component.cid === state.selectedElement.cid
    //   ) {
    //     // Update styles when the currently selected component is updated
    //     updateStylesFromComponent(component);
    //   }
    // });

    editor.on("component:deselected", () => {
      setState((prev) => ({
        ...prev,
        selectedElement: null,
      }));
    });

    // Device change
    editor.on("change:device", () => {
      try {
        if (editor && typeof editor.getDevice === 'function') {
          setState((prev) => ({
            ...prev,
            currentDevice: editor.getDevice(),
          }));
        }
      } catch (error) {
        console.error('Error handling device change:', error);
      }
    });

    // Script-related events
    editor.on("script:update", () => {
      try {
        if (editor && editor.getJs && typeof editor.getJs === 'function') {
          const js = editor.getJs();
          setState((prev) => ({
            ...prev,
            editorJs: js,
          }));
        }
      } catch (error) {
        console.error('Error handling script update:', error);
      }
    });

    editor.on("script:add", () => {
      try {
        if (editor && editor.getJs && typeof editor.getJs === 'function') {
          const js = editor.getJs();
          setState((prev) => ({
            ...prev,
            editorJs: js,
          }));
        }
      } catch (error) {
        console.error('Error handling script add:', error);
      }
    });

    editor.on("script:remove", () => {
      setState((prev) => ({
        ...prev,
        editorJs: "",
      }));
    });

    // Load event
    editor.on("load", () => {
      try {
        // Validate editor state
        if (!editor || !editor.BlockManager) {
          console.warn('Editor or BlockManager not available on load event');
          return;
        }

        // Get blocks
        const blockManager = editor.BlockManager;
        if (!blockManager.getAll || typeof blockManager.getAll !== 'function') {
          console.warn('getAll method not available on BlockManager');
          return;
        }

        const allBlocks = blockManager.getAll();
        if (!allBlocks || !allBlocks.models) {
          console.warn('Block models not available');
          return;
        }

        const blockList = allBlocks.models.map((block: any) => {
          // Extract category properly
          let category = "Basic";
          try {
            const blockCategory = block.attributes.category;
            if (typeof blockCategory === "string") {
              category = blockCategory;
            } else if (blockCategory && typeof blockCategory === "object") {
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

        setState((prev) => ({
          ...prev,
          blocks: blockList,
          editorJs: initialJs,
        }));

        updateLayers(editor);
      } catch (error) {
        console.error("Error in load event:", error);
      }
    });

    // Component changes - commented out component:update to prevent excessive updates
    // editor.on("component:update", () => updateLayers(editor));
    editor.on("component:add", () => updateLayers(editor));
    editor.on("component:remove", () => updateLayers(editor));
  };

  const updateLayers = (editor: GrapesJSEditor) => {
    if (!editor || !editor.Components) {
      return;
    }

    try {
      // Add additional check for getComponents method
      if (typeof editor.Components.getComponents !== 'function') {
        console.warn('getComponents method not available on editor.Components');
        return;
      }

      const components = editor.Components.getComponents();

      // Verify components is valid before mapping
      if (!components) {
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
      console.error("Error updating layers:", error);
      setState((prev) => ({
        ...prev,
        layers: [],
      }));
    }
  };

  const mapComponentsToLayers = (
    components: any[] | undefined,
    level = 0
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
        if (component.components && typeof component.components === "function") {
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
            (part: string) => part.trim() !== ""
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

    savePage: async () => {

      if (!page?._id) {
        toast.error("No page ID found. Cannot save.");
        return;
      }
      if (!editorRef.current) {
        toast.error("Editor not initialized.");
        return;
      }

      // Safely get HTML and CSS with error handling
      let html = "";
      let css = "";

      try {
        html = editorRef.current.getHtml();
      } catch (error) {
        console.error("Error getting HTML:", error);
        toast.error("Failed to get page HTML.");
        return;
      }

      try {
        if (typeof editorRef.current.getCss === 'function') {
          css = editorRef.current.getCss() || "";
        }
      } catch (error) {
        console.warn("Error getting CSS:", error);
      }

      // Option A: store CSS inline with HTML
      const fullHtml = `
    <style>
      ${css}
    </style>
    ${html}
  `;
      // console.log("Saving page", page._id, html);
      if (type === "footer") {
        const response = await dispatch(updateFooter({
          ...page,
          _id: page._id?.toString() ?? "",
          tenantId: page.tenantId ?? "",
          content: fullHtml
        })).unwrap();
        if (response) {
          toast.success("Footer content updated successfully!");
        }
      } else if (type === "header") {


        console.log("header", {
          ...page,
          _id: page._id?.toString() ?? "",
          tenantId: page.tenantId ?? "",
          content: fullHtml
        })
        const response = await dispatch(updateHeader({
          ...page,
          _id: page._id?.toString() ?? "",
          tenantId: page.tenantId ?? "",
          content: fullHtml
        })).unwrap();
        if (response) {
          toast.success("Header content updated successfully!");
        }
      }
      else {
        const response = await dispatch(savePageThunk({
          id: page._id ?? "",
          tenantId: page.tenantId ?? "",
          content: fullHtml
        })).unwrap();
        // console.log("console.log", response)
        if (response.ok) {
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
          if (typeof editorRef.current.getCss === 'function') {
            css = editorRef.current.getCss() || "";
          }
        } catch (error) {
          console.warn('Error getting CSS:', error);
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

            // Setup scroll event listeners
            const scrollElements = document.querySelectorAll('[data-scroll-action]');
            if (scrollElements.length > 0) {
              window.addEventListener('scroll', function() {
                scrollElements.forEach(function(el) {
                  const rect = el.getBoundingClientRect();
                  const offset = parseFloat(el.getAttribute('data-scroll-offset') || '0');
                  const isVisible = rect.top + offset <= window.innerHeight && rect.bottom >= 0;

                  if (isVisible && !el.classList.contains('scroll-triggered')) {
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
              }, { passive: true });
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

      try {
        // Enhanced handling for different content types
        if (typeof content === "string") {
          // For HTML strings - this is the most common case for blocks
          // Simply add the HTML string directly to the editor
          editorRef.current.addComponents(content);
        }
        // Handle object content (like for image components)
        else if (typeof content === "object") {
          // If content has a specific GrapesJS component type
          if (content.type) {
            editorRef.current.addComponents({
              type: content.type,
              ...content,
            });
          }
          // Try to convert object to component
          else {
            editorRef.current.addComponents(content);
          }
        }
        // Fallback for any other type
        else {
          console.warn("Unrecognized content format", content);
          editorRef.current.addComponents(
            `<div>Error: Invalid content format</div>`
          );
        }
      } catch (error) {
        console.error("Error adding component:", error);
        // Try with a safer fallback
        try {
          editorRef.current.addComponents(
            "<div>Component could not be added</div>"
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
        if (property.startsWith('--')) {
          // Handle global CSS variables
          if (editorRef.current) {
            const canvas = editorRef.current.Canvas;
            const canvasDoc = canvas.getDocument();
            const canvasHead = canvasDoc?.head;

            if (canvasHead) {
              // Find or create the global styles element
              let globalStyleEl = canvasDoc.querySelector('[data-global-styles="true"]');

              if (!globalStyleEl) {
                globalStyleEl = canvasDoc.createElement('style');
                globalStyleEl.setAttribute('data-global-styles', 'true');
                canvasHead.appendChild(globalStyleEl);
              }

              // Get existing global styles
              const existingStyles = globalStyleEl.innerHTML;
              const rootMatch = existingStyles.match(/:root\s*{([^}]*)}/);

              let cssVars: Record<string, string> = {};

              if (rootMatch && rootMatch[1]) {
                // Parse existing CSS variables
                const declarations = rootMatch[1].split(';').filter((d: string) => d.trim());
                declarations.forEach((decl: string) => {
                  const [prop, val] = decl.split(':').map((s: string) => s.trim());
                  if (prop && val) {
                    cssVars[prop] = val;
                  }
                });
              }

              // Update or add the new variable
              cssVars[property] = value;

              // Rebuild the :root rule with CSS variables
              const cssVarString = Object.entries(cssVars)
                .map(([prop, val]) => `  ${prop}: ${val};`)
                .join('\n');

              // Include body and universal selector reset styles
              globalStyleEl.innerHTML = `:root {
${cssVarString}
}

body {
  font-family: var(--font-family);
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}`;

              console.log(`✅ Global CSS variable ${property} set to ${value}`);
            }
          }
          return; // Exit early for global variables
        }

        // Handle regular component styles
        if (state.selectedElement) {
          // Get existing styles and merge with the new property
          const currentStyles = state.selectedElement.getStyle() || {};
          const updatedStyles = { ...currentStyles, [property]: value };

          // Apply the merged styles to the element
          state.selectedElement.setStyle(updatedStyles);

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
              console.log("Font Size", value)
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
            else if (property === "padding") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  spacing: {
                    ...prev.styles.spacing,
                    padding: value,
                  },
                },
              };
            } else if (property === "margin") {
              return {
                ...prev,
                styles: {
                  ...prev.styles,
                  spacing: {
                    ...prev.styles.spacing,
                    margin: value,
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
            console.log("editorRef.current", editorRef.current)
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
        console.log("component---", component)
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
      options?: any
    ) => {
      if (state.selectedElement) {
        // Get current interactions or initialize empty array
        const interactions = state.selectedElement.get("interactions") || [];

        // Generate JavaScript code for the interaction
        let jsCode = "";

        // Target element (this element if no target specified)
        const targetSelector = target || "this";

        // Generate different code based on action type
        switch (action) {
          case "toggle-class":
            jsCode = `document.querySelector('${targetSelector}').classList.toggle('${options?.class || "active"
              }');`;
            break;
          case "add-class":
            jsCode = `document.querySelector('${targetSelector}').classList.add('${options?.class || "active"
              }');`;
            break;
          case "remove-class":
            jsCode = `document.querySelector('${targetSelector}').classList.remove('${options?.class || "active"
              }');`;
            break;
          case "show":
            if (options?.animation === "none") {
              jsCode = `document.querySelector('${targetSelector}').style.display = 'block';`;
            } else {
              jsCode = `
            const el = document.querySelector('${targetSelector}');
            el.style.transition = 'all ${options?.duration || 300}ms ${options?.easing || "ease"
                }';
            el.style.display = 'block';
            setTimeout(() => {
              el.style.opacity = '1';
              ${options?.animation === "scale"
                  ? "el.style.transform = 'scale(1)';"
                  : ""
                }
            }, 10);
          `;
            }
            break;
          case "hide":
            if (options?.animation === "none") {
              jsCode = `document.querySelector('${targetSelector}').style.display = 'none';`;
            } else {
              jsCode = `
            const el = document.querySelector('${targetSelector}');
            el.style.transition = 'all ${options?.duration || 300}ms ${options?.easing || "ease"
                }';
            el.style.opacity = '0';
            ${options?.animation === "scale"
                  ? "el.style.transform = 'scale(0.8)';"
                  : ""
                }
            setTimeout(() => { el.style.display = 'none'; }, ${options?.duration || 300
                });
          `;
            }
            break;
          case "toggle":
            jsCode = `
          const el = document.querySelector('${targetSelector}');
          if (el.style.display === 'none' || getComputedStyle(el).display === 'none') {
            ${options?.animation === "none"
                ? "el.style.display = 'block';"
                : `
              el.style.transition = 'all ${options?.duration || 300}ms ${options?.easing || "ease"
                }';
              el.style.display = 'block';
              setTimeout(() => {
                el.style.opacity = '1';
                ${options?.animation === "scale"
                  ? "el.style.transform = 'scale(1)';"
                  : ""
                }
              }, 10);
              `
              }
          } else {
            ${options?.animation === "none"
                ? "el.style.display = 'none';"
                : `
              el.style.transition = 'all ${options?.duration || 300}ms ${options?.easing || "ease"
                }';
              el.style.opacity = '0';
              ${options?.animation === "scale"
                  ? "el.style.transform = 'scale(0.8)';"
                  : ""
                }
              setTimeout(() => { el.style.display = 'none'; }, ${options?.duration || 300
                });
              `
              }
          }
        `;
            break;
          case "scroll-to":
            jsCode = `
          const targetEl = document.querySelector('${targetSelector}');
          if (targetEl) {
            const yOffset = ${options?.offset || 0};
            const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
          }
        `;
            break;
          case "redirect":
            jsCode = options?.newTab
              ? `window.open('${options?.url || "#"}', '_blank');`
              : `window.location.href = '${options?.url || "#"}';`;
            break;
        }

        // Add event listener based on the event type
        if (type === "add") {
          // Add the event listener to the element
          const eventHandler = `function(event) { ${jsCode} }`;

          // Store the event handler in the element's attributes
          const eventAttr = `on${event}`;
          state.selectedElement.addAttributes({ [eventAttr]: eventHandler });

          // For hover, we need to handle mouseenter/mouseleave
          if (event === "hover") {
            const mouseEnterHandler = `function(event) { ${jsCode} }`;
            const mouseLeaveHandler = `function(event) {
              // Reverse the action for mouseleave if needed
              ${action === "add-class"
                ? `document.querySelector('${targetSelector}').classList.remove('${options?.class || "active"
                }');`
                : action === "show"
                  ? `document.querySelector('${targetSelector}').style.display = 'none';`
                  : ""
              }
            }`;

            state.selectedElement.addAttributes({
              onmouseenter: mouseEnterHandler,
              onmouseleave: mouseLeaveHandler,
            });
          }
        } else if (type === "remove") {
          // Remove the event listener from the element
          const eventAttr = `on${event}`;
          state.selectedElement.removeAttributes(eventAttr);

          // For hover, remove both mouseenter and mouseleave
          if (event === "hover") {
            state.selectedElement.removeAttributes("onmouseenter");
            state.selectedElement.removeAttributes("onmouseleave");
          }
        }

        // Update the editor to reflect changes
        if (editorRef.current) {
          editorRef.current.refresh();
        }
      }
    },
  };


  return {
    state,
    actions,
    isAiChatOpen,
    setIsAiChatOpen,
    selectedComponentForAi,
  };
}
