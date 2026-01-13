'use client';

import {
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { cn } from "@/lib/utils"

type HealthStatus = 'healthy' | 'warning' | 'critical';

interface HealthIndicator {
  label: string;
  status: HealthStatus;
  value: string;
  description: string;
  tooltip: string;
}

const healthData: HealthIndicator[] = [
  {
    label: "Review Speed",
    status: "healthy",
    value: "186/day",
    description: "Issues handled daily",
    tooltip: "How many issues your team resolves per day. Higher is better. Goal: 150+ per day.",
  },
  {
    label: "Backlog Age",
    status: "warning",
    value: "5.2 days",
    description: "Avg wait time for review",
    tooltip: "How long issues sit before being reviewed. Shorter is better. Goal: under 3 days.",
  },
  {
    label: "Content Freshness",
    status: "healthy",
    value: "94.2%",
    description: "Sources checked today",
    tooltip: "Percentage of web sources checked in the last 24 hours. Goal: 90% or higher.",
  },
  {
    label: "System Reliability",
    status: "healthy",
    value: "99.1%",
    description: "Scans completed successfully",
    tooltip: "How often automated scans complete without errors. Goal: 98% or higher.",
  },
];

const statusConfig = {
  healthy: {
    icon: IconCircleCheck,
    iconColor: "text-primary",
    dot: "bg-primary",
  },
  warning: {
    icon: IconAlertTriangle,
    iconColor: "text-primary",
    dot: "bg-primary",
  },
  critical: {
    icon: IconAlertCircle,
    iconColor: "text-primary",
    dot: "bg-primary",
  },
};

export const HealthIndicators = () => {
  const overallStatus = healthData.some(h => h.status === 'critical')
    ? 'critical'
    : healthData.some(h => h.status === 'warning')
    ? 'warning'
    : 'healthy';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              Performance Overview
              <InfoTooltip content="Key metrics at a glance. Green means on track, yellow needs attention, red requires immediate action." />
            </CardTitle>
            <CardDescription className="text-sm">
              How your content operations are performing
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border">
            <div className={cn("size-2 rounded-full animate-pulse", statusConfig[overallStatus].dot)} />
            {overallStatus === 'healthy' ? 'All Systems Operational' : overallStatus === 'warning' ? 'Needs Attention' : 'Action Required'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {healthData.map((indicator) => {
            const config = statusConfig[indicator.status];
            const Icon = config.icon;

            return (
              <div
                key={indicator.label}
                className="relative rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-muted-foreground truncate">
                        {indicator.label}
                      </span>
                      <InfoTooltip content={indicator.tooltip} className="shrink-0" />
                    </div>
                    <div className="text-lg font-semibold tabular-nums mt-0.5">
                      {indicator.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {indicator.description}
                    </div>
                  </div>
                  <Icon className={cn("size-4 shrink-0", config.iconColor)} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
