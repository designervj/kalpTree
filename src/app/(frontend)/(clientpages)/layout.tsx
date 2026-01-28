import { auth } from "@/auth";
import { AppShellProvider } from "@/components/admin/AppShellProvider";

export const metadata = {
  title: "KalpTree Enterprise Solution",
  description: "KalpTree by Mandala Labs",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
