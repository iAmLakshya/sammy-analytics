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
    label: "Review Velocity",
    status: "healthy",
    value: "186/day",
    description: "Avg reviews per day this week",
    tooltip: "Number of conflicts resolved per day. Target: >150/day for healthy throughput.",
  },
  {
    label: "Queue Health",
    status: "warning",
    value: "5.2 days",
    description: "Avg time in pending queue",
    tooltip: "Average age of pending conflicts. Target: <3 days. Items older than 7 days are flagged as stale.",
  },
  {
    label: "Sync Coverage",
    status: "healthy",
    value: "94.2%",
    description: "Web sources synced <24h",
    tooltip: "Percentage of web sources that have synced within the last 24 hours. Target: >90%.",
  },
  {
    label: "Analysis Health",
    status: "healthy",
    value: "99.1%",
    description: "Successful analysis runs",
    tooltip: "Percentage of analysis runs that completed without errors. Target: >98%.",
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
              System Health
              <InfoTooltip content="Quick overview of key system metrics. Green indicates healthy, yellow needs attention, red requires immediate action." />
            </CardTitle>
            <CardDescription className="text-sm">
              Real-time status indicators
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
