// import { useMemo, useState } from "react";
// import {
//   deriveBrand,
//   deriveButtons,
//   generateAnalogous,
//   generateId,
//   generateMonoShades,
//   getContrastColor,
//   safeHex,
// } from "./utlis";
// import {
//   BrandTokens,
//   ButtonTokens,
//   ButtonVariant,
//   EditorSection,
//   SelectedToken,
// } from "./ColorsPallet";
// import {
//   BUTTON_TOKENS,
//   getButtonToken,
//   PreviewButton,
//   setButtonToken,
//   ShadePanelOverlay,
//   Toast,
// } from "./ShadePanelOverlay";

// import { ChevronLeft, Copy, LayoutGrid, Lock, Unlock } from "lucide-react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { Button } from "@/components/ui/button";

// export function EditorTab({
//   editingPalette,
//   onSave,
//   onCancel,
// }: {
//   editingPalette: any;
//   onSave: (p: any) => void;
//   onCancel: () => void;
// }) {
//   const defaultSeed = editingPalette?.seed || "#1F6F43";
//   const { currentBusiness } = useSelector((state: RootState) => state.business);

//   const [name, setName] = useState(editingPalette?.name || "");
//   const [hexSeed, setHexSeed] = useState(defaultSeed);
//   const [section, setSection] = useState<EditorSection>("brand");
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [toast, setToast] = useState("");
//   const [isGlobal, setIsGlobal] = useState(editingPalette?.isGlobal || false);

//   // stable base
//   const [baseAnalogous, setBaseAnalogous] = useState<string[]>(() =>
//     generateAnalogous(defaultSeed),
//   );
//   const baseShades = useMemo(
//     () => baseAnalogous.map(generateMonoShades),
//     [baseAnalogous],
//   );

//   const initialBrand = useMemo(
//     () => deriveBrand(baseAnalogous, baseShades),
//     [],
//   );
//   const [brand, setBrand] = useState<BrandTokens>(
//     () => editingPalette?.colors?.brand || initialBrand,
//   );

//   const [btns, setBtns] = useState<ButtonTokens>(() => {
//     if (editingPalette?.colors?.buttons) return editingPalette.colors.buttons;
//     return deriveButtons(
//       editingPalette?.colors?.brand || initialBrand,
//       baseShades,
//     );
//   });

//   const [lockedBrand, setLockedBrand] = useState<(keyof BrandTokens)[]>([]);
//   const [lockedButtons, setLockedButtons] = useState<string[]>([]);
//   const [autoSyncButtons, setAutoSyncButtons] = useState(true);

//   const [selected, setSelected] = useState<SelectedToken>(null);
//   const [enabledInput, setEnabledInput] = useState<string>("");

//   // FIX: icons were invisible on some colors because we were using contrast against swatch,
//   // but icons render on a white action-card. Keep icons dark always.
//   const ACTION_ICON_COLOR = "#0F172A";

//   const showToast = (t: string) => {
//     setToast(t);
//     window.setTimeout(() => setToast(""), 850);
//   };

//   const applyLockedButtons = (derived: ButtonTokens) => {
//     const next = structuredClone(derived);
//     lockedButtons.forEach((tokenId) => {
//       const v = getButtonToken(btns, tokenId);
//       if (!v) return;
//       const [variant, prop] = tokenId.split(".") as [ButtonVariant, any];
//       (next[variant] as any)[prop] = v;
//     });
//     return next;
//   };

//   const syncButtonsNow = (b: BrandTokens) => {
//     const derived = deriveButtons(b, baseShades);
//     setBtns(applyLockedButtons(derived));
//   };

//   const autoDerive = (hex: string) => {
//     const a = generateAnalogous(hex);
//     const s = a.map(generateMonoShades);
//     let b = deriveBrand(a, s);

//     lockedBrand.forEach((k) => {
//       b[k] = brand[k];
//     });

//     const derivedButtons = applyLockedButtons(deriveButtons(b, s));

//     setHexSeed(hex);
//     setBaseAnalogous(a);
//     setBrand(b);
//     setBtns(derivedButtons);
//     setSelected(null);
//     showToast("Derived from seed");
//   };

//   const toggleBrandLock = (key: keyof BrandTokens) => {
//     setLockedBrand((prev) =>
//       prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
//     );
//   };

//   const toggleButtonLock = (tokenId: string) => {
//     setLockedButtons((prev) =>
//       prev.includes(tokenId)
//         ? prev.filter((x) => x !== tokenId)
//         : [...prev, tokenId],
//     );
//   };

//   const handleSelectShade = (shade: string, tokenKey: string) => {
//     if (tokenKey.startsWith("btn:")) {
//       const tokenId = tokenKey.replace("btn:", "");
//       setBtns(setButtonToken(btns, tokenId, shade));
//       setSelected(null);
//       showToast("Button token updated");
//       return;
//     }

//     const key = tokenKey.replace("brand:", "") as keyof BrandTokens;
//     const nextBrand: BrandTokens = structuredClone(brand);
//     nextBrand[key] = shade;
//     setBrand(nextBrand);
//     setSelected(null);
//     showToast("Brand token updated");

//     if (autoSyncButtons) syncButtonsNow(nextBrand);
//   };

//   const handleCopy = async (value: string) => {
//     try {
//       await navigator.clipboard.writeText(value);
//       showToast("Copied");
//     } catch {
//       showToast("Copy failed");
//     }
//   };

//   const handleHexInputChange = (key: string, raw: string) => {
//     const nextHex = safeHex(raw);
//     if (nextHex.length !== 7) return;

//     if (key.startsWith("brand:")) {
//       const k = key.replace("brand:", "") as keyof BrandTokens;
//       const next = structuredClone(brand);
//       next[k] = nextHex;
//       setBrand(next);
//       if (autoSyncButtons) syncButtonsNow(next);
//     } else if (key.startsWith("btn:")) {
//       const tokenId = key.replace("btn:", "");
//       setBtns(setButtonToken(btns, tokenId, nextHex));
//     }
//   };

//   const handleSave = async () => {
//     if (!currentBusiness) return;
//     try {
//       setSaving(true);
//       if (!name.trim()) {
//         setMsg("Name required!");
//         return;
//       }
//       const palette = {
//         name: name.trim(),
//         seed: hexSeed,
//         colors: { brand, buttons: btns },
//         isGlobal,
//       };

//       const json = JSON.stringify(palette);

//       let req;

//       if (editingPalette) {
//         req = await fetch(
//           `/api/admin/color-pallet?tenantId=${currentBusiness._id}&palletId=${editingPalette._id}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: json,
//           },
//         );
//       } else {
//         req = await fetch(
//           `/api/admin/color-pallet?tenantId=${currentBusiness._id}`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: json,
//           },
//         );
//       }

//       const res = await req.json();

//       if (res.success) {
//         onSave({ ...palette, _id: res.data });
//         setMsg("Saved ✓");
//       } else {
//         setMsg("Not Saved X");
//       }
//     } catch (error) {
//       setMsg(String(error));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const brandEntries = Object.entries(brand) as [keyof BrandTokens, string][];
//   const buttonTokenEntries = BUTTON_TOKENS.map((t) => ({
//     ...t,
//     value: getButtonToken(btns, t.id),
//   }));

//   return (
//     <div className="flex-1 flex flex-col min-h-0">
//       <Toast text={toast || msg} />
//       {/* Editor Header */}
//       <div
//         className="px-5 py-3 border-b flex items-center gap-3"
//         style={{ background: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}
//       >
//         <button
//           onClick={onCancel}
//           className="h-9 px-3 rounded-xl border bg-white hover:bg-slate-50 flex items-center gap-2"
//           style={{ borderColor: "rgba(0,0,0,0.10)", color: "#111827" }}
//         >
//           <ChevronLeft size={18} />
//           <span className="text-sm font-semibold">Back</span>
//         </button>

//         <input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Palette name…"
//           className="h-10 flex-1 rounded-xl border px-4 text-[14px] font-medium outline-none"
//           style={{
//             background: "#F8FAFC",
//             borderColor: "rgba(0,0,0,0.10)",
//             color: "#111827",
//           }}
//         />

//         <div className="flex items-center gap-3">
//           <span className="text-[13px] font-semibold text-slate-700">
//             Global Palette
//           </span>

//           <button
//             onClick={() => setIsGlobal((prev: boolean) => !prev)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               isGlobal ? "bg-emerald-600" : "bg-slate-300"
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 isGlobal ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>

//           <span className="text-[12px] font-medium text-slate-600">
//             {isGlobal ? "Enabled" : "Disabled"}
//           </span>
//         </div>

//         {/* Seed + Derive */}
//         <div
//           className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
//           style={{ background: "#F8FAFC", borderColor: "rgba(0,0,0,0.10)" }}
//         >
//           <div className="relative">
//             <div
//               className="h-8 w-8 rounded-lg border"
//               style={{
//                 background: hexSeed,
//                 borderColor: "rgba(0,0,0,0.12)",
//               }}
//             />
//             <input
//               type="color"
//               value={hexSeed}
//               onChange={(e) => setHexSeed(e.target.value)}
//               className="absolute inset-0 opacity-0 cursor-pointer"
//             />
//           </div>
//           <div className="hidden md:block font-medium text-[11px] text-slate-600">
//             {hexSeed.toUpperCase()}
//           </div>
//           <button
//             onClick={() => autoDerive(hexSeed)}
//             className="h-8 px-3 rounded-lg border bg-white hover:bg-slate-50 text-[11px] font-bold"
//             style={{ borderColor: "rgba(0,0,0,0.10)", color: "#111827" }}
//           >
//             ↺ Derive
//           </button>
//         </div>

//         <Button
//           onClick={handleSave}
//           disabled={saving}
//           className="h-10 px-4 rounded-xl border text-[12px] font-bold"
//           style={{
//             background: msg.includes("✓") ? "#ECFDF5" : "#111827",
//             borderColor: msg.includes("✓")
//               ? "rgba(16,185,129,0.35)"
//               : "#111827",
//             color: msg.includes("✓") ? "#065F46" : "#FFFFFF",
//             opacity: saving ? 0.75 : 1,
//             cursor: saving ? "not-allowed" : "pointer",
//           }}
//         >
//           {msg || (saving ? "Saving…" : "Save")}
//         </Button>
//       </div>

//       {/* Sub Tabs */}
//       <div
//         className="px-5 py-3 border-b flex items-center gap-3"
//         style={{ background: "#F8FAFC", borderColor: "rgba(0,0,0,0.08)" }}
//       >
//         <div
//           className="inline-flex rounded-xl border p-1"
//           style={{ borderColor: "rgba(0,0,0,0.10)", background: "#FFFFFF" }}
//         >
//           {[
//             ["brand", "Brand"],
//             ["buttons", "Buttons"],
//             ["preview", "Preview"],
//           ].map(([id, label]) => (
//             <button
//               key={id}
//               onClick={() => setSection(id as EditorSection)}
//               className="h-9 px-4 rounded-lg text-[12px] font-bold transition"
//               style={{
//                 background: section === id ? "#111827" : "transparent",
//                 color: section === id ? "#FFFFFF" : "#111827",
//               }}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         <div className="ml-auto flex items-center gap-3">
//           <label className="flex items-center gap-2 text-[12px] font-bold text-slate-700 select-none">
//             <input
//               type="checkbox"
//               checked={autoSyncButtons}
//               onChange={(e) => setAutoSyncButtons(e.target.checked)}
//             />
//             Auto-sync buttons from brand
//           </label>

//           {section === "buttons" && (
//             <button
//               onClick={() => syncButtonsNow(brand)}
//               className="h-9 px-3 rounded-xl border bg-white hover:bg-slate-50 text-[12px] font-bold"
//               style={{ borderColor: "rgba(0,0,0,0.10)" }}
//             >
//               Sync now
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       <div
//         className="flex-1 h-auto p-5 rounded-b-lg"
//         style={{ background: "#F3F5F9" }}
//       >
//         {/* BRAND */}
//         {section === "brand" && (
//           <div
//             className="rounded-2xl border overflow-hidden bg-white"
//             style={{ borderColor: "rgba(0,0,0,0.08)" }}
//           >
//             <div className="h-[56vh] min-h-[420px] flex">
//               {brandEntries.map(([key, color]) => {
//                 const tokenKey = `brand:${String(key)}`;
//                 const isSelected =
//                   selected?.type === "brand" && selected.key === key;

//                 if (isSelected) {
//                   return (
//                     <div key={String(key)} className="flex-1">
//                       <ShadePanelOverlay
//                         color={color}
//                         tokenKey={tokenKey}
//                         onSelectShade={handleSelectShade}
//                       />
//                     </div>
//                   );
//                 }

//                 const bg =
//                   color === "transparent"
//                     ? "repeating-conic-gradient(#E5E7EB 0% 25%, #F8FAFC 0% 50%) 0 0 / 10px 10px"
//                     : color;

//                 const labelColor =
//                   color === "transparent" ? "#111827" : getContrastColor(color);

//                 return (
//                   <div
//                     key={String(key)}
//                     className="group relative flex-1"
//                     style={{ background: bg as any }}
//                     title={`${String(key)}: ${color}`}
//                   >
//                     {/* Hover actions */}
//                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                       <div
//                         className="rounded-2xl border shadow-sm p-2 flex flex-col gap-2"
//                         style={{
//                           background: "rgba(255,255,255,0.90)",
//                           borderColor: "rgba(0,0,0,0.10)",
//                           backdropFilter: "blur(10px)",
//                         }}
//                       >
//                         <button
//                           onClick={() => setSelected({ type: "brand", key })}
//                           className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
//                           style={{ borderColor: "rgba(0,0,0,0.10)" }}
//                           title="Pick shade"
//                         >
//                           <LayoutGrid size={16} color={ACTION_ICON_COLOR} />
//                         </button>

//                         <button
//                           onClick={() => handleCopy(color)}
//                           className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
//                           style={{ borderColor: "rgba(0,0,0,0.10)" }}
//                           title="Copy"
//                         >
//                           <Copy size={16} color={ACTION_ICON_COLOR} />
//                         </button>

//                         <button
//                           onClick={() => toggleBrandLock(key)}
//                           className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
//                           style={{ borderColor: "rgba(0,0,0,0.10)" }}
//                           title={lockedBrand.includes(key) ? "Unlock" : "Lock"}
//                         >
//                           {lockedBrand.includes(key) ? (
//                             <Lock size={16} color={ACTION_ICON_COLOR} />
//                           ) : (
//                             <Unlock size={16} color={ACTION_ICON_COLOR} />
//                           )}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Bottom labels */}
//                     <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center select-none">
//                       <div className="mb-1">
//                         {enabledInput === tokenKey ? (
//                           <input
//                             autoFocus
//                             value={color.replace("#", "").toUpperCase()}
//                             onChange={(e) =>
//                               handleHexInputChange(tokenKey, e.target.value)
//                             }
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter") setEnabledInput("");
//                             }}
//                             className="w-[78px] rounded-lg border px-2 py-1 text-center font-medium text-xs font-extrabold outline-none"
//                             style={{
//                               background: "rgba(255,255,255,0.92)",
//                               borderColor: "rgba(0,0,0,0.18)",
//                               color: "#111827",
//                             }}
//                           />
//                         ) : (
//                           <span
//                             onDoubleClick={() => setEnabledInput(tokenKey)}
//                             className="cursor-pointer font-medium text-xs font-extrabold tracking-wide"
//                             style={{ color: labelColor }}
//                           >
//                             {color.replace("#", "").toUpperCase()}
//                           </span>
//                         )}
//                       </div>

//                       <div
//                         className="font-medium text-[10px] opacity-70"
//                         style={{ color: labelColor }}
//                       >
//                         {String(key)}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="px-4 py-3 border-t text-[12px] text-slate-600 font-semibold">
//               Tip: Double click any HEX to edit. Use the grid icon to open a
//               shade selector.
//             </div>
//           </div>
//         )}

//         {/* BUTTONS */}
//         {section === "buttons" && (
//           <div className="grid gap-4">
//             <div
//               className="rounded-2xl border overflow-hidden bg-white"
//               style={{ borderColor: "rgba(0,0,0,0.08)" }}
//             >
//               <div className="h-[44vh] min-h-[360px] flex">
//                 {buttonTokenEntries.map((t) => {
//                   const tokenKey = `btn:${t.id}`;
//                   const isSelected =
//                     selected?.type === "button" && selected.key === t.id;

//                   const color = t.value || "#FFFFFF";

//                   if (isSelected) {
//                     return (
//                       <div key={t.id} className="flex-1">
//                         <ShadePanelOverlay
//                           color={color}
//                           tokenKey={tokenKey}
//                           onSelectShade={handleSelectShade}
//                         />
//                       </div>
//                     );
//                   }

//                   return (
//                     <div
//                       key={t.id}
//                       className="group relative flex-1"
//                       style={{
//                         background: color === "transparent" ? "#FFFFFF" : color,
//                       }}
//                       title={`${t.label}: ${color}`}
//                     >
//                       {/* Hover actions */}
//                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <div
//                           className="rounded-2xl border shadow-sm p-2 flex flex-col gap-2"
//                           style={{
//                             background: "rgba(255,255,255,0.90)",
//                             borderColor: "rgba(0,0,0,0.10)",
//                             backdropFilter: "blur(10px)",
//                           }}
//                         >
//                           <button
//                             onClick={() =>
//                               setSelected({ type: "button", key: t.id })
//                             }
//                             className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
//                             style={{ borderColor: "rgba(0,0,0,0.10)" }}
//                             title="Pick shade"
//                           >
//                             <LayoutGrid size={16} color={ACTION_ICON_COLOR} />
//                           </button>

//                           <button
//                             onClick={() => handleCopy(color)}
//                             className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
//                             style={{ borderColor: "rgba(0,0,0,0.10)" }}
//                             title="Copy"
//                           >
//                             <Copy size={16} color={ACTION_ICON_COLOR} />
//                           </button>

//                           <button
//                             onClick={() => toggleButtonLock(t.id)}
//                             className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
//                             style={{ borderColor: "rgba(0,0,0,0.10)" }}
//                             title={
//                               lockedButtons.includes(t.id) ? "Unlock" : "Lock"
//                             }
//                           >
//                             {lockedButtons.includes(t.id) ? (
//                               <Lock size={16} color={ACTION_ICON_COLOR} />
//                             ) : (
//                               <Unlock size={16} color={ACTION_ICON_COLOR} />
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Bottom labels */}
//                       <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center select-none">
//                         <div className="mb-1">
//                           {enabledInput === tokenKey ? (
//                             <input
//                               autoFocus
//                               value={color.replace("#", "").toUpperCase()}
//                               onChange={(e) =>
//                                 handleHexInputChange(tokenKey, e.target.value)
//                               }
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") setEnabledInput("");
//                               }}
//                               className="w-[78px] rounded-lg border px-2 py-1 text-center font-medium text-xs font-extrabold outline-none"
//                               style={{
//                                 background: "rgba(255,255,255,0.92)",
//                                 borderColor: "rgba(0,0,0,0.18)",
//                                 color: "#111827",
//                               }}
//                             />
//                           ) : (
//                             <span
//                               onDoubleClick={() => setEnabledInput(tokenKey)}
//                               className="cursor-pointer font-medium text-xs font-extrabold tracking-wide"
//                               style={{ color: getContrastColor(color) }}
//                             >
//                               {color.replace("#", "").toUpperCase()}
//                             </span>
//                           )}
//                         </div>
//                         <div
//                           className="font-medium text-[10px] opacity-70 text-center px-2"
//                           style={{ color: getContrastColor(color) }}
//                         >
//                           {t.label}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="px-4 py-3 border-t text-[12px] text-slate-600 font-semibold">
//                 Tip: Same workflow as Brand — click grid for shades, double
//                 click HEX to type.
//               </div>
//             </div>

//             <div
//               className="rounded-2xl border bg-white p-4"
//               style={{ borderColor: "rgba(0,0,0,0.08)" }}
//             >
//               <div className="text-[13px] font-semibold text-slate-900 mb-3">
//                 Live Buttons Preview
//               </div>

//               <div className="flex flex-wrap gap-12">
//                 <div>
//                   <div className="text-[11px] font-medium text-slate-500 mb-2">
//                     Primary
//                   </div>
//                   <PreviewButton
//                     label="Primary Button"
//                     normal={{
//                       bg: btns.primary.bg,
//                       text: btns.primary.text,
//                       border: btns.primary.border,
//                     }}
//                     hover={{
//                       bg: btns.primary.hoverBg,
//                       text: btns.primary.hoverText,
//                       border: btns.primary.hoverBorder,
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <div className="text-[11px] font-medium text-slate-500 mb-2">
//                     Secondary
//                   </div>
//                   <PreviewButton
//                     label="Secondary Button"
//                     normal={{
//                       bg: btns.secondary.bg,
//                       text: btns.secondary.text,
//                       border: btns.secondary.border,
//                     }}
//                     hover={{
//                       bg: btns.secondary.hoverBg,
//                       text: btns.secondary.hoverText,
//                       border: btns.secondary.hoverBorder,
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <div className="text-[11px] font-medium text-slate-500 mb-2">
//                     Outline
//                   </div>
//                   <PreviewButton
//                     label="Outline Button"
//                     normal={{
//                       bg: btns.outline.bg,
//                       text: btns.outline.text,
//                       border: btns.outline.border,
//                     }}
//                     hover={{
//                       bg: btns.outline.hoverBg,
//                       text: btns.outline.hoverText,
//                       border: btns.outline.hoverBorder,
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* PREVIEW */}
//         {section === "preview" && (
//           <div className="grid gap-4">
//             <div
//               className="rounded-2xl border bg-white overflow-hidden"
//               style={{ borderColor: "rgba(0,0,0,0.08)" }}
//             >
//               <div
//                 className="px-4 py-3 border-b"
//                 style={{ borderColor: "rgba(0,0,0,0.08)" }}
//               >
//                 <div className="text-[13px] font-semibold text-slate-900">
//                   Brand Tokens
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
//                 {brandEntries.map(([k, v]) => (
//                   <div
//                     key={String(k)}
//                     className="rounded-2xl border overflow-hidden"
//                     style={{ borderColor: "rgba(0,0,0,0.08)" }}
//                   >
//                     <div className="h-14" style={{ background: v }} />
//                     <div className="p-3">
//                       <div className="text-[11px] font-medium text-slate-500">
//                         {String(k)}
//                       </div>
//                       <div className="mt-1 font-medium text-[13px]  font-medium text-slate-900">
//                         {v.toUpperCase()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div
//               className="rounded-2xl border bg-white p-4"
//               style={{ borderColor: "rgba(0,0,0,0.08)" }}
//             >
//               <div className="text-[13px] font-semibold text-slate-900 mb-3">
//                 Buttons Preview
//               </div>
//               <div className="flex flex-wrap gap-12">
//                 <PreviewButton
//                   label="Primary Button"
//                   normal={{
//                     bg: btns.primary.bg,
//                     text: btns.primary.text,
//                     border: btns.primary.border,
//                   }}
//                   hover={{
//                     bg: btns.primary.hoverBg,
//                     text: btns.primary.hoverText,
//                     border: btns.primary.hoverBorder,
//                   }}
//                 />
//                 <PreviewButton
//                   label="Secondary Button"
//                   normal={{
//                     bg: btns.secondary.bg,
//                     text: btns.secondary.text,
//                     border: btns.secondary.border,
//                   }}
//                   hover={{
//                     bg: btns.secondary.hoverBg,
//                     text: btns.secondary.hoverText,
//                     border: btns.secondary.hoverBorder,
//                   }}
//                 />
//                 <PreviewButton
//                   label="Outline Button"
//                   normal={{
//                     bg: btns.outline.bg,
//                     text: btns.outline.text,
//                     border: btns.outline.border,
//                   }}
//                   hover={{
//                     bg: btns.outline.hoverBg,
//                     text: btns.outline.hoverText,
//                     border: btns.outline.hoverBorder,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import {
  deriveBrand,
  deriveButtons,
  generateAnalogous,
  generateId,
  generateMonoShades,
  getContrastColor,
  safeHex,
} from "./utlis";
import {
  BrandTokens,
  ButtonTokens,
  ButtonVariant,
  EditorSection,
  SelectedToken,
} from "./ColorsPallet";
import {
  BUTTON_TOKENS,
  getButtonToken,
  PreviewButton,
  setButtonToken,
  ShadePanelOverlay,
  Toast,
} from "./ShadePanelOverlay";

import { ChevronLeft, Copy, LayoutGrid, Lock, Unlock } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";

export function EditorTab({
  editingPalette,
  onSave,
  onCancel,
}: {
  editingPalette: any;
  onSave: (p: any) => void;
  onCancel: () => void;
}) {
  const defaultSeed = editingPalette?.seed || "#1F6F43";
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const [name, setName] = useState(editingPalette?.name || "");
  const [hexSeed, setHexSeed] = useState(defaultSeed);
  const [section, setSection] = useState<EditorSection>("brand");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState("");
  const [isGlobal, setIsGlobal] = useState(editingPalette?.isGlobal || false);

  // stable base
  const [baseAnalogous, setBaseAnalogous] = useState<string[]>(() =>
    generateAnalogous(defaultSeed),
  );
  const baseShades = useMemo(
    () => baseAnalogous.map(generateMonoShades),
    [baseAnalogous],
  );

  const initialBrand = useMemo(
    () => deriveBrand(baseAnalogous, baseShades),
    [],
  );
  const [brand, setBrand] = useState<BrandTokens>(
    () => editingPalette?.colors?.brand || initialBrand,
  );

  const [btns, setBtns] = useState<ButtonTokens>(() => {
    if (editingPalette?.colors?.buttons) return editingPalette.colors.buttons;
    return deriveButtons(
      editingPalette?.colors?.brand || initialBrand,
      baseShades,
    );
  });

  const [lockedBrand, setLockedBrand] = useState<(keyof BrandTokens)[]>([]);
  const [lockedButtons, setLockedButtons] = useState<string[]>([]);
  const [autoSyncButtons, setAutoSyncButtons] = useState(true);

  const [selected, setSelected] = useState<SelectedToken>(null);
  const [enabledInput, setEnabledInput] = useState<string>("");

  // FIX: icons were invisible on some colors because we were using contrast against swatch,
  // but icons render on a white action-card. Keep icons dark always.
  const ACTION_ICON_COLOR = "#0F172A";

  const showToast = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(""), 850);
  };

  const applyLockedButtons = (derived: ButtonTokens) => {
    const next = structuredClone(derived);
    lockedButtons.forEach((tokenId) => {
      const v = getButtonToken(btns, tokenId);
      if (!v) return;
      const [variant, prop] = tokenId.split(".") as [ButtonVariant, any];
      (next[variant] as any)[prop] = v;
    });
    return next;
  };

  const syncButtonsNow = (b: BrandTokens) => {
    const derived = deriveButtons(b, baseShades);
    setBtns(applyLockedButtons(derived));
  };

  const autoDerive = (hex: string) => {
    const a = generateAnalogous(hex);
    const s = a.map(generateMonoShades);
    let b = deriveBrand(a, s);

    lockedBrand.forEach((k) => {
      b[k] = brand[k];
    });

    const derivedButtons = applyLockedButtons(deriveButtons(b, s));

    setHexSeed(hex);
    setBaseAnalogous(a);
    setBrand(b);
    setBtns(derivedButtons);
    setSelected(null);
    showToast("Derived from seed");
  };

  const toggleBrandLock = (key: keyof BrandTokens) => {
    setLockedBrand((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const toggleButtonLock = (tokenId: string) => {
    setLockedButtons((prev) =>
      prev.includes(tokenId)
        ? prev.filter((x) => x !== tokenId)
        : [...prev, tokenId],
    );
  };

  const handleSelectShade = (shade: string, tokenKey: string) => {
    if (tokenKey.startsWith("btn:")) {
      const tokenId = tokenKey.replace("btn:", "");
      setBtns(setButtonToken(btns, tokenId, shade));
      setSelected(null);
      showToast("Button token updated");
      return;
    }

    const key = tokenKey.replace("brand:", "") as keyof BrandTokens;
    const nextBrand: BrandTokens = structuredClone(brand);
    nextBrand[key] = shade;
    setBrand(nextBrand);
    setSelected(null);
    showToast("Brand token updated");

    if (autoSyncButtons) syncButtonsNow(nextBrand);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast("Copied");
    } catch {
      showToast("Copy failed");
    }
  };

  const handleHexInputChange = (key: string, raw: string) => {
    const nextHex = safeHex(raw);
    if (nextHex.length !== 7) return;

    if (key.startsWith("brand:")) {
      const k = key.replace("brand:", "") as keyof BrandTokens;
      const next = structuredClone(brand);
      next[k] = nextHex;
      setBrand(next);
      if (autoSyncButtons) syncButtonsNow(next);
    } else if (key.startsWith("btn:")) {
      const tokenId = key.replace("btn:", "");
      setBtns(setButtonToken(btns, tokenId, nextHex));
    }
  };


  const handleSave = async () => {
    if (!currentBusiness) return;
    try {
      setSaving(true);
      if (!name.trim()) {
        setMsg("Name required!");
        return;
      }
      const palette = {
        name: name.trim(),
        seed: hexSeed,
        colors: { brand, buttons: btns },
        isGlobal,
      };

      const json = JSON.stringify(palette);

      let req;

      if (editingPalette) {
        req = await fetch(
          `/api/admin/color-pallet?tenantId=${currentBusiness._id}&palletId=${editingPalette._id}&type=normal`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          },
        );
      } else {
        req = await fetch(
          `/api/admin/color-pallet?tenantId=${currentBusiness._id}&type=normal`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          },
        );
      }

      const res = await req.json();

      if (res.success) {
        onSave({ ...palette, _id: res.data });
        setMsg("Saved ✓");
      } else {
        setMsg("Not Saved X");
      }
    } catch (error) {
      setMsg(String(error));
    } finally {
      setSaving(false);
    }
  };

  const brandEntries = Object.entries(brand) as [keyof BrandTokens, string][];
  const buttonTokenEntries = BUTTON_TOKENS.map((t) => ({
    ...t,
    value: getButtonToken(btns, t.id),
  }));

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Toast text={toast || msg} />
      {/* Editor Header */}
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <button
          onClick={onCancel}
          className="h-9 px-3 rounded-xl border bg-white hover:bg-slate-50 flex items-center gap-2"
          style={{ borderColor: "rgba(0,0,0,0.10)", color: "#111827" }}
        >
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold">Back</span>
        </button>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Palette name…"
          className="h-10 flex-1 rounded-xl border px-4 text-[14px] font-medium outline-none"
          style={{
            background: "#F8FAFC",
            borderColor: "rgba(0,0,0,0.10)",
            color: "#111827",
          }}
        />

        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-slate-700">
            Global Palette
          </span>

          <button
            onClick={() => setIsGlobal((prev: boolean) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isGlobal ? "bg-emerald-600" : "bg-slate-300"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isGlobal ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>

          <span className="text-[12px] font-medium text-slate-600">
            {isGlobal ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* Seed + Derive */}
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
          style={{ background: "#F8FAFC", borderColor: "rgba(0,0,0,0.10)" }}
        >
          <div className="relative">
            <div
              className="h-8 w-8 rounded-lg border"
              style={{
                background: hexSeed,
                borderColor: "rgba(0,0,0,0.12)",
              }}
            />
            <input
              type="color"
              value={hexSeed}
              onChange={(e) => setHexSeed(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div className="hidden md:block font-medium text-[11px] text-slate-600">
            {hexSeed.toUpperCase()}
          </div>
          <button
            onClick={() => autoDerive(hexSeed)}
            className="h-8 px-3 rounded-lg border bg-white hover:bg-slate-50 text-[11px] font-bold"
            style={{ borderColor: "rgba(0,0,0,0.10)", color: "#111827" }}
          >
            ↺ Derive
          </button>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-4 rounded-xl border text-[12px] font-bold"
          style={{
            background: msg.includes("✓") ? "#ECFDF5" : "#111827",
            borderColor: msg.includes("✓")
              ? "rgba(16,185,129,0.35)"
              : "#111827",
            color: msg.includes("✓") ? "#065F46" : "#FFFFFF",
            opacity: saving ? 0.75 : 1,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {msg || (saving ? "Saving…" : "Save")}
        </Button>
      </div>

      {/* Sub Tabs */}
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "#F8FAFC", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div
          className="inline-flex rounded-xl border p-1"
          style={{ borderColor: "rgba(0,0,0,0.10)", background: "#FFFFFF" }}
        >
          {[
            ["brand", "Brand"],
            ["buttons", "Buttons"],
            ["preview", "Preview"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSection(id as EditorSection)}
              className="h-9 px-4 rounded-lg text-[12px] font-bold transition"
              style={{
                background: section === id ? "#111827" : "transparent",
                color: section === id ? "#FFFFFF" : "#111827",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-[12px] font-bold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={autoSyncButtons}
              onChange={(e) => setAutoSyncButtons(e.target.checked)}
            />
            Auto-sync buttons from brand
          </label>

          {section === "buttons" && (
            <button
              onClick={() => syncButtonsNow(brand)}
              className="h-9 px-3 rounded-xl border bg-white hover:bg-slate-50 text-[12px] font-bold"
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              Sync now
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 h-auto p-5 rounded-b-lg"
        style={{ background: "#F3F5F9" }}
      >
        {/* BRAND */}
        {section === "brand" && (
          <div
            className="rounded-2xl border overflow-hidden bg-white"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
          >
            <div className="h-[56vh] min-h-[420px] flex">
              {brandEntries.map(([key, color]) => {
                console.log(key, color);
                const tokenKey = `brand:${String(key)}`;
                const isSelected =
                  selected?.type === "brand" && selected.key === key;

                if (isSelected) {
                  return (
                    <div key={String(key)} className="flex-1">
                      <ShadePanelOverlay
                        color={color}
                        tokenKey={tokenKey}
                        onSelectShade={handleSelectShade}
                      />
                    </div>
                  );
                }

                const bg =
                  color === "transparent"
                    ? "repeating-conic-gradient(#E5E7EB 0% 25%, #F8FAFC 0% 50%) 0 0 / 10px 10px"
                    : color;

                const labelColor =
                  color === "transparent" ? "#111827" : getContrastColor(color);

                return (
                  <div
                    key={String(key)}
                    className="group relative flex-1"
                    style={{ background: bg as any }}
                    title={`${String(key)}: ${color}`}
                  >
                    {/* Hover actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className="rounded-2xl border shadow-sm p-2 flex flex-col gap-2"
                        style={{
                          background: "rgba(255,255,255,0.90)",
                          borderColor: "rgba(0,0,0,0.10)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <button
                          onClick={() => setSelected({ type: "brand", key })}
                          className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                          style={{ borderColor: "rgba(0,0,0,0.10)" }}
                          title="Pick shade"
                        >
                          <LayoutGrid size={16} color={ACTION_ICON_COLOR} />
                        </button>

                        <button
                          onClick={() => handleCopy(color)}
                          className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                          style={{ borderColor: "rgba(0,0,0,0.10)" }}
                          title="Copy"
                        >
                          <Copy size={16} color={ACTION_ICON_COLOR} />
                        </button>

                        <button
                          onClick={() => toggleBrandLock(key)}
                          className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                          style={{ borderColor: "rgba(0,0,0,0.10)" }}
                          title={lockedBrand.includes(key) ? "Unlock" : "Lock"}
                        >
                          {lockedBrand.includes(key) ? (
                            <Lock size={16} color={ACTION_ICON_COLOR} />
                          ) : (
                            <Unlock size={16} color={ACTION_ICON_COLOR} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Bottom labels */}
                    <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center select-none">
                      <div className="mb-1">
                        {enabledInput === tokenKey ? (
                          <input
                            autoFocus
                            value={color.replace("#", "").toUpperCase()}
                            onChange={(e) =>
                              handleHexInputChange(tokenKey, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEnabledInput("");
                            }}
                            className="w-[78px] rounded-lg border px-2 py-1 text-center font-medium text-xs font-extrabold outline-none"
                            style={{
                              background: "rgba(255,255,255,0.92)",
                              borderColor: "rgba(0,0,0,0.18)",
                              color: "#111827",
                            }}
                          />
                        ) : (
                          <span
                            onDoubleClick={() => setEnabledInput(tokenKey)}
                            className="cursor-pointer font-medium text-xs font-extrabold tracking-wide"
                            style={{ color: labelColor }}
                          >
                            {color.replace("#", "").toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div
                        className="font-medium text-[10px] opacity-70"
                        style={{ color: labelColor }}
                      >
                        {String(key)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t text-[12px] text-slate-600 font-semibold">
              Tip: Double click any HEX to edit. Use the grid icon to open a
              shade selector.
            </div>
          </div>
        )}

        {/* BUTTONS */}
        {section === "buttons" && (
          <div className="grid gap-4">
            <div
              className="rounded-2xl border overflow-hidden bg-white"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="h-[44vh] min-h-[360px] flex">
                {buttonTokenEntries.map((t) => {
                  const tokenKey = `btn:${t.id}`;
                  const isSelected =
                    selected?.type === "button" && selected.key === t.id;

                  const color = t.value || "#FFFFFF";

                  if (isSelected) {
                    return (
                      <div key={t.id} className="flex-1">
                        <ShadePanelOverlay
                          color={color}
                          tokenKey={tokenKey}
                          onSelectShade={handleSelectShade}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={t.id}
                      className="group relative flex-1"
                      style={{
                        background: color === "transparent" ? "#FFFFFF" : color,
                      }}
                      title={`${t.label}: ${color}`}
                    >
                      {/* Hover actions */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                          className="rounded-2xl border shadow-sm p-2 flex flex-col gap-2"
                          style={{
                            background: "rgba(255,255,255,0.90)",
                            borderColor: "rgba(0,0,0,0.10)",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <button
                            onClick={() =>
                              setSelected({ type: "button", key: t.id })
                            }
                            className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                            style={{ borderColor: "rgba(0,0,0,0.10)" }}
                            title="Pick shade"
                          >
                            <LayoutGrid size={16} color={ACTION_ICON_COLOR} />
                          </button>

                          <button
                            onClick={() => handleCopy(color)}
                            className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                            style={{ borderColor: "rgba(0,0,0,0.10)" }}
                            title="Copy"
                          >
                            <Copy size={16} color={ACTION_ICON_COLOR} />
                          </button>

                          <button
                            onClick={() => toggleButtonLock(t.id)}
                            className="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 flex items-center justify-center"
                            style={{ borderColor: "rgba(0,0,0,0.10)" }}
                            title={
                              lockedButtons.includes(t.id) ? "Unlock" : "Lock"
                            }
                          >
                            {lockedButtons.includes(t.id) ? (
                              <Lock size={16} color={ACTION_ICON_COLOR} />
                            ) : (
                              <Unlock size={16} color={ACTION_ICON_COLOR} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Bottom labels */}
                      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center select-none">
                        <div className="mb-1">
                          {enabledInput === tokenKey ? (
                            <input
                              autoFocus
                              value={color.replace("#", "").toUpperCase()}
                              onChange={(e) =>
                                handleHexInputChange(tokenKey, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setEnabledInput("");
                              }}
                              className="w-[78px] rounded-lg border px-2 py-1 text-center font-medium text-xs font-extrabold outline-none"
                              style={{
                                background: "rgba(255,255,255,0.92)",
                                borderColor: "rgba(0,0,0,0.18)",
                                color: "#111827",
                              }}
                            />
                          ) : (
                            <span
                              onDoubleClick={() => setEnabledInput(tokenKey)}
                              className="cursor-pointer font-medium text-xs font-extrabold tracking-wide"
                              style={{ color: getContrastColor(color) }}
                            >
                              {color.replace("#", "").toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div
                          className="font-medium text-[10px] opacity-70 text-center px-2"
                          style={{ color: getContrastColor(color) }}
                        >
                          {t.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-3 border-t text-[12px] text-slate-600 font-semibold">
                Tip: Same workflow as Brand — click grid for shades, double
                click HEX to type.
              </div>
            </div>

            <div
              className="rounded-2xl border bg-white p-4"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="text-[13px] font-semibold text-slate-900 mb-3">
                Live Buttons Preview
              </div>

              <div className="flex flex-wrap gap-12">
                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-2">
                    Primary
                  </div>
                  <PreviewButton
                    label="Primary Button"
                    normal={{
                      bg: btns.primary.bg,
                      text: btns.primary.text,
                      border: btns.primary.border,
                    }}
                    hover={{
                      bg: btns.primary.hoverBg,
                      text: btns.primary.hoverText,
                      border: btns.primary.hoverBorder,
                    }}
                  />
                </div>

                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-2">
                    Secondary
                  </div>
                  <PreviewButton
                    label="Secondary Button"
                    normal={{
                      bg: btns.secondary.bg,
                      text: btns.secondary.text,
                      border: btns.secondary.border,
                    }}
                    hover={{
                      bg: btns.secondary.hoverBg,
                      text: btns.secondary.hoverText,
                      border: btns.secondary.hoverBorder,
                    }}
                  />
                </div>

                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-2">
                    Outline
                  </div>
                  <PreviewButton
                    label="Outline Button"
                    normal={{
                      bg: btns.outline.bg,
                      text: btns.outline.text,
                      border: btns.outline.border,
                    }}
                    hover={{
                      bg: btns.outline.hoverBg,
                      text: btns.outline.hoverText,
                      border: btns.outline.hoverBorder,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW */}
        {section === "preview" && (
          <div className="grid gap-4">
            <div
              className="rounded-2xl border bg-white overflow-hidden"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <div className="text-[13px] font-semibold text-slate-900">
                  Brand Tokens
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                {brandEntries.map(([k, v]) => (
                  <div
                    key={String(k)}
                    className="rounded-2xl border overflow-hidden"
                    style={{ borderColor: "rgba(0,0,0,0.08)" }}
                  >
                    <div className="h-14" style={{ background: v }} />
                    <div className="p-3">
                      <div className="text-[11px] font-medium text-slate-500">
                        {String(k)}
                      </div>
                      <div className="mt-1 font-medium text-[13px]  font-medium text-slate-900">
                        {v.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl border bg-white p-4"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="text-[13px] font-semibold text-slate-900 mb-3">
                Buttons Preview
              </div>
              <div className="flex flex-wrap gap-12">
                <PreviewButton
                  label="Primary Button"
                  normal={{
                    bg: btns.primary.bg,
                    text: btns.primary.text,
                    border: btns.primary.border,
                  }}
                  hover={{
                    bg: btns.primary.hoverBg,
                    text: btns.primary.hoverText,
                    border: btns.primary.hoverBorder,
                  }}
                />
                <PreviewButton
                  label="Secondary Button"
                  normal={{
                    bg: btns.secondary.bg,
                    text: btns.secondary.text,
                    border: btns.secondary.border,
                  }}
                  hover={{
                    bg: btns.secondary.hoverBg,
                    text: btns.secondary.hoverText,
                    border: btns.secondary.hoverBorder,
                  }}
                />
                <PreviewButton
                  label="Outline Button"
                  normal={{
                    bg: btns.outline.bg,
                    text: btns.outline.text,
                    border: btns.outline.border,
                  }}
                  hover={{
                    bg: btns.outline.hoverBg,
                    text: btns.outline.hoverText,
                    border: btns.outline.hoverBorder,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
