import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Copy,
  Trash,
  Folder,
  Layout,
  Columns,
  Type,
  Heading,
  MousePointer2,
  BoxSelect,
  Rows,
  Image as ImageIcon,
  Square,
  Search,
  Filter,
} from "lucide-react";
import { type Editor } from "grapesjs";

interface LayerItemProps {
  component: any;
  level: number;
  selectedId: string | null;
  onSelect: (component: any) => void;
  onToggleVisibility: (component: any, e: React.MouseEvent) => void;
  onExpand: (component: any) => void;
  expandedIds: Set<string>;
  onHover: (component: any) => void;
  onHoverOut: (component: any) => void;
  onDragStart: (component: any, e: React.DragEvent) => void;
  onDragOver: (component: any, e: React.DragEvent) => void;
  onDrop: (component: any, e: React.DragEvent) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  component,
  level,
  selectedId,
  onSelect,
  onToggleVisibility,
  onExpand,
  expandedIds,
  onHover,
  onHoverOut,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get component properties
  const id = component.getId();
  const tagName = component.get("tagName");
  const name = component.getName() || tagName;
  const components = component.components();
  const hasChildren = components && components.length > 0;
  const isExpanded = expandedIds.has(id);
  const isSelected = selectedId === id;

  // Some layer filtering similar to GrapesJS native one
  // Check if available in layer manager
  const layerable = component.get("layerable");
  const style = component.getStyle();
  const isVisible = style.display !== "none";

  if (!layerable) return null;

  const TAG_STYLES: Record<string, { icon: any; color: string }> = {
    // Layout
    section: { icon: BoxSelect, color: "#326bff" },
    container: { icon: BoxSelect, color: "#326bff" },

    row: { icon: Rows, color: "#16a34a" },
    column: { icon: Columns, color: "#9ca3af" },
    col: { icon: Columns, color: "#9ca3af" },

    // Text
    text: { icon: Type, color: "#22c55e" },
    "text-node": { icon: Type, color: "#22c55e" },

    // Headings
    header: { icon: Heading, color: "#1f2937" },
    footer: { icon: Heading, color: "#1f2937" },

    h1: { icon: Heading, color: "#374151" },
    h2: { icon: Heading, color: "#374151" },
    h3: { icon: Heading, color: "#374151" },
    h4: { icon: Heading, color: "#4b5563" },
    h5: { icon: Heading, color: "#4b5563" },
    h6: { icon: Heading, color: "#4b5563" },

    // Elements
    button: { icon: MousePointer2, color: "#0ea5e9" },
    image: { icon: ImageIcon, color: "#6366f1" },
    img: { icon: ImageIcon, color: "#6366f1" },

    // Structural
    div: { icon: Square, color: "#f97316" },
    nav: { icon: Square, color: "#8b5cf6" },

    // Fallback
    default: { icon: Layout, color: "#000" },
  };

  const HIDDEN_TAGS = ["head", "meta", "title", "link", "style", "script"];
  if (HIDDEN_TAGS.includes(tagName)) return null;

  if (HIDDEN_TAGS.includes(tagName)) return null;

  const config = TAG_STYLES[tagName.toLowerCase()] || TAG_STYLES.default;
  const Icon = config.icon;

  return (
    <div
      className="layer-item-container"
      id={`layer-item-${id}`}
      draggable
      onDragStart={(e) => onDragStart(component, e)}
      onDragOver={(e) => onDragOver(component, e)}
      onDrop={(e) => onDrop(component, e)}
    >
      <div
        className={`layer-row ${isSelected ? "selected" : ""} ${
          isHovered ? "hovered" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(component)}
        onMouseEnter={() => {
          setIsHovered(true);
          onHover(component);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onHoverOut(component);
        }}
      >
        <div className="layer-controls-left">
          <button
            className={`expand-btn ${!hasChildren ? "invisible" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onExpand(component);
            }}
          >
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              ))}
          </button>
        </div>

        <div className="layer-label">
          <span className="element-icon" style={{ color: config.color }}>
            <Icon size={14} className="mr-2" />
          </span>
          <span className="element-name truncate" style={{ color: config.color }}>
            {name === tagName
              ? tagName.charAt(0).toUpperCase() + tagName.slice(1)
              : name}
          </span>
        </div>

        <div className="layer-controls-right">
          <button
            className={`visibility-btn ${!isVisible ? "is-hidden" : ""} ${
              isHovered || !isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={(e) => onToggleVisibility(component, e)}
          >
            {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="layer-children">
          {components.map((child: any) => (
            <LayerItem
              key={child.getId()}
              component={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onExpand={onExpand}
              expandedIds={expandedIds}
              onHover={onHover}
              onHoverOut={onHoverOut}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .layer-item-container {
          display: flex;
          flex-direction: column;
        }

        /* --- MATCH IMAGE (LIGHT LIST + BLUE SELECT) --- */
        .layer-row {
          display: flex;
          align-items: center;
          height: 40px;
          cursor: pointer;
          font-size: 15px;
          border-left: 3px solid transparent;
          transition: background 0.12s ease;
          padding-right: 8px;
          user-select: none;
          background: transparent;
          border:1px solid #f2f2f2;
        }

        .layer-row:hover {
          background-color: #f4f7ff;
        }

        .layer-row.selected {
          background-color: #eaf0ff; /* rgb(234,240,255) */
          border-left-color: #326bff; /* rgb(50,107,255) */
        }

        .expand-btn,
        .visibility-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 2px;
          cursor: pointer;
          color: #9aa6bf;
          opacity: 0.9;
        }

        .expand-btn:hover,
        .visibility-btn:hover {
          color: #222c39;
          opacity: 1;
        }

        .layer-controls-left {
          width: 20px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .layer-label {
          display: flex;
          align-items: center;
          flex: 1;
          overflow: hidden;
          margin-left: 2px;
        }

        .element-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
          letter-spacing: 0.1px;
        }

        /* tighten icon spacing to match screenshot */
        .element-icon :global(svg) {
          margin-right: 8px !important;
        }

        .layer-controls-right {
          display: flex;
          align-items: center;
          margin-left: auto;
        }

        .invisible {
          visibility: hidden;
        }

        .is-hidden {
          color: #9aa6bf;
        }
      `}</style>
    </div>
  );
};

import { useEditorContext } from "../../EditorContext";
import { IoIosCloseCircleOutline } from "react-icons/io";

const PageLayer = () => {
  const { state } = useEditorContext();
  const editor = state.editor as Editor | null;

  const [rootComponent, setRootComponent] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render on events

  // UI-only (matches image: Search Layout bar + dropdown)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const searchItems = useMemo(
    () => [
      "Sections",
      "Rows",
      "Groups",
      "Columns",
      "Modules",
      "Global Layouts",
      "Accordions",
      "Audios",
      "Bar Counters",
      "Blogs",
      "Blurbs",
      "Buttons",
      "Codes",
    ],
    []
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (!t.closest(".layer-search-wrap")) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [searchOpen]);

  // Force update wrapper
  const forceUpdate = useCallback(() => {
    setUpdateTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!editor) return;

    // Initial setup
    const wrapper = editor.Components.getWrapper();
    setRootComponent(wrapper);
    if (wrapper) {
      setExpandedIds(new Set([wrapper.getId()]));
    }

    const selected = editor.getSelected();
    if (selected) setSelectedId(selected.getId());

    // Event listeners
    const onComponentSelected = (component: any) => {
      if (component) {
        setSelectedId(component.getId());

        // Auto-expand parents
        let parent = component.parent();
        if (parent) {
          setExpandedIds((prev) => {
            const next = new Set(prev);
            if (wrapper) {
              while (parent && parent !== wrapper) {
                next.add(parent.getId());
                parent = parent.parent();
              }
              next.add(wrapper.getId()); // ensure root is expanded
            }
            return next;
          });
        }

        // Scroll sidebar layer item into view
        setTimeout(() => {
          const el = document.getElementById(`layer-item-${component.getId()}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      } else {
        setSelectedId(null);
      }
    };

    const updateLayers = () => {
      forceUpdate();
    };

    editor.on("component:selected", onComponentSelected);
    editor.on("component:add", updateLayers);
    editor.on("component:remove", updateLayers);
    editor.on("component:update", updateLayers);
    editor.on("layer:root", updateLayers);
    editor.on("layer:component", updateLayers);

    return () => {
      editor.off("component:selected", onComponentSelected);
      editor.off("component:add", updateLayers);
      editor.off("component:remove", updateLayers);
      editor.off("component:update", updateLayers);
      editor.off("layer:root", updateLayers);
      editor.off("layer:component", updateLayers);
    };
  }, [editor, forceUpdate]);

  const handleSelect = (component: any) => {
    if (!editor) return;
    editor.select(component);

    // Scroll canvas to component
    const el = component.getEl();
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  };

  const handleToggleVisibility = (component: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor) return;

    // Toggle GrapesJS style display
    const style = component.getStyle();
    const isHidden = style.display === "none";

    if (isHidden) {
      const newStyle = { ...style };
      delete newStyle.display;
      if (Object.keys(newStyle).length < Object.keys(style).length) {
        component.setStyle(newStyle);
      } else {
        component.addStyle({ display: "block" });
      }
    } else {
      component.addStyle({ display: "none" });
    }
    forceUpdate();
  };

  const handleExpand = (component: any) => {
    const id = component.getId();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleHover = (component: any) => {
    if (!component) return;
    const el = component.getEl();
    if (el) {
      el.style.outline = "2px solid #326bff";
      el.style.outlineOffset = "-2px";
    }
  };
  const handleHoverOut = (component: any) => {
    if (!component) return;
    const el = component.getEl();
    if (el) {
      el.style.outline = "";
      el.style.outlineOffset = "";
    }
  };
  const handleDragStart = (component: any, e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData("component-id", component.getId());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (component: any, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (targetComponent: any, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId = e.dataTransfer.getData("component-id");
    if (!sourceId || !editor) return;

    const sourceComponent = editor.Components.getById(sourceId);
    if (!sourceComponent || sourceComponent === targetComponent) return;

    // Check if we are trying to drop a parent into a child (cycle)
    let parent = targetComponent.parent();
    while (parent) {
      if (parent === sourceComponent) return;
      parent = parent.parent();
    }

    try {
      const parent = targetComponent.parent();
      if (parent) {
        const index = targetComponent.index();
        parent.append(sourceComponent, { at: index });
        forceUpdate();
      }
    } catch (error) {
      console.error("Drop error:", error);
    }
  };

  const handleCloseAll = () => {
    if (!rootComponent) return;
    setExpandedIds(new Set([rootComponent.getId()])); // keep root open, close everything else
  };

  if (!editor || !rootComponent) {
    return <div className="p-4 text-center text-gray-500 text-xs">Loading layers...</div>;
  }

  console.log("root component", rootComponent);

  const filteredSearchItems = searchItems.filter((x) =>
    x.toLowerCase().includes((searchValue || "").toLowerCase())
  );

  return (
    <div className="page-layer h-full overflow-y-auto overflow-x-hidden select-none">
      {/* Header: "Search Layout" row (matches screenshot) */}
      {/* <div className="layer-topbar">
        <div className="layer-search-wrap">
          <button
            type="button"
            className="layer-search-trigger"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search size={16} className="layer-top-icon" />
            <span className="layer-top-title">Search Layout</span>
          </button>

          <button
            type="button"
            className="layer-filter-btn"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Filter"
          >
            <Filter size={16} />
          </button>

      
          {searchOpen && (
            <div className="layer-search-popover">
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Start Typing"
                className="layer-search-input"
                autoFocus
              />

              <div className="layer-search-list">
                {filteredSearchItems.map((item) => (
                  <div key={item} className="layer-search-item">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div> */}

      {/* Close All row */}
      <div className="layer-actions">
        <button type="button" className=" text-[14px] flex items-center justify-end w-full pe-4 text-primary gap-1 cursor-pointer font-medium" onClick={handleCloseAll}>
         Close All
        </button>
          {/* <IoIosCloseCircleOutline className="w-4 h-4"/> */}
      </div>

      {/* Tree */}
      <LayerItem
        component={rootComponent}
        level={0}
        selectedId={selectedId}
        onSelect={handleSelect}
        onToggleVisibility={handleToggleVisibility}
        onExpand={handleExpand}
        expandedIds={expandedIds}
        onHover={handleHover}
        onHoverOut={handleHoverOut}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      <style jsx>{`
        .page-layer {
          background: #ffffff;
          color: #222c39;
        }

        /* --- Top header row (Search Layout) --- */
        .layer-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: #ffffff;
          border-bottom: 1px solid #d2d7e4; /* screenshot divider */
        }

        .layer-search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 54px;
          padding: 0 12px;
        }

        .layer-search-trigger {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }

        .layer-top-icon {
          color: #5f6f97; /* screenshot text/icon tone */
        }

        .layer-top-title {
          font-size: 16px;
          font-weight: 600;
          color: #5f6f97;
          letter-spacing: 0.1px;
        }

        .layer-filter-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 0;
          padding: 6px;
          cursor: pointer;
          color: #222c39;
          border-radius: 6px;
        }
        .layer-filter-btn:hover {
          background: #f4f7ff;
        }

        /* --- Dark dropdown panel (Start Typing + list) --- */
        .layer-search-popover {
          position: absolute;
          left: 10px;
          right: 10px;
          top: 58px;
          background: #222c39; /* rgb(34,44,57) */
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .layer-search-input {
          width: calc(100% - 24px);
          margin: 12px;
          height: 44px;
          border-radius: 4px;
          background: transparent;
          color: #eaf0ff;
          border: 1px solid #326bff; /* blue outline like screenshot */
          padding: 0 12px;
          font-size: 16px;
          outline: none;
        }
        .layer-search-input::placeholder {
          color: rgba(234, 240, 255, 0.55);
        }

        .layer-search-list {
          max-height: 520px;
          overflow: auto;
          padding: 4px 0 10px 0;
        }

        .layer-search-item {
          padding: 14px 16px;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.1;
        }
        .layer-search-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        /* --- Close All row --- */
        .layer-actions {
          padding: 2px 5px 7px 12px;
          border-bottom: 1px solid #d2d7e4;
          background: #ffffff;
        }
        .close-all {
          background: transparent;
          border: 0;
          padding: 0;
          font-size: 18px;
          font-weight: 500;
          color: #222c39;
          cursor: pointer;
        }
        .close-all:hover {
          text-decoration: underline;
        }

        /* Scrollbar (light) */
        .page-layer::-webkit-scrollbar {
          width: 8px;
        }
        .page-layer::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .page-layer::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .page-layer::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default PageLayer;
