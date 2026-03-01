import type { Metadata } from "next";
import AdminShell from "./_components/AdminShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Jonathan Bouniol",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
