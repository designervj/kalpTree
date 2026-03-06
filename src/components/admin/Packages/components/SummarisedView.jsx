import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { resolveActivity, resolveHotel, fmt12, cls } from "../utils/helpers";
import { DAY_GRAD, DAY_BADGE, ACT_DOT, ACT_BADGE } from "../utils/constants";
import { Btn } from "./UI";
import { Ic } from "./Icons";

const mealCls = {
  Breakfast: "bg-amber-100 text-amber-800",
  Lunch: "bg-orange-100 text-orange-800",
  Dinner: "bg-rose-100 text-rose-800",
};

// ─── SUMMARISED VIEW ──────────────────────────────────────────────
export const SummarisedView = ({ itinerary, pkg }) => {
  const { masterActivities, masterHotels } = useStore();
  const [openDays, setOpenDays] = useState(() => new Set([itinerary[0]?.id]));
  const toggle = (id) => setOpenDays((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 bg-blue-950 text-white rounded-xl">
        <div>
          <h2 className="text-sm font-bold">{pkg?.title || "Package"} — Summarised Itinerary</h2>
          <p className="text-xs text-blue-300 mt-0.5">{itinerary.length} days · read-only overview</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" size="sm" className="text-blue-300 hover:text-white hover:bg-white/10" onClick={() => setOpenDays(new Set(itinerary.map((d) => d.id)))}>Expand All</Btn>
          <Btn variant="ghost" size="sm" className="text-blue-300 hover:text-white hover:bg-white/10" onClick={() => setOpenDays(new Set())}>Collapse All</Btn>
        </div>
      </div>

      {itinerary.map((day) => {
        const isOpen = openDays.has(day.id);
        const rHotels = (day.hotelStays || []).map((h) => resolveHotel(h, masterHotels));
        const rActs = (day.activities || [])
          .map((a) => ({ ...resolveActivity(a, masterActivities), time: a.time }))
          .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
        const hasItems = rHotels.length + (day.transfers?.length || 0) + rActs.length > 0;

        return (
          <div key={day.id} className="rounded-xl overflow-hidden border border-gray-200">
            <button
              type="button" onClick={() => toggle(day.id)}
              className={cls("w-full flex items-center gap-4 px-5 py-3.5 text-left bg-gradient-to-r text-white", DAY_GRAD[day.dayType] || "from-blue-950 to-blue-900")}
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">{day.dayNumber}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{day.title}</span>
                  {day.city && <span className="text-xs opacity-60 flex items-center gap-1"><Ic.MapPin />{day.city}</span>}
                </div>
                <div className="flex items-center gap-4 mt-0.5 text-xs opacity-70">
                  {day.transfers?.length > 0 && <span className="flex items-center gap-1"><Ic.Car />{day.transfers.length} transfer{day.transfers.length > 1 ? "s" : ""}</span>}
                  {rActs.length > 0 && <span className="flex items-center gap-1"><Ic.Activity />{rActs.length} activit{rActs.length > 1 ? "ies" : "y"}</span>}
                  {rHotels.length > 0 && <span className="flex items-center gap-1"><Ic.Hotel />{rHotels.length} hotel{rHotels.length > 1 ? "s" : ""}</span>}
                  {day.mealsIncluded?.length > 0 && <span>🍽 {day.mealsIncluded.join(" + ")}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cls("text-xs px-2.5 py-0.5 rounded-full border font-semibold", DAY_BADGE[day.dayType])}>{day.dayType}</span>
                <Ic.Chevron open={isOpen} />
              </div>
            </button>

            {isOpen && (
              <div className="bg-white divide-y divide-gray-50">
                {day.notes && (
                  <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-100 flex items-start gap-2">
                    <div className="text-amber-500 mt-0.5 flex-shrink-0"><Ic.Info /></div>
                    <p className="text-xs text-amber-800">{day.notes}</p>
                  </div>
                )}
                {day.description && (
                  <div className="px-5 py-4 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Day Overview</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{day.description}</p>
                  </div>
                )}
                {day.mealsIncluded?.length > 0 && (
                  <div className="px-5 py-3 flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 w-20 flex-shrink-0">Meals</span>
                    <div className="flex gap-2">
                      {day.mealsIncluded.map((m) => (
                        <span key={m} className={cls("text-xs px-2.5 py-1 rounded-full font-semibold", mealCls[m] || "bg-gray-100 text-gray-700")}>{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transfers */}
                {day.transfers?.length > 0 && (
                  <div className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center text-orange-600"><Ic.Car /></div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Transfers ({day.transfers.length})</span>
                    </div>
                    <div className="space-y-2 ml-7">
                      {day.transfers.map((tr) => (
                        <div key={tr.id} className="flex items-center gap-2 text-xs text-gray-700">
                          <span className="font-semibold text-gray-400 w-14 flex-shrink-0">{fmt12(tr.pickupTime)}</span>
                          <span className="font-semibold truncate max-w-[90px]">{tr.from || "—"}</span>
                          <div className="flex items-center gap-1 text-orange-400 flex-shrink-0">
                            <div className="w-3 h-px bg-orange-200" /><Ic.Arrow /><div className="w-3 h-px bg-orange-200" />
                          </div>
                          <span className="font-semibold truncate max-w-[90px]">{tr.to || "—"}</span>
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full border flex-shrink-0 bg-orange-50 text-orange-700 border-orange-200">{tr.vehicleType}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {rActs.length > 0 && (
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-blue-600"><Ic.Activity /></div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Activities ({rActs.length})</span>
                    </div>
                    <div className="space-y-4 ml-7">
                      {rActs.map((act, i) => (
                        <div key={act.id || act.activityRef || `${act.title}-${act.time}-${i}`} className="flex items-start gap-3">
                          <span className="text-xs font-mono text-gray-400 w-14 flex-shrink-0 mt-0.5">{fmt12(act.time)}</span>
                          <div className={cls("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", ACT_DOT[act.activityType] || "bg-gray-400")} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-gray-900">{act.title}</span>
                              <span className={cls("text-xs px-1.5 py-0.5 rounded-full", ACT_BADGE[act.activityType])}>{act.activityType}</span>
                              {act.duration && <span className="text-xs text-gray-400 flex items-center gap-0.5"><Ic.Clock />{act.duration}</span>}
                              {act.isLinked && (
                                <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                                  <Ic.Sync />Master
                                </span>
                              )}
                            </div>
                            {act.description && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{act.description.substring(0, 100)}{act.description.length > 100 ? "…" : ""}</p>}
                            <div className="flex gap-2 mt-0.5">
                              {act.guideIncluded && <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5"><Ic.Check />Guide</span>}
                              {act.ticketIncluded && <span className="text-xs text-blue-600 font-medium flex items-center gap-0.5"><Ic.Check />Ticket</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotels */}
                {rHotels.length > 0 && (
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600"><Ic.Hotel /></div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Staying At ({rHotels.length})</span>
                    </div>
                    <div className="space-y-3 ml-7">
                      {rHotels.map((h) => (
                        <div key={h.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 overflow-hidden">
                          <div className="p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-sm font-bold text-gray-900">{h.hotelName}</span>
                                  {h.starRating && (
                                    <div className="flex">
                                      {Array.from({ length: Number(h.starRating) }).map((_, k) => (
                                        <svg key={k} className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
                                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                      ))}
                                    </div>
                                  )}
                                  {h.isLinked && (
                                    <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                                      <Ic.Sync />Master
                                    </span>
                                  )}
                                </div>
                                {h.city && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Ic.MapPin />{h.city}</p>}
                                {h.roomType && <p className="text-xs text-gray-600 font-medium mt-1">🛏 {h.roomType}</p>}
                                {h.notes && <p className="text-xs text-gray-400 mt-1 italic">{h.notes}</p>}
                              </div>
                              <div className="text-right flex-shrink-0 text-xs text-gray-500 space-y-1">
                                <div className="flex items-center gap-1 justify-end"><span>🔑</span><span className="font-semibold">{fmt12(h.checkInTime)}</span></div>
                                <div className="flex items-center gap-1 justify-end"><span>🚪</span><span className="font-semibold">{fmt12(h.checkOutTime)}</span></div>
                              </div>
                            </div>
                            {h.mealInclusions && (
                              <div className="mt-3 pt-3 border-t border-emerald-100">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Inclusions</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {[["breakfast", "☕", "Breakfast"], ["lunch", "🍽", "Lunch"], ["dinner", "🌙", "Dinner"]].map(([meal, icon, label]) => {
                                    const inc = h.mealInclusions[meal];
                                    return (
                                      <div key={meal} className={cls("flex flex-col items-center gap-1 py-2.5 rounded-xl border", inc ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200")}>
                                        <span className="text-base">{icon}</span>
                                        <span className="text-xs font-semibold text-gray-700">{label}</span>
                                        <div className={cls("flex items-center gap-1 text-xs font-bold", inc ? "text-emerald-600" : "text-gray-400")}>
                                          {inc ? <><Ic.Check />Included</> : <><Ic.X />Not Included</>}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!hasItems && (
                  <div className="px-5 py-4 text-center text-xs text-gray-400 italic">No activities, hotels or transfers added yet.</div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
        <span className="text-xs font-semibold text-gray-500 mr-1">Legend:</span>
        {[["sightseeing", "Sightseeing"], ["meal", "Meal"], ["adventure", "Adventure"], ["leisure", "Leisure"], ["wellness", "Wellness"]].map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className={cls("w-2.5 h-2.5 rounded-full", ACT_DOT[type])} />{label}
          </div>
        ))}
        <div className="flex items-center gap-1 text-xs text-emerald-600 ml-2 font-semibold"><Ic.Sync />=Master linked</div>
      </div>
    </div>
  );
};
