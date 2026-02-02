import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Eye, EyeOff, ChevronRight, ChevronDown, Plus, MoreHorizontal, Copy, Trash, Folder, Layout, Columns, Type, Heading, MousePointer2, BoxSelect, Rows, Image as ImageIcon, Square } from "lucide-react";
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
  const isVisible = style.display !== 'none';

  if (!layerable) return null;

  const TAG_STYLES: Record<string, { icon: any; color: string }> = {
    section: { icon: BoxSelect, color: "#3b82f6" }, // Blue
    container: { icon: BoxSelect, color: "#3b82f6" }, // Blue
    row: { icon: Rows, color: "#10b981" }, // Green
    column: { icon: Columns, color: "#9ca3af" }, // Gray
    col: { icon: Columns, color: "#6b0952ff" }, // Gray
    text: { icon: Type, color: "#2fe447ff" },
    "text-node": { icon: Type, color: "#17d51bff" },
    header: { icon: Heading, color: "#aa1044ff" },
    footer: { icon: Heading, color: "#aa1044ff" },
    h1: { icon: Heading, color: "#d1d5db" },
    h2: { icon: Heading, color: "#d1d5db" },
    h3: { icon: Heading, color: "#d1d5db" },
    h4: { icon: Heading, color: "#d1d5db" },
    h5: { icon: Heading, color: "#d1d5db" },
    h6: { icon: Heading, color: "#d1d5db" },
    button: { icon: MousePointer2, color: "#d1d5db" },
    image: { icon: ImageIcon, color: "#d1d5db" },
    img: { icon: ImageIcon, color: "#d1d5db" },
    div: { icon: Square, color: "#ef6610ff" },
    nav: { icon: Square, color: "#6212e3ff" },
    default: { icon: Layout, color: "#d1d5db" },
  };

  const HIDDEN_TAGS = ['head', 'meta', 'title', 'link', 'style', 'script'];
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
        className={`layer-row ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
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
            className={`expand-btn ${!hasChildren ? 'invisible' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onExpand(component);
            }}
          >
            {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
          </button>
        </div>

        <div className="layer-label">
          <span className="element-icon" style={{ color: config.color }}>
            <Icon size={12} className="mr-2" />
          </span>
          <span className="element-name truncate" style={{ color: config.color }}>
            {/* If component has a tailored name, show it, else Capitalized Tag */}
            {name === tagName ? tagName.charAt(0).toUpperCase() + tagName.slice(1) : name}
          </span>
        </div>

        <div className="layer-controls-right">
          <button
            className={`visibility-btn ${!isVisible ? 'is-hidden' : ''} ${isHovered || !isVisible ? 'opacity-100' : 'opacity-0'}`}
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
        .layer-row {
          display: flex;
          align-items: center;
          height: 32px;
          cursor: pointer;
          color: #bebebe;
          font-size: 13px;
          border-left: 2px solid transparent;
          transition: all 0.1s ease;
          padding-right: 8px;
        }
        .layer-row:hover {
          background-color: rgba(255, 255, 255, 0.04);
          color: white;
        }
        .layer-row.selected {
          background-color: rgba(60, 130, 246, 0.15);
          border-left-color: #3b82f6; // blue-500
          color: white;
        }
        .expand-btn, .visibility-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: inherit;
          padding: 2px;
          cursor: pointer;
          opacity: 0.7;
        }
        .expand-btn:hover, .visibility-btn:hover {
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
        }
        .layer-controls-right {
          display: flex;
          align-items: center;
          margin-left: auto;
        }
        .invisible { visibility: hidden; }
        .is-hidden { color: #888; }
      `}</style>
    </div>
  );
};

import { useEditorContext } from "../../EditorContext";

const PageLayer = () => {
  const { state } = useEditorContext();
  const editor = state.editor as Editor | null;

  const [rootComponent, setRootComponent] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render on events

  // Force update wrapper
  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
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
          setExpandedIds(prev => {
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
        // We use a small timeout to let the expansion render first
        setTimeout(() => {
          const el = document.getElementById(`layer-item-${component.getId()}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

      } else {
        setSelectedId(null);
      }
    };

    const updateLayers = () => {
      // Just triggering a re-render can be enough if we read from the component tree directly in render
      // But storing a reference to root/wrapper is usually stable
      forceUpdate();
    };

    editor.on("component:selected", onComponentSelected);
    editor.on("component:add", updateLayers);
    editor.on("component:remove", updateLayers);
    editor.on("component:update", updateLayers); // Catches style changes too (visibility)
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
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  const handleToggleVisibility = (component: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor) return;

    // Toggle GrapesJS style display
    const style = component.getStyle();
    const isHidden = style.display === 'none';

    if (isHidden) {
      // We might want to remove the check if we stored the previous display value
      // For now, removing 'none' usually reverts to default
      const newStyle = { ...style };
      delete newStyle.display;
      if (Object.keys(newStyle).length < Object.keys(style).length) {
        // If we actually removed it
        component.setStyle(newStyle);
      } else {
        // If it wasn't there or didn't delete, explicit set block or whatever
        component.addStyle({ display: 'block' });
      }
    } else {
      component.addStyle({ display: 'none' });
    }
    forceUpdate();
  };

  const handleExpand = (component: any) => {
    const id = component.getId();
    setExpandedIds(prev => {
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
      el.style.outline = "2px solid #3b82f6";
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

  if (!editor || !rootComponent) {
    // If waiting for editor, show loading or empty
    return <div className="p-4 text-center text-gray-500 text-xs">Loading layers...</div>;
  }

  // We render the children of wrapper, because usually we don't want to show 'Body' as a single root item
  // or we might want to check layerManager config for root. 
  // Standard GrapesJS often shows Body or Wrapper as root. Let's show Wrapper as root for now or its children.
  // Actually, standard behavior is showing the children of the wrapper usually.

  // Let's render the wrapper itself if it has stuff, or just its children.
  // The wrapper is basically the <body>.

  console.log("root component", rootComponent)
  return (
    <div className="page-layer h-full overflow-y-auto overflow-x-hidden select-none" style={{ background: '#1e1e1e', color: '#ddd' }}>
      {/* If we want to show the wrapper itself: */}
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
        .page-layer::-webkit-scrollbar {
          width: 6px;
        }
        .page-layer::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .page-layer::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 3px;
        }
        .page-layer::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
       `}</style>
    </div>
  );
};

export default PageLayer;