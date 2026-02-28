import { DropZone } from "@puckeditor/core";
import { layoutFields } from "../puckfields";
import {
  DEFAULT_LAYOUT,
  generateLayoutCSS,
} from "@/components/puckcomponents/CustomLayout";

export const GridBlock = {
  fields: {
    numberOfColumns: {
      type: "text",
      label: "Number of columns",
    },
    gap: {
      type: "text",
      label: "Gap",
    },
    layout: layoutFields,
    content: {
      type: "slot",
    },
  },
  defaultProps: {
    numberOfColumns: "4",
    gap: "24",
    layout: DEFAULT_LAYOUT,
  },
  render: ({ numberOfColumns, gap, layout, content: Content, puck }: any) => {
    const layoutStyle = generateLayoutCSS(layout);
    const cols = parseInt(numberOfColumns) || 1;

    return (
      <div style={{ position: "relative", width: "100%" }}>
        {/* Grid Visualization Overlay — Only in editor */}
        {(puck?.renderMode === "editor" || puck?.isEditing) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: gap ? `${gap}px` : "0px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            {Array.from({ length: cols }).map((_, i) => (
              <div
                key={i}
                style={{
                  border: "1px dashed rgba(0, 0, 0, 0.15)",
                  minHeight: "100px",
                  height: "100%",
                }}
              />
            ))}
          </div>
        )}

        {/* DropZone Wrapper */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Content
            zone="my-grid"
            style={{
              ...layoutStyle,
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: gap ? `${gap}px` : "0px",
            }}
          />
        </div>
      </div>
    );
  },
};
