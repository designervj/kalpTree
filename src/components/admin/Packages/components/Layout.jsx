"use client";

import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { getCurrSym, cls } from "../utils/helpers";
import { Card, Btn, Inp, Badge } from "./UI";
import { Ic } from "./Icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { buildWebsiteHref } from "@/lib/utils";
import { useSelector } from "react-redux";

// ─── DASHBOARD ────────────────────────────────────────────────────
export const Dashboard = ({ setPage }) => {
  const { packages, masterActivities, masterHotels } = useStore();
  const totalDays = packages.reduce(
    (s, p) => s + (p.itinerary?.length || 0),
    0,
  );
  const linkedActs = packages.reduce(
    (s, p) =>
      s +
      p.itinerary.reduce(
        (sd, d) => sd + d.activities.filter((a) => a.activityRef).length,
        0,
      ),
    0,
  );
  const linkedHotels = packages.reduce(
    (s, p) =>
      s +
      p.itinerary.reduce(
        (sd, d) => sd + d.hotelStays.filter((h) => h.hotelRef).length,
        0,
      ),
    0,
  );
  const unlinkedActs = packages.reduce(
    (s, p) =>
      s +
      p.itinerary.reduce(
        (sd, d) => sd + d.activities.filter((a) => !a.activityRef).length,
        0,
      ),
    0,
  );

  const stats = [
    {
      label: "Packages",
      value: packages.length,
      sub: "In catalog",
      color: "bg-blue-950",
      icon: <Ic.Package />,
    },
    {
      label: "Itinerary Days",
      value: totalDays,
      sub: "Total days planned",
      color: "bg-emerald-700",
      icon: <Ic.Summary />,
    },
    {
      label: "Master Activities",
      value: masterActivities.length,
      sub: `${linkedActs} linked in pkgs`,
      color: "bg-violet-700",
      icon: <Ic.Activity />,
    },
    {
      label: "Master Hotels",
      value: masterHotels.length,
      sub: `${linkedHotels} linked in pkgs`,
      color: "bg-amber-600",
      icon: <Ic.Hotel />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sync banner */}
      <div className="p-4 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl text-white flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <Ic.Sync />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Two-Way Sync Architecture Active</p>
          <p className="text-xs text-blue-300 mt-0.5">
            Master Activities & Hotels sync to all packages via{" "}
            <code className="bg-white/10 px-1 rounded">activityRef</code> /{" "}
            <code className="bg-white/10 px-1 rounded">hotelRef</code>{" "}
            ObjectIds.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Btn
            variant="ghost"
            size="sm"
            className="text-blue-200 hover:bg-white/10"
            onClick={() => setPage("master-activities")}
          >
            <Ic.Activity />
            Activities
          </Btn>
          <Btn
            variant="ghost"
            size="sm"
            className="text-blue-200 hover:bg-white/10"
            onClick={() => setPage("master-hotels")}
          >
            <Ic.Hotel />
            Hotels
          </Btn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, color, icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1 leading-none">
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-2">{sub}</p>
              </div>
              <div
                className={cls(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0",
                  color,
                )}
              >
                {icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">
                Recent Packages
              </h3>
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => setPage("packages")}
              >
                View all →
              </Btn>
            </div>
            <div className="space-y-3">
              {packages.slice(0, 4).map((pkg) => {
                const linked = pkg.itinerary.reduce(
                  (s, d) =>
                    s +
                    d.activities.filter((a) => a.activityRef).length +
                    d.hotelStays.filter((h) => h.hotelRef).length,
                  0,
                );
                return (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-900">
                        <Ic.Globe />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {pkg.title || pkg.destination}
                        </p>
                        <p className="text-xs text-gray-400">
                          {pkg.tripDuration} · {linked} master-linked item
                          {linked !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-900">
                        {getCurrSym(pkg.price?.currency)}
                        {Number(pkg.price?.amount || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {pkg.price?.currency}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2.5">
            <Btn className="w-full" onClick={() => setPage("create")}>
              <Ic.Plus />
              Create Package
            </Btn>
            <Btn
              variant="secondary"
              className="w-full"
              onClick={() => setPage("master-activities")}
            >
              <Ic.Activity />
              Manage Activities
            </Btn>
            <Btn
              variant="secondary"
              className="w-full"
              onClick={() => setPage("master-hotels")}
            >
              <Ic.Hotel />
              Manage Hotels
            </Btn>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Catalog Health
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Master activities linked</span>
                <span className="font-bold text-emerald-700">{linkedActs}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Master hotels linked</span>
                <span className="font-bold text-emerald-700">
                  {linkedHotels}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Unlinked activities</span>
                <span
                  className={cls(
                    "font-bold",
                    unlinkedActs > 0 ? "text-amber-600" : "text-gray-400",
                  )}
                >
                  {unlinkedActs}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── PACKAGES LISTING ─────────────────────────────────────────────
export const PackagesListing = () => {
  const { page, packages, masterActivities, masterHotels, selectedId } =
    useSelector((state) => state.packages);

  const [search, setSearch] = useState("");
  const filtered = packages.filter(
    (p) =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.destination?.toLowerCase().includes(search.toLowerCase()),
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const searchparams = Object.fromEntries(searchParams.entries());

  const handleAdd = () => {
    const href = buildWebsiteHref(
      "/admin/packages/create",
      params.website,
      searchparams,
    );
    router.push(href);
  };

  const handleEditPackage = (id) => {
    const href = buildWebsiteHref(
      `/admin/packages/${id}`,
      params.website,
      searchparams,
    );
    router.push(href);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Ic.Search />
          </div>
          <Inp
            className="pl-9"
            placeholder="Search packages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Btn className="ml-auto" onClick={() => handleAdd()}>
          <Ic.Plus />
          Create Package
        </Btn>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {[
                  "Package",
                  "Duration",
                  "Style",
                  "Exclusivity",
                  "Itinerary Stats",
                  "Price",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No packages found
                  </td>
                </tr>
              )}
              {filtered.map((pkg) => {
                const totalH =
                  pkg.itinerary?.reduce(
                    (s, d) => s + (d.hotelStays?.length || 0),
                    0,
                  ) || 0;
                const totalA =
                  pkg.itinerary?.reduce(
                    (s, d) => s + (d.activities?.length || 0),
                    0,
                  ) || 0;
                const totalT =
                  pkg.itinerary?.reduce(
                    (s, d) => s + (d.transfers?.length || 0),
                    0,
                  ) || 0;
                const linked =
                  pkg.itinerary?.reduce(
                    (s, d) =>
                      s +
                      d.activities.filter((a) => a.activityRef).length +
                      d.hotelStays.filter((h) => h.hotelRef).length,
                    0,
                  ) || 0;
                return (
                  <tr
                    key={pkg.id}
                    className="hover:bg-blue-50/20 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900 flex-shrink-0">
                          <Ic.Globe />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm leading-tight">
                            {pkg.title || pkg.destination}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Ic.MapPin />
                            {pkg.destination}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {pkg.tripDuration}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600">
                      {pkg.travelStyle || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className="bg-violet-50 text-violet-700 border-violet-200">
                        {pkg.exclusivityLevel || "—"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Ic.Hotel />
                            {totalH}
                          </span>
                          <span className="flex items-center gap-1">
                            <Ic.Activity />
                            {totalA}
                          </span>
                          <span className="flex items-center gap-1">
                            <Ic.Car />
                            {totalT}
                          </span>
                        </div>
                        {linked > 0 && (
                          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <Ic.Sync />
                            {linked} master-linked
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-blue-900 whitespace-nowrap">
                      {getCurrSym(pkg.price?.currency)}
                      {Number(pkg.price?.amount || 0).toLocaleString("en-IN")}
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        {pkg.price?.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => {
                            handleEditPackage(pkg.id);
                          }}
                          className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Ic.Eye />
                        </button>
                        <button
                          onClick={() => {
                            handleEditPackage(pkg.id);
                          }}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <Ic.Edit />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this package?"))
                              setPackages((p) =>
                                p.filter((x) => x.id !== pkg.id),
                              );
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Ic.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 rounded-b-xl">
          <p className="text-xs text-gray-500">
            {filtered.length} of {packages.length} packages
          </p>
        </div>
      </Card>
    </div>
  );
};
