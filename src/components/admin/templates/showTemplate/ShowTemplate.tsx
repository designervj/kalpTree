"use client";

import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TemplateDocument } from "../TemplateType";
import { Eye, Download, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TemplateTopBar from "./TemplateTopBar";
import { setCurrentTemplate } from "@/hooks/slices/templates/TemplateSlice";
import PreviewTemplate from "./PreviewTemplate";

// ✅ shadcn tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

function miniToast(msg: string) {
  const el = document.createElement("div");
  el.innerText = msg;
  el.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-md bg-black text-white px-4 py-2 text-sm shadow-lg";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

const ShowTemplate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allTemplate } = useSelector((state: RootState) => state.template);
  const router = useRouter();
  const [template, setTemplate] = useState<TemplateDocument[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setTemplate(allTemplate);
  }, [allTemplate]);

  const getThumb = useMemo(() => {
    return (t: any) =>
      t?.thumbnailUrl ||
      t?.thumbnail ||
      t?.thumb ||
      t?.image ||
      t?.imageUrl ||
      t?.previewImage ||
      t?.cover ||
      "";
  }, []);

  const getId = (t: any) => t?.id || t?._id || t?.uuid || t?.template_id || "";

  const handlePreview = (data: TemplateDocument) => {
    dispatch(setCurrentTemplate(data));
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    dispatch(setCurrentTemplate(null));
  };

  const handleImport = (data: TemplateDocument) => {
    // dispatch(importTemplateThunk(getId(data)))
    miniToast(`Imported: ${data.label}`);
  };

  const handleDelete = async (data: TemplateDocument) => {
    const ok = window.confirm(`Delete template "${data.label}" ?`);
    if (!ok) return;

    try {
      // await dispatch(deleteTemplateThunk(getId(data))).unwrap()
      setTemplate((prev: any) =>
        prev.filter((x: any) => getId(x) !== getId(data))
      );
      miniToast("Template deleted");
    } catch (e) {
      miniToast("Delete failed");
    }
  };

  const handleShowSelectedTemplate = (data: TemplateDocument[]) => {
    console.log("data", data);
    setTemplate(data);
  };

  const handleEdit = (data: TemplateDocument) => {
    console.log("data", data);
    dispatch(setCurrentTemplate(data));
    // setTemplate(data);
    router.push(`/admin/website/templates/edit/${getId(data)}`);
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between mb-4">
        <BreadCrumbPage />
        <Link href="/admin/website/templates/create">
          <Button className="rounded-md">Add Template</Button>
        </Link>
      </div>

      <TemplateTopBar selectedTemplate={handleShowSelectedTemplate} />

      <div className="bg-white p-6">
        <TooltipProvider delayDuration={120}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {template.map((t: any) => {
              const thumb = getThumb(t);
              const tid = getId(t);

              return (
                <div key={tid} className="space-y-2">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300">
                    {/* THUMB */}
                    <div className="relative h-[230px] bg-gray-50">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={t.label}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 p-4">
                          <div className="h-7 w-2/3 rounded bg-black/10" />
                          <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="h-14 rounded bg-black/10" />
                            <div className="h-14 rounded bg-black/10" />
                            <div className="h-14 rounded bg-black/10" />
                          </div>
                          <div className="mt-3 h-20 rounded bg-black/10" />
                        </div>
                      )}

                      {/* subtle border on image */}
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                    </div>

                    {/* FOOTER: LEFT title + RIGHT icons */}
                    <div className="border-t bg-white px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        {/* LEFT */}
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {t.label}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate">
                            Template ID: {tid}
                          </p>
                        </div>

                        {/* RIGHT icons */}
                        <div className="flex items-center gap-2">

                          {/* edit */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleEdit(t)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                          </Tooltip>
                          {/* PREVIEW */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                                onClick={() => handlePreview(t)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              Preview
                            </TooltipContent>
                          </Tooltip>

                          {/* IMPORT */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                size="icon"
                                className="h-8 w-8 rounded-md bg-[#7C2D64] text-white hover:bg-[#6B2457] cursor-pointer"
                                onClick={() => handleImport(t)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              Import
                            </TooltipContent>
                          </Tooltip>

                          {/* DELETE */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-md border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 cursor-pointer"
                                  onClick={() => handleDelete(t)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>

                                {/* red dot */}
                                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600 ring-2 ring-white" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              Delete
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {previewOpen && <PreviewTemplate onClose={handleClosePreview} />}
    </div>
  );
};

export default ShowTemplate;
