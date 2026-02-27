"use client";
import { createUsePuck, Puck, usePuck } from "@puckeditor/core";

export function Canvas() {
  const usePuck = createUsePuck();
  const { appState } = usePuck((s) => s);
  const viewportWidth = appState.ui.viewports.current.width;

  return (
    <main className="flex flex-1 flex-col items-center overflow-auto bg-slate-100 p-8 gap-6">
      {/* Page canvas */}
      <div
        className="bg-white ring-1 ring-slate-200 min-h-screen transition-all duration-300 ease-in-out"
        style={{
          width:
            typeof viewportWidth === "number" ? `${viewportWidth}px` : "100%",
        }}
      >
        <Puck.Preview />
      </div>
    </main>
  );
}
