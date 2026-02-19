"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AiChat from "./AiChat";
import GetAllIIMData from "@/components/admin/settings/integration/llm/llmdata/GetAllIIMData";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setCurrentLLMSetting } from "@/hooks/slices/setting/llmSetting/LLMSettingSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: any;
}



export function AiChatModal({ isOpen, onClose, component }: AiChatModalProps) {
  console.log("component ", component)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          h-[94vh]
          flex flex-col
        "

        >
          {/* Header */}
          <DialogHeader className="border-b border-gray-200 px-6 py-6 bg-white">
            <div className="flex items-center justify-between gap-4 py-6" style={{
              marginTop: "0px", marginBottom: "0px", padding: "10px"
            }}>
              <DialogTitle className="text-[28px] leading-8 font-semibold text-slate-900">
                <h4 className="font-sm py-3 ">AI Component Editor - {isMounted && componentTag}</h4>
              </DialogTitle>

            </div>
          </DialogHeader>

          <div style={{ overflow: "auto", padding: "10px", }}>
            {/* Main Content */}
            <div className="flex-1 grid grid-rows-2" >
              {/* Top Section - Split View */}
              <div className=" border-b border-gray-200">

                <div className="min-h-0 overflow-auto p-4 md:p-6 bg-gray-50">
                  <div className="mb-3" style={{ marginBottom: "6px" }}>
                    <h4 className="text-sm font-medium text-gray-800" style={{ fontSize: "16px" }}>Live Preview</h4>
                  </div>

                  <div className="border border-gray-200 rounded-xl bg-white overflow-auto p-4 min-h-[160px]"

                  >
                    {componentHtml ? (
                      <iframe
                        title="Component Preview"
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <style>
                                ${componentCss}
                                body { 
                                  margin: 0; 
                                  padding: 10px; 
                                  background: white; 
                                  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                                }
                              </style>
                            </head>
                            <body>
                              ${componentHtml}
                            </body>
                          </html>
                        `}
                        className="w-full min-h-[160px]"
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          background: "#fff"
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No HTML content to display
                      </div>
                    )}
                  </div>
                </div>

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

              </div>

              {/* Bottom Section - API Response and HTML Preview */}
              <div className="min-h-[200px] overflow-auto bg-gray-50 p-4 md:p-6 pt-0 pb-0">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-800" style={{ fontSize: "18px", marginBottom: "10px", marginTop: "10px" }}>AI Response</h3>
                </div>

                <div className="space-y-4">
                  {/* <textarea
                    value={apiResponse}
                    readOnly
                    placeholder="AI response will appear here..."
                    className="
                  h-[140px] p-4 border border-gray-200 rounded-xl resize-none
                    bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                    style={{ padding: "10px", margin: "4px", width: "98%" }}
                  /> */}
                  <div className="border border-gray-200 h-auto rounded-sm bg-white" style={{ padding: "10px" }}>
                    <h1>Hello World</h1>

                  </div>

                  <div className="flex gap-3 flex-wrap" style={{ marginTop: "10px" }}>
                    <button className="px-4 py-2 rounded-sm bg-blue-600 text-white cursor-pointer font-medium hover:bg-blue-700 transition" style={{ paddingLeft: "10px", paddingRight: "10px", fontSize: "14px" }}>
                      Keep design
                    </button>

                    <button className="px-4 py-2 rounded-sm border border-gray-300 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 transition" style={{ paddingLeft: "10px", paddingRight: "10px", fontSize: "14px" }}>
                      Discard design
                    </button>

                    <button className="px-4 py-2 rounded-sm bg-purple-600 text-white cursor-pointer font-medium hover:bg-purple-700 transition" style={{ paddingLeft: "10px", paddingRight: "10px", fontSize: "14px", paddingTop: "6px", paddingBottom: "6px" }}>
                      Redesign
                    </button>
                  </div>



                  {extractedHtml && (
                    <div className="pt-0">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">
                        Extracted HTML Preview
                      </h4>
                      <div className="border border-dashed border-blue-300 rounded-xl bg-blue-50 p-4 overflow-auto min-h-[160px]">
                        <iframe
                          title="Extracted HTML Preview"
                          srcDoc={`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <style>
                                  ${componentCss}
                                  body { 
                                    margin: 0; 
                                    padding: 10px; 
                                    background: transparent; 
                                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                                  }
                                </style>
                              </head>
                              <body>
                                ${extractedHtml}
                              </body>
                            </html>
                          `}
                          className="w-full h-full border-none"
                        />
                      </div>
                      <Button onClick={handleReplaceComponent}>
                        Replace Component
                      </Button>
                    </div>
                  )}
                </div>



              </div>

            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-white" style={{ padding: "10px", marginLeft: "10px", marginTop: "10px" }}>
            <div className="flex items-center justify-between gap-4 ">
              <p className="text-sm text-gray-500">Modify component with AI assistance</p>
              <Button
                onClick={onClose}
                // className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-9 text-sm font-medium rounded-xl"
                style={{ padding: "10px", marginLeft: "10px", }}
              >
                Close
              </Button>
            </div>

          </div>
          {/* Footer */}

        </DialogContent>
      </Dialog>
    </>
  );
}
