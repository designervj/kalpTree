"use client"

import { AppDispatch, RootState } from '@/store/store';
import { Loader2, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


type Props = {
    onClose: () => void
}
function miniToast(msg: string) {
    const el = document.createElement("div");
    el.innerText = msg;
    el.className =
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-xl bg-black text-white px-4 py-2 text-sm shadow-lg";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
}
const PreviewTemplate = ({ onClose }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentTemplate } = useSelector((state: RootState) => state.template);
    const [editorHtml, setEditorHtml] = useState("");
    const [editorCss, setEditorCss] = useState("");
    const [preview, setPreview] = useState("");

    // useEffect(() => {
    //     if (currentTemplate?.content) {
    //         console.log("Template Content:", currentTemplate.content);
    //         const css = extractCssFromHtml(currentTemplate.content);
    //         console.log("Extracted CSS:", css);
    //         setEditorCss(css);
    //         const html = currentTemplate.content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    //         setEditorHtml(html);
    //         generatePreview(html, css);
    //     }
    // }, [currentTemplate?.content]);

    const generatePreview = (html: string, css: string) => {
        const previewHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Add Tailwind CSS CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <style>${css}</style>
      </head>
      <body>
        ${html}
     
      </body>
      </html>
    `;
        setPreview(previewHtml);
    };
    return (
        <>
            <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="absolute left-1/2 top-1/2 w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div>
                            <div className="text-sm font-semibold">{currentTemplate?.label}</div>
                            <div className="text-xs text-gray-500">
                                Demo: {currentTemplate?.label} • Category: {currentTemplate?.category}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-9 w-9 grid place-items-center rounded border hover:bg-gray-50"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="overflow-hidden rounded-lg border h-[60vh] overflow-y-auto">
                            {/* <>
                                <iframe
                                    srcDoc={preview}
                                    title="Preview"
                                    className="w-full h-full"
                                    sandbox="allow-scripts"
                                />
                            </> */}
                            <div dangerouslySetInnerHTML={{ __html: preview }} />
                            {/* <div className={["h-[440px] w-full bg-gradient-to-br"].join(" ")} /> */}
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
    )
}

export default PreviewTemplate