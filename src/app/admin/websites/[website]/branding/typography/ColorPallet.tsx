"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Globe, Shuffle, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  colorModal,
  ColorPalletModal,
} from "@/components/admin/branding/color_pallet/Color_Pallet_Modal";

const CARD_W = 140;
const GAP = 14;

const ColorPallet = ({ handleColorPallet, type }: any) => {
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // NEW: which card is active (clicked)
  const [activeId, setActiveId] = useState<string | null>(null);

  const [combo, setCombo] = useState<ColorPalletModal[]>([]);
  const { colorPallets, allColorPallets, isFetched } = useSelector(
    (state: RootState) => state.colorPallet,
  );

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < max - 2);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  // useEffect(() => {
  //   if (!currentWebsite?._id) return;

  //   const fetchPalettes = async () => {
  //     try {
  //       // setLoading(true);

  //       const req = await fetch("/api/admin/color-pallet");
  //       const res = await req.json();

  //       if (!res?.success) {
  //         setCombo([]);
  //         return;
  //       }

  //       const brandingColors = Array.isArray(currentWebsite?.branding?.colors)
  //         ? currentWebsite.branding.colors.map((d) => {
  //             return { ...d, usertype: true };
  //           })
  //         : [];

  //       setCombo([
  //         ...brandingColors,
  //         ...res.data.map((d: any) => {
  //           return {
  //             ...d,
  //             usertype: false,
  //           };
  //         }),
  //       ]);
  //     } catch (error) {
  //       console.error("Color pallet fetch error:", error);
  //       setCombo([]);
  //     } finally {
  //      // setLoading(false);
  //     }
  //   };

  //   fetchPalettes();
  // }, [currentWebsite?._id]);
  useEffect(() => {
    if (allColorPallets && allColorPallets.length) {
      setCombo(allColorPallets);
    } else {
      setCombo(colorPallets);
    }
  }, [allColorPallets]);

  const handleUpdateColor = (colors: any) => {
    console.log("colors", colors);
    handleColorPallet(colors);
  };
  return (
    <section className="w-full bg-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}

        /* small "pop" animation like your screenshot */
        @keyframes popIn {
          0% { transform: translateY(6px) scale(.92); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      <div className="px-2 py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-semibold text-slate-900">
            Combinations
          </h3>
          <button className="text-[14px] font-medium text-slate-700 hover:text-slate-900">
            See all
          </button>
        </div>

        {!isFetched ? (
          <section className="w-full bg-white">
            <div className="px-2 py-6 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
            </div>
          </section>
        ) : (
          <div className="relative">
            {/* Left Arrow Overlay */}
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Scroll left"
              className={[
                "absolute left-0 top-0 bottom-0 z-10 w-[10px] flex items-center justify-start",
                "transition-opacity",
                canLeft ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <div className="w-[30px] rounded-none cursor-pointer grid place-items-center">
                <ChevronLeft className="h-5 w-5 text-black" />
              </div>
            </button>

            {/* Right Arrow Overlay */}
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Scroll right"
              className={[
                "absolute right-0 top-0 bottom-0 z-10 w-[10px] flex items-center justify-end",
                "transition-opacity",
                canRight ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <div className="w-[30px] rounded-2xl grid place-items-center cursor-pointer">
                <ChevronRight className="h-5 w-5 text-black" />
              </div>
            </button>

            {/* Scroller */}
            <div
              ref={scrollerRef}
              className="no-scrollbar flex gap-[14px] overflow-x-auto scroll-smooth pr-[5px] pl-[5px]"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {combo.map((c) => {
                const isActive = activeId === c._id;
                const brand = c?.colors?.brand || {};
                const allColors = [
                  ...new Set(Object.values(brand).filter(Boolean)),
                ];
                return (
                  <div
                    key={c._id}
                    className="shrink-0"
                    style={{ width: CARD_W, scrollSnapAlign: "start" }}
                  >
                    <div
                      onClick={() =>
                        setActiveId((prev) => (prev === c._id ? null : c._id))
                      }
                      className={[
                        "w-full rounded-2xl bg-[#F3F4F6] text-left shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-[#EEF0F3] transition cursor-pointer",
                        isActive ? "ring-2 ring-black/10" : "",
                      ].join(" ")}
                    >
                      {/* Palette frame */}
                      <div className="relative rounded-2xl bg-[#F3F4F6] p-2 group">
                        <div className="h-[92px] w-full overflow-hidden rounded-xl flex">
                          {allColors.map((col: any, idx: number) => {
                            return (
                              <div
                                key={idx}
                                className="flex-1"
                                style={{ background: col }}
                              />
                            );
                          })}
                        </div>

                        {/* NEW: center shuffle icon (shows when clicked) */}
                        {isActive && (
                          <div
                            className="absolute inset-0 grid place-items-center"
                            style={{ pointerEvents: "none" }}
                          >
                            <div
                              className="h-9 w-9 rounded-full bg-white/90 border border-black/10 shadow-sm grid place-items-center"
                              style={{ animation: "popIn 160ms ease-out" }}
                            >
                              <Shuffle className="h-4 w-4 text-slate-900" />
                            </div>
                          </div>
                        )}

                        {/* Apply Palette button (shows on hover) */}
                        <div
                          className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ pointerEvents: "none" }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateColor(c.colors);
                            }}
                            className="px-4 py-2 bg-slate-900 text-white text-[13px] font-medium rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
                            style={{
                              pointerEvents: "auto",
                              animation: "popIn 160ms ease-out",
                            }}
                          >
                            Apply Palette
                          </button>
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="mt-3 px-3 pb-3">
                        <div className="text-[14px] flex gap-1 items-center justify-between leading-tight font-semibold text-slate-900">
                          {c.name}{" "}
                          {/* {c.usertype ? (
                            <User size={14} />
                          ) : (
                            <Globe size={14} />
                          )} */}
                        </div>
                      </div>
                    </div>
                    <h3>{c.name}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Slider */}
      </div>
    </section>
  );
};

export default ColorPallet;
