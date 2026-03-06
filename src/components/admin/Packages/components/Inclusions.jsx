import { useState, useRef } from "react";
import { uid, cls } from "../utils/helpers";
import { Card, Btn, FL } from "./UI";
import { Ic } from "./Icons";

// ─── EDITABLE LIST ITEM ───────────────────────────────────────────
const EditableListItem = ({ value, onBlur, onRemove, icon, rowCls, iconCls }) => {
  const [local, setLocal] = useState(value);
  const prevRef = useRef(value);
  if (prevRef.current !== value && document.activeElement?.dataset?.itemid !== String(value)) {
    prevRef.current = value;
    setLocal(value);
  }
  return (
    <div className={cls("flex items-center gap-2 px-3 py-2.5 rounded-lg group", rowCls)}>
      <span className={cls("flex-shrink-0 font-bold text-sm", iconCls)}>{icon}</span>
      <input
        type="text" value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => { if (local.trim() !== value) onBlur(local.trim() || value); }}
        className="flex-1 bg-transparent text-sm text-gray-900 font-medium focus:outline-none border-none min-w-0 placeholder:text-gray-400"
        placeholder="Type here…"
      />
      <button type="button" onClick={onRemove} className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors rounded opacity-0 group-hover:opacity-100">
        <Ic.Trash />
      </button>
    </div>
  );
};

// ─── INCLUSIONS & EXCLUSIONS SECTION ─────────────────────────────
export const InclusionsExclusionsSection = ({ inclusions, exclusions, onChangeInc, onChangeExc }) => {
  const [newInc, setNewInc] = useState("");
  const [newExc, setNewExc] = useState("");
  const newIncRef = useRef(null);
  const newExcRef = useRef(null);

  const addInc = () => {
    const v = newInc.trim();
    if (!v) return;
    onChangeInc([...inclusions, v]);
    setNewInc("");
    setTimeout(() => newIncRef.current?.focus(), 0);
  };
  const addExc = () => {
    const v = newExc.trim();
    if (!v) return;
    onChangeExc([...exclusions, v]);
    setNewExc("");
    setTimeout(() => newExcRef.current?.focus(), 0);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center text-sm font-bold">3</div>
        <div>
          <h3 className="font-bold text-gray-900">What's Inside the Package?</h3>
          <p className="text-xs text-gray-400 mt-0.5">Add inclusions (what's covered) and exclusions (what's not covered)</p>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <div className="px-5 py-3 bg-emerald-50 border-b border-gray-200 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
            <span className="text-sm font-bold text-emerald-800">Inclusions</span>
            <span className="ml-auto text-xs text-emerald-600 font-semibold">{inclusions.length} item{inclusions.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="px-5 py-3 bg-red-50 border-b border-gray-200 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">✕</div>
            <span className="text-sm font-bold text-red-700">Exclusions</span>
            <span className="ml-auto text-xs text-red-500 font-semibold">{exclusions.length} item{exclusions.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        {/* Rows */}
        {(inclusions.length > 0 || exclusions.length > 0) && (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: Math.max(inclusions.length, exclusions.length) }).map((_, i) => (
              <div key={i} className="grid grid-cols-2 divide-x divide-gray-100">
                <div className="px-4 py-1">
                  {inclusions[i] !== undefined ? (
                    <EditableListItem value={inclusions[i]} onBlur={(v) => onChangeInc(inclusions.map((x, j) => (j === i ? v : x)))} onRemove={() => onChangeInc(inclusions.filter((_, j) => j !== i))} icon="✓" rowCls="bg-white" iconCls="text-emerald-500" />
                  ) : <div className="h-10" />}
                </div>
                <div className="px-4 py-1">
                  {exclusions[i] !== undefined ? (
                    <EditableListItem value={exclusions[i]} onBlur={(v) => onChangeExc(exclusions.map((x, j) => (j === i ? v : x)))} onRemove={() => onChangeExc(exclusions.filter((_, j) => j !== i))} icon="✕" rowCls="bg-white" iconCls="text-red-400" />
                  ) : <div className="h-10" />}
                </div>
              </div>
            ))}
          </div>
        )}
        {inclusions.length === 0 && exclusions.length === 0 && (
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <div className="px-5 py-6 text-center text-xs text-gray-400 italic">No inclusions yet</div>
            <div className="px-5 py-6 text-center text-xs text-gray-400 italic">No exclusions yet</div>
          </div>
        )}
        {/* Add row */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 border-t border-gray-200 bg-gray-50/60">
          <div className="px-4 py-3 flex gap-2">
            <input ref={newIncRef} type="text" placeholder="+ Type inclusion and press Enter…" value={newInc} onChange={(e) => setNewInc(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInc(); } }} className="flex-1 px-3 py-1.5 text-sm text-gray-900 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/30 bg-white placeholder:text-gray-400 min-w-0" />
            <button type="button" onClick={addInc} className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors flex-shrink-0 flex items-center gap-1"><Ic.Plus />Add</button>
          </div>
          <div className="px-4 py-3 flex gap-2">
            <input ref={newExcRef} type="text" placeholder="+ Type exclusion and press Enter…" value={newExc} onChange={(e) => setNewExc(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExc(); } }} className="flex-1 px-3 py-1.5 text-sm text-gray-900 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300/30 bg-white placeholder:text-gray-400 min-w-0" />
            <button type="button" onClick={addExc} className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors flex-shrink-0 flex items-center gap-1"><Ic.Plus />Add</button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ─── KBYG ITEM ────────────────────────────────────────────────────
const KBYGItem = ({ item, index, onBlur, onRemove }) => {
  const [local, setLocal] = useState(item.point);
  const prevRef = useRef(item.point);
  if (prevRef.current !== item.point) { prevRef.current = item.point; setLocal(item.point); }
  return (
    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl group">
      <div className="w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{index + 1}</div>
      <textarea value={local} onChange={(e) => setLocal(e.target.value)} onBlur={() => { if (local.trim() !== item.point) onBlur(local.trim() || item.point); }} rows={2}
        className="flex-1 bg-transparent text-sm text-gray-900 leading-relaxed focus:outline-none resize-none border-b border-transparent focus:border-amber-400 transition-colors min-w-0"
        placeholder="Enter guideline or policy…" />
      <button type="button" onClick={onRemove} className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 rounded-lg hover:bg-red-50 mt-0.5"><Ic.Trash /></button>
    </div>
  );
};

// ─── KNOW BEFORE YOU GO SECTION ──────────────────────────────────
export const KnowBeforeYouGoSection = ({ points, onChange }) => {
  const [newPt, setNewPt] = useState("");
  const inputRef = useRef(null);

  const handleAdd = () => {
    const v = newPt.trim();
    if (!v) return;
    onChange([...points, { id: uid(), point: v }]);
    setNewPt("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">Know Before You Go</h3>
            {points.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                {points.length} point{points.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Important traveller guidelines, policies and notices</p>
        </div>
      </div>
      {points.length === 0 && (
        <div className="py-8 text-center border-2 border-dashed border-amber-200 rounded-xl bg-amber-50/30 mb-4">
          <p className="text-sm font-semibold text-amber-800">No guidelines added yet</p>
          <p className="text-xs text-gray-400 mt-1">Add important policies travellers should know before booking</p>
        </div>
      )}
      {points.length > 0 && (
        <div className="space-y-2 mb-4">
          {points.map((pt, i) => (
            <KBYGItem key={pt.id} item={pt} index={i}
              onBlur={(v) => onChange(points.map((p) => (p.id === pt.id ? { ...p, point: v } : p)))}
              onRemove={() => onChange(points.filter((p) => p.id !== pt.id))}
            />
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input ref={inputRef} type="text" placeholder="Type a guideline and press Enter or click Add…" value={newPt} onChange={(e) => setNewPt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }} className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 bg-white placeholder:text-gray-400" />
        <Btn variant="primary" size="sm" onClick={handleAdd}><Ic.Plus />Add Point</Btn>
      </div>
    </Card>
  );
};
