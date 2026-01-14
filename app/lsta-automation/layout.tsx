import { AppLayout } from "@/components/app-layout";

export default function LstaAutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout headerContent={"LSTA Automation"}>{children}</AppLayout>;
}
