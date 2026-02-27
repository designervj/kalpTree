"use client";
import { Website } from "@/components/admin/AppShell";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  isHeaderPresent,
} from "@/components/editor/utils/htmlParser";
import { extractHtmlParts, extractStyles } from "@/lib/utils";

type props = {
  html: string;
  currentWebsite: Website | null;
  headerData: TemplateDocument | null;
  footerData: TemplateDocument | null;
};

const RenderHtml = ({
  html,
  currentWebsite,
  footerData,
  headerData,
}: props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("auto");

  // Extract content parts
  const mainParsed = useMemo(() => {
    if (!html) return { htmlWithoutScripts: "", scripts: [], externalScripts: [] };
    const { body, scripts, externalScripts } = extractHtmlParts(html);
    return { htmlWithoutScripts: body, scripts, externalScripts };
  }, [html]);

  const headerParsed = useMemo(() => {
    const data = headerData?.content?.replace(/\\n/g, "").trim();
    if (!data) return { htmlWithoutScripts: "", scripts: [], externalScripts: [] };
    const { body, scripts, externalScripts } = extractHtmlParts(data);
    return { htmlWithoutScripts: body, scripts, externalScripts };
  }, [headerData?.content]);

  const footerParsed = useMemo(() => {
    const data = footerData?.content?.replace(/\\n/g, "").trim();
    if (!data) return { htmlWithoutScripts: "", scripts: [], externalScripts: [] };
    const { body, scripts, externalScripts } = extractHtmlParts(data);
    return { htmlWithoutScripts: body, scripts, externalScripts };
  }, [footerData?.content]);

  // Combined styles
  const extractedStyles = useMemo(() => {
    const headerStyles = headerData?.content ? extractStyles(headerData.content) : '';
    const mainStyles = html ? extractStyles(html) : '';
    const footerStyles = footerData?.content ? extractStyles(footerData.content) : '';
    return `${headerStyles}\n${mainStyles}\n${footerStyles}`;
  }, [html, headerData?.content, footerData?.content]);

  // Combined external scripts
  const allExternalScripts = useMemo(() => {
    const scripts = [
      "https://unpkg.com/lucide@latest",
      ...(headerParsed?.externalScripts || []),
      ...(mainParsed?.externalScripts || []),
      ...(footerParsed?.externalScripts || [])
    ];
    // Remove duplicates
    return Array.from(new Set(scripts));
  }, [headerParsed, mainParsed, footerParsed]);

  // Combined inline scripts
  const allInlineScripts = useMemo(() => {
    return [
      ...(headerParsed?.scripts || []),
      ...(mainParsed?.scripts || []),
      ...(footerParsed?.scripts || [])
    ];
  }, [headerParsed, mainParsed, footerParsed]);

  const isHeaderPresentInHtml = useMemo(() => {
    return isHeaderPresent(html);
  }, [html]);

  // Construct the full HTML for the iframe
  const iframeContent = useMemo(() => {
    const headerHtml = headerData && headerData.content && !isHeaderPresentInHtml
      ? headerParsed.htmlWithoutScripts
      : "";
    const mainHtml = mainParsed.htmlWithoutScripts;
    const footerHtml = footerData && footerData.content
      ? footerParsed.htmlWithoutScripts
      : "";

    console.log("allInlineScripts", allInlineScripts);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { margin: 0; padding: 0; overflow-x: hidden; font-family: sans-serif; }
            #iframe-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
            main { flex: 1; }
            #cursor, #cursor-follower { pointer-events: none; }
            ${extractedStyles}
          </style>
          ${allExternalScripts.map(src => `<script src="${src}"></script>`).join("\n")}
        </head>
        <body class="min-h-screen">
          <div id="iframe-wrapper">
            <div id="header-container">${headerHtml}</div>
            <main id="main-content">${mainHtml}</main>
            <div id="footer-container">${footerHtml}</div>
          </div>
          <script>
            console.log("Iframe Initializing...");
            window.onerror = function(msg, url, line, col, error) {
              console.error("Iframe Error:", msg, "at line", line);
              return false;
            };
          </script>
          ${allInlineScripts.map((s, i) => `
            <script id="script-${i}">
              try {
                ${s}
              } catch (e) {
                console.error("Error in script ${i}:", e);
              }
            </script>
          `).join("\n")}
          <script>
            try {
              if (typeof lucide !== 'undefined') {
                lucide.createIcons();
              }
              console.log("Iframe Scripts Loaded Successfully");
            } catch (e) {
              console.error("Lucide Init Error:", e);
            }
          </script>
        </body>
      </html>
    `;
  }, [extractedStyles, allExternalScripts, allInlineScripts, headerData, footerData, headerParsed, mainParsed, footerParsed, isHeaderPresentInHtml]);

  // Listen for resize messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'resize-iframe') {
        setIframeHeight(`${event.data.height}px`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={iframeContent}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block"
      }}
      title="Website Content"
      suppressHydrationWarning
    />
  );
};

export default RenderHtml;

