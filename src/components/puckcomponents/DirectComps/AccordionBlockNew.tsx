import { useEffect, useMemo, useRef, useState } from "react";
import { generateTextCSS } from "../CustomText";
import { generateSpacingCSS } from "../CustomSpacing";
import { generateBorderCSS } from "../CustomBorder";
import { generateBoxShadowCSS } from "../CustomBoxShadow";
import { generateLayoutCSS } from "../CustomLayout";
import { generateCSS } from "../CustomSIzing";
import { createUsePuck, registerOverlayPortal } from "@puckeditor/core";

function AccordionIcon({
  style,
  open,
  closedColor,
  openColor,
}: {
  style: string;
  open: boolean;
  closedColor: string;
  openColor: string;
}) {
  const color = open ? openColor : closedColor;

  if (style === "plus") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="flex-shrink-0 transition-transform duration-200"
      >
        <path
          d="M2 7h10"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {!open && (
          <path
            d="M7 2v10"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }
  // arrow and chevron both just rotate
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      {style === "arrow" ? (
        <path
          d="M2 4l5 6 5-6"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3 5l4 4 4-4"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function AccordionComponentNew({
  sizing,
  spacing,
  border,
  boxShadow,
  text,
  layout,
  content: Content,
  id,
}: any) {
  const usePuck = createUsePuck();

  const puckmain = usePuck((s) => s);

  // Title style from H3 (accordion titles are typically mid-level)
  const titleStyle = generateTextCSS(text?.h3);
  const bodyStyle = generateTextCSS(text?.p);

  const containerStyle: React.CSSProperties = {
    ...generateCSS(sizing),
    ...generateSpacingCSS(spacing),
    ...generateBorderCSS(border),
    ...generateBoxShadowCSS(boxShadow),
    ...generateLayoutCSS(layout),
  };

  const data = useMemo(() => {
    return puckmain.getItemById(id);
  }, [puckmain.appState]);

  return (
    // <div style={containerStyle} className="w-full">
    <Content style={containerStyle} />
    // </div>
  );
}
