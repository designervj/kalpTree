"use client";

import { AppShell } from "./AppShell";

type AppShellClientProps = {
  children: React.ReactNode;
};

export function AppShellClient({ children }: AppShellClientProps) {
  return <AppShell>{children}</AppShell>;

}
