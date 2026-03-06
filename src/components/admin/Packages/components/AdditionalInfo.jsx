import { useState, useRef } from "react";
import { emptyAdditionalInfo, cls } from "../utils/helpers";
import { Card, Btn, FL } from "./UI";
import { Ic } from "./Icons";

// ─── STRING LIST ITEM ─────────────────────────────────────────────
const StringListItem = ({ value, icon, iconCls, rowCls, onCommit, onRemove }) => {
  const [loc, setLoc] = useState(value);
  const extRef = useRef(value);
  if (extRef.current !== value) { extRef.current = value; setLoc(value); }
  return (
    <div className={cls("flex items-center gap-2 px-3 py-2 rounded-lg group", rowCls)}>
      <span className={cls("text-sm flex-shrink-0", iconCls)}>{icon}</span>
      <input type="text" value={loc} onChange={(e) => setLoc(e.target.value)} onBlur={() => { if (loc !== value) onCommit(loc || value); }} className="flex-1 bg-transparent text-sm text-gray-900 focus:outline-none min-w-0" />
      <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"><Ic.Trash /></button>
    </div>
  );
};

// ─── ADDITIONAL INFORMATION SECTION ──────────────────────────────
export const AdditionalInfoSection = ({ info, onChange }) => {
  const init = info || emptyAdditionalInfo();
  const [about, setAbout] = useState(init.aboutDestination || "");
  const [qi, setQi] = useState(init.quickInfo || { destinationsCovered: "", duration: "", startPoint: "", endPoint: "" });
  const [exps, setExps] = useState(init.experiencesCovered || []);
  const [ntm, setNtm] = useState(init.notToMiss || []);
  const [newExp, setNewExp] = useState("");
  const [newNtm, setNewNtm] = useState("");

  const flush = (patch) => onChange({ aboutDestination: about, quickInfo: qi, experiencesCovered: exps, notToMiss: ntm, ...patch });

  const addExp = () => {
    const v = newExp.trim(); if (!v) return;
    const next = [...exps, v]; setExps(next); setNewExp(""); flush({ experiencesCovered: next });
  };
  const addNtm = () => {
    const v = newNtm.trim(); if (!v) return;
    const next = [...ntm, v]; setNtm(next); setNewNtm(""); flush({ notToMiss: next });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center text-sm font-bold">6</div>
        <div>
          <h3 className="font-bold text-gray-900">Additional Information</h3>
          <p className="text-xs text-gray-400 mt-0.5">Destination overview, quick info, experiences and highlights</p>
        </div>
      </div>
      <div className="space-y-5">
        {/* About Destination */}
        <div>
          <FL optional>About the Destination</FL>
          <textarea rows={4} placeholder="Write a compelling overview of the destination for travellers…" value={about}
            onChange={(e) => setAbout(e.target.value)} onBlur={() => flush({ aboutDestination: about })}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 placeholder:text-gray-400 transition-all resize-none"
          />
        </div>

        {/* Quick Info */}
        <div>
          <FL>Quick Info</FL>
          <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            {[
              ["destinationsCovered", "🗺 Destinations Covered", "e.g. Phuket, Pattaya, Bangkok"],
              ["duration", "📅 Duration", "e.g. 7 Days, 6 Nights"],
              ["startPoint", "✈ Start Point", "e.g. Phuket International Airport (HKT)"],
              ["endPoint", "🏁 End Point", "e.g. Bangkok International Airport (BKK)"],
            ].map(([key, label, ph]) => (
              <div key={key}>
                <label className="block text-xs font-bold text-blue-900 mb-1">{label}</label>
                <input type="text" placeholder={ph} value={qi[key] || ""} onChange={(e) => setQi((q) => ({ ...q, [key]: e.target.value }))} onBlur={() => flush({ quickInfo: qi })}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 placeholder:text-gray-400 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Experiences Covered */}
        <div>
          <FL optional>Experiences Covered</FL>
          <div className="space-y-2 mb-2">
            {exps.length === 0 && <p className="text-xs text-gray-400 italic">No experiences added yet</p>}
            {exps.map((exp, i) => (
              <StringListItem key={`exp-${i}`} value={exp} icon="✦" iconCls="text-violet-500" rowCls="bg-violet-50 border border-violet-200"
                onCommit={(v) => { const next = exps.map((x, j) => (j === i ? v : x)); setExps(next); flush({ experiencesCovered: next }); }}
                onRemove={() => { const next = exps.filter((_, j) => j !== i); setExps(next); flush({ experiencesCovered: next }); }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="e.g. Snorkeling at Coral Island…" value={newExp} onChange={(e) => setNewExp(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExp(); } }} className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 bg-white placeholder:text-gray-400" />
            <Btn variant="primary" size="sm" onClick={addExp}><Ic.Plus />Add</Btn>
          </div>
        </div>

        {/* Not to Miss */}
        <div>
          <FL optional>Not to Miss</FL>
          <div className="space-y-2 mb-2">
            {ntm.length === 0 && <p className="text-xs text-gray-400 italic">No highlights added yet</p>}
            {ntm.map((item, i) => (
              <StringListItem key={`ntm-${i}`} value={item} icon="★" iconCls="text-rose-500" rowCls="bg-rose-50 border border-rose-200"
                onCommit={(v) => { const next = ntm.map((x, j) => (j === i ? v : x)); setNtm(next); flush({ notToMiss: next }); }}
                onRemove={() => { const next = ntm.filter((_, j) => j !== i); setNtm(next); flush({ notToMiss: next }); }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="e.g. Kecak fire dance at Uluwatu Temple…" value={newNtm} onChange={(e) => setNewNtm(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNtm(); } }} className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 bg-white placeholder:text-gray-400" />
            <Btn variant="primary" size="sm" onClick={addNtm}><Ic.Plus />Add</Btn>
          </div>
        </div>
      </div>
    </Card>
  );
};
