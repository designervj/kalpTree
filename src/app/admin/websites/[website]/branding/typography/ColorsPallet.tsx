// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Copy,
//   LayoutGrid,
//   Lock,
//   Unlock,
//   Plus,
//   Pencil,
//   Trash2,
//   ChevronLeft,
// } from "lucide-react";
// import { PaletteCard } from "./ShadePanelOverlay";
// import { EditorTab } from "./EditorTab";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";

// export type BrandTokens = {
//   primary: string;
//   secondary: string;
//   accent: string;
//   dark: string;
//   text: string;
//   mutedText: string;
//   border: string;
//   ring: string;
// };

// export type ButtonVariant = "primary" | "secondary" | "outline";

// export type ButtonTokens = Record<
//   ButtonVariant,
//   {
//     bg: string;
//     text: string;
//     border: string;
//     hoverBg: string;
//     hoverText: string;
//     hoverBorder: string;
//   }
// >;

// export type EditorSection = "brand" | "buttons" | "preview";
// export type SelectedToken =
//   | { type: "brand"; key: keyof BrandTokens }
//   | { type: "button"; key: string }
//   | null;

// /* ─────────────────────────────────────────────
//    Main studio (LOCAL STATE ONLY)
// ───────────────────────────────────────────── */
// export default function ColorPaletteStudio() {
//   const { currentBusiness } = useSelector((state: RootState) => state.business);

//   const [tab, setTab] = useState<"all" | "edit">("all");
//   const [palettes, setPalettes] = useState<any[]>([]);
//   const [editing, setEditing] = useState<any>(null);

//   // ✅ loading state for first load
//   const [isBooting, setIsBooting] = useState(true);

//   useEffect(() => {
//     // If currentWebsite hasn't arrived yet, keep booting
//     if (!currentBusiness) {
//       setIsBooting(true);
//       return;
//     }

//     // currentWebsite is available now
//     setIsBooting(false);

//     // hydrate palettes if branding exists
//     if (currentBusiness?.website?.branding?.colors) {
//       setPalettes(currentBusiness?.website?.branding?.colors);
//     } else {
//       setPalettes([]);
//     }
//   }, [currentBusiness]);

//   const handleSave = (p: any) => {
//     setPalettes((prev) => {
//       let updated: any[];

//       if (!editing) {
//         const exists = prev.find((x) => x._id === p._id);

//         updated = exists
//           ? prev.map((x) => (x._id === p._id ? p : x))
//           : [p, ...prev];
//       } else {
//         updated = prev.map((x) => (x._id === editing._id ? p : x));
//       }

//       // 🔥 Ensure only one global palette
//       if (p.isGlobal) {
//         updated = updated.map((x) =>
//           x._id === p._id
//             ? { ...x, isGlobal: true }
//             : { ...x, isGlobal: false },
//         );
//       }

//       return updated;
//     });

//     setTab("all");
//     setEditing(null);
//   };

//   const handleDelete = async (id: string) => {
//     if (!currentBusiness) return;
//     try {
//       const req = await fetch(
//         `/api/admin/color-pallet?tenantId=${currentBusiness._id}&palletId=${id}`,
//         {
//           method: "DELETE",
//         },
//       );
//       const res = await req.json();

//       if (res.success) {
//         setPalettes((prev) => prev.filter((p) => p._id !== id));
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleEdit = (p: any) => {
//     setEditing(p);
//     setTab("edit");
//   };

//   const handleNew = () => {
//     setEditing(null);
//     setTab("edit");
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }
//         html, body { height: 100%; }
//         body { margin: 0; overflow: hidden; font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; background: #F3F5F9; color: #111827; }
//         ::-webkit-scrollbar { width: 8px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.18); border-radius: 999px; }
//         input[type="color"] { -webkit-appearance: none; border: none; padding: 0; background: transparent; }
//         input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
//         input[type="color"]::-webkit-color-swatch { border: none; border-radius: 10px; }

//         /* ✅ Loading screen animations */
//         @keyframes ktSpin { to { transform: rotate(360deg); } }
//         @keyframes ktShimmer {
//           0% { background-position: -200% 0; }
//           100% { background-position: 200% 0; }
//         }
//         .kt-shimmer {
//           background: linear-gradient(90deg,
//             rgba(15,23,42,.06) 0%,
//             rgba(15,23,42,.12) 35%,
//             rgba(15,23,42,.06) 70%
//           );
//           background-size: 200% 100%;
//           animation: ktShimmer 1.2s ease-in-out infinite;
//         }
//       `}</style>

//       {/* ✅ FULLSCREEN LOADING OVERLAY */}
//       {isBooting && (
//         <div
//           className="fixed inset-0 z-[9999] flex items-center justify-center"
//           style={{
//             background:
//               "radial-gradient(1200px 600px at 30% 20%, rgba(22,163,74,.10), transparent 55%), radial-gradient(900px 500px at 80% 60%, rgba(17,24,39,.08), transparent 60%), #F3F5F9",
//           }}
//         >
//           <div
//             className="w-[520px] max-w-[92vw] rounded-3xl border bg-white/80 backdrop-blur-xl p-6 shadow-[0_18px_60px_rgba(2,6,23,.14)]"
//             style={{ borderColor: "rgba(0,0,0,0.10)" }}
//           >
//             <div className="flex items-center gap-3">
//               <div
//                 className="h-12 w-12 rounded-2xl border flex items-center justify-center"
//                 style={{
//                   borderColor: "rgba(0,0,0,0.10)",
//                   background:
//                     "linear-gradient(135deg, rgba(22,163,74,.12), rgba(17,24,39,.06))",
//                 }}
//               >
//                 <div
//                   className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-900"
//                   style={{ animation: "ktSpin 1s linear infinite" }}
//                 />
//               </div>

//               <div className="min-w-0">
//                 <div className="text-[14px] font-medium tracking-tight">
//                   Loading workspace
//                 </div>
//                 <div className="text-[12px] text-slate-500 font-medium">
//                   fetching currentWebsite • syncing branding
//                 </div>
//               </div>

//               <div className="ml-auto text-[11px] font-medium text-slate-400">
//                 palette<span style={{ color: "#16A34A" }}>.</span>studio
//               </div>
//             </div>

//             <div
//               className="mt-5 rounded-2xl border p-4 bg-white"
//               style={{ borderColor: "rgba(0,0,0,0.08)" }}
//             >
//               <div className="flex items-center justify-between mb-3">
//                 <div className="h-3 w-40 rounded-full kt-shimmer" />
//                 <div className="h-3 w-16 rounded-full kt-shimmer" />
//               </div>

//               <div
//                 className="grid gap-3"
//                 style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
//               >
//                 {Array.from({ length: 6 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="rounded-2xl border p-3"
//                     style={{
//                       borderColor: "rgba(0,0,0,0.08)",
//                       background: "rgba(248,250,252,0.8)",
//                     }}
//                   >
//                     <div className="h-8 rounded-xl kt-shimmer mb-3" />
//                     <div className="h-3 rounded-full kt-shimmer mb-2" />
//                     <div className="h-3 w-2/3 rounded-full kt-shimmer" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <div className="text-[12px] text-slate-600">
//                 Preparing palettes & editor…
//               </div>
//               <div className="text-[11px] font-medium text-slate-400">
//                 please wait
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MAIN APP */}
//       <div className="h-screen flex flex-col p-6 pt-2 ">
//         {/* TOP BAR */}
//         <div
//           className="px-5 py-3 border-b flex items-center gap-3 rounded-t-lg"
//           style={{ background: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}
//         >
//           <div className="text-[15px] font-medium tracking-tight">
//             Palette<span style={{ color: "#16A34A" }}>.</span>studio
//           </div>

//           <div
//             className="w-px h-5"
//             style={{ background: "rgba(0,0,0,0.08)" }}
//           />

//           <div
//             className="inline-flex rounded-xl border p-1"
//             style={{ borderColor: "rgba(0,0,0,0.10)", background: "#F8FAFC" }}
//           >
//             <button
//               onClick={() => {
//                 setTab("all");
//                 setEditing(null);
//               }}
//               className="h-9 px-4 rounded-lg text-[12px] font-bold transition"
//               style={{
//                 background: tab === "all" ? "#111827" : "transparent",
//                 color: tab === "all" ? "#FFFFFF" : "#111827",
//               }}
//             >
//               All Palettes
//             </button>

//             <button
//               onClick={handleNew}
//               className="h-9 px-4 rounded-lg text-[12px] font-medium transition"
//               style={{
//                 background: tab === "edit" ? "#111827" : "transparent",
//                 color: tab === "edit" ? "#FFFFFF" : "#111827",
//               }}
//             >
//               {tab === "edit" && editing
//                 ? `Editing: ${editing.name}`
//                 : "Create New"}
//             </button>
//           </div>

//           <div className="ml-auto flex items-center gap-3">
//             <div className="text-[11px] font-medium text-slate-500">
//               {palettes.length} saved (local state)
//             </div>

//             <button
//               onClick={handleNew}
//               className="h-10 px-4 rounded-xl border bg-white hover:bg-slate-50 flex items-center gap-2"
//               style={{ borderColor: "rgba(0,0,0,0.10)" }}
//             >
//               <Plus size={16} />
//               <span className="text-[12px] font-medium">New</span>
//             </button>
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="flex-1 min-h-0 flex">
//           {tab === "all" && (
//             <div className="flex-1 min-h-0 overflow-y-auto p-5">
//               {palettes.length === 0 ? (
//                 <div className="h-full flex flex-col items-center justify-center gap-4">
//                   <div
//                     className="h-16 w-16 rounded-2xl border flex items-center justify-center text-2xl"
//                     style={{
//                       borderColor: "rgba(0,0,0,0.10)",
//                       background: "rgba(255,255,255,0.8)",
//                     }}
//                   >
//                     🎨
//                   </div>
//                   <div className="text-slate-700 font-medium text-[14px]">
//                     No palettes yet
//                   </div>
//                   <button
//                     onClick={handleNew}
//                     className="h-11 px-6 rounded-xl border bg-white hover:bg-slate-50 text-[12px] font-medium"
//                     style={{ borderColor: "rgba(0,0,0,0.10)" }}
//                   >
//                     + Create First Palette
//                   </button>
//                 </div>
//               ) : (
//                 <div
//                   className="grid gap-4"
//                   style={{
//                     gridTemplateColumns:
//                       "repeat(auto-fill, minmax(320px, 1fr))",
//                   }}
//                 >
//                   {palettes.map((p) => (
//                     <PaletteCard
//                       key={p._id}
//                       palette={p}
//                       onEdit={handleEdit}
//                       onDelete={handleDelete}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {tab === "edit" && (
//             <EditorTab
//               editingPalette={editing}
//               onSave={handleSave}
//               onCancel={() => {
//                 setTab("all");
//                 setEditing(null);
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Copy,
  LayoutGrid,
  Lock,
  Unlock,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { PaletteCard } from "./ShadePanelOverlay";
import { EditorTab } from "./EditorTab";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export type BrandTokens = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  mutedText: string;
  border: string;
  ring: string;
};

export type ButtonVariant = "primary" | "secondary" | "outline";

export type ButtonTokens = Record<
  ButtonVariant,
  {
    bg: string;
    text: string;
    border: string;
    hoverBg: string;
    hoverText: string;
    hoverBorder: string;
  }
>;

export type EditorSection = "brand" | "buttons" | "preview";
export type SelectedToken =
  | { type: "brand"; key: keyof BrandTokens }
  | { type: "button"; key: string }
  | null;

/* ─────────────────────────────────────────────
   Main studio (LOCAL STATE ONLY)
───────────────────────────────────────────── */
export default function ColorPaletteStudio() {
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const [tab, setTab] = useState<"all" | "edit">("all");
  const [palettes, setPalettes] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  // ✅ loading state for first load
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // If currentWebsite hasn't arrived yet, keep booting
    if (!currentBusiness) {
      setIsBooting(true);
      return;
    }

    // currentWebsite is available now
    setIsBooting(false);

    // hydrate palettes if branding exists
    if (currentBusiness?.website?.branding?.colors) {
      setPalettes(currentBusiness?.website?.branding?.colors);
    } else {
      setPalettes([]);
    }
  }, [currentBusiness]);

  const handleSave = (p: any) => {
    setPalettes((prev) => {
      let updated: any[];

      if (!editing) {
        const exists = prev.find((x) => x._id === p._id);

        updated = exists
          ? prev.map((x) => (x._id === p._id ? p : x))
          : [p, ...prev];
      } else {
        updated = prev.map((x) => (x._id === editing._id ? p : x));
      }

      // 🔥 Ensure only one global palette
      if (p.isGlobal) {
        updated = updated.map((x) =>
          x._id === p._id
            ? { ...x, isGlobal: true }
            : { ...x, isGlobal: false },
        );
      }

      return updated;
    });

    setTab("all");
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!currentBusiness) return;
    try {
      const req = await fetch(
        `/api/admin/color-pallet?tenantId=${currentBusiness._id}&palletId=${id}`,
        {
          method: "DELETE",
        },
      );
      const res = await req.json();

      if (res.success) {
        setPalettes((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (p: any) => {
    setEditing(p);
    setTab("edit");
  };

  const handleNew = () => {
    setEditing(null);
    setTab("edit");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { height: 100%; }
        body { margin: 0; overflow: hidden; font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; background: #F3F5F9; color: #111827; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.18); border-radius: 999px; }
        input[type="color"] { -webkit-appearance: none; border: none; padding: 0; background: transparent; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 10px; }

        /* ✅ Loading screen animations */
        @keyframes ktSpin { to { transform: rotate(360deg); } }
        @keyframes ktShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .kt-shimmer {
          background: linear-gradient(90deg,
            rgba(15,23,42,.06) 0%,
            rgba(15,23,42,.12) 35%,
            rgba(15,23,42,.06) 70%
          );
          background-size: 200% 100%;
          animation: ktShimmer 1.2s ease-in-out infinite;
        }
      `}</style>

      {/* ✅ FULLSCREEN LOADING OVERLAY */}
      {isBooting && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background:
              "radial-gradient(1200px 600px at 30% 20%, rgba(22,163,74,.10), transparent 55%), radial-gradient(900px 500px at 80% 60%, rgba(17,24,39,.08), transparent 60%), #F3F5F9",
          }}
        >
          <div
            className="w-[520px] max-w-[92vw] rounded-3xl border bg-white/80 backdrop-blur-xl p-6 shadow-[0_18px_60px_rgba(2,6,23,.14)]"
            style={{ borderColor: "rgba(0,0,0,0.10)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-2xl border flex items-center justify-center"
                style={{
                  borderColor: "rgba(0,0,0,0.10)",
                  background:
                    "linear-gradient(135deg, rgba(22,163,74,.12), rgba(17,24,39,.06))",
                }}
              >
                <div
                  className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-900"
                  style={{ animation: "ktSpin 1s linear infinite" }}
                />
              </div>

              <div className="min-w-0">
                <div className="text-[14px] font-medium tracking-tight">
                  Loading workspace
                </div>
                <div className="text-[12px] text-slate-500 font-medium">
                  fetching currentWebsite • syncing branding
                </div>
              </div>

              <div className="ml-auto text-[11px] font-medium text-slate-400">
                palette<span style={{ color: "#16A34A" }}>.</span>studio
              </div>
            </div>

            <div
              className="mt-5 rounded-2xl border p-4 bg-white"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-3 w-40 rounded-full kt-shimmer" />
                <div className="h-3 w-16 rounded-full kt-shimmer" />
              </div>

              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border p-3"
                    style={{
                      borderColor: "rgba(0,0,0,0.08)",
                      background: "rgba(248,250,252,0.8)",
                    }}
                  >
                    <div className="h-8 rounded-xl kt-shimmer mb-3" />
                    <div className="h-3 rounded-full kt-shimmer mb-2" />
                    <div className="h-3 w-2/3 rounded-full kt-shimmer" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-[12px] text-slate-600">
                Preparing palettes & editor…
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                please wait
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN APP */}
      <div className="h-screen flex flex-col p-6 pt-2 ">
        {/* TOP BAR */}
        <div
          className="px-5 py-3 border-b flex items-center gap-3 rounded-t-lg"
          style={{ background: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div className="text-[15px] font-medium tracking-tight">
            Palette<span style={{ color: "#16A34A" }}>.</span>studio
          </div>

          <div
            className="w-px h-5"
            style={{ background: "rgba(0,0,0,0.08)" }}
          />

          <div
            className="inline-flex rounded-xl border p-1"
            style={{ borderColor: "rgba(0,0,0,0.10)", background: "#F8FAFC" }}
          >
            <button
              onClick={() => {
                setTab("all");
                setEditing(null);
              }}
              className="h-9 px-4 rounded-lg text-[12px] font-bold transition"
              style={{
                background: tab === "all" ? "#111827" : "transparent",
                color: tab === "all" ? "#FFFFFF" : "#111827",
              }}
            >
              All Palettes
            </button>

            <button
              onClick={handleNew}
              className="h-9 px-4 rounded-lg text-[12px] font-medium transition"
              style={{
                background: tab === "edit" ? "#111827" : "transparent",
                color: tab === "edit" ? "#FFFFFF" : "#111827",
              }}
            >
              {tab === "edit" && editing
                ? `Editing: ${editing.name}`
                : "Create New"}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-[11px] font-medium text-slate-500">
              {palettes.length} saved (local state)
            </div>

            <button
              onClick={handleNew}
              className="h-10 px-4 rounded-xl border bg-white hover:bg-slate-50 flex items-center gap-2"
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              <Plus size={16} />
              <span className="text-[12px] font-medium">New</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-h-0 flex">
          {tab === "all" && (
            <div className="flex-1 min-h-0 overflow-y-auto p-5">
              {palettes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div
                    className="h-16 w-16 rounded-2xl border flex items-center justify-center text-2xl"
                    style={{
                      borderColor: "rgba(0,0,0,0.10)",
                      background: "rgba(255,255,255,0.8)",
                    }}
                  >
                    🎨
                  </div>
                  <div className="text-slate-700 font-medium text-[14px]">
                    No palettes yet
                  </div>
                  <button
                    onClick={handleNew}
                    className="h-11 px-6 rounded-xl border bg-white hover:bg-slate-50 text-[12px] font-medium"
                    style={{ borderColor: "rgba(0,0,0,0.10)" }}
                  >
                    + Create First Palette
                  </button>
                </div>
              ) : (
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                  }}
                >
                  {palettes.map((p) => (
                    <PaletteCard
                      key={p._id}
                      palette={p}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "edit" && (
            <EditorTab
              editingPalette={editing}
              onSave={handleSave}
              onCancel={() => {
                setTab("all");
                setEditing(null);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
