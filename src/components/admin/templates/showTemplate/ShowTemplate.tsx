
"use client"
import BreadCrumbPage from '@/components/breadCrumb/BreadCrumbPage';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TemplateDocument } from '../TemplateType';
import {
  Search,
  Eye,
  Download,
  X,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TemplateTopBar from './TemplateTopBar';
import { setCurrentTemplate } from '@/hooks/slices/templates/TemplateSlice';
import PreviewTemplate from './PreviewTemplate';

type DemoKey = "All" | "Shop" | "Home" | "Products" | "Categories";
function miniToast(msg: string) {
  const el = document.createElement("div");
  el.innerText = msg;
  el.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-xl bg-black text-white px-4 py-2 text-sm shadow-lg";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}
const ShowTemplate = () => {

    const dispatch= useDispatch<AppDispatch>();
    const {allTemplate, currentTemplate, hasFetched, isLoading, error}= useSelector((state: RootState) => state.template);
 
    const [template,setTemplate]= useState<TemplateDocument[]>([])

    useEffect(()=>{
      setTemplate(allTemplate)
    },[allTemplate])
  const [search, setSearch] = useState("");
  const [demo, setDemo] = useState<DemoKey>("All");

  // category dropdown (header list)
  const [category, setCategory] = useState<string>("hero");
  const [catOpen, setCatOpen] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview=(data:TemplateDocument)=>{
  dispatch(setCurrentTemplate(data));
  setPreviewOpen(true);
  }

  const handleClosePreview=()=>{
    setPreviewOpen(false);
    dispatch(setCurrentTemplate(null));
  }

  const handleShowSelectedTemplate=(data:TemplateDocument[])=>{
    setTemplate(data)
  
  }
  return (
    <div className="min-h-screen">
      
       <div className='flex justify-between mb-4'>

     <BreadCrumbPage/>

       <Link href="/admin/website/templates/create">

        <Button>Add Template</Button>

     </Link>

    </div>
       
       <TemplateTopBar
       selectedTemplate={handleShowSelectedTemplate}
       />

      {/* ✅ WHITE GRID AREA */}
      <div className="bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {template.map((t) => (
            <div key={t.id} className="space-y-2">
              <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-[190px]">
                  {/* mock preview */}
                  {/* <div className={["absolute inset-0 bg-gradient-to-br", BG[t.accent]].join(" ")} /> */}
                  <div className="absolute inset-0 p-3">
                    <div className="h-6 w-2/3 rounded bg-black/10" />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="h-12 rounded bg-black/10" />
                      <div className="h-12 rounded bg-black/10" />
                      <div className="h-12 rounded bg-black/10" />
                    </div>
                    <div className="mt-2 h-12 rounded bg-black/10" />
                  </div>

                  {/* hover actions */}
                  <div className="absolute inset-0 grid place-items-center bg-white/55 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-md bg-white shadow-md border px-3 py-2">
                      <Button
                        onClick={() => handlePreview(t)}
                        variant="outline"
                        // className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-950"
                      >
                        <Eye className="h-4 w-4" />
                        PREVIEW
                      </Button>
                      <Button
                       // onClick={() => onImport(t)}
                        // className="inline-flex items-center gap-2 rounded-full bg-[#b18457] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                      >
                        <Download className="h-4 w-4" />
                        IMPORT
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-xs font-semibold">{t.label}</h4>
                </div>
            </div>
          ))}
        </div>
      </div>

      {previewOpen && (
        <PreviewTemplate 
        onClose={handleClosePreview}
        />
      )}

      {/* click outside closes dropdown */}
      {catOpen && <div className="fixed inset-0 z-30" onClick={() => setCatOpen(false)} />}
    </div>
  );
}

export default ShowTemplate