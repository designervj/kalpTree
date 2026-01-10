"use client";

import { useEffect, useState } from "react";
import { AppShellClient } from "./AppShellClient";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import GetDashBoardDetails from "./GetDashboardDetails";

type AppShellProviderProps = {
  children: React.ReactNode;
};

export function AppShellProvider({ children }: AppShellProviderProps) {
  const {
    user,
    loading,
    error,
    agencies,
    business,
    websites,
    currentAgency,
    currentWebsite,
    currentbusiness,
    loggedinTenant,
  } = useSelector((state: RootState) => state.dashboardDetails);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black z-50">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 tracking-wide">
          Loading, please wait…
        </p>
      </div>
    );
  }

  return (
    <>
      <GetDashBoardDetails />
      <AppShellClient>{children}</AppShellClient>
    </>
  );
}
