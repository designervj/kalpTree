import { useState, useRef } from "react";
import { emptyDayActivity, emptyDayHotel, emptyTransfer, cls } from "../utils/helpers";
import { OPTIONS, DAY_GRAD, DAY_BADGE } from "../utils/constants";
import { Btn, Inp, Sel, FL } from "./UI";
import { Ic } from "./Icons";
import { ActivityPicker } from "./Pickers";
import { HotelPicker } from "./Pickers";

// ─── DAY DESCRIPTION FIELD ────────────────────────────────────────
// Stable top-level to avoid focus loss on each keystroke
const DayDescriptionField = ({ dayId, value, onCommit }) => {
  const [local, setLocal] = useState(value || "");
  const prevId = useRef(dayId);
  if (prevId.current !== dayId) {
    prevId.current = dayId;
    setLocal(value || "");
  }
  return (
    <textarea
      rows={4}
      placeholder="Describe the full day experience — what travellers will see, do, feel and enjoy. This narrative appears on the package detail page."
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => { if (local !== (value || "")) onCommit(local); }}
      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 placeholder:text-gray-400 transition-all resize-none leading-relaxed"
    />
  );
};

// ─── ITINERARY BUILDER ────────────────────────────────────────────
export const ItineraryBuilder = ({ itinerary, setItinerary }) => {
  
  const [openDays, setOpenDays] = useState(() => new Set([itinerary[0]?.id]));
  const toggle = (id) => setOpenDays((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const updateDay = (id, f, v) => setItinerary((p) => p.map((d) => (d.id === id ? { ...d, [f]: v } : d)));
  const addHotel = (did) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, hotelStays: [...d.hotelStays, emptyDayHotel()] } : d));
  const removeHotel = (did, hid) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, hotelStays: d.hotelStays.filter((h) => h.id !== hid) } : d));
  const updateHotel = (did, hid, f, v) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, hotelStays: d.hotelStays.map((h) => h.id === hid ? { ...h, [f]: v } : h) } : d));
  const addAct = (did) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, activities: [...d.activities, emptyDayActivity()] } : d));
  const removeAct = (did, aid) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, activities: d.activities.filter((a) => a.id !== aid) } : d));
  const updateAct = (did, aid, f, v) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, activities: d.activities.map((a) => a.id === aid ? { ...a, [f]: v } : a) } : d));
  const addTr = (did) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, transfers: [...d.transfers, emptyTransfer()] } : d));
  const removeTr = (did, tid) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, transfers: d.transfers.filter((t) => t.id !== tid) } : d));
  const updateTr = (did, tid, f, v) => setItinerary((p) => p.map((d) => d.id === did ? { ...d, transfers: d.transfers.map((t) => t.id === tid ? { ...t, [f]: v } : t) } : d));

  if (itinerary.length === 0)
    return (
      <div className="py-12 text-center border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/40">
        <p className="text-sm font-bold text-blue-900">Select trip duration to generate days</p>
        <p className="text-xs text-gray-400 mt-1">Days auto-generate based on duration selection</p>
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
        <Ic.Sync />
        <span className="font-bold">{itinerary.length} days</span>
        <span className="text-blue-500">· Hotels & Activities link to Master Catalog · Two-way sync via activityRef/hotelRef</span>
      </div>
      {itinerary.map((day) => {
        const isOpen = openDays.has(day.id);
        return (
          <div key={day.id} className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <button
              type="button"
              onClick={() => toggle(day.id)}
              className={cls("w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r text-white", DAY_GRAD[day.dayType] || "from-blue-950 to-blue-900")}
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">{day.dayNumber}</div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-sm">{day.title || `Day ${day.dayNumber}`}</p>
                <p className="text-xs opacity-60">
                  {day.city && `${day.city} · `}{day.hotelStays.length} hotel · {day.activities.length} activity · {day.transfers.length} transfer
                </p>
              </div>
              <span className={cls("text-xs px-2.5 py-0.5 rounded-full border font-semibold", DAY_BADGE[day.dayType])}>{day.dayType}</span>
              <Ic.Chevron open={isOpen} />
            </button>

            {isOpen && (
              <div className="bg-white divide-y divide-gray-100">
                {/* Day Info */}
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div>
                    <FL>Day Title</FL>
                    <Inp value={day.title} onChange={(e) => updateDay(day.id, "title", e.target.value)} placeholder={`Day ${day.dayNumber}`} />
                  </div>
                  <div>
                    <FL>City</FL>
                    <Inp value={day.city} onChange={(e) => updateDay(day.id, "city", e.target.value)} placeholder="e.g. Jaipur" />
                  </div>
                  <div>
                    <FL>Day Type</FL>
                    <Sel options={OPTIONS.dayType} value={day.dayType} onChange={(e) => updateDay(day.id, "dayType", e.target.value)} />
                  </div>
                  <div>
                    <FL>Meals Included</FL>
                    <div className="flex items-center gap-3 h-9">
                      {OPTIONS.mealsOptions.map((m) => (
                        <label key={m} className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 font-medium">
                          <input
                            type="checkbox" className="w-3.5 h-3.5 rounded accent-blue-900"
                            checked={day.mealsIncluded.includes(m)}
                            onChange={(e) => updateDay(day.id, "mealsIncluded", e.target.checked ? [...day.mealsIncluded, m] : day.mealsIncluded.filter((x) => x !== m))}
                          />
                          {m}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <FL optional>Day Notes</FL>
                    <Inp value={day.notes || ""} onChange={(e) => updateDay(day.id, "notes", e.target.value)} placeholder="Special instructions…" />
                  </div>
                  <div className="col-span-2">
                    <FL optional>Day Description</FL>
                    <DayDescriptionField dayId={day.id} value={day.description} onCommit={(v) => updateDay(day.id, "description", v)} />
                    {day.description && <p className="text-xs text-gray-400 mt-1 text-right">{day.description.length} chars</p>}
                  </div>
                </div>

                {/* Hotels */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-emerald-700 flex items-center justify-center text-white"><Ic.Hotel /></div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Hotel Stays</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{day.hotelStays.length}</span>
                    </div>
                    <Btn variant="d-em" size="sm" onClick={() => addHotel(day.id)}><Ic.Plus />Add Hotel</Btn>
                  </div>
                  {day.hotelStays.length === 0 && (
                    <p className="text-xs text-center text-gray-400 py-4 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
                      Click "Add Hotel" to link from master catalog
                    </p>
                  )}
                  <div className="space-y-2">
                    {day.hotelStays.map((hs) => (
                      <HotelPicker key={hs.id} dayHotel={hs} dayId={day.id} onUpdate={(did, hid, f, v) => updateHotel(did, hid, f, v)} onRemove={(did, hid) => removeHotel(did, hid)} />
                    ))}
                  </div>
                </div>

                {/* Transfers */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-orange-600 flex items-center justify-center text-white"><Ic.Car /></div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Transfers</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{day.transfers.length}</span>
                    </div>
                    <Btn variant="d-am" size="sm" onClick={() => addTr(day.id)}><Ic.Plus />Add Transfer</Btn>
                  </div>
                  {day.transfers.length === 0 && (
                    <p className="text-xs text-center text-gray-400 py-4 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/30">No transfers added</p>
                  )}
                  <div className="space-y-2">
                    {day.transfers.map((tr) => (
                      <div key={tr.id} className="p-3 border border-orange-200 rounded-xl bg-orange-50/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <Sel options={OPTIONS.transferType} value={tr.transferType} onChange={(e) => updateTr(day.id, tr.id, "transferType", e.target.value)} className="w-28" />
                          <Sel options={OPTIONS.vehicleType} value={tr.vehicleType} onChange={(e) => updateTr(day.id, tr.id, "vehicleType", e.target.value)} className="flex-1" />
                          <button onClick={() => removeTr(day.id, tr.id)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><Ic.Trash /></button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <Inp placeholder="From" value={tr.from} onChange={(e) => updateTr(day.id, tr.id, "from", e.target.value)} />
                          <Inp placeholder="To" value={tr.to} onChange={(e) => updateTr(day.id, tr.id, "to", e.target.value)} />
                          <Inp type="time" value={tr.pickupTime} onChange={(e) => updateTr(day.id, tr.id, "pickupTime", e.target.value)} />
                          <Inp type="time" value={tr.dropTime} onChange={(e) => updateTr(day.id, tr.id, "dropTime", e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-700 flex items-center justify-center text-white"><Ic.Activity /></div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Activities</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{day.activities.length}</span>
                    </div>
                    <Btn variant="dashed" size="sm" onClick={() => addAct(day.id)}><Ic.Plus />Add Activity</Btn>
                  </div>
                  {day.activities.length === 0 && (
                    <p className="text-xs text-center text-gray-400 py-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30">
                      Click "Add Activity" to link from master catalog
                    </p>
                  )}
                  <div className="space-y-2">
                    {day.activities.map((act) => (
                      <ActivityPicker key={act.id} dayAct={act} dayId={day.id} onUpdate={updateAct} onRemove={removeAct} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
