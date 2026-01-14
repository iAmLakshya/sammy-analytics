"use client";

import { AutomationKpiCards } from "./automation-kpi-cards";
import { AutomationTable } from "./automation-table";

export const LstaAutomationContent = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <AutomationKpiCards />
      <div className="px-4 lg:px-6">
        <AutomationTable />
      </div>
    </div>
  );
};
