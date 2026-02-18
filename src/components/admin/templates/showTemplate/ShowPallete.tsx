import React, { useMemo } from "react";
import { extractColors, extractFontsAndSizesFromHTML } from "./util/ExtractColorFont";
import { TemplateDocument } from "../TemplateType";

type HtmlProps = {
  html?: Partial<TemplateDocument> | any; // ✅ allow undefined safely
};

const ShowPallete = ({ html }: HtmlProps) => {
  // ✅ no crash if html is undefined/null
  const content = String(html?.content ?? "");

  const colors = useMemo(() => extractColors(content), [content]);
  const { fontFamilies, fontSizes } = useMemo(
    () => extractFontsAndSizesFromHTML(content),
    [content]
  );

  // ✅ safe fallbacks (no undefined access)
  const safeFontFamily = fontFamilies?.[0] ?? "inherit";
  const safeFontSizeRaw = fontSizes?.[0] ?? "14px";
  const safeFontSize =
    typeof safeFontSizeRaw === "number" ? `${safeFontSizeRaw}px` : safeFontSizeRaw;

  // ✅ safe label fallback
  const label = String(html?.label ?? html?.name ?? html?.title ?? "Untitled");

  // ✅ if no colors found, show a neutral bar instead of breaking UI
  const safeColors =
    Array.isArray(colors) && colors.length > 0 ? colors : [{ color: "#e5e7eb", count: 0 }];

  return (
    <>
      <div className="flex w-full h-full">
        {safeColors.map((col: { color: string; count: number }, idx: number) => (
          <div
            key={idx}
            className="flex-1 h-full"
            style={{ background: col.color }}
            title={`${col.color}${col.count ? ` (used ${col.count} times)` : ""}`}
          />
        ))}
      </div>

      <div
        className="text-sm font-semibold text-slate-900 truncate"
        style={{ fontFamily: safeFontFamily, fontSize: safeFontSize }}
        title={label}
      >
        {label}
      </div>
    </>
  );
};

export default ShowPallete;
