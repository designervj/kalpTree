"use client";

import TemplateHome from "@/components/admin/templates/TemplateHome";


const page = () => {
  return (
    <div>
      <TemplateHome/>
     
    </div>
  )
}

export default page

// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   Search,
//   Eye,
//   Download,
//   X,
//   SlidersHorizontal,
//   RefreshCcw,
//   ChevronDown,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// type DemoKey = "All" | "Shop" | "Home" | "Products" | "Categories";
// type CategoryKey =
//   | "ALL"
//   | "ABOUT"
//   | "BANNER"
//   | "BANNER SLIDERS"
//   | "CALL TO ACTION"
//   | "CAMPAIGNS"
//   | "ECOMMERCE"
//   | "FULL PAGE"
//   | "ICON BOXES"
//   | "IMAGE BOXES"
//   | "PRODUCTS";

// type TemplateItem = {
//   id: string;
//   title: string;
//   caption: string;
//   demo: DemoKey;
//   category: Exclude<CategoryKey, "ALL">;
//   accent: "red" | "blue" | "green" | "gray" | "pink";
// };

// const BG: Record<TemplateItem["accent"], string> = {
//   red: "from-rose-200 via-white to-rose-100",
//   blue: "from-blue-200 via-white to-blue-100",
//   green: "from-emerald-200 via-white to-emerald-100",
//   gray: "from-zinc-200 via-white to-zinc-100",
//   pink: "from-fuchsia-200 via-white to-fuchsia-100",
// };

// const DEMO_OPTIONS: DemoKey[] = ["All", "Shop", "Home", "Products", "Categories"];

// const CATEGORY_ORDER: CategoryKey[] = [
//   "ALL",
//   "ABOUT",
//   "BANNER",
//   "BANNER SLIDERS",
//   "CALL TO ACTION",
//   "CAMPAIGNS",
//   "ECOMMERCE",
//   "FULL PAGE",
//   "ICON BOXES",
//   "IMAGE BOXES",
//   "PRODUCTS",
// ];

// const TEMPLATES: TemplateItem[] = [
//   {
//     id: "t1",
//     title: "Shop 13 Category Banner",
//     caption: "Shop 13 Category Banner",
//     demo: "Shop",
//     category: "BANNER",
//     accent: "red",
//   },
//   {
//     id: "t2",
//     title: "Shop 4 - Sale campaign",
//     caption: "Shop 4 - Sale campaign",
//     demo: "Shop",
//     category: "CAMPAIGNS",
//     accent: "gray",
//   },
//   {
//     id: "t3",
//     title: "Home Intro Slider 01",
//     caption: "Shop 34 - Home intro slider",
//     demo: "Home",
//     category: "BANNER SLIDERS",
//     accent: "pink",
//   },
//   {
//     id: "t4",
//     title: "2 Columns Offer + Products",
//     caption: "Shop 35 - 2 columns with special offer and products",
//     demo: "Shop",
//     category: "ECOMMERCE",
//     accent: "green",
//   },
//   {
//     id: "t5",
//     title: "Banner + Products",
//     caption: "Shop 32 - column with banner and products",
//     demo: "Shop",
//     category: "ECOMMERCE",
//     accent: "gray",
//   },
//   {
//     id: "t6",
//     title: "Home Intro Slider 02",
//     caption: "Shop 38 - Home intro slider",
//     demo: "Home",
//     category: "BANNER SLIDERS",
//     accent: "blue",
//   },
//   {
//     id: "t7",
//     title: "Best Selling Products",
//     caption: "Products with best sellers",
//     demo: "Products",
//     category: "PRODUCTS",
//     accent: "gray",
//   },
//   {
//     id: "t8",
//     title: "Category Carousel",
//     caption: "category carousel section with triangle bottom shape",
//     demo: "Categories",
//     category: "FULL PAGE",
//     accent: "blue",
//   },
// ];

// function miniToast(msg: string) {
//   const el = document.createElement("div");
//   el.innerText = msg;
//   el.className =
//     "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-xl bg-black text-white px-4 py-2 text-sm shadow-lg";
//   document.body.appendChild(el);
//   setTimeout(() => el.remove(), 1400);
// }

// export default function Page() {
//   const [search, setSearch] = useState("");
//   const [demo, setDemo] = useState<DemoKey>("All");

//   // category dropdown (header list)
//   const [category, setCategory] = useState<CategoryKey>("ALL");
//   const [catOpen, setCatOpen] = useState(false);

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [selected, setSelected] = useState<TemplateItem | null>(null);

//   const categoryCounts = useMemo(() => {
//     const counts: Record<CategoryKey, number> = CATEGORY_ORDER.reduce(
//       (acc, k) => {
//         acc[k] = 0;
//         return acc;
//       },
//       {} as Record<CategoryKey, number>
//     );

//     const demoFiltered =
//       demo === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.demo === demo);

//     counts["ALL"] = demoFiltered.length;
//     for (const t of demoFiltered) counts[t.category] = (counts[t.category] ?? 0) + 1;

//     return counts;
//   }, [demo]);

//   const filtered = useMemo(() => {
//     let list = [...TEMPLATES];

//     if (demo !== "All") list = list.filter((t) => t.demo === demo);
//     if (category !== "ALL") list = list.filter((t) => t.category === category);

//     const q = search.trim().toLowerCase();
//     if (!q) return list;

//     return list.filter(
//       (t) => t.title.toLowerCase().includes(q) || t.caption.toLowerCase().includes(q)
//     );
//   }, [search, demo, category]);

//   const onPreview = (t: TemplateItem) => {
//     setSelected(t);
//     setPreviewOpen(true);
//   };

//   const onImport = (t: TemplateItem) => miniToast(`Imported: ${t.title}`);
//   const onSubmit = () => miniToast("Filters Applied");
//   const onRefreshStudio = () => miniToast("Studio Refreshed");

//   return (
//     <div className="min-h-screen">
      
//        <div className='flex justify-between mb-4'>

//      <BreadCrumbPage/>

//        <Link href="/admin/website/templates/create">

//         <Button>Add Template</Button>

//      </Link>

//     </div>

//       {/* TOP BAR */}
//       <div className="border-b bg-white">
//         <div className="flex items-center gap-3 px-4 py-2">
//           {/* Search */}
//           <div className="relative w-[220px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search"
//               className="h-9 w-full rounded border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-500"
//             />
//           </div>

//           {/* Filter by Demos */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-600 font-medium">Filter by Demos</span>
//        <Select
//             value={demo}
//             onValueChange={(v) => {
//                 setDemo(v as DemoKey);
//                 setCategory("ALL");
//             }}
//             >
//             <SelectTrigger className="h-9 w-[180px] rounded border border-gray-300 bg-white px-3 text-sm">
//                 <SelectValue placeholder="Select demo" />
//             </SelectTrigger>

//             <SelectContent>
//                 {DEMO_OPTIONS.map((d) => (
//                 <SelectItem key={d} value={d}>
//                     {d}
//                 </SelectItem>
//                 ))}
//             </SelectContent>
//             </Select>
//           </div>

//           {/* CATEGORY DROPDOWN */}
//           <div className="relative">
//             <button
//               onClick={() => setCatOpen((p) => !p)}
//               className="h-9 w-[220px] rounded border border-gray-300 bg-white px-3 text-sm outline-none flex items-center justify-between"
//             >
//               <span className="flex items-center gap-2">
//                 <span className="font-semibold tracking-wide">{category}</span>
//                 <span className="text-gray-500">{categoryCounts[category] ?? 0}</span>
//               </span>
//               <ChevronDown className="h-4 w-4 text-gray-500" />
//             </button>

//             {catOpen && (
//               <div className="absolute left-0 top-[44px] w-[260px] rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
//                 {CATEGORY_ORDER.map((k) => (
//                   <button
//                     key={k}
//                     onClick={() => {
//                       setCategory(k);
//                       setCatOpen(false);
//                     }}
//                     className="w-full text-left px-5 py-3 flex items-center justify-between border-b last:border-b-0 hover:bg-gray-50"
//                   >
//                     <span className="text-xs font-semibold tracking-widest text-gray-700">
//                       {k}
//                     </span>
//                     <span className="text-xs text-gray-500 font-semibold">
//                       {categoryCounts[k] ?? 0}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit */}
//           <Button
//             onClick={onSubmit}
//             // className="h-9 rounded bg-[#b18457] px-5 text-sm font-semibold text-white hover:opacity-90"
//           >
//             SUBMIT
//           </Button>

//           {/* Refresh Studio */}
//           <Button
//             onClick={onRefreshStudio}
//             // variant="secondary"
//              className="h-9 rounded bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-950 inline-flex items-center gap-2"
//           >
//             <RefreshCcw className="h-4 w-4" />
//             REFRESH STUDIO
//           </Button>

//           {/* <div className="ml-auto flex items-center gap-2">
//             <Button
//             variant="outline"
//             // className="hidden md:inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
//             >
//               <SlidersHorizontal className="h-4 w-4" />
//               FILTERS
//             </Button>
//             <button className="h-9 w-9 grid place-items-center rounded border border-gray-300 hover:bg-gray-50">
//               <X className="h-4 w-4 text-gray-600" />
//             </button>
//           </div> */}
//         </div>
//       </div>

//       {/* ✅ WHITE GRID AREA */}
//       <div className="bg-white p-6">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
//           {filtered.map((t) => (
//             <div key={t.id} className="space-y-2">
//               <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
//                 <div className="relative h-[190px]">
//                   {/* mock preview */}
//                   <div className={["absolute inset-0 bg-gradient-to-br", BG[t.accent]].join(" ")} />
//                   <div className="absolute inset-0 p-3">
//                     <div className="h-6 w-2/3 rounded bg-black/10" />
//                     <div className="mt-3 grid grid-cols-3 gap-2">
//                       <div className="h-12 rounded bg-black/10" />
//                       <div className="h-12 rounded bg-black/10" />
//                       <div className="h-12 rounded bg-black/10" />
//                     </div>
//                     <div className="mt-2 h-12 rounded bg-black/10" />
//                   </div>

//                   {/* hover actions */}
//                   <div className="absolute inset-0 grid place-items-center bg-white/55 opacity-0 transition-opacity group-hover:opacity-100">
//                     <div className="flex items-center gap-2 rounded-md bg-white shadow-md border px-3 py-2">
//                       <Button
//                         onClick={() => onPreview(t)}
//                         variant="outline"
//                         // className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-950"
//                       >
//                         <Eye className="h-4 w-4" />
//                         PREVIEW
//                       </Button>
//                       <Button
//                         onClick={() => onImport(t)}
//                         // className="inline-flex items-center gap-2 rounded-full bg-[#b18457] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
//                       >
//                         <Download className="h-4 w-4" />
//                         IMPORT
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center">
//                 <h4 className="text-xs font-semibold">{t.caption}</h4>
//                 </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PREVIEW MODAL */}
//       {previewOpen && selected && (
//         <div className="fixed inset-0 z-50">
//           <div className="absolute inset-0 bg-black/50" onClick={() => setPreviewOpen(false)} />
//           <div className="absolute left-1/2 top-1/2 w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b px-4 py-3">
//               <div>
//                 <div className="text-sm font-semibold">{selected.title}</div>
//                 <div className="text-xs text-gray-500">
//                   Demo: {selected.demo} • Category: {selected.category}
//                 </div>
//               </div>
//               <button
//                 onClick={() => setPreviewOpen(false)}
//                 className="h-9 w-9 grid place-items-center rounded border hover:bg-gray-50"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <div className="p-4">
//               <div className="overflow-hidden rounded-lg border">
//                 <div className={["h-[440px] w-full bg-gradient-to-br", BG[selected.accent]].join(" ")} />
//               </div>

//               <div className="mt-4 flex items-center justify-end gap-2">
//                 <button
//                   onClick={() => {
//                     miniToast(`Imported: ${selected.title}`);
//                     setPreviewOpen(false);
//                   }}
//                   className="rounded bg-[#b18457] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
//                 >
//                   Import
//                 </button>
//                 <button
//                   onClick={() => setPreviewOpen(false)}
//                   className="rounded border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* click outside closes dropdown */}
//       {catOpen && <div className="fixed inset-0 z-30" onClick={() => setCatOpen(false)} />}
//     </div>
//   );
// }
