"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { ColorPalletModal } from "@/components/admin/branding/color_pallet/Color_Pallet_Modal";

const CARD_W = 140;
const GAP = 14;

const ColorPallet = ({ handleColorPallet, type }: any) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const [combo, setCombo] = useState<ColorPalletModal[]>([]);
  const [openAll, setOpenAll] = useState(false);

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

  useEffect(() => {
    if (allColorPallets && allColorPallets.length) {
      setCombo(allColorPallets);
    } else {
      setCombo(colorPallets);
    }
  }, [allColorPallets, colorPallets]);

  const handleUpdateColor = (colors: any) => {
    handleColorPallet(colors);
  };

  const getColors = (c: any) => {
    const brand = c?.colors?.brand || {};
    return [...new Set(Object.values(brand).filter(Boolean))];
  };

  return (
    <section className="w-full bg-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}

        @keyframes popIn {
          0% { transform: translateY(6px) scale(.92); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      <div className="px-1 py-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-semibold text-slate-900">
            Combinations
          </h3>

          {/* ✅ See all opens full palettes modal */}
          <button
            type="button"
            onClick={() => setOpenAll(true)}
            className="text-[12px] font-medium text-slate-500 hover:text-slate-900"
          >
            See all →
          </button>
        </div>

        {!isFetched ? (
          <div className="py-6 flex justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
          </div>
        ) : (
          <div className="relative">
            {/* LEFT ARROW */}
            {canLeft && (
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20"
              >
                <div className="h-7 w-7 rounded-full bg-white shadow-md border flex items-center justify-center hover:bg-slate-50">
                  <ChevronLeft className="h-4 w-4" />
                </div>
              </button>
            )}

            {/* RIGHT ARROW */}
            {canRight && (
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
              >
                <div className="h-7 w-7 rounded-full bg-white shadow-md border flex items-center justify-center hover:bg-slate-50">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            )}

            {/* SCROLLER */}
            <div
              ref={scrollerRef}
              className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar px-8"
            >
              {combo.map((c: any) => {
                const colors = getColors(c);

                return (
                  <div key={c._id} className="shrink-0 w-44">
                    <div className="group relative rounded-xl bg-white border shadow-sm hover:shadow-md transition overflow-hidden">
                      {/* Palette */}
                      <div className="p-2">
                        <div className="flex h-[70px] rounded-lg overflow-hidden">
                          {colors.map((col: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex-1"
                              style={{ background: col }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateColor(c.colors);
                          }}
                          className="px-3 py-1.5 text-xs bg-white text-black rounded-md shadow font-medium hover:bg-slate-100"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Footer */}
                      <div className="px-3 pb-3">
                        <p className="text-[13px] font-semibold text-slate-900 truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {colors.length} colors
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ✅ FULL COLOR PALLET MODAL */}
      <Dialog open={openAll} onOpenChange={setOpenAll}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-3 border-b">
            <DialogTitle className="text-[15px] font-semibold text-slate-900">
              All color combinations
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[70vh]">
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(combo || []).map((c: any) => {
                const colors = getColors(c);

                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => {
                      handleUpdateColor(c.colors);
                      setOpenAll(false);
                    }}
                    className="text-left rounded-xl border bg-white hover:shadow-md transition overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="flex h-[78px] rounded-lg overflow-hidden">
                        {colors.map((col: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex-1"
                            style={{ background: col }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="px-3 pb-3 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {colors.length} colors
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8 px-3 text-[12px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateColor(c.colors);
                          setOpenAll(false);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ColorPallet;
