"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AiChat from "./AiChat";
import GetAllIIMData from "@/components/admin/settings/integration/llm/llmdata/GetAllIIMData";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setCurrentLLMSetting } from "@/hooks/slices/setting/llmSetting/LLMSettingSlice";

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: any;
}

export function AiChatModal({ isOpen, onClose, component }: AiChatModalProps) {
  console.log("component ", component)
  const componentHtml = component?.html || "";
  const componentType = component?.type || "unknown";
  const componentTag = component?.tagName || "div";
  const componentCss = component?.css || "";
  const actualComponent = component?.component; // keep (if you need later)
  const [apiResponse, setApiResponse] = useState("");
  const [extractedHtml, setExtractedHtml] = useState("");
  const dispatch = useDispatch<AppDispatch>()
  const { listLLMSettings } = useSelector((state: RootState) => state.llmSetting)

  // Function to replace component in builder
  const handleReplaceComponent = () => {
    if (!extractedHtml || !actualComponent) {
      console.warn("No HTML to replace or component not available");
      return;
    }

    try {
      // Replace the component's HTML content
      actualComponent.components(extractedHtml);
      console.log("Component replaced successfully");

      // Optionally close the modal after replacement
      // onClose();
    } catch (error) {
      console.error("Error replacing component:", error);
    }
  };

  // Extract HTML code block from API response
  useEffect(() => {
    if (!apiResponse) {
      setExtractedHtml("");
      return;
    }

    try {
      let html = "";
      let parsed: any = null;

      try {
        parsed = JSON.parse(apiResponse);
      } catch { }

      const sourceText =
        parsed && typeof parsed.result === "string" ? parsed.result : apiResponse;

      const codeBlockMatch =
        sourceText.match(/```html([\s\S]*?)```/i) ||
        sourceText.match(/```([\s\S]*?)```/);

      if (codeBlockMatch) {
        html = codeBlockMatch[1].trim();
      } else {
        const tagMatch = sourceText.match(/(<[a-z][\s\S]*>)/i);
        if (tagMatch) html = tagMatch[1].trim();
      }

      setExtractedHtml(html);
    } catch {
      setExtractedHtml("");
    }
  }, [apiResponse]);


  // update current llm setting

  useEffect(() => {
    if (listLLMSettings && listLLMSettings.length > 0) {
      dispatch(setCurrentLLMSetting(listLLMSettings[0]))
    }
  }, [listLLMSettings]);
  return (
    <>
      <GetAllIIMData />
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent
          className="
          p-0 overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl
          w-[95vw] md:w-[75vw] lg:w-[60vw]
          max-w-[95vw] md:max-w-[75vw] lg:max-w-[60vw]
          h-[90vh]
          flex flex-col
        "
        >
          {/* Header */}
          <DialogHeader className="border-b border-gray-200 px-6 py-4 bg-white">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-base md:text-lg font-semibold text-gray-900">
                AI Component Editor - {componentTag} ({componentType})
              </DialogTitle>

            </div>
          </DialogHeader>

          {/* Main Content */}
          <div className="flex-1 min-h-0 grid grid-rows-2">
            {/* Top Section - Split View */}
            <div className="min-h-0 grid grid-cols-1 lg:grid-cols-2 border-b border-gray-200">
              {/* Left Side - AI Chat */}
              <div className="min-h-0 overflow-auto p-4 md:p-6 bg-white lg:border-r border-gray-200">
                <div className="h-full  bg-white overflow-hidden">
                  <div className="h-full">
                    <AiChat
                      componentHtml={componentHtml}
                      componentCss={componentCss}
                      onResponse={setApiResponse} />
                  </div>
                </div>
              </div>

              {/* Right Side - HTML Preview */}
              <div className="min-h-0 overflow-auto p-4 md:p-6 bg-gray-50">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Live Preview</h3>
                </div>

                <div className="border border-gray-200 rounded-xl bg-white p-4 min-h-[260px]">
                  {componentHtml ? (
                    <>
                      <style>{componentCss}</style>
                      <div
                        dangerouslySetInnerHTML={{ __html: componentHtml }}
                        className="rendered-html"
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No HTML content to display
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section - API Response and HTML Preview */}
            <div className="min-h-0 overflow-auto bg-gray-50 p-4 md:p-6 pt-0 pb-0">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-800">AI Response</h3>
              </div>

              <div className="space-y-4">
                <textarea
                  value={apiResponse}
                  readOnly
                  placeholder="AI response will appear here..."
                  className="
                  w-full h-[140px] p-4 border border-gray-200 rounded-xl resize-none
                  bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                />

                {extractedHtml && (
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                      Extracted HTML Preview
                    </h4>
                    <div className="border border-dashed border-blue-300 rounded-xl bg-blue-50 p-4 overflow-auto">
                      <div dangerouslySetInnerHTML={{ __html: extractedHtml }} />
                    </div>
                    <Button onClick={handleReplaceComponent}>
                      Replace Component
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-white">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-500">Modify component with AI assistance</p>
              <Button
                onClick={onClose}
              // className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-9 text-sm font-medium rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
