import React from "react";
import { makeTextFields } from "./fields";
import {
  DEFAULT_TEXT,
  generateTextCSS,
} from "@/components/puckcomponents/CustomText";

export const TextBlock = {
  fields: {
    text: makeTextFields,
  },
  defaultProps: {
    text: DEFAULT_TEXT,
  },
  render: (props: any) => {
    const { text, puck } = props;
    const textstyle = generateTextCSS(text[text.activeTag.toLowerCase()]);

    return (
      <div style={{ position: "relative" }}>
        {/* Boundary Visualization — Only visible in editor mode */}
        {(puck?.renderMode === "editor" || puck?.isEditing) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1px dashed rgba(0, 0, 0, 0.12)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
        <h1 style={{ ...textstyle, position: "relative", zIndex: 1 }}>Himanshu</h1>
      </div>
    );
  },
};