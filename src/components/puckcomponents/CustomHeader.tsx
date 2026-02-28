import { useState, useRef, useEffect } from "react";
import { DEFAULT_TEXT, TagStyleEditor } from "./CustomText";
import { Button } from "../ui/button";

const PresetRow = ({
  preset,
  isSelected,
  onSelect,
  onClose,
  onApplyStyle,
  onDuplicate,
  onDelete,
  onSetDefault,
  handleEditingSelection,
}: any) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
        isSelected ? "bg-blue-600" : "hover:bg-blue-500/10"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        onSelect(preset);
        onClose();
      }}
    >
      <span
        className={`text-xs ${
          isSelected ? "text-white font-medium" : "text-slate-400"
        }`}
      >
        {preset.presetname}
      </span>

      {/* Action icons — show on hover or when selected */}
      {(hovered || isSelected) && (
        <div
          className="flex items-center gap-1 ml-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Settings */}
          <button
            title="Settings"
            onClick={(e) => {
              handleEditingSelection(preset);
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors text-[11px]"
          >
            ⚙
          </button>

          {/* Apply current styles */}
          <button
            title="Apply Current Styles"
            onClick={(e) => {
              e.stopPropagation();
              onApplyStyle(preset);
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2v6M6 2L4 4M6 2l2 2M2 9h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Duplicate */}
          <button
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(preset);
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <rect
                x="1"
                y="3"
                width="7"
                height="8"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M4 3V2a1 1 0 011-1h5a1 1 0 011 1v7a1 1 0 01-1 1h-1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Delete */}
          <button
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(preset);
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-white/80 hover:text-red-400 hover:bg-white/20 transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 3h8M5 3V2h2v1M4 3l.5 7h3L8 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Set as default / star */}
          <button
            title="Set as Default"
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault(preset);
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-yellow-300 hover:text-yellow-200 hover:bg-white/20 transition-colors text-[11px]"
          >
            ★
          </button>
        </div>
      )}
    </div>
  );
};

const PresetDropdown = ({
  onClose,
  selectedPreset,
  onSelectPreset,
  presets,
  setPresets,
  handleAddPreset,
  handleEditingSelection,
}: any) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleApplyStyle = (_preset: any) => {
    // hook: apply current styles to preset
  };

  const handleDuplicate = (preset: any) => {
    setPresets((prev: any[]) => [
      ...prev,
      { ...preset, presetname: `${preset.presetname} Copy`, default: false },
    ]);
  };

  const handleDelete = (preset: any) => {
    setPresets((prev: any[]) =>
      prev.filter((p) => p.presetname !== preset.presetname),
    );
  };

  const handleSetDefault = (preset: any) => {
    onSelectPreset(preset);
  };

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-1 w-56 bg-[#1a1d27] border border-[#2d3148] rounded-lg shadow-2xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#2d3148]">
        <div className="flex items-center gap-1.5">
          <span className="text-blue-400 text-xs">✓</span>
          <span className="text-xs font-semibold text-white">
            {selectedPreset.presetname} Default Preset
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5 pl-4">
          <span className="text-blue-400 text-[10px]">★</span>
          <span className="text-[11px] text-slate-400">
            Based on: {selectedPreset.presetname}
          </span>
        </div>
      </div>

      {/* Preset list */}
      <div className="py-1">
        {presets.map((p: any, idx: number) => (
          <PresetRow
            key={idx}
            preset={p}
            isSelected={selectedPreset.presetname === p.presetname}
            onSelect={onSelectPreset}
            onClose={onClose}
            onApplyStyle={handleApplyStyle}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
            handleEditingSelection={handleEditingSelection}
          />
        ))}
      </div>

      {/* Footer buttons */}
      <div className="border-t border-[#2d3148] p-2 flex flex-col gap-1.5">
        <button
          onClick={() => handleAddPreset("same")}
          className="w-full px-2.5 py-1.5 bg-[#252840] border border-[#3a3f60] rounded-md text-slate-300 text-xs cursor-pointer hover:bg-[#2e3352] hover:text-white transition-colors"
        >
          New Preset From Current Styles
        </button>
        <button
          onClick={() => handleAddPreset("new")}
          className="w-full px-2.5 py-1.5 bg-blue-600 border-none rounded-md text-white text-xs font-semibold cursor-pointer hover:bg-blue-500 transition-colors"
        >
          + Add New Preset
        </button>
      </div>
    </div>
  );
};

export const DefaultHeader = ({ setCollapsed, textlabel, collapsed }: any) => {
  const [showPresets, setShowPresets] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<any>({
    ...DEFAULT_TEXT,
    presetname: "Layout 1",
    default: true,
  });
  const [presets, setPresets] = useState<any[]>([
    { ...DEFAULT_TEXT, presetname: "Layout 1" },
  ]);

  const handleAddPreset = (type: string = "new") => {
    if (type !== "new") {
      setPresets((prev) => [
        ...prev,
        {
          ...selectedPreset,
          presetname: `Layout ${prev.length + 1}`,
          default: false,
        },
      ]);
    } else {
      setPresets((prev) => [
        ...prev,
        {
          ...DEFAULT_TEXT,
          presetname: `Layout ${prev.length + 1}`,
          default: false,
        },
      ]);
    }
  };
  const [editingSelection, setEditingSelection] = useState<any>(null);

  const handleEditingSelection = (preset: any) => {
    if (preset) {
      setEditingSelection(preset);
      setShowPresets(false);
    } else {
      setEditingSelection(null);
    }
  };

  function updateTagField(key: any, val: any) {
    console.log(key, val);
  }

  return (
    <div className="flex flex-col w-full relative">
      {/* Collapse toggle button */}
      <div className="flex">
        <button
          onClick={() => setCollapsed((c: any) => !c)}
          className="w-full flex items-center gap-2 transition-colors"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            className="text-blue-600 flex-shrink-0 transition-transform duration-200"
            style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-semibold text-blue-600 tracking-wide">
            {textlabel}
          </span>
        </button>

        {/* Preset badge */}
        {selectedPreset && (
          <span className="text-[11px] text-slate-500 bg-[#1e2135] border border-[#2d3148] rounded px-1.5 py-0.5 whitespace-nowrap mr-1">
            {selectedPreset.presetname} ×
          </span>
        )}

        {/* Dots button */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowPresets((s) => !s)}
            title="Assign Presets"
            className="flex items-center justify-center w-6 h-6 bg-transparent border-none cursor-pointer text-slate-500 rounded hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            ⋯
          </button>

          {showPresets && (
            <PresetDropdown
              onClose={() => setShowPresets(false)}
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              presets={presets}
              setPresets={setPresets}
              handleAddPreset={handleAddPreset}
              handleEditingSelection={handleEditingSelection}
            />
          )}
        </div>
      </div>
      {editingSelection && (
        <>
          <TagStyleEditor
            tag={`Heading Text ${editingSelection.activeTag}`}
            style={editingSelection[editingSelection.activeTag.toLowerCase()]}
            update={updateTagField}
            type={"update"}
          />
          <Button>Save Preset</Button>
        </>
      )}
    </div>
  );
};
