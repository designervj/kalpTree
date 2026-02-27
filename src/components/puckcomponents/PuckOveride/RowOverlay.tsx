
import { Plus } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface RowOverlayProps {
  children: React.ReactNode;
  onAddComponent?: () => void;
  hovered?: boolean;
}

export function RowOverlay({
  children,
  onAddComponent,
  hovered,
}: RowOverlayProps) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!hovered) return;

    const getIframeDoc = () => {
      const iframe = document.querySelector(
        "iframe",
      ) as HTMLIFrameElement | null;
      return iframe?.contentDocument ?? iframe?.contentWindow?.document ?? null;
    };

    const measure = () => {
      const iframeDoc = getIframeDoc();
      if (!iframeDoc) return;

      // Query the exact selected draggable element using the class you found
      const selected = iframeDoc.querySelector(
        "._DraggableComponent--isSelected_1vaqy_57",
      ) as HTMLElement | null;

      if (!selected) return;

      const { height: h } = selected.getBoundingClientRect();
      if (h > 0) setHeight(h);
    };

    // Measure immediately on hover
    measure();

    // Also watch for size changes (e.g. dynamic content)
    const iframeDoc = getIframeDoc();
    const selected = iframeDoc?.querySelector(
      "._DraggableComponent--isSelected_1vaqy_57",
    ) as HTMLElement | null;

    if (!selected) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(selected);
    return () => ro.disconnect();
  }, [hovered]); // re-run whenever hover changes so we always track the right element

  return (
    <div className="relative w-full" style={{ minHeight: height || undefined }}>
      <div
        className={`absolute inset-0 pointer-events-none z-10 transition-all duration-150 outline outline-2 -outline-offset-1 ${
          hovered ? "outline-blue-500" : "outline-transparent"
        }`}
      />

      {hovered && (
        <div className="absolute top-0 left-0 z-20 flex items-center">
          <span className="bg-blue-500 text-white text-[10px] font-semibold px-1.5 py-0.5 leading-snug font-sans select-none">
            Row
          </span>
        </div>
      )}

      <div className="w-full h-full">{children}</div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddComponent?.();
        }}
        title="Add Module"
        style={{ top: height > 0 ? height - 14 : "calc(100% - 14px)" }}
        className={`absolute left-1/2 -translate-x-1/2 z-20 transition-opacity duration-150
          flex items-center justify-center w-7 h-7 rounded-full 
          bg-blue-500 hover:bg-blue-600 text-white border-none cursor-pointer shadow-md
          ${hovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
