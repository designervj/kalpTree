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
import { deleteTemplate } from "@/hooks/slices/templates/TemplateThunk";

import ShowHTMLtemplate from "./ShowHTMLtemplate";
import ShowPallete from "./ShowPallete";
import TemplateAction from "./TemplateAction";
import { set } from "zod";

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
   const [isUseBrandColor, setIsUseBrandColor] = useState(false);
  useEffect(() => {
    const sorted = [...allTemplate].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    setTemplate(sorted);
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
     setIsUseBrandColor(false);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    dispatch(setCurrentTemplate(null));
    setIsUseBrandColor(false);
  };

const handlePreviewBrand = (data: TemplateDocument) => {
    dispatch(setCurrentTemplate(data));
    setPreviewOpen(true);
     setIsUseBrandColor(true);
  };

  const handleDelete = async (data: TemplateDocument) => {
    const ok = window.confirm(`Delete template "${data.label}" ?`);
    if (!ok) return;

    try {
      await dispatch(deleteTemplate(getId(data))).unwrap();
      setTemplate((prev: any) =>
        prev.filter((x: any) => getId(x) !== getId(data)),
      );
      miniToast("Template deleted");
    } catch (e) {
      miniToast("Delete failed");
    }
  };

  const handleShowSelectedTemplate = (data: TemplateDocument[]) => {
    const sorted = [...data].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    setTemplate(sorted);
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


                <div key={tid} className="group relative">
                  <div className={`overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg ${!thumb ? 'border-[#7C2D64]/30' : 'border-border'} hover:border-[#7C2D64]`}>
                    {/* PREVIEW AREA */}
                    <div className="relative h-[200px] bg-muted/10 overflow-hidden">
                      {/* {thumb ? (
                        <img
                          src={thumb}
                          alt={t.label}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : ( */}
                        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105 bg-white flex flex-col overflow-hidden">
                          <div className="flex-1 relative overflow-hidden">
                            <ShowHTMLtemplate html={t?.content} />
                          </div>
                          <div className="h-2.5 w-full flex">
                            <ShowPallete html={t?.content} />
                          </div>
                        </div>
                      {/* )} */}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

                      {/* Action buttons (always visible or on hover?) - let's keep them in the dropdown but make it nicer */}
                    </div>

                    {/* FOOTER */}
                    <div className="border-t bg-background p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate group-hover:text-[#7C2D64] transition-colors">
                            {t.label}
                          </h4>
                          {/* <p className="text-[10px] text-muted-foreground font-mono opacity-70">
                            ID: {tid.slice(-8)}...
                          </p> */}
                        </div>

                           {/* action template */}
                            <TemplateAction data={t} 
                            onEdit={handleEdit}
                            onPreview={handlePreview}
                            onPreviewBrand={handlePreviewBrand}
                            onDelete={handleDelete}
                            />

                        {/* RIGHT icons */}
                        {/* <div className="flex items-center gap-2">
       
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

                   
                                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600 ring-2 ring-white" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              Delete
                            </TooltipContent>
                          </Tooltip>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>

              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {previewOpen &&
       <PreviewTemplate 
       isUseBrandColor={isUseBrandColor}
       onClose={handleClosePreview} />}
    </div>
  );
};

export default ShowTemplate;
