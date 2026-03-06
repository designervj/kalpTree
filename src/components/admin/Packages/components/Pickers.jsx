import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { resolveActivity, resolveHotel, fmt12, cls } from "../utils/helpers";
import { OPTIONS, ACT_DOT } from "../utils/constants";
import { Btn, Inp, TA, Sel, FL } from "./UI";
import { Ic } from "./Icons";
import { useSelector } from "react-redux";

// ─── ACTIVITY PICKER (two-way sync) ──────────────────────────────
export const ActivityPicker = ({ dayAct, dayId, onUpdate, onRemove }) => {
  const { masterActivities } = useSelector((state) => state.packages);
  const [open, setOpen] = useState(true);
  const resolved = resolveActivity(dayAct, masterActivities);
  const upd = (f, v) => onUpdate(dayId, dayAct.id, f, v);

  return (
    <div className="border border-blue-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border-b border-blue-100">
        <div
          className={cls(
            "w-2.5 h-2.5 rounded-full flex-shrink-0",
            ACT_DOT[resolved.activityType] || "bg-gray-400",
          )}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-blue-900 truncate">
            {resolved.title}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-500 font-mono">
              {fmt12(dayAct.time)}
            </span>
            {resolved.isLinked && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                <Ic.Sync />
                Master Linked
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 text-blue-500 hover:bg-blue-100 rounded-lg"
        >
          <Ic.Chevron open={open} />
        </button>
        <button
          onClick={() => onRemove(dayId, dayAct.id)}
          className="p-1 text-red-400 hover:bg-red-50 rounded-lg"
        >
          <Ic.Trash />
        </button>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <FL className="text-emerald-700">Link to Master Activity</FL>
            <Sel
              options={masterActivities.map((a) => a.title)}
              placeholder="— Select from master catalog —"
              value={resolved.masterTitle || ""}
              onChange={(e) => {
                const m = masterActivities.find(
                  (x) => x.title === e.target.value,
                );
                if (m) {
                  upd("activityRef", m._id);
                  upd("customTitle", "");
                  upd("customDescription", "");
                  upd("customImages", []);
                }
              }}
            />
            {resolved.isLinked && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Ic.Check />
                  Linked: {resolved.masterTitle}
                </p>
                <button
                  onClick={() => upd("activityRef", null)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Unlink
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FL>Activity Time</FL>
              <Inp
                type="time"
                value={dayAct.time}
                onChange={(e) => upd("time", e.target.value)}
              />
            </div>
            <div>
              <FL optional>Cover Title</FL>
              <Inp
                placeholder="Gallery section heading"
                value={dayAct.coverTitle || ""}
                onChange={(e) => upd("coverTitle", e.target.value)}
              />
            </div>
          </div>
          {resolved.isLinked && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg flex items-center gap-2">
                <Ic.Info />
                Override fields below replace master data for this package only
              </p>
              <div>
                <FL optional>Custom Title (Override)</FL>
                <Inp
                  placeholder={`Default: "${resolved.masterTitle}"`}
                  value={dayAct.customTitle || ""}
                  onChange={(e) => upd("customTitle", e.target.value)}
                />
              </div>
              <div>
                <FL optional>Custom Description (Override)</FL>
                <TA
                  placeholder="Default from master"
                  value={dayAct.customDescription || ""}
                  onChange={(e) => upd("customDescription", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
          {!resolved.isLinked && (
            <div className="space-y-3">
              <div>
                <FL>Activity Title</FL>
                <Inp
                  placeholder="e.g. Amber Fort Visit"
                  value={dayAct.customTitle || ""}
                  onChange={(e) => upd("customTitle", e.target.value)}
                />
              </div>
              <div>
                <FL>Description</FL>
                <TA
                  placeholder="Activity description…"
                  value={dayAct.customDescription || ""}
                  onChange={(e) => upd("customDescription", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-6 pt-1 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 font-medium">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded accent-blue-900"
                checked={dayAct.guideIncluded}
                onChange={(e) => upd("guideIncluded", e.target.checked)}
              />
              Guide Included
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 font-medium">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded accent-blue-900"
                checked={dayAct.ticketIncluded}
                onChange={(e) => upd("ticketIncluded", e.target.checked)}
              />
              Ticket Included
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── HOTEL PICKER (two-way sync) ──────────────────────────────────
export const HotelPicker = ({ dayHotel, dayId, onUpdate, onRemove }) => {
  const { masterHotels } = useSelector((state) => state.packages);
  const [open, setOpen] = useState(true);
  const resolved = resolveHotel(dayHotel, masterHotels);
  const upd = (f, v) => onUpdate(dayId, dayHotel.id, f, v);
  const masterRoomTypes =
    masterHotels.find((m) => m._id === dayHotel.hotelRef)?.roomTypes ||
    OPTIONS.roomType;

  return (
    <div className="border border-emerald-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
        <div className="text-emerald-700">
          <Ic.Hotel />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-emerald-900 truncate">
            {resolved.hotelName}
          </p>
          <div className="flex items-center gap-2">
            {resolved.city && (
              <span className="text-xs text-emerald-600 flex items-center gap-0.5">
                <Ic.MapPin />
                {resolved.city}
              </span>
            )}
            {resolved.isLinked && (
              <span className="text-xs bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                <Ic.Sync />
                Linked
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-lg"
        >
          <Ic.Chevron open={open} />
        </button>
        <button
          onClick={() => onRemove(dayId, dayHotel.id)}
          className="p-1 text-red-400 hover:bg-red-50 rounded-lg"
        >
          <Ic.Trash />
        </button>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <FL className="text-blue-700">Link to Master Hotel</FL>
            <Sel
              options={masterHotels.map((h) => h.hotelName)}
              placeholder="— Select from hotel catalog —"
              value={resolved.masterName || ""}
              onChange={(e) => {
                const selectedHotel = masterHotels.find(
                  (h) => h.hotelName === e.target.value,
                );
                if (selectedHotel) {
                  upd("hotelRef", selectedHotel._id);
                  upd("customRoomType", "");
                  upd("customNotes", "");
                  upd("customImages", []);
                }
              }}
            />
            {resolved.isLinked && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                  <Ic.Check />
                  {resolved.masterName} · {resolved.city}
                </p>
                <button
                  onClick={() => upd("hotelRef", null)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Unlink
                </button>
              </div>
            )}
          </div>
          <div>
            <FL>Room Type</FL>
            <Sel
              options={masterRoomTypes}
              placeholder="Select room type"
              value={dayHotel.customRoomType || ""}
              onChange={(e) => upd("customRoomType", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FL>Check-in</FL>
              <Inp
                type="time"
                value={dayHotel.checkInTime}
                onChange={(e) => upd("checkInTime", e.target.value)}
              />
            </div>
            <div>
              <FL>Check-out</FL>
              <Inp
                type="time"
                value={dayHotel.checkOutTime}
                onChange={(e) => upd("checkOutTime", e.target.value)}
              />
            </div>
          </div>
          <div>
            <FL>Meal Inclusions</FL>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                ["breakfast", "☕ Breakfast"],
                ["lunch", "🍽 Lunch"],
                ["dinner", "🌙 Dinner"],
              ].map(([meal, label]) => {
                const included = dayHotel.mealInclusions?.[meal] || false;
                return (
                  <button
                    key={meal}
                    type="button"
                    onClick={() =>
                      upd("mealInclusions", {
                        ...(dayHotel.mealInclusions || {}),
                        [meal]: !included,
                      })
                    }
                    className={cls(
                      "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all font-medium text-xs",
                      included
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300",
                    )}
                  >
                    <span className="text-base">{label.split(" ")[0]}</span>
                    <span className="leading-tight text-center">
                      {label.split(" ").slice(1).join(" ")}
                    </span>
                    <span
                      className={cls(
                        "text-xs font-bold",
                        included ? "text-emerald-600" : "text-gray-400",
                      )}
                    >
                      {included ? "Included" : "Not included"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <FL optional>Notes</FL>
            <TA
              placeholder="Check-in instructions, special requests…"
              value={dayHotel.customNotes || ""}
              onChange={(e) => upd("customNotes", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
};
