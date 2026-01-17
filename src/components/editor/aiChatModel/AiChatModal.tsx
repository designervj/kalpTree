"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AiChat from "./AiChat";

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: any;
}

export function AiChatModal({ isOpen, onClose, component }: AiChatModalProps) {
  const componentHtml = component?.html || "";
  const componentType = component?.type || "unknown";
  const componentTag = component?.tagName || "div";
  const actualComponent = component?.component; // Get the actual GrapesJS component
  const [apiResponse, setApiResponse] = useState("");
  const [extractedHtml, setExtractedHtml] = useState("");

  // Extract HTML code block from API response
  useEffect(() => {
    if (!apiResponse) {
      setExtractedHtml("");
      return;
    }
    try {
      // Try to parse as JSON and get .result
      let html = "";
      let parsed: any = null;
      try {
        parsed = JSON.parse(apiResponse);
      } catch {}
      if (parsed && typeof parsed.result === "string") {
        // Look for ```html ... ``` or ``` ... ``` code block
        const codeBlockMatch = parsed.result.match(/```html([\s\S]*?)```/i) || parsed.result.match(/```([\s\S]*?)```/);
        if (codeBlockMatch) {
          html = codeBlockMatch[1].trim();
        } else {
          // Fallback: try to find a <div> or <...> tag
          const divMatch = parsed.result.match(/(<[a-z][\s\S]*>)/i);
          if (divMatch) {
            html = divMatch[1];
          }
        }
      }
      setExtractedHtml(html);
    } catch {
      setExtractedHtml("");
    }
  }, [apiResponse]);
  
  console.log("Component data:", component);
  console.log("Component HTML:", componentHtml);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-xxl min-w-[1200px] max-h-[98vh] overflow-hidden bg-white border-gray-200 p-0">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              AI Component Editor - {componentTag} ({componentType})
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="grid flex-col h-[calc(98vh-140px)]">
          {/* Top Section - Split View */}
          <div className="grid h-1/2 border-b border-gray-200">
            {/* Left Side - AI Chat */}
            <div className=" border-r border-gray-200 py-6 overflow-auto">
              <div className="h-full flex flex-col justify-start">
                <AiChat componentHtml={componentHtml} onResponse={setApiResponse} />
              </div>
            </div>

            {/* Right Side - HTML Preview */}
            <div className=" py-6 overflow-auto bg-gray-50">
              <div className="mb-3 px-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Live Preview</h3>
              </div>
              <div className="border border-gray-200 rounded-lg bg-white p-4 min-h-[300px] mx-4">
                {componentHtml ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: componentHtml }}
                    className="rendered-html"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No HTML content to display
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - API Response and HTML Preview */}
          <div className="h-1/2 py-6 overflow-auto bg-gray-50">
            <div className="mb-3 px-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Response</h3>
            </div>
            <div className="px-4">
              <textarea
                value={apiResponse}
                readOnly
                placeholder="AI response will appear here..."
                className="w-full h-[120px] p-4 border border-gray-300 rounded-lg resize-none bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              {extractedHtml && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">Extracted HTML Preview</h4>
                  <div className="border border-dashed border-blue-400 rounded bg-blue-50 p-4 overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: extractedHtml }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Modify component with AI assistance
            </p>
            <Button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-9 text-sm font-medium"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
