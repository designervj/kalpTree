"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";

type Combo = {
  id: string;
  name: string;
  subtitle: string;
  colors: string[];
};

const CARD_W = 140;
const GAP = 14;

const ColorPallet = () => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // NEW: which card is active (clicked)
  const [activeId, setActiveId] = useState<string | null>(null);

  const combos: Combo[] = useMemo(
    () => [
      {
        id: "hk",
        name: "HK Grotesk B",
        subtitle: "HK GROTESK BOLD",
        colors: ["#B9BDC4", "#0A1A66", "#1333FF", "#5EB7FF", "#D8F0FF"],
      },
      {
        id: "cardo",
        name: "Cardo",
        subtitle: "Didact Gothic",
        colors: ["#0B0B0B", "#2B2B2B", "#FF2C2C", "#FF6A6A", "#FFFFFF"],
      },
      {
        id: "arch",
        name: "Arc",
        subtitle: "ARCHI",
        colors: ["#B9BDC4", "#9AA0A7", "#7C838B", "#E8EAED", "#FFFFFF"],
      },
      {
        id: "arsenal",
        name: "Arsenal",
        subtitle: "Radley",
        colors: ["#2F3438", "#1C5A74", "#0E6A7D", "#FF9C7A", "#DFF4FA"],
      },
    ],
    []
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

        {/* Slider */}
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
            className="no-scrollbar flex gap-[14px] overflow-x-auto scroll-smooth pr-[58px] pl-[58px]"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {combos.map((c) => {
              const isActive = activeId === c.id;

              return (
                <div
                  key={c.id}
                  className="shrink-0"
                  style={{ width: CARD_W, scrollSnapAlign: "start" }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId((prev) => (prev === c.id ? null : c.id))}
                    className={[
                      "w-full rounded-2xl bg-[#F3F4F6] text-left shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-[#EEF0F3] transition",
                      isActive ? "ring-2 ring-black/10" : "",
                    ].join(" ")}
                  >
                    {/* Palette frame */}
                    <div className="relative rounded-2xl bg-[#F3F4F6] p-2">
                      <div className="h-[92px] w-full overflow-hidden rounded-xl flex">
                        {c.colors.map((col, idx) => (
                          <div
                            key={idx}
                            className="flex-1"
                            style={{ background: col }}
                          />
                        ))}
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
                    </div>

                    {/* Labels */}
                    <div className="mt-3 px-3 pb-3">
                      <div className="text-[14px] leading-tight font-semibold text-slate-900">
                        {c.name}
                      </div>
                      <div className="mt-1 text-[8px] tracking-[0.16em] uppercase text-slate-500">
                        {c.subtitle}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColorPallet;
