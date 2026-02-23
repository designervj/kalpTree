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


  return (
    <>
      <GetDashBoardDetails />
      <AppShellClient>{children}</AppShellClient>
    </>
  );
}
