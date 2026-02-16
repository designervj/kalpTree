"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Code, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface CodeEditorProps {
  html: string;
  css: string;
  js: string;
  onUpdateHtml: (html: string) => void;
  onUpdateCss: (css: string) => void;
  onUpdateJs: (js: string) => void;
}

import HtmlCode from "./HtmlCode";
import CssCode from "./CssCode";

export function CodeEditor({
  html,
  css,
  js,
  onUpdateHtml,
  onUpdateCss,
  onUpdateJs,
}: CodeEditorProps) {
  const [localHtml, setLocalHtml] = useState("");
  const [localCss, setLocalCss] = useState("");
  const [localJs, setLocalJs] = useState("");
  const [preview, setPreview] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [activeTab, setActiveTab] = useState("html");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setLocalHtml(html || "");
    setLocalCss(css || "");
    setLocalJs(js);
  }, [html, css, js]);

  useEffect(() => {
    if (isDialogOpen) {
      generatePreview();
    }
  }, [isDialogOpen]);

  // Auto-refresh preview when content changes (with debounce)
  useEffect(() => {
    if (!isDialogOpen) return;

    const timeoutId = setTimeout(() => {
      generatePreview();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [localHtml, localCss, localJs, isDialogOpen]);

  const generatePreview = () => {
    // Extract any scripts from the HTML content itself
    const scriptMatches = localHtml.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || [];
    const extractedScripts = scriptMatches
      .map(scriptTag => {
        const match = scriptTag.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
        return match ? match[1] : '';
      })
      .filter(script => script.trim());

    // Remove script tags from HTML to avoid duplicate execution
    const htmlWithoutScripts = localHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

    const previewHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${localCss}</style>
      </head>
      <body>
        ${htmlWithoutScripts}
        <!-- Load Tailwind CSS CDN and wait for it before executing other scripts -->
        <script>
          (function() {
            // Create and load Tailwind script
            const tailwindScript = document.createElement('script');
            tailwindScript.src = 'https://cdn.tailwindcss.com';
            
            // Wait for Tailwind to load before executing other scripts
            tailwindScript.onload = function() {
              console.log('✅ Tailwind CSS loaded');
              
              // Execute scripts extracted from HTML first
              ${extractedScripts.map((script, idx) => `
                // Script ${idx + 1} from HTML
                try {
                  ${script}
                } catch (error) {
                  console.error('HTML Script ${idx + 1} error:', error);
                }
              `).join('\n')}

              // Then execute the JavaScript tab content
              try {
                ${localJs}
              } catch (error) {
                console.error('JavaScript tab error:', error);
                document.body.innerHTML += '<div style="background: #fee; color: #c00; padding: 10px; margin: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">Script Error: ' + error.message + '</div>';
              }
            };
            
            tailwindScript.onerror = function() {
              console.error('❌ Failed to load Tailwind CSS');
              // Execute scripts anyway even if Tailwind fails to load
              ${extractedScripts.map((script, idx) => `
                try {
                  ${script}
                } catch (error) {
                  console.error('HTML Script ${idx + 1} error:', error);
                }
              `).join('\n')}
              
              try {
                ${localJs}
              } catch (error) {
                console.error('JavaScript tab error:', error);
              }
            };
            
            // Append the script to start loading
            document.head.appendChild(tailwindScript);
          })();
        </script>
      </body>
      </html>
    `;
    setPreview(previewHtml);
    // Force iframe refresh by changing key
    setPreviewKey(prev => prev + 1);
  };

  const handleApplyChanges = () => {
    onUpdateHtml(localHtml);
    onUpdateCss(localCss);
    onUpdateJs(localJs);
    setIsDialogOpen(false);
  };



  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Code className="w-3.5 h-3.5 mr-1.5" />
          Code Editor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70%] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Code Editor</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden md:flex-row min-h-0">
          <div className="flex flex-col md:w-1/2 min-h-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col flex-1 min-h-0"
            >
              <TabsList className="grid w-full grid-cols-3 shrink-0">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>

              <TabsContent
                value="html"
                className={cn(
                  "flex-1 min-h-0 flex flex-col mt-2",
                  activeTab !== "html" && "hidden"
                )}
              >
                <HtmlCode localHtml={localHtml} setLocalHtml={setLocalHtml} />
              </TabsContent>

              <TabsContent
                value="css"
                className={cn(
                  "flex-1 min-h-0 flex flex-col mt-2",
                  activeTab !== "css" && "hidden"
                )}
              >
                <CssCode localCss={localCss} setLocalCss={setLocalCss} />
              </TabsContent>

              <TabsContent
                value="js"
                className={cn(
                  "flex-1 min-h-0 flex flex-col mt-2",
                  activeTab !== "js" && "hidden"
                )}
              >
                <div className="flex-1 overflow-hidden border rounded-md">
                  <textarea
                    className="w-full h-full p-4 font-mono text-sm text-gray-100 bg-gray-900 resize-none focus:outline-none"
                    value={localJs}
                    onChange={(e) => setLocalJs(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>



          <div className="flex flex-col md:w-1/2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Preview</h3>
              <Button variant="outline" size="sm" onClick={generatePreview}>
                <Play className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="flex-1 overflow-hidden bg-white border rounded-md">
              <iframe
                key={previewKey}
                srcDoc={preview}
                title="Preview"
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2 shrink-0">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onUpdateHtml(localHtml);
              onUpdateCss(localCss);
              onUpdateJs(localJs);
            }}
          >
            Apply
          </Button>
          <Button onClick={handleApplyChanges}>Apply & Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
