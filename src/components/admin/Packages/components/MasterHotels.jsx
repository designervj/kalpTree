"use client";

import { useState, useMemo, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { emptyMasterHotel } from "../utils/helpers";
import { cls } from "../utils/helpers";
import { OPTIONS } from "../utils/constants";
import { Card, Btn, Inp, TA, Sel, FL, Modal } from "./UI";
import { Ic } from "./Icons";
import { ImageUploader } from "./ImageUploader";
import { useSelector } from "react-redux";

// ─── MASTER HOTEL FORM ────────────────────────────────────────────
export const MasterHotelForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || emptyMasterHotel());
  const upd = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FL required>Hotel Name</FL>
          <Inp
            placeholder="e.g. The Taj Lake Palace"
            value={form.hotelName}
            onChange={(e) => upd("hotelName", e.target.value)}
          />
        </div>
        <div>
          <FL>City</FL>
          <Inp
            placeholder="e.g. Udaipur, Rajasthan"
            value={form.city}
            onChange={(e) => upd("city", e.target.value)}
          />
        </div>
        <div>
          <FL>Star Rating</FL>
          <div className="flex gap-2">
            {OPTIONS.starRating.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => upd("starRating", s)}
                className={cls(
                  "flex-1 py-2 text-sm font-bold rounded-lg border transition-all",
                  form.starRating === s
                    ? "bg-amber-400 text-white border-amber-400"
                    : "bg-white text-gray-500 border-gray-200 hover:border-amber-300",
                )}
              >
                {s}★
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <FL>Description</FL>
          <TA
            placeholder="What makes this hotel special…"
            value={form.description}
            onChange={(e) => upd("description", e.target.value)}
            rows={2}
          />
        </div>
      </div>
      <div>
        <FL>Room Types</FL>
        <Sel
          options={OPTIONS.roomType.filter((r) => !form.roomTypes.includes(r))}
          placeholder="Select room type to add"
          value=""
          onChange={(e) => {
            if (e.target.value)
              upd("roomTypes", [...form.roomTypes, e.target.value]);
          }}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {form.roomTypes.map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200"
            >
              {r}
              <button
                onClick={() =>
                  upd(
                    "roomTypes",
                    form.roomTypes.filter((_, j) => j !== i),
                  )
                }
                className="text-emerald-400 hover:text-red-500"
              >
                <Ic.X />
              </button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <FL>Amenities</FL>
        <div className="grid grid-cols-3 gap-1.5 mt-1">
          {OPTIONS.amenities.map((a) => {
            const has = form.amenities.includes(a);
            return (
              <label
                key={a}
                className={cls(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all text-xs font-medium",
                  has
                    ? "bg-blue-950 text-white border-blue-950"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={has}
                  onChange={(e) =>
                    upd(
                      "amenities",
                      e.target.checked
                        ? [...form.amenities, a]
                        : form.amenities.filter((x) => x !== a),
                    )
                  }
                />
                {a}
              </label>
            );
          })}
        </div>
      </div>
      <ImageUploader
        images={form.images}
        onAdd={(url) => upd("images", [...form.images, url])}
        onRemove={(i) =>
          upd(
            "images",
            form.images.filter((_, j) => j !== i),
          )
        }
      />
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Btn variant="outline" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="success"
          onClick={() => {
            if (form.hotelName.trim()) onSave(form);
          }}
        >
          Save Hotel
        </Btn>
      </div>
    </div>
  );
};

// ─── MASTER HOTELS PAGE ───────────────────────────────────────────
export const MasterHotelsPage = () => {
  const { packages, masterHotels } = useSelector((state) => state.packages);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels");
        const result = await res.json();
        if (result.success) setMasterHotels(result.data);
      } catch (err) {
        console.error("FETCH HOTEL ERROR:", err);
      }
    };
    fetchHotels();
  }, []);

  const filtered = masterHotels.filter(
    (h) =>
      !search ||
      h.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()),
  );

  const usageCount = useMemo(() => {
    const map = {};
    masterHotels.forEach((h) => {
      map[h._id] = 0;
    });
    packages.forEach((pkg) =>
      pkg.itinerary.forEach((day) =>
        day.hotelStays.forEach((hs) => {
          if (hs.hotelRef && map[hs.hotelRef] !== undefined) map[hs.hotelRef]++;
        }),
      ),
    );
    return map;
  }, [masterHotels, packages]);

  const handleSave = async (data) => {
    try {
      if (modal.mode === "create") {
        const res = await fetch("/api/hotels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.success)
          setMasterHotels((p) => [...p, { ...data, _id: result.insertedId }]);
      } else {
        const res = await fetch("/api/hotels", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.success)
          setMasterHotels((p) => p.map((h) => (h._id === data._id ? data : h)));
      }
      setModal(null);
    } catch (err) {
      console.error("HOTEL SAVE ERROR:", err);
    }
  };

  const handleDelete = async (id) => {
    const count = usageCount[id] || 0;
    if (
      !window.confirm(
        count > 0
          ? `Used in ${count} package(s). Continue?`
          : "Delete this hotel?",
      )
    )
      return;
    try {
      const res = await fetch("/api/hotels", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) setMasterHotels((p) => p.filter((h) => h._id !== id));
    } catch (err) {
      console.error("DELETE HOTEL ERROR:", err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
        <div className="text-emerald-600 mt-0.5">
          <Ic.Info />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-900">
            Master Hotel Catalog — Global Reusable Records
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            In production:{" "}
            <code className="bg-emerald-100 px-1 rounded">MasterHotel</code>{" "}
            MongoDB collection. Packages reference hotels via{" "}
            <code className="bg-emerald-100 px-1 rounded">
              hotelRef → ObjectId
            </code>
            .
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Ic.Search />
          </div>
          <Inp
            className="pl-9"
            placeholder="Search hotels, cities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Btn onClick={() => setModal({ mode: "create", data: null })}>
          <Ic.Plus />
          New Hotel
        </Btn>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">No hotels found</p>
          </div>
        )}
        {filtered.map((hotel) => {
          const usage = usageCount[hotel._id] || 0;
          return (
            <Card key={hotel._id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Ic.Hotel />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-900">
                        {hotel.hotelName}
                      </h3>
                      <div className="flex">
                        {Array.from({ length: Number(hotel.starRating) }).map(
                          (_, i) => (
                            <Ic.Star key={i} />
                          ),
                        )}
                      </div>
                      {usage > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                          <Ic.Link />
                          Used in {usage} pkg
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Ic.MapPin />
                      {hotel.city}
                    </p>
                    {hotel.description && (
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                        {hotel.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hotel.roomTypes?.map((r) => (
                        <span
                          key={r}
                          className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                    {hotel.amenities?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        {hotel.amenities.slice(0, 4).join(" · ")}
                        {hotel.amenities.length > 4
                          ? ` +${hotel.amenities.length - 4} more`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setModal({ mode: "edit", data: hotel })}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Ic.Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Ic.Trash />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.mode === "create" ? "Create Master Hotel" : "Edit Master Hotel"
        }
        wide
      >
        <MasterHotelForm
          initial={modal?.data}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      </Modal>
    </div>
  );
};
