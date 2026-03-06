"use client";
import { useState, useEffect } from "react";
import { StoreContext } from "./context/StoreContext";
import { uid, emptyAdditionalInfo } from "./utils/helpers";
import { INIT_ACTIVITIES, INIT_HOTELS, INIT_PACKAGES } from "./utils/mockData";
import { Ic } from "./components/Icons";
import { Btn } from "./components/UI";
import {
  Dashboard,
  PackagesListing,
  Sidebar,
  Topbar,
} from "./components/Layout";
import { PackageForm } from "./components/PackageForm";
import { ViewPackage } from "./components/ViewPackage";
import { MasterActivitiesPage } from "./components/MasterActivities";
import { MasterHotelsPage } from "./components/MasterHotels";
import { useSelector } from "react-redux";

// ─── EMPTY PACKAGE FACTORY ────────────────────────────────────────
export const emptyPkg = () => ({
  id: uid(),
  title: "",
  destination: "",
  tripDuration: "",
  travelStyle: "",
  tourType: "",
  exclusivityLevel: "Premium",
  price: { currency: "INR", amount: "" },
  shortDescription: "",
  longDescription: "",
  availability: {
    availableMonths: [],
    fixedDepartureDates: [],
    blackoutDates: [],
  },
  inclusions: [],
  exclusions: [],
  knowBeforeYouGo: [],
  additionalInfo: emptyAdditionalInfo(),
  faqs: [],
  itinerary: [],
  createdAt: new Date().toISOString().split("T")[0],
});

// ─── PAGE META ────────────────────────────────────────────────────
const getPageMeta = (page, packages, selectedPkg) =>
  ({
    dashboard: {
      title: "Dashboard",
      subtitle: "Aventara Elite — Travel Management",
    },
    packages: {
      title: "Travel Packages",
      subtitle: `${packages.length} packages in catalog`,
    },
    create: { title: "Create Package", subtitle: "Add a new travel package" },
    edit: {
      title: "Edit Package",
      subtitle: selectedPkg
        ? `Editing: ${selectedPkg.title || selectedPkg.destination}`
        : "",
    },
    view: {
      title: "Package Details",
      subtitle: selectedPkg
        ? `${selectedPkg.destination} · ${selectedPkg.tripDuration}`
        : "",
    },
    "master-activities": {
      title: "Master Activities",
      subtitle: "Global reusable activity catalog",
    },
    "master-hotels": {
      title: "Master Hotels",
      subtitle: "Global hotel catalog",
    },
  })[page] || { title: "Dashboard", subtitle: "" };

// ─── APP ROOT ─────────────────────────────────────────────────────
export default function PackagePanel() {
  const { page, packages, masterActivities, masterHotels, selectedId } =
    useSelector((state) => state.packages);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const result = await res.json();
      if (result.success) setPackages(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const selectedPkg = packages.find((p) => p.id === selectedId);
  const meta = getPageMeta(page, packages, selectedPkg);

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="p-6 max-w-[1400px]">
        <PackagesListing />
        {/* {page === "edit" && selectedPkg && (
            <PackageForm
              key={selectedPkg.id}
              initial={selectedPkg}
              mode="edit"
              onSave={handleEdit}
              onCancel={() => setPage("packages")}
            />
          )}
          {page === "view" && selectedPkg && (
            <ViewPackage pkg={selectedPkg} onEdit={() => setPage("edit")} />
          )}
          {page === "master-activities" && <MasterActivitiesPage />}
          {page === "master-hotels" && <MasterHotelsPage />} */}
      </div>
    </div>
  );
}
