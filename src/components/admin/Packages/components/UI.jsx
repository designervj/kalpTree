import { cls } from "../utils/helpers";
import { Ic } from "./Icons";

// ─── BADGE ────────────────────────────────────────────────────────
export const Badge = ({ children, className = "" }) => (
  <span className={cls("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", className)}>
    {children}
  </span>
);

// ─── INPUT ────────────────────────────────────────────────────────
export const Inp = ({ className = "", ...p }) => (
  <input
    className={cls(
      "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 placeholder:text-gray-400 transition-all",
      className,
    )}
    {...p}
  />
);

// ─── TEXTAREA ─────────────────────────────────────────────────────
export const TA = ({ className = "", rows = 3, ...p }) => (
  <textarea
    rows={rows}
    className={cls(
      "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 placeholder:text-gray-400 transition-all resize-none",
      className,
    )}
    {...p}
  />
);

// ─── SELECT ───────────────────────────────────────────────────────
export const Sel = ({ options, placeholder, value, onChange, className = "" }) => (
  <select
    value={value || ""}
    onChange={onChange}
    className={cls(
      "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer",
      !value ? "text-gray-400" : "text-gray-900",
      className,
    )}
  >
    {placeholder && <option value="" disabled>{placeholder}</option>}
    {options.map((o) => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);

// ─── CARD ─────────────────────────────────────────────────────────
export const Card = ({ children, className = "" }) => (
  <div className={cls("bg-white rounded-xl border border-gray-100 shadow-sm", className)}>
    {children}
  </div>
);

// ─── FORM LABEL ───────────────────────────────────────────────────
export const FL = ({ children, required, optional }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
    {optional && <span className="ml-1 text-gray-400 font-normal normal-case">(optional)</span>}
  </label>
);

// ─── BUTTON ───────────────────────────────────────────────────────
export const Btn = ({ variant = "primary", size = "md", className = "", children, ...p }) => {
  const sz = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-sm",
  };
  const va = {
    primary: "bg-blue-950 text-white hover:bg-blue-900 shadow-sm",
    secondary: "bg-white text-blue-950 border border-blue-950 hover:bg-blue-50",
    success: "bg-emerald-700 text-white hover:bg-emerald-600 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-500",
    ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    soft: "bg-blue-50 text-blue-900 hover:bg-blue-100",
    dashed: "bg-white text-blue-900 border-2 border-dashed border-blue-300 hover:bg-blue-50",
    "d-em": "bg-white text-emerald-800 border-2 border-dashed border-emerald-300 hover:bg-emerald-50",
    "d-am": "bg-white text-amber-800 border-2 border-dashed border-amber-300 hover:bg-amber-50",
  };
  return (
    <button
      className={cls(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none disabled:opacity-50 gap-1.5 whitespace-nowrap",
        sz[size],
        va[variant],
        className,
      )}
      {...p}
    >
      {children}
    </button>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, wide = false }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cls("relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden", wide ? "max-w-3xl" : "max-w-2xl")}
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 text-lg">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 65px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
};
