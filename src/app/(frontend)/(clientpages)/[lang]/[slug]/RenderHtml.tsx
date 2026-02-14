"use client";
import { Website } from "@/components/admin/AppShell";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  extractScriptsFromHtml,
  executeScript,
  isHeaderPresent,
} from "@/components/editor/utils/htmlParser";
import { useServerInsertedHTML } from "next/navigation";
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
  // localStorage.setItem("current_website", JSON.stringify(currentWebsite));
  // localStorage.setItem("current_header", JSON.stringify(headerData));
  // localStorage.setItem("current_footer", JSON.stringify(footerData));
  // console.log("current_website", currentWebsite);
  // console.log("current_header", headerData);
  // console.log("html", html);

  // Extract scripts from header, main content, and footer
  const headerParsed = useMemo(() => {
    if (!headerData?.content) return { htmlWithoutScripts: "", scripts: [] };
    return extractScriptsFromHtml(headerData.content.replace(/\\n/g, ""));
  }, [headerData?.content]);

  const mainParsed = useMemo(() => {
    if (!html) return { htmlWithoutScripts: "", scripts: [] };
    return extractScriptsFromHtml(html);
  }, [html]);

  const footerParsed = useMemo(() => {
    if (!footerData?.content) return { htmlWithoutScripts: "", scripts: [] };
    return extractScriptsFromHtml(footerData.content.replace(/\\n/g, ""));
  }, [footerData?.content]);


      // Extract styles from header, main content, and footer
    const extractedStyles = useMemo(() => {
        const headerStyles = headerData?.content ? extractStyles(headerData.content) : '';
        const mainStyles = html ? extractStyles(html) : '';
        const footerStyles = footerData?.content ? extractStyles(footerData.content) : '';

        const combinedStyles = `${headerStyles}\n${mainStyles}\n${footerStyles}`;


        return combinedStyles;
    }, [html]);
  // Execute all scripts after the component mounts and content is rendered
  useEffect(() => {
    // Execute header scripts
    if(headerParsed?.scripts.length > 0){
    headerParsed?.scripts.forEach((script) => {
      executeScript(script);
    });
    }

    // Execute main content scripts
    if(mainParsed?.scripts.length > 0){
    mainParsed?.scripts.forEach((script) => {
      executeScript(script);
    });
    }

    // Execute footer scripts
    if(footerParsed?.scripts.length > 0){
    footerParsed?.scripts.forEach((script) => {
      executeScript(script);
    });
    }

    // Cleanup function to remove event listeners if needed
    return () => {
      // Add any cleanup logic here if your scripts add event listeners
      console.log("Cleaning up scripts...");
    };
  }, [headerParsed.scripts, mainParsed.scripts, footerParsed.scripts]);

  const { body } = extractHtmlParts(html);

  const isHeaderPresentInHtml = useMemo(()=>{
    return isHeaderPresent(html)
  },[html])

  console.log("isHeaderPresentInHtml",isHeaderPresentInHtml)

  return (
    <>

        {/* apply style */}
         {/* Inject extracted styles globally */}
            {extractedStyles && (
                <style
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: extractedStyles }}
                />
            )}
      {/* Render header at the top if headerData exists */}
      {headerData && headerData.content && !isHeaderPresentInHtml && (
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: headerParsed.htmlWithoutScripts || "",
          }}
        />
      )}

      {/* Render main page content */}
      <main>
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </main>

      {/* Render footer at the bottom if footerData exists */}
      {footerData && footerData.content && (
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: footerParsed.htmlWithoutScripts || "",
          }}
        />
      )}
    </>
  );
};

export default RenderHtml;
