import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BgTab = "color" | "gradient" | "image" | "video" | "pattern" | "mask";

interface GradientStop {
  id: string;
  position: number; // 0–100
  color: string;
  opacity: number; // 0–100
}

interface BackgroundState {
  activeTab: BgTab;

  // Color
  color: string;
  colorOpacity: string;

  // Gradient
  gradientStops: GradientStop[];
  gradientType: string;
  gradientPosition: string;
  repeatGradient: boolean;
  gradientLength: string;
  placeGradientAboveBgImage: boolean;

  // Image
  imageUrl: string;
  useParallax: boolean;
  imageSize: string;
  imagePosition: string;
  imageRepeat: string;
  imageBlend: string;

  // Video
  videoMp4: string;
  videoWebm: string;
  videoWidth: string;
  videoHeight: string;
  pauseWhenAnotherPlays: boolean;
  pauseWhenNotInView: boolean;

  // Pattern
  patternType: string;
  patternColor: string;
  patternColorOpacity: string;
  patternTransform: string; // "none" | "flip-h" | "flip-v" | "rotate" | "scale"
  patternSize: string;
  patternRepeatOrigin: string;
  patternHorizontalOffset: string;
  patternVerticalOffset: string;
  patternRepeat: string;
  patternBlend: string;

  // Mask
  maskType: string;
  maskColor: string;
  maskColorOpacity: string;
  maskTransform: string;
  maskAspectRatio: string;
  maskSize: string;
  maskBlend: string;
}

const DEFAULT_STOP_A: GradientStop = {
  id: "s1",
  position: 0,
  color: "#1abc9c",
  opacity: 100,
};
const DEFAULT_STOP_B: GradientStop = {
  id: "s2",
  position: 100,
  color: "#3b82f6",
  opacity: 100,
};

export const DEFAULT_BACKGROUND: BackgroundState = {
  activeTab: "color",
  color: "",
  colorOpacity: "100",
  gradientStops: [DEFAULT_STOP_A, DEFAULT_STOP_B],
  gradientType: "Linear",
  gradientPosition: "Center",
  repeatGradient: false,
  gradientLength: "100",
  placeGradientAboveBgImage: false,
  imageUrl: "",
  useParallax: false,
  imageSize: "Cover",
  imagePosition: "Center",
  imageRepeat: "No Repeat",
  imageBlend: "Normal",
  videoMp4: "",
  videoWebm: "",
  videoWidth: "",
  videoHeight: "",
  pauseWhenAnotherPlays: false,
  pauseWhenNotInView: true,
  patternType: "Pills",
  patternColor: "#000000",
  patternColorOpacity: "20",
  patternTransform: "none",
  patternSize: "Actual Size",
  patternRepeatOrigin: "Top Left",
  patternHorizontalOffset: "0",
  patternVerticalOffset: "0",
  patternRepeat: "Repeat",
  patternBlend: "Normal",
  maskType: "Diagonal Bars 2",
  maskColor: "#FFFFFF",
  maskColorOpacity: "100",
  maskTransform: "none",
  maskAspectRatio: "wide",
  maskSize: "Stretch to Fill",
  maskBlend: "Normal",
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function SelectInput({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 transition-all">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 px-2.5 appearance-none cursor-pointer"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <div className="pr-2.5 pointer-events-none">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 3.5l3 3 3-3"
              stroke="#94a3b8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <label className="text-xs text-slate-500 font-medium tracking-wide leading-tight pr-3">
        {label}
      </label>
      <button
        onClick={() => onChange(!value)}
        className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors ${value ? "bg-blue-500" : "bg-slate-200"}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? "left-4" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function ColorOpacityInput({
  label,
  color,
  opacity,
  onColorChange,
  onOpacityChange,
}: {
  label?: string;
  color: string;
  opacity: string;
  onColorChange: (v: string) => void;
  onOpacityChange: (v: string) => void;
}) {
  const colorRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div
          className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 cursor-pointer transition-all"
          onClick={() => colorRef.current?.click()}
        >
          <input
            ref={colorRef}
            type="color"
            value={color || "#000000"}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute opacity-0 w-0 h-0"
          />
          <div
            className="w-5 h-5 rounded ml-2 mr-2 border border-slate-200 flex-shrink-0"
            style={{ backgroundColor: color || "#000" }}
          />
          <span className="text-xs font-mono text-slate-700 flex-1">
            {(color || "#000000").replace("#", "")}
          </span>
          <div className="w-px h-4 bg-slate-200 mr-2" />
          <span className="pr-2.5 text-xs text-slate-400">—</span>
        </div>
        <div
          className="flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 transition-all"
          style={{ width: 72 }}
        >
          <input
            type="text"
            value={opacity}
            onChange={(e) => onOpacityChange(e.target.value)}
            className="flex-1 w-8 bg-transparent border-none outline-none text-xs font-mono text-slate-700 px-2.5"
            placeholder="100"
          />
          <div className="w-px h-4 bg-slate-200" />
          <span className="px-2 text-xs font-mono text-slate-400">%</span>
        </div>
      </div>
    </div>
  );
}

function SimpleInput({
  label,
  value,
  onChange,
  suffix,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        {label}
      </label>
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg h-8 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-slate-700 px-2.5 placeholder-slate-400"
        />
        {suffix && (
          <>
            <div className="w-px h-4 bg-slate-200" />
            <span className="px-2.5 text-xs font-mono text-slate-400">
              {suffix}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function UploadBox({
  label,
  value,
  onAdd,
}: {
  label: string;
  value: string;
  onAdd: () => void;
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
          {label}
        </label>
      )}
      <div
        onClick={onAdd}
        className="border-2 border-dashed border-slate-200 rounded-xl h-28 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
      >
        {value ? (
          <img
            src={value}
            alt=""
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M3 8h10"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs text-slate-400">
              {label ? `Add ${label}` : "Add"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Gradient Stop Bar ────────────────────────────────────────────────────────

function GradientStopBar({
  stops,
  onChange,
}: {
  stops: GradientStop[];
  onChange: (stops: GradientStop[]) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(stops[0]?.id ?? "");
  const barRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  // Build gradient CSS
  const gradientCss = sortedStops
    .map((s) => {
      const r = parseInt(s.color.slice(1, 3), 16);
      const g = parseInt(s.color.slice(3, 5), 16);
      const b = parseInt(s.color.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${s.opacity / 100}) ${s.position}%`;
    })
    .join(", ");

  const selectedStop = stops.find((s) => s.id === selectedId);

  // Click on bar → add stop
  function handleBarClick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).dataset.handle) return; // clicked handle, not bar
    const rect = barRef.current!.getBoundingClientRect();
    const pos = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const newStop: GradientStop = {
      id: `s${Date.now()}`,
      position: Math.max(0, Math.min(100, pos)),
      color: "#ffffff",
      opacity: 100,
    };
    const updated = [...stops, newStop];
    onChange(updated);
    setSelectedId(newStop.id);
  }

  // Drag handle
  function startDrag(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setSelectedId(id);
    const bar = barRef.current!;

    function onMove(me: MouseEvent) {
      const rect = bar.getBoundingClientRect();
      const pos = Math.round(((me.clientX - rect.left) / rect.width) * 100);
      onChange(
        stops.map((s) =>
          s.id === id ? { ...s, position: Math.max(0, Math.min(100, pos)) } : s,
        ),
      );
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function deleteStop(id: string) {
    if (stops.length <= 2) return; // keep at least 2
    const updated = stops.filter((s) => s.id !== id);
    onChange(updated);
    if (selectedId === id) setSelectedId(updated[0].id);
  }

  function updateSelected(key: keyof GradientStop, val: any) {
    onChange(
      stops.map((s) => (s.id === selectedId ? { ...s, [key]: val } : s)),
    );
  }

  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        Gradient Stops
      </label>

      {/* Gradient preview box */}
      <div
        className="w-full h-28 rounded-xl mb-3"
        style={{ background: `linear-gradient(to right, ${gradientCss})` }}
      />

      {/* Stop bar */}
      <div className="relative mb-4">
        <div
          ref={barRef}
          onClick={handleBarClick}
          className="relative h-4 rounded-full cursor-crosshair"
          style={{
            background: `linear-gradient(to right, ${gradientCss})`,
            border: "2px solid #e2e8f0",
          }}
          title="Click to add stop"
        >
          {sortedStops.map((stop) => (
            <div
              key={stop.id}
              data-handle="true"
              onMouseDown={(e) => startDrag(e, stop.id)}
              onDoubleClick={() => deleteStop(stop.id)}
              title="Drag to move · Double-click to delete"
              style={{
                position: "absolute",
                left: `${stop.position}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: stop.color,
                border:
                  selectedId === stop.id
                    ? "3px solid #3b82f6"
                    : "2px solid white",
                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                cursor: "grab",
                zIndex: 10,
                userSelect: "none",
              }}
            />
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Click bar to add stop · Double-click handle to delete
        </p>
      </div>

      {/* Selected stop editor */}
      {selectedStop && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2">
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-2">
            Selected Stop
          </p>
          <ColorOpacityInput
            color={selectedStop.color}
            opacity={String(selectedStop.opacity)}
            onColorChange={(v) => updateSelected("color", v)}
            onOpacityChange={(v) => updateSelected("opacity", Number(v))}
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Position
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={selectedStop.position}
              onChange={(e) =>
                updateSelected("position", Number(e.target.value))
              }
              className="flex-1 accent-blue-500 w-20"
            />
            <span className="text-xs font-mono text-slate-600 w-8 text-right">
              {selectedStop.position}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Transform Icon buttons ───────────────────────────────────────────────────

const TransformIcons = {
  none: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7h10M7 2l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "flip-h": (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 2v10M2 5l5-3 5 3M2 9l5 3 5-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  rotate: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M11 3a6 6 0 1 0 1.5 4M11 3h-3M11 3v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  scale: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="2"
        y="2"
        width="10"
        height="10"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 5h4v4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
};

function TransformButtons({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const opts = Object.keys(TransformIcons) as (keyof typeof TransformIcons)[];
  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        Transform
      </label>
      <div className="flex gap-1">
        {opts.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`w-9 h-8 rounded-md flex items-center justify-center border transition-all ${
              value === opt
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300"
            }`}
          >
            {TransformIcons[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tab Icons ────────────────────────────────────────────────────────────────

const TabIcons: Record<BgTab, React.ReactNode> = {
  color: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 2a7 7 0 1 0 0 14A7 7 0 0 0 9 2Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path d="M9 2a7 7 0 1 0 0 14" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 2v14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  gradient: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="4"
        width="14"
        height="10"
        rx="2"
        fill="url(#gtab)"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <defs>
        <linearGradient
          id="gtab"
          x1="2"
          y1="9"
          x2="16"
          y2="9"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1abc9c" />
        </linearGradient>
      </defs>
    </svg>
  ),
  image: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="3"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="6" cy="7" r="1.5" fill="currentColor" opacity="0.5" />
      <path
        d="M2 13l4-4 3 3 2-2 5 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  video: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="1"
        y="4"
        width="11"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M12 7l5-2v8l-5-2V7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  pattern: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="10"
        y="2"
        width="6"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="2"
        y="10"
        width="6"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="10"
        y="10"
        width="6"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  ),
  mask: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="3"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M2 9l5-6 4 5 3-3 4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ─── Tab sections ─────────────────────────────────────────────────────────────

function ColorTab({
  s,
  u,
}: {
  s: BackgroundState;
  u: (k: string, v: any) => void;
}) {
  const colorRef = useRef<HTMLInputElement>(null);
  const hasColor = !!s.color;

  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        Background Color
      </label>
      <div
        onClick={() => colorRef.current?.click()}
        className="border-2 border-dashed border-slate-200 rounded-xl h-28 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all mb-3"
        style={hasColor ? { background: s.color, borderStyle: "solid" } : {}}
      >
        <input
          ref={colorRef}
          type="color"
          value={s.color || "#3b82f6"}
          onChange={(e) => u("color", e.target.value)}
          className="absolute opacity-0 w-0 h-0"
        />
        {!hasColor && (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M3 8h10"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs text-slate-400">Add Background Color</span>
          </>
        )}
      </div>
      <ColorOpacityInput
        color={s.color}
        opacity={s.colorOpacity}
        onColorChange={(v) => u("color", v)}
        onOpacityChange={(v) => u("colorOpacity", v)}
      />
    </div>
  );
}

function GradientTab({
  s,
  u,
}: {
  s: BackgroundState;
  u: (k: string, v: any) => void;
}) {
  return (
    <div>
      <GradientStopBar
        stops={s.gradientStops}
        onChange={(stops) => u("gradientStops", stops)}
      />
      <Toggle
        label="Toggle Gradient"
        value={!!s.repeatGradient}
        onChange={(v) => u("repeatGradient", v)}
      />
      <SelectInput
        label="Gradient Type"
        value={s.gradientType}
        options={["Linear", "Radial", "Circular", "Conic"]}
        onChange={(v) => u("gradientType", v)}
      />
      <SelectInput
        label="Gradient Position"
        value={s.gradientPosition}
        options={[
          "Center",
          "Top",
          "Bottom",
          "Left",
          "Right",
          "Top Left",
          "Top Right",
          "Bottom Left",
          "Bottom Right",
        ]}
        onChange={(v) => u("gradientPosition", v)}
      />
      <Toggle
        label="Repeat Gradient"
        value={s.repeatGradient}
        onChange={(v) => u("repeatGradient", v)}
      />
      <SimpleInput
        label="Gradient Length"
        value={s.gradientLength}
        onChange={(v) => u("gradientLength", v)}
        suffix="%"
      />
      <Toggle
        label="Place Gradient Above Background Image"
        value={s.placeGradientAboveBgImage}
        onChange={(v) => u("placeGradientAboveBgImage", v)}
      />
    </div>
  );
}

function ImageTab({
  s,
  u,
}: {
  s: BackgroundState;
  u: (k: string, v: any) => void;
}) {
  return (
    <div>
      <UploadBox label="Background Image" value={s.imageUrl} onAdd={() => {}} />
      <Toggle
        label="Use Parallax Effect"
        value={s.useParallax}
        onChange={(v) => u("useParallax", v)}
      />
      <SelectInput
        label="Background Image Size"
        value={s.imageSize}
        options={["Cover", "Contain", "Auto", "Stretch to Fit"]}
        onChange={(v) => u("imageSize", v)}
      />
      <SelectInput
        label="Background Image Position"
        value={s.imagePosition}
        options={[
          "Center",
          "Top",
          "Bottom",
          "Left",
          "Right",
          "Top Left",
          "Top Right",
          "Bottom Left",
          "Bottom Right",
        ]}
        onChange={(v) => u("imagePosition", v)}
      />
      <SelectInput
        label="Background Image Repeat"
        value={s.imageRepeat}
        options={[
          "No Repeat",
          "Repeat",
          "Repeat X",
          "Repeat Y",
          "Space",
          "Round",
        ]}
        onChange={(v) => u("imageRepeat", v)}
      />
      <SelectInput
        label="Background Image Blend"
        value={s.imageBlend}
        options={[
          "Normal",
          "Multiply",
          "Screen",
          "Overlay",
          "Darken",
          "Lighten",
          "Color Dodge",
          "Color Burn",
          "Hard Light",
          "Soft Light",
          "Difference",
          "Exclusion",
          "Hue",
          "Saturation",
          "Color",
          "Luminosity",
        ]}
        onChange={(v) => u("imageBlend", v)}
      />
    </div>
  );
}

function VideoTab({
  s,
  u,
}: {
  s: BackgroundState;
  u: (k: string, v: any) => void;
}) {
  return (
    <div>
      <UploadBox
        label="Background Video MP4"
        value={s.videoMp4}
        onAdd={() => {}}
      />
      <UploadBox
        label="Background Video Webm"
        value={s.videoWebm}
        onAdd={() => {}}
      />
      <SimpleInput
        label="Background Video Width"
        value={s.videoWidth}
        onChange={(v) => u("videoWidth", v)}
      />
      <SimpleInput
        label="Background Video Height"
        value={s.videoHeight}
        onChange={(v) => u("videoHeight", v)}
      />
      <Toggle
        label="Pause Video When Another Video Plays"
        value={s.pauseWhenAnotherPlays}
        onChange={(v) => u("pauseWhenAnotherPlays", v)}
      />
      <Toggle
        label="Pause Video While Not In View"
        value={s.pauseWhenNotInView}
        onChange={(v) => u("pauseWhenNotInView", v)}
      />
    </div>
  );
}

// Pattern preview (simple CSS-based patterns)
const PATTERN_STYLES: Record<string, React.CSSProperties> = {
  Pills: {
    backgroundImage:
      "radial-gradient(ellipse 60% 40% at 50% 50%, #1abc9c 40%, transparent 41%), radial-gradient(ellipse 60% 40% at 50% 50%, #3b82f6 40%, transparent 41%)",
    backgroundSize: "40px 20px, 40px 20px",
    backgroundPosition: "0 0, 20px 10px",
  },
  Dots: {
    backgroundImage: "radial-gradient(circle, #1abc9c 30%, transparent 31%)",
    backgroundSize: "16px 16px",
  },
  Lines: {
    backgroundImage:
      "repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 2px, transparent 0, transparent 50%)",
    backgroundSize: "16px 16px",
  },
  Crosshatch: {
    backgroundImage:
      "repeating-linear-gradient(0deg, #3b82f6 0, #3b82f6 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 1px, transparent 0, transparent 50%)",
    backgroundSize: "16px 16px",
  },
  Waves: {
    backgroundImage:
      "repeating-linear-gradient(45deg, #1abc9c 0, #3b82f6 25%, transparent 0, transparent 50%)",
    backgroundSize: "32px 32px",
  },
};

function PatternTab({
  s,
  u,
}: {
  s: BackgroundState;
  u: (k: string, v: any) => void;
}) {
  const preview = PATTERN_STYLES[s.patternType] ?? PATTERN_STYLES["Pills"];
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        Background Pattern
      </label>
      <div
        className="w-full h-28 rounded-xl mb-3 border border-slate-200"
        style={preview}
      />
      <SelectInput
        value={s.patternType}
        options={[
          "Pills",
          "Dots",
          "Lines",
          "Crosshatch",
          "Waves",
          "Checkerboard",
          "Triangles",
          "Hexagons",
        ]}
        onChange={(v) => u("patternType", v)}
      />
      <ColorOpacityInput
        label="Pattern Color"
        color={s.patternColor}
        opacity={s.patternColorOpacity}
        onColorChange={(v) => u("patternColor", v)}
        onOpacityChange={(v) => u("patternColorOpacity", v)}
      />
      <TransformButtons
        value={s.patternTransform}
        onChange={(v) => u("patternTransform", v)}
      />
      <SelectInput
        label="Pattern Size"
        value={s.patternSize}
        options={["Actual Size", "Stretch to Fill", "Fit Width", "Fit Height"]}
        onChange={(v) => u("patternSize", v)}
      />
      <SelectInput
        label="Pattern Repeat Origin"
        value={s.patternRepeatOrigin}
        options={[
          "Top Left",
          "Top Center",
          "Top Right",
          "Center Left",
          "Center",
          "Center Right",
          "Bottom Left",
          "Bottom Center",
          "Bottom Right",
        ]}
        onChange={(v) => u("patternRepeatOrigin", v)}
      />
      <SimpleInput
        label="Pattern Horizontal Offset"
        value={s.patternHorizontalOffset}
        onChange={(v) => u("patternHorizontalOffset", v)}
        suffix="%"
      />
      <SimpleInput
        label="Pattern Vertical Offset"
        value={s.patternVerticalOffset}
        onChange={(v) => u("patternVerticalOffset", v)}
        suffix="%"
      />
      <SelectInput
        label="Pattern Repeat"
        value={s.patternRepeat}
        options={[
          "Repeat",
          "Repeat X",
          "Repeat Y",
          "No Repeat",
          "Space",
          "Round",
        ]}
        onChange={(v) => u("patternRepeat", v)}
      />
      <SelectInput
        label="Pattern Blend Mode"
        value={s.patternBlend}
        options={[
          "Normal",
          "Multiply",
          "Screen",
          "Overlay",
          "Darken",
          "Lighten",
          "Color Dodge",
          "Soft Light",
          "Difference",
        ]}
        onChange={(v) => u("patternBlend", v)}
      />
    </div>
  );
}

function MaskAspectButton({
  value,
  current,
  onChange,
  icon,
}: {
  value: string;
  current: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onChange(value)}
      className={`w-9 h-8 rounded-md flex items-center justify-center border transition-all ${
        current === value
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300"
      }`}
    >
      {icon}
    </button>
  );
}

function MaskTab({
  s,
  u,
}: {
  s: BackgroundState;
  u: (k: string, v: any) => void;
}) {
  const maskPreviews: Record<string, React.CSSProperties> = {
    "Diagonal Bars 2": {
      background:
        "repeating-linear-gradient(45deg, #1abc9c 0, #1abc9c 10px, #3b82f6 10px, #3b82f6 20px)",
    },
    Stripes: {
      background:
        "repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 10px, #1abc9c 10px, #1abc9c 20px)",
    },
    Dots: {
      backgroundImage: "radial-gradient(circle, #1abc9c 30%, #3b82f6 31%)",
      backgroundSize: "20px 20px",
    },
  };
  const preview = maskPreviews[s.maskType] ?? maskPreviews["Diagonal Bars 2"];

  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
        Background Mask
      </label>
      <div
        className="w-full h-28 rounded-xl mb-3 border border-slate-200 overflow-hidden"
        style={preview}
      />
      <SelectInput
        value={s.maskType}
        options={[
          "Diagonal Bars 2",
          "Stripes",
          "Dots",
          "Waves",
          "Checkerboard",
          "Triangles",
          "Circles",
          "Hexagons",
          "Arrows",
        ]}
        onChange={(v) => u("maskType", v)}
      />
      <ColorOpacityInput
        label="Mask Color"
        color={s.maskColor}
        opacity={s.maskColorOpacity}
        onColorChange={(v) => u("maskColor", v)}
        onOpacityChange={(v) => u("maskColorOpacity", v)}
      />
      <TransformButtons
        value={s.maskTransform}
        onChange={(v) => u("maskTransform", v)}
      />
      <div className="mb-3">
        <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
          Mask Aspect Ratio
        </label>
        <div className="flex gap-1">
          <MaskAspectButton
            value="wide"
            current={s.maskAspectRatio}
            onChange={(v) => u("maskAspectRatio", v)}
            icon={
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="16"
                  height="12"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            }
          />
          <MaskAspectButton
            value="square"
            current={s.maskAspectRatio}
            onChange={(v) => u("maskAspectRatio", v)}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="12"
                  height="12"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            }
          />
          <MaskAspectButton
            value="tall"
            current={s.maskAspectRatio}
            onChange={(v) => u("maskAspectRatio", v)}
            icon={
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="8"
                  height="12"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            }
          />
        </div>
      </div>
      <SelectInput
        label="Mask Size"
        value={s.maskSize}
        options={[
          "Stretch to Fill",
          "Actual Size",
          "Fit Width",
          "Fit Height",
          "Tile",
        ]}
        onChange={(v) => u("maskSize", v)}
      />
      <SelectInput
        label="Mask Blend Mode"
        value={s.maskBlend}
        options={[
          "Normal",
          "Multiply",
          "Screen",
          "Overlay",
          "Darken",
          "Lighten",
          "Color Dodge",
          "Soft Light",
          "Difference",
        ]}
        onChange={(v) => u("maskBlend", v)}
      />
    </div>
  );
}

// ─── BackgroundPanel ──────────────────────────────────────────────────────────

export function BackgroundPanel({
  updateField,
  background,
}: {
  updateField: (key: string, val: any) => void;
  background: BackgroundState | undefined;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const s = background ?? DEFAULT_BACKGROUND;
  const activeTab = s.activeTab;

  const TABS: BgTab[] = [
    "color",
    "gradient",
    "image",
    "video",
    "pattern",
    "mask",
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
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
          Background
        </span>
      </button>

      {!collapsed && (
        <div className="pb-4 border-t border-slate-100">
          <div className="pt-3">
            {/* Tab label */}
            <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">
              Background
            </label>

            {/* Tab bar */}
            <div className="flex border-b border-slate-100 mb-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => updateField("activeTab", tab)}
                  className={`flex-1 flex items-center justify-center py-2 transition-all relative ${
                    activeTab === tab
                      ? "text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {TabIcons[tab]}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0.5 right-0.5 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "color" && <ColorTab s={s} u={updateField} />}
            {activeTab === "gradient" && <GradientTab s={s} u={updateField} />}
            {activeTab === "image" && <ImageTab s={s} u={updateField} />}
            {activeTab === "video" && <VideoTab s={s} u={updateField} />}
            {activeTab === "pattern" && <PatternTab s={s} u={updateField} />}
            {activeTab === "mask" && <MaskTab s={s} u={updateField} />}
          </div>
        </div>
      )}
    </div>
  );
}

type SizeUnit = string;

function withOpacity(color: string, opacity?: number) {
  if (!color) return undefined;
  if (opacity === undefined) return color;

  const alpha = Math.max(0, Math.min(1, opacity / 100));

  // If already rgba
  if (color.startsWith("rgba")) return color;

  // Convert hex to rgba
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

function mapPosition(pos?: string) {
  const map: Record<string, string> = {
    Center: "center",
    Top: "top",
    Bottom: "bottom",
    Left: "left",
    Right: "right",
    "Top Left": "top left",
    "Top Right": "top right",
    "Bottom Left": "bottom left",
    "Bottom Right": "bottom right",
  };
  return map[pos || "Center"] || "center";
}

function mapImageSize(size?: string) {
  const map: Record<string, string> = {
    Cover: "cover",
    Contain: "contain",
    Auto: "auto",
    "Stretch to Fit": "100% 100%",
  };
  return map[size || "Cover"] || "cover";
}

function mapRepeat(repeat?: string) {
  const map: Record<string, string> = {
    "No Repeat": "no-repeat",
    Repeat: "repeat",
    "Repeat X": "repeat-x",
    "Repeat Y": "repeat-y",
    Space: "space",
    Round: "round",
  };
  return map[repeat || "No Repeat"] || "no-repeat";
}

export function getBackgroundCSS(bg: any): React.CSSProperties {
  if (!bg) return {};

  const css: React.CSSProperties = {};

  // ───────────────────────── COLOR ─────────────────────────
  if (bg.activeTab === "color") {
    css.backgroundColor = withOpacity(bg.color, bg.colorOpacity);
  }

  // ───────────────────────── GRADIENT ─────────────────────────
  if (bg.activeTab === "gradient" && bg.gradientStops?.length) {
    const stops = bg.gradientStops
      .map((s: any) => `${withOpacity(s.color, s.opacity)} ${s.position}%`)
      .join(", ");

    let gradient = "";

    switch (bg.gradientType) {
      case "Radial":
      case "Circular":
        gradient = `radial-gradient(${stops})`;
        break;
      case "Conic":
        gradient = `conic-gradient(${stops})`;
        break;
      default:
        gradient = `linear-gradient(${stops})`;
    }

    if (bg.repeatGradient) {
      gradient = `repeating-${gradient}`;
    }

    css.backgroundImage = gradient;
  }

  // ───────────────────────── IMAGE ─────────────────────────
  if (bg.activeTab === "image" && bg.imageUrl) {
    css.backgroundImage = `url(${bg.imageUrl})`;
    css.backgroundSize = mapImageSize(bg.imageSize);
    css.backgroundPosition = mapPosition(bg.imagePosition);
    css.backgroundRepeat = mapRepeat(bg.imageRepeat);

    if (bg.imageBlend && bg.imageBlend !== "Normal") {
      css.backgroundBlendMode = bg.imageBlend.toLowerCase();
    }

    if (bg.useParallax) {
      css.backgroundAttachment = "fixed";
    }
  }

  // ───────────────────────── GRADIENT OVER IMAGE ─────────────────────────
  if (bg.placeGradientAboveBgImage && bg.gradientStops?.length && bg.imageUrl) {
    const stops = bg.gradientStops
      .map((s: any) => `${withOpacity(s.color, s.opacity)} ${s.position}%`)
      .join(", ");

    const gradient = `linear-gradient(${stops})`;

    css.backgroundImage = `${gradient}, url(${bg.imageUrl})`;
  }

  // ───────────────────────── PATTERN (basic CSS fallback) ─────────────────────────
  if (bg.activeTab === "pattern") {
    const color = withOpacity(bg.patternColor, bg.patternColorOpacity);

    if (bg.patternType === "Dots") {
      css.backgroundImage = `radial-gradient(${color} 1px, transparent 1px)`;
      css.backgroundSize = "20px 20px";
    }

    if (bg.patternType === "Lines") {
      css.backgroundImage = `repeating-linear-gradient(
        45deg,
        ${color},
        ${color} 2px,
        transparent 2px,
        transparent 10px
      )`;
    }
  }

  // ───────────────────────── MASK ─────────────────────────
  if (bg.activeTab === "mask") {
    css.maskImage = `radial-gradient(circle, black 60%, transparent 100%)`;
    css.WebkitMaskImage = css.maskImage;
  }

  return css;
}
