import { LstaAutomationContent } from "@/features/lsta-automation";
import { Suspense } from "react";

export default function LstaAutomationPage() {
  return (
    <Suspense>
      <LstaAutomationContent />
    </Suspense>
  );
}
