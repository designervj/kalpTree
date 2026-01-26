import React, { useState, useEffect, useMemo } from "react";
// import { Eye, EyeOff, ChevronRight, ChevronDown, Plus } from "lucide-react";
import { Eye, EyeOff, ChevronRight, ChevronDown, Plus } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";


interface LayerNode {
  id: string;
  tagName: string;
  children: LayerNode[];
  attributes?: Record<string, string>;
  textContent?: string;
}

interface LayerItemProps {
  node: LayerNode;
  level: number;
  onToggleVisibility: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
  hiddenNodes: Set<string>;
}

const LayerItem: React.FC<LayerItemProps> = ({
  node,
  level,
  onToggleVisibility,
  onSelect,
  selectedId,
  hiddenNodes,
}) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = node.children && node.children.length > 0;
  const isHidden = hiddenNodes.has(node.id);
  const isSelected = selectedId === node.id;

  // Function to get label from node name or type
  const getElementLabel = (tagName: string, attributes?: Record<string, string>) => {
    const tag = tagName.toLowerCase();

    // Special handling for common elements
    if (tag === "div") return "Div";
    if (tag === "section") return "Section";
    if (tag === "header") return "Header";
    if (tag === "footer") return "Footer";
    if (tag === "nav") return "Nav";
    if (tag === "main") return "Main";
    if (tag === "aside") return "Aside";
    if (tag === "article") return "Article";
    if (tag === "p") return "Paragraph";
    if (tag === "span") return "Span";
    if (tag === "h1") return "H1";
    if (tag === "h2") return "H2";
    if (tag === "h3") return "H3";
    if (tag === "h4") return "H4";
    if (tag === "h5") return "H5";
    if (tag === "h6") return "H6";
    if (tag === "a") return "Link";
    if (tag === "button") return "Button";
    if (tag === "img") return "Image";
    if (tag === "ul") return "List";
    if (tag === "ol") return "Ordered List";
    if (tag === "li") return "List Item";

    // Check if it's a text node
    if (tag === "#text") return "Text";

    // Default: capitalize first letter
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  };

  // Calculate descendant count if needed, or remove if not in LayerItemType
  // For now, assuming we might not have full/easy descendant count without traversing
  const countDescendants = (node: LayerNode): number => {
    let count = node.children ? node.children.length : 0;
    node.children?.forEach(child => {
      count += countDescendants(child);
    });
    return count;
  };

  const descendantCount = countDescendants(node);

  return (
    <div className="layer-item">
      <div
        className={`layer-row ${isSelected ? "selected" : ""} ${isHidden ? "hidden" : ""}`}
        style={{
          paddingLeft: `${level * 16 + 8}px`,
        }}
        onClick={() => onSelect(node.id)}
      >
        {/* Visibility Toggle */}
        <button
          className="visibility-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(node.id);
          }}
          title={isHidden ? "Show element" : "Hide element"}
        >
          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>

        {/* Expand/Collapse Arrow */}
        {hasChildren ? (
          <button
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="expand-placeholder" />
        )}

        {/* Element Name */}
        <span className="element-name">
          {getElementLabel(node.tagName, node.attributes)}
        </span>

        {/* Descendant Count */}
        {/* {descendantCount > 0 && (
          <span className="descendant-count">{descendantCount}</span>
        )} */}

        {/* Add Element Button */}
        <button
          className="add-btn"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement add element functionality
            console.log("Add element to", node.id);
          }}
          title="Add element"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Render Children */}
      {hasChildren && isExpanded && (
        <div className="layer-children">
          {node.children.map((child) => (
            <LayerItem
              key={child.id}
              node={child}
              level={level + 1}
              onToggleVisibility={onToggleVisibility}
              onSelect={onSelect}
              selectedId={selectedId}
              hiddenNodes={hiddenNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PageLayer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { page } = useSelector((state: RootState) => state.pageEdit);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());

  // Parse HTML content into layer tree
  const layerTree = useMemo(() => {
    if (!page?.content) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(page.content, "text/html");

    let idCounter = 0;
    const generateId = () => `node-${idCounter++}`;

    const parseNode = (element: Element): LayerNode | null => {
      // Skip script, style, and meta tags
      if (
        element.tagName === "SCRIPT" ||
        element.tagName === "STYLE" ||
        element.tagName === "META" ||
        element.tagName === "LINK" ||
        element.tagName === "TITLE"
      ) {
        return null;
      }

      const id = generateId();
      const children: LayerNode[] = [];

      // Parse child elements
      Array.from(element.children).forEach((child) => {
        const childNode = parseNode(child);
        if (childNode) {
          children.push(childNode);
        }
      });

      // Handle text nodes
      const textContent = Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent?.trim())
        .filter(Boolean)
        .join(" ");

      if (textContent && children.length === 0) {
        children.push({
          id: generateId(),
          tagName: "#text",
          children: [],
          textContent,
        });
      }

      // Get attributes
      const attributes: Record<string, string> = {};
      Array.from(element.attributes).forEach((attr) => {
        attributes[attr.name] = attr.value;
      });

      return {
        id,
        tagName: element.tagName,
        children,
        attributes,
      };
    };

    // Start from body element
    const bodyElement = doc.body;
    if (bodyElement) {
      return parseNode(bodyElement);
    }

    return null;
  }, [page?.content]);

  const handleToggleVisibility = (id: string) => {
    setHiddenNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  if (!page) {
    return (
      <div className="page-layer-empty">
        <p>No page loaded</p>
      </div>
    );
  }

  if (!layerTree) {
    return (
      <div className="page-layer-empty">
        <p>No content to display</p>
      </div>
    );
  }

  return (
    <div className="page-layer">
      <div className="page-layer-content">
        <LayerItem
          node={layerTree}
          level={0}
          onToggleVisibility={handleToggleVisibility}
          onSelect={handleSelect}
          selectedId={selectedId}
          hiddenNodes={hiddenNodes}
        />
      </div>

      <style jsx>{`
        .page-layer {
          width: 100%;
          height: 100%;
          background: #2a2a2a;
          color: #e0e0e0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px;
          overflow-y: auto;
        }

        .page-layer-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #888;
        }

        .page-layer-content {
          padding: 8px 0;
        }

        .layer-item {
          user-select: none;
        }

        .layer-row {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 8px;
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }

        .layer-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .layer-row.selected {
          background: rgba(100, 120, 255, 0.3);
        }

        .layer-row.hidden {
          opacity: 0.5;
        }

        .visibility-btn,
        .expand-btn,
        .add-btn {
          background: none;
          border: none;
          color: #a0a0a0;
          padding: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s;
          flex-shrink: 0;
        }

        .visibility-btn:hover,
        .expand-btn:hover,
        .add-btn:hover {
          color: #ffffff;
        }

        .expand-placeholder {
          width: 18px;
          flex-shrink: 0;
        }

        .element-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #e0e0e0;
        }

        .descendant-count {
          color: #888;
          font-size: 11px;
          margin-left: auto;
          margin-right: 4px;
        }

        .add-btn {
          opacity: 0;
          transition: opacity 0.15s;
        }

        .layer-row:hover .add-btn {
          opacity: 1;
        }

        .layer-children {
          /* No additional styling needed, handled by level padding */
        }

        /* Scrollbar styling */
        .page-layer::-webkit-scrollbar {
          width: 8px;
        }

        .page-layer::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        .page-layer::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }

        .page-layer::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default PageLayer;    