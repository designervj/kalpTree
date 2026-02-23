
import { ReactNode, Suspense } from "react";
import { AppShellProvider } from "@/components/admin/AppShellProvider";
import { Inter } from "next/font/google";
import GetDashBoardDetails from "@/components/admin/GetDashboardDetails";
import WebsiteSidebar from "@/components/admin/WebsiteSidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AppShellProvider>{children}</AppShellProvider>
        {/* <WebsiteSidebar>{children}</WebsiteSidebar> */}
      </Suspense>
    </>
  );
}
