"use client";

import { useState, useMemo, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { emptyMasterActivity } from "../utils/helpers";
import { cls } from "../utils/helpers";
import { OPTIONS, ACT_BADGE } from "../utils/constants";
import { Card, Btn, Inp, TA, Sel, FL, Modal, Badge } from "./UI";
import { Ic } from "./Icons";
import { ImageUploader } from "./ImageUploader";
import { useSelector } from "react-redux";

// ─── MASTER ACTIVITY FORM ─────────────────────────────────────────
export const MasterActivityForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || emptyMasterActivity());
  const [tagIn, setTagIn] = useState("");
  const upd = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FL required>Activity Title</FL>
          <Inp
            placeholder="e.g. Amber Fort Guided Tour"
            value={form.title}
            onChange={(e) => upd("title", e.target.value)}
          />
        </div>
        <div>
          <FL>Activity Type</FL>
          <Sel
            options={OPTIONS.activityType}
            value={form.activityType}
            onChange={(e) => upd("activityType", e.target.value)}
          />
        </div>
        <div>
          <FL>Default Duration</FL>
          <Inp
            placeholder="e.g. 2 hrs"
            value={form.defaultDuration}
            onChange={(e) => upd("defaultDuration", e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <FL>Location</FL>
          <Inp
            placeholder="e.g. Jaipur, Rajasthan"
            value={form.location}
            onChange={(e) => upd("location", e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <FL>Description</FL>
          <TA
            placeholder="Full description…"
            value={form.description}
            onChange={(e) => upd("description", e.target.value)}
            rows={3}
          />
        </div>
      </div>
      <div>
        <FL optional>Tags</FL>
        <div className="flex gap-2 mb-2">
          <Inp
            placeholder="e.g. Heritage"
            value={tagIn}
            onChange={(e) => setTagIn(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagIn.trim()) {
                e.preventDefault();
                upd("tags", [...form.tags, tagIn.trim()]);
                setTagIn("");
              }
            }}
          />
          <Btn
            variant="outline"
            size="sm"
            onClick={() => {
              if (tagIn.trim()) {
                upd("tags", [...form.tags, tagIn.trim()]);
                setTagIn("");
              }
            }}
          >
            Add
          </Btn>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-200"
            >
              <Ic.Tag />
              {tag}
              <button
                onClick={() =>
                  upd(
                    "tags",
                    form.tags.filter((_, j) => j !== i),
                  )
                }
                className="text-blue-400 hover:text-red-500 ml-0.5"
              >
                <Ic.X />
              </button>
            </span>
          ))}
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
            if (form.title.trim()) onSave(form);
          }}
        >
          Save Activity
        </Btn>
      </div>
    </div>
  );
};

// ─── MASTER ACTIVITIES PAGE ───────────────────────────────────────
const typeCls = {
  meal: "text-amber-700 bg-amber-50 border-amber-200",
  sightseeing: "text-blue-700 bg-blue-50 border-blue-200",
  adventure: "text-emerald-700 bg-emerald-50 border-emerald-200",
  transfer: "text-orange-700 bg-orange-50 border-orange-200",
  leisure: "text-violet-700 bg-violet-50 border-violet-200",
  wellness: "text-pink-700 bg-pink-50 border-pink-200",
  shopping: "text-rose-700 bg-rose-50 border-rose-200",
};

export const MasterActivitiesPage = () => {
  const { packages, masterActivities } =
    useSelector((state) => state.packages);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const filtered = masterActivities.filter((a) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        a.title.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q)) &&
      (!filterType || a.activityType === filterType)
    );
  });

  const usageCount = useMemo(() => {
    const map = {};
    masterActivities.forEach((a) => {
      map[a._id] = 0;
    });
    packages.forEach((pkg) =>
      pkg.itinerary.forEach((day) =>
        day.activities.forEach((act) => {
          if (act.activityRef && map[act.activityRef] !== undefined)
            map[act.activityRef]++;
        }),
      ),
    );
    return map;
  }, [masterActivities, packages]);

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/activities");
      const result = await res.json();
      if (result.success) setMasterActivities(result.data);
    };
    fetchActivities();
  }, []);

  const handleSave = async (data) => {
    try {
      if (modal.mode === "create") {
        const res = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.success)
          setMasterActivities((p) => [
            ...p,
            { ...data, _id: result.insertedId },
          ]);
      } else {
        const res = await fetch("/api/activities", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.success)
          setMasterActivities((p) =>
            p.map((a) => (a._id === data._id ? data : a)),
          );
      }
      setModal(null);
    } catch (err) {
      console.error("ACTIVITY SAVE ERROR:", err);
    }
  };

  const handleDelete = async (id) => {
    const count = usageCount[id] || 0;
    if (
      !window.confirm(
        count > 0
          ? `Used in ${count} package(s). Continue?`
          : "Delete this master activity?",
      )
    )
      return;
    try {
      await fetch("/api/activities?id=" + id, { method: "DELETE" });
      setMasterActivities((p) => p.filter((a) => a._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <div className="text-blue-600 mt-0.5">
          <Ic.Info />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Master Activity Catalog — Global Reusable Records
          </p>
          <p className="text-xs text-blue-700 mt-0.5">
            In production:{" "}
            <code className="bg-blue-100 px-1 rounded">MasterActivity</code>{" "}
            MongoDB collection. Packages reference activities via{" "}
            <code className="bg-blue-100 px-1 rounded">
              activityRef → ObjectId
            </code>
            .
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Ic.Search />
          </div>
          <Inp
            className="pl-9"
            placeholder="Search activities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Sel
          className="w-40"
          options={OPTIONS.activityType}
          placeholder="All Types"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        />
        {filterType && (
          <Btn variant="ghost" size="sm" onClick={() => setFilterType("")}>
            Clear
          </Btn>
        )}
        <Btn
          className="ml-auto"
          onClick={() => setModal({ mode: "create", data: null })}
        >
          <Ic.Plus />
          New Activity
        </Btn>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">No activities found</p>
          </div>
        )}
        {filtered.map((act) => {
          const usage = usageCount[act._id] || 0;
          return (
            <Card key={act._id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={cls(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm",
                      ACT_BADGE[act.activityType],
                    )}
                  >
                    <Ic.Activity />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-900">
                        {act.title}
                      </h3>
                      <Badge
                        className={cls(
                          "border",
                          typeCls[act.activityType] ||
                            "bg-gray-50 text-gray-600 border-gray-200",
                        )}
                      >
                        {act.activityType}
                      </Badge>
                      {usage > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          <Ic.Link />
                          Used in {usage} pkg
                        </span>
                      )}
                    </div>
                    {act.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Ic.MapPin />
                        {act.location}
                      </p>
                    )}
                    {act.defaultDuration && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Ic.Clock />
                        {act.defaultDuration}
                      </p>
                    )}
                    {act.description && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                        {act.description}
                      </p>
                    )}
                    {act.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {act.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setModal({ mode: "edit", data: act })}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Ic.Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(act._id)}
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
      <p className="text-xs text-gray-400 text-center">
        {masterActivities.length} master activities ·{" "}
        {Object.values(usageCount).reduce((a, b) => a + b, 0)} total usages
      </p>
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.mode === "create"
            ? "Create Master Activity"
            : "Edit Master Activity"
        }
      >
        <MasterActivityForm
          initial={modal?.data}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      </Modal>
    </div>
  );
};
