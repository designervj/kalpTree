"use client";

import HeaderHome from '@/components/admin/header/HeaderHome';
import React from 'react'

const page = () => {
  return (
    <>
      <HeaderHome />
    </>
  )
}

export default page
// import React, { useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   Bell,
//   Search,
//   User,
//   ChevronDown,
//   Plus,
//   Trash2,
//   ArrowUp,
//   ArrowDown,
//   Save,
//   X,
//   Layers,
//   LayoutDashboard,
//   FileText,
//   Settings,
// } from "lucide-react";

// import { toast } from "sonner";
// import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
// import { cn } from "@/lib/utils";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// /* ===================== TYPES ===================== */
// type MenuItem = {
//   id: string;
//   label: string;
//   url: string;
//   titleAttr: string;
//   newTab: boolean;
//   cssClasses: string;
//   description: string;
//   children: MenuItem[];
// };

// type TemplateKey =
//   | "simple"
//   | "agency"
//   | "saas"
//   | "ecommerce"
//   | "portfolio"
//   | "docs";

// /* ===================== HELPERS ===================== */
// const uid = () =>
//   typeof crypto !== "undefined" && "randomUUID" in crypto
//     ? crypto.randomUUID()
//     : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

// function clone<T>(x: T): T {
//   return JSON.parse(JSON.stringify(x));
// }

// function flattenTree(items: MenuItem[], parentId: string | null = null) {
//   const out: { id: string; label: string; parentId: string | null }[] = [];
//   for (const it of items) {
//     out.push({ id: it.id, label: it.label, parentId });
//     out.push(...flattenTree(it.children, it.id));
//   }
//   return out;
// }

// function removeById(items: MenuItem[], id: string): { next: MenuItem[]; removed?: MenuItem } {
//   const next = clone(items);

//   const walk = (arr: MenuItem[]): { removed?: MenuItem } => {
//     for (let i = 0; i < arr.length; i++) {
//       if (arr[i].id === id) {
//         const removed = arr.splice(i, 1)[0];
//         return { removed };
//       }
//       const r = walk(arr[i].children);
//       if (r.removed) return r;
//     }
//     return {};
//   };

//   const r = walk(next);
//   return { next, removed: r.removed };
// }

// function insertIntoParent(
//   items: MenuItem[],
//   parentId: string | null,
//   item: MenuItem,
//   index?: number
// ): MenuItem[] {
//   const next = clone(items);

//   const insert = (arr: MenuItem[]) => {
//     if (index === undefined || index < 0 || index > arr.length) arr.push(item);
//     else arr.splice(index, 0, item);
//   };

//   if (!parentId) {
//     insert(next);
//     return next;
//   }

//   const walk = (arr: MenuItem[]): boolean => {
//     for (const it of arr) {
//       if (it.id === parentId) {
//         insert(it.children);
//         return true;
//       }
//       if (walk(it.children)) return true;
//     }
//     return false;
//   };

//   walk(next);
//   return next;
// }

// function getParentAndSiblings(
//   items: MenuItem[],
//   id: string
// ): { parentId: string | null; siblings: MenuItem[] } | null {
//   // root?
//   for (const it of items) {
//     if (it.id === id) return { parentId: null, siblings: items };
//   }

//   const walk = (
//     arr: MenuItem[],
//     parentId: string
//   ): { parentId: string; siblings: MenuItem[] } | null => {
//     for (const it of arr) {
//       if (it.id === id) return { parentId, siblings: arr };
//       const deep = walk(it.children, it.id);
//       if (deep) return deep;
//     }
//     return null;
//   };

//   for (const root of items) {
//     const res = walk(root.children, root.id);
//     if (res) return res;
//   }
//   return null;
// }

// function isDescendant(items: MenuItem[], parentId: string, maybeChildId: string): boolean {
//   const walk = (arr: MenuItem[]): boolean => {
//     for (const it of arr) {
//       if (it.id === maybeChildId) return true;
//       if (walk(it.children)) return true;
//     }
//     return false;
//   };

//   const findParent = (arr: MenuItem[]): MenuItem | null => {
//     for (const it of arr) {
//       if (it.id === parentId) return it;
//       const deep = findParent(it.children);
//       if (deep) return deep;
//     }
//     return null;
//   };

//   const parent = findParent(items);
//   if (!parent) return false;
//   return walk(parent.children);
// }

// /* ===================== TEMPLATES ===================== */
// const makeItem = (label: string, url = "#", children: MenuItem[] = []): MenuItem => ({
//   id: uid(),
//   label,
//   url,
//   titleAttr: "",
//   newTab: false,
//   cssClasses: "",
//   description: "",
//   children,
// });

// const TEMPLATES: Record<TemplateKey, { name: string; items: MenuItem[] }> = {
//   simple: {
//     name: "Simple Site",
//     items: [
//       makeItem("Home", "/"),
//       makeItem("About", "/about"),
//       makeItem("Services", "/services"),
//       makeItem("Contact", "/contact"),
//     ],
//   },
//   agency: {
//     name: "Agency",
//     items: [
//       makeItem("Home", "/"),
//       makeItem("About", "/about"),
//       makeItem("Services", "/services", [
//         makeItem("Technology Consulting", "/services/technology"),
//         makeItem("ERP", "/services/erp"),
//         makeItem("AI & Machine Learning", "/services/ai-ml"),
//       ]),
//       makeItem("Case Studies", "/case-studies"),
//       makeItem("Blog", "/blog"),
//       makeItem("Contact", "/contact"),
//     ],
//   },
//   saas: {
//     name: "SaaS",
//     items: [
//       makeItem("Home", "/"),
//       makeItem("Product", "/product", [
//         makeItem("Features", "/product/features"),
//         makeItem("Integrations", "/product/integrations"),
//         makeItem("Security", "/product/security"),
//       ]),
//       makeItem("Pricing", "/pricing"),
//       makeItem("Resources", "/resources", [
//         makeItem("Docs", "/docs"),
//         makeItem("Guides", "/guides"),
//         makeItem("Changelog", "/changelog"),
//       ]),
//       makeItem("Company", "/company", [
//         makeItem("About", "/company/about"),
//         makeItem("Careers", "/company/careers"),
//         makeItem("Contact", "/company/contact"),
//       ]),
//     ],
//   },
//   ecommerce: {
//     name: "Ecommerce",
//     items: [
//       makeItem("Home", "/"),
//       makeItem("Shop", "/shop", [
//         makeItem("New Arrivals", "/shop/new"),
//         makeItem("Best Sellers", "/shop/best"),
//         makeItem("Sale", "/shop/sale"),
//       ]),
//       makeItem("Categories", "/categories", [
//         makeItem("Men", "/categories/men"),
//         makeItem("Women", "/categories/women"),
//         makeItem("Kids", "/categories/kids"),
//       ]),
//       makeItem("About", "/about"),
//       makeItem("Support", "/support"),
//     ],
//   },
//   portfolio: {
//     name: "Portfolio",
//     items: [
//       makeItem("Home", "/"),
//       makeItem("Work", "/work", [
//         makeItem("Web", "/work/web"),
//         makeItem("Branding", "/work/branding"),
//         makeItem("UI/UX", "/work/ui-ux"),
//       ]),
//       makeItem("Services", "/services"),
//       makeItem("Testimonials", "/testimonials"),
//       makeItem("Contact", "/contact"),
//     ],
//   },
//   docs: {
//     name: "Docs / Knowledge Base",
//     items: [
//       makeItem("Home", "/"),
//       makeItem("Docs", "/docs", [
//         makeItem("Getting Started", "/docs/getting-started"),
//         makeItem("API Reference", "/docs/api"),
//         makeItem("SDKs", "/docs/sdks"),
//       ]),
//       makeItem("Tutorials", "/tutorials"),
//       makeItem("Community", "/community"),
//       makeItem("Support", "/support"),
//     ],
//   },
// };

// /* ===================== HEADER MENU PREVIEW (dropdown) ===================== */
// function HeaderMenu({
//   menus,
//   activeIdx,
//   setActiveIdx,
// }: {
//   menus: MenuItem[];
//   activeIdx: number | null;
//   setActiveIdx: (v: number | null) => void;
// }) {
//   return (
//     <nav className="hidden md:flex items-center gap-2">
//       {menus.map((m, i) => (
//         <div key={m.id} className="relative">
//           <button
//             type="button"
//             onClick={() => setActiveIdx(activeIdx === i ? null : i)}
//             className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted/60 flex items-center gap-2"
//             title={m.titleAttr || m.label}
//           >
//             <span className="truncate max-w-[140px]">{m.label}</span>
//             {m.children.length > 0 && <ChevronDown className="h-4 w-4" />}
//           </button>

//           {m.children.length > 0 && activeIdx === i && (
//             <div className="absolute top-11 left-0 bg-white border shadow-lg rounded-md min-w-[220px] z-50 overflow-hidden">
//               {m.children.map((c) => (
//                 <div key={c.id} className="px-3 py-2 hover:bg-muted/40">
//                   <Link
//                     href={c.url || "#"}
//                     target={c.newTab ? "_blank" : undefined}
//                     className="block text-sm"
//                     title={c.titleAttr || c.label}
//                   >
//                     <div className="font-medium">{c.label}</div>
//                     {c.description ? (
//                       <div className="text-xs text-muted-foreground truncate">
//                         {c.description}
//                       </div>
//                     ) : null}
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </nav>
//   );
// }

// /* ===================== MAIN PAGE ===================== */
// export default function Page() {
//   const [logoText, setLogoText] = useState("Admin CMS");
//   const [theme, setTheme] = useState<"light" | "dark">("light");

//   // header controls (moved down panel)
//   const [showSearch, setShowSearch] = useState(true);
//   const [showNotification, setShowNotification] = useState(true);
//   const [showProfile, setShowProfile] = useState(true);

//   // templates + menu data
//   const [templateKey, setTemplateKey] = useState<TemplateKey>("agency");
//   const [menus, setMenus] = useState<MenuItem[]>(clone(TEMPLATES["agency"].items));
//   const [selectedId, setSelectedId] = useState<string | null>(menus?.[0]?.id ?? null);

//   // header dropdown open
//   const [openHeaderMenuIdx, setOpenHeaderMenuIdx] = useState<number | null>(null);

//   const selectedItem = useMemo(() => {
//     if (!selectedId) return null;
//     const walk = (arr: MenuItem[]): MenuItem | null => {
//       for (const it of arr) {
//         if (it.id === selectedId) return it;
//         const deep = walk(it.children);
//         if (deep) return deep;
//       }
//       return null;
//     };
//     return walk(menus);
//   }, [menus, selectedId]);

//   const [draft, setDraft] = useState({
//     label: "",
//     url: "",
//     titleAttr: "",
//     newTab: false,
//     cssClasses: "",
//     description: "",
//   });

//   React.useEffect(() => {
//     if (!selectedItem) return;
//     setDraft({
//       label: selectedItem.label,
//       url: selectedItem.url,
//       titleAttr: selectedItem.titleAttr,
//       newTab: selectedItem.newTab,
//       cssClasses: selectedItem.cssClasses,
//       description: selectedItem.description,
//     });
//   }, [selectedItem?.id]);

//   const flat = useMemo(() => flattenTree(menus), [menus]);

//   const currentParentInfo = useMemo(() => {
//     if (!selectedId) return null;
//     return getParentAndSiblings(menus, selectedId);
//   }, [menus, selectedId]);

//   const currentOrderInfo = useMemo(() => {
//     if (!selectedId || !currentParentInfo) return null;
//     const idx = currentParentInfo.siblings.findIndex((x) => x.id === selectedId);
//     return { index: idx, total: currentParentInfo.siblings.length };
//   }, [selectedId, currentParentInfo]);

//   /* ===== ACTIONS ===== */
//   const loadTemplate = (key: TemplateKey) => {
//     setTemplateKey(key);
//     const items = clone(TEMPLATES[key].items);
//     setMenus(items);
//     setSelectedId(items?.[0]?.id ?? null);
//     setOpenHeaderMenuIdx(null);
//     toast.success(`Template loaded: ${TEMPLATES[key].name}`);
//   };

//   const addRootItem = () => {
//     const newItem = makeItem("New Menu Item", "#");
//     setMenus((prev) => [...clone(prev), newItem]);
//     setSelectedId(newItem.id);
//   };

//   const addSubItem = () => {
//     if (!selectedId) return toast.error("Select a menu item first");
//     const child = makeItem("New Sub Item", "#");
//     const next = clone(menus);

//     const walk = (arr: MenuItem[]): boolean => {
//       for (const it of arr) {
//         if (it.id === selectedId) {
//           it.children.push(child);
//           return true;
//         }
//         if (walk(it.children)) return true;
//       }
//       return false;
//     };

//     walk(next);
//     setMenus(next);
//     setSelectedId(child.id);
//   };

//   const saveEdit = () => {
//     if (!selectedId) return;
//     const next = clone(menus);

//     const walk = (arr: MenuItem[]): boolean => {
//       for (const it of arr) {
//         if (it.id === selectedId) {
//           it.label = draft.label;
//           it.url = draft.url;
//           it.titleAttr = draft.titleAttr;
//           it.newTab = draft.newTab;
//           it.cssClasses = draft.cssClasses;
//           it.description = draft.description;
//           return true;
//         }
//         if (walk(it.children)) return true;
//       }
//       return false;
//     };

//     walk(next);
//     setMenus(next);
//     toast.success("Menu item saved");
//   };

//   const cancelEdit = () => {
//     if (!selectedItem) return;
//     setDraft({
//       label: selectedItem.label,
//       url: selectedItem.url,
//       titleAttr: selectedItem.titleAttr,
//       newTab: selectedItem.newTab,
//       cssClasses: selectedItem.cssClasses,
//       description: selectedItem.description,
//     });
//     toast.message("Changes reverted");
//   };

//   const removeSelected = () => {
//     if (!selectedId) return;
//     const { next } = removeById(menus, selectedId);
//     setMenus(next);
//     setSelectedId(next?.[0]?.id ?? null);
//     setOpenHeaderMenuIdx(null);
//     toast.success("Menu item removed");
//   };

//   const moveUp = () => {
//     if (!selectedId || !currentParentInfo) return;
//     const next = clone(menus);

//     const apply = (arr: MenuItem[]) => {
//       const idx = arr.findIndex((x) => x.id === selectedId);
//       if (idx > 0) {
//         const tmp = arr[idx - 1];
//         arr[idx - 1] = arr[idx];
//         arr[idx] = tmp;
//       }
//     };

//     if (!currentParentInfo.parentId) {
//       apply(next);
//     } else {
//       const walk = (arr: MenuItem[]): boolean => {
//         for (const it of arr) {
//           if (it.id === currentParentInfo.parentId) {
//             apply(it.children);
//             return true;
//           }
//           if (walk(it.children)) return true;
//         }
//         return false;
//       };
//       walk(next);
//     }

//     setMenus(next);
//   };

//   const moveDown = () => {
//     if (!selectedId || !currentParentInfo) return;
//     const next = clone(menus);

//     const apply = (arr: MenuItem[]) => {
//       const idx = arr.findIndex((x) => x.id === selectedId);
//       if (idx >= 0 && idx < arr.length - 1) {
//         const tmp = arr[idx + 1];
//         arr[idx + 1] = arr[idx];
//         arr[idx] = tmp;
//       }
//     };

//     if (!currentParentInfo.parentId) {
//       apply(next);
//     } else {
//       const walk = (arr: MenuItem[]): boolean => {
//         for (const it of arr) {
//           if (it.id === currentParentInfo.parentId) {
//             apply(it.children);
//             return true;
//           }
//           if (walk(it.children)) return true;
//         }
//         return false;
//       };
//       walk(next);
//     }

//     setMenus(next);
//   };

//   const changeParent = (newParentId: string | null) => {
//     if (!selectedId) return;

//     if (newParentId === selectedId) return toast.error("Invalid parent");
//     if (newParentId && isDescendant(menus, selectedId, newParentId)) {
//       return toast.error("Invalid parent (cannot set descendant as parent)");
//     }

//     const { next: removedTree, removed } = removeById(menus, selectedId);
//     if (!removed) return;

//     const inserted = insertIntoParent(removedTree, newParentId, removed);
//     setMenus(inserted);
//     toast.success("Parent updated");
//   };

//   const changeOrder = (newIndex: number) => {
//     if (!selectedId || !currentParentInfo) return;
//     const next = clone(menus);

//     const reorder = (arr: MenuItem[]) => {
//       const idx = arr.findIndex((x) => x.id === selectedId);
//       if (idx < 0) return;
//       const [it] = arr.splice(idx, 1);
//       arr.splice(newIndex, 0, it);
//     };

//     if (!currentParentInfo.parentId) {
//       reorder(next);
//     } else {
//       const walk = (arr: MenuItem[]): boolean => {
//         for (const it of arr) {
//           if (it.id === currentParentInfo.parentId) {
//             reorder(it.children);
//             return true;
//           }
//           if (walk(it.children)) return true;
//         }
//         return false;
//       };
//       walk(next);
//     }

//     setMenus(next);
//     toast.success("Order updated");
//   };

//   /* ===== TREE RENDER ===== */
//   const renderTree = (items: MenuItem[], depth = 0) =>
//     items.map((it) => {
//       const active = it.id === selectedId;
//       return (
//         <div key={it.id} className="space-y-2">
//           <button
//             type="button"
//             onClick={() => setSelectedId(it.id)}
//             className={[
//               "w-full text-left rounded-md border px-3 py-2 flex items-center justify-between gap-3",
//               active ? "border-black bg-white" : "border-muted bg-muted/20 hover:bg-muted/40",
//             ].join(" ")}
//             style={{ marginLeft: depth * 16 }}
//           >
//             <div className="min-w-0">
//               <div className="font-semibold truncate">{it.label}</div>
//               <div className="text-xs text-muted-foreground truncate">
//                 {it.url || "#"} {it.children.length ? "• has sub items" : ""}
//               </div>
//             </div>

//             <div className="flex items-center gap-2 shrink-0">
//               {it.children.length > 0 && (
//                 <Badge variant="secondary" className="rounded-full">
//                   {it.children.length}
//                 </Badge>
//               )}
//               <ChevronDown className="h-4 w-4 text-muted-foreground" />
//             </div>
//           </button>

//           {it.children.length > 0 && (
//             <div className="space-y-2">{renderTree(it.children, depth + 1)}</div>
//           )}
//         </div>
//       );
//     });

//   return (
//     <div className={theme === "dark" ? "bg-gray-900 text-white min-h-screen" : " min-h-screen"}>
//       <div className="mb-6">
//         <BreadCrumbPage />
//       </div>

//       {/* ✅ HEADER PREVIEW (NOW SHOWS MENUS) */}
//       <header className={theme === "dark" ? "bg-gray-800 text-white shadow" : "bg-white text-gray-800 shadow"}>
//         <div className="flex items-center justify-between px-6 py-3 gap-4">
//           {/* left logo */}
//           <div className="flex items-center gap-3 shrink-0">
//             <div className="h-10 w-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg">
//               {logoText.charAt(0)}
//             </div>
//             <input
//               value={logoText}
//               onChange={(e) => setLogoText(e.target.value)}
//               className="bg-transparent border-b border-gray-300 focus:outline-none text-lg font-semibold w-40"
//             />
//           </div>

//           {/* ✅ center menu preview */}
//           <div className="flex-1 flex justify-center">
//             <HeaderMenu
//               menus={menus}
//               activeIdx={openHeaderMenuIdx}
//               setActiveIdx={setOpenHeaderMenuIdx}
//             />
//           </div>

//           {/* right actions preview */}
//           <div className="flex items-center gap-3 shrink-0">
//             {showSearch && (
//               <div className="relative hidden sm:block">
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                 <input
//                   placeholder="Search..."
//                   className="pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-black"
//                 />
//               </div>
//             )}

//             {showNotification && (
//               <button className="relative p-2 rounded-lg hover:bg-gray-100">
//                 <Bell className="h-5 w-5 text-gray-600" />
//                 <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
//               </button>
//             )}

//             {showProfile && (
//               <div className="flex items-center gap-2 cursor-pointer">
//                 <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
//                   <User className="h-5 w-5 text-gray-600" />
//                 </div>
//                 <span className="hidden sm:block text-sm font-medium text-gray-700">
//                   Admin
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="p-6 space-y-6">
//         {/* ✅ moved checkbox controls BELOW header */}
//         <Card className="rounded-md p-4 bg-white">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <h2 className="text-lg font-semibold">Header Controls</h2>
//               <p className="text-sm text-muted-foreground">
//                 Toggle karke header preview me live changes dekho.
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               <label className="flex items-center gap-2 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={showSearch}
//                   onChange={() => setShowSearch(!showSearch)}
//                 />
//                 Search
//               </label>
//               <label className="flex items-center gap-2 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={showNotification}
//                   onChange={() => setShowNotification(!showNotification)}
//                 />
//                 Notif
//               </label>
//               <label className="flex items-center gap-2 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={showProfile}
//                   onChange={() => setShowProfile(!showProfile)}
//                 />
//                 Profile
//               </label>
//             </div>
//           </div>
//         </Card>

//         {/* Top controls */}
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2">
//               <Layers className="h-4 w-4 text-muted-foreground" />
//               <span className="font-semibold">Menu Templates</span>
//             </div>

//             <Select value={templateKey} onValueChange={(v) => loadTemplate(v as TemplateKey)}>
//               <SelectTrigger className="w-[240px] rounded-md bg-white">
//                 <SelectValue placeholder="Select template" />
//               </SelectTrigger>
//               <SelectContent>
//                 {Object.entries(TEMPLATES).map(([key, t]) => (
//                   <SelectItem key={key} value={key}>
//                     {t.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <div className="flex items-center gap-2">
//               <span className="text-sm text-muted-foreground">Theme</span>
//               <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
//                 <SelectTrigger className="w-[140px] rounded-md bg-white">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="light">Light</SelectItem>
//                   <SelectItem value="dark">Dark</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button onClick={addRootItem} className="rounded-md">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Menu Item
//             </Button>
//             <Button onClick={addSubItem} variant="secondary" className="rounded-md">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Sub Item
//             </Button>
//           </div>
//         </div>

//         {/* Two column layout */}
//         <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
//           {/* LEFT: structure */}
//           <Card className="rounded-md p-4 bg-white">
//             <div className="flex items-center justify-between mb-3">
//               <div>
//                 <h2 className="text-lg font-semibold">Menu Structure</h2>
//                 <p className="text-sm text-muted-foreground">Click any item to edit.</p>
//               </div>
//               <Badge variant="secondary" className="rounded-full">
//                 {flat.length} items
//               </Badge>
//             </div>

//             <Separator className="my-3" />
//             <div className="space-y-3">{renderTree(menus)}</div>
//           </Card>

//           {/* RIGHT: editor */}
//           <Card className="rounded-md p-5 bg-white">
//             {!selectedItem ? (
//               <div className="text-sm text-muted-foreground">Select a menu item to edit.</div>
//             ) : (
//               <div className="space-y-5">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <h2 className="text-lg font-semibold">{selectedItem.label}</h2>
//                     <p className="text-sm text-muted-foreground">Edit menu item (WordPress style).</p>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Button variant="secondary" className="rounded-md" onClick={moveUp}>
//                       <ArrowUp className="h-4 w-4 mr-2" /> Up
//                     </Button>
//                     <Button variant="secondary" className="rounded-md" onClick={moveDown}>
//                       <ArrowDown className="h-4 w-4 mr-2" /> Down
//                     </Button>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <Label>Navigation Label</Label>
//                   <Input
//                     value={draft.label}
//                     onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))}
//                     className="rounded-md"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>URL</Label>
//                   <Input
//                     value={draft.url}
//                     onChange={(e) => setDraft((p) => ({ ...p, url: e.target.value }))}
//                     className="rounded-md"
//                     placeholder="/about or https://..."
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Title Attribute</Label>
//                   <Input
//                     value={draft.titleAttr}
//                     onChange={(e) => setDraft((p) => ({ ...p, titleAttr: e.target.value }))}
//                     className="rounded-md"
//                     placeholder="optional"
//                   />
//                 </div>

//                 <div className="flex items-center justify-between rounded-md border p-3">
//                   <div>
//                     <p className="font-medium text-sm">Open link in a new tab</p>
//                     <p className="text-xs text-muted-foreground">target=_blank</p>
//                   </div>
//                   <Switch checked={draft.newTab} onCheckedChange={(v) => setDraft((p) => ({ ...p, newTab: v }))} />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>CSS Classes (optional)</Label>
//                   <Input
//                     value={draft.cssClasses}
//                     onChange={(e) => setDraft((p) => ({ ...p, cssClasses: e.target.value }))}
//                     className="rounded-md"
//                     placeholder="e.g. primary-menu highlight"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Description</Label>
//                   <Textarea
//                     value={draft.description}
//                     onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
//                     rows={4}
//                     className="rounded-md"
//                     placeholder="Menu description (theme supports then show in menu)"
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     The description will be displayed in the menu if the active theme supports it.
//                   </p>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <Label>Menu Parent</Label>
//                     <Select
//                       value={currentParentInfo?.parentId ?? "none"}
//                       onValueChange={(v) => changeParent(v === "none" ? null : v)}
//                     >
//                       <SelectTrigger className="rounded-md">
//                         <SelectValue placeholder="Select parent" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="none">No Parent</SelectItem>
//                         {flat
//                           .filter((x) => x.id !== selectedId)
//                           .filter((x) => !isDescendant(menus, selectedId!, x.id))
//                           .map((x) => (
//                             <SelectItem key={x.id} value={x.id}>
//                               {x.label}
//                             </SelectItem>
//                           ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Menu Order</Label>
//                     <Select value={String(currentOrderInfo?.index ?? 0)} onValueChange={(v) => changeOrder(Number(v))}>
//                       <SelectTrigger className="rounded-md">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {Array.from({ length: currentOrderInfo?.total ?? 1 }).map((_, i) => (
//                           <SelectItem key={i} value={String(i)}>
//                             {i + 1} of {currentOrderInfo?.total ?? 1}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     <Button onClick={saveEdit} className="rounded-md">
//                       <Save className="h-4 w-4 mr-2" />
//                       Save
//                     </Button>
//                     <Button variant="secondary" onClick={cancelEdit} className="rounded-md">
//                       <X className="h-4 w-4 mr-2" />
//                       Cancel
//                     </Button>
//                   </div>

//                   <Button variant="destructive" onClick={removeSelected} className="rounded-md">
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Remove
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }
