import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    component: any;
}
const CommentsModal = ({ isOpen, onClose, component }: Props) => {
    const componentHtml = component?.html || "";
    const componentCss = component?.css || "";
    
    const componentTag = component?.tagName || "div";
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return (
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



                            {/* Right Side - HTML Preview */}

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
    )
}

export default CommentsModal