import { generateSpacingCSS } from "../CustomSpacing";
import { generateBorderCSS } from "../CustomBorder";
import { generateBoxShadowCSS } from "../CustomBoxShadow";
import { generateLayoutCSS } from "../CustomLayout";
import { generateCSS } from "../CustomSIzing";

export function AccordionComponentNew({
  sizing,
  spacing,
  border,
  boxShadow,
  layout,
  content: Content,
  puck,
}: any) {
  const containerStyle: React.CSSProperties = {
    ...generateCSS(sizing),
    ...generateSpacingCSS(spacing),
    ...generateBorderCSS(border),
    ...generateBoxShadowCSS(boxShadow),
    ...generateLayoutCSS(layout),
  };

  return (
    <div style={{ position: "relative", ...containerStyle }}>
      {/* Boundary Visualization — Only visible if no border width is explicitly set AND we are in editor mode */}
      {(puck?.renderMode === "editor" || puck?.isEditing) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px dashed rgba(0, 0, 0, 0.12)",
            pointerEvents: "none",
            zIndex: 0,
            borderRadius: containerStyle.borderRadius,
            display:
              border?.allWidth?.value === "0" || !border?.allWidth?.value
                ? "block"
                : "none",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <Content />
      </div>
    </div>
  );
}
