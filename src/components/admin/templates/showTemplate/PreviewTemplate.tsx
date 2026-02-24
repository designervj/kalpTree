"use client";

import { AppDispatch, RootState } from "@/store/store";
import { Loader2, X } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { extractFontLinks } from "@/utils/extract-css-variables";

type Props = {
  onClose: () => void;
  isUseBrandColor: boolean;
};
function miniToast(msg: string) {
  const el = document.createElement("div");
  el.innerText = msg;
  el.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-xl bg-black text-white px-4 py-2 text-sm shadow-lg";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}
const PreviewTemplate = ({ onClose, isUseBrandColor }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTemplate } = useSelector((state: RootState) => state.template);

  const { currentBusiness } = useSelector((state: RootState) => state.business);

  console.log("currentBusiness", currentBusiness?.website?.globalStyle);
  console.log("currentTemplate", currentTemplate?.content);
  const globalStyleCSS = useMemo(() => {
    const globalStyle = currentBusiness?.website?.globalStyle;
    if (!globalStyle) return "";

    const vars: Record<string, string> = {};
    const declRegex = /(--[\w-]+)\s*:\s*([^;]+)/g;
    let match;
    while ((match = declRegex.exec(globalStyle)) !== null) {
      vars[match[1]] = match[2].trim();
    }

    const cssVarString = Object.entries(vars)
      .map(([prop, val]) => `  ${prop}: ${val};`)
      .sort()
      .join("\n");

    const headingStyles = [1, 2, 3, 4, 5, 6]
      .map(
        (num) => `
            h${num} {
                font-size: var(--h${num}-size);
                font-weight: var(--h${num}-weight);
                line-height: var(--h${num}-lh);
                letter-spacing: var(--h${num}-ls);
                margin-top: 0;
                margin-bottom: 0.5em;
            }`,
      )
      .join("\n");

    const buttonStyles = ["primary", "secondary", "outline"]
      .map(
        (type) => `
            .btn-${type} {
                background-color: var(--btn-${type}-bg);
                color: var(--btn-${type}-text);
                border: 1px solid var(--btn-${type}-border);
                border-radius: var(--btn-radius);
                font-size: var(--btn-size);
                height: var(--btn-height);
                transition: all var(--btn-transition);
            }
            .btn-${type}:hover {
                background-color: var(--btn-${type}-hover-bg);
            }`,
      )
      .join("\n");

    return `
            :root {
                ${cssVarString}
            }
            body { 
                font-family: var(--font-body, var(--font-family, sans-serif));
                font-size: var(--body-size, 16px);
                font-weight: var(--body-weight, 400);
                line-height: var(--body-lh, 1.5);
                letter-spacing: var(--body-ls, 0);
                color: var(--text, #000);
            }
            ${headingStyles}
            ${buttonStyles}
            p {
                margin-bottom: var(--body-paragraph-gap, 1rem);
            }
        `;
  }, [currentBusiness?.website?.globalStyle]);

  const srcDoc = useMemo(() => {
    const rawContent = currentTemplate?.content?.replace(/\\n/g, "") || "";
    const templateContent = rawContent.replace(/:root\s*{[\s\S]*?}/g, "");
    const fontLinks = extractFontLinks(rawContent)
      .map((url) => `<link rel="stylesheet" href="${url}">`)
      .join("\n");

    return `
        <!DOCTYPE html>
        <html style="width: 100%; height: 100%;">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${fontLinks}
            <style>
              ${globalStyleCSS}
              /* Custom Scrollbar */
              ::-webkit-scrollbar {
                width: 8px;
              }
              ::-webkit-scrollbar-track {
                background: #f1f1f1;
              }
              ::-webkit-scrollbar-thumb {
                background: #ccc;
                border-radius: 10px;
              }
              ::-webkit-scrollbar-thumb:hover {
                background: #b18457;
              }
              /* Ensure content fits the viewport */
              * { max-width: 100%; box-sizing: border-box; }
            </style>
          </head>
          <body>${templateContent}</body>
        </html>
      `;
  }, [currentTemplate, globalStyleCSS]);

  const noBrandSRCDoc = useMemo(() => {
    return `
        <!DOCTYPE html>
        <html style="width: 100%; height: 100%;">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
            <style>
            
              /* Custom Scrollbar */
              ::-webkit-scrollbar {
                width: 8px;
              }
              ::-webkit-scrollbar-track {
                background: #f1f1f1;
              }
              ::-webkit-scrollbar-thumb {
                background: #ccc;
                border-radius: 10px;
              }
              ::-webkit-scrollbar-thumb:hover {
                background: #b18457;
              }
              /* Ensure content fits the viewport */
              * { max-width: 100%; box-sizing: border-box; }
            </style>
          </head>
          <body>${currentTemplate?.content}</body>
        </html>
      `;
  }, [currentTemplate]);
  return (
    <>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="absolute left-1/2 top-1/2 w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <div className="text-sm font-semibold">
                {currentTemplate?.label}
              </div>
              {/* <div className="text-xs text-gray-500">
                                Demo: {currentTemplate?.label} • Category: {currentTemplate?.category}
                            </div> */}
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 grid place-items-center rounded border hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4">
            <div className="overflow-hidden rounded-lg border h-[60vh]">
              {isUseBrandColor ? (
                <iframe
                  srcDoc={srcDoc}
                  className="w-full h-full border-none"
                  title="Template Preview"
                  scrolling="yes"
                />
              ) : (
                <iframe
                  srcDoc={noBrandSRCDoc}
                  className="w-full h-full border-none"
                  title="Template Preview"
                  scrolling="yes"
                />
              )}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  miniToast(`Imported: ${currentTemplate?.label}`);
                  onClose();
                }}
                className="rounded bg-[#b18457] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Import
              </button>
              <button
                onClick={onClose}
                className="rounded border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewTemplate;
