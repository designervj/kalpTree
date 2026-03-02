import { RootState } from '@/store/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef } from 'react'
import { useSelector } from 'react-redux';

const AllColorPallets = () => {
    const { colorPallets, isFetched } = useSelector(
        (state: RootState) => state.colorPallet,
    );
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth / 2
                : scrollLeft + clientWidth / 2;

            scrollRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    const getColors = (c: any) => {
        const brand = c?.colors?.brand || {};
        return [...new Set(Object.values(brand).filter(Boolean))];
    };
    return (
        <div className="relative group/container">
            {/* Left Scroll Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 border shadow-md opacity-0 group-hover/container:opacity-100 transition-all hover:bg-white text-slate-600 focus:outline-none"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Scroll Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 border shadow-md opacity-0 group-hover/container:opacity-100 transition-all hover:bg-white text-slate-600 focus:outline-none"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar px-8 pb-4"
            >
                {colorPallets.map((c: any) => {
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
                                        //   onClick={(e) => {
                                        //     e.stopPropagation();
                                        //     handleUpdateColor(c.colors);
                                        //   }}
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
    )
}

export default AllColorPallets