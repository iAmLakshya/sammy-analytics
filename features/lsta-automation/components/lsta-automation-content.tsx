"use client";

import { Badge } from "@/components/ui/badge";
import { AutomationKpiCards } from "./automation-kpi-cards";
import { AutomationTable } from "./automation-table";

export const LstaAutomationContent = () => {
  return (
    <div className="flex flex-col gap-6 py-4">
      <AutomationKpiCards />
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Submissions</h2>
          <Badge variant="outline">847 total</Badge>
        </div>
        <AutomationTable />
      </div>
    </div>
  );
};
