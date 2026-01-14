import { AppLayout } from "@/components/app-layout";
import { DashboardHeader } from "@/components/site-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout headerContent={<DashboardHeader />}>{children}</AppLayout>;
}
