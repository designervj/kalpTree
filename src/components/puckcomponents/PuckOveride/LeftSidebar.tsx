import { Puck } from "@puckeditor/core";
import { ChevronLeft, Layers, LayoutGrid, Sheet } from "lucide-react";
import { useState } from "react";

type PanelId = "components" | "outline" | null | "pages";

function RailButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        group relative flex flex-col items-center justify-center w-full py-3 gap-1
        transition-all duration-150 cursor-pointer border-none outline-none
        ${active
          ? "bg-indigo-50 text-indigo-600"
          : "bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        }
      `}
    >
      {/* Active indicator bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-r-full" />
      )}
      <Icon
        size={18}
        strokeWidth={active ? 2.2 : 1.8}
        className="transition-transform duration-150 group-hover:scale-110"
      />
      <span className="text-[9px] font-semibold tracking-widest uppercase leading-none">
        {label}
      </span>
    </button>
  );
}

export function LeftSidebar() {
  const [activePanel, setActivePanel] = useState<PanelId>("components");

  const toggle = (panel: PanelId) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const isOpen = activePanel !== null;

  return (
    <div className="flex h-full flex-shrink-0 border-r border-slate-200">
      {/* Icon rail — always visible */}
      <div className="flex w-14 flex-col border-r border-slate-200 bg-white py-2">
        <RailButton
          icon={LayoutGrid}
          label="Blocks"
          active={activePanel === "components"}
          onClick={() => toggle("components")}
        />
        <RailButton
          icon={Layers}
          label="Outline"
          active={activePanel === "outline"}
          onClick={() => toggle("outline")}
        />
        <RailButton
          icon={Sheet}
          label="Pages"
          active={activePanel === "pages"}
          onClick={() => toggle("pages")}
        />
      </div>

      {/* Expandable panel */}
      <div
        className={`
          flex flex-col bg-white overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "w-56 opacity-100" : "w-0 opacity-0"}
        `}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {activePanel === "components" ? "Blocks" : "Outline"}
          </span>
          <button
            onClick={() => setActivePanel(null)}
            className="p-0.5 rounded text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {activePanel === "components" && (
            <div className="[&_[data-puck-component]]:!rounded-md [&_[data-puck-component]]:!border [&_[data-puck-component]]:!border-slate-200 [&_[data-puck-component]]:!bg-white [&_[data-puck-component]]:hover:!border-indigo-300 [&_[data-puck-component]]:hover:!bg-indigo-50 [&_[data-puck-component]]:!transition-colors [&_[data-puck-component]]:!cursor-grab [&_[data-puck-component]]:!text-slate-600 [&_[data-puck-component]]:!text-sm [&_[data-puck-component]]:!font-medium [&_[data-puck-component]]:!shadow-none">
              <Puck.Components />
            </div>
          )}
          {activePanel === "outline" && (
            <div className="text-sm text-slate-600">
              <Puck.Outline />
            </div>
          )}
          {activePanel === "pages" && (
            <div className="text-sm text-slate-600">Pages</div>
          )}
        </div>
      </div>
    </div>
  );
}
